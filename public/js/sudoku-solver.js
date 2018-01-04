'use strict';

angular.module('SUDOKU')
  .factory('sudokuSolver', function(sudokuService) {
    var INVALID_STATUS = 'invalid',
        SOLVED_STATUS = 'solved',
        UNSOLVED_STATUS = 'unsolved';

    //peers of a sudoku grid
    var sudokuGridPeers = sudokuService.getPeers();

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
                if (!minValue || possibleValuesOfSqr.length < minValue) {
                    bestSquare = {square : sqr, values: possibleValuesOfSqr};
                    minValue = possibleValuesOfSqr.length;
                }
            }
        }

        return bestSquare;
    };

    /*
    * This function assigns value to square.
    */
    function assignValueToSquare(grid, sqr, val) {
        grid[sqr] = val;

        //if the square only has 1 value. We need to eliminate that value from peer squares.
        if(val.length == 1) {
            var peersOfSqr = sudokuGridPeers[sqr];

            for(var peer of peersOfSqr) {
                for (var peerSqr of peer) {
                    var peerSqrVal = grid[peerSqr];
                    //if the value to be assigned is present in peer. eliminate and reasssign
                    if (peerSqrVal.indexOf(val) > -1) {
                        peerSqrVal = peerSqrVal.replace(val, '');
                        assignValueToSquare(grid, peerSqr, peerSqrVal);
                    }
                }
            }
        }
        return grid
    }

    /*
    * This function checks a grid state to see if the puzzle has been solved.
    */
    function checkGridStatus(grid) {
        for (var sqr of sudokuService.getSquares()) {
            if(!grid[sqr]) {
                return INVALID_STATUS;
            } else if (grid[sqr].length > 1) {
                return UNSOLVED_STATUS;
            }
        }

        return SOLVED_STATUS;
    };

    /*
    * This function solves a sudoku puzzle. The grid should be a parsed grid.call the parsed grid method
    * The solver using the Uniform cost search algorithm which expands the least cost unexpanded node.
    */
    function solve(grid) {
        //get the grid status
        var gridStatus = checkGridStatus(grid);

        //if the grid is not valid. no point of solving
        if (gridStatus === INVALID_STATUS) {
            return;
        }

        //return the grid if the puzzle is solved
        if (gridStatus === SOLVED_STATUS) {
            return grid;
        }

        //choose the best square to expand
        var bestSquare = getBestSquare(grid);

        //search for the right value to fill in the square from the possible values
        if (bestSquare) {
            for (var sqrValue of bestSquare.values) {
               var cloneGrid = angular.copy(grid);
                assignValueToSquare(cloneGrid, bestSquare.square, sqrValue);
                //recurse over that square using the modified grid
                var gridsReturnedFromSearch = solve(cloneGrid);

                //if the grid returned is defined. we might have a possible solution
                if (gridsReturnedFromSearch) {
                    return gridsReturnedFromSearch;
                }
            }
        }
    };

    return {
        solve: solve,
        parseGrid: parseGrid,
        getBestSquare: getBestSquare
    }
  });