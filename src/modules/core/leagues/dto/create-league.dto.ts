import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLeagueDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  gameId: string;

  @IsNotEmpty()
  @IsString()
  countryId: string;
}
