document.addEventListener('DOMContentLoaded', () => {
    // Alle Navigations-Buttons auswählen
    const navButtons = document.querySelectorAll('nav button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Die ID der Ziel-Sektion aus dem data-section Attribut holen
            const sectionId = button.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                // Sanft zur Ziel-Sektion gleiten
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
});