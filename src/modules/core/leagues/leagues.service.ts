import { Inject, Injectable } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';

@Injectable()
export class LeaguesService {
  constructor(@Inject('MONGODB_CONNECTION') private readonly db: Db) {}

  async create(dto: CreateLeagueDto) {
    console.log('LeaguesService.create = dto:', dto);

    const newLeague = {
      id: uuid(),
      ...dto,
    };

    await this.db.collection('leagues').insertOne(newLeague);

    return newLeague;
  }

  async findById(id: string) {
    const league = await this.db.collection('leagues').findOne({ id });
    if (!league) {
      return null;
    }

    const game = await this.db.collection('games').findOne({ id: league.gameId });
    if (game) {
      league.game = game;
    }

    const country = await this.db.collection('countries').findOne({ id: league.countryId });
    if (country) {
      league.country = country;
    }

    return league;
  }
}
