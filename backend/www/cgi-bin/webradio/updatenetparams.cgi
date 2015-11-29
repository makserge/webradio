#!/bin/ash
echo "Content-type: text/html"
echo ""

if [ "$REQUEST_METHOD" == "POST" ]; then
	QUERY_STRING=`cat -`

	mode=`echo "$QUERY_STRING" | sed -n 's/^.*mode=\([^&]*\).*$/\1/p'`
	ssid=`echo "$QUERY_STRING" | sed -n 's/^.*ssid=\([^&]*\).*$/\1/p' | sed "s/\+/ /g"`
	encryption=`echo "$QUERY_STRING" | sed -n 's/^.*encryption=\([^&]*\).*$/\1/p' | sed "s/\%2B/+/g"`
	key=`echo "$QUERY_STRING" | sed -n 's/^.*key=\([^&]*\).*$/\1/p' | sed "s/\+/ /g"`
	
	if [ $mode == "ap" ] ; then
		uci set wireless.@wifi-iface[0].network='lan'
	else
		uci set wireless.@wifi-iface[0].network='wwan'
	fi
	uci set wireless.@wifi-iface[0].mode=$mode
	if [ $ssid != "" ] ; then
		uci set wireless.@wifi-iface[0].ssid=$ssid
	fi	
    if [ $encryption != "" ] ; then
		uci set wireless.@wifi-iface[0].encryption=$encryption
	fi
	if [ $key != "" ] ; then	
		uci set wireless.@wifi-iface[0].key=$key
	fi
    
	uci commit wireless
	
	wifi down 
	wifi up
	
fi