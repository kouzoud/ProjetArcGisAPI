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
        title: "Limites des Communes",
        popupTemplate: { title: "{Nom}", content: "Superficie: {Shape_Area} m²" }
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


    const populationRenderer = {
        type: "simple",
        symbol: {
            type: "simple-marker",
            color: "red", // Rouge pour la population
            outline: { width: 0.5, color: "white" },
            size: 8
        }
    };
    
    const hotelsRenderer = {
        type: "simple",
        symbol: {
            type: "simple-marker",
            color: "blue", // Bleu pour les hôtels
            outline: { width: 0.5, color: "white" },
            size: 10
        }
    };
    
    const grandesSurfacesRenderer = {
        type: "simple",
        symbol: {
            type: "simple-marker",
            color: "green", // Vert pour les grandes surfaces
            outline: { width: 0.5, color: "white" },
            size: 12
        }
    };
    
    // Appliquer les renderers aux couches
    populationLayer.renderer = populationRenderer;
    hotelsLayer.renderer = hotelsRenderer;
    grandesSurfacesLayer.renderer = grandesSurfacesRenderer;
    


});
