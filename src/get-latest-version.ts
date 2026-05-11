interface BrewFormula {
  versions?: {
    stable?: string;
  };
}

interface GitHubRelease {
  tag_name?: string;
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

export async function getLatestVersion(
  org: string,
  repo: string,
  api: string
): Promise<string> {
  const url = getURL(org, repo, api);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch latest ${repo} version from ${url}: ${response.status}`
    );
  }

  const json = (await response.json()) as BrewFormula | GitHubRelease;

  if (api === 'brew' && 'versions' in json && json.versions?.stable) {
    return json.versions.stable;
  } else if (api === 'github' && 'tag_name' in json && json.tag_name) {
    return json.tag_name;
  }

  throw new Error(`Unexpected ${api} response for ${repo}`);
}
