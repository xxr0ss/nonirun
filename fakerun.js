var actualRuntime = 0

var multiplier_factor = 15

var totalDistance = 0

var mylongitude = 103.983994
var mylatitude = 30.582851
var myspeed = 3.2 * multiplier_factor
var delta = 0.00001
let handle_longitude = setInterval(() => {
  mylongitude += delta * myspeed / 2
}, 500)
let handle_delta = setInterval(()=>{
  if (mylongitude >= 103.9890 || mylongitude <= 103.9840) {
    delta = -delta
  }
}, 500)




var type_amaplocation = "com.amap.api.location.AMapLocation"

function main() {
  console.log('Script Loaded')

  Java.perform(() => {
    console.log('Java.perform()')
    var AMapLocation = Java.use(type_amaplocation)
    AMapLocation.getLatitude.overload().implementation = function () {
      // send('this: ' + this)
      var result = this.getLatitude()
      if (result <= 0.1) {
        // console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()));
      }
      // send('Latitude:' + result)
      return mylatitude + Math.random() / 10000
    }
    AMapLocation.getLongitude.overload().implementation = function () {
      // var result = this.getLongitude()
      // send('longitude:' + mylongitude)
      return mylongitude
    }
    AMapLocation.getLocationType.overload().implementation = function () {
      var result = this.getLocationType()
      // send('LocationType:' + result)
      if (result != 1) {
        // send('LocationType:' + result + ' changed to 1')
      }
      return 1
    }

    AMapLocation.getBearing.overload().implementation = function () {
      // var result = this.getBearing()
      return delta > 0 ? 90.1 + Math.random(): 270.4 + Math.random()
    }

    AMapLocation.getGpsAccuracyStatus.overload().implementation = function() {
      // var result = this.getGpsAccuracyStatus()
      return 1 // GPS_ACCURACY_GOOD
    }

    AMapLocation.getTime.overload().implementation = function() {
      return new Date().getTime()
    }
    
    AMapLocation.getAccuracy.overload().implementation = function () {
      var result = this.getAccuracy()
      var myresult = 2.5
      if (result > 20.0){
        // send('Accuracy > 20.0, but returned ' + myresult)
      }
      return myresult + Math.random()
    }

    AMapLocation.getSpeed.overload().implementation = function () {
      var result = this.getSpeed()
      // send('Speed:' + result + ' changed to ' + 3.1)
      var speed = myspeed + Math.random()
      return speed
    }

    AMapLocation.getErrorCode.overload().implementation = function () {
      var result = this.getErrorCode()
      if (result != 0)
        send('ErrorCode:' + result + ' changed to 0')
      return 0
    }

    AMapLocation.getSatellites.overload().implementation = function() {
      var result = this.getSatellites()
      // send('Satellites:' + result)
      return 4 + (Math.random() > 0.5 ? 1 : 0)
    }

    AMapLocation.getProvider.overload().implementation = function () {
      var provider = this.getProvider()
      // if (provider.toLowerCase() != 'gps')
      //   send('Error provider:'+provider + ' changed to gps')
      return 'gps'
    }


    var RSImpl = Java.use('com.tanma.unirun.service.RunningServiceImpl')
    var Latlng = Java.use('com.amap.api.maps.model.LatLng')
    RSImpl.getMostAccuracyLocation.overload(type_amaplocation).implementation = function(amap) {
      send('getMostAccurayLocation: (' + mylatitude + ', ' + mylongitude + ')')
      return Latlng.$new(mylatitude, mylongitude)
    }

    RSImpl.onLocationSuccess.overload(type_amaplocation, 'com.tanma.unirun.data.Track')
      .implementation = function(amap, track) {
      console.log('RSImpl.onLocationSuccess')
      return this.onLocationSuccess(amap, track)
    }

    RSImpl.onLcationFail.overload('int', 'java.lang.String', 'java.lang.String')
      .implementation = function(code, info, detail) {
      console.log('RSImplonLcationFail, code=' + code + ' info: '+info)
      if (code==14) {
        console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Throwable").$new()))
      }
      // var tracklist = RSImpl.getTrackList()
      // var track = tracklist.get(tracklist.size() - 1)
      // console.log('trans to onLocationSuccess')
      // console.log('last_success_amap: ', last_success_amap)
      // console.log('track: ', track)
      // return RSImpl.onLocationSuccess(last_success_amap, track)
      return
    }

    RSImpl.getRunDistance.overload().implementation = function() {
      totalDistance = Math.floor(actualRuntime * myspeed)
      console.log('RSImpl.getRunDistance: ', totalDistance)
      return totalDistance
    }

    RSImpl.getRunTime.overload().implementation = function() {
      var fake_run_time = actualRuntime * multiplier_factor
      console.log('RSIml.getRunTime: ', fake_run_time)
      return fake_run_time
    }


    var RLEvent = Java.use('com.tanma.unirun.utils.event.RunningLocationEvent')

    RLEvent.getFlag.overload().implementation = function() {
      return 1
    }

    RLEvent.getGpsStatus.overload().implementation = function() {
      var one = Java.use('java.lang.Integer').$new(1)
      return one
    }

    var TrackUtils = Java.use("com.tanma.unirun.utils.TrackUtils")
    TrackUtils.getDistance.overload().implementation = function() {
      var originalDistance = this.getDistance()
      console.log('Original Distance: ' + originalDistance + ' changed to ' + totalDistance)
      return totalDistance
    }

    TrackUtils.pointsIsInArea.overload('int').implementation = function(val) {
      return Java.use('java.lang.String').$new("1")
    }

    var RunningEvent = Java.use("com.tanma.unirun.utils.event.RunningEvent")
    RunningEvent.getRunTtime.overload().implementation = function() {
      actualRuntime = this.getRunTtime()
      // console.log('runtime: ' + actualRuntime)
      return actualRuntime * multiplier_factor
    }

    var RPImpl = Java.use('com.tanma.unirun.ui.activity.running.RunningPresenterImpl')
    RPImpl.showVerify.overload().implementation = function() {
      return
    }

    // RPImpl.setVerify.overload('int').implementation = function(v) {
    //   console.log('SetVerify 2'
    //   this.setVerify(2)
    // }

    // RPImpl.setRunRecordValid.overload('java.lang.String').implementation = function(valid) {
    //   console.log('setRunRecordValid: ' + valid)
    //   this.setRunRecordValid(valid)
    // }
    // RPImpl.showResultView.overload('B', 'String').implementation = function(a, b) {
    //   return this.showResultView(true, 'Nice')
    // }
    RPImpl.onEvent.overload('com.tanma.unirun.utils.event.RunningEvent').implementation = function(event) {
      var event_code = event.getEvent()
      if (event_code == 3) {
        event.setEvent(4)
      }
      if (this.mVerify != 1)
        console.log('this.mVerify: ' + this.mVerify.toString() + ' changed to 1')
      this.setVerify(1)
      console.log('event.getEvent: ' + event_code)
      this.onEvent(event)
    }

    RPImpl.onEventLoc.overload('com.tanma.unirun.utils.event.RunningLocationEvent').implementation = function(event) {
      console.log('onEventLoc')
      return this.onEventLoc(event)
    }

    RPImpl.checkRunRecord.overload().implementation = function() {
      this.setVerify(1)
      console.log('checkRunRecord')
      return this.checkRunRecord()
    }


    // var RunningActivity = Java.use("com.tanma.unirun.ui.activity.running.RunningActivity")
    // RunningActivity.onActivityResult.overload("int", "int", "android.content.Intent").implementation = function(reqCode, resCode, intent) {
    //   if (reqCode == 19) {
    //     console.log('Result from vocalVerification: ' + resCode)
    //     if (resCode == -1) {
    //       resCode = 1
    //     }
    //   }
    //   this.onActivityResult(reqCode, resCode, intent)
    // }

    var SRRRB =Java.use("com.tanma.unirun.network.body.StudentRunRecordRequestBody")
    SRRRB.setVocalStatus.overload("java.lang.String").implementation = function(s) {
      console.log("setVocalStatus")
      this.setVocalStatus("1")
    }


    
  }
  )
}

setImmediate(main)
