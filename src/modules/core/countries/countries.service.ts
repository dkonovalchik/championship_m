import { Inject, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';
import { MONGODB_CONNECTION } from '../../../lib/constants';

@Injectable()
export class CountriesService {
  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {}

  async create(dto: CreateCountryDto) {
    const newCountry = {
      id: uuid(),
      ...dto,
    };

    await this.db.collection('countries').insertOne(newCountry);

    return newCountry;
  }

  async findById(id: string) {
    return await this.db.collection('countries').findOne({ id });
  }
}
