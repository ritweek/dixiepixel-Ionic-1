(function(){
	angular.module('starter')
	.controller('HomeController', ['$scope', '$cordovaFile', '$cordovaFileTransfer', '$cordovaCamera', HomeController]);

	function HomeController($scope, $cordovaFile, $cordovaFileTransfer, $cordovaCamera){

		var me = this;
		me.current_image = 'img/koro-sensei.jpg';
		me.image_description = '';
    me.detection_type = 'LABEL_DETECTION';

    me.detection_types = {
      LABEL_DETECTION: 'label',
      TEXT_DETECTION: 'text',
      LOGO_DETECTION: 'logo',
      LANDMARK_DETECTION: 'landmark'
    };

		var api_key = 'AIzaSyBAnnmT43PKGervGx_KSzbjzLdBqvhE2pI';


		$scope.takePicture = function(){
      //alert('detection type: ' + me.detection_type);

			var options = {
		  	destinationType: Camera.DestinationType.DATA_URL,
    		sourceType: Camera.PictureSourceType.CAMERA,
        targetWidth: 500,
        targetHeight: 500,
        correctOrientation: true, 
        cameraDirection: 0,
        encodingType: Camera.EncodingType.JPEG
			};

			$cordovaCamera.getPicture(options).then(function(imagedata){

				me.current_image = "data:image/jpeg;base64," + imagedata;
        me.image_description = '';
        me.locale = '';

				var vision_api_json = {
				  "requests":[
				    {
				      "image":{
				        "content": imagedata
				      },
				      "features":[
				        {
				          "type": me.detection_type,
				          "maxResults": 1
				        }
				      ]
				    }
				  ]
				};

				var file_contents = JSON.stringify(vision_api_json);

				$cordovaFile.writeFile(
					cordova.file.applicationStorageDirectory,
					'file.json',
					file_contents,
					true
				).then(function(result){

					var headers = {
						'Content-Type': 'application/json'
					};

					options.headers = headers;
//vision
					var server = 'https://vision.googleapis.com/v1/images:annotate?key=' + api_key;
					var filePath = cordova.file.applicationStorageDirectory + 'file.json';

					$cordovaFileTransfer.upload(server, filePath, options, true)
				  		.then(function(result){

                var res = JSON.parse(result.response);
                var key = me.detection_types[me.detection_type] + 'Annotations';
								me.image_description = res.responses[0][key][0].description;
								//alert(res.responses[0][key][0].description);
								//alert(JSON.stringify(result));
								//Translate
							var sourceLang = 'en';
							var targetLang = 'nl';
							//googleTranslateElementInit();
							
				// 			google.language.translate('Hello', 'en', 'fr', function(result) {
        // alert(result.translation);

// 								alert(sourceLang + ' ; ' +targetLang);
							var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(res.responses[0][key][0].description);
							makeRequest(url);
// 								alert(url);
//   							var result = JSON.parse(UrlFetchApp.fetch(url).getContentText());
// 								alert(result);
  
//   							translatedText = result[0][0][0];
  
//   							var json = {
//     						'sourceText' : sourceText,
//     						'translatedText' : translatedText
//   								};
// 									alert(json);

// 									var req = new XMLHttpRequest();
// req.onreadystatechange = function() {
//     if (req.readyState === 4) {
//         var response = req.responseText;
//         var json = JSON.parse(response);

//         console.log(json);
// 				alert(json);
//     }
// };

// req.open('GET', 'https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(res.responses[0][key][0].description)');
// req.send(null);
// var request = makeHttpObject();
// request.open("GET", url);
// alert(url);
// request.send(null);
// request.onreadystatechange = function() {
// 	alert('onreadystatechange');
//   //if (request.readyState == 4){
// 	var response = request.responseText;
//         var json = JSON.parse(response);
// 	alert('Ritweek');
//     alert(request.responseText);
// 		alert(json);
// //	}
// };
					  }, 
						
						function(err){
					    alert('An error occured while uploading the file');
					  });

				}, function(err){
          alert('An error occured while writing to the file');
        });

			}, function(err){
			  alert('An error occured getting the picture from the camera');
			});
// 			function makeHttpObject() {
//   try {return new XMLHttpRequest();}
//   catch (error) {}
//   try {return new ActiveXObject("Msxml2.XMLHTTP");}
//   catch (error) {}
//   try {return new ActiveXObject("Microsoft.XMLHTTP");}
//   catch (error) {}

//   throw new Error("Could not create HTTP request object.");
// }

// function googleTranslateElementInit() {
// new google.translate.TranslateElement({pageLanguage: 'fr'}, 'translated_text');
// alert($('#translated_text').val());
// }
//translate part not working
function makeRequest(url) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
		httpRequest.onreadystatechange = alertContents;
    httpRequest.open('GET', url, false);
    httpRequest.send(null);
  }

  function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        alert(httpRequest.responseText);
      } else {
        alert('There was a problem with the request.');
      }
    }
  }

		}

	}

})();
