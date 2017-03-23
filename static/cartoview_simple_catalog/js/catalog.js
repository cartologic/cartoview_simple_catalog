/**
 * Created by kamal on 8/3/16.
 * pagination code copied from
 * https://github.com/michaelbromley/angularUtils/blob/1fdc15c084003ab7c16030e53dd0a85065ab8c69/src/directives/pagination/dirPagination.js
 */
angular.module('cartoview.catalog', ['cartoview.base', 'cartoview.urlsHelper', 'dcbImgFallback']);

angular.module('cartoview.catalog').directive('catalog', function (urls, $http, $q, $compile, $mdDialog) {
    var paginationRange = 6;

    function calculatePageNumber(i, currentPage, totalPages) {
        var halfWay = Math.ceil(paginationRange / 2);
        if (i === paginationRange) {
            return totalPages;
        } else if (i === 1) {
            return i;
        } else if (paginationRange < totalPages) {
            if (totalPages - halfWay < currentPage) {
                return totalPages - paginationRange + i;
            } else if (halfWay < currentPage) {
                return currentPage - halfWay + i;
            } else {
                return i;
            }
        } else {
            return i;
        }
    }

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: "<div><ng-include src='templateUrl'></ng-include></div>",
        link: function (scope, element, attrs) {
            var template = attrs.template || 'default';
            scope.templateUrl = urls.STATIC_URL + "cartoview_simple_catalog/angular-templates/" + template + ".html";
            scope.fallbackSrc = urls.STATIC_URL + "cartoview_simple_catalog/images/fallback.png";
            scope.patternUrl =  urls.STATIC_URL + "cartoview_simple_catalog/images/patterns/confectionary.png";
            // element.html(template);
            // $compile(element.contents())(scope);

            var url = urls.APPS_BASE_URL + 'cartoview_simple_catalog/' + attrs.catalogId + "/data/";
            scope.currentSearchText = "";
            scope.search = {
                text: ""
            };
            // scope.showAlert = function (ev) {
            //     // Appending dialog to document.body to cover sidenav in docs app
            //     // Modal dialogs should fully cover application
            //     // to prevent interaction outside of dialog
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .parent(angular.element(document.querySelector('#popupContainer')))
            //             .clickOutsideToClose(true)
            //             .title(scope.catalog.config.subTitle)
            //             .textContent(scope.catalog.abstract)
            //             .ariaLabel('Description')
            //             .ok('Close')
            //             .targetEvent(ev)
            //     );
            // };
            scope.showAdvanced = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: urls.STATIC_URL + "cartoview_simple_catalog/angular-templates/about_dialog.html",
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: false, // Only for -xs, -sm breakpoints.,
                    locals: {
                        catalog: scope.catalog,
                        config: scope.catalog.config
                    }
                }).then(function (answer) {
                    scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    scope.status = 'You cancelled the dialog.';
                });
            };
            function DialogController($scope, $mdDialog, catalog, config) {
                $scope.title = catalog.title;
                $scope.abstract = catalog.abstract;
                $scope.subtitle = config.subTitle;
                $scope.config = config;

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }

            scope.loadCatalog = function (page) {
                if (page && scope.currentPage == page) return;
                page = page || 1;
                scope.currentPage = page;

                var params = {
                    page: page
                };
                if (attrs.catalogId)
                    params.catalogId = attrs.catalogId;
                scope.currentSearchText = params.text = scope.search.text;

                $http.get(url, {params: params}).then(function (res) {
                    scope.catalog = res.data;
                })
            };
            scope.getPageNumbers = function () {
                var pages = [];
                if (scope.catalog) {
                    var totalPages = scope.catalog.pages;
                    var halfWay = Math.ceil(paginationRange / 2);
                    var position;

                    if (scope.currentPage <= halfWay) {
                        position = 'start';
                    } else if (totalPages - halfWay < scope.currentPage) {
                        position = 'end';
                    } else {
                        position = 'middle';
                    }
                    var ellipsesNeeded = paginationRange < totalPages;
                    var i = 1;
                    while (i <= totalPages && i <= paginationRange) {
                        var pageNumber = calculatePageNumber(i, scope.currentPage, totalPages);
                        var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                        var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                        if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                            pages.push('...');
                        } else {
                            pages.push(pageNumber);
                        }
                        i++;
                    }
                }
                return pages;
            };
            scope.loadCatalog();
            scope.doSearch = function (event) {
                var key = typeof event.which === "undefined" ? event.keyCode : event.which;
                if (key == 13 && scope.search.text != scope.currentSearchText) {
                    scope.loadCatalog();
                }
            };
            scope.autocomplete = {};
            scope.loadAutocomplete = function (text) {
                var url = urls.APPS_BASE_URL + 'cartoview_simple_catalog/' + attrs.catalogId + "/autocomplete/";
                var params = {
                    text: text
                };
                return $http.get(url, {params: params}).then(function (res) {
                    return res.data;
                })
            };
            scope.searchTextChange = function () {
                if (scope.search.text == "" && scope.currentSearchText != "") scope.loadCatalog();
            }

        }
    }
});

// angular.module('cartoview.catalog').directive('imageonload', function() {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             element.bind('load', function() {
//                 console.debug(element)
//                 console.info('image is loaded');
//             });
//             element.bind('error', function(){
//                 console.debug(element)
//                 console.info('image could not be loaded');
//             });
//         }
//     };
// });
angular.module('cartoview.catalog').directive('backgroundImage', function () {
    return {
        scope: {
            backgroundImage: '=backgroundImage'
        },
        link: function (scope, element, attrs) {
            scope.$watch('backgroundImage', function () {
                var url = scope.backgroundImage;
                if (url) {
                    element.css({
                        'background-image': 'url(' + url + ')'
                    });
                }

            });

        }
    };
});