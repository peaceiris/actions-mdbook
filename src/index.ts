import * as core from '@actions/core';
import {run} from './main';

(async (): Promise<void> => {
  try {
    await main.run();
  } catch (e) {
    core.setFailed(`Action failed with error ${e.message}`);
  }
})();
