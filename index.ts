var engine;
var canvas;

var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 6, 1.3, 1500, new BABYLON.Vector3(0, -3, 0), scene);
    camera.attachControl(canvas);
    camera.keysDown = [];
    camera.keysUp = [];
    camera.keysLeft = [];
    camera.keysRight = [];

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0.2), scene);
    light.groundColor = new BABYLON.Color3(.2, .2, .2);

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 4000,
        height: 4000
    }, scene);
    ground.position.y = -70;

    //car
    var rad = 50;
    var h = 40;
    var w = 50;
    var d = 100;
	var holderSize = 20;

    var body = BABYLON.MeshBuilder.CreateBox("body", {
        width: (w + 20) * 1.5,
        height: h,
        depth: (d + 40) * 1.5
    }, scene);

	//wheel-holders (for slider joints)
	var holder1 = BABYLON.MeshBuilder.CreateBox("holder1", {
		height: holderSize, width: holderSize/2, depth: holderSize/2
	}, scene);
	holder1.position.copyFromFloats(-w, 30, -d);
	
	var holder2 = BABYLON.MeshBuilder.CreateBox("holder2", {
		height: holderSize, width: holderSize/2, depth: holderSize/2
	}, scene);
	holder2.position.copyFromFloats(w, 30, -d);
	
	var holder3 = BABYLON.MeshBuilder.CreateBox("holder3", {
		height: holderSize, width: holderSize/2, depth: holderSize/2
	}, scene);
	holder3.position.copyFromFloats(-w, 30, d);
	
	var holder4 = BABYLON.MeshBuilder.CreateBox("holder4", {
		height: holderSize, width: holderSize/2, depth: holderSize/2
	}, scene);
	holder4.position.copyFromFloats(w, 30, d);

    //Wheels
    var wheel1 = BABYLON.MeshBuilder.CreateSphere("wheel1", {
        diameterY: rad/2,
        diameterX: rad,
        diameterZ: rad,
        segments: 5
    }, scene);
    wheel1.position.copyFromFloats(-w, 40, -d);

    var wheel2 = BABYLON.MeshBuilder.CreateSphere("wheel2", {
        diameterY: rad/2,
        diameterX: rad,
        diameterZ: rad,
        segments: 5
    }, scene);
    wheel2.position.copyFromFloats(w, 40, -d);

    var wheel3 = BABYLON.MeshBuilder.CreateSphere("wheel3", {
        diameterY: rad/2,
        diameterX: rad,
        diameterZ: rad,
        segments: 5
    }, scene);
    wheel3.position.copyFromFloats(-w, 40, d);

    var wheel4 = BABYLON.MeshBuilder.CreateSphere("wheel4", {
        diameterY: rad/2,
        diameterX: rad,
        diameterZ: rad,
        segments: 5
    }, scene);
    wheel4.position.copyFromFloats(w, 40, d);
	
	function rand(mult) {
		return Math.random() * (Math.random() < 0.5 ? -1 : 1) * mult;
	}

    //physics
    scene.enablePhysics(null, <any>new BABYLON.OimoJSPlugin(100));
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 0.1,
        restitution: 0.5
    });

    body.physicsImpostor = new BABYLON.PhysicsImpostor(body, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 1,
        friction: 1,
        restitution: 1.5
    });
	
	[holder1, holder2, holder3, holder4].forEach(function (h) {
		h.isVisible = true;
		h.physicsImpostor = new BABYLON.PhysicsImpostor(h, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 1,
            friction: 4,
            restitution: 0.5,
            nativeOptions: {
                move: false
            }
        });
		h.physicsImpostor.physicsBody.collidesWith = ~1;
	});

    [wheel1, wheel2, wheel3, wheel4].forEach(function (w) {
        w.physicsImpostor = new BABYLON.PhysicsImpostor(w, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 1,
            friction: 4,
            restitution: 0.5,
            nativeOptions: {
                move: true
            }
        });
    });
	
	// //Obstacles
	// for (var index = 0; index < 300; index++) {
	// 	var s = BABYLON.MeshBuilder.CreateSphere("o" + index, { segments: 3, diameter: rad }, scene);
	// 	s.position.copyFromFloats(rand(2000), -70, rand(2000));
	// 	s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.SphereImpostor, {
    //         mass: 0,
    //         friction: 4,
    //         restitution: 0.1,
    //         nativeOptions: {
    //             move: false
    //         }
    //     });
	// }
	 
	// for (var index = 0; index < 300; index++) {
	// 	var s = BABYLON.MeshBuilder.CreateBox("o" + index+300,<any> { segments: 3, width: rad, height: rad, depth: rad }, scene);
	// 	s.position.copyFromFloats(rand(2000), -80, rand(2000));
	// 	s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.BoxImpostor, {
    //         mass: 0,
    //         friction: 4,
    //         restitution: 0.1,
    //         nativeOptions: {
    //             move: false
    //         }
    //     });
	// }

    //Joints
	
	//slider joints
	
	 var sJoint1 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
        mainPivot: new BABYLON.Vector3(-w, 20, -d),
        mainAxis: new BABYLON.Vector3(0, 1, 0),
        connectedAxis: new BABYLON.Vector3(0, 1, 0),
        nativeParams: {
            limit: [0, 0],
			spring: [100, 0],
			min: 5,
			max: 5
        }
    });
    body.physicsImpostor.addJoint(holder1.physicsImpostor, sJoint1);

    var sJoint2 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
        mainPivot: new BABYLON.Vector3(w, 20, -d),
        mainAxis: new BABYLON.Vector3(0, 1, 0),
        connectedAxis: new BABYLON.Vector3(0, -1, 0),
        nativeParams: {
            limit: [0, 0],
			spring: [100, 0],
			min: 5,
			max: 5
        }
    });
    body.physicsImpostor.addJoint(holder2.physicsImpostor, sJoint2);

    var sJoint3 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
        mainPivot: new BABYLON.Vector3(-w, 20, d),
        mainAxis: new BABYLON.Vector3(0, 1, 0),
        connectedAxis: new BABYLON.Vector3(0, -1, 0),
        nativeParams: {
            limit: [0, 0],
			spring: [100, 0],
			min: 5,
			max: 5
        }
    });
    body.physicsImpostor.addJoint(holder3.physicsImpostor, sJoint3);

    var sJoint4 = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.SliderJoint, {
        mainPivot: new BABYLON.Vector3(w, 20, d),
        mainAxis: new BABYLON.Vector3(0, 1, 0),
        connectedAxis: new BABYLON.Vector3(0, -1, 0),
        nativeParams: {
            limit: [0, 0],
			spring: [100, 0],
			min: 5,
			max: 5
        }
    });
    body.physicsImpostor.addJoint(holder4.physicsImpostor, sJoint4);
	
	//wheel joints	
    var joint1 = new BABYLON.HingeJoint({
        mainPivot: new BABYLON.Vector3(0, 20, 0),
		connectedPivot: new BABYLON.Vector3(0, 0, 0),
        mainAxis: new BABYLON.Vector3(-1, 0, 0),
        connectedAxis: new BABYLON.Vector3(-1, 0, 0),
        nativeParams: {
            limit: [0, 0]
        }
    });
    holder1.physicsImpostor.addJoint(wheel1.physicsImpostor, joint1);

    var joint2 = new BABYLON.HingeJoint({
        mainPivot: new BABYLON.Vector3(0, 20, 0),
		connectedPivot: new BABYLON.Vector3(0, 0, 0),
        mainAxis: new BABYLON.Vector3(-1, 0, 0),
        connectedAxis: new BABYLON.Vector3(-1, 0, 0),
        nativeParams: {
            limit: [0, 0]
        }
    });
    holder2.physicsImpostor.addJoint(wheel2.physicsImpostor, joint2);

    var joint3 = new BABYLON.HingeJoint({
        mainPivot: new BABYLON.Vector3(0, 20, 0),
		connectedPivot: new BABYLON.Vector3(0, 0, 0),
        mainAxis: new BABYLON.Vector3(-1, 0, 0),
        connectedAxis: new BABYLON.Vector3(-1, 0, 0),
        nativeParams: {
            limit: [0, 0]
        }
    });
    holder3.physicsImpostor.addJoint(wheel3.physicsImpostor, joint3);

    var joint4 = new BABYLON.HingeJoint({
        mainPivot: new BABYLON.Vector3(0, 20, 0),
		connectedPivot: new BABYLON.Vector3(0, 0, 0),
        mainAxis: new BABYLON.Vector3(-1, 0, 0),
        connectedAxis: new BABYLON.Vector3(-1, 0, 0),
        nativeParams: {
            limit: [0, 0]
        }
    });
    holder4.physicsImpostor.addJoint(wheel4.physicsImpostor, joint4);

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    var Control = {};

    var deg45 = Math.PI / 4;
    var angle = 0

        function keyUp(event) {

            var key = event.keyCode;

            switch (key) {
                case 37:
                    (<any>Control).Steering = 0;
                    break;
                case 38:
                    (<any>Control).Velocity = 0;
                    break;
                case 39:
                    (<any>Control).Steering = 0;
                    break;
                case 40:
                    (<any>Control).Velocity = 0;
                    break;
            }

            updating = false;
        }

        function keyDown(event) {

            var key = event.keyCode;

            switch (key) {
                case 37:
                    (<any>Control).Steering = 1;
                    break;
                case 38:
                    (<any>Control).Velocity = -1;
                    updating = true;
                    break;
                case 39:
                    (<any>Control).Steering = -1;
                    break;
                case 40:
                    (<any>Control).Velocity = 1;
                    break;
            }

        }

    scene.onDispose = function() {
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    }

    var steeringLimit = Math.PI / 6;
	var updating = false;
    function update() {
		if (!updating) return;

        // var velocity = (<any>Control).Velocity || 0;
        // var wheelVelocity = 10 * Math.PI * velocity;
        // joint1.setMotor(wheelVelocity, 6);
        // joint2.setMotor(wheelVelocity, 6);
		// joint3.setMotor(wheelVelocity, 6);
        // joint4.setMotor(wheelVelocity, 6);

        var impulse = new BABYLON.Vector3(0, 250, 0);
        
        wheel1.applyImpulse(impulse, wheel1.position);
        wheel2.applyImpulse(impulse, wheel2.position);
        wheel3.applyImpulse(impulse, wheel3.position);
        wheel4.applyImpulse(impulse, wheel4.position);
    }
	
	scene.registerBeforeRender(update);

    return scene;

};

var showError = function (errorMessage) {
	console.error(errorMessage);	
}


var run = function () {
	try { 

		if (!BABYLON.Engine.isSupported()) {
			showError("Your browser does not support WebGL");
			return;
		}

		if (engine) {
			engine.dispose();
			engine = null;
		}

		canvas = document.getElementById("renderCanvas");
		engine = new BABYLON.Engine(canvas, true);

		var scene = createScene();
        scene.debugLayer.show();

		engine.runRenderLoop(function () {
			if (engine.scenes.length === 0) {
				return;
			}

			if (canvas.width !== canvas.clientWidth) {
				engine.resize();
			}

			var scene = engine.scenes[0];

			if (scene.activeCamera || scene.activeCameras.length > 0) {
				scene.render();
			}

		});

	} catch (e) {
		showError(e.message);
	}
};

window.addEventListener("resize", function () {
	if (engine) {
		engine.resize();
	}
});