import { Inject, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {}

  async create(dto: CreateGameDto) {
    const newGame = {
      id: uuid(),
      ...dto,
    };

    await this.db.collection('games').insertOne(newGame);

    return newGame;
  }

  async findById(id: string) {
    return await this.db.collection('games').findOne({ id });
  }

  async updateById(id: string, dto: UpdateGameDto) {
    const updateResult = await this.db
      .collection('games')
      .findOneAndUpdate({ id }, { $set: dto }, { returnDocument: 'after' });
    return updateResult.value;
  }

  async deleteById(id: string) {
    const deleteResult = await this.db.collection('games').findOneAndDelete({ id });
    return deleteResult.value;
  }
}
