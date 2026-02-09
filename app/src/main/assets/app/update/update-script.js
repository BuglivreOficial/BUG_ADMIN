// Update Screen JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const updateBtn = document.getElementById('updateBtn');
    const laterBtn = document.getElementById('laterBtn');
    const progressSection = document.getElementById('progressSection');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');

    // Mock AndroidBridge if not available (for testing in browser)
    if (typeof AndroidBridge === 'undefined') {
        window.AndroidBridge = {
            startUpdate: function() {
                console.log('AndroidBridge.startUpdate() called');
            },
            dismissUpdate: function() {
                console.log('AndroidBridge.dismissUpdate() called');
            },
            openReleaseNotes: function() {
                console.log('AndroidBridge.openReleaseNotes() called');
            }
        };
    }

    // Update Button Click Handler
    updateBtn.addEventListener('click', function() {
        startUpdateProcess();
    });

    // Later Button Click Handler
    laterBtn.addEventListener('click', function() {
        // Call Android bridge to dismiss update
        if (typeof AndroidBridge !== 'undefined' && AndroidBridge.dismissUpdate) {
            AndroidBridge.dismissUpdate();
        }
        
        // Add animation before closing
        const card = document.querySelector('.update-card');
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(function() {
            window.close();
        }, 300);
    });

    // Start Update Process
    function startUpdateProcess() {
        // Show loading state
        updateBtn.classList.add('loading');
        laterBtn.disabled = true;
        laterBtn.style.opacity = '0.5';
        laterBtn.style.pointerEvents = 'none';

        // Show progress section after a brief delay
        setTimeout(function() {
            progressSection.classList.add('show');
            updateBtn.classList.remove('loading');
            
            // Hide update button and later button
            updateBtn.style.display = 'none';
            laterBtn.style.display = 'none';
            
            // Call Android bridge to start update
            if (typeof AndroidBridge !== 'undefined' && AndroidBridge.startUpdate) {
                AndroidBridge.startUpdate();
            }
            
            // Start progress simulation (remove this in production)
            simulateProgress();
        }, 1000);
    }

    // Simulate Progress (for testing - remove in production)
    function simulateProgress() {
        let progress = 0;
        const interval = setInterval(function() {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                completeUpdate();
            }
            
            updateProgress(progress);
        }, 500);
    }

    // Update Progress Bar
    function updateProgress(percent) {
        const roundedPercent = Math.min(Math.round(percent), 100);
        progressBar.style.width = roundedPercent + '%';
        progressPercent.textContent = roundedPercent + '%';
        
        // Update text based on progress
        if (roundedPercent < 30) {
            progressText.textContent = 'Baixando atualização...';
        } else if (roundedPercent < 60) {
            progressText.textContent = 'Baixando...';
        } else if (roundedPercent < 90) {
            progressText.textContent = 'Preparando instalação...';
        } else if (roundedPercent < 100) {
            progressText.textContent = 'Quase pronto...';
        } else {
            progressText.textContent = 'Download concluído!';
        }
    }

    // Complete Update
    function completeUpdate() {
        setTimeout(function() {
            progressText.textContent = 'Instalando atualização...';
            
            // Add success animation
            progressBar.style.background = 'linear-gradient(90deg, #00c896, #00d4a0)';
            
            // After installation animation, close or restart
            setTimeout(function() {
                const card = document.querySelector('.update-card');
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                // In production, the app would restart here
                setTimeout(function() {
                    if (typeof AndroidBridge !== 'undefined' && AndroidBridge.installUpdate) {
                        AndroidBridge.installUpdate();
                    }
                }, 300);
            }, 1500);
        }, 500);
    }

    // Public function to update progress from Android
    window.setUpdateProgress = function(percent) {
        updateProgress(percent);
    };

    // Public function to complete update from Android
    window.completeUpdate = function() {
        completeUpdate();
    };

    // Public function to show error from Android
    window.showUpdateError = function(message) {
        progressText.textContent = message || 'Erro ao baixar atualização';
        progressText.style.color = '#ff3b5c';
        progressBar.style.background = 'linear-gradient(90deg, #ff3b5c, #ff5571)';
        
        // Show retry button
        setTimeout(function() {
            const retryBtn = document.createElement('button');
            retryBtn.className = 'neu-button primary-btn';
            retryBtn.innerHTML = '<span class="btn-text">Tentar Novamente</span>';
            retryBtn.style.marginTop = '20px';
            retryBtn.onclick = function() {
                location.reload();
            };
            
            progressSection.appendChild(retryBtn);
        }, 1000);
    };
});
