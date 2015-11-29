#!/bin/ash

data_path="/www/webradio/data"
port="/dev/ttyATH0"

if [ `cat "$data_path/mode" | sed -e "s/\\n//g` == "fm" ]
then
	echo -n "" > $data_path/curfmmeta
	current=`cat "$data_path/curfmpreset"`
	
	item=`sed -n ${current}p $data_path/fmpreset`
	
	title=`echo $item | cut -d "|" -f 1 | sed -e "s/\~/ /g" | sed -f $data_path/utf8tocp866.sed`
	freq=`echo $item | cut -d "|" -f 2 | sed -e "s/\~/ /g" | sed -e "s/\.//g"`
	echo '4~'$current > $port
	echo '12~'$freq > $port
	echo -e '11~'$title > $port
fi	