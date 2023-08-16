import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { Collection, Db, Document } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { CannotDeleteRecordWithChildren } from '../../../lib/exceptions';

describe('CountriesService', () => {
  const TEST_COUNTRY = {
    id: 'test_id',
    name: 'Name',
  };

  const TEST_COUNTRY_UPDATE = {
    name: 'New Name',
  };

  const WRONG_ID = 'wrong_id';

  const TEST_COUNTRY_UPDATED = { ...TEST_COUNTRY, ...TEST_COUNTRY_UPDATE };

  let countriesService: CountriesService;
  let db: Db;
  let countriesCollection: Collection<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    countriesService = module.get<CountriesService>(CountriesService);
    db = module.get<Db>(MONGODB_CONNECTION);
    countriesCollection = db.collection('countries');
  });

  it('should be defined', () => {
    expect(countriesService).toBeDefined();
  });

  describe('create', () => {
    it('should create new country and return it', async () => {
      // act
      const createResult = await countriesService.create(TEST_COUNTRY);

      // assert
      expect(createResult).not.toBeNull();
      expect(createResult.id).toBeDefined();
      expect(createResult).toMatchObject(TEST_COUNTRY);

      const countryInDb = await countriesCollection.findOne({ id: createResult.id });
      expect(countryInDb).not.toBeNull();
      expect(countryInDb.id).toBeDefined();
      expect(countryInDb).toMatchObject(TEST_COUNTRY);
    });
  });

  describe('read', () => {
    it('should find country by id and return it', async () => {
      // arrange
      const insertResult = await countriesCollection.insertOne(TEST_COUNTRY);
      const insertedGame = await countriesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const findResult = await countriesService.findById(insertedGame.id);

      // assert
      expect(findResult).not.toBeNull();
      expect(findResult).toMatchObject(TEST_COUNTRY);
    });

    it('should return null if country is not found', async () => {
      // act
      const findResult = await countriesService.findById(WRONG_ID);

      // assert
      expect(findResult).toBeNull();
    });
  });

  describe('update', () => {
    it('should update country by id and return updated country', async () => {
      // arrange
      const insertResult = await countriesCollection.insertOne(TEST_COUNTRY);
      const insertedCountry = await countriesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const updateResult = await countriesService.updateById(
        insertedCountry.id,
        TEST_COUNTRY_UPDATE
      );

      // assert
      expect(updateResult).not.toBeNull();
      expect(updateResult.id).toBe(insertedCountry.id);
      expect(updateResult).toMatchObject(TEST_COUNTRY_UPDATED);

      const updatedGame = await countriesCollection.findOne({ _id: insertedCountry._id });
      expect(updatedGame).not.toBeNull();
      expect(updatedGame).toMatchObject(TEST_COUNTRY_UPDATED);
    });

    it('should return null if country to update is not found', async () => {
      // act
      const updateResult = await countriesService.updateById(WRONG_ID, TEST_COUNTRY_UPDATE);

      // assert
      expect(updateResult).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete country by id and return it', async () => {
      // arrange
      const insertResult = await countriesCollection.insertOne(TEST_COUNTRY);
      const insertedCountry = await countriesCollection.findOne({ _id: insertResult.insertedId });

      // act
      const deleteResult = await countriesService.deleteById(insertedCountry.id);

      // assert
      expect(deleteResult).not.toBeNull();
      expect(deleteResult.id).toBe(insertedCountry.id);
      expect(deleteResult).toMatchObject(TEST_COUNTRY);

      const nonDeletedGame = await countriesCollection.findOne({ _id: insertedCountry._id });
      expect(nonDeletedGame).toBeNull();
    });

    it('should return null if country to delete is not found', async () => {
      // act
      const deleteResult = await countriesService.deleteById(WRONG_ID);

      // assert
      expect(deleteResult).toBeNull();
    });

    it('should throw exception if country to delete has child city', async () => {
      // arrange
      await countriesCollection.insertOne(TEST_COUNTRY);
      await db.collection('cities').insertOne({ countryId: TEST_COUNTRY.id });

      // act
      let error: HttpException;
      try {
        await countriesService.deleteById(TEST_COUNTRY.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(CannotDeleteRecordWithChildren);
    });

    it('should throw exception if country to delete has child league', async () => {
      // arrange
      await countriesCollection.insertOne(TEST_COUNTRY);
      await db.collection('leagues').insertOne({ countryId: TEST_COUNTRY.id });

      // act
      let error: HttpException;
      try {
        await countriesService.deleteById(TEST_COUNTRY.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(CannotDeleteRecordWithChildren);
    });
  });
});
