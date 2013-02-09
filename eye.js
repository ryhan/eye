var smoother = new Smoother(0.85, [0, 0, 0, 0, 0]);
  
$(window).load(function() {

  var video = $("#video").get(0);

  try {
    compatibility.getUserMedia({video: true}, function(stream) {
      try {
        video.src = compatibility.URL.createObjectURL(stream);
      } catch (error) {
        console.log(stream);
        video.src = stream;
      }
      video.play();
      compatibility.requestAnimationFrame(tick);
    }, function (error) {
      alert(error);
      alert("WebRTC not available");
    });
  } catch (error) {
    alert(error);
  }

  function tick() {
    compatibility.requestAnimationFrame(tick);
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      $(video).objectdetect("all", {scaleMin: 3, scaleFactor: 1.1, classifier: objectdetect.frontalface}, function(coords) {
        if (coords[0]) {
          coords = smoother.smooth(coords[0]);
          console.log(coords);
        } else {
          console.log("none");
        }
      });
    }
  }

});