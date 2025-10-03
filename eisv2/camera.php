<?php require_once('head.php'); ?>
<script src="js/jquery3.3.1.min.js"></script>
<script src="js/webcam.min.js"></script>
<center><a href="camera.php?user_id=<?php echo $_GET['user_id']; ?>">[Reload Camera]</a>
    <form name="camera" method="POST" action="add_attendance.php">
        <div class="row">
            <div class="col-md-6">
                <div class="grid-container">
  					<div class="item left-align"><input type=button value="1-Capture" id="Capture" onClick="take_snapshot()"></div>
  					<div class="item right-align"><button class="btn btn-success">2-Submit</button></div>
				</div>
                <br />
				<div id="results">*Note: If your picture is not automatically captured within 5 seconds, please click the 'Capture' button followed by the 'Submit' button</div>
                <div id="my_camera"></div>
                <input type="hidden" name="image" class="image-tag">
                <input type="hidden" name="user_id" value="<?php echo $_GET['user_id']; ?>" required />
            </div>
            <div class="col-md-6"></div>
            <div class="col-md-12 text-center"></div>
        </div>
    </form>
</div>
</center>  
<script language="JavaScript">
    Webcam.set({
        width: 480,
        height: 380,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
  
    Webcam.attach( '#my_camera' );
  
    function take_snapshot() {
        Webcam.snap( function(data_uri) {
            $(".image-tag").val(data_uri);
            document.getElementById('results').innerHTML = '<img src="'+data_uri+'"/>';
        } );
    }
	
setTimeout(function() {
    document.getElementById("Capture").click();
  }, 3500);
</script>
<?php require_once('footer.php'); ?>