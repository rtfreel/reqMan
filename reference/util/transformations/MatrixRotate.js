import MatrixOperations from "../maths/MatrixOperations";

class MatrixRotate {
    static getShiftMatrix = (angle) => {
        let cos = Math.cos(angle * (Math.PI / 180));
        let sin = Math.sin(angle * (Math.PI / 180));
        return [
            [ cos, sin, 0],
            [-sin, cos, 0],
            [  0 ,  0 , 1]
        ]
    }
    static rotate = (point, around, byAngle) => {
        let value = MatrixOperations.multiply(this.getShiftMatrix(byAngle), [[point.x - around.x], [point.y - around.y], [1]]);
        return { x: +value[0] + around.x, y: +value[1] + around.y };
    }
}

export default MatrixRotate;