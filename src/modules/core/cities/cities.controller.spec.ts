import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';
import { ObjectId } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from 'src/lib/exceptions';

describe('CitiesController', () => {
  const TEST_CITY = {
    _id: new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    id: 'test_id',
    name: 'Name',
    countryId: 'country_id',
  };

  const TEST_CITY_UPDATE = {
    name: 'New Name',
    countryId: 'new_country_id',
  };

  const TEST_CITY_UPDATED = { ...TEST_CITY, ...TEST_CITY_UPDATE };

  let citiesController: CitiesController;
  let citiesService: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        CitiesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    citiesController = module.get<CitiesController>(CitiesController);
    citiesService = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(citiesController).toBeDefined();
  });

  describe('create', () => {
    it('should return created city', async () => {
      // arrange
      jest.spyOn(citiesService, 'create').mockResolvedValue(TEST_CITY);

      // act
      const result = await citiesController.create(TEST_CITY);

      // assert
      expect(result).toBe(TEST_CITY);
    });
  });

  describe('read', () => {
    it('should return found city', async () => {
      // arrange
      jest.spyOn(citiesService, 'findById').mockResolvedValue(TEST_CITY);

      // act
      const result = await citiesController.findById(TEST_CITY.id);

      // assert
      expect(result).toBe(TEST_CITY);
    });

    it('should throw exception if the city is not found', async () => {
      // arrange
      jest.spyOn(citiesService, 'findById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await citiesController.findById(TEST_CITY.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('update', () => {
    it('should return updated city', async () => {
      // arrange
      jest.spyOn(citiesService, 'updateById').mockResolvedValue(TEST_CITY_UPDATED);

      // act
      const result = await citiesController.updateById(TEST_CITY.id, TEST_CITY_UPDATE);

      //assert
      expect(result).toBe(TEST_CITY_UPDATED);
    });

    it('should throw exception if the city to update is not found', async () => {
      // arrange
      jest.spyOn(citiesService, 'updateById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await citiesController.updateById(TEST_CITY.id, TEST_CITY_UPDATE);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should return deleted city', async () => {
      // arrange
      jest.spyOn(citiesService, 'deleteById').mockResolvedValue(TEST_CITY);

      // act
      const result = await citiesController.deleteById(TEST_CITY.id);

      //assert
      expect(result).toBe(TEST_CITY);
    });

    it('should throw exception if the city to delete is not found', async () => {
      // arrange
      jest.spyOn(citiesService, 'deleteById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await citiesController.deleteById(TEST_CITY.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });
});

