import Sprite from './Sprite.js';

class Mask extends Sprite {
    constructor (mask, content) {
        super();

        this.anchorX = 0;
        this.anchorY = 0;

        this._mask = mask;
        this._content = content;
    }

    set mask(child) {
        if (this._mask) {
            this._mask.detach();
        }

        if (child) {
            child.detach();
            child.parent = this;
        }

        this._mask = child;
    }

    set content(child) {
        if (this._content) {
            this._content.detach();
        }

        if (child) {
            child.detach();
            child.parent = this;
        }

        this._content = child;
    }

    removeChild (child) {
        if (child === this._mask) {
            this._mask = null;
        }

        if (child === this._content) {
            this._content = null;
        }
    }

    drawOn (context) {
        if (this.isVisible) {
            // Prepare the texture
            if (!this.texture) {
                this.texture = document.createElement('canvas');
                this.textureContext = this.texture.getContext('2d');
            }

            const cWidth = context.canvas.width, cHeight = context.canvas.height;

            if (cWidth !== this.texture.width || cHeight !== this.texture.height) {
                this.texture.width = cWidth;
                this.texture.height = cHeight;
            }

            // Clear the texture
            this.textureContext.clearRect(0, 0, this.texture.width, this.texture.height);

            // Draw the context on it
            this.textureContext.globalCompositeOperation = 'source-over';
            this._content.drawOn(this.textureContext);

            // Cuts the texture content using the mask
            this.textureContext.globalCompositeOperation = 'destination-in';
            this._mask.drawOn(this.textureContext);

            // Draw itself on the larger context
            super.drawOn(context);
        }
    }

    propagateEvent(eventType, position, matrix = null) {
        if (this.isInteractive) {
            matrix = this.stackTransform(matrix);

            position = matrix.transform(position);

            if (this._mask.propagateEvent(eventType, position, matrix) &&
                this._content.propagateEvent(eventType, position, matrix)) {

                this.emit(eventType, eventType, position);

                return true;
            }
        }

        return false;
    }
}

export default Mask;
