const getMinMax = (coordinates) => {
    return [coordinates[0], coordinates[coordinates.length - 1]];
}

const getFeatureCoordinates = (features) =>
    features.map((feature) => [
        feature.properties.long_x,
        feature.properties.lat_y,
    ]);

const sortCoordinates = (coordinates) => {
    const y = coordinates.reduce((a, v) => {
        a[0].push(v[0]);
        a[1].push(v[1]);
        return a;
     }, [[], []]);

     const sort = (a, b) => {
         if (a < b) {
             return -1;
         }
         if (a > b) {
             return 1;
         }
         return 0;
     };

     y[0].sort(sort);
     y[1].sort(sort);

     const buildAgain = (ac, array) => {
         if (array[0].length) {
             ac.push([array[0].splice(0, 1)[0], array[1].splice(0, 1)[0]]);
             buildAgain(ac, array);
         }

         return ac;
     }

     return buildAgain([], y);
};

const fitToBounds = (map, e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });

    if (!features.length) {
        map.getCanvas().style.cursor = '';
        return;
    }

    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    //LOOKUP THE HOVERED CLUSTER FEATURES UNDERLYING DATA POINTS
    const clusterId = features[0].properties.cluster_id;
    const allFeatures = cluster.getLeaves(clusterId, Math.floor(map.getZoom()), Infinity);

    const coordinates = getMinMax(sortCoordinates(getFeatureCoordinates(allFeatures)));

    map.fitBounds(coordinates, {
        padding : {
            top: 80,
            right: 80,
            bottom: 80,
            left: 80
        }
    });
}
