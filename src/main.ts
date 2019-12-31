import * as core from '@actions/core';
import * as exec from '@actions/exec';
import getLatestVersion from './get-latest-version';
import installer from './installer';

export interface actionResult {
  output: string;
  error: string;
}

async function showVersion(cmd: string, args: string[]): Promise<actionResult> {
  let result: actionResult = {
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

  await exec.exec(cmd, args, options);
  return result;
}

// most @actions toolkit packages have async methods
export async function run(): Promise<any> {
  try {
    const mdbookVersion: string = core.getInput('mdbook-version');

    let result: actionResult = {
      output: '',
      error: ''
    };

    if (mdbookVersion === '' || mdbookVersion === 'latest') {
      const latestVersion: string = await getLatestVersion(
        'rust-lang',
        'mdbook',
        'brew'
      );
      console.log(`mdbook version: ${latestVersion} (${mdbookVersion})`);
      await installer(latestVersion);
      result = await showVersion('mdbook', ['--version']);
    } else {
      console.log(`mdbook version: ${mdbookVersion}`);
      await installer(mdbookVersion);
      result = await showVersion('mdbook', ['--version']);
    }

    return result;
  } catch (error) {
    core.setFailed(error.message);
  }
}
