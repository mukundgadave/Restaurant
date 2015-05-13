function OrderHistory(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	// create table view data object
	var data = [
		{title:'Slider', hasChild:false},
		{title:'Switch', hasChild:false},
		{title:'Activity Indicator', hasChild:false},
		{title:'Progress Bar', hasChild:false},
		{title:'Button', hasChild:false},
		{title:'Label', hasChild:false},
		{title:'Text Field', hasChild:false},
		{title:'Text Area', hasChild:false}
	];
	
	
	// create table view
	for (var i = 0; i < data.length; i++ ) { 
		data[i].color = '#000'; 
		data[i].font = {fontWeight:'bold'}; 
	}
	
	var tableview = Titanium.UI.createTableView({
		data:data
	});
	
	// create table view event listener
	tableview.addEventListener('click', function(e) {
		
	});
	// add table view to the window
	self.add(tableview);
	return self;
};

module.exports = OrderHistory;
