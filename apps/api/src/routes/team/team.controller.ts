import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddPokemonDto } from './dto/add-pokemon.dto';
import { Profile } from '../../libs/database/entities/profile.entity';
import { RolesGuard } from '../../libs/guards/roles.guard';
import { Roles } from '../../libs/decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
  user: Profile;
}

@Controller('team')
@UseGuards(RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @Roles('admin', 'user')
  async getTeams(@Req() req: AuthenticatedRequest) {
    const profileId = req.user.id;
    return await this.teamService.getTeamsByProfileId(profileId);
  }

  @Post()
  @Roles('admin', 'user')
  async createTeam(
    @Req() req: AuthenticatedRequest,
    @Body() createTeamDto: CreateTeamDto
  ) {
    const profileId = req.user.id;
    return await this.teamService.createTeam(profileId, createTeamDto);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getTeamById(
    @Req() req: AuthenticatedRequest,
    @Param('id') teamId: string
  ) {
    return await this.teamService.getTeamById(req.user, teamId);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  async updateTeam(
    @Req() req: AuthenticatedRequest,
    @Param('id') teamId: string,
    @Body() updateTeamDto: UpdateTeamDto
  ) {
    return await this.teamService.updateTeam(req.user, teamId, updateTeamDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'user')
  async deleteTeam(
    @Req() req: AuthenticatedRequest,
    @Param('id') teamId: string
  ) {
    await this.teamService.deleteTeam(req.user, teamId);
  }

  @Get(':teamId/pokemon')
  @Roles('admin', 'user')
  async getPokemonsInTeam(
    @Req() req: AuthenticatedRequest,
    @Param('teamId') teamId: string
  ) {
    return await this.teamService.getPokemonsInTeam(req.user, teamId);
  }

  @Post(':teamId/pokemon')
  @Roles('admin', 'user')
  async addPokemonToTeam(
    @Req() req: AuthenticatedRequest,
    @Param('teamId') teamId: string,
    @Body() addPokemonDto: AddPokemonDto
  ) {
    return await this.teamService.addPokemonToTeam(
      req.user,
      teamId,
      addPokemonDto
    );
  }

  @Delete(':teamId/pokemon/:pokemonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin', 'user')
  async removePokemonFromTeam(
    @Req() req: AuthenticatedRequest,
    @Param('teamId') teamId: string,
    @Param('pokemonId') pokemonId: string
  ) {
    await this.teamService.removePokemonFromTeam(req.user, teamId, pokemonId);
  }
}
