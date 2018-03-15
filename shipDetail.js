const toggleShipDetailPanel = (feature) => {
    const toggleShipDetailPanelEl = document.getElementById('shipDetailPanel');

    if (!feature) {
        toggleShipDetailPanelEl.className = 'hideShipDetail';
        return;
    }

    createShipDetailPanelContent(feature);
    toggleShipDetailPanelEl.className = 'showShipDetail';
}

const createShipDetailPanelContent = (feature) => {
  const { properties } = feature;
  const shipDetailsTableContainerEl = document.getElementById('shipDetailsTableContainer');
  shipDetailsTableContainerEl.innerHTML = `<table class="ShipDetails--shipDetailsTable">
    <tbody>
      <tr>
        <td class="ShipDetails--propertyName">Name</td>
        <td class="ShipDetails--propertyValue">${properties.name}</td>
        <td class="ShipDetails--propertyName">Flag</td>
        <td class="ShipDetails--propertyValue">-</td>
        <td class="ShipDetails--propertyName">Year built</td>
        <td class="ShipDetails--propertyValue">-</td>
      </tr>
      <tr>
        <td class="ShipDetails--propertyName">IMO</td>
        <td class="ShipDetails--propertyValue">-</td>
        <td class="ShipDetails--propertyName">Gross tonnage</td>
        <td class="ShipDetails--propertyValue">3924</td>
      </tr>
      <tr>
        <td class="ShipDetails--propertyName">MMSI</td>
        <td class="ShipDetails--propertyValue">244660108</td>
        <td class="ShipDetails--propertyName">Length overall</td>
        <td class="ShipDetails--propertyValue">135m</td>
      </tr>
      <tr>
        <td class="ShipDetails--propertyName">ENI</td>
        <td class="ShipDetails--propertyValue">02324785</td>
        <td class="ShipDetails--propertyName">Breadth extreme</td>
        <td class="ShipDetails--propertyValue">-</td>
        <td class="ShipDetails--propertyName">Vessel agent</td>
        <td class="ShipDetails--propertyValue">-</td>
      </tr>
      <tr>
        <td class="ShipDetails--propertyName">Call sign</td>
        <td class="ShipDetails--propertyValue">PF7454</td>
        <td class="ShipDetails--propertyName">Maximum draught</td>
        <td class="ShipDetails--propertyValue">-</td>
        <td class="ShipDetails--propertyName">Backoffice agent</td>
        <td class="ShipDetails--propertyValue">-</td>
      </tr>
    </tbody>
  </table>`;
}
