import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';
import { MONGODB_CONNECTION } from 'src/lib/constants';

describe('GamesController', () => {
  let gamesController: GamesController;
  let gamesService: GamesService;

  const TEST_GAME = {
    id: 'abcde',
    name: 'Basketball',
    periodCount: 4,
    periodLength: 15,
  };

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

    gamesController = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(gamesController).toBeDefined();
  });

  it('should return created game', async () => {
    // arrange
    jest.spyOn(gamesService, 'create').mockResolvedValue(TEST_GAME);

    // act
    const result = await gamesService.create(TEST_GAME);

    //assert
    expect(result).toBe(TEST_GAME);
  });
});
