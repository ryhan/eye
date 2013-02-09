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

  is_on_left = 0;
  is_on_right = 0;
  cant_see = 0;
  left_threshold = 250;
  right_threshold = 250;

  wait_threshold = 5;

  function tick() {
    compatibility.requestAnimationFrame(tick);
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      $(video).objectdetect("all", {scaleMin: 3, scaleFactor: 1.1, classifier: objectdetect.frontalface}, function(coords) {
        if (coords[0]) {
          coords = smoother.smooth(coords[0]);

          if (coords[2] > left_threshold){
            is_on_left++;
          }
          if (coords[2] < right_threshold){
            is_on_right++;
          }
          if (is_on_left == wait_threshold){
            $('.eye').animate({left: '-300px'}, 1000);
            is_on_right = 0;
          }
          if (is_on_right == wait_threshold){
            $('.eye').animate({left: '300px'}, 1000);
            is_on_left = 0;
          }
          $('.cansee').hide();
          
          console.log("score :" + coords[2] + ", right: " + is_on_right + ", left: " + is_on_left);
        }else{

          cant_see++;
          if (cant_see == wait_threshold){
            $('.eye').animate({left: '0px'}, 1000);
            $('.cansee').show();
            cant_see = 0;
          }
          console.log("can't see you!");
        }
      });
    }
  }

});