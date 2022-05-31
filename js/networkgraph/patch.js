var isDualPatchMode = 0;
var isSinglePatchMode = 0;
var addPatchData = {
    from: '',
    to: ''
};
function dualPatchMode() {
    UnSelectAll();
    isDualPatchMode = 1;
    isSinglePatchMode = 0;
    isAddService = 0;
    isDualFiberMode = 0;
    isSingleFiberMode = 0;
    addPatchData = {
        from: '',
        to: ''
    };
}
function singlePatchMode() {
    UnSelectAll();
    isDualPatchMode = 0;
    isSinglePatchMode = 1;
    isAddService = 0;
    isDualFiberMode = 0;
    isSingleFiberMode = 0;
    addPatchData = {
        from: '',
        to: ''
    };
}
function addDualPatch() {

    var fromDetails = network.body.data.nodes.get(addPatchData.from);
    var toDetails = network.body.data.nodes.get(addPatchData.to);
    if ((fromDetails.node_type == transceiverJSON.node_type && toDetails.node_type == roadmJSON.node_type) || (fromDetails.node_type == roadmJSON.node_type && toDetails.node_type == transceiverJSON.node_type)) {

        var labelvalue = dualPatchJSON.component_type + ' ' + network.body.data.nodes.get(addPatchData.from).number + ' - ' + network.body.data.nodes.get(addPatchData.to).number;
        addPatchComponent(1, addPatchData.from, addPatchData.to, labelvalue, labelvalue, false);
    }
    else {
        showMessage(alertType.Error, "The " + dualPatchJSON.component_type + " should be between " + transceiverJSON.node_type + " and " + roadmJSON.node_type + " sites");
    }
    addPatchData = {
        from: '',
        to: ''
    };
    UnSelectAll();
    network.addEdgeMode();

}
function addSinglePatch() {

    var labelvalue = getLabel(addPatchData.from, addPatchData.to, singlePatchJSON.component_type);
    addPatchComponent(1, addPatchData.from, addPatchData.to, labelvalue, labelvalue, false);
    addPatchData = {
        from: '',
        to: ''
    };
    UnSelectAll();
    network.addEdgeMode();
}
function addPatchComponent(cmode, cfrom, cto, clabel, ctext, isImport) {

    if (cmode == 1) {
        var patchID = token();
        if (!isImport)
            clabel = countFiberService(false, false, false, true, cfrom, cto) + '-' + clabel;

        elabel = clabel;

        if (isSinglePatchMode == 1) {
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

            network.body.data.edges.add({
                id: patchID, from: cfrom, to: cto, label: elabel, text: clabel,
                dashes: singlePatchJSON.dashes, width: singlePatchJSON.width,
                component_type: singlePatchJSON.component_type, patch_category: singlePatchJSON.patch_category,
                color: singlePatchJSON.options.color, background: singlePatchJSON.options.background,
                arrows: singlePatchJSON.options.arrows,
                smooth: singlePatchJSON.options.smooth,
                view: topologyView.Functional_View, hidden: false,
            });

            nodeValidationInEdge(cfrom, cto);
        }
        if (isDualPatchMode == 1) {
            //we cannot add more than 1 patch
            isPatchAdded = false;
            var connectedFiber = network.getConnectedEdges(cfrom);
            connectedFiber.push(network.getConnectedEdges(cto));
            $.each(connectedFiber, function (index, item) {
                var fiberDetails = network.body.data.edges.get(item);
                if (fiberDetails.component_type == dualPatchJSON.component_type) {
                    if ((fiberDetails.from == cfrom && fiberDetails.to == cto) || (fiberDetails.from == cto && fiberDetails.to == cfrom)) {
                        isPatchAdded = true;
                        return true;
                    }
                }
            });

            if (isPatchAdded && !isImport) {
                showMessage(alertType.Error, 'We cannot add more than 1 ' + dualPatchJSON.patch_category);
                return;
            }
            //end
            network.body.data.edges.add({
                id: patchID, from: cfrom, to: cto, label: elabel, text: ctext,
                dashes: dualPatchJSON.dashes, width: dualPatchJSON.width,
                component_type: dualPatchJSON.component_type, patch_category: dualPatchJSON.patch_category,
                color: dualPatchJSON.options.color, background: dualPatchJSON.options.background,
                arrows: dualPatchJSON.options.arrows,
                smooth: dualPatchJSON.options.smooth,
                view: topologyView.NE_View, hidden: false,
            });
        }
        multipleFiberService(cfrom, cto);
        var tedge = network.body.data.edges.get(patchID);
        tedge.isUpdate = false;
        tempUndo.push(tedge);
    }
}
function singlePatchEdit(patchID, callback) {
    document.getElementById("singlePatchMenu").style.display = "none";
    var edgeDetails = network.body.data.edges.get(patchID);
    $("#txtSinglePatchName").val(edgeDetails.text);
    openDrawer('singlepatch');
    document.getElementById("btnUpdateSinglePatch").onclick = updateSinglePatch.bind(
        this,
        patchID,
        callback
    );
    document.getElementById("btnCloseSinglePatch").onclick = clearSinglePatch.bind(
    );
}
function updateSinglePatch(patchID) {

    var id = patchID;
    var label = $("#txtSinglePatchName").val().trim();
    var patchDetails = network.body.data.edges.get(patchID);
    if (nameLengthValidation("txtSinglePatchName")) {

        var elabel = "";
        elabel = label;
        if (patchDetails.component_type == dualPatchJSON.component_type) {
            network.body.data.edges.update({
                id: id, label: elabel, text: label
            });
            multipleFiberService(patchDetails.from, patchDetails.to);
            var tdata = network.body.data.edges.get(id);
            tdata.isUpdate = true;
            tempUndo.push(tdata);
            clearSinglePatch();
        }

    }

}
function deletePatch(patchID) {
    var patchDetails = network.body.data.edges.get(patchID);
    var patchLabel = patchDetails.label;
    if (patchDetails.label.trim() == "")
        patchLabel = patchDetails.text

    if (checkFiberPatchServiceCon(patchDetails.from, patchDetails.to, patchDetails.component_type))
        return;
    document.getElementById("singlePatchMenu").style.display = "none";
    document.getElementById("dualPatchMenu").style.display = "none";
    var patchd = network.body.data.edges.get(patchID);
    network.body.data.edges.remove(patchID);
    multipleFiberService(patchDetails.from, patchDetails.to);
    nodeValidationInEdge(patchDetails.from, patchDetails.to);
    patchd.isDelete = true;
    patchd.isUpdate = false;
    tempUndo.push(patchd);
    UnSelectAll();
    enableEdgeIndicator();
}
function clearSinglePatch() {

    $("#txtSinglePatchName").val('');
    closeDrawer('singlepatch');
    UnSelectAll();
    enableEdgeIndicator();
}
function dualPatchEdit(patchID, callback) {
    document.getElementById("dualPatchMenu").style.display = "none";
    var edgeDetails = network.body.data.edges.get(patchID);
    $("#txtDualPatchName").val(edgeDetails.text);
    openDrawer('dualpatch');
    document.getElementById("btnUpdateDualPatch").onclick = updateDualPatch.bind(
        this,
        patchID,
        callback
    );
    document.getElementById("btnCloseDualPatch").onclick = clearDualPatch.bind(
    );
}
function updateDualPatch(patchID) {

    var id = patchID;
    var label = $("#txtDualPatchName").val().trim();
    var patchDetails = network.body.data.edges.get(patchID);

    if (nameLengthValidation("txtDualPatchName")) {

        if (patchDetails.component_type == dualPatchJSON.component_type) {

            var elabel = "";
            elabel = label;
            network.body.data.edges.update({
                id: id, label: elabel, text: label
            });
            multipleFiberService(patchDetails.from, patchDetails.to);
            clearDualPatch();
        }

    }

}
function clearDualPatch() {
    $("#txtDualPatchName").val('');
    closeDrawer('dualpatch');
    UnSelectAll();
    enableEdgeIndicator();
}