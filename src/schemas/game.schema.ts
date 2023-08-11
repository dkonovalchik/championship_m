import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'games' })
export class Game {
  @Prop()
  name: string;

  @Prop()
  periodCount: number;

  @Prop()
  periodLength: number;
}

export type GameDocument = HydratedDocument<Game>;

export const GameSchema = SchemaFactory.createForClass(Game);
