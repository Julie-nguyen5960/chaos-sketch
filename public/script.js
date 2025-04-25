let gojoText = [];

function preload() {
  // Load the gojo.txt file as an array of lines
  gojoText = loadStrings('gojo.txt');
}

function setup() {
  createCanvas(innerHeight, innerHeight);
  background(245);
  textAlign(CENTER);
  textSize(20);

  // Combine all lines into one string
  let fullText = gojoText.join(' ');
  let words = RiTa.tokenize(fullText);

  // Display each word vertically
  for (let i = 0; i < words.length; i++) {
    text(words[i], width / 2, 50 + i * 20);
  }
}