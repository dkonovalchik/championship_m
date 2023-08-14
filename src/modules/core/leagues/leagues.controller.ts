import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post('create')
  async create(@Body() dto: CreateLeagueDto) {
    return await this.leaguesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.leaguesService.findById(id);
  }
}
