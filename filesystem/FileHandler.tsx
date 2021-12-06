import { Platform } from 'react-native';

import * as FS from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from "expo-sharing";

import { ALBUM_NAME } from '../constants/Constants';


const APP_DIRECTORY_PATH = 'file://SwimmerPen';
export async function getAppDirectory(): Promise<string> {
  const dir = await FS.getInfoAsync(APP_DIRECTORY_PATH, {
    md5: false,
    size: false,
  });
  if (dir.exists && dir.isDirectory) {
    return APP_DIRECTORY_PATH;
  }
  await FS.makeDirectoryAsync(APP_DIRECTORY_PATH);
  return APP_DIRECTORY_PATH;
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

export function getBaseName(path: string): string {
  let base = new String(path).substring(path.lastIndexOf('/') + 1);
  if (base.lastIndexOf('.') != -1) {
    base = base.substring(0, base.lastIndexOf('.'));
  }
  return base;
}

export async function saveVideo(uri: string): Promise<boolean> {
  // try {
  //   await MediaLibrary.saveToLibraryAsync(uri);
  // } catch (e){
  //   console.log(`<FileHandler> error: ${e}`);
  //   return false;
  // }
  // return true;
  // if (Platform.OS === 'ios') {
  //   const UTI = 'public.item';
  //   const shareResult = await Sharing.shareAsync(uri, {UTI});
  //   return true;
  // }
  console.log(`trying to save this url: ${uri}`);
  try {
    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
    if (album === null) {
      await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }
    return true;
    // await MediaLibrary.saveToLibraryAsync(uri);
    // return true;
  } catch (e) {
    console.log(`<FileHandler> Failed to save video: ${e}`);
    return false;
  }

  // console.log(videoDir);
  // const videoDirFiles = await FS.readDirectoryAsync(videoDir);
  // const NAME_PREFIX = 'SwimmerPen-';
  // const nextNum = videoDirFiles
  //   .map((e, i) => {
  //     const baseName = getBaseName(e);
  //     let num: number;
  //     try {
  //       num = parseInt(baseName.replace(NAME_PREFIX, '')) + 1;
  //     } catch {
  //       num = 1;
  //     }
  //     return num;
  //   })
  //   .reduce((prev, curr) => {
  //     if (prev > curr) {
  //       return prev;
  //     }
  //     return curr;
  //   }, 1);
  // const filepath = `${videoDir}/${NAME_PREFIX}${nextNum.toString()}.mp4`;
  // FS.moveAsync({ from: uri, to: filepath });
  // return filepath;
}
