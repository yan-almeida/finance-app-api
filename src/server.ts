import { app } from './app';
require('dotenv').config();

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`🚀 Server started at http://localhost:${PORT}/api/v1`)
);

process.on('SIGINT', () => {
  server.close();
});
