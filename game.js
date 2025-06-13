// Roll-a-Ball Game - Juan Gabriel
// 3D Web Game with Three.js

class RollABallGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.collectibles = [];
        this.obstacles = [];
        this.movingObstacles = [];
        this.currentLevel = 1;
        this.score = 0;
        this.totalCollectibles = 0;
        this.gameTime = 120;
        this.maxTime = 120;
        this.gameRunning = false;
        this.gameWon = false;
        this.musicEnabled = true;
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        this.cameraAngle = { horizontal: 0, vertical: 0.3 };
        
        // Physics
        this.playerVelocity = { x: 0, z: 0 };
        this.playerSpeed = 0.5;
        this.friction = 0.95;
        
        this.init();
    }
    
    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupScene();
        this.setupLights();
        this.setupEventListeners();
        this.showMainMenu();
        
        // Start game loop
        this.animate();
    }
    
    setupRenderer() {
        const canvas = document.getElementById('gameCanvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB, 1); // Sky blue
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.set(0, 10, 10);
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);
        
        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(0, 20, 0);
        this.scene.add(pointLight);
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
        
        // Mouse events
        document.addEventListener('mousemove', (event) => {
            if (this.gameRunning) {
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    createPlayer() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0xff4444,
            transparent: true,
            opacity: 0.9
        });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 0.5, 0);
        this.player.castShadow = true;
        this.scene.add(this.player);
        
        // Reset velocity
        this.playerVelocity = { x: 0, z: 0 };
    }
    
    createGround(width = 20, depth = 20) {
        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x00aa00,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        return ground;
    }
    
    createWalls(width = 20, depth = 20, height = 2) {
        const walls = [];
        const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        // Create 4 walls
        const positions = [
            { x: 0, y: height/2, z: depth/2 + 0.5, w: width + 1, h: height, d: 1 },
            { x: 0, y: height/2, z: -depth/2 - 0.5, w: width + 1, h: height, d: 1 },
            { x: width/2 + 0.5, y: height/2, z: 0, w: 1, h: height, d: depth + 1 },
            { x: -width/2 - 0.5, y: height/2, z: 0, w: 1, h: height, d: depth + 1 }
        ];
        
        positions.forEach(pos => {
            const geometry = new THREE.BoxGeometry(pos.w, pos.h, pos.d);
            const wall = new THREE.Mesh(geometry, material);
            wall.position.set(pos.x, pos.y, pos.z);
            wall.castShadow = true;
            wall.receiveShadow = true;
            this.scene.add(wall);
            walls.push(wall);
        });
        
        return walls;
    }
    
    createTriangleCollectible(x, z) {
        const geometry = new THREE.ConeGeometry(0.3, 0.8, 3);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.9
        });
        const triangle = new THREE.Mesh(geometry, material);
        triangle.position.set(x, 0.4, z);
        triangle.castShadow = true;
        triangle.userData.type = 'collectible';
        triangle.userData.collected = false;
        this.scene.add(triangle);
        this.collectibles.push(triangle);
        return triangle;
    }
    
    createCylinderCollectible(x, z) {
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.9
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(x, 0.4, z);
        cylinder.castShadow = true;
        cylinder.userData.type = 'collectible';
        cylinder.userData.collected = false;
        this.scene.add(cylinder);
        this.collectibles.push(cylinder);
        return cylinder;
    }
    
    createObstacle(x, z, width = 1, height = 2, depth = 1, color = 0x666666) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshLambertMaterial({ color: color });
        const obstacle = new THREE.Mesh(geometry, material);
        obstacle.position.set(x, height/2, z);
        obstacle.castShadow = true;
        obstacle.receiveShadow = true;
        obstacle.userData.type = 'obstacle';
        this.scene.add(obstacle);
        this.obstacles.push(obstacle);
        return obstacle;
    }
    
    createMovingObstacle(x, z, path) {
        const geometry = new THREE.SphereGeometry(0.8, 16, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const obstacle = new THREE.Mesh(geometry, material);
        obstacle.position.set(x, 0.8, z);
        obstacle.castShadow = true;
        obstacle.userData.type = 'movingObstacle';
        obstacle.userData.path = path;
        obstacle.userData.pathIndex = 0;
        obstacle.userData.direction = 1;
        this.scene.add(obstacle);
        this.movingObstacles.push(obstacle);
        return obstacle;
    }
    
    clearLevel() {
        // Remove player
        if (this.player) {
            this.scene.remove(this.player);
            this.player = null;
        }
        
        // Remove collectibles
        this.collectibles.forEach(obj => this.scene.remove(obj));
        this.collectibles = [];
        
        // Remove obstacles
        this.obstacles.forEach(obj => this.scene.remove(obj));
        this.obstacles = [];
        
        // Remove moving obstacles
        this.movingObstacles.forEach(obj => this.scene.remove(obj));
        this.movingObstacles = [];
        
        // Clear scene (keep lights)
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.type === 'Mesh' && !child.userData.isLight) {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => this.scene.remove(obj));
    }
    
    loadLevel(levelNumber) {
        this.clearLevel();
        this.currentLevel = levelNumber;
        this.score = 0;
        this.gameTime = this.maxTime;
        this.gameWon = false;
        
        switch(levelNumber) {
            case 1:
                this.loadLevel1();
                break;
            case 2:
                this.loadLevel2();
                break;
            case 3:
                this.loadLevel3();
                break;
            case 4:
                this.loadLevel4();
                break;
            case 5:
                this.loadLevel5();
                break;
            case 6:
                this.loadLevel6();
                break;
            case 7:
                this.loadLevel7(); // Maze level
                break;
            case 8:
                this.loadLevel8();
                break;
            case 9:
                this.loadLevel9(); // Moving obstacles level
                break;
            case 10:
                this.loadLevel10();
                break;
            default:
                this.loadLevel1();
        }
        
        this.totalCollectibles = this.collectibles.length;
        this.updateUI();
    }
    
    loadLevel1() {
        // Basic level
        this.createGround(20, 20);
        this.createWalls(20, 20);
        this.createPlayer();
        
        // Simple collectibles pattern
        this.createTriangleCollectible(-5, -5);
        this.createCylinderCollectible(5, -5);
        this.createTriangleCollectible(-5, 5);
        this.createCylinderCollectible(5, 5);
        this.createTriangleCollectible(0, 0);
    }
    
    loadLevel2() {
        this.createGround(25, 25);
        this.createWalls(25, 25);
        this.createPlayer();
        
        // More collectibles
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i === 1 && j === 1) continue; // Skip center
                const x = (i - 1) * 8;
                const z = (j - 1) * 8;
                if ((i + j) % 2 === 0) {
                    this.createTriangleCollectible(x, z);
                } else {
                    this.createCylinderCollectible(x, z);
                }
            }
        }
    }
    
    loadLevel3() {
        this.createGround(30, 30);
        this.createWalls(30, 30);
        this.createPlayer();
        
        // Add some obstacles
        this.createObstacle(-8, 0, 2, 3, 2);
        this.createObstacle(8, 0, 2, 3, 2);
        this.createObstacle(0, -8, 2, 3, 2);
        this.createObstacle(0, 8, 2, 3, 2);
        
        // Collectibles around obstacles
        this.createTriangleCollectible(-12, -12);
        this.createCylinderCollectible(12, -12);
        this.createTriangleCollectible(-12, 12);
        this.createCylinderCollectible(12, 12);
        this.createTriangleCollectible(0, 0);
        this.createCylinderCollectible(-6, 0);
        this.createTriangleCollectible(6, 0);
    }
    
    loadLevel4() {
        this.createGround(35, 35);
        this.createWalls(35, 35);
        this.createPlayer();
        
        // Cross pattern obstacles
        for (let i = -2; i <= 2; i++) {
            if (i !== 0) {
                this.createObstacle(i * 4, 0, 1.5, 4, 1.5);
                this.createObstacle(0, i * 4, 1.5, 4, 1.5);
            }
        }
        
        // Collectibles in corners and strategic positions
        this.createTriangleCollectible(-15, -15);
        this.createCylinderCollectible(15, -15);
        this.createTriangleCollectible(-15, 15);
        this.createCylinderCollectible(15, 15);
        this.createTriangleCollectible(-2, -2);
        this.createCylinderCollectible(2, -2);
        this.createTriangleCollectible(-2, 2);
        this.createCylinderCollectible(2, 2);
    }
    
    loadLevel5() {
        this.createGround(40, 30);
        this.createWalls(40, 30);
        this.createPlayer();
        
        // Spiral pattern obstacles (moved away from player start position)
        const spiralPoints = [
            {x: 3, z: 0}, {x: 3, z: 3}, {x: -3, z: 3},
            {x: -3, z: -3}, {x: 6, z: -3}, {x: 6, z: 6}, {x: -6, z: 6},
            {x: -6, z: -6}, {x: 9, z: -6}, {x: 9, z: 9}, {x: -9, z: 9}
        ];
        
        spiralPoints.forEach(point => {
            this.createObstacle(point.x, point.z, 1, 2, 1);
        });
        
        // Collectibles between obstacles (keeping player spawn area clear)
        this.createTriangleCollectible(-18, -12);
        this.createCylinderCollectible(18, -12);
        this.createTriangleCollectible(-18, 12);
        this.createCylinderCollectible(18, 12);
        this.createTriangleCollectible(1.5, 1.5);
        this.createCylinderCollectible(-1.5, -1.5);
        this.createTriangleCollectible(4.5, -1.5);
        this.createCylinderCollectible(-4.5, 4.5);
        this.createTriangleCollectible(7.5, 1.5);
    }
    
    loadLevel6() {
        this.createGround(45, 35);
        this.createWalls(45, 35);
        this.createPlayer();
        
        // Random obstacles pattern
        const obstaclePositions = [
            {x: -15, z: -10}, {x: -8, z: -12}, {x: 0, z: -8}, {x: 8, z: -10}, {x: 15, z: -5},
            {x: -12, z: 0}, {x: -4, z: 2}, {x: 4, z: -2}, {x: 12, z: 3},
            {x: -18, z: 8}, {x: -6, z: 10}, {x: 2, z: 12}, {x: 10, z: 8}, {x: 18, z: 12}
        ];
        
        obstaclePositions.forEach(pos => {
            this.createObstacle(pos.x, pos.z, 1.5, 3, 1.5, 0x444444);
        });
        
        // Scattered collectibles
        for (let i = 0; i < 12; i++) {
            let x, z;
            let validPosition = false;
            let attempts = 0;
            
            while (!validPosition && attempts < 50) {
                x = (Math.random() - 0.5) * 40;
                z = (Math.random() - 0.5) * 30;
                
                validPosition = true;
                // Check distance from obstacles
                obstaclePositions.forEach(obs => {
                    const dist = Math.sqrt((x - obs.x) ** 2 + (z - obs.z) ** 2);
                    if (dist < 3) validPosition = false;
                });
                
                // Check distance from player start
                const playerDist = Math.sqrt(x ** 2 + z ** 2);
                if (playerDist < 2) validPosition = false;
                
                attempts++;
            }
            
            if (validPosition) {
                if (i % 2 === 0) {
                    this.createTriangleCollectible(x, z);
                } else {
                    this.createCylinderCollectible(x, z);
                }
            }
        }
    }
    
    loadLevel7() {
        // MAZE LEVEL
        this.createGround(50, 50);
        this.createWalls(50, 50);
        this.createPlayer();
        
        // Create maze walls
        const mazeWalls = [
            // Outer maze structure
            {x: -20, z: 0, w: 1, h: 3, d: 40}, // Left wall
            {x: 20, z: 0, w: 1, h: 3, d: 40},  // Right wall
            {x: 0, z: -20, w: 40, h: 3, d: 1}, // Bottom wall
            {x: 0, z: 20, w: 40, h: 3, d: 1},  // Top wall
            
            // Internal maze walls
            {x: -15, z: -10, w: 1, h: 3, d: 20},
            {x: -10, z: 5, w: 20, h: 3, d: 1},
            {x: 0, z: -15, w: 1, h: 3, d: 10},
            {x: 10, z: -5, w: 1, h: 3, d: 20},
            {x: 5, z: 10, w: 10, h: 3, d: 1},
            {x: -5, z: 0, w: 10, h: 3, d: 1},
            {x: 15, z: 10, w: 1, h: 3, d: 10},
            {x: -8, z: -8, w: 6, h: 3, d: 1},
            {x: 2, z: 3, w: 1, h: 3, d: 6},
        ];
        
        mazeWalls.forEach(wall => {
            const geometry = new THREE.BoxGeometry(wall.w, wall.h, wall.d);
            const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(wall.x, wall.h/2, wall.z);
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            obstacle.userData.type = 'obstacle';
            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        });
        
        // Collectibles in maze
        this.createTriangleCollectible(-18, -18);
        this.createCylinderCollectible(18, -18);
        this.createTriangleCollectible(-18, 18);
        this.createCylinderCollectible(18, 18);
        this.createTriangleCollectible(-13, -5);
        this.createCylinderCollectible(3, -12);
        this.createTriangleCollectible(8, 8);
        this.createCylinderCollectible(-3, 8);
        this.createTriangleCollectible(13, -2);
        this.createCylinderCollectible(-8, 15);
    }
    
    loadLevel8() {
        this.createGround(55, 40);
        this.createWalls(55, 40);
        this.createPlayer();
        
        // Complex obstacle pattern
        for (let i = -6; i <= 6; i++) {
            for (let j = -4; j <= 4; j++) {
                if ((i + j) % 3 === 0 && Math.abs(i) + Math.abs(j) > 2) {
                    this.createObstacle(i * 4, j * 4, 1.5, 4, 1.5, 0x333333);
                }
            }
        }
        
        // Collectibles in safe zones
        this.createTriangleCollectible(-25, -18);
        this.createCylinderCollectible(25, -18);
        this.createTriangleCollectible(-25, 18);
        this.createCylinderCollectible(25, 18);
        this.createTriangleCollectible(-2, -2);
        this.createCylinderCollectible(2, 2);
        this.createTriangleCollectible(-10, 6);
        this.createCylinderCollectible(10, -6);
        this.createTriangleCollectible(6, 10);
        this.createCylinderCollectible(-6, -10);
        this.createTriangleCollectible(14, 2);
        this.createCylinderCollectible(-14, -2);
    }
    
    loadLevel9() {
        // MOVING OBSTACLES LEVEL
        this.createGround(60, 45);
        this.createWalls(60, 45);
        this.createPlayer();
        
        // Static obstacles
        this.createObstacle(-20, 0, 2, 3, 2);
        this.createObstacle(20, 0, 2, 3, 2);
        this.createObstacle(0, -15, 2, 3, 2);
        this.createObstacle(0, 15, 2, 3, 2);
        
        // Moving obstacles with different paths
        this.createMovingObstacle(-10, -10, [
            {x: -10, z: -10}, {x: 10, z: -10}, {x: 10, z: 10}, {x: -10, z: 10}
        ]);
        
        this.createMovingObstacle(15, -5, [
            {x: 15, z: -5}, {x: 15, z: 5}, {x: 25, z: 5}, {x: 25, z: -5}
        ]);
        
        this.createMovingObstacle(-15, 8, [
            {x: -15, z: 8}, {x: -25, z: 8}, {x: -25, z: 18}, {x: -15, z: 18}
        ]);
        
        // Collectibles
        this.createTriangleCollectible(-28, -20);
        this.createCylinderCollectible(28, -20);
        this.createTriangleCollectible(-28, 20);
        this.createCylinderCollectible(28, 20);
        this.createTriangleCollectible(0, 0);
        this.createCylinderCollectible(-5, -20);
        this.createTriangleCollectible(5, 20);
        this.createCylinderCollectible(-25, 0);
        this.createTriangleCollectible(25, -10);
        this.createCylinderCollectible(0, -8);
        this.createTriangleCollectible(12, 12);
        this.createCylinderCollectible(-12, -12);
    }
    
    loadLevel10() {
        // FINAL BOSS LEVEL
        this.createGround(70, 50);
        this.createWalls(70, 50);
        this.createPlayer();
        
        // Complex maze + moving obstacles
        const finalWalls = [
            {x: -30, z: 0, w: 1, h: 4, d: 30},
            {x: 30, z: 0, w: 1, h: 4, d: 30},
            {x: -15, z: -20, w: 30, h: 4, d: 1},
            {x: 15, z: 20, w: 30, h: 4, d: 1},
            {x: 0, z: -10, w: 1, h: 4, d: 20},
            {x: -20, z: 10, w: 20, h: 4, d: 1},
            {x: 20, z: -10, w: 20, h: 4, d: 1},
            {x: -10, z: 0, w: 1, h: 4, d: 20},
            {x: 10, z: 5, w: 1, h: 4, d: 10},
        ];
        
        finalWalls.forEach(wall => {
            const geometry = new THREE.BoxGeometry(wall.w, wall.h, wall.d);
            const material = new THREE.MeshLambertMaterial({ color: 0x660000 });
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(wall.x, wall.h/2, wall.z);
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            obstacle.userData.type = 'obstacle';
            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        });
        
        // Multiple moving obstacles
        this.createMovingObstacle(-25, -15, [
            {x: -25, z: -15}, {x: -5, z: -15}, {x: -5, z: 5}, {x: -25, z: 5}
        ]);
        
        this.createMovingObstacle(25, 15, [
            {x: 25, z: 15}, {x: 5, z: 15}, {x: 5, z: -5}, {x: 25, z: -5}
        ]);
        
        this.createMovingObstacle(0, -20, [
            {x: 0, z: -20}, {x: -15, z: -20}, {x: -15, z: -5}, {x: 0, z: -5}
        ]);
        
        // Many collectibles scattered throughout
        const collectiblePositions = [
            {x: -32, z: -22, type: 'triangle'},
            {x: 32, z: -22, type: 'cylinder'},
            {x: -32, z: 22, type: 'triangle'},
            {x: 32, z: 22, type: 'cylinder'},
            {x: -25, z: -8, type: 'cylinder'},
            {x: 25, z: 8, type: 'triangle'},
            {x: -8, z: -18, type: 'triangle'},
            {x: 8, z: 18, type: 'cylinder'},
            {x: -18, z: 2, type: 'triangle'},
            {x: 18, z: -2, type: 'cylinder'},
            {x: -2, z: 12, type: 'triangle'},
            {x: 2, z: -12, type: 'cylinder'},
            {x: -12, z: -12, type: 'triangle'},
            {x: 12, z: 12, type: 'cylinder'},
            {x: 28, z: 0, type: 'triangle'},
        ];
        
        collectiblePositions.forEach(pos => {
            if (pos.type === 'triangle') {
                this.createTriangleCollectible(pos.x, pos.z);
            } else {
                this.createCylinderCollectible(pos.x, pos.z);
            }
        });
    }
    
    updatePlayer() {
        if (!this.gameRunning || !this.player) return;
        
        // Handle input
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.playerVelocity.z -= this.playerSpeed * 0.1;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.playerVelocity.z += this.playerSpeed * 0.1;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.playerVelocity.x -= this.playerSpeed * 0.1;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.playerVelocity.x += this.playerSpeed * 0.1;
        }
        
        // Apply friction
        this.playerVelocity.x *= this.friction;
        this.playerVelocity.z *= this.friction;
        
        // Limit velocity
        const maxVel = 0.3;
        this.playerVelocity.x = Math.max(-maxVel, Math.min(maxVel, this.playerVelocity.x));
        this.playerVelocity.z = Math.max(-maxVel, Math.min(maxVel, this.playerVelocity.z));
        
        // Update position
        const newX = this.player.position.x + this.playerVelocity.x;
        const newZ = this.player.position.z + this.playerVelocity.z;
        
        // Collision detection with walls and obstacles
        if (!this.checkCollision(newX, newZ)) {
            this.player.position.x = newX;
            this.player.position.z = newZ;
        } else {
            // Stop velocity on collision
            this.playerVelocity.x = 0;
            this.playerVelocity.z = 0;
        }
        
        // Rotate player based on movement
        if (Math.abs(this.playerVelocity.x) > 0.01 || Math.abs(this.playerVelocity.z) > 0.01) {
            this.player.rotation.x += this.playerVelocity.z * 2;
            this.player.rotation.z -= this.playerVelocity.x * 2;
        }
    }
    
    checkCollision(x, z) {
        const playerRadius = 0.5;
        
        // Check collision with obstacles
        for (let obstacle of this.obstacles) {
            const pos = obstacle.position;
            const scale = obstacle.scale;
            const geometry = obstacle.geometry;
            
            // Simple box collision
            const halfWidth = (geometry.parameters.width || 1) * scale.x / 2;
            const halfDepth = (geometry.parameters.depth || 1) * scale.z / 2;
            
            if (x + playerRadius > pos.x - halfWidth &&
                x - playerRadius < pos.x + halfWidth &&
                z + playerRadius > pos.z - halfDepth &&
                z - playerRadius < pos.z + halfDepth) {
                return true;
            }
        }
        
        // Check collision with moving obstacles
        for (let obstacle of this.movingObstacles) {
            const pos = obstacle.position;
            const dist = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2);
            if (dist < playerRadius + 0.8) {
                return true;
            }
        }
        
        return false;
    }
    
    updateMovingObstacles() {
        this.movingObstacles.forEach(obstacle => {
            const path = obstacle.userData.path;
            const pathIndex = obstacle.userData.pathIndex;
            const direction = obstacle.userData.direction;
            
            if (path && path.length > 1) {
                const target = path[pathIndex];
                const current = obstacle.position;
                
                const dx = target.x - current.x;
                const dz = target.z - current.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                if (distance < 0.5) {
                    // Reached target, move to next point
                    let nextIndex = pathIndex + direction;
                    if (nextIndex >= path.length) {
                        nextIndex = path.length - 1;
                        obstacle.userData.direction = -1;
                    } else if (nextIndex < 0) {
                        nextIndex = 0;
                        obstacle.userData.direction = 1;
                    }
                    obstacle.userData.pathIndex = nextIndex;
                } else {
                    // Move towards target
                    const speed = 0.02;
                    obstacle.position.x += (dx / distance) * speed;
                    obstacle.position.z += (dz / distance) * speed;
                }
                
                // Rotate obstacle
                obstacle.rotation.y += 0.1;
            }
        });
    }
    
    updateCollectibles() {
        if (!this.player) return;
        
        this.collectibles.forEach(collectible => {
            if (collectible.userData.collected) return;
            
            // Animate collectibles
            collectible.rotation.y += 0.05;
            collectible.position.y = 0.4 + Math.sin(Date.now() * 0.005 + collectible.position.x) * 0.1;
            
            // Check collision with player
            const dist = Math.sqrt(
                (this.player.position.x - collectible.position.x) ** 2 +
                (this.player.position.z - collectible.position.z) ** 2
            );
            
            if (dist < 1) {
                collectible.userData.collected = true;
                this.score++;
                this.scene.remove(collectible);
                this.playCollectSound();
                
                // Check win condition
                if (this.score >= this.totalCollectibles) {
                    this.winLevel();
                }
            }
        });
    }
    
    updateCamera() {
        if (!this.player) return;
        
        // Follow player with offset
        const offset = new THREE.Vector3(0, 8, 8);
        const targetPosition = this.player.position.clone().add(offset);
        
        this.camera.position.lerp(targetPosition, 0.05);
        this.camera.lookAt(this.player.position);
    }
    
    updateTimer() {
        if (!this.gameRunning) return;
        
        this.gameTime -= 1/60;
        
        if (this.gameTime <= 0) {
            this.gameTime = 0;
            this.loseGame();
        }
        
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('score').textContent = this.score;
        document.getElementById('totalCollectibles').textContent = this.totalCollectibles;
        document.getElementById('timer').textContent = Math.ceil(this.gameTime);
        
        // Update timer progress bar
        const progress = (this.gameTime / this.maxTime) * 100;
        document.getElementById('timerProgress').style.width = progress + '%';
    }
    
    winLevel() {
        this.gameRunning = false;
        this.gameWon = true;
        this.stopBackgroundMusic();
        this.playWinSound();
        
        document.getElementById('winMessage').style.display = 'block';
        
        // Auto return to menu after 5 seconds
        setTimeout(() => {
            document.getElementById('winMessage').style.display = 'none';
            this.showMainMenu();
        }, 5000);
    }
    
    loseGame() {
        this.gameRunning = false;
        this.stopBackgroundMusic();
        this.playLoseSound();
        
        document.getElementById('loseMessage').style.display = 'block';
        
        // Auto return to menu after 3 seconds
        setTimeout(() => {
            document.getElementById('loseMessage').style.display = 'none';
            this.showMainMenu();
        }, 3000);
    }
    
    showMainMenu() {
        this.gameRunning = false;
        document.getElementById('mainMenu').style.display = 'block';
        document.getElementById('gameStats').style.display = 'none';
        this.clearLevel();
    }
    
    hideMainMenu() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameStats').style.display = 'block';
    }
    
    startGame(level) {
        this.hideMainMenu();
        this.loadLevel(level);
        this.gameRunning = true;
        this.playBackgroundMusic();
    }
    
    playBackgroundMusic() {
        if (this.musicEnabled) {
            const music = document.getElementById('backgroundMusic');
            music.volume = 0.3; // Set volume to 30%
            music.currentTime = 0; // Start from beginning
            music.play().catch(e => {
                this.createAmbientSound();
            });
        }
    }
    
    stopBackgroundMusic() {
        const music = document.getElementById('backgroundMusic');
        music.pause();
        music.currentTime = 0;
    }
    
    createAmbientSound() {
        if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
            return; // No Web Audio API support
        }
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create ambient drone
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.frequency.setValueAtTime(110, audioContext.currentTime); // Low A
            oscillator2.frequency.setValueAtTime(165, audioContext.currentTime); // Low E
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (this.musicEnabled && this.gameRunning) {
                oscillator1.start();
                oscillator2.start();
                
                // Stop after a while and restart for looping effect
                setTimeout(() => {
                    oscillator1.stop();
                    oscillator2.stop();
                    if (this.gameRunning && this.musicEnabled) {
                        this.createAmbientSound();
                    }
                }, 10000);
            }
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playCollectSound() {
        this.createToneSound(800, 0.1, 'sine');
    }
    
    playWinSound() {
        this.createToneSound(523, 0.3, 'square'); // C note
        setTimeout(() => this.createToneSound(659, 0.3, 'square'), 200); // E note
        setTimeout(() => this.createToneSound(784, 0.5, 'square'), 400); // G note
    }
    
    playLoseSound() {
        this.createToneSound(200, 0.5, 'sawtooth');
    }
    
    createToneSound(frequency, duration, type = 'sine') {
        if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
            return;
        }
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.gameRunning) {
            this.updatePlayer();
            this.updateMovingObstacles();
            this.updateCollectibles();
            this.updateCamera();
            this.updateTimer();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Global functions for UI
let game;

function startLevel(level) {
    if (!game) {
        game = new RollABallGame();
    }
    game.startGame(level);
}

function showOptions() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('optionsMenu').style.display = 'block';
}

function hideOptions() {
    document.getElementById('optionsMenu').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
}

function toggleMusic() {
    if (!game) {
        game = new RollABallGame();
    }
    game.musicEnabled = !game.musicEnabled;
    document.getElementById('musicStatus').textContent = game.musicEnabled ? 'ON' : 'OFF';
    
    if (game.musicEnabled && game.gameRunning) {
        game.playBackgroundMusic();
    } else {
        game.stopBackgroundMusic();
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    game = new RollABallGame();
}); 