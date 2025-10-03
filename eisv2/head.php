<!DOCTYPE html>
<html>
<title>DENREIS V2</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../assets_files/w3pro.css">
<link rel="stylesheet" href="../assets_files/w3-theme-teal.css">
<style>
<!-- HTML !-->
/* CSS */
.button-81 {
  background-color: #fff;
  border: 0 solid #e2e8f0;
  border-radius: 1.5rem;
  box-sizing: border-box;
  color: #0d172a;
  cursor: pointer;
  display: inline-block;
  font-family: "Basier circle",-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1;
  padding: 1rem 1.6rem;
  text-align: center;
  text-decoration: none #0d172a solid;
  text-decoration-thickness: auto;
  transition: all .1s cubic-bezier(.4, 0, .2, 1);
  box-shadow: 0px 1px 2px rgba(166, 175, 195, 0.25);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-81:hover {
  background-color: #1e293b;
  color: #fff;
}

@media (min-width: 768px) {
  .button-81 {
    font-size: 1.125rem;
    padding: 1rem 2rem;
  }
}

input[type="text"].large-input {
  width: 100%;
  max-width: 400px;     /* Limit how wide it gets */
  font-size: 1.5rem;    /* Larger font size */
  padding: 1rem;        /* More padding for height */
  border: 2px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease;

  /* Optional: shadow effect */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

input[type="text"].large-input:focus {
  border-color: #007BFF; /* Blue border on focus */
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
}

.left-align {
  text-align: left;
}
.right-align {
  text-align: right;
}
</style>
<body onload="getFocus();getLocation();" style="max-width:600px">
<nav class="w3-sidebar w3-bar-block w3-card" id="mySidebar">
<div class="w3-container w3-theme-d2">
  <span onclick="closeSidebar()" class="w3-button w3-display-topright w3-large">X</span>
  <br>
  <div class="w3-padding w3-center">
    <img class="w3-circle" src="../images/logo2.png" alt="DENR4B" style="width:75%">
  </div>
</div>
<a class="w3-bar-item w3-button" href="index.php">Attendance</a>
<a class="w3-bar-item w3-button" href="https://drive.google.com/drive/folders/1ITulO2dGw7elayHtLVU476MxCg62hWom?usp=sharing" target="_blank">User Manual</a>
<a class="w3-bar-item w3-button" href="http://27.110.165.6:9229/denr/eis/register.php" target="_blank">Sign Up</a>
</nav>

<header class="w3-bar w3-card w3-theme">
  <button class="w3-bar-item w3-button w3-xxxlarge w3-hover-theme" onclick="openSidebar()">&#9776;</button>
  <h1 class="w3-bar-item">Attendance</h1>
</header>
<div class="w3-container">
<hr>
<div class="w3-cell-row">
  <div class="w3-cell w3-container">