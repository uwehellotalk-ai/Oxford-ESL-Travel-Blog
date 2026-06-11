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
                    // Scrollt weich zur richtigen Sektion, die jetzt den ganzen Inhalt umschließt
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
            .catch(error => console.error('Fehler beim Senden des Kommentars:', error));
        });
    }

    // Starte das Laden der Kommentare direkt beim Seitenaufruf
    loadComments();
});

// --- KOMMENTARE LADEN FUNKTION ---
function loadComments() {
    fetch(scriptURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerk-Antwort war nicht ok');
            }
            return response.json();
        })
        .then(data => {
            const displayArea = document.getElementById('comments-display');
            if (!displayArea) return;

            displayArea.innerHTML = ''; 

            // Prüfen, ob Daten vorhanden und ein Array sind
            if (data && Array.isArray(data)) {
                data.forEach(row => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-box';
                    commentDiv.style.marginBottom = "20px";
                    commentDiv.innerHTML = `
                        <p><strong>${row[1] || 'Anonymous'}</strong> <small>(${row[0] ? new Date(row[0]).toLocaleDateString() : ''})</small></p>
                        <p>${row[2] || ''}</p>
                        <hr>
                    `;
                    displayArea.appendChild(commentDiv);
                });
            }
        })
        .catch(error => console.error('Fehler beim Laden der Kommentare:', error));
}

// --- INTERAKTIVES ARBEITSBLATT AUSWERTUNG (Alle 10 Aufgaben) ---
function checkAnswers() {
    let score = 0;
    let totalQuestions = 10;
    
    // Alle richtigen Lösungen definieren (Kurzformen & Langformen erlaubt)
    const solutions = {
        q1: ["does"],
        q2: ["did"],
        q3: ["didn't", "did not"],
        q4: ["does"],
        q5: ["doesn't", "does not"],
        q6: ["did"],
        q7: ["didn't", "did not"],
        q8: ["does"],
        q9: ["did"],
        q10: ["don't", "do not"]
    };

    // Schleife durch alle 10 Fragen
    for (let i = 1; i <= totalQuestions; i++) {
        let inputElement = document.getElementById('q' + i);
        if (inputElement) {
            let userAnswer = inputElement.value.trim().toLowerCase();
            
            // Prüfen, ob die Antwort in der Lösungsliste existiert
            if (solutions['q' + i].includes(userAnswer)) {
                score++;
                inputElement.style.borderColor = "green"; // Visuelles Feedback für richtig
            } else {
                inputElement.style.borderColor = "red";   // Visuelles Feedback für falsch
            }
        }
    }

    // Gesamtergebnis anzeigen
    let resultElement = document.getElementById('result-message');
    if (resultElement) {
        if (score === totalQuestions) {
            resultElement.style.color = "green";
            resultElement.innerText = `🎉 Perfect! ${score} out of ${totalQuestions} answers are correct. Excellent work!`;
        } else {
            resultElement.style.color = "#c0392b";
            resultElement.innerText = `❌ You got ${score} out of ${totalQuestions} correct. Check the red boxes and try again!`;
        }
    }
}

