/* LBS — 3D model in the shop (Femme entry test, 2026-11-09).
   Loads the SAME files as the standalone test page
   (3d-test/model.glb + pose.glb + tshirt.glb) inside the shop:
   the Avaturn body in its approved pose, with the white
   "lkiwan" t-shirt that can be toggled off.
   Nothing is built until the Femme door is opened, so the
   Homme entry keeps the exact 2D shop as before. */
(function () {
  var box = document.getElementById('model3d');
  if (!box) return;
  var started = false;

  window.LBS_OPEN_3D = function () {
    box.hidden = false;
    var m = document.querySelector('.model');
    if (m) m.style.display = 'none';
    var z = document.querySelector('.zooms');
    if (z) z.style.display = 'none';
    if (started) return;
    started = true;
    start();
  };

  async function start() {
    try {
      var THREE = await import('three');
      var OrbitControls = (await import('three/addons/controls/OrbitControls.js')).OrbitControls;
      var GLTFLoader = (await import('three/addons/loaders/GLTFLoader.js')).GLTFLoader;

      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(box.clientWidth, box.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      box.appendChild(renderer.domElement);

      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera(38, box.clientWidth / box.clientHeight, 0.1, 60);
      camera.position.set(0, 1.25, 2.85);

      var controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.95, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.minDistance = 1.4;
      controls.maxDistance = 7;
      controls.maxPolarAngle = Math.PI * 0.55;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.1;
      controls.addEventListener('start', function () { controls.autoRotate = false; });

      scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8f8672, 0.95));
      var key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(2.4, 3.6, 2.2);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.left = -1.6; key.shadow.camera.right = 1.6;
      key.shadow.camera.top = 2.6; key.shadow.camera.bottom = -0.4;
      key.shadow.radius = 6;
      key.shadow.bias = -0.0004;
      scene.add(key);
      var rim = new THREE.DirectionalLight(0xdfe8ff, 0.85);
      rim.position.set(-2.4, 2.2, -2.4);
      scene.add(rim);
      var fill = new THREE.DirectionalLight(0xffe9c9, 0.5);
      fill.position.set(-1.6, 1.2, 2.4);
      scene.add(fill);

      /* Small shadow catcher under the feet only — a full-size one
         smears the body's long shadow across the shop's buy bar. */
      var ground = new THREE.Mesh(
        new THREE.CircleGeometry(0.55, 48),
        new THREE.ShadowMaterial({ opacity: 0.17 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      /* Approved Avaturn pose — same clip as 3d-test/avaturn.html */
      var poseClip = null;
      var mixers = [];
      var pendingRoots = [];
      function startPose(root) {
        if (poseClip) {
          var mx = new THREE.AnimationMixer(root);
          mx.clipAction(poseClip).play();
          mixers.push(mx);
        } else {
          pendingRoots.push(root);
        }
      }
      new GLTFLoader().load('3d-test/pose.glb', function (g) {
        poseClip = g.animations[0];
        pendingRoots.forEach(startPose);
        pendingRoots.length = 0;
      }, undefined, function () { /* no pose file: avatar stays in T-pose */ });

      new GLTFLoader().load('3d-test/model.glb', function (gltf) {
        var model = gltf.scene;
        model.traverse(function (o) { if (o.isMesh) { o.castShadow = true; } });
        scene.add(model);
        startPose(model);
      }, undefined, function () { box.dataset.err = 'model'; });

      var tee = null;
      new GLTFLoader().load('3d-test/tshirt.glb', function (gltf) {
        tee = gltf.scene;
        tee.traverse(function (o) { if (o.isMesh) { o.castShadow = true; } });
        scene.add(tee);
        startPose(tee);
      }, undefined, function () { /* tee is a bonus */ });

      var chipTee = document.getElementById('m3dTee');
      var chipNone = document.getElementById('m3dNone');
      function setTee(on) {
        if (tee) tee.visible = on;
        chipTee.classList.toggle('on', on);
        chipNone.classList.toggle('on', !on);
      }
      chipTee.addEventListener('click', function () { setTee(true); });
      chipNone.addEventListener('click', function () { setTee(false); });

      function tick() {
        requestAnimationFrame(tick);
        mixers.forEach(function (mx) { mx.update(0.016); });
        controls.update();
        renderer.render(scene, camera);
      }
      tick();
      window.addEventListener('resize', function () {
        if (box.hidden) return;
        camera.aspect = box.clientWidth / box.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(box.clientWidth, box.clientHeight);
      });
    } catch (err) {
      box.dataset.err = String(err && err.message || err);
    }
  }
})();
