'use strict';

angular.module('SUDOKU')
  .component('sudokuGrid', {
    restrict: 'E',
    templateUrl: '/views/sudoku-grid.html',
    bindings: {
        grid: '=',
        change: '&changeFn',
        disable: '='
    }
});