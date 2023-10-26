/**
 * This class handles drawing game stats and state to the screen.
 */

import { Skier } from "../Sprites/Skier";
import { Canvas } from "./Canvas";

export class StatsText {
    static drawGameStats(canvas: Canvas, skier: Skier) {
        canvas.ctx.font = "20px Arial";
        canvas.ctx.shadowColor = "green";
        canvas.ctx.shadowBlur = 10;
        canvas.ctx.fillText(`Pixels gained: ${Math.ceil(skier.position.y)}`, canvas.width-300, 40 );
        canvas.ctx.shadowColor = 'transparent';
        canvas.ctx.shadowBlur = 0;        
    }

    static drawGameOver(canvas: Canvas) {
        canvas.ctx.font = "60px Arial";
        canvas.ctx.shadowColor = "red";
        canvas.ctx.shadowBlur = 10;
        const gameOverText = 'GAME OVER';
        canvas.ctx.fillText(gameOverText, canvas.width/2-gameOverText.length*40/2, canvas.height/2 );
        
        canvas.ctx.font = "40px Arial";
        canvas.ctx.shadowColor = "red";
        canvas.ctx.shadowBlur = 10;
        const instructionText = 'To play again press enter';
        canvas.ctx.fillText(instructionText, canvas.width/2-instructionText.length*20/2, canvas.height/2 + 100 );

        canvas.ctx.shadowColor = 'transparent';
        canvas.ctx.shadowBlur = 0;
    }
}