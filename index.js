mapboxgl.accessToken = 'pk.eyJ1IjoibW96YXJ0ZGluaXoiLCJhIjoiY2plcGM0dmZ1NDU5NTJ4cGsyZzU0ZjRxMSJ9.Sl2UvJgY-LMS1rd0NDX5PQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 2,
    center: [4.899, 52.372]
});

map.addControl(new mapboxgl.NavigationControl());

const clusterRadius = 20;
const clusterMaxZoom = 20;

const cluster = supercluster({
    radius: clusterRadius,
    maxZoom: clusterMaxZoom
});

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    offset: {
        bottom: [0, -20],
        top: [0, 20]
    }
});

const customClusters = [];

const clusterStyle = {
    'circle-color': '#001F4B',
    'circle-radius': 18
};

const shipsToGeoJSON = (ships) => {
    return {
        type: 'FeatureCollection',
        features: ships.map((ship) => ({
            type: 'Feature',
            properties: {
                name: ship.name,
                shortName: (ship.name) ? ship.name.split(' ').map((item) => item.slice(0, 2)).join('') : '',
                lat_y: ship.location.latitude,
                long_x: ship.location.longitude,
                rotation: ship.trueHeading,
                eta: ship.eta,
                fakeNextDestination: 'ECT DDE',
            },
            geometry: {
                type: 'Point',
                coordinates: ship.location.coordinates,
            }
        })),
    };
}

const updateMarkers = () => {
    const worldBounds = [-180.0000, -90.0000, 180.0000, 90.0000];
    const currentZoom = map.getZoom();
    const notClusters = cluster.getClusters(worldBounds, Math.floor(currentZoom))
        .filter((feature) => !feature.properties.cluster);

    const clusterData = turf.featureCollection(notClusters);

    customClusters.forEach(markerObj => markerObj.remove());

    while (customClusters.length > 0) {
        customClusters.pop();
    }

    clusterData.features.forEach((feature) => {
        const { ship, label } = createShip(feature, map);

        customClusters.push(ship);
        customClusters.push(label);
    });
};

const initmap = (ships) => {
    map.addSource('clusters', {
        type: 'geojson',
        data: ships,
        buffer: 1,
        maxzoom: 22,
        cluster: true,
        clusterMaxZoom: clusterMaxZoom,
        clusterRadius: clusterRadius,
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'clusters',
        filter: ['has', 'point_count'],
        paint: clusterStyle,
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'clusters',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
        },
        paint: {
            'text-color': '#FFFFFF',
        }
    });

    map.on('click', (e) => {
        toggleShipDetailPanel();
        fitToBounds(map, e);
    });

    map.on('mousemove', (e) => showClusterLabel(e, map, popup, cluster));

    map.on('zoom', (e) => {
        popup.remove();
        updateMarkers();
    });
}

fetch('ships.json')
    .then((response) => response.json())
    .then((data) => {
        const ships = shipsToGeoJSON(data);
        cluster.load(ships.features);
        initmap(ships);
    });
