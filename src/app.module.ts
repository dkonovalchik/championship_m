import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './modules/core/games/games.module';
import { CountriesModule } from './modules/core/countries/countries.module';
import { LeaguesModule } from './modules/core/leagues/leagues.module';
import { CitiesModule } from './modules/core/cities/cities.module';
import { TeamsModule } from './modules/core/teams/teams.module';
import { MatchesModule } from './modules/core/matches/matches.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CitiesModule,
    CountriesModule,
    GamesModule,
    LeaguesModule,
    MatchesModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
