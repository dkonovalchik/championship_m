import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchesService } from './matches.service';
import { RecordNotFound } from 'src/lib/exceptions';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('create')
  async create(@Body() dto: CreateMatchDto) {
    return await this.matchesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const foundMatch = await this.matchesService.findById(id);
    if (!foundMatch) {
      throw new RecordNotFound();
    }
    return foundMatch;
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateMatchDto) {
    const updatedMatch = await this.matchesService.updateById(id, dto);
    if (!updatedMatch) {
      throw new RecordNotFound();
    }
    return updatedMatch;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const deletedMatch = await this.matchesService.deleteById(id);
    if (!deletedMatch) {
      throw new RecordNotFound();
    }
    return deletedMatch;
  }
}
