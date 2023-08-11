import { Module } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { League, LeagueSchema } from 'src/schemas/league.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: League.name,
        schema: LeagueSchema,
      },
    ]),
  ],
  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export class LeaguesModule {}
