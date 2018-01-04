'use strict';

function sudokuGridController($scope, $element, $attrs, sudokuService, sudokuSolver) {
    var ctrl = this;
    ctrl.originalGrid = angular.copy(ctrl.grid);

    // this function verifies a grid on input change for a square
    ctrl.change = function() {
        ctrl.verifyGrid();
    }

    //this function resets a grid to its default sequence
    ctrl.reset = function() {
        ctrl.grid = angular.copy(ctrl.originalGrid);
    }

    //this function checks every square to make sure it's valid
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

        //set the validity of the square in the form
        $scope.frm[square.id].$setValidity("number", isValid);
    }

    ctrl.solve = function() {
        if (!$scope.frm.$valid) {
            swal("Oops", "The grid is having some issues", "error");
        } else {
            var modelGrid = sudokuService.getModelGrid(ctrl.grid);
            //parsing the grid for the solve method in sudoku solver
            var parsedGrid = sudokuSolver.parseGrid(modelGrid);

            //calculating the time it takes to solve the puzzle
            var t0 = performance.now();
            var solvedGrid = sudokuSolver.solve(parsedGrid);
            var t1 = performance.now();
            var timetakenForAlgorithm = Math.round(t1 - t0)/1000 + " seconds";

            ctrl.grid = sudokuService.getGridForDisplay(solvedGrid);
            swal("Yaaah", "Puzzle has been solved in " + timetakenForAlgorithm, "success");
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