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
        radius = 3,
        velocity = new THREE.Vector3(0, 0, 0),
        angle = 0,
        cannonTimer = 2500,

    })
    {
        this.mesh = mesh;
        this.speed = speed;
        this.radius = radius;
        this.velocity = velocity;
        this.angle = angle;
        this.cannonTimer = cannonTimer;
    }

    Play(timeDelta)
    {   
        this.mesh.position.x += this.velocity.x*timeDelta;
        this.mesh.position.y += this.velocity.y*timeDelta;
        this.cannonTimer = this.cannonTimer-timeDelta;
        
        if (this.cannonTimer < 0) {
            scene.remove(this.mesh);
            return 0;
        }
        return 1;
    }
}

class Ship 
{
    constructor({
        type = 3,
        hp = 10,
        atk = 1,
        mesh = undefined, 
        speed = 1, 
        angle = 0, 
        velocity = new THREE.Vector3(0, 0, 0), 
        headCollision = undefined, 
        isHeadCollision = false, 
        headP = 50,
        bodyCollision = undefined,
        isBodyCollision = false,
        bodyP = 0,
        tailCollision = undefined,
        isTailCollision = false,
        tailP = -50,
        collisionRadius = 0,
        accelerate = false,
        decelerate = false,
        turnLeft = false,
        turnRight = false,
        cannon = [],
        isShootMid = false,
        isShootLeft = false,
        isShootRight = false,
        currentCollider = undefined,
        isCooldown1 = false,
        isCooldown2 = false,
        isCooldown3 = false,
        timeCoolDown = 2200,
        cooldownTimer1 = 1000,
        cooldownTimer2 = 1000,
        cooldownTimer3 = 1000
    }
    ){
        this.type = type;
        this.hp = hp;
        this.atk = atk;
        this.mesh = mesh;
        this.speed = speed;
        this.angle = angle; // alpha
        this.velocity = velocity; // vx, vy
        this.headCollision = headCollision; 
        this.isHeadCollision = isHeadCollision; 
        this.headP = headP;
        this.bodyCollision = bodyCollision;
        this.isBodyCollision = isBodyCollision;
        this.bodyP = bodyP;
        this.tailCollision = tailCollision;
        this.isTailCollision = isTailCollision;
        this.tailP = tailP;
        this.collisionRadius = collisionRadius; // collision radius of current collider
        this.accelerate = accelerate;
        this.decelerate = decelerate;
        this.turnLeft = turnLeft;
        this.turnRight = turnRight;
        this.cannon = cannon;
        this.isShootMid = isShootMid;
        this.isShootLeft = isShootLeft;
        this.isShootRight = isShootRight;
        this.currentCollider = currentCollider;
        this.isCooldown1 = isCooldown1;
        this.isCooldown2 = isCooldown2;
        this.isCooldown3 = isCooldown3;
        this.timeCooldown = timeCoolDown;
        this.cooldownTimer1 = cooldownTimer1;
        this.cooldownTimer2 = cooldownTimer2;
        this.cooldownTimer3 = cooldownTimer3;
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
            this.mesh.rotation.z += 0.015;
            this.angle -= 0.015;
            this.angle = this.angle%(Math.PI*2);
     
        }
        else 
        if (this.turnRight)
        {
            this.mesh.rotation.z -= 0.015;
            this.angle += 0.015;
            this.angle = this.angle%(Math.PI*2);

        }
        this.headCollision.mesh.position.x = this.mesh.position.x + this.headP*Math.cos(-this.angle);
        this.headCollision.mesh.position.y = this.mesh.position.y + this.headP*Math.sin(-this.angle);
        this.bodyCollision.mesh.position.x = this.mesh.position.x + this.bodyP*Math.cos(-this.angle);
        this.bodyCollision.mesh.position.y = this.mesh.position.y + this.bodyP*Math.sin(-this.angle);
        this.tailCollision.mesh.position.x = this.mesh.position.x + this.tailP*Math.cos(-this.angle);
        this.tailCollision.mesh.position.y = this.mesh.position.y + this.tailP*Math.sin(-this.angle);
    }

    RunProcess(runSpeed)
    {
        if (runSpeed == 0) 
            return;
        this.velocity.x = runSpeed*Math.cos(-this.angle);
        this.velocity.y = runSpeed*Math.sin(-this.angle);

        let shipCollisionPosition = new THREE.Vector3();
        this.headCollision.mesh.getWorldPosition( shipCollisionPosition);

	    const nextPosisionX = shipCollisionPosition.x + this.velocity.x; // nextPossition of collision
	    const nextPosisionY = shipCollisionPosition.y + this.velocity.y;


	    if (this.isHeadCollision)
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
       // this.headCollision.mesh.position.x += this.velocity.x;
       // this.headCollision.mesh.position.y += this.velocity.y;

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
                this.headCollision.mesh.getWorldPosition( shipCollisionPosition);
             // console.log("mp: " + collisionPosition.x + " " + collisionPosition.y);
			    collisionR = Distance(
                   shipCollisionPosition.x, shipCollisionPosition.y, 
                    collisionPosition.x, collisionPosition.y
              );
			
		    	if (collisionR<this.headCollision.r+collision.r)
		    	{
			    	//console.log("CollisionDetect");
			    	this.isHeadCollision = true;
			    	this.collisionRadius = collisionR;
			    	this.currentCollider = collision;
			    	foundCollider = true;
		    	}
			    else 
			    {
				//console.log(player.mesh.position.x);
			    }
		    })
		
	    })
        return foundCollider;
    }

    Shoot()
    {
        if (this.type == 1){
            this.ShootType1();
        }

        if (this.type == 2){
            this.ShootType2();
        }

        if (this.type == 3){
            this.ShootType3();
        }
    }

    ShootType1(){
        if (this.isShootMid){
            if (!this.isCooldown1)
            {
                fireSound();
                const bullet = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet.position.z = 29;
                let cannonAngle = this.angle;
                bullet.position.x = this.mesh.position.x + 60* Math.cos(-this.angle);
                bullet.position.y = this.mesh.position.y + 60* Math.sin(-this.angle);
                const cannonTimer = timeCannonMid;
                let midSpeed = cannonSpeed + 0.05;
                let cannonBall = new CannonBall({
                    mesh: bullet,
                    speed: midSpeed,
                    velocity: new THREE.Vector3(midSpeed*Math.cos(-cannonAngle), midSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall.mesh);
                this.PushCannonBall(cannonBall);
            
                this.isCooldown1 = true;
                this.cooldownTimer1 = this.timeCooldown;
            }
            this.isShootMid = false;
        }

        if (this.isShootRight){
            if (!this.isCooldown2){
                fireSound();
                const bullet_1 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_1.position.z = 28;
                let cannonAngle = this.angle + Math.PI / 2;
                bullet_1.position.x = this.mesh.position.x + 8* Math.cos(-this.angle);
                bullet_1.position.y = this.mesh.position.y + 8* Math.sin(-this.angle);
                bullet_1.position.x += 22* Math.cos(-cannonAngle);
                bullet_1.position.y += 22* Math.sin(-cannonAngle);
                const cannonTimer = timeCannonMid;
                let cannonBall_1 = new CannonBall({
                    mesh: bullet_1,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_1.mesh);
                this.PushCannonBall(cannonBall_1);
                this.isCooldown2 = true;
                this.cooldownTimer2 = this.timeCooldown;
            }
            this.isShootRight = false;
        }

        if (this.isShootLeft){
            if (!this.isCooldown3){
                fireSound();
                const bullet = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet.position.z = 28;
                let cannonAngle = this.angle - Math.PI / 2;
                bullet.position.x = this.mesh.position.x + 8* Math.cos(-this.angle);
                bullet.position.y = this.mesh.position.y + 8* Math.sin(-this.angle);
                bullet.position.x += 22* Math.cos(-cannonAngle);
                bullet.position.y += 22* Math.sin(-cannonAngle);
                const cannonTimer = timeCannonMid;
                let cannonBall = new CannonBall({
                    mesh: bullet,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall.mesh);
                this.PushCannonBall(cannonBall);
                this.isCooldown3 = true;
                this.cooldownTimer3 = this.timeCooldown;
            }
            this.isShootLeft = false;
        }
    }

    ShootType2(){
        if (this.isShootMid){
            if (!this.isCooldown1)
            {
                fireSound();
                const bullet = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet.position.z = 34;
                let cannonAngle = this.angle;
                bullet.position.x = this.mesh.position.x + 90* Math.cos(-this.angle);
                bullet.position.y = this.mesh.position.y + 90* Math.sin(-this.angle);
                const cannonTimer = timeCannonMid;
                let midSpeed = cannonSpeed + 0.05;
                let cannonBall = new CannonBall({
                    mesh: bullet,
                    speed: midSpeed,
                    velocity: new THREE.Vector3(midSpeed*Math.cos(-cannonAngle), midSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall.mesh);
                this.PushCannonBall(cannonBall);
            
                this.isCooldown1 = true;
                this.cooldownTimer1 = this.timeCooldown;
            }
            this.isShootMid = false;
        }

        if (this.isShootRight){
            if (!this.isCooldown2){
                fireSound();
                const bullet_1 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_1.position.z = 29;
                let cannonAngle = this.angle + Math.PI / 2;
                bullet_1.position.x = this.mesh.position.x + 25* Math.cos(-this.angle);
                bullet_1.position.y = this.mesh.position.y + 25* Math.sin(-this.angle);
                bullet_1.position.x += 28* Math.cos(-cannonAngle);
                bullet_1.position.y += 28* Math.sin(-cannonAngle);
                const cannonTimer = timeCannonMid;
                let cannonBall_1 = new CannonBall({
                    mesh: bullet_1,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_1.mesh);
                this.PushCannonBall(cannonBall_1);

                const bullet_2 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_2.position.z = 29;
                bullet_2.position.x = this.mesh.position.x - 10* Math.cos(-this.angle);
                bullet_2.position.y = this.mesh.position.y - 10* Math.sin(-this.angle);
                bullet_2.position.x += 28* Math.cos(-cannonAngle);
                bullet_2.position.y += 28* Math.sin(-cannonAngle);
                let cannonBall_2 = new CannonBall({
                    mesh: bullet_2,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_2.mesh);
                this.PushCannonBall(cannonBall_2);
                this.isCooldown2 = true;
                this.cooldownTimer2 = this.timeCooldown;
            }
            this.isShootRight = false;
        }

        if (this.isShootLeft){
            if (!this.isCooldown3){
                fireSound();
                const bullet = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet.position.z = 29;
                let cannonAngle = this.angle - Math.PI / 2;
                bullet.position.x = this.mesh.position.x + 25* Math.cos(-this.angle);
                bullet.position.y = this.mesh.position.y + 25* Math.sin(-this.angle);
                bullet.position.x += 28* Math.cos(-cannonAngle);
                bullet.position.y += 28* Math.sin(-cannonAngle);
                const cannonTimer = timeCannonMid;
                let cannonBall = new CannonBall({
                    mesh: bullet,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall.mesh);
                this.PushCannonBall(cannonBall);

                const bullet_2 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_2.position.z = 29;
                bullet_2.position.x = this.mesh.position.x - 10* Math.cos(-this.angle);
                bullet_2.position.y = this.mesh.position.y - 10* Math.sin(-this.angle);
                bullet_2.position.x += 28* Math.cos(-cannonAngle);
                bullet_2.position.y += 28* Math.sin(-cannonAngle);
                let cannonBall_2 = new CannonBall({
                    mesh: bullet_2,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_2.mesh);
                this.PushCannonBall(cannonBall_2);
                this.isCooldown3 = true;
                this.cooldownTimer3 = this.timeCooldown;
            }
            this.isShootLeft = false;
        }
    }

    ShootType3(){
        if (this.isShootMid){
            if (!this.isCooldown1)
            {
                fireSound();
                const bullet = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet.position.z = 43;
                let cannonAngle = this.angle;
                bullet.position.x = this.mesh.position.x + 90* Math.cos(-this.angle);
                bullet.position.y = this.mesh.position.y + 90* Math.sin(-this.angle);
                const cannonTimer = timeCannonMid;
                let midSpeed = cannonSpeed + 0.05;
                let cannonBall = new CannonBall({
                    mesh: bullet,
                    speed: midSpeed,
                    velocity: new THREE.Vector3(midSpeed*Math.cos(-cannonAngle), midSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall.mesh);
                this.PushCannonBall(cannonBall);
            
                this.isCooldown1 = true;
                this.cooldownTimer1 = this.timeCooldown;
            }
            this.isShootMid = false;
        }

        if (this.isShootRight){
            if (!this.isCooldown2){
                fireSound();
                const bullet_1 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_1.position.z = 34;
                let cannonAngle = this.angle + Math.PI / 2;
                bullet_1.position.x = this.mesh.position.x + 34* Math.cos(-this.angle);
                bullet_1.position.y = this.mesh.position.y + 34* Math.sin(-this.angle);
                bullet_1.position.x += 34* Math.cos(-cannonAngle);
                bullet_1.position.y += 34* Math.sin(-cannonAngle);
                const cannonTimer = timeCannonMid;
                let cannonBall_1 = new CannonBall({
                    mesh: bullet_1,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_1.mesh);
                this.PushCannonBall(cannonBall_1);

                const bullet_2 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_2.position.z = 34;
                bullet_2.position.x = this.mesh.position.x + 8* Math.cos(-this.angle);
                bullet_2.position.y = this.mesh.position.y + 8* Math.sin(-this.angle);
                bullet_2.position.x += 34* Math.cos(-cannonAngle);
                bullet_2.position.y += 34* Math.sin(-cannonAngle);
                let cannonBall_2 = new CannonBall({
                    mesh: bullet_2,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_2.mesh);
                this.PushCannonBall(cannonBall_2);

                const bullet_3 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_3.position.z = 34;
                bullet_3.position.x = this.mesh.position.x - 24* Math.cos(-this.angle);
                bullet_3.position.y = this.mesh.position.y - 24* Math.sin(-this.angle);
                bullet_3.position.x += 34* Math.cos(-cannonAngle);
                bullet_3.position.y += 34* Math.sin(-cannonAngle);
                let cannonBall_3 = new CannonBall({
                    mesh: bullet_3,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_3.mesh);
                this.PushCannonBall(cannonBall_3);
                this.isCooldown2 = true;
                this.cooldownTimer2 = this.timeCooldown;
            }
            this.isShootRight = false;
        }

        if (this.isShootLeft){
            if (!this.isCooldown3){
                fireSound();
                const bullet = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet.position.z = 34;
                let cannonAngle = this.angle - Math.PI / 2;
                bullet.position.x = this.mesh.position.x + 34* Math.cos(-this.angle);
                bullet.position.y = this.mesh.position.y + 34* Math.sin(-this.angle);
                bullet.position.x += 35* Math.cos(-cannonAngle);
                bullet.position.y += 35* Math.sin(-cannonAngle);
                const cannonTimer = timeCannonMid;
                let cannonBall = new CannonBall({
                    mesh: bullet,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall.mesh);
                this.PushCannonBall(cannonBall);

                const bullet_2 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_2.position.z = 34;
                bullet_2.position.x = this.mesh.position.x + 6* Math.cos(-this.angle);
                bullet_2.position.y = this.mesh.position.y + 6* Math.sin(-this.angle);
                bullet_2.position.x += 35* Math.cos(-cannonAngle);
                bullet_2.position.y += 35* Math.sin(-cannonAngle);
                let cannonBall_2 = new CannonBall({
                    mesh: bullet_2,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_2.mesh);
                this.PushCannonBall(cannonBall_2);

                const bullet_3 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
                    color: "black"
                }));
                bullet_3.position.z = 34;
                bullet_3.position.x = this.mesh.position.x - 25* Math.cos(-this.angle);
                bullet_3.position.y = this.mesh.position.y - 25* Math.sin(-this.angle);
                bullet_3.position.x += 35* Math.cos(-cannonAngle);
                bullet_3.position.y += 35* Math.sin(-cannonAngle);
                let cannonBall_3 = new CannonBall({
                    mesh: bullet_3,
                    speed: cannonSpeed,
                    velocity: new THREE.Vector3(cannonSpeed*Math.cos(-cannonAngle), cannonSpeed*Math.sin(-cannonAngle), 0),
                    angle: cannonAngle,
                    cannonTimer: cannonTimer
                })
                scene.add(cannonBall_3.mesh);
                this.PushCannonBall(cannonBall_3);
                this.isCooldown3 = true;
                this.cooldownTimer3 = this.timeCooldown;
            }
            this.isShootLeft = false;
        }
    }

    CoolDownMid(timeDelta)
    {
        if (this.isCooldown1)
        {
            this.cooldownTimer1 -= timeDelta;
            if (this.cooldownTimer1<0)
            {
                this.isCooldown1 = false;
            }
        }

        if (this.isCooldown2)
        {
            this.cooldownTimer2 -= timeDelta;
            if (this.cooldownTimer2<0)
            {
                this.isCooldown2 = false;
            }
        }

        if (this.isCooldown3)
        {
            this.cooldownTimer3 -= timeDelta;
            if (this.cooldownTimer3<0)
            {
                this.isCooldown3 = false;
            }
        }
        
    }

    PushCannonBall(cannonBall)
    {
        playerCannonBall.push(cannonBall);
    }

    
}

class EnemyShip extends Ship
{
    constructor({
        type = 3,
        hp = 10,
        atk = 1,
        mesh = undefined, 
        speed = 1, 
        angle = 0, 
        velocity = new THREE.Vector3(0, 0, 0), 
        headCollision = undefined, 
        isHeadCollision = false, 
        headP = 50,
        bodyCollision = undefined,
        isBodyCollision = false,
        bodyP = 0,
        tailCollision = undefined,
        isTailCollision = false,
        tailP = -50,
        collisionRadius = 0,
        accelerate = false,
        decelerate = false,
        turnLeft = false,
        turnRight = false,
        cannon = [],
        isShootMid = false,
        isShootLeft = false,
        isShootRight = false,
        currentCollider = undefined,
        isCooldown1 = false,
        isCooldown2 = false,
        isCooldown3 = false,
        timeCoolDown = 2200,
        cooldownTimer1 = 1000,
        cooldownTimer2 =1000,
        cooldownTimer3 =1000,
        detectRadius = 900,
        isDetect = false,
        shootRadius = 330,
        isInRange = false,
        playerSide = 0,
    })
    {
        super({type: type, hp: hp, atk: atk, mesh: mesh, speed: speed, angle: angle, velocity: velocity, headCollision: headCollision, 
            isHeadCollision: isHeadCollision, headP: headP, bodyCollision: bodyCollision, isBodyCollision: isBodyCollision, 
            bodyP: bodyP, tailCollision: tailCollision, isTailCollision: isTailCollision, tailP: tailP, 
            collisionRadius: collisionRadius, accelerate: accelerate, decelerate: decelerate, turnLeft: turnLeft, 
            turnRight: turnRight, cannon: cannon, isShootMid: isShootMid, isShootLeft: isShootLeft, 
            isShootRight: isShootRight, currentCollider: currentCollider, isCoolDown1: isCooldown1, isCoolDown2: isCooldown2, isCooldown3: isCooldown3,
            timeCoolDown: timeCoolDown, cooldownTimer1: cooldownTimer1, cooldownTimer2: cooldownTimer2, cooldownTimer3: cooldownTimer3});
        this.detectRadius = detectRadius;
        this.isDetect = isDetect;
        this.shootRadius = shootRadius;    
        this.isInRange = isInRange;
        this.playerSide = playerSide;
    }

    PlayerDetector(player)
    {
        const playerPosition = new THREE.Vector2(player.mesh.position.x, player.mesh.position.y);
        const thisPosition = new THREE.Vector2(this.mesh.position.x, this.mesh.position.y);
        const distance = getDistance(thisPosition, playerPosition);
        if (distance<this.detectRadius)
        {
            this.isDetect = true;
           // console.log("PlayerDetected");
        }
        else 
        {
            this.isDetect = false;
        }
    }

    PlayerInRangeDetector(player)
    {
        const playerPosition = new THREE.Vector2(player.mesh.position.x, player.mesh.position.y);
        const thisPosition = new THREE.Vector2(this.mesh.position.x, this.mesh.position.y);
        const distance = getDistance(thisPosition, playerPosition);
        if (distance<this.shootRadius)
        {
            this.isInRange = true;
          //  console.log("PlayerInRange");
        }
        else 
        {
            this.isInRange = false;
        }
    }

    Navigator(player)
    {
        const ax = this.velocity.x;
        const ay = this.velocity.y;
        const bx = player.mesh.position.x - this.mesh.position.x;
        const by = player.mesh.position.y - this.mesh.position.y;
        let angle = Math.acos((ax*bx+ay*by)/(Math.sqrt(ax**2+ay**2)*Math.sqrt(bx**2+by**2)));
        const x = player.mesh.position.x;
        const y = player.mesh.position.y;    
        const xa = this.mesh.position.x;
        const ya = this.mesh.position.y;
        const xb = xa+ax*2;
        const yb = ya + ay*2;

        const currentD = Distance(xa,ya,x,y);
        const nextD = Distance(xb,yb,x,y);


        const p = Math.sign((xb-xa)*(y-ya)-(yb-ya)*(x-xa));
        this.playerSide = p; // is Player left or right

       // console.log("angle: " +angle);
        if (this.isInRange)
        {   
           
            if ((angle <0.6 || angle >2.0))
            {
                this.isShootMid = true;
            }
            
            if (angle>Math.PI/2+0.06)
            {
                this.accelerate = false;
                if (p<0)
                {
                    this.turnRight = true;
                    this.turnLeft = false;
                }
                else
                {
                    this.turnLeft = true;
                    this.turnRight = false;
                }
            }
            else if (angle<Math.PI/2)
            {
                this.accelerate = false;
             
                if (p>0)
                {
                this.turnRight = true;
                this.turnLeft = false;
                }
                else
                {
                    this.turnLeft = true;
                    this.turnRight = false;
                }
            }
            else 
            {
                this.turnLeft = false;
                this.turnRight = false;
                this.accelerate = true;
            }
            
        }
        else
        if (angle>0.1 || nextD>=currentD)
        {
            if (angle<0.6)
            {
                this.accelerate = true;
            }
            else
                this.accelerate = false;
            if (p>0)
                {
                    this.turnLeft = true;
                    this.turnRight = false;
                }
            else if (p<0)
                {
                    this.turnRight = true;
                    this.turnLeft = false;
                }   
            
        }
        else 
        {
            this.accelerate = true;
            this.turnLeft = false;
            this.turnRight = false;
        }
    }

    PushCannonBall(cannonBall)
    {
        enemyCannonBall.push(cannonBall);
    }
}



const scene = new THREE.Scene();
//const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];

// camera

const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 
	70, // vertical field of view
	aspectRatio, // aspect ratio
	10, // near plane
	2000 // far plane
);

const listener = new THREE.AudioListener();
camera.add( listener );


//const aspectRatio = window.innerWidth/ window.innerHeight;
const cameraWidth = 860;
const cameraHeight = cameraWidth/ aspectRatio;

const offsetY = -210;

camera.position.set(0, offsetY, 700);
//camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);



let exp = 0;
let score = 0;
let enemyShip = [];
let playerCannonBall = [];
let enemyCannonBall = [];

let player = CreateShip1(true, 0, 0);

//player.speed = 0.05;

//camera.lookAt(player.mesh.position.x, player.mesh.position.y, player.mesh.position.z);

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

//const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);

//const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

let map = [];
const tileMapSize = 1200; // TilesMapSize

const neighborTilesX = [tileMapSize, tileMapSize, tileMapSize, 0, 0, -tileMapSize, -tileMapSize, -tileMapSize];
const neighborTilesY = [tileMapSize, 0, -tileMapSize, tileMapSize, -tileMapSize, tileMapSize, 0, -tileMapSize];
const neighborTilesI = [1, 1, 1, 0, 0, -1, -1, -1];
const neighborTilesJ = [1, 0, -1, 1, -1, 1, 0, -1];

let generator = new Array(1000);
let tileStorage = new Array(1000);
let thisI = 500;
let thisJ = 500;
let preI = 500;
let preJ = 500;
for (let i = 0; i < generator.length; i++) 
{
  generator[i] = new Array(1000);
  tileStorage[i] = new Array(1000);
  for (let j = 0; j < generator[i].length; j++)
  {
	  generator[i][j] = 0;
  }
}
console.log(generator[500][500]);
let ready;
const hpElement = document.getElementById("hp");
const scoreElement = document.getElementById("score");

let lastTimestamp;
let cannonSpeed = 0.2;
let timeCannonMid = 1500;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth/1.07, window.innerHeight/1.07 );
document.body.appendChild( renderer.domElement );

//renderMap(cameraWidth, cameraHeight);
reset ();
UpdateMap(tileMapSize);

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

    if (event.key == "W" || event.key == "w"){
        player.isShootMid = true;
        return;
    }

    if (event.key == "A" || event.key == "a"){
        player.isShootLeft = true;
        return;
    }

    if (event.key == "D" || event.key == "d"){
        player.isShootRight = true;
        return;
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

function fireSound()
{
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'Cannon.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.2 );
        sound.play();
    });
    
}

function waveSound()
{
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'Wave.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.2 );
        sound.play();
    });
}

function explosionSound()
{
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'Explosion.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.2 );
        sound.play();
    });
}

function hitSound()
{
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'Hit.wav', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.2 );
        sound.play();
    });
}

function reset()
{
  
    const minimumRange = 0;
    const maximumRange = tileMapSize/2-200;
    player.MoveShip(0);
	score = 0;
    exp = 0;
    hpElement.innerText = "hp: " + player.hp;
	scoreElement.innerText = "score: " + score;
	lastTimestamp = undefined;
    for (let i = 0; i < generator.length; i++) 
    {
        for (let j = 0; j < generator[i].length; j++)
        {
            if (generator[i][j]!=0)
            {
                scene.remove(tileStorage[i][j].mesh);
                generator[i][j] = 0;
            }
        }

    }
    map.splice(0,map.length);

    for (let i =0; i<enemyShip.length; i++)
    {
        scene.remove(enemyShip[i].mesh);
    }

    enemyShip.splice(0, enemyShip.length);
    addRandomMap(0, 0, minimumRange, maximumRange, 0);
    generator[500][500] = 1;
    let ship = CreateShip1(true, 0, 0);
        ship.angle = player.angle;
        ship.mesh.rotation.z = player.mesh.rotation.z;
        scene.remove(player.mesh);
        player.collision = null;
        player = null;
        player = ship;
   // player.mesh.position.x = 0;
  //  player.mesh.position.y = 0;
	renderer.render(scene, camera);
	ready = true;
}

function startGame() 
{
	if (ready)
	{
		ready = false;
        waveSound();
		renderer.setAnimationLoop(animation);
	}
}

/// ANIMATION LOOP
function animation(timestamp) 
{
	hpElement.innerText = "hp: " + player.hp;
	scoreElement.innerText = "score: " + score;
	if (!lastTimestamp)
	{
		lastTimestamp = timestamp;
		return;
	}
	const timeDelta = timestamp - lastTimestamp;
   
    PlayerAnimation(timeDelta);
   
    camera.position.x = player.mesh.position.x;
	camera.position.y = player.mesh.position.y + offsetY;
    EnemyAnimation(timeDelta);
    CheckColliderPlayerCannon();
    CheckColliderEnemyCannon();
    
   // CheckColliderEvE(timeDelta);
	UpdateMap(tileMapSize);
    LevelUp();

	renderer.render(scene, camera);
	lastTimestamp = timestamp;
}

function LevelUp()
{
    if (exp>20 && player.type ==2)
    {
        let ship = CreateShip3(true, player.mesh.position.x, player.mesh.position.y);
        ship.angle = player.angle;
        ship.mesh.rotation.z = player.mesh.rotation.z;
        scene.remove(player.mesh);
        player.collision = null;
        player = ship;
    }
    else if (exp>5 && player.type ==1)
    {
        let ship = CreateShip2(true, player.mesh.position.x, player.mesh.position.y);
        ship.angle = player.angle;
        ship.mesh.rotation.z = player.mesh.rotation.z;
        scene.remove(player.mesh);
        player.collision = null;
        player = null;
        player = ship;
    }
}

function CheckColliderOvA(thisShip, otherShip)
{

    let foundCollider = false;
    otherShip.forEach((enemy) => {
        if (enemy != thisShip)
        {
            foundCollider = CheckCollider1v1(thisShip, enemy);
        }
       
    });

    return foundCollider;

}

function CheckCollider1v1(thisShip, enemy)
{
    let playerHeadCollisionPosition = new THREE.Vector3();
    thisShip.headCollision.mesh.getWorldPosition( playerHeadCollisionPosition);
    let playerBodyCollisionPosition = new THREE.Vector3();
    thisShip.bodyCollision.mesh.getWorldPosition( playerBodyCollisionPosition);
    let playerTailCollisionPosition = new THREE.Vector3();
    thisShip.tailCollision.mesh.getWorldPosition( playerTailCollisionPosition);

    let collisionH, collisionB, collisionT; // distance radius thisHead with other
    let foundCollider = false;
    let enemyHeadCollisionPosition = new THREE.Vector3();
    enemy.headCollision.mesh.getWorldPosition( enemyHeadCollisionPosition ); 
    
    let enemyBodyCollisionPosition = new THREE.Vector3();
    
    enemy.bodyCollision.mesh.getWorldPosition( enemyBodyCollisionPosition ); 
    
    let enemyTailCollisionPosition = new THREE.Vector3();
    enemy.tailCollision.mesh.getWorldPosition( enemyTailCollisionPosition ); 

    
    collisionH = Distance(
       playerHeadCollisionPosition.x, playerHeadCollisionPosition.y, 
        enemyHeadCollisionPosition.x, enemyHeadCollisionPosition.y
    );
    
           
    collisionB = Distance(
        playerHeadCollisionPosition.x, playerHeadCollisionPosition.y, 
         enemyBodyCollisionPosition.x, enemyBodyCollisionPosition.y
    );

            
    collisionT = Distance(
        playerHeadCollisionPosition.x, playerHeadCollisionPosition.y, 
         enemyTailCollisionPosition.x, enemyTailCollisionPosition.y
    );


    if (collisionH<thisShip.headCollision.r+ enemy.headCollision.r)
    {
        setHeadCollider(thisShip, enemy.headCollision, collisionH);
        foundCollider = true;
    }

    if (collisionB<thisShip.headCollision.r+enemy.bodyCollision.r)
    {
        setHeadCollider(thisShip, enemy.bodyCollision, collisionB);
        foundCollider = true;
    }

    if (collisionT<thisShip.headCollision.r+enemy.tailCollision.r)
    {
        setHeadCollider(thisShip, enemy.tailCollision, collisionT);
        foundCollider = true;
    }
    return foundCollider;
}

function CheckEvECollider()
{
    for (let i =0; i<enemyShip.length-1; i++)
    {
        let foundCollider = CheckCollider1v1(enemyShip[i], player);
        enemyShip[i].isHeadCollision = foundCollider;
    }
 
    for (let i =0; i<enemyShip.length-1; i++)
    {
        for (let j=i+1; j<enemyShip.length; j++)
        {
            let foundCollider1 =false;
            let foundCollider2 = false;
            foundCollider1 = CheckCollider1v1(enemyShip[i], enemyShip[j]);
            foundCollider2 = CheckCollider1v1(enemyShip[j], enemyShip[i]);
            if (!enemyShip[i].isHeadCollision)
                enemyShip[i].isHeadCollision = foundCollider1;
            if (!enemyShip[j].isHeadCollision)
                enemyShip[j].isHeadCollision = foundCollider2;   

        }
    }
}

function setHeadCollider(ship, shipCollider, collisionR)
{

    ship.isHeadCollision = true;
    ship.collisionRadius = collisionR;
    ship.currentCollider = shipCollider;
}

function CheckColliderPlayerCannon()
{
    for (let i =playerCannonBall.length - 1; i>-1; i--)
    {
        let isHit =false;
        for (let j = enemyShip.length - 1; j> -1; j--)
        {
            if (IsCannonBallHitShip(playerCannonBall[i], enemyShip[j]))
                isHit = true;
            if (isHit)
            {
                hitSound();
                console.log("hit enemy");
                enemyShip[j].hp -= player.atk;
                console.log("hp: " + enemyShip[j].hp);
                if (enemyShip[j].hp < 1)
                {
                    explosionSound();
                    if (enemyShip[j].type == 1)
                    {
                        player.hp +=1;
                    }
                    else if (enemyShip[j].type ==2)
                    {
                        player.hp +=2;
                    }
                    else if (enemyShip[j].type ==3)
                    {
                        player.hp +=3;
                    }
                    score += enemyShip[j].type;
                    scoreElement.innerText = "score: " + score;
                    exp += enemyShip[j].type;
                    console.log("exp: " + exp);
                    scene.remove(enemyShip[j].mesh);
                    enemyShip.splice(j,1);
                   
                }
                j = -1;
            }
        }
        if (isHit)
        {
            scene.remove(playerCannonBall[i].mesh);
            playerCannonBall.splice(i,1);
        }
        
    }
}

function CheckColliderEnemyCannon()
{
    for (let i =enemyCannonBall.length - 1; i>-1; i--)
    {
        let isHit =false;
        if (IsCannonBallHitShip(enemyCannonBall[i], player))
            isHit = true;
        if (isHit)
        {
            hitSound();
            console.log("hit player");
            player.hp -= 1;
            console.log("hp: " + player.hp);
            scene.remove(enemyCannonBall[i].mesh);
            enemyCannonBall.splice(i,1);
            if (player.hp < 1)
            {
                explosionSound();
                reset();
            }

        }
        
    }
}

function IsCannonBallHitShip(cannonBall, ship)
{
    if (Distance(
        ship.headCollision.mesh.position.x, ship.headCollision.mesh.position.y,
        cannonBall.mesh.position.x, cannonBall.mesh.position.y
        )< cannonBall.radius+ship.headCollision.r)
    {
        return true;        
    }
    if (Distance(
        ship.bodyCollision.mesh.position.x, ship.bodyCollision.mesh.position.y,
        cannonBall.mesh.position.x, cannonBall.mesh.position.y
    ) < cannonBall.radius+ship.bodyCollision.r)
    {
        return true;
    }
    if (Distance(
        ship.tailCollision.mesh.position.x, ship.tailCollision.mesh.position.y,
        cannonBall.mesh.position.x, cannonBall.mesh.position.y
    ) < cannonBall.radius+ship.tailCollision.r)
    {
        return true;
    }

    return false;
}

function PlayerAnimation(timeDelta)
{
    let colliderCheck;
    player.isHeadCollision = player.ShipColliderCheck();
    colliderCheck = CheckColliderOvA(player, enemyShip);
    if (!player.isHeadCollision)
    {
        player.isHeadCollision = colliderCheck;
    }
	player.MoveShip(timeDelta);
    player.Shoot();
	player.CoolDownMid(timeDelta);
    PlayerCannonBallProcess(timeDelta);
}

function EnemyAnimation(timeDelta)
{
    CheckEvECollider();
    for (let i = enemyShip.length-1; i>-1; i--)
    {
        if (Distance(
            enemyShip[i].mesh.position.x, enemyShip[i].mesh.position.y, 
            player.mesh.position.x, player.mesh.position.z)> tileMapSize*5)
        {
            scene.remove(enemyShip[i].mesh);
            scene.remove(enemyShip[i].headCollision.mesh);
            enemyShip.splice(i,1);
        }
        else
        {
          
            let colliderCheck = enemyShip[i].ShipColliderCheck();
            if (!enemyShip[i].isHeadCollision)
                enemyShip[i].isHeadCollision = colliderCheck;
         
            enemyShip[i].MoveShip(timeDelta);
           // enemyShip[i].Shoot(enemyCannonBall, timeDelta);
            enemyShip[i].CoolDownMid(timeDelta); 
            enemyShip[i].PlayerDetector(player);
            if (enemyShip[i].isDetect)
            {
                enemyShip[i].Navigator(player);
            }
            enemyShip[i].PlayerInRangeDetector(player);
            if (enemyShip[i].isInRange)
            {
                console.log("sign: "+ enemyShip[i].playerSide);
                if (enemyShip[i].playerSide>0.8)
                {
                    enemyShip[i].isShootLeft = true;
                }
                else if (enemyShip[i].playerSide<-0.8)
                {
                    enemyShip[i].isShootRight = true;
                }
                else 
                {
                    enemyShip[i].isShootMid = true;
                }

            }
            enemyShip[i].Shoot();
            
        }
       
    }

    EnemyCannonBallProcess(timeDelta);
  
}

function CreateShip3(isPlayer, px, py)
{
    
    const shipMesh = Ship3();

    //const playerAngleInitial = Math.PI;
    const speed = 0.035;
    //const speed = 0.1; // increase speed for testing
    const shipRadius = 30; // used for collision
 
    let headP = 60;
    let headCollisionMesh = createCollision(px + headP, py, 40, shipRadius,32);
    let headCollision = new Collision(0, headCollisionMesh, shipRadius, 0, 0 );

    let bodyP = 0;
    let bodyCollisionMesh = createCollision(px + bodyP, py, 40, shipRadius,32);
    let bodyCollision = new Collision(0, bodyCollisionMesh, shipRadius, 0, 0 );

    let tailP = -60;
    let tailCollisionMesh = createCollision(px + tailP, py, 40, shipRadius,32);
    let tailCollision = new Collision(0, tailCollisionMesh, shipRadius, 0, 0 );
    scene.add(shipMesh);
    
    let ship;

    if (isPlayer)
    {
        ship = new Ship({
            type: 3,
            mesh: shipMesh, speed: speed, 
            headCollision: headCollision, headP: headP, 
            bodyCollision: bodyCollision, bodyP: bodyP,
            tailCollision: tailCollision, tailP: tailP
        });
    }
    else
    {
        ship = new EnemyShip({
            type: 3,
            mesh: shipMesh, speed: speed, 
            headCollision: headCollision, headP: headP, 
            bodyCollision: bodyCollision, bodyP: bodyP,
            tailCollision: tailCollision, tailP: tailP
        });
    }

    ship.mesh.position.x = px;
    ship.mesh.position.y = py;
    ship.headCollision.mesh.visible = false;
    ship.bodyCollision.mesh.visible = false;
    ship.tailCollision.mesh.visible = false;
 
    ship.atk = 1;
    ship.hp = 10;


//player.collisionObject = playerCollision;
    console.log(ship.headCollision);
    let shipCollisionPosition = new THREE.Vector3();
    ship.headCollision.mesh.getWorldPosition( shipCollisionPosition);

    console.log("playerCollision: " + shipCollisionPosition.x + " " + shipCollisionPosition.y);
    return ship;
}

function CreateShip2(isPlayer, px, py)
{
    
    const shipMesh = Ship2();

    //const playerAngleInitial = Math.PI;
    const speed = 0.045;
    //const speed = 0.1; // increase speed for testing
    const shipRadius = 24; // used for collision
 
    let headP = 50;
    let headCollisionMesh = createCollision(px + headP, py, 40, shipRadius,32);
    let headCollision = new Collision(0, headCollisionMesh, shipRadius, 0, 0 );

    let bodyP = 0;
    let bodyCollisionMesh = createCollision(px + bodyP, py, 40, shipRadius,32);
    let bodyCollision = new Collision(0, bodyCollisionMesh, shipRadius, 0, 0 );

    let tailP = -50;
    let tailCollisionMesh = createCollision(px + tailP, py, 40, shipRadius,32);
    let tailCollision = new Collision(0, tailCollisionMesh, shipRadius, 0, 0 );
    scene.add(shipMesh);
    
    let ship
    if (isPlayer)
    {
        ship = new Ship({
            type: 2,
            mesh: shipMesh, speed: speed, 
            headCollision: headCollision, headP: headP, 
            bodyCollision: bodyCollision, bodyP: bodyP,
            tailCollision: tailCollision, tailP: tailP
        });
    }
    else
    {
        ship = new EnemyShip({
            type: 2,
            mesh: shipMesh, speed: speed, 
            headCollision: headCollision, headP: headP, 
            bodyCollision: bodyCollision, bodyP: bodyP,
            tailCollision: tailCollision, tailP: tailP
        });
    }

    ship.headCollision.mesh.visible = false;
    ship.bodyCollision.mesh.visible = false;
    ship.tailCollision.mesh.visible = false;
  
    ship.mesh.position.x = px;
    ship.mesh.position.y = py;

    ship.atk = 1;
    ship.hp = 7;

//player.collisionObject = playerCollision;
    console.log(ship.headCollision);
    let shipCollisionPosition = new THREE.Vector3();
    ship.headCollision.mesh.getWorldPosition( shipCollisionPosition);

    console.log("playerCollision: " + shipCollisionPosition.x + " " + shipCollisionPosition.y);
    return ship;
}

function CreateShip1(isPlayer, px, py)
{
    
    const shipMesh = Ship1();

    //const playerAngleInitial = Math.PI;
    const speed = 0.055;
    //const speed = 0.1; // increase speed for testing
    const shipRadius = 20; // used for collision
 
    let headP = 40;
    let headCollisionMesh = createCollision(px + headP, py, 40, shipRadius,32);
    let headCollision = new Collision(0, headCollisionMesh, shipRadius, 0, 0 );

    let bodyP = 0;
    let bodyCollisionMesh = createCollision(px + bodyP, py, 40, shipRadius,32);
    let bodyCollision = new Collision(0, bodyCollisionMesh, shipRadius, 0, 0 );

    let tailP = -40;
    let tailCollisionMesh = createCollision(px + tailP, py, 40, shipRadius,32);
    let tailCollision = new Collision(0, tailCollisionMesh, shipRadius, 0, 0 );
    scene.add(shipMesh);
    
    let ship;
    if (isPlayer)
    {
        ship = new Ship({
            type: 1,
            mesh: shipMesh, speed: speed, 
            headCollision: headCollision, headP: headP, 
            bodyCollision: bodyCollision, bodyP: bodyP,
            tailCollision: tailCollision, tailP: tailP
        });
    }
    else
    {
        ship = new EnemyShip({
            type: 1,
            mesh: shipMesh, speed: speed, 
            headCollision: headCollision, headP: headP, 
            bodyCollision: bodyCollision, bodyP: bodyP,
            tailCollision: tailCollision, tailP: tailP
        });
    }

    ship.headCollision.mesh.visible = false;
    ship.bodyCollision.mesh.visible = false;
    ship.tailCollision.mesh.visible = false;

    ship.mesh.position.x = px;
    ship.mesh.position.y = py;

    ship.atk = 1;
    ship.hp = 5;

//player.collisionObject = playerCollision;
    console.log(ship.headCollision);
    let shipCollisionPosition = new THREE.Vector3();
    ship.headCollision.mesh.getWorldPosition( shipCollisionPosition);

    console.log("playerCollision: " + shipCollisionPosition.x + " " + shipCollisionPosition.y);
    return ship;
}

function PlayerCannonBallProcess(timeDelta)
{
    for (let i = playerCannonBall.length-1; i>-1; i--) 
    {
        const alive = playerCannonBall[i].Play(timeDelta);
        if (alive == 0)
            playerCannonBall.splice(i, 1);
    }
}

function EnemyCannonBallProcess(timeDelta)
{
    for (let i = enemyCannonBall.length-1; i>-1; i--) 
    {
        const alive = enemyCannonBall[i].Play(timeDelta);
        if (alive == 0)
            enemyCannonBall.splice(i, 1);
    }
}

function getDistance(cordinate1, cordinate2)
{
	return Math.sqrt((cordinate2.x - cordinate1.x)**2 + (cordinate2.y - cordinate1.y)**2);
}

function Ship3() 
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
}

function Ship1(){
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
}

function createIsland(){
    const island = new THREE.Group();
    const colorArr = ["darkolivegreen", "olivedrab"]
    for (let i = 0; i< 80; i++){
        let ismoutain = Math.floor(Math.random()*2);
        let h = Math.floor(Math.random()*60)+10;
        const plane = new THREE.Mesh(
            new THREE.BoxBufferGeometry(100, h, 2),
            new THREE.MeshLambertMaterial({color: 0xF5DEB3})
        );
        plane.position.x = Math.floor(Math.random()*100);
        plane.position.y = Math.floor(Math.random()*100);
        island.add(plane);
        if (ismoutain == 1){
            let mZ = 2;
            let mW = 80;
            let mH = h;
            let moutainColor = colorArr[Math.floor(Math.random()*colorArr.length)];
            for (let j = 0; j<6; j++){
                if (mH<0 || mW <0)
                {
                    break;
                }
                const moutain = new THREE.Mesh(
                    new THREE.BoxBufferGeometry(mW, mH, 2),
                    new THREE.MeshLambertMaterial({color: moutainColor})
                );
                moutain.position.z = mZ;
                moutain.position.x = plane.position.x;
                moutain.position.y = plane.position.y;
                mZ += 2;
                mW -= 15;
                mH -= 10;
                island.add(moutain);
            }
        }
    }
    return island;
}

function pickRandom(array)
{
	return array[Math.floor(Math.random()* array.length)];
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

  
function renderMap(mapWidth, mapHeight) 
{
    const minimumRange = 1;
    const maximumRange = 100;
 
    addRandomMap(0, 0, minimumRange, maximumRange, 0);
	generator[500][500] = 1;

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

function addRandomShip(centerX, centerY, minimumRange, maximumRange)
{
    let iX, iY;
    iX = randomR(minimumRange, maximumRange);
    iY = randomR(minimumRange, maximumRange);
    iX = randomNegative(iX);
    iY = randomNegative(iY);
    addShip(centerX, centerY, iX, iY);
}

function addShip(centerX, centerY, iX, iY)
{
    const meshTypes = ["ship1", "ship2", "ship3"];
    let type = pickRandom(meshTypes);
    let ship;
    if (type == "ship1")
    {
        ship = CreateShip1(false, centerX +iX, centerY + iY);
    }
    else if (type == "ship2")
    {
        ship = CreateShip2(false, centerX +iX, centerY + iY);
    }
    else if (type == "ship3")
    {
        ship = CreateShip3(false, centerX +iX, centerY + iY);
    }
    const randomAngle = randomR(0, 2*Math.PI);
    ship.angle += randomAngle;
    ship.mesh.rotation.z -= randomAngle;
  
   // ship.headCollision.mesh.position.x = ship.mesh.position.x+ ship.headP*Math.cos(-ship.angle);
    //ship.headCollision.mesh.position.y = ship.mesh.position.y+ ship.headP*Math.sin(-ship.angle);
    enemyShip.push(ship);
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
    const currentI = Math.floor((centerX)/tileMapSize);
	const currentJ = Math.floor((centerY)/tileMapSize);
	const i = currentI+500; // position i in generator array
	const j = currentJ+500;

    tileStorage[i][j] = {mesh, type, collider};


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
    collision.visible = false;
    return collision;
}

function Distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function UpdateMap(size)
{
	const minimumRange = 0;
    const maximumRange = tileMapSize/2-200;
	let currentX = player.mesh.position.x;
	let currentY = player.mesh.position.y;
	const halfSize = size/2;
	if (currentX < 0) 
		currentX - halfSize;
	else 
		currentX + halfSize;
	
	if (currentY < 0)
		currentY - halfSize;
	else 
		currentY + halfSize;

	const currentI = Math.floor((currentX+halfSize)/size);
	const currentJ = Math.floor((currentY+halfSize)/size);
	const i = currentI+500; // position i in generator array
	const j = currentJ+500;

	const x = currentI * size;
	const y = currentJ * size;

	if (i<1 || i>998 || j<1 || j>998) // reset the Map when it too big
	{
		
        for (let i = 0; i < generator.length; i++) 
        {
            for (let j = 0; j < generator[i].length; j++)
            {
                if (generator[i][j]!=0)
                {
                    scene.remove(tileStorage[i][j].mesh);
                    generator[i][j] = 0;
                }
            }
    
        }
        map.splice(0,map.length);
        for (let i =0; i<enemyShip.length; i++)
        {
            scene.remove(enemyShip[i].mesh);
        }
        enemyShip.splice(0, enemyShip.length);
		addRandomMap(0, 0, minimumRange, maximumRange, 0);
		generator[500][500] = 1;
		player.mesh.position.x = 0;
		player.mesh.position.y = 0;
		return;
	}

	if ((generator[i][j] == 1) || (generator[i][j] == generator[thisI][thisJ] +1))
	{
        
        if (generator[i][j] == 1)
            generator[i][j] = 2;
		console.log("Came in new tile => x: " +x + " y: " + y);
        console.log("generator: " + generator[i][j] + " " + generator[thisI][thisJ]);
	
	
		for (let k=0; k<neighborTilesI.length; k++)
		{
			
			let di = neighborTilesI[k];
			let dj = neighborTilesJ[k];
			let dx = neighborTilesX[k];
			let dy = neighborTilesY[k];
            const ii = i+di;
            const jj = j+dj;
			if (generator[ii][jj] == 0)
			{
				generator[ii][jj] = generator[i][j] + 1;
				addRandomMap(x+dx, y+dy, minimumRange, maximumRange);
                addRandomShip(x+dx, y+dy, minimumRange, maximumRange);
			}
            else if (generator[ii][jj] == -1)
            {
                generator[ii][jj] = generator[i][j]+1;
                scene.add(tileStorage[ii][jj].mesh);
                const mesh = tileStorage[ii][jj].mesh;
                const type = tileStorage[ii][jj].type;
                const collider = tileStorage[ii][jj].collider;
	            map.push({
                    mesh, type, collider
                });

            }
            else
            {
                generator[ii][jj] = generator[i][j] + 1;
            }
			
		}


        for (let k=0; k<neighborTilesI.length; k++)
		{
			let di = neighborTilesI[k];
			let dj = neighborTilesJ[k];
		
            const ii = preI+di;
            const jj = preJ+dj;
            if (ii == i & jj == j)
                continue;

            console.log("generator compare: " + generator[i][j] + " " + generator[ii][jj])

            if (generator[ii][jj] == -1)
                continue;
            if (generator[ii][jj] != generator[i][j]+1 )
            {
                if (generator[ii][jj] != 0)
                {
                    generator[ii][jj] = -1
                    console.log("begin delete tile");
                    for (let m = map.length-1; m>-1; m--) 
                    {
                        const tileI = Math.floor((map[m].mesh.position.x)/size) + 500;
                        const tileJ = Math.floor((map[m].mesh.position.y)/size) + 500;

                        //console.log(ii + " " + jj + " " + tileI + " " + tileJ)
                        if (tileI == ii && tileJ == jj)
                        {
                            console.log("Delete and Save x: " + map[m].mesh.position.x + " y: " + map[m].mesh.position.y);
                            scene.remove(map[m].mesh);
                            map.splice(m,1);
                        }
                    }
                    
                }
            }

        }

        preI = thisI;
        preJ = thisJ;
        thisI = i;
        thisJ = j;
	}

    
	
}


