@echo off

set SourceDirectoryPath="C:\Multimedia\Icons"
set DestinationDirectorhPath="C:\Multimedia\Icons (PNG)"

node .\src\main.mjs %SourceDirectoryPath% %DestinationDirectorhPath%

pause