<?php
//Header section of the document
//Contains all the meta and links to JavaScript files and Cascading Style Sheets
//When the page loads in a clients browser a function called geo_location(); is called.
//The function loads the maps, survey data and determines your location
echo "
<!DOCTYPE HTML>
<html>
<head>
<title>Beta Development</title>
<meta http-equiv='Content-Type' content='text/html;utf-8'>
<META NAME='description' CONTENT='Beta Development of a GIS application. The application illustrates how survey can be referenced with geocoordinates and sorted by date and time and surveyor name'>
<META NAME='keywords' CONTENT='GIS,Geographical Surveys'>
<META NAME='author' CONTENT='Matthew Lee'>
<META NAME='robots' CONTENT='follow index'>
<script type='text/javascript' src='functions.js'></script>
<script type='text/javascript' src='http://maps.googleapis.com/maps/api/js?key=AIzaSyBBzNhj22RF6mguCJB8sqz0NE9Uy4qwIis&sensor=true'></script>
<script type='text/javascript' src='survey_data.js'></script>
<link rel='stylesheet' type='text/css'  href='premier.css'>
</head><body onload=\"geo_location();\">";
//Main content of the document
//This section includes a brief outline of the project and instructions on how to add your data and survey location
//The division with the identifier 'location' contains details of a users location as an address and a series of coordinates
echo "
<div id='content'>
<div id='header'><img src='http://localhost/images/banner.jpg' alt='Beta Development from Premier Design and Software Solutions' width='900' height='167' border='0'>
</div><div style='margin-left:5px;margin-right:5px;'><div id='location'></div>";
//The divisions contain a series of instructions on how to input your survey data
//The data is loaded via an AJAX request and is called with the onCLick event handler.
//The code from lines 337 to 374 of the file named 'functions.js' is required to display data specific to each of the three instructional steps
echo "<div style=\"float:left;\"><span id=\"Development\" style=\"margin-top:0px;\" onMouseOver=\"slideshow('Development','0');\">Introduction</span><span id=\"Troubleshooting\" onMouseOver=\"slideshow('Troubleshooting','1');\">Step 1</span><span id=\"Design\" onMouseOver=\"slideshow('Design','2');\">Step 2</span><span id=\"Scripts\" onMouseOver=\"slideshow('Scripts','3');\">Step 3</span></div>";
echo "<div id=\"script_content\">This website is a demonstration of how Geographic Information Systems (GIS) can be used to relate spacial information about species abundance in relation to the individual or volunteer that has been collecting the data. It has a potential role in increasing the value of a conservation organisations website through adding value to the work undertaken by volunteers and could be developed further to relate data specific to a group or single species. The software has been developed to support the Practical Conservation Biology module of an Environmental Science BSC(Hons) Degree. If you wish to try the software please follow steps 1 to 3.</div>";
//Divisions designed to retain the Google maps and survey data referenced with geocordinates
echo "<div id='species_recorded' style='padding:5px;'></div>
<div id='map_canvas' style='width:438px;height:379px;border:1px solid #000000;'>
<div style='width:250px;margin-left:94px;height:100px;margin-top:90px;text-align:center;'>The map should load in about 30 seconds<br><a href='#' onClick='window.location.reload();return false;' style='text-decoration:underline;'>Click here</a> to reload the page</div></div>";
//The division with the identifier form receives it content via dynamic html
//Lines 47 to 70 of survey_data.js contain the code that is printed into the divisions by the function user_details();
//user_details() is called when the Google maps and XML data has been processed
//After a user enters their details the cotent of the divisions dynamically changes to allow an individual to enter their survey data
echo "<div id='form'></div>";
//Besides survey data existing as points on a map details of the most recent surveys are displayed within a table
//A hyperlink when clicked loads a new map which illustrates a surveyors location and lists the data collected
echo "<div class='title' style='border-bottom:0px;'><b>RECENT SURVEYS</b></div>";
//This snippet of PHP creates the table after the page has been requested
//It ensures that only one survey by any individual from any one location is listed
$news = array();
$fileName = "surveys.xml";
$xml = file_get_contents($fileName);
$xml_data = new SimpleXMLElement($xml);
echo "</div><table style='margin:0px 5px 5px 5px;font-size:10px;border-collapse:collapse;width:890px;'>";
foreach($xml_data->item as $entry){
$pubDate = $entry->time;
$editdate = substr($pubDate, 8,8);
$latitude = $entry->lat;
$longitude = $entry->long;
$location = $entry->location;
$title = $entry->name;
$secret_code = array("a_12", "b_12", "c_12", "d_12", "e_12");
$decode  = array( "'", "\"" ,">", "<" , "&");
$title = str_replace($secret_code, $decode, $title);
$location = str_replace($secret_code, $decode, $location);
$org = $entry->org;
$oldtime = $pubDate;
$time = strtotime($pubDate);
$pubDate = date('jS F Y',$time);
$news[] =  array( "title" => $title,"date" => $pubDate, "org" => $org, "lat" => $latitude, "long" => $longitude, "location" => $location, "old" => $oldtime);
}
$news = array_reverse($news);
$verify = array();
$number = 0;
foreach($news as $key => $edited_data){
$duplicate = $edited_data['title'] . $edited_data['lat'] . $edited_data['long'];
$check = array_search($duplicate,$verify,TRUE);        
if($check === FALSE){                                                          
if($number < 4){
$organisation = "";
$place_name = explode(",",$edited_data["location"]);
$org = stripos($edited_data['org'],"none");
if($org === FALSE){
$organisation = "from " . $edited_data['org'];}
echo "<tr><td class=\"intro\" style=\"border:1px solid #000000;margin:5px 0px 5px 0px;width:100px;\">$edited_data[date]</td><td style='border:1px solid #000000;padding-left:5px;'>$edited_data[title] $organisation surveyed in $place_name[0] 
</td><td class=\"click_button\" style=\"width:5%;border:1px solid #000000;background-color:#ffffff;\"><center><a href=\"#\" onClick=\"species_located('$edited_data[lat]','$edited_data[long]','$edited_data[location]','$edited_data[title]');return false;\" style=\"text-decoration:underline;color:#00d900;\">VIEW</a></center></td></tr>";
}
$number = $number + 1;
}
$verify[] = $edited_data['title'] . $edited_data['lat'] . $edited_data['long'];
}
echo "</table>"; 
echo "<div id='footer'></div></div></body></html>";
?>