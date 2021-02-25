import Koa from 'koa';
import NReadlines from 'n-readlines';
import path from 'path';
import config from './config';
import formatData from './format-data';
import {DataInfo} from './types';

const {rootDir, fetchDataInterval, replayDataPort} = config;
const dataPath = path.join(rootDir, process.argv[2]);
let dataRead = new NReadlines(dataPath);
let formattedData: unknown = '';

// Replay data
const readData = () => {
  const line = dataRead.next();
  // Reset when reaching end of data
  if (!line) {
    dataRead = new NReadlines(dataPath);
    readData();
    return;
  }

  try {
    const dataInfo: DataInfo = JSON.parse(line.toString());
    formattedData = formatData(dataInfo);
  } catch {
    console.warn('could not parse dataInfo');
    formattedData = '';
  }
};

setInterval(readData, fetchDataInterval);

// Create server
const app = new Koa();
app.use(async ctx => (ctx.body = formattedData ?? ''));
app.listen(replayDataPort, () => {
  console.info('listening on port: ' + replayDataPort);
});
