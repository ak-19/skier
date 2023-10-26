import { Skier } from ".";
import { ANIMATION_FRAME_SPEED_MS } from "../../Constants";
import { Animation } from "../../Core/Animation";
import { IMAGES_JUMPING } from "./images";
import { STATES } from "./states";

export class JumpAnimator {
    /**
     * The animation that the skier is currently using. Typically matches the state the skier is in.
     */
    animation: Animation | null = null;

    /**
     * The current frame of the current animation the skier is on.
     */
    imageCounter: number = 0;

    /**
     * The time in ms of the last frame change. Used to provide a consistent framerate.
     */
    lastImageTime: number = Date.now();

    /**
     * Skier sprite on which to apply the animation.
     */
    skier: Skier;

    constructor(sprite: Skier) {
        this.skier = sprite;
    }

    init() {
        this.animation = new Animation(IMAGES_JUMPING, false);
        this.imageCounter = 0;
        this.skier.imageName = this.animation.getImages()[0];
    }

    passedAnimationTimeFrame(gameTime: number) {
        return gameTime - this.lastImageTime > ANIMATION_FRAME_SPEED_MS;
    }

    /**
     * Do the animation if all conditions are set
     */
    animate(gameTime: number) {
        if (!this.animation) {
            this.skier.setDirection(this.skier.direction);
            this.skier.setState(STATES.STATE_SKIING);
        }
        else if (this.passedAnimationTimeFrame(gameTime)) this.nextImage(gameTime);
    }

    /**
     * If possible set next image from image array, otherwise stop everythin and release animation object
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