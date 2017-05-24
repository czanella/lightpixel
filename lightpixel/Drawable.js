import EventEmitter from 'events';

import { RAD_TO_DEG, DEG_TO_RAD } from './Constants.js';
import MatrixTransform from './MatrixTransform.js';


class Drawable extends EventEmitter {
    constructor() {
        super();

        this.x = 0;
        this.y = 0;
        this.rotation = 0; // radians
        this.scaleX = 1;
        this.scaleY = 1;
        this.visible = true;
        this.interactive = true;

        this._opacity = 1;
    }

    set scale(value) {
        this.scaleX = this.scaleY = value;
    }

    get opacity() {
        return this._opacity
    }

    set opacity(value) {
        this._opacity = Math.max(0, Math.min(1, value));
    }

    get rotationDeg() {
        return this.rotation * RAD_TO_DEG;
    }

    set rotationDeg(value) {
        this.rotation = value * DEG_TO_RAD;
    }

    get isVisible() {
        return this.visible && this.opacity > 0 && this.scaleX != 0 && this.scaleY != 0;
    }

    get isInteractive() {
        return this.interactive && this.visible && this.scaleX != 0 && this.scaleY != 0;
    }

    stackTransform(matrix = null) {
        let newMatrix;

        if (!matrix) {
            newMatrix = new MatrixTransform();
        }
        else {
            newMatrix = matrix.clone();
        }

        newMatrix.translate(-this.x, -this.y);
        newMatrix.rotate(-this.rotation);
        newMatrix.scale(1 / this.scaleX, 1 / this.scaleY);

        return newMatrix;
    }

    stackContext(context) {
        context.save();

        context.globalAlpha *= this._opacity;
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.scale(this.scaleX, this.scaleY);
    }

    detach() {
        if (this.parent) {
            this.parent.removeChild(this);
            this.parent = null;
        }
    }

    drawOn(context) {
        throw '"drawOn" method must be implemented by classes that inherit from Drawable';
    }

    propagateEvent(eventType, position, matrix = null) {
        throw '"propagateEvent" method must be implemented by classes that inherit from Drawable';
    }

    removeChild(child) {
        throw '"removeChild" method must be implemented by classes that inherit from Drawable';
    }
}

export default Drawable;
