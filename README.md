# Jarvis-IoT

## Jarvis is a IoT service designed for IoT Home Security.

### Basic Scenario

  Server running -> sensor Intrusion Detection -> Photos and Video Recording -> cloud upload( Flickr ) ->
  Intrusion alerts to registered users
  
  ※ Video is not implemented  ( ~~ing )

### Installation & Running

Basic Installation
  - Node.js
  - modgoDB
  - Android ADB

JarvisService 

``` sh
git clone https://github.com/wonny/Jarvis-IoT.git
cd Jarvis-IoT/JarvisService
node Jarvis.cmd -> Jarvis Server Running
```
※ If mongoDB is installed when you run the following command:
(If db Test is completed, it will be the background process.)
``` sh
mongod --dbpath /* the path that you want to use the db */
```

JarvisApp

The App for Only Demo. The full version will later Release.

``` sh
cd Jarvis-IoT/JarvisApp/bin
adb install JarvisApp.apk
```
### Test

``` sh
cd Jarvis-IoT/JarvisService
node client.js test.jpg
```
