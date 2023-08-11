import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { City } from 'src/schemas/city.schema';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

  async create(dto: CreateCityDto): Promise<City> {
    console.log('CitiesService.create = dto:', dto);

    const createdCity = new this.cityModel({
      name: dto.name,
      country: new Types.ObjectId(dto.countryId),
    });

    return createdCity.save();
  }

  async findById(id: string): Promise<City | null> {
    return this.cityModel.findById(id).populate(['country']).exec();
  }
}
