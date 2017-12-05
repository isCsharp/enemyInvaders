
/*

    //
    //  Game Javascript File Anything on Game page
    //  will run functions in this file
    //


*/


    // -------------------------------------------------------------- //
    //                        Initiate Stuff                          //
    // -------------------------------------------------------------- //
    
// Save Level and Difficulty With User Choices
var levelsChosen = localStorage.getItem("levelsChosen");
var difficultyChosen = localStorage.getItem("difficultyChosen");
var keyW = 87;
var keyS = 83;
var keyA = 65;
var keyD = 68;

setLevelAndDifficulty();

// player Image Dimensions
playerHeight = 207;
playerWidth = 313;
enemyHeight = 311;
enemyWidth = 288;

var CHARACTER_HEIGHT = playerHeight / 4;  // Base Height is 207, made it 4 times smaller
var CHARACTER_WIDTH = playerWidth / 4;    // Base Width is 313,   ""
var ENEMY_HEIGHT = enemyHeight / 4;       // Base Height is 311,  ""
var ENEMY_WIDTH = enemyWidth / 4;         // Base Width is 288,   ""

var NUMBER_IMAGES_MOVING = 20;        // When Character moves up and down
var NUMBER_IMAGES_IDLE = 19;          // Will Default to this animation when not moving or anything else
var NUMBER_IMAGES_ENEMY_MOVING = 17;  // Animation for enemy

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

var currentKeyDown;


var jcount = 0;   // my frame counter
var enemyJcount = 0;
var imageInSprite_X;		// where in our spritesheet do we want to extract the pixels from
var imageInSprite_Y;

var jxpos=0;  // the location of the dog within the canvas
var jypos=0;


var myInterval;    // used to set up interval
var mykeydown = false;

// Player Specs
var Speed_Y;

//enemy img
var enemyImg = new Image();
enemyImg.src = "images/sprite_enemy_moving.png";

// Bullet IMG
var bulletImg = new Image();
bulletImg.src = "images/bullet.png";

// Enemy Specs
var enemyMovingSpeed;
var numToSpawn;

// Min  |  Max Enemy Location Height
var enemySpawnMin;
var enemySpawnMax; 

// Array To Store Enemy | Bullet
var enemyArray = [];
var bulletArray = [];

// Bullet Moving Speed | Size
var bulletMovingSpeed = 15;

var bulletSize_X = 15;
var bulletSize_Y = 15;

// Bullets To Fire In A Row
var currentMagazineSize = 20;

// How Often To Spawn Enemy
var currentTime = 0;

// Current Level | Score
var currentLevel = 1;
var currentScore = 5;

var friendliesLeft = 5;

// How Long It Should Take To Reload
var reloadTime;
var playerReloading = false;

// Game Paused
var pauseGame = false;

// Enemies On Map
var enemiesSpawnPerLevel;
var levelsToPlay;

// Bullet Hit Zombie
var zombieHit = new Audio("sounds/bulletHit.wav");
var zombiePassed = new Audio("sounds/zombiePassed.wav");


var Keys = {
        W: false,        
        S: false,
        A: false,
        D: false    
};


function setLevelAndDifficulty() {

  // Check Difficulty Chosen
  if(difficultyChosen == "beginner") 
  {
    howOftenToSpawn = 100;
    reloadTime = 300;
  }
  else if(difficultyChosen == "easy")
  {
    howOftenToSpawn = 70;
    reloadTime = 400;

  }
  else if(difficultyChosen == "medium")
  {
    howOftenToSpawn = 50;
    reloadTime = 500;

  }
  else if(difficultyChosen == "hard")
  {
    howOftenToSpawn = 40;
    reloadTime = 600;
  }
  

  // Check Number Levels Want To Play
  if(levelsChosen == "oneLevel")
  {
    Speed_Y = 6;
    numToSpawn = 20;
    enemiesSpawnPerLevel = numToSpawn;
    enemyMovingSpeed = 3;
    levelsToPlay = 1;

  }
  else if(levelsChosen == "twoLevels")
  {
    Speed_Y = 6;
    numToSpawn = 30;
    enemiesSpawnPerLevel = numToSpawn;
    enemyMovingSpeed = 4;
    levelsToPlay = 2;
    
  }
  else if(levelsChosen == "threeLevels")
  {
    Speed_Y = 6;
    numToSpawn = 40;
    enemiesSpawnPerLevel = numToSpawn;
    enemyMovingSpeed = 4;
    levelsToPlay = 3;    
  }
  else if(levelsChosen == "fourLevels")
  {
    Speed_Y = 6;
    numToSpawn = 50;
    enemiesSpawnPerLevel = numToSpawn;
    enemyMovingSpeed = 5;
    levelsToPlay = 4;    
  }
  else if(levelsChosen == "fiveLevels")
  {
    Speed_Y = 6;
    numToSpawn = 60;
    enemiesSpawnPerLevel = numToSpawn;
    enemyMovingSpeed = 5;
    levelsToPlay = 5;    
  }

  // Difficulty Chosen Insane
  if(difficultyChosen == "goodLuck")
  {
    reloadTime = 800;
    howOftenToSpawn = 20;
    Speed_Y = 7;
    enemyMovingSpeed = 7;
    numToSpawn = 75;
    enemiesSpawnPerLevel = numToSpawn;
  }
  
}
    

    // -------------------------------------------------------------- //
    //                           Game Initialize                      //
    // -------------------------------------------------------------- //


$(document).ready(function () {  

    // Set Canvas Size & Save the size
    var context = document.getElementById('gameCanvas').getContext("2d");
    var player = document.getElementById("myImg");
    context.canvas.width = window.innerWidth  * .8;
    CANVAS_WIDTH = window.innerWidth  * .8;
    context.canvas.height = window.innerHeight * .8;
    CANVAS_HEIGHT = window.innerHeight * .8;

    // Set Locations Of Player  |  Enemy
    jypos = CANVAS_HEIGHT * 0.2;
    enemySpawnMin = CANVAS_HEIGHT * 0.2;
    enemySpawnMax = CANVAS_HEIGHT * 0.7;



    // Images For Player   |   Standing And Walking
    var playerIdle = new Image();
    playerIdle.src = "images/sprite_idle.png";

    var playerMoving = new Image();
    playerMoving.src = "images/sprite_moving.png";
    
      
    // Draw
    myInterval = setInterval (draw,40);
    var totalEnemies = numToSpawn;
  
    function draw()
    {     
      // Condition To Keep Game Going
      if(pauseGame == false)      
        if(enemiesSpawnPerLevel != 0)        
          if(friendliesLeft > 0)
          {              
            
            currentTime++;
            context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

            if( currentTime % howOftenToSpawn == 1 && totalEnemies != 0)
            {
              totalEnemies --;
              enemyTemp = new Enemy();
              enemyArray.push(enemyTemp);

            }
            for(i = 0; i < enemyArray.length; i++)
            { 
              enemyImageInSprite_X = (enemyJcount % 3) * (ENEMY_WIDTH * 4);
              enemyImageInSprite_Y = Math.floor(enemyJcount / 3) * (ENEMY_HEIGHT * 4);

              enemyArray[i].move();
              context.drawImage(enemyArray[i].img, enemyImageInSprite_X, enemyImageInSprite_Y,(ENEMY_WIDTH * 4), (ENEMY_HEIGHT * 4), enemyArray[i].x, enemyArray[i].y, ENEMY_WIDTH, ENEMY_HEIGHT);
            }

            // Loop to change location
            //enemyArr[i].move();
            
            imageInSprite_X = (jcount % 3) * (CHARACTER_WIDTH * 4);         // modulo 3 since  three images wide multiply by original image size
            imageInSprite_Y = Math.floor(jcount / 3) * (CHARACTER_HEIGHT * 4);  // Math.floor rounds down and will give effectively row number, then multiply by height 201
            

            if(Keys.W == false && Keys.S == false)
            {
              context.drawImage(playerIdle, imageInSprite_X, imageInSprite_Y, (CHARACTER_WIDTH * 4), (CHARACTER_HEIGHT * 4),jxpos, jypos, CHARACTER_WIDTH, CHARACTER_HEIGHT );  // here he moves per keystrokes
            }
            if(Keys.W == true || Keys.S == true)
            {
              movePlayer();
              context.drawImage(playerMoving, imageInSprite_X, imageInSprite_Y, (CHARACTER_WIDTH * 4), (CHARACTER_HEIGHT * 4),jxpos, jypos, CHARACTER_WIDTH , CHARACTER_HEIGHT );  // here he moves per keystrokes
            }
            for(i = 0; i < bulletArray.length; i++)
            {
              bulletArray[i].move();
              context.drawImage(bulletArray[i].img, bulletArray[i].x, bulletArray[i].y, bulletSize_X, bulletSize_Y );  // All Bullets

            }
          
            context.fillStyle = "white";
            context.font = "150% Arial";
            context.textAlign = "center";



            if(currentMagazineSize == 0)
              context.fillText("ENEMIES LEFT: "+ enemiesSpawnPerLevel +"  |   LEVEL: "+ levelsToPlay +"  |   FRIENDLIES LEFT: "+ friendliesLeft +"  |  SCORE: "+ currentScore +"  |  BULLETS LEFT: RELOAD !! ", (CANVAS_WIDTH / 2), (CANVAS_HEIGHT - 10));     
            else if(playerReloading == true)
                context.fillText("ENEMIES LEFT: "+ enemiesSpawnPerLevel +"  |   LEVEL: "+ levelsToPlay +"  |   FRIENDLIES LEFT: "+ friendliesLeft +"  |  SCORE: "+ currentScore +"  |  BULLETS LEFT: RELOADING ", (CANVAS_WIDTH / 2), (CANVAS_HEIGHT - 10));
            else
              context.fillText("ENEMIES LEFT: "+ enemiesSpawnPerLevel +"  |   LEVEL: "+ levelsToPlay +"  |   FRIENDLIES LEFT: "+ friendliesLeft +"  |  SCORE: "+ currentScore +"  |  BULLETS LEFT:  "+currentMagazineSize, (CANVAS_WIDTH / 2), (CANVAS_HEIGHT - 10));  

            // Moving The Frame In Sprite
            if(mykeydown == false)
            {
              // now move to next frame, when you hit NUMBER_IMAGES_IDLE (19 Default), start over.
              if (jcount >= NUMBER_IMAGES_IDLE)
                jcount =0;
              else
                jcount++;
            }

            if(mykeydown)
            {
              if (jcount >= NUMBER_IMAGES_MOVING)
                jcount =0;
                else
                jcount++;
            }

            if(enemyJcount >= NUMBER_IMAGES_ENEMY_MOVING)
              enemyJcount=0;
            else
              enemyJcount++;
            
            hitRangeHeight = 50;
            hitRangeWidth = 25;
            
            for(enemyNum = 0; enemyNum < enemyArray.length; enemyNum++)        
              for(bulletNum = 0; bulletNum < bulletArray.length; bulletNum++)          
                for(characterHeightRange = 0; characterHeightRange < hitRangeHeight; characterHeightRange++)            
                  if(Math.floor(enemyArray[enemyNum].y) == Math.floor(bulletArray[bulletNum].y - characterHeightRange ))
                    for(characterWidthRange = 0; characterWidthRange < hitRangeWidth; characterWidthRange++)             
                      if(Math.floor(enemyArray[enemyNum].x) == (bulletArray[bulletNum].x + characterWidthRange) || Math.floor(enemyArray[enemyNum].x) == (bulletArray[bulletNum].x - characterWidthRange * 2 ))
                      {
                        
                        enemyArray.splice(enemyNum, 1);
                        bulletArray.splice(bulletNum, 1);
                        currentScore++;
                        enemiesSpawnPerLevel--;
                        zombieHit.play();
                      
                      }
            removeEnemiesAndBullets();  
          }
        if(friendliesLeft == 0)
          gameOver();                             
        
        if(enemiesSpawnPerLevel == 0)
        {
          if(levelsToPlay == 1)
            youWinGameOver();
          
          if(levelsToPlay == 2)
          {
            if(currentLevel == 2)    
              printWinningWithBuggyLevelsDesign();    
              

          /*myInterval = setInterval(draw, 40);
            currentLevel++;
            numToSpawn += 5;
            enemiesSpawnPerLevel = numToSpawn;
            enemyMovingSpeed = 2; */
          } 

          if(levelsToPlay == 3)
          {
            if(currentLevel == 3)            
            printWinningWithBuggyLevelsDesign();   

          /*myInterval = setInterval(draw, 40);              
            currentLevel++;
            numToSpawn += 5;
            enemiesSpawnPerLevel = numToSpawn;
            enemyMovingSpeed = 2; */
          }

          if(levelsToPlay == 4)
          {
            if(currentLevel == 4)            
            printWinningWithBuggyLevelsDesign();  

          /*myInterval = setInterval(draw, 40);  
            currentLevel++;
            numToSpawn += 5;
            enemiesSpawnPerLevel = numToSpawn;
            enemyMovingSpeed = 3; */
          }

          if(levelsToPlay == 5)
          {
            if(currentLevel == 5)            
              printWinningWithBuggyLevelsDesign();   

          /*myInterval = setInterval(draw, 40);              
            currentLevel++;
            numToSpawn += 5;
            enemiesSpawnPerLevel = numToSpawn;
            enemyMovingSpeed = 3; */
          }
          
        }
      }

    function printWinningWithBuggyLevelsDesign() {

      window.clearInterval(myInterval); // END
      context.font = "italic 250% Arial";
      context.fillText("YOU WIN",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2)); 
      context.font = "italic 150% Arial";        
      context.fillText("Didn't Get Levels Sequence Working",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 1.8));  
      context.fillText("It Was Buggy",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 1.7));  
    }
      

    function gameOver() {

        window.clearInterval(myInterval); // END
        context.font = "italic 250% Arial";
        context.fillText("GAME OVER",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2)); 
        context.font = "italic 150% Arial";        
        context.fillText("F5 To Play Again On Same Settings",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 1.8));  
        context.fillText("Different Settings? Go Back A Page",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 1.7));  
        
    }

    function youWinGameOver() {

      window.clearInterval(myInterval); // END
      context.font = "italic 250% Arial";
      context.fillText("YOU WIN !!",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2)); 
      context.font = "italic 150% Arial";        
      context.fillText("F5 To Play Again On Same Settings",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 1.8));  
      context.fillText("Different Settings? Go Back A Page",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 1.7));  
    }

    function removeEnemiesAndBullets(){

      for(i = 0; i < enemyArray.length; i++)
      {
        if(enemyArray[i].x < -50)
        {
          enemyArray.splice(i, 1);
          enemiesSpawnPerLevel--;
          friendliesLeft--;
            if(currentScore - 5 < 0)
              currentScore = 0;
            else
              currentScore -= 5;

          zombiePassed.play();
        }
      }
      for(i = 0; i < bulletArray.length; i++)
      {
        if(bulletArray[i].x > CANVAS_WIDTH)
          bulletArray.splice(i, 1);
      }
    }
    
    
    // Move Character
    function movePlayer() {
      if (Keys.W) {
        if(jypos >= CANVAS_HEIGHT * 0.2)   // The Ledge Location Min    
          jypos-= Speed_Y;
      }
      else if (Keys.S) {
        if(jypos <= CANVAS_HEIGHT * 0.7)  // The Ledge Location Max
          jypos+= Speed_Y;
      }      
      
    }

    function keydownhandler(e)
    {
      
       
       mykeydown=true;
       currentKeyDown = e.keyCode;

       switch (e.keyCode)
       {
          case 27: pauseTheGame(); break;
          case 82: reloadGun(); break;
          case 32: createNewBullet(); break;
          case keyW:	Keys.W= true;break;
          case keyS:	Keys.S= true;break;
          case keyA:  Keys.A= true;break;
          case keyD:  Keys.D= true;break;
       }
    }    

    function reloadGun() 
    {
        playerReloading = true;
        myVar = setTimeout(justBellow, reloadTime);
        function justBellow()
        {
          playerReloading = false;         
          currentMagazineSize = 20;
        }

    }

    function createNewBullet()
    {
        
        
          window.onkeyup = function(e) {
            if(e.keyCode == 32)
            {
              if(playerReloading == false)
              {
                if(!(currentMagazineSize == 0))
                {
                  bulletTemp = new Bullet();
                  bulletArray.push(bulletTemp);
                  currentMagazineSize--;
                }
              }
            }
          }
    }
        
    


    function keyuphandler(e)
    {
      switch (e.keyCode)
      {
       case keyW:	Keys.W= false;break;
       case keyS:	Keys.S= false;break;
       case keyA: Keys.A= false;break;
       case keyD: Keys.D= false;break;
      }
      mykeydown = false;

    }

    function pauseTheGame(e)
    { 
      if(pauseGame == false)
      {
        window.clearInterval(myInterval); //pause
        context.font = "italic 250% Arial";
        context.fillText("GAME PAUSED",(CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2));  

      }
      if(pauseGame == true)
      {
        myInterval = setInterval(draw, 40);
      }

      pauseGame = !pauseGame;



      
      
    }

    $(document).keydown(keydownhandler);
    $(document).keyup(keyuphandler);




})

    // -------------------------------------------------------------- //
    //                              Enemy Class                       //
    // -------------------------------------------------------------- //

    class Enemy {

      constructor() {
        var maxSpawn_Y = enemySpawnMax - 300;
        this.x = Math.floor(window.innerWidth  * .8);
        this.y = Math.floor(Math.random() * maxSpawn_Y) + enemySpawnMin;

        this.img = enemyImg;       

      }

      move() {
        this.x -= enemyMovingSpeed;
      }
    }

    // -------------------------------------------------------------- //
    //                             Bullet Class                       //
    // -------------------------------------------------------------- //

    class Bullet {

      constructor() {
        this.x = 70;    // Moves
        this.y = jypos + 30;

        this.img = bulletImg;       

      }
      move() {
        this.x += bulletMovingSpeed;
      }
    }
