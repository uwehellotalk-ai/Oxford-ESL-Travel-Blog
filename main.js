const scriptURL = 'https://script.google.com/macros/s/AKfycbxE9v3EEUAjYas4iXildmJADYsJ9QIVdcJv5ccxpNdCFO8W8xxE8WJaeCx3xDAfpQ/exec';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Skript gestartet.");

    // --- NAVIGATION LOGIK ---
    const navButtons = document.querySelectorAll('nav button');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-section');
            
            console.log("Klick auf Button! Ziel-ID: " + targetId);

            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                } else {
                    console.warn("Konnte Sektion '" + targetId + "' nicht finden.");
                }
            }
        });
    });

    // --- KOMMENTAR SENDEN ---
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const formData = {
                nickname: document.getElementById('comment-nickname').value,
                text: document.getElementById('comment-text').value,
                email: document.getElementById('comment-email').value
            };

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(() => {
                alert('Danke für deinen Kommentar!');
                commentForm.reset();
                loadComments(); // Lädt die Liste nach dem Senden neu
            })
            .catch(error => console.error('Fehler:', error));
        });
    }

    // Starte das Laden der Kommentare direkt beim Seitenaufruf
    loadComments();
});

// --- KOMMENTARE LADEN FUNKTION ---
function loadComments() {
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            const displayArea = document.getElementById('comments-display');
            if (!displayArea) return;

            displayArea.innerHTML = ''; 

            data.forEach(row => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-box';
                commentDiv.style.marginBottom = "20px";
                commentDiv.innerHTML = `
                    <p><strong>${row[1]}</strong> <small>(${new Date(row[0]).toLocaleDateString()})</small></p>
                    <p>${row[2]}</p>
                    <hr>
                `;
                displayArea.appendChild(commentDiv);
            });
        })
        .catch(error => console.error('Fehler beim Laden:', error));
}