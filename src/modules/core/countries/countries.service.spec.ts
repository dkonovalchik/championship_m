import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';

describe('CountriesService', () => {
  let service: CountriesService;

  const TEST_COUNTRY = {
    name: 'Russia',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountriesService, MongodbProvider],
    })
      .overrideProvider(MONGODB_CONNECTION)
      .useFactory({
        factory: testMongoConnectionFactory,
      })
      .compile();

    service = module.get<CountriesService>(CountriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new country and return it', async () => {
    const createdCountry = await service.create(TEST_COUNTRY);

    expect(createdCountry).not.toBeNull();
    expect(createdCountry.id).toBeDefined();
    expect(createdCountry.name).toBe(TEST_COUNTRY.name);
  });

  it('should find country by id and return it', async () => {
    const countryInDb = await service.create(TEST_COUNTRY);

    const foundCountry = await service.findById(countryInDb.id);

    expect(foundCountry).not.toBeNull();
    expect(foundCountry.id).toBe(countryInDb.id);
    expect(foundCountry.name).toBe(countryInDb.name);
  });
});
