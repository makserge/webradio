#!/bin/ash

data_path="/www/webradio/data"
script_path="/www/webradio/scripts"
port="/dev/ttyATH0"

if [ -f $data_path/playmp3.lock ]; then
	exit 1
fi

touch $data_path/playmp3.lock

total=`wc -l $data_path/mp3track | awk '{print $1}'`

play() {
	if [ ! -f $data_path/playmp3.lock ]; then
		exit 1
	fi

	current=`cat "$data_path/curmp3track"`
	
	count=0
	while read line           
	do           
		count=$(( count + 1))
		if [ $count -ge $current ]
		then
			title=`echo $line | cut -d "|" -f 1 | sed -e "s/\~/ /g" | sed -f $data_path/utf8tocp866.sed`
			file=`echo $line | cut -d "|" -f 2 | sed -e "s/\~/ /g"`
			
			echo '4~'$count > $port
			echo -e '11~'$title > $port
		
			killall madplay
			
			sleep 1
			
			madplay --attenuate=-15 --replay-gain=audiophile "$file"
			
			echo $count
			
			if [ $count == $total ]
			then
				echo -n 1 > $data_path/curmp3track
				play
			else
				echo -n $(( count + 1)) > $data_path/curmp3track
			fi
		fi	
	done < $data_path/mp3track
}

if [ `cat "$data_path/mode" | sed -e "s/\\n//g` == "mp3track" ]
then

	play
		
fi	