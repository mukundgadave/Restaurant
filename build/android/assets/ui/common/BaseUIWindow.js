function BaseUIWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	var isMobileWeb = Titanium.Platform.osname == 'mobileweb';
	
	// create table view data object
	var data = [
		{title:'Tab Groups', hasChild:!isMobileWeb, test:'ui/common/baseui/tab_groups', touchEnabled:!isMobileWeb, color:isMobileWeb?"#aaa":"#000"},
		{title:'Window Properties', hasChild:true, test:'ui/common/baseui/window_properties'}
	];
	
	// add iphone specific tests
	if (Titanium.Platform.name == 'iPhone OS')
	{
		data.push({title:'Tabs', hasChild:true, test:'ui/handheld/ios/baseui/tabs'});
		data.push({title:'Window NavBar', hasChild:true, test:'ui/handheld/ios/baseui/window_navbar'});
	}
	
	// add android specific tests
	if (Titanium.Platform.osname == 'android')
	{
		data.push({title:'Preferences', hasChild:true, test:'ui/handheld/android/baseui/preferences'});
	}
	
	// create table view
	for (var i = 0; i < data.length; i++ ) {
		var d = data[i];
		// On Android, if touchEnabled is not set explicitly, its value is undefined.
		if (d.touchEnabled !== false) {
			d.color = '#000';
		}
		d.font = {fontWeight:'bold'};
	};
	var tableview = Titanium.UI.createTableView({
		data:data
	});
	
	// create table view event listener
	tableview.addEventListener('click', function(e)
	{
		if (e.rowData.test)
		{
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({title:e.rowData.title,containingTab:self.containingTab,tabGroup:self.tabGroup});
			if (Ti.Platform.name == "android") {
				
			} else {
				win.backgroundColor = "#fff";
			}
	
	
			if (e.index == 3)
			{
				if (Ti.Platform.name == "iPhone OS") {
					win.hideTabBar();
					//IOS7 has a weird bug where it will not resize the ViewController correctly when the tabbar is hidden.
					//TIMOB-14998
					win.extendEdges = [Ti.UI.EXTEND_EDGE_BOTTOM];
					win.includeOpaqueBars = true;
				}
			}
			if (Ti.Platform.name==='android' && e.rowData.test.indexOf('window_properties') >= 0) {
				// As explained in apidoc for Window, if opacity is ever to be changed for an Android
				// activity during its lifetime, it needs to use a translucent background.  We trigger
				// using a translucent theme by the presence of the opacity property, so we need to
				// set it here.  Setting it to 1 means it's totally opaque, but gives us the property to
				// make it more transparent later with the "toggle opacity" test.
				win.backgroundColor = "#191919";
				win.opacity = 1;
			}
			self.containingTab.open(win,{animated:true});
		}
	});
	
	// add table view to the window
	self.add(tableview);
	
	self.addEventListener('focus', function()
	{
		Ti.API.info('FOCUS RECEIVED IN base_ui');
		Ti.App.fireEvent('nav_back');
		
		if (!(Ti.Platform.osname === 'mobileweb' )) {
			Ti.API.info(Ti.dumpCoverage());
		}
	});
	if ( (Ti.Platform.osname != 'android') ){
		//
		//  ADD EVENT LISTENERS FOR CUSTOM EVENTS
		//
		var win = Titanium.UI.createWindow({
			height:30,
			width:250,
			bottom:110,
			borderRadius:10
		});
		
		var view = Titanium.UI.createView({
			backgroundColor:'#000',
			opacity:0.7,
			height:30,
			width:250,
			borderRadius:10
		});
		
		var label = Titanium.UI.createLabel({
			color:'#fff',
			font:{fontSize:13},
			textAlign:'center',
			width:'auto',
			height:'auto'
		});
		win.add(view);
		win.add(label);
	} else if (Ti.Platform.osname != 'android'){
		var toast = Ti.BlackBerry.createToast();
	}
	
	function createAndroidToast(message) {
		var theToast = Ti.UI.createNotification({
			message:message,
    		duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		theToast.show();
	}
	
	Titanium.App.addEventListener('event_one', function(e)
	{
		if (Ti.Platform.osname == 'android') {
			var msg = 'base_ui.js: event one, array length = ' + e.data.length;
			createAndroidToast(msg);
		} else {
			label.text = 'base_ui.js: event one, array length = ' + e.data.length;
			win.open();
			setTimeout(function()
			{
				win.close({opacity:0,duration:500});
			},1000);
		}
	});
	
	Titanium.App.addEventListener('event_two', function(e)
	{
		if (Ti.Platform.osname == 'android') {
			var msg = 'base_ui.js: event two, name = ' + e.name;
			createAndroidToast(msg);
		} else {
			label.text = 'base_ui.js: event two, name = ' + e.name;
			win.open();
			setTimeout(function()
			{
				win.close({opacity:0,duration:500});
			},1000);
		}
	});

	
	return self;
};

module.exports = BaseUIWindow;
