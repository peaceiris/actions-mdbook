import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {getLatestVersion} from './get-latest-version';
import {installer} from './installer';

export interface actionResult {
  exitcode: number;
  output: string;
}

export async function showVersion(
  cmd: string,
  args: string[]
): Promise<actionResult> {
  let result: actionResult = {
    exitcode: 0,
    output: ''
  };

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        result.output += data.toString();
      }
    }
  };

  result.exitcode = await exec.exec(cmd, args, options);
  core.debug(`
    exit code: ${result.exitcode}
    stdout: ${result.output}
  `);
  return result;
}

// most @actions toolkit packages have async methods
export async function run(): Promise<actionResult> {
  let toolVersion: string = core.getInput('mdbook-version');
  let installVersion: string;

  if (toolVersion === '' || toolVersion === 'latest') {
    installVersion = await getLatestVersion('rust-lang', 'mdbook', 'brew');
  } else {
    installVersion = toolVersion;
  }

  core.info(`mdbook version: ${installVersion}`);
  await installer(installVersion);
  return showVersion('mdbook', ['--version']);
}
