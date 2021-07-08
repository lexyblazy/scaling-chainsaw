import express from 'express';
import * as initialize from './initialize';

const main = async () => {
  const app = express();

  await initialize.loadAll(app);

  const PORT = process.env.PORT ?? 5000;
  
  app.listen(PORT, () => {
    console.log('Server is running');
  });
};

main();
