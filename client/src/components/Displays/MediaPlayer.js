import React from 'react';
import ReactPlayer from 'react-player'; // npm install react-player --save
// import YouTube from 'react-youtube'; // npm install react-youtube

// const _onReady = (event) => {
//   // access to player in all event handlers via event.target
//   event.target.pauseVideo();
// }

export default function MediaPlayer(props) {
  console.log(props);
  return <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />
  // const opts = {
  //   height: '390',
  //   width: '640',
  //   playerVars: {
  //     // https://developers.google.com/youtube/player_parameters
  //     autoplay: 1,
  //   },
  // };

  // return <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={_onReady} />;
}