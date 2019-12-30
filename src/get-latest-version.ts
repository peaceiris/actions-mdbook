import * as core from '@actions/core';

interface BrewVersions {
  stable: string;
}

interface Json {
  tag_name: string;
  versions: BrewVersions;
}

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function getURL(org: string, repo: string, api: string): string {
  let url: string = '';

  if (api === 'brew') {
    url = `https://formulae.brew.sh/api/formula/${repo}.json`;
  } else if (api === 'github') {
    url = `https://api.github.com/repos/${org}/${repo}/releases/latest`;
  } else {
    core.setFailed(`Source API ${api} is not supported.`);
  }

  return url;
}

function getLatest(api: string, data: Json): string {
  let latestVersion: string = '';

  if (api === 'brew') {
    latestVersion = data.versions.stable;
  } else if (api === 'github') {
    latestVersion = data.tag_name;
    latestVersion = latestVersion.replace('v', '');
  } else {
    core.setFailed(`Source API ${api} is not supported.`);
  }

  return latestVersion;
}

export default async function getLatestVersion(
  org: string,
  repo: string,
  api: string
): Promise<any> {
  const xhr = new XMLHttpRequest();
  const url = getURL(org, repo, api);
  xhr.open('GET', url);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const result: Json = JSON.parse(xhr.responseText);
      return getLatest(api, result);
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      throw `ERROR: got status ${xhr.status} of ${url}`;
    }
  };
}
