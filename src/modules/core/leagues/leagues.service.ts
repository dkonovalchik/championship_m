import { Inject, Injectable } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { v4 as uuid } from 'uuid';
import { Collection, Db, Document } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { RecordNotFound } from 'src/lib/exceptions';

@Injectable()
export class LeaguesService {
  private readonly leaguesCollection: Collection<Document>;

  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {
    this.leaguesCollection = this.db.collection('leagues');
  }

  async create(dto: CreateLeagueDto) {
    const newLeague = {
      id: uuid(),
      ...dto,
    };

    await this.leaguesCollection.insertOne(newLeague);

    return newLeague;
  }

  async findById(id: string) {
    const league = await this.leaguesCollection.findOne({ id });
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

  async updateById(id: string, dto: UpdateLeagueDto) {
    const league = await this.leaguesCollection.findOne({ id });
    if (!league) {
      return null;
    }

    if (dto.gameId) {
      const game = await this.db.collection('games').findOne({ id: dto.gameId });
      if (!game) {
        throw new RecordNotFound();
      }
    }

    if (dto.countryId) {
      const country = await this.db.collection('countries').findOne({ id: dto.countryId });
      if (!country) {
        throw new RecordNotFound();
      }
    }

    const updateResult = await this.leaguesCollection.findOneAndUpdate(
      { id },
      { $set: dto },
      { returnDocument: 'after' }
    );
    return updateResult.value;
  }

  async deleteById(id: string) {
    const deleteResult = await this.leaguesCollection.findOneAndDelete({ id });
    return deleteResult.value;
  }
}
