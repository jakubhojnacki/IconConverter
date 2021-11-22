#!/bin/bash

tty -s || exec konsole -e "$0" "$@"

copy "./launch.json" "../../.vscode/launch.json"
copy "./settings.json" "../../settings.json"

read -n 1 -s -r -p "(Press any key to end)"