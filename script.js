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
    
    // Camera controls
    let isDragging = false;
    let isPanning = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraTarget = new THREE.Vector3(0, 0, 0);
    
    viewer.addEventListener('mousedown', (e) => {
        if (e.button === 0 && e.shiftKey) { // Left click + Shift = Pan
            isPanning = true;
        } else if (e.button === 0) { // Left click = Rotate
            isDragging = true;
        } else if (e.button === 2) { // Right click = Pan
            isPanning = true;
            e.preventDefault();
        }
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    viewer.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Disable right-click menu
    });
    
    viewer.addEventListener('mousemove', (e) => {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        if (isDragging) {
            // Rotate camera around target
            const rotationSpeed = 0.005;
            
            // Horizontal rotation
            const angle = -deltaX * rotationSpeed;
            const offset = camera.position.clone().sub(cameraTarget);
            offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            camera.position.copy(cameraTarget).add(offset);
            
            // Vertical rotation
            const phi = -deltaY * rotationSpeed;
            const axis = new THREE.Vector3().crossVectors(camera.up, offset).normalize();
            offset.applyAxisAngle(axis, phi);
            camera.position.copy(cameraTarget).add(offset);
            
            camera.lookAt(cameraTarget);
        } else if (isPanning) {
            // Pan camera
            const panSpeed = 0.15;
            const distance = camera.position.distanceTo(cameraTarget);
            
            const right = new THREE.Vector3();
            right.crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize();
            
            const panX = right.multiplyScalar(-deltaX * panSpeed * distance * 0.01);
            const panY = camera.up.clone().multiplyScalar(deltaY * panSpeed * distance * 0.01);
            
            camera.position.add(panX).add(panY);
            cameraTarget.add(panX).add(panY);
        }
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    viewer.addEventListener('mouseup', () => {
        isDragging = false;
        isPanning = false;
    });
    
    viewer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.5;
        const direction = camera.position.clone().sub(cameraTarget).normalize();
        const distance = camera.position.distanceTo(cameraTarget);
        const delta = e.deltaY * zoomSpeed * -0.01 * distance;
        
        camera.position.addScaledVector(direction, delta);
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

function createModel(x, y, z, index, sizeX, sizeY, sizeZ, rotX, rotY, rotZ) {
    // Create a simple cube to represent the model
    const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const material = new THREE.MeshPhongMaterial({
        color: 0xf25835,
        emissive: 0x202d48,
        shininess: 30
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y + (sizeY / 2), z); // Offset Y so base is at y
    cube.rotation.set(rotX, rotY, rotZ); // Apply rotation
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
    context.fillStyle = '#202d48';
    context.textAlign = 'center';
    context.fillText(`#${index}`, canvas.width / 2, canvas.height / 2 + 8);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y + sizeY + 0.5, z);
    sprite.scale.set(1, 0.25, 1);
    
    scene.add(cube);
    scene.add(sprite);
    models.push(cube, sprite);
}

function generateXML() {
    const modelUri = document.getElementById('modelUri').value;
    const modelName = document.getElementById('modelName').value;
    const sizeX = parseFloat(document.getElementById('sizeX').value);
    const sizeY = parseFloat(document.getElementById('sizeY').value);
    const sizeZ = parseFloat(document.getElementById('sizeZ').value);
    const startX = parseFloat(document.getElementById('startX').value);
    const startY = parseFloat(document.getElementById('startY').value);
    const startZ = parseFloat(document.getElementById('startZ').value);
    const repeatX = parseInt(document.getElementById('repeatX').value);
    const repeatY = parseInt(document.getElementById('repeatY').value);
    const repeatZ = parseInt(document.getElementById('repeatZ').value);
    const distanceX = parseFloat(document.getElementById('distanceX').value);
    const distanceY = parseFloat(document.getElementById('distanceY').value);
    const distanceZ = parseFloat(document.getElementById('distanceZ').value);
    const deviationX = parseFloat(document.getElementById('deviationX').value);
    const deviationY = parseFloat(document.getElementById('deviationY').value);
    const deviationZ = parseFloat(document.getElementById('deviationZ').value);
    const rotationRoll = parseFloat(document.getElementById('rotationRoll').value);
    const rotationPitch = parseFloat(document.getElementById('rotationPitch').value);
    const rotationYaw = parseFloat(document.getElementById('rotationYaw').value);
    
    let xml = '';
    let counter = 1;
    
    // Clear existing models
    clearModels();
    
    // Generate models
    for (let iz = 0; iz < repeatZ; iz++) {
        for (let iy = 0; iy < repeatY; iy++) {
            for (let ix = 0; ix < repeatX; ix++) {
                // Add random deviation
                const devX = deviationX > 0 ? (Math.random() - 0.5) * 2 * deviationX : 0;
                const devY = deviationY > 0 ? (Math.random() - 0.5) * 2 * deviationY : 0;
                const devZ = deviationZ > 0 ? (Math.random() - 0.5) * 2 * deviationZ : 0;
                
                const x = startX + (ix * distanceX) + devX;
                const y = startY + (iy * distanceY) + devY;
                const z = startZ + (iz * distanceZ) + devZ;
                
                // Add random rotation deviation (convert to radians)
                const roll = rotationRoll > 0 ? (Math.random() * rotationRoll * Math.PI / 180) : 0;
                const pitch = rotationPitch > 0 ? (Math.random() * rotationPitch * Math.PI / 180) : 0;
                const yaw = rotationYaw > 0 ? (Math.random() * rotationYaw * Math.PI / 180) : 0;
                
                const name = `${modelName}_${String(counter).padStart(2, '0')}`;
                
                xml += `<include>\n`;
                xml += `  <uri>${modelUri}</uri>\n`;
                xml += `  <name>${name}</name>\n`;
                xml += `  <pose>${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)} ${roll.toFixed(6)} ${pitch.toFixed(6)} ${yaw.toFixed(6)}</pose>\n`;
                xml += `</include>\n`;
                
                if (counter < repeatX * repeatY * repeatZ) {
                    xml += '\n';
                }
                
                // Add visual model in Three.js
                createModel(x, z, -y, counter, sizeX, sizeY, sizeZ, pitch, yaw, roll); // Note: swapping y and z for Three.js coordinate system
                
                counter++;
            }
        }
    }
    
    // Update output
    document.getElementById('output').textContent = xml;
    
    // Update stats
    const totalCount = repeatX * repeatY * repeatZ;
    document.getElementById('totalCount').textContent = `Toplam: ${totalCount} model`;
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
document.getElementById('regenerateBtn').addEventListener('click', generateXML);
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
