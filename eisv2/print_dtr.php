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
$query_rstable3 = "SELECT * FROM table3 WHERE tb3_colunm1 = '".$_GET['user_id']."' AND tb3_colunm2 LIKE '%".$_GET['date']."%' ORDER BY tb3_colunm2 ASC";
$rstable3 = mysql_query($query_rstable3, $connection) or die(mysql_error());
$row_rstable3 = mysql_fetch_assoc($rstable3);
$totalRows_rstable3 = mysql_num_rows($rstable3);

mysql_select_db($database_con29, $con29);
$query_rsusers = "SELECT * FROM users_tb WHERE user_id = '".$_GET['user_id']."'";
$rsusers = mysql_query($query_rsusers, $con29) or die(mysql_error());
$row_rsusers = mysql_fetch_assoc($rsusers);
$totalRows_rsusers = mysql_num_rows($rsusers);

?>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
<title>DTR - <?php echo $row_rsusers['firstname']; ?> <?php echo date('F Y', strtotime($_GET['date'])); ?></title>
<style>
table {
	font-family:Verdana, Geneva, sans-serif;
	font-size: 0.775em;
}
.bg-image {
  background-image: url("../images/bg-logo.png");
  height: 800px;
  width: 800px;
  background-position: center;
  background-repeat: no-repeat;
}
#more {display: none;}
</style>
<script src="../plugins/qrlogo/dist/easy.qrcode.min.js" type="text/javascript" charset="utf-8"></script>
</head>

<body>
<table width="800" border="0" cellspacing="0" cellpadding="5" align="center">

  <tr>
    <td><a href="#" onclick="window.history.go(-1); return false;"><img src="../images/bd_prevpage.png" alt="BACK" title="BACK"></a> <a href="javascript:window.print()"><img src="../images/b_print.png" alt="PRINT" title="PRINT"></a></td>
    <td colspan="3">&nbsp;</td>
    <td rowspan="4" width="200px" align="right" valign="top"><div title="qrlogo" id="container"></div></td>
  </tr>
  <tr>
    <td><font size="-2">RUNDATE <?php echo date("Y.m:d"); ?><br>
RUNTIME <?php echo date("h:i:sa"); ?> </font></td>
    <th colspan="3"><?php echo $clientfullname;?></th>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <th colspan="3"><?php echo $clientbranch;?></th>
  </tr>
  <tr>
    <td width="220">Name:</td>
    <td witth="400px"><b><font size="+1"><?php echo $row_rsusers['firstname']; ?> <?php echo $row_rsusers['middlename']; ?> <?php echo $row_rsusers['lastname']; ?></b></td>
    <td>&nbsp;</td>
    <td><a href="javascript:window.print()"></a></td>
  </tr>
  <tr>
    <td>Employee TIN No:</td>
    <td><b><?php echo $_GET['user_id'] ;?></b></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Position:</td>
    <td><b><?php echo $row_rsusers['designation']; ?></b></td>
    <td></td>
    <td>Division:</td>
    <td><b><?php echo $row_rsusers['division']; ?></b></td>
  </tr>
  <tr>
    <td>Daily Time Record for the period</td>
    <td><b><?php echo date('F Y', strtotime($_GET['date'])); ?></b></td>
    <td></td>
    <td>Machine ID:</td>
    <td>E-Attendance</td>
  </tr>
  <tr>
    <td colspan="5">  
<table class="bg-image" cellspacing="0" border="1" width="800px">
	<tr align="center" valign="middle">
		<td colspan="2"></td>
		<td colspan="2">Morning</td>
		<td colspan="2">Afternoon</td>
		<td rowspan="2">LOW</td>
		<td rowspan="2">OT</td>
		<td rowspan="2">UT</td>
		<td rowspan="2">LT</td>
		<td rowspan="2">Total</td>
		<td colspan=3>Others</td>
		</tr>
	<tr align="center" valign="middle">
		<td>Date</td>
		<td>Day</td>
		<td>In</td>
		<td>Out</td>
		<td>In</td>
		<td>Out</td>
		<td>Remarks</td>
		<td></td>
		<td></td>
	</tr>
	<?php do { ?>
    <tr align="center" valign="top">
		<td><?php echo date('d', strtotime($row_rstable3['tb3_colunm2'])); ?></td>
		<td><?php echo date('D', strtotime($row_rstable3['tb3_colunm2'])); ?></td>
		<td><?php echo $row_rstable3['tb3_colunm3']; ?></td>
		<td><?php echo $row_rstable3['tb3_colunm4']; ?></td>
		<td><?php echo $row_rstable3['tb3_colunm5']; ?></td>
		<td><?php echo $row_rstable3['tb3_colunm6']; ?></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td><?php //echo nl2br($row_rstable3['tb3_colunm7']); ?><?php //echo nl2br($row_rstable3['tb3_colunm8']); ?></td>
		<td><a href="#"><img src="upload/<?php echo $row_rstable3['tb3_colunm9']; ?>" width="60px" /></a></td>
		<td><a href="#"><img src="upload/<?php echo $row_rstable3['tb3_colunm13']; ?>" width="60px" /></a></td>
	</tr>
    <?php } while ($row_rstable3 = mysql_fetch_assoc($rstable3)); ?>
</table>
</td>
  </tr>
  <tr align="right">
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td><font size="-2">Printed: <?php echo $row_rsusers['username']; ?></font></td>
  </tr>
  <tr>
    <td>T O T A L</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><u>FORM 3333</u></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td colspan="5">I certify that the entries on this record, which were made by myself daily at the time of arrival and departure from office are true and correct.</td>
  </tr>
  <tr>
    <td>
    <br/>
    <br/>
    <br/>
    </td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td colspan="5">
    <table cellspacing="0" border="0" width="800px">
  <tr align="center">
    <td style="border-top: 1px solid #000000" width="350px">Employee's Signature</td>
    <td>&nbsp;</td>
    <td style="border-top: 1px solid #000000" width="350px">Authorized Official</td>
  </tr>
  </table>
    </td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr align="center">
    <td colspan="5" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000"><br/>
    REMINDER : Please return within five (5) days together with the required signed officials documents.<br/>&nbsp;
    </td>
  </tr>
</table>
<script type="text/template" id="qrcodeTpl">
    <div class="imgblock">
				<div class="title">{title}</div>
				<div class="qr" id="qrcode_{i}"></div>
			</div>
		</script>
  <script type="text/javascript">
    var demoParams = [
      {
        title: "",
        config: {
          text: "http://172.16.32.14/denr/eisv2/print_dtr.php?date=<?php echo $_GET['date']; ?>&user_id=<?php echo $_GET['user_id'] ;?>",

          width: 100,
          height: 100,
          quietZone: 0,
          colorDark: "#000000",
          colorLight: "#ffffff",

          //PI: '#f55066',

          correctLevel: QRCode.CorrectLevel.H // L, M, Q, H
        }
      }
    ]
    var qrcodeTpl = document.getElementById("qrcodeTpl").innerHTML;
    var container = document.getElementById('container');

    for (var i = 0; i < demoParams.length; i++) {
      var qrcodeHTML = qrcodeTpl.replace(/\{title\}/, demoParams[i].title).replace(/{i}/, i);
      container.innerHTML += qrcodeHTML;
    }
    for (var i = 0; i < demoParams.length; i++) {
      var t = new QRCode(document.getElementById("qrcode_" + i), demoParams[i].config);
    }
  </script>
</body>
</html>
<?php
mysql_free_result($rstable3);

mysql_free_result($rsusers);
?>