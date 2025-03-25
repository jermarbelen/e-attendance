<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"
$hostname_con29 = "172.16.32.29";
$database_con29 = "database";
$username_con29 = "external";
$password_con29 = "M1m@r0p@";
$con29 = mysql_pconnect($hostname_con29, $username_con29, $password_con29) or trigger_error(mysql_error(),E_USER_ERROR); 
?>