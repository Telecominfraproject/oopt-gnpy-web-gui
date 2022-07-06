﻿/**
 * node.js.
 * The node  can be defined as the connection point of "ROADM, Attenuator, Transceiver, Amplifier and Raman Amplifier" and defines the node manipulations.
 */


/**
 * Check node Mode 1-roadm, 2-amp, 3-fused, 4-transceiver, 6- raman amp
 * @param {Number} nodemode - Mode of the component.
 */
function AddNodeMode(nodemode) {

    nodeMode = nodemode;
    if (nodeMode) {
        if (nodeMode > 0 && nodeMode < 7)
            network.addNodeMode();
    }
}

/**
 * Node creation by node mode.
 * Node will be placed based on co-ordidate points x,y.
 * Node style and configuration data loaded from configurationdata, styledata json.
 * @param {object} data - The data of the component.
 * @param callback - The callback that handles the response.
 */
function addNodes(data, callback) {

    var nodeDetails = "";
    var nodeShape = "";
    var nodeColor = "";
    var nodeFont = "";
    var nodeSize = 0;
    var amp_category = "";
    if (nodeMode == nodeType.ROADM) {
        nodeDetails = configData.node[roadmJSON.node_type];
        data.image = DIR + roadmJSON.w_image;
        nodeFont = roadmJSON.font;
        nodeSize = roadmJSON.size;
        data.font = nodeFont;

        if ($("#ddlNetworkView").val() == topologyView.Functional_View)
            data.roadm_type = nodeDetails.default.roadm_type;

    }
    else if (nodeMode == nodeType.ILA || nodeMode == nodeType.Attenuator || nodeMode == nodeType.Transceiver || nodeMode == nodeType.Amplifier || nodeMode == nodeType.RamanAmplifier) {
        if (nodeMode == nodeType.ILA) {
            nodeDetails = configData.node[ILAJSON.amp_category];
            nodeShape = ILAJSON.shape;
            nodeColor = ILAJSON.color;
            nodeFont = ILAJSON.font;
            data.image = DIR + ILAJSON.w_image;
            data.pre_amp_type = nodeDetails.default.pre_amp_type;
            data.booster_type = nodeDetails.default.booster_type;
            data.amp_category = nodeDetails.default.amp_category;
            nodeSize = ILAJSON.size;
        }
        else if (nodeMode == nodeType.Attenuator) {
            nodeDetails = configData.node[fusedJSON.node_type];
            nodeShape = fusedJSON.shape;
            nodeColor = fusedJSON.color;
            nodeFont = fusedJSON.font;
            data.image = DIR + fusedJSON.w_image;
            nodeSize = fusedJSON.size;
        }
        else if (nodeMode == nodeType.Transceiver) {
            nodeDetails = configData.node[transceiverJSON.node_type];
            nodeShape = transceiverJSON.shape;
            nodeColor = transceiverJSON.color;
            nodeFont = transceiverJSON.font;
            data.image = DIR + transceiverJSON.w_image;
            data.transceiver_type = nodeDetails.default.transceiver_type;
            nodeSize = transceiverJSON.size;
        }
        else if (nodeMode == nodeType.Amplifier) {
            nodeDetails = configData.node[amplifierJSON.amp_category];
            nodeShape = amplifierJSON.shape;
            nodeColor = amplifierJSON.color;
            nodeFont = amplifierJSON.font;
            data.image = DIR + amplifierJSON.w_image;
            data.amp_type = nodeDetails.default.amp_type;
            data.amp_category = nodeDetails.default.amp_category;
            nodeSize = amplifierJSON.size;
        }
        else if (nodeMode == nodeType.RamanAmplifier) {
            nodeDetails = configData.node[ramanampJSON.amp_category];
            nodeShape = ramanampJSON.shape;
            nodeColor = ramanampJSON.color;
            nodeFont = ramanampJSON.font;
            data.image = DIR + ramanampJSON.w_image;
            data.amp_type = nodeDetails.default.amp_type;
            data.amp_category = nodeDetails.default.amp_category;
            data.category = nodeDetails.default.category;
            nodeSize = ramanampJSON.size;
        }

        data.shape = nodeShape;
        data.color = nodeColor;
        data.size = nodeSize;

    }
    else
        return;


    var result = nodeName(nodeDetails.default.node_type, nodeDetails.default.amp_category);

    var nodelength = result.nodeLength;
    var nodeLabel = result.label;

    data.id = token();
    data.number = nodelength;
    data.label = nodeLabel;
    data.node_type = nodeDetails.default.node_type;
    data.node_degree = nodeDetails.default.node_degree;
    data.component_type = roadmJSON.component_type;
    data.hidden = false;
    data.isUpdate = false;
    data.view = $("#ddlNetworkView").val();
    callback(data);

    realUpdate();

    if (nodeMode == nodeType.ROADM || nodeMode == nodeType.ILA || nodeMode == nodeType.Attenuator || nodeMode == nodeType.Transceiver || nodeMode == nodeType.Amplifier || nodeMode == nodeType.RamanAmplifier)
        network.addNodeMode();
    tempUndo.push(network.body.data.nodes.get(data.id));
}

/**
 * Populate ROADM component details by node ID.
 * @param {string} nodeID - The ID of the ROADM component.
 * @param callback - The callback that handles the response.
 */
function roadmEdit(nodeID, callback) {
    _roadmListDB().remove();
    document.getElementById("roadmMenu").style.display = "none";
    openDrawer('roadm');
    var nodeDetails = network.body.data.nodes.get(nodeID[nodeID.length - 1]);
    $("#txtRoadmName").val(nodeDetails.label);
    $("#divRoadmPro").hide();
    $("#divRoadmPro").empty();
    $("#divRoadmType").hide();
    if (nodeDetails.node_type == roadmJSON.node_type && $("#ddlNetworkView").val() == topologyView.NE_View) {
        arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
        _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));
        var connectedFiber = network.getConnectedEdges(nodeID);

        $.each(connectedFiber, function (index, item) {
            if (network.body.data.edges.get(item).component_type == dualFiberJSON.component_type)
                loadRoadmType(item, nodeID[nodeID.length - 1], nodeDetails.node_type, "divRoadmPro");
        });
    }
    else if (nodeDetails.node_type == roadmJSON.node_type && $("#ddlNetworkView").val() == topologyView.Functional_View) {
        $("#divRoadmType").show();

        if (nodeID.length > 1) {
            $("#divRoadmName").hide();
            $("#ddlRoadmType").val('');
            $("#ddlRoadmType").addClass('input_error');
            var matchCount = 1;
            for (var i = 0; i < nodeID.length - 1; i++) {
                if (network.body.data.nodes.get(nodeID[i]).roadm_type == nodeDetails.roadm_type) {
                    matchCount++;
                }
            }
            if (matchCount == nodeID.length) {
                if (nodeDetails.roadm_type) {
                    $("#ddlRoadmType").val(nodeDetails.roadm_type);
                    $("#ddlRoadmType").removeClass('input_error');
                }
            }


        }
        else {
            $("#divRoadmName").show();
            if (nodeDetails.roadm_type) {
                $("#ddlRoadmType").removeClass('input_error');
                $("#ddlRoadmType").val(nodeDetails.roadm_type);
            }
            else {
                $("#ddlRoadmType").val('');
                $("#ddlRoadmType").addClass('input_error');
            }
        }

    }

    document.getElementById("btnUpdateRoadm").onclick = updateRoadm.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseRoadm").onclick = clearRoadm.bind(
    );
}

/**
 * Update ROADM.
 * Update ROADM label, type by ROADM ID.
 * @param {string} nodeID - The ID of the ROADM component
 */
function updateRoadm(nodeID) {
    removeNodeList = [];
    if (nameLengthValidation("txtRoadmName")) {
        var id = nodeID[nodeID.length - 1];
        var label = $("#txtRoadmName").val().trim();
        var node_type = network.body.data.nodes.get(id).node_type
        var roadmtypeprodata = _roadmListDB().get();
        if (node_type == roadmJSON.node_type && $("#ddlNetworkView").val() == topologyView.NE_View) {

            $.each(roadmtypeprodata, function (index, item) {
                var lddlroadmtype = "#" + eleroadmtype + item.roadm_fiber_id;
                var lddlpreamptype = "#" + elepreamptype + item.roadm_fiber_id;
                var lddlboostertype = "#" + eleboostertype + item.roadm_fiber_id;
                var edgeDetails = network.body.data.edges.get(item.roadm_fiber_id);
                var llabelname = node_type + "- [" + label + ' - ' + network.body.data.nodes.get(edgeDetails.to).label + ' ]'
                _roadmListDB({ "roadm_fiber_id": item.roadm_fiber_id, }).update({
                    "roadm_label": llabelname, "roadm_type": $(lddlroadmtype).val(),
                    "pre_amp_type": $(lddlpreamptype).val(), "booster_type": $(lddlboostertype).val(),
                });
            });
            roadmtypeprodata = _roadmListDB().get();
            network.body.data.nodes.update({
                id: id, label: label, roadm_type_pro: roadmtypeprodata
            });

        }
        else if (node_type == roadmJSON.node_type && $("#ddlNetworkView").val() == topologyView.Functional_View) {

            if ($("#ddlRoadmType").val() == null) {
                showMessage(alertType.Error, 'Please select type');
                $("#ddlRoadmType").addClass('input_error');
                return;
            }
            else
                $("#ddlRoadmType").removeClass('input_error');


            var preUpdateList = [];
            if (nodeID.length > 1) {
                for (var i = 0; i < nodeID.length; i++) {

                    if (network.body.data.nodes.get(nodeID[i]).image == DIR + roadmJSON.h_image) {

                        preUpdateList.push(network.body.data.nodes.get(nodeID[i]));
                        network.body.data.nodes.update({
                            id: nodeID[i], roadm_type: $("#ddlRoadmType").val()
                        });
                        realUpdate_Roadm(nodeID[i], $("#ddlRoadmType").val());

                        var tdata = network.body.data.nodes.get(nodeID[i]);
                        removeNodeList.push(tdata);
                    }
                }
                if (removeNodeList.length > 0) {
                    var updateList = {
                        isMultiple: true,
                        isUpdate: true,
                        preList: preUpdateList,
                        list: removeNodeList
                    }
                    tempUndo.push(updateList);
                }

            } else {
                network.body.data.nodes.update({
                    id: id, label: label, roadm_type: $("#ddlRoadmType").val()
                });
                realUpdate_Roadm(id, $("#ddlRoadmType").val());

                var tdata = network.body.data.nodes.get(id);
                tdata.isUpdate = true;
                tempUndo.push(tdata);
            }
        }
        clearRoadm();
    }

}

/** Clear input/teporary data and other settings. */
function clearRoadm() {
    $("#txtRoadmName").val('');
    $("#divRoadmPro").empty();
    $("#ddlRoadmType").val('');
    closeDrawer('roadm');
    _roadmListDB().remove();
    UnSelectAll();
}

/**
 * Check ROADM component rules and update check-errors summary.
 * @param {string} id - The ID of ROADM component.
 * @param {string} rtype - The type of ROADM component.
 */
function realUpdate_Roadm(id, rtype) {
    var roadmtype = rtype;
    var connectedEges = network.getConnectedEdges(id);
    var tempEdge = [];
    $.each(connectedEges, function (index, item) {
        if (network.body.data.edges.get(item).component_type != serviceJSON.component_type) {
            tempEdge.push(item);
        }
    });

    var fromCount = 0;
    var toCount = 0;
    for (i = 0; i < tempEdge.length; i++) {
        edgeDetails = network.body.data.edges.get(tempEdge[i]);
        if (edgeDetails.from == id)
            fromCount++;
        else if (edgeDetails.to == id)
            toCount++;
    }

    if (fromCount != toCount || (fromCount == 0 && toCount == 0)) {
        removeID = "#spanTF" + id.replace(/\s/g, '');
        $(removeID).remove();
    }
    else {
        if (roadmtype)
            removeSpanInError(id, true);
    }
}

/**
 * Populate Attenuator component details by node ID.
 * @param {string} nodeID - The ID of the Attenuator component.
 * @param callback - The callback that handles the response.
 */
function attenuatorEdit(nodeID, callback) {
    document.getElementById("attenuatorMenu").style.display = "none";
    openDrawer('attenuator');
    var nodeDetails = network.body.data.nodes.get(nodeID);
    $("#txtAttenuatorName").val(nodeDetails.label);

    document.getElementById("btnUpdateAttenuator").onclick = updateAttenuator.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseAttenuator").onclick = clearAttenuator.bind(
    );
}

/**
 * Update Attenuator.
 * Update Attenuator label, type by Attenuator ID.
 * @param {string} nodeID - The ID of the Attenuator component
 */
function updateAttenuator(nodeID) {

    var id = nodeID;
    var label = $("#txtAttenuatorName").val().trim();
    var node_type = network.body.data.nodes.get(nodeID).node_type

    if (nameLengthValidation("txtAttenuatorName")) {

        if (node_type == fusedJSON.node_type) {
            network.body.data.nodes.update({
                id: id, label: label
            });
            var tdata = network.body.data.nodes.get(id);
            tdata.isUpdate = true;
            tempUndo.push(tdata);
            clearAttenuator();
        }


    }

}

/** Clear input/teporary data and other settings. */
function clearAttenuator() {
    $("#txtAttenuatorName").val('');
    closeDrawer('attenuator');
    UnSelectAll();
}

function ILAEdit(nodeID, callback) {
    _roadmListDB().remove();
    document.getElementById("ILAMenu").style.display = "none";
    openDrawer('ILA');
    var nodeDetails = network.body.data.nodes.get(nodeID);
    $("#txtILAName").val(nodeDetails.label);
    $("#divILAPro").hide();
    $("#divILAPro").empty();

    if (nodeDetails.amp_category == ILAJSON.amp_category) {
        arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
        _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));
        var connectedFiber = network.getConnectedEdges(nodeID);

        $.each(connectedFiber, function (index, item) {
            if (network.body.data.edges.get(item).component_type == dualFiberJSON.component_type)
                loadRoadmType(item, nodeID, nodeDetails.amp_category, "divILAPro");
        });
    }

    document.getElementById("btnILAUpdate").onclick = updateILA.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseILA").onclick = clearILA.bind(
    );
}
function updateILA(nodeID) {

    var id = nodeID;
    var label = $("#txtILAName").val().trim();
    var nodeDetails = network.body.data.nodes.get(nodeID);

    if (nameLengthValidation("txtILAName")) {

        var roadmtypeprodata = _roadmListDB().get();
        if (nodeDetails.amp_category == ILAJSON.amp_category) {

            $.each(roadmtypeprodata, function (index, item) {
                var lddlpreamptype = "#" + elepreamptype + item.roadm_fiber_id;
                var lddlboostertype = "#" + eleboostertype + item.roadm_fiber_id;
                var edgeDetails = network.body.data.edges.get(item.roadm_fiber_id);
                var llabelname = nodeDetails.amp_category + "- [" + label + ' - ' + network.body.data.nodes.get(edgeDetails.to).label + ' ]'
                _roadmListDB({ "roadm_fiber_id": item.roadm_fiber_id, }).update({
                    "roadm_label": llabelname,
                    "pre_amp_type": $(lddlpreamptype).val(), "booster_type": $(lddlboostertype).val(),
                });
            });
            roadmtypeprodata = _roadmListDB().get();
            network.body.data.nodes.update({
                id: id, label: label, roadm_type_pro: roadmtypeprodata
            });
            clearILA();
        }

    }

}
function clearILA() {
    $("#txtILAName").val('');
    $("#ddlPreAmpType").val('');
    $("#ddlBoosterType").val('');
    $("#divILAPro").empty();
    closeDrawer('ILA');
    UnSelectAll();
    _roadmListDB().remove();
}

/**
 * Populate Amplifier component details by node ID.
 * @param {string} nodeID - The ID of the Amplifier component.
 * @param callback - The callback that handles the response.
 */
function amplifierEdit(nodeID, callback) {
    document.getElementById("amplifierMenu").style.display = "none";
    openDrawer('amplifier');
    var nodeDetails = network.body.data.nodes.get(nodeID[nodeID.length - 1]);
    $("#txtAmplifierName").val(nodeDetails.label);
    $("#ddlAmplifierType").val(nodeDetails.amp_type);
    if (nodeID.length > 1) {
        $("#divAmpName").hide();
        $("#ddlAmplifierType").val('');
        $("#ddlAmplifierType").addClass('input_error');

        var matchCount = 1;
        for (var i = 0; i < nodeID.length - 1; i++) {
            if (network.body.data.nodes.get(nodeID[i]).amp_type == nodeDetails.amp_type) {
                matchCount++;
            }
        }
        if (matchCount == nodeID.length) {
            if (nodeDetails.amp_type) {
                $("#ddlAmplifierType").val(nodeDetails.amp_type);
                $("#ddlAmplifierType").removeClass('input_error');
            }
        }

    }
    else {
        $("#divAmpName").show();
        if (nodeDetails.amp_type) {
            $("#ddlAmplifierType").removeClass('input_error');
        }
        else {
            $("#ddlAmplifierType").addClass('input_error');
        }
    }

    document.getElementById("btnAmplifierUpdate").onclick = updateAmplifier.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseAmplifier").onclick = clearAmplifier.bind(
    );
}

/**
 * Update Amplifier.
 * Update Amplifier label, type by Amplifier ID.
 * @param {string} nodeID - The ID of the Amplifier component
 */
function updateAmplifier(nodeID) {
    removeNodeList = [];
    if (nameLengthValidation("txtAmplifierName")) {

        var id = nodeID[nodeID.length - 1];
        var label = $("#txtAmplifierName").val().trim();
        var amp_category = network.body.data.nodes.get(id).amp_category

        if ($("#ddlAmplifierType").val() == null) {
            showMessage(alertType.Error, 'Please select type');
            $("#ddlAmplifierType").addClass('input_error');
            return;
        }
        else
            $("#ddlAmplifierType").removeClass('input_error');


        if (amp_category == amplifierJSON.amp_category) {

            if (nodeID.length > 1) {
                var preUpdateList = [];
                for (var i = 0; i < nodeID.length; i++) {

                    if (network.body.data.nodes.get(nodeID[i]).image == DIR + amplifierJSON.h_image || network.body.data.nodes.get(nodeID[i]).image == DIR + amplifierJSON.fh_image) {
                        preUpdateList.push(network.body.data.nodes.get(nodeID[i]));
                        network.body.data.nodes.update({
                            id: nodeID[i], amp_type: $("#ddlAmplifierType").val()
                        });
                        realUpdate_Amplifier(nodeID[i], $("#ddlAmplifierType").val());
                        var tdata = network.body.data.nodes.get(nodeID[i]);
                        removeNodeList.push(tdata);
                    }
                }
                if (removeNodeList.length > 0) {
                    var updateList = {
                        isMultiple: true,
                        isUpdate: true,
                        preList: preUpdateList,
                        list: removeNodeList
                    }
                    tempUndo.push(updateList);
                }
            } else {
                network.body.data.nodes.update({
                    id: id, label: label, amp_type: $("#ddlAmplifierType").val()
                });
                realUpdate_Amplifier(id, $("#ddlAmplifierType").val());

                var tdata = network.body.data.nodes.get(id);
                tdata.isUpdate = true;
                tempUndo.push(tdata);
            }

            clearAmplifier();
        }


    }

}

/** Clear input/teporary data and other settings. */
function clearAmplifier() {
    $("#txtAmplifierName").val('');
    $("#ddlAmplifierType").val('');
    closeDrawer('amplifier');
    UnSelectAll();
}

/**
 * Check Amplifier component rules and update check-errors summary.
 * @param {string} id - The ID of Amplifier component.
 * @param {string} rtype - The type of Amplifier component.
 */
function realUpdate_Amplifier(id, rtype) {
    var amptype = rtype;
    var connectedEdges;
    var fromCount;
    var toCount;
    connectedEdges = network.getConnectedEdges(id);
    fromCount = 0;
    toCount = 0;
    for (i = 0; i < connectedEdges.length; i++) {
        edgeDetails = network.body.data.edges.get(connectedEdges[i]);
        if (edgeDetails.from == id)
            fromCount++;
        else if (edgeDetails.to == id)
            toCount++;
    }

    if (fromCount == 1 && toCount == 1) {
        if (amptype) {
            removeSpanInError(id, true);
        }
    }
    else {
        if (amptype) {
            removeID = "#spanTF" + id.replace(/\s/g, '');
            $(removeID).remove();
        }
    }

}

/**
 * Populate Raman Amplifier component details by node ID.
 * @param {string} nodeID - The ID of the Raman Amplifier component.
 * @param callback - The callback that handles the response.
 */
function ramanAmpEdit(nodeID, callback) {
    document.getElementById("ramanAmpMenu").style.display = "none";
    openDrawer('ramanamp');
    var nodeDetails = network.body.data.nodes.get(nodeID[nodeID.length - 1]);
    $("#txtRamanAmpName").val(nodeDetails.label);
    $("#ddlRamanAmpType").val(nodeDetails.amp_type);
    $("#ddlRamanAmpCategory").val(nodeDetails.category);


    if (nodeID.length > 1) {
        $("#divRamanAmpName").hide();
        $("#ddlRamanAmpType").val('');
        $("#ddlRamanAmpType").addClass('input_error');
        $("#ddlRamanAmpCategory").val('');
        $("#ddlRamanAmpCategory").addClass('input_error');

        var matchCount = 1;
        for (var i = 0; i < nodeID.length - 1; i++) {
            if (network.body.data.nodes.get(nodeID[i]).amp_type == nodeDetails.amp_type && network.body.data.nodes.get(nodeID[i]).category == nodeDetails.category) {
                matchCount++;
            }
        }
        if (matchCount == nodeID.length) {
            if (nodeDetails.amp_type && nodeDetails.category) {
                $("#ddlRamanAmpType").val(nodeDetails.amp_type);
                $("#ddlRamanAmpType").removeClass('input_error');
                $("#ddlRamanAmpCategory").val(nodeDetails.category);
                $("#ddlRamanAmpCategory").removeClass('input_error');
            }
        }

    }
    else {
        $("#divRamanAmpName").show();
        if (nodeDetails.amp_type) {
            $("#ddlRamanAmpType").removeClass('input_error');
        }
        else {
            $("#ddlRamanAmpType").addClass('input_error');
        }
        if (nodeDetails.category) {
            $("#ddlRamanAmpCategory").removeClass('input_error');
        }
        else {
            $("#ddlRamanAmpCategory").addClass('input_error');
        }
    }

    document.getElementById("btnRamanAmpUpdate").onclick = updateRamanAmp.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseRamanAmp").onclick = clearRamanAmp.bind(
    );
}

/**
 * Update Raman Amplifier.
 * Update Raman Amplifier label, type by Raman Amplifier ID.
 * @param {string} nodeID - The ID of the Raman Amplifier component
 */
function updateRamanAmp(nodeID) {
    removeNodeList = [];
    if (nameLengthValidation("txtRamanAmpName")) {

        var id = nodeID[nodeID.length - 1];
        var label = $("#txtRamanAmpName").val().trim();
        var amp_category = network.body.data.nodes.get(id).amp_category

        if ($("#ddlRamanAmpType").val() == null) {
            showMessage(alertType.Error, 'Please select type');
            $("#ddlRamanAmpType").addClass('input_error');
            return;
        }
        else
            $("#ddlRamanAmpType").removeClass('input_error');

        if ($("#ddlRamanAmpCategory").val() == null) {
            showMessage(alertType.Error, 'Please select category');
            $("#ddlRamanAmpCategory").addClass('input_error');
            return;
        }
        else
            $("#ddlRamanAmpCategory").removeClass('input_error');


        if (amp_category == ramanampJSON.amp_category) {
            if (nodeID.length > 1) {
                var preUpdateList = [];
                for (var i = 0; i < nodeID.length; i++) {
                    if (network.body.data.nodes.get(nodeID[i]).image == DIR + ramanampJSON.h_image || network.body.data.nodes.get(nodeID[i]).image == DIR + ramanampJSON.fh_image) {
                        preUpdateList.push(network.body.data.nodes.get(nodeID[i]));
                        network.body.data.nodes.update({
                            id: nodeID[i], amp_type: $("#ddlRamanAmpType").val(), category: $("#ddlRamanAmpCategory").val()
                        });
                        realUpdate_RamanAmp(nodeID[i], $("#ddlRamanAmpType").val());
                        var tdata = network.body.data.nodes.get(nodeID[i]);
                        //tdata.isUpdate = true;
                        removeNodeList.push(tdata);
                    }
                }
                if (removeNodeList.length > 0) {
                    var updateList = {
                        isMultiple: true,
                        isUpdate: true,
                        preList: preUpdateList,
                        list: removeNodeList
                    }
                    tempUndo.push(updateList);
                }
            } else {
                network.body.data.nodes.update({
                    id: id, label: label, amp_type: $("#ddlRamanAmpType").val(), category: $("#ddlRamanAmpCategory").val()
                });

                realUpdate_RamanAmp(id, $("#ddlRamanAmpType").val());
                var tdata = network.body.data.nodes.get(id);
                tdata.isUpdate = true;
                tempUndo.push(tdata);
            }

            clearRamanAmp();
        }
    }
}

/** Clear input/teporary data and other settings. */
function clearRamanAmp() {
    $("#txtRamanAmpName").val('');
    $("#ddlRamanAmpType").val('');
    $("#ddlRamanAmpCategory").val('');
    closeDrawer('ramanamp');
    UnSelectAll();
}

/**
 * Check Raman Amplifier component rules and update check-errors summary.
 * @param {string} id - The ID of Raman Amplifier component.
 * @param {string} rtype - The type of Raman Amplifier component.
 */
function realUpdate_RamanAmp(id, rtype) {
    var amptype = rtype;
    var connectedEdges;
    var fromCount;
    var toCount;
    connectedEdges = network.getConnectedEdges(id);
    fromCount = 0;
    toCount = 0;
    for (i = 0; i < connectedEdges.length; i++) {
        edgeDetails = network.body.data.edges.get(connectedEdges[i]);
        if (edgeDetails.from == id)
            fromCount++;
        else if (edgeDetails.to == id)
            toCount++;
    }
    if (fromCount == 1 && toCount == 1) {

        if (amptype) {
            removeSpanInError(id, true);
            removeSpanInError(id, true);
        }
    }
    else {
        if (amptype) {
            removeID = "#spanTF" + id.replace(/\s/g, '');
            $(removeID).remove();
            $(removeID).remove();
        }
    }


}

/**
 * Populate Transceiver component details by node ID.
 * @param {string} nodeID - The ID of the Transceiver component.
 * @param callback - The callback that handles the response.
 */
function transceiverEdit(nodeID, callback) {
    document.getElementById("transceiverMenu").style.display = "none";
    openDrawer('transceiver');
    var nodeDetails = network.body.data.nodes.get(nodeID[nodeID.length - 1]);
    $("#txtTransceiverName").val(nodeDetails.label);
    $("#ddlTransceiverType").val(nodeDetails.transceiver_type);
    if (nodeID.length > 1) {
        $("#divTransName").hide();
        $("#ddlTransceiverType").val('');
        $("#ddlTransceiverType").addClass('input_error');

        var matchCount = 1;
        for (var i = 0; i < nodeID.length - 1; i++) {
            if (network.body.data.nodes.get(nodeID[i]).transceiver_type == nodeDetails.transceiver_type) {
                matchCount++;
            }
        }
        if (matchCount == nodeID.length) {
            if (nodeDetails.transceiver_type) {
                $("#ddlTransceiverType").val(nodeDetails.transceiver_type);
                $("#ddlTransceiverType").removeClass('input_error');
            }
        }

    }
    else {
        $("#divTransName").show();
        if (nodeDetails.transceiver_type) {
            $("#ddlTransceiverType").removeClass('input_error');
        }
        else {
            $("#ddlTransceiverType").addClass('input_error');
        }
    }

    document.getElementById("btnTransceiverUpdate").onclick = updateTransceiver.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseTransceiver").onclick = clearTransceiver.bind(
    );
}

/**
 * Update Transceiver.
 * Update Transceiver label, type by Transceiver ID.
 * @param {string} nodeID - The ID of the Transceiver component
 */
function updateTransceiver(nodeID) {
    removeNodeList = [];
    if (nameLengthValidation("txtTransceiverName")) {
        if (nodeID.length > 1) {
            var preUpdateList = [];
            for (var i = 0; i < nodeID.length; i++) {
                if (network.body.data.nodes.get(nodeID[i]).image == DIR + transceiverJSON.h_image || network.body.data.nodes.get(nodeID[i]).image == DIR + transceiverJSON.fh_image) {
                    var id = nodeID[i];
                    var label = $("#txtTransceiverName").val().trim();
                    var nodeDetails = network.body.data.nodes.get(id);
                    var transceiverType = $("#ddlTransceiverType").val();
                    if (transceiverType == null || transceiverType == "") {
                        showMessage(alertType.Error, 'Please select transceiver type');
                        $("#ddlTransceiverType").addClass('input_error');
                        return;
                    }
                    else
                        $("#ddlTransceiverType").removeClass('input_error');


                    var connectedEdges = network.getConnectedEdges(id);
                    var fromTransType = "";
                    var toTransType = "";
                    var isOk = true;
                    $.each(connectedEdges, function (index, item) {

                        if (!isOk)
                            return;
                        var edgeDetails = network.body.data.edges.get(item);
                        if (edgeDetails.component_type == serviceJSON.component_type) {
                            if (edgeDetails.from == id) {

                                fromTransType = transceiverType;
                                toTransType = network.body.data.nodes.get(edgeDetails.to).transceiver_type;
                            }
                            else if (edgeDetails.to == id) {
                                toTransType = transceiverType;
                                fromTransType = network.body.data.nodes.get(edgeDetails.from).transceiver_type;
                            }

                            if (toTransType != fromTransType) {
                                isOk = false;
                                showMessage(alertType.Error, serviceJSON.component_type + " can be created/updated only between " + transceiverJSON.node_type + " of same type");
                                return;
                            }
                        }

                    });

                    if (isOk) {
                        if (nodeDetails.node_type == transceiverJSON.node_type) {

                            if (nodeID.length > 1) {

                                preUpdateList.push(network.body.data.nodes.get(id));
                                network.body.data.nodes.update({
                                    id: id, transceiver_type: transceiverType
                                });
                                realUpdate_Transceiver(id, "");
                                var tdata = network.body.data.nodes.get(id);
                                removeNodeList.push(tdata);

                            } else {
                                network.body.data.nodes.update({
                                    id: id, label: label, transceiver_type: transceiverType
                                });
                                realUpdate_Transceiver(id, "");
                                var tdata = network.body.data.nodes.get(id);
                                tdata.isUpdate = true;
                                tempUndo.push(tdata);
                            }
                        }
                    }

                }
            }

            if (removeNodeList.length > 0) {
                var updateList = {
                    isMultiple: true,
                    isUpdate: true,
                    preList: preUpdateList,
                    list: removeNodeList
                }
                tempUndo.push(updateList);
            }
        }
        else {
            var id = nodeID[nodeID.length - 1];
            var label = $("#txtTransceiverName").val().trim();
            var nodeDetails = network.body.data.nodes.get(id);
            var transceiverType = $("#ddlTransceiverType").val();
            if (transceiverType == null || transceiverType == "") {
                showMessage(alertType.Error, 'Please select transceiver type');
                $("#ddlTransceiverType").addClass('input_error');
                return;
            }
            else
                $("#ddlTransceiverType").removeClass('input_error');


            var connectedEdges = network.getConnectedEdges(id);
            var fromTransType = "";
            var toTransType = "";
            var isOk = true;
            $.each(connectedEdges, function (index, item) {

                if (!isOk)
                    return;
                var edgeDetails = network.body.data.edges.get(item);
                if (edgeDetails.component_type == serviceJSON.component_type) {
                    if (edgeDetails.from == id) {

                        fromTransType = transceiverType;
                        toTransType = network.body.data.nodes.get(edgeDetails.to).transceiver_type;
                    }
                    else if (edgeDetails.to == id) {
                        toTransType = transceiverType;
                        fromTransType = network.body.data.nodes.get(edgeDetails.from).transceiver_type;
                    }

                    if (toTransType != fromTransType) {
                        isOk = false;
                        showMessage(alertType.Error, serviceJSON.component_type + " can be created/updated only between " + transceiverJSON.node_type + " of same type");
                        return;
                    }
                }

            });

            if (isOk) {
                if (nodeDetails.node_type == transceiverJSON.node_type) {

                    if (nodeID.length > 1) {

                        network.body.data.nodes.update({
                            id: id, transceiver_type: transceiverType
                        });
                        realUpdate_Transceiver(id, "");

                    } else {
                        network.body.data.nodes.update({
                            id: id, label: label, transceiver_type: transceiverType
                        });
                        realUpdate_Transceiver(id, "");
                    }

                    var tdata = network.body.data.nodes.get(id);
                    tdata.isUpdate = true;
                    tempUndo.push(tdata);
                }
            }
        }
        clearTransceiver();
    }

}

/** Clear input/teporary data and other settings. */
function clearTransceiver() {
    $("#txtTransceiverName").val('');
    $("#ddlTransceiverType").val('');
    $("#ddlDataRate").val('');
    closeDrawer('transceiver');
    UnSelectAll();
}

/**
 * Check Transceiver component rules and update check-errors summary.
 * @param {string} id - The ID of Transceiver component.
 * @param {string} rtype - The type of Transceiver component.
 */
function realUpdate_Transceiver(id, rtype) {
    var connectedEges = network.getConnectedEdges(id);
    var tempEdge = [];
    $.each(connectedEges, function (index, item) {
        if (network.body.data.edges.get(item).component_type != serviceJSON.component_type) {
            tempEdge.push(item);
        }
    });

    var fromCount = 0;
    var toCount = 0;
    for (i = 0; i < tempEdge.length; i++) {
        edgeDetails = network.body.data.edges.get(tempEdge[i]);
        if (edgeDetails.from == id)
            fromCount++;
        else if (edgeDetails.to == id)
            toCount++;
    }

    if (fromCount != toCount || (fromCount == 0 && toCount == 0)) {
        //addNodeHighlight(item);
        removeID = "#spanTF" + id.replace(/\s/g, '');
        $(removeID).remove();
    }
    else {
        removeSpanInError(id, true);
    }
}

function deleteNode(nodeList) {
    removeNodeList = [];
    var h_image;
    for (var i = 0; i < nodeList.length; i++) {
        if (nodeList.length > 1) {
            h_image = network.body.data.nodes.get(nodeList[i]).image;

            if (h_image == DIR + roadmJSON.h_image || h_image == DIR + roadmJSON.fh_image)
                removeNodes(nodeList[i], true);
            else if (h_image == DIR + fusedJSON.h_image || h_image == DIR + fusedJSON.fh_image)
                removeNodes(nodeList[i], true);
            else if (h_image == DIR + transceiverJSON.h_image || h_image == DIR + transceiverJSON.fh_image)
                removeNodes(nodeList[i], true);
            else if (h_image == DIR + amplifierJSON.h_image || h_image == DIR + amplifierJSON.fh_image)
                removeNodes(nodeList[i], true);
            else if (h_image == DIR + ramanampJSON.h_image || h_image == DIR + ramanampJSON.fh_image)
                removeNodes(nodeList[i], true);
        }
        else {
            removeNodes(nodeList[i]);
        }
    }

    if (nodeList.length > 1 && removeNodeList.length > 0) {
        var reList = {
            isMultiple: true,
            isUpdate: false,
            list: removeNodeList
        }
        tempUndo.push(reList);
    }

    $("#stepCreateTopology").click();
    UnSelectAll();

}

/**
 * Remove node by node ID.
 * @param {string} nodeID - Component ID.
 * @param {boolean} isMultiple - Remove multiple node.
 */
function removeNodes(nodeID, isMultiple) {
    var nodeDetails = network.body.data.nodes.get(nodeID);
    var node_type = nodeDetails.node_type;
    if (nodeDetails.node_type == ILAJSON.node_type)
        node_type = nodeDetails.amp_category;

    document.getElementById("roadmMenu").style.display = "none";
    document.getElementById("attenuatorMenu").style.display = "none";
    document.getElementById("ILAMenu").style.display = "none";
    document.getElementById("amplifierMenu").style.display = "none";
    document.getElementById("transceiverMenu").style.display = "none";

    if (nodeDetails.node_type == transceiverJSON.node_type || nodeDetails.node_type == roadmJSON.node_type) {
        removeSpanInError(nodeID);
        removeSpanInError(nodeID, true);
    }
    else if (nodeDetails.node_type == amplifierJSON.node_type) {
        if (nodeDetails.amp_category == amplifierJSON.amp_category) {
            removeSpanInError(nodeID);
            removeSpanInError(nodeID, true);
        }
        if (nodeDetails.amp_category == ramanampJSON.amp_category) {
            removeSpanInError(nodeID);
            removeSpanInError(nodeID, true);
            removeSpanInError(nodeID, true);
        }
    }
    else
        removeSpanInError(nodeID);

    if (isMultiple) {
        removeNodeList.push(nodeDetails);
    }
    else {
        nodeDetails.isDelete = true;
        nodeDetails.isUpdate = false;
        tempUndo.push(nodeDetails);
    }

    if (isCopyPara) {
        if (nodeID == copiedNodeID) {
            isCopyPara = false;
            copiedNodeID = "";
        }
    }
    else if (isCopy) {
        if (nodeID == copyID) {
            isCopy = false;
            copyID = "";
        }
    }

    network.body.data.nodes.remove(nodeID);
}

/**
 * Bind pasteNode method.
 * Copy node parameters by selected node ID
 * @param {string} nodeID - Component ID.
 * @param callback - The callback that handles the response.
 */
function copyNode(nodeID, callback) {
    showHideDrawerandMenu();
    isCopy = true;
    copyID = nodeID;
    document.getElementById("btnPasteNode").onclick = pasteNode.bind(
        this,
        nodeID,
        callback

    );
}

/**
 * Create new node by copied node parameters.
 * Node will be placed based on co-ordidates.
 * @param {string} nodeId - Copied node ID.
 */
function pasteNode(nodeId) {
    if (isCopy) {
        isCopy = false;
        var nodeID = token();
        var nodeData = "";
        nodeData = network.body.data.nodes.get(nodeId);
        var nodeDetails = configData.node[nodeData.node_type];
        var node_type = nodeData.node_type;
        var result = nodeName(node_type, nodeData.amp_category);
        nodelength = result.nodeLength
        nodeLabel = result.label
        if (node_type == roadmJSON.node_type) {
            network.body.data.nodes.add({
                id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + roadmJSON.w_image, number: nodelength,
                shape: roadmJSON.shape, color: roadmJSON.color,
                font: roadmJSON.font,
                size: roadmJSON.size,
                view: $("#ddlNetworkView").val(), hidden: false,
                roadm_type: nodeData.roadm_type,
                node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: roadmJSON.component_type,
                roadm_type_pro: []
            });
        }
        else if (node_type == fusedJSON.node_type) {
            network.body.data.nodes.add({
                id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + fusedJSON.w_image, number: nodelength,
                shape: fusedJSON.shape, color: fusedJSON.color,
                size: fusedJSON.size,
                view: $("#ddlNetworkView").val(), hidden: false,
                node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: fusedJSON.component_type,
            });
        }
        else if (node_type == transceiverJSON.node_type) {
            network.body.data.nodes.add({
                id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + transceiverJSON.w_image, number: nodelength,
                shape: transceiverJSON.shape, color: transceiverJSON.color,
                size: transceiverJSON.size,
                view: $("#ddlNetworkView").val(), hidden: false,
                node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: transceiverJSON.component_type,
                transceiver_type: nodeData.transceiver_type
            });
        }
        else if (node_type == ILAJSON.node_type) {

            if (nodeData.amp_category == ILAJSON.amp_category) {
                network.body.data.nodes.add({
                    id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + ILAJSON.w_image, number: nodelength,
                    shape: ILAJSON.shape, color: ILAJSON.color,
                    size: ILAJSON.size,
                    view: $("#ddlNetworkView").val(), hidden: false,
                    node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: ILAJSON.component_type,
                    pre_amp_type: nodeData.pre_amp_type, booster_type: nodeData.booster_type, amp_category: nodeData.amp_category
                });
            }
            else if (nodeData.amp_category == amplifierJSON.amp_category) {
                network.body.data.nodes.add({
                    id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + amplifierJSON.w_image, number: nodelength,
                    shape: amplifierJSON.shape, color: amplifierJSON.color,
                    size: amplifierJSON.size,
                    view: $("#ddlNetworkView").val(), hidden: false,
                    node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: amplifierJSON.component_type,
                    amp_type: nodeData.amp_type, amp_category: nodeData.amp_category
                });
            }
            else if (nodeData.amp_category == ramanampJSON.amp_category) {
                network.body.data.nodes.add({
                    id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + ramanampJSON.w_image, number: nodelength,
                    shape: ramanampJSON.shape, color: ramanampJSON.color,
                    size: ramanampJSON.size,
                    view: $("#ddlNetworkView").val(), hidden: false,
                    node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: ramanampJSON.component_type,
                    amp_type: nodeData.amp_type, amp_category: nodeData.amp_category, category: nodeData.category
                });
            }
        }

        realUpdate();
        document.getElementById("pasteMenu").style.display = "none";
        UnSelectAll();
        $("#stepCreateTopology").click();
        tempUndo.push(network.body.data.nodes.get(nodeID));
    }
}

/**
 * Copy node template by selected node ID.
 * Validate the node template by type, category
 * @param {string} nodeID - The ID of Copied node template.
 * @param callback - The callback that handles the response.
 */
function copyNodeTemplate(nodeID, callback) {
    var isOk = false;
    var nodeDetails = network.body.data.nodes.get(nodeID);
    if (nodeDetails.node_type == roadmJSON.node_type) {
        if (!nodeDetails.roadm_type && nodeDetails.roadm_type == "")
            isOk = true;

    }
    if (nodeDetails.node_type == transceiverJSON.node_type) {
        if (!nodeDetails.transceiver_type && nodeDetails.transceiver_type == "")
            isOk = true;
    }
    if (nodeDetails.node_type == amplifierJSON.node_type) {
        if (nodeDetails.amp_category == amplifierJSON.amp_category) {
            if (!nodeDetails.amp_type && nodeDetails.amp_type == "")
                isOk = true;
        }
        else if (nodeDetails.amp_category == ramanampJSON.amp_category) {
            if ((!nodeDetails.amp_type && nodeDetails.amp_type == "") || (!nodeDetails.category && nodeDetails.category == ""))
                isOk = true;
        }
    }

    if (isOk) {
        showMessage(alertType.Error, "Template is empty");
        return;
    }
    showHideDrawerandMenu();
    isCopyPara = true;
    copiedNodeID = nodeID;
}
function cancelCopyTemplate(nodeId) {
    clearNodeTemplate();
}

/**
 * Apply copied template to specified ROADM node.
 * Check node rules and update check-errors summary.
 * @param {string} nodeID - The ID of the destination node.
 * @param {string} roadm_type - Coponent type.
 */
function applyRoadmTemplate(nodeID, roadm_type) {
    network.body.data.nodes.update({
        id: nodeID, roadm_type: roadm_type
    });
    realUpdate_Roadm(nodeID, roadm_type);
}

/**
 * Apply copied template to specified Transceiver node.
 * Check node rules and update check-errors summary.
 * @param {string} nodeID - The ID of the destination node.
 * @param {string} node_type - Node type.
 * @param {string} trans_type - Transceiver type.
 */
function applyTransceiverTemplate(nodeID, node_type, trans_type) {
    var id = nodeID;
    var connectedEdges = network.getConnectedEdges(id);
    var fromTransType = "";
    var toTransType = "";
    var isOk = true;
    transceiverType = trans_type;
    $.each(connectedEdges, function (index, item) {

        if (!isOk)
            return;
        var edgeDetails = network.body.data.edges.get(item);
        if (edgeDetails.component_type == serviceJSON.component_type) {
            if (edgeDetails.from == id) {

                fromTransType = transceiverType;
                toTransType = network.body.data.nodes.get(edgeDetails.to).transceiver_type;
            }
            else if (edgeDetails.to == id) {
                toTransType = transceiverType;
                fromTransType = network.body.data.nodes.get(edgeDetails.from).transceiver_type;
            }

            if (toTransType != fromTransType) {
                isOk = false;
                showMessage(alertType.Error, serviceJSON.component_type + " can be created/updated only between " + transceiverJSON.node_type + " of same type");
                return;
            }
        }

    });

    if (isOk) {
        if (node_type == transceiverJSON.node_type) {

            network.body.data.nodes.update({
                id: id, transceiver_type: transceiverType
            });
            realUpdate_Transceiver(id, transceiverType);


        }
    }
    return isOk;
}
/// <summary>
/// To apply copied template to specified Amplifier node.
/// Apply node rules.
/// </summary>
function applyAmpTemplate(nodeID, amp_type) {
    network.body.data.nodes.update({
        id: nodeID, amp_type: amp_type
    });
    realUpdate_Amplifier(nodeID, amp_type);
}
/// <summary>
/// To apply copied template to specified Raman Amplifier node.
/// Apply node rules.
/// </summary>
function applyRamanAmpTemplate(nodeID, amp_type, category) {
    network.body.data.nodes.update({
        id: nodeID, amp_type: amp_type, category: category
    });
    realUpdate_RamanAmp(nodeID, amp_type);

}

/**
 * Apply copied template to specified node.
 * Apply node rules.
 * @param {object} nodes - Selected destination nodes for apply template.
 * @param callback - The callback that handles the response.
 */
function applyTemplate(nodes, callback) {
    var isUpdated = false;
    if (isCopyPara) {
        var nodeDetails = network.body.data.nodes.get(copiedNodeID);
        var preUpdateList = [];
        removeNodeList = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodeDetails.node_type == roadmJSON.node_type && network.body.data.nodes.get(nodes[i]).node_type == nodeDetails.node_type) {
                if (nodes.length > 1) {
                    if (network.body.data.nodes.get(nodes[i]).image == DIR + roadmJSON.h_image || network.body.data.nodes.get(nodes[i]).image == DIR + roadmJSON.fh_image) {
                        preUpdateList.push(network.body.data.nodes.get(nodes[i]));
                        applyRoadmTemplate(nodes[i], nodeDetails.roadm_type);
                        removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                    }
                }
                else {
                    applyRoadmTemplate(nodes[i], nodeDetails.roadm_type);
                    var tdata = network.body.data.nodes.get(nodes[i]);
                    tdata.isUpdate = true;
                    tempUndo.push(tdata);
                }
                isUpdated = true;

            }
            else if (nodeDetails.node_type == transceiverJSON.node_type && network.body.data.nodes.get(nodes[i]).node_type == nodeDetails.node_type) {
                if (nodes.length > 1) {
                    if (network.body.data.nodes.get(nodes[i]).image == DIR + transceiverJSON.h_image || network.body.data.nodes.get(nodes[i]).image == DIR + transceiverJSON.fh_image) {
                        var temptrans = network.body.data.nodes.get(nodes[i]);
                        isUpdated = applyTransceiverTemplate(nodes[i], nodeDetails.node_type, nodeDetails.transceiver_type);
                        if (isUpdated) {
                            preUpdateList.push(temptrans);
                            removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                        }
                    }
                }
                else {
                    isUpdated = applyTransceiverTemplate(nodes[i], nodeDetails.node_type, nodeDetails.transceiver_type);
                    var tdata = network.body.data.nodes.get(nodes[i]);
                    tdata.isUpdate = true;
                    tempUndo.push(tdata);
                }
            }
            if (nodeDetails.node_type == amplifierJSON.node_type && network.body.data.nodes.get(nodes[i]).node_type == nodeDetails.node_type) {
                if (nodeDetails.amp_category == amplifierJSON.amp_category && nodeDetails.amp_category == network.body.data.nodes.get(nodes[i]).amp_category) {
                    if (nodes.length > 1) {
                        if (network.body.data.nodes.get(nodes[i]).image == DIR + amplifierJSON.h_image || network.body.data.nodes.get(nodes[i]).image == DIR + amplifierJSON.fh_image) {
                            preUpdateList.push(network.body.data.nodes.get(nodes[i]));
                            applyAmpTemplate(nodes[i], nodeDetails.amp_type);
                            removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                        }
                    }
                    else {
                        applyAmpTemplate(nodes[i], nodeDetails.amp_type);
                        var tdata = network.body.data.nodes.get(nodes[i]);
                        tdata.isUpdate = true;
                        tempUndo.push(tdata);
                    }
                    isUpdated = true;
                }
                else if (nodeDetails.amp_category == ramanampJSON.amp_category && nodeDetails.amp_category == network.body.data.nodes.get(nodes[i]).amp_category) {
                    if (nodes.length > 1) {
                        if (network.body.data.nodes.get(nodes[i]).image == DIR + ramanampJSON.h_image || network.body.data.nodes.get(nodes[i]).image == DIR + ramanampJSON.fh_image) {
                            preUpdateList.push(network.body.data.nodes.get(nodes[i]));
                            applyRamanAmpTemplate(nodes[i], nodeDetails.amp_type, nodeDetails.category);
                            removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                        }
                    }
                    else {
                        applyRamanAmpTemplate(nodes[i], nodeDetails.amp_type, nodeDetails.category);
                        var tdata = network.body.data.nodes.get(nodes[i]);
                        tdata.isUpdate = true;
                        tempUndo.push(tdata);
                    }

                    isUpdated = true;
                }
            }
        }

        if (removeNodeList.length > 0) {
            var updateList = {
                isMultiple: true,
                isUpdate: true,
                preList: preUpdateList,
                list: removeNodeList
            }
            tempUndo.push(updateList);
        }
        clearNodeTemplate();
    }
}

/** Reset the copied template data. */
function clearNodeTemplate() {
    isCopyPara = false;
    copiedNodeID = "";
    UnSelectAll();
    $('#toast').toast('hide');
    document.getElementById("templateMenu").style.display = "none";
    $("#stepCreateTopology").click();
    remove_NodeFiberHighlight();
}

/**
 * Displays node name, type parameter when hover the mouse near the node.
 * @param {object} params - Node details.
 */
function displayNodesHover(params) {
    var nodeDetails = network.body.data.nodes.get(params.node);
    if (nodeDetails.component_type == roadmJSON.component_type) {

        if (nodeDetails.node_type == roadmJSON.node_type) {
            hoverNodeData = "Node type : " + nodeDetails.node_type.toUpperCase() + "\nNode name : " + nodeDetails.label + "\n";
        }
        else if (nodeDetails.node_type == fusedJSON.node_type) {
            hoverNodeData = "Node type : Attenuator \nNode name : " + nodeDetails.label + "\n";
        }
        else if (nodeDetails.node_type == amplifierJSON.node_type) {
            hoverNodeData = "Node type : " + nodeDetails.amp_category + "\nNode name : " + nodeDetails.label + "\n";
        }
        else
            hoverNodeData = "Node type : " + nodeDetails.node_type + "\nNode name : " + nodeDetails.label + "\n";
    }

    $('#hoverDiv').html(htmlTitle(hoverNodeData));
    showHoverDiv(params.event.pageX, params.event.pageY, "hoverDiv");
}

/**
 * Get next level of node label name by node type/amplifer category.
 * @param {string} node_type - Node type.
 * @param {string} amp_category - Amplifier category.
 */
function nodeName(node_type, amp_category) {
    const number = [];
    var nodeList = [];
    var nodeCount = 1;
    var labelName = "";
    var nodeDetails;

    if (amp_category)
        nodeDetails = configData.node[amp_category];
    else
        nodeDetails = configData.node[node_type];

    if ($("#ddlNetworkView").val() == topologyView.Functional_View) {
        labelName = nodeDetails.default.FV_label;
        if (amp_category) {

            if (node_type == ramanampJSON.amp_category) {
                nodeList = network.body.data.nodes.get({
                    filter: function (item) {
                        return (item.node_type == ramanampJSON.node_type && item.amp_category == amp_category && item.view == topologyView.Functional_View);
                    }
                });
            }
            else {
                nodeList = network.body.data.nodes.get({
                    filter: function (item) {
                        return (item.node_type == node_type && item.amp_category == amp_category && item.view == topologyView.Functional_View);
                    }
                });
            }
        }
        else {
            nodeList = network.body.data.nodes.get({
                filter: function (item) {
                    return (item.node_type == node_type && item.view == topologyView.Functional_View);
                }
            });
        }
    }
    else if ($("#ddlNetworkView").val() == topologyView.NE_View) {
        labelName = nodeDetails.default.label;
        if (node_type == transceiverJSON.node_type) {
            nodeList = network.body.data.nodes.get({
                filter: function (item) {
                    return (item.node_type == transceiverJSON.node_type && item.view == topologyView.NE_View);
                }
            });
        }
        else {
            nodeList = network.body.data.nodes.get({
                filter: function (item) {
                    return (item.node_type != transceiverJSON.node_type && item.view == topologyView.NE_View);
                }
            });
        }
    }

    $.each(nodeList, function (index, item) {
        var splitName = item.label.split(' ');
        var checkNumber = Number(splitName[splitName.length - 1]);
        if (checkNumber)
            number.push(checkNumber);
    });

    if (number.length > 0)
        nodeCount = number.sort((f, s) => f - s)[number.length - 1] + 1;

    return { label: labelName + nodeCount, nodeLength: nodeCount };

}

/**
 * Set warning icons to imcompleted node by node ID.
 * Update node size, image by node ID.
 * @param {string} nodeID - Node ID.
 */
function addNodeHighlight(nodeID) {
    var nodeDetails = network.body.data.nodes.get(nodeID);
    if (nodeDetails.node_type == roadmJSON.node_type)
        image = roadmJSON.w_image;
    else if (nodeDetails.node_type == fusedJSON.node_type)
        image = fusedJSON.w_image;
    else if (nodeDetails.node_type == transceiverJSON.node_type)
        image = transceiverJSON.w_image;
    else if (nodeDetails.amp_category == amplifierJSON.amp_category)
        image = amplifierJSON.w_image;
    else if (nodeDetails.amp_category == ramanampJSON.amp_category)
        image = ramanampJSON.w_image;

    network.body.data.nodes.update([{ id: nodeID, size: roadmJSON.size, image: DIR + image }]);
}

