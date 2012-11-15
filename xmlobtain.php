<?php
$filename = $_REQUEST["Filename"];
header('Last-Modified: '.gmdate('D, d M Y H:i:s', filemtime($filename)) .
' GMT');
if ($_SERVER['REQUEST_METHOD'] != "HEAD")
{
header('Content-Type: text/xml');
$myFile = fopen($filename,"r");
$contents = "";
while (feof($myFile) == FALSE){
$contents = $contents . fgets($myFile);
}
fclose($myFile);
print $contents;
}
?>