// API endpoint - replace with your actual backend URL
const API_URL = 'http://localhost:3000/api';

// Sample data for demonstration
let userData = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setInterval(refreshData, 30000); // Auto-refresh every 30 seconds
});

// Load user data from API
async function loadUserData() {
    try {
        // In production, replace this with actual API call
        // const response = await fetch(`${API_URL}/users`);
        // userData = await response.json();
        
        // No demo data - start with empty array
        userData = [];
        updateDashboard();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update dashboard with data
function updateDashboard() {
    // Update stats
    document.getElementById('totalUsers').textContent = userData.length;
    document.getElementById('activeUsers').textContent = userData.filter(u => u.status === 'online').length;
    document.getElementById('totalSerials').textContent = userData.length;
    document.getElementById('uniqueIPs').textContent = new Set(userData.map(u => u.ip)).size;
    
    // Update table
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    userData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.serial}</strong></td>
            <td>${user.ip}</td>
            <td>${user.device}</td>
            <td>${user.os}</td>
            <td>${user.browser}</td>
            <td>${formatDate(user.lastSeen)}</td>
            <td><span class="status-badge status-${user.status}">${user.status.toUpperCase()}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// Generate serial key
function generateSerialKey(prefix = '') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serial = prefix || 'WF';
    
    for (let i = 0; i < 4; i++) {
        serial += '-';
        for (let j = 0; j < 4; j++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    return serial;
}

// Generate new serial
function generateSerial() {
    const prefix = document.getElementById('serialPrefix').value.toUpperCase() || 'WF';
    const serial = generateSerialKey(prefix);
    document.getElementById('generatedSerial').textContent = serial;
    
    // Copy to clipboard
    navigator.clipboard.writeText(serial).then(() => {
        showNotification('Serial copied to clipboard!');
    });
}

// Refresh data
function refreshData() {
    loadUserData();
    showNotification('Data refreshed!');
}

// Show notification
function showNotification(message) {
    // Simple notification - you can enhance this
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(120, 185, 255, 0.9);
        color: #fff;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
