import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/schemas/country.schema';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountriesService {
  constructor(@InjectModel(Country.name) private countryModel: Model<Country>) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    const createdCountry = new this.countryModel(dto);
    return createdCountry.save();
  }

  async findById(id: string): Promise<Country | null> {
    return this.countryModel.findById(id).exec();
  }
}
