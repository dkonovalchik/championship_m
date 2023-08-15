import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';
import { Collection, Db, Document } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { CannotDeleteRecordWithChildren, RecordNotFound } from 'src/lib/exceptions';

describe('CitiesService', () => {
  const TEST_CITY = {
    id: 'test_id',
    name: 'Name',
    countryId: 'country_id',
  };

  const TEST_CITY_UPDATE = {
    name: 'New Name',
  };

  const WRONG_ID = 'wrong_id';

  const TEST_CITY_UPDATED = { ...TEST_CITY, ...TEST_CITY_UPDATE };

  let citiesService: CitiesService;
  let db: Db;
  let citiesCollection: Collection<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    citiesService = module.get<CitiesService>(CitiesService);
    db = module.get<Db>(MONGODB_CONNECTION);
    citiesCollection = db.collection('cities');
  });

  it('should be defined', () => {
    expect(citiesService).toBeDefined();
  });

  describe('create', () => {
    it('should create new city and return it', async () => {
      // act
      const createResult = await citiesService.create(TEST_CITY);

      // assert
      expect(createResult).not.toBeNull();
      expect(createResult.id).toBeDefined();
      expect(createResult).toMatchObject(TEST_CITY);

      const gameInDb = await citiesCollection.findOne({ id: createResult.id });
      expect(gameInDb).not.toBeNull();
      expect(gameInDb.id).toBeDefined();
      expect(gameInDb).toMatchObject(TEST_CITY);
    });
  });

  describe('read', () => {
    it('should find city by id and return it', async () => {
      // arrange
      const insertResult = await citiesCollection.insertOne(TEST_CITY);
      const insertedCity = await citiesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const findResult = await citiesService.findById(insertedCity.id);

      // assert
      expect(findResult).not.toBeNull();
      expect(findResult).toMatchObject(TEST_CITY);
    });

    it('should return null if city is not found', async () => {
      // act
      const findResult = await citiesService.findById(WRONG_ID);

      // assert
      expect(findResult).toBeNull();
    });
  });

  describe('update', () => {
    it('should update city by id and return updated city', async () => {
      // arrange
      const insertResult = await citiesCollection.insertOne(TEST_CITY);
      const insertedGame = await citiesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const updateResult = await citiesService.updateById(insertedGame.id, TEST_CITY_UPDATE);

      // assert
      expect(updateResult).not.toBeNull();
      expect(updateResult.id).toBe(insertedGame.id);
      expect(updateResult).toMatchObject(TEST_CITY_UPDATED);

      const updatedGame = await citiesCollection.findOne({ _id: insertedGame._id });
      expect(updatedGame).not.toBeNull();
      expect(updatedGame).toMatchObject(TEST_CITY_UPDATED);
    });

    it('should return null if city to update is not found', async () => {
      // act
      const updateResult = await citiesService.updateById(WRONG_ID, TEST_CITY_UPDATE);

      // assert
      expect(updateResult).toBeNull();
    });

    it('should throw exception if country with specified id is absent in db', async () => {
      // arrange
      const insertResult = await citiesCollection.insertOne(TEST_CITY);
      const insertedTeam = await citiesCollection.findOne({ _id: insertResult.insertedId });

      // act
      let error: HttpException;
      try {
        await citiesService.updateById(insertedTeam.id, { countryId: WRONG_ID });
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should delete city by id and return it', async () => {
      // arrange
      const insertResult = await citiesCollection.insertOne(TEST_CITY);
      const insertedCity = await citiesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const deleteResult = await citiesService.deleteById(insertedCity.id);

      // assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult.id).toBe(insertedCity.id);
      expect(deleteResult).toMatchObject(TEST_CITY);

      const nonDeletedCity = await citiesCollection.findOne({ _id: insertedCity._id });
      expect(nonDeletedCity).toBeNull();
    });

    it('should return null if city to delete is not found', async () => {
      // act
      const deleteResult = await citiesService.deleteById(WRONG_ID);

      // assert
      expect(deleteResult).toBeNull();
    });

    it('should throw exception if city to delete has child team', async () => {
      // arrange
      await citiesCollection.insertOne(TEST_CITY);
      await db.collection('teams').insertOne({ cityId: TEST_CITY.id });

      // act
      let error: HttpException;
      try {
        await citiesService.deleteById(TEST_CITY.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(CannotDeleteRecordWithChildren);
    });
  });
});
