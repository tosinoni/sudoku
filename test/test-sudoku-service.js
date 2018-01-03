describe('Sudoku Service factory', function() {
    var sudokuService;
    beforeEach(angular.mock.module('SUDOKU'));

    beforeEach(angular.mock.inject(function(_sudokuService_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        sudokuService = _sudokuService_;
    }));

    it('sudoku service should exist', function() {
        expect(sudokuService).toBeDefined();
    });

    it('testing get squares method', function() {
        var squares = sudokuService.getSquares();
        var expectedSquares = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9',
                'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
                'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
                'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9',
                'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'];
        
        expect(squares.length).toEqual(expectedSquares.length);
        expect(squares).toEqual(expectedSquares);
    });

    it('testing getUnitList method', function() {
        var unitList = sudokuService.getUnitList();

        expect(unitList.length).toBe(27);
    });

    it('testing getUnitList method', function() {
        var units = sudokuService.getUnits();
        var squares = sudokuService.getSquares();

        for (var sqr of squares) {
            expect(units[sqr].length).toBe(3);
        }
    });

    it('testing getUnits method', function() {
        var units = sudokuService.getUnits();
        var squares = sudokuService.getSquares();

        var expectedUnitsForSqrC2 = [ [ 'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2' ],
        [ 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9' ], [ 'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3' ]];

        for (var sqr of squares) {
            expect(units[sqr].length).toBe(3);
        }

        expect(units['C2']).toEqual(expectedUnitsForSqrC2);
    });

    it('testing getPeers method', function() {
        var peers = sudokuService.getPeers();
        var squares = sudokuService.getSquares();

        var expectedPeersForSqrC2 = [ [ 'A2', 'B2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2' ],
            [ 'C1', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9' ], [ 'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C3' ]];

        for (var sqr of squares) {
            expect(peers[sqr].length).toBe(3);
        }

        expect(peers['C2']).toEqual(expectedPeersForSqrC2);
    });

    it('testing createGrid method with null gridSequence', function() {
        var gridSequence = '';
        var grid = sudokuService.createGrid(gridSequence);

        expect(grid).toEqual(undefined);
    });

    it('testing createGrid method with gridSequence letters', function() {
        var gridSequence = "4.....8.5.4....jdjd......7......2.....6..kdkdhd...8.4......1.......6.3.7.5..2.....1.4......";
        var grid = sudokuService.createGrid(gridSequence);

        expect(grid).toBeDefined();
        expect(Object.keys(grid).length).toEqual(81);
    });

    it('testing createGrid method with incomplete gridSequence', function() {
        //last dot is removed from sequence
        var gridSequence = "4.....8.5.4..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4.....";
        var grid = sudokuService.createGrid(gridSequence);

        expect(grid).toBeDefined();
        expect(Object.keys(grid).length).toEqual(81);
        expect(grid['I9']).toEqual(undefined);
    });

    it('testing createGrid method with complete gridSequence', function() {
        var gridSequence = "4.....8.5.4..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        var grid = sudokuService.createGrid(gridSequence);

        expect(grid).toBeDefined();
        expect(Object.keys(grid).length).toEqual(81);
        expect(grid['I9']).toEqual(0);
    });

    it('testing isSequenceValidForSquare method with repeating number in box', function() {
        //4 is repeated in box 1
        var gridSequence = "4.....8.5.4..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        var grid = sudokuService.createGrid(gridSequence);

        var status = sudokuService.isSequenceValidForSquare(grid, 'A1', grid['A1']);

        expect(status).toEqual(false);
    });

    it('testing isSequenceValidForSquare method with repeating number in row', function() {
        //4 is repeated in the same row
        var gridSequence = "44....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        var grid = sudokuService.createGrid(gridSequence);

        var status = sudokuService.isSequenceValidForSquare(grid, 'A1', grid['A1']);

        expect(status).toEqual(false);
    });

    it('testing isSequenceValidForSquare method with repeating number in column', function() {
        //4 is repeated in the same column
        var gridSequence = "4.....8.543..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        var grid = sudokuService.createGrid(gridSequence);

        var status = sudokuService.isSequenceValidForSquare(grid, 'A1', grid['A1']);

        expect(status).toEqual(false);
    });

    it('testing isSequenceValidForSquare method with valid square number', function() {
        var gridSequence = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        var grid = sudokuService.createGrid(gridSequence);

        var status = sudokuService.isSequenceValidForSquare(grid, 'A1', grid['A1']);

        expect(status).toEqual(true);
    });
});