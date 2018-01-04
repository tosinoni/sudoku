describe('Sudoku Solver factory', function() {
    var sudokuSolver,
        parsedGrid,
        sudokuService;

    beforeEach(angular.mock.module('SUDOKU'));

    beforeEach(angular.mock.inject(function(_sudokuSolver_, _sudokuService_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        sudokuSolver = _sudokuSolver_;
        sudokuService = _sudokuService_;

        var gridSequence = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
        var displayGrid = sudokuService.getGridForDisplay(gridSequence);
        var modelGrid = sudokuService.getModelGrid(displayGrid);
        parsedGrid = sudokuSolver.parseGrid(modelGrid);
    }));

    it('sudoku solver should exist', function() {
        expect(sudokuSolver).toBeDefined();
    });

    it('testing parseGrid method', function() {
        expect(parsedGrid['A2']).toEqual('1679');
    });

    it('testing getBestSquare method', function() {
        console.log(parsedGrid);
        var bestSquare = sudokuSolver.getBestSquare(parsedGrid);
        console.log(bestSquare);
        expect(bestSquare.square).toEqual('G2');
        expect(bestSquare.values).toEqual('89');
    });

    it('testing solve method with a medium puzzle', function() {
        var solvedGrid = sudokuSolver.solve(parsedGrid);
        console.log(solvedGrid)
        expect(solvedGrid).toBeDefined();
    });
});