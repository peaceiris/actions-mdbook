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
