import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';

describe('CitiesController', () => {
  let controller: CitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        CitiesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
