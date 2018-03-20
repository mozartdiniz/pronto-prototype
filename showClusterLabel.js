const showClusterLabel = (e, map, popup, cluster) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });

    if (!features.length) {
        return;
    }

    const clusterId = features[0].properties.cluster_id;
    const allFeatures = cluster.getLeaves(clusterId, Math.floor(map.getZoom()), Infinity);
    const fragment = document.createDocumentFragment();
    const featuresNames = allFeatures.forEach((feature) => {
      const listItem = document.createElement('div');
      listItem.addEventListener('click', () => {
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 16,
          speed: 2
        });
      });

      listItem.innerHTML = feature.properties.name;
      fragment.appendChild(listItem);
    });

    popup.setLngLat(features[0].geometry.coordinates)
        .setDOMContent(fragment)
        .addTo(map);
}
