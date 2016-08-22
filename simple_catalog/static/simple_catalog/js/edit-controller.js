/**
 * Created by kamal on 8/3/16.
 */
catalogEditApp.controller('catalogEditController', function($scope, $http, catalogId, AppInstance, urls, $element, $q){
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
            angular.forEach($scope.autocomplete.selectedItems, function (item) {
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

    $scope.autocomplete = {
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
                    $scope.autocomplete.selectedItems.push(item)
                }
            });
        }
        else {
            angular.forEach(allResources, function (item) {
                if ($scope.autocomplete.selectedItems.indexOf(item) == -1
                    && item.title.toLowerCase().indexOf($scope.autocomplete.text.toLowerCase()) > -1 ) {
                    items.push(item)
                }
            });
        }
        return items;
    };

    var loadResources = function () {
        var url = urls.APPS_BASE_URL + "simple_catalog/resources/all/";
        var params = {};
        if (catalogId) {
            params.catalogId = catalogId;
        }
        $http.get(url, {params: params}).then(function (res) {
            allResources = res.data;
            defer.resolve(updateResourcesList(true));
        });
    };
    $scope.loadAutocomplete = function () {
        if(!allResources) {
            loadResources();
            return defer.promise;
        }
        return updateResourcesList();
    };
    $scope.transformChip = function(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }
        // Otherwise, create a new one
        return { title: chip, type: 'new' }
    };
});
