import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Country } from 'src/schemas/country.schema';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post('create')
  create(@Body() dto: CreateCountryDto) {
    return this.countriesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Country> {
    console.log('CountriesController.find - id:', id);
    return this.countriesService.findById(id);
  }
}
