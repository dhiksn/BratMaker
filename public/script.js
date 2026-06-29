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
    video: 'Generate BRAT GIF',
};

let currentBlobUrl = null;
let currentFileType = null;

function resetResult() {
    // Revoke previous blob URL to free memory
    if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = null;
        currentFileType = null;
    }
    resultContainer.innerHTML = `
        <div class="result-empty">
            <div class="empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
            </div>
            <p>Hasil akan muncul di sini</p>
        </div>`;
    downloadBtn.style.display = 'none';
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.dataset.type;

        // Sync both sidebar and mobile nav
        navItems.forEach(i => i.classList.remove('active'));
        panelContents.forEach(p => p.classList.remove('active'));

        document.querySelectorAll(`.nav-item[data-type="${type}"]`).forEach(i => i.classList.add('active'));
        document.getElementById(`${type}-panel`).classList.add('active');

        if (topbarLabel && topbarLabels[type]) {
            topbarLabel.textContent = topbarLabels[type];
        }

        // Clear result when switching tabs
        resetResult();
    });
});

async function generateImage() {
    const text = imageTextInput.value.trim();

    if (!text) {
        imageTextInput.focus();
        return;
    }

    generateImageBtn.disabled = true;
    generateImageBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg> Generating...`;
    resultContainer.classList.add('loading');
    resultContainer.innerHTML = '<p class="placeholder-text">Generating...</p>';
    downloadBtn.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/api/brat?text=${encodeURIComponent(text)}`);

        if (!response.ok) throw new Error(`Gagal generate gambar (${response.status})`);

        const blob = await response.blob();

        // Revoke old blob before creating new one
        if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);

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
        videoTextInput.focus();
        return;
    }

    generateVideoBtn.disabled = true;
    generateVideoBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg> Generating...`;
    resultContainer.classList.add('loading');
    resultContainer.innerHTML = '<p class="placeholder-text">Generating...</p>';
    downloadBtn.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/api/bratvid?text=${encodeURIComponent(text)}`);

        if (!response.ok) throw new Error(`Gagal generate GIF (${response.status})`);

        const blob = await response.blob();

        // Revoke old blob before creating new one
        if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);

        currentBlobUrl = URL.createObjectURL(blob);
        currentFileType = 'gif';

        resultContainer.innerHTML = `<img src="${currentBlobUrl}" alt="BRAT GIF">`;
        downloadBtn.style.display = 'block';
    } catch (error) {
        resultContainer.innerHTML = `<p style="color: rgba(255, 100, 100, 0.9); font-size: 14px;">Error: ${error.message}</p>`;
    } finally {
        generateVideoBtn.disabled = false;
        generateVideoBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate GIF`;
        resultContainer.classList.remove('loading');
    }
}

function downloadResult() {
    if (!currentBlobUrl) return;

    const link = document.createElement('a');
    link.href = currentBlobUrl;
    link.download = currentFileType === 'image'
        ? `brat-${Date.now()}.png`
        : `brat-${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

generateImageBtn.addEventListener('click', generateImage);
generateVideoBtn.addEventListener('click', generateVideo);
downloadBtn.addEventListener('click', downloadResult);

imageTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateImage();
});

videoTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateVideo();
});
