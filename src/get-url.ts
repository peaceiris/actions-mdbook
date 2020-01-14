export interface assetURL {
  domain: string;
  mid: string;
  filename: string;
  full: string;
}

export function getURL(os: string, version: string): assetURL {
  const ext = (os: string) => {
    if (os === 'pc-windows-msvc') {
      return 'zip';
    } else {
      return 'tar.gz';
    }
  };

  const toolName: string = `mdbook-v${version}-x86_64-${os}`;
  const url: assetURL = {
    domain: 'https://github.com',
    mid: `rust-lang/mdBook/releases/download/v${version}`,
    filename: `${toolName}.${ext(os)}`,
    full: ''
  };
  url.full = `${url.domain}/${url.mid}/${url.filename}`;

  return url;
}
