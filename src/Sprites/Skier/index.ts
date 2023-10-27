/**
 * The skier is the entity controlled by the player in the game. The skier skis down the hill, can move at different
 * angles, and crashes into obstacles they run into. If caught by the rhino, the skier will get eaten and die.
 * Skier can also jump over obstacles.
 * @module Skier
 */

import { IMAGE_NAMES, DIAGONAL_SPEED_REDUCER, KEYS, ANIMATION_FRAME_SPEED_MS } from "../../Constants";
import { Sprite } from "../Sprite";
import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { intersectTwoRects, Rect } from "../../Core/Utils";
import { ObstacleManager } from "../Obstacles/ObstacleManager";
import { STATES } from "./states";
import { DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_LEFT_DOWN, DIRECTION_RIGHT, DIRECTION_RIGHT_DOWN } from "./directions";
import { DIRECTION_IMAGES, IMAGES_JUMPING } from "./images";
import { JumpAnimator } from "./jumpAnimator";
import { CollisionDetection } from "./collisionDetection";

export class Skier extends Sprite {

  /**
   * The skier starts running at this speed. Saved in case speed needs to be reset at any point.
   */
  readonly STARTING_SPEED: number = 10;
  /**
   * The name of the current image being displayed for the skier.
   */
  imageName: IMAGE_NAMES = IMAGE_NAMES.SKIER_DOWN;

  /**
   * What state the skier is currently in.
   */
  state: STATES = STATES.STATE_SKIING;

  /**
   * What direction the skier is currently facing.
   */
  direction: number = DIRECTION_DOWN;

  /**
   * How fast the skier is currently moving in the game world.
   */
  speed: number = this.STARTING_SPEED;

  /**
   * Stored reference to the ObstacleManager
   */
  obstacleManager: ObstacleManager;

  /**
   * Handles jump animation when jump states is on.
   */
  jumpAnimator: JumpAnimator;

  /**
   * Detects collision between skier and obstacles.
   */  
  collisionDetector: CollisionDetection;

  /**
   * Init the skier.
   */
  constructor(x: number, y: number, imageManager: ImageManager, obstacleManager: ObstacleManager, canvas: Canvas) {
    super(x, y, imageManager, canvas);

    this.obstacleManager = obstacleManager;
    this.jumpAnimator = new JumpAnimator(this);

    this.collisionDetector = new CollisionDetection(this.obstacleManager, this);
  }

  /**
   * Is the skier currently in the crashed state
   */
  isCrashed = (): boolean => this.state === STATES.STATE_CRASHED;

  /**
   * Is the skier currently in the skiing state
   */
  isSkiing = (): boolean => this.state === STATES.STATE_SKIING;

  /**
   * Is the skier currently in the jumping state
   */
  isJumping = (): boolean => this.state === STATES.STATE_JUMP;

  /**
   * Is the skier currently in the dead state
   */
  isDead = (): boolean => this.state === STATES.STATE_DEAD;

  /**
   * Set the current direction the skier is facing and update the image accordingly
   */
  setDirection(direction: number) {
    this.direction = direction;
    this.setDirectionalImage();
  }

  /**
   * Set the skier's image based upon the direction they're facing.
   */
  setDirectionalImage() {
    this.imageName = DIRECTION_IMAGES[this.direction];
  }

  /**
   * Move the skier and check to see if they've hit an obstacle. The skier only moves in the skiing state.
   */
  update(gameTime: number) {
    if (this.isSkiing() || this.isJumping()) {
      if (this.isJumping()) this.jumpAnimator.animate(gameTime);
      this.move();
      this.checkIfHitObstacle();
    }
  }

  /**
   * Draw the skier if they aren't dead
   */
  draw() {
    if (this.isDead()) return;
    super.draw();
  }

  /**
   * Move the skier based upon the direction they're currently facing. This handles frame update movement.
   */
  move() {
    switch (this.direction) {
      case DIRECTION_LEFT_DOWN:
        this.moveSkierLeftDown();
        break;
      case DIRECTION_DOWN:
        this.moveSkierDown();
        break;
      case DIRECTION_RIGHT_DOWN:
        this.moveSkierRightDown();
        break;
      case DIRECTION_LEFT:
      case DIRECTION_RIGHT:
        // Specifically calling out that we don't move the skier each frame if they're facing completely horizontal.
        break;
    }
  }

  /**
   * Move the skier left. Since completely horizontal movement isn't frame based, just move incrementally based upon
   * the starting speed.
   */
  moveSkierLeft() {
    this.position.x -= this.STARTING_SPEED;
  }

  /**
   * Move the skier diagonally left in equal amounts down and to the left. Use the current speed, reduced by the scale
   * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
   */
  moveSkierLeftDown() {
    this.position.x -= this.speed / DIAGONAL_SPEED_REDUCER;
    this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
  }

  /**
   * Move the skier down at the speed they're traveling.
   */
  moveSkierDown() {
    this.position.y += this.speed;
  }

  /**
   * Move the skier diagonally right in equal amounts down and to the right. Use the current speed, reduced by the scale
   * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
   */
  moveSkierRightDown() {
    this.position.x += this.speed / DIAGONAL_SPEED_REDUCER;
    this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
  }

  /**
   * Move the skier right. Since completely horizontal movement isn't frame based, just move incrementally based upon
   * the starting speed.
   */
  moveSkierRight() {
    this.position.x += this.STARTING_SPEED;
  }

  /**
   * Move the skier up. Since moving up isn't frame based, just move incrementally based upon
   * the starting speed.
   */
  moveSkierUp() {
    this.position.y -= this.STARTING_SPEED;
  }

  /**
   * Handle keyboard input. If the skier is dead, don't handle any input.
   */
  handleInput(inputKey: string) {
    if (this.isDead()) {
      return false;
    }

    let handled: boolean = true;

    switch (inputKey) {
      case KEYS.LEFT:
        this.turnLeft();
        break;
      case KEYS.RIGHT:
        this.turnRight();
        break;
      case KEYS.UP:
        this.turnUp();
        break;
      case KEYS.DOWN:
        this.turnDown();
        break;
      case KEYS.SPACE:
        this.jumping();
        break;
      default:
        handled = false;
    }

    return handled;
  }

  /**
   * Turn the skier left. If they're already completely facing left, move them left. Otherwise, change their direction
   * one step left. If they're in the crashed state, then first recover them from the crash.
   */
  turnLeft() {
    if (this.isCrashed()) {
      this.recoverFromCrash(DIRECTION_LEFT);
    }

    if (this.direction === DIRECTION_LEFT) {
      this.moveSkierLeft();
    } else {
      this.setDirection(this.direction - 1);
    }
  }

  /**
   * Turn the skier right. If they're already completely facing right, move them right. Otherwise, change their direction
   * one step right. If they're in the crashed state, then first recover them from the crash.
   */
  turnRight() {
    if (this.isCrashed()) {
      this.recoverFromCrash(DIRECTION_RIGHT);
    }

    if (this.direction === DIRECTION_RIGHT) {
      this.moveSkierRight();
    } else {
      this.setDirection(this.direction + 1);
    }
  }

  /**
   * Turn the skier up which basically means if they're facing left or right, then move them up a bit in the game world.
   * If they're in the crashed state, do nothing as you can't move up if you're crashed.
   */
  turnUp() {
    if (this.isCrashed()) {
      return;
    }

    if (
      this.direction === DIRECTION_LEFT ||
      this.direction === DIRECTION_RIGHT
    ) {
      this.moveSkierUp();
    }
  }

  /**
   * Turn the skier to face straight down. If they're crashed don't do anything to require them to move left or right
   * to escape an obstacle before skiing down again.
   */
  turnDown() {
    if (this.isCrashed()) {
      return;
    }

    this.setDirection(DIRECTION_DOWN);
  }

  /**
   * skier start jumping
   */
  jumping() {
    if (this.isCrashed()) return;
    this.setState(STATES.STATE_JUMP);
    this.speed = this.STARTING_SPEED;
  }

  /**
   * The skier has a bit different bounds calculating than a normal entity to make the collision with obstacles more
   * natural. We want te skier to end up in the obstacle rather than right above it when crashed, so move the bottom
   * boundary up.
   */
  getBounds(): Rect | null {
    const image = this.imageManager.getImage(this.imageName);
    if (!image) {
      return null;
    }

    return new Rect(
      this.position.x - image.width / 2,
      this.position.y - image.height / 2,
      this.position.x + image.width / 2,
      this.position.y - image.height / 4
    );
  }

  jumpOnRampHit() {
    const skierBounds = this.getBounds();
    if (skierBounds) {
      const obstacles = this.obstacleManager.getObstacles();
      for (let index = 0; index < obstacles.length; index++) {
        const obstacle = obstacles[index];
        const obstacleBounds = obstacle.getBounds();
        if (obstacleBounds) {
          if (intersectTwoRects(skierBounds, obstacleBounds) && obstacle.obstacleType === IMAGE_NAMES.JUMP_RAMP) {
            this.setState(STATES.STATE_JUMP);
            this.speed = this.STARTING_SPEED;
            return;
          }
        }
      }   
    }
  }

  /**
   * Go through all the obstacles in the game and see if the skier collides with any of them. If so, crash the skier.
   */
  checkIfHitObstacle() {
    if (this.getBounds()) {
      this.jumpOnRampHit();  
      if (this.collisionDetector.collision()) this.crash();
    }
  }

  /**
   * Crash the skier. Set the state to crashed, set the speed to zero cause you can't move when crashed and update the
   * image.
   */
  crash() {
    this.state = STATES.STATE_CRASHED;
    this.speed = 0;
    this.imageName = IMAGE_NAMES.SKIER_CRASH;
  }

  /**
   * Change the skier back to the skiing state, get them moving again at the starting speed and set them facing
   * whichever direction they're recovering to.
   */
  recoverFromCrash(newDirection: number) {
    this.state = STATES.STATE_SKIING;
    this.speed = this.STARTING_SPEED;
    this.setDirection(newDirection);
  }

  /**
   * Kill the skier by putting them into the "dead" state and stopping their movement.
   */
  die() {
    this.state = STATES.STATE_DEAD;
    this.speed = 0;
  }

  /**
   * Set the state and then set a new current animation based upon that state.
   */
  setState(newState: STATES) {
    this.state = newState;

    if (this.state === STATES.STATE_JUMP) this.jumpAnimator.init();
  }
}
