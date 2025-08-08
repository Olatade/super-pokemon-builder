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
} from '@nestjs/common';
import { RolesGuard } from '../../libs/guards/roles.guard';
import { Roles } from '../../libs/decorators/roles.decorator';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
@UseGuards(RolesGuard)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @Roles('admin', 'user')
  findAll(@Query() query: Record<string, string>) {
    return this.pokemonService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'user')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
