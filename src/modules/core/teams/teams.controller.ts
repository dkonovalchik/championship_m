import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { RecordNotFound } from '../../../lib/exceptions';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('create')
  async create(@Body() dto: CreateTeamDto) {
    return await this.teamsService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const foundTeam = await this.teamsService.findById(id);
    if (!foundTeam) {
      throw new RecordNotFound();
    }
    return foundTeam;
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    const updatedTeam = await this.teamsService.updateById(id, dto);
    if (!updatedTeam) {
      throw new RecordNotFound();
    }
    return updatedTeam;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const deletedTeam = await this.teamsService.deleteById(id);
    if (!deletedTeam) {
      throw new RecordNotFound();
    }
    return deletedTeam;
  }
}
