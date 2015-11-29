#!/bin/ash

data_path="/www/webradio/data"

killall madplay
killall wget
killall playstream.sh
killall streamplayer.sh
killall getstreammeta.sh
killall playpreset.sh
killall playmp3.sh

rm $data_path/playmp3.lock

echo -n "" > $data_path/curfmmeta
echo -n "" > $data_path/curnetworkmeta