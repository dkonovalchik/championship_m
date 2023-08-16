import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { Collection, Db, Document } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from '../../../lib/exceptions';

describe('MatchesService', () => {
  const TEST_MATCH = {
    id: 'test_id',
    hostId: 'host_id',
    guestId: 'guest_id',
    hostScore: 2,
    guestScore: 1,
  };

  const TEST_MATCH_UPDATE = {
    hostId: 'new_host_id',
    guestId: 'new_guest_id',
    hostScore: 4,
    guestScore: 3,
  };

  const WRONG_ID = 'wrong_id';

  const TEST_MATCH_UPDATED = { ...TEST_MATCH, ...TEST_MATCH_UPDATE };

  let matchesService: MatchesService;
  let db: Db;
  let matchesCollection: Collection<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    matchesService = module.get<MatchesService>(MatchesService);
    db = module.get<Db>(MONGODB_CONNECTION);
    matchesCollection = db.collection('matches');
  });

  it('should be defined', () => {
    expect(matchesService).toBeDefined();
  });

  describe('create', () => {
    it('should create new match and return it', async () => {
      // act
      const createResult = await matchesService.create(TEST_MATCH);

      // assert
      expect(createResult).not.toBeNull();
      expect(createResult.id).toBeDefined();
      expect(createResult).toMatchObject(TEST_MATCH);

      const gameInDb = await matchesCollection.findOne({ id: createResult.id });
      expect(gameInDb).not.toBeNull();
      expect(gameInDb.id).toBeDefined();
      expect(gameInDb).toMatchObject(TEST_MATCH);
    });
  });

  describe('read', () => {
    it('should find match by id and return it', async () => {
      // arrange
      const insertResult = await matchesCollection.insertOne(TEST_MATCH);
      const insertedGame = await matchesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const findResult = await matchesService.findById(insertedGame.id);

      // assert
      expect(findResult).not.toBeNull();
      expect(findResult).toMatchObject(TEST_MATCH);
    });

    it('should return null if match is not found', async () => {
      // act
      const findResult = await matchesService.findById(WRONG_ID);

      // assert
      expect(findResult).toBeNull();
    });
  });

  describe('update', () => {
    it('should update match by id and return updated match', async () => {
      // arrange
      await db.collection('teams').insertOne({ id: TEST_MATCH_UPDATE.hostId });
      await db.collection('teams').insertOne({ id: TEST_MATCH_UPDATE.guestId });

      const insertResult = await matchesCollection.insertOne(TEST_MATCH);
      const insertedMatch = await matchesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const updateResult = await matchesService.updateById(insertedMatch.id, TEST_MATCH_UPDATE);

      // assert
      expect(updateResult).not.toBeNull();
      expect(updateResult.id).toBe(insertedMatch.id);
      expect(updateResult).toMatchObject(TEST_MATCH_UPDATED);

      const updatedMatch = await matchesCollection.findOne({ _id: insertedMatch._id });
      expect(updatedMatch).not.toBeNull();
      expect(updatedMatch).toMatchObject(TEST_MATCH_UPDATED);
    });

    it('should return null if match to update is not found', async () => {
      // act
      const updateResult = await matchesService.updateById(WRONG_ID, TEST_MATCH_UPDATE);

      // assert
      expect(updateResult).toBeNull();
    });

    it('should throw exception if host with specified id is absent in db', async () => {
      // arrange
      const insertResult = await matchesCollection.insertOne(TEST_MATCH);
      const insertedMatch = await matchesCollection.findOne({ _id: insertResult.insertedId });

      // act
      let error: HttpException;
      try {
        await matchesService.updateById(insertedMatch.id, { hostId: WRONG_ID });
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });

    it('should throw exception if guest with specified id is absent in db', async () => {
      // arrange
      const insertResult = await matchesCollection.insertOne(TEST_MATCH);
      const insertedMatch = await matchesCollection.findOne({ _id: insertResult.insertedId });

      // act
      let error: HttpException;
      try {
        await matchesService.updateById(insertedMatch.id, { guestId: WRONG_ID });
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should delete match by id and return it', async () => {
      // arrange
      const insertResult = await matchesCollection.insertOne(TEST_MATCH);
      const insertedMatch = await matchesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const deleteResult = await matchesService.deleteById(insertedMatch.id);

      // assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult.id).toBe(insertedMatch.id);
      expect(deleteResult).toMatchObject(TEST_MATCH);

      const nonDeletedMatch = await matchesCollection.findOne({ _id: insertedMatch._id });
      expect(nonDeletedMatch).toBeNull();
    });

    it('should return null if match to delete is not found', async () => {
      // act
      const deleteResult = await matchesService.deleteById(WRONG_ID);

      // assert
      expect(deleteResult).toBeNull();
    });
  });
});
