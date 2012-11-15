var geocoder;
function change_marker(location,map){
newAddress(location);
        }

function newAddress(results) {
   var location = results.toString();
	var result = location.split(',');
	var result_latitude = result[0].split('(');
	var result_longitude = result[1].split(')');
	var cookie = "cod=" + result_latitude[1] + ":" + result_longitude[0];
	document.cookie = cookie;
     geo_locator();  
      }
	  
function geo_location(){
window.document.getElementById('location').innerHTML = " ";
if (navigator.geolocation) {  
 navigator.geolocation.getCurrentPosition(function(position) {
var test = WM_readCookie("cod");
if(test == 'none'){
var cookie = "cod=" + position.coords.latitude + ":" + position.coords.longitude;
document.cookie = cookie;}
geo_locator();  
}); 
 
} else {  
  alert("I'm sorry, but geolocation services are not supported by your browser.");  
}}

function geo_locator(){
window.document.getElementById("species_recorded").innerHTML = '';
read_function('surveys.xml', "GET",function(){if(request.readyState == 4)
{if(request.status == 200){var last_modified = request.getResponseHeader("Last-Modified");
var last_modified_date = new Date(last_modified);showmap(request.responseXML);
}}});
}

function showmap(xml_data){
var new_lat = WM_readCookie('cod');
var display = new_lat.split(':');
var new_lat = shorten(display[0]);
var new_long = shorten(display[1]);
var location = "latitude " + new_lat + " longitude " + new_long;
initialize(xml_data,display[0],display[1],location);
} 

function shorten(number){
var changes = number.substring(0,6);
return changes;
}

function more(latlng,location){
geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
		 var locality = results[1].formatted_address.toString();
		 locality = locality.replace(/3D/,"");
        var cookie = "location=" + locality;
		var cookie = escape(cookie)+ ";";
		var loci = results[1].formatted_address.toString();
		var loci = loci.split(',');
		document.cookie = cookie;
          var located = "<div style='float:right;width:280px;'>" + location + "</div>" + results[1].formatted_address;
          window.document.getElementById('location').innerHTML = located;
//search_engine(loci[0]);
  }});
}

function search_engine(located){
 search_function(located, "GET",function(){
		if(request.readyState == 4)
{if(request.status == 200){
var elemental = request.responseText;
window.document.getElementById("footer").innerHTML = elemental;
}}});   
 }
 
function initialize(xml_data,p1,p2,location) {

	geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(p1,p2);
   
more(latlng,location);

	 
	 var myOptions = {
      zoom: 14,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };  
	
  var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
	
	var marker = new google.maps.Marker({
    position: latlng,
    title:"You are here"
});
	
marker.setMap(map);
//
google.maps.event.addListener(map, 'click', function(event) {
            var location = event.latLng;
            change_marker(location,map);
        });
//
var already_added = new Array(); 
var feed_content = getItems(xml_data,"data");
var photo_content = feed_content.reverse();
for(var loop = 0; loop < photo_content.length; loop++){
var this_photo = photo_content[loop];
var new_latitude = getFirstValue(this_photo,"lat");
var new_longitude = getFirstValue(this_photo,"long");
var user = getFirstValue(this_photo,"name");
var user = legal_symbols(user);
var this_date = getFirstValue(this_photo,"time");
var modified_Date = this_date.substring(5,22);
if(navigator.userAgent.indexOf("Chrome") != -1){
	var modified_Date = this_date.substring(5,16);
}
var address = getFirstValue(this_photo,"location");
var address = legal_symbols(address);
address = address.replace(/3D/,"");
var name = new_latitude + new_longitude + user;
var strings_attached = already_added.toString();
if(strings_attached.indexOf(name) == -1){
already_added.push(name);
var latlng = new google.maps.LatLng(new_latitude,new_longitude);
var details = user + " " + modified_Date;
var image = 'images/bullet.gif';
var marker = new google.maps.Marker({
    position: latlng,
    title: details,
	icon: image
});
add_listener(marker,new_latitude,new_longitude,address,user,map);
}
}

user_details(p1,p2);

}

function add_listener(marker,new_latitude,new_longitude,address,user,map){
google.maps.event.addListener(marker, 'click', function() {
species_located(new_latitude,new_longitude,address,user);});
marker.setMap(map);
}

function species_located(new_latitude,new_longitude,address,user){
var element = document.cookie.indexOf("start=");
if(element != -1){
alert('Please finish entering your survey details');
return;
}
window.document.getElementById('location').innerHTML = " ";
read_function('surveys.xml', "GET",function(){if(request.readyState == 4)
												 
{if(request.status == 200){
new_initialize(new_latitude,new_longitude,user,address,request.responseXML);
}}});
}

function new_initialize(lat,long,name,address,xml_data) {
 var edit_lat = lat.substring(0,6);
var edit_long = long.substring(0,6);
var location = "latitude " + edit_lat + " longitude " + edit_long;

var latlng = new google.maps.LatLng(lat,long);

    var myOptions = {
      zoom: 14,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
var loci = address.split(',');
var loci = loci[0];
var located = "<div style='float:right;width:280px;'>" + location + "</div>" + address;
window.document.getElementById('location').innerHTML = located;

    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
	
	var marker = new google.maps.Marker({
    position: latlng,
    title:"Survey Location"
});
var feed_content = getItems(xml_data,"data");
marker.setMap(map);
var photo_content = feed_content.reverse();
for(var loop = 0; loop < photo_content.length; loop++){
var this_photo = photo_content[loop];
var new_latitude = getFirstValue(this_photo,"lat");
var new_longitude = getFirstValue(this_photo,"long");
var user = getFirstValue(this_photo,"name");
var user = legal_symbols(user);

var address = getFirstValue(this_photo,"location");
var address = legal_symbols(address);
var address = address.replace(/3D/,"");
var this_date = getFirstValue(this_photo,"time");
var modified_Date = this_date.substring(5,22);
if(navigator.userAgent.indexOf("Chrome") != -1){
	var modified_Date = this_date.substring(5,16);
}

if((new_latitude != lat) && (new_longitude != long)){

var latlng = new google.maps.LatLng(new_latitude,new_longitude);
var details = user + " " + modified_Date;

var image = 'images/bullet.gif';
var marker = new google.maps.Marker({
    position: latlng,
    title: details,
	icon: image
});
add_listener(marker,new_latitude,new_longitude,address,user,map);
}
}
new_locator(lat,long,name,loci);
}

function new_locator(lat,long,name,loci){
 read_function('species.xml', "GET",function(){if(request.readyState == 4)
{if(request.status == 200){var last_modified = request.getResponseHeader("Last-Modified");
var last_modified_date = new Date(last_modified);get_species(request.responseXML,lat,long,name);
//search_engine(loci);

}}});
}


function get_species(xml_data,new_latitude,new_longitude,user){
var page_contents = "<table width='100%' style='border-collapse:collapse;'><tr><td class='top'>SPECIES RECORDED by " + user + "</td><td></td></tr>";
var photo_forward_content = getItems(xml_data,"data");
var photo_content = photo_forward_content.reverse();
var times = new Array();
for(var loop = 0; loop < photo_content.length; loop++){
var this_photo = photo_content[loop];
var old_latitude = getFirstValue(this_photo,"lat");
var old_longitude = getFirstValue(this_photo,"long");
var species = getFirstValue(this_photo,"name");
var species = legal_symbols(species);
var number = getFirstValue(this_photo,"number");
var number = legal_symbols(number);
var user_name = getFirstValue(this_photo,"user");
var user_name = legal_symbols(user_name);
var this_date = getFirstValue(this_photo,"time");
if((new_longitude == old_longitude) && (new_latitude == old_latitude) && (user == user_name)){
if(times.length < 1){
var time_stamp = Date.parse(this_date);
var new_date = new Date(time_stamp).toUTCString();
var modified_Date = new_date.substring(5,22);
if(navigator.userAgent.indexOf("Chrome") != -1){
	var modified_Date = this_date.substring(5,16);
}

page_contents += "<tr><td class='title'>Date: " + modified_Date + "</td><td class='title'>COUNT</td></tr>";
times.push(time_stamp);
}
for(var loop2 = 0; loop2 < times.length; loop2++){
var time_stamp = Date.parse(this_date);
var new_date = new Date(time_stamp).toUTCString();
if(time_stamp < times[loop2]){
var modified_Date = new_date.substring(5,22);
if(navigator.userAgent.indexOf("Chrome") != -1){
	var modified_Date = this_date.substring(5,16);
}

page_contents += "<tr><td class='title'>Date: " + modified_Date + "</td><td class='title'>COUNT</td></tr>";
times.splice(0,1);
times.push(time_stamp);

}}
page_contents += "<tr><td class='intro' style='text-transform:capitalize;'>" + species + "</td><td class='intro'>" + number + "</td></tr>";
}
}

page_contents += "<tr><td style='border-left:1px solid #000000;border-bottom:1px solid #000000;padding:3px;background-color:#f0f0f0;color:#000000;'><a href='#' onClick='geo_locator();return false;' style='text-decoration:underline;'>BACK TO YOUR LOCATION</a></td><td style='background-color:#f0f0f0;border-bottom:1px solid #000000;border-right:1px solid #000000;'></td></tr></table>";
window.document.getElementById("species_recorded").innerHTML = page_contents;

}


function getItems(xml_info,item_type){
var the_items_array = new Array();
var items_element = xml_info.getElementsByTagName(item_type)[0];
var items = items_element.getElementsByTagName("item")
for(var loop = 0; loop < items.length; loop++){
the_items_array[loop] = items[loop];
}
return the_items_array;
}


function search_function(file_url,read_type,the_function){			
if(window.XMLHttpRequest){request = new XMLHttpRequest();}
else{request = new ActiveXObject("Microsoft.XMLHTTP");}
var the_url = "testing.php?locality=" + file_url + "&t=" + new Date().getTime();
if(request){request.open(read_type,the_url); request.onreadystatechange = the_function; request.send(null);
}else{
	
}
}

function legal_symbols(existing_users){
var change_me = existing_users.replace(/a_12/g,"'").replace(/b_12/g,"\"").replace(/c_12/g,">").replace(/d_12/g,"<").replace(/e_12/g,"&");
	return change_me;}

function illegal_symbols(value_one){
	var change_me = value_one.replace(/'/g,"a_12").replace(/"/g,"b_12").replace(/>/g,"c_12").replace(/</g,"d_12").replace(/&/g,"e_12").replace(/&lt;/,"d_12").replace(/&rt;/,"c_12");
	return change_me;}

function WM_readCookie(name) {
var no_cookie = 'none';
if (document.cookie == ''){
return no_cookie;}
else {
var firstChar, lastChar;
var theBigCookie = document.cookie;
var theBigCookie = theBigCookie.split(';');
var length = theBigCookie.length + 1;
for(var loop = 0; loop < length; loop ++){
firstChar = theBigCookie[loop].indexOf(name);
if(firstChar != -1){
firstChar += name.length + 1;

lastChar = theBigCookie[loop].length;
return unescape(theBigCookie[loop].substring(firstChar, lastChar));
if(firstChar != 1){
	return no_cookie;
	}	}

}
}}  


function bg_image(){
var an_image = new Image();
an_image.src = 'images/momenu.gif';
window.document.getElementById("1").style.backgroundImage = "url(images/momenu.gif)";
}

function slideshow(index,number){
window.document.getElementById("" + number + "").style.backgroundImage = "url(images/momenu.gif)";
for(loop = 1;loop < 5;loop++){
	if(loop != number){
window.document.getElementById("" + loop + "").style.backgroundImage = "url(images/menu.gif)";}
}

read_function('premier.xml',"GET",function(){ 
if(request.readyState == 4){if(request.status == 200){
show(request.responseXML,index);}
else{document.getElementById("script_content").innerHTML = "Sorry, there was a problem with the server";}}});
}


function show(xml_info,index){
var display = new Array();
var xml_elements = xml_info.getElementsByTagName("item");
for(var loop=0; loop < xml_elements.length; loop ++) {
	var name = getFirstValue(xml_elements[loop], "title");
	if(name == index){
var desc = getFirstValue(xml_elements[loop], "description");
		document.getElementById("script_content").innerHTML = desc;}
}
}

function read_function(file_url,read_type,the_function){			
if(window.XMLHttpRequest){request = new XMLHttpRequest();}
else{request = new ActiveXObject("Microsoft.XMLHTTP");}
var the_url = "xmlobtain.php?Filename=" + file_url + "&t=" + new Date().getTime();
if(request){request.open(read_type,the_url); request.onreadystatechange = the_function; request.send(null);
}else{
}
}