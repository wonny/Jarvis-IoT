# Jarvis-IoT

## Jarvis is a IoT service designed for IoT Home Security.

### Basic Scenario

  1. Server Running
  2. Sensor Intrusion Detection
  3. Photos and Video Recording
  4. Cloud(Flickr) Upload
  5. Intrusion alerts to registered users
    
※ Video is not implemented yet (TBD) 

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
