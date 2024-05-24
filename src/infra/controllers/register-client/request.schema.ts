import { IsDateString, IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterClientRequestSchema {
  @IsString()
  nome: string;

  @IsString()
  cpf: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsDateString({ strict: true })
  dataDeNascimento: string;

  @IsString()
  genero: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  rendaMensal: number;
}
