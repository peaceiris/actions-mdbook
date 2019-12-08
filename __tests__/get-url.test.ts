import getURL from '../src/get-url';

describe('getURL()', () => {
  test('test', () => {
    const testVersion: string = '0.3.5';
    const baseURL: string = `https://github.com/rust-lang/mdBook/releases/download/v${testVersion}/mdbook-v${testVersion}-x86_64`;
    const urlLinux: string = `${baseURL}-unknown-linux-gnu.tar.gz`;
    const urlMacOS: string = `${baseURL}-apple-darwin.tar.gz`;
    const urlWindows: string = `${baseURL}-pc-windows-msvc.zip`;
    const urlMyOS: string = `${baseURL}-my-os.tar.gz`;
    expect(getURL('unknown-linux-gnu', '0.3.5')).toBe(urlLinux);
    expect(getURL('apple-darwin', '0.3.5')).toBe(urlMacOS);
    expect(getURL('pc-windows-msvc', '0.3.5')).toBe(urlWindows);
    expect(getURL('unknown-linux-gnu', '0.3.5')).not.toBe(urlMyOS);
  });
});
