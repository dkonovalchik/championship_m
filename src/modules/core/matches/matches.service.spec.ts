import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { MONGODB_CONNECTION } from 'src/lib/constants';
import { testMongoConnectionFactory } from 'src/lib/test-mongo-connection';

describe('MatchesService', () => {
  let service: MatchesService;

  const TEST_MATCH = {
    hostId: '78f19f64-be6b-4152-a6ff-f85ac450269c',
    guestId: '85f460a8-ee3d-462e-8ca8-cdda6baba74c',
    hostScore: 2,
    guestScore: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: MONGODB_CONNECTION,
          useFactory: testMongoConnectionFactory,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new match and return it', async () => {
    const createdMatch = await service.create(TEST_MATCH);

    expect(createdMatch).not.toBeNull();
    expect(createdMatch.id).toBeDefined();
    expect(createdMatch.hostId).toBe(TEST_MATCH.hostId);
    expect(createdMatch.guestId).toBe(TEST_MATCH.guestId);
    expect(createdMatch.hostScore).toBe(TEST_MATCH.hostScore);
    expect(createdMatch.guestScore).toBe(TEST_MATCH.guestScore);
  });

  it('should find match by id and return it', async () => {
    const matchInDb = await service.create(TEST_MATCH);

    const foundMatch = await service.findById(matchInDb.id);

    expect(foundMatch).not.toBeNull();
    expect(foundMatch.id).toBe(matchInDb.id);
    expect(foundMatch.hostId).toBe(matchInDb.hostId);
    expect(foundMatch.guestId).toBe(matchInDb.guestId);
    expect(foundMatch.hostScore).toBe(matchInDb.hostScore);
    expect(foundMatch.guestScore).toBe(matchInDb.guestScore);
  });
});
