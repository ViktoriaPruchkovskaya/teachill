import * as userRepository from '../repositories/users';
import { getMembershipById } from '../repositories/groups';
import { PasswordService } from './password';
import { JWTService } from './jwt';
import { ExistError, InvalidCredentialsError, NotFoundError } from '../errors';

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

export class UserService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
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
      throw new InvalidCredentialsError('Current password is incorrect');
    }

    const newPasswordHash = await this.passwordService.hashPassword(newPassword);
    await userRepository.changePassword(username, newPasswordHash);
  }

  public async changeRole(userId: number, roleType: RoleType, groupId: number): Promise<void> {
    const membership = await getMembershipById(userId, groupId);
    if (!membership) {
      throw new NotFoundError('User or group is not found');
    }
    await userRepository.changeRole(userId, roleType);
  }

  public async updateUser(username: string, info: UpdateInformation) {
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
    const user = await userRepository.getUserByUsername(username);
    if (user) {
      throw new ExistError('Username already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(password);
    const userId = await userRepository.createUser(username, passwordHash, fullName);
    await this.createUserRole(userId, RoleType[RoleType[role]]);
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
