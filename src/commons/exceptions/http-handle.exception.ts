import { BadRequestException } from '@/application/exceptions/bad-request.exception';
import { ConflictResourceException } from '@/application/exceptions/conflict-resource.exception';
import { ResourceNotFoundException } from '@/application/exceptions/resource-not-found.exception';
import { HttpException, HttpStatus } from '@nestjs/common';

export function HttpHandleException(ex: Error) {
  switch (ex.constructor) {
    case ConflictResourceException:
      throw new HttpException(ex.message, HttpStatus.CONFLICT);

    case ResourceNotFoundException:
      throw new HttpException(ex.message, HttpStatus.NOT_FOUND);

    case BadRequestException:
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);

    default:
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
  }
}
