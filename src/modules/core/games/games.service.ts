import { Inject, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { UpdateGameDto } from './dto/update-game.dto';
import { CannotDeleteRecordWithChildren } from '../../../lib/exceptions';
import { Collection, Document } from 'mongodb';

@Injectable()
export class GamesService {
  private readonly gamesCollection: Collection<Document>;

  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {
    this.gamesCollection = this.db.collection('games');
  }

  async create(dto: CreateGameDto) {
    const newGame = {
      id: uuid(),
      ...dto,
    };

    await this.gamesCollection.insertOne(newGame);

    return newGame;
  }

  async findById(id: string) {
    return await this.gamesCollection.findOne({ id });
  }

  async updateById(id: string, dto: UpdateGameDto) {
    const updateResult = await this.gamesCollection.findOneAndUpdate(
      { id },
      { $set: dto },
      { returnDocument: 'after' }
    );
    return updateResult.value;
  }

  async deleteById(id: string) {
    const game = await this.gamesCollection.findOne({ id });
    if (!game) {
      return null;
    }

    const childLeague = await this.db.collection('leagues').findOne({ gameId: id });
    if (childLeague) {
      throw new CannotDeleteRecordWithChildren();
    }

    const childTeam = await this.db.collection('teams').findOne({ gameId: id });
    if (childTeam) {
      throw new CannotDeleteRecordWithChildren();
    }

    const deleteResult = await this.gamesCollection.findOneAndDelete({ id });
    return deleteResult.value;
  }
}
