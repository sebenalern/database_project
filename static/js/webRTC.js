


    // Compatibility shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // PeerJS object
    var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

    peer.on('open', function(){
      $('#my-id').text(peer.id);
    });

    // Receiving a call
    peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      call.answer(window.localStream);
      step3(call);
    });
    peer.on('error', function(err){
      alert(err.message);
      // Return to step 2 if error occurs
      step2();
    });

    // Click handlers setup
    $(function(){
      $('#make-call').click(function(){
        // Initiate a call!
        var call = peer.call($('#callto-id').val(), window.localStream);

        step3(call);
      });

      $('#end-call').click(function(){
        window.existingCall.close();
        step2();
      });

      // Retry if getUserMedia fails
      $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
      });

      // Get things started
      step1();
    });

    function step1 () {
      // Get audio/video stream
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step2();
      }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
      $('#step1, #step3').hide();
      $('#step2').show();
    }

    function step3 (call) {
      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      // UI stuff
      window.existingCall = call;
      $('#their-id').text(call.peer);
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    }





// // var peer = new Peer({key: 'lwjd5qra8257b9'});

// // var ids = [];

// // peer.on('open', function(id) {
// //   console.log('My peer ID is: ' + id);
// //   ids.push(id);
// //   console.log(ids);

// // });

// // var conn = peer.connect(ids[0]);

// // peer.on('connection', function(conn) { 
// //     console.log("connected");
// // });

// navigator.getUserMedia = navigator.getUserMedia ||
//   navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// function getParameterByName(name){
//     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//         results = regex.exec(location.search);
//     return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// }

// function getAudio(successCallback, errorCallback){
//     navigator.getUserMedia({
//         audio: true,
//         video: false
//     }, successCallback, errorCallback);
// }


// function onReceiveCall(call){

//     console.log('peer is calling...');
//     console.log(call);

//     getAudio(
//         function(MediaStream){
//             call.answer(MediaStream);
//             console.log('answering call started...');
//         },
//         function(err){
//             console.log('an error occured while getting the audio');
//             console.log(err);
//         }
//     );

//     call.on('stream', onReceiveStream);
// }

// function onReceiveStream(stream){
//     var audio = document.querySelector('audio');
//     audio.src = window.URL.createObjectURL(stream);
//     audio.onloadedmetadata = function(e){
//         console.log('now playing the audio');
//         audio.play();
//     }
// }

// var from = getParameterByName('from');
// var to = getParameterByName('to');

// var peer = new Peer(
//     from,
//     {
//         key: 'lwjd5qra8257b9',
//         config: { 'iceServers': [
//             { 'url': 'stun:stun.l.google.com:19302' }  
//           ] }
//     }
// );


// peer.on('open', function(id){
//     console.log('My peer ID is: ' + id);
// });

// peer.on('call', onReceiveCall);

// $('#start-call').click(function(){

//     console.log('starting call...');

//     getAudio(
//         function(MediaStream){

//             console.log('now calling ' + to);
//             var call = peer.call(to, MediaStream);
//             call.on('stream', onReceiveStream);
//         },
//         function(err){
//             console.log('an error occured while getting the audio');
//             console.log(err);
//         }
//     );

// });













//   var localVideo;
//   var miniVideo;
//   var remoteVideo;
//   var localStream;
//   var remoteStream;
//   var channel;
//   var channelReady = false;
//   var channelRefreshTimer;
//   var pc;
//   var socket;
// socket = io.connect('https://' + document.domain + ':' + location.port + '/video');

// //   var initiator = {{ initiator }};
//   var started = false;


// function doGetUserMedia() {
//     navigator.getUserMedia = navigator.getUserMedia ||
//     navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//     var constraints = {audio: true, video: true};
//     navigator.getUserMedia(constraints, successCallback, errorCallback);
// }


// function successCallback(localMediaStream) {
//     window.stream = localMediaStream; // stream available to console
//     var video = document.getElementById("localVideo");
//     video.src = window.URL.createObjectURL(localMediaStream);
//     video.play();
//     console.log(localMediaStream.getVideoTracks());
// }

// // errorCallback for getUserMedia
// function errorCallback(error){
//   console.log("navigator.getUserMedia error: ", error);
// }

// function startVideoChat() 
// {
//     localVideo = document.getElementById("localVideo");
//     remoteVideo = document.getElementById("remoteVideo");
//     openChannel("openingRoom");
    
//     doGetUserMedia();
// }

// function createPeerConnection() 
// {
//     var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
//       // Create an RTCPeerConnection via the polyfill (adapter.js).
//       pc = new RTCPeerConnection(pc_config);
//       pc.onicecandidate = onIceCandidate;
//       console.log("Created RTCPeerConnnection with config:\n" + "  \"" +
//                   JSON.stringify(pc_config) + "\".");
// }

    
// socket.on("openChannel", function openChannel(channelToken) 
// {
//   console.log("Opening channel.");
//   console.log(channelToken);
//   socket = io.connect('https://' + document.domain + ':' + location.port + '/' + channelToken);
//   //var channel = new goog.appengine.Channel(channelToken);
// }

// // // var webrtc_capable = true;
// // // var rtc_peer_connection = null; // a pointer to RTCPeerConenction
// // // var rtc_session_description = null; // pointer to the browser specific implementation of the RTCSessionDescription constructor
// // // var get_user_media = null; // pointer to standard navigator
// // // var connect_stream_to_src = null; // a function that accepts a refernece to a MediaStream object and a reference to a html<video> element
// // // var stun_server = "stun.l.google.com:19302";  // holds a pointer to Google's public STUN server

// // // // var call_token; // unique token for this call
// // // // var signaling_server; // signaling server for this call
// // // // var peer_connection; // peerconnection object, represents the actual RTCPeerConnection that will be established between these two users

// // // // function start() {
// // // //      // create the WebRTC peer connection object
// // // //      peer_connection = new rtc_peer_connection({
// // // //       "iceServers": [
// // // //          { "url": "stun:"+stun_server }, // stun server info
// // // // ] });

// // // //  // handler to process new descriptions
// // // //   function new_description_created(description) 
// // // //   {
// // // //     //// Do something       
// // // // }

// // // //   // generic handler that sends any ice candidates to the other peer
// // // //      peer_connection.onicecandidate = function (ice_event) {
// // // //     //event handler and if ice_event contains a candidate then we serialize this into a JSON blob and send that to the other caller's browser through the signaling_server variable:         
// // // //  };


// // // //  // display remote video streams when they arrive
// // // //      peer_connection.onaddstream = function (event) {
// // // //         // This simply receives any new incoming video streams and connects them to a local <video> element within the local browser, so you can see and hear the person on the other end of the call. 
// // // // };

// // // // /*
// // // // Later, we set up our connection to the signaling server using the WebSocket API. This is generic, because this same type of connection is used by both the caller and the callee. It is essential that both are connected to the same signaling server in this basic example.
// // // //      // setup generic connection to the signaling server using the
// // // //   WebSocket API
// // // //      signaling_server = new WebSocket("ws://localhost:1234");
// // // //     */
    
// // // //   // handle signals as a caller
// // // //   function caller_signal_handler(event) {
// // // //      var signal = JSON.parse(event.data);
// // // //      if (signal.type === "callee_arrived") 
// // // //      {
// // // //       /// Do stuff
// // // //      } else if (signal.type === "new_ice_candidate") 
// // // //      {
// // // //       // Do stuff
// // // //      } else if (signal.type === "new_description") 
// // // //      {
// // // //  // Do stuff
// // // // } else {
// // // //       // extend with your own signal types here
// // // //      }
// // // // }


// // // // // handle signals as a callee
// // // //   function callee_signal_handler(event) {
// // // //      var signal = JSON.parse(event.data);
// // // //      if (signal.type === "new_ice_candidate") {
// // // //       // Do stuff
// // // //      } else if (signal.type === "new_description") {
// // // //  // Do stuff
// // // // } else {
// // // //       // extend with your own signal types here
// // // //      }
// // // //  }

// // // //   // setup stream from the local camera
// // // //   function setup_video() {
// // // //       get_user_media(
// // // //       {
// // // //          "audio": true, // request access to local microphone
// // // //          "video": true  // request access to local camera
// // // //       },
// // // //       function (local_stream) { // success callback
// // // //          // Do stuff
// // // // },
// // // //       log_error // error callback
// // // //      );
// // // // }

// // // //   // generic error handler
// // // //   function log_error(error) {
// // // //     // Do stuff       
// // // // }

// // // var socket = io.connect('https://' + document.domain + ':' + location.port + '/video');


// // // navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
// // // window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
// // // window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
// // // window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

// // // var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || 
// // //                         window.webkitRTCPeerConnection;
// // // var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;


// // // var localStream;
// // // var localVideo;
// // // var remoteVideo;
// // // var peerConnection;
// // // var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};



// // // function pageReady() {
// // //     localVideo = document.getElementById('localVideo');
// // //     remoteVideo = document.getElementById('remoteVideo');
    
// // //     // Socketio stuff
// // //     // serverConnection = new WebSocket('ws://127.0.0.1:3434');
// // //     // serverConnection.onmessage = gotMessageFromServer;

// // //     var constraints = {
// // //         video: true,
// // //         audio: true,
// // //     };

// // //     if(navigator.getUserMedia) {
// // //         navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
// // //     } else {
// // //         alert('Your browser does not support getUserMedia API');
// // //     }
// // // }



// // // function getUserMediaSuccess(stream) {
// // //     localStream = stream;
// // //     localVideo.src = window.URL.createObjectURL(stream);
// // //         peerConnection = new RTCPeerConnection(peerConnectionConfig);
// // //     peerConnection.onicecandidate = gotIceCandidate;
// // //     peerConnection.onaddstream = gotRemoteStream;
// // //     peerConnection.addStream(stream);
// // // }

// // // function getUserMediaError(error) {
// // //     console.log(error);
// // // }

// // // function start(isCaller) {


// // //     if(isCaller) {
// // //         peerConnection.createOffer(gotDescription, createOfferError);
// // //     }
// // // }

// // // function gotDescription(description) {
// // //     console.log('got description');
// // //     peerConnection.setLocalDescription(description, function () {
// // //         socket.emit("getMessage", JSON.stringify({'sdp': description}));
// // //     }, function() {console.log('set description error')});
// // // }

// // // function gotIceCandidate(event) {
// // //     if(event.candidate != null) {
// // //         socket.emit("getMessage", JSON.stringify({'ice': event.candidate}));
// // //     }
// // // }

// // // function gotRemoteStream(event) {
// // //     console.log("got remote stream");
// // //     remoteVideo.src = window.URL.createObjectURL(event.stream);
// // // }

// // // function createOfferError(error) {
// // //     console.log(error);
// // // }

// // // socket.on("getMessage", function (message) {
// // //     if(!peerConnection) start(false);

// // //     var signal = JSON.parse(message);
// // //     if(signal.sdp) 
// // //     {
// // //         peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
// // //             peerConnection.createAnswer(gotDescription, createAnswerError);
// // //         });
// // //     } else if(signal.ice) {
// // //         peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
// // //     }
// // // });

// // // // function gotMessageFromServer(message) {
// // // //     if(!peerConnection) start(false);

// // // //     var signal = JSON.parse(message.data);
// // // //     if(signal.sdp) 
// // // //     {
// // // //         peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
// // // //             peerConnection.createAnswer(gotDescription, createAnswerError);
// // // //         });
// // // //     } else if(signal.ice) {
// // // //         peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
// // // //     }
// // // // }


























// // var constraints = {audio: true, video: true};

// //  function successCallback(localMediaStream) {
// //   window.stream = localMediaStream; // stream available to console
// //   var video = document.getElementById("localVideo");
// //   video.src = window.URL.createObjectURL(localMediaStream);
// //   video.play();
// //  }

// //  function errorCallback(error){
// //   console.log("navigator.getUserMedia error: ", error);
// //  }

// //  navigator.getUserMedia(constraints, successCallback, errorCallback);

