# Ski Code Challenge - TypeScript Edition

**How To run**

```
npm install
npm run dev
```

**How To Play**

-   Use the arrow keys to turn the skier.
-   The skier will crash if they hit an obstacle. Use the left/right keys to move away from the obstacle and then down
    to resume skiing.
-   At some point the rhino will appear, chasing the skier. It will inevitably catch the skier and eat them, ending the
    game.

**New features added**

-   **Features:**
    -   Jump ramps are added to the game world and appear randomly as the skier skis.
    -   The skier can enter the jumping state when they hit the jump ramp.
    -   The skier can enter the jumping state when the user presses the spacebar.
    -   The skier can do a flip while jumping, exactly one cycle through the jump images provided.
    -   While jumping, the can should be able to jump over some obstacles:
        -   Rocks can be jumped over
        -   Trees can NOT be jumped over

-   **Documentation on what has been done:**

    -   I struggled understanding the code so I did a lot of renaming, for example:
        - renamed entity folder to sprites, I think things should be name closely for what they are.
        - expanded skier sprite class to whole folder and moved some of the details in seperate files (it is hard to follow when one file holds everything) 
        - did same thing with constants, this way if one looks for something it can just to go to file.      
    -   I add some constants and obvious updates regarding assets.
    
    - Most of my work was around skier sprite class, for this purpose I expanded this class into whole folder.
    - Problem core was in the area of collision detections and animation, to solve this I used a lot of googling and taking rhino sprite animation as reference. My solution invloved exetracting this 2 things into seperate classes and deal with those problems there. So instead a lot of new code, skier class got just 2 new properties, jumpAnimator and collisionDetector. My idea is to use them as in startegy pattern, in future they can become more abstract type and inserted on specific demand, for example if one needs to have other animations rolling one can inject other animation handler. Or if one needs to handle collision in different way it can be inject instead current collisionDetector. This is just an idea. Also I did some short methods with meaningful naming, that helps to follow what is going on, since I had a hard time reading the code in the first place.
    
        


**Bonus**

-   "Game over" and "To play again press enter" appears so user can restart the game once it's over
-   Score is available on top right corner of the screen
