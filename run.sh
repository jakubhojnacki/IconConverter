#!/bin/bash

tty -s || exec konsole -e "$0" "$@"

sourcedirectoryPath="/home/Multimedia/Icons (ICO)"
destinationDirectoryPath="/home/Temp"

node "./src/main.mjs" $sourcedirectoryPath $destinationDirectoryPath

read -n 1 -s -r -p "(Press any key to end)"