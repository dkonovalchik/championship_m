import { Module } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

@Module({
  controllers: [LeaguesController],
  providers: [LeaguesService, MongodbProvider],
})
export class LeaguesModule {}
