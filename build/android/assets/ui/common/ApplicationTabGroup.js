// Keep a reference to this window so it does not get collected on Android.
var messageWin;
function ApplicationTabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup(),
		BaseUIWindow = require('ui/common/BaseUIWindow'),
		OrderHistory = require('ui/common/OrderHistory');

	//create app tabs
	var baseUIWin = new BaseUIWindow(L('order_now_screen_title')),
		orderHistoryUIWin = new OrderHistory(L('order_history'));
		
	var baseUITab = Ti.UI.createTab({
		title: L('order_now'),
		icon: '/images/tabs/KS_nav_ui.png',
		window: baseUIWin
	});
	baseUIWin.containingTab = baseUITab;

	self.addTab(baseUITab);

	var orderHistoryTab = Ti.UI.createTab({
		title: L('order_history'),
		icon: '/images/tabs/KS_nav_views.png',
		window: orderHistoryUIWin
	});
	orderHistoryUIWin.containingTab = orderHistoryTab;

	self.addTab(orderHistoryTab);

	self.setActiveTab(1);


	// Tabgroup events and message window
	messageWin = Titanium.UI.createWindow({
		height:30,
		width:250,
		bottom:70,
		borderRadius:10,
		touchEnabled:false,
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT,
			Titanium.UI.LANDSCAPE_LEFT,
			Titanium.UI.LANDSCAPE_RIGHT
		]
	});
	if (Ti.Platform.osname === 'iphone') {
		messageWin.orientationModes = [Ti.UI.PORTRAIT];
	}

	var messageView = Titanium.UI.createView({
		id:'messageview',
		height:30,
		width:250,
		borderRadius:10,
		backgroundColor:'#000',
		opacity:0.7,
		touchEnabled:false
	});

	var messageLabel = Titanium.UI.createLabel({
		id:'messagelabel',
		text:'',
		color:'#fff',
		width:250,
		height:'auto',
		font:{
			fontFamily:'Helvetica Neue',
			fontSize:13
		},
		textAlign:'center'
	});
	messageWin.add(messageView);
	messageWin.add(messageLabel);
	

	self.addEventListener('close', function(e) {
		if (e.source == self){
			if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
				self.open();
			}
		}
	});

	function createAndroidToast(message) {
		var theToast = Ti.UI.createNotification({
			message:message,
    		duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		theToast.show();
	}

	function showMessage(message) {
		if (Ti.Platform.osname == 'android') {
			createAndroidToast(message);
		} else {
			Titanium.UI.setBackgroundColor('#fff');
			messageWin.open();
			setTimeout(function() {
				messageWin.close({opacity:0,duration:500});
			},1000);
		}
	}

	self.addEventListener('open',function(e) {
		if (e.source == self){
			showMessage('tab group open event');
		}
	});

	self.addEventListener('focus', function(e) {

		// On iOS, the "More..." tab is actually a tab container, not a tab. When it is clicked, e.tab is undefined.
		if (!e.tab) {
			return;
		}

		// iOS fires with source tabGroup. Android with source tab
		if ((e.source == baseUITab) || (e.source == orderHistoryTab) || (e.source == self)) {
			if ((Ti.Platform.osname == 'android') ) {
				var msg = 'tab changed to ' + e.index + ' old index ' + e.previousIndex;
				showMessage(msg);
			} else {
				messageLabel.text = 'tab changed to ' + e.index + ' old index ' + e.previousIndex;
				messageWin.open();

				setTimeout(function() {
					Ti.API.info('tab = ' + e.tab.title + ', prevTab = ' + (e.previousTab ? e.previousTab.title : null));
					messageLabel.text = 'active title ' + e.tab.title + ' old title ' + (e.previousTab ? e.previousTab.title : null);
				}, 1000);

				setTimeout(function() {
					messageWin.close({
						opacity : 0,
						duration : 500
					});
				}, 2000);
			}
		}

	});

	self.addEventListener('blur', function(e) {
		Titanium.API.info('tab blur - new index ' + e.index + ' old index ' + e.previousIndex);
	});
	self.model = Ti.Platform.model;

	return self;
};

module.exports = ApplicationTabGroup;
