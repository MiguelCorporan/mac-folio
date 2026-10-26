// Portfolio Window Manager
let highestZ = 100;
const openWindows = new Map();

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    
    if (win.style.display === 'none') {
        win.style.display = 'block';
        positionWindow(win);
    }
    focusWindow(win);
}

function positionWindow(win) {
    const padding = 50;
    const maxX = window.innerWidth - win.offsetWidth - padding;
    const maxY = window.innerHeight - win.offsetHeight - padding - 100;
    
    const randomTop = Math.max(20, Math.min(Math.random() * maxY + 20, maxY));
    const randomLeft = Math.max(20, Math.min(Math.random() * maxX + 20, maxX));
    
    win.style.top = randomTop + 'px';
    win.style.left = randomLeft + 'px';
}


function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
        openWindows.delete(id);
    }
}

function focusWindow(win) {
    if (!win) return;
    highestZ++;
    win.style.zIndex = highestZ;
    openWindows.set(win.id, true);
}

function setupWindowDrag(win) {
    const header = win.querySelector('.window-header');
    if (!header) return;
    
    win.addEventListener('mousedown', () => focusWindow(win));
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.btn')) return;
        
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            let newX = pageX - shiftX;
            let newY = pageY - shiftY;
            
            newX = Math.max(0, Math.min(newX, window.innerWidth - win.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - win.offsetHeight));
            
            win.style.left = newX + 'px';
            win.style.top = newY + 'px';
        }
        
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
        
        //Prevenir drag default
        return false;
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    // Setup drag for all windows
    document.querySelectorAll('.window').forEach(win => {
        setupWindowDrag(win);
    });
    
    // Restore dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('darkToggle');
        if (toggle) toggle.checked = true;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const windows = document.querySelectorAll('.window[style*="display: block"]');
        if (windows.length > 0) {
            const lastWindow = windows[windows.length - 1];
            closeWindow(lastWindow.id);
        }
    }
});