import { Platform } from 'react-native';

import * as FS from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { ALBUM_NAME } from '../constants/Constants';

const APP_DIRECTORY_PATH = `${FS.documentDirectory}`;
const NAME_PREFIX = 'SwimmerPen-';

export function getAppDir() {
  return APP_DIRECTORY_PATH;
}

export async function createDirIfDontExist(dir: string): Promise<boolean> {
  try {
    const dirInfo = await FS.getInfoAsync(dir, {
      md5: false,
      size: false,
    });
    if (!dirInfo.exists) {
      await FS.makeDirectoryAsync(dir);
    }
    if (dirInfo.exists && !dirInfo.isDirectory) {
      console.log(
        `<FileHandler> createDirIfDontExist: ${dir} name is taken and is not a directory.`
      );
      return false;
    }
    return true;
  } catch (e) {
    console.log(`<FileHandler> createDirIfDontExist: ${e}`);
    return false;
  }
}

export async function makeDirIfNotPresent(uri: string): Promise<string> {
  const dir = await FS.getInfoAsync(uri, {
    md5: false,
    size: false,
  });
  if (dir.exists && dir.isDirectory) {
    return uri;
  }
  await FS.makeDirectoryAsync(APP_DIRECTORY_PATH, { intermediates: true });
  return uri;
}

interface BrokenUpUri {
  directory: string;
  baseName: string;
  baseNameWithExt: string;
}

export function breakUri(path: string): BrokenUpUri {
  let divider = path.lastIndexOf('/') + 1;
  let directory = new String(path).substring(0, divider);
  let baseNameWithExt = new String(path).substring(divider);
  let baseName: string;
  if (baseNameWithExt.lastIndexOf('.') != -1) {
    baseName = new String(baseNameWithExt).substring(
      0,
      baseNameWithExt.lastIndexOf('.')
    );
  } else {
    baseName = baseNameWithExt;
  }
  return {
    directory: directory,
    baseName: baseName,
    baseNameWithExt: baseNameWithExt,
  };
}

function getNextNumber(videoDirFiles: Array<string>): number {
  return videoDirFiles
    .map((e, i) => {
      const { baseName } = breakUri(e);
      let num: number;
      try {
        num = parseInt(baseName.replace(NAME_PREFIX, '')) + 1;
        if (isNaN(num)) {
          num = 1;
        }
      } catch {
        num = 1;
      }
      return num;
    })
    .reduce((prev, curr) => {
      if (prev > curr) {
        return prev;
      }
      return curr;
    }, 1);
}

async function renameFile(uri: string, newBaseName: string): Promise<string> {
  const { directory, baseName, baseNameWithExt } = breakUri(uri);
  let replacedName = new String(baseNameWithExt).replace(baseName, newBaseName);
  let renamedUri = `${directory}${replacedName}`;
  await FS.moveAsync({ from: uri, to: renamedUri });
  return renamedUri;
}

async function getNextNumberInAlbum(
  album: MediaLibrary.Album,
  withEndCursor?: string
): Promise<number> {
  const assets = await MediaLibrary.getAssetsAsync({
    album: album,
    mediaType: ['video'],
    after: withEndCursor,
  });
  let names = assets.assets.map((e, i) => e.filename);
  let nextNum = getNextNumber(names);
  if (assets.hasNextPage) {
    nextNum = Math.max(
      nextNum,
      await getNextNumberInAlbum(album, assets.endCursor)
    );
  }
  return nextNum;
}

export async function saveVideo(uri: string): Promise<boolean> {
  let assetUri: string = uri;
  const albumRef = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  if (Platform.OS === 'android') {    
    let nextNum: number;
    if (albumRef === null) {
      nextNum = 1;
    } else {
      nextNum = await getNextNumberInAlbum(albumRef);
    }
    assetUri = await renameFile(uri, `${NAME_PREFIX}${nextNum}`);
  }
  try {
    const asset = await MediaLibrary.createAssetAsync(assetUri);
    if (albumRef === null) {
      await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], albumRef, false);
    }
    return true;
  } catch (e) {
    console.log(`<FileHandler> Failed to save video: ${e}`);
    return false;
  }
}
