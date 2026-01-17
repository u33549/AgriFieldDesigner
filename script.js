// Three.js Scene Setup
let scene, camera, renderer, controls;
let models = [];

function initThreeJS() {
    const viewer = document.getElementById('viewer');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(0xf0f0f0, 10, 50);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        viewer.clientWidth / viewer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    renderer.shadowMap.enabled = true;
    viewer.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Grid
    const gridHelper = new THREE.GridHelper(50, 50, 0x667eea, 0xe0e0e0);
    scene.add(gridHelper);
    
    // Axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Simple orbit controls (mouse drag)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    viewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    viewer.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            const rotationSpeed = 0.005;
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * rotationSpeed);
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
            camera.lookAt(0, 0, 0);
        }
    });
    
    viewer.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    viewer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const direction = camera.position.clone().normalize();
        camera.position.addScaledVector(direction, e.deltaY * zoomSpeed * -0.01);
    });
    
    animate();
}

function onWindowResize() {
    const viewer = document.getElementById('viewer');
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function clearModels() {
    models.forEach(model => {
        scene.remove(model);
    });
    models = [];
}

function createModel(x, y, z, index) {
    // Create a simple cube to represent the model
    const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const material = new THREE.MeshPhongMaterial({
        color: 0x4caf50,
        emissive: 0x2e7d32,
        shininess: 30
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y + 0.5, z); // Offset Y so base is at y
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    // Add a label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'Bold 24px Arial';
    context.fillStyle = '#667eea';
    context.textAlign = 'center';
    context.fillText(`#${index}`, canvas.width / 2, canvas.height / 2 + 8);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y + 2, z);
    sprite.scale.set(1, 0.25, 1);
    
    scene.add(cube);
    scene.add(sprite);
    models.push(cube, sprite);
}

function generateXML() {
    const modelUri = document.getElementById('modelUri').value;
    const modelName = document.getElementById('modelName').value;
    const startX = parseFloat(document.getElementById('startX').value);
    const startY = parseFloat(document.getElementById('startY').value);
    const startZ = parseFloat(document.getElementById('startZ').value);
    const repeatX = parseInt(document.getElementById('repeatX').value);
    const repeatY = parseInt(document.getElementById('repeatY').value);
    const repeatZ = parseInt(document.getElementById('repeatZ').value);
    const distanceX = parseFloat(document.getElementById('distanceX').value);
    const distanceY = parseFloat(document.getElementById('distanceY').value);
    const distanceZ = parseFloat(document.getElementById('distanceZ').value);
    
    let xml = '';
    let counter = 1;
    
    // Clear existing models
    clearModels();
    
    // Generate models
    for (let iz = 0; iz < repeatZ; iz++) {
        for (let iy = 0; iy < repeatY; iy++) {
            for (let ix = 0; ix < repeatX; ix++) {
                const x = startX + (ix * distanceX);
                const y = startY + (iy * distanceY);
                const z = startZ + (iz * distanceZ);
                
                const name = `${modelName}_${String(counter).padStart(2, '0')}`;
                
                xml += `<include>\n`;
                xml += `  <uri>${modelUri}</uri>\n`;
                xml += `  <name>${name}</name>\n`;
                xml += `  <pose>${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)} 0 -0 0</pose>\n`;
                xml += `</include>\n`;
                
                if (counter < repeatX * repeatY * repeatZ) {
                    xml += '\n';
                }
                
                // Add visual model in Three.js
                createModel(x, z, -y, counter); // Note: swapping y and z for Three.js coordinate system
                
                counter++;
            }
        }
    }
    
    // Update output
    document.getElementById('output').textContent = xml;
    
    // Update stats
    const totalCount = repeatX * repeatY * repeatZ;
    document.getElementById('totalCount').textContent = `Toplam: ${totalCount} model`;
    
    // Adjust camera to see all models
    const centerX = startX + (distanceX * (repeatX - 1)) / 2;
    const centerY = startZ + (distanceZ * (repeatZ - 1)) / 2;
    const centerZ = -startY - (distanceY * (repeatY - 1)) / 2;
    
    const maxDistance = Math.max(
        distanceX * repeatX,
        distanceY * repeatY,
        distanceZ * repeatZ
    );
    
    const cameraDistance = Math.max(maxDistance * 1.5, 10);
    camera.position.set(
        centerX + cameraDistance,
        cameraDistance,
        centerZ + cameraDistance
    );
    camera.lookAt(centerX, 0, centerZ);
}

function copyToClipboard() {
    const output = document.getElementById('output').textContent;
    navigator.clipboard.writeText(output).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Kopyalandı!';
        btn.style.background = '#4caf50';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        alert('Kopyalama başarısız: ' + err);
    });
}

// Event Listeners
document.getElementById('generateBtn').addEventListener('click', generateXML);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

// Auto-generate on input change
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', generateXML);
});

// Initialize
window.addEventListener('load', () => {
    initThreeJS();
    generateXML();
});
