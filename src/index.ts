import express from 'express';
import {log} from 'console';
import { bootstrap } from './app.controller';
import {config} from 'dotenv';
config({path:'./config/dev.env'});
const app = express();
const PORT =  3000;
bootstrap(app,express);
app.listen(PORT, () => {
   log(`Server is running on http://localhost:${PORT}`);
});