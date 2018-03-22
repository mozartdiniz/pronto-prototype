let timer;
let currentIndex = 0;
let maxSize = 0;
let alerts = [];

const updateAlertDetails = (alert) => {
    const shipName = document.querySelector('.value.ship-name');
    const berthName = document.querySelector('.value.berth');
    const alertTitle = document.querySelector('.alert-title');
    const alertDescription = document.querySelector('.alert-text');

    shipName.innerHTML = alert.properties.name;
    berthName.innerHTML = alert.properties.berth;
    alertTitle.innerHTML = alert.properties.message;
    alertDescription.innerHTML = alert.properties.description;
}

const focusOnAlert = (alert) => {
    map.flyTo({
        center: alert.geometry.coordinates,
        zoom: 14,
        screenSpeed: 1
    });
}

const getCoordinates = (alerts) => {
    return getMinMax(sortCoordinates(alerts.map((alert) => {
        return alert.geometry.coordinates;
    })))
}

const consumeAlerts = () => {
    focusOnAlert(alerts[currentIndex]);
    updateAlertDetails(alerts[currentIndex]);

    if (currentIndex === maxSize - 1) {
        map.fitBounds(getCoordinates(alerts), {
            padding : {
                top: 80,
                right: 80,
                bottom: 80,
                left: 80
            },
            speed: 2
        });
        currentIndex = 0;
    } else {
        currentIndex++;
    }
}

const populateMap = (alerts) => {
    alerts.forEach((alert) => {
        createAlertMarker(alert);
    });
}

const getFormattedDate = () => {
    return moment().format('DD MMM YYYY');
}

const getFormattedTime = () => {
    return moment().format('hh:mm');
}

const updateScreenDate = () => {
    const el = document.querySelector('.header .dates .date .label');
    el.innerHTML = getFormattedDate();
}

const updateScreenTime = () => {
    const el = document.querySelector('.header .dates .hour .label');
    el.innerHTML = getFormattedTime();    
}

fetch('alerts.json')
    .then((response) => response.json())
    .then((data) => {
        alerts = data;
        maxSize = data.length;
        
        map.fitBounds(getCoordinates(alerts), {
            padding : {
                top: 80,
                right: 80,
                bottom: 80,
                left: 80
            },
            speed: 2
        });        

        populateMap(alerts);
        updateScreenDate();
        updateScreenTime();

        setInterval(updateScreenDate, 3600000);
        setInterval(updateScreenTime, 1000);
        setInterval(consumeAlerts, 10000);
    });