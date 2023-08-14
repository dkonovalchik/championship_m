import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

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

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return await this.gamesService.updateById(id, dto);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    console.log('delete - id:', id);
    return await this.gamesService.deleteById(id);
  }
}
