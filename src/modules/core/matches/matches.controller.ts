import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('create')
  async create(@Body() dto: CreateMatchDto) {
    return await this.matchesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.matchesService.findById(id);
  }
}
