import { backend } from 'declarations/backend';

const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const downloadBtn = document.getElementById('downloadBtn');

let isDrawing = false;

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Initialize brush
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSize.value;

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function updateBrushSize() {
    ctx.lineWidth = brushSize.value;
    brushSizeValue.textContent = brushSize.value;
}

function updateColor() {
    ctx.strokeStyle = colorPicker.value;
}

function downloadImage() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'paint-image.png';
    link.href = dataURL;
    link.click();
}

async function saveImageToBackend() {
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    try {
        await backend.saveImage(uint8Array);
        console.log('Image saved to backend');
    } catch (error) {
        console.error('Error saving image to backend:', error);
    }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

brushSize.addEventListener('input', updateBrushSize);
colorPicker.addEventListener('input', updateColor);
downloadBtn.addEventListener('click', downloadImage);

// Save image to backend every 30 seconds
setInterval(saveImageToBackend, 30000);

// Load image from backend on page load
async function loadImageFromBackend() {
    try {
        const imageData = await backend.getImage();
        if (imageData) {
            const blob = new Blob([imageData], { type: 'image/png' });
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = URL.createObjectURL(blob);
        }
    } catch (error) {
        console.error('Error loading image from backend:', error);
    }
}

loadImageFromBackend();
