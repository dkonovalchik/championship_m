import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { ObjectId } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from '../../../lib/exceptions';

describe('TeamsController', () => {
  const TEST_TEAM = {
    _id: new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    id: 'test_id',
    name: 'Name',
    gameId: 'game_id',
    cityId: 'city_id',
  };

  const TEST_TEAM_UPDATE = {
    name: 'New Name',
    gameId: 'new_game_id',
    cityId: 'new_city_id',
  };

  const TEST_TEAM_UPDATED = { ...TEST_TEAM, ...TEST_TEAM_UPDATE };

  let teamsController: TeamsController;
  let teamsService: TeamsService;

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

    teamsController = module.get<TeamsController>(TeamsController);
    teamsService = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(teamsController).toBeDefined();
  });

  describe('create', () => {
    it('should return created team', async () => {
      // arrange
      jest.spyOn(teamsService, 'create').mockResolvedValue(TEST_TEAM);

      // act
      const result = await teamsController.create(TEST_TEAM);

      // assert
      expect(result).toBe(TEST_TEAM);
    });
  });

  describe('read', () => {
    it('should return found team', async () => {
      // arrange
      jest.spyOn(teamsService, 'findById').mockResolvedValue(TEST_TEAM);

      // act
      const result = await teamsController.findById(TEST_TEAM.id);

      // assert
      expect(result).toBe(TEST_TEAM);
    });

    it('should throw exception if the team is not found', async () => {
      // arrange
      jest.spyOn(teamsService, 'findById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await teamsController.findById(TEST_TEAM.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('update', () => {
    it('should return updated team', async () => {
      // arrange
      jest.spyOn(teamsService, 'updateById').mockResolvedValue(TEST_TEAM_UPDATED);

      // act
      const result = await teamsController.updateById(TEST_TEAM.id, TEST_TEAM_UPDATE);

      //assert
      expect(result).toBe(TEST_TEAM_UPDATED);
    });

    it('should throw exception if the team to update is not found', async () => {
      // arrange
      jest.spyOn(teamsService, 'updateById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await teamsController.updateById(TEST_TEAM.id, TEST_TEAM_UPDATE);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should return deleted team', async () => {
      // arrange
      jest.spyOn(teamsService, 'deleteById').mockResolvedValue(TEST_TEAM);

      // act
      const result = await teamsController.deleteById(TEST_TEAM.id);

      //assert
      expect(result).toBe(TEST_TEAM);
    });

    it('should throw exception if the teams to delete is not found', async () => {
      // arrange
      jest.spyOn(teamsService, 'deleteById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await teamsController.deleteById(TEST_TEAM.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });
});
