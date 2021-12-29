import { Platform } from 'react-native';

import * as FS from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { ALBUM_NAME } from '../constants/Constants';
import { AnnotationInformation } from '../state/AKB/AnnotationKnowledgeBank';
import { readDirectoryAsync } from 'expo-file-system';

const APP_DIRECTORY_PATH = `${FS.documentDirectory}`;
const APP_VIDEO_DIR_PATH = `${APP_DIRECTORY_PATH}Video`;
const APP_ANNOTATION_DIR_PATH = `${APP_DIRECTORY_PATH}Annotation`;
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
    } else if (dirInfo.exists && !dirInfo.isDirectory) {
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

export function createDirs() {
  const createAnnDirResult = createDirIfDontExist(APP_ANNOTATION_DIR_PATH);
  const createVidDirResult = createDirIfDontExist(APP_VIDEO_DIR_PATH);
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

/**
 * Annotation and video must both exist in app directory folder.
 */
export async function renameVideoAndAnnotation(
  currBaseName: string,
  newBaseName: string
): Promise<boolean> {
  const currVideoUri = `${APP_VIDEO_DIR_PATH}/${currBaseName}`;
  const currAnnotationUri = `${APP_ANNOTATION_DIR_PATH}/${currBaseName}`;
  const videoUriSplit = breakUri(currVideoUri);
  const annotationUriSplit = breakUri(currAnnotationUri);
  const replacedVideoName = new String(videoUriSplit.baseNameWithExt).replace(
    currBaseName,
    newBaseName
  );
  const replacedAnnotationName = new String(
    annotationUriSplit.baseNameWithExt
  ).replace(currBaseName, newBaseName);
  try {
    await FS.moveAsync({
      from: currAnnotationUri,
      to: `${annotationUriSplit.directory}/${replacedAnnotationName}`,
    });
    await FS.moveAsync({
      from: currAnnotationUri,
      to: `${videoUriSplit.directory}/${replacedVideoName}`,
    });
  } catch (err) {
    console.log(`<FileHandler> Failed to rename: ${err}`);
    return false;
  }
  return true;
}

// async function renameFile(uri: string, newBaseName: string): Promise<string> {
//   const { directory, baseName, baseNameWithExt } = breakUri(uri);
//   let replacedName = new String(baseNameWithExt).replace(baseName, newBaseName);
//   let renamedUri = `${directory}${replacedName}`;
//   await FS.moveAsync({ from: uri, to: renamedUri });
//   return renamedUri;
// }

// async function getNextNumberInAlbum(
//   album: MediaLibrary.Album,
//   withEndCursor?: string
// ): Promise<number> {
//   const assets = await MediaLibrary.getAssetsAsync({
//     album: album,
//     mediaType: ['video'],
//     after: withEndCursor,
//   });
//   let names = assets.assets.map((e, i) => e.filename);
//   let nextNum = getNextNumber(names);
//   if (assets.hasNextPage) {
//     nextNum = Math.max(
//       nextNum,
//       await getNextNumberInAlbum(album, assets.endCursor)
//     );
//   }
//   return nextNum;
// }

async function getNextNumberInVideoFolder(): Promise<number> {
  const names = await FS.readDirectoryAsync(APP_VIDEO_DIR_PATH);
  return getNextNumber(names);
}

export type SaveVideoResult =
  | {
      isSuccessful: true;
      filename: string;
      // uri: string;
    }
  | {
      isSuccessful: false;
    };

// export async function saveVideoDeprecated(uri: string): Promise<SaveVideoResult> {
//   let assetUri: string = uri;
//   const albumRef = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
//   if (Platform.OS === 'android') {
//     let nextNum: number;
//     if (albumRef === null) {
//       nextNum = 1;
//     } else {
//       nextNum = await getNextNumberInAlbum(albumRef);
//     }
//     assetUri = await renameFile(uri, `${NAME_PREFIX}${nextNum}`);
//   }
//   try {
//     const asset = await MediaLibrary.createAssetAsync(assetUri);
//     if (albumRef === null) {
//       await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
//     } else {
//       await MediaLibrary.addAssetsToAlbumAsync([asset], albumRef, false);
//     }
//     // const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
//     // return { isSuccessful: true, filename: assetInfo.filename, uri: assetInfo.uri };
//     // for ANDROID ONLY
//     const {baseName} = breakUri(assetUri);
//     return { isSuccessful: true, filename: baseName };
//     // return {isSuccessful}
//   } catch (e) {
//     console.log(`<FileHandler> Failed to save video: ${e}`);
//     return { isSuccessful: false };
//   }
// }

export async function saveVideo(uri: string): Promise<SaveVideoResult> {
  try {
    const createDirResult = await createDirIfDontExist(APP_VIDEO_DIR_PATH);
    if (!createDirResult) {
      console.log('create video dir failed');
    }
    const nextNum = await getNextNumberInVideoFolder();
    let toUri: string;
    if (Platform.OS === 'ios') {
      toUri = `${APP_VIDEO_DIR_PATH}/${NAME_PREFIX}${nextNum}.mov`;
    } else {
      toUri = `${APP_VIDEO_DIR_PATH}/${NAME_PREFIX}${nextNum}`;
    }
    await FS.moveAsync({ from: uri, to: toUri });
    console.log(`<FileHandler> save video to ${toUri}`);
    return {
      isSuccessful: true,
      filename: `${NAME_PREFIX}${nextNum}`,
    };
  } catch (err) {
    console.log(`<FileHandler> Failed to save video: ${err}`);
    return { isSuccessful: false };
  }
}

export function getVideoUri(baseName: string): string {
  return `${APP_VIDEO_DIR_PATH}/${baseName}`;
}

export async function getVideoNames(): Promise<Array<string>> {
  try {
    return await readDirectoryAsync(APP_VIDEO_DIR_PATH);
  } catch (err) {
    console.log(`<FileHandler> Failed to read video uris: ${err}`);
    return [];
  }
}

export async function saveAnnotation(
  basename: string,
  annotationInfo: AnnotationInformation
): Promise<boolean> {
  try {
    const createDirResult = await createDirIfDontExist(APP_ANNOTATION_DIR_PATH);
    if (!createDirResult) {
      console.log('create annotation dir failed');
    }
    await FS.writeAsStringAsync(
      `${APP_ANNOTATION_DIR_PATH}/${basename}`,
      JSON.stringify(annotationInfo)
    );
    return true;
  } catch (e) {
    console.log(`<FileHandler> Failed to save annotation: ${e}`);
    return false;
  }
}

export type LoadAnnotationResult =
  | {
      isSuccessful: true;
      annotation: AnnotationInformation;
    }
  | {
      isSuccessful: false;
    };

export async function loadAnnotation(
  basename: string
): Promise<LoadAnnotationResult> {
  try {
    const result = await FS.readAsStringAsync(
      `${APP_ANNOTATION_DIR_PATH}/${basename}`
    );
    const annotationInfo: AnnotationInformation = JSON.parse(result);
    return { isSuccessful: true, annotation: annotationInfo };
  } catch (e) {
    console.log(`<FileHandler> Failed to load annotation: ${e}`);
    return { isSuccessful: false };
  }
}
