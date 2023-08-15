import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { Db } from 'mongodb';

describe('GamesController', () => {
  let controller: GamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        GamesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
