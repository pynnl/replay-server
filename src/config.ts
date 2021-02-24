import path from 'path';
import configExample from '../config.example.json';
import config from '../config.json';

const rootDir = path.join(__dirname, '..');

export default {
  ...configExample,
  ...config,
  rootDir,
} as const;
