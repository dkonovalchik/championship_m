import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsString()
  hostId: string;

  @IsNotEmpty()
  @IsString()
  guestId: string;

  @IsNotEmpty()
  @IsNumber()
  hostScore: number;

  @IsNotEmpty()
  @IsNumber()
  guestScore: number;
}
