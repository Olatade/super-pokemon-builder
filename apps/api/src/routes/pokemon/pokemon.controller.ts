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

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
@UseGuards(RolesGuard)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreatePokemonDto) {
    return this.pokemonService.create(dto);
  }

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

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdatePokemonDto) {
    return this.pokemonService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
