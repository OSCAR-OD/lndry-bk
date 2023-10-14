/**
 * Remove old files, copy front-end ones.
 */

// @ts-ignore
import fs from 'fs-extra';
import logger from 'jet-logger';
// @ts-ignore
import childProcess from 'child_process';


// Start
(async () => {
  try {
    // Remove current build
    await copy('./dist/uploadedFile',"./src/uploadedFile");
    await remove('./dist/');
    // Copy front-end files
    // await copy('./src/public', './dist/public');
    await copy('./src/views', './dist/views');
    await copy('./src/uploadedFile', './dist/uploadedFile');
    // Copy production env file
    await copy('./src/pre-start/env/production.env', './dist/pre-start/env/production.env');
    // Copy back-end files
    await exec('tsc --build tsconfig.prod.json', './');
  } catch (err) {
    logger.err(err);
  }
})();

/**
 * Remove file
 */
function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.remove(loc, (err) => {
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Copy file.
 */
function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.copy(src, dest, (err) => {
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Do command line command.
 */
function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, {cwd: loc}, (err, stdout, stderr) => {
      if (!!stdout) {
        logger.info(stdout);
      }
      if (!!stderr) {
        logger.warn(stderr);
      }
      return (!!err ? rej(err) : res());
    });
  });
}
