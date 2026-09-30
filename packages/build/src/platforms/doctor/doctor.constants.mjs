/* @layer tooling-scripts @kind constants */
const INSTALL_HINTS = Object.freeze({
  node: {
    win32: 'winget install OpenJS.NodeJS.LTS (Node 24), or nvm install 24',
    darwin: 'brew install node@24, or nvm install 24',
    linux: 'nvm install 24 (https://github.com/nvm-sh/nvm)',
  },
  pnpm: { all: 'corepack enable pnpm' },
  dotnet: {
    win32: 'winget install Microsoft.DotNet.SDK.8',
    darwin: 'brew install --cask dotnet-sdk@8',
    linux: 'sudo apt-get install -y dotnet-sdk-8.0',
  },
  vpk: { all: 'dotnet tool install -g vpk --version <the velopack version in package.json>' },
  msvc: {
    win32: 'winget install Microsoft.VisualStudio.2022.BuildTools --override "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended --passive"',
  },
  xcode: { darwin: 'xcode-select --install' },
  jdk: {
    win32: 'winget install EclipseAdoptium.Temurin.21.JDK',
    darwin: 'brew install --cask temurin@21',
    linux: 'sudo apt-get install -y openjdk-21-jdk',
  },
  androidHome: {
    win32: 'winget install Google.AndroidStudio, then set ANDROID_HOME to %LOCALAPPDATA%\\Android\\Sdk',
    darwin: 'brew install --cask android-studio, then set ANDROID_HOME to ~/Library/Android/sdk',
    linux: 'install Android Studio or the command line tools, then set ANDROID_HOME to the SDK folder',
  },
});

const ANDROID_SDK_PACKAGES = ['platform-tools', 'platforms;android-36', 'build-tools;36.0.0'];

const MIN_NODE_MAJOR = 24;
const MIN_DOTNET_MAJOR = 8;
const JDK_MAJOR = 21;
const PROBE_TIMEOUT_MS = 30_000;
const STATUS_WIDTH = 9;

export { INSTALL_HINTS, ANDROID_SDK_PACKAGES, MIN_NODE_MAJOR, MIN_DOTNET_MAJOR, JDK_MAJOR, PROBE_TIMEOUT_MS, STATUS_WIDTH };
