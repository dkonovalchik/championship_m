import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from 'src/schemas/game.schema';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('create')
  create(@Body() dto: CreateGameDto): Promise<Game> {
    return this.gamesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Game | null> {
    console.log('GamesController.find - id:', id);
    return this.gamesService.findById(id);
  }
}
