import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post('create')
  async create(@Body() dto: CreateCityDto) {
    return await this.citiesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.citiesService.findById(id);
  }
}
