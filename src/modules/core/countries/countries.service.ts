import { Inject, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { v4 as uuid } from 'uuid';
import { Collection, Db, Document } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CannotDeleteRecordWithChildren } from 'src/lib/exceptions';

@Injectable()
export class CountriesService {
  private readonly countriesCollection: Collection<Document>;

  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {
    this.countriesCollection = this.db.collection('countries');
  }

  async create(dto: CreateCountryDto) {
    const newCountry = {
      id: uuid(),
      ...dto,
    };

    await this.countriesCollection.insertOne(newCountry);

    return newCountry;
  }

  async findById(id: string) {
    return await this.countriesCollection.findOne({ id });
  }

  async updateById(id: string, dto: UpdateCountryDto) {
    const updateResult = await this.countriesCollection.findOneAndUpdate(
      { id },
      { $set: dto },
      { returnDocument: 'after' }
    );
    return updateResult.value;
  }

  async deleteById(id: string) {
    const country = await this.countriesCollection.findOne({ id });
    if (!country) {
      return null;
    }

    const childLeague = await this.db.collection('leagues').findOne({ countryId: id });
    if (childLeague) {
      throw new CannotDeleteRecordWithChildren();
    }

    const childCity = await this.db.collection('cities').findOne({ countryId: id });
    if (childCity) {
      throw new CannotDeleteRecordWithChildren();
    }

    const deleteResult = await this.countriesCollection.findOneAndDelete({ id });
    return deleteResult.value;
  }
}
