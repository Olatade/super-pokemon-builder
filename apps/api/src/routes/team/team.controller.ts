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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddPokemonToTeamDto } from './dto/add-pokemon.dto';
import { RolesGuard } from '../../libs/guards/roles.guard';
import { Roles } from '../../libs/decorators/roles.decorator';
import { AuthenticatedRequest } from '../../libs/guards/auth.guard';

@Controller('team')
@UseGuards(RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @Roles('admin', 'user')
  async getTeams(
    @Req() req: AuthenticatedRequest,
    @Query() query: Record<string, string>
  ) {
    return await this.teamService.getTeams(req.user, query);
  }

  @Post()
  @Roles('admin', 'user')
  async createTeam(
    @Req() req: AuthenticatedRequest,
    @Body() createTeamDto: CreateTeamDto
  ) {
    let profileIdToUse: string;

    // admins must provide profile ids when creating teams because admins are not allowed to have teams
    if (req.user.role === 'admin') {
      // throw error if admin does not provide profile id
      if (!createTeamDto.profile_id) {
        throw new BadRequestException(
          'Admin must provide a profile_id to create a team.'
        );
      }
      // throw error if admin provides their own profile id
      if (createTeamDto.profile_id === req.user.id) {
        throw new BadRequestException(
          'Admins cannot create teams for themselves.'
        );
      }
      profileIdToUse = createTeamDto.profile_id;
    } else {
      // Regular user
      profileIdToUse = req.user.id;
      // Ensure regular users cannot override their profile_id
      if (
        createTeamDto.profile_id &&
        createTeamDto.profile_id !== req.user.id
      ) {
        throw new BadRequestException(
          'Users can only create teams for themselves.'
        );
      }
    }
    return await this.teamService.createTeam(profileIdToUse, createTeamDto);
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
    @Body() addPokemonDto: AddPokemonToTeamDto
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
