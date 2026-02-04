import { beforeEach, describe, expect, it } from 'vitest';
import { userService } from '../../../src/api/user/user.service';

describe('UserService', () => {
  beforeEach(() => {
    userService._clear();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = { email: 'test@example.com', name: 'Test User' };

      const response = await userService.create(dto);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.email).toBe(dto.email);
      expect(response.data.name).toBe(dto.name);
      expect(response.data.createdAt).toBeInstanceOf(Date);
      expect(response.data.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw ConflictError for duplicate email', async () => {
      const dto = { email: 'test@example.com', name: 'Test User' };
      await userService.create(dto);

      await expect(userService.create(dto)).rejects.toThrow('already exists');
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const createdResponse = await userService.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      const foundResponse = await userService.findById(createdResponse.data.id);

      expect(foundResponse.success).toBe(true);
      expect(foundResponse.data.id).toEqual(createdResponse.data.id);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(userService.findById('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
        'not found'
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      // Create 5 users
      for (let i = 0; i < 5; i++) {
        await userService.create({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
      }

      const result = await userService.findAll(1, 3);

      expect(result.success).toBe(true);
      expect(result.data.users).toHaveLength(3);
      expect(result.data.total).toBe(5);
    });

    it('should return empty array when no users', async () => {
      const result = await userService.findAll();

      expect(result.success).toBe(true);
      expect(result.data.users).toHaveLength(0);
      expect(result.data.total).toBe(0);
    });
  });

  describe('update', () => {
    it('should update user fields', async () => {
      const createdResponse = await userService.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      const updatedResponse = await userService.update(createdResponse.data.id, {
        name: 'Updated Name',
      });

      expect(updatedResponse.success).toBe(true);
      expect(updatedResponse.data.name).toBe('Updated Name');
      expect(updatedResponse.data.email).toBe(createdResponse.data.email);
      expect(updatedResponse.data.updatedAt.getTime()).toBeGreaterThanOrEqual(
        createdResponse.data.updatedAt.getTime()
      );
    });

    it('should throw ConflictError when updating to existing email', async () => {
      await userService.create({ email: 'existing@example.com', name: 'Existing' });
      const userResponse = await userService.create({ email: 'test@example.com', name: 'Test' });

      await expect(
        userService.update(userResponse.data.id, { email: 'existing@example.com' })
      ).rejects.toThrow('already exists');
    });
  });

  describe('delete', () => {
    it('should delete existing user', async () => {
      const createdResponse = await userService.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      const deleteResponse = await userService.delete(createdResponse.data.id);
      expect(deleteResponse.success).toBe(true);

      await expect(userService.findById(createdResponse.data.id)).rejects.toThrow('not found');
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(userService.delete('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
        'not found'
      );
    });
  });
});
