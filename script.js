const API_BASE_URL = '';

const navItems = document.querySelectorAll('.nav-item');
const panelContents = document.querySelectorAll('.panel-content');
const imageTextInput = document.getElementById('image-text');
const videoTextInput = document.getElementById('video-text');
const generateImageBtn = document.getElementById('generate-image-btn');
const generateVideoBtn = document.getElementById('generate-video-btn');
const resultContainer = document.getElementById('result-container');
const downloadBtn = document.getElementById('download-btn');
const topbarLabel = document.getElementById('topbar-label');

const topbarLabels = {
    image: 'Generate BRAT Image',
    video: 'Generate BRAT Video',
};

let currentBlobUrl = null;
let currentFileType = null;

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.dataset.type;
        
        navItems.forEach(i => i.classList.remove('active'));
        panelContents.forEach(p => p.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(`${type}-panel`).classList.add('active');

        if (topbarLabel && topbarLabels[type]) {
            topbarLabel.textContent = topbarLabels[type];
        }
    });
});

async function generateImage() {
    const text = imageTextInput.value.trim();
    
    if (!text) {
        alert('Silakan masukkan teks!');
        return;
    }

    generateImageBtn.disabled = true;
    generateImageBtn.innerHTML = 'Generating...';
    resultContainer.classList.add('loading');
    resultContainer.innerHTML = '<p class="placeholder-text">Generating...</p>';
    downloadBtn.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/brat?text=${encodeURIComponent(text)}`);
        
        if (!response.ok) {
            throw new Error('Gagal generate gambar');
        }

        const blob = await response.blob();
        currentBlobUrl = URL.createObjectURL(blob);
        currentFileType = 'image';
        
        resultContainer.innerHTML = `<img src="${currentBlobUrl}" alt="BRAT Image">`;
        downloadBtn.style.display = 'block';
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: rgba(255, 100, 100, 0.9); font-size: 14px;">Error: ${error.message}</p>`;
    } finally {
        generateImageBtn.disabled = false;
        generateImageBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate Image`;
        resultContainer.classList.remove('loading');
    }
}

async function generateVideo() {
    const text = videoTextInput.value.trim();
    
    if (!text) {
        alert('Silakan masukkan teks!');
        return;
    }

    generateVideoBtn.disabled = true;
    generateVideoBtn.innerHTML = 'Generating...';
    resultContainer.classList.add('loading');
    resultContainer.innerHTML = '<p class="placeholder-text">Generating...</p>';
    downloadBtn.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/bratvid?text=${encodeURIComponent(text)}`);
        
        if (!response.ok) {
            throw new Error('Gagal generate video');
        }

        const blob = await response.blob();
        currentBlobUrl = URL.createObjectURL(blob);
        currentFileType = 'video';
        
        resultContainer.innerHTML = `<video src="${currentBlobUrl}" controls autoplay loop></video>`;
        downloadBtn.style.display = 'block';
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: rgba(255, 100, 100, 0.9); font-size: 14px;">Error: ${error.message}</p>`;
    } finally {
        generateVideoBtn.disabled = false;
        generateVideoBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate Video`;
        resultContainer.classList.remove('loading');
    }
}

function downloadResult() {
    if (!currentBlobUrl) return;
    
    const link = document.createElement('a');
    link.href = currentBlobUrl;
    link.download = currentFileType === 'image' 
        ? `brat-${Date.now()}.jpg` 
        : `brat-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

generateImageBtn.addEventListener('click', generateImage);
generateVideoBtn.addEventListener('click', generateVideo);
downloadBtn.addEventListener('click', downloadResult);

imageTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateImage();
    }
});

videoTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateVideo();
    }
});
