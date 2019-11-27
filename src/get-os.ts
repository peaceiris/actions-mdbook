export default function getOS(platform: string) {
  if (platform === 'linux') {
    return 'unknown-linux-gnu';
  } else if (platform === 'darwin') {
    return 'apple-darwin';
  } else if (platform === 'win32') {
    return 'pc-windows-msvc';
    // throw new Error("Windows is not supported");
  } else {
    throw new Error(`${platform} is not supported`);
  }
}
