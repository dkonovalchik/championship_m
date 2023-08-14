import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('create')
  async create(@Body() dto: CreateGameDto) {
    return await this.gamesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.gamesService.findById(id);
  }
}
