import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AbstractRepository } from '../../libs/database/abstract.repository';
import { Profile } from '../../libs/database/entities/profile.entity';
@Injectable()
export class ProfileRepository extends AbstractRepository<Profile> {
  constructor(dataSource: DataSource) {
    super(dataSource, Profile);
  }

  async findByUsername(username: string): Promise<Profile | undefined> {
    return this.repository.findOne({ where: { username } });
  }
}
