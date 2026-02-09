// Maintenance Manager Script - Full CRUD Operations

// State Management
let maintenanceData = [];
let editingId = null;

// DOM Elements
const toggleFormBtn = document.getElementById('toggleFormBtn');
const maintenanceForm = document.getElementById('maintenanceForm');
const cancelBtn = document.getElementById('cancelBtn');
const activeList = document.getElementById('activeList');
const scheduledList = document.getElementById('scheduledList');
const pastList = document.getElementById('pastList');
const activeCount = document.getElementById('activeCount');
const scheduledCount = document.getElementById('scheduledCount');
const pastCount = document.getElementById('pastCount');
const toast = document.getElementById('toast');
const toastMessage = toast.querySelector('.toast-message');

// Modal Elements
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');

// Module Icons Map
const moduleIcons = {
    all: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    auth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    payments: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    api: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
};

// Module Names Map
const moduleNames = {
    all: 'Sistema Completo',
    auth: 'Autenticação',
    payments: 'Pagamentos',
    search: 'Busca',
    api: 'API',
    reports: 'Relatórios'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMaintenanceData();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    toggleFormBtn.addEventListener('click', toggleForm);
    cancelBtn.addEventListener('click', hideForm);
    maintenanceForm.addEventListener('submit', handleSubmit);
    
    // Modal events
    closeModal.addEventListener('click', hideModal);
    cancelEdit.addEventListener('click', hideModal);
    editForm.addEventListener('submit', handleEdit);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) hideModal();
    });
}

// Toggle Form Visibility
function toggleForm() {
    const form = document.querySelector('.maintenance-form');
    const isVisible = form.classList.contains('show');
    
    if (isVisible) {
        hideForm();
    } else {
        showForm();
    }
}

function showForm() {
    const form = document.querySelector('.maintenance-form');
    form.classList.add('show');
    toggleFormBtn.classList.add('active');
}

function hideForm() {
    const form = document.querySelector('.maintenance-form');
    form.classList.remove('show');
    toggleFormBtn.classList.remove('active');
    maintenanceForm.reset();
}

// Load Maintenance Data (Mock API call)
async function loadMaintenanceData() {
    try {
        // In a real application, this would be an API call
        // For demo purposes, we'll use localStorage
        const stored = localStorage.getItem('maintenanceData');
        if (stored) {
            maintenanceData = JSON.parse(stored);
        } else {
            // Sample data
            maintenanceData = [
                {
                    id: 1,
                    module_name: 'auth',
                    is_active: true,
                    start_at: new Date(Date.now() - 3600000).toISOString().slice(0, 16),
                    end_at: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
                    message: 'Manutenção programada do sistema de autenticação. Algumas funcionalidades podem estar indisponíveis.',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    module_name: 'payments',
                    is_active: false,
                    start_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                    end_at: new Date(Date.now() + 90000000).toISOString().slice(0, 16),
                    message: 'Atualização do gateway de pagamento. O sistema estará temporariamente offline.',
                    created_at: new Date().toISOString()
                }
            ];
            saveToStorage();
        }
        renderMaintenanceItems();
    } catch (error) {
        showToast('Erro ao carregar dados', 'error');
    }
}

// Save to localStorage (Mock database)
function saveToStorage() {
    localStorage.setItem('maintenanceData', JSON.stringify(maintenanceData));
}

// Handle Form Submit (Create)
async function handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    
    const formData = new FormData(e.target);
    const data = {
        id: Date.now(), // Generate unique ID
        module_name: formData.get('moduleName'),
        is_active: formData.get('isActive') === 'on',
        start_at: formData.get('startAt'),
        end_at: formData.get('endAt'),
        message: formData.get('message') || '',
        created_at: new Date().toISOString()
    };
    
    // Validate dates
    if (new Date(data.start_at) >= new Date(data.end_at)) {
        showToast('Data de término deve ser posterior à data de início', 'error');
        submitBtn.classList.remove('loading');
        return;
    }
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        maintenanceData.push(data);
        saveToStorage();
        renderMaintenanceItems();
        
        showToast('Manutenção criada com sucesso!');
        hideForm();
        e.target.reset();
    } catch (error) {
        showToast('Erro ao criar manutenção', 'error');
    } finally {
        submitBtn.classList.remove('loading');
    }
}

// Render Maintenance Items
function renderMaintenanceItems() {
    const now = new Date();
    
    // Categorize items
    const active = maintenanceData.filter(item => {
        const start = new Date(item.start_at);
        const end = new Date(item.end_at);
        return item.is_active || (now >= start && now <= end);
    });
    
    const scheduled = maintenanceData.filter(item => {
        const start = new Date(item.start_at);
        return !item.is_active && now < start;
    });
    
    const past = maintenanceData.filter(item => {
        const end = new Date(item.end_at);
        return !item.is_active && now > end;
    });
    
    // Update counts
    activeCount.textContent = active.length;
    scheduledCount.textContent = scheduled.length;
    pastCount.textContent = past.length;
    
    // Render lists
    renderList(activeList, active, 'active');
    renderList(scheduledList, scheduled, 'scheduled');
    renderList(pastList, past, 'past');
}

// Render List Helper
function renderList(container, items, status) {
    if (items.length === 0) {
        const emptyState = container.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        // Remove all maintenance items
        const existingItems = container.querySelectorAll('.maintenance-item');
        existingItems.forEach(item => item.remove());
        return;
    }
    
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Clear existing items
    const existingItems = container.querySelectorAll('.maintenance-item');
    existingItems.forEach(item => item.remove());
    
    // Add new items
    items.forEach(item => {
        const itemElement = createMaintenanceItem(item, status);
        container.appendChild(itemElement);
    });
}

// Create Maintenance Item Element
function createMaintenanceItem(data, status) {
    const div = document.createElement('div');
    div.className = 'maintenance-item';
    div.dataset.id = data.id;
    
    const statusBadge = `
        <div class="status-badge ${status}">
            <span class="status-indicator"></span>
            ${status === 'active' ? 'Ativo' : status === 'scheduled' ? 'Agendado' : 'Concluído'}
        </div>
    `;
    
    const startDate = new Date(data.start_at);
    const endDate = new Date(data.end_at);
    const formatDate = (date) => {
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    div.innerHTML = `
        <div class="item-header">
            <div class="item-info">
                <div class="item-module">
                    <span class="module-icon">${moduleIcons[data.module_name]}</span>
                    ${moduleNames[data.module_name]}
                </div>
                ${statusBadge}
                <div class="item-dates">
                    <div class="date-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <strong>Início:</strong> ${formatDate(startDate)}
                    </div>
                    <div class="date-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <strong>Término:</strong> ${formatDate(endDate)}
                    </div>
                </div>
            </div>
        </div>
        ${data.message ? `<div class="item-message">${data.message}</div>` : ''}
        <div class="item-actions">
            ${status !== 'past' ? `
                <button class="action-btn btn-edit" onclick="editMaintenance(${data.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                </button>
                <button class="action-btn btn-toggle" onclick="toggleActive(${data.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
                        <circle cx="16" cy="12" r="3"/>
                    </svg>
                    ${data.is_active ? 'Desativar' : 'Ativar'}
                </button>
            ` : ''}
            <button class="action-btn btn-delete" onclick="deleteMaintenance(${data.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Excluir
            </button>
        </div>
    `;
    
    return div;
}

// Edit Maintenance
window.editMaintenance = function(id) {
    const item = maintenanceData.find(m => m.id === id);
    if (!item) return;
    
    editingId = id;
    
    // Populate form
    document.getElementById('editId').value = item.id;
    document.getElementById('editModuleName').value = item.module_name;
    document.getElementById('editIsActive').checked = item.is_active;
    document.getElementById('editStartAt').value = item.start_at;
    document.getElementById('editEndAt').value = item.end_at;
    document.getElementById('editMessage').value = item.message || '';
    
    // Show modal
    editModal.classList.add('show');
};

// Handle Edit Submit
async function handleEdit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const id = parseInt(formData.get('id'));
    
    const updatedData = {
        module_name: formData.get('moduleName'),
        is_active: formData.get('isActive') === 'on',
        start_at: formData.get('startAt'),
        end_at: formData.get('endAt'),
        message: formData.get('message') || ''
    };
    
    // Validate dates
    if (new Date(updatedData.start_at) >= new Date(updatedData.end_at)) {
        showToast('Data de término deve ser posterior à data de início', 'error');
        return;
    }
    
    try {
        // Find and update item
        const index = maintenanceData.findIndex(m => m.id === id);
        if (index !== -1) {
            maintenanceData[index] = {
                ...maintenanceData[index],
                ...updatedData
            };
            
            saveToStorage();
            renderMaintenanceItems();
            showToast('Manutenção atualizada com sucesso!');
            hideModal();
        }
    } catch (error) {
        showToast('Erro ao atualizar manutenção', 'error');
    }
}

// Toggle Active Status
window.toggleActive = function(id) {
    const item = maintenanceData.find(m => m.id === id);
    if (!item) return;
    
    item.is_active = !item.is_active;
    saveToStorage();
    renderMaintenanceItems();
    
    showToast(
        item.is_active ? 'Manutenção ativada' : 'Manutenção desativada'
    );
};

// Delete Maintenance
window.deleteMaintenance = function(id) {
    if (!confirm('Tem certeza que deseja excluir esta manutenção?')) {
        return;
    }
    
    try {
        maintenanceData = maintenanceData.filter(m => m.id !== id);
        saveToStorage();
        renderMaintenanceItems();
        showToast('Manutenção excluída com sucesso!');
    } catch (error) {
        showToast('Erro ao excluir manutenção', 'error');
    }
};

// Modal Functions
function hideModal() {
    editModal.classList.remove('show');
    editForm.reset();
    editingId = null;
}

// Toast Notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast';
    
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Auto-refresh active status every minute
setInterval(() => {
    renderMaintenanceItems();
}, 60000);
