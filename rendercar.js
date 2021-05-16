import * as THREE from './node_modules/three/build/three.module.js';
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );
const playerShip = Ship();
scene.add(playerShip);

//Set up light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 500;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2, //left
    cameraWidth / 2, //right
    cameraHeight / 2, //top
    cameraHeight / -2, //bottom
    0, //near plane
    1000 //far plane
);

camera.position.set(200,  -200, 200);
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
        fbowposz += 2;
        fbowposx += 4;
        mainheight += 1;
    }

    //back bow
    var bbowposz = 32;
    var bbowposx = -67;
    for (let i = 0; i < 4; i++){
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
        new THREE.BoxBufferGeometry(35, 30, 18),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    cubeback.position.x = -65;
    cubeback.position.z = 30;
    ship.add(cubeback);

    //cabin
    const cabin_1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(25, 35, 15),
        new THREE.MeshLambertMaterial({color: 0xA0522D})
    );
    cabin_1.position.x = -77;
    cabin_1.position.z = 45;
    ship.add(cabin_1);
    const cabin_2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(20, 30, 10),
        new THREE.MeshLambertMaterial({color: 0xA0522D})
    );
    cabin_2.position.x = -77;
    cabin_2.position.z = 57;
    ship.add(cabin_2);


    //left railing
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
    bleftRailing.position.x = -79;
    bleftRailing.position.y = -28;
    bleftRailing.position.z = 40;
    ship.add(bleftRailing);
    //mid
    const mbRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(57, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    mbRailing.rotateZ(Math.PI / 2);
    mbRailing.position.x = -96;
    mbRailing.position.y = 0;
    mbRailing.position.z = 40;
    ship.add(mbRailing);
    //right
    const brightRailing = new THREE.Mesh(
        new THREE.BoxBufferGeometry(34, 1, 2.5),
        new THREE.MeshLambertMaterial({color: 0xA9A9A9})
    );
    brightRailing.position.x = -79;
    brightRailing.position.y = 28;
    brightRailing.position.z = 40;
    ship.add(brightRailing);

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
        new THREE.CylinderGeometry( 1, 1, 55, 32 ),
        material
    );
    frontMast.rotateX(Math.PI / 2);
    frontMast.position.z = 56;
    frontMast.position.x = 30;
    ship.add(frontMast);

    //back mast
    const backMast = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 55, 32),
        material
    );
    backMast.rotateX(Math.PI / 2);
    backMast.position.z = 56;
    backMast.position.x = -30;
    ship.add(backMast);
    
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
    pedestal_2.position.x = 17;
    pedestal_2.position.y = 20;
    pedestal_2.position.z = 32;
    ship.add(pedestal_2);
    const cannon_2 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_2.position.x = 17;
    cannon_2.position.y = 23;
    cannon_2.position.z = 34;
    ship.add(cannon_2);

    //cannon 3
    const pedestal_3 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_3.position.x = -15;
    pedestal_3.position.y = 20;
    pedestal_3.position.z = 32;
    ship.add(pedestal_3);
    const cannon_3 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_3.position.x = -15;
    cannon_3.position.y = 23;
    cannon_3.position.z = 34;
    ship.add(cannon_3);

    //cannon 4
    const pedestal_4 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_4.position.x = -15;
    pedestal_4.position.y = -20;
    pedestal_4.position.z = 32;
    ship.add(pedestal_4);
    const cannon_4 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_4.position.x = -15;
    cannon_4.position.y = -23;
    cannon_4.position.z = 34;
    ship.add(cannon_4);

    //cannon 5
    const pedestal_5 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(5, 7, 3),
        new THREE.MeshLambertMaterial({color: 0xCD853F})
    );
    pedestal_5.position.x = 17;
    pedestal_5.position.y = -20;
    pedestal_5.position.z = 32;
    ship.add(pedestal_5);
    const cannon_5 = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(2, 2, 15, 32),
        new THREE.MeshBasicMaterial( {color: 0x000000} )
    );
    cannon_5.position.x = 17;
    cannon_5.position.y = -23;
    cannon_5.position.z = 34;
    ship.add(cannon_5);
    return ship;
};

function pickRandom(array){
    return array[Math.floor(Math.random() * array.length)];
}