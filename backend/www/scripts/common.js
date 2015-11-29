var titleMap = { "fm" : "FM Radio", "network" : "Webradio", "mp3track" : "MP3 Player", "linein" : "Line In", "settings" : "Settings" };

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December'];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var itemsData = { "fm" : {}, "network" : {}, "mp3playlist" : {}, "mp3track" : {} };
var itemsCurrent = { "fm" : 1, "network" : 1, "mp3playlist" : 1, "mp3track" : 1 };
var currentVolume = 0;
var currentMute = 0;
var currentPower = 0;
var host = "http://" + window.location.hostname + "/cgi-bin/webradio/";
var currentMode = "fm";
var clockTimerId;
var sleepTimerOn = 0;
var alarm1On = 0;
var alarm2On = 0;
var networkCheckTimer;
var mp3BlockShown = false;
var isPlayLocked = false;
var mp3TrackElapsedTimeTimerId;
var isSettingsShown = false;
var isNetParamsChanged = false;
var isSleepTimerChanged = false;
var isAlarm1Changed = false;
var isAlarm2Changed = false;
var isItemChanged = false;

var mp3TrackElapsedTimeDelay = -3;
var mp3TrackElapsedTime = mp3TrackElapsedTimeDelay;

$(document).ready(function() {
	$("#network_menu").click(function() {
		currentMode = "network";
		switchMenu(currentMode);
		sendModeUpdate();
		playCurrentItem();
	});
	$("#fm_menu").click(function() {
		isSettingsShown = false;
		currentMode = "fm";
		switchMenu(currentMode);
		sendModeUpdate();
		playCurrentItem();
	});
	$("#mp3track_menu").click(function() {
		isSettingsShown = false;
		currentMode = "mp3track";
		switchMenu(currentMode);
		sendModeUpdate();
		playCurrentItem();
	});
	$("#linein_menu").click(function() {
		isSettingsShown = false;
		currentMode = "linein";
		switchMenu(currentMode);
		sendModeUpdate();
	});
	$("#settings_menu").click(function() {
		isSettingsShown = true;
		switchMenu("settings");
	});
	$("#mute_button").click(function() {
		currentMute = (currentMute == 1) ? 0 : 1;
		updateMute();
		sendMuteUpdate();
	});
	$("#power_button").click(function() {
		currentPower = (currentPower == 1) ? 0 : 1;
		updatePower();
		sendPowerUpdate();
	});
	$("#show_add_stream_button").click(function() {
		$("#show_add_stream_button").hide();
		$("#add_stream_block").show();
	});
	$("#cancel_add_stream_button").click(function() {
		$("#stream_title").val("");
		$("#stream_url").val("");
		$("#add_stream_block").hide();
		$("#show_add_stream_button").show();
	});
	$("#add_stream_button").click(function() {
		addStream();
	});
	
	$("#show_add_preset_button").click(function() {
		$("#show_add_preset_button").hide();
		$("#add_preset_block").show();
	});
	$("#cancel_add_preset_button").click(function() {
		$("#fm_preset_title").val("");
		$("#fm_preset_value").val("");
		$("#add_preset_block").hide();
		$("#show_add_preset_button").show();
	});

	$("#add_preset_button").click(function() {
		addFMPreset();
	});
	
	$("#show_change_playlist_button").click(function() {
		$("#show_change_playlist_button").attr("value", mp3BlockShown ? "Change" : "Hide");
		mp3BlockShown = !mp3BlockShown;
		$("#update_playlist_block").toggle();
		$("#mp3_playlist_title_input").val("");
	});
	
	$("#add_playlist_button").click(function() {
		addMp3Playlist();
	});

	loadMode();
	
	loadItemsList("network");
	loadFrequences();
	loadSleepTimerValues();
	loadSleepTimer();
	loadNetworkParams();
	loadMp3TrackFolders();
				
});

function loadItemsList(mode) {
	var url = host + "items.cgi?action=" + mode;
	
	var action;
	switch (mode) {
		case "fm":
			action = "curfmpreset";
			break;
		case "mp3playlist":
			action = "curmp3playlist";
			break;	
		case "mp3track":
			action = "curmp3track";
			break;
		default:
			action = "curnetwork";
			break;
	}
	var url2 = host + "items.cgi?action=" + action;
	
	$.get(url, function(items) {
		$.get(url2, function(current) {
			itemsData[mode] = parseItemsData(items.trim());
			
			if (mode == "network") {
				updateItemsList(mode, current.trim(), false, true, true);
				loadItemsList("fm");
			}
			else if (mode == "fm") {
				updateItemsList(mode, current.trim(), true, true, true);
				loadItemsList("mp3playlist");
			}
			else if (mode == "mp3playlist") {
				updateItemsList(mode, current.trim(), true, false, true);
				loadItemsList("mp3track");
			}
			else {
				updateItemsList(mode, current.trim(), false, false, false);
				getCurrentMp3Playlist();
				loadAlarmPresets($("#alarm1_preset_type").val(), 'alarm1_preset');
				loadAlarmPresets($("#alarm2_preset_type").val(), 'alarm2_preset');
				loadAlarmValues();
				loadAlarm(1);
				loadAlarm(2);
			
				playCurrentItem();
				loadStatus();
			}
		});	
	});
}

function playCurrentItem() {
	var currentItem;
	switch (currentMode) {
		case "fm":
			currentItem = itemsCurrent["fm"];
			break;
		case "mp3track":
			currentItem = itemsCurrent["mp3track"];
			setCurrentMp3TrackTitle();
			break;
		default:
			currentItem = itemsCurrent["network"];
	}
	playItem(currentMode, currentItem);
}

function updateItemsList(mode, currentItem, subtitle, sort, remove) {
	var contentElement = $("#" + mode + "_list");
	contentElement.empty();

	var items = itemsData[mode];
	
	if (items && items.length > 0) {
		var itemsCount = items.length;
		switch (mode) {
			case "fm":
				itemsCurrent["fm"] = currentItem;
				break;
			case "mp3playlist":
				itemsCurrent["mp3playlist"] = currentItem;
				break;	
			case "mp3track":
				itemsCurrent["mp3track"] = currentItem;
				break;
			default:
				itemsCurrent["network"] = currentItem;
		}
		var id;
		var selected;
		var sortContent = "";
		var removeContent = "";
		var subTitleContent = "";
		var content;
		var title;
		for (item in items) {
			title = items[item].title;
			id = parseInt(item) + 1;
			selected = (id == currentItem);
			if (subtitle) {
				subTitleContent = '<span class="' + mode + '_sublabel">' + items[item].value + '</span>';
			}
			if (sort) {
				sortContent = ((id == itemsCount) ? '<img class="img" src="img/transparent.png">' : '<img class="img" src="img/down.png" onClick="moveItem(\'' + mode + '\', ' + subtitle + ', ' + sort + ', ' + remove + ', ' + id + ',\'down\')">') + ((id == 1) ? '<img class="img" src="img/transparent.png">' : '<img class="img" src="img/up.png" onClick="moveItem(\'' + mode + '\', ' + subtitle + ', ' + sort + ', ' + remove + ', ' + id + ',\'up\')">' );
			}
			if (remove) {
				removeContent = ((itemsCount == 1) ? '' : '<img class="img" src="img/remove.png" onClick="removeItem(\'' + mode + '\', ' + subtitle + ', ' + sort + ', ' + remove + ', ' + id + ')">');
			}
			content = '<div class="list_item"><div class="' + mode + '_label' + (selected ? "_selected" : "") + '" id="' + mode + '_label' + id + '"><a class="' + mode + '_label_link' + (selected ? "_selected" : "") + '" href="javascript:void(0)" id="' + mode + '_label_link' + id + '" onClick="playItem(\'' + mode + '\', ' + id + ')">' + title + '</a></div>' + subTitleContent + sortContent + removeContent + '<p class="clear" /></div>';
			contentElement.append(content);
		}
		contentElement.append('<p class="clear" />');
	}
	else {
		contentElement.append('No items');
	}
}

function playItem(mode, id) {
	if (mode == 'linein' || isPlayLocked) {
		return;
	}
	setSelectedRow(mode, id);
	
	sendPlayItem(mode, id);
	
	if (mode == 'mp3playlist') {
		getCurrentMp3Playlist();
		updateCurrentMp3Playlist();
	}
	else if (mode == "mp3track") {
		setCurrentMp3TrackTitle();
		mp3TrackElapsedTime = mp3TrackElapsedTimeDelay;
	}	
}

function setSelectedRow(mode, id) {
	$("." + mode + "_label_selected").attr("class", mode + "_label");
	$("." + mode + "_label_link_selected").attr("class", mode + "_label_link");
	
	$("#" + mode + "_label" + id).attr("class", mode + "_label_selected");
	$("#" + mode + "_label_link" + id).attr("class", mode + "_label_link_selected");
}

function removeItem(mode, subtitle, sort, remove, id) {
	itemsData[mode][id - 1] = null;

	var tempList = [];
	var i = 0;
	for (item in itemsData[mode]) {
		if (itemsData[mode][item]) {
			tempList[i] = itemsData[mode][item];
			i++;
		}
	}
	itemsData[mode] = tempList;
	
	updateItemsList(mode, 1, subtitle, sort, remove);
	sendItemsUpdate(mode);
}

function moveItem(mode, subtitle, sort, remove, id, dir) {
	var tempList = [];
	var i = 1;
	for (var j = 0; j < itemsData[mode].length; j++) {
		tempList[i] = itemsData[mode][j];
		i += 2;
	}
	var oldPosition = (id - 1) * 2 + 1;
	var newPosition = (dir == "down") ? (id - 1) * 2 + 4 : (id - 2) * 2;
	tempList[oldPosition] = null;
	tempList[newPosition] = itemsData[mode][id - 1];
	
	itemsData[mode] = [];
	i = 0;
	for (item in tempList) {
		if (tempList[item]) {
			itemsData[mode][i] = tempList[item];
			i++;
		}	
	}
	
	updateItemsList(mode, 1, subtitle, sort, remove);
	sendItemsUpdate(mode);
}

function addStream() {
	var title = $("#stream_title").val();
	var value = $("#stream_url").val();
	title = title.replace('"', '');
	value = value.replace('"', '');
	if (title == "") {
		alert("Invalid title");
		$("#stream_title").focus();
		return;
	}
	if (checkTitle("network", title)) {
		alert("Item already exists");
		$("#stream_title").focus();
		return;
	}
	if (value == "" || checkURL(value)) {
		alert("Invalid URL");
		$("#stream_url").focus();
		return;
	}
	$("#stream_title").val("");
	$("#stream_url").val("");
	if (!itemsData["network"]) {
		itemsData["network"] = [ { "title": title, "value": value } ];
	}
	else {
		itemsData["network"][itemsData["network"].length] = { "title": title, "value": value };
	}	
	
	updateItemsList("network", 1, false, true, true);
	sendItemsUpdate("network");
}

function addFMPreset() {
	var title = $("#fm_preset_title").val();
	var value = $("#fm_preset_value").val();
	title = title.replace('"', '');
	value = value.replace('"', '');
	if (title == "") {
		alert("Invalid title");
		$("#fm_preset_title").focus();
		return;
	}
	if (checkTitle("fm", title)) {
		alert("Item already exists");
		$("#fm_preset_title").focus();
		return;
	}
	$("#fm_preset_title").val("");
	$("#fm_preset_value").val("87.5")
	if (!itemsData["fm"]) {
		itemsData["fm"] = [ { "title": title, "value": value } ];
	}
	else {
		itemsData["fm"][itemsData["fm"].length] = { "title": title, "value": value };
	}	
	
	updateItemsList("fm", 1, true, true, true);
	sendItemsUpdate("fm");
}

function checkTitle(mode, title) {
	if (!itemsData[mode]) {
		return false;
	}
	for (item in itemsData[mode]) {
		if (itemsData[mode][item].title == title) {
			return true;
		}
	}
	return false;
}

function checkURL(value) {
	return !(value.substr(0, 7) == "http://" || value.substr(0, 8) == "https://");
}

function sendItemsUpdate(mode) {
	var url = host + "update.cgi";
	$.post(url, {
				'action' : mode,
				'current': 1,
				'data': prepareItemsData(itemsData[mode])				
				} );
}

function updateVolume() {
	$("#vol_value").html(currentVolume);
	$("#vol_slider").val(currentVolume);
}

function changeVolume(vol) {
	currentVolume = vol;
	updateVolume();
	sendVolumeUpdate();
}

function sendVolumeUpdate() {
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'volume',  
					'value' : currentVolume
				} 
		   );
}

function sendMuteUpdate() {
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'mute',  
					'value' : currentMute
				} 
		   );
}

function updateMute() {
	$("#mute_button").val((currentMute == 1) ? "Unmute" : "Mute");
}

function updatePower() {
	$("#power_button").val((currentPower == 1) ? "Power Off" : "Power On");
}

function sendPowerUpdate() {
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'power',  
					'value' : currentPower
				} 
		   );
}

function loadFrequences() {
	var select = $("#fm_frequences");
	var value;
	for (var i = 875; i <= 1080; i++) {
		value = i / 10;
		value = value.toFixed(1);
		select.append('<option value="' + value + '">' + value + '</option>');
	}	
}

function switchMenu(item) {
	$("#network_menu").attr('class', 'item');
	$("#fm_menu").attr('class', 'item');
	$("#mp3track_menu").attr('class', 'item');
	$("#linein_menu").attr('class', 'item');
	$("#settings_menu").attr('class', 'item');
	$("#" + item + "_menu").attr('class', 'item_selected');
	
	$("#network_container").hide();
	$("#fm_container").hide();
	$("#mp3track_container").hide();
	$("#linein_container").hide();
	$("#settings_container").hide();
	$("#" + item + "_container").show();
	
	$("#title").html(titleMap[item]);
	
	if (item == "settings") {
		startClock();
	}
	else {
		stopClock();
	}
	clearTimeout(mp3TrackElapsedTimeTimerId);
	if (item == "mp3track") {
		mp3TrackElapsedTimeTimerId = setTimeout(updateMp3TrackElapsedTime, 1000);
		mp3TrackElapsedTime = mp3TrackElapsedTimeDelay;
	}
}

function sendModeUpdate() {
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'mode',  
					'value' : currentMode
				} 
		   );
}

function loadMode() {
	var url = host + "items.cgi?action=mode"; 
	$.get(url, function(data) {
		currentMode = data.trim();
		switchMenu(currentMode);
	});
}

function startClock() {
	clockTimerId = showDateTime("clock", "clock_value");
}

function stopClock() {
	clearTimeout(clockTimerId);
}

function showDateTime(showId, valueId) {
	var date = new Date;
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var dayOfWeek = date.getDay();
	var hour = date.getHours();
	if (hour < 10) {
		hour = "0" + hour;
	}
	minute = date.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
	var second = date.getSeconds();
	if (second < 10) {
		second = "0" + second;
	}
	var result = days[dayOfWeek] + ' ' + months[month] + ' ' + day + ' ' + year + ' ' + hour + ':' + minute + ':' + second;
	var value = year + ' ' + (month + 1) + ' ' + day + ' ' + hour + ' ' + minute + ' ' + second;
	$("#" + showId).html(result);
	$("#" + valueId).val(value);
	return setTimeout('showDateTime("' + showId+ '","' + valueId+ '")', 1000);
}

function syncTime(value) {
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'clock',  
					'value' : value
				} 
		   );	
}

function loadSleepTimerValues() {
	var sleepTime = $("#sleep_time");
	var alarm1OffTimeout = $("#alarm1_off_timeout");
	var alarm2OffTimeout = $("#alarm2_off_timeout");

	var option  = '<option value="0">Never</option>';
	alarm1OffTimeout.append(option);
	alarm2OffTimeout.append(option);
		
	var value;
	for (var i = 1; i <= 18; i++) {
		value = i * 10;
		option = '<option value="' + value + '">' + value + ' min.</option>';
		sleepTime.append(option);
		alarm1OffTimeout.append(option);
		alarm2OffTimeout.append(option);
	}	
}

function loadSleepTimer() {
	var url = host + "items.cgi?action=sleep"; 
	$.get(url, function(data) {
		if (data) {
			var arr = data.split(' ');
			updateSleepTimer(arr);
		}
	});
}

function updateSleepTimer(arr) {
	$("#sleep_time").val(arr[0]);
	sleepTimerOn = arr[1];
	$("#sleep_set_button").val(sleepTimerOn == 1 ? "Off" : "On");	
}	

function disableSleepTimerRefresh() {
	isSleepTimerChanged = true;
}	

function setSleepTimerTime(value) {
	isSleepTimerChanged = true;
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'sleep',  
					'value' : value + ' ' + sleepTimerOn
				},
			function(data) {
				isSleepTimerChanged = false;
			}
		   ).error(function() { 
				isSleepTimerChanged = false; 
		    });	
}

function setSleepTimer() {
	isSleepTimerChanged = true;
	sleepTimerOn = (sleepTimerOn == 1) ? 0 : 1; 
	$("#sleep_set_button").val(sleepTimerOn == 1 ? "Off" : "On");
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'sleep',  
					'value' : $('#sleep_time').val() + ' ' + sleepTimerOn
				},
			function(data) {
				isSleepTimerChanged = false;
			}				
		   ).error(function() { 
				isSleepTimerChanged = false; 
		    });	
}

function loadAlarmValues() {
	var alarm1Hour = $("#alarm1_hour");
	var alarm1Min = $("#alarm1_min");
	var alarm2Hour = $("#alarm2_hour");
	var alarm2Min = $("#alarm2_min");
	
	var i, value;
	for (i = 0; i <= 23; i++) {
		value = i;
		if (value < 10) {
			value = "0" + value;
		}	
		alarm1Hour.append('<option value="' + value + '">' + value + '</option>');
		alarm2Hour.append('<option value="' + value + '">' + value + '</option>');
	}
	for (i = 0; i <= 59; i++) {
		value = i;
		if (value < 10) {
			value = "0" + value;
		}
		alarm1Min.append('<option value="' + value + '">' + value + '</option>');
		alarm2Min.append('<option value="' + value + '">' + value + '</option>');
	}

	var alarm1Volume = $("#alarm1_volume");
	var alarm2Volume = $("#alarm2_volume");
	for (i = 1; i <= 15; i++) {
		alarm1Volume.append('<option value="' + i + '">' + i + '</option>');
		alarm2Volume.append('<option value="' + i + '">' + i + '</option>');
	}	
}

function loadAlarmPresets(type, container) {
	var preset = $("#" + container);
	preset.empty();
	var items = itemsData[type];
	var len = items.length;
	if (len > 0) {
		for (var i = 0; i < len; i++) {
			preset.append('<option value="' + (i + 1) + '">' + items[i].title + '</option>');
		}
	}
	else {
		preset.append('<option value="0">No presets</option>');
	}	
}

function loadAlarm(alarm) {
	var url = host + "items.cgi?action=alarm" + alarm; 
	$.get(url, function(data) {
		if (data) {
			var arr = data.trim().split(' ');
			updateAlarm(alarm, arr);
		}
	});
}

function updateAlarm(alarm, arr) {
	var type = (arr[0] == "2") ? "network" : "fm";
	$("#alarm" + alarm + "_preset_type").val(type);
	$("#alarm" + alarm + "_preset").val(arr[1]);
	$("#alarm" + alarm + "_volume").val(arr[2]);
	$("#alarm" + alarm + "_off_timeout").val(arr[3]);
	var hour = arr[4];
	if (hour < 10) {
		hour = "0" + hour;
	}
	$("#alarm" + alarm + "_hour").val(hour);
	var min = arr[5];
	if (min < 10) {
		min = "0" + min;
	}
	$("#alarm" + alarm + "_min").val(min);
	var on = parseInt(arr[6]);
	if (alarm == 1) {
		alarm1On = on;
	}
	else {
		alarm2On = on;
	}
	$("#alarm" + alarm + "_set_button").val(on == 1 ? "Off" : "On");
	if (arr[7] != "0") $("#alarm" + alarm + "_day1").prop('checked', true);
	if (arr[8] != "0") $("#alarm" + alarm + "_day2").prop('checked', true);
	if (arr[9] != "0") $("#alarm" + alarm + "_day3").prop('checked', true);
	if (arr[10] != "0") $("#alarm" + alarm + "_day4").prop('checked', true);
	if (arr[11] != "0") $("#alarm" + alarm + "_day5").prop('checked', true);
	if (arr[12] != "0") $("#alarm" + alarm + "_day6").prop('checked', true);
	if (arr[13] != "0") $("#alarm" + alarm + "_day7").prop('checked', true);
}	

function changeAlarm(alarm) {
	if (alarm == 1) {
		alarm1On = (alarm1On == 1) ? 0 : 1;
	}
	else {
		alarm2On = (alarm2On == 1) ? 0 : 1;
	}
}

function setAlarm(alarm) {
	var on = (alarm == 1) ? alarm1On : alarm2On;
	
	$("#alarm" + alarm + "_set_button").val(on == 1 ? "Off" : "On");
	var mode = ($("#alarm" + alarm + "_preset_type").val() == "network") ? 2 : 1;
	var preset = $("#alarm" + alarm + "_preset").val();
	var volume = $("#alarm" + alarm + "_volume").val();
	var timeout = $("#alarm" + alarm + "_off_timeout option:selected").val();
	var hour = parseInt($("#alarm" + alarm + "_hour").val());
	var minute = parseInt($("#alarm" + alarm + "_min").val());
	var days = ($("#alarm" + alarm + "_day1").is(":checked")) ? '1' : '0';
	days += ($("#alarm" + alarm + "_day2").is(":checked")) ? ' 2' : ' 0';
	days += ($("#alarm" + alarm + "_day3").is(":checked")) ? ' 3' : ' 0';
	days += ($("#alarm" + alarm + "_day4").is(":checked")) ? ' 4' : ' 0';
	days += ($("#alarm" + alarm + "_day5").is(":checked")) ? ' 5' : ' 0';
	days += ($("#alarm" + alarm + "_day6").is(":checked")) ? ' 6' : ' 0';
	days += ($("#alarm" + alarm + "_day7").is(":checked")) ? ' 7' : ' 0';
	
	var url = host + "update.cgi"
	$.post(url, {
					'action' : 'alarm' + alarm,  
					'value' : mode + ' ' + preset + ' ' + volume + ' ' + timeout + ' ' + hour + ' ' + minute + ' ' + on + ' ' + days
				},
				function(data) {
					if (alarm == 1) {
						isAlarm1Changed = false;
					}
					else {
						isAlarm2Changed = false;
					}					
				}					
		   ).error(function() { 
				if (alarm == 1) {
					isAlarm1Changed = false;
				}
				else {
					isAlarm2Changed = false;
				}	 
		    });	
}

function parseItemsData(items) {
	var output = [];
	var id;
	var item = [];
	var arr = items.split(';');
	if (arr.length > 0) {
		for (id in arr) {
			if (arr[id].length > 1) {
				item = arr[id].split('|');
				output[output.length] = { "title": item[0], "value": item[1] };
			}	
		}
	}
	return output;
}

function prepareItemsData(data) {
	var output = "";
	for (id in data) {
		output += data[id].title + "|" + data[id].value + ";";
	}
	return output;
}

function sendPlayItem(mode, current) {
	isItemChanged = true;
	
	var url = host + "update.cgi"
	var action;
	switch (mode) {
		case "fm":
			action = "playfm";
			itemsCurrent["fm"] = current;
			break;
		case "mp3playlist":
			action = "playmp3playlist";
			currentMp3Playlist = current;
			break;	
		case "mp3track":
			action = "playmp3";
			itemsCurrent["mp3track"] = current;
			break;
		default:
			action = "playnetwork";
			itemsCurrent["network"] = current;
			break;
	}
	$.post(url, {
				'action' : action,
				'value': current
				},
			function(data) {
				isItemChanged = false;
			}
		   ).error(function() { 
				isItemChanged = false; 
		    });	 
}

function enableNetworkApplyButton() {
	isNetParamsChanged = true;
	$("#network_setup_apply_button").removeAttr('disabled');
}

function resetNetworkParams() {
	$("#network_ssid").val('');
	$("#network_encryption").val('none');
	$("#network_key").val('');
	$("#network_setup_key_block").hide();
	enableNetworkApplyButton();
}

function networkEncryptionUpdate(encryption) {
	isNetParamsChanged = true;
	showNetworkKey(encryption);
}
	
function showNetworkKey(encryption) {
	if (encryption == "none") {
		$("#network_setup_key_block").hide();
	}
	else {
		$("#network_setup_key_block").show();
	}
}

function setNetworkParams() {
	var mode = $("#network_connection_type").val();
	var ssid = $("#network_ssid").val();
	var encryption = $("#network_encryption").val();
	var key = $("#network_key").val();
	
	if (ssid == '') {
		alert('Invalid network name');
		$("#network_ssid").focus();
		return;
	}
	
	if (encryption != 'none' && (key.length < 8 || key.length > 63)) {
		alert('Invalid network key');
		$("#network_key").focus();
		return;
	}
	$("#network_setup_default_button").attr('disabled', 'true');
	$("#network_setup_apply_button").attr('disabled', 'true');
	$("#network_setup_updating").show();
	var url = host + "updatenetparams.cgi";
	$.post(url, {
					'mode' : mode,
					'ssid' : ssid,
					'encryption' :	encryption,
					'key' : key
				},
				function(data) {
					alert('Network config was successfully updated');
					$("#network_setup_updating").hide();
					isNetParamsChanged = false;
				}	
		   ).error(function() { 
				isNetParamsChanged = false; 
		    })
	if (networkCheckTimer) {
		clearTimeout(networkCheckTimer);
	}	
	networkCheckTimer = setTimeout(checkNetwork, 10000); //check delay interval
}

function checkNetwork() {
	var url = host + "netparams.cgi"; 
	$.get(url, function(data) {
		if (data) {
			$("#network_setup_updating").hide();
			if ($("#network_connection_type").val() != 'ap') {
				alert('Network config update failed. Restored default AP mode');
			}
		}
	}).fail(function() {
		$("#network_setup_updating").hide();
		alert('Unable to connect to host. Please check computer Wi-Fi settings');
	});
}

function loadNetworkParams() {
	var url = host + "netparams.cgi"; 
	$.get(url, function(data) {
		if (data) {
			var arr = data.trim().split(' ');
			$("#network_connection_type").val(arr[0]);
			$("#network_ssid").val(arr[1]);
			var encryption = arr[2];
			$("#network_encryption").val(encryption);
			$("#network_key").val(arr[3]);
			showNetworkKey(encryption);
			$("#network_setup_apply_button").attr('disabled', 'true');
		}
	});
}

function restoreNetworkParams() {
	$("#network_connection_type").val("ap");
	$("#network_ssid").val("WebRadio");
	var encryption = "psk";
	$("#network_encryption").val(encryption);
	$("#network_key").val("12345678");
	showNetworkKey(encryption);
}

function getCurrentMp3Playlist() {
	if (itemsData["mp3playlist"]) {
		var playlist = itemsData["mp3playlist"][itemsCurrent["mp3playlist"] - 1].title; 
		if (playlist) {
			$("#mp3_playlist_title").text(playlist);
		}
	}	
}

function loadMp3TrackFolders() {
	var url = host + "items.cgi?action=mp3trackfolder"; 
	$.get(url, function(data) {
		if (data) {
			var arr = data.split('^');
			var pathArray = arr[0].split('|');
			var titleArray = arr[1].split('|');
			titleArray[0] = '/';
			var folder = $("#mp3_playlist_folder_select");
			folder.empty();
			folder.append('<option value="' + pathArray[0] + '" selected="true">/</option>');
			var prefix = '/mnt/';
			var title;
			var path;
			for (var i = 1; i < titleArray.length; i++) {
				folder.append('<option value="' + pathArray[i] + '">|' + titleArray[i] + '</option>');
			}
		}
	});
}

function addMp3Playlist() {
	var title = $("#mp3_playlist_title_input").val();
	var folder = $("#mp3_playlist_folder_select").val();
	title = title.replace('"', '');
	if (title == "") {
		alert("Invalid title");
		$("#mp3_playlist_title_input").focus();
		return;
	}
	if (checkTitle("mp3playlist", title)) {
		alert("Item already exists");
		$("#mp3_playlist_title_input").focus();
		return;
	}
	$("#mp3_playlist_title_input").val("");
	$("#mp3_playlist_folder_select").val("/mnt");
	
	if (!itemsData["mp3playlist"]) {
		itemsData["mp3playlist"] = [ { "title": title, "value": folder } ];
	}
	else {
		itemsData["mp3playlist"][itemsData["mp3playlist"].length] = { "title": title, "value": folder };
	}	
	
	updateItemsList("mp3playlist", 1, true, false, true);
	sendItemsUpdate("mp3playlist");
}

function updateCurrentMp3Playlist() {
	$("#mp3_tracks_updating").show();
	isPlayLocked = true;
	var folder = itemsData["mp3playlist"][itemsCurrent["mp3playlist"] - 1].value;
	
	var url = host + "updatemp3playlist.cgi?folder=" + folder;
	
	$.get(url, function(data) {
		data = data.trim();
		if (data == 'ok') {
			isPlayLocked = false;
			$("#mp3_tracks_updating").hide();

			loadItemsList("mp3track");
			
			playCurrentItem();	
		}
	});	
}

function playItemByDirection(mode, direction) {
	var total = itemsData[mode].length;
	if (direction == 'next') {
		itemsCurrent[mode]++;
	}
	else {
		itemsCurrent[mode]--;
	}
	if (itemsCurrent[mode] > total) {
		itemsCurrent[mode] = 1;
	}
	else if (itemsCurrent[mode] < 1) {
		itemsCurrent[mode] = total;
	}
	playCurrentItem();
}

function setCurrentMp3TrackTitle() {
	var title = itemsData["mp3track"][itemsCurrent["mp3track"] - 1].title;
	$("#mp3_track_title").html("Track: " + title);
}

function updateMp3TrackElapsedTime() {
	if (currentMode != "mp3track") {
		return;
	}
	mp3TrackElapsedTime++;
	
	var minutes;
	var seconds;
	if (mp3TrackElapsedTime > 0) {
		minutes = Math.floor(mp3TrackElapsedTime / 60);
		seconds = mp3TrackElapsedTime - minutes * 60;
		if (seconds < 10) {
			seconds = "0" + seconds;	
		}	
	}
	else {
		minutes = "0";
		seconds = "00";
	}	
	$("#mp3_track_elapsed_time").html(minutes + ":" + seconds);
	
	mp3TrackElapsedTimeTimerId = setTimeout(updateMp3TrackElapsedTime, 1000);	
}

function loadStatus() {
	var action = "";
	if (isSettingsShown) {
		action = "statussettings";
	}
	else {	
		switch (currentMode) {
			case "fm":
				action = "statusfm";
				break;
			case "network":
				action = "statusnetwork";
				break;
			case "mp3track":
				action = "statusmp3";
				break;	
			case "linein":
				action = "statuslinein";
				break;
		}		
	}	
	var url = host + "items.cgi?action=" + action;
	$.get(url, function(data) {
		var arr = data.split(' ');
		if (currentMode != arr[0] && !isSettingsShown) {
			switchMenu(arr[0]);
		}
		currentMode = arr[0];
		
		if (currentVolume != parseInt(arr[1])) {
			currentVolume = parseInt(arr[1]);
			updateVolume();
		}
		
		if (currentMute != parseInt(arr[2])) {
			currentMute = parseInt(arr[2]);
			updateMute();
		}
		if (currentPower != parseInt(arr[3])) {
			currentPower = parseInt(arr[3]);
			updatePower();
		}
		if (isSettingsShown) {
			if (!isNetParamsChanged) {
				if ($("#network_connection_type").val() != arr[4]) {
					$("#network_connection_type").val(arr[4]);
				}
				if ($("#network_ssid").val() != arr[5]) {
					$("#network_ssid").val(arr[5]);
				}	
				var encryption = arr[6];
				if ($("#network_encryption").val() != encryption) {
					$("#network_encryption").val(encryption);
					showNetworkKey(encryption);
				}
				if ($("#network_key").val() != arr[7]) {
					$("#network_key").val(arr[7]);
				}
			}
			if (!isSleepTimerChanged) {
				updateSleepTimer(arr.slice(8, 10));
			}
			if (!isAlarm1Changed) {
				updateAlarm(1, arr.slice(10, 24));
			}
			if (!isAlarm2Changed) {
				updateAlarm(2, arr.slice(24));
			}	
		}	
		else {
			if (!isItemChanged) {
				switch (currentMode) {
					case "fm":
						var currentFmItem = parseInt(arr[4]);
						if (itemsCurrent["fm"] != currentFmItem) {
							itemsCurrent["fm"] = currentFmItem;
							setSelectedRow(currentMode, currentFmItem);
						}
						var currentFmTitle = decodeURI(arr[5].trim());
						if (currentFmTitle == "") {
							currentFmTitle = "n/a";
						}
						if ($("#fm_track_title").html() != "Track: " + currentFmTitle) {
							$("#fm_track_title").html("Track: " + currentFmTitle);
						}
						break;
					case "network":
						var currentNetItem = parseInt(arr[4]);
						if (itemsCurrent["network"] != currentNetItem) {
							itemsCurrent["network"] = currentNetItem;
							setSelectedRow(currentMode, currentNetItem);
						}
						var currentNetTitle = decodeURI(arr[5].trim());
						if (currentNetTitle == "") {
							currentNetTitle = "n/a";
						}
						if ($("#network_track_title").html() != "Track: " + currentNetTitle) {
							$("#network_track_title").html("Track: " + currentNetTitle);
						}
						break;
					case "mp3track":
						var currentMp3Playlist = parseInt(arr[4]);
						var currentMp3Track = parseInt(arr[5].trim());
						if (itemsCurrent["mp3playlist"] != currentMp3Playlist) { 
							itemsCurrent["mp3playlist"] = currentMp3Playlist;
							getCurrentMp3Playlist();
							setSelectedRow("mp3playlist", currentMp3Playlist);
						}	
						if (itemsCurrent["mp3track"] != currentMp3Track) {
							itemsCurrent["mp3track"] = currentMp3Track;					
							setCurrentMp3TrackTitle();
							setSelectedRow(currentMode, currentMp3Track);
							mp3TrackElapsedTime = mp3TrackElapsedTimeDelay;
						}
						break;	
				}
			}	
		}
	});
	setTimeout(loadStatus, 1000);
}

function disableAlarm1Refresh() {
	isAlarm1Changed = true;
}

function disableAlarm2Refresh() {
	isAlarm2Changed = true;
}