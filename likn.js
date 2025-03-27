require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Search",
    "esri/widgets/ScaleBar",
    "esri/widgets/Measurement",
    "esri/widgets/BasemapGallery",
    "esri/layers/support/FeatureFilter",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/Graphic",
    "esri/renderers/ClassBreaksRenderer",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Zoom"
], function (
    esriConfig, Map, MapView, FeatureLayer, Legend, Search, ScaleBar, Measurement,
    BasemapGallery, FeatureFilter, SketchViewModel, Graphic,
    ClassBreaksRenderer, UniqueValueRenderer,
    SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,GraphicsLayer,Zoom
) {

    // Configuration API
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurN34J3_WPSFsW9vUIuPcy4GZi0CcBMEHhocIgCxNtYepWEfA91gWW8tBCOOK2HleXSP0TlNppKpsKLlDmG1zsub4sOasWd_9nBGux6Vnvgr6VoLSFjeELJP-8nsGzb7y630tBdYJepo4u8kCbIFtYQ2_ow5Z5Dt4K4_QrId1MPGpBoz4pG4i0NyWk_82ke0O-Kv58vfImVwkJm8vVNYveQSoSFjQFwpyyjO8A4anfzH8AT1_70gzuQoU";

    // Création de la carte
    const map = new Map({
        basemap: "satellite"  // Fond de carte par défaut
    });

    // Création de la vue de la carte
    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-7.569, 33.573], // Casablanca
        zoom: 11
    });

 // Initialisation du zoom après que la vue soit prête
 view.when(function() {
    const zoom = new Zoom({
        view: view
    });
    
    // Ajout avec positionnement personnalisé
    view.ui.add(zoom, {
        position: "top-left",
        index: 100
    });

    // Ajustement CSS pour le positionnement sous la navbar
    const zoomContainer = document.querySelector(".esri-zoom");
    if (zoomContainer) {
        zoomContainer.style.top = "100px"; // Ajustez selon la hauteur de votre navbar
        zoomContainer.style.left = "15px";
        zoomContainer.style.zIndex = "1000";
    }
});
    
    // Widget pour changer les fonds de carte avec plus d'options
const basemapGallery = new BasemapGallery({
    view: view,
    container: "basemap-gallery"
});
view.ui.add(basemapGallery, {
    position: "centre"
});

 // Gestion du bouton pour afficher/masquer le basemap-gallery
 document.getElementById("toggleBasemap").addEventListener("click", function () {
    const basemapDiv = document.getElementById("basemap-gallery");
    basemapDiv.classList.toggle("hidden"); // Active/Désactive l'affichage
});

    // Ajout des couches
    const communesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/Communes/FeatureServer",
        title: "Communes de Casablanca",
        outFields: ["*"],
        popupTemplate: {
            title: "{COMMUNE_AR}",
            content: [{
                type: "fields",
                fieldInfos: [
                    { fieldName: "PRÉFECTURE", label: "Préfecture" },
                    { fieldName: "COMMUNE_AR", label: "Commune/Arrondissement" },
                    { fieldName: "PLAN_AMENA", label: "Plan d'aménagement" },
                    { fieldName: "Shape_Area", label: "Surface (m²)", format: { digitSeparator: true } }
                ]
            }]
        }
    });

    
    

    // Symbologie des communes
    const communesRenderer = {
        type: "class-breaks",
        field: "numero",
        classBreakInfos: [
            { minValue: 0, maxValue: 10, symbol: createCommuneSymbol("#FFEDA0") },
            { minValue: 11, maxValue: 15, symbol: createCommuneSymbol("#FEB24C") },
            { minValue: 16, maxValue: 21, symbol: createCommuneSymbol("#FC4E2A") },
            { minValue: 22, maxValue: 28, symbol: createCommuneSymbol("#E31A1C") },
            { minValue: 29, maxValue: 35, symbol: createCommuneSymbol("#800026") }
        ]
    };

    function createCommuneSymbol(color) {
        return {
            type: "simple-fill",
            color: color,
            outline: { width: 0.5, color: "white" }
        };
    }

    communesLayer.renderer = communesRenderer;

    const voirieLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/voirie_casa_1/FeatureServer",
        title: "Réseau Routier",
        outFields: ["*"], // Charger tous les champs pour le popup
        popupTemplate: {
            title: "Route: {Nom}",
            content: [{
                type: "fields",
                fieldInfos: [
                    { fieldName: "NOM", label: "Nom de la route" },
                    { fieldName: "LENGTH", label: "Longueur (m)", format: { digitSeparator: true, places: 2 } }
                ]
            }]
        }
    });
    

    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/casa_population1/FeatureServer",
        title: "Population",
        outFields: ["*"], // Charger tous les champs pour le popup
        popupTemplate: {
            title: "Commune: {COMMUNE_AR}",
            content: [{
                type: "fields",
                fieldInfos: [
                    { fieldName: "COMMUNE_AR", label: "Commune" },
                    { fieldName: "PRÉFECTURE", label: "Préfecture" },
                    { fieldName: "Population", label: "Population", format: { digitSeparator: true } },
                    { fieldName: "Densité", label: "Densité (hab/km²)", format: { digitSeparator: true, places: 2 } }
                ]
            }]
        }
    });
    

    const hotelsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/Hotels_wgs/FeatureServer",
        title: "Hôtels de Casablanca",
        outFields: ["*"], // Charger tous les champs pour le popup
        popupTemplate: {
            title: "{HOTEL}",
            content: [{
                type: "fields",
                fieldInfos: [
                    { fieldName: "HOTEL", label: "Nom de l'hôtel" },
                    { fieldName: "CATÉGORIE", label: "Catégorie" },
                    { fieldName: "ADRESSE", label: "Adresse" },
                    { fieldName: "PHONE1", label: "Téléphone" },
                    { fieldName: "CAP_CHAMBR", label: "Capacité des chambres" },
                    
                ]
            }]
        }
    });
    
    const grandesSurfacesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/Grande_surface_wgs/FeatureServer",
        title: "Grandes Surfaces",
        popupTemplate: {
            title:"{Grand Surface}",
        content: [{
            type: "fields",
            fieldInfos: [
                { fieldName: "Id", label: "ID" },
                { fieldName: "Adresse", label: "Adresse" },
                { fieldName: "Type", label: "Type" },
                
            ]
        }]
    }
    });

    const formationLayer = new FeatureLayer({
        url: "URL_DE_TA_COUCHE_FORMATION",
        title: "Centres de Formation",
        popupTemplate: { title: "{Nom}", content: "Spécialité: {Specialite}" }
    });
   


    // Couche des réclamations
    const reclamationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/Reclamation_wgs/FeatureServer",
        outFields: ["*"],
        elevationInfo: { mode: "relative-to-ground", offset: 10 },
        popupTemplate: {
          title: "{objet}",
          content: [
            {
              type: "text",
              text: "Message: {Message}"
            },
            {
              type: "text",
              text: "Date: {date_creation}"
            }
          ]
        }
      });

      // 2. Ajoutez la couche en dernier pour garantir qu'elle soit au-dessus
map.add(reclamationLayer, map.layers.length);

// Renderer pour les réclamations
reclamationLayer.renderer = {
    type: "simple",
    symbol: {
        type: "simple-marker",
        style: "circle",
        color: "black",
        size: 8,
        outline: {
            color: "white",
            width: 1
        }
    }
};
// 4. Modifiez la couche des communes pour qu'elle soit semi-transparente
communesLayer.opacity = 0.7;

const sketchLayer = new GraphicsLayer();
map.add(sketchLayer);

// Initialisation de l'outil de dessin pour ajouter une réclamation
let reclamationPoint = null;
const sketchVM = new SketchViewModel({
    view: view,
    layer: sketchLayer,  // Changer de layer
    pointSymbol: {
        type: "simple-marker",
        style: "circle",
        color: [0, 0, 255, 0.8], // Bleu avec transparence
        size: 12,
        outline: {
            color: [255, 255, 255, 0.9],
            width: 2
        }}
});


// Gestion des événements pour les boutons
document.getElementById("startReclamation").addEventListener("click", function() {
    sketchVM.create("point");
    document.getElementById("saveReclamation").disabled = false;
});

document.getElementById("saveReclamation").addEventListener("click", saveReclamation);
document.getElementById("viewReclamations").addEventListener("click", showReclamations);
document.getElementById("closeReclamations").addEventListener("click", hideReclamations);

sketchVM.on("create", function(event) {
    if (event.state === "complete") {
        
        
        // Stocker la géométrie du point
        reclamationPoint = event.graphic.geometry;
        
        // Ajouter le nouveau point à la couche temporaire
        sketchLayer.add(new Graphic({
            geometry: reclamationPoint,
            symbol: {
                type: "simple-marker",
                style: "circle",
                color: [0, 0, 255, 0.8],
                size: 12,
                outline: {
                    color: [255, 255, 255, 0.9],
                    width: 2
                }
            }
        }));
        
        view.goTo({
            center: reclamationPoint,
            zoom: 16
        });

        // Activer le bouton d'enregistrement
        document.getElementById("saveReclamation").disabled = false;
    }
});



// Fonction pour enregistrer une réclamation
function saveReclamation() {
    if (!reclamationPoint) {
        alert("Veuillez sélectionner un point sur la carte.");
        return;
    }

    const objet = document.getElementById("reclamationObjet").value.trim();
    const message = document.getElementById("reclamationMessage").value.trim();
    const email = document.getElementById("reclamationEmail").value.trim();

    if (!objet || !message || !email) {
        alert("Veuillez remplir tous les champs du formulaire");
        return;
    }

    const attributes = {
        objet: objet,
        Message: message,
        Mail: email,
        date_creation: new Date().toISOString(),
        Demarche_d: "Nouveau"
    };

    if (!attributes.objet || !attributes.Message || !attributes.Mail) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const graphic = new Graphic({
        geometry: reclamationPoint,
        attributes: attributes,
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "blue",
            size: 8,
            outline: { color: "white", width: 1 }
        }
    });
    sketchLayer.add(graphic);  //  Ajouter le graphique à la couche de dessin
    

    reclamationLayer.applyEdits({ addFeatures: [graphic] })
        .then(() => {
            alert("Réclamation enregistrée avec succès !");
            resetReclamationForm();
        })
        .catch(error => console.error("Erreur lors de l'ajout de la réclamation:", error));
}

// Fonction pour afficher la liste des réclamations
function showReclamations() {
    document.getElementById("reclamationForm").style.display = "none";
    document.getElementById("reclamationList").style.display = "block";
    
    if (!reclamationLayer || !reclamationLayer.loaded) {
        document.getElementById("reclamationsContainer").innerHTML = 
            "<p>Chargement en cours...</p>";
        setTimeout(showReclamations, 500);
        return;
    }

    const query = reclamationLayer.createQuery();
    query.outFields = ["*"];
    query.returnGeometry = true;
    query.where = "1=1";

    reclamationLayer.queryFeatures(query)
        .then(function(results) {
            const container = document.getElementById("reclamationsContainer");
            container.innerHTML = "<h4>Liste des réclamations</h4>";

            if (!results.features || results.features.length === 0) {
                container.innerHTML += "<p>Aucune réclamation trouvée</p>";
                return;
            }

            // Créez un tableau pour un affichage propre
            const table = document.createElement("table");
            table.className = "reclamation-table";
            
            // En-tête du tableau
            const header = table.createTHead();
            const headerRow = header.insertRow();
            headerRow.innerHTML = `
                <th>Objet</th>
                <th>Message</th>
                <th>Email</th>
                <th>Date</th>
                <th>Action</th>
            `;

            // Corps du tableau
            const tbody = table.createTBody();
            
            results.features.forEach((feature) => {
                const row = tbody.insertRow();
                const attr = feature.attributes;
                
                row.innerHTML = `
                    <td>${attr.objet || 'Sans objet'}</td>
                    <td>${attr.Message || ''}</td>
                    <td>${attr.Mail || ''}</td>
                    <td>${attr.date_creation ? new Date(attr.date_creation).toLocaleString() : 'Date inconnue'}</td>
                    <td><button class="esri-button zoom-btn" data-geometry='${JSON.stringify(feature.geometry.toJSON())}'>Localiser</button></td>
                `;
            });

            container.appendChild(table);

            // Gestion des boutons de localisation
            document.querySelectorAll(".zoom-btn").forEach(btn => {
                btn.addEventListener("click", function() {
                    try {
                        const geom = JSON.parse(this.getAttribute("data-geometry"));
                        view.goTo({
                            target: geom,
                            zoom: 16
                        });
                    } catch (e) {
                        console.error("Erreur de localisation:", e);
                    }
                });
            });
        })
        .catch(error => {
            console.error("Erreur:", error);
            document.getElementById("reclamationsContainer").innerHTML = `
                <p class="error">Erreur de chargement</p>
                <p>${error.message}</p>
            `;
        });

        loadReclamations();
}

// Fonction pour masquer la liste des réclamations
function hideReclamations() {
    document.getElementById("reclamationForm").style.display = "block";
    document.getElementById("reclamationList").style.display = "none";
}

// Fonction pour charger les réclamations existantes
function loadReclamations() {
    const query = reclamationLayer.createQuery();
    query.outFields = ["*"]; // Récupère tous les champs
    query.returnGeometry = true;

    reclamationLayer.queryFeatures(query)
        .then(function(results) {
            const container = document.getElementById("reclamationsContainer");
            container.innerHTML = "";

            if (!results.features || results.features.length === 0) {
                container.innerHTML = '<p class="no-data">Aucune réclamation trouvée</p>';
                return;
            }

            // Debug: Affiche la structure des données dans la console
            console.log("Données brutes:", results.features[0].attributes);

            // Crée un conteneur de liste
            const listContainer = document.createElement("div");
            listContainer.className = "reclamation-list-container";

            results.features.forEach((feature) => {
                const attrs = feature.attributes;
                
                // Solution robuste pour trouver le champ objet
                const objet = attrs.objet || attrs.Objet || attrs.OBJET || 
                              attrs.title || attrs.Titre || attrs.object || 
                              'Non spécifié';
                
                // Crée l'élément de réclamation
                const item = document.createElement("div");
                item.className = "reclamation-item";
                item.innerHTML = `
                    <div class="reclamation-header">
                        <h4 class="reclamation-title">${objet}</h4>
                    </div>
                    <div class="reclamation-details">
                        <p><strong>Message:</strong> ${attrs.Message || 'Aucun message'}</p>
                        <p><strong>Statut:</strong> ${attrs.Demarche_d || 'Nouveau'}</p>
                        <p><strong>Email:</strong> ${attrs.Mail || 'Non fourni'}</p>
                        <button class="btn localize-btn" data-geometry='${JSON.stringify(feature.geometry.toJSON())}'>
                            <i class="fas fa-map-marker-alt"></i> Localiser
                        </button>
                    </div>
                `;
                
                listContainer.appendChild(item);
            });

            container.appendChild(listContainer);

            // Gestion des événements de localisation
            document.querySelectorAll(".localize-btn").forEach(btn => {
                btn.addEventListener("click", function() {
                    try {
                        const geom = JSON.parse(this.getAttribute("data-geometry"));
                        view.goTo({
                            center: [geom.x, geom.y],
                            zoom: 16,
                            heading: 0,
                            tilt: 0
                        }).catch(e => console.error("Erreur de navigation:", e));
                    } catch (e) {
                        console.error("Erreur de géométrie:", e);
                    }
                });
            });
        })
        .catch(error => {
            console.error("Erreur de chargement:", error);
            document.getElementById("reclamationsContainer").innerHTML = `
                <div class="error-message">
                    <p>Erreur lors du chargement des réclamations</p>
                    <button class="btn retry-btn">Réessayer</button>
                </div>
            `;
            document.querySelector(".retry-btn").addEventListener("click", loadReclamations);
        });
}

// Nouvelle fonction pour gérer les événements de zoom
function setupZoomHandlers() {
    document.querySelectorAll(".zoom-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            try {
                const geomJson = this.getAttribute("data-geometry");
                if (!geomJson) return;
                
                const geom = JSON.parse(geomJson);
                if (!geom) return;
                
                // Animation de zoom fluide
                view.goTo({
                    target: geom,
                    zoom: 18,  // Zoom plus rapproché
                    heading: 0,
                    tilt: 0
                }, {
                    duration: 1000,  // Durée de l'animation en ms
                    easing: "ease-in-out"
                }).then(() => {
                    // Flash le point pour le mettre en évidence
                    highlightReclamationPoint(geom);
                }).catch(e => {
                    console.error("Erreur navigation:", e);
                    // Fallback si l'animation échoue
                    view.center = [geom.x, geom.y];
                    view.zoom = 18;
                });
            } catch (e) {
                console.error("Erreur géométrie:", e);
            }
        });
    });
}

// Fonction pour mettre en évidence le point
function highlightReclamationPoint(geom) {
    // Supprime tout highlight précédent
    view.graphics.removeAll();
    
    // Ajoute un marqueur temporaire
    const highlightGraphic = new Graphic({
        geometry: {
            type: "point",
            x: geom.x,
            y: geom.y
        },
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: [255, 255, 0, 0.9],  // Jaune fluo
            size: "20px",
            outline: {
                color: [255, 0, 0, 0.8],
                width: 3
            }
        }
    });
    
    view.graphics.add(highlightGraphic);
    
    // Supprime le highlight après 3 secondes
    setTimeout(() => {
        view.graphics.remove(highlightGraphic);
    }, 3000);
}
// Fonction pour réinitialiser le formulaire de réclamation
function resetReclamationForm() {
    document.getElementById("reclamationObjet").value = "";
    document.getElementById("reclamationMessage").value = "";
    document.getElementById("reclamationEmail").value = "";
    document.getElementById("saveReclamation").disabled = true;
    reclamationPoint = null;
}

    // Ajout des couches à la carte
    map.addMany([communesLayer, voirieLayer, populationLayer, hotelsLayer, grandesSurfacesLayer, formationLayer]);
    map.add(reclamationLayer);

   
    

    // Ajout du widget de légende
    const legend = new Legend({ view: view, container: "legendContainer" });
    document.addEventListener("DOMContentLoaded", function () {
        const legendButton = document.getElementById("toggleLegend");
        const legendContainer = document.getElementById("legendContainer");
    
        if (legendButton && legendContainer) {
            legendButton.addEventListener("click", function () {
                console.log("Bouton légende cliqué !"); // Vérification console
                legendContainer.classList.toggle("hidden");
    
                // Vérifie si la légende est affichée ou non
                if (legendContainer.classList.contains("hidden")) {
                    console.log("Légende cachée");
                } else {
                    console.log("Légende affichée");
                }
            });
        } else {
            console.error("Erreur : Bouton ou conteneur légende introuvable !");
        }
    });
    view.ui.add(legend, "bottom-right")
    

    // Ajout du widget de recherche ArcGIS
const search = new Search({ view: view });
view.ui.add(search, "top-right");

// Sélection des éléments du DOM
const searchInput = document.getElementById("searchInput");
const searchButton = document.querySelector("#searchContainer button");

// Fonction pour lancer la recherche ArcGIS à partir de l'input HTML
searchButton.addEventListener("click", function () {
    if (searchInput.value.trim() !== "") {
        search.search(searchInput.value);
    }
});

// Permettre la recherche en appuyant sur "Entrée"
searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && searchInput.value.trim() !== "") {
        search.search(searchInput.value);
    }
});


    // Ajout de l'échelle
    const scaleBar = new ScaleBar({ view: view });
    view.ui.add(scaleBar, "bottom-left");

    

    // Ajout de l'outil de mesure
   // Initialisation de l'outil de mesure
const measurement = new Measurement({
    view: view,
    container: "measurementContainer",
    activeTool: null,
    unit: "metric",
    linearUnit: "kilometers",
    areaUnit: "hectares",
    mode: "dual" // Permet de mesurer à la fois des distances et des surfaces
});

// État et styles
let isMeasurementActive = false;
const measurementBtn = document.getElementById('measurementBtn');
const measurementStatus = document.getElementById('measurementStatus');

// Fonction pour activer/désactiver la mesure
function toggleMeasurement() {
    isMeasurementActive = !isMeasurementActive;
    
    if (isMeasurementActive) {
        // Activer avec style professionnel
        measurement.activeTool = "area"; // Commencer avec la mesure de surface
        document.getElementById("measurementContainer").style.display = "block";
        
        // Mise à jour de l'UI
        measurementBtn.classList.add("active");
        measurementStatus.textContent = "ACTIF";
        measurementStatus.className = "measurement-status active";
        
        // Ajout d'un tooltip
        measurementBtn.title = "Cliquer pour désactiver la mesure";
    } else {
        // Désactiver proprement
        measurement.activeTool = null;
        measurement.clear();
        document.getElementById("measurementContainer").style.display = "none";
        
        // Mise à jour de l'UI
        measurementBtn.classList.remove("active");
        measurementStatus.textContent = "INACTIF";
        measurementStatus.className = "measurement-status";
        
        // Tooltip
        measurementBtn.title = "Cliquer pour activer la mesure";
    }
}

// Gestion des événements
measurementBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleMeasurement();
});

// Optionnel: Basculer entre distance et surface
document.getElementById('measureDistance').addEventListener('click', () => {
    measurement.activeTool = "distance";
});
document.getElementById('measureArea').addEventListener('click', () => {
    measurement.activeTool = "area";
});



      // Fonctions de filtrage
      function filterHotelsByCategory(category) {
        if (category === "all") {
            hotelsLayer.definitionExpression = "1=1";
        } else {
            hotelsLayer.definitionExpression = `CATÉGORIE = '${category}'`;
        }
    }

    function filterGrandesSurfacesByType(type) {
        if (type === "all") {
            grandesSurfacesLayer.definitionExpression = "1=1";
        } else {
            grandesSurfacesLayer.definitionExpression = `Type = '${type}'`;
        }
    }

    // Écouteurs d'événements pour les filtres
    document.getElementById("hotel-category-filter").addEventListener("change", (event) => {
        filterHotelsByCategory(event.target.value);
    });

    document.getElementById("gs-type-filter").addEventListener("change", (event) => {
        filterGrandesSurfacesByType(event.target.value);
    });

  
// Renderer pour la population 2004 (utilise le champ TOTAL2004)
const populationRenderer2004 = {
    type: "class-breaks", 
    field: "TOTAL2004",
    classBreakInfos: [
        { minValue: 0, maxValue: 67081, symbol: createPopulationSymbol("#FFFFCC", 8), label: "< 68k" },
        { minValue:67082 , maxValue: 130822, symbol: createPopulationSymbol("#A1DAB4", 12), label: "68k-130k" },
        { minValue: 130823 , maxValue: 194563, symbol: createPopulationSymbol("#41B6C4", 16), label: "130k-195k" },
        { minValue: 194564 , maxValue: 258304, symbol: createPopulationSymbol("#2C7FB8", 20), label: "195k-260k" },
        { minValue: 258305 , maxValue: 323944, symbol: createPopulationSymbol("#253494", 24), label: "> 260k" }
    ],
  
};

// Renderer pour la population 1994 (utilise le champ TOTAL1994)
const populationRenderer1994 = {
    type: "class-breaks", 
    field: "TOTAL1994",
    classBreakInfos: [
        { 
            minValue: 0, 
            maxValue: 53056, 
            symbol: createPopulationSymbol("#FFEDA0", 8), 
            label: "< 53k" 
        },
        { 
            minValue: 53057, 
            maxValue: 101157, 
            symbol: createPopulationSymbol("#FEB24C", 12), 
            label: "53k-101k" 
        },
        { 
            minValue: 101158, 
            maxValue: 149258, 
            symbol: createPopulationSymbol("#FD8D3C", 16), 
            label: "101k-150k" 
        },
        { 
            minValue: 149259, 
            maxValue: 197359, 
            symbol: createPopulationSymbol("#FC4E2A", 20), 
            label: "150k-180k" 
        },
        { 
            minValue: 197360, 
            maxValue: 254458, 
            symbol: createPopulationSymbol("#E31A1C", 24), 
            label: "> 180k" 
        }
    ],
    
};

// Diagramme pour comparer populations marocaines/étrangères (2004)
const chartRenderer = {
    type: "pie-chart",
    attributes: [
        { field: "MAROCAIN_1", label: "Marocains 2004", color: "#1f77b4" },
        // { field: "ETRANGER_1", label: "Étrangers 2004", color: "#ff7f0e" },
        { field: "MAROCAINS", label: "Marocains 1994", color: "#2ca02c" },
        // { field: "ETRANGERS", label: "Étrangers 1994", color: "#d62728" }
    ],
    size: 20,
    legendOptions: {
        title: "Répartition population"
    }
};

// Fonction améliorée pour créer des symboles
function createPopulationSymbol(color, size) {
    return {
        type: "simple-marker",
        color: color,
        outline: { width: 0.5, color: "white" },
        size: size
    };
}

// Configuration du POPUP pour afficher toutes les infos
populationLayer.popupTemplate = {
    title: "{PRÉFECTURE} - {ABRONDISSE}",
    content: [{
        type: "fields",
        fieldInfos: [
            { fieldName: "MAROCAINS", label: "Marocains (1994)" },
            { fieldName: "ETRANGERS", label: "Étrangers (1994)" },
            { fieldName: "TOTAL1994", label: "Total (1994)" },
            { fieldName: "MAROCAIN_1", label: "Marocains (2004)" },
            { fieldName: "ETRANGER_1", label: "Étrangers (2004)" },
            { fieldName: "TOTAL2004", label: "Total (2004)" },
            { fieldName: "MÉNAGES199", label: "Ménages (1994)" },
            { fieldName: "MÉNAGES200", label: "Ménages (2004)" }
        ]
    }, {
        type: "media",
        mediaInfos: [{
            type: "column-chart",
            caption: "Évolution population",
            value: {
                fields: ["TOTAL1994", "TOTAL2004"],
                normalizeField: null
            }
        }]
    }]
};

// Gestion des visualisations
document.getElementById("population-view").addEventListener("change", (event) => {
    switch(event.target.value) {
        case "2004":
            populationLayer.renderer = populationRenderer2004;
            break;
        case "1994":
            populationLayer.renderer = populationRenderer1994;
            break;
        case "compare":
            populationLayer.renderer = chartRenderer;
            break;
        // case "etrangers":
        //     // Option supplémentaire pour visualiser les étrangers
        //     populationLayer.renderer = createEtrangersRenderer();
        //     break;
    }
});



// Renderer pour les Hôtels (par catégorie d'étoiles)
const hotelsRenderer = {
    type: "unique-value",  // Utilisation d'un renderer par valeur unique
    field: "HOTEL",     // Champ contenant le nombre d'étoiles
    defaultSymbol: {      // Symbole par défaut
        type: "simple-marker",
        style: "circle",
        color: "red",
        size: 8,
        outline: {
            color: "white",
            width: 1
        }
    },
    
};


// Renderer pour les Grandes Surfaces (par type)
const grandesSurfacesRenderer = {
    type: "unique-value",  // Utilisation d'un renderer par valeur unique
    field: "Type",        // Champ contenant le type de grande surface
    defaultSymbol: {      // Symbole par défaut
        type: "simple-marker",
        style: "circle",
        color: "green",
        size: 10,
        outline: {
            color: "white",
            width: 1
        }
    },
    
};
    
    // Appliquer les renderers aux couches
    populationLayer.renderer = populationRenderer2004;
    hotelsLayer.renderer = hotelsRenderer;
    grandesSurfacesLayer.renderer = grandesSurfacesRenderer;
    

// Widget pour filtrer par préfecture/commune
const communeFilter = new FeatureFilter({
    where: "1=1" // Filtre initial (tout visible)
});

communesLayer.filter = communeFilter;

// Interface utilisateur pour le filtrage
document.getElementById("filter-commune").addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "all") {
        communesLayer.filter = new FeatureFilter({ where: "1=1" });
    } else {
        communesLayer.filter = new FeatureFilter({ where: `COMMUNE_AR = '${selectedValue}'` });
    }
});


// 1. SYMBOLOGIE PAR SURFACE (5 classes)
 surfaceRenderer = new ClassBreaksRenderer({
    field: "Shape__Area",
    classBreakInfos: [
        {
            minValue: 0,
            maxValue: 39346868,
            symbol: new SimpleFillSymbol({
                color: [255, 237, 160, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "< 1 km²"
        },
        {
            minValue: 39346869,
            maxValue: 78058821,
            symbol: new SimpleFillSymbol({
                color: [254, 178, 76, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "1-5 km²"
        },
        {
            minValue: 78058822,
            maxValue: 116770773,
            symbol: new SimpleFillSymbol({
                color: [253, 141, 60, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "5-10 km²"
        },
        {
            minValue: 116770774,
            maxValue: 155482726,
            symbol: new SimpleFillSymbol({
                color: [227, 26, 28, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "10-20 km²"
        },
        {
            minValue: 155482727,
            maxValue: 194194679,
            symbol: new SimpleFillSymbol({
                color: [128, 0, 38, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "> 20 km²"
        }
    ]
});

// 2. SYMBOLOGIE PAR PRÉFECTURE
prefectureRenderer = new UniqueValueRenderer({
    field: "PREFECTURE",
    defaultSymbol: new SimpleFillSymbol({
        color: [200, 200, 200, 0.7],
        outline: new SimpleLineSymbol({ color: "white", width: 1 })
    }),
    uniqueValueInfos: [
        {
            value: "PROVINCE DE MEDIOUNA",
            symbol: new SimpleFillSymbol({
                color: [31, 120, 180, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "PROVINCE DE MEDIOUNA"
        },
        {
            value: "PROVINCE DE BEN SLIMANE",
            symbol: new SimpleFillSymbol({
                color: "red",
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "PROVINCE DE BEN SLIMANE"
        },

        {
            value: "PREFECTURE DE MOHAMMEDIA",
            symbol: new SimpleFillSymbol({
                color: [100, 223, 138, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "PREFECTURE DE MOHAMMEDIA"
        },
        {
            value: "PREFECTURE DE CASABLANCA",
            symbol: new SimpleFillSymbol({
                color: "yellow",
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "PREFECTURE DE CASABLANCA"
        },
        {
            value: "PROVINCE DE NOUACEUR",
            symbol: new SimpleFillSymbol({
                color: "green",
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "PROVINCE DE NOUACEUR"
        }

        // Ajouter d'autres préfectures au besoin
    ]
});

// SYMBOLOGIE PAR COMMUNE/ARRONDISSEMENT AVEC COULEURS UNIQUES
communeRenderer = new UniqueValueRenderer({
    field: "COMMUNE_AR",
    defaultSymbol: new SimpleFillSymbol({
        color: [200, 200, 200, 0.7],
        outline: new SimpleLineSymbol({ color: "white", width: 1 })
    }),
    uniqueValueInfos: [
        {
            value: "ARRONDISSEMENT BEN M'SICK",
            symbol: new SimpleFillSymbol({
                color: [255, 127, 0, 0.7],       // Orange
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Ben M'Sick"
        },
        {
            value: "ARRONDISSEMENT EL FIDA",
            symbol: new SimpleFillSymbol({
                color: [227, 26, 28, 0.7],        // Rouge
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "El Fida"
        },
        {
            value: "ARRONDISSEMENT SIDI OTHMANE",
            symbol: new SimpleFillSymbol({
                color: [254, 217, 118, 0.7],      // Jaune clair
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sidi Othmane"
        },
        {
            value: "COMMUNE DU MECHOUAR",
            symbol: new SimpleFillSymbol({
                color: [253, 141, 60, 0.7],       // Orange foncé
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mechouar"
        },
        {
            value: "ARRONDISSEMENT MERS SULTAN",
            symbol: new SimpleFillSymbol({
                color: [252, 78, 42, 0.7],        // Rouge-orange
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mers Sultan"
        },
        {
            value: "ARRONDISSEMENT MAARIF",
            symbol: new SimpleFillSymbol({
                color: [177, 0, 38, 0.7],         // Bordeaux
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Maarif"
        },
        {
            value: "ARRONDISSEMENT HAY MOHAMMADI",
            symbol: new SimpleFillSymbol({
                color: [102, 194, 165, 0.7],      // Vert menthe
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Hay Mohammadi"
        },
        {
            value: "MUNICIPALITE NOUACEUR",
            symbol: new SimpleFillSymbol({
                color: [166, 206, 227, 0.7],      // Bleu clair
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Nouaceur"
        },
        {
            value: "COMMUNE RURALE OULED SALEH",
            symbol: new SimpleFillSymbol({
                color: [31, 120, 180, 0.7],       // Bleu marine
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Ouled Saleh"
        },
        {
            value: "COMMUNE RURALE OULED AZZOUZ",
            symbol: new SimpleFillSymbol({
                color: [178, 223, 138, 0.7],     // Vert clair
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Ouled Azzouz"
        },
        {
            value: "MUNICIPALITE DAR BOUAZZA",
            symbol: new SimpleFillSymbol({
                color: [51, 160, 44, 0.7],        // Vert foncé
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Dar Bouazza"
        },
        {
            value: "MUNICIPALITE TIT MELLIL",
            symbol: new SimpleFillSymbol({
                color: [251, 154, 153, 0.7],      // Rose
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Tit Mellil"
        },
        {
            value: "MUNICIPALITE AIN HARROUDA",
            symbol: new SimpleFillSymbol({
                color: [227, 26, 28, 0.7],        // Rouge
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Ain Harrouda"
        },
        {
            value: "MUNICIPALITE MANSOURIA",
            symbol: new SimpleFillSymbol({
                color: [253, 191, 111, 0.7],     // Orange pâle
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mansouria"
        },
        {
            value: "MUNICIPALITE BOUSKOURA",
            symbol: new SimpleFillSymbol({
                color: [202, 178, 214, 0.7],      // Lavande
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Bouskoura"
        },
        {
            value: "MUNICIPALITE LAHRAOUIYINE",
            symbol: new SimpleFillSymbol({
                color: [106, 61, 154, 0.7],       // Violet
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Lahraouiyine"
        },
        {
            value: "COMMUNE RURALE MEJJATIA OULED TALEB",
            symbol: new SimpleFillSymbol({
                color: [255, 255, 153, 0.7],      // Jaune vif
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mejjatia Ouled Taleb"
        },
        {
            value: "MUNICIPALITE MEDIOUNA",
            symbol: new SimpleFillSymbol({
                color: [177, 89, 40, 0.7],       // Marron
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mediouna"
        },
        {
            value: "COMMUNE RURALE ECHELLALATE",
            symbol: new SimpleFillSymbol({
                color: [255, 127, 0, 0.7],       // Orange
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Echellalate"
        },
        {
            value: "COMMUNE RURALE SIDI MOUSSA BEN MEJDOUB",
            symbol: new SimpleFillSymbol({
                color: [208, 28, 139, 0.7],       // Rose foncé
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sidi Moussa Ben Mejdoub"
        },
        {
            value: "COMMUNE RURALE BENI YACKLEF",
            symbol: new SimpleFillSymbol({
                color: [158, 188, 218, 0.7],      // Bleu pastel
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Beni Yacklef"
        },
        {
            value: "MUNICIPALITE MOHAMMEDIA",
            symbol: new SimpleFillSymbol({
                color: [140, 86, 75, 0.7],        // Terre cuite
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mohammedia"
        },
        {
            value: "COMMUNE RURALE SIDI HAJJAJ OUED HASSAR",
            symbol: new SimpleFillSymbol({
                color: [127, 201, 127, 0.7],      // Vert pomme
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sidi Hajjaj Oued Hassar"
        },
        {
            value: "COMMUNE RURALE SIDI MOUSSA BEN ALI",
            symbol: new SimpleFillSymbol({
                color: [190, 174, 212, 0.7],      // Lilas
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sidi Moussa Ben Ali"
        },
        {
            value: "ARRONDISSEMENT AIN CHOCK",
            symbol: new SimpleFillSymbol({
                color: [253, 192, 134, 0.7],     // Saumon
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Ain Chock"
        },
        {
            value: "ARRONDISSEMENT HAY HASSANI",
            symbol: new SimpleFillSymbol({
                color: [227, 119, 194, 0.7],      // Rose vif
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Hay Hassani"
        },
        {
            value: "ARRONDISSEMENT ESSOUKHOUR ASSAWDA",
            symbol: new SimpleFillSymbol({
                color: [44, 160, 44, 0.7],        // Vert émeraude
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Essoukhour Assawda"
        },
        {
            value: "ARRONDISSEMENT AIN SEBAA",
            symbol: new SimpleFillSymbol({
                color: [214, 39, 40, 0.7],        // Rouge vif
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Ain Sebaa"
        },
        {
            value: "ARRONDISSEMENT SBATA",
            symbol: new SimpleFillSymbol({
                color: [148, 103, 189, 0.7],      // Violet moyen
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sbata"
        },
        {
            value: "ARRONDISSEMENT SIDI MOUMEN",
            symbol: new SimpleFillSymbol({
                color: [247, 182, 210, 0.7],      // Rose pâle
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sidi Moumen"
        },
        {
            value: "ARRONDISSEMENT SIDI BERNOUSSI",
            symbol: new SimpleFillSymbol({
                color: [197, 176, 213, 0.7],      // Lavande claire
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sidi Bernoussi"
        }
    ]
});

 // Gestion du filtrage des communes
 document.getElementById("filter-commune").addEventListener("change", (event) => {
    

    const selectedValue = event.target.value;

    if (selectedValue === "surface") {
        communesLayer.renderer = surfaceRenderer;
    } else if (selectedValue === "prefecture") {
        communesLayer.renderer = prefectureRenderer;
    } else if (selectedValue === "commune") {
        communesLayer.renderer = communeRenderer;
    }

    //Rafraîchir l'affichage
    communesLayer.refresh();
});


// Interface utilisateur pour changer les renderers
view.ui.add(document.getElementById("symbology-controls"), "top-right");

// Gestion des changements de renderer
document.getElementById("renderer-type").addEventListener("change", function(e) {
    switch(e.target.value) {
        case "surface":
            communesLayer.renderer = surfaceRenderer;
            break;
        case "prefecture":
            communesLayer.renderer = prefectureRenderer;
            break;
        case "commune":
            communesLayer.renderer = communeRenderer;
            break;
    }
});

// Initialisation
view.when(() => {
    // Appliquer le renderer par surface par défaut
    communesLayer.renderer = surfaceRenderer;
});





});
