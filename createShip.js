let menuTimeout = 0;

const createZoomStyleClassForPopups = (zoomLevel) => `zoom-${zoomLevel}`;

const rotateShip = (rotation) => `rotate(${rotation}deg)`;

const isVesselAlongsideABerth = (feature) => (!feature.properties.speed);

const formatTime = (etaTime) => {
    const dateTime = new Date(etaTime);

    return `${dateTime.getDate()}/${dateTime.getMonth() + 1} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
}

const decideVesselColor = (feature) => (feature.properties.late) ? 'red' : '#007b34';

const decideLabelColor = (feature) => (feature.properties.alerts) ? 'rgba(255, 0, 0, 1)' : 'rgba(24, 154, 0, 1)';

const createShipIcon = (feature) => {
  const icon = document.createElement('div');
  icon.style.backgroundColor = decideVesselColor(feature);

  icon.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(JSON.stringify(feature));
      toggleShipDetailPanel(feature);
  });

  if (isVesselAlongsideABerth(feature)) {
    icon.classList.add('ship-circle-icon');
  } else {
    icon.classList.add('ship-arrow-icon');
    icon.style.transform = rotateShip(feature.properties.rotation);
  }

  return icon;
}

const createAlertIcon = (feature) => {
  const el = document.createElement('div');

  if (!feature.properties.alerts) {
    return el;
  }

  el.classList.add('alert-icon');

  return el;
}

const createShipmasterStatus = (feature) => {
  const el = document.createElement('div');
  const label = document.createElement('div');
  const value = document.createElement('div');

  el.classList.add('shipmaster');
  value.classList.add('shipmaster-value');

  label.innerHTML = 'STATUS: ';

  if (!feature.properties.plannedCaptain && !feature.properties.captainOnBoard) {
    return el;
  }

  if (feature.properties.plannedCaptain && !feature.properties.captainOnBoard) {
    value.innerHTML = 'PILOT ON BOARD';

    el.appendChild(label);
    el.appendChild(value);

    return el;
  }

  value.innerHTML = 'PILOT ORDERED';

  el.appendChild(label);
  el.appendChild(value);

  return el;
}

const timeElements = (feature, labelText) => {
  const container = document.createElement('div');
  container.classList.add('eta-container');

  const label = document.createElement('div');
  label.classList.add('eta-label');

  const icon = document.createElement('div');
  icon.classList.add('eta-icon');

  const value = document.createElement('div');
  value.classList.add('eta-value');

  value.innerHTML = formatTime(feature.properties[labelText]);
  label.innerHTML = labelText;

  container.appendChild(label);
  container.appendChild(icon);
  container.appendChild(value);

  return container;
}

const createExtendedLabel = (feature, map) => {
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('content-container');

    contentContainer.appendChild(createAlertIcon(feature));

    const nameContainer = document.createElement('div');
    nameContainer.classList.add('extended-name-container');

    const nextContainer = document.createElement('div');
    nextContainer.classList.add('next-container');

    const draught = document.createElement('div');
    draught.classList.add('draught-container');

    contentContainer.style.backgroundColor = decideLabelColor(feature);

    nameContainer.innerHTML = feature.properties.name;
    nextContainer.innerHTML = `Next: ${feature.properties.fakeNextDestination}`;
    draught.innerHTML = `DRAUGHT: ${feature.properties.draught}`;

    contentContainer.appendChild(nameContainer);
    contentContainer.appendChild(nextContainer);

    if (isVesselAlongsideABerth(feature)) {
      contentContainer.appendChild(timeElements(feature, 'eta'));
      contentContainer.appendChild(timeElements(feature, 'ptd'));
    } else {
      contentContainer.appendChild(timeElements(feature, 'pta'));
      contentContainer.appendChild(timeElements(feature, 'ptd'));
    }

    contentContainer.appendChild(draught);
    contentContainer.appendChild(createShipmasterStatus(feature));

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
    const shipNames = {
      name: feature.properties.name,
      shortName: feature.properties.shortName
    };

    el.classList.add('pronto-popup');
    el.classList.add(createZoomStyleClassForPopups(zoomLevel));

    el.appendChild(createRegularLabel(content, map, feature));
    // el.appendChild(createExtendedLabel(feature));

    const extendedLabel = createExtendedLabel(feature);

    extendedLabel.addEventListener('mouseout', () => {
      menuTimeout = setTimeout(() => {
        el.removeChild(el.firstChild);
        el.appendChild(createRegularLabel(shipNames, map, feature));
      }, 200);
    });

    el.addEventListener('mouseover', (e) => {
      clearTimeout(menuTimeout);
      el.removeChild(el.firstChild);
      el.appendChild(extendedLabel);
    });

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

    el.appendChild(createShipIcon(feature));

    const ship = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map);

    return {
        ship,
        label,
    }
}
