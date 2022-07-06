var addEdgeData = {
    from: '',
    to: ''
};
var isSingleFiberMode = 0;
var isDualFiberMode = 0;
function dualFiberMode() {
    UnSelectAll();
    isDualFiberMode = 1;
    isSingleFiberMode = 0;
    isAddService = 0;
    isSinglePatchMode = 0;
    isDualPatchMode = 0;
    addEdgeData = {
        from: '',
        to: ''
    };
}
/**
 * Enable settings for fiber and reset other settings.
 * Set fiber 1 = enable, 0 = disable.
 */
function singleFiberMode() {
    UnSelectAll();
    isSingleFiberMode = 1;
    isDualFiberMode = 0;
    isAddService = 0;
    isDualPatchMode = 0;
    isSinglePatchMode = 0;
    addEdgeData = {
        from: '',
        to: ''
    };
}

/** Check connections rule for dual fiber not single fiber before add it. */
function addFiber() {
    var srcNode = network.body.data.nodes.get(addEdgeData.from);
    var DestNode = network.body.data.nodes.get(addEdgeData.to);
    var isSrcOk = false;
    var isDestOk = false;
    //to restrict pre amp and boost amp on dualfiber connection
    if (isDualFiberMode == 1) {
        var msg = "";
        if (srcNode.amp_category == amplifierJSON.amp_category) {
            msg = srcNode.amp_category + " type : " + srcNode.label + " to ";
        }
        else {
            isSrcOk = true;
            if (srcNode.amp_category)
                msg = srcNode.amp_category + " type : " + srcNode.label + " to ";
            else
                msg = srcNode.node_type + " type : " + srcNode.label + " to ";
        }
        if (DestNode.amp_category == amplifierJSON.amp_category) {
            msg += DestNode.amp_category + " type : " + DestNode.label;
        }
        else {
            isDestOk = true;
            msg += DestNode.node_type + " type : " + DestNode.label;
        }

        if (!isSrcOk || !isDestOk) {
            showMessage(alertType.Error, "<p>Cannot add " + dualFiberJSON.fiber_category + " from " + msg + '</p>');
            addEdgeData = {
                from: '',
                to: ''
            };
            UnSelectAll();
            return;
        }
    }

    var labelvalue = getLabel(addEdgeData.from, addEdgeData.to, singleFiberJSON.component_type);
    var textvalue = roadmJSON.node_type + "- [ " + network.body.data.nodes.get(addEdgeData.from).label + ' - ' + network.body.data.nodes.get(addEdgeData.to).label + " ]";
    addFiberComponent(1, addEdgeData.from, addEdgeData.to, labelvalue, textvalue, false);
    addEdgeData = {
        from: '',
        to: ''
    };
    UnSelectAll();
    network.addEdgeMode();
}

/**
 * Fiber creation.
 * Fiber style and configuration data loaded from configurationdata, styledata json.
 * Check connections rules.
 * @param {number} cmode - Fiber mode 1 for add.
 * @param {string} cfrom - Source node ID.
 * @param {string} cto - Destination node ID.
 * @param {string} clabel - The Label of the service.
 * @param {string} ctext - The Text of the service.
 * @param {boolean} isImport - false -> manual add, true -> automattically added while import json.
 */
function addFiberComponent(cmode, cfrom, cto, clabel, ctext, isImport) {
    if (cmode == 1) {

        var nodeDetails = network.body.data.nodes.get(cfrom);
        var toNodeDetails = network.body.data.nodes.get(cto);
        var fiberID = token();
        //amplifier and attenuator fiber connection conditions - max limit 2
        if (isDualFiberMode == 1)//removed restriction for single fiber mode, so check fiber mode
        {
            //add roadm list for from roadm node or ILA
            if (nodeDetails.node_type == roadmJSON.node_type || nodeDetails.amp_category == ILAJSON.amp_category) {
                arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];

                var roadm_label = "";
                var roadm_type = "";
                var pre_amp_type = "";
                var booster_type = "";
                if (nodeDetails.node_type == roadmJSON.node_type) {
                    roadm_label = ctext;
                    var roadm_config = configData.node[nodeDetails.node_type].default;
                    roadm_type = roadm_config.roadm_type;
                    pre_amp_type = roadm_config.pre_amp_type;
                    booster_type = roadm_config.booster_type;
                }
                if (nodeDetails.amp_category == ILAJSON.amp_category) {
                    roadm_label = ILAJSON.amp_category + "- [ " + network.body.data.nodes.get(cfrom).label + ' - ' + network.body.data.nodes.get(cto).label + " ]";;
                    var ILA_config = configData.node[nodeDetails.amp_category].default;
                    roadm_type = "";
                    pre_amp_type = ILA_config.pre_amp_type;//Amp A
                    booster_type = ILA_config.booster_type;//Amp B
                }

                var roadmTypePro = {
                    roadm_fiber_id: fiberID,
                    roadm_label: roadm_label,
                    roadm_type: roadm_type,
                    pre_amp_type: pre_amp_type,
                    booster_type: booster_type
                };

                arrRoadmTypePro.push(roadmTypePro);
                network.body.data.nodes.update({
                    id: cfrom, roadm_type_pro: arrRoadmTypePro
                });
            }
            //add roadm list to to roadm node or ILA
            if (toNodeDetails.node_type == roadmJSON.node_type || toNodeDetails.amp_category == ILAJSON.amp_category) {
                arrRoadmTypePro = toNodeDetails.roadm_type_pro ? toNodeDetails.roadm_type_pro : [];

                var roadm_label = "";
                var roadm_type = "";
                var pre_amp_type = "";
                var booster_type = "";
                if (toNodeDetails.node_type == roadmJSON.node_type) {
                    roadm_label = roadmJSON.node_type + "- [ " + network.body.data.nodes.get(cto).label + ' - ' + network.body.data.nodes.get(cfrom).label + " ]";
                    var roadm_config = configData.node[toNodeDetails.node_type].default;
                    roadm_type = roadm_config.roadm_type;
                    pre_amp_type = roadm_config.pre_amp_type;
                    booster_type = roadm_config.booster_type;
                }
                if (toNodeDetails.amp_category == ILAJSON.amp_category) {
                    roadm_label = ILAJSON.amp_category + "- [ " + network.body.data.nodes.get(cto).label + ' - ' + network.body.data.nodes.get(cfrom).label + " ]";;
                    var ILA_config = configData.node[toNodeDetails.amp_category].default;
                    roadm_type = "";
                    pre_amp_type = ILA_config.pre_amp_type;//Amp A
                    booster_type = ILA_config.booster_type;//Amp B
                }

                var roadmTypePro = {
                    roadm_fiber_id: fiberID,
                    roadm_label: roadm_label,
                    roadm_type: roadm_type,
                    pre_amp_type: pre_amp_type,
                    booster_type: booster_type
                };

                arrRoadmTypePro.push(roadmTypePro);
                network.body.data.nodes.update({
                    id: cto, roadm_type_pro: arrRoadmTypePro
                });
            }

            if (nodeDetails.node_type == fusedJSON.node_type || nodeDetails.node_type == ILAJSON.node_type || toNodeDetails.node_type == fusedJSON.node_type || toNodeDetails.node_type == ILAJSON.node_type) {
                var connectedEdges = network.getConnectedEdges(cfrom);
                var fromCount = network.getConnectedEdges(cfrom).length;
                var toCount = network.getConnectedEdges(cto).length;
                var fromDegree = configData.node[nodeDetails.node_type].default.node_degree;
                var toDegree = configData.node[toNodeDetails.node_type].default.node_degree;
                var msg = "";
                var isLimit = false;
                if (fromCount >= fromDegree) {
                    isLimit = true;
                    if (nodeDetails.node_type == fusedJSON.node_type) {
                        msg = 'Attenuator ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' cannot have more than ' + fromDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    }
                    else if (nodeDetails.node_type == ILAJSON.node_type) {
                        msg = nodeDetails.amp_category + ' ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' cannot have more than ' + fromDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    }

                }
                if (toCount >= toDegree) {
                    if (isLimit)
                        msg += " and ";
                    isLimit = true;
                    if (toNodeDetails.node_type == fusedJSON.node_type) {
                        msg += 'Attenuator ' + roadmJSON.component_type + ' : ' + toNodeDetails.label + ' cannot have more than ' + toDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    }
                    else if (toNodeDetails.node_type == ILAJSON.node_type) {
                        msg += toNodeDetails.amp_category + ' ' + roadmJSON.component_type + ' : ' + toNodeDetails.label + ' cannot have more than ' + toDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    }
                }

                if (isLimit) {
                    showMessage(alertType.Error, msg);
                    return;
                }
            }
        }
        //end

        var fiberSmooth = multipleFiberService1(cfrom, cto);
        if (!fiberSmooth)
            fiberSmooth = fiberJSON.options.smooth;

        var elabel = "";
        if (isDualFiberMode == 1) {
            var fiber_config = configData[dualFiberJSON.fiber_category.replace(' ', '')].default;
            clabel = countFiberService(true, false, false, false, cfrom, cto) + '-' + clabel;
            elabel = clabel;
            network.body.data.edges.add({
                id: fiberID, from: cfrom, to: cto, label: elabel, text: clabel, dashes: dualFiberJSON.dashes, fiber_category: dualFiberJSON.fiber_category,
                component_type: dualFiberJSON.component_type, color: dualFiberJSON.options.color, background: dualFiberJSON.options.background,
                arrows: dualFiberJSON.options.arrows,
                smooth: fiberSmooth,
                width: dualFiberJSON.width,
                view: topologyView.NE_View, hidden: false,
                fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
                loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,
                RxToTxFiber: {
                    from: cto, to: cfrom, label: clabel, text: clabel, fiber_category: dualFiberJSON.fiber_category,
                    component_type: dualFiberJSON.component_type,
                    fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
                    loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,
                }

            });
        }
        if (isSingleFiberMode == 1) {
            var flag = false;
            var message = [];
            var response = nodeRule(cfrom, cto, amplifierJSON.node_type);
            if (response.flag) {
                flag = true
                message.push(response.message);
            }
            response = nodeRule(cfrom, cto, fusedJSON.node_type);
            if (response.flag) {
                flag = true;
                message.push(response.message);
            }

            if (flag) {
                showMessage(alertType.Error, message.join('. <br /><br /> '));
                return;
            }

            var fiber_config = configData[singleFiberJSON.fiber_category.replace(' ', '')].default;
            if (!isImport)
                clabel = countFiberService(false, true, false, false, cfrom, cto) + '-' + clabel;
            elabel = clabel;
            var span_Length = fiber_config.Span_length;
            var loss_Coefficient = fiber_config.Loss_coefficient;
            var span_Loss = fiber_config.Span_loss;
            var fiber_Type = fiber_config.fiber_type;
            var connector_IN = fiber_config.Connector_in;
            var connector_OUT = fiber_config.Connector_out;

            if (isImport) {
                span_Length = tSpanLength;
                loss_Coefficient = loss_Coefficient;
                span_Loss = parseFloat(span_Length * loss_Coefficient);
                fiber_Type = tType;
                connector_IN = tConnector_in;
                connector_OUT = tConnector_out;

            }
            network.body.data.edges.add({
                id: fiberID, from: cfrom, to: cto, label: elabel, text: clabel,
                view: topologyView.Functional_View, hidden: false,
                dashes: singleFiberJSON.dashes, fiber_category: singleFiberJSON.fiber_category,
                component_type: singleFiberJSON.component_type,
                color: singleFiberJSON.options.w_color,
                width: singleFiberJSON.width,
                background: singleFiberJSON.options.background,
                arrows: singleFiberJSON.options.arrows,
                //font: singleFiberJSON.options.font,
                smooth: fiberSmooth,
                fiber_type: fiber_Type, span_length: span_Length,
                loss_coefficient: loss_Coefficient, connector_in: connector_IN, connector_out: connector_OUT,
                span_loss: span_Loss
            });

            realUpdate();
            nodeValidationInEdge(cfrom, cto);
        }

        multipleFiberService(cfrom, cto);
        var tedge = network.body.data.edges.get(fiberID);
        tedge.isUpdate = false;
        tempUndo.push(tedge);
    }
}

function dualFiberInsertNode(fiberID, node_type, callback) {
    var fiberDetails = network.body.data.edges.get(fiberID);
    var fromNode = network.body.nodes[fiberDetails.from];
    var toNode = network.body.nodes[fiberDetails.to];

    var newX = (fromNode.x + toNode.x) / 2;
    var newY = network.body.edges[fiberID].labelModule.size.yLine;
    insertNodeX = newX;
    insertNodeY = newY;

    var nodeID = token();
    nodeDetails = configData.node[node_type];

    var result = nodeName(node_type, nodeDetails.default.amp_category);

    var nodelength = result.nodeLength;
    var nodeLabel = result.label;

    var fiberStyle = network.body.data.edges.get(fiberID);
    var smooth = fiberStyle.smooth;
    var fiberDetails = network.body.data.edges.get(fiberID);
    if (node_type == roadmJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + roadmJSON.image, number: nodelength,
            shape: roadmJSON.shape, color: roadmJSON.color,
            font: roadmJSON.font,
            size: roadmJSON.size,
            view: $("#ddlNetworkView").val(), hidden: false,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: roadmJSON.component_type,
        });
    }
    else if (node_type == fusedJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + fusedJSON.image, number: nodelength,
            shape: fusedJSON.shape, color: fusedJSON.color,
            size: fusedJSON.size,
            view: $("#ddlNetworkView").val(), hidden: false,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: fusedJSON.component_type,
        });
    }
    else if (node_type == transceiverJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + transceiverJSON.image, number: nodelength,
            shape: transceiverJSON.shape, color: transceiverJSON.color,
            size: transceiverJSON.size,
            view: $("#ddlNetworkView").val(), hidden: false,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: transceiverJSON.component_type,
            transceiver_type: nodeDetails.transceiver_type
        });
    }
    else if (node_type == ILAJSON.amp_category) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + ILAJSON.image, number: nodelength,
            shape: ILAJSON.shape, color: ILAJSON.color,
            size: ILAJSON.size,
            view: $("#ddlNetworkView").val(), hidden: false,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: ILAJSON.component_type,
            pre_amp_type: nodeDetails.default.pre_amp_type, booster_type: nodeDetails.default.booster_type, amp_category: nodeDetails.default.amp_category
        });
    }
    network.body.data.edges.remove(fiberID);
    var labelvalue = dualFiberJSON.component_type + " " + network.body.data.nodes.get(fiberDetails.from).number + ' - ' + network.body.data.nodes.get(nodeID).number;
    labelvalue = countFiberService(true, false, false, false, fiberDetails.from, nodeID) + '-' + labelvalue;
    var elabel = "";
    elabel = labelvalue;

    network.body.data.edges.add({
        id: fiberID, from: fiberDetails.from, to: nodeID, label: elabel, text: labelvalue, dashes: dualFiberJSON.dashes, fiber_category: dualFiberJSON.fiber_category,
        component_type: dualFiberJSON.component_type, color: dualFiberJSON.options.color, background: dualFiberJSON.options.background,
        arrows: dualFiberJSON.options.arrows,
        smooth: smooth,
        width: dualFiberJSON.width,
        view: $("#ddlNetworkView").val(), hidden: false,
        fiber_type: fiberDetails.fiber_type, span_length: fiberDetails.span_length,
        loss_coefficient: fiberDetails.loss_coefficient, connector_in: fiberDetails.connector_in, connector_out: fiberDetails.connector_out, span_loss: fiberDetails.span_loss,
        RxToTxFiber: {
            from: nodeID, to: fiberDetails.from, fiber_category: fiberDetails.fiber_category, component_type: fiberDetails.component_type,
            label: labelvalue, fiber_type: fiberDetails.RxToTxFiber.fiber_type, span_length: fiberDetails.RxToTxFiber.span_length,
            loss_coefficient: fiberDetails.RxToTxFiber.loss_coefficient, connector_in: fiberDetails.RxToTxFiber.connector_in, connector_out: fiberDetails.RxToTxFiber.connector_out, span_loss: fiberDetails.RxToTxFiber.span_loss,
        }

    });

    //add roadm list for left side fiber - new node
    if (node_type == roadmJSON.node_type || node_type == ILAJSON.amp_category) {

        var textvalue = node_type.toUpperCase() + "- [ " + nodeLabel + ' - ' + network.body.data.nodes.get(fiberDetails.from).label + " ]";
        arrRoadmTypePro = [];
        var roadm_label = textvalue;
        var roadm_config = configData.node[node_type].default;

        var roadm_type = "";
        if (roadm_config.roadm_type)
            roadm_type = roadm_config.roadm_type;

        var pre_amp_type = roadm_config.pre_amp_type;
        var booster_type = roadm_config.booster_type;

        var roadmTypePro = {
            roadm_fiber_id: fiberID,
            roadm_label: roadm_label,
            roadm_type: roadm_type,
            pre_amp_type: pre_amp_type,
            booster_type: booster_type
        };

        arrRoadmTypePro.push(roadmTypePro);

        network.body.data.nodes.update({
            id: nodeID, roadm_type_pro: arrRoadmTypePro
        });

    }
    var newFiberID = token();
    labelvalue = dualFiberJSON.component_type + " " + network.body.data.nodes.get(nodeID).number + ' - ' + network.body.data.nodes.get(fiberDetails.to).number;
    labelvalue = countFiberService(true, false, false, false, nodeID, fiberDetails.to) + '-' + labelvalue;
    elabel = labelvalue;
    var fiber_config = configData[dualFiberJSON.fiber_category.replace(' ', '')].default;
    network.body.data.edges.add({
        id: newFiberID, from: nodeID, to: fiberDetails.to, label: elabel, text: labelvalue, dashes: dualFiberJSON.dashes, fiber_category: dualFiberJSON.fiber_category,
        component_type: dualFiberJSON.component_type, color: dualFiberJSON.options.color, background: dualFiberJSON.options.background,
        arrows: dualFiberJSON.options.arrows,
        smooth: smooth,
        width: dualFiberJSON.width,
        view: $("#ddlNetworkView").val(), hidden: false,
        fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
        loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,

        RxToTxFiber: {
            from: fiberDetails.to, to: nodeID, fiber_category: fiberDetails.fiber_category, component_type: fiberDetails.component_type,
            label: labelvalue,
            fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
            loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,
        }

    });


    //add roadm list for newly added fiber right side - new node
    nodeDetails = network.body.data.nodes.get(nodeID);
    if (node_type == roadmJSON.node_type || node_type == ILAJSON.amp_category) {
        var textvalue = node_type.toUpperCase() + "- [ " + nodeLabel + ' - ' + network.body.data.nodes.get(fiberDetails.to).label + " ]";
        arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
        var roadm_label = textvalue;
        var roadm_config = configData.node[node_type].default;
        var roadm_type = "";
        if (roadm_config.roadm_type)
            roadm_type = roadm_config.roadm_type;

        var pre_amp_type = roadm_config.pre_amp_type;
        var booster_type = roadm_config.booster_type;

        var roadmTypePro = {
            roadm_fiber_id: newFiberID,
            roadm_label: roadm_label,
            roadm_type: roadm_type,
            pre_amp_type: pre_amp_type,
            booster_type: booster_type
        };

        arrRoadmTypePro.push(roadmTypePro);

        network.body.data.nodes.update({
            id: nodeID, roadm_type_pro: arrRoadmTypePro
        });

    }

    //add roadm list for right side roadm node
    nodeDetails = network.body.data.nodes.get(fiberDetails.to);
    if (nodeDetails.node_type == roadmJSON.node_type || nodeDetails.amp_category == ILAJSON.amp_category) {
        var textvalue = "";
        var roadm_config = "";
        var roadm_type = "";

        if (nodeDetails.node_type == roadmJSON.node_type) {
            textvalue = nodeDetails.node_type.toUpperCase() + "- [ " + network.body.data.nodes.get(fiberDetails.to).label + ' - ' + nodeLabel + " ]";
            roadm_config = configData.node[nodeDetails.node_type].default;
            roadm_type = roadm_config.roadm_type;
        }
        if (nodeDetails.amp_category == ILAJSON.amp_category) {
            textvalue = nodeDetails.amp_category.toUpperCase() + "- [ " + network.body.data.nodes.get(fiberDetails.to).label + ' - ' + nodeLabel + " ]";
            roadm_config = configData.node[nodeDetails.amp_category].default;
        }

        arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
        var roadm_label = textvalue;

        var pre_amp_type = roadm_config.pre_amp_type;
        var booster_type = roadm_config.booster_type;

        var roadmTypePro = {
            roadm_fiber_id: newFiberID,
            roadm_label: roadm_label,
            roadm_type: roadm_type,
            pre_amp_type: pre_amp_type,
            booster_type: booster_type
        };

        arrRoadmTypePro.push(roadmTypePro);

        network.body.data.nodes.update({
            id: fiberDetails.to, roadm_type_pro: arrRoadmTypePro
        });

    }

    document.getElementById("dualFiberMenu").style.display = "none";
    enableEdgeIndicator();
}

/**
 * Insert a node (ROADM/Attenuator/Amplifier/Raman Amplifier) in the middle of selected fiber.
 * @param {string} fiberID - Selected fiber ID
 * @param {string} node_type - Type of node.
 * @param callback - The callback that handles the response..
 */
function singleFiberInsertNode(fiberID, node_type, callback) {

    var fiberDetails = network.body.data.edges.get(fiberID);
    var fromNode = network.body.nodes[fiberDetails.from];
    var toNode = network.body.nodes[fiberDetails.to];

    var newX = (fromNode.x + toNode.x) / 2;
    var newY = network.body.edges[fiberID].labelModule.size.yLine;
    insertNodeX = newX;
    insertNodeY = newY;

    var nodeID = token();
    nodeDetails = configData.node[node_type];

    var result = nodeName(node_type, nodeDetails.default.amp_category);

    var nodelength = result.nodeLength;
    var nodeLabel = result.label;

    var fiberStyle = network.body.data.edges.get(fiberID);
    var smooth = fiberStyle.smooth;
    var fiberDetails = network.body.data.edges.get(fiberID);
    if (node_type == roadmJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + roadmJSON.w_image, number: nodelength,
            shape: roadmJSON.shape, color: roadmJSON.color,
            font: roadmJSON.font,
            size: roadmJSON.size,
            view: $("#ddlNetworkView").val(), hidden: false,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: roadmJSON.component_type,
            roadm_type: nodeDetails.default.roadm_type
        });
    }
    else if (node_type == fusedJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + fusedJSON.image, number: nodelength,
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
            transceiver_type: nodeDetails.transceiver_type
        });
    }
    else if (node_type == amplifierJSON.amp_category) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + amplifierJSON.w_image, number: nodelength,
            shape: amplifierJSON.shape, color: amplifierJSON.color,
            size: amplifierJSON.size,
            view: $("#ddlNetworkView").val(), hidden: false,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: amplifierJSON.component_type,
            pre_amp_type: nodeDetails.default.pre_amp_type, booster_type: nodeDetails.default.booster_type, amp_category: nodeDetails.default.amp_category
        });
    }
    else if (node_type == ramanampJSON.amp_category) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + ramanampJSON.w_image, number: nodelength,
            shape: ramanampJSON.shape, color: ramanampJSON.color,
            size: ramanampJSON.size,
            view: $("#ddlNetworkView").val(), hidden: false,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: ramanampJSON.component_type,
            amp_type: nodeDetails.default.amp_type,
            amp_category: nodeDetails.default.amp_category,
            category: nodeDetails.default.category
        });
    }

    network.body.data.edges.remove(fiberID);
    var labelvalue = getLabel(fiberDetails.from, nodeID, singleFiberJSON.component_type);
    labelvalue = countFiberService(false, true, false, false, fiberDetails.from, nodeID) + '-' + labelvalue;
    var elabel = "";
    elabel = labelvalue;

    var tempcolor;

    if (fiberDetails.fiber_type != null && parseFloat(fiberDetails.span_length) > 0)
        tempcolor = singleFiberJSON.options.color;
    else
        tempcolor = singleFiberJSON.options.w_color;

    network.body.data.edges.add({
        id: fiberID, from: fiberDetails.from, to: nodeID, label: elabel, text: labelvalue, dashes: singleFiberJSON.dashes, fiber_category: singleFiberJSON.fiber_category,
        component_type: singleFiberJSON.component_type, color: tempcolor, background: singleFiberJSON.options.background,
        arrows: singleFiberJSON.options.arrows,
        smooth: smooth,
        width: singleFiberJSON.width,
        view: $("#ddlNetworkView").val(), hidden: false,
        fiber_type: fiberDetails.fiber_type, span_length: fiberDetails.span_length,
        loss_coefficient: fiberDetails.loss_coefficient, connector_in: fiberDetails.connector_in, connector_out: fiberDetails.connector_out, span_loss: fiberDetails.span_loss,

    });

    var newFiberID = token();
    var labelvalue = getLabel(nodeID, fiberDetails.to, singleFiberJSON.component_type);
    labelvalue = countFiberService(false, true, false, false, nodeID, fiberDetails.to) + '-' + labelvalue;
    elabel = labelvalue;

    var fiber_config = configData[singleFiberJSON.fiber_category.replace(' ', '')].default;
    network.body.data.edges.add({
        id: newFiberID, from: nodeID, to: fiberDetails.to, label: elabel, text: labelvalue, dashes: singleFiberJSON.dashes, fiber_category: singleFiberJSON.fiber_category,
        component_type: singleFiberJSON.component_type, color: singleFiberJSON.options.w_color, background: singleFiberJSON.options.background,
        arrows: singleFiberJSON.options.arrows,
        smooth: smooth,
        width: singleFiberJSON.width,
        view: $("#ddlNetworkView").val(), hidden: false,
        fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
        loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,
    });

    //add roadm list for newly added fiber right side - new node --- comment for functional view also roadm have only roadm type
    nodeDetails = network.body.data.nodes.get(nodeID);
    fiberDetails.isUpdate = false;
    fiberDetails.isDelete = true;
    tempUndo.push(fiberDetails);

    nodeDetails.isUpdate = false;
    tempUndo.push(nodeDetails);

    fDetails = network.body.data.edges.get(fiberID);
    fDetails.isUpdate = false;
    tempUndo.push(fDetails);

    nDetails = network.body.data.edges.get(newFiberID);
    nDetails.isUpdate = false;
    tempUndo.push(nDetails);

    document.getElementById("singleFiberMenu").style.display = "none";
    realUpdate();
    enableEdgeIndicator();
}
function dualFiberEdit(fiberID, callback) {
    document.getElementById("dualFiberMenu").style.display = "none";

    clearCbxandAccordian();
    openDrawer('dualfiber');
    var edgeDetails = network.body.data.edges.get(fiberID);
    var connectedNode = network.getConnectedNodes(fiberID);
    $("#txtFiberName").val(edgeDetails.text);
    //fiber A details
    $("#ddlFiberAType").val(edgeDetails.fiber_type);
    $("#txtFiberASL").val(edgeDetails.span_length);
    $("#txtFiberALC").val(edgeDetails.loss_coefficient);
    $("#txtFiberACIN").val(edgeDetails.connector_in);
    $("#txtFiberACOUT").val(edgeDetails.connector_out);
    $("#txtFiberASpanLoss").val(edgeDetails.span_loss);
    //fiber B details
    if (edgeDetails.RxToTxFiber) {
        $("#ddlFiberBType").val(edgeDetails.RxToTxFiber.fiber_type);
        $("#txtFiberBSL").val(edgeDetails.RxToTxFiber.span_length);
        $("#txtFiberBLC").val(edgeDetails.RxToTxFiber.loss_coefficient);
        $("#txtFiberBCIN").val(edgeDetails.RxToTxFiber.connector_in);
        $("#txtFiberBCOUT").val(edgeDetails.RxToTxFiber.connector_out);
        $("#txtFiberBSpanLoss").val(edgeDetails.RxToTxFiber.span_loss);
    }
    $("#pFiberA").text("Fiber A [" + network.body.data.nodes.get(connectedNode[0]).label + ' - ' + network.body.data.nodes.get(connectedNode[1]).label + "]");
    $("#pFiberB").text("Fiber B [" + network.body.data.nodes.get(connectedNode[1]).label + ' - ' + network.body.data.nodes.get(connectedNode[0]).label + "]");

    document.getElementById("btnDualFiberUpdate").onclick = updateDualFiber.bind(
        this,
        fiberID,
        callback
    );
    document.getElementById("btnCloseDualFiber").onclick = clearDualFiber.bind(
    );
}
function updateDualFiber(fiberID) {
    var id = fiberID;
    var label = $("#txtFiberName").val().trim();
    var fiber_type = $("#ddlFiberAType").val();
    var span_length = $("#txtFiberASL").val();
    var loss_coefficient = $("#txtFiberALC").val();
    var connector_in = $("#txtFiberACIN").val();
    var connector_out = $("#txtFiberACOUT").val();
    var span_loss = $("#txtFiberASpanLoss").val();

    var fiber_typeB = $("#ddlFiberBType").val();
    var span_lengthB = $("#txtFiberBSL").val();
    var loss_coefficientB = $("#txtFiberBLC").val();
    var connector_inB = $("#txtFiberBCIN").val();
    var connector_outB = $("#txtFiberBCOUT").val();
    var span_lossB = $("#txtFiberBSpanLoss").val();

    var spanlen = parseFloat(span_length);
    if (spanlen <= 0) {
        showMessage(alertType.Error, dualFiberJSON.component_type + ' A : please enter valid span length.');
        return;
    }

    var Bspan_length = parseFloat($("#txtFiberBSL").val());
    spanlen = parseFloat(Bspan_length);
    if (spanlen <= 0) {
        showMessage(alertType.Error, dualFiberJSON.component_type + ' B : please enter valid span length.');
        return;
    }
    var fiberDetails = network.body.data.edges.get(fiberID);
    if (nameLengthValidation("txtFiberName")) {
        if (fiberDetails.component_type == dualFiberJSON.component_type && fiberDetails.fiber_category == dualFiberJSON.fiber_category) {

            var elabel = "";
            elabel = label;

            network.body.data.edges.update({
                id: id, label: elabel, text: label, fiber_type: fiber_type, span_length: span_length,
                loss_coefficient: loss_coefficient, connector_in: connector_in, connector_out: connector_out, span_loss: span_loss,
                RxToTxFiber: {
                    from: fiberDetails.to, to: fiberDetails.from, fiber_category: fiberDetails.fiber_category, component_type: fiberDetails.component_type,
                    label: label, text: label, fiber_type: fiber_typeB, span_length: span_lengthB,
                    loss_coefficient: loss_coefficientB, connector_in: connector_inB, connector_out: connector_outB, span_loss: span_lossB,
                }
            });
            multipleFiberService(fiberDetails.from, fiberDetails.to);
            clearDualFiber();
        }

    }
}
function clearDualFiber() {
    $("#txtfiberName").val('');
    $("#ddlFiberAType").val('');
    $("#txtFiberASL").val('');
    $("#txtFiberALC").val('');
    $("#txtFiberACIN").val('');
    $("#txtFiberACOUT").val('');
    $("#ddlFiberBType").val('');
    $("#txtFiberBSL").val('');
    $("#txtFiberBLC").val('');
    $("#txtFiberBCIN").val('');
    $("#txtFiberBCOUT").val('');
    clearCbxandAccordian();
    closeDrawer('dualfiber');
    UnSelectAll();
    enableEdgeIndicator();
}
function clearCbxandAccordian() {
    if ($("#aFiberA").text() == "-")
        $("#aFiberA").click();
    if ($("#aFiberB").text() == "-")
        $("#aFiberB").click();

    $('#cbx_FiberALBL').prop('checked', false);
    $('#cbx_FiberBLBL').prop('checked', false);
    $('#cbx_clone').prop('checked', false);
}

/**
 * Populate fiber details by fiber ID.
 * @param {string} fiberID - Selected Fiber ID.
 * @param callback - The callback that handles the response.
 */
function singleFiberEdit(fiberID, callback) {
    $("#txtLoss_Coefficient").removeClass('input_error');
    $('#cbxLength_Based_Loss').prop('checked', false);
    $("#txtSinlgeFiberName").val('');
    $("#txtSource").val('');
    $("#txtDestination").val('');
    $("#ddlSingleFiberType").val('');
    $("#txtSpan_Length").val('');
    $("#txtLoss_Coefficient").val('');
    $("#txtConnector_IN").val('');
    $("#txtConnector_OUT").val('');
    $("#txtSpan_Loss").val('');
    document.getElementById("singleFiberMenu").style.display = "none";
    var edgeDetails = network.body.data.edges.get(fiberID[fiberID.length - 1].id);
    var connectedNode = network.getConnectedNodes(fiberID[fiberID.length - 1].id);
    $("#txtSinlgeFiberName").val(edgeDetails.text);
    $("#txtSource").val(network.body.data.nodes.get(connectedNode[0]).label);
    $("#txtDestination").val(network.body.data.nodes.get(connectedNode[1]).label);
    $("#divFiberNameCon").show();
    if (fiberID.length > 1) {
        $("#divFiberNameCon").hide();
        var matchCount = 1;
        for (var i = 0; i < fiberID.length - 1; i++) {
            if (network.body.data.edges.get(fiberID[i].id).fiber_type == edgeDetails.fiber_type) {
                matchCount++;
            }
        }
        if (matchCount == fiberID.length) {
            if (edgeDetails.fiber_type) {
                $("#ddlSingleFiberType").val(edgeDetails.fiber_type);
            }
        }

    }
    else {
        $("#ddlSingleFiberType").val(edgeDetails.fiber_type);
        $("#txtSpan_Length").val(edgeDetails.span_length);
        $("#txtLoss_Coefficient").val(edgeDetails.loss_coefficient);
        $("#txtConnector_IN").val(edgeDetails.connector_in);
        $("#txtConnector_OUT").val(edgeDetails.connector_out);
        $("#txtSpan_Loss").val(edgeDetails.span_loss);
    }
    var span_length = $("#txtSpan_Length").val().trim();
    var spanlen = parseFloat(span_length);
    if (isNaN(span_length) || spanlen <= 0 || span_length == "") {
        $("#txtSpan_Length").addClass('input_error');
    }
    else
        $("#txtSpan_Length").removeClass('input_error');

    if ($("#ddlSingleFiberType").val() == null) {
        $("#ddlSingleFiberType").addClass('input_error');
    }
    else
        $("#ddlSingleFiberType").removeClass('input_error');

    openDrawer('singlefiber');
    document.getElementById("btnSingleFiberUpdate").onclick = updateSingleFiber.bind(
        this,
        fiberID,
        callback
    );
    document.getElementById("btnCloseSingleFiber").onclick = clearSingleFiber.bind(
    );
}

/**
 * Update fiber.
 * Update fiber by fiber ID.
 * Apply connections rules.
 * @param {string} fiberID - Fiber ID.
 */
function updateSingleFiber(fiberID) {
    removeEdgeList = [];
    var id = fiberID[fiberID.length - 1].id;
    var label = $("#txtSinlgeFiberName").val().trim();
    var fiber_type = $("#ddlSingleFiberType").val();
    var span_length = $("#txtSpan_Length").val().trim();
    var loss_coefficient = $("#txtLoss_Coefficient").val().trim();
    var connector_in = $("#txtConnector_IN").val();
    var connector_out = $("#txtConnector_OUT").val();
    var span_loss = $("#txtSpan_Loss").val();

    if ($("#ddlSingleFiberType").val() == null) {
        showMessage(alertType.Error, 'Please select fiber type');
        $("#ddlSingleFiberType").addClass('input_error');
        return;
    }
    else
        $("#ddlSingleFiberType").removeClass('input_error');

    var spanlen = parseFloat(span_length);
    if (isNaN(span_length) || spanlen <= 0 || span_length == "") {
        showMessage(alertType.Error, 'Please enter valid span length.');
        $("#txtSpan_Length").addClass('input_error');
        return;
    }
    else
        $("#txtSpan_Length").removeClass('input_error');

    if ($('#cbxLength_Based_Loss').is(":checked")) {
        var lossCoeff = parseFloat(loss_coefficient);
        if (isNaN(loss_coefficient) || lossCoeff <= 0 || loss_coefficient == "") {
            showMessage(alertType.Error, "Length based loss requires span length and loss coefficient to be entered");
            return;
        }
    }

    var fiberDetails = network.body.data.edges.get(id);
    if (nameLengthValidation("txtSinlgeFiberName")) {

        if (fiberDetails.component_type == singleFiberJSON.component_type && fiberDetails.fiber_category == singleFiberJSON.fiber_category) {

            var elabel = "";
            elabel = label;

            var preUpdateList = [];
            if (fiberID.length > 1) {

                for (var i = 0; i < fiberID.length; i++) {
                    if (network.body.data.edges.get(fiberID[i].id).shadow == singleFiberJSON.options.shadow) {

                        var fiber = network.body.data.edges.get(fiberID[i].id);
                        preUpdateList.push(fiber);
                        network.body.data.edges.update({
                            id: fiberID[i].id, fiber_type: fiber_type, span_length: span_length, color: singleFiberJSON.options.color,
                            h_color: singleFiberJSON.options.color,
                            pre_color: singleFiberJSON.options.color,
                            loss_coefficient: loss_coefficient, connector_in: connector_in, connector_out: connector_out, span_loss: span_loss
                        });

                        multipleFiberService(fiber.from, fiber.to);
                        removeID = "#spanFP" + fiberID[i].id.replace(/\s/g, '');
                        $(removeID).remove();
                        $(removeID).remove();
                        checkErrorFree();
                        var tdata = network.body.data.edges.get(fiberID[i].id);
                        removeEdgeList.push(tdata);
                    }
                }
                if (removeEdgeList.length > 0) {
                    var updateList = {
                        isMultiple: true,
                        isUpdate: true,
                        preList: preUpdateList,
                        list: removeEdgeList
                    }
                    tempUndo.push(updateList);
                }

            }
            else {
                network.body.data.edges.update({
                    id: id, label: elabel, text: label, fiber_type: fiber_type, span_length: span_length, color: singleFiberJSON.options.color,
                    h_color: singleFiberJSON.options.color,
                    pre_color: singleFiberJSON.options.color,
                    loss_coefficient: loss_coefficient, connector_in: connector_in, connector_out: connector_out, span_loss: span_loss
                });
                multipleFiberService(fiberDetails.from, fiberDetails.to);
                removeID = "#spanFP" + id.replace(/\s/g, '');
                $(removeID).remove();
                $(removeID).remove();
                checkErrorFree();
                var tdata = network.body.data.edges.get(id);
                tdata.isUpdate = true;
                tempUndo.push(tdata);
            }

            clearSingleFiber();
        }

    }
}

/** Clear input/teporary data and other settings. */
function clearSingleFiber() {

    $("#txtSinlgeFiberName").val('');
    $("#txtSource").val('');
    $("#txtDestination").val('');
    $("#ddlSingleFiberType").val('');
    $("#txtSpan_Length").val('');
    $("#txtLoss_Coefficient").val('');
    $("#txtConnector_IN").val('');
    $("#txtConnector_OUT").val('');
    $("#txtSpan_Loss").val('');
    $("#ddlSingleFiberType").removeClass('input_error');
    $("#txtSpan_Length").removeClass('input_error');
    $('#cbxLength_Based_Loss').prop('checked', false);
    closeDrawer('singlefiber');
    UnSelectAll();
    enableEdgeIndicator();
}

function deleteFiber(fiberList) {

    removeEdgeList = [];
    var shadow;
    for (var i = 0; i < fiberList.length; i++) {
        if (fiberList.length > 1) {
            shadow = network.body.data.edges.get(fiberList[i].id).shadow;

            if (shadow == singleFiberJSON.options.shadow)
                removeFiber(fiberList[i].id, true);

        }
        else {
            removeFiber(fiberList[i].id);
        }
    }

    if (fiberList.length > 1 && removeEdgeList.length > 0) {
        var reList = {
            isMultiple: true,
            isUpdate: false,
            list: removeEdgeList
        }
        tempUndo.push(reList);
    }

    UnSelectAll();
    enableEdgeIndicator();

}

/**
 * Remove fiber by fiber ID.
 * @param {string} fiberID - Component ID.
 * @param {boolean} isMultiple - Remove multiple fiber.
 */
function removeFiber(fiberID, isMultiple) {
    var fiber = network.body.data.edges.get(fiberID);

    var fiberLabel = fiber.label;
    if (fiber.label.trim() == "")
        fiberLabel = fiber.text

    var nodeDetails = network.body.data.nodes.get(fiber.from);
    var toNodeDetails = network.body.data.nodes.get(fiber.to);

    if (checkFiberPatchServiceCon(fiber.from, fiber.to, fiber.component_type))
        return;


    document.getElementById("dualFiberMenu").style.display = "none";
    document.getElementById("singleFiberMenu").style.display = "none";
    //remove roadm list from from roadm node

    arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
    _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));

    _roadmListDB({
        roadm_fiber_id: fiberID
    }).remove();
    arrRoadmTypePro = _roadmListDB().get();
    network.body.data.nodes.update({
        id: nodeDetails.id, roadm_type_pro: arrRoadmTypePro
    });
    //remove roadm list from to roadm node

    arrRoadmTypePro = toNodeDetails.roadm_type_pro ? toNodeDetails.roadm_type_pro : [];
    _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));

    _roadmListDB({
        roadm_fiber_id: fiberID
    }).remove();
    arrRoadmTypePro = _roadmListDB().get();
    network.body.data.nodes.update({
        id: toNodeDetails.id, roadm_type_pro: arrRoadmTypePro
    });

    var tedge = network.body.data.edges.get(fiberID);
    network.body.data.edges.remove(fiberID);
    multipleFiberService(fiber.from, fiber.to);
    nodeValidationInEdge(fiber.from, fiber.to);

    if (isMultiple) {
        removeEdgeList.push(tedge);
    }
    else {
        tedge.isDelete = true;
        tedge.isUpdate = false;
        tempUndo.push(tedge);
    }
}

/**
 * Displays fiber details when hover the mouse near the single fiber.
 * @param {object} params - Fiber details.
 */
function displayFiberHover(params) {
    var fiberDetails = network.body.data.edges.get(params.edge);
    var fiber_type = "";
    var span_length = "";
    var span_loss = "";
    if (fiberDetails.component_type == dualPatchJSON.component_type)
        return;
    if (fiberDetails.component_type == singleFiberJSON.component_type) {
        if (fiberDetails.fiber_category == dualFiberJSON.fiber_category) {
            var fromlabel = "(" + network.body.data.nodes.get(fiberDetails.from).label + " -> " + network.body.data.nodes.get(fiberDetails.to).label + ")";
            var hoverData = fiberDetails.component_type + " name : " + fiberDetails.text + "\n";
            hoverData += "--------------------------\n";
            var fromlabel = "Fiber A [" + network.body.data.nodes.get(fiberDetails.from).label + " -> " + network.body.data.nodes.get(fiberDetails.to).label + " ]";
            hoverData += fromlabel + "\n";

            if (fiberDetails.fiber_type)
                fiber_type = fiberDetails.fiber_type;
            if (fiberDetails.span_length)
                span_length = fiberDetails.span_length;
            if (fiberDetails.loss_coefficient)
                loss_coefficient = fiberDetails.loss_coefficient;
            if (fiberDetails.connector_in)
                connector_in = fiberDetails.connector_in;
            if (fiberDetails.connector_out)
                connector_out = fiberDetails.connector_out;
            if (fiberDetails.span_loss)
                span_loss = fiberDetails.span_loss;

            hoverData += "Fiber type : " + fiber_type + "\n";
            hoverData += "Span length(in km) : " + span_length + "\n";
            hoverData += "Span loss : " + span_loss + "\n";
            hoverData += "--------------------------\n";

            var rxToTx = fiberDetails.RxToTxFiber;
            var fromlabel = "Fiber B [" + network.body.data.nodes.get(fiberDetails.to).label + " -> " + network.body.data.nodes.get(fiberDetails.from).label + " ]";
            hoverData += fromlabel + "\n";

            if (rxToTx.fiber_type)
                fiber_type = rxToTx.fiber_type;
            if (rxToTx.span_length)
                span_length = rxToTx.span_length;
            if (rxToTx.loss_coefficient)
                loss_coefficient = rxToTx.loss_coefficient;
            if (rxToTx.connector_in)
                connector_in = rxToTx.connector_in;
            if (rxToTx.connector_out)
                connector_out = rxToTx.connector_out;
            if (rxToTx.span_loss)
                span_loss = rxToTx.span_loss;

            hoverData += "Fiber type : " + fiber_type + "\n";
            hoverData += "Span length(in km) : " + span_length + "\n";
            hoverData += "Span loss : " + span_loss + "\n";
        }
        else if (fiberDetails.fiber_category == singleFiberJSON.fiber_category) {
            var hoverData = fiberDetails.component_type + " name : " + fiberDetails.text + "\n";
            hoverData += "Source(Tx) : " + network.body.data.nodes.get(fiberDetails.from).label + "\n";
            hoverData += "Destination(Rx) : " + network.body.data.nodes.get(fiberDetails.to).label + "\n";

            if (fiberDetails.fiber_type)
                fiber_type = fiberDetails.fiber_type;
            if (fiberDetails.span_length)
                span_length = fiberDetails.span_length;
            if (fiberDetails.loss_coefficient)
                loss_coefficient = fiberDetails.loss_coefficient;
            if (fiberDetails.connector_in)
                connector_in = fiberDetails.connector_in;
            if (fiberDetails.connector_out)
                connector_out = fiberDetails.connector_out;
            if (fiberDetails.span_loss)
                span_loss = fiberDetails.span_loss;

            if (fiber_type == "")
                hoverData += "<span style='color:red;'>Fiber type : " + fiber_type + "</span>\n";
            else
                hoverData += "Fiber type : " + fiber_type + "\n";

            var spanlen = parseFloat(span_length);

            if (isNaN(span_length) || spanlen <= 0 || span_length == "")
                hoverData += "<span style='color:red;'>Span length(in km) : " + span_length + "</span>\n";
            else
                hoverData += "Span length(in km) : " + span_length + "\n";

            hoverData += "Span loss : " + span_loss + "\n";
        }
    }
    if (fiberDetails.component_type == serviceJSON.component_type) {
        var hoverData = fiberDetails.component_type + " name : " + fiberDetails.text + "\n";
        hoverData += "Source : " + network.body.data.nodes.get(fiberDetails.from).label + "\n";
        hoverData += "Destination : " + network.body.data.nodes.get(fiberDetails.to).label + "\n";
        hoverData += "Bandwidth (in Gbps) : " + fiberDetails.band_width + "\n";
    }
    $('#hoverDiv').html(htmlTitle(hoverData, commonJSON.background_color));
    showHoverDiv(params.event.pageX, params.event.pageY, "hoverDiv");
}
