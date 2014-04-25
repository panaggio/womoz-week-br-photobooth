(function() {

  var startbutton  = document.querySelector('#takephoto'),
      video        = document.querySelector('#video'),
      flash        = document.querySelector('#flash'),
      canvas       = document.querySelector('#canvas'),
      vidcontainer = document.querySelector('#videocontainer'),
      tabs         = document.getElementsByClassName('tab'),
      photo        = document.querySelector('#quadro'),
      timers       = $("span[id$='timer']");
      

  var ctx    = canvas.getContext('2d'),
     streaming    = false,
     width  = 606,
     height = 606,
     state  = 'intro';

 var audio = document.querySelectorAll('audio'),
     sounds = {
        shutter: audio[0],
        rip:     audio[1],
        takeoff: audio[2]
      };

  /* BRANDING */
  var img = new Image(),
      imgwidth = 606,
      imgheight = 606;
  img.src = 'media/images/frame.png';
    
  
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

  function takepicture(callback) {
    sounds.shutter.play();

    ctx.drawImage(video, 35, 77, 535, 402);
    ctx.restore();
    ctx.scale(1, 1);
    ctx.drawImage(img, 606 - imgwidth, 606 - imgheight, imgwidth, imgheight);

    if (callback)
      callback();
  }

function timer(time,update,complete) {
    var start = new Date().getTime();
    var interval = setInterval(function() {
        var now = time-(new Date().getTime()-start);
        if( now <= 0) {
            clearInterval(interval);
            complete();
        }
        else update(Math.floor(now/1000));
    },100); 
}


function shareOrRetake(){
  document.getElementById("timers").hidden = true;
}
  /* Event Handlers */


video.addEventListener('play', function(ev){
    if (!streaming) {
      console.log(video.clientHeight);
      finalheight = video.clientHeight / (video.clientWidth/width);
      video.setAttribute('width', 535);
      video.setAttribute('height', 470);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 606 - imgwidth, 606 - imgheight, imgwidth, imgheight);
      streaming = true;
      vidcontainer.classname = 'playing';
    }
  }, false);

startbutton.addEventListener('click', function(ev){
    if (state === 'intro'){ 
      setstate('picture');
      init();
    }

    if (state === 'reviewing'){
      setstate('picture');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 606 - imgwidth, 606 - imgheight, imgwidth, imgheight);
      
    }

    tabs[1].className = "tab tab-active";
    tabs[0].className = "tab tab-inactive";
    

  }, false);


shorttimer.addEventListener('click', function(ev){
  timers[1].hidden = true;
  timers[2].hidden = true;

  timer(3000,
    function(timeleft) { 
      timers[0].children[1].innerHTML = timeleft;
    },
    function() { 
      timers[1].hidden = false;
      timers[2].hidden = false;
      timers[0].children[1].innerHTML = "3 Seconds";
      setstate('reviewing');
      takepicture(shareOrRetake);
    }
  );
}, false);

mediumtimer.addEventListener('click', function(ev){
  timers[0].hidden = true;
  timers[2].hidden = true;

  timer(5000,
    function(timeleft) {
      timers[1].children[1].innerHTML = timeleft;
    },
    function() { 
      timers[0].hidden = false;
      timers[2].hidden = false;
      timers[1].children[1].innerHTML = "5 Seconds";
      takepicture();
    }
  );
}, false);

longtimer.addEventListener('click', function(ev){
  timers[0].hidden = true;
  timers[1].hidden = true;

  timer(10000, 
    function(timeleft) { 
       timers[2].children[1].innerHTML = timeleft;
    },
    function() { 
      timers[0].hidden = false;
      timers[1].hidden = false;
      timers[2].children[1].innerHTML = "10 Seconds";
      takepicture();
    }
  );
}, false);

 retake.addEventListener('click', function(ev){
  $('#takephoto').click();
}, false);

})();