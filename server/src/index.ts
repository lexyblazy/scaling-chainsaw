import express from 'express';
import * as initialize from './initialize';
import bodyParser from 'body-parser';

const main = async () => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  await initialize.loadServices();
  initialize.loadRouters(app);

  const PORT = process.env.PORT ?? 5000;
  app.listen(PORT, () => {
    console.log('Server is running');
  });
};

main();
