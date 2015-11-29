#!/bin/ash
echo "Content-type: text/html"
echo ""

port="/dev/ttyATH0"
data_path="/www/webradio/data"
script_path="/www/webradio/scripts"

poweron() {
	if [ `cat "$data_path/power" | sed -e "s/\\n//g` == "0" ]; then  
		echo -n "1" > $data_path/power
		
		echo '15~1' > $port
	fi	
}

if [ "$REQUEST_METHOD" == "POST" ]; then
	QUERY_STRING=`cat -`

	action=`echo "$QUERY_STRING" | sed -n 's/^.*action=\([^&]*\).*$/\1/p'`
	params=`echo "$QUERY_STRING" | sed "s/%7C/\|/g" | sed "s/%22/\"/g" | sed "s/%5B/\[/g" | sed "s/\+/ /g" | sed "s/%2C/\,/g" | sed "s/%7D/\}/g" | sed "s/%5D/\]/g" | sed "s/%2F/\//g" | sed "s/%3A/\:/g" | sed "s/%28/\(/g" | sed "s/%29/\)/g"`
	
	if [ $action == "fm" ] ; then
	
		data=`echo "$params" | sed -n 's/^.*data=\([^&]*\).*$/\1/p' | sed -e "s/%3B/\n/g" | sed -f $data_path/urldecode.sed | sed -e 's/ /\~/g'`
		
		echo -n "" > $data_path/fmpreset
		for item in $data
		do
			echo $item >> $data_path/fmpreset
		done
		
		poweron
		
		current=`echo "$params" | sed -n 's/^.*current=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $current > $data_path/curfmpreset
		
		count=`wc -l $data_path/fmpreset | awk '{print $1}'`
		echo '10~'$count > $port
		
		$script_path/playpreset.sh 1>/dev/null 2>&1 &
		
	elif [ $action == "playfm" ] ; then
	
		value=`echo "$params" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $value > $data_path/curfmpreset
		
		poweron
		
		$script_path/playpreset.sh 1>/dev/null 2>&1 &
	
	elif [ $action == "network" ] ; then
	
		data=`echo "$params" | sed -n 's/^.*data=\([^&]*\).*$/\1/p' | sed -e "s/%3B/\n/g" | sed -f $data_path/urldecode.sed | sed -e 's/ /\~/g'`
		
		echo -n "" > $data_path/network
		for item in $data
		do
			echo $item >> $data_path/network
		done
		
		poweron
		
		current=`echo "$params" | sed -n 's/^.*current=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $current > $data_path/curnetwork
		
		count=`wc -l $data_path/network | awk '{print $1}'`
		echo '9~'$count > $port
		
		$script_path/playstream.sh 1>/dev/null 2>&1 &
		
	elif [ $action == "playnetwork" ] ; then
	
		value=`echo "$params" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $value > $data_path/curnetwork
		
		poweron
		
		$script_path/playstream.sh 1>/dev/null 2>&1 &
		
	elif [ $action == "mp3playlist" ] ; then
	
		data=`echo "$params" | sed -n 's/^.*data=\([^&]*\).*$/\1/p' | sed -e "s/%3B/\n/g" | sed -f $data_path/urldecode.sed | sed -e 's/ /\~/g'`
		
		echo -n "" > $data_path/mp3playlist
		for item in $data
		do
			echo $item >> $data_path/mp3playlist
		done
		
		current=`echo "$params" | sed -n 's/^.*current=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $current > $data_path/curmp3playlist

	elif [ $action == "playmp3playlist" ] ; then
	
		value=`echo "$params" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $value > $data_path/curmp3playlist

	elif [ $action == "playmp3" ] ; then
	
		value=`echo "$params" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $value > $data_path/curmp3track
		
		poweron
		
		$script_path/stopstream.sh
		
		sleep 1
		
		$script_path/playmp3.sh 1>/dev/null 2>&1 &	
		
	elif [ $action == "volume" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p'`
		echo -n $value > $data_path/volume
		echo '3~'$value > $port		
		
	elif [ $action == "mute" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p'`
		echo -n $value > $data_path/mute
		echo '1~'$value > $port
		
	elif [ $action == "mode" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p'`
		echo -n $value > $data_path/mode
		
		if [ $value == "fm" ] ; then
			echo '2~1' > $port
		elif [ $value == "network" ] ; then
			echo '2~2' > $port
		elif [ $value == "mp3track" ] ; then
			echo '2~3' > $port
		elif [ $value == "linein" ] ; then
			echo '2~4' > $port
			
			poweron
		fi
		
		$script_path/stopstream.sh 1>/dev/null 2>&1 &
		
	elif [ $action == "clock" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -r 's/\+/~/g'`
		echo '6~'$value > $port
		
	elif [ $action == "sleep" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -r 's/\+/ /g'`
		echo -n $value > $data_path/sleep
		
		value=`echo "$value" | sed -e 's/ /\~/g'`
		echo '5~'$value > $port
	
	elif [ $action == "alarm1" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -r 's/\+/ /g'`
		echo -n $value > $data_path/alarm1
		
		value=`echo "$value" | sed -e 's/ /\~/g'`
		echo '7~'$value > $port
		
	elif [ $action == "alarm2" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p' | sed -r 's/\+/ /g'`
		echo -n $value > $data_path/alarm2
		
		value=`echo "$value" | sed -e 's/ /\~/g'`
		echo '8~'$value > $port
		
	elif [ $action == "power" ] ; then
	
		value=`echo "$QUERY_STRING" | sed -n 's/^.*value=\([^&]*\).*$/\1/p'`
		echo -n $value > $data_path/power
		echo '15~'$value > $port
		
	fi
  
fi

echo ok