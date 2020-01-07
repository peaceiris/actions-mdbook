import {getOS} from '../src/get-os';

describe('getOS()', () => {
  test('should return expected OS name', () => {
    expect(getOS('linux')).toBe('unknown-linux-gnu');
    expect(getOS('darwin')).toBe('apple-darwin');
    expect(getOS('win32')).toBe('pc-windows-msvc');
  });

  test('should return exception', () => {
    expect(() => {
      getOS('centos');
    }).toThrowError('centos is not supported');
  });
});
