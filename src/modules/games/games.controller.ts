import { Body, Controller, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('create')
  createGame(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }
}
