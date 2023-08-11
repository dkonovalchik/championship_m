import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from 'src/schemas/game.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async create(dto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(dto);
    return createdGame.save();
  }

  async findById(id: string): Promise<Game | null> {
    return this.gameModel.findById(id).exec();
  }
}
