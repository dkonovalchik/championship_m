import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';

describe('TeamsController', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        TeamsService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
