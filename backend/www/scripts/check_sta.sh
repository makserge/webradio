#!/bin/sh

TIMEOUT=30
SLEEP=10

disableSta() {
        n=`uci show wireless.@wifi-iface[99] 2>/dev/null | grep @wifi-iface | grep -v =wifi-iface | cut -d. -f2 | uniq | cut -d[ -f2 | cut -d] -f1 | sort | tail -1`
        echo "disable_sta: found $n ifaces"

        ap=0
        while [ $n -ge 0 ]; do
                mode=`uci get wireless.@wifi-iface[$n].mode`
                echo "iface[$n] mode[$mode]"
                if [ X$mode == Xsta ]; then
                        echo "deleting wifi-iface[$n] for it's in sta mode"
                        uci delete wireless.@wifi-iface[$n]
                        uci commit wireless
                elif [ X$mode == Xap ]; then
                        echo "found wifi-iface[$n] in ap mode."
                        ap=1
                fi
                        let n=n-1
                done
		
        if [ $ap -eq 0 ]; then
                echo "adding wifi default ap..."
                uci add wireless wifi-iface
                uci set wireless.@wifi-iface[-1].device='radio0'
                uci set wireless.@wifi-iface[-1].network='lan'
                uci set wireless.@wifi-iface[-1].mode='ap'
                uci set wireless.@wifi-iface[-1].ssid='WebRadio'
                uci set wireless.@wifi-iface[-1].key='12345678'
                uci set wireless.@wifi-iface[-1].encryption='psk'
                uci commit wireless
        fi

        wifi up
}

staErr=0

while [ 1 -gt 0 ]; do

        ifName="wlan0"
        echo "checking $ifName after sleep $SLEEP seconds..."
        ifType=`iw dev $ifName info | grep type | cut -d' ' -f2`
        echo "checking $ifName 's type: $ifType"

        if [ X$ifType == Xmanaged ]; then
                ssid=`iw dev $ifName link | grep SSID | cut -d' ' -f 2`
                echo "ifname $ifName is STA mode, ssid[$ssid]"
                if [ X$ssid == "X" ]; then
                        let staErr=$staErr+1
                        echo "ifname $ifName not connected. err counter: $staErr"
                else
                        staErr=0
                fi
        fi


        sleep $SLEEP;

        let errTime=$staErr*$SLEEP

        if [ $errTime -gt $TIMEOUT ]; then
                echo "*** STA connect timeout[$errTime]. disable STA mode now... ***"
                sleep 1
                disableSta
                staErr=0
        fi

done		