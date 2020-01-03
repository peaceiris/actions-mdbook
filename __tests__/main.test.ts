import * as main from '../src/main';

jest.setTimeout(20000);

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  delete process.env['INPUT_MDBOOK-VERSION'];
});

describe('run()', () => {
  test('Integration testing (custom version)', async () => {
    const testVersion: string = '0.3.4';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    const result: main.actionResult = await main.run();
    expect(result.output).toMatch(`mdbook v${testVersion}`);
  });

  test('Integration testing (latest version)', async () => {
    const testVersion: string = 'latest';
    process.env['INPUT_MDBOOK-VERSION'] = testVersion;
    const result: main.actionResult = await main.run();
    expect(result.output).toMatch(/mdbook v/);
  });
});

describe('showVersion()', () => {
  let result: main.actionResult = {
    exitcode: 0,
    output: '',
    error: ''
  };

  test('Success case', async () => {
    result = await main.showVersion('git', ['--version']);
    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(/git version/);
  });

  // test('Failure case', async () => {
  // });
});
