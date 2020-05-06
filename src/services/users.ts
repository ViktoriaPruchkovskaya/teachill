import * as userRepository from '../repositories/users';
import { getMembershipById } from '../repositories/groups';
import { PasswordService } from './password';
import { JWTService } from './jwt';
import { GroupService, Group } from './groups';
import * as errorTypes from '../errors';

export enum RoleType {
  Administrator = 1,
  Member = 2,
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: RoleType;
}

interface UpdateInformation {
  fullName?: string;
}

interface SignupData {
  username: string;
  password: string;
  fullName: string;
  role: number;
}

export class UserService {
  private passwordService: PasswordService;
  private groupService: GroupService;

  constructor() {
    this.passwordService = new PasswordService();
    this.groupService = new GroupService();
  }

  public async getUsers(): Promise<User[]> {
    const users = await userRepository.getUsers();

    return users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: RoleType[user.role],
    }));
  }

  public async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.getUserByUsername(username);

    const isPasswordCorrect = await this.passwordService.comparePasswords(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new errorTypes.InvalidCredentialsError('Current password is incorrect');
    }

    const newPasswordHash = await this.passwordService.hashPassword(newPassword);
    await userRepository.changePassword(username, newPasswordHash);
  }

  /**
   * Change role of a user
   * @param currentUser - User that is performing change role action.
   * @param targetUserId - User ID of entity that change role.
   * @param roleType - Type of role that are going to be applied to user.
   **/
  public async changeRole(
    currentUser: User,
    targetUserId: number,
    roleType: RoleType
  ): Promise<void> {
    if (currentUser.id == targetUserId) {
      throw new errorTypes.ChangeError('Administrator cannot change his own role');
    }
    await this.getGroupIfCommon(currentUser.id, targetUserId);

    await userRepository.changeRole(targetUserId, roleType);
  }

  public async deleteUserById(user: User, userIdForDelete: number): Promise<void> {
    const group = await this.getGroupIfCommon(user.id, userIdForDelete);
    const groupMembers = await this.groupService.getGroupMembers(group.id);

    if (
      user.role === RoleType.Administrator &&
      user.id == userIdForDelete &&
      groupMembers.filter(member => member.role === user.role).length < 2
    ) {
      throw new errorTypes.DeleteError('You cannot perform deleting');
    }
    if (user.role === RoleType.Member && user.id != userIdForDelete) {
      throw new errorTypes.DeleteError('You cannot delete other users');
    }

    await userRepository.deleteById(userIdForDelete);
  }

  public async updateUser(username: string, info: UpdateInformation): Promise<void> {
    const dbUser = await userRepository.getUserByUsername(username);
    const user: User = {
      id: dbUser.id,
      username: dbUser.username,
      fullName: dbUser.fullName,
      role: RoleType[dbUser.role],
    };

    for (const key in info) {
      user[key] = info[key];
    }

    await userRepository.updateUser(username, user);
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      throw new errorTypes.NotFoundError('User does not exist');
    }
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: RoleType[user.role],
    };
  }

  private async getGroupIfCommon(userIdA: number, userIdB: number): Promise<Group> {
    const membershipA = await getMembershipById(userIdA);
    const membershipB = await getMembershipById(userIdB);
    if (!membershipA || membershipA.id !== membershipB.id) {
      throw new errorTypes.GroupMismatchError('Groups do not match');
    }
    return membershipA;
  }
}

export class SignupService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  public async doSignup(userInfo: SignupData): Promise<number> {
    const user = await userRepository.getUserByUsername(userInfo.username);
    if (user) {
      throw new errorTypes.ExistError('Username already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(userInfo.password);
    const userId = await userRepository.createUser(
      userInfo.username,
      passwordHash,
      userInfo.fullName
    );
    await this.createUserRole(userId, RoleType[RoleType[userInfo.role]]);
    return userId;
  }

  private async createUserRole(userId: number, roleType: RoleType): Promise<void> {
    await userRepository.createUserRole(userId, roleType);
  }
}

export class SigninService {
  private passwordService: PasswordService;
  private jwtService: JWTService;

  constructor() {
    this.passwordService = new PasswordService();
    this.jwtService = new JWTService();
  }
  public async doSignin(username: string, password: string): Promise<string> {
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      throw new errorTypes.InvalidCredentialsError('Username is incorrect');
    }
    const isPasswordCorrect = await this.passwordService.comparePasswords(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new errorTypes.InvalidCredentialsError('Password is incorrect');
    }
    return this.jwtService.getToken(username);
  }
}
