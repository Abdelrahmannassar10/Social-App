import express from 'express';
import {log} from 'console';
import { bootstrap } from './app.controller';
import {config} from 'dotenv';
import { initSocket } from './socket-io';
config();
const app = express();
const PORT =  3000;
bootstrap(app,express);
const server = app.listen(PORT, () => {
   log(`Server is running on http://localhost:${PORT}`);
});
initSocket(server);