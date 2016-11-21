/**
 * Created by kamal on 8/3/16.
 */
catalogEditApp.controller('catalogEditController', function($scope, $http, catalogId,
                                                            AppInstance, urls, $element, $q, $mdDialog){
    $scope.selectedTab = 0; // tab index for catalog items selection type
    if(catalogId) {
        AppInstance.get({instanceId: catalogId}).$promise.then(function (appInstance) {
            $scope.catalog = appInstance;
            $scope.configObj = JSON.parse(appInstance.config);
            $scope.configObj.selectedIds = $scope.configObj.selectedIds || [];

            if($scope.configObj.selectionType == "onebyone"){
                $scope.selectedTab = 1;
                loadResources();
            }
        });
    }
    else {
        $scope.catalog = new AppInstance({
            title:"",
            abstract: "",
            config: ""
        });
        $scope.configObj = {
            subTitle:"",
            layers: true,
            maps: true,
            apps: true,
            documents:true,
            featured: false,
            enablePaging:false,
            itemsPerPage: 10,
            enableSearch:false,
            selectedIds:[]
        };
    }
    $scope.save = function () {
        $scope.configObj.selectionType = $scope.selectedTab == 0  ?  "query": "onebyone";
        $scope.configObj.selectedIds = [];
        if($scope.selectedTab == 1){
            angular.forEach($scope.oneByOne.selectedItems, function (item) {
                $scope.configObj.selectedIds.push(item.id);
            });
        }
        $scope.catalog.config = JSON.stringify($scope.configObj);
        if(catalogId){
            $scope.catalog.$update(function (res) {
                console.debug(res)
            })
        }
        else{
            // $scope.catalog.appName = 'simple_catalog';
            // $scope.catalog.$save(function (res) {
            //     console.debug(res)
            // })
            $http.post("create/",$scope.catalog).then(function (res) {
                if(res.data.id){
                    window.location = "../" + res.data.id + "/edit/"
                }
            })
        }



    };
    $scope.keywordSearchTerm = '';
    $scope.keywords = [];
    $http.get(urls.REST_URL + "tag/").then(function (res) {
        $scope.keywords = res.data.objects;
    });
    $scope.clearKeywordsSearch = function () {
        $scope.keywordSearchTerm = '';
    };

    $element.find('input').on('keydown', function(ev) {
        ev.stopPropagation();
    });

    $scope.oneByOne = {
        selectedItems: []
    };
    var allResources;
    var defer = $q.defer();
    var updateResourcesList = function (initSelected) {
        var items = [];
        if(initSelected) {
            angular.forEach(allResources, function (item) {
                if ($scope.configObj.selectedIds.indexOf(item.id) == -1) {
                    items.push(item)
                }
                else{
                    $scope.oneByOne.selectedItems.push(item)
                }
            });
        }
        else {
            angular.forEach(allResources, function (item) {
                if ($scope.oneByOne.selectedItems.indexOf(item) == -1
                    && item.title.toLowerCase().indexOf($scope.oneByOne.text.toLowerCase()) > -1 ) {
                    items.push(item)
                }
            });
        }
        return items;
    };
    var promise;
    var loadResources = function () {
        if (!promise) {
            var url = urls.APPS_BASE_URL + "cartoview_simple_catalog/resources/all/";
            var params = {};
            if (catalogId) {
                params.catalogId = catalogId;
            }
            promise = $http.get(url, {params: params});
            promise.then(function (res) {
                allResources = res.data;
                updateResourcesList(true);
            });
        }
        return promise;
    };

    $scope.showResourcesDialog = function(ev) {
        loadResources().then(function () {
            $mdDialog.show({
                controller: ResourcesDialogController,
                templateUrl: urls.STATIC_URL + 'cartoview_simple_catalog/angular-templates/resources-selector-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    selectedItems: $scope.oneByOne.selectedItems,
                    allResources: allResources
                }
            });
        });
    };
    $scope.removeOneByOneItem = function (item) {
        var index = $scope.oneByOne.selectedItems.indexOf(item);
        $scope.oneByOne.selectedItems.splice(index, 1)
    };
    function ResourcesDialogController($scope, $mdDialog, selectedItems, allResources) {
        $scope.selectedItems = selectedItems;
        $scope.allResources = allResources;
        $scope.search = {};
        $scope.hide = function () {
            console.debug($scope.allResources);
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };


        $scope.toggleItem = function (item) {
            var index = selectedItems.indexOf(item);
            if(index==-1){
                selectedItems.push(item)
            }
            else {
                selectedItems.splice(index, 1)
            }
        };
    }
});
