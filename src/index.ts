import * as core from '@actions/core';
import * as exec from '@actions/exec';
import getLatestVersion from './get-latest-version';
import installer from './installer';

// most @actions toolkit packages have async methods
async function run() {
  const showVersion = async () => {
    await exec.exec('mdbook --version');
  };

  try {
    const mdbookVersion: string = core.getInput('mdbook-version');

    if (mdbookVersion === '' || mdbookVersion === 'latest') {
      getLatestVersion('rust-lang', 'mdbook', 'brew').then(
        async function(latestVersion): Promise<void> {
          console.log(`mdbook version: ${latestVersion} (${mdbookVersion})`);
          await installer(latestVersion);
          await showVersion();
        },
        function(error) {
          core.setFailed(error);
        }
      );
    } else {
      console.log(`mdbook version: ${mdbookVersion}`);
      await installer(mdbookVersion);
      await showVersion();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
