#!/bin/ash

data_path="/www/webradio/data"
port="/dev/ttyATH0"
script_path="/www/webradio/scripts"

if [ `cat "$data_path/mode" | sed -e "s/\\n//g` == "network" ]
then
    echo -n "" > $data_path/curnetworkmeta
	
	current=`cat "$data_path/curnetwork"`

	item=`sed -n ${current}p $data_path/network`

	title=`echo $item | cut -d "|" -f 1 | sed -e "s/\~/ /g" | sed -f $data_path/utf8tocp866.sed`
	echo '4~'$current > $port
	echo -e '11~'$title > $port
	
	killall wget 2> /dev/null
    killall madplay 2> /dev/null
	killall getstreammeta.sh 2> /dev/null
	killall streamplayer.sh 2> /dev/null
	
	sleep 1
	
	$script_path/streamplayer.sh 1>/dev/null 2>&1 &
	
	sleep 5
	
	$script_path/getstreammeta.sh 1>/dev/null 2>&1 &	
fi