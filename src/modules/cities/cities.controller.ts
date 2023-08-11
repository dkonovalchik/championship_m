import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from 'src/schemas/city.schema';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post('create')
  async create(@Body() dto: CreateCityDto): Promise<City> {
    return this.citiesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<City> {
    console.log('CitiesController.find - id:', id);
    return this.citiesService.findById(id);
  }
}
