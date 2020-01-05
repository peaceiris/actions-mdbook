import {getOS} from '../src/get-os';

describe('getOS', () => {
  test('test', () => {
    expect(getOS('linux')).toBe('unknown-linux-gnu');
    expect(getOS('darwin')).toBe('apple-darwin');
    expect(getOS('win32')).toBe('pc-windows-msvc');
  });

  test('test exception', () => {
    expect(() => {
      getOS('centos');
    }).toThrowError('centos is not supported');
  });
});
