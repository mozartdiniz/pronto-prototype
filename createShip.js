const createZoomStyleClassForPopups = (zoomLevel) => `zoom-${zoomLevel}`;

const rotateShip = (rotation) => `rotate(${rotation}deg)`;

const formatTime = (etaTime) => {
    const dateTime = new Date(etaTime);

    return `${dateTime.getDate()}/${dateTime.getMonth() + 1} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
}

const decideVesselColor = (feature) => (feature.properties.late) ? 'red' : '#007b34';

const decideLabelColor = (feature) => (feature.properties.alerts) ? 'rgba(255, 0, 0, 0.77)' : 'rgba(24, 154, 0, 0.8)';

const createExtendedLabel = (feature, map) => {
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');

    const nameContainer = document.createElement('div');
    nameContainer.classList.add('extended-name-container');

    const nextContainer = document.createElement('div');
    nextContainer.classList.add('next-container');

    const etaContainer = document.createElement('div');
    etaContainer.classList.add('eta-container');

    const etaLabel = document.createElement('div');
    etaLabel.classList.add('eta-label');

    const etaIcon = document.createElement('div');
    etaIcon.classList.add('eta-icon');

    const etaValue = document.createElement('div');
    etaValue.classList.add('eta-value');

    contentContainer.style.backgroundColor = decideLabelColor(feature);

    nameContainer.innerHTML = feature.properties.name;
    nextContainer.innerHTML = `Next: ${feature.properties.fakeNextDestination}`;
    etaValue.innerHTML = formatTime(feature.properties.eta);
    etaLabel.innerHTML = 'ETA';

    etaContainer.appendChild(etaLabel);
    etaContainer.appendChild(etaIcon);
    etaContainer.appendChild(etaValue);
    contentContainer.appendChild(nameContainer);
    contentContainer.appendChild(nextContainer);
    contentContainer.appendChild(etaContainer);

    return contentContainer;
}

const createRegularLabel = (content, map, feature) => {
    const zoomLevel = Math.round(map.getZoom());
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');

    const nameContainer = document.createElement('div');
    nameContainer.classList.add('name-container');

    const shortNameContainer = document.createElement('div');
    shortNameContainer.classList.add('short-name-container');

    contentContainer.style.backgroundColor = decideLabelColor(feature);

    nameContainer.innerHTML = content.name;
    shortNameContainer.innerHTML = content.shortName;

    // Can we do this in a global conf or something?
    if (zoomLevel > 14) {
        contentContainer.appendChild(nameContainer);
    } else {
        contentContainer.appendChild(shortNameContainer);
    }

    return contentContainer;
}

const createShipLabel = (content, map, feature) => {
    const zoomLevel = Math.round(map.getZoom());
    const el = document.createElement('div');

    el.classList.add('pronto-popup');
    el.classList.add(createZoomStyleClassForPopups(zoomLevel));

    el.appendChild(createRegularLabel(content, map, feature));

    return new mapboxgl.Marker(el);
}

const createShip = (feature, map) => {
    const coords = feature.geometry.coordinates;
    const shipNames = {
        name: feature.properties.name,
        shortName: feature.properties.shortName
    };

    const label = createShipLabel(shipNames, map, feature)
        .setLngLat(coords)
        .addTo(map);

    const el = document.createElement('div');
    el.classList.add('cluster-marker');

    const icon = document.createElement('div');
    icon.classList.add('cluster-marker-icon');
    icon.style.transform = rotateShip(feature.properties.rotation);
    icon.style.backgroundColor = decideVesselColor(feature);

    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleShipDetailPanel(feature);
    });

    icon.addEventListener('mouseover', (e) => {
        label._element.innerHTML = createExtendedLabel(feature).outerHTML;
    });

    icon.addEventListener('mouseout', (e) => {
        label._element.innerHTML = createRegularLabel(shipNames, map, feature).outerHTML;
    });

    el.appendChild(icon);

    const ship = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map);

    return {
        ship,
        label,
    }
}
