import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { RecordNotFound } from 'src/lib/exceptions';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post('create')
  async create(@Body() dto: CreateCityDto) {
    return await this.citiesService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const foundCity = await this.citiesService.findById(id);
    if (!foundCity) {
      throw new RecordNotFound();
    }
    return foundCity;
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    const updatedGame = await this.citiesService.updateById(id, dto);
    if (!updatedGame) {
      throw new RecordNotFound();
    }
    return updatedGame;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const deletedGame = await this.citiesService.deleteById(id);
    if (!deletedGame) {
      throw new RecordNotFound();
    }
    return deletedGame;
  }
}
