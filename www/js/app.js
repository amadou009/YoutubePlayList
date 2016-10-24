angular.module('starter', ['ionic', 'youtube-embed'])

  .controller("AppCtrl", function ($scope, youtubeEmbedUtils, $ionicLoading, $http, $anchorScroll, $location) {

    var newHash;

    /**
     * https://docs.angularjs.org/api/ng/service/$anchorScroll
     */
    var reglerScrollListe = function () {

      newHash = 'anchor' + $scope.videoActuelle;
      if ($location.hash() !== newHash) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash(newHash);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
    }

    // Liste des videos de la playlist
    $scope.videos = [];

    /**
     * Parametres de réquete. Plus d'infos : https://developers.google.com/youtube/v3/docs/playlistItems/list
     */
    $scope.youtubeParams = {
      // API key de mon projet sur https://console.developers.google.com/
      key: 'AIzaSyDnl7IDKJ5hvH2dOtGirJ9VfLwnHisG0Hw',
      part: 'id,snippet',
      // Id de la playlist dans https://www.youtube.com/watch?v=91HLMcpODyY&list=PLHcjC26_FA5TUovAj3k5kJW3EEabw0pIt
      playlistId: 'PLHcjC26_FA5TUovAj3k5kJW3EEabw0pIt',
      maxResults: 50
    }

    /**
     *  paramètre (Id de la playlist) passé au lecteur : https://github.com/brandly/angular-youtube-embed/tree/master/src/demo
     */
    $scope.playlist = {
      vars: {
        list: 'PLHcjC26_FA5TUovAj3k5kJW3EEabw0pIt'
      }
    };


    $ionicLoading.show({
      template: 'Chargement du lecteur ...'
    });

    /**
     * Evenemnent et gestion de lecteur : https://github.com/brandly/angular-youtube-embed#events-and-player-controls
     */

    $scope.$on('youtube.player.ready', function ($event, player) {
      $ionicLoading.hide();
      player.playVideo();
      console.log("player ready");

      $http.get('https://www.googleapis.com/youtube/v3/playlistItems', { params: $scope.youtubeParams }).success(function (response) {
        angular.forEach(response.items, function (child) {
          $scope.videos.push(child);
          $scope.videoActuelle = 0;

          newHash = 'anchor' + $scope.videoActuelle;

        });
      });

    });

    $scope.$on('youtube.player.error', function ($event, player) {
      console.log("error", $event);
      $ionicLoading.hide()
    });

    $scope.$on('youtube.player.ended', function ($event, player) {
      $scope.videoActuelle++;
      console.log($scope.videoActuelle);
      reglerScrollListe();
    });


    // joue la video précédente
    $scope.precedenteVideo = function () {
      if ($scope.videoActuelle - 1 >= 0) {
        $scope.videoActuelle--;
        console.log("precedente video ", $scope.videoActuelle);
        $scope.cieplayer.playVideoAt($scope.videoActuelle);
        reglerScrollListe();
      }
    }

    // joue la video suivante
    $scope.suivantVideo = function () {
      if ($scope.videoActuelle + 1 < $scope.videos.length) {
        $scope.videoActuelle++;
        console.log("video suivante", $scope.videoActuelle);
        $scope.cieplayer.playVideoAt($scope.videoActuelle);
        reglerScrollListe();
      }
    }

    // joue une video sélectionnée
    $scope.jouerVideoA = function (index) {
      $scope.videoActuelle = index;
      console.log("jouer video à : ", $scope.videoActuelle);
      $scope.cieplayer.playVideoAt(index);
      reglerScrollListe();
    }


    // joue la première video
    $scope.premiereVideo = function () {
      $scope.videoActuelle = 0;
      $scope.cieplayer.playVideoAt($scope.videoActuelle);

      reglerScrollListe();
    }

    // joue la dernière video
    $scope.derniereVideo = function () {
      $scope.videoActuelle = $scope.videos.length - 1;
      $scope.cieplayer.playVideoAt($scope.videoActuelle);

      reglerScrollListe();
    }

  })

  .run(function ($ionicPlatform, $anchorScroll) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);

        $anchorScroll.yOffset = 10;

      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
