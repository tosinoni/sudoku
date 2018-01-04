// Declare app level module which depends on filters, and services
angular.module('SUDOKU', [])
  .controller('SudokuController', function ($scope, sudokuService, sudokuSolver) {

    var gridSequence = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
    $scope.grid = sudokuService.getGridForDisplay(gridSequence);
    $scope.solvedGrid = sudokuService.getGridForDisplay();

    // this function verifies a grid on input change for a square
    $scope.change = function() {
        $scope.verifyGrid();
    }

    //this function checks every square to make sure it's valid
    $scope.verifyGrid = function() {
        for (var row of $scope.grid) {
            for (var col of row) {
                $scope.isSquareValid(col)
            }
        }
    }

    $scope.isSquareValid = function(square) {
        var modelGrid = sudokuService.getModelGrid($scope.grid);
        var isValid = sudokuService.isSequenceValidForSquare(modelGrid, square.id, modelGrid[square.id]);

        //set the validity of the square in the form
        $scope.frm[square.id].$setValidity("number", isValid);
    }

    $scope.solve = function() {
        if (!$scope.frm.$valid) {
            swal("Oops", "The grid is having some issues", "error");
        } else {
            var modelGrid = sudokuService.getModelGrid($scope.grid);
            //parsing the grid for the solve method in sudoku solver
            var parsedGrid = sudokuSolver.parseGrid(modelGrid);

            //calculating the time it takes to solve the puzzle
            var t0 = performance.now();
            var solvedGrid = sudokuSolver.solve(parsedGrid);
            var t1 = performance.now();
            var timetakenForAlgorithm = Math.round(t1 - t0)/1000 + " seconds";

            if (solvedGrid) {
                $scope.solvedGrid = sudokuService.getGridForDisplay(solvedGrid);
                swal("Yaaah", "Puzzle has been solved in " + timetakenForAlgorithm, "success");
            } else {
                swal("Oops", "Sorry. The provided puzzle can not be solved.", "error");
            }

        }
    }

    angular.element(document).ready(function () {
        $scope.verifyGrid();
        $scope.$apply();
    });
  });
