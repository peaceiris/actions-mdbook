import {getURL, assetURL} from '../src/get-url';

describe('getURL()', () => {
  test('return extected URL', () => {
    const testVersion: string = '0.3.5';
    const testDomain: string = 'https://github.com';
    const testMid: string = `rust-lang/mdBook/releases/download/v${testVersion}`;
    const testFilenameBase: string = `mdbook-v${testVersion}-x86_64`;

    const urlLinux: assetURL = {
      domain: testDomain,
      mid: testMid,
      filename: `${testFilenameBase}-unknown-linux-gnu.tar.gz`,
      full: ''
    };
    urlLinux.full = `${urlLinux.domain}/${urlLinux.mid}/${urlLinux.filename}`;

    const urlMacOS: assetURL = {
      domain: testDomain,
      mid: testMid,
      filename: `${testFilenameBase}-apple-darwin.tar.gz`,
      full: ''
    };
    urlMacOS.full = `${urlMacOS.domain}/${urlMacOS.mid}/${urlMacOS.filename}`;

    const urlWindows: assetURL = {
      domain: testDomain,
      mid: testMid,
      filename: `${testFilenameBase}-pc-windows-msvc.zip`,
      full: ''
    };
    urlWindows.full = `${urlWindows.domain}/${urlWindows.mid}/${urlWindows.filename}`;

    expect(getURL('unknown-linux-gnu', '0.3.5')).toStrictEqual(urlLinux);
    expect(getURL('apple-darwin', '0.3.5')).toStrictEqual(urlMacOS);
    expect(getURL('pc-windows-msvc', '0.3.5')).toStrictEqual(urlWindows);
  });
});
