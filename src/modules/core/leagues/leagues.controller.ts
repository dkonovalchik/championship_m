import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { RecordNotFound } from '../../../lib/exceptions';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post('create')
  async create(@Body() dto: CreateLeagueDto) {
    return await this.leaguesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const foundLeague = await this.leaguesService.findById(id);
    if (!foundLeague) {
      throw new RecordNotFound();
    }
    return foundLeague;
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateLeagueDto) {
    const updatedGame = await this.leaguesService.updateById(id, dto);
    if (!updatedGame) {
      throw new RecordNotFound();
    }
    return updatedGame;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const deletedGame = await this.leaguesService.deleteById(id);
    if (!deletedGame) {
      throw new RecordNotFound();
    }
    return deletedGame;
  }
}
