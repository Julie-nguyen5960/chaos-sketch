import { RiTa } from "https://esm.sh/rita";
import p5 from 'https://cdn.jsdelivr.net/npm/p5@1.11.3/+esm'

// console.log (RiTa)

// const gojoText = await fetch ('gojo.txt')
//   .then(response => response.text())

// console.log (gojoText)

const sketch = p => {
  let gojoText = [];
  let words = [];
  let wordObjects = [];
  let animate = false;

  p.preload = () => {
    gojoText = p.loadStrings('gojo.txt');
  }

  p.setup = () => {
    p.createCanvas(p.windowHeight, p.windowHeight);
    p.textAlign(p.CENTER);
    p.textSize(20);
    p.fill(0);

    let fullText = gojoText.join(' ');
    words = RiTa.tokenize(fullText);

    // Create word objects with position and velocity
    let x = 100;
    let y = 100;
    let space = 20;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      wordObjects.push({
        word: word,
        x: x,
        y: y,
        vx: p.random(-2, 2),
        vy: p.random(-2, 2)
      });

      x += p.textWidth(word) + 10;
      if (x > p.width - 100) {
        x = 100;
        y += 40;
      }
    }

    p.noLoop();
    drawWords();
  }

  p.draw = () => {
    if (!animate) return;

    p.background(245);
    p.fill(0);

    for (let obj of wordObjects) {
      obj.x += obj.vx;
      obj.y += obj.vy;

      // bounce off walls
      if (obj.x < 0 || obj.x > p.width) obj.vx *= -1;
      if (obj.y < 0 || obj.y > p.height) obj.vy *= -1;

      p.text(obj.word, obj.x, obj.y);
    }
  }

  p.mousePressed = () => {
    animate = !animate;
    if (animate) {
      p.loop();
    } else {
      p.noLoop();
      drawWords(); // static version
    }
  }

  function drawWords() {
    p.background(245);
    for (let obj of wordObjects) {
      p.text(obj.word, obj.x, obj.y);
    }
  }
}

// Create new p5 instance
new p5(sketch);