import { DEG_TO_RAD } from './Constants.js';

class MatrixTransform {
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    set (a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;

        return this;
    }

    multiply (a, b, c, d, e, f) {
        this.set(
            a * this.a + c * this.b,
            b * this.a + d * this.b,
            a * this.c + c * this.d,
            b * this.c + d * this.d,
            a * this.e + c * this.f + e,
            b * this.e + d * this.f + f
        );
    }

    reset () {
        return this.set(1, 0, 0, 1, 0, 0);
    }

    copy (other) {
        return this.set(
            other.a,
            other.b,
            other.c,
            other.d,
            other.e,
            other.f
        );
    }

    clone () {
        return new MatrixTransform(
            this.a,
            this.b,
            this.c,
            this.d,
            this.e,
            this.f
        );
    }

    scale (sx, sy = null) {
        if (sy === null) {
            sy = sx;
        }
        return this.multiply(sx, 0, 0, sy, 0, 0);
    }

    translate (tx, ty) {
        return this.multiply(1, 0, 0, 1, tx, ty);
    }

    rotate (angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        return this.multiply(cos, sin, -sin, cos, 0, 0);
    }

    rotateDeg (angle) {
        return this.rotate(angle * DEG_TO_RAD);
    }

    transform (point) {
        return [
            this.a * point[0] + this.c * point[1] + this.e,
            this.b * point[0] + this.d * point[1] + this.f,
        ];
    }
}

export default MatrixTransform;
