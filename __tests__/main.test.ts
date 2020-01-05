import * as main from '../src/main';

jest.setTimeout(30000);

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  delete process.env['INPUT_MDBOOK-VERSION'];
});

describe('Integration testing run()', () => {
  test('should install custom version', async () => {
    const testVersion: string = '0.3.4';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    const result: main.actionResult = await main.run();
    expect(result.output).toMatch(`mdbook v${testVersion}`);
  });

  test('should install latest version', async () => {
    const testVersion: string = 'latest';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    const result: main.actionResult = await main.run();
    expect(result.output).toMatch(/mdbook v/);
  });
});

describe('showVersion()', () => {
  let result: main.actionResult = {
    exitcode: 0,
    output: ''
  };

  test('should return version', async () => {
    result = await main.showVersion('git', ['--version']);
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(/git version/);
  });

  test('should return exception', async () => {
    try {
      result = await main.showVersion('gitgit', ['--version']);
    } catch (e) {
      expect(e).toThrow(Error);
    }
  });
});
