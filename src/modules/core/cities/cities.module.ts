import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService, MongodbProvider],
})
export class CitiesModule {}
