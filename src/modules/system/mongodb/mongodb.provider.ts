import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const MongodbProvider = {
  provide: 'MONGODB_CONNECTION',
  useFactory: async () => {
    const environment = process.env.NODE_ENV;
    if (environment === 'test') {
      const mongod = await MongoMemoryServer.create();
      const uri = await mongod.getUri();
      const client = new MongoClient(uri);
      await client.connect();
      return client.db();
    }

    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    return client.db('championship');
  },
};
