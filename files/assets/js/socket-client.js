// Socket.io Client Script for Staff and Youth

const socket = io();

// Determine user role and join appropriate room
function joinRoom() {
    // Get user role from session or page data
    const userRole = getUserRole();
    
    console.log('Attempting to join room with role:', userRole);
    
    if (userRole === 'staff') {
        socket.emit('join-room', 'staff');
        console.log('✓ Emitted join-room event for staff');
    } else if (userRole === 'youth') {
        socket.emit('join-room', 'youth');
        console.log('✓ Emitted join-room event for youth');
    } else {
        console.warn('⚠ User role not detected - will not join any room');
    }
}

// Get user role from page meta tag, URL, or other source
function getUserRole() {
    // Try to get from meta tag first
    const roleTag = document.querySelector('meta[name="user-role"]');
    if (roleTag) {
        return roleTag.getAttribute('content');
    }
    
    // Check current URL path - be more specific
    const path = window.location.pathname.toLowerCase();
    
    // Staff pages
    if (path.includes('staff') || path.includes('pwd') || path.includes('senior') || 
        path === '/index-staff' || path.includes('add_pwd') || path.includes('add_senior')) {
        return 'staff';
    }
    
    // Youth pages
    if (path.includes('youth') || path === '/index-youth' || path.includes('add_youth')) {
        return 'youth';
    }
    
    // Try to get from window variable if set by server
    if (window.userRole) {
        return window.userRole;
    }
    
    return null;
}

// Join room when socket connects
socket.on('connect', () => {
    console.log('✓ Socket.io connected:', socket.id);
    joinRoom();
});

// Listen for alerts
socket.on('receive-alert', (data) => {
    console.log('🔔 Alert received:', data);
    
    // Show alert notification
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'info',
            title: 'Alert from Admin',
            html: `<p style="font-size: 16px; margin: 10px 0;">${data.message}</p><small style="color: #999;">${new Date(data.timestamp).toLocaleTimeString()}</small>`,
            toast: true,
            position: 'top-end',
            showConfirmButton: true,
            timer: 8000,
            timerProgressBar: true
        });
    } else {
        // Fallback to alert if SweetAlert2 not available
        alert(`Alert from Admin: ${data.message}`);
    }
    
    // Log alert to console
    console.log(`[${new Date(data.timestamp).toLocaleTimeString()}] Alert: ${data.message}`);
});

// Handle disconnection
socket.on('disconnect', () => {
    console.log('⚠ Disconnected from server');
});

// Handle reconnection
socket.on('reconnect', () => {
    console.log('✓ Reconnected to server');
    joinRoom();
});

// Log any connection errors
socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
});

// Ensure room join on page ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Page loaded, ensuring room join...');
    if (socket.connected) {
        joinRoom();
    }
});
