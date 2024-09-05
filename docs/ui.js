//affichage des règles
const rules = document.getElementById('rules');
document.getElementById('rulesButton').onclick = () => {
    document.getElementById('stoneCanvas').style.display = 'none';
    document.getElementById('boardCanvas').style.display = 'none';
    rules.style.display = 'block';
};

document.getElementById('backButton').onclick = () => {
    rules.style.display = 'none';
    document.getElementById('stoneCanvas').style.display = 'block';
    document.getElementById('boardCanvas').style.display = 'block';
};





// Fonction pour mettre à jour le texte du bouton en fonction du mode
function updateButtonText() {
    const toggleButton = document.getElementById('Bouton_mode_couleur');
    // Vérifie si le mode sombre est actif
    if (document.body.classList.contains('mode-sombre')) {
        toggleButton.textContent = 'Mode clair';
    } else {
        toggleButton.textContent = 'Mode sombre';
    }
}

// Ajouter un écouteur d'événements pour le bouton de bascule
document.getElementById('Bouton_mode_couleur').addEventListener('click', function() {
    // Inverser la classe et mettre à jour le texte du bouton
    document.body.classList.toggle('mode-sombre');
    updateButtonText();
});

// Aligner le mode couleur du cite avec celui du navigateur
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('mode-sombre');
} else {
    document.body.classList.remove('mode-sombre');
};

// Mettre à jour le texte du bouton lors du chargement de la page
updateButtonText();