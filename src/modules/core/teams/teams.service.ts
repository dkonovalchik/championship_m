import { Inject, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';

@Injectable()
export class TeamsService {
  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {}

  async create(dto: CreateTeamDto) {
    const newTeam = {
      id: uuid(),
      ...dto,
    };

    await this.db.collection('teams').insertOne(newTeam);

    return newTeam;
  }

  async findById(id: string) {
    const team = await this.db.collection('teams').findOne({ id });
    if (!team) {
      return null;
    }

    const game = await this.db.collection('games').findOne({ id: team.gameId });
    if (game) {
      team.game = game;
    }

    const city = await this.db.collection('cities').findOne({ id: team.cityId });
    if (city) {
      team.city = city;
    }

    return team;
  }
}
