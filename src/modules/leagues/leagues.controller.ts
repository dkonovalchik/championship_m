import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { League } from 'src/schemas/league.schema';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post('create')
  async create(@Body() dto: CreateLeagueDto): Promise<League> {
    return this.leaguesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<League> {
    console.log('LeaguesController.find - id:', id);
    return this.leaguesService.findById(id);
  }
}
