// import {
//   AbstractSession,
//   FFmpegKitConfig,
//   FFprobeKit,
//   FFprobeSession,
//   LogRedirectionStrategy,
// } from 'ffmpeg-kit-react-native';

// export function getInfo(uri: string) {
//   FFprobeKit.getMediaInformation(uri).then(async session => {
//     const information = await session.getMediaInformation();

//     if (information === undefined) {
//       // CHECK THE FOLLOWING ATTRIBUTES ON ERROR
//       const state = FFmpegKitConfig.sessionStateToString(
//         await session.getState()
//       );
//       const returnCode = await session.getReturnCode();
//       const failStackTrace = await session.getFailStackTrace();
//       const duration = await session.getDuration();
//       const output = await session.getOutput();
//       console.log(`returnCode: ${returnCode}`);
//       console.log(`failStackTrace: ${failStackTrace}`);
//       console.log(`duration: ${duration}`);
//       console.log(`output: ${output}`);
//     } else {
//       console.log(`streams: ${JSON.stringify(information.getStreams())}`);
//       console.log(
//         `properties: ${JSON.stringify(information.getAllProperties())}`
//       );
//       console.log(
//         `mediaProperties: ${JSON.stringify(information.getMediaProperties())}`
//       );
//     }
//   });
// }

// export async function getFrametimes(uri: string) {
//   // AbstractSession.createFFprobeSession(
//   //   ['-i', uri, '-print_format', 'json', '-show_frames', '-loglevel', 'error'],
//   //   LogRedirectionStrategy.NEVER_PRINT_LOGS
//   // ).then(async session => {
//   //   const result = session.getOutput();
//   //   console.log(`result: ${JSON.stringify(result)}`);
//   // });
//   // const session = await FFprobeSession.create(
//   //   [
//   //     '-v',
//   //     'error',
//   //     '-hide_banner',
//   //     '-select_streams',
//   //     'v:0',
//   //     '-show_packets',
//   //     uri,
//   //   ],
//   //   session => console.log(`complete callback`),
//   //   log => {
//   //     console.log(log);
//   //   }
//   // );
//   // await FFmpegKitConfig.asyncFFprobeExecute(session);
//   // const logs = await session.getOutput();
//   // console.log(logs);
//   FFprobeKit.executeWithArguments([
//     '-print_format',
//     'json',
//     '-hide_banner',
//     '-select_streams',
//     'v:0',
//     '-show_entries',
//     'frame=best_effort_timestamp_time',
//     '-i',
//     uri,
//   ]).then(async session => {
//     const logs = await session.getAllLogsAsString();
//     console.log(JSON.stringify(JSON.parse(logs)));
//   });
// }
