'use strict';

/**
 * @ngdoc function
 * @name ptTrackingApp.controller:TrackingCtrl
 * @description
 * # TrackingCtrl
 * Controller of the ptTrackingApp
 */
angular.module('ptTrackingApp')
  .controller('TrackingCtrl', function ($scope, $firebaseObject, ptTracking, $sce, Ref, user) {
    
    var accountNo = ''
    var profile = new Firebase('https://sweltering-heat-6104.firebaseio.com/users/'+user.uid)
    profile.once("value", function(snapshot){ 
      var data = snapshot.val();
      accountNo = data.account
    })
    $scope.editData = false;
    $scope.visit = {
      stDate: undefined,
      date: undefined,
      discharge: false,
      visitType: null
    }
    var selectedClient;
    $scope.addForm = function(client){
      console.log(client);
      $scope.visit.stDate = new Date(client.startDate);
      $scope.editData = true;
      selectedClient = client;
      console.log($scope.visit.visitType)
    }
    $scope.submit = function(){
      ptTracking.addChangesFcn(selectedClient, $scope.visit.date, $scope.visit.stDate, $scope.visit.discharge, $scope.visit.visitType)
      if($scope.visit.date != undefined){
        if($scope.visit.type == "ptVisit"){
          $scope.visit.date = undefined;
          $scope.visit.type = null;
        }
        if($scope.visit.type == "ptaVisit"){
          $scope.visit.date = undefined;
          $scope.visit.type = null;
        }
       }


    }
    $scope.getFBArray = function(){

    }

    $scope.addClient = function(){
      ptTracking.addClientFcn($scope.newCli.stDate, $scope.newCli.date, $scope.newCli.type, $scope.newCli.Name, accountNo);
    }
    $scope.recentPTA = function(ptDate, ptaDates){
      return ptTracking.getRecentPTA(ptDate, ptaDates)
    }
    $scope.rowColor = function(ptDate, ptaDates, adDate){
      return ptTracking.getRowColor(ptDate, ptaDates, adDate);
    }
    $scope.clients = ptTracking.getClients()
    $scope.getVisits = function(id, type){
      return ptTracking.getVisitsFcn(id, type);
    }
    
  });
