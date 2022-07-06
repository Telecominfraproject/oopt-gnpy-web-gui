/**
 * constraints.js
 * The constraints library a list of rules for components. It is defining the network topology validation.
 */


/**
 * Check connections rules between nodes.
 * @param {string} from - Source node.
 * @param {string} to - Destination node.
 * @param {string} nodeType - Node type.
 */
function nodeRule(from, to, nodeType) {
    var fromConnections = network.getConnectedEdges(from);
    var toConnections = network.getConnectedEdges(to);
    var connections = [];
    connections.push(fromConnections);

    $.each(toConnections, function (index, item) {
        connections.push(item);
    });

    var fromDetails = network.body.data.nodes.get(from);
    var toDetails = network.body.data.nodes.get(to);

    var message = "";
    var flag = false;
    var connectedNodes;
    var fromType;
    var toType;
    //to check connection b/w roadm and amplifier
    if ((fromDetails.node_type == roadmJSON.node_type && toDetails.node_type == nodeType) || (toDetails.node_type == roadmJSON.node_type && fromDetails.node_type == nodeType) || (fromDetails.node_type == transceiverJSON.node_type && toDetails.node_type == nodeType) || (toDetails.node_type == transceiverJSON.node_type && fromDetails.node_type == nodeType)) {
        $.each(connections, function (index, item) {
            connectedNodes = network.getConnectedNodes(item);
            if (connectedNodes) {
                if ((connectedNodes[0] == fromDetails.id && connectedNodes[1] == toDetails.id) || connectedNodes[1] == fromDetails.id && connectedNodes[0] == toDetails.id) {
                    message = "We cannot add more than one " + singleFiberJSON.component_type + "/" + singlePatchJSON.component_type + " connection between " + fromDetails.label + " and " + toDetails.label;
                    flag = true;
                }
            }
        });
    }

    // to check connection b/w amplifier and amplifier
    if (fromDetails.node_type == nodeType && toDetails.node_type == nodeType) {
        $.each(connections, function (index, item) {
            connectedNodes = network.getConnectedNodes(item);
            if (connectedNodes) {
                if ((connectedNodes[0] == fromDetails.id && connectedNodes[1] == toDetails.id) || connectedNodes[1] == fromDetails.id && connectedNodes[0] == toDetails.id) {
                    message = "We cannot add more than one " + singleFiberJSON.component_type + "/" + singlePatchJSON.component_type + " connection between " + fromDetails.label + " and " + toDetails.label;
                    flag = true;
                }
            }
        });
    }

    var edgeDetails;
    var nodetype;
    if (!flag) {
        message = "";
        if (fromDetails.node_type == nodeType) {
            if (fromConnections.length > 1) {
                message = fromDetails.label + ' can only support 2 links, one outgoing, and one incoming. ';
                flag = true;
            }
            else {
                $.each(fromConnections, function (index, item) {
                    edgeDetails = network.body.data.edges.get(item);
                    if (edgeDetails.from == from) {
                        message = 'Links wrongly connected. ';
                        flag = true;
                    }
                });
            }
        }
        if (toDetails.node_type == nodeType) {
            if (toConnections.length > 1) {

                if (message != "")
                    message += "<br /> <br />" + toDetails.label + ' can only support 2 links, one outgoing, and one incoming';
                else
                    message += toDetails.label + ' can only support 2 links, one outgoing, and one incoming';
                flag = true;
            }
            else {
                $.each(toConnections, function (index, item) {
                    edgeDetails = network.body.data.edges.get(item);
                    if (edgeDetails.to == to) {
                        message = 'Links wrongly connected. ';
                        flag = true;
                    }
                });
            }
        }
    }

    return { message: message, flag: flag };
}

/** Check the ROADM, transceiver link and type rules. */
function checkLink() {

    var roadmList = network.body.data.nodes.get({
        filter: function (item) {
            return (item.node_type == roadmJSON.node_type || item.node_type == transceiverJSON.node_type);
        }
    });

    var connectedEdges;
    var fromCount = 0;
    var toCount = 0;
    var edgeDetails;
    var message;
    var flag = false;
    var msg = [];
    var tempEdge = [];
    $.each(roadmList, function (index, item) {
        connectedEdges = network.getConnectedEdges(item.id);

        tempEdge = [];
        $.each(connectedEdges, function (index, item1) {
            if (network.body.data.edges.get(item1).component_type != serviceJSON.component_type)
                tempEdge.push(item1);
        });

        fromCount = 0;
        toCount = 0;
        for (i = 0; i < tempEdge.length; i++) {
            edgeDetails = network.body.data.edges.get(tempEdge[i]);
            if (edgeDetails.from == item.id)
                fromCount++;
            else if (edgeDetails.to == item.id)
                toCount++;
        }

        if (fromCount != toCount || (fromCount == 0 && toCount == 0)) {
            msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> must have an even number of links with an equal number of incoming and outgoing links.</p>');
            flag = true;
        }
        if (item.node_type == transceiverJSON.node_type) {
            if (!item.transceiver_type) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + transceiverJSON.node_type + ' type not entered by the user.</p>');
                flag = true;
            }
        }
        else if (item.node_type == roadmJSON.node_type) {
            if (!item.roadm_type) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + roadmJSON.node_type.toUpperCase() + ' type not entered by the user.</p>');
                flag = true;
            }
        }

    });


    //message = msg.join(' ') + " must have an even number of links with an equal number of incoming and outgoing links";
    message = msg.join(' ');
    return { message: message, flag: flag };
}

/** check the limits of amplifier, attenuator link rules. */
function checkMisLink() {

    var roadmList = network.body.data.nodes.get({
        filter: function (item) {
            return (item.node_type == amplifierJSON.node_type || item.node_type == fusedJSON.node_type);
        }
    });

    var connectedEdges;
    var message;
    var flag = false;
    var msg = [];
    var tempEdge = [];
    var fromCount;
    var toCount;
    $.each(roadmList, function (index, item) {
        connectedEdges = network.getConnectedEdges(item.id);
        fromCount = 0;
        toCount = 0;
        for (i = 0; i < connectedEdges.length; i++) {
            edgeDetails = network.body.data.edges.get(connectedEdges[i]);
            if (edgeDetails.from == item.id)
                fromCount++;
            else if (edgeDetails.to == item.id)
                toCount++;
        }

        //if (fromCount != toCount || (fromCount == 0 && toCount == 0) || fromCount > 1 || toCount > 1 ) {
        //    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\')"><img width="25" src="./Assets/img/error-listing-icon.svg"> One or more links to <b>' + item.label + '</b> is missing.</p>');
        //    flag = true;
        //}
        if (connectedEdges.length <= 1) {
            msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> One or more links to <b>' + item.label + '</b> is missing.</p>');
            flag = true;
        }
        else if (connectedEdges.length > 1) {

            if ((connectedEdges.length == 2 && fromCount == 2) || (connectedEdges.length == 2 && toCount == 2)) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"><b>' + item.label + '</b> cannot support 2 links of the same type, must have one incoming and one outgoing link</p>');
                flag = true;
            }
            else if (fromCount != toCount || connectedEdges.length > 2) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"><b>' + item.label + '</b> cannot support more than 2 links</p>');
                flag = true;
            }
        }

        if (item.node_type == amplifierJSON.node_type) {
            if (item.amp_category == amplifierJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + amplifierJSON.amp_category + ' type not entered by the user.</p>');
                    flag = true;
                }

            }
            else if (item.amp_category == ramanampJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - Raman amplifier type not entered by the user.</p>');
                    flag = true;
                }
                if (!item.category) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - Raman amplifier category not entered by the user.</p>');
                    flag = true;
                }

            }
        }

    });

    message = msg.join(' ');
    return { message: message, flag: flag };
}

/** To check the node type force rules. */
function checkTypeForce() {

    var transList = network.body.data.nodes.get({
        filter: function (item) {
            return (item.node_type == transceiverJSON.node_type || item.node_type == amplifierJSON.node_type || item.node_type == roadmJSON.node_type);
        }
    });

    var message;
    var msg = [];
    var flag = false;
    $.each(transList, function (index, item) {

        if (item.node_type == transceiverJSON.node_type) {
            if (!item.transceiver_type) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + transceiverJSON.node_type + ' type not entered by the user.</p>');
                flag = true;
            }
        }
        else if (item.node_type == roadmJSON.node_type) {
            if (!item.roadm_type) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + roadmJSON.node_type.toUpperCase() + ' type not entered by the user.</p>');
                flag = true;
            }
        }
        else if (item.node_type == amplifierJSON.node_type) {
            if (item.amp_category == amplifierJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + amplifierJSON.amp_category + ' type not entered by the user.</p>');
                    flag = true;
                }

            }
            else if (item.amp_category == ramanampJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - Raman amplifier type not entered by the user.</p>');
                    flag = true;
                }
                if (!item.category) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - Raman amplifier category not entered by the user.</p>');
                    flag = true;
                }
            }
        }



    });

    message = msg.join(' ');
    return { message: message, flag: flag };
}

/** check the fiber properties rules. */
function checkFiberPro() {

    var fiberList = network.body.data.edges.get({
        filter: function (item) {
            return (item.fiber_category == singleFiberJSON.fiber_category);
        }
    });

    var message;
    var msg = [];
    var flag = false;
    var spanlen;
    var span_length;
    $.each(fiberList, function (index, item) {
        span_length = item.span_length;
        spanlen = parseFloat(span_length);
        if (item.fiber_type == "") {
            msg.push('<p class="focusNode" title="Click here to focus the fiber" id=\'spanFP' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',2)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + singleFiberJSON.component_type + ' type not entered by the user.</p>');
            flag = true;
        }
        if (isNaN(span_length) || spanlen <= 0 || span_length == "") {
            msg.push('<p class="focusNode" title="Click here to focus the fiber" id=\'spanFP' + item.id.replace(/\s/g, '') + '\' onClick="focusNodeFiber(\'' + item.id + '\',2)"><img width="25" src="./Assets/img/error-listing-icon.svg"> <b>' + item.label + '</b> - ' + singleFiberJSON.component_type + ' length not entered by the user.</p>');
            flag = true;
        }

    });

    message = msg.join(' ');
    return { message: message, flag: flag };
}

/** Check the node link and type rules on import network JSON file. */
function nodeRuleOnImportJSON() {
    //checkLink
    var roadmList = network.body.data.nodes.get({
        filter: function (item) {
            return (item.node_type == roadmJSON.node_type || item.node_type == transceiverJSON.node_type);
        }
    });

    var connectedEdges;
    var fromCount = 0;
    var toCount = 0;
    var edgeDetails;
    var tempEdge = [];
    $.each(roadmList, function (index, item) {
        connectedEdges = network.getConnectedEdges(item.id);
        tempEdge = [];
        $.each(connectedEdges, function (index, item1) {
            if (network.body.data.edges.get(item1).component_type != serviceJSON.component_type)
                tempEdge.push(item1);
        });
        fromCount = 0;
        toCount = 0;
        for (i = 0; i < tempEdge.length; i++) {
            edgeDetails = network.body.data.edges.get(tempEdge[i]);
            if (edgeDetails.from == item.id)
                fromCount++;
            else if (edgeDetails.to == item.id)
                toCount++;
        }

        if (fromCount != toCount || (fromCount == 0 && toCount == 0)) {
            addNodeHighlight(item.id);
        }
        else {
            if (item.node_type == transceiverJSON.node_type && item.transceiver_type == "") {
                addNodeHighlight(item.id);
            }
            else if (item.node_type == roadmJSON.node_type && item.roadm_type == "") {
                addNodeHighlight(item.id);
            }
        }

    });

    //checkMisLink

    roadmList = network.body.data.nodes.get({
        filter: function (item) {
            return (item.node_type == amplifierJSON.node_type || item.node_type == fusedJSON.node_type);
        }
    });

    $.each(roadmList, function (index, item) {
        connectedEdges = network.getConnectedEdges(item.id);

        fromCount = 0;
        toCount = 0;
        for (i = 0; i < connectedEdges.length; i++) {
            edgeDetails = network.body.data.edges.get(connectedEdges[i]);
            if (edgeDetails.from == item.id)
                fromCount++;
            else if (edgeDetails.to == item.id)
                toCount++;
        }

        if (fromCount != toCount || (fromCount == 0 && toCount == 0) || fromCount > 1 || toCount > 1) {
            addNodeHighlight(item.id);
        }
        else {
            if (item.node_type == amplifierJSON.node_type) {
                if (item.amp_category == ramanampJSON.amp_category && item.amp_type == "" && !(item.category)) {
                    addNodeHighlight(item.id);
                }
                else if (item.amp_category == amplifierJSON.amp_category && item.amp_type == "") {
                    addNodeHighlight(item.id);
                }
            }

        }
    });
}

/** Set fiber/patch/service smooth while on import network JSON file. */
function edgeStyleOnImportJSON() {
    var edgeList = network.body.data.edges.get();
    var cfrom;
    var cto;
    var fiberData = [];
    for (var i = 0; i < edgeList.length; i++) {

        cfrom = edgeList[i].from;
        cto = edgeList[i].to;

        var connectedFiber = network.getConnectedEdges(cfrom);
        connectedFiber.push(network.getConnectedEdges(cto));
        var fromFiberCount = 0;
        var toFiberCount = 0;
        var fiberCount = 0;

        $.each(connectedFiber, function (index, item) {
            var fiberDetails = network.body.data.edges.get(item);
            if (fiberDetails.fiber_category == dualFiberJSON.fiber_category || fiberDetails.fiber_category == singleFiberJSON.fiber_category || fiberDetails.component_type == serviceJSON.component_type || fiberDetails.component_type == dualPatchJSON.component_type) {
                var fiberSmooth = singleFiberJSON.options.smooth;
                if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                    fiberCount++;

                    if (fiberCount == 1) {
                        fiberSmooth = fiberJSON.options.smooth;
                    }
                    else {
                        fromFiberCount++;
                        fiberSmooth.roundness = "0." + fromFiberCount;
                    }
                    network.body.data.edges.update({
                        id: fiberDetails.id, smooth: fiberSmooth

                    });
                }
                if (fiberDetails.from == cto && fiberDetails.to == cfrom) {
                    fiberCount++;
                    fiberSmooth.roundness = "0." + toFiberCount;
                    if (fiberCount == 1) {
                        fiberSmooth = fiberJSON.options.smooth;
                    }
                    else {
                        toFiberCount++;
                        fiberSmooth.roundness = "0." + toFiberCount;
                    }
                    network.body.data.edges.update({
                        id: fiberDetails.id, smooth: fiberSmooth

                    });
                }
            }
        });

    }
}

/**
 * Check the node connections and fiber/patch/service rules on import network JSON file.
 * @param {string} cfrom - Source node.
 * @param {string} cto - Destination node.
 */
function nodeValidationInEdge(cfrom, cto) {
    // start remove highlight once roadm have equal in/out conn
    var roadmList = [];

    if (network.body.data.nodes.get(cfrom).node_type == roadmJSON.node_type)
        roadmList.push(cfrom);

    if (network.body.data.nodes.get(cto).node_type == roadmJSON.node_type)
        roadmList.push(cto);

    var connectedEdges;
    var fromCount = 0;
    var toCount = 0;
    var edgeDetails;
    $.each(roadmList, function (index, item) {
        connectedEdges = network.getConnectedEdges(item);
        fromCount = 0;
        toCount = 0;
        for (i = 0; i < connectedEdges.length; i++) {
            edgeDetails = network.body.data.edges.get(connectedEdges[i]);
            if (edgeDetails.from == item)
                fromCount++;
            else if (edgeDetails.to == item)
                toCount++;
        }

        if (fromCount != toCount || (fromCount == 0 && toCount == 0)) {
            addNodeHighlight(item);
        }
        else {
            if (network.body.data.nodes.get(item).roadm_type != "") {
                removeSpanInError(item, true);
                removeSpanInError(item);
            }
            else {
                var removeID = "#span" + item.replace(/\s/g, '');
                $(removeID).remove();
            }

        }

    });
    // end

    //start mislink
    roadmList = [];
    if (network.body.data.nodes.get(cfrom).node_type == fusedJSON.node_type || network.body.data.nodes.get(cfrom).node_type == amplifierJSON.node_type)
        roadmList.push(cfrom);

    if (network.body.data.nodes.get(cto).node_type == fusedJSON.node_type || network.body.data.nodes.get(cto).node_type == amplifierJSON.node_type)
        roadmList.push(cto);


    $.each(roadmList, function (index, item) {
        connectedEdges = network.getConnectedEdges(item);
        fromCount = 0;
        toCount = 0;
        for (i = 0; i < connectedEdges.length; i++) {
            edgeDetails = network.body.data.edges.get(connectedEdges[i]);
            if (edgeDetails.from == item)
                fromCount++;
            else if (edgeDetails.to == item)
                toCount++;
        }

        if (fromCount != toCount || (fromCount == 0 && toCount == 0) || fromCount > 1 || toCount > 1) {
            addNodeHighlight(item);
        }
        else {

            if (network.body.data.nodes.get(item).node_type == amplifierJSON.node_type) {


                if (network.body.data.nodes.get(item).amp_category == amplifierJSON.amp_category) {
                    if (network.body.data.nodes.get(item).amp_type != "") {
                        removeSpanInError(item, true);
                        removeSpanInError(item);
                    }
                    else {
                        var removeID = "#span" + item.replace(/\s/g, '');
                        $(removeID).remove();
                    }
                }
                else if (network.body.data.nodes.get(item).amp_category == ramanampJSON.amp_category) {
                    if (network.body.data.nodes.get(item).amp_type != "" && (network.body.data.nodes.get(item).category)) {
                        removeSpanInError(item, true);
                        removeSpanInError(item);
                    }
                    else {
                        var removeID = "#span" + item.replace(/\s/g, '');
                        $(removeID).remove();
                    }
                }
            }
            else {
                removeSpanInError(item);
            }
        }
    });
    //
    // start remove highlight once transceiver have equal in/out conn
    var tempEdge = [];
    roadmList = [];
    if (network.body.data.nodes.get(cfrom).node_type == transceiverJSON.node_type)
        roadmList.push(cfrom);

    if (network.body.data.nodes.get(cto).node_type == transceiverJSON.node_type)
        roadmList.push(cto);

    $.each(roadmList, function (index, item) {
        connectedEdges = network.getConnectedEdges(item);
        tempEdge = [];
        $.each(connectedEdges, function (index, item1) {
            if (network.body.data.edges.get(item1).component_type != serviceJSON.component_type)
                tempEdge.push(item1);
        });
        fromCount = 0;
        toCount = 0;
        for (i = 0; i < tempEdge.length; i++) {
            edgeDetails = network.body.data.edges.get(tempEdge[i]);
            if (edgeDetails.from == item)
                fromCount++;
            else if (edgeDetails.to == item)
                toCount++;
        }

        if (fromCount != toCount || (fromCount == 0 && toCount == 0)) {
            addNodeHighlight(item);
        }
        else {
            //removeSpanInError(item);
            if (network.body.data.nodes.get(item).transceiver_type != "") {
                removeSpanInError(item, true);
                removeSpanInError(item);
            }
            else {
                var removeID = "#span" + item.replace(/\s/g, '');
                $(removeID).remove();
            }

        }
    });
    // end

    realUpdate();
    checkErrorFree();

    //end
}
