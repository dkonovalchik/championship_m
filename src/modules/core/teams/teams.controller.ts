import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('create')
  async create(@Body() dto: CreateTeamDto) {
    return await this.teamsService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.teamsService.findById(id);
  }
}
