const showClusterLabel = (e, map, popup, cluster) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });

    if (!features.length) {
        return;
    }

    const clusterId = features[0].properties.cluster_id;
    const allFeatures = cluster.getLeaves(clusterId, Math.floor(map.getZoom()), Infinity);
    const featuresNames = allFeatures.map((feature) => feature.properties.name);

    popup.setLngLat(features[0].geometry.coordinates)
        .setHTML(featuresNames.join('<br >'))
        .addTo(map);
}
