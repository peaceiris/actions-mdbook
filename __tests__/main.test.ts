import * as main from '../src/main';
import * as tool from '../src/get-url';
const nock = require('nock');
import {FetchError} from 'node-fetch';
import * as io from '@actions/io';
import jsonTestBrew from './data/brew.json';
// import jsonTestGithub from './data/github.json';

jest.setTimeout(30000);
const org: string = 'rust-lang';
const repo: string = 'mdbook';

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  delete process.env['INPUT_MDBOOK-VERSION'];
  nock.cleanAll();
});

describe('Integration testing run()', () => {
  test('succeed in installing a custom version', async () => {
    const testVersion: string = '0.3.4';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    const result: main.actionResult = await main.run();
    expect(result.output).toMatch(`mdbook v${testVersion}`);

    const toolPath: string = await io.which('mdbook', true);
    await io.rmRF(toolPath);
  });

  test('succeed in installing the latest version', async () => {
    const testVersion: string = 'latest';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    nock('https://formulae.brew.sh')
      .get(`/api/formula/${repo}.json`)
      .reply(200, jsonTestBrew);
    const result: main.actionResult = await main.run();
    expect(result.output).toMatch('mdbook v0.3.5');

    const toolPath: string = await io.which('mdbook', true);
    await io.rmRF(toolPath);
  });

  test('fail to install a custom version due to 404 of tarball', async () => {
    const testVersion: string = '0.3.4';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    const donwloadFileURL: tool.assetURL = tool.getURL(org, repo);
    nock(`${donwloadFileURL.domain}`)
      .get(`/${donwloadFileURL.mid}/${donwloadFileURL.filename}`)
      .reply(404);
    try {
      const result: main.actionResult = await main.run();
      console.debug(result.output);
    } catch (e) {
      expect(e).toThrow(FetchError);
    }
  });

  test('fail to install the latest version due to 404 of brew.sh', async () => {
    const testVersion: string = 'latest';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    nock('https://formulae.brew.sh')
      .get(`/api/formula/${repo}.json`)
      .reply(404);
    try {
      const result: main.actionResult = await main.run();
      console.debug(result.output);
    } catch (e) {
      expect(e).toThrow(FetchError);
    }
  });

  test('fail to install the latest version due to 404 of tarball', async () => {
    const testVersion: string = 'latest';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    nock('https://formulae.brew.sh')
      .get(`/api/formula/${repo}.json`)
      .reply(200, jsonTestBrew);
    const donwloadFileURL: tool.assetURL = tool.getURL(org, repo);
    nock(`${donwloadFileURL.domain}`)
      .get(`/${donwloadFileURL.mid}/${donwloadFileURL.filename}`)
      .reply(404);
    try {
      const result: main.actionResult = await main.run();
      console.debug(result.output);
    } catch (e) {
      expect(e).toThrow(FetchError);
    }
  });
});

describe('showVersion()', () => {
  let result: main.actionResult = {
    exitcode: 0,
    output: ''
  };

  test('return version', async () => {
    result = await main.showVersion('git', ['--version']);
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(/git version/);
  });

  test('return exception', async () => {
    try {
      result = await main.showVersion('gitgit', ['--version']);
    } catch (e) {
      expect(e).toThrow(Error);
    }
  });
});
