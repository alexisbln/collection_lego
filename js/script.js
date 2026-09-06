// local storage for the lego collection
let memoireLegos = [];

document.getElementById('btnCharger').addEventListener('click', chargerDonnees);
chargerDonnees();

// retrieve data from the API and store it in memoireLegos
function chargerDonnees() {
    document.getElementById('resultat').innerHTML = "<p>⏳ Chargement de la collection en cours...</p>";
    console.log("Chargement en cours...");

    fetch('php/api.php')
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(donnees => {
            memoireLegos = donnees;
            console.log("Données reçues :", memoireLegos);
            mettreAJourAffichage();
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('resultat').innerHTML = "<p style='color:red'>Erreur de chargement.</p>";
        });
}

    // Écouteurs d'événements (recherche, tri, filtres)
document.getElementById('recherche').addEventListener('input', mettreAJourAffichage);
document.getElementById('tri').addEventListener('change', mettreAJourAffichage);

const checkboxPossede = document.getElementById('filtrePossede');
const checkboxManquant = document.getElementById('filtreNoPossede');

// exclusive checkboxes: if one is checked, the other is unchecked
checkboxPossede.addEventListener('change', function () {
    if (this.checked) {
        checkboxManquant.checked = false;
    }
    mettreAJourAffichage();
});

checkboxManquant.addEventListener('change', function () {
    if (this.checked) {
        checkboxPossede.checked = false;
    }
    mettreAJourAffichage();
});

// filtre and sort the data before the display
function mettreAJourAffichage() {
    let listeFinale = [...memoireLegos];

    // filtre by search text
    const texte = document.getElementById('recherche').value.toLowerCase();
    if (texte.length > 0) {
        listeFinale = listeFinale.filter(lego => {
            const nomLego = (lego.nom || "").toString().toLowerCase();
            const refLego = (lego.reference || "").toString().toLowerCase();
            return nomLego.includes(texte) || refLego.includes(texte);
        });
    }

    // filtre by possession status
    const seulementPossede = checkboxPossede.checked;
    const NoPossede = checkboxManquant.checked;

    if (seulementPossede) {
        listeFinale = listeFinale.filter(lego => lego.possede == true || lego.possede == 1);
    } else if (NoPossede) {
        listeFinale = listeFinale.filter(lego => !(lego.possede == true || lego.possede == 1));
    }

    // sort the results
    const typeTri = document.getElementById('tri').value;
    if (typeTri === 'prix_croissant') {
        listeFinale.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix));
    }
    else if (typeTri === 'annee_asc') {
        listeFinale.sort((a, b) => parseFloat(a.annee) - parseFloat(b.annee));
    }
    else if (typeTri === 'annee_desc') {
        listeFinale.sort((a, b) => parseFloat(b.annee) - parseFloat(a.annee));
    }
    else if (typeTri === 'prix_decroissant') {
        listeFinale.sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix));
    }
    else if (typeTri === 'nom_az') {
        listeFinale.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    genererHTML(listeFinale);
}

// generate the HTML for the lego cards
function genererHTML(liste) {
    const zoneResultat = document.getElementById('resultat');

    if (liste.length === 0) {
        zoneResultat.innerHTML = "<p>Aucun Lego ne correspond à vos critères.</p>";
        return;
    }

    let html = '';
    for (const lego of liste) {
        const textePossede = (lego.possede == 1 || lego.possede == true)
            ? '<span class="badge badge-possede">✅ Possédé</span>'
            : '<span class="badge badge-manquant">❌ Manquant</span>';

        const urlImage = `https://images.brickset.com/sets/images/${lego.reference}-1.jpg`;
        const imageParDefaut = "https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Pas+d'image";

        html += `
            <div class="lego-card">
                <div class="card-image-container">
                    <img src="${urlImage}" alt="${lego.nom}" class="lego-image" onerror="this.src='${imageParDefaut}'">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="lego-titre">${lego.nom}</h3>
                        <span class="lego-ref">#${lego.reference}</span>
                    </div>
                    
                    <div class="card-details">
                        <span class="lego-annee">📅 ${lego.annee}</span>
                        ${textePossede}
                    </div>
                    
                    <div class="card-footer">
                        <span class="lego-prix">${lego.prix} €</span>
                    </div>
                </div>
            </div>
        `;
    }

    zoneResultat.innerHTML = html;
}