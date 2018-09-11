@echo on

cd .\xlsx2json
call export.bat

cd ..\protobuf
call GenProtobuff.bat
move bundles\protobuf-bundles.d.ts ..\..\client\libs\protobuf-bundles.d.ts
move bundles\protobuf-bundles.js ..\..\client\bin\libs\protobuf-bundles.js
move bundles\protobuf-bundles.min.js ..\..\bin\client\libs\min\protobuf-bundles.min.js
echo =======Success!==========
ping 127.1 -n 2000 >nul