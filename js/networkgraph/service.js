/**
 * service.js
 * The Service it is also same as the connectivity path between 2 transceiver nodes. This library file defines the service manipulation.
 */

var isAddService = 0;
var addServiceData = {
    from: '',
    to: ''
};

/**
 * Enable settings for service and reset other settings.
 * Set service 1 = enable, 0 = disable.
 */
function addServiceMode() {
    UnSelectAll();
    isAddService = 1;
    isDualFiberMode = 0;
    isSingleFiberMode = 0;
    isSinglePatchMode = 0;
    isDualPatchMode = 0;
    addServiceData = {
        from: '',
        to: ''
    };
}

/** Check service connections rule before add it. */
function addService() {

    var fromDetails = network.body.data.nodes.get(addServiceData.from);
    var toDetails = network.body.data.nodes.get(addServiceData.to);
    var transNode = transceiverJSON.node_type.toString().toLowerCase();
    //service should be add between only two transceiver
    if (fromDetails.node_type == transceiverJSON.node_type && toDetails.node_type == transceiverJSON.node_type) {
        //transceiver force checking
        if (fromDetails.transceiver_type != "" && toDetails.transceiver_type != "") {
            //same transceiver type checking
            if (fromDetails.transceiver_type == toDetails.transceiver_type) {
                var labelvalue = getLabel(addServiceData.from, addServiceData.to, serviceJSON.component_type);
                //2 transceiver must have fiber/patch connection
                if (network.getConnectedEdges(addServiceData.from).length > 0 && network.getConnectedEdges(addServiceData.to).length > 0)
                    addServiceComponent(1, addServiceData.from, addServiceData.to, labelvalue, false);
                else
                    showMessage(alertType.Error, "Source " + roadmJSON.component_type + " : " + fromDetails.label + " ,destination " + roadmJSON.component_type + " : " + toDetails.label + " should have " + dualFiberJSON.component_type + "/" + dualPatchJSON.component_type + " connection");
            }
            else
                showMessage(alertType.Error, serviceJSON.component_type + " can be created only between " + transNode + " of same type");
        }
        else
            showMessage(alertType.Error, serviceJSON.component_type + " can be created only when " + transNode + "s are forced");

    }
    else {
        showMessage(alertType.Error, "The " + serviceJSON.component_type + " should be between 2 " + transNode + " sites");
    }
    addServiceData = {
        from: '',
        to: ''
    };
    UnSelectAll();

}

/**
 * Service creation.
 * Service style and configuration data loaded from configurationdata, styledata json.
 * @param {number} cmode - Service mode 1 for add.
 * @param {string} cfrom - Source node ID.
 * @param {string} cto - Destination node ID.
 * @param {string} clabel - The Label of the service.
 * @param {boolean} isImport - false -> manual add, true -> automattically added while import json.
 */
function addServiceComponent(cmode, cfrom, cto, clabel, isImport) {
    var serviceID = token();
    if (cmode == 1) {

        var bandwidth = configData[serviceJSON.component_type].default.band_width;
        if (isImport)
            bandwidth = tBandwidth;
        else
            clabel = countFiberService(false, false, true, false, cfrom, cto) + '-' + clabel;

        elabel = clabel;
        var fiberSmooth = multipleFiberService1(cfrom, cto);
        if (!fiberSmooth)
            fiberSmooth = fiberJSON.options.smooth;
        network.body.data.edges.add({
            id: serviceID, from: cfrom, to: cto, label: elabel, text: clabel, dashes: serviceJSON.dashes, width: serviceJSON.width,
            component_type: serviceJSON.component_type, color: serviceJSON.options.color, background: serviceJSON.options.background,
            arrows: serviceJSON.options.arrows,
            smooth: fiberSmooth,
            band_width: bandwidth
        });
        multipleFiberService(cfrom, cto);
        var tedge = network.body.data.edges.get(serviceID);
        tedge.isUpdate = false;
        tempUndo.push(tedge);
    }
    UnSelectAll();
    network.addEdgeMode();
}

/**
 * Populate service details by service ID.
 * @param {string} serviceID - Service ID.
 * @param callback - The callback that handles the response.
 */
function serviceEdit(serviceID, callback) {
    document.getElementById("serviceMenu").style.display = "none";
    var edgeDetails = network.body.data.edges.get(serviceID);
    $("#txtServiceName").val(edgeDetails.text);
    var connectedNode = network.getConnectedNodes(serviceID);
    $("#txtServiceSrc").val(network.body.data.nodes.get(connectedNode[0]).label);
    $("#txtServiceDest").val(network.body.data.nodes.get(connectedNode[1]).label);
    $("#txtBandwidth").val(edgeDetails.band_width);
    openDrawer('service');
    document.getElementById("btnUpdateService").onclick = updateService.bind(
        this,
        serviceID,
        callback
    );
    document.getElementById("btnCloseService").onclick = clearService.bind(
    );
}

/**
 * Update service.
 * Update service label, text, band_width by service ID.
 * @param {string} serviceID - Service ID.
 */
function updateService(serviceID) {

    var id = serviceID;
    var label = $("#txtServiceName").val().trim();
    var bandwidth = $("#txtBandwidth").val();
    var serviceDetails = network.body.data.edges.get(serviceID);

    if (nameLengthValidation("txtServiceName")) {

        if (serviceDetails.component_type == serviceJSON.component_type) {

            var elabel = "";
            elabel = label;
            network.body.data.edges.update({
                id: id, label: elabel, text: label, band_width: bandwidth
            });
            multipleFiberService(serviceDetails.from, serviceDetails.to);
            var tdata = network.body.data.edges.get(id);
            tdata.isUpdate = true;
            tempUndo.push(tdata);

            clearService();
        }

    }

}

/**
 * Remove service by service ID.
 * @param {string} serviceID - Service ID.
 */
function deleteService(serviceID) {
    var serviceDetails = network.body.data.edges.get(serviceID);
    document.getElementById("serviceMenu").style.display = "none";
    var serviced = network.body.data.edges.get(serviceID);
    network.body.data.edges.remove(serviceID);
    multipleFiberService(serviceDetails.from, serviceDetails.to);
    serviced.isDelete = true;
    serviced.isUpdate = false;
    tempUndo.push(serviced);
    UnSelectAll();
    enableEdgeIndicator();
}

/** Clear input/teporary data and other settings. */
function clearService() {

    $("#txtServiceName").val('');
    $("#txtServiceSrc").val('');
    $("#txtServiceDest").val('');
    $("#txtBandwidth").val('');
    $("#ddlCentralFrq").val('');
    closeDrawer('service');
    UnSelectAll();
    enableEdgeIndicator();
}

