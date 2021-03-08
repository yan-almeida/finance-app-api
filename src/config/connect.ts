import { createConnection } from 'typeorm';

const connectDB = async () => {
  try {
    const connection = await createConnection();

    console.log('App conectado ao BD =>', connection.options.database);

    process.on('SIGINT', () => {
      connection.close();
    });
  } catch (error) {
    console.log({ erro: 'Erro ao conectar ao banco de dados', details: error });
  }
};

export default connectDB;
