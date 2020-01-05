import {getURL, getLatestVersion} from '../src/get-latest-version';
const nock = require('nock');
import {FetchError} from 'node-fetch';
import jsonTestBrew from './data/brew.json';
import jsonTestGithub from './data/github.json';

beforeEach(() => {
  jest.resetModules();
});

const org: string = 'rust-lang';
const repo: string = 'mdbook';
const urlBrewExpected: string = `https://formulae.brew.sh/api/formula/${repo}.json`;
const urlGithubExpected: string = `https://api.github.com/repos/${org}/${repo}/releases/latest`;

describe('getURL()', () => {
  test('should return expected URL', () => {
    const urlBrew: string = getURL(org, repo, 'brew');
    const urlGithub: string = getURL(org, repo, 'github');

    expect(urlBrew).toMatch(urlBrewExpected);
    expect(urlGithub).toMatch(urlGithubExpected);
  });
});

describe('getLatestVersion()', () => {
  let versionLatestExpected: string = '0.3.5';

  test('should return latest version via brew', async () => {
    nock('https://formulae.brew.sh')
      .get(`/api/formula/${repo}.json`)
      .reply(200, jsonTestBrew);

    const versionLatest: string = await getLatestVersion(org, repo, 'brew');
    expect(versionLatest).toMatch(versionLatestExpected);
  });

  test('should return latest version via GitHub', async () => {
    nock('https://api.github.com')
      .get(`/repos/${org}/${repo}/releases/latest`)
      .reply(200, jsonTestGithub);

    const versionLatest: string = await getLatestVersion(org, repo, 'github');
    expect(versionLatest).toMatch(versionLatestExpected);
  });

  test('should return exception 404', async () => {
    nock('https://formulae.brew.sh')
      .get(`/api/formula/${repo}.json`)
      .reply(404);

    try {
      const versionLatest: string = await getLatestVersion(org, repo, 'brew');
      console.debug(versionLatest);
    } catch (e) {
      expect(e).toThrow(FetchError);
    }
  });
});
