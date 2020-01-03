import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import getOS from './get-os';
import getURL from './get-url';
import * as path from 'path';

let tempDir: string = process.env['RUNNER_TEMPDIRECTORY'] || '';
if (!tempDir) {
  let baseTempLocation: string;
  if (process.platform === 'win32') {
    baseTempLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    baseTempLocation = `${process.env.HOME}`;
  }
  tempDir = path.join(baseTempLocation, 'tmp');
}

export default async function installer(version: string) {
  const osName: string = getOS(process.platform);
  console.log(`Operating System: ${osName}`);

  const mdbookURL: string = getURL(osName, version);
  core.debug(`mdbookURL: ${mdbookURL}`);

  let baseLocation: string;
  if (process.platform === 'win32') {
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    baseLocation = `${process.env.HOME}`;
  }
  const mdbookPath: string = path.join(baseLocation, 'mdbookbin');
  await io.mkdirP(mdbookPath);
  core.addPath(mdbookPath);

  // Download and extract mdbook binary
  await io.mkdirP(tempDir);
  const mdbookAssets: string = await tc.downloadTool(mdbookURL);
  let mdbookBin: string = '';
  if (osName === 'pc-windows-msvc') {
    const mdbookExtractedFolder: string = await tc.extractZip(
      mdbookAssets,
      tempDir
    );
    mdbookBin = `${mdbookExtractedFolder}/mdbook.exe`;
  } else {
    const mdbookExtractedFolder: string = await tc.extractTar(
      mdbookAssets,
      tempDir
    );
    mdbookBin = `${mdbookExtractedFolder}/mdbook`;
  }
  await io.mv(mdbookBin, mdbookPath);
}
