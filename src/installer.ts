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
  core.info(`Operating System: ${osName}`);

  const toolURL: string = getURL(osName, version);
  core.info(`toolURL: ${toolURL}`);

  let baseLocation: string;
  if (process.platform === 'win32') {
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    baseLocation = `${process.env.HOME}`;
  }
  const toolPath: string = path.join(baseLocation, 'toolbin');
  await io.mkdirP(toolPath);
  core.addPath(toolPath);

  // Download and extract mdbook binary
  await io.mkdirP(tempDir);
  const toolAssets: string = await tc.downloadTool(toolURL);
  let toolBin: string = '';
  if (osName === 'pc-windows-msvc') {
    const toolExtractedFolder: string = await tc.extractZip(
      toolAssets,
      tempDir
    );
    toolBin = `${toolExtractedFolder}/mdbook.exe`;
  } else {
    const toolExtractedFolder: string = await tc.extractTar(
      toolAssets,
      tempDir
    );
    toolBin = `${toolExtractedFolder}/mdbook`;
  }
  await io.mv(toolBin, toolPath);
}
