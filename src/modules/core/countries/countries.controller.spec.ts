import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { ObjectId } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from '../../../lib/exceptions';

describe('CountriesController', () => {
  const TEST_COUNTRY = {
    _id: new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    id: 'test_id',
    name: 'Name',
  };

  const TEST_COUNTRY_UPDATE = {
    name: 'New Name',
  };

  const TEST_COUNTRY_UPDATED = { ...TEST_COUNTRY, ...TEST_COUNTRY_UPDATE };

  let countriesController: CountriesController;
  let countriesService: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        CountriesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    countriesController = module.get<CountriesController>(CountriesController);
    countriesService = module.get<CountriesService>(CountriesService);
  });

  it('should be defined', () => {
    expect(countriesController).toBeDefined();
  });

  describe('create', () => {
    it('should return created country', async () => {
      // arrange
      jest.spyOn(countriesService, 'create').mockResolvedValue(TEST_COUNTRY);

      // act
      const result = await countriesController.create(TEST_COUNTRY);

      // assert
      expect(result).toBe(TEST_COUNTRY);
    });
  });

  describe('read', () => {
    it('should return found country', async () => {
      // arrange
      jest.spyOn(countriesService, 'findById').mockResolvedValue(TEST_COUNTRY);

      // act
      const result = await countriesController.findById(TEST_COUNTRY.id);

      // assert
      expect(result).toBe(TEST_COUNTRY);
    });

    it('should throw exception if the country is not found', async () => {
      // arrange
      jest.spyOn(countriesService, 'findById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await countriesController.findById(TEST_COUNTRY.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('update', () => {
    it('should return updated country', async () => {
      // arrange
      jest.spyOn(countriesService, 'updateById').mockResolvedValue(TEST_COUNTRY_UPDATED);

      // act
      const result = await countriesController.updateById(TEST_COUNTRY.id, TEST_COUNTRY_UPDATE);

      //assert
      expect(result).toBe(TEST_COUNTRY_UPDATED);
    });

    it('should throw exception if the country to update is not found', async () => {
      // arrange
      jest.spyOn(countriesService, 'updateById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await countriesController.updateById(TEST_COUNTRY.id, TEST_COUNTRY_UPDATE);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should return deleted country', async () => {
      // arrange
      jest.spyOn(countriesService, 'deleteById').mockResolvedValue(TEST_COUNTRY);

      // act
      const result = await countriesController.deleteById(TEST_COUNTRY.id);

      //assert
      expect(result).toBe(TEST_COUNTRY);
    });

    it('should throw exception if the country to delete is not found', async () => {
      // arrange
      jest.spyOn(countriesService, 'deleteById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await countriesController.deleteById(TEST_COUNTRY.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });
});
