// var webrtc_capable = true;
// var rtc_peer_connection = null; // a pointer to RTCPeerConenction
// var rtc_session_description = null; // pointer to the browser specific implementation of the RTCSessionDescription constructor
// var get_user_media = null; // pointer to standard navigator
// var connect_stream_to_src = null; // a function that accepts a refernece to a MediaStream object and a reference to a html<video> element
// var stun_server = "stun.l.google.com:19302";  // holds a pointer to Google's public STUN server

// var call_token; // unique token for this call
// var signaling_server; // signaling server for this call
// var peer_connection; // peerconnection object, represents the actual RTCPeerConnection that will be established between these two users

// function start() {
//      // create the WebRTC peer connection object
//      peer_connection = new rtc_peer_connection({
//       "iceServers": [
//          { "url": "stun:"+stun_server }, // stun server info
// ] });

//  // handler to process new descriptions
//   function new_description_created(description) 
//   {
//     //// Do something       
// }

//   // generic handler that sends any ice candidates to the other peer
//      peer_connection.onicecandidate = function (ice_event) {
//     //event handler and if ice_event contains a candidate then we serialize this into a JSON blob and send that to the other caller's browser through the signaling_server variable:         
//  };


//  // display remote video streams when they arrive
//      peer_connection.onaddstream = function (event) {
//         // This simply receives any new incoming video streams and connects them to a local <video> element within the local browser, so you can see and hear the person on the other end of the call. 
// };

// /*
// Later, we set up our connection to the signaling server using the WebSocket API. This is generic, because this same type of connection is used by both the caller and the callee. It is essential that both are connected to the same signaling server in this basic example.
//      // setup generic connection to the signaling server using the
//   WebSocket API
//      signaling_server = new WebSocket("ws://localhost:1234");
//     */
    
//   // handle signals as a caller
//   function caller_signal_handler(event) {
//      var signal = JSON.parse(event.data);
//      if (signal.type === "callee_arrived") 
//      {
//       /// Do stuff
//      } else if (signal.type === "new_ice_candidate") 
//      {
//       // Do stuff
//      } else if (signal.type === "new_description") 
//      {
//  // Do stuff
// } else {
//       // extend with your own signal types here
//      }
// }


// // handle signals as a callee
//   function callee_signal_handler(event) {
//      var signal = JSON.parse(event.data);
//      if (signal.type === "new_ice_candidate") {
//       // Do stuff
//      } else if (signal.type === "new_description") {
//  // Do stuff
// } else {
//       // extend with your own signal types here
//      }
//  }

//   // setup stream from the local camera
//   function setup_video() {
//       get_user_media(
//       {
//          "audio": true, // request access to local microphone
//          "video": true  // request access to local camera
//       },
//       function (local_stream) { // success callback
//          // Do stuff
// },
//       log_error // error callback
//      );
// }

//   // generic error handler
//   function log_error(error) {
//     // Do stuff       
// }




navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;




var constraints = {audio: true, video: true};

function successCallback(localMediaStream) {
  window.stream = localMediaStream; // stream available to console
  var video = document.getElementById("localVideo");
  video.src = window.URL.createObjectURL(localMediaStream);
  video.play();
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);