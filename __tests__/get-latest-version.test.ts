import * as target from '../src/get-latest-version';
import jsonTestBrew from './data/brew.json';
import jsonTestGithub from './data/github.json';

describe('Test', () => {
  test('getURL()', () => {
    const org: string = 'rust-lang';
    const repo: string = 'mdbook';
    const urlBrewExpected: string = `https://formulae.brew.sh/api/formula/${repo}.json`;
    const urlGithubExpected: string = `https://api.github.com/repos/${org}/${repo}/releases/latest`;
    const urlBrew: string = target.getURL(org, repo, 'brew');
    const urlGithub: string = target.getURL(org, repo, 'github');

    expect(urlBrew).toMatch(urlBrewExpected);
    expect(urlGithub).toMatch(urlGithubExpected);
  });

  let versionLatest: string = '0.3.5';

  test('getLatestBrew()', () => {
    const jsonBrew: target.JsonBrew = jsonTestBrew;
    const versionBrew: string = target.getLatestBrew(jsonBrew);
    expect(versionBrew).toMatch(versionLatest);
  });

  test('getLatestGithub()', () => {
    const jsonGithub: target.JsonGithub = jsonTestGithub;
    const versionGithub: string = target.getLatestGithub(jsonGithub);
    expect(versionGithub).toMatch(versionLatest);
  });
});
