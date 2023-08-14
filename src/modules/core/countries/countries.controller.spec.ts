import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';
import { CountriesService } from './countries.service';

describe('CountriesController', () => {
  let controller: CountriesController;

  const TEST_COUNTRY = {
    name: 'Russia',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [CountriesService, MongodbProvider],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new country and return it', async () => {
    const createdCountry = await controller.create(TEST_COUNTRY);

    expect(createdCountry).not.toBeNull();
    expect(createdCountry.id).toBeDefined();
    expect(createdCountry.name).toBe(TEST_COUNTRY.name);
  });

  it('should find country by id and return it', async () => {
    const countryInDb = await controller.create(TEST_COUNTRY);

    const foundCountry = await controller.findById(countryInDb.id);

    expect(foundCountry).not.toBeNull();
    expect(foundCountry.id).toBe(countryInDb.id);
    expect(foundCountry.name).toBe(countryInDb.name);
  });
});
