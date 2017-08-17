/* Whiskey Tracker
 * Spring 2015
 * Alos Diallo
 *
 * To load the site make sure you have an http server running then navigate to: http://127.0.0.1:8000/
 * Project: To create an app that lets users track their whiskey purchases.  
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
	var bottleW = f.elements["BottleNumber"].value.trim();
	
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
	//Makes sure that someone does not enter a number in for number of bottles.
	f.elements["BottleNumber"].addEventListener("focusout", function() {
		try {
			f.elements["BottleNumber"].value = f.elements["BottleNumber"].value.replace(/\D/g,'');	
		}
		catch(err) {
			alert(err.message);
		}
	});
	
	
	/*Here I am using jqueryui autocomplete widget to help create an autocomple function for 
	country and type of whiskey.  This is important because they are used for plotting later 
	and I wanted to make sure that the user was consistent with naming.*/
	$.widget( "custom.catcomplete", $.ui.autocomplete, {
	_create: function() {
	  this._super();
	  this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
	},
	_renderMenu: function( ul, items ) {
	  var that = this,
		currentCategory = "";
	  $.each( items, function( index, item ) {
		var li;
		if ( item.category != currentCategory ) {
		  ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
		  currentCategory = item.category;
		}
		li = that._renderItemData( ul, item );
		if ( item.category ) {
		  li.attr( "aria-label", item.category + " : " + item.label );
		}
	  });
	}
	});	
	
	//Creating an object to hold the type of whiskey
	$(function() {
    var whiskeyType = [
      { label: "Bourbon", category: "American" },
      { label: "Scotch", category: "Scottish" },
      { label: "Whiskey", category: "World" },
      { label: "Whisky", category: "Scottish" },
	  { label: "Rye", category: "American" }

    ];
	
	//Creating an object to hold the Country of Origin info
	var CountryName = [
      { label: "USA", category: "" },
      { label: "Scotland", category: "" },
      { label: "Japan", category: "" },
      { label: "India", category: "" },
	  { label: "Irish", category: "" },
	  { label: "Canadian", category: "" },
	  { label: "Taiwan", category: "" }

    ];
	
	//Attaching the complete property to the two div's.
    $( "#Type" ).catcomplete({
      delay: 0,
      source: whiskeyType
    });
    $( "#Country" ).catcomplete({
      delay: 0,
      source: CountryName
    });	
	
	
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
	f.elements["BottleNumber"].value="";

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

//When something changes show the DB contents.
//Not sure if I will keep for production Alos 5/11/2015
/* db.changes({
  since: 'now',
  live: true
}).on('change', showData); */


//Step 2: This is the code for adding a new whiskey to the Database
whiskeySbtn.onclick = function addWhiskey() {
//getting the values in the form

	var nameW = document.getElementById("Name").value.trim();
	var brandW = document.getElementById("Brand").value.trim();
	var vintageW = document.getElementById("Vintage").value.trim();
	var typeW = document.getElementById("Type").value.trim();
	var countryW = document.getElementById("Country").value.trim();
	var costW = document.getElementById("Cost").value.trim();
	var bottleW = document.getElementById("BottleNumber").value.trim();
	
	
	/*In this case I decided to create a json object and then iterate through it to check to see if the text fields were blank.  I didn't want to have 
	a ton of if statements and thought this would be a better way to go about it.*/
	var formTextEl = {"name":"Name","brand":"Brand","vintage":"Vintage","type":"Type","country":"Country","cost":"Cost","bottle":"BottleNumber"};
	var checkVal = 0;
	//Check to see if our text boxes are empty.
	for (var key in formTextEl) {
		if (formTextEl.hasOwnProperty(key)) {
			var textContents = formTextEl[key];
			if(!document.getElementById(textContents).value == ''){
				checkVal++;
			}
		}
	}
	
	if(checkVal < 7){
		alert("Please make sure to fill in all of the fields.");
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
			cost: costW,
			bottle: bottleW
		};

		//This is where data is inserted in the DB.
		db.put(entry, function callback(error, result) {
			if (!error) {
				//Once we put the data in the DB clear the text and probvide feedback.
				clearFields();
				var feedback = document.getElementById("Feedback");
				var newContent = document.createTextNode("The new entry was successfully added"); 
				$(feedback).empty();
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
whiskeySubmitButtonShow.onclick = function(){showData();};

function showData() {
	//passing all of the data in the db to the relevant functions
	db.allDocs( {include_docs: true, descending: true},
				function(err, doc) {
					showTableOfData(doc.rows);
					plotCost(doc.rows);
					valueByType(doc.rows);
				} );
				
	
}


//This will display the information that exists in the Database
function showTableOfData(data) {

	var div = document.getElementById("outPut");
	$("output").html("");	
	//Here I am creating the table 
	var myTable = document.createElement("table");

	myTable.setAttribute("id", "dbResultsTable");
	//Styling the table 
	myTable.style.width='100%';
	myTable.setAttribute('border','1');
	myTable.style.overflow = "scroll";
	//This array has all of the header names.
	var arrayText = [ 'Brand', 'Name', 'Vintage','Type', 'Country', 'Cost', 'Number of Bottles','Date','Rating','Delete'];
	var dbArray = ['brand','name','vintage' ,'type' , 'country' , 'cost', 'bottle', '_id','Rating','Delete'];
	//Making the first row
	var header = myTable.createTHead();
	var row = header.insertRow(0); 


	//Here I am making the header for the table
	for ( var i=0; i< arrayText.length; i++ ) {
        var th = document.createElement("th");
		var cellName = "cell";
		cellName.concat(i);
		th.innerHTML = arrayText[i];
        row.appendChild(th);
	
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
					var ratingContents = '<span  class="star" id ="5" data-value="5">*</span><span class="star" id ="4" data-value="4">*</span><span class="star" id ="3" data-value="3">*</span><span class="star" id ="2" data-value="2">*</span><span class="star selected" id ="1" data-value="1">*</span>';
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
			var textHolder = $target.parent().context;
			var textHolder2 = $target.parent();
			alert(textHolder.id);
			console.log(textHolder);

			
		});
	});
}

//Step 4: Delete from DB
//This function will remove the data from the database based on what the user clicks on
function deleteBP(id, rev) {

  console.log(id + " Here " + rev);
  db.remove(id,rev).then(function () {
    var div = document.getElementById("outPut");
	counter = 0;
	showData();
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
Using this function to plot the value by type of whiskey I will be using Google charts api
**********************************************************************************************/
function valueByType(data){

	//Creating the array that will hold the cost data.
	var typeOfWhiskey =  new Array();
	var amountOfWhiskey = new Array();
	var j = 1;
	var hash = {};
	var consolidated = [];
	
	//Populating an array of the cost data.
	for(var i=0; i< data.length; i++){
		var typeW = String(data[i].doc.type);
		var valueAsNumber = parseInt(data[i].doc.bottle);
		typeOfWhiskey[j,i] = [typeW,valueAsNumber];
		j++;
	}	
	
	/*Consolidating the amount based on what you have in stock*/
	typeOfWhiskey.forEach(function (item) {
		hash[item[0]] = (hash[item[0]] || 0) + item[1];
	});

	Object.keys(hash).forEach(function (key) {
		consolidated.push([key, hash[key]]);
	});	
	/*Consolidating the amount based on what you have in stock END*/
	var whiskeyData = google.visualization.arrayToDataTable(consolidated,true);
	

	var options = {
	  title: 'Breakdown of Whiskey by Type',
	  'width':400,
      'height':300 

	};

	var chart = new google.visualization.PieChart(document.getElementById('valueByType'));

	chart.draw(whiskeyData, options);
    
       


}

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
	  hAxis: {title: 'Entry Number', minValue: 0, maxValue: maxBNumber},
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
// Deleting the whole db command: new PouchDB('whiskeyTest').destroy()
//Start up server: python -m SimpleHTTPServer

