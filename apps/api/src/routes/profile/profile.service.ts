import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { QueryParams } from '../../libs/database/abstract.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly profilesRepo: ProfileRepository) {}

  async create(dto: CreateProfileDto) {
    return this.profilesRepo.create(dto);
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
}
