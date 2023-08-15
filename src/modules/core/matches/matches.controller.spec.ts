import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        MatchesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
