import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { ObjectId } from 'mongodb';
import { RecordNotFound } from 'src/lib/exceptions';
import { HttpException } from '@nestjs/common';

describe('GamesController', () => {
  let gamesController: GamesController;
  let gamesService: GamesService;

  const TEST_GAME = {
    _id: new ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    id: 'abcde',
    name: 'Basketball',
    periodCount: 4,
    periodLength: 15,
  };

  const TEST_ID = 'test_id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        GamesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    gamesController = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(gamesController).toBeDefined();
  });

  describe('create', () => {
    it('should return created game', async () => {
      // arrange
      jest.spyOn(gamesService, 'create').mockResolvedValue(TEST_GAME);

      // act
      const result = await gamesController.create(TEST_GAME);

      // assert
      expect(result).toBe(TEST_GAME);
    });
  });

  describe('read', () => {
    it('should return found game', async () => {
      // arrange
      jest.spyOn(gamesService, 'findById').mockResolvedValue(TEST_GAME);

      // act
      const result = await gamesController.findById(TEST_ID);

      // assert
      expect(result).toBe(TEST_GAME);
    });

    it('should throw exception if the game is not found', async () => {
      // arrange
      jest.spyOn(gamesService, 'findById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await gamesController.findById(TEST_ID);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('update', () => {
    it('should return updated game', async () => {
      // arrange
      jest.spyOn(gamesService, 'updateById').mockResolvedValue(TEST_GAME);

      // act
      const result = await gamesController.updateById(TEST_ID, TEST_GAME);

      //assert
      expect(result).toBe(TEST_GAME);
    });

    it('should throw exception if the game to update is not found', async () => {
      // arrange
      jest.spyOn(gamesService, 'updateById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await gamesController.updateById(TEST_ID, TEST_GAME);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });

  describe('delete', () => {
    it('should return deleted game', async () => {
      // arrange
      jest.spyOn(gamesService, 'deleteById').mockResolvedValue(TEST_GAME);

      // act
      const result = await gamesController.deleteById(TEST_ID);

      //assert
      expect(result).toBe(TEST_GAME);
    });

    it('should throw exception if the game to delete is not found', async () => {
      // arrange
      jest.spyOn(gamesService, 'deleteById').mockResolvedValue(null);

      // act
      let error: HttpException;
      try {
        await gamesController.deleteById(TEST_ID);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RecordNotFound);
    });
  });
});
