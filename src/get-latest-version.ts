const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

interface BrewVersions {
  stable: string;
}

export interface JsonBrew {
  versions: BrewVersions;
}

export interface JsonGithub {
  tag_name: string;
}

export function getURL(org: string, repo: string, api: string): string {
  let url: string = '';

  if (api === 'brew') {
    url = `https://formulae.brew.sh/api/formula/${repo}.json`;
  } else if (api === 'github') {
    url = `https://api.github.com/repos/${org}/${repo}/releases/latest`;
  }

  return url;
}

export function getLatestBrew(data: JsonBrew): string {
  let latestVersion: string = '';
  latestVersion = data.versions.stable;
  return latestVersion;
}

export function getLatestGithub(data: JsonGithub): string {
  let latestVersion: string = '';
  latestVersion = data.tag_name;
  latestVersion = latestVersion.replace('v', '');
  return latestVersion;
}

export default async function getLatestVersion(
  org: string,
  repo: string,
  api: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = getURL(org, repo, api);
    xhr.open('GET', url);
    xhr.send();
    xhr.onload = () => {
      let latestVersion: string = '';
      if (api === 'brew') {
        const result: JsonBrew = JSON.parse(xhr.responseText);
        latestVersion = getLatestBrew(result);
      } else if (api === 'github') {
        const result: JsonGithub = JSON.parse(xhr.responseText);
        latestVersion = getLatestGithub(result);
      }
      resolve(latestVersion);
    };
    xhr.onerror = () => {
      reject(`ERROR: got status ${xhr.status} of ${url}`);
    };
  });
}
