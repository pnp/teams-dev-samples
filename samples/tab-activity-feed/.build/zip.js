// require modules
const fs = require('fs');
const archiver = require('archiver');

// Constants
const targetFolderName = 'teams';
const sourceFolderName = '.publish';
const archiveName = 'kudos';

// create a file to stream archive data to.
ensureFolder(targetFolderName);
const output = fs.createWriteStream(`${targetFolderName}/${archiveName}.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Sets the compression level.
});

// pipe archive data to the file
archive.pipe(output);

archive.directory(sourceFolderName, false);

archive.finalize();

/**
 * Ensure that a folder exists
 * @param {string} folderPath
 */
async function ensureFolder(folderPath) {
  try {
    await mkdir(folderPath);
  } catch (e) {}
}
