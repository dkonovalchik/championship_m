import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotFindRecordException extends HttpException {
  constructor() {
    super('Error code 1001', HttpStatus.NOT_ACCEPTABLE);
  }
}

export class RecordAlreadyInDb extends HttpException {
  constructor() {
    super('Error code 1002', HttpStatus.METHOD_NOT_ALLOWED);
  }
}
