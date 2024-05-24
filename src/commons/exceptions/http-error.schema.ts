import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class HttpErrorSchema {
  @ApiProperty({ description: 'The http status code' })
  statusCode: number;

  @ApiProperty({ description: 'The error message' })
  message: string;
}

export class UnprocessableErrorSchema {
  @ApiProperty({ description: 'The messages of the error' })
  @Type(() => Array<string>)
  message: string[];

  @ApiProperty({ description: 'The error' })
  error: string;

  @ApiProperty({ description: 'The status code' })
  statusCode: number;
}
