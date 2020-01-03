import * as core from '@actions/core';
import * as exec from '@actions/exec';
import getLatestVersion from './get-latest-version';
import installer from './installer';

export interface actionResult {
  exitcode: number;
  output: string;
  error: string;
}

export async function showVersion(
  cmd: string,
  args: string[]
): Promise<actionResult> {
  let result: actionResult = {
    exitcode: 0,
    output: '',
    error: ''
  };

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        result.output += data.toString();
      },
      stderr: (data: Buffer) => {
        result.error += data.toString();
      }
    }
  };

  result.exitcode = await exec.exec(cmd, args, options);
  core.debug(`
    exit code: ${result.exitcode}
    stdout: ${result.output}
    stderr: ${result.error}
  `);
  return result;
}

// most @actions toolkit packages have async methods
export async function run(): Promise<any> {
  try {
    let toolVersion: string = core.getInput('mdbook-version');
    let installVersion: string = '';

    let result: actionResult = {
      exitcode: 0,
      output: '',
      error: ''
    };

    if (toolVersion === '' || toolVersion === 'latest') {
      installVersion = await getLatestVersion('rust-lang', 'mdbook', 'brew');
    } else {
      installVersion = toolVersion;
    }

    core.info(`mdbook version: ${installVersion}`);
    await installer(installVersion);
    result = await showVersion('mdbook', ['--version']);

    return result;
  } catch (error) {
    core.setFailed(error.message);
  }
}
