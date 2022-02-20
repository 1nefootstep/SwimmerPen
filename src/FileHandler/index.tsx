import { Platform } from 'react-native';
import * as FS from 'expo-file-system';
import { AnnotationInformation } from '../state/AKB/AnnotationKnowledgeBank';
import { moveAsync, readDirectoryAsync } from 'expo-file-system';
import DocumentPicker, { types } from 'react-native-document-picker';

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
      //console.log(
      //   `<FileHandler> createDirIfDontExist: ${dir} name is taken and is not a directory.`
      // );
      return false;
    }
    return true;
  } catch (e) {
    //console.log(`<FileHandler> createDirIfDontExist: ${e}`);
    return false;
  }
}

export function createDirs() {
  const createAnnDirResult = createDirIfDontExist(APP_ANNOTATION_DIR_PATH);
  const createVidDirResult = createDirIfDontExist(APP_VIDEO_DIR_PATH);
  return Promise.all([createAnnDirResult, createVidDirResult]);
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
  console.log(`currBaseName: ${currBaseName}`);
  console.log(`newBaseName: ${newBaseName}`);
  const currVideoUri = getVideoUri(currBaseName);
  const currAnnotationUri = getAnnotationUri(currBaseName);
  console.log(`currVideoUri: ${currVideoUri}`);
  console.log(`currAnnotationUri: ${currAnnotationUri}`);
  const videoUriSplit = breakUri(currVideoUri);
  const replacedVideoName = new String(videoUriSplit.baseNameWithExt).replace(
    currBaseName,
    newBaseName
  );
  try {
    const ann = await loadAnnotation(currBaseName);
    if (ann.isSuccessful) {
      const result = await saveAnnotation(newBaseName, ann.annotation);
      if (!result) {
        console.log(
          `<FileHandler> Failed to save new annotation when renaming`
        );
        return false;
      }
      await FS.copyAsync({
        from: currVideoUri,
        to: `${videoUriSplit.directory}/${replacedVideoName}`,
      });
      await FS.deleteAsync(currAnnotationUri);
      await FS.deleteAsync(currVideoUri);
    } else {
      console.log(`<FileHandler> Failed to load annotation when renaming`);
      return false;
    }
  } catch (err) {
    console.log(`<FileHandler> Failed to rename: ${err}`);
    return false;
  }
  return true;
}

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

export async function saveVideo(uri: string): Promise<SaveVideoResult> {
  try {
    const createDirResult = await createDirIfDontExist(APP_VIDEO_DIR_PATH);
    if (!createDirResult) {
      //console.log('create video dir failed');
    }
    const nextNum = await getNextNumberInVideoFolder();

    const toUri = getVideoUri(`${NAME_PREFIX}${nextNum}`);
    await FS.copyAsync({ from: uri, to: toUri });
    //console.log(`<FileHandler> save video to ${toUri}`);
    return {
      isSuccessful: true,
      filename: `${NAME_PREFIX}${nextNum}`,
    };
  } catch (err) {
    //console.log(`<FileHandler> Failed to save video: ${err}`);
    return { isSuccessful: false };
  }
}

export async function deleteVideoAndAnnotation(
  basename: string
): Promise<void> {
  const videoUri = getVideoUri(basename);
  const annotationUri = getAnnotationUri(basename);
  await FS.deleteAsync(videoUri);
  await FS.deleteAsync(annotationUri);
}

export function getVideoUri(basename: string): string {
  if (Platform.OS === 'ios') {
    return `${APP_VIDEO_DIR_PATH}/${basename}.mov`;
  } else {
    return `${APP_VIDEO_DIR_PATH}/${basename}.mp4`;
  }
}

// export function getAnnotationUri(basename: string): string {
//   return `${APP_ANNOTATION_DIR_PATH}/${basename}`;
// }

export function getAnnotationUri(basename: string): string {
  return `${APP_ANNOTATION_DIR_PATH}/${basename}.txt`;
}

export async function getVideoNames(): Promise<Array<string>> {
  try {
    return await readDirectoryAsync(APP_VIDEO_DIR_PATH);
  } catch (err) {
    //console.log(`<FileHandler> Failed to read video uris: ${err}`);
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
      //console.log('create annotation dir failed');
    }
    annotationInfo.name = basename;
    await FS.writeAsStringAsync(
      getAnnotationUri(basename),
      JSON.stringify(annotationInfo)
    );
    return true;
  } catch (e) {
    //console.log(`<FileHandler> Failed to save annotation: ${e}`);
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
    const result = await FS.readAsStringAsync(getAnnotationUri(basename));
    const annotationInfo: AnnotationInformation = JSON.parse(result);
    return { isSuccessful: true, annotation: annotationInfo };
  } catch (e) {
    console.log(`<FileHandler> Failed to load annotation: ${e}`);
    return { isSuccessful: false };
  }
}

export async function createCsvInCacheDir(csv: string, basename: string) {
  const uri = `${FS.cacheDirectory}/${basename}.csv`;
  await FS.writeAsStringAsync(uri, csv);
  return uri;
}

export async function importVideoAndAnnotation() {
  try {
    const files = await DocumentPicker.pick({
      mode: 'open',
      type: [types.video, types.plainText],
      copyTo: 'cachesDirectory',
      allowMultiSelection: true,
    });
    files.forEach(f => console.log(JSON.stringify(f)));
    files.forEach(async f => {
      if (f.fileCopyUri !== null) {
        const { baseName } = breakUri(f.fileCopyUri);
        if (f.type?.includes('video')) {
          await FS.moveAsync({
            from: f.fileCopyUri,
            to: getVideoUri(baseName),
          });
        } else if (f.type === types.plainText) {
          await FS.moveAsync({
            from: f.fileCopyUri,
            to: getAnnotationUri(baseName),
          });
        } else {
          console.error(`file format is neither video nor plainText...`);
          return false;
        }
      }
      console.log(`moved`);
    });
    return true;
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      console.error(`importVideoAndAnnotation: picking error: ${err}`);
    }
    return false;
  }
}
