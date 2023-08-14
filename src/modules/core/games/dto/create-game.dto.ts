import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  periodCount: number;

  @IsNotEmpty()
  @IsInt()
  periodLength: number;
}
