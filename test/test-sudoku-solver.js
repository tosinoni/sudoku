describe('Sudoku Solver factory', function() {
    var sudokuSolver,
        grid,
        sudokuService;

    beforeEach(angular.mock.module('SUDOKU'));

    beforeEach(angular.mock.inject(function(_sudokuSolver_, _sudokuService_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        sudokuSolver = _sudokuSolver_;
        sudokuService = _sudokuService_;

        var gridSequence = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        var displayGrid = sudokuService.getGridForDisplay(gridSequence);
        grid = sudokuService.getModelGrid(displayGrid);
    }));

    it('sudoku solver should exist', function() {
        expect(sudokuSolver).toBeDefined();
    });

    it('testing parseGridMethod', function() {
        var parsedGrid = sudokuSolver.parseGrid(grid);

        expect(parsedGrid['A2']).toEqual('1679');
    });
});