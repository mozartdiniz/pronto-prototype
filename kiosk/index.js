let timer;
let currentIndex = 0;
let maxSize = 0;
let alerts = [];

const updateAlertDetails = (alert) => {
    const alertDescription = document.querySelector('.alert-text');
    const shipName         = document.querySelector('.notifications > .ship-name');
    const berthName        = document.querySelector('.value.berth');
    const alertTitle       = document.querySelector('.alert-title');    
    const alertDate        = document.querySelector('.notifications .dates .date .label');
    const alertTime        = document.querySelector('.notifications .dates .hour .label');    
    const draught          = document.querySelector('.notifications .draught');    

    
    shipName.innerHTML = alert.properties.name;
    berthName.innerHTML = alert.properties.berth;
    alertTitle.innerHTML = alert.properties.message;
    alertDescription.innerHTML = alert.properties.description;
    alertDate.innerHTML = alert.properties.date;
    alertTime.innerHTML = alert.properties.time;   
    draught.innerHTML = (alert.properties.maxDraught) ? alert.properties.maxDraught : 'n/a'; 
}

const updateAlertCounter = () => {
    const alertCount = document.querySelector('.alert-badget .label .number');
    alertCount.innerHTML = alerts.length;
}

const focusOnAlert = (alert) => {
    map.flyTo({
        center: alert.geometry.coordinates,
        zoom: (alert.properties.speedOverGround) ? 11 : 15,
        screenSpeed: 1
    });
}

const getCoordinates = (alerts) => {
    return getMinMax(sortCoordinates(alerts.map((alert) => {
        return alert.geometry.coordinates;
    })))
}

const consumeAlerts = () => {
    const alert = alerts[currentIndex];
    focusOnAlert(alert);
    updateAlertDetails(alert);

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

        showInfoArea(false);
        currentIndex = 0;
    } else {
        populateAlertList(currentIndex);
        showInfoArea(true);
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

const showInfoArea = (show) => {
    const el = document.querySelector('.notifications-container');
    el.style.display = (show) ? 'block' : 'none';
}

function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    }
    else {
        cancelFullScreen.call(doc);
    }
}

const addFullscreenEvent = () => {
    const el = document.querySelector('.fullscreen-mode');
    el.addEventListener('click', toggleFullScreen);
}

const populateAlertList = (selectedAlert) => {
    const el = document.querySelector('.alert-list-container .alert-list');
    el.innerHTML = '';
    
    alerts.forEach((alert, index) => {
        const color = (selectedAlert === index) ? 'red' : 'gray';

        el.innerHTML += `<div class="ship-name" style="background-color: ${color};">
            ${alert.properties.name}
        </div>`;
    });
}

const init = () => {
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
    updateAlertCounter();
    addFullscreenEvent();
    populateAlertList();

    setInterval(updateScreenDate, 3600000);
    setInterval(updateScreenTime, 1000);
    setInterval(consumeAlerts, 10000);
}

fetch('alerts.json')
    .then((response) => response.json())
    .then((data) => {
        alerts = data;
        maxSize = data.length;

        init();
    });