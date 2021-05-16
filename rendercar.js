import * as THREE from './node_modules/three/build/three.module.js';
const scene = new THREE.Scene();
const playerShip = Ship();
scene.add(playerShip);

//Set up light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 200;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2, //left
    cameraWidth / 2, //right
    cameraHeight / 2, //top
    cameraHeight / -2, //bottom
    0, //near plane
    1000 //far plane
);

camera.position.set(200, -200, 300);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

//set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];
function Ship() {
    const ship = new THREE.Group();
    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(80, 30, 15),
        new THREE.MeshLambertMaterial({color: 0xa52523})
    );
    main.position.z = 12;
    ship.add(main);

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33, 24, 12),
        new THREE.MeshLambertMaterial({color: 0xffffff})
    );
    cabin.position.x = -10;
    cabin.position.z = 25.5;
    ship.add(cabin);

    const geometry = new THREE.CylinderGeometry( 5, 5, 10, 25 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.rotateX(Math.PI / 2);
    cylinder.position.x = -10
    cylinder.position.z = 35;
    ship.add( cylinder );
    var width = 27.5;
    var posx = 2;
    for (let i = 0; i< 11; i++)
    {
        const layer = new THREE.Mesh(
            new THREE.BoxBufferGeometry(80, width, 15),
            new THREE.MeshLambertMaterial({color: 0xa52523})
        );
        layer.position.z = 12;
        layer.position.x = posx;
        ship.add(layer);
        width -= 2.5;
        posx += 2;
    }

    const besung = new THREE.Mesh(
        new THREE.CylinderGeometry( 1.5, 3, 5, 4 ),
        new THREE.MeshBasicMaterial( {color: 0xffffff})
    );
    besung.rotateZ(Math.PI / 2);
    besung.rotateY(Math.PI / 2);
    besung.position.x = 30;
    besung.position.z = 21;
    ship.add(besung);

    const geometry2 = new THREE.CylinderGeometry( 1.5, 2, 15, 25 );
    const material2 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const gun1 = new THREE.Mesh(geometry2, material2);
    gun1.rotateZ(-Math.PI / 2);
    gun1.rotateX(15*Math.PI/ 180);
    gun1.position.x = 34.25;
    gun1.position.z = 26.25;
    gun1.position.y = -2;
    ship.add(gun1);

    const geometry3 = new THREE.CylinderGeometry( 1.5, 2, 15, 25 );
    const material3 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const gun2 = new THREE.Mesh(geometry3, material3);
    gun2.rotateZ(-Math.PI / 2);
    gun2.rotateX(15*Math.PI/ 180);
    gun2.position.x = 34.25;
    gun2.position.z = 26.25;
    gun2.position.y = 2;
    ship.add(gun2);
    return ship;
};

function Wheel(){
    const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({color: 0x333333})
    );
    wheel.position.z = 6;
    return wheel;
};

function pickRandom(array){
    return array[Math.floor(Math.random() * array.length)];
}