import fs from 'fs';
import http from 'http';
import path from 'path';
import config from './config';
import {DataInfo} from './types';

const {rootDir, dataUrl, fetchDataInterval, skipBadResponses} = config;
const dataDir = path.join(rootDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const dataFile = new Date()
  .toUTCString()
  .replace(/,/g, '')
  .replace(/:/g, '-')
  .replace(/\s/g, '_');
const dataPath = path.join(dataDir, dataFile);
const dataWrite = fs.createWriteStream(dataPath);
let dataWriteQueue = Promise.resolve();
let nDataFetched = 0;

const writeData = (dataInfo: DataInfo, delay?: Promise<unknown>) => {
  dataWriteQueue = dataWriteQueue.then(async () => {
    await delay;
    dataWrite.write(JSON.stringify(dataInfo) + '\n');
    console.debug('data fetched: ' + ++nDataFetched);
  });
};

setInterval(() => {
  const dataInfo: DataInfo = [new Date().getTime(), ''];

  http.get(dataUrl, res => {
    if (res.statusCode !== 200) {
      if (skipBadResponses) return;

      writeData(dataInfo);
      return;
    }

    const rawRead = new Promise(resolve => {
      res.on('data', chunk => (dataInfo[1] += chunk));
      res.on('end', resolve);
    });
    writeData(dataInfo, rawRead);
  });
}, fetchDataInterval);
