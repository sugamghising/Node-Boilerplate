import { randomUUID } from 'node:crypto';
import { ServiceResponse, throwConflict, throwNotFound } from '../../core/index';
import type { CreateUserDTO, UpdateUserDTO, User } from './user.types';

// In-memory store for demo purposes
// In production, replace with actual database
const users = new Map<string, User>();

interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

class UserService {
  async findAll(page = 1, limit = 10): Promise<ServiceResponse<PaginatedUsers>> {
    const allUsers = Array.from(users.values());
    const total = allUsers.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

    return ServiceResponse.success('Users retrieved successfully', {
      users: paginatedUsers,
      total,
      page,
      limit,
    });
  }

  async findById(id: string): Promise<ServiceResponse<User>> {
    const user = users.get(id);
    if (!user) {
      return throwNotFound(`User with ID ${id} not found`);
    }
    return ServiceResponse.success('User retrieved successfully', user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return Array.from(users.values()).find((u) => u.email === email);
  }

  async create(dto: CreateUserDTO): Promise<ServiceResponse<User>> {
    // Check for duplicate email
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      return throwConflict(`User with email ${dto.email} already exists`);
    }

    const now = new Date();
    const user: User = {
      id: randomUUID(),
      email: dto.email,
      name: dto.name,
      createdAt: now,
      updatedAt: now,
    };

    users.set(user.id, user);
    return ServiceResponse.created('User created successfully', user);
  }

  async update(id: string, dto: UpdateUserDTO): Promise<ServiceResponse<User>> {
    const user = users.get(id);
    if (!user) {
      return throwNotFound(`User with ID ${id} not found`);
    }

    // Check for email conflict if updating email
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.findByEmail(dto.email);
      if (existingUser) {
        return throwConflict(`User with email ${dto.email} already exists`);
      }
    }

    const updatedUser: User = {
      id: user.id,
      email: dto.email ?? user.email,
      name: dto.name ?? user.name,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    };

    users.set(id, updatedUser);
    return ServiceResponse.success('User updated successfully', updatedUser);
  }

  async delete(id: string): Promise<ServiceResponse<{ message: string }>> {
    const user = users.get(id);
    if (!user) {
      return throwNotFound(`User with ID ${id} not found`);
    }
    users.delete(id);
    return ServiceResponse.success('User deleted successfully', {
      message: 'User deleted successfully',
    });
  }

  // Utility method for testing
  _clear(): void {
    users.clear();
  }
}

export const userService = new UserService();
