import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MONGODB_CONNECTION } from '../../../lib/constants';
import { testMongoConnectionFactory } from '../../../lib/test-mongo-connection';
import { ObjectId } from 'mongodb';
import { HttpException } from '@nestjs/common';
import { RecordNotFound } from '../../../lib/exceptions';

describe('MatchesController', () => {
  const TEST_MATCH = {
    _id: new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    id: 'test_id',
    hostId: 'host_id',
    guestId: 'guest_id',
    hostScore: 2,
    guestScore: 1,
  };

  const TEST_MATCH_UPDATE = {
    hostId: 'new_host_id',
    guestId: 'new_guest_id',
    hostScore: 4,
    guestScore: 3,
  };

  const TEST_MATCH_UPDATED = { ...TEST_MATCH, ...TEST_MATCH_UPDATE };

  let matchesController: MatchesController;
  let matchesService: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        MatchesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    matchesController = module.get<MatchesController>(MatchesController);
    matchesService = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(matchesController).toBeDefined();
  });

  describe('create', () => {
    it('should return created match', async () => {
      // arrange
      jest.spyOn(matchesService, 'create').mockResolvedValue(TEST_MATCH);

      // act
      const result = await matchesController.create(TEST_MATCH);

      // assert
      expect(result).toBe(TEST_MATCH);
    });
  });

  describe('read', () => {
    it('should return found match', async () => {
      // arrange
      jest.spyOn(matchesService, 'findById').mockResolvedValue(TEST_MATCH);

      // act
      const result = await matchesController.findById(TEST_MATCH.id);

      // assert
      expect(result).toBe(TEST_MATCH);
    });

    it('should throw exception if the match is not found', async () => {
      // arrange
      jest.spyOn(matchesService, 'findById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await matchesController.findById(TEST_MATCH.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('update', () => {
    it('should return updated match', async () => {
      // arrange
      jest.spyOn(matchesService, 'updateById').mockResolvedValue(TEST_MATCH_UPDATED);

      // act
      const result = await matchesController.updateById(TEST_MATCH.id, TEST_MATCH_UPDATE);

      //assert
      expect(result).toBe(TEST_MATCH_UPDATED);
    });

    it('should throw exception if the match to update is not found', async () => {
      // arrange
      jest.spyOn(matchesService, 'updateById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await matchesController.updateById(TEST_MATCH.id, TEST_MATCH_UPDATE);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should return deleted match', async () => {
      // arrange
      jest.spyOn(matchesService, 'deleteById').mockResolvedValue(TEST_MATCH);

      // act
      const result = await matchesController.deleteById(TEST_MATCH.id);

      //assert
      expect(result).toBe(TEST_MATCH);
    });

    it('should throw exception if the match to delete is not found', async () => {
      // arrange
      jest.spyOn(matchesService, 'deleteById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await matchesController.deleteById(TEST_MATCH.id);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });
});
