import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team } from 'src/schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  async create(dto: CreateTeamDto): Promise<Team> {
    console.log('TeamsService.create = dto:', dto);

    const createdTeam = new this.teamModel({
      name: dto.name,
      game: new Types.ObjectId(dto.gameId),
      city: new Types.ObjectId(dto.cityId),
    });

    return createdTeam.save();
  }

  async findById(id: string): Promise<Team | null> {
    return this.teamModel
      .findById(id)
      .populate([
        { path: 'game' },
        {
          path: 'city',
          populate: {
            path: 'country',
          },
        },
      ])
      .exec();
  }
}
