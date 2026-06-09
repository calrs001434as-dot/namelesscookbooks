import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const recipes = [
  {
    title: 'Poutine',
    modelUrl: '',
    fallbackShape: 'pasta',
    ingredients: [
      '4 large russet potatoes',
      '2 cups beef stock',
      '1 cup chicken stock',
      '2 tbsp cornstarch',
      '2 tbsp water',
      '2 tbsp unsalted butter',
      '2 tbsp all-purpose flour',
      '2 cups fresh cheese curds',
      'Vegetable oil for frying',
      'Salt'
    ],
    steps: [
      { title: 'Prepare the potatoes', text: 'Cut potatoes into thick fries. Soak in cold water for 30 minutes to remove starch. Drain and dry thoroughly with paper towels.', modelUrl: '', fallbackShape: 'potato' },
      { title: 'First fry', text: 'Heat oil to 150°C (300°F). Fry potatoes for 5 minutes until soft but not browned. Remove and drain on paper towels.', modelUrl: '', fallbackShape: 'pan' },
      { title: 'Make the gravy', text: 'Melt butter over medium heat. Whisk in flour for 2 minutes. Add beef and chicken stocks. Simmer, then whisk in cornstarch mixed with water. Season with salt.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Finish and assemble', text: 'Heat oil to 200°C (400°F). Fry potatoes again for 3 minutes until golden crisp. Drain and season. Layer in bowl: fries, cheese curds, hot gravy to melt the cheese.', modelUrl: '', fallbackShape: 'plate' },
    ]
  },
  {
    title: 'Choco-Vanila Cake',
    modelUrl: '',
    fallbackShape: 'souffle',
    ingredients: [
      '2½ cups all-purpose flour',
      '2½ tsp baking powder',
      '½ tsp salt',
      '1 cup unsalted butter, softened',
      '1½ cups granulated sugar',
      '3 large eggs, room temperature',
      '1 cup of coco powder',
      '1 cup whole milk',
      '½ cup cooking oil',
      '½ cup water'
    ],
    steps: [
      { title: 'Prepare mise en place', text: 'Preheat oven to 175°C (350°F). Grease and flour two 9-inch round cake pans. Whisk together flour, baking powder, and salt in a bowl.', modelUrl: '', fallbackShape: 'bowl' },
      { title: 'Cream butter and sugar', text: 'Beat softened butter and sugar together until light and fluffy, about 3-4 minutes. Add eggs one at a time, beating well after each addition.', modelUrl: '', fallbackShape: 'bowl' },
      { title: 'Combine wet and dry', text: 'Mix in vanilla extract. Add one-third of dry ingredients, then half the milk, alternating and ending with dry ingredients. Mix gently until just combined.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Bake and cool', text: 'Divide batter equally between pans. Bake for 25-30 minutes until a toothpick comes out clean. Cool in pans for 10 minutes, then transfer to wire rack.', modelUrl: '', fallbackShape: 'plate' },
    ]
  },
  {
    title: 'Chicken Tikka',
    modelUrl: '',
    fallbackShape: 'salmon',
    ingredients: [
      '500g boneless chicken thighs, cubed',
      '1 cup thick plain yogurt',
      '1 tbsp ginger paste',
      '1 tbsp garlic paste',
      '2 tsp Kashmiri red chili powder',
      '1 tsp garam masala',
      '1 tsp roasted cumin powder',
      '1 tbsp lemon juice',
      '2 tbsp mustard oil',
      'Salt'
    ],
    steps: [
      { title: 'Prepare the marinade', text: 'Whisk together yogurt, ginger, garlic, chili powder, garam masala, cumin, lemon juice, mustard oil, and salt in a large bowl until well combined.', modelUrl: '', fallbackShape: 'bowl' },
      { title: 'Marinate the chicken', text: 'Add chicken pieces to the marinade and coat thoroughly. Cover and refrigerate for at least 4 hours, or overnight for best flavor.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Prepare for grilling', text: 'Soak wooden skewers in water for 30 minutes. Preheat oven grill or broiler to high. Thread marinated chicken pieces evenly onto the skewers.', modelUrl: '', fallbackShape: 'pasta' },
      { title: 'Grill and serve', text: 'Place skewers on a foil-lined baking sheet. Grill for 15 minutes total, turning halfway through, until edges are charred and chicken is cooked through.', modelUrl: '', fallbackShape: 'plate' },
    ]
  },
  {
    title: 'Rasmalai',
    modelUrl: '',
    fallbackShape: 'risotto',
    ingredients: [
      '1 litre full-cream milk (for chenna)',
      '2 tbsp lemon juice',
      '1 cup water (for squeezing)',
      '1 cup sugar',
      '4 cups water (for syrup)',
      '1 litre full-cream milk (for rabri)',
      '½ cup sugar (for rabri)',
      '½ tsp cardamom powder',
      '10 saffron strands',
      '2 tbsp chopped pistachios and almonds'
    ],
    steps: [
      { title: 'Make the chenna', text: 'Boil 1 litre milk in a pot. Add lemon juice gradually until milk curdles completely. Strain through cheesecloth. Rinse with cold water, squeeze out excess, and hang for 45 minutes.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Knead and shape', text: 'Knead the drained chenna for 10 minutes until completely smooth. Divide into small balls and flatten into discs. Boil 1 cup sugar with 4 cups water to make thin syrup.', modelUrl: '', fallbackShape: 'bowl' },
      { title: 'Cook the chenna discs', text: 'Drop chenna discs into boiling syrup. Cover and cook for 15 minutes. Remove and let cool. Meanwhile, boil second litre of milk for rabri until reduced to half.', modelUrl: '', fallbackShape: 'pot' },
      { title: 'Finish and serve', text: 'Add ½ cup sugar, saffron, and cardamom to reduced milk. Simmer 5 minutes. Squeeze syrup from cooled discs and gently place in warm rabri. Garnish with pistachios and almonds. Chill 3 hours.', modelUrl: '', fallbackShape: 'plate' },
    ]
  },
];

let currentRecipe = 0;
let currentStep = 0;
let inTutorialMode = false;
const viewers = [];

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 800);
});

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

window.openRecipe = function(index) {
  currentRecipe = index;
  currentStep = 0;
  inTutorialMode = false;
  switchPage('detail');
  renderIngredients();
};

window.startTutorial = function() {
  inTutorialMode = true;
  renderTutorialStep();
};

function renderIngredients() {
  const recipe = recipes[currentRecipe];
  document.getElementById('ingredients-title').textContent = recipe.title;
  
  const list = document.getElementById('ingredients-list');
  list.innerHTML = '';
  
  const ingredientsHtml = recipe.ingredients.map(ing => 
    `<div class="ingredient-item">${ing}</div>`
  ).join('');
  
  list.innerHTML = `
    <div class="ingredients-title-small">${recipe.title}</div>
    <div class="ingredients-items">
      ${ingredientsHtml}
    </div>
  `;
  
  // Show ingredients view, hide tutorial
  document.getElementById('ingredients-view').style.display = 'block';
  document.getElementById('tutorial-view').style.display = 'none';
}

function renderTutorialStep() {
  const recipe = recipes[currentRecipe];
  const step = recipe.steps[currentStep];

  document.getElementById('tutorial-meta').textContent = `Step ${currentStep + 1} of ${recipe.steps.length}`;
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
  
  // Show tutorial view, hide ingredients
  document.getElementById('ingredients-view').style.display = 'none';
  document.getElementById('tutorial-view').style.display = 'block';
}

window.nextStep = function() {
  if (!inTutorialMode) {
    startTutorial();
    return;
  }
  if (currentStep < recipes[currentRecipe].steps.length - 1) {
    currentStep++;
    renderTutorialStep();
  }
};

window.prevStep = function() {
  if (currentStep > 0) {
    currentStep--;
    renderTutorialStep();
  }
};

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
        group.add(makeFallback(fallbackShape));
        applyStepAnimation(group, fallbackShape, currentRecipe, currentStep);
      });
    });
  } else {
    group.add(makeFallback(fallbackShape));
    if (isLarge) {
      applyStepAnimation(group, fallbackShape, currentRecipe, currentStep);
    }
  }

  // Controls — drag to rotate, scroll to zoom
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 8;
  controls.autoRotate = !isLarge;
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

  // Animation state
  let animationTime = 0;
  let particles = [];

  // Animate
  function animate() {
    if (!container.isConnected) {
      renderer.dispose();
      ro.disconnect();
      return;
    }
    requestAnimationFrame(animate);
    
    animationTime += 0.016;
    
    particles.forEach((particle, index) => {
      particle.position.y -= particle.velocity;
      particle.opacity -= particle.opacityDecay;
      particle.material.opacity = particle.opacity;
      
      if (particle.opacity <= 0) {
        scene.remove(particle);
        particles.splice(index, 1);
      }
    });
    
    group.children.forEach(child => {
      if (child.userData.animationType) {
        applyAnimation(child, child.userData.animationType, animationTime);
      }
    });
    
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  viewers.push({ container, renderer, camera, controls, scene, group, particles });
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
   STEP ANIMATIONS
   - Animate objects based on recipe and step
   - Simple, subtle animations
============================================ */
function applyStepAnimation(group, fallbackShape, recipeIdx, stepIdx) {
  // Add animation metadata based on recipe and step
  const animationMap = {
    '0-0': 'gentle_rotate',
    '0-1': 'subtle_tilt',
    '0-2': 'slow_rotate',
    '0-3': 'gentle_sway',
    '1-0': 'gentle_rotate',
    '1-1': 'subtle_rotate',
    '1-2': 'gentle_sway',
    '1-3': 'slow_rotate',
    '2-0': 'gentle_rotate',
    '2-1': 'subtle_sway',
    '2-2': 'gentle_rotate',
    '2-3': 'subtle_tilt',
    '3-0': 'subtle_rotate',
    '3-1': 'gentle_sway',
    '3-2': 'slow_rotate',
    '3-3': 'gentle_rotate',
  };
  
  const animKey = `${recipeIdx}-${stepIdx}`;
  const animType = animationMap[animKey];
  
  if (animType) {
    group.children.forEach(child => {
      child.userData.animationType = animType;
      child.userData.baseRotation = {
        x: child.rotation.x,
        y: child.rotation.y,
        z: child.rotation.z
      };
      child.userData.basePosition = {
        x: child.position.x,
        y: child.position.y,
        z: child.position.z
      };
    });
  }
}

function applyAnimation(object, type, time) {
  const baseRot = object.userData.baseRotation || { x: 0, y: 0, z: 0 };
  const basePos = object.userData.basePosition || { x: 0, y: 0, z: 0 };
  
  switch(type) {
    case 'gentle_rotate':
      object.rotation.y = baseRot.y + time * 0.3;
      object.rotation.x = baseRot.x + Math.sin(time * 0.2) * 0.05;
      break;
      
    case 'subtle_rotate':
      object.rotation.y = baseRot.y + Math.sin(time * 0.4) * 0.15;
      object.position.y = basePos.y + Math.sin(time * 0.5) * 0.08;
      break;
      
    case 'slow_rotate':
      object.rotation.y = baseRot.y + time * 0.15;
      break;
      
    case 'subtle_tilt':
      object.rotation.z = baseRot.z + Math.sin(time * 0.6) * 0.1;
      object.rotation.x = baseRot.x + Math.sin(time * 0.4) * 0.08;
      break;
      
    case 'gentle_sway':
      object.position.x = basePos.x + Math.sin(time * 0.5) * 0.15;
      object.rotation.z = baseRot.z + Math.sin(time * 0.5) * 0.08;
      break;
  }
}


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

function initVisibleViewers() {
  document.querySelectorAll('.page.active .three-canvas:not([data-preview])').forEach((el) => {
    if (el.dataset.initialized === 'true') return;
    el.dataset.initialized = 'true';
    const idx = parseInt(el.dataset.model, 10);
    const recipe = recipes[idx];
    createViewer(el, recipe.modelUrl, recipe.fallbackShape, false);
  });
}

const parallaxEl = document.getElementById('parallax');
const navEl = document.querySelector('.nav-glass');
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function parallaxLoop() {
  targetX += (mouseX - targetX) * 0.06;
  targetY += (mouseY - targetY) * 0.06;

  const mx = -targetX * 18;
  const my = -targetY * 14;
  parallaxEl.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

  if (navEl) {
    navEl.style.transform = `translateX(calc(-50% + ${targetX * 6}px)) translateY(${targetY * 4}px)`;
  }

  document.querySelectorAll('[data-depth]').forEach(el => {
    const d = parseFloat(el.dataset.depth) || 0.05;
    el.style.transform = `translate3d(${-targetX * 60 * d}px, ${-targetY * 50 * d}px, 0)`;
  });

  requestAnimationFrame(parallaxLoop);
}
parallaxLoop();

initVisibleViewers();
