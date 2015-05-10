 /******************************************************************
 Code for form validation
 ******************************************************************/
window.onload = function formValidation(){ 

	var f = document.forms["whiskey"];
	var costW = f.elements["Cost"].value.trim();
 	var div = f.elements["outPut"];
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