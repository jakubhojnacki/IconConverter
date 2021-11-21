@echo off

set SourceDirectoryPath=C:\Multimedia\Icons
set DestinationDirectorhPath=C:\Temp

node .\src\main.mjs "%SourceDirectoryPath%" "%DestinationDirectoryPath%"

pause