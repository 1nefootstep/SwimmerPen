import { FFmpegKitConfig, FFprobeKit } from 'ffmpeg-kit-react-native';

export function getInfo(uri: string) {
  FFprobeKit.getMediaInformation(uri).then(async session => {
    const information = await session.getMediaInformation();

    if (information === undefined) {
      // CHECK THE FOLLOWING ATTRIBUTES ON ERROR
      const state = FFmpegKitConfig.sessionStateToString(
        await session.getState()
      );
      const returnCode = await session.getReturnCode();
      const failStackTrace = await session.getFailStackTrace();
      const duration = await session.getDuration();
      const output = await session.getOutput();
      //console.log(`returnCode: ${returnCode}`);
      //console.log(`failStackTrace: ${failStackTrace}`);
      //console.log(`duration: ${duration}`);
      //console.log(`output: ${output}`);
    } else {
      //console.log(`streams: ${JSON.stringify(information.getStreams())}`);
      //console.log(
      //   `properties: ${JSON.stringify(information.getAllProperties())}`
      // );
      // console.log(
      //   `mediaProperties: ${JSON.stringify(information.getMediaProperties())}`
      // );
    }
  });
}

export function getFrametimes(uri: string) {
  return FFprobeKit.executeWithArguments([
    '-print_format',
    'json',
    '-hide_banner',
    '-loglevel',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'frame=best_effort_timestamp_time',
    '-i',
    uri,
  ]);
}
