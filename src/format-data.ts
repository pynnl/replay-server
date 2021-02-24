import {DataInfo} from './types';

export default (dataInfo: DataInfo) => {
  let formattedData = null;

  // put custom format logic here
  try {
    formattedData = JSON.parse(dataInfo[1]);
  } catch {
    console.warn('could not parse raw data');
  }

  return formattedData;
};
