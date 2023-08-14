import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

describe('GamesService', () => {
  let service: GamesService;

  const TEST_GAME = {
    name: 'Basketball',
    periodCount: 4,
    periodLength: 15,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService, MongodbProvider],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new game and return it', async () => {
    const createdGame = await service.create(TEST_GAME);

    expect(createdGame).not.toBeNull();
    expect(createdGame.id).toBeDefined();
    expect(createdGame.name).toBe(TEST_GAME.name);
    expect(createdGame.periodCount).toBe(TEST_GAME.periodCount);
    expect(createdGame.periodLength).toBe(TEST_GAME.periodLength);
  });

  it('should find game by id and return it', async () => {
    const gameInDb = await service.create(TEST_GAME);

    const foundGame = await service.findById(gameInDb.id);

    expect(foundGame).not.toBeNull();
    expect(foundGame.id).toBe(gameInDb.id);
    expect(foundGame.name).toBe(gameInDb.name);
    expect(foundGame.periodCount).toBe(gameInDb.periodCount);
    expect(foundGame.periodLength).toBe(gameInDb.periodLength);
  });
});
