import { Inject, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';

@Injectable()
export class CitiesService {
  constructor(@Inject('MONGODB_CONNECTION') private readonly db: Db) {}

  async create(dto: CreateCityDto) {
    console.log('CitiesService.create = dto:', dto);

    const newCity = {
      id: uuid(),
      ...dto,
    };

    await this.db.collection('cities').insertOne(newCity);

    return newCity;
  }

  async findById(id: string) {
    const city = await this.db.collection('cities').findOne({ id });
    if (!city) {
      return null;
    }

    const country = await this.db.collection('countries').findOne({ id: city.countryId });
    if (country) {
      city.country = country;
    }

    return city;
  }
}
