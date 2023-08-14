import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, MongodbProvider],
})
export class MatchesModule {}
