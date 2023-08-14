import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post('create')
  async create(@Body() dto: CreateCountryDto) {
    return await this.countriesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.countriesService.findById(id);
  }
}
