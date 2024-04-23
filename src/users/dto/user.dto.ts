import { IsInt, IsOptional, IsString } from "class-validator";

export class UserDto {
  @IsOptional()
  @IsInt()
  readonly id?: number;
  
  @IsOptional()
  @IsInt()
  readonly userId?: number;

  @IsOptional()
  @IsString()
  readonly username?: string;
}
