#!env /bin/bash
version=$(cat $(pwd)/lavalink/version)

if [[ $(ls $(pwd)/lavalink/lavalink.jar) ]]
then
  echo installed lavalink v$version
else
  echo installing lavalink v$version
  wget https://github.com/freyacodes/Lavalink/releases/download/$version/Lavalink.jar -O $(pwd)/lavalink/lavalink.jar
fi
