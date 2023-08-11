import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Country } from './country.schema';

@Schema({ collection: 'cities' })
export class City {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name })
  country: Country;
}

export type CityDocument = mongoose.HydratedDocument<City>;

export const CitySchema = SchemaFactory.createForClass(City);
