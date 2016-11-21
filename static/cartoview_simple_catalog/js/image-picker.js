/**
 * Created by kamal on 9/27/16.
 */
angular.module('cartoview.catalog.imagePicker', ['ngMaterial', 'cartoview.urlsHelper'])
    .directive('imagePicker', function(urls, Image,$mdDialog) {

        var defaultLogos = ["globe1.png",
            "globe2.png",
            "globe3.png",
            "globe4.png",
            "globe5.png",
            "globe6.png",
            "globe7.png",
            "map1.png",
            "map2.png",
            "map3.png",
            "map4.png",
            "map5.png",
            "map6.png",
            "marker.png"
        ];
        return {
            restrict: 'E',
            scope: {
                imageUrl: '='
            },
            templateUrl: urls.STATIC_URL + "cartoview_simple_catalog/angular-templates/image-picker.html",
            link: function (scope, element, attrs) {
                scope.selector = attrs.selector;

                scope.showChangeDialog = function (ev) {
                    $mdDialog.show({
                        controller: ImagePickerDialogController,
                        templateUrl: urls.STATIC_URL + "cartoview_simple_catalog/angular-templates/image-picker-dialog.html",
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: true
                    });
                };
                scope.remove = function () {
                    scope.imageUrl = null;
                };
                function ImagePickerDialogController($scope, Image, $mdDialog) {
                    $scope.selector = attrs.selector;
                    if(attrs.selector == 'logo'){
                        $scope.defaultImages = [];
                        defaultLogos.forEach(function (imageName) {
                            $scope.defaultImages.push({
                                thumbnail: urls.STATIC_URL + "cartoview_simple_catalog/images/logos/" + imageName
                            })
                        })
                    }
                    $scope.getImageURL = function (img) {
                        return attrs.selector == 'logo' ? img.thumbnail : img.image;
                    };
                    $scope.isSelected = function (img) {
                        return $scope.getImageURL(img) == scope.imageUrl;
                    };
                    $scope.select = function (img) {
                        scope.imageUrl = $scope.getImageURL(img);
                    };

                    $scope.image = new Image("catalog-" + scope.selector);
                    $scope.onKeyPress = function (event) {
                        if (event.which == 13 && !event.shiftKey) {
                            $scope.addImage()
                        }
                    };
                    $scope.addImage = function () {
                        $scope.image.addNew("", $scope.image.imageFile[0].lfFile);
                        $scope.image.uploadFileApi.removeAll();
                    };
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                }
            }
        };
    });