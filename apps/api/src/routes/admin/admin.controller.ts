import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { QueryParams } from '../../libs/database/abstract.repository';
import { AdminService } from './admin.service';
import { RolesGuard } from '../../libs/guards/roles.guard';
import { Roles } from '../../libs/decorators/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles('admin')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('teams')
  @Roles('admin')
  getTeams(@Query() query: QueryParams) {
    return this.adminService.getAllTeams(query);
  }
}
