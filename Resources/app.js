/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.  
 * A starting point for tab-based application with multiple top-level windows. 
 * Requires Titanium Mobile SDK 2.0.0+.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 2.0 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 2.0 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	//var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	var theTabGroup = new ApplicationTabGroup();
	theTabGroup.open();
	var messageWin;
	if(Ti.Platform.osname == 'blackberry') {
		messageWin = Ti.BlackBerry.createToast();
	} else {
		var MessageWindow = require('ui/common/MessageWindow');
		messageWin = new MessageWindow();
	}
	
	
	function createAndroidToast(message) {
		var theToast = Ti.UI.createNotification({
			message:message,
    		duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		theToast.show();
	}
	
	function showMessage(message) {
		if (Ti.Platform.osname == 'blackberry') {
			messageWin.cancel();
			messageWin.message = message;
			messageWin.show();
		} else if (Ti.Platform.osname == 'android') {
			createAndroidToast(message);
		} else {
			messageWin.setLabel(message);
			messageWin.open();
			setTimeout(function() {
				messageWin.close({opacity:0,duration:500});
			},1000);
		}
	}
	
		
	Titanium.App.addEventListener('event_one', function(e) {
		var msg = 'app.js: event one, array length = ' + e.data.length;
		showMessage(msg);
	});
	
	Titanium.App.addEventListener('event_two', function(e) {
		var msg = 'app.js: event two, name = ' + e.name;
		showMessage(msg);
	});
		
})();

/*var force = require('force');

force.authorize({
	success: function() {
		//If we're logged in, create a very simple accounts UI
		var ui = require('ui');
		var w = ui.createAppWindow();
		w.open();
	},
	error: function() {
		alert('error');
	},
	cancel: function() {
		alert('cancel');
	}
});*/
