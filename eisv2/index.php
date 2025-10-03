<?php date_default_timezone_set('Asia/Manila'); ?>
<?php require_once('head.php'); ?>
<div style="background-image: url('../images/logo4.png');background-size: 100%; background-position: center; background-repeat: no-repeat;">
<center>
<br />
<br />
<br />
<br />
	<div style="background: rgba(255, 255, 255, 0.8);">
    <form name="login" method="get" action="view_attendance.php" accept-charset="utf-8">
        <h4>TIN Number</h4>
			<input type="text" name="user_id" id="user_id" class="large-input" placeholder="" size="32" autofocus required >
		<!--<label for="password">Pin/Password</label>
			<input type="pin" name="pin" placeholder="PIN" required>-->
			<input type="hidden" name="date" value="<?php echo date('Y-m-d') ?>">
            <br />
            <br />
          	<input type="submit" class="button-81" value="CONTINUE">
	</form>
		<h4><?php echo date('D jS M Y T'); ?></h4>
		<h1><div id="time"></div></h1>
	</div>
<br />
<br />
<br />
<br />      
</center>
</div>
<p><b>Note:</b> Starting September 11, 2023, monday, we are introducing a temporary digital attendance system. This is not same with online attendance and is only accesible tru denr local network (DENR4b). <a href="https://drive.google.com/drive/folders/1702WDyx2XiEjtKpECFGXbhe3EKHPp95M">Click here to view system advisories</a>. Thank you.</p>
<p>For questions, please read our <a href="https://drive.google.com/drive/folders/1ITulO2dGw7elayHtLVU476MxCg62hWom?usp=sharing" target="_blank"><input type="button" value="USER MANUAL" /></a> or contact RICT unit</p>
<?php require_once('footer.php'); ?>
