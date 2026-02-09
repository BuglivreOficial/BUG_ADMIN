// Manga Dashboard Script

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });
}

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    }
});

// Add Task Modal
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const closeModal = document.getElementById('closeModal');
const cancelTask = document.getElementById('cancelTask');
const taskForm = document.getElementById('taskForm');

addTaskBtn?.addEventListener('click', () => {
    addTaskModal.classList.add('show');
});

closeModal?.addEventListener('click', () => {
    addTaskModal.classList.remove('show');
});

cancelTask?.addEventListener('click', () => {
    addTaskModal.classList.remove('show');
    taskForm.reset();
});

addTaskModal?.addEventListener('click', (e) => {
    if (e.target === addTaskModal) {
        addTaskModal.classList.remove('show');
    }
});

// Task Form Submit
taskForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm);
    
    // Create task card
    showNotification('Tarefa criada com sucesso!', 'success');
    addTaskModal.classList.remove('show');
    taskForm.reset();
    
    // Here you would normally send data to backend
    console.log('New task:', Object.fromEntries(formData));
});

// Drag and Drop for Kanban
let draggedElement = null;

document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
});

document.querySelectorAll('.cards-container').forEach(container => {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragleave', handleDragLeave);
});

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.style.background = 'rgba(102, 126, 234, 0.05)';
    return false;
}

function handleDragLeave(e) {
    this.style.background = '';
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    this.style.background = '';
    
    if (draggedElement !== null) {
        this.appendChild(draggedElement);
        
        // Update task count
        updateTaskCounts();
        
        // Show notification
        const columnName = this.closest('.kanban-column').querySelector('.column-title h3').textContent;
        showNotification(`Tarefa movida para ${columnName}`, 'success');
    }
    
    return false;
}

function updateTaskCounts() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        const count = column.querySelectorAll('.task-card').length;
        column.querySelector('.task-count').textContent = count;
    });
}

// Edit Task Cards
document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.task-card');
        const title = card.querySelector('.card-title').textContent;
        
        // Check if it's view or edit button
        const isView = this.querySelector('svg circle');
        if (isView) {
            showNotification(`Visualizando: ${title}`, 'info');
        } else {
            showNotification(`Editando: ${title}`, 'info');
        }
    });
});

// Approve Requests
document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const requestItem = this.closest('.request-item');
        const title = requestItem.querySelector('.request-title').textContent;
        
        // Animate removal
        requestItem.style.transition = 'all 0.3s ease';
        requestItem.style.transform = 'translateX(100%)';
        requestItem.style.opacity = '0';
        
        setTimeout(() => {
            requestItem.remove();
            showNotification(`Pedido aprovado: ${title}`, 'success');
        }, 300);
    });
});

// View Toggle
const toggleBtns = document.querySelectorAll('.toggle-btn');
toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        toggleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const view = this.dataset.view;
        if (view === 'list') {
            showNotification('Visualização em lista em desenvolvimento', 'info');
        }
    });
});

// Add Card Buttons
document.querySelectorAll('.add-card-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const columnName = this.closest('.kanban-column').querySelector('.column-title h3').textContent;
        showNotification(`Adicionar tarefa em: ${columnName}`, 'info');
        addTaskModal.classList.add('show');
    });
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                ` : `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                `}
            </div>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--neu-bg);
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 10px 10px 20px var(--neu-shadow-dark), -10px -10px 20px var(--neu-shadow-light);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    
    .notification {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-icon {
        width: 20px;
        height: 20px;
    }
    
    .notification-icon svg {
        width: 100%;
        height: 100%;
        color: var(--green);
    }
    
    .notification.info .notification-icon svg {
        color: var(--blue);
    }
`;
document.head.appendChild(style);

// Stats Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// Update stats periodically
setInterval(() => {
    // Simulate real-time updates
    updateTaskCounts();
}, 30000);

// Logout
document.querySelector('.logout-btn')?.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
        showNotification('Saindo...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTaskCounts();
    console.log('Manga Dashboard initialized');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open add task
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        addTaskModal.classList.add('show');
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        addTaskModal.classList.remove('show');
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('show');
        }
    }
});
