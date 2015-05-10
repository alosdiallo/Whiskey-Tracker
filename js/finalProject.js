/* CSCI E-3 Introduction to Web Programming Using Javascript
 * Spring 2015
 * Alos Diallo
 *
 * To load the site make sure you have an http server running then navigate to: http://127.0.0.1:8000/
 * Final Project: To create an app that lets users track their whiskey purchases.  
 * The database will be built and handled using PouchDB.  Documentation can be found:
 * http://pouchdb.com/
 * My reasoning for choosing PouchDB is that depending on the browser the system will
 * automatically choose between Web SQl, IndexedDB, or Local Storage.  This is great as 
 * not every browser supports the same DB architecture. 
 * Table design learned from http://www.smashingmagazine.com/ "Top 10 CSS Table Designs"
 * Here is the link to the tutorial:http://www.smashingmagazine.com/2008/08/13/top-10-css-table-designs/ 
 * 
 * PouchDB Browser Support:
 * 
 * Firefox 29+
 * Chrome 30+
 * Safari 5+
 * Internet Explorer 10+
 * Opera 21+
 * Android 4.0+
 * iOS 7.1+
 * Windows Phone 8+
 *
 *
 */

 /******************************************************************
 Code for form validation
 ******************************************************************/
window.onload = function formValidation(){ 

	var f = document.forms["whiskey"];
	var costW = f.elements["Cost"].value.trim();
	var nameW = f.elements["Name"].value.trim();
	var brandW = f.elements["Brand"].value.trim();
	var vintageW = f.elements["Vintage"].value.trim();
	var typeW = f.elements["Type"].value.trim();
	var countryW = f.elements["Country"].value.trim();
	
	//Here I am removing any dollar signs from the cost field
	f.elements["Cost"].addEventListener("focusout", function() {
		try {
			f.elements["Cost"].value = f.elements["Cost"].value.replace(/\$/g, '');	
		}
		catch(err) {
			alert(err.message);
		}
	});
	//Making sure that someone does not put a word or letter in the vintage
	f.elements["Vintage"].addEventListener("focusout", function() {
		try {
			f.elements["Vintage"].value = f.elements["Vintage"].value.replace(/\D/g,'');	
		}
		catch(err) {
			alert(err.message);
		}
	});
	



    
}



/*************************************************
* This will clear the input fields 
*************************************************/
function clearFields() {
	//$("output").html("");
	$("plotSpace").html("");
	var f = document.forms["whiskey"];
	f.elements["Cost"].value="";
	f.elements["Name"].value="";
	f.elements["Brand"].value="";
	f.elements["Vintage"].value="";
	f.elements["Type"].value="";
	f.elements["Country"].value="";

}

/*Grabbing the buttons*/
var whiskeySbtn = document.getElementById("whiskeyButton");
var whiskeySubmitButtonShow = document.getElementById("whiskeyButtonShow");


/******************************************************************
* This is all of the code for handling the DB.
*  There are 4 main parts
* 1:Create DB
* 2:Populate 
* 3:Lookup and display
* 4:remove from the DB
 *******************************************************************/

 //Step 1: Creating the new DB
var db = new PouchDB('whiskeyTest');
var remoteCouch = false;
var counter = 0;



//Step 2: This is the code for adding a new whiskey to the Database
whiskeySbtn.onclick = function addWhiskey() {
//getting the values in the form

	var nameW = document.getElementById("Name").value.trim();
	var brandW = document.getElementById("Brand").value.trim();
	var vintageW = document.getElementById("Vintage").value.trim();
	var typeW = document.getElementById("Type").value.trim();
	var countryW = document.getElementById("Country").value.trim();
	var costW = document.getElementById("Cost").value.trim();
	
	//Check to see if our text boxes are empty.
	if(document.getElementById("Brand").value == ''){

		console.log("Entry Details No data " + document.getElementById("Brand").value);
	}
	else{
		//Create the custom object to populate so that we can populate the DB.
		var entry = {
			_id: new Date().toISOString(),
			name: nameW,
			brand: brandW,
			vintage: vintageW,
			brand: brandW,
			type: typeW,
			country: countryW,		
			cost: costW
		};

		//This is where data is inserted in the DB.
		db.put(entry, function callback(error, result) {
			if (!error) {
				//Once we put the data in the DB clear the text and probvide feedback.
				clearFields();
				var feedback = document.getElementById("Feedback");
				var newContent = document.createTextNode("The new entry was successfully added"); 
				feedback.empty();
				feedback.appendChild(newContent);
				counter = 0;
				console.log("The new entry was successfully added");
			}
			//If not provide the error.
			else{
				console.log(error + result);
			}
		});
	}
	
	
}


//Step 3: Retrieve information from DB
/*Once you click on the button it will send the 
whole db object to showTableOfData to be output.
*/
whiskeySubmitButtonShow.onclick = function showData() {
	//passing all of the data in the db to the relevant functions
	db.allDocs( {include_docs: true, descending: true},
				function(err, doc) {
					showTableOfData(doc.rows);
					plotCost(doc.rows);
				} );
				
	
}


//This will display the information that exists in the Database
function showTableOfData(data) {

	var div = document.getElementById("outPut");
	$("output").html("");	
	//Here I am creating the table 
	var myTable = document.createElement("table");
	myTable.setAttribute("id", "dbResultsTable");
	//Styling the table so that it has a boarder
	myTable.style.width='100%';
	myTable.setAttribute('border','1');
	//This array has all of the header names.
	var arrayText = [ 'Brand', 'Name', 'Vintage','Type', 'Country', 'Cost','Date','Rating','Delete'];
	var dbArray = ['brand','name','vintage' ,'type' , 'country' , 'cost' , '_id','Rating','Delete'];
	//Making the first row
	var header = myTable.createTHead();
	var row = header.insertRow(0); 

	//Here I am making the header for the table
	for ( var i=0; i< arrayText.length; i++ ) {
		var cellName = "cell";
		cellName.concat(i);
		var cellName = row.insertCell(i);
		cellName.innerHTML = arrayText[i];
	
	}
		//console.log(myTable.rows.item(0).innerHTML);
	//Here I am population the table with the data from the database
	var callNameDB = '';
	var afterHeader = 1;
	
	/*If there is anything in the DB the following code will create a table populated with the contents of the DB*/
	if(data.length > 0){
		for(var i=0; i< data.length; i++)
		{		
			var currentRow = myTable.insertRow(afterHeader);
			//Getting the id and rev values for the delete method
			var revId = data[i].doc._rev;
			var docId = data[i].doc._id;
			 
			//Building the table by creating the DOM elements based on what is in the DB.
			for(var j=0; j< dbArray.length; j++)
			{
				//Code for populating the table part 1
				cellName = "cell";
				cellName.concat(j);
				cellName = currentRow.insertCell(j);
				
				//Code to create the delete buttons.
				var buttonID = 'deleteButton' + i;
				buttonID = String(buttonID);
				var deleteButton = document.createElement('button');
				deleteButton.setAttribute("id", buttonID);
				deleteButton.setAttribute('type', 'button');
				deleteButton.innerText = "Delete";
				deleteButton.className = "deleteBtn";
				deleteButton.addEventListener("click",function () {deleteBP(docId,revId);}, false);
				//If at the last spot add the button to the table
				if(dbArray[j].match('Delete')){
					cellName.appendChild(deleteButton);
					 
				}
				
				//Code to handle the rating system DOM element creation
				else if(dbArray[j].match('Rating')){
					var generalDiv = 'div';
					var divID = 'div' + i;
					var ratingDiv = document.createElement(generalDiv);
					ratingDiv.setAttribute('id', divID);
					
					var innerDivTag = document.createElement('div');
					innerDivTag.setAttribute('class', 'rating');
					var ratingContents = '<span  class="star" data-value="5">*</span><span class="star" data-value="4">*</span><span class="star" data-value="3">*</span><span class="star" data-value="2">*</span><span class="star selected" data-value="1">*</span>';
					ratingDiv.appendChild(innerDivTag);

					innerDivTag.innerHTML = ratingContents;
					cellName.appendChild(ratingDiv);
				}
				
	
				//Otherwise build the table from what is in the DB. Part 2
				else{
					callNameDB = "data[" + i + "]" + ".doc." + dbArray[j];
					//Changing from a string to a variable
					var callNameDB = eval(callNameDB);
					cellName.innerHTML = callNameDB;
				}
				
				
			}
			//Using this to allow me to build from the DB after the header is made
			afterHeader++;
		}
	}

	
	//Check to see if there is anything in the database.
	else if(data.length == 0){
			div.innerHTML = "Your database is empty";
	}
	
	//If the table is not there then display it.
	if (counter < 1) {
		counter++;
		//To make sure I don't print the table twice I first make the div empty.
		$(div).empty();
		div.appendChild(myTable);
     
	}
	//Look at what is going on.
	else{
		console.log(myTable);
	}

	//Code to handle to rating system behaviour
	$(document).ready(function () {
		$('.rating .star').click(function (evt) {
			var $target = $(evt.currentTarget);
			$target.parent().find('.star').removeClass('selected');
			$target.addClass('selected');
			//var userRating = this.data('value');
			
		});
	});
}

//Step 4: Delete from DB
//This function will remove the data from the database based on what the user clicks on
function deleteBP(id, rev) {
  console.log(id + " Here " + rev);
  db.remove(id,rev).then(function () {
	  // success
	}).catch(function (err) {
	  if (err.status === 409) {
		// conflict!
	  } else {
		console.log(err.status);
	  }
	  //Still thinking here
	  });

}

/**********************************************************************************************
Geo Location code
**********************************************************************************************/
/* function geoLocation(){
	var mapSpace = document.getElementById('map-canvas');

	var geocoder = new google.maps.Geocoder();
	var address = 'Boston, MA';
	var lat = '';
	var lon = '';
	if (geocoder) {
	  geocoder.geocode({ 'address': address }, function (results, status) {
		 if (status == google.maps.GeocoderStatus.OK) {
			lat = results[0].geometry.location.lat();
			lat = parseFloat(lat);
			lon = results[0].geometry.location.lng();
			lon = parseFloat(lon);
			console.log(results[0].geometry.location.lat());
			console.log(results[0].geometry.location.lng());
		 }
		 else {
			console.log("Geocoding failed: " + status);
		 }
	  });
	}  
	


} */






/*****************************************************************************
Using this function to plot the cost data I will be using Google charts api
*****************************************************************************/
function plotCost(data){

	//Creating the array that will hold the cost data.
	var costData = new Array();
	var j = 1;
	//Populating an array of the cost data.
	for(var i=0; i< data.length; i++){
		var valueAsNumber = parseInt(data[i].doc.cost);
		costData[j,i] = [j,valueAsNumber];
		j++;
	}	

	//Adding to the front of the array to give it headers.
	//costData.unshift(["Cost","Position"]);
	var dt = google.visualization.arrayToDataTable(costData,true);
	var maxBNumber = data.length;
	var maxCNumber = function getMaxOfArray(costData) {
	  return Math.max.apply(null, costData);
	}	
	
	//Creating an object to hold the information that is sent to the api.	
	var options = {
	  title: 'Whiskey Cost',
	  hAxis: {title: 'Bottle Number', minValue: 0, maxValue: maxBNumber},
	  vAxis: {title: 'Cost', minValue: 0, maxValue: maxCNumber},
      'width':400,
      'height':300,	  
	  legend: 'none'
	};
	
	//
	var plotSpace = document.getElementById('plotSpace');
	var chart = new google.visualization.ScatterChart(plotSpace);
	try{
		chart.draw(dt, options);	
	}catch(err){
		alert("something wrong here");
	}
	
}





//Helper functions for testing.
// Deleting the whole db command: new PouchDB('whiskeyLibrary').destroy()
//Start up server: python -m SimpleHTTPServer

