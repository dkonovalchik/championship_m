import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Game } from './game.schema';
import { City } from './city.schema';

@Schema({ collection: 'teams' })
export class Team {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Game.name })
  game: Game;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: City.name })
  city: City;
}

export type TeamDocument = mongoose.HydratedDocument<Team>;

export const TeamSchema = SchemaFactory.createForClass(Team);
