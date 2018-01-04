// Declare app level module which depends on filters, and services
angular.module('SUDOKU', [])
  .controller('SudokuController', function ($scope, sudokuService) {

      var gridSequence = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
      var modelGrid = sudokuService.createGrid(gridSequence);

      $scope.grid = sudokuService.getGridForDisplay(modelGrid);

      console.log($scope.grid);
      console.log(sudokuService.isSequenceValidForSquare($scope.grid, 'A1', $scope.grid['A1']));
  });
