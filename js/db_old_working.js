/* CSCI E-3 Introduction to Web Programming Using Javascript
 * Spring 2014
 * Alos Diallo
 * Project
 */

//Creating the new DB
var db = new PouchDB('whiskeyLibrary');
var remoteCouch = false;

//update whenever the remote data changes
db.changes({
  since: 'now',
  live: true
}).on('change', showTableOfData);

//Grabbing the buttons
var whiskeySubmitButtonValue = document.getElementById("whiskeyButton");
var whiskeySubmitButtonShow = document.getElementById("whiskeyButtonShow");

//This is the code for adding a new whiskey to the Database
whiskeySubmitButtonValue.onclick = function addWhiskey() {
//getting the values in the form
	var fistNameV = document.getElementById("firstName").value.trim();
	var lastNameV = document.getElementById("lastName").value.trim();
	var whiskeyNameV = document.getElementById("whiskeyName").value.trim();

	
	var entry = {
		_id: fistNameV,
		lastName: lastNameV,
		whiskeyName: whiskeyNameV
	};
	console.log("Entry Details " + fistNameV);
	db.put(entry, function callback(error, result) {
		if (!error) {
			clearFields();
			console.log("the new entry was successfully added");
		}
		else{
			console.log(error + result);
		}
	});
}

//This will clear the input fields 
function clearFields() {

	document.getElementById("firstName").value="";
	document.getElementById("lastName").value="";
	document.getElementById("whiskeyName").value="";
}

/*Once you click on the button it will send the 
whole db object to showTableOfData to be output.
*/
whiskeySubmitButtonShow.onclick = function showData() {

	db.allDocs( {include_docs: true, descending: true},
				function(err, doc) {
					showTableOfData(doc.rows);
				} );
}


//This will display the information that exists in the Database
function showTableOfData(data) {

	var div = document.getElementById("outPut");
	//var removeItem = document.createElement("BUTTON");
	//removeItem.innerHTML = "test";
	var str = "<table border='1' aligh='left'><tr><th>First Name</th>"+
			"<th>Last Name</th><th>author</th></tr>";
	if(data.length > 0){
		for(var i=0; i< data.length; i++)
		{	
			var revId = data[i].doc._rev;
			var revId = data[i].doc._id;
			str +=  "<tr><td>"+data[i].doc._id +
					"</td><td>"+data[i].doc.lastName+
					"</td><td>"+data[i].doc.whiskeyName+
					"</td><td><button id=DeleteButton"+ i +" class=editbtn onclick=deleteBP("+ "\""+ data[i].doc._id + "\""+ "," + "\""+ data[i].doc._rev + "\""+ ")>delete</button>"+
					"</td></tr>";
		}
		str += "</table>";
		
		div.innerHTML = str;
	}
	else{
		div.innerHTML = "Your database is empty";
	}

}

//This function will remove the data from the database based on what the user clicks on
function deleteBP(id, rev) {
  console.log(id + " " + rev);
  db.remove(id,rev);

}

//Helper functions for testing.
// Deleting the whole db command: new PouchDB('whiskeyLibrary').destroy()
//Start up server python -m SimpleHTTPServer

