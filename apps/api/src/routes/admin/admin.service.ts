import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams } from '../../libs/database/abstract.repository';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  getStats() {
    return this.adminRepository.getStats();
  }
}
