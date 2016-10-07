/*
angular.module('redAnt.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {});
*/
angular.module('redAnt.controllers',[])

.controller('mainController',function(){
    //the main controller..
    })
.controller('loginController',function($scope,$http, $ionicPopup,$state,$ionicLoading,toastr){
//login logic
        $scope.login = function(LoginData)
        {
            console.info(LoginData);
            //show loading
            $ionicLoading.show();
            if(LoginData ==undefined){
                toastr.error('Provide the login Details');
                $ionicLoading.hide();
                return;
            }
            if(LoginData.username == undefined || LoginData.password == undefined){
                toastr.error('Provide the login details');
                $ionicLoading.hide();
                return;
            }
            //start session
            var startSession = function (user_id) {
                $http({
                    url:url+'startSession/'+user_id,
                    method:'GET'
                }).success(function (data) {
                    //store session data...
                    sessionStorage.setItem('user_id',data.id);
                    sessionStorage.setItem('name',data.name);
                    sessionStorage.setItem('loggedIn',true);
                    sessionStorage.setItem('email',data.email);
                    sessionStorage.setItem('organisation_id',data.organisation_id);
                });
            };
           //login the agent

            $http({
                method:'POST',
                url:url+'postLogin',
                data:LoginData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                //if correct login details
                if(data.status == 'correct'){
                    //start session...
                    startSession(data.id);
                    toastr.success(data.message,'Success');
                    //go to client menu page..
                    $state.go('mainMenu');

                }else if(data.status == 'incorrect'){
                    toastr.error(data.message,'Error!');
                }
            })

        }
    })
.controller('mainMenuController', function ($scope,$state,$ionicLoading,toastr) {

        //register a job seeker
    $scope.register = function () {
        //direct to the register page
      $state.go('register');
    };
        //logout the user..
    $scope.logout = function () {
        //destroy session data and load the login page'
        $ionicLoading.show();
        sessionStorage.clear();
        toastr.success('Logged out!');
        $state.go('login');
        $ionicLoading.hide();
    };

    $scope.view_my_job_seekers = function() {
        $state.go('my_job_seekers');
    };

     $scope.paidJobSeekers = function(){
         $state.go('paidJobSeekers');
     };

    $scope.my_profile = function(){
        $state.go('my_profile');
    }
    })
.controller('registerController',function($scope,$http,toastr,$ionicLoading,$state){

        $scope.formData = {};
        $scope.formData.payNow = false;
        $scope.formData.payNowMobile=false;
        $scope.formData.payNowd=true;//use this as the default..
        $scope.formData.agent='M-pesa';
       // $scope.formData.pics = [];//the object to hold the image data...
        //load the job categories


//the users should have their device geo-location enabled..
        $ionicLoading.show({
            template:'Loading your location...'
        });

        var options = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: false};

        function successFunction(position){
            loadCategories();
            $ionicLoading.hide();
            //add the geolocation to form data array
            $scope.formData.registration_longitude = position.coords.longitude;
            $scope.formData.registration_latitude = position.coords.latitude;
            toastr.success('successfully captured geo-location location');

            $scope.latLng = [$scope.formData.registration_latitude,$scope.formData.registration_longitude];
            $scope.latLng = new google.maps.latLng($scope.latLng);
            console.info("DISTance => ",google.maps.geometry.spherical.computeDistanceBetween($scope.latLng,$scope.latLng));
            //console.log("Distance: " + google.maps.geometry.spherical.computeDistanceBetween ($scope.latLng, $scope.shopLatLng));
        }
        function errorFunction(PositionError){
            //customizing the message notification to the user..
            $state.go('mainMenu');
            if(PositionError.code == 1){//permission to use GEO api
                toastr.error('Turn on the geo-location');
            }
            else if(PositionError.code == 2){//POSITION_UNAVAILABLE
                toastr.error('We could not determine your geo-location, Please try again.');
            }
            else if(PositionError.code == 3){//TIMEOUT
                toastr.error('We could\'t determine your geo-location, retry.','Timeout exceeded!');
            }else{
                toastr.error(PositionError.message);
            }
            //the is error array here,,
            $ionicLoading.hide();
            //customize error messages
        }
        navigator.geolocation.getCurrentPosition(successFunction,errorFunction,options);



        //the payment options

    $scope.payChange = function(mode)
    {
        if(mode=='cash')
        {
        $scope.formData.payNow=true;
        $scope.formData.payNowd=false;
        $scope.formData.payNowMobile = false;
        }if (mode == 'mobile'){
        $scope.formData.payNow=false;
        $scope.formData.payNowd=false;
        $scope.formData.payNowMobile = true;
        }if(mode=='later'){
        $scope.formData.payNow=false;
        $scope.formData.payNowMobile = false;
        }
    };

        $scope.locations = ['Baringo',
            'Bomet',
            'Bungoma',
            'Busia',
            'Elgeyo Marakwet',
            'Embu',
            'Garissa',
            'Homa Bay',
            'Isiolo',
            'Kajiado',
            'Kakamega',
            'Kericho',
            'Kiambu',
            'Kilifi',
            'Kirinyaga',
            'Kisii',
            'Kisumu',
            'Kitui',
            'Kwale',
            'Laikipia',
            'Lamu',
            'Machakos',
            'Makueni',
            'Mandera',
            'Meru',
            'Migori',
            'Marsabit',
            'Mombasa',
            'Muranga',
            'Nairobi',
            'Nakuru',
            'Nandi',
            'Narok',
            'Nyamira',
            'Nyandarua',
            'Nyeri',
            'Samburu',
            'Siaya',
            'Taita Taveta',
            'Tana River',
            'Tharaka Nithi',
            'Trans Nzoia',
            'Turkana',
            'Uasin Gishu',
            'Vihiga',
            'Wajir',
            'West Pokot'];

        function loadCategories() {
            $ionicLoading.show();
            $http({
                url:url+'loadCategories/'+sessionStorage.organisation_id,
                method:'GET'
            }).success(function (data) {
                $ionicLoading.hide();
                //insert the categories to the form list..
                $scope.cats = data;
            });

        }

        $scope.formData.agent_id = sessionStorage.user_id;
       $scope.registerCustomer = function (dataForm) {

           if(dataForm == undefined){
               toastr.error('Please fill in all the required entries','Error');
               return;
           }
           //validation before the actual registration
           if (dataForm.firstName == undefined ||dataForm.lastName == undefined || dataForm.phone_number == undefined ||
               dataForm.category_id == undefined || dataForm.work_description == undefined || dataForm.location == undefined
               ||dataForm.locationDesc == undefined){
               toastr.error('Please fill in all the required entries','Error');
               return;
           }
           //check if there are attached images
           /*console.info($scope.formData.pics);
           if($scope.formData.pics == undefined){
               toastr.error('Please attach some pictures.');
               return;
           }*/

           //if the pay now is activated ... then
           if($scope.formData.payNow){
               if($scope.formData.pay<=0 || $scope.formData.pay == undefined){
                   toastr.error('Please enter a valid payment amount');
                   return;
               }
           }
           //if the pay now with mobile money is activated ... then
           if($scope.formData.payNowMobile){
               if($scope.formData.transactionCode=='' || $scope.formData.transactionCode == undefined){
                   toastr.error('Please enter mobile money transaction code');
                   return;
               }
           }

           $ionicLoading.show();
           //ajax for registration

           $http({
               url:url+'/registerServiceProvider',
               method:'POST',
               data:dataForm,
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded'
               }
           }).success(function (data) {
               console.info('the files are here check => ',$scope.formData.pics);
               sessionStorage.setItem('serv_id',data.id);
               //handle the picture taken..
               //upload three pics
               uploadPhoto($scope.formData.pics['ID_front_pic'],1);
               uploadPhoto($scope.formData.pics['ID_back_pic'],2);
               uploadPhoto($scope.formData.pics['profile_pic'],3);

               //completed the user registration process..
               $state.go('mainMenu');
               //$state.go('mainMenu');
               toastr.success('Successfully registered '+data.name+' ');

               $ionicLoading.hide();

           })
       };
        //the process of taking a picture using a device camera or from the device disk..

        //open the camera
        //
        function openCamera(type){
            navigator.camera.getPicture(function(ImageData){
                //add this image to the scope global variable
                if($scope.formData.pics == undefined){//if the pics object is not declared.
                    $scope.formData.pics = [];///initialize it.
                }
                if(type==1){
                    var imageFront = document.getElementById('frontId');
                    imageFront.src = ImageData;
                    //hide btn
                    var btn = document.getElementById('frontIdBtn');
                    btn.innerHTML = 'Replace Picture';
                    $scope.formData.pics['ID_front_pic'] = ImageData;
                }else if(type==2){
                    var backId = document.getElementById('backId');
                    backId.src = ImageData;
                    //hide btn
                    btn = document.getElementById('backIdBtn');
                    btn.innerHTML = 'Replace Picture';
                    $scope.formData.pics['ID_back_pic'] = ImageData;
                }else if(type==3){
                    var profile = document.getElementById('profile');
                    profile.src = ImageData;
                    //hide btn
                    var btn = document.getElementById('profileBtn');
                    btn.innerHTML = 'Replace Picture';
                    $scope.formData.pics['profile_pic'] = ImageData;
                };
            },function(err){
                toastr.error('Failed because ',err);
                console.error('error occurred ',err);
            },{
                quality: 20,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true,
                targetHeight:180,
                targetWidth:200
                //destinationType : Camera.DestinationType.DATA_URL,
                //sourceType : Camera.PictureSourceType.CAMERA
            });
        }





/*


        var openCamera = function(type){
            navigator.camera.getPicture(function(urlFile){
                window.resolveLocalFileSystemURL(urlFile, resolveOnSuccess, resOnError);
                function resolveOnSuccess(entry){
                    console.log("resolvetosuccess",entry);

                    //new file name
                    function makeid()
                    {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                        for( var i=0; i < 5; i++ )
                            text += possible.charAt(Math.floor(Math.random() * possible.length));

                        return text;
                    }


                    var newFileName = makeid()+'.jpeg';
                    var myFolderApp = "RedAntImg";

                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
                            console.log("folder create called",myFolderApp);

                            //The folder is created if doesn't exist
                            fileSys.root.getDirectory( myFolderApp,
                                {create:true, exclusive: false},
                                function(directory) {
                                    console.log("move to file..");
                                    entry.moveTo(directory, newFileName,  successMove, resOnError);
                                    console.log("release");
                                },
                                resOnError);
                        },
                        resOnError);
                }

                function successMove(entry) {
                    //I do my insert with "entry.fullPath" as for the path
                    console.log("success");
                    //this is file path, customize your path
                    console.log(entry);
                    if(type==1){
                        $scope.ID_front_pic = entry.nativeURL;
                        $scope.pics.push({ID_front_pic:entry.nativeURL});
                    }else if(type == 2){
                        $scope.ID_back_pic = entry.nativeURL;
                        $scope.pics.push({ID_back_pic:entry.nativeURL});
                    }else if(type == 3){
                        $scope.profile_pic = entry.nativeURL;
                        $scope.pics.push({profile_pic:entry.nativeURL});
                    }

                }
                function resOnError(error) {
                    console.log("failed");
                }
               return {'status':'success','data':urlFile};
            }, function (message) {
                toastr.error(message);
                console.error('we encountered some errors',message);
                return {'status':'error'};
            },{
                quality: 10,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true,
                targetHeight:180,
                targetWidth:180
            });
        };*/
//TAKING PICTURES FOR ID AND PROFILE.
        //the front ID picture..
        $scope.photoFrontID = function(){
           openCamera(1);
        };

         //the front ID picture..
        $scope.photoBackID = function(){
           openCamera(2)
        };

         //the front ID picture..
        $scope.photoProfile = function(){
           openCamera(3);
        };


        //upload image just pass the image url..
        var uploadPhoto =  $scope.upload_image = function uploadPhoto(imageURI,type) {
            $ionicLoading.show();
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";

            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;

            var ft = new FileTransfer();
            if(type == 1){
                var url_s  = 'postPhoto';
            }else if(type == 2){
                url_s = 'postPhotoback';
            }else{
                url_s = 'postPhotoprof';
            }
            ft.upload(imageURI, encodeURI(url+url_s+'/'+sessionStorage.serv_id), win, fail, options);
        };
        function win(r) {//let's win..success!
            $ionicLoading.hide();
            toastr.success('successfully uploaded an image');
            console.log("Sent = " ,r);
        }

        function fail(error) {
           toastr.error(error.message);
            console.log("Failed because " ,error);
        }

    })

    .controller('my_job_seekersController',function($scope,$state,$http,$ionicLoading){
        $ionicLoading.show();
        $http({
            url:url+'/myJobSeekers/'+sessionStorage.user_id,
            method:'GET'
        }).success(function(data){
            $scope.jobSeekers = data;
            $ionicLoading.hide();
        });
    })
    .controller('my_profileController',function($scope,$state,$http,$ionicLoading,toastr){
        $ionicLoading.show();
        $http({
            url:url+'/profile/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            console.info('my profile',data);
            $scope.profile = data[0];
            $ionicLoading.hide();
        });
        //update agent profile
        $scope.profile_update = function(profile){
            $ionicLoading.show();
            $http({
                url:url+'/profile_update/'+sessionStorage.user_id,
                method:'POST',
                headers:{ 'Content-Type': 'application/x-www-form-urlencoded'},
                data:profile
            }).success(function(data){
                console.info('success updated profile',data);
                $ionicLoading.hide();
                toastr.success(data.message,data.status);
                $state.go('mainMenu')
            })
        };

    })
    .controller('detailsController',function ($state, $http, $ionicLoading,$stateParams,$scope) {
        var id = $stateParams.id;
        //load all the service providers details
        $ionicLoading.show();
        $http({
            url:url+'serviceProvider/'+id,
            method:'GET'
        }).success(function (data) {
            console.info('The service provider',data);
            $scope.serviceProvider = data[0];
            $scope.url = url;
        }).error(function (error) {
            console.error(error);
        });
        $ionicLoading.hide();

    })
    .controller('partiallyPaidJobSeekersController',function ($state,$http,$ionicLoading,$scope) {
        $ionicLoading.show();
        $http({
            url:url+'/partiallyPaid',
            method:'GET'
        }).success(function (data) {
            console.info(data);
            $scope.jbs = data;
            $ionicLoading.hide();
        }).error(function (err) {
            console.error(err);
            $ionicLoading.hide();
        })
    })
    .controller('paidJobSeekersController',function($state,$http,$ionicLoading,$scope){
        $scope.unpaid = function () {
          $state.go('partiallyPaidJobSeekers')
        };
        $ionicLoading.show();
        $http({
            url:url+'/loadPaidJobSeekers',
            method:'GET'
        }).success(function(res){
            console.info('success',res);
            $scope.jobs = res;
            $ionicLoading.hide();
        }).error(function (err) {
            console.error('error',err);
            $ionicLoading.hide();
        });

    })
    .controller('jobOpeningController',function ($state,$http,$ionicLoading,$scope) {
        $ionicLoading.show();
        $http({
            url:url+'loadJobOpenings',
            method:'GET'
        }).success(function (res) {
            $scope.jobs = res;
            $ionicLoading.hide();
        }).error(function (err) {
            toastr.error('Error loading job openings');
            $ionicLoading.hide();
        })
    });