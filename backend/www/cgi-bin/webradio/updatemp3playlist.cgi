#!/bin/ash

data_path="/www/webradio/data"
script_path="/www/webradio/scripts"
port="/dev/ttyATH0"

echo "Content-type: text/html; charset=utf-8\n"
echo ""

folder=$(echo -e `echo "$QUERY_STRING" | sed -n 's/^folder=\([^&]*\).*$/\1/p' | sed -e's/%\([0-9A-F][0-9A-F]\)/\\\\\x\1/g'`)

#echo $folder
if [ -n "$folder" ] ; then
	$script_path/stopstream.sh
	
	delay 1

	echo -n "" > $data_path/mp3track
	find "$folder" -type f -name '*.mp3' | while read line; do
		#echo $line
		artist="`tail -c 95 "$line" | head -c 30 | sed 's/\([^ ]*\) *$/\1/' | sed -f $data_path/cp1251toutf8.sed`"
		title="`tail -c 125 "$line" | head -c 30 | sed 's/\([^ ]*\) *$/\1/' | sed -f $data_path/cp1251toutf8.sed`"
		if [ "$artist - $title" != " - " ] ; then
			data="$artist - $title|$line"
		else
			data="`basename "$line" | sed "s/.mp3//g"`|$line"
		fi
		
		echo "`echo $data | sed -e 's/ /\~/g`" >> $data_path/mp3track
		
	done

	echo -n "1" > $data_path/curmp3track
	
	count=`wc -l $data_path/mp3track | awk '{print $1}'`
	echo '13~'$count > $port

	echo "ok"
fi