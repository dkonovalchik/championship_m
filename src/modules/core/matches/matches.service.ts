import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateMatchDto } from './dto/create-match.dto';
import { Collection, Db, Document } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { UpdateMatchDto } from './dto/update-match.dto';
import { RecordNotFound } from 'src/lib/exceptions';

@Injectable()
export class MatchesService {
  private readonly matchesCollection: Collection<Document>;

  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {
    this.matchesCollection = this.db.collection('matches');
  }

  async create(dto: CreateMatchDto) {
    const newMatch = {
      id: uuid(),
      ...dto,
    };

    await this.matchesCollection.insertOne(newMatch);

    return newMatch;
  }

  async findById(id: string) {
    const match = await this.matchesCollection.findOne({ id });
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

  async updateById(id: string, dto: UpdateMatchDto) {
    const match = await this.matchesCollection.findOne({ id });
    if (!match) {
      return null;
    }

    if (dto.hostId) {
      const host = await this.db.collection('teams').findOne({ id: dto.hostId });
      if (!host) {
        throw new RecordNotFound();
      }
    }

    if (dto.guestId) {
      const guest = await this.db.collection('teams').findOne({ id: dto.guestId });
      if (!guest) {
        throw new RecordNotFound();
      }
    }

    const updateResult = await this.matchesCollection.findOneAndUpdate(
      { id },
      { $set: dto },
      { returnDocument: 'after' }
    );
    return updateResult.value;
  }

  async deleteById(id: string) {
    const deleteResult = await this.matchesCollection.findOneAndDelete({ id });
    return deleteResult.value;
  }
}
