<?php require_once('../Connections/connection.php'); ?>
<?php require_once('../Connections/con29.php'); ?>
<?php date_default_timezone_set('Asia/Manila'); ?>
<?php
if (!function_exists("GetSQLValueString")) {
function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") 
{
  if (PHP_VERSION < 6) {
    $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
  }

  $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

  switch ($theType) {
    case "text":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;    
    case "long":
    case "int":
      $theValue = ($theValue != "") ? intval($theValue) : "NULL";
      break;
    case "double":
      $theValue = ($theValue != "") ? doubleval($theValue) : "NULL";
      break;
    case "date":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;
    case "defined":
      $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
      break;
  }
  return $theValue;
}
}

mysql_select_db($database_connection, $connection);
$query_rstable3 = "SELECT * FROM table3 WHERE tb3_colunm1 = '".$_GET['user_id']."' AND tb3_colunm2 = '".$_GET['date']."'";
$rstable3 = mysql_query($query_rstable3, $connection) or die(mysql_error());
$row_rstable3 = mysql_fetch_assoc($rstable3);
$totalRows_rstable3 = mysql_num_rows($rstable3);

mysql_select_db($database_con29, $con29);
$query_rsusers = "SELECT * FROM users_tb WHERE user_id = '".$_GET['user_id']."'";
$rsusers = mysql_query($query_rsusers, $con29) or die(mysql_error());
$row_rsusers = mysql_fetch_assoc($rsusers);
$totalRows_rsusers = mysql_num_rows($rsusers);
?>

<?php require_once('head.php'); ?>
<center>
	<div class="grid-container">
		<div class="item left-align"><b>TIME: <?php echo date('g:i A') ?></b></div>
  		<div class="item right-align"><?php echo $row_rstable3['tb3_colunm2']; ?></div>
	</div>
<hr>
<?php if ($totalRows_rstable3 == 0 && $row_rsusers['user_id'] == NULL) { ?>
Sorry we cant find your ID. Please try again <a href="index.php">here</a> or <br/> if its your first time seeing this page, please create your account <a href="add_account.php?group=2">here</a>.
    <!--Please enter your username below to update your account.
    <form action="edit_account.php" method="get">
    	<input type="text" name="username" value="" placeholder="RDATS Username" required />
        <input type="submit" value="Go" />
    </form>-->
<?php } elseif ($totalRows_rstable3 == 0 && $row_rsusers['user_id'] != NULL) { ?>
	<h3>You haven't attended today<br/>
    <a href="camera.php?user_id=<?php echo $_GET['user_id'] ?>"><button class="button-81">Click here to attend</button></a></h3>
<?php } else { ?>
<table border="0" cellspacing="0" cellpadding="3" align="center">
  <tr>
    <th>Attend</th>
    <th>OUT</th>
    <th>IN</th>
    <th>Leave</th>
  </tr>
  <?php //do { ?>
  <tr align="center">
    <td><button class="button-81"><?php echo $row_rstable3['tb3_colunm3']; ?></button></td>
    <td><?php if ($row_rstable3['tb3_colunm4'] == NULL) { ?><a href="edit_attendance.php?table3_id=<?php echo $row_rstable3['table3_id']; ?>&action=OUT" title="click here to OUT"><input type="button" value="OUT" class="button-81" role="button" /></a><?php } else { ?><button class="button-81"><?php echo $row_rstable3['tb3_colunm4']; ?></button><?php } ?></td>
    <td><?php if ($row_rstable3['tb3_colunm5'] == NULL) { ?><a href="edit_attendance.php?table3_id=<?php echo $row_rstable3['table3_id']; ?>&action=IN" title="click here to IN"><input type="button" value="IN" class="button-81" role="button" /></a><?php } else { ?><button class="button-81"><?php echo $row_rstable3['tb3_colunm5']; ?></button><?php } ?></td>
    <td><?php if ($row_rstable3['tb3_colunm6'] == NULL) { ?><a href="camera_edit.php?table3_id=<?php echo $row_rstable3['table3_id']; ?>&action=Leave" title="click here to Leave"><input type="button" value="LEAVE" class="button-81" role="button" /></a><?php } else { ?><button class="button-81"><?php echo $row_rstable3['tb3_colunm6']; ?></button><?php } ?></td>
  </tr>
  <?php //} while ($row_rstable3 = mysql_fetch_assoc($rstable3)); ?>
</table>
<?php } ?>
</center>
<hr>
<form action="print_dtr.php">
	<label>Select DTR Date:</label>
    <input type="text" name="date" value="<?php echo date('Y-m') ?>" />
    <input type="submit" value="View" />
    <input type="hidden" name="user_id" value="<?php echo $_GET['user_id'] ?>" />
</form>
<?php require_once('footer.php'); ?>
<?php
mysql_free_result($rstable3);

mysql_free_result($rsusers);
?>