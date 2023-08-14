import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

@Module({
  controllers: [GamesController],
  providers: [GamesService, MongodbProvider],
})
export class GamesModule {}
