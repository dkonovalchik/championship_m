import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { RecordNotFound } from 'src/lib/exceptions';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post('create')
  async create(@Body() dto: CreateCountryDto) {
    return await this.countriesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const foundCountry = await this.countriesService.findById(id);
    if (!foundCountry) {
      throw new RecordNotFound();
    }
    return foundCountry;
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    const updatedGame = await this.countriesService.updateById(id, dto);
    if (!updatedGame) {
      throw new RecordNotFound();
    }
    return updatedGame;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const deletedGame = await this.countriesService.deleteById(id);
    if (!deletedGame) {
      throw new RecordNotFound();
    }
    return deletedGame;
  }
}
