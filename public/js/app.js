

/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';
var lat;
var long;

/* globals MediaRecorder */

// const mediaSource = new MediaSource();
// mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
// let mediaRecorder;
// let recordedBlobs;
// let sourceBuffer;

// const errorMsgElement = document.querySelector('span#errorMsg');
// const recordedVideo = document.querySelector('video#recorded');
// const recordButton = document.querySelector('button#record');
// recordButton.addEventListener('click', () => {
//   if (recordButton.textContent === 'Start Recording') {
//     startRecording();
//   } else {
//     stopRecording();
//     recordButton.textContent = 'Start Recording';
//     playButton.disabled = false;
//     downloadButton.disabled = false;
//   }
// });

// const playButton = document.querySelector('button#play');
// playButton.addEventListener('click', () => {
//   const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
//   recordedVideo.src = null;
//   recordedVideo.srcObject = null;
//   recordedVideo.src = window.URL.createObjectURL(superBuffer);
//   recordedVideo.controls = true;
//   recordedVideo.play();
// });

// const downloadButton = document.querySelector('button#download');
// downloadButton.addEventListener('click', () => {
//   const blob = new Blob(recordedBlobs, {type: 'video/webm'});
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.style.display = 'none';
//   a.href = url;
//   a.download = 'test.webm';
//   document.body.appendChild(a);
//   a.click();
//   setTimeout(() => {
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   }, 100);
// });

// function handleSourceOpen(event) {
//   console.log('MediaSource opened');
//   sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
//   console.log('Source buffer: ', sourceBuffer);
// }

// function handleDataAvailable(event) {
//   if (event.data && event.data.size > 0) {
//     recordedBlobs.push(event.data);
//   }
// }

// function startRecording() {
//   recordedBlobs = [];
//   let options = {mimeType: 'video/webm;codecs=vp9'};
//   if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//     console.error(`${options.mimeType} is not Supported`);
//     errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
//     options = {mimeType: 'video/webm;codecs=vp8'};
//     if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//       console.error(`${options.mimeType} is not Supported`);
//       errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
//       options = {mimeType: 'video/webm'};
//       if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//         console.error(`${options.mimeType} is not Supported`);
//         errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
//         options = {mimeType: ''};
//       }
//     }
//   }

//   try {
//     mediaRecorder = new MediaRecorder(window.stream, options);
//   } catch (e) {
//     console.error('Exception while creating MediaRecorder:', e);
//     errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
//     return;
//   }

//   console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
//   recordButton.textContent = 'Stop Recording';
//   playButton.disabled = true;
//   downloadButton.disabled = true;
//   mediaRecorder.onstop = (event) => {
//     console.log('Recorder stopped: ', event);
//   };
//   mediaRecorder.ondataavailable = handleDataAvailable;
//   mediaRecorder.start(10); // collect 10ms of data
//   console.log('MediaRecorder started', mediaRecorder);
// }

// function stopRecording() {
//   mediaRecorder.stop();
//   console.log('Recorded Blobs: ', recordedBlobs);
// }

// function handleSuccess(stream) {
//   recordButton.disabled = false;
//   console.log('getUserMedia() got stream:', stream);
//   window.stream = stream;

//   const gumVideo = document.querySelector('video#gum');
//   gumVideo.srcObject = stream;
// }

// async function init(constraints) {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     handleSuccess(stream);
//   } catch (e) {
//     console.error('navigator.getUserMedia error:', e);
//     errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
//   }
// }

// document.querySelector('button#start').addEventListener('click', async () => {
//   const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
//   const constraints = {
//     video: true, audio: true
//   };
//   console.log('Using media constraints:', constraints);
//   await init(constraints);
// });
document.querySelector('#getUserMediaButton').addEventListener('click', onGetUserMediaButtonClick);
  document.querySelector('#grabFrameButton').addEventListener('click', onGrabFrameButtonClick);
  document.querySelector('#takePhotoButton').addEventListener('click', onTakePhotoButtonClick);

var imageCapture;

function onGetUserMediaButtonClick() {
  navigator.mediaDevices.getUserMedia({video: true})
  .then(mediaStream => {
    document.querySelector('video').srcObject = mediaStream;

    const track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);
  })
  .catch(error => ChromeSamples.log(error));
}

function onGrabFrameButtonClick() {
  // imageCapture.grabFrame()
  // .then(imageBitmap => {
  //   const canvas = document.querySelector('#grabFrameCanvas');
  //   drawCanvas(canvas, imageBitmap);

  // })
  // .catch(error => ChromeSamples.log(error));
  navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
  });
  Tesseract.recognize(mirror).then(function(result){
    console.log(result.text);
    alert(result.text);
    

    console.log(lat , long );
    $.ajax({
      type: "POST",
      url: "http://10.193.154.69:3001/api/putData",
      data: {
        id: "brand-name",
        message: result.text,
        lat: lat,
        long: long
      },
      success : function() {
        console.log('hi');
        fetch('http://10.193.154.69:3001/api/getData')
         .then(function(response) {
           $('.overlay').css({"visibility":"visible","opacity":"1"}) 
         })
      }
    });
   
    });
}

function onTakePhotoButtonClick() {
  imageCapture.takePhoto()
  .then(blob => createImageBitmap(blob))
  .then(imageBitmap => {
    const canvas = document.querySelector('#takePhotoCanvas');
    drawCanvas(canvas, imageBitmap);
    console.log(imageBitmap);
    var mirror = document.getElementById('mirror');
    mirror.src=canvas.toDataURL('image/png');
    canvas.style.display = "none";
    
        

  })
  .catch(error => ChromeSamples.log(error));
}

/* Utils */

function drawCanvas(canvas, img) {
  canvas.width = getComputedStyle(canvas).width.split('px')[0];
  canvas.height = getComputedStyle(canvas).height.split('px')[0];
  let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
  let x = (canvas.width - img.width * ratio) / 2;
  let y = (canvas.height - img.height * ratio) / 2;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
      x, y, img.width * ratio, img.height * ratio);
}

  document.querySelector('video').addEventListener('play', function() {
  document.querySelector('#grabFrameButton').disabled = false;
  document.querySelector('#takePhotoButton').disabled = false;
 
});

// var takePhotoCanvas = document.getElementById('takePhotoCanvas'),
//     ctx = takePhotoCanvas.getContext('2d'),
//     mirror = document.getElementById('mirror');


//     takePhotoCanvas.width = mirror.width = window.innerWidth;
//     takePhotoCanvas.height = mirror.height = window.innerHeight;

    

//     mirror.addEventListener('contextmenu', function (e) {
//       var dataURL = document.getElementById('takePhotoCanvas').toDataURL('image/png');
//       mirror.src = dataURL;
//   });






const applicationServerPublicKey = 'BJe_XET3kiXsL6S47QN4BAQbf4x22j348E_YgyTb95HVfOq1Q4e9etdazwVvk8deL7tbDtWYGLbxyAqsOxG3Kj8';
 
const pushButton = document.querySelector('.js-push-btn');
 
let isSubscribed = false;
let swRegistration = null;
 
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
 

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');
 
  navigator.serviceWorker.register('http://localhost:3000/js/serviceWorker.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);
 
    swRegistration = swReg;
    initializeUI();
 
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
 
function initializeUI() {
 subscribeUser();
 
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);
 
    updateSubscriptionOnServer(subscription);
 
    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }
 
    updateBtn();
  });
}
 
function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }
 
  pushButton.disabled = false;
}
 
function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');
 
    updateSubscriptionOnServer(subscription);
 
    isSubscribed = true;
 
    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}
 
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server
 
  const subscriptionJson = document.querySelector('.js-subscription-json');
 const subscriptionDetails =
    document.querySelector('.js-subscription-details');
 
  // if (subscription) {
  //   subscriptionJson.textContent = JSON.stringify(subscription);
  //   //subscriptionDetails.classList.remove('is-invisible');
  // } else {
  //   //subscriptionDetails.classList.add('is-invisible');
  // }
}