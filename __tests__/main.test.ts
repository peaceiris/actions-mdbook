jest.mock(
  '@actions/core',
  () => ({
    debug: jest.fn(),
    getInput: jest.fn(),
    info: jest.fn(),
    setFailed: jest.fn()
  }),
  {virtual: true}
);

jest.mock(
  '@actions/exec',
  () => ({
    exec: jest.fn()
  }),
  {virtual: true}
);

jest.mock('../src/get-latest-version', () => ({
  getLatestVersion: jest.fn()
}));

jest.mock('../src/installer', () => ({
  installer: jest.fn()
}));

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {getLatestVersion} from '../src/get-latest-version';
import {installer} from '../src/installer';
import * as main from '../src/main';

const getInputMock = core.getInput as jest.MockedFunction<typeof core.getInput>;
const execMock = exec.exec as jest.MockedFunction<typeof exec.exec>;
const getLatestVersionMock = getLatestVersion as jest.MockedFunction<
  typeof getLatestVersion
>;
const installerMock = installer as jest.MockedFunction<typeof installer>;

beforeEach(() => {
  jest.clearAllMocks();

  getInputMock.mockReturnValue('');
  installerMock.mockResolvedValue(undefined);
  execMock.mockImplementation(async (_cmd, _args, options) => {
    options?.listeners?.stdout?.(Buffer.from('mdbook v0.3.5'));
    return 0;
  });
});

describe('Integration testing run()', () => {
  test('succeed in installing a custom version', async () => {
    const testVersion: string = '0.3.4';
    getInputMock.mockReturnValue(testVersion);
    execMock.mockImplementation(async (_cmd, _args, options) => {
      options?.listeners?.stdout?.(Buffer.from(`mdbook v${testVersion}`));
      return 0;
    });

    const result: main.actionResult = await main.run();

    expect(installerMock).toHaveBeenCalledWith(testVersion);
    expect(result.output).toMatch(`mdbook v${testVersion}`);
  });

  test('succeed in installing the latest version', async () => {
    getInputMock.mockReturnValue('latest');
    getLatestVersionMock.mockResolvedValue('0.3.5');

    const result: main.actionResult = await main.run();

    expect(getLatestVersionMock).toHaveBeenCalledWith(
      'rust-lang',
      'mdbook',
      'brew'
    );
    expect(installerMock).toHaveBeenCalledWith('0.3.5');
    expect(result.output).toMatch('mdbook v0.3.5');
  });

  test('fail to install a custom version due to 404 of tarball', async () => {
    const testVersion: string = '0.3.4';
    getInputMock.mockReturnValue(testVersion);
    installerMock.mockRejectedValue(new Error('Unexpected HTTP response: 404'));

    await expect(main.run()).rejects.toThrow('Unexpected HTTP response: 404');
  });

  test('fail to install the latest version due to 404 of brew.sh', async () => {
    getInputMock.mockReturnValue('latest');
    getLatestVersionMock.mockRejectedValue(
      new Error('Failed to fetch latest mdbook version')
    );

    await expect(main.run()).rejects.toThrow(
      'Failed to fetch latest mdbook version'
    );
  });

  test('fail to install the latest version due to 404 of tarball', async () => {
    getInputMock.mockReturnValue('latest');
    getLatestVersionMock.mockResolvedValue('0.3.5');
    installerMock.mockRejectedValue(new Error('Unexpected HTTP response: 404'));

    await expect(main.run()).rejects.toThrow('Unexpected HTTP response: 404');
  });
});

describe('showVersion()', () => {
  let result: main.actionResult = {
    exitcode: 0,
    output: ''
  };

  test('return version', async () => {
    execMock.mockImplementation(async (_cmd, _args, options) => {
      options?.listeners?.stdout?.(Buffer.from('git version 2.50.0'));
      return 0;
    });

    result = await main.showVersion('git', ['--version']);

    expect(result.exitcode).toBe(0);
    expect(result.output).toMatch(/git version/);
  });

  test('return exception', async () => {
    execMock.mockRejectedValue(new Error('Unable to locate executable file'));

    await expect(main.showVersion('gitgit', ['--version'])).rejects.toThrow(
      'Unable to locate executable file'
    );
  });
});
