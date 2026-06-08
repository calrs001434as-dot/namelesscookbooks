import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ============================================
   RECIPE DATA
   - Replace `modelUrl` with your hosted .glb / .gltf URL.
   - Each recipe has 4 steps, each step has its own model + text.
============================================ */
const recipes = [
  {
    title: 'Heirloom Tomato Pasta',
    // Final-product model shown on the recipe card
    modelUrl: '', // <- put a .glb URL here for the finished dish
    fallbackShape: 'pasta',
    steps: [
      { title: 'Prepare ingredients', text: 'Gather heirloom tomatoes, fresh basil, garlic, olive oil, and high-quality pasta. Mise en place is the soul of the dish.', modelUrl: '', fallbackShape: 'tomato' },
      { title: 'Simmer the sauce', text: 'Score and blanch tomatoes, slip off their skins, then crush gently into a pan with garlic and olive oil. Simmer twenty minutes.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Cook the pasta', text: 'Salt the water generously. Cook pasta until just shy of al dente — it will finish in the sauce.', modelUrl: '', fallbackShape: 'pasta' },
      { title: 'Plate and serve', text: 'Toss pasta with the sauce, finish with torn basil and a thread of olive oil. Serve immediately, while still glossy.', modelUrl: '', fallbackShape: 'plate' },
    ]
  },
  {
    title: 'Wild Mushroom Risotto',
    modelUrl: '',
    fallbackShape: 'risotto',
    steps: [
      { title: 'Toast the rice', text: 'Warm arborio rice in butter and shallot until each grain turns translucent at the edges and softly pearlescent.', modelUrl: '', fallbackShape: 'pan' },
      { title: 'Add the wine', text: 'Deglaze with dry white wine. Stir until the alcohol breathes off and the pan returns to a quiet simmer.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Build with broth', text: 'Ladle hot mushroom broth in slowly. Stir, wait, repeat. Patience is the recipe.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Finish with mushrooms', text: 'Fold in sautéed porcini, a generous knob of butter, and aged parmigiano. Rest one minute before plating.', modelUrl: '', fallbackShape: 'plate' },
    ]
  },
  {
    title: 'Citrus Glazed Salmon',
    modelUrl: '',
    fallbackShape: 'salmon',
    steps: [
      { title: 'Prepare the glaze', text: 'Reduce blood orange juice with honey, soy, and a whisper of ginger until it coats the back of a spoon.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Sear the salmon', text: 'Pat the fillets dry. Sear skin-side down in a hot pan until the skin crackles and lifts cleanly.', modelUrl: '', fallbackShape: 'pan' },
      { title: 'Glaze and finish', text: 'Brush the glaze over the salmon. Slide under a high broiler for ninety seconds, no more.', modelUrl: '', fallbackShape: 'salmon' },
      { title: 'Plate with citrus', text: 'Rest the fillet on a bed of greens. Garnish with citrus segments and flake salt.', modelUrl: '', fallbackShape: 'plate' },
    ]
  },
  {
    title: 'Dark Chocolate Soufflé',
    modelUrl: '',
    fallbackShape: 'souffle',
    steps: [
      { title: 'Prepare ramekins', text: 'Butter each ramekin in upward strokes, then dust with fine sugar. The soufflé will climb the path you draw.', modelUrl: '', fallbackShape: 'ramekin' },
      { title: 'Melt the chocolate', text: 'Melt 70% chocolate gently over a bain-marie with butter. Whisk in yolks one at a time off the heat.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Whip the whites', text: 'Beat egg whites with a pinch of salt to soft peaks, then rain in sugar and continue to stiff, glossy peaks.', modelUrl: '', fallbackShape: 'bowl' },
      { title: 'Fold and bake', text: 'Fold whites into chocolate in three additions. Bake at 200°C for twelve minutes. Serve the moment it rises.', modelUrl: '', fallbackShape: 'souffle' },
    ]
  },
];

/* ============================================
   STATE
============================================ */
let currentRecipe = 0;
let currentStep = 0;
const viewers = []; // keep refs for resize

/* ============================================
   LOADER
============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 800);
});

/* ============================================
   PAGE SWITCHING
============================================ */
window.switchPage = function(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  if (pageName === 'detail') {
    document.getElementById('page-detail').classList.add('active');
  } else {
    const page = document.getElementById('page-' + pageName);
    if (page) page.classList.add('active');
    const link = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (link) link.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Init viewers for the page just shown
  setTimeout(initVisibleViewers, 100);
};

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    switchPage(link.dataset.page);
  });
});

/* ============================================
   RECIPE NAVIGATION
============================================ */
window.openRecipe = function(index) {
  currentRecipe = index;
  currentStep = 0;
  renderStep();
  switchPage('detail');
};

window.nextStep = function() {
  if (currentStep < recipes[currentRecipe].steps.length - 1) {
    currentStep++;
    renderStep();
  }
};

window.prevStep = function() {
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
};

function renderStep() {
  const recipe = recipes[currentRecipe];
  const step = recipe.steps[currentStep];

  document.getElementById('detail-title').textContent = recipe.title;
  document.getElementById('detail-meta').textContent = `Step ${currentStep + 1} of ${recipe.steps.length}`;
  document.getElementById('step-num').textContent = String(currentStep + 1).padStart(2, '0');
  document.getElementById('step-title').textContent = step.title;
  document.getElementById('step-text').textContent = step.text;

  // Progress dots
  const dotsEl = document.getElementById('progress-dots');
  dotsEl.innerHTML = '';
  recipe.steps.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (i === currentStep) dot.classList.add('active');
    else if (i < currentStep) dot.classList.add('done');
    dotsEl.appendChild(dot);
  });

  // Arrow states
  document.getElementById('prev-btn').disabled = currentStep === 0;
  document.getElementById('next-btn').disabled = currentStep === recipe.steps.length - 1;

  // Build step viewer
  const container = document.getElementById('step-canvas');
  container.innerHTML = '';
  createViewer(container, step.modelUrl, step.fallbackShape, /*isLarge*/ true);
}

/* ============================================
   THREE.JS VIEWER
============================================ */
function createViewer(container, modelUrl, fallbackShape, isLarge = false) {
  const width = container.clientWidth || 300;
  const height = container.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1.2, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x88aaff, 0.5);
  rim.position.set(-3, 2, -3);
  scene.add(rim);

  // Group to hold whichever model we load
  const group = new THREE.Group();
  scene.add(group);

  // Try loading a hosted GLB if provided, otherwise build a procedural placeholder
  if (modelUrl && modelUrl.trim().length > 0) {
    import('three/addons/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        group.add(gltf.scene);
        fitCameraToObject(camera, gltf.scene, controls);
      }, undefined, () => {
        // On error, fall back to procedural shape
        group.add(makeFallback(fallbackShape));
      });
    });
  } else {
    group.add(makeFallback(fallbackShape));
  }

  // Controls — drag to rotate, scroll to zoom
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 8;
  controls.autoRotate = !isLarge; // gentle auto-spin on preview cards
  controls.autoRotateSpeed = 0.6;

  // Resize handling
  const resize = () => {
    const w = container.clientWidth || width;
    const h = container.clientHeight || height;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Animate
  function animate() {
    if (!container.isConnected) {
      renderer.dispose();
      ro.disconnect();
      return;
    }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  viewers.push({ container, renderer, camera, controls });
}

function fitCameraToObject(camera, object, controls) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());
  object.position.x += (object.position.x - center.x);
  object.position.y += (object.position.y - center.y);
  object.position.z += (object.position.z - center.z);
  camera.position.copy(new THREE.Vector3(0, size * 0.4, size * 1.2));
  camera.lookAt(0, 0, 0);
  if (controls) controls.target.set(0, 0, 0);
}

/* ============================================
   PROCEDURAL FALLBACK SHAPES
   (so the site works even before you add your own .glb files)
============================================ */
function makeFallback(kind) {
  const g = new THREE.Group();

  const matBase = new THREE.MeshStandardMaterial({
    color: 0xe8e8e8, roughness: 0.4, metalness: 0.15,
  });
  const matAccent = new THREE.MeshStandardMaterial({
    color: 0xcc6644, roughness: 0.5, metalness: 0.1,
  });
  const matDark = new THREE.MeshStandardMaterial({
    color: 0x2a1a14, roughness: 0.6, metalness: 0.05,
  });
  const matGreen = new THREE.MeshStandardMaterial({
    color: 0x6a8a4a, roughness: 0.6, metalness: 0.05,
  });
  const matGold = new THREE.MeshStandardMaterial({
    color: 0xd4a574, roughness: 0.5, metalness: 0.2,
  });

  switch (kind) {
    case 'tomato': {
      const tomato = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), matAccent);
      tomato.scale.set(1, 0.9, 1);
      g.add(tomato);
      const stem = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 8), matGreen);
      stem.position.y = 1;
      g.add(stem);
      break;
    }
    case 'pasta': {
      // plate of pasta-ish noodles
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.1, 48), matBase);
      g.add(plate);
      for (let i = 0; i < 14; i++) {
        const noodle = new THREE.Mesh(
          new THREE.TorusGeometry(0.3 + Math.random() * 0.3, 0.04, 8, 24, Math.PI * 1.5),
          matGold
        );
        noodle.position.set((Math.random() - 0.5) * 1.2, 0.1 + Math.random() * 0.2, (Math.random() - 0.5) * 1.2);
        noodle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        g.add(noodle);
      }
      break;
    }
    case 'pot': {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.85, 1.2, 32), matBase);
      g.add(body);
      const handleGeo = new THREE.TorusGeometry(0.25, 0.05, 8, 16);
      const h1 = new THREE.Mesh(handleGeo, matBase); h1.position.set(1.1, 0.3, 0); h1.rotation.y = Math.PI / 2; g.add(h1);
      const h2 = new THREE.Mesh(handleGeo, matBase); h2.position.set(-1.1, 0.3, 0); h2.rotation.y = Math.PI / 2; g.add(h2);
      break;
    }
    case 'pan': {
      const pan = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 48), matDark);
      g.add(pan);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.15), matDark);
      handle.position.set(1.8, 0.05, 0);
      g.add(handle);
      break;
    }
    case 'plate': {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.3, 0.12, 48), matBase);
      g.add(plate);
      const food = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), matAccent);
      food.position.y = 0.3; food.scale.set(1.2, 0.5, 1.2);
      g.add(food);
      break;
    }
    case 'salmon': {
      const fillet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.9), matAccent);
      fillet.material = new THREE.MeshStandardMaterial({ color: 0xff8866, roughness: 0.55 });
      g.add(fillet);
      break;
    }
    case 'risotto':
    case 'bowl': {
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), matBase);
      bowl.rotation.x = Math.PI;
      g.add(bowl);
      const rice = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.2, 32), matGold);
      rice.position.y = -0.6;
      g.add(rice);
      break;
    }
    case 'ramekin': {
      const ram = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.75, 1, 32), matBase);
      g.add(ram);
      break;
    }
    case 'souffle': {
      const ram = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.75, 1, 32), matBase);
      g.add(ram);
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), matDark);
      top.position.y = 0.5;
      g.add(top);
      break;
    }
    default: {
      const cube = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), matBase);
      g.add(cube);
    }
  }

  return g;
}

/* ============================================
   INIT VIEWERS ON VISIBLE PAGE
============================================ */
function initVisibleViewers() {
  document.querySelectorAll('.page.active .three-canvas').forEach((el) => {
    if (el.dataset.initialized === 'true') return;
    el.dataset.initialized = 'true';
    const idx = parseInt(el.dataset.model, 10);
    const recipe = recipes[idx];
    createViewer(el, recipe.modelUrl, recipe.fallbackShape, false);
  });
}

/* ============================================
   PARALLAX — cursor-driven, whole-site shift
============================================ */
const parallaxEl = document.getElementById('parallax');
const navEl = document.querySelector('.nav-glass');
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
  // Normalized -1 to 1
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function parallaxLoop() {
  // Smooth interpolation
  targetX += (mouseX - targetX) * 0.06;
  targetY += (mouseY - targetY) * 0.06;

  // Main wrapper drift
  const mx = -targetX * 18; // px
  const my = -targetY * 14;
  parallaxEl.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

  // Nav drifts slightly opposite for depth
  if (navEl) {
    navEl.style.transform = `translateX(calc(-50% + ${targetX * 6}px)) translateY(${targetY * 4}px)`;
  }

  // Individual depth layers
  document.querySelectorAll('[data-depth]').forEach(el => {
    const d = parseFloat(el.dataset.depth) || 0.05;
    el.style.transform = `translate3d(${-targetX * 60 * d}px, ${-targetY * 50 * d}px, 0)`;
  });

  requestAnimationFrame(parallaxLoop);
}
parallaxLoop();

/* ============================================
   BOOT
============================================ */
initVisibleViewers();
