export default function getURL(os: string, version: string): string {
  const ext = (os: string) => {
    if (os === 'pc-windows-msvc') {
      return 'zip';
    } else {
      return 'tar.gz';
    }
  };

  const mdbookName: string = `mdbook-v${version}-x86_64-${os}`;
  const baseURL: string =
    'https://github.com/rust-lang/mdBook/releases/download';
  const url: string = `${baseURL}/v${version}/${mdbookName}.${ext(os)}`;

  return url;
}
