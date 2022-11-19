import MatrixOperations from "../maths/MatrixOperations";

class MatrixShift {
    static getShiftMatrix = (dx, dy) => [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1 ]
    ]
    static shift = (point, byX, byY) => {
        let value = MatrixOperations.multiply(this.getShiftMatrix(byX, byY), [[point.x], [point.y], [1]]);
        return { x: value[0], y: value[1] };
    }
}

export default MatrixShift;