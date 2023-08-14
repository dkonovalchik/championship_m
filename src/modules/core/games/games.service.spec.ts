import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { Db } from 'mongodb';

describe('GamesService', () => {
  let service: GamesService;
  let db: Db;
  let gamesCollection;

  const TEST_GAME = {
    name: 'Basketball',
    periodCount: 4,
    periodLength: 15,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService, MongodbProvider],
    })
      .overrideProvider(MONGODB_CONNECTION)
      .useFactory({
        factory: testMongoConnectionFactory,
      })
      .compile();

    service = module.get<GamesService>(GamesService);
    db = module.get<Db>(MONGODB_CONNECTION);
    gamesCollection = db.collection('games');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new game and return it', async () => {
    // call
    const createResult = await service.create(TEST_GAME);

    // check
    expect(createResult).not.toBeNull();
    expect(createResult.id).toBeDefined();
    expect(createResult).toMatchObject(TEST_GAME);

    const gameInDb = await gamesCollection.findOne({ id: createResult.id });
    expect(gameInDb.id).toBeDefined();
    expect(gameInDb).toMatchObject(TEST_GAME);
  });

  it('should find game by id and return it', async () => {
    // prepare
    const insertResult = await gamesCollection.insertOne(TEST_GAME);
    const insertedGame = await gamesCollection.findOne({ _id: insertResult.insertedId });

    // call
    const findResult = await service.findById(insertedGame.id);

    // check
    expect(findResult).not.toBeNull();
    expect(findResult).toMatchObject(TEST_GAME);
  });

  it('should delete game by id and return it', async () => {
    // prepare
    const insertResult = await gamesCollection.insertOne(TEST_GAME);
    const insertedGame = await gamesCollection.findOne({ _id: insertResult.insertedId });

    // call
    const deleteResult = await service.deleteById(insertedGame.id);

    // check
    expect(deleteResult).not.toBeNull();
    expect(deleteResult.id).toBe(insertedGame.id);
    expect(deleteResult).toMatchObject(TEST_GAME);

    const nonDeletedGame = await gamesCollection.findOne({ _id: insertedGame._id });
    expect(nonDeletedGame).toBeNull();
  });
});
