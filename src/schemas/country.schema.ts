import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'countries' })
export class Country {
  @Prop()
  name: string;
}

export type CountryDocument = HydratedDocument<Country>;

export const CountrySchema = SchemaFactory.createForClass(Country);
