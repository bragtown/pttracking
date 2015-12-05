'use strict';

/**
 * @ngdoc service
 * @name ptTrackingApp.ptTracking
 * @description
 * # ptTracking
 * Factory in the ptTrackingApp.
 */
angular.module('ptTrackingApp')
  .factory('ptTracking', function ($firebaseArray, $firebaseObject) {
    // Service logic
    // ...
    var ref = new Firebase("https://sweltering-heat-6104.firebaseio.com/clients")
    var clients = $firebaseArray(ref)
    // var clients = [
    //   {
    //     name: 'John Doe',
    //     ptVisits: [new Date('11/9/2015')],
    //     ptaVisits: [new Date('11/12/2015'),new Date('11/10/2015'),new Date('11/04/2015'),new Date('11/02/2015')],
    //     activeClient: true,
    //     startDate: new Date('11/01/2015')
    //   }
    // ]
    var getVisits = function(id, type){
      var visitsRef = new Firebase("https://sweltering-heat-6104.firebaseio.com/clients/"+id+type)
      return $firebaseArray(visitsRef)
    }
    var addClient = function(stDate, visitDate, visitType, cliName){
       var newClient = {
          name: cliName,
          ptaVisits: [],
          ptVisits: [],
          activeClient: true,
          startDate:null
       }

       if(stDate != undefined)
        newClient.startDate = stDate.getTime();
       
        clients.$add(newClient).then(function(locRef) {
          var id = locRef.key();
          if(visitDate!= undefined){
            if(visitType == "ptVisit"){
              var changeRef = new Firebase("https://sweltering-heat-6104.firebaseio.com/clients/"+id+'/ptVisits')
              //var myVisits = $firebaseArray(changeRef)
              var myVisits = changeRef.push();
              myVisits.set(visitDate.getTime())
              //myVisits.$add(visitDate.getTime())
            }
            else if(visitType == "ptaVisit"){
              var changeRef = new Firebase("https://sweltering-heat-6104.firebaseio.com/clients/"+id+'/ptaVisits')
              //var myVisits = $firebaseArray(changeRef)
              //myVisits.$add(visitDate.getTime())
              var myVisits = changeRef.push();
              myVisits.set(visitDate.getTime())
            }
          }
        });
        

    }
    var submitChanges = function(cli, vDate, stDate, dis, vType){
      if(vDate != undefined){
        if(vType == "ptVisit"){
          var changeRef = new Firebase("https://sweltering-heat-6104.firebaseio.com/clients/"+cli.$id+"/ptVisits")
          //var myVisits = $firebaseArray(changeRef)
          //myVisits.$add(vDate.getTime())
              var myVisits = changeRef.push();
              myVisits.set(vDate.getTime())
        }
        if(vType == "ptaVisit"){
          var changeRef = new Firebase("https://sweltering-heat-6104.firebaseio.com/clients/"+cli.$id+'/ptaVisits')
         //var myVisits = $firebaseArray(changeRef)
          //myVisits.$add(vDate.getTime())
              var myVisits = changeRef.push();
              myVisits.set(vDate.getTime())
        }
      }
    }
    var rowColorFcn = function(ptDate, ptaDates, adDate){

    //most recent visit should always be at the end of the array
    //if their are no ptVisits row should be highlighted with the class "danger"
    //if their is x amount of days between the most recent pt visit and the current date, again highlight
    //if their are v amount of pta visits between pt visits, again highlight row
      var startDayMult = 3;
      var ptDateMs;
      if(ptDate != undefined){
        ptDateMs = ptDate;
      }
      var ptaBench = 9;
      var curDate = new Date();
      var startLimit = 1000*60*60*24*startDayMult;  //number of miliseconds in 3 days
      var warning = 'warning';
      var danger = 'danger';
      //start tx logic
      if(ptDate == undefined){
        if(curDate.getTime() - adDate < 0){
          return warning;
        }
        else{
          return danger;
        }
      }
      //during tx logic
      var ptaCount = 0;
      for(var q in ptaDates){
        if(ptDateMs < ptaDates[q].$value){
          ptaCount++;
        }
      }
      if(ptaCount < ptaBench && ptaCount > ptaBench - 2){
        return warning; 
      }
      else if(ptaCount == ptaBench){
        return danger;
      }
      return '';
    };

    var recentPTA = function(ptDate, ptaDates){
      if(ptDate != undefined){
        var ptaCount = 0
        for(var j in ptaDates){
          if(ptaDates[j].$value != undefined){
            if(ptDate < ptaDates[j].$value){
              ptaCount++
            }
          }
        }
        return ptaCount
      }
      else{
        return ptaDates.length
      }
    }


    // Public API here
    return {
      getClients: function(){
        console.log(clients);
        return clients;
      },
      getRowColor: function(ptDate, ptaDates, adDate){
        return rowColorFcn(ptDate, ptaDates, adDate);
      },
      getRecentPTA: function(ptDate, ptaDates){
        return recentPTA(ptDate, ptaDates);
      },
      addClientFcn: function(stDate, visitDate, visitType, cliName){
        addClient(stDate, visitDate, visitType, cliName)
      },
      addChangesFcn: function(cli, vDate, stDate, dis, vType){
        submitChanges(cli, vDate, stDate, dis, vType);
      },
      getVisitsFcn: function(id, type){
        return getVisits(id, type);
      }
    };
  });
