import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';

describe('CitiesService', () => {
  let service: CitiesService;

  const TEST_CITY = {
    name: 'Moscow',
    countryId: 'c4e434b4-7429-4642-a4a0-943ebbe25afb',
  };

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

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new city and return it', async () => {
    const createdCity = await service.create(TEST_CITY);

    expect(createdCity).not.toBeNull();
    expect(createdCity.id).toBeDefined();
    expect(createdCity.name).toBe(TEST_CITY.name);
    expect(createdCity.countryId).toBe(TEST_CITY.countryId);
  });

  it('should find city by id and return it', async () => {
    const cityInDb = await service.create(TEST_CITY);

    const foundCity = await service.findById(cityInDb.id);

    expect(foundCity).not.toBeNull();
    expect(foundCity.id).toBe(cityInDb.id);
    expect(foundCity.name).toBe(cityInDb.name);
    expect(foundCity.countryId).toBe(cityInDb.countryId);
  });
});
