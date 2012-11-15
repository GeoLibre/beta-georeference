<?php
$fileName = $_REQUEST["fileName"];
$contents = $_REQUEST["contents"];
//Send the contents of the string to an array 
$myfile = fopen($fileName, "w");
$success = fwrite($myfile, stripslashes($contents));
fclose($myfile);
$File_contents = array();
$xs = file_get_contents($fileName);
$data = new SimpleXMLElement($xs);
foreach($data->xpath('//item') as $edit){
$secret_code = array("a_12", "b_12", "c_12", "d_12", "e_12");
$decode  = array( "'", "\"" ,">", "<" , "&");
$xml_docs = "<lat>". $edit->lat. "</lat><long>". $edit->long. "</long><location>" . $edit->location. "</location><name>". $edit->name. "</name><time>". $edit->time. "</time><org>". $edit->org. "</org>";
$contents = str_replace($secret_code, $decode, $xml_docs);
$File_contents[] = $contents;
}
//##########Create an editable XML file for SAFE HTML##########
$XML_FILE = "<data>";
//####Two arrays containing words that are not suitable for public consumption####
foreach($File_contents as $edited_data){
$contents = $edited_data;
$XML_FILE .= "<item>". $contents ."</item>";}
$XML_FILE .= "</data>";
$amp_data = array("&lt;","&rt;");
$new_data = array("<",">");
$XML_FILE = str_replace($amp_data, $new_data, $XML_FILE);
//Using Safe HTML to filter out unnecessary and intrusive elements
define(XML_HTMLSAX3, '');
require_once('classes/safehtml.php');
$safehtml = new HTML_safe();
$safe_data = $safehtml->parse($XML_FILE);
$safe =  $safe_data;
$safe_code = "<?xml version='1.0'?>" . $safe;
//Taking the new file back into an XML Object and sending to another array.
$new_contents = array();
$new_data = new SimpleXMLElement($safe_code);
foreach($new_data->xpath('//item') as $edit){
$refreshed_contents1 = str_replace($decode, $secret_code, $edit->lat);
$refreshed_contents2 = str_replace($decode, $secret_code, $edit->long);
$refreshed_contents3 = str_replace($decode, $secret_code, $edit->name);
$refreshed_contents4 = str_replace($decode, $secret_code, $edit->time);
$refreshed_contents5 = str_replace($decode, $secret_code, $edit->org);
$refreshed_contents6 = str_replace($decode, $secret_code, $edit->location);

$xml_docs = "<lat>". $refreshed_contents1. "</lat><long>". $refreshed_contents2. "</long><location>" . $refreshed_contents6. "</location><name>". $refreshed_contents3. "</name><time>". $refreshed_contents4. "</time><org>". $refreshed_contents5. "</org>";
$new_contents[] = $xml_docs;
}
//##########Create the file to be saved ##########
$XML = "<?xml version='1.0'?><data>";
foreach($new_contents as $edited_data){$XML .= "<item>". $edited_data ."</item>";}
$XML .= "</data>";
//Saving the modified file
$myfile = fopen($fileName, "w");
$success = fwrite($myfile, stripslashes($XML));
fclose($myfile);
?>