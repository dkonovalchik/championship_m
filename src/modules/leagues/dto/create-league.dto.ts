import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateLeagueDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  gameId: string;

  @IsNotEmpty()
  @IsMongoId()
  countryId: string;
}
