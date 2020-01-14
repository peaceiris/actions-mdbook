import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import {getOS} from './get-os';
import * as asset from './get-url';
import * as path from 'path';

function getRandInt(): string {
  return Math.floor(Math.random() * 10000).toString();
}

export async function createTempDir(baseLocation: string): Promise<string> {
  const tempDirLocation: string = process.env['RUNNER_TEMP'] || '';
  const tempDirName: string = `actions_mdbook_tmp_${getRandInt()}`;
  let tempDirPath: string = '';

  if (tempDirLocation === '') {
    tempDirPath = path.join(baseLocation, tempDirName);
  } else {
    tempDirPath = path.join(tempDirLocation, tempDirName);
  }

  await io.mkdirP(tempDirPath);
  core.debug(`tempDir: ${tempDirPath}`);

  return tempDirPath;
}

export async function installer(version: string) {
  const osName: string = getOS(process.platform);
  core.info(`Operating System: ${osName}`);

  const toolURL: asset.assetURL = asset.getURL(osName, version);
  core.info(`toolURL: ${toolURL.full}`);

  const baseLocation: string = `${process.env.HOME}`;
  const toolPath: string = path.join(
    baseLocation,
    `actions_mdbook_bin_${getRandInt()}`
  );
  await io.mkdirP(toolPath);
  core.addPath(toolPath);

  // Download and extract mdbook binary
  const tempDir: string = await createTempDir(baseLocation);
  const toolAssets: string = await tc.downloadTool(toolURL.full);
  let toolBin: string = '';
  let toolExtractedFolder: string = '';
  if (process.platform === 'win32') {
    toolExtractedFolder = await tc.extractZip(toolAssets, tempDir);
    toolBin = `${toolExtractedFolder}/mdbook.exe`;
  } else {
    toolExtractedFolder = await tc.extractTar(toolAssets, tempDir);
    toolBin = `${toolExtractedFolder}/mdbook`;
  }
  await io.mv(toolBin, toolPath);
  await io.rmRF(tempDir);
}
