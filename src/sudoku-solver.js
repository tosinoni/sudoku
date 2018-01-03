'use strict';

angular.module('SUDOKU')
  .factory('sudokuSolver', function(sudokuService) {
    /*
    * This function checks a grid state to see if the puzzle has been solved.
    */
    function isPuzzleSolved(grid) {
        var squareValues = Object.values(grid).filter(val => val !== 0 || val !== '');
        return squareValues.length === 81;
    };

    /*
    * This function gets all the possible value a square can take.
    */
    function getAllPossibleValueForSquare(grid, sqr) {
        var possibleValue = '';

        for (var num of sudokuService.columns) {
            if (sudokuService.isSequenceValidForSquare(grid, sqr, Number(num))) {
                possibleValue += num;
            }
        }

        return possibleValue;
    };

    /*
    * This function parses a grid. It assigns every possible value to an empty square.
    * The grid should be an object, key: sqr and value: valueOfSqr
    */
    function parseGrid(grid) {
        var cloneGrid = angular.copy(grid);
        for (var sqr of sudokuService.getSquares()) {
            if (!cloneGrid[sqr]) {
                cloneGrid[sqr] = getAllPossibleValueForSquare(cloneGrid, sqr);
            }
        }

        return cloneGrid;
    };

    /*
    * This function solves a sudoku puzzle. The grid should be an object(key:sqr and value:valueOfSqr)
    * The solver uses the best first search algorithm.
    */
    function solve(grid) {
        var queue = [];
        for (var elem1 of array1) {
            for (var elem2 of array2) {
                result.push(elem1 + elem2)
            }
        }

        return result;
    };

    return {
        solve: solve,
        parseGrid: parseGrid
    }
  });