'use strict';

function sudokuGridController($scope, $element, $attrs, sudokuService, sudokuSolver) {
    var ctrl = this;
    ctrl.originalGrid = angular.copy(ctrl.grid);

    ctrl.change = function() {
        ctrl.verifyGrid();
    }

    ctrl.reset = function() {
        ctrl.grid = angular.copy(ctrl.originalGrid);
    }

    ctrl.verifyGrid = function() {
        for (var row of ctrl.grid) {
            for (var col of row) {
                ctrl.isSquareValid(col)
            }
        }
    }

    ctrl.isSquareValid = function(square) {
        var modelGrid = sudokuService.getModelGrid(ctrl.grid);
        var isValid = sudokuService.isSequenceValidForSquare(modelGrid, square.id, modelGrid[square.id]);

        $scope.frm[square.id].$setValidity("number", isValid);
    }

    ctrl.solve = function() {
        if (!$scope.frm.$valid) {
            swal("Oops", "The grid is having some issues", "error");
        } else {
            console.log("solving the puzzle");
            var modelGrid = sudokuService.getModelGrid(ctrl.grid);
            var parsedGrid = sudokuSolver.parseGrid(modelGrid);
            var solvedGrid = sudokuSolver.solve(parsedGrid);

            console.log(solvedGrid);
            ctrl.grid = sudokuService.getGridForDisplay(solvedGrid);
            swal("Yaaah", "Puzzle has been solved", "success");
        }
    }

    angular.element(document).ready(function () {
        ctrl.verifyGrid();
        $scope.$apply();
    });
}

angular.module('SUDOKU')
  .component('sudokuGrid', {
    restrict: 'E',
    templateUrl: './grid/sudoku-grid.html',
    controller: sudokuGridController,
    bindings: {
        grid: '='
    }
});