import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';

describe('TeamsService', () => {
  let service: TeamsService;

  const TEST_TEAM = {
    name: 'Spartak',
    gameId: '5286a4d4-73ed-469d-aafd-984b0c5652b2',
    cityId: '409bb5bf-92b4-4b00-babf-7be471bff372',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService, MongodbProvider],
    })
      .overrideProvider(MONGODB_CONNECTION)
      .useFactory({
        factory: testMongoConnectionFactory,
      })
      .compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new team and return it', async () => {
    const createdTeam = await service.create(TEST_TEAM);

    expect(createdTeam).not.toBeNull();
    expect(createdTeam.id).toBeDefined();
    expect(createdTeam.name).toBe(TEST_TEAM.name);
    expect(createdTeam.gameId).toBe(TEST_TEAM.gameId);
    expect(createdTeam.cityId).toBe(TEST_TEAM.cityId);
  });

  it('should find team by id and return it', async () => {
    const teamInDb = await service.create(TEST_TEAM);

    const foundTeam = await service.findById(teamInDb.id);

    expect(foundTeam).not.toBeNull();
    expect(foundTeam.id).toBe(teamInDb.id);
    expect(foundTeam.name).toBe(teamInDb.name);
    expect(foundTeam.gameId).toBe(teamInDb.gameId);
    expect(foundTeam.cityId).toBe(teamInDb.cityId);
  });
});
