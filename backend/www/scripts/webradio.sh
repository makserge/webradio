#!/bin/ash

script_path="/www/webradio/scripts"
data_path="/www/webradio/data"
port="/dev/ttyATH0"

lastfmmeta=""

echo -n "" > $data_path/curfmmeta
echo -n "" > $data_path/curnetworkmeta

rm $data_path/playmp3.lock

echo '14~1' > $port #Load complete
sleep 2

poweron() {
	echo -n "1" > $data_path/power

	mode=`cat $data_path/mode`
	if [ $mode == "fm" ] ; then
		echo '2~1' > $port
	elif [ $mode == "network" ] ; then
		echo '2~2' > $port
	elif [ $mode == "mp3track" ] ; then
		echo '2~3' > $port
	elif [ $mode == "linein" ] ; then
		echo '2~4' > $port
	fi

	echo "3~`cat $data_path/volume`" > $port
	$script_path/playstream.sh 1>/dev/null 2>&1 &	
	$script_path/playpreset.sh 1>/dev/null 2>&1
	$script_path/playmp3.sh 1>/dev/null 2>&1 &	
}

poweroff() {
	echo -n "0" > $data_path/power

	$script_path/stopstream.sh 1>/dev/null 2>&1 &
}

poweralarm() {
	echo -n "1" > $data_path/power
}

poweron

#  MUTE [0-1] // MUTE 0
#  MODE [fm|network|linein] // MODE fm
#  VOL [1-15] // VOL 4
#  PRESET [1-999] // PRESET 1
#  NPRESET [1-999] // NPRESET 1
#  TRACK [1-999] // TRACK 1
#  SLEEP 60 [0-1] // SLEEP 60 0
#  ALARM1 1 2 12 60 0 30 1 1 2 3 4 5 0 0 - mode preset vol timeout hour minute on days(1-7)
#  ALARM2 1 2 12 60 0 30 1 0 0 0 0 0 6 7
#  POWER [0-1] // POWER 0
#  POWERALARM 1
#  RDS Some data

while read command param1 param2 param3 param4 param5 param6 param7 param8 param9 param10 param11 param12 param13 param14; do
	case $command in
		"MUTE")
			param1=`echo "$param1" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 > $data_path/mute
			;;
		"MODE")
			param1=`echo "$param1" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 > $data_path/mode
			$script_path/stopstream.sh 1>/dev/null 2>&1
			sleep 1
			$script_path/playstream.sh 1>/dev/null 2>&1 &	
			$script_path/playpreset.sh 1>/dev/null 2>&1
			$script_path/playmp3.sh 1>/dev/null 2>&1 &
			;;
		"VOL")
			param1=`echo "$param1" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 > $data_path/volume
			;;
		"PRESET")
			param1=`echo "$param1" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 > $data_path/curfmpreset
			sleep 1
			$script_path/playpreset.sh 1>/dev/null 2>&1 &
			;;
		"NPRESET")
			param1=`echo "$param1" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 > $data_path/curnetwork
			sleep 1
			$script_path/playstream.sh 1>/dev/null 2>&1 &
			;;
		"TRACK")
			param1=`echo "$param1" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 > $data_path/curmp3track
			$script_path/stopstream.sh
			sleep 1
			$script_path/playmp3.sh 1>/dev/null 2>&1 &
			;;
		"SLEEP")
			param2=`echo "$param2" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 $param2 > $data_path/sleep
			;;
		"ALARM1")
			param14=`echo "$param14" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 $param2 $param3 $param4 $param5 $param6 $param7 $param8 $param9 $param10 $param11 $param12 $param13 $param14 > $data_path/alarm1
			;;
		"ALARM2")
			param14=`echo "$param14" | tr -d '\r' | tr -d '\n'`
			echo -n $param1 $param2 $param3 $param4 $param5 $param6 $param7 $param8 $param9 $param10 $param11 $param12 $param13 $param14 > $data_path/alarm2
			;;
		"POWER")
			if [ $param1 -eq 1 ] ; then
				poweron
			else
				poweroff
			fi
			;;
		"POWERALARM")
			poweralarm
			;;
		"RDS")
			fmmeta="$param1 $param2 $param3 $param4 $param5 $param6 $param7 $param8 $param9 $param10 $param11 $param12 $param13 $param14"
			if [ "$fmmeta" != "$lastfmmeta" ] ; then
				echo -n $fmmeta > $data_path/curfmmeta
				echo '11~'$fmmeta > $port
				
				lastfmmeta=$fmmeta
			fi
			;;
		*)	
			;;	
	esac
done < $port