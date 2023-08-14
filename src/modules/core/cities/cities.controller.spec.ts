import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';

describe('CitiesController', () => {
  let controller: CitiesController;

  const TEST_CITY = {
    name: 'Moscow',
    countryId: 'c4e434b4-7429-4642-a4a0-943ebbe25afb',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [CitiesService, MongodbProvider],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new city and return it', async () => {
    const createdCity = await controller.create(TEST_CITY);

    expect(createdCity).not.toBeNull();
    expect(createdCity.id).toBeDefined();
    expect(createdCity.name).toBe(TEST_CITY.name);
    expect(createdCity.countryId).toBe(TEST_CITY.countryId);
  });

  it('should find city by id and return it', async () => {
    const cityInDb = await controller.create(TEST_CITY);

    const foundCity = await controller.findById(cityInDb.id);

    expect(foundCity).not.toBeNull();
    expect(foundCity.id).toBe(cityInDb.id);
    expect(foundCity.name).toBe(cityInDb.name);
    expect(foundCity.countryId).toBe(cityInDb.countryId);
  });
});
