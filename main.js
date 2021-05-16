import * as THREE from './node_modules/three/build/three.module.js';

class Collision 
{
	
	constructor(x,y,w,h,r,type = 0){
		this.X = x;
		this.Y = y;
		this.W = w;
		this.H = h;
		this.R = r;
		this.Type = type; // 0: Circle, 1: Rectangle
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


const playerShip = Car();
const playerAngleInitial = Math.PI;
const speed = 0.035;
//const speed = 0.1; // increase speed for testing
const playerRadius = 10; // used for collision
let isCollision = false;
let currentCollision; // player collider with
let collisionRadius = 0; // conllision radius

scene.add(playerShip);

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
renderMap(cameraWidth, cameraHeight);


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
let accelerate = false;
let decelerate = false;
let turnLeft = false;
let turnRight = false;
let angle = 0;
reset ();



window.addEventListener("keydown", function (event){
	if (event.key =="ArrowUp") {
		startGame();
		accelerate = true;
		return;
	}

	if (event.key =="ArrowDown") {
		decelerate = true;
		return;
	}

    if (event.key =="ArrowLeft") {
        turnLeft = true;
        return;
    }

    if (event.key =="ArrowRight") {
        turnRight = true;
    }

	if (event.key =="R" || event.key=="r") {
		reset();
		return;
	}
});

window.addEventListener("keyup", function (event){
	if (event.key =="ArrowUp") 
	{
		accelerate = false;
		return;
	}

	if (event.key =="ArrowDown")
	{
		decelerate = false;
		return;
	}

    if (event.key =="ArrowLeft") {
        turnLeft = false;
        return;
    }

    if (event.key =="ArrowRight") {
        turnRight = false;
    }

});

renderer.render(scene, camera );

function getPlayerSpeed() 
{
	if (accelerate) 
		return speed*1.5;
	if (decelerate)
		return speed*0.5;
	return speed;	
}

function turnProcess()
{
    if (turnLeft)
    {
        playerShip.rotation.z += 0.01;
        angle -= 0.01;
    }
    else 
    if (turnRight)
    {
        playerShip.rotation.z -= 0.01;
        angle += 0.01;
    }
}

function runProcess(runSpeed)
{
    
	const nextPosisionX = playerShip.position.x + runSpeed*Math.cos(-angle);
	const nextPosisionY = playerShip.position.y + runSpeed*Math.sin(-angle);
	if (isCollision)
		if (Distance(nextPosisionX,nextPosisionY,currentCollision.X,currentCollision.Y)< collisionRadius)
		{
		
			return;
		}
	
    playerShip.position.x += runSpeed* Math.cos(-angle);
    playerShip.position.y += runSpeed* Math.sin(-angle);

   
}

function moveplayerShip(timeDelta)
{
	const playerSpeed = getPlayerSpeed();
	playerAngleMoved -= playerSpeed * timeDelta;
    const runSpeed = playerSpeed * timeDelta;
    turnProcess();
    runProcess(runSpeed);

}

function reset()
{
	playerAngleMoved = 0;
	moveplayerShip(0);
	score = 0;
	scoreElement.innerText = score;
	lastTimestamp = undefined;

	//Remove other vehicles
	otherVehicles.forEach((vehicle) => {
		scene.remove(vehicle.mesh);
	});

	otherVehicles = [];
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

	moveplayerShip(timeDelta);

	camera.position.x = playerShip.position.x;
	camera.position.y = playerShip.position.y - 210;

	playerColliderCheck();

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
function Car() 
{
	const car = new THREE.Group();

	const backWheel = Wheel();
	
	backWheel.position.x = -18;
	car.add(backWheel);
	
	const frontWheel = Wheel();
	
	frontWheel.position.x = 18;
	car.add(frontWheel);
	
	const main = new THREE.Mesh(
		new THREE.BoxBufferGeometry(60, 30, 15),
		new THREE.MeshLambertMaterial({color: pickRandom(vehicleColors) })
	);
	
	main.position.z = 12;
	car.add(main);
	
	const carFrontTexture = getCarFrontTexture();
	carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
	carFrontTexture.rotation = Math.PI / 2;


	const carBackTexture = getCarFrontTexture();
	carBackTexture.center = new THREE.Vector2(0.5, 0.5);
	carBackTexture.rotation = -Math.PI /2 ;	


	const carRightSideTexture = getCarSideTexture();

	const carLeftSideTexture = getCarSideTexture();
	carLeftSideTexture.flipY = false;


	const cabin = new THREE.Mesh(
		new THREE.BoxBufferGeometry(33, 24, 12), [
			new THREE.MeshLambertMaterial({ map: carFrontTexture}), // x
			new THREE.MeshLambertMaterial({map: carBackTexture}), // -x
			new THREE.MeshLambertMaterial({map: carLeftSideTexture}), // y
			new THREE.MeshLambertMaterial({map: carRightSideTexture}), // -y
			new THREE.MeshLambertMaterial({color: 0xffffff}), // top +z
			new THREE.MeshLambertMaterial({color: 0xffffff}) // bottom -z
		]);
	cabin.position.z = 25.5;
	cabin.position.x = -6;
	car.add(cabin);

	return car;
}

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

function getCarSideTexture()
{
	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 32;
	const context = canvas.getContext("2d");
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 128, 32);
	context.fillStyle = "#666666";
	context.fillRect(10, 8, 38, 24);
	context.fillRect(58, 8, 60, 24);

	return new THREE.CanvasTexture(canvas);
}

function getTruckFrontTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 32;
	canvas.height = 32;
	const context = canvas.getContext("2d");
  
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 32, 32);
  
	context.fillStyle = "#666666";
	context.fillRect(0, 5, 32, 10);
  
	return new THREE.CanvasTexture(canvas);
  }
  
  function getTruckSideTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 32;
	canvas.height = 32;
	const context = canvas.getContext("2d");
  
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, 32, 32);
  
	context.fillStyle = "#666666";
	context.fillRect(17, 5, 15, 10);
  
	return new THREE.CanvasTexture(canvas);
  }
  
  function Truck() {
	const truck = new THREE.Group();
	const color = pickRandom(vehicleColors);
  
	const base = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(100, 25, 5),
	  new THREE.MeshLambertMaterial({ color: 0xb4c6fc })
	);
	base.position.z = 10;
	truck.add(base);
  
	const cargo = new THREE.Mesh(
	  new THREE.BoxBufferGeometry(75, 35, 40),
	  new THREE.MeshLambertMaterial({ color: 0xffffff }) // 0xb4c6fc
	);
	cargo.position.x = -15;
	cargo.position.z = 30;
	cargo.castShadow = true;
	cargo.receiveShadow = true;
	truck.add(cargo);
  
	const truckFrontTexture = getTruckFrontTexture();
	truckFrontTexture.center = new THREE.Vector2(0.5, 0.5);
	truckFrontTexture.rotation = Math.PI / 2;
  
	const truckLeftTexture = getTruckSideTexture();
	truckLeftTexture.flipY = false;
  
	const truckRightTexture = getTruckSideTexture();
  
	const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(25, 30, 30), [
	  new THREE.MeshLambertMaterial({ color, map: truckFrontTexture }),
	  new THREE.MeshLambertMaterial({ color }), // back
	  new THREE.MeshLambertMaterial({ color, map: truckLeftTexture }),
	  new THREE.MeshLambertMaterial({ color, map: truckRightTexture }),
	  new THREE.MeshLambertMaterial({ color }), // top
	  new THREE.MeshLambertMaterial({ color }) // bottom
	]);
	cabin.position.x = 40;
	cabin.position.z = 20;
	cabin.castShadow = true;
	cabin.receiveShadow = true;
	truck.add(cabin);
  
	const backWheel = Wheel();
	backWheel.position.x = -30;
	truck.add(backWheel);
  
	const middleWheel = Wheel();
	middleWheel.position.x = 10;
	truck.add(middleWheel);
  
	const frontWheel = Wheel();
	frontWheel.position.x = 38;
	truck.add(frontWheel);
  /*
	if (config.showHitZones) {
	  truck.userData.hitZone1 = HitZone();
	  truck.userData.hitZone2 = HitZone();
	  truck.userData.hitZone3 = HitZone();
	}
  */
	return truck;
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
    addRandomMap(0, 1000, minimumRange, maximumRange);
    addRandomMap(0, -1000, minimumRange, maximumRange);
    addRandomMap(1000, 0, minimumRange, maximumRange);
    addRandomMap(-1000, 0, minimumRange, maximumRange);
    addRandomMap(1000, 1000, minimumRange, maximumRange);
    addRandomMap(-1000, 1000, minimumRange, maximumRange);
    addRandomMap(1000, -1000, minimumRange, maximumRange);
    addRandomMap(-1000, -1000, minimumRange, maximumRange);
	
  
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
    return min*Math.random() * (max - min);
}

function randomNegative(x)
{
    if (Math.random()>0.5)
    {
        return -x;
    }
    return x;
}


function Mesh0(centerX, centerY, iX, iY)
{
    const mesh = new THREE.Group();
    const seaMarkingsTexture = getSeaMarkings(1000, 1000);
	const planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
	const planeMaterial = new THREE.MeshLambertMaterial({
        map: seaMarkingsTexture,
    });
	
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.add(plane);
    
    mesh.position.x = centerX;
    mesh.position.y = centerY;
    return mesh;
}

function Mesh1(centerX, centerY, iX, iY) 
{
	const mesh = new THREE.Group();
    const seaMarkingsTexture = getSeaMarkings(1000, 1000);
	const planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
	const planeMaterial = new THREE.MeshLambertMaterial({
        map: seaMarkingsTexture,
    });
	
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.add(plane);

    const isLand1 = getIsLand1(iX, iY);
    const isLandGeometry = new THREE.ExtrudeBufferGeometry(
		[isLand1],
		{depth: 4, bevelEnable: false}

	);
    const isLandMesh = new THREE.Mesh(isLandGeometry, [
		new THREE.MeshLambertMaterial({ color: 0x67c240}),
		new THREE.MeshLambertMaterial({ color: 0x23311c})
	]);
	mesh.add(isLandMesh);

    mesh.position.x = centerX;
    mesh.position.y = centerY;
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
	let collider = [];
	const meshTypes = ["mesh0", "mesh1"];
	let type = pickRandom(meshTypes);
	if (mType == 0 )
		type = "mesh0";
    if (type == "mesh0")
    {
        mesh = Mesh0(centerX, centerY, iX, iY);
    }
	else if (type == "mesh1")
    {
        mesh = Mesh1(centerX, centerY, iX, iY);
		
		const c1 = new Collision(centerX + iX -45, centerY+iY, 0, 0, 75);

		const c2 = new Collision(centerX + iX -55, centerY + iY + 100, 0, 0, 53);
		
		const c3 = new Collision(centerX + iX - 55, centerY + iY - 100, 0, 0, 53);

		const tC1 = new THREE.Mesh(new THREE.CircleGeometry(75, 32),  
			new THREE.MeshLambertMaterial({ color: "blue"})
		);
		const tC2 = new THREE.Mesh(new THREE.CircleGeometry(53, 32),  
		new THREE.MeshLambertMaterial({ color: "blue"})
		);
		const tC3 = new THREE.Mesh(new THREE.CircleGeometry(53, 32), 
		new THREE.MeshLambertMaterial({ color: "blue"})
		);

		tC1.position.x = centerX + iX -45;
		tC1.position.y = centerY +iY;
		tC1.position.z = 20;

		tC2.position.x = centerX +iX -55;
		tC2.position.y = centerY + iY + 100;
		tC2.position.z = 20;

		tC3.position.x = centerX +iX -55;
		tC3.position.y = centerY + iY -100;
		tC3.position.z = 20;
		scene.add(tC1);
		scene.add(tC2);
		scene.add(tC3);
		collider.push(c1);
		collider.push(c2);
		collider.push(c3);

		
    }
  
	scene.add(mesh);
	map.push({mesh, type, collider});

}

function playerColliderCheck()
{
	let minCollisionRadius = 1000;
	let collisionR;
	let foundCollider = false;
	map.forEach((tile) => {
		tile.collider.forEach((collision) => {
		
			collisionR = Distance(playerShip.position.x,playerShip.position.y, collision.X, collision.Y);
			
			if (collisionR<playerRadius+collision.R)
			{
				console.log("CollisionDetect");
				isCollision = true;
				collisionRadius = collisionR;
				currentCollision = collision;
				foundCollider = true;
			}
			else console.log(playerShip.position.x);
		})
		
	})
	if (!foundCollider)
	{
		isCollision = false;
	}
}

function Distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}



