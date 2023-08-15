import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';
import { ObjectId } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from 'src/lib/exceptions';

describe('LeaguesController', () => {
  const TEST_LEAGUE = {
    _id: new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    id: 'test_id',
    name: 'Name',
    gameId: 'game_id',
    countryId: 'country_id',
  };

  const TEST_LEAGUE_UPDATE = {
    name: 'New Name',
    gameId: 'new_game_id',
    countryId: 'new_country_id',
  };

  const TEST_LEAGUE_UPDATED = { ...TEST_LEAGUE, ...TEST_LEAGUE_UPDATE };

  let leaguesController: LeaguesController;
  let leaguesService: LeaguesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaguesController],
      providers: [
        LeaguesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    leaguesController = module.get<LeaguesController>(LeaguesController);
    leaguesService = module.get<LeaguesService>(LeaguesService);
  });

  it('should be defined', () => {
    expect(leaguesController).toBeDefined();
  });

  describe('create', () => {
    it('should return created league', async () => {
      // arrange
      jest.spyOn(leaguesService, 'create').mockResolvedValue(TEST_LEAGUE);

      // act
      const result = await leaguesController.create(TEST_LEAGUE);

      // assert
      expect(result).toBe(TEST_LEAGUE);
    });
  });

  describe('read', () => {
    it('should return found league', async () => {
      // arrange
      jest.spyOn(leaguesService, 'findById').mockResolvedValue(TEST_LEAGUE);

      // act
      const result = await leaguesController.findById(TEST_LEAGUE.id);

      // assert
      expect(result).toBe(TEST_LEAGUE);
    });

    it('should throw exception if the league is not found', async () => {
      // arrange
      jest.spyOn(leaguesService, 'findById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await leaguesController.findById(TEST_LEAGUE.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('update', () => {
    it('should return updated league', async () => {
      // arrange
      jest.spyOn(leaguesService, 'updateById').mockResolvedValue(TEST_LEAGUE_UPDATED);

      // act
      const result = await leaguesController.updateById(TEST_LEAGUE.id, TEST_LEAGUE_UPDATE);

      //assert
      expect(result).toBe(TEST_LEAGUE_UPDATED);
    });

    it('should throw exception if the league to update is not found', async () => {
      // arrange
      jest.spyOn(leaguesService, 'updateById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await leaguesController.updateById(TEST_LEAGUE.id, TEST_LEAGUE_UPDATE);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should return deleted league', async () => {
      // arrange
      jest.spyOn(leaguesService, 'deleteById').mockResolvedValue(TEST_LEAGUE);

      // act
      const result = await leaguesController.deleteById(TEST_LEAGUE.id);

      //assert
      expect(result).toBe(TEST_LEAGUE);
    });

    it('should throw exception if the league to delete is not found', async () => {
      // arrange
      jest.spyOn(leaguesService, 'deleteById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await leaguesController.deleteById(TEST_LEAGUE.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });
});
