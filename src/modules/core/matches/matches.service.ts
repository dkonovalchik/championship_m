import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateMatchDto } from './dto/create-match.dto';
import { Db } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';

@Injectable()
export class MatchesService {
  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {}

  async create(dto: CreateMatchDto) {
    const newMatch = {
      id: uuid(),
      ...dto,
    };

    await this.db.collection('matches').insertOne(newMatch);

    return newMatch;
  }

  async findById(id: string) {
    const match = await this.db.collection('matches').findOne({ id });
    if (!match) {
      return null;
    }

    const host = await this.db.collection('teams').findOne({ id: match.hostId });
    if (host) {
      match.host = host;
    }

    const guest = await this.db.collection('teams').findOne({ id: match.guestId });
    if (guest) {
      match.guest = guest;
    }

    return match;
  }
}
