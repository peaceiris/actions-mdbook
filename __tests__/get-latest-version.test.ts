import {getURL, getLatestVersion} from '../src/get-latest-version';
import jsonTestBrew from './data/brew.json';
import jsonTestGithub from './data/github.json';

beforeEach(() => {
  jest.restoreAllMocks();
});

const org: string = 'rust-lang';
const repo: string = 'mdbook';
const urlBrewExpected: string = `https://formulae.brew.sh/api/formula/${repo}.json`;
const urlGithubExpected: string = `https://api.github.com/repos/${org}/${repo}/releases/latest`;

describe('getURL()', () => {
  test('return expected URL', () => {
    const urlBrew: string = getURL(org, repo, 'brew');
    const urlGithub: string = getURL(org, repo, 'github');

    expect(urlBrew).toMatch(urlBrewExpected);
    expect(urlGithub).toMatch(urlGithubExpected);
  });
});

describe('getLatestVersion()', () => {
  let versionLatestExpected: string = '0.3.5';

  test('return latest version via brew', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(jsonTestBrew), {
        headers: {'Content-Type': 'application/json'},
        status: 200
      })
    );

    const versionLatest: string = await getLatestVersion(org, repo, 'brew');
    expect(versionLatest).toMatch(versionLatestExpected);
  });

  test('return latest version via GitHub', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(jsonTestGithub), {
        headers: {'Content-Type': 'application/json'},
        status: 200
      })
    );

    const versionLatest: string = await getLatestVersion(org, repo, 'github');
    expect(versionLatest).toMatch(versionLatestExpected);
  });

  test('return exception 404', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(null, {status: 404}));

    await expect(getLatestVersion(org, repo, 'brew')).rejects.toThrow(
      'Failed to fetch latest mdbook version'
    );
  });
});
