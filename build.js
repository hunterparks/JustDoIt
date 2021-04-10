var fs = require('fs');
var isCiMasterBuild = process.env.TRAVIS_BRANCH === 'master' && process.env.TRAVIS_PULL_REQUEST === 'false';
var isLocalBuild = process.env.TRAVIS_BRANCH === undefined;

console.log('PR was: ' + process.env.TRAVIS_PULL_REQUEST);
console.log('Branch was: ' + process.env.TRAVIS_BRANCH);

if (isCiMasterBuild) {
  console.log('**** Master Branch Build ****');
  bump();
  createZip();
} else if (isLocalBuild) {
  createZip();
} else {
  console.log('**** Skip Publish ****');
}

function bump() {
  console.log('**** Bump Version ****');
  if (process.argv[2]) {
    var manifestPath = './manifest.json';
    var manifest = require(manifestPath);
    var version = manifest.version.split('.');
    // Update last digit to $TRAVIS_BUILD_NUMBER
    manifest.version = version[0] + '.' + version[1] + '.' + process.argv[2];
    console.log('Bumping version to ' + manifest.version);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
  }
}

function createZip() {
  console.log('**** Create ZIP ****');
  var archiver = require('archiver');
  var checkDir = fs.existsSync('build') || fs.mkdirSync('build');
  var output = fs.createWriteStream('build/JustDoIt.zip');
  var archive = archiver('zip');
  output.on('close', () => {
    console.log('ZIP Created - build/JustDoIt.zip');
    console.log('Wrote ' + archive.pointer() + ' bytes.');
  });
  archive.on('error', (err) => {
    throw err;
  });
  archive.pipe(output);
  archive.glob('_locales');
  archive.glob('_locales/*');
  archive.glob('_locales/**/*');
  archive.glob('assets');
  archive.glob('assets/*');
  archive.glob('assets/**/*');
  archive.glob('images');
  archive.glob('images/*');
  archive.glob('images/**/*');
  archive.glob('scripts');
  archive.glob('scripts/*');
  archive.glob('scripts/**/*');
  archive.glob('styles');
  archive.glob('styles/*');
  archive.glob('styles/**/*');
  archive.glob('manifest.json');
  //archive.glob('!(build|node_modules)*');
  //archive.glob('!(build|node_modules)/**/*');
  archive.finalize();
}
