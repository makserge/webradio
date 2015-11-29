#!/bin/sh

path="/www/webradio/data"

action=`echo "$QUERY_STRING" | sed -n 's/^.*action=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`

echo "Content-type: text/html; charset=utf8\n"
echo ""

if [ $action == "statusfm" ] ; then
	echo "`cat $path/mode` `cat $path/volume` `cat $path/mute` `cat $path/power` `cat $path/curfmpreset` `cat $path/curfmmeta | sed 's/ /%20/g'`"
elif [ $action == "statusnetwork" ] ; then
	echo "`cat $path/mode` `cat $path/volume` `cat $path/mute` `cat $path/power` `cat $path/curnetwork` `cat $path/curnetworkmeta | sed 's/ /%20/g'`"
elif [ $action == "statusmp3" ] ; then
	echo "`cat $path/mode` `cat $path/volume` `cat $path/mute` `cat $path/power` `cat $path/curmp3playlist` `cat $path/curmp3track`"
elif [ $action == "statuslinein" ] ; then
	echo "`cat $path/mode` `cat $path/volume` `cat $path/mute` `cat $path/power`"
elif [ $action == "statussettings" ] ; then
	echo "`cat $path/mode` `cat $path/volume` `cat $path/mute` `cat $path/power` `uci get wireless.@wifi-iface[0].mode` `uci get wireless.@wifi-iface[0].ssid` `uci get wireless.@wifi-iface[0].encryption` `uci get wireless.@wifi-iface[0].key` `cat $path/sleep` `cat $path/alarm1` `cat $path/alarm2`"
elif [ $action == "curfmpreset" ] ; then
	echo "`cat $path/curfmpreset`"
elif [ $action == "network" ] ; then
	echo "`cat $path/network | sed ':a;N;$!ba;s/\n/\;/g' | sed 's/\~/ /g' | sed 's/%250A//g'`"
elif [ $action == "curnetwork" ] ; then
	echo "`cat $path/curnetwork`"
elif [ $action == "fm" ] ; then
	echo "`cat $path/fmpreset | sed ':a;N;$!ba;s/\n/\;/g' | sed 's/\~/ /g' | sed 's/%250A//g'`"
elif [ $action == "mp3trackfolder" ] ; then	
	echo "`ls /mnt -R | grep ":$" | sed -e 's/:$//' | sed ':a;N;$!ba;s/\n/\|/g'`^`ls /mnt -R | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' -e 's/^/   /' -e 's/-/|/' | sed 's/\/mnt//' | sed 's/^ *//' | sed ':a;N;$!ba;s/\n//g'`"
elif [ $action == "mp3playlist" ] ; then
	echo "`cat $path/mp3playlist | sed ':a;N;$!ba;s/\n/\;/g' | sed 's/\~/ /g' | sed 's/%250A//g'`"
elif [ $action == "curmp3playlist" ] ; then
	echo "`cat $path/curmp3playlist`"
elif [ $action == "mp3track" ] ; then
	echo "`cat $path/mp3track | sed ':a;N;$!ba;s/\n/\;/g' | sed 's/\~/ /g' | sed 's/%250A//g'`"
elif [ $action == "curmp3track" ] ; then
	echo "`cat $path/curmp3track`"
elif [ $action == "volume" ] ; then
	echo "`cat $path/volume`"
elif [ $action == "mute" ] ; then
	echo "`cat $path/mute`"	
elif [ $action == "mode" ] ; then
	echo "`cat $path/mode`"
elif [ $action == "sleep" ] ; then
	echo "`cat $path/sleep`"
elif [ $action == "alarm1" ] ; then
	echo "`cat $path/alarm1`"
elif [ $action == "alarm2" ] ; then
	echo "`cat $path/alarm2`"	
fi