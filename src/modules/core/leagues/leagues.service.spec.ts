import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { Collection, Db, Document } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from '../../../lib/exceptions';

describe('LeaguesService', () => {
  const TEST_LEAGUE = {
    id: 'test_id',
    name: 'Name',
    gameId: 'game_id',
    countryId: 'country_id',
  };

  const TEST_LEAGUE_UPDATE = {
    name: 'New Name',
    gameId: 'new_game_id',
    countryId: 'new_country_id',
  };

  const WRONG_ID = 'wrong_id';

  const TEST_LEAGUE_UPDATED = { ...TEST_LEAGUE, ...TEST_LEAGUE_UPDATE };

  let leaguesService: LeaguesService;
  let db: Db;
  let leaguesCollection: Collection<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaguesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    leaguesService = module.get<LeaguesService>(LeaguesService);
    db = module.get<Db>(MONGODB_CONNECTION);
    leaguesCollection = db.collection('leagues');
  });

  it('should be defined', () => {
    expect(leaguesService).toBeDefined();
  });

  describe('create', () => {
    it('should create new league and return it', async () => {
      // act
      const createResult = await leaguesService.create(TEST_LEAGUE);

      // assert
      expect(createResult).not.toBeNull();
      expect(createResult.id).toBeDefined();
      expect(createResult).toMatchObject(TEST_LEAGUE);

      const gameInDb = await leaguesCollection.findOne({ id: createResult.id });
      expect(gameInDb).not.toBeNull();
      expect(gameInDb.id).toBeDefined();
      expect(gameInDb).toMatchObject(TEST_LEAGUE);
    });
  });

  describe('read', () => {
    it('should find league by id and return it', async () => {
      // arrange
      const insertResult = await leaguesCollection.insertOne(TEST_LEAGUE);
      const insertedGame = await leaguesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const findResult = await leaguesService.findById(insertedGame.id);

      // assert
      expect(findResult).not.toBeNull();
      expect(findResult).toMatchObject(TEST_LEAGUE);
    });

    it('should return null if league is not found', async () => {
      // act
      const findResult = await leaguesService.findById(WRONG_ID);

      // assert
      expect(findResult).toBeNull();
    });
  });

  describe('update', () => {
    it('should update league by id and return updated league', async () => {
      // arrange
      await db.collection('games').insertOne({ id: TEST_LEAGUE_UPDATE.gameId });
      await db.collection('countries').insertOne({ id: TEST_LEAGUE_UPDATE.countryId });

      const insertResult = await leaguesCollection.insertOne(TEST_LEAGUE);
      const insertedLeague = await leaguesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const updateResult = await leaguesService.updateById(insertedLeague.id, TEST_LEAGUE_UPDATE);

      // assert
      expect(updateResult).not.toBeNull();
      expect(updateResult.id).toBe(insertedLeague.id);
      expect(updateResult).toMatchObject(TEST_LEAGUE_UPDATED);

      const updatedGame = await leaguesCollection.findOne({ _id: insertedLeague._id });
      expect(updatedGame).not.toBeNull();
      expect(updatedGame).toMatchObject(TEST_LEAGUE_UPDATED);
    });

    it('should return null if league to update is not found', async () => {
      // act
      const updateResult = await leaguesService.updateById(WRONG_ID, TEST_LEAGUE_UPDATE);

      // assert
      expect(updateResult).toBeNull();
    });

    it('should throw exception if game with specified id is absent in db', async () => {
      // arrange
      const insertResult = await leaguesCollection.insertOne(TEST_LEAGUE);
      const insertedLeague = await leaguesCollection.findOne({ _id: insertResult.insertedId });

      // act
      let error: HttpException;
      try {
        await leaguesService.updateById(insertedLeague.id, { gameId: WRONG_ID });
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });

    it('should throw exception if country with specified id is absent in db', async () => {
      // arrange
      const insertResult = await leaguesCollection.insertOne(TEST_LEAGUE);
      const insertedTeam = await leaguesCollection.findOne({ _id: insertResult.insertedId });

      // act
      let error: HttpException;
      try {
        await leaguesService.updateById(insertedTeam.id, { countryId: WRONG_ID });
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should delete league by id and return it', async () => {
      // arrange
      const insertResult = await leaguesCollection.insertOne(TEST_LEAGUE);
      const insertedGame = await leaguesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const deleteResult = await leaguesService.deleteById(insertedGame.id);

      // assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult.id).toBe(insertedGame.id);
      expect(deleteResult).toMatchObject(TEST_LEAGUE);

      const nonDeletedGame = await leaguesCollection.findOne({ _id: insertedGame._id });
      expect(nonDeletedGame).toBeNull();
    });

    it('should return null if league to delete is not found', async () => {
      // act
      const deleteResult = await leaguesService.deleteById(WRONG_ID);

      // assert
      expect(deleteResult).toBeNull();
    });
  });
});
