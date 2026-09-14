let myPlayerId = "P_" + Math.floor(1000 + Math.random() * 9000);
let currentRoomId = null;
let myNick = "Travesso";
let myColor = 0x0088ff;
let players = {};
let aiGranny = null;
let game, scene;
let touchInput = { x: 0, y: 0 };
let isPaused = false;
let mqttClient = null;
let cursors, wasd;

let gameKeys = { 
    red: false, yellow: false, blue: false, green: false, 
    purple: false, orange: false, pink: false, cyan: false 
};

let carParts = {
    engine: false, gas: false, tire: false, battery: false, sparkPlug: false, carKey: false,
    radiator: false, alternator: false, oil: false, mirror: false, seat: false,
    exhaust: false, headlight: false, horn: false, radio: false, belt: false,
    filter: false, pump: false, cable: false, fuse: false
};

let hasShotgun = false;
let shotgunAmmo = 1;
let isGrannyStunned = false;

let grannyState = 'patrol';
let patrolPoints = [
    {x: 300, y: 300}, {x: 700, y: 400}, {x: 1200, y: 600},
    {x: 1700, y: 580}, {x: 900, y: 1100}, {x: 400, y: 1400},
    {x: 1300, y: 1400}, {x: 600, y: 700}, {x: 1800, y: 950}
];
let currentPatrolIndex = 0;
let grannyStuckTimer = 0;
let lastGrannyPos = {x: 0, y: 0};

let redKeyObj, yellowKeyObj, blueKeyObj, greenKeyObj, purpleKeyObj, orangeKeyObj, pinkKeyObj, cyanKeyObj;
let redDoorObj, yellowDoorObj, blueDoorObj, greenDoorObj, purpleDoorObj, orangeDoorObj, pinkDoorObj, cyanDoorObj;
let engineObj, gasObj, tireObj, batteryObj, sparkPlugObj, carKeyObj, carObj, shotgunObj;
let radiatorObj, alternatorObj, oilObj, mirrorObj, seatObj, exhaustObj, headlightObj, hornObj, radioObj, beltObj;
let filterObj, pumpObj, cableObj, fuseObj;
let stairsToBasement, stairsToGarage;

function getPlayerSettings() {
    myNick = document.getElementById('nick-input').value.trim() || "Travesso";
    myColor = parseInt(document.getElementById('color-select').value);
}

function createCustomRoom() {
    getPlayerSettings();
    let input = document.getElementById('room-code-input').value.trim();
    if (!input) return alert("Digite um código para a sala!");
    currentRoomId = input.toUpperCase();
    startCutscene();
}

function joinCustomRoom() {
    getPlayerSettings();
    let input = document.getElementById('room-code-input').value.trim();
    if (!input) return alert("Digite o código da sala!");
    currentRoomId = input.toUpperCase();
    startCutscene();
}

function startAloneGame() { 
    getPlayerSettings();
    startCutscene();
}

function startCutscene() {
    document.getElementById('ui').style.display = 'none';
    document.getElementById('cutscene').style.display = 'block';
    
    const text = `ola prazer sou ${myNick}

eu sempre fui bem travesso
so que minha vo me deixou de castigo

e como quero brincar
vou roubar o carro
e ganhar 1 milhao de dolares...

preparando fuga...`;

    const el = document.getElementById('cutscene-text');
    el.innerHTML = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 35);
        } else {
            setTimeout(() => {
                document.getElementById('cutscene').style.display = 'none';
                showGameUI();
                startGame();
                if (currentRoomId) initMQTT();
            }, 1800);
        }
    }
    typeWriter();
}

function initMQTT() {
    mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt');
    mqttClient.on('connect', () => {
        mqttClient.subscribe(`granny2d/rooms/${currentRoomId}`);
    });
    mqttClient.on('message', (topic, message) => {
        try {
            let data = JSON.parse(message.toString());
            if (data.id === myPlayerId) return;
            if (data.type === 'move') {
                if (!scene) return;
                if (!players[data.id]) createOtherPlayer(data.id, data.color);
                if (players[data.id]) players[data.id].setPosition(data.x, data.y);
            } else if (data.type === 'action') {
                handleGameEvents(data.action, data.key);
            }
        } catch(e) {}
    });
}

function sendNetPosition() {
    if (mqttClient && mqttClient.connected && players[myPlayerId]) {
        let p = players[myPlayerId];
        mqttClient.publish(`granny2d/rooms/${currentRoomId}`, JSON.stringify({
            type: 'move', id: myPlayerId, color: myColor,
            x: Math.round(p.x), y: Math.round(p.y)
        }));
    }
}

function sendNetAction(action, key = null) {
    if (mqttClient && mqttClient.connected) {
        mqttClient.publish(`granny2d/rooms/${currentRoomId}`, JSON.stringify({
            type: 'action', action: action, key: key
        }));
    }
}

function handleGameEvents(action, keyName = null) {
    if (action === 'collect_key') {
        gameKeys[keyName] = true;
        if (keyName === 'red' && redKeyObj) redKeyObj.destroy();
        if (keyName === 'yellow' && yellowKeyObj) yellowKeyObj.destroy();
        if (keyName === 'blue' && blueKeyObj) blueKeyObj.destroy();
        if (keyName === 'green' && greenKeyObj) greenKeyObj.destroy();
        if (keyName === 'purple' && purpleKeyObj) purpleKeyObj.destroy();
        if (keyName === 'orange' && orangeKeyObj) orangeKeyObj.destroy();
        if (keyName === 'pink' && pinkKeyObj) pinkKeyObj.destroy();
        if (keyName === 'cyan' && cyanKeyObj) cyanKeyObj.destroy();
    }
    if (action === 'open_door') {
        if (keyName === 'red' && redDoorObj) redDoorObj.destroy();
        if (keyName === 'yellow' && yellowDoorObj) yellowDoorObj.destroy();
        if (keyName === 'blue' && blueDoorObj) blueDoorObj.destroy();
        if (keyName === 'green' && greenDoorObj) greenDoorObj.destroy();
        if (keyName === 'purple' && purpleDoorObj) purpleDoorObj.destroy();
        if (keyName === 'orange' && orangeDoorObj) orangeDoorObj.destroy();
        if (keyName === 'pink' && pinkDoorObj) pinkDoorObj.destroy();
        if (keyName === 'cyan' && cyanDoorObj) cyanDoorObj.destroy();
    }
    updateHUD();
}

function showGameUI() {
    document.getElementById('controls').style.display = 'flex';
    document.getElementById('inv').style.display = 'block';
    document.getElementById('btn-pause').style.display = 'flex';
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-menu').style.display = isPaused ? 'flex' : 'none';
    if (scene) isPaused ? scene.physics.pause() : scene.physics.resume();
}

function exitToMainMenu() { 
    if (mqttClient) mqttClient.end();
    location.reload(); 
}

function shootGun() {
    if (hasShotgun && shotgunAmmo > 0) {
        shotgunAmmo--;
        isGrannyStunned = true;
        setTimeout(() => isGrannyStunned = false, 3000);
        document.getElementById('btn-shoot').style.display = 'none';
    }
}

function updateHUD() {
    let keysList = Object.keys(gameKeys).filter(k => gameKeys[k]).map(k => k.toUpperCase()).join(', ') || 'Nenhuma';
    let partCount = Object.values(carParts).filter(v => v).length;
    document.getElementById('keys-list').textContent = keysList;
    document.getElementById('car-parts').textContent = partCount + '/20';
    document.getElementById('gun-status').textContent = hasShotgun ? 'Sim (' + shotgunAmmo + ')' : 'Não';
}

function createOtherPlayer(id, color) {
    if (!scene) return;
    let player = scene.physics.add.sprite(100, 100, 'player_base');
    player.setTint(color);
    players[id] = player;
}

function startGame() {
    const config = {
        type: Phaser.AUTO, width: 360, height: 500,
        physics: { default: 'arcade', arcade: { debug: false } },
        scene: { preload: preload, create: create, update: update }
    };
    game = new Phaser.Game(config);
}

function preload() {
    scene = this;
    let g = this.add.graphics();

    // Player sprite
    g.fillStyle(0xffffff);
    g.fillCircle(10, 10, 10);
    g.generateTexture('player_base', 20, 20);
    g.clear();
    
    // Granny sprite
    g.fillStyle(0x8b008b);
    g.fillRect(4, 10, 16, 18);
    g.fillStyle(0xffe0bd);
    g.fillCircle(12, 8, 7);
    g.fillStyle(0xdcdcdc);
    g.fillCircle(12, 4, 4);
    g.fillStyle(0x8b4513);
    g.fillRect(18, 12, 3, 14);
    g.fillRect(16, 12, 5, 3);
    g.generateTexture('granny_sprite', 24, 28);
    g.clear();

    // Walls
    g.fillStyle(0x444444);
    g.fillRect(0, 0, 20, 20);
    g.generateTexture('wall', 20, 20);
    g.clear();

    // Keys
    g.fillStyle(0xff0000); g.fillRect(0, 0, 10, 10); g.generateTexture('red_key', 10, 10); g.clear();
    g.fillStyle(0xffff00); g.fillRect(0, 0, 10, 10); g.generateTexture('yellow_key', 10, 10); g.clear();
    g.fillStyle(0x00ffff); g.fillRect(0, 0, 10, 10); g.generateTexture('blue_key', 10, 10); g.clear();
    g.fillStyle(0x00ff00); g.fillRect(0, 0, 10, 10); g.generateTexture('green_key', 10, 10); g.clear();
    g.fillStyle(0xaa00ff); g.fillRect(0, 0, 10, 10); g.generateTexture('purple_key', 10, 10); g.clear();
    g.fillStyle(0xff8800); g.fillRect(0, 0, 10, 10); g.generateTexture('orange_key', 10, 10); g.clear();
    g.fillStyle(0xff66aa); g.fillRect(0, 0, 10, 10); g.generateTexture('pink_key', 10, 10); g.clear();
    g.fillStyle(0x00ccff); g.fillRect(0, 0, 10, 10); g.generateTexture('cyan_key', 10, 10); g.clear();

    // Doors
    g.fillStyle(0xff2222); g.fillRect(0, 0, 60, 15); g.generateTexture('red_door', 60, 15); g.clear();
    g.fillStyle(0xffff22); g.fillRect(0, 0, 60, 15); g.generateTexture('yellow_door', 60, 15); g.clear();
    g.fillStyle(0x00ffff); g.fillRect(0, 0, 60, 15); g.generateTexture('blue_door', 60, 15); g.clear();
    g.fillStyle(0x00ff00); g.fillRect(0, 0, 60, 15); g.generateTexture('green_door', 60, 15); g.clear();
    g.fillStyle(0xaa00ff); g.fillRect(0, 0, 60, 15); g.generateTexture('purple_door', 60, 15); g.clear();
    g.fillStyle(0xff8800); g.fillRect(0, 0, 60, 15); g.generateTexture('orange_door', 60, 15); g.clear();
    g.fillStyle(0xff66aa); g.fillRect(0, 0, 60, 15); g.generateTexture('pink_door', 60, 15); g.clear();
    g.fillStyle(0x00ccff); g.fillRect(0, 0, 60, 15); g.generateTexture('cyan_door', 60, 15); g.clear();

    // Car and parts
    g.fillStyle(0x228b22); g.fillRect(0, 0, 60, 35); g.generateTexture('car', 60, 35); g.clear();
    g.fillStyle(0x888888); g.fillRect(0, 0, 12, 12); g.generateTexture('engine', 12, 12); g.clear();
    g.fillStyle(0xffa500); g.fillRect(0, 0, 10, 12); g.generateTexture('gas', 10, 12); g.clear();
    g.fillStyle(0x222222); g.fillCircle(8, 8, 8); g.generateTexture('tire', 16, 16); g.clear();
    g.fillStyle(0x5555ff); g.fillRect(0, 0, 14, 10); g.generateTexture('battery', 14, 10); g.clear();
    g.fillStyle(0xff00ff); g.fillRect(0, 0, 8, 8); g.generateTexture('spark_plug', 8, 8); g.clear();
    g.fillStyle(0xffd700); g.fillRect(0, 0, 10, 6); g.generateTexture('car_key', 10, 6); g.clear();

    // Stairs and table
    g.fillStyle(0xaa6600); g.fillRect(0, 0, 30, 20); g.generateTexture('table', 30, 20); g.clear();
    g.fillStyle(0x666666); g.fillRect(0, 0, 30, 30); g.generateTexture('stairs', 30, 30); g.clear();
    
    // Shotgun
    g.fillStyle(0x111111); g.fillRect(0, 0, 16, 6); g.generateTexture('shotgun', 16, 6); g.clear();
}

function create() {
    let walls = scene.physics.add.staticGroup();
    this.cameras.main.setBounds(0, 0, 2200, 3000);
    this.physics.world.setBounds(0, 0, 2200, 3000);

    // Create borders
    for(let x=0; x<2200; x+=20) { 
        walls.create(x, 10, 'wall'); 
        walls.create(x, 2990, 'wall'); 
    }
    for(let y=0; y<3000; y+=20) { 
        walls.create(10, y, 'wall'); 
        walls.create(2190, y, 'wall'); 
    }

    // Create player
    players[myPlayerId] = scene.physics.add.sprite(100, 100, 'player_base');
    players[myPlayerId].setTint(myColor);
    players[myPlayerId].setBounce(0.2);
    scene.cameras.main.startFollow(players[myPlayerId]);
    scene.physics.add.collider(players[myPlayerId], walls);

    // Create granny
    aiGranny = scene.physics.add.sprite(1000, 1000, 'granny_sprite');
    aiGranny.setBounce(0.2);
    scene.physics.add.collider(aiGranny, walls);

    // Setup keyboard controls
    cursors = scene.input.keyboard.createCursorKeys();
    wasd = scene.input.keyboard.addKeys('W,A,S,D');

    // Touch/Mobile controls
    document.getElementById('btn-left').addEventListener('pointerdown', () => touchInput.left = true);
    document.getElementById('btn-left').addEventListener('pointerup', () => touchInput.left = false);
    document.getElementById('btn-right').addEventListener('pointerdown', () => touchInput.right = true);
    document.getElementById('btn-right').addEventListener('pointerup', () => touchInput.right = false);
    document.getElementById('btn-up').addEventListener('pointerdown', () => touchInput.up = true);
    document.getElementById('btn-up').addEventListener('pointerup', () => touchInput.up = false);
    document.getElementById('btn-down').addEventListener('pointerdown', () => touchInput.down = true);
    document.getElementById('btn-down').addEventListener('pointerup', () => touchInput.down = false);

    updateHUD();
}

function update() {
    if (!players[myPlayerId] || isPaused) return;

    let player = players[myPlayerId];
    let speed = 200;
    player.setVelocity(0, 0);

    // Keyboard controls
    if (cursors.left.isDown || wasd.W.isDown || touchInput.left) player.setVelocityX(-speed);
    if (cursors.right.isDown || wasd.D.isDown || touchInput.right) player.setVelocityX(speed);
    if (cursors.up.isDown || wasd.W.isDown || touchInput.up) player.setVelocityY(-speed);
    if (cursors.down.isDown || wasd.S.isDown || touchInput.down) player.setVelocityY(speed);

    // Granny AI
    if (aiGranny && !isGrannyStunned) {
        let dx = player.x - aiGranny.x;
        let dy = player.y - aiGranny.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 400) {
            let speed = 100;
            aiGranny.setVelocityX((dx/dist) * speed);
            aiGranny.setVelocityY((dy/dist) * speed);
            grannyState = 'chase';
        } else {
            grannyState = 'patrol';
            let target = patrolPoints[currentPatrolIndex];
            let dx = target.x - aiGranny.x;
            let dy = target.y - aiGranny.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 50) {
                currentPatrolIndex = (currentPatrolIndex + 1) % patrolPoints.length;
            } else {
                let speed = 80;
                aiGranny.setVelocityX((dx/dist) * speed);
                aiGranny.setVelocityY((dy/dist) * speed);
            }
        }
    } else if (isGrannyStunned) {
        aiGranny.setVelocity(0, 0);
    }

    // Send network position
    if (Math.random() > 0.95) sendNetPosition();
}
