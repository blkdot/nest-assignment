import { IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}