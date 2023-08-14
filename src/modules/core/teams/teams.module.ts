import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, MongodbProvider],
})
export class TeamsModule {}
