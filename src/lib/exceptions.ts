import { HttpException, HttpStatus } from '@nestjs/common';

export class RecordNotFound extends HttpException {
  constructor() {
    super('Error code 1001 - Record not found', HttpStatus.NOT_FOUND);
  }
}

export class RecordAlreadyInDb extends HttpException {
  constructor() {
    super(
      'Error code 1002 - Record already presents in database',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export class CannotDeleteRecordWithChildren extends HttpException {
  constructor() {
    super('Error code 1003 - Cannot delete record because it has children', HttpStatus.NOT_FOUND);
  }
}
