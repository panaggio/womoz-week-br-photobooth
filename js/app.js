(function() {

  var startbutton  = document.querySelector('#takephoto'),
      video        = document.querySelector('#video'),
      cover        = document.querySelector('#cover'),
      canvas       = document.querySelector('#canvas'),
      vidcontainer = document.querySelector('#videocontainer'),
      tabs         = document.getElementsByClassName('tab');

  var ctx    = canvas.getContext('2d'),
     streaming    = false,
     width  = 800,
     height = 600,
     state  = 'intro';

 var audio = document.querySelectorAll('audio'),
     sounds = {
        shutter: audio[0],
        rip:     audio[1],
        takeoff: audio[2]
      };
  
  setstate(state);

  function init() {
    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
        }
        video.play();
        video.style.width = width + 'px';
        video.style.height = height + 'px';
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );
  }

  
 function setstate(newstate) {
    state = newstate;
    document.body.className = newstate;
  }

  /* Event Handlers */
video.addEventListener('play', function(ev){
    if (!streaming) {
      console.log(video.clientHeight);
      finalheight = video.clientHeight / (video.clientWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', finalheight);
      canvas.width = width;
      canvas.height = finalheight;
      ctx.drawImage(img, 590 - imgwidth, 440 - imgheight, imgwidth, imgheight);
      streaming = true;
      vidcontainer.classname = 'playing';
    }
  }, false);

startbutton.addEventListener('click', function(ev){
    if (state === 'intro'){ 
      setstate('picture');
      init();
    }

    tabs[1].className = "tab tab-active";
    tabs[0].className = "tab tab-inactive";
    

  }, false);


})();