import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { RecordNotFound } from 'src/lib/exceptions';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('create')
  async create(@Body() dto: CreateGameDto) {
    return await this.gamesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const foundGame = await this.gamesService.findById(id);
    if (!foundGame) {
      throw new RecordNotFound();
    }
    return foundGame;
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    console.log('updateById - id:', id, ', dto:', dto);
    const updatedGame = await this.gamesService.updateById(id, dto);
    if (!updatedGame) {
      throw new RecordNotFound();
    }
    return updatedGame;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const deletedGame = await this.gamesService.deleteById(id);
    if (!deletedGame) {
      throw new RecordNotFound();
    }
    return deletedGame;
  }
}
