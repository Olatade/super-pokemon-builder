import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { QueryParams } from '../../libs/database/abstract.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(private readonly profilesRepo: ProfileRepository) {}

  async create(dto: CreateProfileDto) {
    try {
      return await this.profilesRepo.create(dto);
    } catch (error) {
      // provide custom error when a duplicate profile is created
      if (error instanceof QueryFailedError) {
        if (
          error.message.includes(
            'duplicate key value violates unique constraint "UQ_'
          )
        ) {
          throw new ConflictException('username or email exists');
        }
      }
      throw error; // Re-throw other errors
    }
  }

  async findAll(query: QueryParams) {
    return this.profilesRepo.findAll(query);
  }

  async findOne(id: string) {
    const profile = await this.profilesRepo.findById(id);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(id: string, dto: UpdateProfileDto) {
    await this.findOne(id); // throws if not found
    return this.profilesRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); // throws if not found
    return this.profilesRepo.delete(id);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.profilesRepo.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
