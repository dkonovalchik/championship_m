import { Inject, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';

@Injectable()
export class GamesService {
  constructor(@Inject('MONGODB_CONNECTION') private readonly db: Db) {}

  async create(dto: CreateGameDto) {
    console.log('GamesService.create = dto:', dto);

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
}
