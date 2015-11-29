#!/bin/ash

data_path="/www/webradio/data"
port="/dev/ttyATH0"
script_path="/www/webradio/scripts"

if [ `cat "$data_path/mode" | sed -e "s/\\n//g` == "network" ]
then
	old_meta=""
	
	while true
	do
		current=`cat "$data_path/curnetwork"`
		item=`sed -n ${current}p $data_path/network`
		stream=`echo $item | cut -d "|" -f 2 | sed -e "s/\~/ /g"`
		
		host=`echo $stream | cut -d'/' -f3 | grep : | cut -d: -f1`
		test=`ping -c 1 $host &> /dev/null && echo success || echo fail`
		if [ "$test" = "fail" ]
		then
			sleep 5
			$script_path/playstream.sh
			break
		fi
	
		meta=`wget -q --header='Icy-MetaData:1' -O - $stream | head -c 16384 | sed -n "s/^.*StreamTitle='\([^;]*\)';.*$/\1/p"`
		if [ "$meta" != "$old_meta" ]
		then
			echo -n $meta > $data_path/curnetworkmeta
			old_meta=$meta
			meta=`cat "$data_path/curnetworkmeta" | sed -f $data_path/utf8tocp866.sed`
			echo '11~'$meta > $port
		fi
		sleep 15
	done
	
fi