import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { RolesGuard } from '../../libs/guards/roles.guard';
import { Roles } from '../../libs/decorators/roles.decorator';
import { Profile } from '../../libs/database/entities/profile.entity';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Roles('admin', 'user')
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto);
  }

  @Get()
  @Roles('admin')
  findAll(@Query() query: Record<string, string>) {
    return this.profileService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string, @Request() req) {
    const user: Profile = req.user;
    if (user.role === 'user' && user.id !== id) {
      throw new ForbiddenException('You can only view your own profile.');
    }
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @Request() req,
  ) {
    const user: Profile = req.user;
    if (user.role === 'user' && user.id !== id) {
      throw new ForbiddenException('You can only update your own profile.');
    }
    return this.profileService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  async remove(@Param('id') id: string, @Request() req) {
    const user: Profile = req.user;
    if (user.role === 'user' && user.id !== id) {
      throw new ForbiddenException('You can only delete your own profile.');
    }
    return this.profileService.remove(id);
  }
}
