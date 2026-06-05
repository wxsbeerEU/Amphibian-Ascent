// ==============================================================================
// CONFIGURATION & SETTINGS
// ==============================================================================
const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;
const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 900;
const OFFSET_X = 50;
const OFFSET_Y = 50;
const FPS = 60;

const WAVE_DURATION = 30;
const INTRO_DURATION = 120;
const ALGAE_VACUUM_SPEED = 12.0;
const ALGAE_NORMAL_SPEED = 6.0;

let KEYBINDS = {
    "UP": "KeyZ",
    "DOWN": "KeyS",
    "LEFT": "KeyQ",
    "RIGHT": "KeyD"
};

const COLOR_BG_OUTSIDE = "#050c12";
const COLOR_BG_WATER = "#142a35";
const COLOR_WHITE = "#f0f0f0";
const COLOR_BUTTON = "#1e2d3c";
const COLOR_BUTTON_HOVER = "#029b97";
const COLOR_ARCADE_GREEN = "#32ff64";
const COLOR_ARCADE_GOLD = "#ffd700";
const COLOR_ARCADE_YELLOW = "#fff000";
const COLOR_ARCADE_TEXT_MUTED = "#b4b8be";

// ==============================================================================
// ASSET LOADER (Images & Audio)
// ==============================================================================
const ASSETS = { images: {}, sounds: {} };
let SOUND_ENABLED = true;
let audioInitialized = false;

function loadImage(key, src) {
    let img = new Image();
    img.src = src;
    ASSETS.images[key] = img;
}

function loadSound(key, src, isMusic=false) {
    let aud = new Audio(src);
    aud.preload = "auto";
    if (isMusic) {
        aud.loop = true;
        aud.volume = 0.05;
    } else {
        aud.volume = 0.4;
    }
    ASSETS.sounds[key] = aud;
}

// Inladen van alle afbeeldingen
loadImage("map1", "map1.png");
loadImage("kikkerdril", "kikkerdril.png");
for(let i=1; i<=8; i++) loadImage(`kikkervisje${i}`, `kikkervisje${i}.png`);
for(let i=1; i<=5; i++) loadImage(`tong${i}`, `tong${i}.png`);
for(let i=1; i<=3; i++) loadImage(`kikker${i}`, `kikker${i}.png`);
loadImage("bacterierustig", "bacterierustig.png");
loadImage("bacterieboos", "bacterieboos.png");
loadImage("visrustig", "visrustig.png");
loadImage("visboos", "visboos.png");
loadImage("libellerustig", "libellerustig.png");
loadImage("libelleboos", "libelleboos.png");
loadImage("heks", "heks.png");
loadImage("achtergrond", "achtergrond.png");
loadImage("settings", "settings.png");
loadImage("howtoplay", "howtoplay.png");
loadImage("keybinds", "keybinds.png");
loadImage("gameover", "gameover.png");
loadImage("victory", "victory.png");
loadImage("shop_bg", "shop_bg.png");
loadImage("pauze_knop", "pauze_knop.png");
loadImage("hartje", "hartje.png");

// Inladen van audio
loadSound("music", "music.mp3", true);
loadSound("dash", "dash_muziek.mp3");
loadSound("kwak", "kwak_muziek.mp3");
loadSound("sword", "sword.mp3");
loadSound("gif", "gif_muziek.mp3");
loadSound("bubbel", "bubbel_muziek.mp3");

function playSfx(key, loop = false) {
    if(!SOUND_ENABLED || !ASSETS.sounds[key] || !audioInitialized) return;
    let s = ASSETS.sounds[key];
    s.loop = loop;
    s.currentTime = 0;
    s.play().catch(()=>{});
}

function stopSfx(key) {
    if(ASSETS.sounds[key]) {
        ASSETS.sounds[key].pause();
        ASSETS.sounds[key].currentTime = 0;
    }
}

// ==============================================================================
// SHOP ITEM POOL
// ==============================================================================
const SHOP_ITEMS = [
    // --- COMMON ---
    {"name": "Rusty Nail", "desc": "+5% Damage", "price": 10, "rarity": "Common", "stats": {"dmg": 0.05, "spd": 0, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Water Drop", "desc": "+5% Speed", "price": 10, "rarity": "Common", "stats": {"dmg": 0, "spd": 0.05, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Mosquito Eye", "desc": "+10 Magnet", "price": 12, "rarity": "Common", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0, "mag": 10}},
    {"name": "Duckweed", "desc": "+5% Attack Size", "price": 12, "rarity": "Common", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0.05, "mag": 0}},
    {"name": "Pebble", "desc": "+3% Dmg, +2% Spd", "price": 12, "rarity": "Common", "stats": {"dmg": 0.03, "spd": 0.02, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Mud", "desc": "+8% Dmg, -3% Spd", "price": 10, "rarity": "Common", "stats": {"dmg": 0.08, "spd": -0.03, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Light Breeze", "desc": "+8% Spd, -3% Dmg", "price": 10, "rarity": "Common", "stats": {"dmg": -0.03, "spd": 0.08, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Chickpea", "desc": "+1 Max HP", "price": 15, "rarity": "Common", "stats": {"dmg": 0, "spd": 0, "hp": 1, "size": 0, "mag": 0}},
    {"name": "Old Coin", "desc": "+15 Magnet", "price": 14, "rarity": "Common", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0, "mag": 15}},
    {"name": "Small Carrot", "desc": "+5% Dmg, +5 Mag", "price": 13, "rarity": "Common", "stats": {"dmg": 0.05, "spd": 0, "hp": 0, "size": 0, "mag": 5}},
    {"name": "Fly Wing", "desc": "+6% Speed", "price": 11, "rarity": "Common", "stats": {"dmg": 0, "spd": 0.06, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Grain of Sand", "desc": "+4% Damage", "price": 9, "rarity": "Common", "stats": {"dmg": 0.04, "spd": 0, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Dew", "desc": "+4% Attack Size, +2% Speed", "price": 13, "rarity": "Common", "stats": {"dmg": 0, "spd": 0.02, "hp": 0, "size": 0.04, "mag": 0}},
    {"name": "Twig", "desc": "+7% Damage", "price": 12, "rarity": "Common", "stats": {"dmg": 0.07, "spd": 0, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Foam", "desc": "+6% Attack Size", "price": 13, "rarity": "Common", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0.06, "mag": 0}},
    {"name": "Small Magnet", "desc": "+20 Magnet", "price": 15, "rarity": "Common", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0, "mag": 20}},
    {"name": "Earthworm", "desc": "+1 Max HP, -2% Speed", "price": 14, "rarity": "Common", "stats": {"dmg": 0, "spd": -0.02, "hp": 1, "size": 0, "mag": 0}},
    {"name": "Fishbone", "desc": "+5% Damage, +2% Attack Size", "price": 14, "rarity": "Common", "stats": {"dmg": 0.05, "spd": 0, "hp": 0, "size": 0.02, "mag": 0}},
    {"name": "Fluff", "desc": "+5% Speed, +5 Magnet", "price": 12, "rarity": "Common", "stats": {"dmg": 0, "spd": 0.05, "hp": 0, "size": 0, "mag": 5}},
    {"name": "Mussel", "desc": "+1 Max HP, -5% Damage", "price": 13, "rarity": "Common", "stats": {"dmg": -0.05, "spd": 0, "hp": 1, "size": 0, "mag": 0}},

    // --- RARE ---
    {"name": "Sharp Tooth", "desc": "+15% Damage", "price": 25, "rarity": "Rare", "stats": {"dmg": 0.15, "spd": 0, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Dragonfly Wing", "desc": "+15% Speed", "price": 25, "rarity": "Rare", "stats": {"dmg": 0, "spd": 0.15, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Water Lily", "desc": "+15% Attack Size", "price": 26, "rarity": "Rare", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0.15, "mag": 0}},
    {"name": "Lodestone", "desc": "+40 Magnet", "price": 24, "rarity": "Rare", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0, "mag": 40}},
    {"name": "Fat Worm", "desc": "+2 Max HP", "price": 30, "rarity": "Rare", "stats": {"dmg": 0, "spd": 0, "hp": 2, "size": 0, "mag": 0}},
    {"name": "Swamp Water", "desc": "+20% Damage, -5% Speed", "price": 22, "rarity": "Rare", "stats": {"dmg": 0.20, "spd": -0.05, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Frog Juice", "desc": "+12% Speed, +10% Attack Size", "price": 28, "rarity": "Rare", "stats": {"dmg": 0, "spd": 0.12, "hp": 0, "size": 0.10, "mag": 0}},
    {"name": "Copper Coin", "desc": "+10% Damage, +25 Magnet", "price": 27, "rarity": "Rare", "stats": {"dmg": 0.10, "spd": 0, "hp": 0, "size": 0, "mag": 25}},
    {"name": "Grasshopper", "desc": "+10% Damage, +10% Speed", "price": 28, "rarity": "Rare", "stats": {"dmg": 0.10, "spd": 0.10, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Big Bubble", "desc": "+20% Attack Size, -5% Damage", "price": 24, "rarity": "Rare", "stats": {"dmg": -0.05, "spd": 0, "hp": 0, "size": 0.20, "mag": 0}},
    {"name": "Turtle Shell", "desc": "+2 Max HP, -8% Speed", "price": 26, "rarity": "Rare", "stats": {"dmg": 0, "spd": -0.08, "hp": 2, "size": 0, "mag": 0}},
    {"name": "Golden Eye", "desc": "+50 Magnet", "price": 25, "rarity": "Rare", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0, "mag": 50}},
    {"name": "Poison Gland", "desc": "+25% Damage, -1 Max HP", "price": 22, "rarity": "Rare", "stats": {"dmg": 0.25, "spd": 0, "hp": -1, "size": 0, "mag": 0}},
    {"name": "Flipper", "desc": "+18% Speed", "price": 27, "rarity": "Rare", "stats": {"dmg": 0, "spd": 0.18, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Small Frog", "desc": "+1 Max HP, +8% Damage", "price": 29, "rarity": "Rare", "stats": {"dmg": 0.08, "spd": 0, "hp": 1, "size": 0, "mag": 0}},

    // --- EPIC ---
    {"name": "Witch Eye", "desc": "+40% Damage", "price": 45, "rarity": "Epic", "stats": {"dmg": 0.40, "spd": 0, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Aerodynamics", "desc": "+35% Speed", "price": 45, "rarity": "Epic", "stats": {"dmg": 0, "spd": 0.35, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Golden Beetle", "desc": "+25% Damage, +2 Max HP", "price": 50, "rarity": "Epic", "stats": {"dmg": 0.25, "spd": 0, "hp": 2, "size": 0, "mag": 0}},
    {"name": "Super Magnet", "desc": "+100 Magnet", "price": 40, "rarity": "Epic", "stats": {"dmg": 0, "spd": 0, "hp": 0, "size": 0, "mag": 100}},
    {"name": "Radioactive Slime", "desc": "+50% Attack Size, -10% Speed", "price": 42, "rarity": "Epic", "stats": {"dmg": 0, "spd": -0.10, "hp": 0, "size": 0.50, "mag": 0}},
    {"name": "Leech", "desc": "+3 Max HP", "price": 48, "rarity": "Epic", "stats": {"dmg": 0, "spd": 0, "hp": 3, "size": 0, "mag": 0}},
    {"name": "Muscular Leg", "desc": "+30% Speed, +20% Damage", "price": 50, "rarity": "Epic", "stats": {"dmg": 0.20, "spd": 0.30, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Dark Lotus", "desc": "+30% Attack Size, +15% Damage", "price": 47, "rarity": "Epic", "stats": {"dmg": 0.15, "spd": 0, "hp": 0, "size": 0.30, "mag": 0}},
    {"name": "Parasite", "desc": "+45% Damage, -2 Max HP", "price": 38, "rarity": "Epic", "stats": {"dmg": 0.45, "spd": 0, "hp": -2, "size": 0, "mag": 0}},
    {"name": "Black Pearl", "desc": "+60 Magnet, +20% Speed", "price": 46, "rarity": "Epic", "stats": {"dmg": 0, "spd": 0.20, "hp": 0, "size": 0, "mag": 60}},

    // --- LEGENDARY ---
    {"name": "Pond Crown", "desc": "+50% Damage, +30% Speed, +2 Max HP", "price": 80, "rarity": "Legendary", "stats": {"dmg": 0.50, "spd": 0.30, "hp": 2, "size": 0, "mag": 0}},
    {"name": "Dragon Heart", "desc": "+100% Damage, -10% Speed", "price": 75, "rarity": "Legendary", "stats": {"dmg": 1.00, "spd": -0.10, "hp": 0, "size": 0, "mag": 0}},
    {"name": "Divine Lily", "desc": "+100% Attack Size, +5 Max HP", "price": 85, "rarity": "Legendary", "stats": {"dmg": 0, "spd": 0, "hp": 5, "size": 1.00, "mag": 0}},
    {"name": "Stardust", "desc": "+70% Speed, +200 Magnet", "price": 75, "rarity": "Legendary", "stats": {"dmg": 0, "spd": 0.70, "hp": 0, "size": 0, "mag": 200}},
    {"name": "All-Seeing Eye", "desc": "+60% Damage, +60% Attack Size, +60 Magnet", "price": 90, "rarity": "Legendary", "stats": {"dmg": 0.60, "spd": 0, "hp": 0, "size": 0.60, "mag": 60}}
];

// ==============================================================================
// UI COMPONENTS
// ==============================================================================
function getFont(size) { return `bold ${size}px 'Courier New'`; }

function drawSpriteOrFallback(ctx, imgKey, x, y, w, h, angle, fallback) {
    let img = ASSETS.images[imgKey];
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(img, -w/2, -h/2, w, h);
        ctx.restore();
    } else {
        fallback(ctx, x, y, w, h, angle);
    }
}

class Button {
    constructor(x, y, w, h, text, callback, imgKey=null, colorOverride=null) {
        this.rect = { x: x - w/2, y: y - h/2, w: w, h: h };
        this.shadow_rect = { x: this.rect.x + 4, y: this.rect.y + 4, w: w, h: h };
        this.text = text; this.callback = callback; this.imgKey = imgKey;
        this.base_color = colorOverride || COLOR_BUTTON;
        this.isHovered = false; this.isSelected = false; this.disabled = false;
    }
    draw(ctx) {
        let img = ASSETS.images[this.imgKey];
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if ((this.isHovered || this.isSelected) && !this.disabled) ctx.globalAlpha = 0.7;
            ctx.drawImage(img, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
            ctx.restore();
        } else {
            if (!this.disabled) {
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(this.shadow_rect.x, this.shadow_rect.y, this.shadow_rect.w, this.shadow_rect.h);
            }
            ctx.fillStyle = this.disabled ? "#505050" : ((this.isHovered || this.isSelected) ? COLOR_BUTTON_HOVER : this.base_color);
            ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
            ctx.strokeStyle = COLOR_WHITE; ctx.lineWidth = 3;
            ctx.strokeRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
            
            ctx.fillStyle = this.disabled ? "#969696" : COLOR_WHITE;
            ctx.font = getFont(18); ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(this.text, this.rect.x + this.rect.w/2, this.rect.y + this.rect.h/2);
        }
    }
}

class ColorButton {
    constructor(x, y, radius, color, callback) {
        this.rect = { x: x - radius, y: y - radius, w: radius*2, h: radius*2 };
        this.color = color; this.callback = callback; this.radius = radius;
        this.isHovered = false; this.isSelected = false; this.disabled = false;
    }
    draw(ctx, isActive) {
        let cx = this.rect.x + this.radius, cy = this.rect.y + this.radius;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.beginPath(); ctx.arc(cx + 2, cy + 2, this.radius, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(cx, cy, this.radius, 0, Math.PI * 2); ctx.fill();
        
        if (isActive) {
            ctx.strokeStyle = COLOR_WHITE; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(cx, cy, this.radius + 3, 0, Math.PI * 2); ctx.stroke();
        } else if (this.isHovered || this.isSelected) {
            ctx.strokeStyle = "#969696"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, this.radius + 2, 0, Math.PI * 2); ctx.stroke();
        }
    }
}

class ItemCard {
    constructor(x, y, w, h, item, callback) {
        this.rect = { x: x - w/2, y: y - h/2, w: w, h: h };
        this.item = item; this.callback = callback;
        this.isHovered = false; this.disabled = false;
        
        if (item.rarity === "Common") this.rc = "#b4b8be";
        else if (item.rarity === "Rare") this.rc = "#00c8ff";
        else if (item.rarity === "Epic") this.rc = "#ff32ff";
        else if (item.rarity === "Legendary") this.rc = "#ffd700";
        else this.rc = "#ffffff";
    }
    draw(ctx) {
        if (this.disabled) {
            ctx.fillStyle = "rgba(25,25,25,0.6)"; ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
            ctx.strokeStyle = "#505050"; ctx.lineWidth = 2; ctx.strokeRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
            ctx.fillStyle = "#646464"; ctx.font = getFont(16); ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("SOLD OUT", this.rect.x + this.rect.w/2, this.rect.y + this.rect.h/2);
            return;
        }

        ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(this.rect.x + 6, this.rect.y + 6, this.rect.w, this.rect.h);
        ctx.fillStyle = this.isHovered ? "rgba(35,50,60,0.9)" : "rgba(15,20,25,0.7)"; ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        
        ctx.strokeStyle = this.isHovered ? COLOR_WHITE : this.rc; ctx.lineWidth = this.isHovered ? 4 : 2;
        ctx.strokeRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

        let cx = this.rect.x + this.rect.w/2; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = COLOR_WHITE; ctx.font = getFont(16); ctx.fillText(this.item.name.toUpperCase(), cx, this.rect.y + 18);
        ctx.fillStyle = this.rc; ctx.font = getFont(10); ctx.fillText(this.item.rarity.toUpperCase(), cx, this.rect.y + 36);
        ctx.fillStyle = "#acc8d2"; ctx.font = getFont(13); ctx.fillText(this.item.desc, cx, this.rect.y + 58);
        ctx.fillStyle = "#32ff64"; ctx.font = getFont(15); ctx.fillText(`BUY: ${this.item.price} ALGAE`, cx, this.rect.y + 84);
    }
}

// ==============================================================================
// ENGINE SYSTEMS (CAMERA & PARTICLES)
// ==============================================================================
class Camera {
    constructor(w, h) { this.x = 0; this.y = 0; this.width = w; this.height = h; this.shakeAmount = 0; }
    shake(intensity) { this.shakeAmount = intensity; }
    update(targetX, targetY) {
        this.x = targetX - this.width / 2;
        this.y = targetY - this.height / 2;
        this.x = Math.max(0, Math.min(this.x, WORLD_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, WORLD_HEIGHT - this.height));
        
        if (this.shakeAmount > 0) {
            this.x += (Math.random() - 0.5) * this.shakeAmount * 2;
            this.y += (Math.random() - 0.5) * this.shakeAmount * 2;
            this.shakeAmount *= 0.9;
            if (this.shakeAmount < 0.5) this.shakeAmount = 0;
        }
    }
    apply(x, y) { return { x: x - this.x, y: y - this.y }; }
}

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.radius = Math.random() * 4 + 3;
        let angle = Math.random() * Math.PI * 2, speed = Math.random() * 5 + 3;
        this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
        this.alpha = 1.0; this.fadeSpeed = Math.random() * 0.02 + 0.01;
    }
    update() { this.vx *= 0.94; this.vy *= 0.94; this.x += this.vx; this.y += this.vy; this.alpha -= this.fadeSpeed; }
    draw(ctx, camera) {
        if (this.alpha <= 0) return;
        let sc = camera.apply(this.x, this.y);
        ctx.save(); ctx.globalAlpha = Math.max(0, this.alpha); ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(sc.x, sc.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
}

// ==============================================================================
// ENTITIES
// ==============================================================================
class AlgaeDrop {
    constructor(x, y, value=1) {
        this.x = x; this.y = y; this.value = value; this.radius = 6; this.isVacuumed = false;
        let angle = Math.random() * Math.PI * 2, speed = Math.random() * 3 + 3;
        this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
        this.delayTimer = 15;
    }
    updateMagnetism(playerCx, playerCy, magnetRadius) {
        if (this.delayTimer > 0 && !this.isVacuumed) { this.delayTimer--; this.x += this.vx; this.y += this.vy; this.vx *= 0.88; this.vy *= 0.88; return; }
        let cx = this.x + this.radius, cy = this.y + this.radius, dist = Math.hypot(playerCx - cx, playerCy - cy);
        if (this.isVacuumed || dist < magnetRadius) {
            let baseSpeed = this.isVacuumed ? ALGAE_VACUUM_SPEED : ALGAE_NORMAL_SPEED;
            let speed = dist < 100 ? Math.max(baseSpeed, baseSpeed + (100 - dist) * 0.3) : baseSpeed;
            if (dist > 0) { this.x += ((playerCx - cx) / dist) * speed; this.y += ((playerCy - cy) / dist) * speed; }
        }
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x + this.radius, this.y + this.radius);
        ctx.fillStyle = "#32dc64"; ctx.beginPath(); ctx.arc(sc.x, sc.y, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#c8ffc8"; ctx.lineWidth = 1; ctx.stroke();
    }
}

class Enemy {
    constructor(x, y, radius, color, hp, speed, isBoss = false) {
        this.x = x; this.y = y; this.radius = radius; this.visualRadius = radius;
        this.color = color; this.hp = hp; this.maxHp = hp; this.speed = speed;
        this.flashTimer = 0; this.hpBarTimer = 0; this.kbX = 0; this.kbY = 0; this.isBoss = isBoss;
    }
    hit(damage, kbx = 0, kby = 0) {
        this.hp -= damage; this.flashTimer = 4; this.hpBarTimer = 120;
        if (!this.isBoss) { this.kbX += kbx; this.kbY += kby; }
    }
    applyKnockback() { this.x += this.kbX; this.y += this.kbY; this.kbX *= 0.82; this.kbY *= 0.82; }
    updateBehavior(playerCx, playerCy) {}
    update() {
        if (this.hpBarTimer > 0) this.hpBarTimer--;
        this.x = Math.max(OFFSET_X, Math.min(this.x, WORLD_WIDTH - (this.radius * 2) - OFFSET_X));
        this.y = Math.max(OFFSET_Y, Math.min(this.y, WORLD_HEIGHT - (this.radius * 2) - OFFSET_Y));
    }
    drawHpBar(ctx, camera, cx, cy) {
        if (this.hp < this.maxHp && (this.hpBarTimer > 0 || this.isBoss)) {
            let barW = this.radius * 2, barH = 5, barX = cx - barW / 2, barY = cy - this.radius - 10;
            ctx.fillStyle = "#501414"; ctx.fillRect(barX, barY, barW, barH);
            let ratio = Math.max(0, this.hp / this.maxHp);
            ctx.fillStyle = "#e63232"; ctx.fillRect(barX, barY, barW * ratio, barH);
            ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, barW, barH);
        }
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x + this.radius, this.y + this.radius);
        let isFlashing = this.flashTimer > 0; if (isFlashing) this.flashTimer--;
        
        ctx.fillStyle = isFlashing ? "#ffffff" : this.color;
        ctx.beginPath(); ctx.arc(sc.x, sc.y, this.visualRadius, 0, Math.PI * 2); ctx.fill();
        this.drawHpBar(ctx, camera, sc.x, sc.y);
    }
}

class BacteriaEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 10, "#8c3caa", 5, 1.8);
        this.angle = Math.random() * Math.PI * 2; this.tumbleTimer = 0; this.isAngry = false; this.phaseOffset = Math.random() * Math.PI * 2;
    }
    updateBehavior(playerCx, playerCy) {
        this.applyKnockback(); this.tumbleTimer++;
        let cx = this.x + this.radius, cy = this.y + this.radius, dx = playerCx - cx, dy = playerCy - cy;
        if (this.tumbleTimer > Math.random() * 30 + 30) { this.angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.6; this.tumbleTimer = 0; }
        let time = Date.now() * 0.008 + this.phaseOffset, pulse = (Math.sin(time) + 1.0) / 2.0;
        let currentSpeed = this.speed * (0.5 + pulse * 1.5); this.isAngry = pulse > 0.5;
        this.x += Math.cos(this.angle) * currentSpeed; this.y += Math.sin(this.angle) * currentSpeed;
        this.visualRadius = this.radius + Math.sin(time * 2) * 2;
        this.update();
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x + this.radius, this.y + this.radius);
        let imgKey = this.isAngry ? "bacterieboos" : "bacterierustig";
        let isFlashing = this.flashTimer > 0; if (isFlashing) { ctx.save(); ctx.filter = "brightness(200%)"; this.flashTimer--; }
        drawSpriteOrFallback(ctx, imgKey, sc.x, sc.y, this.visualRadius * 2.8, this.visualRadius * 2.8, this.angle, (c, x, y, w, h, a) => {
            c.fillStyle = isFlashing ? "#ffffff" : this.color; c.beginPath(); c.arc(x, y, this.visualRadius, 0, Math.PI * 2); c.fill();
        });
        if (isFlashing) ctx.restore();
        this.drawHpBar(ctx, camera, sc.x, sc.y);
    }
}

class WaterBeetleEnemy extends Enemy {
    constructor(x, y) { super(x, y, 11, "#a06428", 12, 9.0); this.state = "GLIDE"; this.timer = Math.random() * 30; this.vx = 0.0; this.vy = 0.0; }
    updateBehavior(playerCx, playerCy) {
        this.applyKnockback(); this.timer--;
        if (this.state === "GLIDE") {
            this.vx *= 0.90; this.vy *= 0.90;
            if (this.timer <= 0) {
                this.state = "DART"; this.timer = 12;
                let dx = playerCx - (this.x + this.radius), dy = playerCy - (this.y + this.radius), dist = Math.hypot(dx, dy);
                if (dist > 0) { this.vx = (dx / dist) * this.speed; this.vy = (dy / dist) * this.speed; }
            }
        } else if (this.state === "DART") { if (this.timer <= 0) { this.state = "GLIDE"; this.timer = Math.random() * 25 + 25; } }
        this.x += this.vx; this.y += this.vy; this.update();
    }
}

class FishEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 12, "#f2795c", 15, 2.0);
        this.state = "CIRCLE"; this.orbitDist = Math.random() * 100 + 150; this.orbitAngle = Math.random() * Math.PI * 2; this.orbitDir = Math.random() > 0.5 ? 1 : -1;
        this.timer = Math.random() * 90 + 90; this.vx = 0.0; this.vy = 0.0; this.facingAngle = 0.0;
    }
    updateBehavior(playerCx, playerCy) {
        this.applyKnockback();
        if (this.state === "CIRCLE") {
            this.orbitAngle += this.orbitDir * (this.speed / this.orbitDist);
            let targetX = playerCx + Math.cos(this.orbitAngle) * this.orbitDist, targetY = playerCy + Math.sin(this.orbitAngle) * this.orbitDist;
            let dx = targetX - this.x, dy = targetY - this.y, dist = Math.hypot(dx, dy);
            
            if (dist > 0) { this.vx += ((dx / dist) * this.speed - this.vx) * 0.08; this.vy += ((dy / dist) * this.speed - this.vy) * 0.08; }
            if (Math.hypot(this.vx, this.vy) > 0.5) {
                let tA = Math.atan2(this.vy, this.vx), diff = (tA - this.facingAngle + Math.PI) % (Math.PI * 2) - Math.PI; this.facingAngle += diff * 0.15;
            }
            this.x += this.vx; this.y += this.vy; this.timer--;
            
            if (this.timer <= 0) {
                this.state = "STRIKE"; this.timer = 25;
                let pdx = playerCx - this.x, pdy = playerCy - this.y, pdist = Math.hypot(pdx, pdy);
                if (pdist > 0) { this.vx = (pdx / pdist) * (this.speed * 3.2); this.vy = (pdy / pdist) * (this.speed * 3.2); this.facingAngle = Math.atan2(this.vy, this.vx); }
            }
        } else if (this.state === "STRIKE") {
            this.x += this.vx; this.y += this.vy; this.timer--;
            if (this.timer <= 0) { this.state = "RECOVER"; this.timer = 50; }
        } else if (this.state === "RECOVER") {
            this.vx *= 0.90; this.vy *= 0.90; this.x += this.vx; this.y += this.vy; this.timer--;
            if (this.timer <= 0) { this.state = "CIRCLE"; this.timer = Math.random() * 90 + 90; this.orbitDist = Math.random() * 100 + 150; this.orbitDir = Math.random() > 0.5 ? 1 : -1; }
        }
        this.update();
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x + this.radius, this.y + this.radius);
        let imgKey = this.state === "STRIKE" ? "visboos" : "visrustig";
        let isFlashing = this.flashTimer > 0; if (isFlashing) { ctx.save(); ctx.filter = "brightness(200%)"; this.flashTimer--; }
        
        drawSpriteOrFallback(ctx, imgKey, sc.x, sc.y, 36, 36, this.facingAngle, (c, x, y, w, h, a) => {
            c.fillStyle = isFlashing ? "#ffffff" : this.color; let tailL = 14;
            let p1 = [x - Math.cos(a)*this.radius, y - Math.sin(a)*this.radius];
            let p2 = [x - Math.cos(a)*this.radius - Math.cos(a - 0.6)*tailL, y - Math.sin(a)*this.radius - Math.sin(a - 0.6)*tailL];
            let p3 = [x - Math.cos(a)*this.radius - Math.cos(a + 0.6)*tailL, y - Math.sin(a)*this.radius - Math.sin(a + 0.6)*tailL];
            c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.lineTo(p3[0], p3[1]); c.fill();
            c.beginPath(); c.arc(x, y, this.visualRadius, 0, Math.PI * 2); c.fill();
        });
        
        if (isFlashing) ctx.restore();
        this.drawHpBar(ctx, camera, sc.x, sc.y);
    }
}

class DragonflyEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 10, "#afe4bd", 22, 2.5);
        this.state = "STRAFE"; this.timer = Math.random() * 40 + 40; this.orbitAngle = Math.random() * Math.PI * 2;
        this.facingAngle = 0.0; this.dashVx = 0.0; this.dashVy = 0.0;
    }
    updateBehavior(playerCx, playerCy) {
        this.applyKnockback();
        let dx = playerCx - this.x, dy = playerCy - this.y, dist = Math.hypot(dx, dy);
        
        if (this.state === "STRAFE") {
            this.orbitAngle += 0.05;
            let targetX = playerCx + Math.cos(this.orbitAngle) * 200, targetY = playerCy + Math.sin(this.orbitAngle) * 200;
            let moveX = targetX - this.x, moveY = targetY - this.y, moveDist = Math.hypot(moveX, moveY);
            if (moveDist > 0) { this.x += (moveX / moveDist) * this.speed; this.y += (moveY / moveDist) * this.speed; }
            this.facingAngle = Math.atan2(dy, dx); this.timer--;
            if (this.timer <= 0) { this.state = "ANTICIPATE"; this.timer = 30; }
        } else if (this.state === "ANTICIPATE") {
            this.x += (Math.random() - 0.5) * 4; this.y += (Math.random() - 0.5) * 4; this.facingAngle = Math.atan2(dy, dx); this.timer--;
            if (this.timer <= 0) { this.state = "DASH"; this.timer = 20; if (dist > 0) { this.dashVx = (dx / dist) * (this.speed * 4.0); this.dashVy = (dy / dist) * (this.speed * 4.0); } }
        } else if (this.state === "DASH") {
            this.x += this.dashVx; this.y += this.dashVy; this.timer--;
            if (this.timer <= 0) { this.state = "RECOVER"; this.timer = 25; }
        } else if (this.state === "RECOVER") {
            this.dashVx *= 0.85; this.dashVy *= 0.85; this.x += this.dashVx; this.y += this.dashVy; this.timer--;
            if (this.timer <= 0) { this.state = "STRAFE"; this.timer = Math.random() * 40 + 40; this.orbitAngle = Math.atan2(this.y - playerCy, this.x - playerCx); }
        }
        this.update();
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x + this.radius, this.y + this.radius);
        let imgKey = ["ANTICIPATE", "DASH"].includes(this.state) ? "libelleboos" : "libellerustig";
        let isFlashing = this.flashTimer > 0; if (isFlashing) { ctx.save(); ctx.filter = "brightness(200%)"; this.flashTimer--; }
        
        drawSpriteOrFallback(ctx, imgKey, sc.x, sc.y, 32, 32, this.facingAngle, (c, x, y, w, h, a) => {
            c.strokeStyle = isFlashing ? "#ffffff" : this.color; c.lineWidth = 2; let flap = Math.sin(Date.now() * 0.05) * 0.5;
            c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a + 1.0 + flap) * 16, y + Math.sin(a + 1.0 + flap) * 16); c.stroke();
            c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a - 1.0 - flap) * 16, y + Math.sin(a - 1.0 - flap) * 16); c.stroke();
            c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a + 2.0 + flap) * 12, y + Math.sin(a + 2.0 + flap) * 12); c.stroke();
            c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a - 2.0 - flap) * 12, y + Math.sin(a - 2.0 - flap) * 12); c.stroke();
            c.fillStyle = isFlashing ? "#ffffff" : this.color; c.beginPath(); c.arc(x, y, this.visualRadius - 2, 0, Math.PI * 2); c.fill();
            c.beginPath(); c.moveTo(x, y); c.lineTo(x - Math.cos(a) * 14, y - Math.sin(a) * 14); c.stroke();
        });
        
        if (isFlashing) ctx.restore();
        this.drawHpBar(ctx, camera, sc.x, sc.y);
    }
}

class PikeEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 20, "#285a3c", 48, 2.0);
        this.angle = Math.random() * Math.PI * 2; this.state = "SWIM"; this.timer = 0; this.lunge_vx = 0.0; this.lunge_vy = 0.0;
    }
    updateBehavior(playerCx, playerCy) {
        this.applyKnockback();
        let dx = playerCx - (this.x + this.radius), dy = playerCy - (this.y + this.radius), dist = Math.hypot(dx, dy);

        if (this.state === "SWIM") {
            let diff = (Math.atan2(dy, dx) - this.angle + Math.PI) % (Math.PI * 2) - Math.PI; this.angle += diff * 0.05;
            this.x += Math.cos(this.angle) * this.speed; this.y += Math.sin(this.angle) * this.speed;
            if (dist < 280) { this.state = "AMBUSH_WAIT"; this.timer = 35; }
        } else if (this.state === "AMBUSH_WAIT") {
            let diff = (Math.atan2(dy, dx) - this.angle + Math.PI) % (Math.PI * 2) - Math.PI; this.angle += diff * 0.15;
            this.timer--;
            if (this.timer <= 0) { this.state = "STRIKE"; this.timer = 15; this.lunge_vx = Math.cos(this.angle) * 18.0; this.lunge_vy = Math.sin(this.angle) * 18.0; }
        } else if (this.state === "STRIKE") {
            this.x += this.lunge_vx; this.y += this.lunge_vy; this.timer--;
            if (this.timer <= 0) { this.state = "RECOVERY"; this.timer = 45; }
        } else if (this.state === "RECOVERY") {
            this.lunge_vx *= 0.85; this.lunge_vy *= 0.85; this.x += this.lunge_vx; this.y += this.lunge_vy; this.timer--;
            if (this.timer <= 0) this.state = "SWIM";
        }
        this.update();
    }
}

class BossProjectile extends Enemy {
    constructor(x, y, vx, vy, color, radius=8, lifetime=150) {
        super(x, y, radius, color, 1, Math.hypot(vx, vy));
        this.vx = vx; this.vy = vy; this.lifetime = lifetime;
    }
    updateBehavior(playerCx, playerCy) {
        this.x += this.vx; this.y += this.vy; this.lifetime--;
        if (this.lifetime <= 0 || this.x <= OFFSET_X || this.x >= WORLD_WIDTH - OFFSET_X || this.y <= OFFSET_Y || this.y >= WORLD_HEIGHT - OFFSET_Y) { this.hp = 0; }
        this.update();
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x + this.radius, this.y + this.radius);
        ctx.fillStyle = this.color; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.arc(sc.x, sc.y, this.radius + 6, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0; ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(sc.x, sc.y, this.radius * 0.6, 0, Math.PI * 2); ctx.fill();
    }
}

class WitchBoss extends Enemy {
    constructor(x, y) {
        super(x, y, 35, "#7828a0", 250, 2.0, true);
        this.state = "WANDER"; this.timer = 90; this.facingAngle = 0.0; this.vx = 0.0; this.vy = 0.0; this.attackStep = 0;
        this.hoverAngle = Math.random() * Math.PI * 2; this.spiralAngle = 0.0;
    }
    updateBehavior(playerCx, playerCy) {} // Override in loop
    updateBoss(playerCx, playerCy, projectileQueue) {
        this.applyKnockback();
        let dx = playerCx - (this.x + this.radius), dy = playerCy - (this.y + this.radius);
        let targetAngle = Math.atan2(dy, dx), angleDiff = (targetAngle - this.facingAngle + Math.PI) % (Math.PI * 2) - Math.PI;
        this.facingAngle += angleDiff * 0.15;

        if (this.state === "WANDER") {
            this.hoverAngle += 0.02;
            let idealX = playerCx + Math.cos(this.hoverAngle) * 300, idealY = playerCy + Math.sin(this.hoverAngle * 1.5) * 200;
            this.vx += (idealX - (this.x + this.radius)) * 0.005; this.vy += (idealY - (this.y + this.radius)) * 0.005;
            this.vx *= 0.92; this.vy *= 0.92; this.timer--;
            if (this.timer <= 0) { this.state = Math.random() < 0.5 ? "SPREAD_SHOT" : "SPIRAL"; this.timer = 0; this.attackStep = 0; }
        } else if (this.state === "SPREAD_SHOT") {
            this.vx *= 0.85; this.vy *= 0.85; this.timer++;
            if (this.timer % 30 === 0 && this.attackStep < 3) {
                playSfx("bubbel");
                for (let offset of [-0.3, 0.0, 0.3]) {
                    let pVx = Math.cos(targetAngle + offset) * 5.0, pVy = Math.sin(targetAngle + offset) * 5.0;
                    projectileQueue.push(new BossProjectile(this.x + this.radius, this.y + this.radius, pVx, pVy, "#00ffff"));
                }
                this.attackStep++; this.vx -= Math.cos(targetAngle) * 3.0; this.vy -= Math.sin(targetAngle) * 3.0;
            }
            if (this.timer > 120) { this.state = "WANDER"; this.timer = Math.random() * 30 + 50; }
        } else if (this.state === "SPIRAL") {
            let cx = WORLD_WIDTH / 2, cy = WORLD_HEIGHT / 2;
            this.vx += (cx - (this.x + this.radius)) * 0.001; this.vy += (cy - (this.y + this.radius)) * 0.001;
            this.vx *= 0.80; this.vy *= 0.80; this.timer++;
            if (this.timer % 6 === 0) {
                this.spiralAngle += 0.38;
                let pVx = Math.cos(this.spiralAngle) * 3.5, pVy = Math.sin(this.spiralAngle) * 3.5;
                projectileQueue.push(new BossProjectile(this.x + this.radius, this.y + this.radius, pVx, pVy, "#ff32c8"));
            }
            if (this.timer > 120) { this.state = "WANDER"; this.timer = Math.random() * 30 + 60; }
        }
        this.x += this.vx; this.y += this.vy; this.update();
    }
    drawHpBar(ctx, camera, cx, cy) {
        let barW = 600, barH = 28, barX = (GAME_WIDTH - barW) / 2, barY = GAME_HEIGHT - 45;
        ctx.fillStyle = "#b432ff"; ctx.font = getFont(20); ctx.textAlign = "center"; ctx.fillText("THE WITCH", GAME_WIDTH / 2, barY - 10);
        ctx.fillStyle = "#0f0a14"; ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = "#b496c8"; ctx.lineWidth = 4; ctx.strokeRect(barX - 4, barY - 4, barW + 8, barH + 8);
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);
        
        let ratio = Math.max(0, this.hp / this.maxHp);
        let fillW = barW * ratio;
        if (fillW > 0) {
            ctx.fillStyle = "#b41428"; ctx.fillRect(barX, barY, fillW, barH);
            ctx.fillStyle = "#ff3c50"; ctx.fillRect(barX, barY, fillW, barH / 3);
            ctx.fillStyle = "#780a14"; ctx.fillRect(barX, barY + barH - (barH / 3), fillW, barH / 3);
        }
        
        ctx.strokeStyle = "#000"; ctx.lineWidth = 2;
        for (let segX = barX; segX < barX + barW; segX += barW / 20) {
            ctx.beginPath(); ctx.moveTo(segX, barY); ctx.lineTo(segX, barY + barH); ctx.stroke();
        }
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x + this.radius, this.y + this.radius);
        let isFlashing = this.flashTimer > 0; if (isFlashing) this.flashTimer--;

        if (this.state === "SPIRAL") {
            ctx.strokeStyle = "#c832ff"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(sc.x, sc.y, this.radius + 6, 0, Math.PI * 2); ctx.stroke();
        }

        if (isFlashing) { ctx.save(); ctx.filter = "brightness(200%)"; }
        drawSpriteOrFallback(ctx, "heks", sc.x, sc.y, this.radius * 2 + 10, this.radius * 2 + 10, this.facingAngle, (c, x, y, w, h, a) => {
            c.fillStyle = this.color; c.beginPath(); c.arc(x, y, this.radius, 0, Math.PI * 2); c.fill();
            c.fillStyle = "#ffffff"; c.beginPath(); c.arc(x + Math.cos(a) * this.radius, y + Math.sin(a) * this.radius, 5, 0, Math.PI * 2); c.fill();
        });
        if (isFlashing) ctx.restore();
        this.drawHpBar(ctx, camera, sc.x, sc.y);
    }
}

class EnemySpawner {
    constructor(x, y, enemyClass, wave) {
        this.x = x; this.y = y; this.enemyClass = enemyClass; this.wave = wave; this.timer = 60; this.particles = [];
        if (enemyClass.name === "FishEnemy") this.spawnColor = "#f2795c";
        else if (enemyClass.name === "DragonflyEnemy") this.spawnColor = "#afe4bd";
        else this.spawnColor = "#b432ff";
    }
    update() {
        this.timer--;
        if (this.timer % 5 === 0) this.particles.push(new Particle(this.x + (Math.random() - 0.5) * 30, this.y + (Math.random() - 0.5) * 30, this.spawnColor));
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.alpha > 0);

        if (this.timer <= 0) {
            let enemy = new this.enemyClass(this.x, this.y);
            enemy.maxHp *= (1.0 + this.wave * 0.20); enemy.hp = enemy.maxHp; enemy.speed *= (1.0 + this.wave * 0.05);
            return enemy;
        }
        return null;
    }
    draw(ctx, camera) {
        let sc = camera.apply(this.x, this.y);
        if (sc.x > -50 && sc.x < GAME_WIDTH + 50 && sc.y > -50 && sc.y < GAME_HEIGHT + 50) {
            if (Math.floor(this.timer / 4) % 2 === 0) {
                let size = 12 + Math.floor(this.timer / 10) * 4;
                ctx.strokeStyle = this.spawnColor; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(sc.x, sc.y, size, 0, Math.PI * 2); ctx.stroke();
            }
            this.particles.forEach(p => p.draw(ctx, camera));
        }
    }
}

// ==============================================================================
// 8. BIOLOGICAL EVOLUTION PHASES
// ==============================================================================
class EvolutionPhase {
    constructor(player) {
        this.player = player; this.name = "Unknown Phase"; this.radius = 10; this.color = "#ffffff";
        this.acceleration = 0.5; this.friction = 0.90; this.maxLives = 3; this.tier = 0; this.deathColor = "#000000";
    }
    applyStats() { this.player.width = this.radius * 2; this.player.height = this.radius * 2; }
    update() {} draw(ctx, camera, cx, cy) {} processAttacks(enemies, playerCx, playerCy, dmgM, camera) {}
}

class KikkerdrilPhase extends EvolutionPhase {
    constructor(player) {
        super(player);
        this.name = "EGG"; this.tier = 1; this.radius = 16; this.color = "#00ff64"; this.deathColor = "#afccd0";
        this.acceleration = 0.6; this.friction = 0.88; this.maxLives = 3;
        this.auraBaseRadius = 45; this.currentAuraRadius = 0; this.isAuraActive = false;
        this.applyStats();
    }
    update() {
        if (this.player.actionPressed && !this.player.isExhausted && this.player.energy > 0) {
            if (!this.isAuraActive) { playSfx("gif", true); this.isAuraActive = true; }
            this.player.energy -= 0.6;
            let pulse = Math.sin(Date.now() * 0.005) * (30 * this.player.attackSizeMod);
            this.currentAuraRadius = Math.max(1, (this.auraBaseRadius * this.player.attackSizeMod) + pulse);
        } else {
            if (this.isAuraActive) { stopSfx("gif"); this.isAuraActive = false; }
            this.currentAuraRadius = 0;
            this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 0.45);
        }
    }
    draw(ctx, camera, cx, cy) {
        if (this.isAuraActive && this.currentAuraRadius > 0) {
            ctx.save();
            ctx.fillStyle = "rgba(175,204,208,0.25)";
            ctx.beginPath(); ctx.arc(cx, cy, this.currentAuraRadius, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "rgba(175,204,208,0.6)"; ctx.lineWidth = 1; ctx.stroke();
            ctx.restore();
        }
        let time = Date.now() * 0.004; let sizeScale = 1.0 + (this.player.attackSizeMod - 1.0) * 0.5;
        let currentW = this.radius * 2 * (1.0 + Math.sin(time) * 0.10) * sizeScale;
        let currentH = this.radius * 2 * (1.0 - Math.sin(time) * 0.10) * sizeScale;

        drawSpriteOrFallback(ctx, "kikkerdril", cx, cy, currentW, currentH, 0, (c, x, y, w, h, a) => {
            c.fillStyle = "#006428"; c.beginPath(); c.ellipse(x, y, w/2, h/2, 0, 0, Math.PI * 2); c.fill();
            c.fillStyle = this.color; c.beginPath(); c.ellipse(x, y, w/4, h/4, 0, 0, Math.PI * 2); c.fill();
        });
    }
    processAttacks(enemies, playerCx, playerCy, dmgM, camera) {
        if (this.isAuraActive) {
            enemies.forEach(enemy => {
                let ecx = enemy.x + enemy.radius, ecy = enemy.y + enemy.radius;
                // Fast bounding box check
                if (Math.abs(playerCx - ecx) > this.currentAuraRadius + enemy.radius) return;
                if (Math.abs(playerCy - ecy) > this.currentAuraRadius + enemy.radius) return;
                
                if (Math.hypot(playerCx - ecx, playerCy - ecy) < this.currentAuraRadius + enemy.radius) enemy.hit(0.35 * dmgM);
            });
        }
    }
}

class KikkervisPhase extends EvolutionPhase {
    constructor(player) {
        super(player);
        this.name = "TADPOLE"; this.tier = 2; this.radius = 14; this.color = "#00c8ff"; this.deathColor = "#000000";
        this.acceleration = 0.9; this.friction = 0.80; this.maxLives = 4;
        this.bubbles = []; this.angle = 0.0; this.animTimer = 0; this.currentFrame = 1; this.spacePressed = false;
        this.applyStats();
    }
    update() {
        if (this.player.velX !== 0 || this.player.velY !== 0) this.angle = Math.atan2(this.player.velY, this.player.velX);
        let dashCost = this.player.maxEnergy * 0.5;
        
        if (this.player.dashPressed) {
            if (!this.spacePressed && !this.player.isExhausted && this.player.energy >= dashCost) {
                playSfx("dash");
                this.player.energy -= dashCost;
                this.player.velX += Math.cos(this.angle) * 25;
                this.player.velY += Math.sin(this.angle) * 25;
                this.spacePressed = true;
            }
        } else { this.spacePressed = false; }

        if (this.player.actionPressed && !this.player.isExhausted && this.player.energy > 0) {
            this.player.energy -= 0.8;
            this.player.velX *= 1.03; this.player.velY *= 1.03;
            if (Math.random() < 0.25) {
                playSfx("bubbel");
                let bubRad = (Math.random() * 6 + 6) * this.player.attackSizeMod;
                this.bubbles.push({
                    x: (this.player.x + this.player.width/2) - Math.cos(this.angle) * this.radius + (Math.random() - 0.5) * 10,
                    y: (this.player.y + this.player.height/2) - Math.sin(this.angle) * this.radius + (Math.random() - 0.5) * 10,
                    radius: bubRad, life: 60.0, maxLife: 60.0
                });
            }
        } else { this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 0.45); }

        this.bubbles.forEach(b => { b.life--; b.radius += 0.15; });
        this.bubbles = this.bubbles.filter(b => b.life > 0);
    }
    draw(ctx, camera, cx, cy) {
        this.bubbles.forEach(b => {
            let scX = b.x - camera.x, scY = b.y - camera.y;
            if (scX > -20 && scX < GAME_WIDTH + 20 && scY > -20 && scY < GAME_HEIGHT + 20) {
                let alpha = b.life / b.maxLife;
                ctx.fillStyle = `rgba(150, 230, 255, ${alpha})`;
                ctx.beginPath(); ctx.arc(scX, scY, b.radius, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`; ctx.lineWidth = 1; ctx.stroke();
            }
        });

        this.animTimer++;
        if (this.animTimer >= 5) { this.animTimer = 0; this.currentFrame++; if (this.currentFrame > 8) this.currentFrame = 1; }

        let currentW = this.radius * 2.5;
        drawSpriteOrFallback(ctx, `kikkervisje${this.currentFrame}`, cx, cy, currentW, currentW, this.angle, (c, x, y, w, h, a) => {
            c.fillStyle = this.color; c.beginPath(); c.arc(x, y, this.radius, 0, Math.PI * 2); c.fill();
            c.strokeStyle = this.color; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y); c.lineTo(x - Math.cos(a)*22, y - Math.sin(a)*22); c.stroke();
        });
    }
    processAttacks(enemies, playerCx, playerCy, dmgM, camera) {
        this.bubbles.forEach(b => {
            enemies.forEach(e => {
                let ecx = e.x + e.radius, ecy = e.y + e.radius;
                if (Math.abs(b.x - ecx) > b.radius + e.radius) return;
                if (Math.abs(b.y - ecy) > b.radius + e.radius) return;
                
                if (Math.hypot(b.x - ecx, b.y - ecy) < b.radius + e.radius) {
                    e.hit(10 * dmgM, (ecx - b.x) * 0.25, (ecy - b.y) * 0.25);
                    b.life = 0;
                }
            });
        });
    }
}

class KikkerPhase extends EvolutionPhase {
    constructor(player) {
        super(player);
        this.name = "FROG"; this.tier = 3; this.radius = 20;
        this.color = "#00c832"; this.deathColor = "#009600";
        this.acceleration = 1.8; this.friction = 0.78; this.maxLives = 5;
        this.tongueState = "IDLE"; this.tongueLength = 0.0; this.maxTongueLength = 300.0;
        this.tongueSpeed = 30.0; this.tongueAngle = 0.0; this.tipBaseRadius = 10.0;
        this.animTimer = 0; this.currentFrame = 1; this.animDir = 1;
        this.hitEnemies = new Set();
        this.applyStats();
    }
    update() {
        this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 1.5);
        let maxLen = this.maxTongueLength * this.player.attackSizeMod;
        let spd = this.tongueSpeed * this.player.attackSizeMod;

        if (this.tongueState === "IDLE") {
            if (this.player.actionPressed && !this.player.isExhausted) {
                playSfx("kwak");
                this.tongueState = "EXTENDING";
                this.player.energy = 0.0;
                this.hitEnemies.clear();
                this.tongueAngle = this.player.aimAngle;
            }
        } else if (this.tongueState === "EXTENDING") {
            this.tongueLength += spd;
            if (this.tongueLength >= maxLen) { this.tongueLength = maxLen; this.tongueState = "RETRACTING"; }
        } else if (this.tongueState === "RETRACTING") {
            this.tongueLength -= spd;
            if (this.tongueLength <= 0) { this.tongueLength = 0.0; this.tongueState = "IDLE"; this.hitEnemies.clear(); }
        }
    }
    draw(ctx, camera, cx, cy) {
        if (this.tongueState !== "IDLE") {
            let maxLen = this.maxTongueLength * this.player.attackSizeMod;
            let progress = this.tongueLength / maxLen;
            let frameIdx = Math.min(5, Math.max(1, Math.floor(progress * 5) + 1));
            
            drawSpriteOrFallback(ctx, `tong${frameIdx}`, cx + Math.cos(this.tongueAngle)*this.tongueLength/2, cy + Math.sin(this.tongueAngle)*this.tongueLength/2, this.tongueLength, 40 * this.player.attackSizeMod, this.tongueAngle, (c, x, y, w, h, a) => {
                c.strokeStyle = "#ff69b4"; c.lineWidth = 6;
                c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(this.tongueAngle)*this.tongueLength, cy + Math.sin(this.tongueAngle)*this.tongueLength); c.stroke();
                c.fillStyle = "#ff3264";
                c.beginPath(); c.arc(cx + Math.cos(this.tongueAngle)*this.tongueLength, cy + Math.sin(this.tongueAngle)*this.tongueLength, 10*this.player.attackSizeMod, 0, Math.PI*2); c.fill();
            });
        }

        this.animTimer++;
        let isMoving = Math.abs(this.player.velX) > 0.5 || Math.abs(this.player.velY) > 0.5;
        let animSpeed = isMoving ? 6 : 12;

        if (this.animTimer >= animSpeed) {
            this.animTimer = 0;
            this.currentFrame += this.animDir;
            if (this.currentFrame >= 3) { this.currentFrame = 3; this.animDir = -1; }
            else if (this.currentFrame <= 1) { this.currentFrame = 1; this.animDir = 1; }
        }

        drawSpriteOrFallback(ctx, `kikker${this.currentFrame}`, cx, cy, this.radius * 2.8, this.radius * 2.8, this.player.aimAngle, (c, x, y, w, h, a) => {
            c.fillStyle = this.color; c.beginPath(); c.arc(x, y, this.radius, 0, Math.PI * 2); c.fill();
            c.fillStyle = "#ffffff"; c.beginPath(); c.arc(x - 8, y - 12, 6, 0, Math.PI * 2); c.fill();
            c.beginPath(); c.arc(x + 8, y - 12, 6, 0, Math.PI * 2); c.fill();
            c.fillStyle = "#000000"; c.beginPath(); c.arc(x - 8 + Math.cos(a)*3, y - 12 + Math.sin(a)*3, 3, 0, Math.PI * 2); c.fill();
            c.beginPath(); c.arc(x + 8 + Math.cos(a)*3, y - 12 + Math.sin(a)*3, 3, 0, Math.PI * 2); c.fill();
        });
    }
    processAttacks(enemies, playerCx, playerCy, dmgM, camera) {
        if (this.tongueState === "EXTENDING" || this.tongueState === "RETRACTING") {
            let tx = playerCx + Math.cos(this.tongueAngle) * this.tongueLength;
            let ty = playerCy + Math.sin(this.tongueAngle) * this.tongueLength;

            enemies.forEach(enemy => {
                let ecx = enemy.x + enemy.radius, ecy = enemy.y + enemy.radius;
                let bx_ax = tx - playerCx, by_ay = ty - playerCy;
                let segLenSq = bx_ax * bx_ax + by_ay * by_ay;
                
                let distToTongue = 0;
                if (segLenSq > 0) {
                    let t = ((ecx - playerCx) * bx_ax + (ecy - playerCy) * by_ay) / segLenSq;
                    t = Math.max(0.0, Math.min(1.0, t));
                    let closestX = playerCx + t * bx_ax;
                    let closestY = playerCy + t * by_ay;
                    distToTongue = Math.hypot(ecx - closestX, ecy - closestY);
                } else {
                    distToTongue = Math.hypot(ecx - playerCx, ecy - playerCy);
                }

                let tongueRadius = this.tipBaseRadius * this.player.attackSizeMod;

                if (distToTongue < tongueRadius + enemy.radius) {
                    if (!this.hitEnemies.has(enemy)) {
                        enemy.hit(60 * dmgM, Math.cos(this.tongueAngle) * 15.0, Math.sin(this.tongueAngle) * 15.0);
                        camera.shake(10);
                        this.hitEnemies.add(enemy);
                    }
                }
            });
        }
    }
}

class PrinsPhase extends EvolutionPhase {
    constructor(player) {
        super(player);
        this.name = "PRINCE"; this.tier = 4; this.radius = 22;
        this.color = "#ffd700"; this.deathColor = "#fffff0";
        this.acceleration = 2.2; this.friction = 0.80; this.maxLives = 6;
        this.slashAngle = 0.0; this.isSlashing = false; this.slashTimer = 0;
        this.slashDuration = 16; this.cooldownTimer = 0; this.hitEnemies = new Set();
        this.applyStats();
    }
    update() {
        if (this.isSlashing) {
            this.slashTimer--;
            if (this.slashTimer <= 0) { this.isSlashing = false; this.cooldownTimer = 12; }
        }
        if (this.cooldownTimer > 0) this.cooldownTimer--;

        if (this.player.actionPressed && !this.isSlashing && this.cooldownTimer === 0 && !this.player.isExhausted && this.player.energy >= this.player.maxEnergy) {
            playSfx("sword");
            this.isSlashing = true; this.slashTimer = this.slashDuration; this.slashAngle = this.player.aimAngle;
            this.hitEnemies.clear(); this.player.energy = 0.0; this.player.isExhausted = true;
            this.player.velX += Math.cos(this.slashAngle) * 8; this.player.velY += Math.sin(this.slashAngle) * 8;
        }
        
        this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + 1.5);
    }
    draw(ctx, camera, cx, cy) {
        if (this.isSlashing) {
            let progress = 1.0 - (this.slashTimer / this.slashDuration);
            let sweepRange = Math.PI * 0.75;
            let startAngle = this.slashAngle - sweepRange / 2;
            let currentAngle = startAngle + (sweepRange * progress);
            let swordLength = 95 * this.player.attackSizeMod;
            
            ctx.strokeStyle = "#ffc832"; ctx.lineWidth = 5; ctx.beginPath();
            let steps = Math.max(3, Math.floor(15 * progress));
            for(let i=0; i<=steps; i++) {
                let a = startAngle + (i/steps) * (currentAngle - startAngle);
                if (i===0) ctx.moveTo(cx + Math.cos(a)*swordLength, cy + Math.sin(a)*swordLength);
                else ctx.lineTo(cx + Math.cos(a)*swordLength, cy + Math.sin(a)*swordLength);
            }
            ctx.stroke();
            
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.beginPath();
            for(let i=0; i<=steps; i++) {
                let a = startAngle + (i/steps) * (currentAngle - startAngle);
                if (i===0) ctx.moveTo(cx + Math.cos(a)*swordLength, cy + Math.sin(a)*swordLength);
                else ctx.lineTo(cx + Math.cos(a)*swordLength, cy + Math.sin(a)*swordLength);
            }
            ctx.stroke();

            ctx.strokeStyle = "#c8d2dc"; ctx.lineWidth = 7; ctx.beginPath();
            ctx.moveTo(cx + Math.cos(currentAngle)*this.radius, cy + Math.sin(currentAngle)*this.radius);
            ctx.lineTo(cx + Math.cos(currentAngle)*swordLength, cy + Math.sin(currentAngle)*swordLength);
            ctx.stroke();
            
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3; ctx.beginPath();
            ctx.moveTo(cx + Math.cos(currentAngle)*this.radius, cy + Math.sin(currentAngle)*this.radius);
            ctx.lineTo(cx + Math.cos(currentAngle)*swordLength, cy + Math.sin(currentAngle)*swordLength);
            ctx.stroke();
        }

        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(cx, cy, this.radius, 0, Math.PI * 2); ctx.fill();

        let ky = cy - this.radius - 2;
        ctx.fillStyle = "#ff9600";
        ctx.beginPath();
        ctx.moveTo(cx - 14, ky + 2); ctx.lineTo(cx + 14, ky + 2);
        ctx.lineTo(cx + 18, ky - 12); ctx.lineTo(cx + 6, ky - 4);
        ctx.lineTo(cx, ky - 14); ctx.lineTo(cx - 6, ky - 4);
        ctx.lineTo(cx - 18, ky - 12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.stroke();
    }
    processAttacks(enemies, playerCx, playerCy, dmgM, camera) {
        if (this.isSlashing) {
            let progress = 1.0 - (this.slashTimer / this.slashDuration);
            let sweepRange = Math.PI * 0.75;
            let startAngle = this.slashAngle - sweepRange / 2;
            let currentSweep = sweepRange * progress;
            let hitRadius = 120 * this.player.attackSizeMod;

            enemies.forEach(enemy => {
                if (this.hitEnemies.has(enemy)) return;
                
                let ecx = enemy.x + enemy.radius, ecy = enemy.y + enemy.radius;
                let dist = Math.hypot(playerCx - ecx, playerCy - ecy);
                
                if (dist < hitRadius + enemy.radius) {
                    let angleToEnemy = Math.atan2(ecy - playerCy, ecx - playerCx);
                    let diffToEnemy = (angleToEnemy - startAngle) % (Math.PI * 2);
                    if (diffToEnemy < 0) diffToEnemy += Math.PI * 2;
                    
                    let enemyAngularMargin = enemy.radius / Math.max(1.0, dist);
                    
                    if (diffToEnemy <= currentSweep + enemyAngularMargin || diffToEnemy >= (Math.PI*2) - enemyAngularMargin) {
                        enemy.hit(85 * dmgM, Math.cos(this.slashAngle) * 18.0, Math.sin(this.slashAngle) * 18.0);
                        this.hitEnemies.add(enemy);
                        camera.shake(8);
                    }
                }
            });
        }
    }
}

// ==============================================================================
// 9. PLAYER CLASS
// ==============================================================================
class Player {
    constructor(x, y) {
        this.x = x; this.y = y; this.width = 32; this.height = 32;
        this.algae = 0; this.xp = 0; this.level = 1;
        this.energy = 100.0; this.maxEnergy = 100.0; this.isExhausted = false;
        this.velX = 0.0; this.velY = 0.0; this.iFrames = 0;
        this.actionPressed = false; this.dashPressed = false; this.aimAngle = 0.0;
        this.speedMod = 1.0; this.damageMod = 1.0; this.attackSizeMod = 1.0; this.magnetRadius = 130;
        
        this.phase = new KikkerdrilPhase(this);
        this.maxLives = this.phase.maxLives;
        this.lives = this.maxLives;
    }
    evolve(newPhaseClass) {
        this.phase = new newPhaseClass(this);
        let livesDiff = this.phase.maxLives - this.maxLives;
        this.maxLives = this.phase.maxLives;
        this.lives = Math.min(this.lives + Math.max(0, livesDiff), this.maxLives);
    }
    update(keys, mouse, joy, camera) {
        if (this.iFrames > 0) this.iFrames--;

        let dx = 0.0, dy = 0.0;
        
        if (keys[KEYBINDS.LEFT] || keys["ArrowLeft"]) dx -= 1.0;
        if (keys[KEYBINDS.RIGHT] || keys["ArrowRight"]) dx += 1.0;
        if (keys[KEYBINDS.UP] || keys["ArrowUp"]) dy -= 1.0;
        if (keys[KEYBINDS.DOWN] || keys["ArrowDown"]) dy += 1.0;

        if (joy && joy.axes.length >= 2) {
            if (Math.abs(joy.axes[0]) > 0.15) dx += joy.axes[0];
            if (Math.abs(joy.axes[1]) > 0.15) dy += joy.axes[1];
        }

        this.actionPressed = mouse.pressed || (joy && joy.buttons[0]?.pressed) || (joy && joy.buttons[7]?.pressed) || (joy && joy.axes[5] > 0.5);
        this.dashPressed = keys["Space"] || (joy && (joy.buttons[1]?.pressed || joy.buttons[2]?.pressed || joy.buttons[5]?.pressed));

        let screenCx = this.x + this.width / 2 - camera.x;
        let screenCy = this.y + this.height / 2 - camera.y;
        
        if (joy && joy.axes.length >= 4 && Math.hypot(joy.axes[2], joy.axes[3]) > 0.2) {
            this.aimAngle = Math.atan2(joy.axes[3], joy.axes[2]);
        } else {
            this.aimAngle = Math.atan2(mouse.y - screenCy, mouse.x - screenCx);
        }

        let length = Math.hypot(dx, dy);
        if (length > 1.0) { dx /= length; dy /= length; }

        this.velX += dx * this.phase.acceleration * this.speedMod;
        this.velY += dy * this.phase.acceleration * this.speedMod;
        this.velX *= this.phase.friction;
        this.velY *= this.phase.friction;
        this.x += this.velX;
        this.y += this.velY;

        this.x = Math.max(OFFSET_X, Math.min(this.x, WORLD_WIDTH - this.width - OFFSET_X));
        this.y = Math.max(OFFSET_Y, Math.min(this.y, WORLD_HEIGHT - this.height - OFFSET_Y));

        this.phase.update();

        if (this.energy <= 0) {
            this.energy = 0.0;
            this.isExhausted = true;
        } else if (this.energy >= this.maxEnergy) {
            this.energy = this.maxEnergy;
            this.isExhausted = false;
        }
    }
    draw(ctx, camera) {
        if (this.iFrames > 0 && Math.floor(Date.now() / 100) % 2 === 0) return;
        
        let cx = this.x + this.width / 2 - camera.x;
        let cy = this.y + this.height / 2 - camera.y;
        this.phase.draw(ctx, camera, cx, cy);

        let barW = 40, barH = 8;
        let barX = cx - barW / 2;
        let barY = cy + this.phase.radius + 8;

        ctx.fillStyle = "#000000";
        ctx.fillRect(barX + 2, barY + 2, barW, barH);
        ctx.fillStyle = "#1e2328";
        ctx.fillRect(barX, barY, barW, barH);

        let energyRatio = this.energy / this.maxEnergy;
        let fillW = Math.floor((barW - 4) * energyRatio);
        
        if (fillW > 0) {
            ctx.fillStyle = this.isExhausted ? "#c83c3c" : "#46be5a";
            ctx.fillRect(barX + 2, barY + 2, fillW, barH - 4);
        }

        ctx.strokeStyle = "#151515"; ctx.lineWidth = 1;
        for (let segX = barX + 2; segX < barX + barW - 2; segX += 6) {
            ctx.beginPath(); ctx.moveTo(segX, barY + 2); ctx.lineTo(segX, barY + barH - 2); ctx.stroke();
        }

        ctx.strokeStyle = "#b4b4be";
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);
    }
}

// ==============================================================================
// 10. ENGINE / VISUAL EFFECTS
// ==============================================================================
class CRTEffect {
    constructor() {
        this.enabled = true;
        this.overlay = document.createElement("canvas");
        this.overlay.width = GAME_WIDTH;
        this.overlay.height = GAME_HEIGHT;
        let ctx = this.overlay.getContext("2d");
        
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        for (let y = 0; y < GAME_HEIGHT; y += 3) {
            ctx.fillRect(0, y, GAME_WIDTH, 1);
        }

        let grad = ctx.createRadialGradient(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_HEIGHT/2, GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.6)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    draw(ctx) {
        if (this.enabled) {
            ctx.drawImage(this.overlay, 0, 0);
        }
    }
}

class CursorManager {
    constructor(color="#ffd700") {
        this.color = color;
        this.history = [];
        this.particles = [];
        this.maxHistory = 15;
    }
    update(mouse, isController) {
        if (isController) {
            this.history = [];
            this.particles = [];
            return;
        }

        this.history.push({ x: mouse.x, y: mouse.y });
        if (this.history.length > this.maxHistory) this.history.shift();

        if (mouse.pressed && this.history.length > 1) {
            let last = this.history[this.history.length - 1];
            let prev = this.history[this.history.length - 2];
            if (last.x !== prev.x || last.y !== prev.y) {
                for (let i = 0; i < 2; i++) {
                    this.particles.push({
                        x: mouse.x, y: mouse.y,
                        vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                        s: Math.random() * 3 + 2, a: 1.0, fs: Math.random() * 0.05 + 0.02
                    });
                }
            }
        }

        this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.a -= p.fs; p.s -= 0.05; });
        this.particles = this.particles.filter(p => p.a > 0 && p.s > 0);
    }
    draw(ctx, isController) {
        if (isController) return;

        this.particles.forEach(p => {
            ctx.globalAlpha = p.a;
            ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        this.history.forEach((pos, i) => {
            let alpha = (i / this.maxHistory) * 0.5;
            let size = (i / this.maxHistory) * 5 + 1;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        if (this.history.length > 0) {
            let pos = this.history[this.history.length - 1];
            let puls = Math.sin(Date.now() * 0.01) * 2;
            ctx.strokeStyle = this.color; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 6 + puls, 0, Math.PI * 2); ctx.stroke();
        }
    }
}

// ==============================================================================
// MAIN STATE MANAGER & GAME LOOP
// ==============================================================================
class StateManager {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.camera = new Camera(GAME_WIDTH, GAME_HEIGHT);
        this.crtEffect = new CRTEffect();
        this.cursor = new CursorManager();
        this.inputMethod = "MOUSE";
        
        this.keys = {};
        this.mouse = { x: GAME_WIDTH/2, y: GAME_HEIGHT/2, pressed: false };
        this.joy = null;

        this.player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        this.enemies = []; this.spawners = []; this.algaeDrops = []; this.deathParticles = []; this.projectileQueue = [];
        this.wave = 1; this.waveTimer = 0; this.introTimer = 0; this.enemiesKilled = 0; this.totalFrames = 0;
        
        this.currentStateName = "MENU";
        this.uiElements = []; this.cardElements = [];
        this.transitionAlpha = 0; this.targetState = null;
        this.returnTo = "MENU"; this.waitingForKey = null;
        
        this._initInput();
        this.changeState("MENU", true);
    }

    _initInput() {
        window.addEventListener("keydown", e => {
            this.inputMethod = "MOUSE";
            this.keys[e.code] = true;
            if (this.waitingForKey) {
                KEYBINDS[this.waitingForKey] = e.code;
                this.waitingForKey = null;
            }
        });
        window.addEventListener("keyup", e => this.keys[e.code] = false);
        this.canvas.addEventListener("mousemove", e => {
            this.inputMethod = "MOUSE";
            let rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (GAME_WIDTH / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (GAME_HEIGHT / rect.height);
        });
        this.canvas.addEventListener("mousedown", e => {
            this.inputMethod = "MOUSE";
            this.mouse.pressed = true;
            
            // Audio unlock op eerste klik
            if (!audioInitialized) {
                audioInitialized = true;
                if (SOUND_ENABLED && ASSETS.sounds["music"] && ASSETS.sounds["music"].paused) {
                    ASSETS.sounds["music"].play().catch(()=>{});
                }
            }

            this.uiElements.forEach(btn => { if (btn.isHovered && !btn.disabled && btn.callback) btn.callback(); });
            this.cardElements.forEach(card => { if (card.isHovered && !card.disabled && card.callback) card.callback(); });
        });
        window.addEventListener("mouseup", e => this.mouse.pressed = false);
    }

    changeState(newState, immediate = false) {
        if (immediate) {
            this.currentStateName = newState;
            this._buildUIForState();
        } else {
            this.targetState = newState;
            this.transitionAlpha = 1;
        }
    }

    _buildUIForState() {
        this.uiElements = [];
        this.cardElements = [];
        let cx = GAME_WIDTH / 2;

        if (this.currentStateName === "MENU") {
            this.uiElements.push(new Button(cx, 245, 250, 45, "START RUN", () => this.changeState("PHASE_SELECT")));
            this.uiElements.push(new Button(cx, 300, 250, 45, "HOW TO PLAY", () => this.changeState("HOW_TO_PLAY")));
            this.uiElements.push(new Button(cx, 355, 250, 45, "SETTINGS", () => { this.settingsReturnTo = "MENU"; this.changeState("SETTINGS"); }));
        } else if (this.currentStateName === "PHASE_SELECT") {
            this.uiElements.push(new Button(cx, 150, 400, 45, "START AS EGG (WAVE 1)", () => this._startRun(KikkerdrilPhase, 1)));
            this.uiElements.push(new Button(cx, 210, 400, 45, "START AS TADPOLE (WAVE 4)", () => this._startRun(KikkervisPhase, 4)));
            this.uiElements.push(new Button(cx, 270, 400, 45, "START AS FROG (WAVE 8)", () => this._startRun(KikkerPhase, 8)));
            this.uiElements.push(new Button(cx, 330, 400, 45, "START AS PRINCE (WAVE 10)", () => this._startRun(PrinsPhase, 10)));
            this.uiElements.push(new Button(cx, 450, 400, 45, "BACK", () => this.changeState("MENU")));
        } else if (this.currentStateName === "PLAY" || this.currentStateName === "TUTORIAL") {
            this.uiElements.push(new Button(GAME_WIDTH - 40, 40, 50, 50, "II", () => { this.returnTo = this.currentStateName; this.changeState("PAUSE"); }, "pauze_knop"));
        } else if (this.currentStateName === "PAUSE") {
            this.uiElements.push(new Button(cx, 200, 250, 45, "RESUME", () => this.changeState(this.returnTo)));
            this.uiElements.push(new Button(cx, 260, 250, 45, "RESTART", () => this._startRun(KikkerdrilPhase, 1)));
            this.uiElements.push(new Button(cx, 320, 250, 45, "SETTINGS", () => { this.settingsReturnTo = "PAUSE"; this.changeState("SETTINGS"); }));
            this.uiElements.push(new Button(cx, 380, 250, 45, "MAIN MENU", () => this.changeState("MENU")));
        } else if (this.currentStateName === "SHOP") {
            for (let i = 0; i < 3; i++) {
                let item = SHOP_ITEMS[Math.floor(Math.random() * SHOP_ITEMS.length)];
                this.cardElements.push(new ItemCard(cx + (i - 1) * 280, 380, 260, 110, item, () => this._buyItem(i)));
            }
            this.uiElements.push(new Button(cx, 490, 280, 40, "START NEXT WAVE", () => this.changeState("PLAY")));
        } else if (this.currentStateName === "GAME_OVER") {
            this.uiElements.push(new Button(cx, 380, 250, 45, "TRY AGAIN", () => this._startRun(KikkerdrilPhase, 1)));
            this.uiElements.push(new Button(cx, 440, 250, 45, "MAIN MENU", () => this.changeState("MENU")));
        } else if (this.currentStateName === "HOW_TO_PLAY") {
            this.uiElements.push(new Button(cx, 430, 250, 45, "PLAY TUTORIAL", () => {
                this._startRun(KikkerdrilPhase, 1);
                this.changeState("TUTORIAL", true);
                this.player.maxLives = 99;
                this.player.lives = 99;
            }));
            this.uiElements.push(new Button(cx, 490, 250, 45, "BACK", () => this.changeState("MENU")));
        } else if (this.currentStateName === "SETTINGS") {
            // Geperfectioneerde gelijke afstanden voor alle opties (afstand label tot knoppen is +25)
            let y_controls = 145, y_sound = 215, y_crt = 285, y_color = 355;
            
            this.uiElements.push(new Button(cx, y_controls, 160, 25, "CUSTOMIZE", () => this.changeState("KEYBINDS")));
            this.uiElements.push(new Button(cx - 40, y_sound, 60, 25, "ON", () => { SOUND_ENABLED = true; if(ASSETS.sounds["music"] && ASSETS.sounds["music"].paused) ASSETS.sounds["music"].play().catch(()=>{}); }));
            this.uiElements.push(new Button(cx + 40, y_sound, 60, 25, "OFF", () => { SOUND_ENABLED = false; if(ASSETS.sounds["music"]) ASSETS.sounds["music"].pause(); }));
            this.uiElements.push(new Button(cx - 40, y_crt, 60, 25, "ON", () => this.crtEffect.enabled = true));
            this.uiElements.push(new Button(cx + 40, y_crt, 60, 25, "OFF", () => this.crtEffect.enabled = false));
            
            let colors = ["#ffd700", "#32ff64", "#00c8ff", "#ff32ff", "#f0f0f0"];
            colors.forEach((c, i) => this.uiElements.push(new ColorButton(cx - 60 + (i * 30), y_color, 8, c, () => this.cursor.color = c)));
            
            this.uiElements.push(new Button(cx, 445, 220, 40, "BACK", () => this.changeState(this.settingsReturnTo || "MENU")));
        } else if (this.currentStateName === "KEYBINDS") {
            ["UP", "DOWN", "LEFT", "RIGHT"].forEach((dir, i) => {
                this.uiElements.push(new Button(cx, 185 + i * 60, 160, 25, "", () => this.waitingForKey = dir));
            });
            this.uiElements.push(new Button(cx, 450, 220, 40, "BACK", () => this.changeState("SETTINGS")));
        }
    }

    _startRun(phaseClass, waveNum) {
        this.player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        this.player.evolve(phaseClass);
        this.wave = waveNum;
        this.waveTimer = WAVE_DURATION * FPS;
        this.introTimer = INTRO_DURATION;
        this.enemiesKilled = 0;
        this.totalFrames = 0;
        this.enemies = []; this.spawners = []; this.algaeDrops = []; this.deathParticles = []; this.projectileQueue = [];
        this.changeState("PLAY");
    }

    _buyItem(idx) {
        let card = this.cardElements[idx];
        if (card && !card.disabled && this.player.algae >= card.item.price) {
            this.player.algae -= card.item.price;
            this.player.damageMod += card.item.stats.dmg;
            this.player.speedMod += card.item.stats.spd;
            this.player.attackSizeMod += card.item.stats.size;
            this.player.magnetRadius += card.item.stats.mag;
            if (card.item.stats.hp !== 0) {
                this.player.maxLives += card.item.stats.hp;
                this.player.lives = Math.min(this.player.lives + card.item.stats.hp, this.player.maxLives);
            }
            card.disabled = true;
        }
    }

    update() {
        let pads = navigator.getGamepads ? navigator.getGamepads() : [];
        this.joy = pads[0] || null;
        if (this.joy && (Math.abs(this.joy.axes[0])>0.2 || Math.abs(this.joy.axes[1])>0.2 || Math.abs(this.joy.axes[2])>0.2 || this.joy.buttons.some(b=>b.pressed))) {
            this.inputMethod = "CONTROLLER";
        }

        if (this.keys["Escape"]) {
            this.keys["Escape"] = false;
            if (["PLAY", "TUTORIAL", "SHOP", "SETTINGS", "KEYBINDS", "HOW_TO_PLAY"].includes(this.currentStateName)) {
                if (this.currentStateName === "PLAY" || this.currentStateName === "TUTORIAL") { this.returnTo = this.currentStateName; this.changeState("PAUSE"); }
                else if (this.currentStateName === "SHOP") { this.returnTo = "SHOP"; this.changeState("PAUSE"); }
                else if (this.currentStateName === "SETTINGS") this.changeState(this.settingsReturnTo || "MENU");
                else this.changeState("MENU");
            }
        }

        if (this.targetState) {
            this.transitionAlpha += 15;
            if (this.transitionAlpha >= 255) {
                this.currentStateName = this.targetState;
                this.targetState = null;
                this._buildUIForState();
            }
            return;
        } else if (this.transitionAlpha > 0) {
            this.transitionAlpha -= 15;
        }

        this.uiElements.forEach(btn => {
            btn.isHovered = (this.mouse.x > btn.rect.x && this.mouse.x < btn.rect.x + btn.rect.w && this.mouse.y > btn.rect.y && this.mouse.y < btn.rect.y + btn.rect.h);
        });
        this.cardElements.forEach(c => {
            c.isHovered = (this.mouse.x > c.rect.x && this.mouse.x < c.rect.x + c.rect.w && this.mouse.y > c.rect.y && this.mouse.y < c.rect.y + c.rect.h);
        });

        if (this.currentStateName === "KEYBINDS") {
            ["UP", "DOWN", "LEFT", "RIGHT"].forEach((dir, i) => {
                this.uiElements[i].text = this.waitingForKey === dir ? "[ PRESS ]" : `[ ${KEYBINDS[dir].replace("Key","").replace("Arrow","").toUpperCase()} ]`;
            });
        }

        if (this.currentStateName === "PLAY" || this.currentStateName === "TUTORIAL") {
            if (this.currentStateName === "PLAY") this.totalFrames++;
            
            this.deathParticles.forEach(p => p.update());
            this.deathParticles = this.deathParticles.filter(p => p.alpha > 0);

            if (this.player.lives <= 0) {
                if (this.introTimer === 0) {
                    this.introTimer = 90;
                    this.camera.shake(10);
                    for(let i=0; i<40; i++) this.deathParticles.push(new Particle(this.player.x, this.player.y, this.player.phase.deathColor));
                }
                this.introTimer--;
                this.camera.update(this.player.x + this.player.width/2, this.player.y + this.player.height/2);
                if (this.introTimer <= 0) this.changeState("GAME_OVER");
                return;
            }

            if (this.currentStateName === "PLAY") {
                if (this.introTimer > 0) {
                    this.introTimer--;
                    this.camera.update(this.player.x + this.player.width/2, this.player.y + this.player.height/2);
                    return;
                }
                
                this.waveTimer--;
                if (this.waveTimer <= 60 && this.wave < 10) this.algaeDrops.forEach(a => a.isVacuumed = true);
                
                if (this.waveTimer <= 0) {
                    this.algaeDrops.forEach(a => this.player.algae += a.value);
                    this.wave++;
                    this.enemies = []; this.spawners = []; this.algaeDrops = []; this.projectileQueue = [];
                    this.player.x = WORLD_WIDTH / 2; this.player.y = WORLD_HEIGHT / 2;
                    this.player.energy = this.player.maxEnergy; this.player.lives = this.player.maxLives;
                    
                    if (this.wave === 4 && this.player.phase.tier < 2) this.player.evolve(KikkervisPhase);
                    if (this.wave === 8 && this.player.phase.tier < 3) this.player.evolve(KikkerPhase);
                    if (this.wave === 10 && this.player.phase.tier < 4) this.player.evolve(PrinsPhase);
                    
                    this.waveTimer = WAVE_DURATION * FPS;
                    this.changeState("SHOP");
                    return;
                }
            } else if (this.currentStateName === "TUTORIAL") {
                if (this.keys["Digit1"]) this.player.evolve(KikkerdrilPhase);
                if (this.keys["Digit2"]) this.player.evolve(KikkervisPhase);
                if (this.keys["Digit3"]) this.player.evolve(KikkerPhase);
                if (this.keys["Digit4"]) this.player.evolve(PrinsPhase);
            }

            let pCx = this.player.x + this.player.width/2, pCy = this.player.y + this.player.height/2;
            this.player.update(this.keys, this.mouse, this.joy, this.camera);
            this.camera.update(pCx, pCy);

            if (this.currentStateName === "TUTORIAL") {
                if (this.totalFrames++ % 60 === 0 && this.enemies.length < 12) {
                    let a = Math.random() * Math.PI * 2;
                    this.enemies.push(new BacteriaEnemy(pCx + Math.cos(a)*400, pCy + Math.sin(a)*400));
                }
            } else {
                if (this.wave >= 10 && !this.enemies.find(e => e.isBoss)) {
                    this.spawners.push(new EnemySpawner(WORLD_WIDTH/2, WORLD_HEIGHT/2 - 200, WitchBoss, this.wave));
                } else if (this.totalFrames % Math.max(20, 80 - this.wave * 6) === 0 && this.wave < 10) {
                    let eClass = this.wave <= 3 ? BacteriaEnemy : (this.wave <= 7 ? FishEnemy : DragonflyEnemy);
                    if (this.wave === 6 && Math.random() < 0.3) eClass = WaterBeetleEnemy;
                    if (this.wave === 7 && Math.random() < 0.2) eClass = PikeEnemy;
                    
                    let a = Math.random() * Math.PI * 2, d = Math.random() * 250 + 350;
                    this.spawners.push(new EnemySpawner(pCx + Math.cos(a)*d, pCy + Math.sin(a)*d, eClass, this.wave));
                }
            }

            this.spawners.forEach(s => { let e = s.update(); if(e) this.enemies.push(e); });
            this.spawners = this.spawners.filter(s => s.timer > 0);
            
            while(this.projectileQueue.length > 0) this.enemies.push(this.projectileQueue.shift());

            for (let i = 0; i < this.enemies.length; i++) {
                for (let j = i + 1; j < this.enemies.length; j++) {
                    let e1 = this.enemies[i], e2 = this.enemies[j];
                    let dx = e2.x - e1.x, dy = e2.y - e1.y;
                    let minDist = e1.radius + e2.radius;
                    // Snelle AABB check om zware wiskunde te voorkomen (Optimale prestaties)
                    if (Math.abs(dx) > minDist || Math.abs(dy) > minDist) continue;

                    let dist = Math.hypot(dx, dy);
                    if (dist < minDist && dist > 0) {
                        let overlap = (minDist - dist) * 0.2;
                        e1.x -= (dx / dist) * overlap; e1.y -= (dy / dist) * overlap;
                        e2.x += (dx / dist) * overlap; e2.y += (dy / dist) * overlap;
                    }
                }
            }

            this.enemies.forEach(e => {
                if (e instanceof WitchBoss) e.updateBoss(pCx, pCy, this.projectileQueue);
                else e.updateBehavior(pCx, pCy);
            });

            this.player.phase.processAttacks(this.enemies, pCx, pCy, this.player.damageMod, this.camera);

            this.algaeDrops.forEach(a => {
                a.updateMagnetism(pCx, pCy, this.player.magnetRadius);
                if (Math.hypot(pCx - a.x, pCy - a.y) < this.player.width/2 + a.radius + 16) {
                    this.player.algae += a.value; a.value = 0;
                }
            });
            this.algaeDrops = this.algaeDrops.filter(a => a.value > 0);

            this.enemies.forEach(e => {
                let ecx = e.x + e.radius, ecy = e.y + e.radius;
                if (e.hp <= 0) {
                    if (!e.isBoss && !(e instanceof BossProjectile)) {
                        this.algaeDrops.push(new AlgaeDrop(ecx, ecy, 1));
                        this.enemiesKilled++;
                    } else if (e.isBoss) {
                        this.introTimer = 90;
                        this.camera.shake(20);
                    }
                    for(let i=0; i<15; i++) this.deathParticles.push(new Particle(ecx, ecy, e.color));
                } else if (Math.hypot(pCx - ecx, pCy - ecy) < this.player.width * 0.25 + e.radius * 0.8 && this.player.iFrames <= 0 && this.currentStateName === "PLAY") {
                    this.player.lives--;
                    this.player.iFrames = 60;
                    this.camera.shake(18);
                    if (pCx !== ecx || pCy !== ecy) {
                        let d = Math.hypot(pCx - ecx, pCy - ecy);
                        this.player.velX = ((pCx - ecx) / d) * 8;
                        this.player.velY = ((pCy - ecy) / d) * 8;
                    }
                    if (!e.isBoss) e.hp = 0;
                }
            });
            this.enemies = this.enemies.filter(e => e.hp > 0);
            
            if (this.wave >= 10 && this.enemies.length === 0 && this.introTimer === 0 && this.totalFrames > 100) {
                this.changeState("GAME_OVER");
            }
        }
    }

    draw() {
        let cx = GAME_WIDTH / 2, cy = GAME_HEIGHT / 2;

        if (["PLAY", "TUTORIAL", "PAUSE"].includes(this.currentStateName)) {
            // Wereld tekenen
            if (ASSETS.images["map1"] && ASSETS.images["map1"].complete && ASSETS.images["map1"].naturalWidth > 0) {
                this.ctx.drawImage(ASSETS.images["map1"], -this.camera.x, -this.camera.y, WORLD_WIDTH, WORLD_HEIGHT);
            } else {
                this.ctx.fillStyle = COLOR_BG_WATER;
                this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            }

            this.spawners.forEach(s => s.draw(this.ctx, this.camera));
            this.algaeDrops.forEach(a => a.draw(this.ctx, this.camera));
            this.enemies.forEach(e => e.draw(this.ctx, this.camera));
            this.deathParticles.forEach(p => p.draw(this.ctx, this.camera));
            if (this.player.lives > 0) this.player.draw(this.ctx, this.camera);

            // Interface tekenen (Hartjes niet tekenen in Tutorial mode)
            if (this.currentStateName !== "TUTORIAL") {
                for (let i = 0; i < this.player.maxLives; i++) {
                    let hX = 20 + i * 26;
                    let isLost = i >= this.player.lives;
                    
                    if (isLost) {
                        this.ctx.save();
                        // Grijze en doorzichtige look voor lege hartjes
                        this.ctx.filter = "grayscale(100%) opacity(50%)";
                    }
                    
                    drawSpriteOrFallback(this.ctx, "hartje", hX + 10, 30, 20, 20, 0, (c, x, y, w, h) => {
                        c.fillStyle = isLost ? "#323232" : "#e63232";
                        c.beginPath(); c.arc(x, y, 8, 0, Math.PI * 2); c.fill();
                    });
                    
                    if (isLost) this.ctx.restore();
                }
            }

            this.ctx.fillStyle = COLOR_WHITE; this.ctx.font = getFont(18); this.ctx.textAlign = "left";
            this.ctx.fillText(`PHASE: ${this.player.phase.name} | ENEMIES: ${this.enemies.length}`, 20, 52);
            this.ctx.fillStyle = "#32ff64"; this.ctx.fillText(`ALGAE: ${this.player.algae}`, 20, 80);

            if (!this.enemies.find(e => e.isBoss)) {
                this.ctx.fillStyle = COLOR_WHITE; this.ctx.font = getFont(24); this.ctx.textAlign = "center";
                this.ctx.fillText(`WAVE ${this.wave} - ${Math.max(0, Math.floor(this.waveTimer / FPS))}s`, cx, 30);
            }

            if (this.currentStateName === "TUTORIAL") {
                this.ctx.fillStyle = "#b4b8be"; this.ctx.font = getFont(12); this.ctx.textAlign = "left";
                this.ctx.fillText(`SANDBOX MODE ACTIVE - FORM: ${this.player.phase.name}`, 20, 110);
                this.ctx.fillText("IMMORTAL ACTIVE | PRESS 1, 2, 3, 4 TO CHANGE FORM", 20, 130);
            }

            let pA = {
                "EGG": "ATTACK [HOLD MOUSE-1 / RT]: POISON AURA (RADIUS PULSES & DRAINS ENERGY)",
                "TADPOLE": "ATTACK [HOLD MOUSE-1 / RT]: SHOOT BUBBLES  |  [SPACE / B]: HIGH-SPEED DASH",
                "FROG": "ATTACK [CLICK MOUSE-1 / RT]: TONGUE WHIP (LONG RANGE DAMAGE)",
                "PRINCE": "ATTACK [CLICK MOUSE-1 / RT]: SWORD SWOOSH (DRAINS FULL ENERGY BAR)"
            };
            if (pA[this.player.phase.name]) {
                this.ctx.fillStyle = "rgba(10,15,20,0.86)";
                this.ctx.fillRect(0, GAME_HEIGHT - 35, GAME_WIDTH, 35);
                this.ctx.strokeStyle = COLOR_ARCADE_GREEN; this.ctx.lineWidth = 2;
                this.ctx.beginPath(); this.ctx.moveTo(0, GAME_HEIGHT - 35); this.ctx.lineTo(GAME_WIDTH, GAME_HEIGHT - 35); this.ctx.stroke();
                
                this.ctx.fillStyle = "#000000"; this.ctx.font = getFont(11); this.ctx.textAlign = "center";
                this.ctx.fillText(pA[this.player.phase.name], cx + 2, GAME_HEIGHT - 15);
                this.ctx.fillStyle = COLOR_ARCADE_YELLOW;
                this.ctx.fillText(pA[this.player.phase.name], cx, GAME_HEIGHT - 17);
            }

            if (this.introTimer > 0 && this.currentStateName !== "TUTORIAL" && this.player.lives > 0) {
                let msg = this.wave === 1 ? "FIGHT THE BACTERIA" : this.wave === 4 ? "FIGHT THE FISHES" : this.wave === 8 ? "FIGHT THE DRAGONFLIES" : "DEFEAT THE WITCH!";
                this.ctx.fillStyle = `rgba(0,0,0,${Math.sin((this.introTimer / 120) * Math.PI)})`;
                this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                this.ctx.fillStyle = COLOR_ARCADE_GOLD; this.ctx.font = getFont(36); this.ctx.textAlign = "center";
                this.ctx.fillText(msg, cx, cy - 80);
            }

            // Pauze specifiek (Overlay filter en text)
            if (this.currentStateName === "PAUSE") {
                this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Vage schaduwlaag
                this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                this.ctx.fillStyle = COLOR_WHITE; this.ctx.font = getFont(50); this.ctx.textAlign = "center";
                this.ctx.fillText("PAUSED", cx, 100);
            }
            
            this.uiElements.forEach(b => b.draw(this.ctx));
            
        } else {
            let bgs = { MENU: "achtergrond", SHOP: "shop_bg", GAME_OVER: this.wave >= 10 && this.enemies.length === 0 ? "victory" : "gameover", SETTINGS: "settings", KEYBINDS: "keybinds", HOW_TO_PLAY: "howtoplay" };
            let bgKey = bgs[this.currentStateName];
            
            // Phase select heeft geen afbeelding meer, vandaar de null/undefined check
            if (bgKey && ASSETS.images[bgKey] && ASSETS.images[bgKey].complete && ASSETS.images[bgKey].naturalWidth > 0) {
                this.ctx.drawImage(ASSETS.images[bgKey], 0, 0, GAME_WIDTH, GAME_HEIGHT);
            } else {
                this.ctx.fillStyle = COLOR_BG_OUTSIDE;
                this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            }

            if (this.currentStateName === "PHASE_SELECT") {
                this.ctx.fillStyle = COLOR_ARCADE_GOLD; this.ctx.font = getFont(30); this.ctx.textAlign = "center";
                this.ctx.fillText("SELECT STARTING PHASE", cx, 70);
            } else if (this.currentStateName === "SHOP") {
                this.ctx.fillStyle = "rgba(10,15,20,0.55)"; this.ctx.fillRect(0, 0, GAME_WIDTH, 60);
                this.ctx.fillStyle = "#32ff64"; this.ctx.font = getFont(24); this.ctx.textAlign = "left";
                this.ctx.fillText(`ALGAE: ${this.player.algae}`, 30, 38);
                
                this.ctx.fillStyle = "#ff3232"; this.ctx.textAlign = "center"; this.ctx.fillText(`DMG: ${Math.floor(this.player.damageMod*100)}%`, cx - 150, 38);
                this.ctx.fillStyle = "#32c8ff"; this.ctx.fillText(`SPD: ${Math.floor(this.player.speedMod*100)}%`, cx + 50, 38);
                this.ctx.fillStyle = "#ffd700"; this.ctx.fillText(`SIZE: ${Math.floor(this.player.attackSizeMod*100)}%`, cx + 250, 38);
            } else if (this.currentStateName === "GAME_OVER") {
                let won = this.wave >= 10 && this.enemies.length === 0;
                this.ctx.fillStyle = COLOR_WHITE; this.ctx.font = getFont(16); this.ctx.textAlign = "right";
                let sy = 190;
                ["WAVES:", "FORM:", "KILLS:", "TIME:"].forEach((t, i) => this.ctx.fillText(t, cx - 10, sy + i * 40));
                
                this.ctx.textAlign = "left";
                this.ctx.fillStyle = won ? "#32ff64" : COLOR_WHITE; this.ctx.fillText(this.wave, cx + 10, sy);
                this.ctx.fillStyle = "#00c8ff"; this.ctx.fillText(this.player.phase.name, cx + 10, sy + 40);
                this.ctx.fillStyle = "#ff6464"; this.ctx.fillText(this.enemiesKilled, cx + 10, sy + 80);
                
                let timeStr = `${Math.floor(this.totalFrames/FPS/60).toString().padStart(2,'0')}:${(Math.floor(this.totalFrames/FPS)%60).toString().padStart(2,'0')}`;
                this.ctx.fillStyle = COLOR_WHITE; this.ctx.fillText(timeStr, cx + 10, sy + 120);
            } else if (this.currentStateName === "SETTINGS") {
                this.ctx.fillStyle = COLOR_ARCADE_GREEN; this.ctx.font = getFont(15); this.ctx.textAlign = "center";
                ["CONTROLS", "SOUND", "RETRO CRT EFFECT", "CURSOR COLOR"].forEach((t, i) => {
                    let ys = [120, 190, 260, 330]; // Perfecte wiskundige afstanden (70px per blok)
                    this.ctx.fillText(t, cx, ys[i]);
                });
            } else if (this.currentStateName === "KEYBINDS") {
                this.ctx.fillStyle = COLOR_ARCADE_GREEN; this.ctx.font = getFont(15); this.ctx.textAlign = "center";
                ["MOVE UP", "MOVE DOWN", "MOVE LEFT", "MOVE RIGHT"].forEach((t, i) => this.ctx.fillText(t, cx, 160 + i * 60));
            } else if (this.currentStateName === "HOW_TO_PLAY") {
                this.ctx.fillStyle = COLOR_ARCADE_GREEN; this.ctx.font = getFont(16); this.ctx.textAlign = "center";
                this.ctx.fillText("GAMEPLAY", cx, 125); this.ctx.fillText("CONTROLS", cx, 201); this.ctx.fillText("EVOLUTION PHASES", cx, 293);
                
                this.ctx.fillStyle = COLOR_WHITE; this.ctx.font = getFont(13);
                ["SURVIVE 30-SECOND WAVES", "COLLECT ALGAE DROPPED BY ENEMIES", "BUY UPGRADES IN THE SHOP"].forEach((t, i) => this.ctx.fillText(t, cx, 145 + i * 16));
                ["MOVE: WASD/ZQSD OF PIJLTJES / LEFT JOYSTICK", "AIM: MOUSE / RIGHT JOYSTICK", "ATTACK: LEFT CLICK / RT", "DASH: SPACEBAR / B BUTTON"].forEach((t, i) => this.ctx.fillText(t, cx, 221 + i * 16));
                ["WAVE 1: EGG", "WAVE 4: TADPOLE", "WAVE 8: FROG", "WAVE 10: PRINCE"].forEach((t, i) => this.ctx.fillText(t, cx, 313 + i * 16));
            }

            this.uiElements.forEach(b => b.draw(this.ctx));
            this.cardElements.forEach(c => c.draw(this.ctx));
        }

        this.cursor.update(this.mouse, this.inputMethod === "CONTROLLER");
        this.crtEffect.draw(this.ctx);
        
        if (this.transitionAlpha > 0) {
            this.ctx.fillStyle = `rgba(0,0,0,${this.transitionAlpha / 255})`;
            this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        }
        
        this.cursor.draw(this.ctx, this.inputMethod === "CONTROLLER");
    }

    run() {
        const loop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

// Start Game
const game = new StateManager();
game.run();
