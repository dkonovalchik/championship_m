import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { League } from 'src/schemas/league.schema';
import { CreateLeagueDto } from './dto/create-league.dto';

@Injectable()
export class LeaguesService {
  constructor(@InjectModel(League.name) private leagueModel: Model<League>) {}

  async create(dto: CreateLeagueDto): Promise<League> {
    console.log('LeaguesService.create = dto:', dto);

    const createdLeague = new this.leagueModel({
      name: dto.name,
      game: new Types.ObjectId(dto.gameId),
      country: new Types.ObjectId(dto.countryId),
    });

    return createdLeague.save();
  }

  async findById(id: string): Promise<League | null> {
    return this.leagueModel.findById(id).populate(['game', 'country']).exec();
  }
}
