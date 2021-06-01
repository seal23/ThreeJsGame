import * as THREE from './node_modules/three/build/three.module.js';
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );
const playerShip = Island2();
scene.add(playerShip);

//Set up light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 00;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2, //left
    cameraWidth / 2, //right
    cameraHeight / 2, //top
    cameraHeight / -2, //bottom
    0, //near plane
    1000 //far plane
);

camera.position.set(300, -300, 300);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

//set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];

function Ship_1() {
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
};

function Ship_2(){
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

function Ship_3(){
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

function createPlane( w, h, x, y){
    const plane = new THREE.Mesh(
        new THREE.BoxBufferGeometry(w, h, 2),
        new THREE.MeshLambertMaterial({color: 0xF5DEB3})
    );
    plane.position.x = x;
    plane.position.y = y;
    return plane;
}

function createMount( w, h, x, y, mH){
    const mountain = new THREE.Group();
    let mountZ = 2;
    for (let i = 0; i<mH; i++){
        const mount = new THREE.Mesh(
            new THREE.BoxBufferGeometry(w, h, 2),
            new THREE.MeshLambertMaterial({color: 0x008000})
        );
        mount.position.z = mountZ;
        mount.position.x = x;
        mount.position.y = y;
        mountain.add(mount);
        w -= 10;
        h -= 10;
        mountZ +=2;
    }
    return mountain;
}

function createMountHeight( x, y, z, rT, rB, h, seg){
    const mountain = new THREE.Mesh(
        new THREE.CylinderGeometry( rT, rB, h, seg ),
        new THREE.MeshBasicMaterial( {color: 0x006400} )
    );
    mountain.rotateX(-Math.PI /2);
    mountain.position.x = x;
    mountain.position.y = y;
    mountain.position.z = z;
    return mountain;
}

function Island1(){
    const island = new THREE.Group();
    const plane = [];
    const mountain = [];
    const mountheight = [];
    const plane0 = createPlane(300, 280, 0, 0);
    plane.push(plane0);
    const plane1 = createPlane(300, 290, 10, -20);
    plane.push(plane1);
    const plane2 = createPlane(280, 250, 25, -10);
    plane.push(plane2);
    const plane3 = createPlane(280, 240, 20, 40);
    plane.push(plane3);
    const plane4 = createPlane(250, 250, 10, 25);
    plane.push(plane4);
    const plane5 = createPlane(290, 290, 10, -40);
    plane.push(plane5);
    const plane6 = createPlane(270, 260, -20, -10);
    plane.push(plane6);
    const plane7 = createPlane(250, 280, 10, -80);
    plane.push(plane7);
    const plane8 = createPlane(265, 290, 10, -60);
    plane.push(plane8);
    const plane9 = createPlane(245, 250, -50, -5);
    plane.push(plane9);
    const plane10 = createPlane(245, 250, 20, 50);
    plane.push(plane10);

    const mount0 = createMount(250, 240, -10, -40, 10);
    mountain.push(mount0);
    const mount1 = createMount(270, 260, 5, -20, 2);
    mountain.push(mount1);
    const mount2 = createMount(280, 250, 10, -30, 4);
    mountain.push(mount2);
    const mount3 = createMount(240, 280, 20, 20, 6);
    mountain.push(mount3);
    const mount4 = createMount(260, 160, -10, 5, 6);
    mountain.push(mount4);
    const mount5 = createMount(250, 260, 10, -50, 5);
    mountain.push(mount5);

    const mountH0 = createMountHeight(20, 10, 36, 16, 8 , 32, 10);
    mountheight.push(mountH0);
    const mountH1 = createMountHeight(-20, -30, 25, 22, 13, 10, 8);
    mountheight.push(mountH1);
    const mountH2 = createMountHeight(-50, -50, 40, 30, 8, 40, 8);
    mountheight.push(mountH2);
    const mountH3 = createMountHeight(30, -50, 40, 30, 8, 40, 8);
    mountheight.push(mountH3);
    const mountH4 = createMountHeight(80, 80, 30, 30, 8, 40, 8);
    mountheight.push(mountH4);
    const mountH5 = createMountHeight(-40, 60, 30, 30, 8, 40, 8);
    mountheight.push(mountH5);
    for (let i =0 ; i<plane.length;i++){
        island.add(plane[i]);
    }
    for (let j=0 ; j<mountain.length;j++){
        island.add(mountain[j]);
    }
    for (let k=0 ; k<mountain.length;k++){
        island.add(mountheight[k]);
    }


    return island;
}

function Island2(){
    const island = new THREE.Group();
    const plane = [];
    const mountain = [];
    const mountheight = [];
    const plane0 = createPlane(300, 280, 0, 0);
    plane.push(plane0);
    const plane1 = createPlane(300, 280, 180, -100);
    plane.push(plane1);
    const plane2 = createPlane(300, 280, -180, -100);
    plane.push(plane2);
    const plane3 = createPlane(250, 250, 300, -200);
    plane.push(plane3);
    const plane4 = createPlane(250, 250, -300, -200);
    plane.push(plane4);
    const plane5 = createPlane(250, 250, -230, -150);
    plane.push(plane5);
    const plane6 = createPlane(250, 250, 230, -150);
    plane.push(plane6);
    const plane7 = createPlane(150, 150, 300, -350);
    plane.push(plane7);
    const plane8 = createPlane(150, 150, -300, -350);
    plane.push(plane8);

    const mount0 = createMount(250, 250, 0, 0, 10);
    mountain.push(mount0);
    const mount1 = createMount(230, 250, 180, -100, 8);
    mountain.push(mount1);
    const mount2 = createMount(200, 200, 300, -200, 6);
    mountain.push(mount2);
    const mount3 = createMount(100, 150, 300, -320, 6);
    mountain.push(mount3);
    const mount4 = createMount(230, 250, -180, -100, 8);
    mountain.push(mount4);
    const mount5 = createMount(200, 200, -300, -200, 6);
    mountain.push(mount5);
    const mount6 = createMount(100, 150, -300, -320, 6);
    mountain.push(mount6);

    const mountH0 = createMountHeight(0, 0, 50, 80, 50 , 70, 10);
    mountheight.push(mountH0);
    const mountH1 = createMountHeight(200, -80, 55, 60, 40, 80, 10);
    mountheight.push(mountH1);
    const mountH2 = createMountHeight(150, -130, 30, 60, 40, 30, 10);
    mountheight.push(mountH2);
    const mountH3 = createMountHeight(330, -200, 30, 30, 8, 40, 10);
    mountheight.push(mountH3);
    const mountH4 = createMountHeight(-200, -100, 55, 60, 40, 80, 10);
    mountheight.push(mountH4);
    const mountH5 = createMountHeight(-300, -200, 28, 60, 40, 30, 10);
    mountheight.push(mountH5);
    for (let i =0 ; i<plane.length;i++){
        island.add(plane[i]);
    }
    for (let j=0 ; j<mountain.length;j++){
        island.add(mountain[j]);
    }
    for (let k=0 ; k<mountain.length;k++){
        island.add(mountheight[k]);
    }


    return island;
}
function pickRandom(array){
    return array[Math.floor(Math.random() * array.length)];
}