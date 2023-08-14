import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { MongodbProvider } from '../../system/mongodb/mongodb.provider';
import { LeaguesController } from './leagues.controller';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';

describe('LeaguesController', () => {
  let controller: LeaguesController;

  const TEST_LEAGUE = {
    name: 'Russian Premier League',
    gameId: '5286a4d4-73ed-469d-aafd-984b0c5652b2',
    countryId: 'c4e434b4-7429-4642-a4a0-943ebbe25afb',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaguesController],
      providers: [LeaguesService, MongodbProvider],
    })
      .overrideProvider(MONGODB_CONNECTION)
      .useFactory({
        factory: testMongoConnectionFactory,
      })
      .compile();

    controller = module.get<LeaguesController>(LeaguesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new league and return it', async () => {
    const createdLeague = await controller.create(TEST_LEAGUE);

    expect(createdLeague).not.toBeNull();
    expect(createdLeague.id).toBeDefined();
    expect(createdLeague.name).toBe(TEST_LEAGUE.name);
    expect(createdLeague.gameId).toBe(TEST_LEAGUE.gameId);
    expect(createdLeague.countryId).toBe(TEST_LEAGUE.countryId);
  });

  it('should find league by id and return it', async () => {
    const leagueInDb = await controller.create(TEST_LEAGUE);

    const foundLeague = await controller.findById(leagueInDb.id);

    expect(foundLeague).not.toBeNull();
    expect(foundLeague.id).toBe(leagueInDb.id);
    expect(foundLeague.name).toBe(leagueInDb.name);
    expect(foundLeague.gameId).toBe(leagueInDb.gameId);
    expect(foundLeague.countryId).toBe(leagueInDb.countryId);
  });
});
