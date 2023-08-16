import { Inject, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { v4 as uuid } from 'uuid';
import { Db } from 'mongodb';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Collection, Document } from 'mongodb';
import { RecordNotFound } from '../../../lib/exceptions';

@Injectable()
export class TeamsService {
  private readonly teamsCollection: Collection<Document>;

  constructor(@Inject(MONGODB_CONNECTION) private readonly db: Db) {
    this.teamsCollection = db.collection('teams');
  }

  async create(dto: CreateTeamDto) {
    const newTeam = {
      id: uuid(),
      ...dto,
    };

    await this.teamsCollection.insertOne(newTeam);

    return newTeam;
  }

  async findById(id: string) {
    const team = await this.teamsCollection.findOne({ id });
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

  async updateById(id: string, dto: UpdateTeamDto) {
    const team = await this.teamsCollection.findOne({ id });
    if (!team) {
      return null;
    }

    if (dto.gameId) {
      const game = await this.db.collection('games').findOne({ id: dto.gameId });
      if (!game) {
        throw new RecordNotFound();
      }
    }

    if (dto.cityId) {
      const city = await this.db.collection('cities').findOne({ id: dto.cityId });
      if (!city) {
        throw new RecordNotFound();
      }
    }

    const updateResult = await this.teamsCollection.findOneAndUpdate(
      { id },
      { $set: dto },
      { returnDocument: 'after' }
    );
    return updateResult.value;
  }

  async deleteById(id: string) {
    const deleteResult = await this.teamsCollection.findOneAndDelete({ id });
    return deleteResult.value;
  }
}
