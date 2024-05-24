import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterClientRequestSchema {
  @IsString()
  @ApiProperty({ description: 'The name of the client' })
  nome: string;

  @IsString()
  @ApiProperty({ description: 'The CPF of the client' })
  cpf: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ description: 'The email of the client' })
  email: string;

  @IsDateString({ strict: true })
  @ApiProperty({ description: 'The birth date of the client' })
  dataDeNascimento: string;

  @IsString()
  @ApiProperty({ description: 'Gender of the client' })
  genero: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({ description: 'The monthly income of the client' })
  rendaMensal: number;
}
