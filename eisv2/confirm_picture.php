<?php 
    $img = $_POST['image'];
    $folderPath = "upload/";
	$user_id = $_POST['user_id'];
	$table3_id = $_POST['table3_id'];
	$action = $_POST['action'];$image_parts = explode(";base64,", $img);
    $image_type_aux = explode("image/", $image_parts[0]);
    $image_type = $image_type_aux[1];

    $image_base64 = base64_decode($image_parts[1]);
    $fileName = uniqid() . '.png';

    $file = $folderPath . $fileName;
    file_put_contents($file, $image_base64); 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<title></title>
</head>

<body>
<h3>Confirm Image</h3>
<form method="get" action="edit_attendance.php" name="editattendance" id="editattendance">
<input type="hidden" name="user_id" value="<?php echo $user_id?>" />
<input type="hidden" name="table3_id" value="<?php echo $table3_id ?>" />
<input type="hidden" name="action" value="<?php echo $action; ?>" />
<input type="hidden" name="image4" value="<?php print_r($fileName); ?>" />
<p align="center"><img src="upload/<?php print_r($fileName); ?>" width="300px" /></p>
<p align="center"><input name="action" onclick="window.history.go(-1); return false;" type="button" value="Retake Picture"/></p>
<p align="center">
<input type="submit" value="CONTINUE" id="continue" /></p>
</form>
<script type="text/javascript">
<!--
   var wait=setTimeout("document.editattendance.submit();",5);
//-->
</script>
</body>
</html>