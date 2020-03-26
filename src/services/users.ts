import {
  createUser,
  getUserByUsername,
  createUserRole,
  changePassword,
  changeRole,
  getUsers,
  deleteById,
} from '../repositories/users';
import { getMembershipById } from '../repositories/groups';
import { PasswordService } from './password';
import { JWTService } from './jwt';
import { GroupService } from './groups';
import { ExistError, InvalidCredentialsError, NotFoundError, PerformingError } from '../errors';

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

interface UserRoleData {
  userId: number;
  roleId: number;
}

export class UserService {
  private passwordService: PasswordService;
  private groupService: GroupService;

  constructor() {
    this.passwordService = new PasswordService();
    this.groupService = new GroupService();
  }

  public async getUsers(): Promise<User[]> {
    const users = await getUsers();

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
    const user = await getUserByUsername(username);

    const isPasswordCorrect = await this.passwordService.comparePasswords(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Current password is incorrect');
    }

    const newPasswordHash = await this.passwordService.hashPassword(newPassword);
    await changePassword(username, newPasswordHash);
  }

  public async changeRole(user: User, userId: number, roleType: RoleType): Promise<void> {
    if (user.id === userId) {
      throw new PerformingError('Administrator cannot change his own role');
    }
    const userMembership = await getMembershipById(user.id);
    const userMembershipForChangeRole = await getMembershipById(userId);
    if (!userMembership || userMembership != userMembershipForChangeRole) {
      throw new NotFoundError('User or group is not found');
    }

    await changeRole(userId, roleType);
  }

  public async deleteUserById(user: User, userIdForDelete: number): Promise<void> {
    const userMembership = await getMembershipById(user.id);
    const userMembershipForDelete = await getMembershipById(userIdForDelete);
    if (userMembership != userMembershipForDelete) {
      throw new NotFoundError('User is not found');
    }

    const groupMembers = await this.groupService.getGroupMembers(userMembership);
    if (
      (user.role === RoleType.Administrator &&
        user.id == userIdForDelete &&
        groupMembers.filter(member => member.role === user.role).length < 2) ||
      (user.role === RoleType.Member && user.id != userIdForDelete)
    ) {
      throw new PerformingError('You cannot perform deleting');
    }

    await deleteById(userIdForDelete);
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new NotFoundError('User does not exist');
    }
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: RoleType[user.role],
    };
  }
}

export class SignupService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  public async doSignup(
    username: string,
    password: string,
    fullName: string,
    role: number
  ): Promise<number> {
    const user = await getUserByUsername(username);
    if (user) {
      throw new ExistError('Username already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(password);
    const userId = await createUser(username, passwordHash, fullName);
    await this.createUserRole(userId, RoleType[RoleType[role]]);
    return userId;
  }

  private async createUserRole(userId: number, roleType: RoleType): Promise<void> {
    await createUserRole(userId, roleType);
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
    const user = await getUserByUsername(username);
    if (!user) {
      throw new InvalidCredentialsError('Username is incorrect');
    }
    const isPasswordCorrect = await this.passwordService.comparePasswords(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Password is incorrect');
    }
    return this.jwtService.getToken(username);
  }
}
