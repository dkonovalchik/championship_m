import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { Db } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from '../../../lib/exceptions';

describe('TeamsService', () => {
  const TEST_TEAM = {
    name: 'Name',
    gameId: 'game_id',
    cityId: 'city_id',
  };

  const TEST_TEAM_UPDATE = {
    name: 'New Name',
    gameId: 'new_game_id',
    cityId: 'new_city_id',
  };

  const WRONG_ID = 'wrong_id';

  let teamsService: TeamsService;
  let db: Db;
  let teamsCollection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    teamsService = module.get<TeamsService>(TeamsService);
    db = module.get<Db>(MONGODB_CONNECTION);
    teamsCollection = db.collection('teams');
  });

  it('should be defined', () => {
    expect(teamsService).toBeDefined();
  });

  describe('create', () => {
    it('should create new team and return it', async () => {
      // act
      const createResult = await teamsService.create(TEST_TEAM);

      // assert
      expect(createResult).not.toBeNull();
      expect(createResult.id).toBeDefined();
      expect(createResult).toMatchObject(TEST_TEAM);

      const teamInDb = await teamsCollection.findOne({ id: createResult.id });
      expect(teamInDb).not.toBeNull();
      expect(teamInDb.id).toBeDefined();
      expect(teamInDb).toMatchObject(TEST_TEAM);
    });
  });

  describe('read', () => {
    it('should find team by id and return it', async () => {
      const teamInDb = await teamsService.create(TEST_TEAM);

      const foundTeam = await teamsService.findById(teamInDb.id);

      expect(foundTeam).not.toBeNull();
      expect(foundTeam.id).toBe(teamInDb.id);
      expect(foundTeam.name).toBe(teamInDb.name);
      expect(foundTeam.gameId).toBe(teamInDb.gameId);
      expect(foundTeam.cityId).toBe(teamInDb.cityId);
    });

    it('should return null if team is not found', async () => {
      // act
      const findResult = await teamsService.findById(WRONG_ID);

      // assert
      expect(findResult).toBeNull();
    });
  });

  describe('update', () => {
    it('should update team by id and return updated team', async () => {
      // arrange
      await db.collection('games').insertOne({ id: TEST_TEAM_UPDATE.gameId });
      await db.collection('cities').insertOne({ id: TEST_TEAM_UPDATE.cityId });

      const insertResult = await teamsCollection.insertOne(TEST_TEAM);
      const insertedTeam = await teamsCollection.findOne({ _id: insertResult.insertedId });

      // act
      const updateResult = await teamsService.updateById(insertedTeam.id, TEST_TEAM_UPDATE);

      // assert
      expect(updateResult).not.toBeNull();
      expect(updateResult.id).toBe(insertedTeam.id);
      expect(updateResult).toMatchObject(TEST_TEAM_UPDATE);

      const updatedTeam = await teamsCollection.findOne({ _id: insertedTeam._id });
      expect(updatedTeam).not.toBeNull;
      expect(updatedTeam).toMatchObject(TEST_TEAM_UPDATE);
    });

    it('should return null if team to update is not found', async () => {
      // act
      const updateResult = await teamsService.updateById(WRONG_ID, TEST_TEAM_UPDATE);

      // assert
      expect(updateResult).toBeNull();
    });

    it('should throw exception if game with specified id is absent in db', async () => {
      // arrange
      const insertResult = await teamsCollection.insertOne(TEST_TEAM);
      const insertedTeam = await teamsCollection.findOne({ _id: insertResult.insertedId });

      // act
      let error: HttpException;
      try {
        await teamsService.updateById(insertedTeam.id, { gameId: WRONG_ID });
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });

    it('should throw exception if city with specified id is absent in db', async () => {
      // arrange
      const insertResult = await teamsCollection.insertOne(TEST_TEAM);
      const insertedTeam = await teamsCollection.findOne({ _id: insertResult.insertedId });

      // act
      let error: HttpException;
      try {
        await teamsService.updateById(insertedTeam.id, { cityId: WRONG_ID });
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should delete team by id and return it', async () => {
      // arrange
      const insertResult = await teamsCollection.insertOne(TEST_TEAM);
      const insertedTeam = await teamsCollection.findOne({ _id: insertResult.insertedId });

      // act
      const deleteResult = await teamsService.deleteById(insertedTeam.id);

      // assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult.id).toBe(insertedTeam.id);
      expect(deleteResult).toMatchObject(TEST_TEAM);

      const nonDeletedTeam = await teamsCollection.findOne({ _id: insertedTeam._id });
      expect(nonDeletedTeam).toBeNull();
    });

    it('should return null if team to delete is not found', async () => {
      // act
      const deleteResult = await teamsService.deleteById(WRONG_ID);

      // assert
      expect(deleteResult).toBeNull();
    });
  });
});
