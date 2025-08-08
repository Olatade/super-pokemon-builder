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
import { Public } from '../../libs/decorators/public.decorator';
import { Profile } from '../../libs/database/entities/profile.entity';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { AuthenticatedRequest } from '../../libs/guards/auth.guard';

@Controller('profile')
@UseGuards(RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto);
  }

  @Get()
  @Roles('admin')
  findAll(@Query() query: Record<string, string>) {
    return this.profileService.findAll(query);
  }
  @Get('me')
  @Roles('admin', 'user')
  async findMe(@Request() req: AuthenticatedRequest) {
    return this.profileService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const user: Profile = req.user;
    // prevent a non-admin user from viewing other user profiles
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
    @Request() req: AuthenticatedRequest
  ) {
    const user: Profile = req.user;
    // prevent a non-admin user from updating other user's profile
    if (user.role === 'user' && user.id !== id) {
      throw new ForbiddenException('You can only update your own profile.');
    }
    return this.profileService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const user: Profile = req.user;
    // prevent a non-admin user from deleting other user's profile
    if (user.role === 'user' && user.id !== id) {
      throw new ForbiddenException('You can only delete your own profile.');
    }
    return this.profileService.remove(id);
  }
}
