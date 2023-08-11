import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from 'src/schemas/team.schema';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('create')
  async create(@Body() dto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Team> {
    console.log('TeamsController.find - id:', id);
    return this.teamsService.findById(id);
  }
}
