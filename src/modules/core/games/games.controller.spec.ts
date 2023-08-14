import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';
import { GamesController } from './games.controller';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';

describe('GamesController', () => {
  let controller: GamesController;

  const TEST_GAME = {
    name: 'Basketball',
    periodCount: 4,
    periodLength: 15,
  };

  beforeEach(async () => {
    // const testMongoConnection = await getTestMongoConnection();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [GamesService, MongodbProvider],
    })
      .overrideProvider(MONGODB_CONNECTION)
      .useFactory({
        factory: testMongoConnectionFactory,
      })
      .compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new game and return it', async () => {
    const createdGame = await controller.create(TEST_GAME);

    expect(createdGame).not.toBeNull();
    expect(createdGame.id).toBeDefined();
    expect(createdGame.name).toBe(TEST_GAME.name);
    expect(createdGame.periodCount).toBe(TEST_GAME.periodCount);
    expect(createdGame.periodLength).toBe(TEST_GAME.periodLength);
  });

  it('should find game by id and return it', async () => {
    const gameInDb = await controller.create(TEST_GAME);

    const foundGame = await controller.findById(gameInDb.id);

    expect(foundGame).not.toBeNull();
    expect(foundGame.id).toBe(gameInDb.id);
    expect(foundGame.name).toBe(gameInDb.name);
    expect(foundGame.periodCount).toBe(gameInDb.periodCount);
    expect(foundGame.periodLength).toBe(gameInDb.periodLength);
  });
});
