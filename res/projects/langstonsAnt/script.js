let canvas = document.getElementById("canvas");
let slider = document.getElementById("slider");
let loopCountDisplay = document.getElementById("loopCount");
const c = canvas.getContext("2d");
canvas.height = 100;
canvas.width = 100;
c.webkitImageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;
c.imageSmoothingEnabled = false; /// future

let pixels = [];
let ants = [];
let updatesBetweenDraw = 1;
var goAhead = false;
let loopCount = 0;

function Ant(x, y, dir) {
  this.x = x;
  this.y = y;
  this.dir = dir;
}
ants.push(new Ant(canvas.width/2, canvas.height/2, "r"));

for(let rows = 0; rows < canvas.height; rows++){
  pixels.push([]);
  for(let cols = 0; cols < canvas.width; cols++){
    pixels[rows].push(0);
  }
}

let gameLoop = () => {
  requestAnimationFrame(gameLoop);
  //update and transfer into to/from displays
  updatesBetweenDraw = parseInt(slider.value);
  loopCountDisplay.innerHTML = loopCount;
  //check if user is sure of high ugd count
  if(updatesBetweenDraw > 2000){
    if(!goAhead){
      goAhead = confirm("Warning! Updates between draws set to > 2000, this may cause extreme lag... Would you like to continue with this?");
      if(!goAhead){
        updatesBetweenDraw = 2000;
        slider.value = 2000;
      }
    }
  }else{
    goAhead = false;
  }
  //begin updates
  for(var i = 0; i < updatesBetweenDraw; i++){
    update();
    loopCount++;
  }
  //begin draws
  if(updatesBetweenDraw > 1){
    c.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  }
}

let update = () => {
  ants.forEach((ant) => {
    //update ant dir
    if(pixels[ant.x][ant.y] === 1){
      switch(ant.dir){
        case "r": ant.dir = "d";
          break;
        case "l": ant.dir = "u";
          break;
        case "u": ant.dir = "r";
          break;
        case "d": ant.dir = "l";
          break;
      }
    }else{
      switch(ant.dir){
        case "r": ant.dir = "u";
          break;
        case "l": ant.dir = "d";
          break;
        case "u": ant.dir = "l";
          break;
        case "d": ant.dir = "r";
          break;
      }
    }
    //update tile below ant
    if(pixels[ant.x][ant.y] === 1){
      pixels[ant.x][ant.y] = 0;
    }else{
      pixels[ant.x][ant.y] = 1;
    }
    //real time drawing
    if(updatesBetweenDraw === 1){
      if(pixels[ant.x][ant.y] === 1){
        c.fillStyle = "black";
      }else{
        c.fillStyle = "white"
      }
      c.fillRect(ant.x, ant.y, 1, 1);
    }
    //update ant pos
    switch(ant.dir){
      case "r": ant.x++;
        break;
      case "l": ant.x--;
        break;
      case "u": ant.y--;
        break;
      case "d": ant.y++;
        break;
    }
    //make sure ant is inbounds
    if(ant.x === canvas.width){
      ant.x = 1;
    }else if(ant.x === 0){
      ant.x = canvas.width - 1;
    }else if(ant.y === canvas.height){
      ant.y = 1;
    }else if(ant.y === 0){
      ant.y = canvas.height - 1;
    }
    c.fillStyle = "red";
    c.fillRect(ant.x, ant.y, 1, 1);
  })
}

let draw = () => {
  ants.forEach((ant) => {
    c.fillStyle = "red";
    c.fillRect(ant.x, ant.y, 1, 1);
  })
  for(let x = 0; x < pixels.length; x++){
    for(let y = 0; y < pixels[x].length; y++){
      if(pixels[x][y] === 1){
        c.fillStyle = "black";
      }else{
        c.fillStyle = "white"
      }
      c.fillRect(x, y, 1, 1);
    }
  }
}

gameLoop(); //starts off the main loop
draw(); //draws all pixels of graph at beginning
