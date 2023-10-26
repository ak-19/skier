import { Skier } from ".";
import { ANIMATION_FRAME_SPEED_MS } from "../../Constants";
import { Animation } from "../../Core/Animation";
import { IMAGES_JUMPING } from "./images";
import { STATES } from "./states";

export class JumpAnimator {
    /**
     * The jump animation that the skier is currently using.
     */
    animation: Animation | null = null;

    /**
     * The current iamge from image array.
     */
    imageCounter: number = 0;

    /**
     * The time in ms of the last image change.
     */
    lastImageTime: number = Date.now();

    /**
     * Skier sprite on which to apply the animation.
     */
    skier: Skier;

    constructor(skier: Skier) {
        this.skier = skier;
    }

    init() {
        this.animation = new Animation(IMAGES_JUMPING, false);
        this.imageCounter = 0;
        this.skier.imageName = this.animation.getImages()[0];
    }

    passedAnimationTimeFrame(time: number) {
        return time - this.lastImageTime > ANIMATION_FRAME_SPEED_MS;
    }

    /**
     * Do the animation if all conditions are set
     */
    animate(time: number) {
        if (!this.animation) {
            this.skier.setDirection(this.skier.direction);
            this.skier.setState(STATES.STATE_SKIING);
        }
        else if (this.passedAnimationTimeFrame(time)) this.nextImage(time);
    }

    /**
     * If possible set next image from image array, otherwise stop everything and release animation object
     */
    nextImage(gameTime: number) {
        if (this.animation) {
            this.lastImageTime = gameTime;
            this.imageCounter++;
            if (this.imageCounter >= this.animation.getImages().length) this.animation = null;
            else this.skier.imageName = this.animation.getImages()[this.imageCounter];
        }
    }
}