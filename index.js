import * as THREE from './node_modules/three/build/three.module.js';

class Collision
{
    constructor(type, mesh, r, w, h)
    {
        this.type = type;
        this.mesh = mesh;
        this.r = r;
        this.w = w;
        this.h = h;
    }
}

class CannonBall
{
    constructor({
        mesh = undefined,
        speed = 0.1,
        velocity = new THREE.Vector3(0, 0, 0),
        angle = 0,
        cannonTimer = 2500,

    })
    {
        this.mesh = mesh;
        this.speed = speed;
        this.velocity = velocity;
        this.angle = angle;
        this.cannonTimer = cannonTimer;
    }

    Play(timeDelta)
    {   
        this.mesh.position.x += this.velocity.x*timeDelta;
        this.mesh.position.y += this.velocity.y*timeDelta;
      //  console.log("cannontimer: " + this.cannonTimer);
        this.cannonTimer = this.cannonTimer-timeDelta;
        
       // console.log("cannontimer: " + this.cannonTimer);

        if (this.cannonTimer < 0) {
            //this.isShootMid = false;
            scene.remove(this.mesh);
            return 0;
        }
        return 1;
    }
}

class Ship 
{
    constructor({
        mesh = undefined, 
        speed = 1, 
        angle = 0, 
        velocity = new THREE.Vector3(0, 0, 0), 
        collision = undefined, 
        isCollision = false, 
        collisionRadius = 0,
        accelerate = false,
        decelerate = false,
        turnLeft = false,
        turnRight = false,
        cannon = [],
        isShootMid = false,
        currentCollider = undefined,
        isCooldownMid = false,
        timeCoolDownMid = 1000,
        cooldownMidTimer = 1000
    }
    ){
        this.mesh = mesh;
        this.speed = speed;
        this.angle = angle; // alpha
        this.velocity = velocity; // vx, vy
        this.collision = collision; 
        this.isCollision = isCollision; 
        this.collisionRadius = collisionRadius; // collision radius of current collider
        this.accelerate = accelerate;
        this.decelerate = decelerate;
        this.turnLeft = turnLeft;
        this.turnRight = turnRight;
        this.cannon = cannon;
        this.isShootMid = isShootMid;
        this.currentCollider = currentCollider;
        this.isCooldownMid = isCooldownMid;
        this.timeCooldownMid = timeCoolDownMid;
        this.cooldownMidTimer = cooldownMidTimer;
        
    }

    set collisionObject (collision) {
        this.collision = collision;
    }
    get collisionObject () {
        return this.collision;
    }
    
    GetSpeed() 
    {
	    if (this.accelerate) 
		    return this.speed*1.5;
	    if (this.decelerate)
		    return this.speed*0.5;
	    return this.speed;	
    }


    MoveShip(timeDelta)
    {
	    const playerSpeed = this.GetSpeed();
	//playerAngleMoved -= playerSpeed * timeDelta;
        const runSpeed = playerSpeed * timeDelta;
        this.TurnProcess();
        this.RunProcess(runSpeed);
    }

    TurnProcess()
    {
        if (this.turnLeft)
        {
            this.mesh.rotation.z += 0.01;
            this.collision.mesh.rotation.z += 0.01;
            this.angle -= 0.01;
        }
        else 
        if (this.turnRight)
        {
            this.mesh.rotation.z -= 0.01;
            this.collision.mesh.rotation.z -= 0.01;
            this.angle += 0.01;
        }
    }

    RunProcess(runSpeed)
    {
        if (runSpeed == 0) 
            return;
        this.velocity.x = runSpeed*Math.cos(-this.angle);
        this.velocity.y = runSpeed*Math.sin(-this.angle);

        let shipCollisionPosition = new THREE.Vector3();
        this.collision.mesh.getWorldPosition( shipCollisionPosition);

	    const nextPosisionX = shipCollisionPosition.x + this.velocity.x; // nextPossition of collision
	    const nextPosisionY = shipCollisionPosition.y + this.velocity.y;


	    if (this.isCollision)
        {
            let collisionPosition = new THREE.Vector3(); // create once an reuse it
             this.currentCollider.mesh.getWorldPosition( collisionPosition );  
            //console.log(collisionPosition.x + " " + collisionPosition.y);   
		    if (Distance(nextPosisionX, nextPosisionY, collisionPosition.x, collisionPosition.y) < this.collisionRadius)
		    {
		
			    return;
		    }
        }
        this.mesh.position.x += this.velocity.x;
        this.mesh.position.y += this.velocity.y;    
        this.collision.mesh.position.x += this.velocity.x;
        this.collision.mesh.position.y += this.velocity.y;

    }

    ShipColliderCheck()
    {
	    let collisionR;
	    let foundCollider = false;
	    map.forEach((tile) => {
		    tile.collider.forEach((collision) => {
                let collisionPosition = new THREE.Vector3(); // create once an reuse it
                collision.mesh.getWorldPosition( collisionPosition ); 

                let shipCollisionPosition = new THREE.Vector3();
                this.collision.mesh.getWorldPosition( shipCollisionPosition);
             // console.log("mp: " + collisionPosition.x + " " + collisionPosition.y);
			    collisionR = Distance(
                   shipCollisionPosition.x, shipCollisionPosition.y, 
                    collisionPosition.x, collisionPosition.y
              );
			
		    	if (collisionR<this.collision.r+collision.r)
		    	{
			    	console.log("CollisionDetect");
			    	this.isCollision = true;
			    	this.collisionRadius = collisionR;
			    	this.currentCollider = collision;
			    	foundCollider = true;
		    	}
			    else 
			    {
				//console.log(playerShip.position.x);
			    }
		    })
		
	    })
	    if (!foundCollider)
	    {
	    	this.isCollision = false;
	    }
    }

    ShootMid(timeDelta)
    {

        if (this.isShootMid){
            if (!this.isCooldownMid)
            {
                const plasmaBall = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 4), new THREE.MeshBasicMaterial({
                    color: "aqua"
                  }));
                plasmaBall.position.z = 43;
                let cannonAngle = this.angle;
                plasmaBall.position.x = this.mesh.position.x + 90* Math.cos(-this.angle);
                plasmaBall.position.y = this.mesh.position.y + 90* Math.sin(-this.angle);
       
                console.log("plasmalBallx: "+ plasmaBall.position.x + ",plasmalBally: " + plasmaBall.position.y);
                const cannonTimer = timeCannonMid;
                let cannonBall = new CannonBall({
                    mesh: plasmaBall,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall.mesh);
                playerCannonBall.push(cannonBall);
              
                this.isCooldownMid = true;
                this.cooldownMidTimer = this.timeCooldownMid;
            }
            this.isShootMid = false;
        }
    }

    CoolDownMid(timeDelta)
    {
        if (this.isCooldownMid)
        {
            this.cooldownMidTimer -= timeDelta;
            if (this.cooldownMidTimer<0)
            {
                this.isCooldownMid = false;
            }
        }
        
    }

    
}


const scene = new THREE.Scene();
const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];

// camera
/*
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 
	75, // vertical field of view
	aspectRatio, // aspect ratio
	10, // near plane
	1000 // far plane
);
*/

const aspectRatio = window.innerWidth/ window.innerHeight;
const cameraWidth = 860;
const cameraHeight = cameraWidth/ aspectRatio;
const camera = new THREE.OrthographicCamera(
	cameraWidth / -2, // left
	cameraWidth / 2, // right
	cameraHeight / 2, // top
	cameraHeight / -2, // bottom
	0, // near plane
	1000 // far plane
)


camera.position.set(0, -210, 300);
//camera.up.set(0, 0, 1);

camera.lookAt(0, 0, 0);


const playerShip = Ship1();

//const playerAngleInitial = Math.PI;
const speed = 0.035;
//const speed = 0.1; // increase speed for testing
const playerRadius = 29; // used for collision
let isCollision = false;
let currentCollision; // player collider with
let collisionRadius = 0; // conllision radius
let playerCollisionMesh = createCollision(0, 0, 40, playerRadius,32);
let playerCollision = new Collision(0, playerCollisionMesh, playerRadius, 0, 0 );

let playerCannonBall = [];

let enemyCannonBall = [];

console.log("col: " + playerCollisionMesh.position.x);
scene.add(playerShip);


let player = new Ship({
    mesh: playerShip, speed: speed, collision: playerCollision
});

scene.add(player.collision.mesh);
//player.collisionObject = playerCollision;
console.log(player.collision);
let shipCollisionPosition = new THREE.Vector3();
player.collision.mesh.getWorldPosition( shipCollisionPosition);

console.log("playerCollision: " + shipCollisionPosition.x + " " + shipCollisionPosition.y);


//Set up Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);
                    

const trackRadius = 225;
const trackWidth = 45;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

const arcAngle1 = (1/3) * Math.PI; // 60 degrees;
const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

const arcCenterX = (Math.cos(arcAngle1)* innerTrackRadius + Math.cos(arcAngle2)*outerTrackRadius) / 2;

const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);

const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

let map = [];
const tileMapSize = 1000;
const neighborTilesX = [tileMapSize, tileMapSize, tileMapSize, 0, 0, -tileMapSize, -tileMapSize, -tileMapSize];
const neighborTilesY = [tileMapSize, 0, -tileMapSize, tileMapSize, -tileMapSize, tileMapSize, 0, -tileMapSize];
const neighborTilesI = [1, 1, 1, 0, 0, -1, -1, -1];
const neighborTilesJ = [1, 0, -1, 1, -1, 1, 0, -1];

let generator = new Array(1000);

for (let i = 0; i < generator.length; i++) 
{
  generator[i] = new Array(1000);
  for (let j = 0; j < generator[i].length; j++)
  {
	  generator[i][j] = 0;
  }
}
console.log(generator[500][500]);

renderMap(cameraWidth, cameraHeight);
UpdateMap(tileMapSize);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.render(scene, camera);


document.body.appendChild( renderer.domElement );

let ready;
let playerAngleMoved;
let score;
const scoreElement = document.getElementById("score");
let otherVehicles = [];

let lastTimestamp;
let cannonSpeed = 0.2;
let timeCannonMid = 1500;

reset ();

window.addEventListener("mousedown", onMouseDown);

function onMouseDown() {
    player.isShootMid = true;
    //plasmaBall.quaternion.copy(camera.quaternion); // apply camera's quaternion
    //scene.add(plasmaBall);
    //plasmaBalls.push(plasmaBall);
}

window.addEventListener("keydown", function (event){
	if (event.key =="ArrowUp") {
		startGame();
		player.accelerate = true;
		return;
	}

	if (event.key =="ArrowDown") {
		player.decelerate = true;
		return;
	}

    if (event.key =="ArrowLeft") {
        player.turnLeft = true;
        return;
    }

    if (event.key =="ArrowRight") {
        player.turnRight = true;
    }

	if (event.key =="R" || event.key=="r") {
		reset();
		return;
	}
});

window.addEventListener("keyup", function (event){
	if (event.key =="ArrowUp") 
	{
		player.accelerate = false;
		return;
	}

	if (event.key =="ArrowDown")
	{
		player.decelerate = false;
		return;
	}

    if (event.key =="ArrowLeft") {
        player.turnLeft = false;
        return;
    }

    if (event.key =="ArrowRight") {
        player.turnRight = false;
    }

});

renderer.render(scene, camera );






function reset()
{
	//playerAngleMoved = 0;
    player.MoveShip(0);
	score = 0;
	scoreElement.innerText = score;
	lastTimestamp = undefined;
/*
	//Remove other vehicles
	otherVehicles.forEach((vehicle) => {
		scene.remove(vehicle.mesh);
	});

	otherVehicles = [];
    */
	renderer.render(scene, camera);
	ready = true;
}

function startGame() 
{
	if (ready)
	{
		ready = false;
		renderer.setAnimationLoop(animation);
	}
}

/// ANIMATION LOOP
function animation(timestamp) 
{
	
	if (!lastTimestamp)
	{
		lastTimestamp = timestamp;
		return;
	}
	const timeDelta = timestamp - lastTimestamp;

    player.ShipColliderCheck();
	player.MoveShip(timeDelta);
    camera.position.x = playerShip.position.x;
	camera.position.y = playerShip.position.y - 210;
    player.ShootMid(timeDelta);
	player.CoolDownMid(timeDelta);

    PlayerCannonBallProcess(timeDelta);

	UpdateMap(tileMapSize);

/*	const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI *2));

	if (laps != score)
	{
		score = laps;
		scoreElement.innerText = score;
	}
    */
/*	
	if (otherVehicles.length < (laps + 1)/ 5)
	{
		addVehicles();
	}

	moveOtherVehicles(timeDelta);
	hitDetection();
    */

	renderer.render(scene, camera);
	lastTimestamp = timestamp;
}


function PlayerCannonBallProcess(timeDelta)
{
    playerCannonBall.forEach((cannonBall) => {
        const alive = cannonBall.Play(timeDelta);
        if (alive == 0)
            playerCannonBall.splice(cannonBall, 1);
    })
}

function getHitZonePosition(center, angle, clockwise, distance) {
	const directionAngle = angle + clockwise ? -Math.PI / 2 : +Math.PI / 2;
	return {
	  x: center.x + Math.cos(directionAngle) * distance,
	  y: center.y + Math.sin(directionAngle) * distance
	};
  }
  
  function hitDetection() {
	const playerHitZone1 = getHitZonePosition(
	  playerShip.position,
	  playerAngleInitial + playerAngleMoved,
	  true,
	  15
	);
  
	const playerHitZone2 = getHitZonePosition(
	  playerShip.position,
	  playerAngleInitial + playerAngleMoved,
	  true,
	  -15
	);
  
	/*
	if (config.showHitZones) {
	  playerShip.userData.hitZone1.position.x = playerHitZone1.x;
	  playerShip.userData.hitZone1.position.y = playerHitZone1.y;
  
	  playerShip.userData.hitZone2.position.x = playerHitZone2.x;
	  playerShip.userData.hitZone2.position.y = playerHitZone2.y;
	}
	*/
  
	const hit = otherVehicles.some((vehicle) => {
	  if (vehicle.type == "car") {
		const vehicleHitZone1 = getHitZonePosition(
		  vehicle.mesh.position,
		  vehicle.angle,
		  vehicle.clockwise,
		  15
		);
  
		const vehicleHitZone2 = getHitZonePosition(
		  vehicle.mesh.position,
		  vehicle.angle,
		  vehicle.clockwise,
		  -15
		);
  /*
		if (config.showHitZones) {
		  vehicle.mesh.userData.hitZone1.position.x = vehicleHitZone1.x;
		  vehicle.mesh.userData.hitZone1.position.y = vehicleHitZone1.y;
  
		  vehicle.mesh.userData.hitZone2.position.x = vehicleHitZone2.x;
		  vehicle.mesh.userData.hitZone2.position.y = vehicleHitZone2.y;
		}
		*/
  
		// The player hits another vehicle
		if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
		if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;
  
		// Another vehicle hits the player
		if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
	  }
  
	  if (vehicle.type == "truck") {
		const vehicleHitZone1 = getHitZonePosition(
		  vehicle.mesh.position,
		  vehicle.angle,
		  vehicle.clockwise,
		  35
		);
  
		const vehicleHitZone2 = getHitZonePosition(
		  vehicle.mesh.position,
		  vehicle.angle,
		  vehicle.clockwise,
		  0
		);
  
		const vehicleHitZone3 = getHitZonePosition(
		  vehicle.mesh.position,
		  vehicle.angle,
		  vehicle.clockwise,
		  -35
		);
  /*
		if (config.showHitZones) {
		  vehicle.mesh.userData.hitZone1.position.x = vehicleHitZone1.x;
		  vehicle.mesh.userData.hitZone1.position.y = vehicleHitZone1.y;
  
		  vehicle.mesh.userData.hitZone2.position.x = vehicleHitZone2.x;
		  vehicle.mesh.userData.hitZone2.position.y = vehicleHitZone2.y;
  
		  vehicle.mesh.userData.hitZone3.position.x = vehicleHitZone3.x;
		  vehicle.mesh.userData.hitZone3.position.y = vehicleHitZone3.y;
		}
		*/
  
		// The player hits another vehicle
		if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
		if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;
		if (getDistance(playerHitZone1, vehicleHitZone3) < 40) return true;
  
		// Another vehicle hits the player
		if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
	  }
	});
  
	if (hit) {

	  renderer.setAnimationLoop(null); // Stop animation loop
	}
  }

function getDistance(cordinate1, cordinate2)
{
	return Math.sqrt((cordinate2.x - cordinate1.x)**2 + (cordinate2.y - cordinate1.y)**2);
}

function addVehicles()
{
	const vehicleTypes = ["car", "truck"];
	const type = pickRandom(vehicleTypes);
	const mesh = type == "car" ? Car() : Truck();
	scene.add(mesh);

	const clockwise = Math.random() >= 0.5;
	const angle = clockwise ? Math.PI/2 : -Math.PI/2;

	const speed = getVehicleSpeed(type);

	otherVehicles.push({ mesh, type, clockwise, angle, speed});

}

function getVehicleSpeed(type) 
{
	if (type = "car")
	{
		const minimumSpeed = 1;
		const maximumSpeed = 2;
		return minimumSpeed * Math.random() * (maximumSpeed - minimumSpeed);
	}
	if (type = "truck")
	{
		const minimumSpeed = 0.6;
		const maximumSpeed = 1.5;
		return minimumSpeed * Math.random() * (maximumSpeed - minimumSpeed);
	}
}

function moveOtherVehicles(timeDelta)
{
	otherVehicles.forEach((vehicle) => {
		if (vehicle.clockwise) 
		{
			vehicle.angle -= speed*timeDelta * vehicle.speed;
		}
		else 
		{
			vehicle.angle += speed * timeDelta * vehicle.speed;
		}

		const vehicleX = Math.cos(vehicle.angle) * trackRadius + arcCenterX;
		const vehicleY = Math.sin(vehicle.angle) * trackRadius;
		const rotation = vehicle.angle + (vehicle.clockwise ? -Math.PI / 2 : Math.PI / 2);

		vehicle.mesh.position.x = vehicleX;
		vehicle.mesh.position.y = vehicleY;
		vehicle.mesh.rotation.z = rotation;

	})
}


function render()
{
	renderer.render( scene, camera );
	requestAnimationFrame(render);
}
function Ship1() 
{
	const ship = new THREE.Group();

    //main ship
    var mainwidth = 90;
    var mainpos = 12;
    var mainheight = 40;
    for (let i = 0; i < 10; i++){
        const main = new THREE.Mesh(
            new THREE.BoxBufferGeometry(mainwidth, mainheight, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        main.position.z = mainpos;
        ship.add(main);
        var mainRostrumheight = mainheight;
        var mainRostrumx = 3;
        for (let j = 0; j < 9; j ++){
            const mainrt = new THREE.Mesh(
                new THREE.BoxBufferGeometry(mainwidth, mainRostrumheight, 2),
                new THREE.MeshLambertMaterial({color: 0x8B4513})
            );
            mainrt.position.z = mainpos;
            mainrt.position.x = mainRostrumx;
            ship.add(mainrt);
            mainRostrumheight -= 5;
            mainRostrumx += 3;
        }
        mainwidth += 8;
        mainheight += 1;
        mainpos += 2;
    }

    //front bow
    var fbowposz = 32;
    var fbowposx = 67;
    for (let i = 0; i < 4; i++){
        const frontbow = new THREE.Mesh(
            new THREE.BoxBufferGeometry(35, mainheight, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        frontbow.position.z = fbowposz;
        frontbow.position.x = fbowposx;
        ship.add(frontbow);
        var frontRostrumheight = mainheight;
        var frontRostrumx = fbowposx + 2;
        for (let j = 0; j < 9; j++){
            const rt = new THREE.Mesh(
                new THREE.BoxBufferGeometry(35, frontRostrumheight, 2),
                new THREE.MeshLambertMaterial({color: 0x8B4513})
            );
            rt.position.z = fbowposz;
            rt.position.x = frontRostrumx;
            ship.add(rt);
            frontRostrumheight -=5;
            frontRostrumx +=3;
        }
        fbowposz += 2;
        fbowposx += 4;
        mainheight += 1;
    }

    //rostrum
    var rostrumsize = 47;
    var rostrumx = 82;
    for (let i =0; i < 9; i++){
        const rostrum = new THREE.Mesh(
            new THREE.BoxBufferGeometry(35, rostrumsize, 2),
            new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        );
        rostrum.position.z = 38;
        rostrum.position.x = rostrumx;
        ship.add(rostrum);
        rostrumsize -=5;
        rostrumx += 3;
    }
    const mastRostum = new THREE.Mesh(
        new THREE.CylinderGeometry( 3, 1, 50, 32 ),
        new THREE.MeshBasicMaterial( {color: 0x8B4513} )
    );
    mastRostum.position.x = 125;
    mastRostum.position.z = 40;
    mastRostum.rotateZ(Math.PI / 2);
    mastRostum.rotateX(-Math.PI / 18);
    ship.add(mastRostum);

    //back bow
    var bbowposz = 32;
    var bbowposx = -67;
    for (let i = 0; i < 6; i++){
        const backbow = new THREE.Mesh(
            new THREE.BoxBufferGeometry(35, mainheight, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        backbow.position.z = bbowposz;
        backbow.position.x = bbowposx;
        ship.add(backbow);
        bbowposz += 2;
        bbowposx -= 4;
        mainheight += 1;
    }
    const cubeback = new THREE.Mesh(
        new THREE.BoxBufferGeometry(25, 30, 20),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    cubeback.position.x = -57;
    cubeback.position.z = 33;
    ship.add(cubeback);

    //cabin
    const cabin_1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(32, 44, 15),
        new THREE.MeshLambertMaterial({color: 0xA0522D})
    );
    cabin_1.position.x = -86;
    cabin_1.position.z = 50;
    ship.add(cabin_1);
    const cabin_2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(25, 30, 10),
        new THREE.MeshLambertMaterial({color: 0xA0522D})
    );
    cabin_2.position.x = -86;
    cabin_2.position.z = 62;
    ship.add(cabin_2);
    const cabin_3 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(20, 25, 10),
        new THREE.MeshLambertMaterial({color: 0xA0522D})
    );
    cabin_3.position.x = -86;
    cabin_3.position.z = 72;
    ship.add(cabin_3);


    // //left railing
    const leftRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(99, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    leftRailing.position.x = 0;
    leftRailing.position.y = -25;
    leftRailing.position.z = 32;
    ship.add(leftRailing);

    //right railing
    const rightRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(99, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    rightRailing.position.x = 0;
    rightRailing.position.y = 25;
    rightRailing.position.z = 32;
    ship.add(rightRailing);

    //back-railing
    //left
    const bleftRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(34, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    bleftRailing.position.x = -88;
    bleftRailing.position.y = -28;
    bleftRailing.position.z = 44;
    ship.add(bleftRailing);
    //mid
    const mbRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(57, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    mbRailing.rotateZ(Math.PI / 2);
    mbRailing.position.x = -105;
    mbRailing.position.y = 0;
    mbRailing.position.z = 44;
    ship.add(mbRailing);
    //right
    const brightRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(34, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    brightRailing.position.x = -88;
    brightRailing.position.y = 28;
    brightRailing.position.z = 44;
    ship.add(brightRailing);

    //back-railing top
    //top left
    const bleftRailingtop = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    bleftRailingtop.position.x = -86;
    bleftRailingtop.position.y = -23;
    bleftRailingtop.position.z = 58;
    ship.add(bleftRailingtop);
    //top mid
    const mbRailingtop = new THREE.Mesh(
        new THREE.BoxBufferGeometry(47, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    mbRailingtop.rotateZ(Math.PI / 2);
    mbRailingtop.position.x = -102;
    mbRailingtop.position.y = 0;
    mbRailingtop.position.z = 58;
    ship.add(mbRailingtop);
    // //right
    const brightRailingtop = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    brightRailingtop.position.x = -86;
    brightRailingtop.position.y = 23;
    brightRailingtop.position.z = 58;
    ship.add(brightRailingtop);

    //mid mast
    const mast = new THREE.CylinderGeometry( 1, 1, 80, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xB8860B} );
    const midmast = new THREE.Mesh(mast, material);
    midmast.rotateX(Math.PI / 2);
    midmast.position.z = 68;
    midmast.position.x = 0;
    ship.add(midmast);

    //observatory
    const observatory = new THREE.Mesh(
        new THREE.CylinderGeometry( 4, 2, 3, 32 ),
        new THREE.MeshBasicMaterial( {color: 0xB8860B} )
    );
    observatory.rotateX(Math.PI / 2);
    observatory.position.x = 0;
    observatory.position.z = 95;
    ship.add(observatory);
    
    //flag
    const flag = new THREE.Mesh(
        new THREE.PlaneGeometry( 10, 5, 1 ),
        new THREE.MeshBasicMaterial( { color: 0x000080, side: THREE.DoubleSide} )
    );
    flag.rotateX(Math.PI / 2);
    flag.position.x = -4;
    flag.position.z = 105;
    ship.add(flag);

    //front mast
    const frontMast = new THREE.Mesh(
        new THREE.CylinderGeometry( 1, 1, 65, 32 ),
        material
    );
    frontMast.rotateX(Math.PI / 2);
    frontMast.position.z = 62;
    frontMast.position.x = 30;
    ship.add(frontMast);

    //observatory front mast
    const observatoryFront = new THREE.Mesh(
        new THREE.CylinderGeometry( 4, 2, 3, 32 ),
        new THREE.MeshBasicMaterial( {color: 0xB8860B} )
    );
    observatoryFront.rotateX(Math.PI / 2);
    observatoryFront.position.x = 30;
    observatoryFront.position.z = 85;
    ship.add(observatoryFront);
    
    //flag front
    const flagFront = new THREE.Mesh(
        new THREE.PlaneGeometry( 10, 5, 1 ),
        new THREE.MeshBasicMaterial( { color: 0x000080, side: THREE.DoubleSide} )
    );
    flagFront.rotateX(Math.PI / 2);
    flagFront.position.x = 25;
    flagFront.position.z = 91;
    ship.add(flagFront);

    //back mast
    const backMast = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 65, 32),
        material
    );
    backMast.rotateX(Math.PI / 2);
    backMast.position.z = 62;
    backMast.position.x = -30;
    ship.add(backMast);

    //observatory back mast
    const observatoryBackmast = new THREE.Mesh(
        new THREE.CylinderGeometry( 4, 2, 3, 32 ),
        new THREE.MeshBasicMaterial( {color: 0xB8860B} )
    );
    observatoryBackmast.rotateX(Math.PI / 2);
    observatoryBackmast.position.x = -30;
    observatoryBackmast.position.z = 85;
    ship.add(observatoryBackmast);
    
    //flag back
    const flagBack = new THREE.Mesh(
        new THREE.PlaneGeometry( 10, 5, 1 ),
        new THREE.MeshBasicMaterial( { color: 0x000080, side: THREE.DoubleSide} )
    );
    flagBack.rotateX(Math.PI / 2);
    flagBack.position.x = -35;
    flagBack.position.z = 91;
    ship.add(flagBack);
    
    //cabin mast
    const cabinMast = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 20, 32),
        material
    );
    cabinMast.rotateX(Math.PI / 2);
    cabinMast.position.z = 78;
    cabinMast.position.x = -86;
    ship.add(cabinMast);

    //cabin flag
    const cabinflag = new THREE.Mesh(
        new THREE.PlaneGeometry( 10, 5, 1 ),
        new THREE.MeshBasicMaterial( { color: 0x000080, side: THREE.DoubleSide} )
    );
    cabinflag.rotateX(Math.PI / 2);
    cabinflag.position.x = -90;
    cabinflag.position.z = 85;
    ship.add(cabinflag);

    //mid sail
    const pointsBig = [];
    for ( let i = 0; i < 10; i ++ ) {
        pointsBig.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 16 + 5, ( i - 5 ) * 6 ) );
    }
    const midSail = new THREE.Mesh( 
        new THREE.LatheGeometry( pointsBig, 14, 0.5, 2.2),
        new THREE.MeshBasicMaterial( {color: 0xC0C0C0} )
    );
    midSail.rotateX(-Math.PI / 2);
    midSail.position.x = -4;
    midSail.position.z = 60;
    ship.add(midSail)

    //front sail
    const pointsSmall = [];
    for ( let i = 0; i < 10; i ++ ) {
        pointsSmall.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 12 + 5, ( i - 5 ) * 5 ) );
    }
    const frontSail = new THREE.Mesh(
        new THREE.LatheGeometry( pointsSmall, 14, 0.5, 2.2),
        new THREE.MeshBasicMaterial( {color: 0xC0C0C0} )
    );

    frontSail.rotateX(-Math.PI / 2);
    frontSail.position.x = 26;
    frontSail.position.z = 55;
    ship.add(frontSail);

    //back sail
    const backSail = new THREE.Mesh(
        new THREE.LatheGeometry( pointsSmall, 14, 0.5, 2.2),
        new THREE.MeshBasicMaterial( {color: 0xC0C0C0} )
    );
    backSail.rotateX(-Math.PI / 2);
    backSail.position.x = -34;
    backSail.position.z = 55;
    ship.add(backSail);

    //cannon 1
    const pedestal_1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(7, 5, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_1.position.x = 76;
    pedestal_1.position.z = 40;
    ship.add(pedestal_1);
    const cannon_1 = new THREE.Mesh(
        new THREE.CylinderGeometry( 1.5, 1.5, 15, 32 ),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_1.rotateZ(Math.PI / 2);
    cannon_1.position.x = 80;
    cannon_1.position.z = 43;
    ship.add(cannon_1);

    //cannon 2
    const pedestal_2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_2.position.x = 36;
    pedestal_2.position.y = 20;
    pedestal_2.position.z = 32;
    ship.add(pedestal_2);
    const cannon_2 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_2.position.x = 36;
    cannon_2.position.y = 23;
    cannon_2.position.z = 34;
    ship.add(cannon_2);

    //cannon 3
    const pedestal_3 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_3.position.x = 6;
    pedestal_3.position.y = 20;
    pedestal_3.position.z = 32;
    ship.add(pedestal_3);
    const cannon_3 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_3.position.x = 6;
    cannon_3.position.y = 23;
    cannon_3.position.z = 34;
    ship.add(cannon_3);

    //cannon 4
    const pedestal_4 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_4.position.x = -25;
    pedestal_4.position.y = 20;
    pedestal_4.position.z = 32;
    ship.add(pedestal_4);
    const cannon_4 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_4.position.x = -25;
    cannon_4.position.y = 23;
    cannon_4.position.z = 34;
    ship.add(cannon_4);

    //cannon 5
    const pedestal_5 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_5.position.x = -25;
    pedestal_5.position.y = -20;
    pedestal_5.position.z = 32;
    ship.add(pedestal_5);
    const cannon_5 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_5.position.x = -25;
    cannon_5.position.y = -23;
    cannon_5.position.z = 34;
    ship.add(cannon_5);

    //cannon 6
    const pedestal_6 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_6.position.x = 6;
    pedestal_6.position.y = -20;
    pedestal_6.position.z = 32;
    ship.add(pedestal_6);
    const cannon_6 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_6.position.x = 6;
    cannon_6.position.y = -23;
    cannon_6.position.z = 34;
    ship.add(cannon_6);

    //cannon 7
    const pedestal_7 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_7.position.x = 36;
    pedestal_7.position.y = -20;
    pedestal_7.position.z = 32;
    ship.add(pedestal_7);
    const cannon_7 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_7.position.x = 36;
    cannon_7.position.y = -23;
    cannon_7.position.z = 34;
    ship.add(cannon_7);
    return ship;
	// const car = new THREE.Group();

	// const backWheel = Wheel();
	
	// backWheel.position.x = -18;
	// car.add(backWheel);
	
	// const frontWheel = Wheel();
	
	// frontWheel.position.x = 18;
	// car.add(frontWheel);
	
	// const main = new THREE.Mesh(
	// 	new THREE.BoxBufferGeometry(60, 30, 15),
	// 	new THREE.MeshLambertMaterial({color: pickRandom(vehicleColors) })
	// );
	
	// main.position.z = 12;
	// car.add(main);
	
	// const carFrontTexture = getCarFrontTexture();
	// carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
	// carFrontTexture.rotation = Math.PI / 2;


	// const carBackTexture = getCarFrontTexture();
	// carBackTexture.center = new THREE.Vector2(0.5, 0.5);
	// carBackTexture.rotation = -Math.PI /2 ;	


	// const carRightSideTexture = getCarSideTexture();

	// const carLeftSideTexture = getCarSideTexture();
	// carLeftSideTexture.flipY = false;


	// const cabin = new THREE.Mesh(
	// 	new THREE.BoxBufferGeometry(33, 24, 12), [
	// 		new THREE.MeshLambertMaterial({ map: carFrontTexture}), // x
	// 		new THREE.MeshLambertMaterial({map: carBackTexture}), // -x
	// 		new THREE.MeshLambertMaterial({map: carLeftSideTexture}), // y
	// 		new THREE.MeshLambertMaterial({map: carRightSideTexture}), // -y
	// 		new THREE.MeshLambertMaterial({color: 0xffffff}), // top +z
	// 		new THREE.MeshLambertMaterial({color: 0xffffff}) // bottom -z
	// 	]);
	// cabin.position.z = 25.5;
	// cabin.position.x = -6;
	// car.add(cabin);

	//return car;
}

function Ship2(){
    const ship = new THREE.Group();

    //main ship
    var mainwidth = 70;
    var mainpos = 6;
    var mainheight = 35;
    for (let i = 0; i < 10; i++){
        const main = new THREE.Mesh(
            new THREE.BoxBufferGeometry(mainwidth, mainheight, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        main.position.z = mainpos;
        ship.add(main);
        var mainRostrumheight = mainheight;
        var mainRostrumx = 3;
        for (let j = 0; j < 9; j ++){
            const mainrt = new THREE.Mesh(
                new THREE.BoxBufferGeometry(mainwidth, mainRostrumheight, 2),
                new THREE.MeshLambertMaterial({color: 0x8B4513})
            );
            mainrt.position.z = mainpos;
            mainrt.position.x = mainRostrumx;
            ship.add(mainrt);
            mainRostrumheight -= 4;
            mainRostrumx += 3;
        }
        mainwidth += 8;
        mainheight += 1;
        mainpos += 2;
    }

    //front bow
    var fbowposz = 26;
    var fbowposx = 58;
    for (let i = 0; i < 4; i++){
        const frontbow = new THREE.Mesh(
            new THREE.BoxBufferGeometry(35, mainheight, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        frontbow.position.z = fbowposz;
        frontbow.position.x = fbowposx;
        ship.add(frontbow);
        var frontRostrumheight = mainheight;
        var frontRostrumx = fbowposx + 2;
        for (let j = 0; j < 9; j++){
            const rt = new THREE.Mesh(
                new THREE.BoxBufferGeometry(35, frontRostrumheight, 2),
                new THREE.MeshLambertMaterial({color: 0x8B4513})
            );
            rt.position.z = fbowposz;
            rt.position.x = frontRostrumx;
            ship.add(rt);
            frontRostrumheight -=5;
            frontRostrumx +=3;
        }
        fbowposz += 2;
        fbowposx += 4;
        mainheight += 1;
    }

    //rostrum
    const mastRostum = new THREE.Mesh(
        new THREE.CylinderGeometry( 3, 1, 40, 32 ),
        new THREE.MeshBasicMaterial( {color: 0x8B4513} )
    );
    mastRostum.position.x = 120;
    mastRostum.position.z = 34;
    mastRostum.rotateZ(Math.PI / 2);
    mastRostum.rotateX(-Math.PI / 18);
    ship.add(mastRostum);

    //back bow
    var bbowposz = 26;
    var bbowposx = -50;
    for (let i = 0; i < 8; i++){
        const backbow = new THREE.Mesh(
            new THREE.BoxBufferGeometry(50, mainheight, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        backbow.position.z = bbowposz;
        backbow.position.x = bbowposx;
        ship.add(backbow);
        bbowposz += 2;
        bbowposx -= 4;
        mainheight += 1;
    }
    const cubeback_bottom = new THREE.Mesh(
        new THREE.BoxBufferGeometry(20, 30, 21),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    cubeback_bottom.position.x = -45;
    cubeback_bottom.position.z = 30;
    ship.add(cubeback_bottom);
    //cabin
    const cabin_1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(49, 55, 20),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    cabin_1.position.x = -78;
    cabin_1.position.z = 50;
    ship.add(cabin_1);
    const cabin_2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(35, 30, 15),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    cabin_2.position.x = -78;
    cabin_2.position.z = 65;
    ship.add(cabin_2);

    //left railing
    const leftRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(66, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    leftRailing.position.x = 8;
    leftRailing.position.y = -22;
    leftRailing.position.z = 26;
    ship.add(leftRailing);

    //right railing
    const rightRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(66, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    rightRailing.position.x = 8;
    rightRailing.position.y = 22;
    rightRailing.position.z = 26;
    ship.add(rightRailing);

    //back-railing
    //left
    const bleftRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(49, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    bleftRailing.position.x = -78;
    bleftRailing.position.y = -27;
    bleftRailing.position.z = 61;
    ship.add(bleftRailing);
    //mid
    const mbRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(55, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    mbRailing.rotateZ(Math.PI / 2);
    mbRailing.position.x = -103;
    mbRailing.position.z = 61;
    ship.add(mbRailing);
    //right
    const brightRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(49, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    brightRailing.position.x = -78;
    brightRailing.position.y = 27;
    brightRailing.position.z = 62;
    ship.add(brightRailing);

    //front mast
    const mast = new THREE.CylinderGeometry( 1, 1, 70, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xB8860B} );
    const frontmast = new THREE.Mesh(mast, material);
    frontmast.rotateX(Math.PI / 2);
    frontmast.position.z = 60;
    frontmast.position.x = 25;
    ship.add(frontmast);

    //observatory
    const observatoryFrontmast = new THREE.Mesh(
        new THREE.CylinderGeometry( 4, 2, 3, 32 ),
        new THREE.MeshBasicMaterial( {color: 0xB8860B} )
    );
    observatoryFrontmast.rotateX(Math.PI / 2);
    observatoryFrontmast.position.x = 25;
    observatoryFrontmast.position.z = 84;
    ship.add(observatoryFrontmast);
    
    //flag
    const flagFront = new THREE.Mesh(
        new THREE.PlaneGeometry( 10, 5, 1 ),
        new THREE.MeshBasicMaterial( { color: 0x000080, side: THREE.DoubleSide} )
    );
    flagFront.rotateX(Math.PI / 2);
    flagFront.position.x = 20;
    flagFront.position.z = 92;
    ship.add(flagFront);

    //frontsail
    const pointsBig = [];
    for ( let i = 0; i < 10; i ++ ) {
        pointsBig.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 16 + 5, ( i - 5 ) * 5 ) );
    }
    const frontSail = new THREE.Mesh( 
        new THREE.LatheGeometry( pointsBig, 14, 0.5, 2.2),
        new THREE.MeshBasicMaterial( {color: 0xC0C0C0} )
    );
    frontSail.rotateX(-Math.PI / 2);
    frontSail.position.x = 20;
    frontSail.position.z = 55;
    ship.add(frontSail)

    //back mast
    const backmast = new THREE.Mesh(mast, material);
    backmast.rotateX(Math.PI / 2);
    backmast.position.z = 60;
    backmast.position.x = -15;
    ship.add(backmast);

    //observatory
    const observatoryBackmast = new THREE.Mesh(
        new THREE.CylinderGeometry( 4, 2, 3, 32 ),
        new THREE.MeshBasicMaterial( {color: 0xB8860B} )
    );
    observatoryBackmast.rotateX(Math.PI / 2);
    observatoryBackmast.position.x = -15;
    observatoryBackmast.position.z = 84;
    ship.add(observatoryBackmast);
    
    //flag
    const flagBack = new THREE.Mesh(
        new THREE.PlaneGeometry( 10, 5, 1 ),
        new THREE.MeshBasicMaterial( { color: 0x000080, side: THREE.DoubleSide} )
    );
    flagBack.rotateX(Math.PI / 2);
    flagBack.position.x = -20;
    flagBack.position.z = 92;
    ship.add(flagBack);

    //back sail
    const backSail = new THREE.Mesh( 
        new THREE.LatheGeometry( pointsBig, 14, 0.5, 2.2),
        new THREE.MeshBasicMaterial( {color: 0xC0C0C0} )
    );
    backSail.rotateX(-Math.PI / 2);
    backSail.position.x = -20;
    backSail.position.z = 55;
    ship.add(backSail)

    //cannon 1
    const pedestal_1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(7, 5, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_1.position.x = 76;
    pedestal_1.position.z = 34;
    ship.add(pedestal_1);
    const cannon_1 = new THREE.Mesh(
        new THREE.CylinderGeometry( 1.5, 1.5, 15, 32 ),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_1.rotateZ(Math.PI / 2);
    cannon_1.position.x = 80;
    cannon_1.position.z = 37;
    ship.add(cannon_1);

    //cannon 2
    const pedestal_2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_2.position.x = 25;
    pedestal_2.position.y = 18;
    pedestal_2.position.z = 27;
    ship.add(pedestal_2);
    const cannon_2 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_2.position.x = 25;
    cannon_2.position.y = 21;
    cannon_2.position.z = 29;
    ship.add(cannon_2);

    //cannon 3
    const pedestal_3 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_3.position.x = -10;
    pedestal_3.position.y = 18;
    pedestal_3.position.z = 27;
    ship.add(pedestal_3);
    const cannon_3 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_3.position.x = -10;
    cannon_3.position.y = 21;
    cannon_3.position.z = 29;
    ship.add(cannon_3);

    //cannon 4
    const pedestal_4 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_4.position.x = -10;
    pedestal_4.position.y = -18;
    pedestal_4.position.z = 27;
    ship.add(pedestal_4);
    const cannon_4 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_4.position.x = -10;
    cannon_4.position.y = -21;
    cannon_4.position.z = 29;
    ship.add(cannon_4);

    //cannon 5
    const pedestal_5 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_5.position.x = 25;
    pedestal_5.position.y = -18;
    pedestal_5.position.z = 27;
    ship.add(pedestal_5);
    const cannon_5 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_5.position.x = 25;
    cannon_5.position.y = -21;
    cannon_5.position.z = 29;
    ship.add(cannon_5);
    return ship;
};

function Ship3(){
    const ship = new THREE.Group();
    //main ship
    var mainwidth = 50;
    var mainpos = 6;
    var mainheight = 25;
    for (let i = 0; i < 10; i++){
        const main = new THREE.Mesh(
            new THREE.BoxBufferGeometry(mainwidth, mainheight, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        main.position.z = mainpos;
        ship.add(main);
        var mainRostrumheight = mainheight;
        var mainRostrumx = 3;
        for (let j = 0; j < 9; j ++){
            const mainrt = new THREE.Mesh(
                new THREE.BoxBufferGeometry(mainwidth, mainRostrumheight, 2),
                new THREE.MeshLambertMaterial({color: 0x8B4513})
            );
            mainrt.position.z = mainpos;
            mainrt.position.x = mainRostrumx;
            ship.add(mainrt);
            mainRostrumheight -= 3;
            mainRostrumx += 3;
        }
        mainwidth += 8;
        mainheight += 1;
        mainpos += 2;
    }

    //back stairs
    var backStairswidth = 40;
    var backStairsX = -41;
    var backStairsZ = 26;
    for (let i = 0; i < 3; i++) {
        const backStairs = new THREE.Mesh(
            new THREE.BoxBufferGeometry(backStairswidth, 34, 2),
            new THREE.MeshLambertMaterial({color: 0x8B4513})
        );
        backStairs.position.z = backStairsZ;
        backStairs.position.x = backStairsX;
        ship.add(backStairs);
        backStairswidth -= 4;
        backStairsX -=2;
        backStairsZ += 2;
    }

    //cabin 
    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(32, 34, 20),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    cabin.position.x = -45;
    cabin.position.z = 40;
    ship.add(cabin);

    //mast
    const mast = new THREE.Mesh(
        new THREE.CylinderGeometry( 1, 1, 60, 32 ), 
        new THREE.MeshBasicMaterial( {color: 0xB8860B} )
    );
    mast.rotateX(Math.PI / 2);
    mast.position.z = 55;
    mast.position.x = 20;
    ship.add(mast);

    //sail
    const pointsBig = [];
    for ( let i = 0; i < 10; i ++ ) {
        pointsBig.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 16 + 5, ( i - 5 ) * 5 ) );
    }
    const Sail = new THREE.Mesh( 
        new THREE.LatheGeometry( pointsBig, 14, 0.5, 2.2),
        new THREE.MeshBasicMaterial( {color: 0xC0C0C0} )
    );
    Sail.rotateX(-Math.PI / 2);
    Sail.position.x = 15;
    Sail.position.z = 48;
    ship.add(Sail)

    //observatory
    const observatoryBackmast = new THREE.Mesh(
        new THREE.CylinderGeometry( 4, 2, 3, 32 ),
        new THREE.MeshBasicMaterial( {color: 0xB8860B} )
    );
    observatoryBackmast.rotateX(Math.PI / 2);
    observatoryBackmast.position.x = 20;
    observatoryBackmast.position.z = 75;
    ship.add(observatoryBackmast);

    //flag 0x006400
    const flag = new THREE.Mesh(
        new THREE.PlaneGeometry( 10, 5, 1 ),
        new THREE.MeshBasicMaterial( { color: 0x000080, side: THREE.DoubleSide} )
    );
    flag.rotateX(Math.PI / 2);
    flag.position.x = 16;
    flag.position.z = 82;
    ship.add(flag);

    //cannon 1
    const pedestal_1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(7, 5, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_1.position.x = 50;
    pedestal_1.position.z = 26;
    ship.add(pedestal_1);
    const cannon_1 = new THREE.Mesh(
        new THREE.CylinderGeometry( 1.5, 1.5, 15, 32 ),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_1.rotateZ(Math.PI / 2);
    cannon_1.position.x = 54;
    cannon_1.position.z = 29;
    ship.add(cannon_1);

    //cannon 2
    const pedestal_2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_2.position.x = 8;
    pedestal_2.position.y = 10;
    pedestal_2.position.z = 26;
    ship.add(pedestal_2);
    const cannon_2 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_2.position.x = 8;
    cannon_2.position.y = 13;
    cannon_2.position.z = 28;
    ship.add(cannon_2);

    //cannon 3
    const pedestal_3 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_3.position.x = 8;
    pedestal_3.position.y = -10;
    pedestal_3.position.z = 26;
    ship.add(pedestal_3);
    const cannon_3 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_3.position.x = 8;
    cannon_3.position.y = -13;
    cannon_3.position.z = 28;
    ship.add(cannon_3);

    //left railing
    const leftRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(68, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    leftRailing.position.x = 13;
    leftRailing.position.y = -17;
    leftRailing.position.z = 26;
    ship.add(leftRailing);

    // //right railing
    const rightRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(68, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    rightRailing.position.x = 13;
    rightRailing.position.y = 17;
    rightRailing.position.z = 26;
    ship.add(rightRailing);
    return ship;
};

function Wheel() {
	const wheel = new THREE.Mesh(
		new THREE.BoxBufferGeometry(12, 33, 12),
		new THREE.MeshLambertMaterial({color: 0x333333})
	);
	wheel.position.z = 6;
	return wheel;
}

function pickRandom(array)
{
	return array[Math.floor(Math.random()* array.length)];
}

function getCarFrontTexture()
{
	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 32;
	const context = canvas.getContext("2d");
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 64, 32);
	context.fillStyle = "#666666";
	context.fillRect(8, 8, 48, 24);

	return new THREE.CanvasTexture(canvas);
}



function getSeaMarkings(mapWidth, mapHeight)
{
	const canvas = document.createElement("canvas");
	canvas.width = mapWidth;
	canvas.height = mapHeight;
	const context = canvas.getContext("2d");
	context.fillStyle = "#428BFF";

	context.fillRect(0, 0, mapWidth, mapHeight);
	
    context.fillStyle = "#E0FFFF"
    context.lineWidth = 2;
    context.strokeStyle = "#E0FFFF";
    context.setLineDash([10, 14]);

    var i, j;
    for (i = 0; i < mapHeight; i+=100) 
    {
      for (j = 0; j < mapWidth; j+=200) 
      {
      
        const isWave = Math.random() > 0.4;
        if (isWave)
        {
            context.beginPath();
	
            context.arc(
                j,
                i,
                trackRadius / 6,
                Math.PI/3,
                Math.PI/Math.sqrt(3)
            )
        
            context.stroke();
    
            context.beginPath();
            context.arc(
                j + 50,
                i + 60,
                trackRadius / 6,
                -Math.PI/3,
                -Math.PI/Math.sqrt(3),    
                true
            )
    
            context.stroke();
    
        
        }

      }
    } 

    
	//context.lineWidth = 2;
	//context.strokeStyle = "#E0FFFF";
	//context.setLineDash([10, 14]);


	

	return new THREE.CanvasTexture(canvas);
}

function getLeftIsland() {
	const islandLeft = new THREE.Shape();
  
	islandLeft.absarc(
	  -arcCenterX,
	  0,
	  innerTrackRadius,
	  arcAngle1,
	  -arcAngle1,
	  false
	);
  
	islandLeft.absarc(
	  arcCenterX,
	  0,
	  outerTrackRadius,
	  Math.PI + arcAngle2,
	  Math.PI - arcAngle2,
	  true
	);
	
  
	return islandLeft;
  }
  
  function getMiddleIsland() {
	const islandMiddle = new THREE.Shape();
  
	islandMiddle.absarc(
	  -arcCenterX,
	  0,
	  innerTrackRadius,
	  arcAngle3,
	  -arcAngle3,
	  true
	);
  
	islandMiddle.absarc(
	  arcCenterX,
	  0,
	  innerTrackRadius,
	  Math.PI + arcAngle3,
	  Math.PI - arcAngle3,
	  true
	);
  
	return islandMiddle;
  }
  
   function getRightIsland() {
	const islandRight = new THREE.Shape();
  
	islandRight.absarc(
	  arcCenterX,
	  0,
	  innerTrackRfunctionadius,
	  Math.PI - arcAngle1,
	  Math.PI + arcAngle1,
	  true
	);
  
	islandRight.absarc(
	  -arcCenterX,
	  0,
	  outerTrackRadius,
	  -arcAngle2,
	  arcAngle2,
	  false
	);
  
	return islandRight;
  }


  function getOuterField(mapWidth, mapHeight) {
	const field = new THREE.Shape();
  
	field.moveTo(-mapWidth / 2, -mapHeight / 2);
	field.lineTo(0, -mapHeight / 2);
  
	field.absarc(-arcCenterX, 0, outerTrackRadius, -arcAngle4, arcAngle4, true);
  
	field.absarc(
	  arcCenterX,
	  0,
	  outerTrackRadius,
	  Math.PI - arcAngle4,
	  Math.PI + arcAngle4,
	  true
	);
  
	field.lineTo(0, -mapHeight / 2);
	field.lineTo(mapWidth / 2, -mapHeight / 2);
	field.lineTo(mapWidth / 2, mapHeight / 2);
	field.lineTo(-mapWidth / 2, mapHeight / 2);
  
	return field;
  }
  
function renderMap(mapWidth, mapHeight) 
{

	//const mesh = Mesh1(0,0);
	
	//scene.add(mesh);
    const minimumRange = 1;
    const maximumRange = 100;
 
    addRandomMap(0, 0, minimumRange, maximumRange, 0);
	generator[500][500] = 1;
	/*
    addRandomMap(0, 1000, minimumRange, maximumRange);
	generator[500][501] = 1;
    addRandomMap(0, -1000, minimumRange, maximumRange);
	generator[500][499] = 1;
    addRandomMap(1000, 0, minimumRange, maximumRange);
	generator[501][500] = 1;
    addRandomMap(-1000, 0, minimumRange, maximumRange);
	generator[499][500] = 1;
    addRandomMap(1000, 1000, minimumRange, maximumRange);
	generator[501, 501] = 1;
    addRandomMap(-1000, 1000, minimumRange, maximumRange);
	generator[499, 501] = 1;
    addRandomMap(1000, -1000, minimumRange, maximumRange);
	generator[501, 499] = 1;
    addRandomMap(-1000, -1000, minimumRange, maximumRange);
	generator[499, 499] = 1;
	*/
  
	// Extruded geometry with curbs
	/*
    const islandLeft = getLeftIsland();
	const islandMiddle = getMiddleIsland();
	const islandRight = getRightIsland();
	const outerField = getOuterField(mapWidth, mapHeight);

	const fieldGeometry = new THREE.ExtrudeBufferGeometry(
		[islandLeft, islandMiddle, islandRight, outerField],
		{depth: 6, bevelEnable: false}

	);

	const fieldMesh = new THREE.Mesh(fieldGeometry, [
		new THREE.MeshLambertMaterial({ color: 0x67c240}),
		new THREE.MeshLambertMaterial({ color: 0x23311c})
	]);
	scene.add(fieldMesh);
	*/
}  

function addRandomMap(centerX, centerY, minimumRange, maximumRange, mType =1)
{
    let iX, iY;
    iX = randomR(minimumRange, maximumRange);
    iY = randomR(minimumRange, maximumRange);
    iX = randomNegative(iX);
    iY = randomNegative(iY);
    addMap(centerX, centerY, iX, iY, mType);
}

function randomR(min, max)
{
    return min + Math.random() * (max - min);
}

function randomNegative(x)
{
    if (Math.random()>0.5)
    {
        return -x;
    }
    return x;
}


function Sea0(centerX, centerY, iX, iY)
{
    const mesh = new THREE.Group();
    const seaMarkingsTexture = getSeaMarkings(tileMapSize, tileMapSize);
	const planeGeometry = new THREE.PlaneBufferGeometry(tileMapSize, tileMapSize);
	const planeMaterial = new THREE.MeshLambertMaterial({
        map: seaMarkingsTexture,
    });
	
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.add(plane);
    
    mesh.position.x = centerX;
    mesh.position.y = centerY;
    return mesh;

}

function Sea1(centerX, centerY, iX, iY) 
{
	const mesh = new THREE.Group();
    const seaMarkingsTexture = getSeaMarkings(tileMapSize, tileMapSize);
	const planeGeometry = new THREE.PlaneBufferGeometry(tileMapSize, tileMapSize);
	const planeMaterial = new THREE.MeshLambertMaterial({
        map: seaMarkingsTexture,
    });
	
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.add(plane);

    
	
	return mesh;
}

function getIsLand1(centerX, centerY) {
	const islandLeft = new THREE.Shape();
  
	islandLeft.absarc(
	  centerX-arcCenterX,
	  centerY,
	  innerTrackRadius,
	  arcAngle1,
	  -arcAngle1,
	  true
	);
  
	islandLeft.absarc(
	  centerX+arcCenterX,
	  centerY,
	  outerTrackRadius,
	  Math.PI + arcAngle2,
	  Math.PI - arcAngle2,
	  true
	);
	
  
	return islandLeft;
  }


function addMap(centerX, centerY, iX, iY, mType = 1)
{
    let mesh;
	let collider;
	const meshTypes = ["mesh0", "mesh1"];
	let type = pickRandom(meshTypes);
	if (mType == 0 )
		type = "mesh0";

    if (type == "mesh0")
    {
        mesh = Sea0(centerX, centerY, iX, iY);
        collider = [];
    }
	else if (type == "mesh1")
    {
       const val = Mesh1(centerX, centerY, iX, iY);
        mesh = val.mesh;
        collider = val.collider;
    }
  
	scene.add(mesh);
	map.push({mesh, type, collider});

}

function Mesh1(centerX, centerY, iX, iY)
{
    let mesh;
    let collider = [];
    mesh = Sea0(centerX, centerY, iX, iY);
        
    const isLand1 = getIsLand1(iX, iY);
    const isLandGeometry = new THREE.ExtrudeBufferGeometry(
    [isLand1],
    {depth: 4, bevelEnable: false}

    );
    
    const isLandMesh = new THREE.Mesh(isLandGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x67c240}),
        new THREE.MeshLambertMaterial({ color: 0x23311c})
    ]);

    const tC1 = createCollision(iX - 45, iY, 20, 75, 32);
    const tC2 = createCollision(iX - 55, iY + 100, 20, 53, 32);
    const tC3 = createCollision(iX - 55, iY - 100, 20, 53, 32);

    isLandMesh.add(tC1);
    isLandMesh.add(tC2);
    isLandMesh.add(tC3);

    isLandMesh.rotation.z = randomR(0, 2*Math.PI);

    const minAngle = 0;
    const maxAngle = 2*Math.PI;

    const c1 = new Collision(0, tC1, 75, 0, 0);

    const c2 = new Collision(0, tC2, 53, 0, 0);
    
    const c3 = new Collision(0, tC3, 53, 0, 0);

    mesh.add(isLandMesh);

    mesh.position.x = centerX;
    mesh.position.y = centerY;

    collider.push(c1);
    collider.push(c2);
    collider.push(c3);
    return {
        mesh: mesh, 
        collider: collider
    };
}

function createCollision(iX, iY, iZ, r, c)
{
    const collision = new THREE.Mesh(new THREE.CircleGeometry(r, c),  
    new THREE.MeshLambertMaterial({ color: "blue"})
    );

    collision.position.x = iX;
    collision.position.y = iY;
    collision.position.z = iZ;
    // hide collision
    //collision.visible = false;
    return collision;
}




function Distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function UpdateMap(size)
{
	
	const minimumRange = 1;
    const maximumRange = 100;
	let currentX = playerShip.position.x;
	let currentY = playerShip.position.y;
	const halfSize = size/2;
	if (currentX < 0) 
		currentX - halfSize;
	else 
		currentX + halfSize;
	
	if (currentY < 0)
		currentY - halfSize;
	else 
		currentY + halfSize;

	const currentI = Math.floor(currentX/size);
	const currentJ = Math.floor(currentY/size);
	const i = currentI+500; // position i in generator array
	const j = currentJ+500;

	const x = currentI * size;
	const y = currentJ * size;

	if (i<0 || i>999 || j<0 || j>999) // reset the Map when it too big
	{
		
		for (let i = 0; i < generator.length; i++) 
		{
  			generator[i] = new Array(1000);
  			for (let j = 0; j < generator[i].length; j++)
  			{
	  			generator[i][j] = 0;
  			}
		}
		addRandomMap(0, 0, minimumRange, maximumRange, 0);
		generator[500][500] = 1;
		playerShip.position.x = 0;
		playerShip.position.y = 0;
		return;
	}

	if (generator[i][j] == 1)
	{
		console.log("Came in new tile => x: " +x + " y: " + y);
	
		generator[i][j] = 2;
		for (let k=0; k<neighborTilesI.length; k++)
		{
			
			let di = neighborTilesI[k];
			let dj = neighborTilesJ[k];
			let dx = neighborTilesX[k];
			let dy = neighborTilesY[k];

			if (generator[i+di][j+dj] == 0)
			{
				generator[i+di][j+dj] = 1;
				addRandomMap(x+dx, y+dy, minimumRange, maximumRange);

			}
			
		}

	}
	
}


