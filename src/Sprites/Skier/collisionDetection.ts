import { Skier } from ".";
import { IMAGE_NAMES } from "../../Constants";
import { intersectTwoRects } from "../../Core/Utils";
import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleManager } from "../Obstacles/ObstacleManager";
import { STATES } from "./states";

  /**
   * Detects collision between skier and obstacles.
   */  

export class CollisionDetection {
    private obstacleManager: ObstacleManager;
    private skier: Skier;

    constructor(obstacleManager: ObstacleManager, skier: Skier) {
        this.obstacleManager = obstacleManager;
        this.skier = skier;
    }

    /**
     * Is skier in jump mode
     */
    private skierJumping = (): boolean => this.skier.state === STATES.STATE_JUMP;

    /**
     * Is obstacle of not tree type
     */    
    private nonTreeObstacle = (obstacle: Obstacle) => ![IMAGE_NAMES.TREE, IMAGE_NAMES.TREE_CLUSTER].includes(obstacle.obstacleType);

    /**
     * Check if skier hit obstacle, respecting a couple edges cases, more precisely jump mode on non-tree obstacles
     */        
    private skierHit(obstacle: Obstacle) {
        const obstacleBounds = obstacle.getBounds();
        if (!obstacleBounds) return false;
        const skierRect = this.skier.getBounds();
        if (skierRect && intersectTwoRects(skierRect, obstacleBounds) && this.nonTreeObstacle(obstacle) && this.skierJumping()) return false;
        return skierRect && intersectTwoRects(skierRect, obstacleBounds);
    }

    /**
     * Check skier against all obstacles and return true if hit found
     */        
    collision(): boolean {
        for (let obstacle of this.obstacleManager.getObstacles()) if (this.skierHit(obstacle)) return true;
        return false;
    }
}