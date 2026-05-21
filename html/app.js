const app = document.getElementById('app');
const closeBtn = document.getElementById('closeBtn');
const toast = document.getElementById('toast');

// Input fields
const valVector3 = document.getElementById('val-vector3');
const valVector4 = document.getElementById('val-vector4');
const valXyz = document.getElementById('val-xyz');
const valTable = document.getElementById('val-table');
const valHeading = document.getElementById('val-heading');

// Format numbers
const formatNumber = (num) => {
    return Number.isInteger(num) ? num + ".0" : num.toFixed(2);
};

// Event Listener for NUI Messages
window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.type === 'open') {
        app.style.display = 'flex';
    } else if (data.type === 'close') {
        app.style.display = 'none';
    } else if (data.type === 'updateCoords') {
        const x = formatNumber(data.x);
        const y = formatNumber(data.y);
        const z = formatNumber(data.z);
        const h = formatNumber(data.h);

        valVector3.value = `vector3(${x}, ${y}, ${z})`;
        valVector4.value = `vector4(${x}, ${y}, ${z}, ${h})`;
        valXyz.value = `${x}, ${y}, ${z}`;
        valTable.value = `{x = ${x}, y = ${y}, z = ${z}}`;
        valHeading.value = `${h}`;
    }
});

// Close function
const closeMenu = () => {
    fetch(`https://${GetParentResourceName()}/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({})
    }).catch(err => console.log('Error closing menu:', err));
};

// Close via ESC
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closeMenu();
    }
});

// Close via button
closeBtn.addEventListener('click', closeMenu);

// Copy functionality
const copyButtons = document.querySelectorAll('.copy-btn');
let toastTimeout;

const showToast = () => {
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
};

// Create a hidden textarea to copy from (fallback for FiveM NUI environments if navigator.clipboard fails)
const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(showToast).catch(err => {
            console.error('Failed to copy via clipboard API', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
};

const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Make it invisible
    textArea.style.position = "absolute";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast();
    } catch (err) {
        console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
};

copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const inputField = document.getElementById(targetId);
        
        if (inputField && inputField.value) {
            // Visual feedback on button
            const icon = btn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            setTimeout(() => {
                icon.className = 'fa-solid fa-copy';
            }, 1500);

            copyToClipboard(inputField.value);
        }
    });
});
