import * as target from '../src/get-latest-version';

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

  // test('getLatest()', () => {});
});
