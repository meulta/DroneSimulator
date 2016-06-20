var engine;
var canvas;
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI, 1.3, 1500, new BABYLON.Vector3(0, -3, 0), scene);
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
    // //Wheels
    // var blade1 = BABYLON.MeshBuilder.CreateSphere("blade1", {
    //     diameterY: rad/2,
    //     diameterX: rad,
    //     diameterZ: rad,
    //     segments: 5
    // }, scene);
    // blade1.position.copyFromFloats(-w, 40, -d);
    // var blade2 = BABYLON.MeshBuilder.CreateSphere("blade2", {
    //     diameterY: rad/2,
    //     diameterX: rad,
    //     diameterZ: rad,
    //     segments: 5
    // }, scene);
    // blade2.position.copyFromFloats(w, 40, -d);
    // var blade3 = BABYLON.MeshBuilder.CreateSphere("blade3", {
    //     diameterY: rad/2,
    //     diameterX: rad,
    //     diameterZ: rad,
    //     segments: 5
    // }, scene);
    // blade3.position.copyFromFloats(-w, 40, d);
    // var blade4 = BABYLON.MeshBuilder.CreateSphere("blade4", {
    //     diameterY: rad/2,
    //     diameterX: rad,
    //     diameterZ: rad,
    //     segments: 5
    // }, scene);
    // blade4.position.copyFromFloats(w, 40, d);
    // function rand(mult) {
    // 	return Math.random() * (Math.random() < 0.5 ? -1 : 1) * mult;
    // }
    //physics
    scene.enablePhysics(null, new BABYLON.OimoJSPlugin(100));
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 0.1,
        restitution: 0.5
    });
    body.physicsImpostor = new BABYLON.PhysicsImpostor(body, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 1,
        friction: 1,
        restitution: 0.5
    });
    // [blade1, blade2, blade3, blade4].forEach(function (w) {
    //     w.physicsImpostor = new BABYLON.PhysicsImpostor(w, BABYLON.PhysicsImpostor.SphereImpostor, {
    //         mass: 1,
    //         friction: 40,
    //         restitution: 0.5,
    //         nativeOptions: {
    //             move: true
    //         }
    //     });
    // });
    //blade joints	
    // var joint1 = new BABYLON.DistanceJoint({ maxDistance: 100
    // });
    // body.physicsImpostor.addJoint(blade1.physicsImpostor, joint1);
    // var joint2 = new BABYLON.DistanceJoint({ maxDistance: 10
    // });
    // body.physicsImpostor.addJoint(blade2.physicsImpostor, joint2);
    // var joint3 = new BABYLON.DistanceJoint({ maxDistance: 10
    // });
    // body.physicsImpostor.addJoint(blade3.physicsImpostor, joint3);
    // var joint4 = new BABYLON.DistanceJoint({ maxDistance: 10
    // });
    // body.physicsImpostor.addJoint(blade4.physicsImpostor, joint4);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    var impulse = new BABYLON.Vector3(0, 0, 0);
    var rotation = new BABYLON.Vector3(0, 0, 0);
    function keyUp(event) {
        var key = event.keyCode;
        switch (key) {
            case 90:
                //Up
                impulse.y = 0;
                break;
            case 38:
                //Front 
                impulse.x = 0;
                break;
            case 40:
                //Back
                impulse.x = 0;
                break;
            case 37:
                //Left
                impulse.z = 0;
                break;
            case 39:
                //Right
                impulse.z = 0;
                break;
            case 81:
                //Left
                rotation.y = 0;
                break;
            case 68:
                //Right
                rotation.y = 0;
                break;
        }
        if (impulse.equals(BABYLON.Vector3.Zero()))
            updating = false;
    }
    function keyDown(event) {
        var key = event.keyCode;
        switch (key) {
            case 90:
                //Up
                impulse.y = 30;
                updating = true;
                break;
            case 38:
                //Front 
                impulse.x = 20;
                updating = true;
                break;
            case 40:
                //Back
                impulse.x = -20;
                updating = true;
                break;
            case 37:
                //Left
                impulse.z = 20;
                updating = true;
                break;
            case 39:
                //Right
                impulse.z = -20;
                updating = true;
                break;
            case 81:
                //Left
                rotation.y = -3;
                updating = true;
                break;
            case 68:
                //Right
                rotation.y = 3;
                updating = true;
                break;
        }
    }
    scene.onDispose = function () {
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    };
    var steeringLimit = Math.PI / 6;
    var updating = false;
    function update() {
        if (!updating)
            return;
        body.physicsImpostor.setAngularVelocity(rotation);
        var matrix = new BABYLON.Matrix();
        var rotationQ = body.rotationQuaternion;
        if (!rotationQ)
            rotationQ = new BABYLON.Quaternion(0, 0, 0, 0);
        rotationQ.toRotationMatrix(matrix);
        body.applyImpulse(BABYLON.Vector3.TransformNormal(impulse, matrix), body.position);
    }
    scene.registerBeforeRender(update);
    return scene;
};
var showError = function (errorMessage) {
    console.error(errorMessage);
};
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
    }
    catch (e) {
        showError(e.message);
    }
};
window.addEventListener("resize", function () {
    if (engine) {
        engine.resize();
    }
});
