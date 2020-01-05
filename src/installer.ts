import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import {getOS} from './get-os';
import {getURL} from './get-url';
import * as path from 'path';

export function getBaseLocation(): string {
  let baseLocation: string = '';

  if (process.platform === 'win32') {
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    baseLocation = `${process.env.HOME}`;
  }

  core.debug(`tempDir: ${baseLocation}`);

  return baseLocation;
}

export async function createTempDir(baseLocation: string): Promise<string> {
  let tempDir: string = process.env['RUNNER_TEMPDIRECTORY'] || '';

  if (tempDir === '') {
    tempDir = path.join(baseLocation, 'tmp');
  }

  await io.mkdirP(tempDir);
  core.debug(`tempDir: ${tempDir}`);

  return tempDir;
}

export async function installer(version: string) {
  const osName: string = getOS(process.platform);
  core.info(`Operating System: ${osName}`);

  const toolURL: string = getURL(osName, version);
  core.info(`toolURL: ${toolURL}`);

  const baseLocation: string = getBaseLocation();
  const toolPath: string = path.join(baseLocation, 'toolbin');
  await io.mkdirP(toolPath);
  core.addPath(toolPath);

  // Download and extract mdbook binary
  const tempDir: string = await createTempDir(baseLocation);
  const toolAssets: string = await tc.downloadTool(toolURL);
  let toolBin: string = '';
  if (process.platform === 'win32') {
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
