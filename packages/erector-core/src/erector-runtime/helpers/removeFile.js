import digest from './digest';
import fs from 'fs';
import path from 'path';
import { __CONFIG__ } from '../../constants';

export default function(filename) {
  return function* (state) {
    const resolvedFilename = yield digest(filename);
    const absoluteFilename = path.resolve(state[__CONFIG__].pwd, resolvedFilename)
    fs.unlinkSync(absoluteFilename);
    yield true;
  }
}
