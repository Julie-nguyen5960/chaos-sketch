import { RiTa } from "https://esm.sh/rita";
import p5 from 'https://cdn.jsdelivr.net/npm/p5@1.11.3/+esm'
import tone from 'https://cdn.jsdelivr.net/npm/tone@15.0.4/+esm'

//variables
const sketch = p => {
  let serresText = [];
  let synth;
  let words = [];
  let wordObjects = [];
  let prxl = [];
  let animate = false;

  //Information and Thinking txt file
  p.preload = () => {
    serresText = p.loadStrings('serres.txt');
  }

  //canvas properties
  p.setup = () => {
    p.createCanvas(p.windowHeight, p.windowHeight);
    p.textAlign(p.CENTER);
    p.textSize(1);
    p.fill(255);

    //combine array of text elements
    let fullText = serresText.join(' ');
    words = RiTa.tokenize(fullText);

    let x = 100;
    let y = 100;

    //for loop for each words
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      wordObjects.push({
        word: word,
        x: x,
        y: y,
        vx: p.random(-1.5, 1.5),
        vy: p.random(-1.5, 1.5)
      });

      //adjusting the positions of the words
      x += p.textWidth(word) + 10;
      if (x > p.width - 100) {
        x = 100;
        y += 40;
      }
    }

    // Initialize Tone.js Synth
    synth = new Tone.Synth().toDestination();
    

    // Unlock Tone.js on first interaction
    p.mousePressed = () => {
      Tone.start();  // Unlock audio context
      animate = !animate;
      if (animate) {
        p.loop();
      } else {
        p.noLoop();
        drawWords();
      }
    };

    //stops draw function from looping 
    p.noLoop();
    drawWords();
    capturePixels();
    p.frameRate(p.random(1, 120));
  }

  // controls animation of the words
  p.draw = () => {
    if (!animate) return;
  
    p.background(p.random(0, 20));
  
    for (let obj of wordObjects) {
      obj.x += obj.vx;
      obj.y += obj.vy;
  
      if (obj.x < 0 || obj.x > p.width) obj.vx *= -1;
      if (obj.y < 0 || obj.y > p.height) obj.vy *= -1;
  
      //loops the glitch effects 
      for (let i = 0; i < 3; i++) {
        let glitchX = obj.x + p.random(-8, 8);
        let glitchY = obj.y + p.random(-2, 2);
        
        //random values for glitch effects
        if (p.random() < 0.2) {
          p.fill(p.random(100, 255), p.random(100, 255), p.random(100, 255));
        } else {
          p.fill(255);
        }
  
        p.push();
        p.translate(glitchX, glitchY);
        p.scale(p.random(0.8, 1.2), 1);
        p.text(obj.word, 0, 0);
        p.pop();
      }
    }
  
    glitchSlices(); // <-- slice effect
  }

  // draws the words at a specific (x,y) position
  function drawWords() {
    p.background(245);
    p.fill(0);
    p.textSize(20);

    for (let obj of wordObjects) {
      p.text(obj.word, obj.x, obj.y);
    }
  }

  function capturePixels() {
    p.loadPixels();
    for (let x = 0; x < p.width; x++) {
      prxl[x] = [];
      for (let y = 0; y < p.height; y++) {
        let idx = (x + p.width * y) * 4;
        prxl[x][y] = [
          p.pixels[idx + 0],
          p.pixels[idx + 1],
          p.pixels[idx + 2]
        ];
      }
    }
    p.updatePixels();
  }

  function glitchSlices() {
    if (p.random() < 0.1) { // random chance to slice
      let y = p.floor(p.random(p.height));
      let h = p.floor(p.random(5, 20));
      let offset = p.floor(p.random(-20, 20));

      let img = p.get(0, y, p.width, h);
      p.image(img, offset, y);

      if (synth) {
        let freq = p.random(100, 1000); // random frequency
        synth.triggerAttackRelease(freq, "8n",);
      }
    }
  }
}

// Create new p5 instance
new p5(sketch);