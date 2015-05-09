/*****************************************************************************
Using this function to plot the cost data I will be using Google charts api
*****************************************************************************/
function plotCost(data){
	//Creating the array that will hold the cost data.
	var costData = new Array();
	var j = 0;
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
		
	var options = {
	  title: 'Whiskey Cost',
	  hAxis: {title: 'Bottle Number', minValue: 0, maxValue: maxBNumber},
	  vAxis: {title: 'Cost', minValue: 0, maxValue: 200},
      'width':400,
      'height':300,	  
	  legend: 'none'
	};
	
	var plotSpace = document.getElementById('plotSpace');
	var chart = new google.visualization.ScatterChart(plotSpace);
	try{
		chart.draw(dt, options);	
	}catch(err){
		alert("something wrong here");
	}
	
}
