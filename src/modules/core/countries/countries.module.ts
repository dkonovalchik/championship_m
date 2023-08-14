import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService, MongodbProvider],
})
export class CountriesModule {}
