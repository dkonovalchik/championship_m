import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { Db } from 'mongodb';

describe('GamesController', () => {
  let controller: GamesController;
  let db: Db;
  let gamesCollection;

  const TEST_GAME = {
    name: 'Basketball',
    periodCount: 4,
    periodLength: 15,
  };

  const TEST_GAME_UPDATE = {
    name: 'Football',
    periodCount: 2,
    periodLength: 45,
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

    controller = module.get<GamesController>(GamesController);
    db = module.get<Db>(MONGODB_CONNECTION);
    gamesCollection = db.collection('games');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new game and return it', async () => {
    // call
    const createResult = await controller.create(TEST_GAME);

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
    const findResult = await controller.findById(insertedGame.id);

    // check
    expect(findResult).not.toBeNull();
    expect(findResult).toMatchObject(TEST_GAME);
  });

  it('should update game by id and return updated game', async () => {
    // prepare
    const insertResult = await gamesCollection.insertOne(TEST_GAME);
    const insertedGame = await gamesCollection.findOne({ _id: insertResult.insertedId });

    // call
    const updateResult = await controller.updateById(insertedGame.id, TEST_GAME_UPDATE);

    // check
    expect(updateResult).not.toBeNull();
    expect(updateResult.id).toBe(insertedGame.id);
    expect(updateResult).toMatchObject(TEST_GAME_UPDATE);

    const updatedGame = await gamesCollection.findOne({ _id: insertedGame._id });
    expect(updatedGame).toMatchObject(TEST_GAME_UPDATE);
  });

  it('should delete game by id and return it', async () => {
    // prepare
    const insertResult = await gamesCollection.insertOne(TEST_GAME);
    const insertedGame = await gamesCollection.findOne({ _id: insertResult.insertedId });

    // call
    const deleteResult = await controller.deleteById(insertedGame.id);

    // check
    expect(deleteResult).not.toBeNull();
    expect(deleteResult.id).toBe(insertedGame.id);
    expect(deleteResult).toMatchObject(TEST_GAME);

    const nonDeletedGame = await gamesCollection.findOne({ _id: insertedGame._id });
    expect(nonDeletedGame).toBeNull();
  });
});
