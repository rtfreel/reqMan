class MatrixOperations {
    static multiply = (a, b) => {
        let aNumRows = a.length, 
            aNumCols = a[0].length,
            bNumCols  = b[0].length,
            result = new Array(aNumRows);
        for (let row = 0; row < aNumRows; ++row) {
            result[row] = new Array(bNumCols);
            for (let col = 0; col < bNumCols; ++col) {
                result[row][col] = 0;
                for (var i = 0; i < aNumCols; ++i) {
                    result[row][col] += a[row][i] * b[i][col];
                }
            }
        }
        return result;
    }
}

export default MatrixOperations;