mapboxgl.accessToken = 'pk.eyJ1IjoiaGJyLXByb250byIsImEiOiJjamM2YnJhczYxZHU2MnhtbXBoeXZyNWM4In0.L0_kvOmX0P--xUZNMw5z5Q';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 2,
    center: [4.899, 52.372]
});

const createAlertIcon = (alert) => {
    const el = document.createElement('div');
    el.className = 'alert-marker';

    return el;
}

const createAlertMarker = (alert) => {
    var marker = new mapboxgl.Marker(createAlertIcon(alert))
        .setLngLat(alert.geometry.coordinates)
        .addTo(map);    
}