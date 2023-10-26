import KEYS from "./keys";
import { IMAGE_NAMES, IMAGES } from "./images";

const GAME_CANVAS = 'skiCanvas';
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const DIAGONAL_SPEED_REDUCER: number = 1.4142;
const ANIMATION_FRAME_SPEED_MS: number = 250;

export { KEYS, IMAGE_NAMES, IMAGES, GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT, DIAGONAL_SPEED_REDUCER, ANIMATION_FRAME_SPEED_MS  };