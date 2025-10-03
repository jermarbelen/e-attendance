
  </div>
</div> 

<div class="w3-cell-row">
  <div class="w3-cell w3-container">
&nbsp;
  </div>
</div> 

<script>
closeSidebar();
function openSidebar() {
  document.getElementById("mySidebar").style.display = "block";
}

function closeSidebar() {
  document.getElementById("mySidebar").style.display = "none";
}

function getFocus() {
  document.getElementById("user_id").focus();
}

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  	document.getElementById('time').textContent = timeString;
    }
    updateTime();
    setInterval(updateTime, 1000);

var x = document.getElementById("gps");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else { 
    x.innerHTML = "Reporting to office premises (not supported)";
  }
}

function showPosition(position) {
  x.innerHTML = "" + position.coords.latitude + 
  "," + position.coords.longitude;
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "Reporting to office premises"
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Reporting to office premises (GPS unavailable)"
      break;
    case error.TIMEOUT:
      x.innerHTML = "Reporting to office premises (Timed out)"
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "Reporting to office premises (No GPS support)"
      break;
  }
}
</script>
</body>
</html>