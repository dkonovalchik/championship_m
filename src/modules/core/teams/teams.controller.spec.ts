import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { testMongoConnectionFactory } from '../../../../test/utils/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';

describe('TeamsController', () => {
  let controller: TeamsController;

  const TEST_TEAM = {
    name: 'Spartak',
    gameId: '5286a4d4-73ed-469d-aafd-984b0c5652b2',
    cityId: '409bb5bf-92b4-4b00-babf-7be471bff372',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        TeamsService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new team and return it', async () => {
    const createdTeam = await controller.create(TEST_TEAM);

    expect(createdTeam).not.toBeNull();
    expect(createdTeam.id).toBeDefined();
    expect(createdTeam.name).toBe(TEST_TEAM.name);
    expect(createdTeam.gameId).toBe(TEST_TEAM.gameId);
    expect(createdTeam.cityId).toBe(TEST_TEAM.cityId);
  });

  it('should find team by id and return it', async () => {
    const teamInDb = await controller.create(TEST_TEAM);

    const foundTeam = await controller.findById(teamInDb.id);

    expect(foundTeam).not.toBeNull();
    expect(foundTeam.id).toBe(teamInDb.id);
    expect(foundTeam.name).toBe(teamInDb.name);
    expect(foundTeam.gameId).toBe(teamInDb.gameId);
    expect(foundTeam.cityId).toBe(teamInDb.cityId);
  });
});
