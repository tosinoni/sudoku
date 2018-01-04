'use strict';

angular.module('SUDOKU')
  .factory('sudokuSolver', function(sudokuService) {
    /*
    * This function checks a grid state to see if the puzzle has been solved.
    */
    function isPuzzleSolved(grid) {
        for (var sqr of sudokuService.getSquares()) {
            var val = grid[sqr];
            if(val.length > 1) {
                return false;
            }
        }
        return true;
    };

    /*
    * This function gets all the possible value a square can take.
    */
    function getAllPossibleValueForSquare(grid, sqr) {
        var possibleValue = '';

        for (var num of sudokuService.columns) {
            if (sudokuService.isSequenceValidForSquare(grid, sqr, num)) {
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
        for (var sqr of sudokuService.getSquares()) {
            if (!grid[sqr]) {
                grid[sqr] = getAllPossibleValueForSquare(grid, sqr);
            }
        }

        return grid;
    };

    /*
    * This function evaluates an unfilled square in a grid and return the square with the minimum possible values
    * The parameter grid should be a parsed grid.
    */
    function getBestSquare(grid) {
        var minValue;
        var bestSquare;
        for (var sqr of sudokuService.getSquares()) {
            //numbers inside a square
             var possibleValuesOfSqr = grid[sqr];

            if (possibleValuesOfSqr.length > 1) {
                //get the number of possible values for the square
                if (!minValue || possibleValuesOfSqr.length < minValue) {
                    bestSquare = {square : sqr, values: possibleValuesOfSqr};
                    minValue = possibleValuesOfSqr.length;
                }
            }
        }

        return bestSquare;
    };

    /*
    *
    */
    function assignValueToSquare(grid, sqr, val) {
        grid[sqr] = val;
        if(val.length == 1) {
            var peersOfSqr = sudokuService.getPeers()[sqr];

            for(var peer of peersOfSqr) {
                for (var peerSqr of peer) {
                    var str = '' + grid[peerSqr];

                    if (str.indexOf(val) > -1) {
                        var valueOfPeer = str.replace(val, '');
                        assignValueToSquare(grid, peerSqr, valueOfPeer);
                    }

                }
            }
        }
        return grid
    }

    /*
    * This function checks a grid state to see if the puzzle has been solved.
    */
    function isGridValid(grid) {
        for (var sqr of sudokuService.getSquares()) {
            if (!grid[sqr]) {
                return false;
            }
        }
        return true;
    };
    /*
    * This function solves a sudoku puzzle. The grid should be a parsed grid.call the parsed grid method
    * The solver using the Uniform cost search algorithm which expands the least cost unexpanded node.
    */
    function solve(grid) {
        //if the grid is empty, it means there is no solution
        if (!isGridValid(grid)) {
            return;
        }

        //return the grid if the puzzle is solved
        if (isPuzzleSolved(grid)) {
            return grid;
        }

        //choose the best square to expand
        var bestSquare = getBestSquare(grid);

        //search for the right value to fill in the square from the possible values
        if (bestSquare) {
            for (var sqrValue of bestSquare.values) {
               var cloneGrid = angular.copy(grid);

                assignValueToSquare(cloneGrid, bestSquare.square, sqrValue);
                var gridsReturnedFromSearch = solve(cloneGrid);

                if (gridsReturnedFromSearch) {
                    return gridsReturnedFromSearch;
                }
            }
        }

        return;
    };

    return {
        solve: solve,
        parseGrid: parseGrid,
        getBestSquare: getBestSquare
    }
  });