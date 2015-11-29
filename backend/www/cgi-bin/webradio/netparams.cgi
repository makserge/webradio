#!/bin/sh

echo "Content-type: text/html"
echo ""
	
echo "`uci get wireless.@wifi-iface[0].mode` `uci get wireless.@wifi-iface[0].ssid` `uci get wireless.@wifi-iface[0].encryption` `uci get wireless.@wifi-iface[0].key`"