document.addEventListener('DOMContentLoaded', function() {
    // Create audio element
    const bgMusic = new Audio('tumho.mp3'); // Using your existing music file
    bgMusic.loop = true; // Make the music loop
    bgMusic.volume = 0.5; // Set initial volume to 50%
    
    // Create music toggle button and add to the modal
    const musicButton = document.createElement('button');
    musicButton.id = 'music-toggle';
    musicButton.innerHTML = '🎵';
    musicButton.title = 'Toggle Background Music';
    
    // Style the music button - positioned like your audio button but on the right side
    musicButton.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #9E3B78, #6A2651);
        color: white;
        font-size: 16px;
        border: none;
        box-shadow: 0 4px 15px rgba(158, 59, 120, 0.4);
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Find the modal image container and add the music button to it
    function addMusicButtonToModal() {
        const modalImageContainer = document.querySelector('#photoModal div[style*="position:relative"]');
        if (modalImageContainer) {
            modalImageContainer.appendChild(musicButton);
        }
    }
    
    // Add the button to modal when DOM is ready
    addMusicButtonToModal();
    
    // Add hover effect
    musicButton.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(158, 59, 120, 0.6)';
    });
    
    musicButton.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1.0)';
        this.style.boxShadow = '0 4px 15px rgba(158, 59, 120, 0.4)';
    });
    
    // Track music state
    let isMusicPlaying = false;
    
    // Add click event to toggle music
    musicButton.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicButton.innerHTML = '🎵';
            musicButton.style.background = 'linear-gradient(135deg, #9E3B78, #6A2651)';
        } else {
            // Start playing - requires user interaction due to browser autoplay policies
            bgMusic.play()
                .then(() => {
                    musicButton.innerHTML = '🔊';
                    musicButton.style.background = 'linear-gradient(135deg, #6A2651, #4A1A3D)'; // Darker when active
                })
                .catch(err => {
                    console.error('Failed to play music:', err);
                    alert('Unable to play music. Please check the music file.');
                });
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // Handle audio errors
    bgMusic.addEventListener('error', function() {
        console.error('Audio error:', bgMusic.error);
        // Don't show alert to avoid annoying user, just log the error
    });
    
    // Auto-start music when modal opens (if user has interacted before)
    const originalShowPhotos = window.showPhotosAndPlaySong;
    if (originalShowPhotos) {
        window.showPhotosAndPlaySong = function() {
            originalShowPhotos();
            // Ensure music button is in the modal after it opens
            setTimeout(addMusicButtonToModal, 100);
        };
    }
    
    // Stop music when modal closes
    const originalCloseModal = window.closeModal;
    if (originalCloseModal) {
        window.closeModal = function() {
            originalCloseModal();
            // Stop background music when modal closes
            if (isMusicPlaying) {
                bgMusic.pause();
                musicButton.innerHTML = '🎵';
                musicButton.style.background = 'linear-gradient(135deg, #9E3B78, #6A2651)';
                isMusicPlaying = false;
            }
        };
    }
});
