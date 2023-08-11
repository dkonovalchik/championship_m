import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  gameId: string;

  @IsNotEmpty()
  @IsMongoId()
  cityId: string;
}
