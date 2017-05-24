import Drawable from './Drawable.js';

class Sprite extends Drawable {
    constructor(texture) {
        super();

        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.texture = texture;
        this.hitMask = null;
    }

    stackTransform(matrix = null) {
        let newMatrix = super.stackTransform(matrix);

        newMatrix.translate(this.anchorX * this.texture.width, this.anchorY * this.texture.height);

        return newMatrix;
    }

    stackContext(context) {
        super.stackContext(context);

        context.translate(-this.anchorX * this.texture.width, -this.anchorY * this.texture.height);
    }

    drawOn(context) {
        if (this.isVisible) {
            this.stackContext(context);

            context.drawImage(this.texture, 0, 0);

            context.restore();
        }
    }

    propagateEvent(eventType, position, matrix = null) {
        if (this.isInteractive) {
            matrix = this.stackTransform(matrix);
            position = matrix.transform(position);
            if (position[0] >= 0 && position[0] < this.texture.width &&
                position[1] >= 0 && position[1] < this.texture.height) {

                if (!this.hitMask) {
                    this.emit(eventType, eventType, position);

                    return true;
                }

                position[0] = Math.floor(position[0]);
                position[0] = Math.max(0, Math.min(this.texture.width - 1, position[0]));
                position[1] = Math.floor(position[1]);
                position[1] = Math.max(0, Math.min(this.texture.width - 1, position[1]));

                if (this.hitMask[position[0] + this.texture.width * position[1]]) {
                    this.emit(eventType, eventType, position);

                    return true;
                }
            }
        }

        return false;
    }

    removeChild(child) {
        console.err('"Sprite" instances have no child nodes');
    }

    buildHitMask() {
        const buffer = document.createElement('canvas');
        buffer.width = this.texture.width;
        buffer.height = this.texture.height;

        const bufferContext = buffer.getContext('2d');
        bufferContext.drawImage(this.texture, 0, 0);

        const imageData = bufferContext.getImageData(0, 0, this.texture.width, this.texture.height);
        this.hitMask = new Array(imageData.data.length / 4);

        for (let i=0; i < this.hitMask.length; i++) {
            this.hitMask[i] = imageData.data[i*4 + 3] > 0 ? 1 : 0;
        }
    }

    clearHitMask() {
        this.hitMask = null;
    }
}

export default Sprite;
