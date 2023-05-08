#!/bin/bash

tty -s || exec konsole -e "$0" "$@"

cp "./launch.json" "../../.vscode/launch.json"
cp "./settings.json" "../../settings.json"

read -n 1 -s -r -p "(Press any key to end)"