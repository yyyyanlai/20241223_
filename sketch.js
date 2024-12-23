// 添加背景圖片變數
let backgroundImg;

// 角色的精靈圖設定
let characterData = {
  character1: {  // 左邊角色
    actions: {
      idle: {
        spritesheet: null,
        frameWidth: 75,
        frameHeight: 91,
        frameCount: 13,
        row: 0
      },
      attack: {
        spritesheet: null,
        frameWidth: 64,
        frameHeight: 84,
        frameCount: 7,
        row: 0
      },
      jump: {
        spritesheet: null,
        frameWidth: 55,
        frameHeight: 85,
        frameCount: 12,
        row: 0
      }
    },
    currentAction: 'idle',
    frameIndex: 0,
    x: 200,
    y: 200,
    scale: 2,
    speed: 5,
    direction: 1,
    velocityY: 0,
    isJumping: false,
    jumpPower: -15,
    gravity: 0.8,
    health: 100,  // 添加生命值
    isAttacking: false,
    attackDamage: 10,  // 攻擊傷害
    attackRange: 100,  // 攻擊範圍
  },
  character2: {  // 右邊角色
    actions: {
      idle: {
        spritesheet: null,
        frameWidth: 61,
        frameHeight: 69,
        frameCount: 6,
        row: 0
      },
      attack: {
        spritesheet: null,
        frameWidth: 76,
        frameHeight: 97,
        frameCount: 9,
        row: 0
      },
      jump: {
        spritesheet: null,
        frameWidth: 60,
        frameHeight: 68,
        frameCount: 4,
        row: 0
      }
    },
    currentAction: 'idle',
    frameIndex: 0,
    x: 600,
    y: 200,
    scale: 2,
    speed: 5,
    direction: 1,
    velocityY: 0,
    isJumping: false,
    jumpPower: -15,
    gravity: 0.8,
    health: 100,  // 添加生命值
    isAttacking: false,
    attackDamage: 10,  // 攻擊傷害
    attackRange: 100,  // 攻擊範圍
  }
};

function preload() {
  // 載入背景圖片
  backgroundImg = loadImage('background.png');  // 請確保您有一個背景圖片檔案

  // 載入左邊角色的精靈圖
  characterData.character1.actions.idle.spritesheet = loadImage('char1_idle.png');
  characterData.character1.actions.attack.spritesheet = loadImage('char1_attack.png');
  characterData.character1.actions.jump.spritesheet = loadImage('char1_jump.png');
  
  // 載入右邊角色的精靈圖
  characterData.character2.actions.idle.spritesheet = loadImage('char2_idle.png');
  characterData.character2.actions.attack.spritesheet = loadImage('char2_attack.png');
  characterData.character2.actions.jump.spritesheet = loadImage('char2_jump.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);
}

function draw() {
  // 繪製背景圖片（替換原本的 background(220)）
  push();
  imageMode(CORNER);
  // 將背景圖片縮放至視窗大小
  image(backgroundImg, 0, 0, width, height);
  pop();
  
  // 顯示操作說明
  textSize(16);
  fill(0);
  text("左邊角色: A,D移動, W跳躍, S攻擊", 20, 30);
  text("右邊角色: ←,→移動, ↑跳躍, ↓攻擊", 20, 50);
  
  // 處理移動輸入
  handleMovement();
  
  // 檢查碰撞
  checkCollision();
  
  // 繪製角色
  drawCharacter('character1');
  drawCharacter('character2');
  
  // 檢查遊戲結束
  checkGameOver();
}

function handleMovement() {
  // 左邊角色移動 (A,D鍵)
  if (keyIsDown(65)) { // A
    characterData.character1.x -= characterData.character1.speed;
    characterData.character1.direction = -1;
  }
  if (keyIsDown(68)) { // Dwdadwwaaaaaadw
    characterData.character1.x += characterData.character1.speed;
    characterData.character1.direction = 1;
  }
  
  // 右邊角色移動 (左右方向鍵)
  if (keyIsDown(LEFT_ARROW)) {
    characterData.character2.x -= characterData.character2.speed;
    characterData.character2.direction = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    characterData.character2.x += characterData.character2.speed;
    characterData.character2.direction = 1;
  }
  
  // 確保角色不會移出畫面
  for (let charId in characterData) {
    let char = characterData[charId];
    char.x = constrain(
      char.x, 
      0, 
      width - char.actions[char.currentAction].frameWidth * char.scale
    );
  }

  // 處理重力和跳躍
  for (let charId in characterData) {
    let char = characterData[charId];
    
    // 應用重力
    char.velocityY += char.gravity;
    char.y += char.velocityY;
    
    // 檢查地面碰撞
    let groundY = height - char.actions[char.currentAction].frameHeight * char.scale;
    if (char.y > groundY) {
      char.y = groundY;
      char.velocityY = 0;
      char.isJumping = false;
      
      // 如果沒有其他按鍵按下且正在跳躍動作，回到待機狀態
      if (char.currentAction === 'jump') {
        if (charId === 'character1' && !keyIsDown(65) && !keyIsDown(68) && !keyIsDown(83)) {
          updateCharacterAction(charId, 'idle');
        } else if (charId === 'character2' && !keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && !keyIsDown(DOWN_ARROW)) {
          updateCharacterAction(charId, 'idle');
        }
      }
    }
  }
}

function drawCharacter(charId) {
  let char = characterData[charId];
  let action = char.actions[char.currentAction];
  
  // 繪製角色精靈圖
  push();
  translate(char.x + (char.direction === -1 ? action.frameWidth * char.scale : 0), char.y);
  scale(char.direction * char.scale, char.scale);
  
  let sx = (char.frameIndex % action.frameCount) * action.frameWidth;
  let sy = action.row * action.frameHeight;
  
  image(action.spritesheet, 
        0, 0, 
        action.frameWidth, 
        action.frameHeight,
        sx, sy,
        action.frameWidth,
        action.frameHeight);
  pop();
  
  // 繪製生命值條
  push();
  let barWidth = 50;
  let barHeight = 5;
  let barX = char.x + (action.frameWidth * char.scale) / 2 - barWidth / 2;
  let barY = char.y - 20;
  
  // 生命值背景
  fill(255, 0, 0);
  rect(barX, barY, barWidth, barHeight);
  
  // 當前生命值
  fill(0, 255, 0);
  rect(barX, barY, (char.health / 100) * barWidth, barHeight);
  pop();
  
  char.frameIndex = (char.frameIndex + 1) % action.frameCount;
}

function keyPressed() {
  // 左邊角色跳躍 (W鍵)
  if (keyCode === 87 && !characterData.character1.isJumping) { // W
    characterData.character1.velocityY = characterData.character1.jumpPower;
    characterData.character1.isJumping = true;
    updateCharacterAction('character1', 'jump');
  }
  // 左邊角色攻擊 (S鍵)
  if (keyCode === 83 && characterData.character1.currentAction !== 'attack') {
    updateCharacterAction('character1', 'attack');
    characterData.character1.isAttacking = true;
  }
  
  // 右邊角色跳躍 (上方向鍵)
  if (keyCode === UP_ARROW && !characterData.character2.isJumping) {
    characterData.character2.velocityY = characterData.character2.jumpPower;
    characterData.character2.isJumping = true;
    updateCharacterAction('character2', 'jump');
  }
  // 右邊角色攻擊 (下方向鍵)
  if (keyCode === DOWN_ARROW && characterData.character2.currentAction !== 'attack') {
    updateCharacterAction('character2', 'attack');
    characterData.character2.isAttacking = true;
  }
  
  if (keyCode === 32 && (characterData.character1.health <= 0 || characterData.character2.health <= 0)) {
    resetGame();
    loop();
  }
}

function keyReleased() {
  // 左邊角色回到待機
  if (!keyIsDown(65) && !keyIsDown(68) && !keyIsDown(87) && !keyIsDown(83) && !characterData.character1.isJumping) {
    updateCharacterAction('character1', 'idle');
  }
  
  // 右邊角色回到待機
  if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && 
      !keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW) && !characterData.character2.isJumping) {
    updateCharacterAction('character2', 'idle');
  }
}

function updateCharacterAction(charId, newAction) {
  let char = characterData[charId];
  if (char.currentAction !== newAction) {
    char.currentAction = newAction;
    char.frameIndex = 0;
    
    // 如果是攻擊動作，設定一個計時器來結束攻擊狀態
    if (newAction === 'attack') {
      setTimeout(() => {
        char.isAttacking = false;
        if (char.currentAction === 'attack') {
          updateCharacterAction(charId, 'idle');
        }
      }, 500); // 攻擊動作持續500毫秒
    }
  }
}

// 添加碰撞檢測函數
function checkCollision() {
  let char1 = characterData.character1;
  let char2 = characterData.character2;
  
  // 計算兩個角色的距離
  let char1CenterX = char1.x + (char1.actions[char1.currentAction].frameWidth * char1.scale) / 2;
  let char2CenterX = char2.x + (char2.actions[char2.currentAction].frameWidth * char2.scale) / 2;
  let distance = abs(char1CenterX - char2CenterX);
  
  // 檢查攻擊判定
  if (char1.currentAction === 'attack') {
    if (distance < char1.attackRange && char1.frameIndex < 3) { // 只在攻擊動畫前半段判定
      char2.health = max(0, char2.health - char1.attackDamage);
      // 添加攻擊特效
      drawAttackEffect(char2.x, char2.y);
    }
  }
  
  if (char2.currentAction === 'attack') {
    if (distance < char2.attackRange && char2.frameIndex < 3) { // 只在攻擊動畫前半段判定
      char1.health = max(0, char1.health - char2.attackDamage);
      // 添加攻擊特效
      drawAttackEffect(char1.x, char1.y);
    }
  }
}

// 添加攻擊特效繪製函數
function drawAttackEffect(x, y) {
  push();
  // 繪製閃光效果
  noStroke();
  fill(255, 255, 0, 100);
  for (let i = 0; i < 5; i++) {
    let size = random(20, 40);
    ellipse(x + random(-20, 20), y + random(-20, 20), size, size);
  }
  
  // 繪製衝擊波
  stroke(255, 0, 0);
  noFill();
  let size = random(30, 50);
  ellipse(x, y, size, size);
  pop();
}

// 添加遊戲結束檢查函數
function checkGameOver() {
  if (characterData.character1.health <= 0 || characterData.character2.health <= 0) {
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER);
    
    if (characterData.character1.health <= 0) {
      text("右邊角色獲勝！", width/2, height/2);
    } else {
      text("左邊角色獲勝！", width/2, height/2);
    }
    
    text("按空白鍵重新開始", width/2, height/2 + 40);
    noLoop();
  }
}

function resetGame() {
  characterData.character1.health = 100;
  characterData.character2.health = 100;
  characterData.character1.x = 200;
  characterData.character1.y = 200;
  characterData.character2.x = 600;
  characterData.character2.y = 200;
  characterData.character1.currentAction = 'idle';
  characterData.character2.currentAction = 'idle';
}

