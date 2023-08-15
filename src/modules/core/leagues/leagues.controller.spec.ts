import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';

describe('LeaguesController', () => {
  let controller: LeaguesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaguesController],
      providers: [
        LeaguesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    controller = module.get<LeaguesController>(LeaguesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
