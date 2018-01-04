'use strict';

angular.module('SUDOKU')
  .factory('sudokuService', function() {

    //defining the rows in a sudoku board
    var rows = "ABCDEFGHI";
    //defining the columns in a sudoku board
    var columns = "123456789";

    /*
    * This function is for performing the cross product of two arrays
    */
    function crossProduct(array1, array2) {
        var result = [];
        for (var elem1 of array1) {
            for (var elem2 of array2) {
                result.push(elem1 + elem2)
            }
        }

        return result;
    };


    /*
     * This function returns a list of all the 81 squares on a sudoku board
    */
    function getSquares() {
        return crossProduct(rows, columns);
    };


    /*
     * This function returns a list of the 27 units on the sudoku board.
     * A unit is a list of 9 squares on a sudoku board formed from column, row or a box.
    */
    function getUnitList() {
        var unitList = [];

        //adding the unit for the columns to the unitList
        for (var col of columns) {
            unitList.push(crossProduct(rows, col));
        }

        //adding the unit for the rows to the unitList
        for (var row of rows) {
            unitList.push(crossProduct(row, columns));
        }

        //adding the unit for the box to the unitList;
        var rowsForBox = ['ABC', 'DEF', 'GHI'];
        var columnsForBox = ['123', '456', '789'];
        for (var row of rowsForBox) {
            for (var col of columnsForBox) {
                    unitList.push(crossProduct(row, col));
            }
        }

        return unitList;
    };

    /*
     * This function returns an object with the key being a square and value as the list of units that the square is in.
    */
    function getUnits() {
        var squares = getSquares();
        var unitList = getUnitList();

        //creating the key value object for the squares
        var unitObj = {};

        //looping through the squares and for each square, list of units are assigned.
        for (var sqr of squares) {

            //getting the list of units for all the square in the unit
            var listOfUnits = unitList.filter(unit => unit.indexOf(sqr) !== -1);

            //initializing the square key with the list of units
            unitObj[sqr] = listOfUnits;
        }

        return unitObj;
    };

    /*
     * This function returns an object with the key being a square and value as the peers of the square.
     * Peers are just the squares that share a unit with the square.
    */
    function getPeers() {
        var units = getUnits();

        //creating the peers object
        var peersObj = {};

        angular.forEach(units, function(listOfUnits, sqr){
            //creating a list of peers without the current sqr
            var listOfPeers = listOfUnits.map(function(unit) {
                //clone the unit array so that removing an element does not affect other squares
                var clonedUnit = angular.copy(unit);
                var index = clonedUnit.indexOf(sqr);
                clonedUnit.splice(index, 1);
                return clonedUnit;
            })

            peersObj[sqr] = listOfPeers;
        });

        return peersObj;
    };

    /**
    * This function converts an array of squares to their actual value from the grid.
    * e.g if ['C2', 'C3'] is given as array of squares, it would return [2, 3] for the actual value.
    */
    function convertSquaresToValues(grid, squareArr) {
        var newSquareArr = [];

        for (var sqr of squareArr) {
            newSquareArr.push(grid[sqr]);
        }

        return newSquareArr;
    }

    /*
     * This function validate if a grid object is valid for a given square value.
     * The function accepts a grid obj with key as square and value as value of square e.g C2 : 5
    */
    function isSequenceValidForSquare(grid, square, squareValue) {
        //getting all the peers of the square in the grid
        var listOfPeersForASquare = getPeers()[square];

        //if the square is empty, there is no point verifying if the sequence is valid
        if (squareValue) {
            for (var peers of listOfPeersForASquare) {
                var peerValues = convertSquaresToValues(grid, peers);
                if(peerValues.indexOf(squareValue) !== -1) {
                    return false;
                }
            }
        }

        return true;
    };

    /*
     * This function creates a grid given a sequence of string. The accepted values for the sequence are number and dot.
     * The grid would be an object with key as square and value is the value for the square
    */
    function createGrid(gridSequence) {
        if (!gridSequence)
            return;

        //remove all characters except for 0-9 and dot.
        var newSequence = gridSequence.replace(/[^0-9.]/g, "");

        //replace all dots with 0. 0 would signify empty space
        newSequence = newSequence.replace(/\./g, "0");

        var squares = getSquares();
        var gridSequences = newSequence.split('');

        var grid = {};
        for (var index in squares) {
            var sqr = squares[index];
            var char = gridSequences[index];

            //if the character is defined, turn it into a number
            grid[sqr] = char ? Number(char) : char;
        }

        return grid;
    }

      /**
      * This function converts a grid object(key=sqr and val = valOfSqr) to the form below
      * {
      *      [[{ id: A1, val: 4}, { id: A2, val: ''}.....],
      *      [[{ id: B1, val: ''}, { id: B2, val: 3}.....]..]
      */

      function getGridForDisplay(grid) {
        //if the grid is a sequence. convert it to a grid object;
        if (typeof grid === "string") {
            grid = createGrid(grid);
        }

        var gridRows = [];

        for (var r of rows) {
            var cols = [];
            for (var c of columns) {
                var col = {};
                col.id = r + c;
                var value = grid ? grid[col.id] : undefined;

                //0 signifies empty space. so we make the square undefined.
                col.val = value !== 0 ? Number(value) : undefined;
                cols.push(col);
            }

            gridRows.push(cols);
        }

        return gridRows;
      }

      /**
      * This function converts a display grid to a model grid
      */
      function getModelGrid(displayGrid) {
        if (displayGrid) {
            var grid = {};
            for (var row of displayGrid) {
                for (var col of row) {
                    grid[col.id] = col.val ?  col.val.toString() : undefined;
                }
            }

            return grid;
        }
      }

    return {
        rows: rows,
        columns : columns,
        getSquares: getSquares,
        getUnitList: getUnitList,
        getUnits: getUnits,
        getPeers: getPeers,
        isSequenceValidForSquare: isSequenceValidForSquare,
        createGrid: createGrid,
        getGridForDisplay: getGridForDisplay,
        getModelGrid: getModelGrid
    }
  });