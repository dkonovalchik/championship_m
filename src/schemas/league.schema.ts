import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Country } from './country.schema';
import { Game } from './game.schema';

@Schema({ collection: 'leagues' })
export class League {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Game.name })
  game: Game;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  country: Country;
}

export type LeagueDocument = mongoose.HydratedDocument<League>;

export const LeagueSchema = SchemaFactory.createForClass(League);
