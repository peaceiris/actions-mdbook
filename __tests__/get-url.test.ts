import getURL from '../src/get-url';

describe('getURL()', () => {
  test('test', () => {
    const testVersion: string = '0.3.5';
    const baseURL: string = `https://github.com/rust-lang/mdBook/releases/download/v${testVersion}/mdbook-v${testVersion}-x86_64`;
    const urlLinux: string = `${baseURL}-unknown-linux-gnu.tar.gz`;
    const urlMacOS: string = `${baseURL}-apple-darwin.tar.gz`;
    const urlWindows: string = `${baseURL}-pc-windows-msvc.zip`;
    expect(getURL('unknown-linux-gnu', '0.3.5')).toBe(urlLinux);
    expect(getURL('unknown-linux-gnu', '0.3.4')).not.toBe(urlLinux);
    expect(getURL('my-os', '0.3.5')).not.toBe(urlLinux);
    expect(getURL('apple-darwin', '0.3.5')).toBe(urlMacOS);
    expect(getURL('pc-windows-msvc', '0.3.5')).toBe(urlWindows);
  });
});
