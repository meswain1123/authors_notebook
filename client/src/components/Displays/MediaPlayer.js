import React from 'react';
import ReactPlayer from 'react-player'; // npm install react-player --save
// import YouTube from 'react-youtube'; // npm install react-youtube

// const _onReady = (event) => {
//   // access to player in all event handlers via event.target
//   event.target.pauseVideo();
// }

export default function MediaPlayer(props) {
  console.log(props);
  return (
    <ReactPlayer
      // className='react-player fixed-bottom'
      url= 'https://youtu.be/kksVfoN2bR8'
      // width='100%'
      // height='100%'
      // controls = {true}
    />
  );
  // <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />;
}