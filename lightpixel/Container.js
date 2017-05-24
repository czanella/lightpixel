import Drawable from './Drawable.js';

class Container extends Drawable {
    constructor() {
        super();

        this.children = [];
    }

    drawOn(context) {
        if (this.isVisible) {
            this.stackContext(context);

            this.children.forEach((child) => {
                child.drawOn(context);
            });

            context.restore();
        }
    }

    propagateEvent(eventType, position, matrix = null) {
        if (this.isInteractive) {
            matrix = this.stackTransform(matrix);

            for (let i = this.children.length - 1; i >= 0; i--) {
                const child = this.children[i];
                if (child.propagateEvent(eventType, position, matrix)) {
                    this.emit(eventType, eventType, matrix.transform(position));

                    return true;
                }
            }
        }

        return false;
    }

    getChildIndex(child) {
        return this.children.indexOf(child);
    }

    removeChildFrom(index) {
        this.children.splice(index, 1);
    }

    removeChild(child) {
        this.removeChildFrom(this.getChildIndex(child));
    }

    addChildAt(child, index) {
        child.detach()

        this.children.splice(index, 0, child);

        child.parent = this;
    }

    addChild(child) {
        this.addChildAt(child, this.children.length);
    }

    removeAllChildren() {
        this.children.forEach((child) => {
            child._parent = null;
        });

        this.children = [];
    }    
}

export default Container;
