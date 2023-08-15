import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { Db } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { CannotDeleteRecordWithChildren } from 'src/lib/exceptions';

describe('GamesService', () => {
  let gamesService: GamesService;
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

  const TEST_ID = 'test_id';
  const WRONG_ID = 'wrong_id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    gamesService = module.get<GamesService>(GamesService);
    db = module.get<Db>(MONGODB_CONNECTION);
    gamesCollection = db.collection('games');
  });

  it('should be defined', () => {
    expect(gamesService).toBeDefined();
  });

  describe('create', () => {
    it('should create new game and return it', async () => {
      // act
      const createResult = await gamesService.create(TEST_GAME);

      // assert
      expect(createResult).not.toBeNull();
      expect(createResult.id).toBeDefined();
      expect(createResult).toMatchObject(TEST_GAME);

      const gameInDb = await gamesCollection.findOne({ id: createResult.id });
      expect(gameInDb.id).toBeDefined();
      expect(gameInDb).toMatchObject(TEST_GAME);
    });
  });

  describe('read', () => {
    it('should find game by id and return it', async () => {
      // arrange
      const insertResult = await gamesCollection.insertOne(TEST_GAME);
      const insertedGame = await gamesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const findResult = await gamesService.findById(insertedGame.id);

      // assert
      expect(findResult).not.toBeNull();
      expect(findResult).toMatchObject(TEST_GAME);
    });

    it('return null if game is not found', async () => {
      // act
      const findResult = await gamesService.findById(WRONG_ID);

      // assert
      expect(findResult).toBeNull();
    });
  });

  describe('update', () => {
    it('should update game by id and return updated game', async () => {
      // arrange
      const insertResult = await gamesCollection.insertOne(TEST_GAME);
      const insertedGame = await gamesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const updateResult = await gamesService.updateById(insertedGame.id, TEST_GAME_UPDATE);

      // assert
      expect(updateResult).not.toBeNull();
      expect(updateResult.id).toBe(insertedGame.id);
      expect(updateResult).toMatchObject(TEST_GAME_UPDATE);

      const updatedGame = await gamesCollection.findOne({ _id: insertedGame._id });
      expect(updatedGame).toMatchObject(TEST_GAME_UPDATE);
    });

    it('return null if game to update is not found', async () => {
      // act
      const updateResult = await gamesService.updateById(WRONG_ID, TEST_GAME_UPDATE);

      // assert
      expect(updateResult).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete game by id and return it', async () => {
      // arrange
      const insertResult = await gamesCollection.insertOne(TEST_GAME);
      const insertedGame = await gamesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const deleteResult = await gamesService.deleteById(insertedGame.id);

      // assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult.id).toBe(insertedGame.id);
      expect(deleteResult).toMatchObject(TEST_GAME);

      const nonDeletedGame = await gamesCollection.findOne({ _id: insertedGame._id });
      expect(nonDeletedGame).toBeNull();
    });

    it('return null if game to delete is not found', async () => {
      // act
      const deleteResult = await gamesService.deleteById(WRONG_ID);

      // assert
      expect(deleteResult).toBeNull();
    });

    it('throw exception if game to delete has child league', async () => {
      // prepare
      await db.collection('leagues').insertOne({ gameId: TEST_ID });

      // act
      let error: HttpException;
      try {
        await gamesService.deleteById(TEST_ID);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(CannotDeleteRecordWithChildren);
    });

    it('throw exception if game to delete has child team', async () => {
      // prepare
      await db.collection('teams').insertOne({ gameId: TEST_ID });

      // act
      let error: HttpException;
      try {
        await gamesService.deleteById(TEST_ID);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(CannotDeleteRecordWithChildren);
    });
  });
});
