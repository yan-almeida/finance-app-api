import { createConnection } from 'typeorm';

const connectDB = async () => {
  const connection = await createConnection();

  console.log('App conectado ao BD =>', connection.options.database);

  process.on('SIGINT', () => {
    connection.close();
  });
};

export default connectDB;
