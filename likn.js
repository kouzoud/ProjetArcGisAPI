require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Legend",
    "esri/widgets/Search",
    "esri/widgets/ScaleBar",
    "esri/widgets/Measurement"
], function (
    esriConfig, Map, MapView, FeatureLayer, BasemapToggle, Legend, Search, ScaleBar, Measurement
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

    const voirieLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/voirie_casa_1/FeatureServer",
        title: "Réseau Routier",
        popupTemplate: { title: "Route: {Nom}", content: "Type: {Type}" }
    });

    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/casa_population1/FeatureServer",
        title: "Population",
        popupTemplate: { title: "Commune: {Nom}", content: "Population: {Population}" }
    });

    const hotelsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/Hotels_wgs/FeatureServer",
        title: "Hôtels",
        popupTemplate: { title: "{Nom}", content: "Étoiles: {Etoiles}" }
    });

    const grandesSurfacesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/Grande_surface_wgs/FeatureServer",
        title: "Grandes Surfaces",
        popupTemplate: { title: "{Nom}", content: "Adresse: {Adresse}" }
    });

    const formationLayer = new FeatureLayer({
        url: "URL_DE_TA_COUCHE_FORMATION",
        title: "Centres de Formation",
        popupTemplate: { title: "{Nom}", content: "Spécialité: {Specialite}" }
    });

    // Ajout des couches à la carte
    map.addMany([communesLayer, voirieLayer, populationLayer, hotelsLayer, grandesSurfacesLayer, formationLayer]);

    // Ajout du widget de changement de fond de carte
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "topo-vector"
    });
    view.ui.add(basemapToggle, "bottom-right");

    // Ajout du widget de légende
    const legend = new Legend({ view: view });
    view.ui.add(legend, "bottom-left");

    // Ajout du widget de recherche
    const search = new Search({ view: view });
    view.ui.add(search, "top-right");

    // Ajout de l'échelle
    const scaleBar = new ScaleBar({ view: view });
    view.ui.add(scaleBar, "bottom-left");

    // Ajout de l'outil de mesure
    const measurement = new Measurement({ view: view });
    view.ui.add(measurement, "top-left");


  
// Renderer pour la population 2004 (utilise le champ TOTAL2004)
const populationRenderer2004 = {
    type: "class-breaks", 
    field: "TOTAL2004",
    classBreakInfos: [
        { minValue: 0, maxValue: 50000, symbol: createPopulationSymbol("#FFFFCC", 8), label: "< 50k" },
        { minValue: 50001, maxValue: 100000, symbol: createPopulationSymbol("#A1DAB4", 12), label: "50k-100k" },
        { minValue: 100001, maxValue: 200000, symbol: createPopulationSymbol("#41B6C4", 16), label: "100k-200k" },
        { minValue: 200001, maxValue: 300000, symbol: createPopulationSymbol("#2C7FB8", 20), label: "200k-300k" },
        { minValue: 300001, maxValue: 500000, symbol: createPopulationSymbol("#253494", 24), label: "> 300k" }
    ],
    visualVariables: [{
        type: "size",
        field: "TOTAL2004",
        minSize: 8,
        maxSize: 24
    }]
};

// Renderer pour la population 1994 (utilise le champ TOTALIZER)
const populationRenderer1994 = {
    type: "class-breaks", 
    field: "TOTALIZER",
    classBreakInfos: [
        { minValue: 0, maxValue: 50000, symbol: createPopulationSymbol("#F7FCB9", 8), label: "< 50k" },
        { minValue: 50001, maxValue: 100000, symbol: createPopulationSymbol("#ADDD8E", 12), label: "50k-100k" },
        { minValue: 100001, maxValue: 150000, symbol: createPopulationSymbol("#41AB5D", 16), label: "100k-150k" },
        { minValue: 150001, maxValue: 250000, symbol: createPopulationSymbol("#006837", 20), label: "150k-250k" },
        { minValue: 250001, maxValue: 500000, symbol: createPopulationSymbol("#004529", 24), label: "> 250k" }
    ]
};

// Diagramme pour comparer populations marocaines/étrangères (2004)
const chartRenderer = {
    type: "pie-chart",
    attributes: [
        { field: "MAROCAINL1", label: "Marocains 2004", color: "#1f77b4" },
        { field: "ETRANGER_1", label: "Étrangers 2004", color: "#ff7f0e" },
        { field: "MAROCAINS", label: "Marocains 1994", color: "#2ca02c" },
        { field: "ETRANGERS", label: "Étrangers 1994", color: "#d62728" }
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

// Configuration du popup pour afficher toutes les infos
populationLayer.popupTemplate = {
    title: "{PRÉFECTURE} - {ABRONDISSE}",
    content: [{
        type: "fields",
        fieldInfos: [
            { fieldName: "MAROCAINS", label: "Marocains (1994)" },
            { fieldName: "ETRANGERS", label: "Étrangers (1994)" },
            { fieldName: "TOTALIZER", label: "Total (1994)" },
            { fieldName: "MAROCAINL1", label: "Marocains (2004)" },
            { fieldName: "ETRANGER_1", label: "Étrangers (2004)" },
            { fieldName: "TOTAL2004", label: "Total (2004)" },
            { fieldName: "MÉNAGES199", label: "Ménages (1994)" },
            { fieldName: "MÉNAGE", label: "Ménages (2004)" }
        ]
    }, {
        type: "media",
        mediaInfos: [{
            type: "column-chart",
            caption: "Évolution population",
            value: {
                fields: ["TOTALIZER", "TOTAL2004"],
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
        case "etrangers":
            // Option supplémentaire pour visualiser les étrangers
            populationLayer.renderer = createEtrangersRenderer();
            break;
    }
});

// Renderer supplémentaire pour les étrangers
function createEtrangersRenderer() {
    return {
        type: "class-breaks",
        field: "ETRANGER_1",
        classBreakInfos: [
            { minValue: 0, maxValue: 50, symbol: createPopulationSymbol("#fee5d9", 8) },
            { minValue: 51, maxValue: 200, symbol: createPopulationSymbol("#fcae91", 12) },
            { minValue: 201, maxValue: 500, symbol: createPopulationSymbol("#fb6a4a", 16) },
            { minValue: 501, maxValue: 1000, symbol: createPopulationSymbol("#de2d26", 20) },
            { minValue: 1001, maxValue: 5000, symbol: createPopulationSymbol("#a50f15", 24) }
        ]
    };
}

// Renderer pour les Hôtels (par catégorie d'étoiles)
const hotelsRenderer = {
    type: "unique-value",  // Utilisation d'un renderer par valeur unique
    field: "Etoiles",     // Champ contenant le nombre d'étoiles
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
    


//     // Renderer pour les communes avec classification par surface
// const communesRenderer = {
//     type: "class-breaks",
//     field: "Shape_Area", // Champ contenant la surface
//     classBreakInfos: [
//         { minValue: 0, maxValue: 1000000, symbol: createCommuneSymbol("#FFEDA0") },
//         { minValue: 1000001, maxValue: 5000000, symbol: createCommuneSymbol("#FEB24C") },
//         { minValue: 5000001, maxValue: 10000000, symbol: createCommuneSymbol("#FC4E2A") },
//         { minValue: 10000001, maxValue: 20000000, symbol: createCommuneSymbol("#E31A1C") },
//         { minValue: 20000001, maxValue: 50000000, symbol: createCommuneSymbol("#800026") }
//     ]
// };

// function createCommuneSymbol(color) {
//     return {
//         type: "simple-fill",
//         color: color,
//         outline: { width: 0.5, color: "white" }
//     };
// }

// communesLayer.renderer = communesRenderer;

// // Widget pour filtrer par préfecture/commune
// const communeFilter = new FeatureFilter({
//     where: "1=1" // Filtre initial (tout visible)
// });

// communesLayer.filter = communeFilter;

// // Interface utilisateur pour le filtrage
// document.getElementById("filter-commune").addEventListener("change", (event) => {
//     const selectedValue = event.target.value;
//     if (selectedValue === "all") {
//         communesLayer.filter = new FeatureFilter({ where: "1=1" });
//     } else {
//         communesLayer.filter = new FeatureFilter({ where: `Nom = '${selectedValue}'` });
//     }
// });

 // Création de la couche des communes avec popup configuré
//  const communesLayer = new FeatureLayer({
//     url: "https://services5.arcgis.com/DTmDw8OIW4lL7tqb/arcgis/rest/services/Communes/FeatureServer",
//     title: "Communes de Casablanca",
//     outFields: ["*"],
//     popupTemplate: {
//         title: "{COMMUNE_AR}",
//         content: [{
//             type: "fields",
//             fieldInfos: [
//                 { fieldName: "PRÉFECTURE", label: "Préfecture" },
//                 { fieldName: "COMMUNE_AR", label: "Commune/Arrondissement" },
//                 { fieldName: "PLAN_AMENA", label: "Plan d'aménagement" },
//                 { fieldName: "Shape_Area", label: "Surface (m²)", format: { digitSeparator: true } }
//             ]
//         }]
//     }
// });



// 1. SYMBOLOGIE PAR SURFACE (5 classes)
const surfaceRenderer = new ClassBreaksRenderer({
    field: "Shape_Area",
    classBreakInfos: [
        {
            minValue: 0,
            maxValue: 1000000,
            symbol: new SimpleFillSymbol({
                color: [255, 237, 160, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "< 1 km²"
        },
        {
            minValue: 1000001,
            maxValue: 5000000,
            symbol: new SimpleFillSymbol({
                color: [254, 178, 76, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "1-5 km²"
        },
        {
            minValue: 5000001,
            maxValue: 10000000,
            symbol: new SimpleFillSymbol({
                color: [253, 141, 60, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "5-10 km²"
        },
        {
            minValue: 10000001,
            maxValue: 20000000,
            symbol: new SimpleFillSymbol({
                color: [227, 26, 28, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "10-20 km²"
        },
        {
            minValue: 20000001,
            maxValue: 50000000,
            symbol: new SimpleFillSymbol({
                color: [128, 0, 38, 0.8],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "> 20 km²"
        }
    ]
});

// 2. SYMBOLOGIE PAR PRÉFECTURE
const prefectureRenderer = new UniqueValueRenderer({
    field: "PRÉFECTURE",
    defaultSymbol: new SimpleFillSymbol({
        color: [200, 200, 200, 0.7],
        outline: new SimpleLineSymbol({ color: "white", width: 1 })
    }),
    uniqueValueInfos: [
        {
            value: "PRÉFECTURE DE CASABLANCA",
            symbol: new SimpleFillSymbol({
                color: [31, 120, 180, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Préf. Casablanca"
        },
        {
            value: "PROVINCE DE MESQUOIER",
            symbol: new SimpleFillSymbol({
                color: [178, 223, 138, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Prov. Mesquoier"
        }
        // Ajouter d'autres préfectures au besoin
    ]
});

// 3. SYMBOLOGIE PAR COMMUNE/ARRONDISSEMENT
const communeRenderer = new UniqueValueRenderer({
    field: "COMMUNE_AR",
    defaultSymbol: new SimpleFillSymbol({
        color: [200, 200, 200, 0.7],
        outline: new SimpleLineSymbol({ color: "white", width: 1 })
    }),
    uniqueValueInfos: [
        {
            value: "ARRONDISSEMENT BEN M'SICK",
            symbol: new SimpleFillSymbol({
                color: [255, 127, 0, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Ben M'Sick"
        },
        {
            value: "ARRONDISSEMENT EL FIDA",
            symbol: new SimpleFillSymbol({
                color: [227, 26, 28, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "El Fida"
        },
        {
            value: "ARRONDISSEMENT SIDI OTHMANE",
            symbol: new SimpleFillSymbol({
                color: [254, 217, 118, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Sidi Othmane"
        },
        {
            value: "COMMUNE DU MECHOUAR",
            symbol: new SimpleFillSymbol({
                color: [253, 141, 60, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mechouar"
        },
        {
            value: "ARRONDISSEMENT MERS SULTAN",
            symbol: new SimpleFillSymbol({
                color: [252, 78, 42, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Mers Sultan"
        },
        {
            value: "ARRONDISSEMENT MAARIF",
            symbol: new SimpleFillSymbol({
                color: [177, 0, 38, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Maarif"
        },
        {
            value: "ARRONDISSEMENT HAY MOHAMMADI",
            symbol: new SimpleFillSymbol({
                color: [102, 194, 165, 0.7],
                outline: new SimpleLineSymbol({ color: "white", width: 1 })
            }),
            label: "Hay Mohammadi"
        }
        // Ajouter d'autres communes/arrondissements au besoin
    ]
});

// Widget de légende

view.ui.add(legend, "bottom-left");

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
