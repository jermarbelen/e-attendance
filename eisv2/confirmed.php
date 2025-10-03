<?php date_default_timezone_set('Asia/Manila'); ?>
<meta http-equiv="refresh" content="10; url=index.php" />
<?php require_once('head.php'); ?>
<center>
<p><?php echo date('D jS M Y T'); ?></p>
<h1><div id="time"></div></h1>
<p>Success!</p>
<a href="index.php"><button>HOME</button></a>
<!--<input name="action" onclick="window.history.go(-4); return false;" type="button" value="Back"/>-->
</center>
<?php require_once('footer.php'); ?>