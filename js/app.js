var globalVariables = { //this object holds all our globals to help keep our footprint down.
  map: '',
  infoWindow: '',
  markers: [],
  clickMarker: '',
  clickMarkerPosition: '',
  filterFeatures: {
    changingStation: false,
    female: true,
    free: false,
    handycap: false,
    male: true,
    publicRestRoom: false,
    unisex: true
  },
  icons: {
    male: {
      icon: 'img/male.png'
    },
    female: {
      icon: 'img/female.png'
    },
    unisex: {
      icon: 'img/unisex.png'
    },
  },
  bathrooms: {},
};


function initMap() {
// Constructor creates a new map
  globalVariables.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.65748242274938, lng: -122.31318303660373},
    zoom: 20,
    mapTypeControl: false
  });
  globalVariables.infoWindow = new google.maps.InfoWindow({
    position: globalVariables.map.getCenter(),
  });
  showMarkers(globalVariables.bathrooms, globalVariables.filterFeatures);
  globalVariables.infoWindow.setContent("Right click on a location to create new bathrooms, "
                      + "or hover over the filter tab on the left.")
  globalVariables.infoWindow.open(globalVariables.map);
}; //END OF initMap()


//This function exists as a placeholder for future database implementation.
//Once database is implemented, changing out this function is trivial.
//Function returns an object containing bathroom information for creating
//markers.
function getBathrooms() {
  var bathroomsDB = [
    {"title": "Sureshot Espresso",
     "location": {"lat": 47.661416829669996,"lng":-122.31337934732437},
     "features":
      {
        "male": true,
        "female": false,
        "unisex": false,
        "handycap": true,
        "changingStation": true,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "4",
      "type": "male",
      "comments": ["Always clean, but sometimes busy."]
    },
    {
      "title": "Cafe Solstice",
      "location": {"lat":47.65736163117977,"lng":-122.31285631656647},
      "features":
      {
        "male": true,
        "female": false,
        "unisex": false,
        "handycap": true,
        "changingStation": false,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "3",
      "type": "male",
      "comments": ["Bathrooms are relatively clean despite the traffic to this popular coffee house."]
    },
    {
      "title": "Cafe Solstice",
      "location": {"lat":47.65736163117977,"lng":-122.31281206011772},
      "features":
      {
        "male": false,
        "female": true,
        "unisex": false,
        "handycap": true,
        "changingStation": false,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "3",
      "type": "female",
      "comments": ["Bathrooms are relatively clean despite the traffic to this popular coffee house."]
    },
    {
      "title": "Ichiro Teriyaki",
      "location": { lat: 47.65749297345125, lng: -122.3127356171608 },
      "features":
      {
        "male": false,
        "female": false,
        "unisex": true,
        "handycap": false,
        "changingStation": false,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "3",
      "type": "unisex",
      "comments": ["Bathrooms are relatively clean despite the traffic to this popular coffee house."]
    },
    {
      "title": "Shultzy's Bar and Grill",
      "location": { lat: 47.65731682658052, lng: -122.31286033987999 },
      "features":
      {
        "male": true,
        "female": false,
        "unisex": false,
        "handycap": false,
        "changingStation": false,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "4",
      "type": "male",
      "comments": ["Bathrooms are very clean."]
    },
    {
      "title": "Shultzy's Bar and Grill",
      "location": { lat: 47.657324053130516, lng: -122.31281340122223 },
      "features":
      {
        "male": false,
        "female": true,
        "unisex": false,
        "handycap": false,
        "changingStation": false,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "4",
      "type": "female",
      "comments": ["Bathrooms are very clean."]
    },
    {
      "title": "University Kitchen",
      "location": { lat: 47.65715513226328, lng: -122.31288850307465 },
      "features":
      {
        "male": true,
        "female": false,
        "unisex": false,
        "handycap": false,
        "changingStation": false,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "1",
      "type": "male",
      "comments": ["Filthy disgusting hell hole."]
    },
    {
      "title": "University Kitchen",
      "location": { lat: 47.657165068800005, lng: -122.31285095214844 },
      "features":
      {
        "male": false,
        "female": true,
        "unisex": false,
        "handycap": false,
        "changingStation": false,
        "free": true,
        "cost": 0,
        "withPurchase": false,
        "publicRestRoom": false
      },
      "rating": "1",
      "type": "female",
      "comments": ["Filthy disgusting hell hole."]
    },
  ];
  return bathroomsDB;
};
globalVariables.bathrooms = getBathrooms();


//Function returns string of beautifully formatted bathroom features for infoWindow
function getFeatures(marker) {
  var brFeatures = "";
  if (marker.features['male']) {
    brFeatures += "Gender: Male";
  };
  if (marker.features['female']) {
    brFeatures += "<p>Gender: Female</p>";
  };
  if (marker.features['unisex']) {
    brFeatures += "<p>Gender: Unisex</p>";
  };
  if (marker.features['handycap']) {
    brFeatures += "<p>Handycap Accesible: Yes</p>";
  };
  if (marker.features['changingStation']) {
    brFeatures += "<p>Changing Station: Yes</p>";
  };
  if (marker.features['free']) {
    brFeatures += "<p>Cost: Free</p>";
  };

  if (marker.features['cost'] && !(marker.features['cost'] && marker.features['free'])) {
    brFeatures += "<p>Cost: " + marker.features['cost'] + '</p>';
  };
  if (marker.features['withPurchase']) {
    brFeatures += "<p>Purchase Required: No</p>";
  };
  if (!marker.features['withPurchase']) {
    brFeatures += "<p>Purchase Required: Yes</p>";
  };
  if (marker.features['publicRestRoom']) {
    brFeatures += "<p>Public Restroom: Yes</p>";
  };
  if (marker.rating) {
    brFeatures += "<p>Cleanliness Rating: " + marker.rating + "/5</p>";
  };
  if (marker.comments[0]) {
    for (comment in marker.comments) {
      brFeatures += "<p style=\"color:#ffcc00;\">" + marker.comments + "</p>";
    };
  };
  return brFeatures;
};


function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    var brFeatures = getFeatures(marker);
    var yelpLat = marker.getPosition().lat();
    var yelpLng = marker.getPosition().lng();
    var yelpName = marker.title;
    var yelpStars = '';
    var yelpRating;
    var url = "http://localhost:5000/yelpAPI/";
    //perform an ajax call to the server, and retrieve yelp API
    $.ajax({
      'timeout': 1000,
      'cache': false,
      'async': true,
      'crossDomain': true,
      'url': url,
      'method': 'POST',
      'dataType': 'json',
      'data': {
        name: yelpName,
        latitude: yelpLat,
        longitude: yelpLng,
      }
    }).done(function(data) {
        var yelpRating = data['businesses'][0]['rating'];
        //make pretty stars
        if (yelpRating !== undefined) {
          for (var i=0; i<yelpRating; i++){
            yelpStars += '★';
          };
          for (var i=0; i<(5-yelpRating); i++) {
            yelpStars += '☆';
          };
        }
        else {
          yelpStars = 'unknown';
        };
        infowindow.setContent('<div><h2>' + marker.title + '</h2>'
                              + '<p>Venue Yelp Rating: ' + yelpStars + '</p>'
                              + brFeatures + '</div>');
        infowindow.open(globalVariables.map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
    }).fail(function(err){
      //handle error, and return an error
      infowindow.setContent('<div><h2>' + marker.title + '</h2>'
                            + 'Venue Yelp Rating: unknown' + '</p>'
                            + brFeatures + '</div>');
      infowindow.open(globalVariables.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      throw err;
    });
  };
};


//function take in an array of bathrooms, an array of filter features, and
//then sets markers onto map.  Only markers that pass the filter will be set.
function showMarkers(bathroomsArray) {
  for (marker in globalVariables.markers) {
    globalVariables.markers[marker].setMap(null);
    //bounds.extend(markers[marker].position);
  };
  globalVariables.markers = []
  for(place in globalVariables.bathrooms) {
    var current = globalVariables.bathrooms[place];
    var position = current.location;
    var title = current.title;
    var features = current.features;
    var rating = current.rating;
    var comments = current.comments;
    var icon = globalVariables.icons[current.type].icon;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      features: features,
      rating: rating,
      animation: google.maps.Animation.DROP,
      id: place,
      comments: comments,
      icon: icon,
    });
    globalVariables.markers.push(marker);
    //set up marker's to open infowindow on click
    marker.addListener('click', function() {
     globalVariables.clickMarker.setMap(null);
     populateInfoWindow(this, globalVariables.infoWindow);
   });
   //var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  };
  //set markers
  for (marker in globalVariables.markers) {
    var filterShowBool = false;
    if ((globalVariables.filterFeatures["male"] && globalVariables.markers[marker]["features"]["male"]) ||
        (globalVariables.filterFeatures["female"] && globalVariables.markers[marker]["features"]["female"]) ||
        (globalVariables.filterFeatures["unisex"] && globalVariables.markers[marker]["features"]["unisex"])) {
          filterShowBool = true;
      for (feature in globalVariables.markers[marker]["features"]){
        if (globalVariables.filterFeatures[feature] && feature !== "male" && feature !== "female" && feature !== "unisex") {
          if (globalVariables.filterFeatures[feature] && globalVariables.markers[marker]["features"][feature]){
            filterShowBool = true;
          }
          else {
            filterShowBool = false;
            break;
          };
        };
      };
    };
    if (globalVariables.filterFeatures.showAll) {
      filterShowBool = true;
    };
    if (filterShowBool) {
      globalVariables.markers[marker].setMap(globalVariables.map);
    };
  };
};


//this is the viewmodel
var ViewModel = function() {
  var $optionsBox = $('.options-box');
  var arrayToClear = [];
  self = this;


  //this helps hide our slide out filter
  self.hideMenu = function() {
    $optionsBox.css('-webkit-transition','opacity .3s');
    $optionsBox.css('transition','opacity .3s');
    $optionsBox.css('transition-delay','0s');
  };


  //this helps show our slide out filter
  self.showMenu = function() {
    $optionsBox.css('-webkit-transition','opacity 1s');
    $optionsBox.css('transition','opacity 1s');
    $optionsBox.css('transition-delay','2s');
  };


  // this ugly thing is what allows bindings in the right click menu.
  self.mapBind = function() { //for some reason map object is out of scope unless it is inside a binding.
    globalVariables.clickMarker = new google.maps.Marker();
    //keep event handlers from piling up
    google.maps.event.clearInstanceListeners(globalVariables.map);
    globalVariables.map.addListener('click', function() {
      globalVariables.infoWindow.close();
      //clean up markers
      for (item in arrayToClear) {
       arrayToClear[item].setMap(null);
      };
      globalVariables.clickMarker.setMap(null);
    });
    var listener = globalVariables.map.addListener('rightclick', function( event ){
      //clean up markers
      for (item in arrayToClear) {
        arrayToClear[item].setMap(null);
      };
      globalVariables.clickMarker.setMap(null);
      var onClickLatlng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
      globalVariables.clickMarker = new google.maps.Marker({
        position: onClickLatlng,
        icon: 'img/toilet.png'
      });
      globalVariables.clickMarker.setMap(globalVariables.map);
      arrayToClear.push(globalVariables.clickMarker);
      globalVariables.infoWindow.close();
      globalVariables.infoWindow.setContent("<input data-bind=\"value: newName\" id=\"nameadd\" placeholder=\"venue name\"><div>"
      + "  Male: <input type=\"radio\" data-bind=\"checked: newMale\" id=\"maleadd\" name=\"gender\">"
      + "  Female: <input type=\"radio\" data-bind=\"checked: newFemale\" id=\"femaleadd\" name=\"gender\">"
      + "  Unisex: <input type=\"radio\" data-bind=\"checked: newUnisex\" id=\"unisexadd\" name=\"gender\"><br>"
      + "  Handycap: <input type=\"checkbox\" data-bind=\"checked: newHandycap\" id=\"handycapadd\">"
      + " Changing Station: <input type=\"checkbox\" data-bind=\"checked: newChangingStation\" id=\"changingstationadd\"><br>"
      + " Public Restroom: <input type=\"checkbox\" data-bind=\"checked: newPublic\" id=\"publicrestroomadd\"><br>"
      + " Free to use: <input type=\"checkbox\" data-bind=\"checked: newFree\" id=\"freeadd\"><br>"
      + " Purchase Required: <input type=\"checkbox\" data-bind=\"checked: newWithPurchase\" id=\"purchaseadd\"><br>"
      + "<input data-bind=\"value: newCost, visible: !newFree()\" placeholder=\"Price to use.\" id=\"costadd\"></div><br>"
      + "  1: <input type=\"radio\" value=\"1\" data-bind=\"checked: newRating\" id=\"1add\" name=\"rating\">"
      + "  2: <input type=\"radio\" value=\"2\" data-bind=\"checked: newRating\" id=\"2add\" name=\"rating\">"
      + "  3: <input type=\"radio\" value=\"3\" data-bind=\"checked: newRating\" id=\"3add\" name=\"rating\">"
      + "  4: <input type=\"radio\" value=\"4\" data-bind=\"checked: newRating\" id=\"4add\" name=\"rating\">"
      + "  5: <input type=\"radio\" value=\"5\" data-bind=\"checked: newRating\" id=\"5add\" name=\"rating\"><br>"
      + "<input data-bind=\"value: newComment\" placeholder=\"Write a comment.\" id=\"comment\">"
      + "<input data-bind=\"click: addBathroom\" id=\"infoadd\" type=\"button\" value=\"Add Bathroom\">");
      globalVariables.clickMarkerPosition = globalVariables.clickMarker.position;
      globalVariables.infoWindow.open(globalVariables.map, globalVariables.clickMarker);
      isInfoWindowLoaded = false;
      //remove and reapply bindings to infoWindow
      google.maps.event.addListener(globalVariables.infoWindow, 'domready', function () {
        $(".gm-style-iw").next("div").hide();
        ko.cleanNode($('#nameadd'));
        ko.cleanNode($('#maleadd'));
        ko.cleanNode($('#femaleadd'));
        ko.cleanNode($('#unisexadd'));
        ko.cleanNode($('#handycapadd'));
        ko.cleanNode($('#changingstationadd'));
        ko.cleanNode($('#publicrestroomadd'));
        ko.cleanNode($('#freeadd'));
        ko.cleanNode($('#purchaseadd'));
        ko.cleanNode($('#showcost'));
        ko.cleanNode($('#costadd'));
        ko.cleanNode($('#1add'));
        ko.cleanNode($('#2add'));
        ko.cleanNode($('#3add'));
        ko.cleanNode($('#4add'));
        ko.cleanNode($('#5add'));
        ko.cleanNode($('#comment'));
        ko.cleanNode($('#infoadd'));
        if (!isInfoWindowLoaded) {
          ko.applyBindings(self, $('#nameadd')[0]);
          ko.applyBindings(self, $('#maleadd')[0]);
          ko.applyBindings(self, $('#femaleadd')[0]);
          ko.applyBindings(self, $('#unisexadd')[0]);
          ko.applyBindings(self, $('#handycapadd')[0]);
          ko.applyBindings(self, $('#changingstationadd')[0]);
          ko.applyBindings(self, $('#publicrestroomadd')[0]);
          ko.applyBindings(self, $('#freeadd')[0]);
          ko.applyBindings(self, $('#purchaseadd')[0]);
          ko.applyBindings(self, $('#costadd')[0]);
          ko.applyBindings(self, $('#1add')[0]);
          ko.applyBindings(self, $('#2add')[0]);
          ko.applyBindings(self, $('#3add')[0]);
          ko.applyBindings(self, $('#4add')[0]);
          ko.applyBindings(self, $('#5add')[0]);
          ko.applyBindings(self, $('#comment')[0]);
          ko.applyBindings(self, $('#infoadd')[0]);
          isInfoWindowLoaded = true;
        };
      });
    }, false);
  };


  //filter markers.
  self.filterChangingStation = ko.observable();
  self.filterFemale = ko.observable(true);
  self.filterFree = ko.observable();
  self.filterPurchase = ko.observable();
  self.filterHandycap = ko.observable();
  self.filterMale = ko.observable(true);
  self.filterPublicRestRoom = ko.observable();
  self.filterUnisex = ko.observable(true);
  self.filterShowAll = ko.observable();
  //whenever a filter observable is changed this function is called to update
  //the markers on the map.
  self.changeFilter = function() {
    globalVariables.filterFeatures = {
      changingStation: self.filterChangingStation(),
      female: self.filterFemale(),
      free: self.filterFree(),
      withPurchase: self.filterPurchase(),
      handycap: self.filterHandycap(),
      male: self.filterMale(),
      publicRestRoom: self.filterPublicRestRoom(),
      unisex: self.filterUnisex(),
      showAll: self.filterShowAll()
    };
    showMarkers(globalVariables.bathrooms);
    return true;
  };


  //This is for adding a new bathroom to our array
  function initBathroomObservables() {
    self.newName = ko.observable();
    self.newMale = ko.observable();
    self.newFemale = ko.observable();
    self.newUnisex = ko.observable();
    self.newHandycap = ko.observable();
    self.newChangingStation = ko.observable();
    self.newFree = ko.observable();
    self.newCost = ko.observable();
    self.newWithPurchase = ko.observable();
    self.newPublic = ko.observable();
    self.newRating = ko.observable();
    self.newComment = ko.observable();
  };
  initBathroomObservables();


  //this is called when you click "Add Bathroom" in the right click menu.
  self.addBathroom = function() {
    //batrooms need at least a name and gender
    if (!self.newName() || (!self.newMale() && !self.newFemale() && !self.newUnisex())) {
      alert("Please add venue name and gender before submitting.");
    }
    else {
      var newType;
      if(self.newMale) {
        newType = "male";
      };
      if(self.newFemale) {
        newType = "female";
      };
      if(self.newUnisex) {
        newType = "unisex";
      };
      globalVariables.bathrooms.push({title: self.newName(), location: globalVariables.clickMarkerPosition,
        features:
         {male: self.newMale(), female: self.newFemale(), unisex: self.newUnisex(), handycap: self.newHandycap(),
         changingStation: self.newChangingStation(), free: self.newFree(), cost: self.newCost(), withPurchase: !self.newWithPurchase(),
         publicRestRoom: self.newPublic()},
        rating: self.newRating(), type: newType, comments: [self.newComment()]});
        globalVariables.infoWindow.close()
        showMarkers(globalVariables.bathrooms, globalVariables.filterFeatures);
    };
     initBathroomObservables(); //reset observables
  };
};
ko.applyBindings(new ViewModel());
