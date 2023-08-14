import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

export const MongodbTestingProvider = {
  provide: 'MONGODB_CONNECTION',
  useFactory: async () => {
    const mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    const client = new MongoClient(uri);
    await client.connect();
    return client.db();
  },
};
