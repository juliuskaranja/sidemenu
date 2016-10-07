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
.controller('mainMenuController', function ($scope,$state,$ionicLoading,toastr,$http) {

        //get count for the service providers who needs editing.
        $http({
            url:url+'loadEditProviders/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $scope.count =data;
        }).error(function (err) {
            $scope.count = 0;
        });
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
    };
        //show one's eaened commissions
    $scope.myCommissions = function(){
        $state.go('myCommissions');
    }
    })
.controller('registerController',function($scope,$http,toastr,$ionicLoading,$state){
        $scope.formData = {};//holds the registration data!
        //$scope.formData.pics = [];//the object to hold the image data...




        $scope.formData.payNow = true;
        //$scope.formData.payNowMobile=false;
        //$scope.formData.payNowd=true;//use this as the default..
        //$scope.formData.agent='M-pesa';
       //
        //load the job categories

        //the payment options here..


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
//loadCategories();


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
                $scope.cats = data.cat;
                $scope.formData.pay = data.amount;
                $scope.formData.account = data.account;
            });

        }

        $scope.formData.agent_id = sessionStorage.user_id;
       $scope.registerCustomer = function (dataForm) {

           console.info(dataForm);

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
           console.info($scope.formData.pics);
           if($scope.formData.pics == undefined){
               toastr.error('Please attach some pictures.');
               return;
           }

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
               url:url+'registerServiceProvider',
               method:'POST',
               data:dataForm,
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded'
               }
           }).success(function (data) {
               console.info('the files are here check => ',$scope.formData.pics);
               sessionStorage.setItem('serv_id',data.service.id);
               //handle the picture taken..
               //upload three pics
               uploadPhoto($scope.formData.pics['ID_front_pic'],1);
               uploadPhoto($scope.formData.pics['ID_back_pic'],2);
               uploadPhoto($scope.formData.pics['profile_pic'],3);

               //completed the user registration process..
               //$state.go('mainMenu');
               //$state.go('mainMenu');
               toastr.success('Successfully registered '+data.service.name+' ');

               $ionicLoading.hide();

               //show details...
               $scope.paymentDetails =1;
               $scope.data = data;
               if(!data.note.amount){
                   $scope.note.amount = '0.00';
               }
               //document.getElementById("#detap").innerHTML=insert;

           })
       };
        $scope.back = function () {
          $state.go('mainMenu');
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
                }
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

    .controller('my_job_seekersController',function($scope,$state,$http,$ionicLoading,$ionicModal,toastr){
        $ionicLoading.show();
        $http({
            url:url+'/myJobSeekers/'+sessionStorage.user_id,
            method:'GET'
        }).success(function(data){
            $scope.jobSeekers = data;
            $ionicLoading.hide();
        });
        //edit with a modal..
        $ionicModal.fromTemplateUrl('temps/provider_editor.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.edit = function (id) {
        $scope.modal.show();
            $ionicLoading.show();
            $http({
                url:url+'loadServiceProvider/'+id,
                method:'GET',
            }).success(function (data) {
                $scope.formData = data[0];
                $scope.url = url;
                if(data[0]['photo_id_front_url']){
                    document.getElementById('frontId').src = url+'/photos/'+data[0]['photo_id_front_url'];
                }
                if(data[0]['photo_id_back_url']){
                    document.getElementById('backId').src = url+'/photos/'+data[0]['photo_id_back_url'];
                }
                if(data[0]['photo_profile_url']){
                    document.getElementById('profile').src = url+'/photos/'+data[0]['photo_profile_url'];
                }

                console.info(data[0]);
                $ionicLoading.hide();
            })
        };
        //close the editor window
        $scope.closeEditor = function () {
            $scope.modal.hide();
        };
        //open camera to take pics.
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
                }
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
        //update the service provider details
        $scope.UpdateServiceProvider = function (details) {
            //update the details of the service provider.
            $http({
                url:url+'updateServiceProvider',
                method:'POST',
                headers:{ 'Content-Type': 'application/x-www-form-urlencoded'},
                data:details
            }).success(function (data) {
                if(data.status == 'success'){
                    toastr.success('Successfully updated details','Success');
                    //need to upload the images
                    console.info('the files are here check => ',$scope.formData.pics);
                    sessionStorage.setItem('serv_id',data.id);
                    //handle the picture taken..
                    //upload three pics
                    if($scope.formData.pics){
                        if($scope.formData.pics['ID_front_pic']){
                            uploadPhoto($scope.formData.pics['ID_front_pic'],1);
                        }
                        if($scope.formData.pics['ID_back_pic']){
                            uploadPhoto($scope.formData.pics['ID_back_pic'],2);
                        }
                        if($scope.formData.pics['profile_pic']){
                            uploadPhoto($scope.formData.pics['profile_pic'],3);
                        }
                    }
                    $scope.modal.hide();
                    $state.go('mainMenu')
                }else{
                    toastr.error('We encountered an error, retry','Error');
                }
            }).error(function (err) {
                toastr.error('Check your internet connection','Error');
            });
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


        }
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
            $scope.serviceProvider = data['service_providers'][0];
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
    .controller('jobOpeningController',function ($state,$http,$ionicLoading,$scope,toastr) {
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
    })
    .controller('myCommissionsController', function ($state,$http,$ionicLoading,$scope,toastr) {
        $ionicLoading.show();
        ///load the agent's commissions
        $http({
            url:url+'commissions/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (res) {
            $scope.data = res.data;
            $scope.total = res.sum;
            $ionicLoading.hide();
        }).error(function (err) {
            $ionicLoading.hide();
            console.error(err)
        })
    });