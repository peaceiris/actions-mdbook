import * as ins from '../src/installer';
import * as path from 'path';
import * as fs from 'fs';
import * as io from '@actions/io';
// const nock = require('nock');
// import {FetchError} from 'node-fetch';
// import jsonTestBrew from './data/brew.json';
// import jsonTestGithub from './data/github.json';

// jest.setTimeout(30000);
// const repo: string = 'mdbook';

const originalRunnerTemp: string =
  process.env['RUNNER_TEMP'] || '/home/runner/work/_temp';

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  process.env['RUNNER_TEMP'] = originalRunnerTemp;
  // nock.cleanAll();
});

describe('createTempDir()', () => {
  const homeDir: string = `${process.env.HOME}`;
  const tempDirName: string = 'actions_mdbook_tmp';

  test('return tempDir under HOME', async () => {
    delete process.env['RUNNER_TEMP'];
    const expectedTempDir: string = path.join(homeDir, tempDirName);
    const tempDir: string = await ins.createTempDir(homeDir);
    expect(tempDir).toMatch(expectedTempDir);
    io.rmRF(tempDir);
  });

  test('return tempDir under RUNNER_TEMP', async () => {
    const tempDirLocation: string = path.join(
      `${process.env.HOME}`,
      '/work/_temp'
    );
    const expectedTempDir: string = path.join(tempDirLocation, tempDirName);
    process.env['RUNNER_TEMP'] = tempDirLocation;
    fs.mkdirSync(tempDirLocation, {recursive: true});

    const tempDir: string = await ins.createTempDir(homeDir);
    expect(tempDir).toMatch(expectedTempDir);
    io.rmRF(tempDir);
  });
});
