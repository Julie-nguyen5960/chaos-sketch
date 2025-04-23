function setup() {

   createCanvas(innerHeight,innerHeight);
   background(245);
   textAlign(CENTER);
   textSize(20);
      
   let words = RiTa.tokenize("gojo.txt")
   for (let i=0; i < words.length; i++) {
       text(words[i], 100, 50 + i*20);
   }
 }
