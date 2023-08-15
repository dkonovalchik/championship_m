import { Inject, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { v4 as uuid } from 'uuid';
import { Collection, Db, Document } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { UpdateCityDto } from './dto/update-city.dto';
import { CannotDeleteRecordWithChildren, RecordNotFound } from 'src/lib/exceptions';

@Injectable()
export class CitiesService {
  private readonly citiesCollection: Collection<Document>;

  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {
    this.citiesCollection = this.db.collection('cities');
  }

  async create(dto: CreateCityDto) {
    const newCity = {
      id: uuid(),
      ...dto,
    };

    await this.citiesCollection.insertOne(newCity);

    return newCity;
  }

  async findById(id: string) {
    const city = await this.citiesCollection.findOne({ id });
    if (!city) {
      return null;
    }

    const country = await this.db.collection('countries').findOne({ id: city.countryId });
    if (country) {
      city.country = country;
    }

    return city;
  }

  async updateById(id: string, dto: UpdateCityDto) {
    const city = await this.citiesCollection.findOne({ id });
    if (!city) {
      return null;
    }

    if (dto.countryId) {
      const country = await this.db.collection('countries').findOne({ id: dto.countryId });
      if (!country) {
        throw new RecordNotFound();
      }
    }

    const updateResult = await this.citiesCollection.findOneAndUpdate(
      { id },
      { $set: dto },
      { returnDocument: 'after' }
    );
    return updateResult.value;
  }

  async deleteById(id: string) {
    const city = await this.citiesCollection.findOne({ id });
    if (!city) {
      return null;
    }

    const childTeam = await this.db.collection('teams').findOne({ cityId: id });
    if (childTeam) {
      throw new CannotDeleteRecordWithChildren();
    }

    const deleteResult = await this.citiesCollection.findOneAndDelete({ id });
    return deleteResult.value;
  }
}
