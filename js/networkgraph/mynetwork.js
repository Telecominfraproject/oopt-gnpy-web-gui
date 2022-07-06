var nodes = null;
var edges = null;
var network = null;
var data = getScaleFreeNetwork(0);
var seed = 2;
var previousId = 0;
var currentId = 0;
var _nodesDB = new TAFFY();
var _edgeDB = new TAFFY();
var _insertnodeDB = new TAFFY();
var container;
var exportArea;
var importButton;
var exportButton;
var dropdownshape;
var isService = 0;
var isCopy = false;
var copyID;
var isCopyPara = false;
localStorage.setItem("copyedgeid", "");
localStorage.setItem("copynodeid", "");
localStorage.setItem("deletenodeconectededge", "");
var optionsJSON = "";
var roadmJSON = "";
var ILAJSON = "";
var amplifierJSON = "";
var ramanampJSON = "";
var fusedJSON = "";
var transceiverJSON = "";
var dualFiberJSON = "";
var singleFiberJSON = "";
var serviceJSON = "";
var singlePatchJSON = "";
var dualPatchJSON = "";
var fiberJSON = "";
var commonJSON = "";
var configData = "";
var styleData = "";
var eqpt_config = "";
var arrRoadmTypePro = [];
var _roadmListDB = new TAFFY();
var isLocalStorage = false;
var nodeMode = "";
var DIR = "";
var eleroadmtype = "ddlroadmType";
var elepreamptype = "ddlPreAmpType";
var eleboostertype = "ddlBoosterType";
var currentStepper = "";
var insertNodeX = 0;
var insertNodeY = 0;
var isShow = false;
var isExpandedView = false;
var tSpanLength = "";
var tType = "";
var tConnector_in = "";
var tConnector_out = "";
var tBandwidth = "";
var eqptData = "";
var bullet = "&#9632; ";
var nodeSelect = false;
var tempUndo = [];
var tempRedo = [];
var removeNodeList = [];
var removeEdgeList = [];
var nofNode = 1;
var hoverNodeData;
var importNodes = [];
var importEdges = [];
var copiedNodeID;
var showMenu = 0;
var preScale;
var prePosition;
var _eqpt_json;
var isEqptFile = false;
var isImportJSON = false;

var displayEdgeLabels = false;
var hiddenNodeTextDisplayOptions;
var displayNodeLabels = false;

/**  Hide fiber/patch/service label. */
var hiddenEdgeTextOptions = {
    edges: {
        font: {
            // Set the colors to transparent
            color: 'transparent',
            strokeColor: 'transparent'
        }
    },
    nodes: {
        font: {
            // Set the colors to transparent
            color: 'transparent',
            strokeColor: 'transparent'
        }
    },
};

/** Hide node label. */
var hiddenNodeTextOptions = {
    nodes: {
        font: {
            // Set the colors to transparent
            color: 'transparent',
            strokeColor: 'transparent'
        }
    }
};

$(document).ready(function () {

    $.getJSON("/data/styledata.json", function (data) {
        optionsJSON = data.options;
        roadmJSON = data.Roadm;
        hiddenNodeTextDisplayOptions = {
            nodes: {
                font: roadmJSON.font
            }
        };
        ILAJSON = data.ILA;
        amplifierJSON = data.Amplifier;
        ramanampJSON = data.RamanAmplifier;
        fusedJSON = data.Fused;
        transceiverJSON = data.Transceiver;
        dualFiberJSON = data.DualFiber;
        singleFiberJSON = data.SingleFiber;
        serviceJSON = data.Service;
        singlePatchJSON = data.SinglePatch;
        dualPatchJSON = data.DualPatch;
        styleData = data;
        fiberJSON = data.Fiber;
        commonJSON = data.common;
    }).fail(function () {
        console.log("An error has occurred on style data json.");
    });
    $.getJSON("/data/configurationdata.json", function (data) {

        configData = data;
        DIR = configData.node.dir;
        $("[id='siteLength']").each(function () {
            $(this).text(' (Max Length ' + configData.node.site_length + ')');
        })
    }).fail(function () {
        console.log("An error has occurred on configuration data json.");
    });
    $.getJSON("/data/Equipment_JSON_MOD2.json", function (data) {
        eqpt_config = data;
        load_EqptConfig();
    }).fail(function () {
        console.log("An error has occurred on Equipment_JSON_MOD2 json.");
    });
    $("#btncaptureimagenetwork").click(function () {
        if (networkValidation())
            captureImage();
    });
    $("#btnSaveNetwork, #btnSaveNetworkTop").click(function () {

        if (networkValidation()) {
            //exportNetwork(true);
            $("*.ES").html("Save As");
            $("#txtFileName").val('');
            $("#staticBackdrop1").modal('show');
        }
    });
    $("#btnExportPopup").click(function () {
        if (networkValidation()) {
            //topologyValidation();
            $("*.ES").html("Export");
            $("#txtFileName").val('');
            $("#staticBackdrop1").modal('show');
        }
    });
    $("#btnValidation").click(function () {
        if (networkValidation()) {
            preScale = network.getScale();
            prePosition = network.getViewPosition();
            if (!topologyValidation(true)) {
                showMessage(alertType.Success, 'Successfully validated');
            }
        }
    });
    $("#exportNetwork").click(function () {
        if (networkValidation()) {
            $("#staticBackdrop1").modal('show');
        }
    });
    $("#btnExportNetwork").click(function () {
        if (networkValidation() && exportFileValidation()) {
            exportNetwork(false);
            $("#staticBackdrop1").modal('hide');
        }
    });
    $("#errorClose").click(function () {

        var errNodes = network.body.data.nodes.get({
            filter: function (item) {
                return (item.is_error == true);
            }
        });

        var errFiber = network.body.data.edges.get({
            filter: function (item) {
                return (item.is_error == true);
            }
        });
        if (errNodes.length > 0 || errFiber.length > 0) {
            removeHighlight();
            network.moveTo({
                position: prePosition,
                scale: preScale,
            });

        }


    });
    $("#btnAddRoadm").click(function () {
        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        enableDisableNode(1, "Roadm");
    });
    $("#btnAddILA").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        enableDisableNode(2, "ILA");
    });
    $("#btnAddAmplifier").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        enableDisableNode(5, "amplifier");
    });
    $("#btnAddRamAmp").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        enableDisableNode(6, "ramanamp");
    });
    $("#btnAddFused").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        enableDisableNode(3, "fused");
    });
    $("#btnAddTransceiver").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        enableDisableNode(4, "transceiver");
    });
    $("#btnAddDualFiber").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        if (isDualFiberMode == 1) {
            modeHighLight();
            isDualFiberMode = 0;
        }
        else {
            network.addEdgeMode();
            modeHighLight('dualfiber');
            dualFiberMode();
        }
    });
    $("#btnAddSingleFiber").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        if (isSingleFiberMode == 1) {
            modeHighLight();
            isSingleFiberMode = 0;
        }
        else {
            network.addEdgeMode();
            modeHighLight('singlefiber');
            singleFiberMode();
        }
    });
    $("#btnServiceActive").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        if (networkValidation()) {
            if (isAddService == 1) {
                modeHighLight();
                isAddService = 0;
            }
            else {
                network.addEdgeMode();
                modeHighLight('service');
                addServiceMode();
            }
        }
    });
    $("#btnAddDualPatch").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        if (isDualPatchMode == 1) {
            modeHighLight();
            isDualPatchMode = 0;
        }
        else {
            network.addEdgeMode();
            modeHighLight('dualpatch');
            dualPatchMode();
        }
    });
    $("#btnAddSinglePatch").click(function () {

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        if (isSinglePatchMode == 1) {
            modeHighLight();
            isSinglePatchMode = 0;
        }
        else {
            network.addEdgeMode();
            modeHighLight('singlepatch');
            singlePatchMode();
        }
    });
    $("#stepGP").click(function () {
        $("#staticBackdrop4").modal('show');
        var simulationData = JSON.parse(sessionStorage.getItem("simulationParameters"));
        $("#txtFrgMin").val(simulationData["frequency-min"]);
        $("#txtFrqMax").val(simulationData["frequency-max"]);
        $("#txtGridSpac").val(simulationData["spacing"]);
        $("#txtNoOfChannel").val(simulationData["noOfChannel"]);
        $("#txtAgeingMargin").val(simulationData["system-margin"]);
    });
    $("#btnSaveGP").click(function () {
        saveSimulations($("#txtFrgMin").val(), $("#txtFrqMax").val(), $("#txtGridSpac").val(), $("#txtNoOfChannel").val(), $("#txtAgeingMargin").val());
        $("#staticBackdrop4").modal('hide');
    });
    $("#btnCloseSP, #btnCloseGP").click(function () {
        $("#staticBackdrop4").modal('hide');
    });
    $('#cbxLength_Based_Loss').change(function () {
        if (this.checked) {
            var span_length = $("#txtSpan_Length").val().trim();
            var spanlen = parseFloat(span_length);
            var loss_coeff = $("#txtLoss_Coefficient").val().trim();
            var lossCoeff = parseFloat(loss_coeff);
            if (isNaN(span_length) || spanlen <= 0 || span_length == "" || isNaN(loss_coeff) || lossCoeff <= 0 || loss_coeff == "") {
                $('#cbxLength_Based_Loss').prop('checked', false);
                showMessage(alertType.Error, "Length based loss requires span length and loss coefficient to be entered");
            }
            else {
                fiberLengthCal('txtSpan_Length', 'txtLoss_Coefficient', 'txtSpan_Loss');
            }
        }
        else {
            $("#txtSpan_Loss").val('');
        }

    });
    $('#cbx_FiberALBL').change(function () {
        if (this.checked) {
            fiberLengthCal('txtFiberASL', 'txtFiberALC', 'txtFiberASpanLoss');
        }
    });
    $('#cbx_FiberBLBL').change(function () {
        if (this.checked) {
            fiberLengthCal('txtFiberBSL', 'txtFiberBLC', 'txtFiberBSpanLoss');
        }
    });
    $('#cbx_clone').change(function () {
        if (this.checked) {
            $("#ddlFiberBType").val($("#ddlFiberAType").val());
            $("#txtFiberBSL").val($("#txtFiberASL").val());
            $("#txtFiberBLC").val($("#txtFiberALC").val());
            $("#txtFiberBCIN").val($("#txtFiberACIN").val());
            $("#txtFiberBCOUT").val($("#txtFiberACOUT").val());
            $("#txtFiberBSpanLoss").val($("#txtFiberASpanLoss").val());
        }
    });
    $("#importEqptLink").click(function () {
        $("#importEqpt").click();
    });

    /**
    * Read text from import json file.
    * @param {string} file - Get path as file.
    * @param callback - The callback that handles the response.
    */
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
            vper = vper + 10;
            document.getElementById("per").innerText = vper + '%';
        }
        rawFile.send(null);
    }
    var vper = 30;
    $("#importEqpt").on('change', function (e) {

        var file = e.target.files[0];
        if (file) {

            $('#loader').show();
            var path = (window.URL || window.webkitURL).createObjectURL(file);
            document.getElementById("per").innerText = 20 + '%';
            readTextFile(path, function (text) {

                if (text) {
                    try {
                        document.getElementById("per").innerText = "80%";
                        eqptData = JSON.parse(text);
                        isEqptFile = true;
                        eqpt_config = eqptData;
                        load_EqptConfig(true);
                        nodeRuleOnImportJSON();
                        document.getElementById("per").innerText = "90%";
                        edgeStyleOnImportJSON();
                    }
                    catch (e) {
                        showMessage(alertType.Error, "KeyError:'elements', try again");
                        hideLoader();
                    }
                }
            });
        }
    });

    /** 
     *  Undo network actions. 
     *  The redo function is used to restores any actions that were previously undone using an undo. 
     *  We stored every undo action detail one by one into array list (tempRedo) like node creation/deletion/updating etc...
     *  Ex: node creation/deletion/updating: tempRedo.push(nodedata).
     *  we fetch latest one record from array list (tempRedo) then will check record whether creation/deletion/updating after that will call the relevant action. 
     *  After will stored action details into new array list (tempUndo) then will using pop method to remove record from array list (tempRedo) ex: tempRedo.pop().
     *  Ex: node deletion:
     *  tempUndoo.push(nodedata).
     *  data.nodes.remove (latest record of tempRedo).
     */
    
    $("#button_undo").on("click", function () {
        if (tempUndo.length > 0) {
            var tempData = tempUndo[tempUndo.length - 1];
            if (!tempData.isMultiple) {
                var isBreak = false;
                if (tempData.isUpdate) {
                    var undoLength = tempUndo.length;
                    for (var i = 1; i < undoLength; i++) {
                        if (!tempUndo[undoLength - (i + 1)].isMultiple) {
                            if (tempUndo[undoLength - 1].id == tempUndo[undoLength - (i + 1)].id) {
                                if (tempData.component_type == roadmJSON.component_type) {
                                    var redoupdate = data.nodes.get(tempUndo[undoLength - (i + 1)].id);
                                    tempRedo.push(redoupdate);
                                    data.nodes.update(tempUndo[undoLength - (i + 1)]);
                                }
                                else {
                                    var redoupdate = data.edges.get(tempUndo[undoLength - (i + 1)].id);
                                    tempRedo.push(redoupdate);

                                    data.edges.update(tempUndo[undoLength - (i + 1)]);
                                    nodeValidationInEdge(tempUndo[undoLength - (i + 1)].from, tempUndo[undoLength - (i + 1)].to);
                                    multipleFiberService(tempUndo[undoLength - (i + 1)].from, tempUndo[undoLength - (i + 1)].to);
                                }
                                isBreak = true;
                                break;
                            }
                        }
                        else {
                            for (var j = 0; j < tempUndo[undoLength - (i + 1)].list.length; j++) {
                                if (tempUndo[undoLength - 1].id == tempUndo[undoLength - (i + 1)].list[j].id) {
                                    if (tempData.component_type == roadmJSON.component_type) {
                                        var redoupdate = data.nodes.get(tempUndo[undoLength - (i + 1)].list[j].id);
                                        tempRedo.push(redoupdate);
                                        data.nodes.update(tempUndo[undoLength - (i + 1)].list[j]);
                                    }
                                    else {
                                        var redoupdate = data.edges.get(tempUndo[undoLength - (i + 1)].list[j].id);
                                        tempRedo.push(redoupdate);

                                        data.edges.update(tempUndo[undoLength - (i + 1)].list[j]);
                                        nodeValidationInEdge(tempUndo[undoLength - (i + 1)].list[j].from, tempUndo[undoLength - (i + 1)].list[j].to);
                                        multipleFiberService(tempUndo[undoLength - (i + 1)].list[j].from, tempUndo[undoLength - (i + 1)].list[j].to);
                                    }
                                    isBreak = true;
                                    break;
                                }
                            }
                            if (isBreak)
                                break;
                        }
                    }
                    if (!isBreak) {
                        if (tempData.component_type == roadmJSON.component_type) {
                            data.nodes.remove(tempUndo[undoLength - 1]);
                            tempRedo.push(tempUndo[undoLength - 1]);
                        }
                        else {
                            data.edges.remove(tempUndo[undoLength - 1]);
                            tempRedo.push(tempUndo[undoLength - 1]);
                            nodeValidationInEdge(tempUndo[undoLength - 1].from, tempUndo[undoLength - 1].to);
                            multipleFiberService(tempUndo[undoLength - 1].from, tempUndo[undoLength - 1].to);
                        }
                    }
                }
                else if (tempData.isDelete) {
                    if (tempData.component_type == roadmJSON.component_type) {
                        data.nodes.update(tempData);
                        var redoupdate = data.nodes.get(tempData.id);
                        tempRedo.push(redoupdate);

                    }
                    else {
                        data.edges.update(tempData);
                        var redoupdate = data.edges.get(tempData.id);
                        tempRedo.push(redoupdate);
                        nodeValidationInEdge(tempData.from, tempData.to);
                        multipleFiberService(tempData.from, tempData.to);
                    }
                    tempUndo[tempUndo.length - 1].isDelete = false;
                    tempUndo[tempUndo.length - 1].isUpdate = true;

                    tempRedo[tempRedo.length - 1].isDelete = true;
                    tempRedo[tempRedo.length - 1].isUpdate = false;
                }
                else {
                    if (tempData.component_type == roadmJSON.component_type) {
                        data.nodes.remove(tempData);
                        tempRedo.push(tempData);

                    }
                    else {
                        data.edges.remove(tempData);
                        tempRedo.push(tempData);
                        nodeValidationInEdge(tempData.from, tempData.to);
                        multipleFiberService(tempData.from, tempData.to);
                    }
                }
                tempUndo.pop();
            }
            else {
                if (tempData.isUpdate) {
                    for (var i = 0; i < tempData.list.length; i++) {

                        if (tempData.list[i].component_type == roadmJSON.component_type) {
                            for (var j = 0; j < tempData.preList.length; j++) {
                                if (tempData.list[i].id == tempData.preList[j].id) {
                                    data.nodes.update(tempData.preList[j]);
                                    break;
                                }
                            }
                        }
                        else if (tempData.list[i].component_type == singleFiberJSON.component_type) {
                            for (var j = 0; j < tempData.preList.length; j++) {
                                if (tempData.list[i].id == tempData.preList[j].id) {
                                    data.edges.update(tempData.preList[j]);
                                    nodeValidationInEdge(tempData.preList[j].from, tempData.preList[j].to);
                                    multipleFiberService(tempData.preList[j].from, tempData.preList[j].to);
                                    break;
                                }
                            }
                        }
                    }
                    tempRedo.push(tempData);
                }
                else {
                    for (var i = 0; i < tempData.list.length; i++) {
                        if (tempData.list[i].component_type == roadmJSON.component_type)
                            data.nodes.update(tempData.list[i]);
                        else if (tempData.list[i].component_type == singleFiberJSON.component_type) {
                            data.edges.update(tempData.list[i]);
                            nodeValidationInEdge(tempData.list[i].from, tempData.list[i].to);
                            multipleFiberService(tempData.list[i].from, tempData.list[i].to);
                        }
                    }

                    tempRedo.push(tempData);
                }
                tempUndo.pop();
            }
        }
        remove_NodeFiberHighlight();

        $(btnAddRoadm).removeClass('highlight');
        $(btnAddFused).removeClass('highlight');
        $(btnAddILA).removeClass('highlight');
        $(btnAddAmplifier).removeClass('highlight');
        $(btnAddTransceiver).removeClass('highlight')
        nodeMode = 0;
        enableEdgeIndicator();

    });

    /** 
     *  Redo network actions.
     *  The undo function is used to reverse a mistake, such as deleting the wrong element in a network topology. 
     *  We stored every action detail one by one into array list (tempUndo) like node creation/deletion/updating etc...
     *  ex:node creation/deletion/updating: tempUndo.push(nodedata).
     *  we fetch latest one record from array list (tempUndo) then will check record whether creation/deletion/updating after that will call the relevant action. 
     *  After will stored action details into new array list (tempRedo) then will using pop method to remove record from array list (tempUndo) ex: tempUndo.pop().
     *  Ex: node updating:
     *  tempRedo.push(nodedata).
     *  data.nodes.update (latest record of tempUndo).
     */
    $("#button_redo").on("click", function () {
        if (tempRedo.length > 0) {
            var tempData = tempRedo[tempRedo.length - 1];

            if (!tempData.isMultiple) {

                if (tempData.isDelete) {

                    tempUndo.push(tempData);
                    tempUndo[tempUndo.length - 1].isDelete = true;
                    tempUndo[tempUndo.length - 1].isUpdate = false;

                    if (tempData.component_type == roadmJSON.component_type) {
                        data.nodes.remove(tempData);
                    }
                    else {
                        data.edges.remove(tempData);
                        nodeValidationInEdge(tempData.from, tempData.to);
                        multipleFiberService(tempData.from, tempData.to);
                    }
                    tempRedo.pop();
                }
                else {
                    tempUndo.push(tempData);
                    tempUndo[tempUndo.length - 1].isDelete = false;
                    tempUndo[tempUndo.length - 1].isUpdate = true;
                    if (tempData.component_type == roadmJSON.component_type) {
                        data.nodes.update(tempData);
                    }
                    else {
                        data.edges.update(tempData);
                        nodeValidationInEdge(tempData.from, tempData.to);
                        multipleFiberService(tempData.from, tempData.to);
                    }

                    tempRedo.pop();
                }
            }
            else {

                if (!tempData.isUpdate) {
                    for (var i = 0; i < tempData.list.length; i++) {
                        if (tempData.list[i].component_type == roadmJSON.component_type)
                            data.nodes.remove(tempData.list[i]);
                        else if (tempData.list[i].component_type == singleFiberJSON.component_type) {
                            data.edges.remove(tempData.list[i]);
                            nodeValidationInEdge(tempData.list[i].from, tempData.list[i].to);
                            multipleFiberService(tempData.list[i].from, tempData.list[i].to);
                        }
                    }
                }
                else {
                    for (var i = 0; i < tempData.preList.length; i++) {
                        if (tempData.preList[i].component_type == roadmJSON.component_type) {
                            for (var j = 0; j < tempData.list.length; j++) {
                                if (tempData.list[j].id == tempData.preList[i].id) {
                                    data.nodes.update(tempData.list[i]);
                                    break;
                                }
                            }
                        }
                        else if (tempData.preList[i].component_type == singleFiberJSON.component_type) {
                            for (var j = 0; j < tempData.list.length; j++) {
                                if (tempData.list[j].id == tempData.preList[i].id) {
                                    data.edges.update(tempData.list[i]);
                                    nodeValidationInEdge(tempData.list[i].from, tempData.list[i].to);
                                    multipleFiberService(tempData.list[i].from, tempData.list[i].to);
                                    break;
                                }
                            }
                        }
                    }
                }
                tempUndo.push(tempData);
                tempRedo.pop();
            }

        }

        remove_NodeFiberHighlight();

        $(btnAddRoadm).removeClass('highlight');
        $(btnAddFused).removeClass('highlight');
        $(btnAddILA).removeClass('highlight');
        $(btnAddAmplifier).removeClass('highlight');
        $(btnAddTransceiver).removeClass('highlight')
        nodeMode = 0;
        enableEdgeIndicator();

    });
    $("#showHideEle").on("click", function () {
        hideEdgeLabels();
        enableEdgeIndicator();
        if (nodeMode == nodeType.ROADM || nodeMode == nodeType.ILA || nodeMode == nodeType.Attenuator || nodeMode == nodeType.Transceiver || nodeMode == nodeType.Amplifier || nodeMode == nodeType.RamanAmplifier)
            network.addNodeMode();
    });
    $("#hoverDiv").mouseover(function () {
        $(this).hide();
    });
    $("#stepCreateTopology").click(function () {
        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        $("#edit-topology").show();
        $("#add-service").hide();
    });
    $("#stepAddService").click(function () {
        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        $("#edit-topology").hide();
        $("#add-service").show();
    });
    $("#stepSaveNetwork").click(function () {
        $("#edit-topology").hide();
        $("#add-service").hide();
    });
    $("#ddlNetworkView").change(function () {
        networkView($(this).val());
    });
    $('#btn_CreateNetwork').click(function () {
        $('#divSelection').hide();
        $("#stepCreateTopology").click();
    });
    $('#cbxSingleFiber').change(function () {
        if (this.checked) {
            //alert();
        }
    });
});

/**
 * Network view changes by selection. 
 * Show/Hid the some components menu and options based on selected network view.
 * @param {number} view - 1 -> NE view, 2-> Functional view.
 */
function networkView(view) {
    if (view == topologyView.NE_View)//collapsed view /NE view
    {
        networkMenuHide();
        $("#btnAddSingleFiber").hide();
        $("#btnAddSinglePatch").hide();
        $("#btnAddRamAmp").hide();
        $("#btnAddAmplifier").hide();

        $("#btnAddILA").show();
        $("#btnAddDualFiber").show();
        //$("#btnAddDualPatch").show();
        //isExpandedView = false;

        //if (isImportJSON) {
        //    $("#edit-topology").hide();
        //    $("#add-service").hide();
        //}
        expandAndCollapseView(topologyView.NE_View);
    }
    else if (view == topologyView.Functional_View)//expanded view/Functional View
    {
        networkMenuHide();
        $("#btnAddSingleFiber").show();
        $("#btnAddSinglePatch").show();
        $("#btnAddRamAmp").show();
        $("#btnAddAmplifier").show();

        $("#btnAddILA").hide();
        $("#btnAddDualFiber").hide();
        //$("#btnAddDualPatch").hide();
        //if (isImportJSON) {
        //$("#edit-topology").hide();
        //$("#add-service").hide();
        //isExpandedView = true;

        //disabled temp - increase performance in import json
        //expandAndCollapseView(topologyView.Functional_View);

        //}
        //else {
        //    isExpandedView = false;
        //    expandAndCollapseView(false);
        //}
    }
}

/**
 * Show/Hide the node/fiber/patch/service label by network view.
 * @param {number} view - 1 -> NE view, 2-> Functional view.
 */
function expandAndCollapseView(view) {
    var FVEdges = network.body.data.edges.get({
        filter: function (item) {
            return (item.view == topologyView.Functional_View);
        }
    });
    var FVNodes = network.body.data.nodes.get({
        filter: function (item) {
            return (item.view == topologyView.Functional_View);
        }
    });
    var NVEdges = network.body.data.edges.get({
        filter: function (item) {
            return (item.view == topologyView.NE_View);
        }
    });
    var NVNodes = network.body.data.nodes.get({
        filter: function (item) {
            return (item.view == topologyView.NE_View);
        }
    });
    if (view == topologyView.Functional_View) {
        $.each(FVEdges, function (index, item) {
            network.body.data.edges.update({
                id: item.id, hidden: false
            });
        });
        $.each(FVNodes, function (index, item) {
            network.body.data.nodes.update({
                id: item.id, hidden: false
            });
        });

        $.each(NVEdges, function (index, item) {
            network.body.data.edges.update({
                id: item.id, hidden: true
            });
        });
        $.each(NVNodes, function (index, item) {
            network.body.data.nodes.update({
                id: item.id, hidden: true
            });
        });


    }
    else if (view == topologyView.NE_View) {
        $.each(FVEdges, function (index, item) {
            network.body.data.edges.update({
                id: item.id, hidden: true
            });
        });
        $.each(FVNodes, function (index, item) {
            network.body.data.nodes.update({
                id: item.id, hidden: true
            });
        });

        $.each(NVEdges, function (index, item) {
            network.body.data.edges.update({
                id: item.id, hidden: false
            });
        });
        $.each(NVNodes, function (index, item) {
            network.body.data.nodes.update({
                id: item.id, hidden: false
            });
        });
    }
}
function networkMenuHide() {
    if (currentStepper) {
        if (currentStepper == "stepCreateTopology") {
            showMenu = 1;
            $("#stepCreateTopology").click();
        }
        else if (currentStepper == "stepAddService") {
            showMenu = 2;
            $("#stepAddService").click();
        }
    }
    else {
        showMenu = 1;
        $("#stepCreateTopology").click();
    }
}
/** This function is used to show/hide the nodes/fiber/patch/service labels except ROADM. 
 * Here we udpate the network options.
 * Update the model of edge and node color as transparent then set it to network options. 
 */

function hideEdgeLabels() {
    if (!displayEdgeLabels) {
        // Apply options for hidden edge text
        // This will override the existing options for text color
        // This does not clear other options (e.g. node.color)
        network.setOptions(hiddenEdgeTextOptions);
        displayEdgeLabels = true;
    } else {
        // Apply standard options
        options.physics = optionsJSON.physics;
        network.setOptions(options);
        displayEdgeLabels = false;
    }
    enableEdgeIndicator();
}

/**
 * Calculate the fiber span loss, length and coefficient.
 * @param {string} eleSL - The span length of fiber.
 * @param {string} eleLC - The loss coefficient of fiber.
 * @param {string} eleSpanLoss - The span loss of fiber.
 */
function fiberLengthCal(eleSL, eleLC, eleSpanLoss) {
    var spanLength = "#" + eleSL;
    var lossCoefficient = "#" + eleLC;
    var spanLoss = "#" + eleSpanLoss;
    var span_length = parseFloat($(spanLength).val());
    var loss_coefficient = parseFloat($(lossCoefficient).val());
    $(spanLoss).val(span_length * loss_coefficient);
}

/**
 * Highlight/Un-Highlight the component menu by node mode and name.
 * @param {string} mode - Node mode.
 * @param {string} nodename - Node name.
 */
function enableDisableNode(mode, nodename) {
    if (nodeMode == mode) {
        modeHighLight();
        AddNodeMode();
    }
    else {
        modeHighLight(nodename);
        AddNodeMode(mode);
    }
}

/**  Disable browser right click options. */
$(document).bind("contextmenu", function (e) {
    return false;
});

/** To create random text for token creation. */
var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};

/** To generate token for component creation.
 * It will consider as component ID. */
var token = function () {
    return rand() + rand(); // to make it longer
};

/**
 * Initialize the vis.network,Data and options.
 * Define all component events.
 * @param {boolean} isImport - True -> Initialize while import network json file, False -> Initialize while page loading.
 */
function draw(isImport) {
    // create a network
    var container = document.getElementById("mynetwork");
    // create an array with nodes
    nodes = new vis.DataSet([
    ]);

    // create an array with edges
    edges = new vis.DataSet([

    ]);
    if (isImport) {
        data = {
            nodes: new vis.DataSet(importNodes),
            edges: new vis.DataSet(importEdges)
        }
    }
    else {
        data = {
            nodes: nodes,
            edges: edges
        }
    }

    var iteration = data.nodes.length + data.edges.length;
    options = {
        interaction: optionsJSON.interaction,
        physics: {
            stabilization: {
                enabled: true,
                iterations: 0,
                updateInterval: 0,
            },
        },
        edges: {
            font: optionsJSON.edges.font,
            smooth: optionsJSON.edges.smooth
        },
        nodes:
        {
            shape: roadmJSON.shape,
            size: roadmJSON.size,
            icon: roadmJSON.icon,
            color: roadmJSON.color,
            font: roadmJSON.font
        },
        manipulation: {
            enabled: false,
            addNode: function (data, callback) {
                //if (isExpandedView || isImportJSON) {
                //    return;
                //}
                if (nodeMode > 0 && nodeMode < 7) {
                    addNodes(data, callback);
                }
            },
            addEdge: function (data, callback) {
                if (data.from == data.to)
                    return;

                if (isSingleFiberMode == 1 || isSingleFiberMode == 1) {
                    addEdgeData = {
                        from: data.from,
                        to: data.to
                    };
                    addFiber();
                }
                else if (isSinglePatchMode == 1 || isDualPatchMode == 1) {
                    addPatchData = {
                        from: data.from,
                        to: data.to
                    };
                    if (isSinglePatchMode == 1)
                        addSinglePatch();
                    else if (isDualPatchMode == 1)
                        addDualPatch();

                }
                else if (isAddService == 1) {
                    addServiceData = {
                        from: data.from,
                        to: data.to
                    };
                    addService();
                }
            },
        },
    };
    network = new vis.Network(container, data, options);

    network.on("click", function (params) {
        $("#hoverDiv").hide();
        if (!params.event.srcEvent.ctrlKey)
            remove_NodeFiberHighlight();
        else {
            var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
            if (clickedNode != undefined) {
                var nodeDetails = network.body.data.nodes.get(clickedNode.id);
                if (!nodeSelect) {
                    if (!network.body.nodes[clickedNode.id].selected) {
                        if (nodeDetails.h_image) {
                            network.body.data.nodes.update({
                                id: nodeDetails.id, image: nodeDetails.h_image, h_image: nodeDetails.image, is_highlight: false
                            });
                        }
                    }
                }
            }

        }
        var sNodes = network.body.data.nodes.get({
            filter: function (item) {
                return (item.is_highlight == true);
            }
        });

        if (sNodes.length == 0)
            network.unselectAll();
        nodeSelect = false;

    });

    network.on("selectEdge", function (params) {
        if (params.nodes.length > 0)
            return;

        var selectedEdges = network.body.data.edges.get({
            filter: function (item) {
                return (item.is_highlight == true);
            }
        });
        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        var clickedEdge = this.body.edges[this.getEdgeAt(params.pointer.DOM)];
        var edgeDetails = network.body.data.edges.get(clickedEdge.id);
        var copyDetails;
        if (params.event.srcEvent.ctrlKey) {

            var sEdges = network.body.data.edges.get({
                filter: function (item) {
                    return (item.is_highlight == true);
                }
            });
            if (params.edges.length > 1) {
                if (sEdges.length > 0)
                    copyDetails = network.body.data.edges.get(sEdges[0].id);
                else
                    copyDetails = network.body.data.edges.get(params.edges[params.edges.length - 1]);
            } else {
                copyDetails = network.body.data.edges.get(params.edges[0]);
            }

            if (selectedEdges.length >= 0) {
                if (selectedEdges.length > 0 && selectedEdges[selectedEdges.length - 1].component_type != selectedEdges.component_type) {
                    copyDetails = selectedEdges[selectedEdges.length - 1];

                    if (copyDetails.component_type != edgeDetails.component_type) {
                        showMessage(alertType.Error, 'Please select same type of element (Fiber)');
                        return;
                    }
                    else {
                        $('#toast').toast('hide');
                    }
                }
                else {
                    $('#toast').toast('hide');
                }
            }
            if (params.event.srcEvent.ctrlKey) {
                var shadow;
                if (edgeDetails.component_type == singleFiberJSON.component_type) {
                    var highlight = false;
                    if (edgeDetails.shadow == singleFiberJSON.options.shadow) {
                        shadow = [];
                    }
                    else {
                        shadow = singleFiberJSON.options.shadow;
                        highlight = true;
                    }

                    network.body.data.edges.update({
                        id: edgeDetails.id, shadow: shadow, is_highlight: highlight
                    });
                }

            }
        }
    });
    network.on("selectNode", function (params) {
        var hEdges = network.body.data.edges.get({
            filter: function (item) {
                return (item.is_highlight == true);
            }
        });

        if (hEdges.length > 0) {
            showMessage(alertType.Error, 'Please select same type of element (Fiber)');
            return;
        }

        var selectedNodes = network.body.data.nodes.get({
            filter: function (item) {
                return (item.is_highlight == true);
            }
        });

        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        var nodeDetails = network.body.data.nodes.get(clickedNode.id);
        var copyDetails;
        if (isCopyPara || (!isCopyPara && params.event.srcEvent.ctrlKey)) {

            if (isCopyPara)
                copyDetails = network.body.data.nodes.get(copiedNodeID);
            else {
                var sNodes = network.body.data.nodes.get({
                    filter: function (item) {
                        return (item.is_highlight == true);
                    }
                });
                if (params.nodes.length > 1) {
                    if (sNodes.length > 0)
                        copyDetails = network.body.data.nodes.get(sNodes[0].id);
                    else
                        copyDetails = network.body.data.nodes.get(params.nodes[params.nodes.length - 1]);
                } else {
                    copyDetails = network.body.data.nodes.get(params.nodes[0]);
                }
            }

            type_name = copyDetails.node_type;
            if (copyDetails.node_type == amplifierJSON.node_type) {
                if (copyDetails.amp_category == ramanampJSON.amp_category)
                    type_name = 'Raman Amplifier';
                else
                    type_name = copyDetails.amp_category;
            }
            else if (copyDetails.node_type == roadmJSON.node_type)
                type_name = copyDetails.node_type.toUpperCase();
            else if (copyDetails.node_type == fusedJSON.node_type)
                type_name = "Attenuator";


            if ((isCopyPara && selectedNodes.length == 0) || (isCopyPara && selectedNodes.length > 0)) {
                if (isCopyPara && selectedNodes.length > 0 && selectedNodes[selectedNodes.length - 1].node_type != nodeDetails.node_type) {
                    copyDetails = selectedNodes[selectedNodes.length - 1];
                    type_name = copyDetails.node_type;
                    if (copyDetails.node_type == amplifierJSON.node_type) {
                        if (copyDetails.amp_category == ramanampJSON.amp_category)
                            type_name = 'Raman Amplifier';
                        else
                            type_name = copyDetails.amp_category;
                    }
                    else if (copyDetails.node_type == roadmJSON.node_type)
                        type_name = copyDetails.node_type.toUpperCase();
                    else if (copyDetails.node_type == fusedJSON.node_type)
                        type_name = "Attenuator";

                    if (copyDetails.node_type != nodeDetails.node_type) {
                        showMessage(alertType.Error, 'Please select same type of node (' + type_name + ')');
                        nodeSelect = true;
                        return;

                    }
                    else {
                        if (copyDetails.amp_category && nodeDetails.amp_category) {
                            if (copyDetails.amp_category != nodeDetails.amp_category) {
                                showMessage(alertType.Error, 'Please select same type of node (' + type_name + ')');
                                nodeSelect = true;
                                return;
                            }
                            else {
                                $('#toast').toast('hide');
                            }

                        }
                        else
                            $('#toast').toast('hide');
                    }
                }
                else {
                    if (isCopyPara && selectedNodes.length > 0 && selectedNodes[selectedNodes.length - 1].amp_category != nodeDetails.amp_category) {

                        copyDetails = selectedNodes[selectedNodes.length - 1];
                        type_name = copyDetails.node_type;
                        if (copyDetails.node_type == amplifierJSON.node_type) {
                            if (copyDetails.amp_category == ramanampJSON.amp_category)
                                type_name = 'Raman Amplifier';
                            else
                                type_name = copyDetails.amp_category;
                        }
                        else if (copyDetails.node_type == roadmJSON.node_type)
                            type_name = copyDetails.node_type.toUpperCase();
                        else if (copyDetails.node_type == fusedJSON.node_type)
                            type_name = "Attenuator";

                        showMessage(alertType.Error, 'Please select same type of node (' + type_name + ')');
                        nodeSelect = true;
                        return;
                    }
                    else
                        $('#toast').toast('hide');
                }

            }
            else {

                if (copyDetails.node_type != nodeDetails.node_type) {
                    showMessage(alertType.Error, 'Please select same type of node (' + type_name + ')');
                    nodeSelect = true;
                    return;
                }
                else {
                    if (copyDetails.amp_category && nodeDetails.amp_category) {
                        if (copyDetails.amp_category != nodeDetails.amp_category) {
                            showMessage(alertType.Error, 'Please select same type of node (' + type_name + ')');
                            nodeSelect = true;
                            return;
                        }
                        else {
                            $('#toast').toast('hide');
                        }

                    }
                    else
                        $('#toast').toast('hide');
                }
            }

            if (params.event.srcEvent.ctrlKey) {
                var image;
                if (nodeDetails.node_type == roadmJSON.node_type) {
                    if (nodeDetails.image == DIR + roadmJSON.h_image) {
                        image = nodeDetails.h_image;
                    }
                    else {
                        if (nodeDetails.image == DIR + roadmJSON.w_image)
                            image = DIR + roadmJSON.h_image;
                        else if (nodeDetails.image == DIR + roadmJSON.image)
                            image = DIR + roadmJSON.fh_image;
                    }
                }
                else if (nodeDetails.node_type == fusedJSON.node_type) {
                    if (nodeDetails.image == DIR + fusedJSON.h_image) {
                        image = nodeDetails.h_image;
                    }
                    else {
                        if (nodeDetails.image == DIR + fusedJSON.w_image)
                            image = DIR + fusedJSON.h_image;
                        else if (nodeDetails.image == DIR + fusedJSON.image)
                            image = DIR + fusedJSON.fh_image;
                    }
                }
                else if (nodeDetails.node_type == transceiverJSON.node_type) {
                    if (nodeDetails.image == DIR + transceiverJSON.h_image) {
                        image = nodeDetails.h_image;
                    }
                    else {
                        if (nodeDetails.image == DIR + transceiverJSON.w_image)
                            image = DIR + transceiverJSON.h_image;
                        else if (nodeDetails.image == DIR + transceiverJSON.image)
                            image = DIR + transceiverJSON.fh_image;
                    }
                }
                else if (nodeDetails.node_type == amplifierJSON.node_type) {
                    if (nodeDetails.amp_category == amplifierJSON.amp_category) {
                        if (nodeDetails.image == DIR + amplifierJSON.h_image) {
                            image = nodeDetails.h_image;
                        }
                        else {
                            if (nodeDetails.image == DIR + amplifierJSON.w_image)
                                image = DIR + amplifierJSON.h_image;
                            else if (nodeDetails.image == DIR + amplifierJSON.image)
                                image = DIR + amplifierJSON.fh_image;
                        }
                    }
                    else if (nodeDetails.amp_category == ramanampJSON.amp_category) {
                        if (nodeDetails.image == DIR + ramanampJSON.h_image) {
                            image = nodeDetails.h_image;
                        }
                        else {
                            if (nodeDetails.image == DIR + ramanampJSON.w_image)
                                image = DIR + ramanampJSON.h_image;
                            else if (nodeDetails.image == DIR + ramanampJSON.image)
                                image = DIR + ramanampJSON.fh_image;
                        }
                    }
                }

                if (image) {
                    var highlight = true;
                    if (image == DIR + roadmJSON.image || image == DIR + roadmJSON.w_image)
                        highlight = false;
                    else if (image == DIR + fusedJSON.image || image == DIR + fusedJSON.w_image)
                        highlight = false;
                    else if (image == DIR + transceiverJSON.image || image == DIR + transceiverJSON.w_image)
                        highlight = false;
                    else if (image == DIR + amplifierJSON.image || image == DIR + amplifierJSON.w_image)
                        highlight = false;
                    else if (image == DIR + ramanampJSON.image || image == DIR + ramanampJSON.w_image)
                        highlight = false;

                    network.body.data.nodes.update({
                        id: nodeDetails.id, image: image, h_image: nodeDetails.image, is_highlight: highlight
                    });
                }

                nodeSelect = true;
            }
            else {
                nodeSelect = false;
            }
        }
    });
    network.on("oncontext", function (data, callback) {
        //if (isExpandedView || isImportJSON) {
        //    return;
        //}
        //nodeMode = "";
        var tempNodeType;
        if (isCopyPara)
            tempNodeType = network.body.data.nodes.get(copiedNodeID).node_type;

        insertNodeX = data.pointer.canvas.x;
        insertNodeY = data.pointer.canvas.y;
        $("#hoverDiv").hide();
        var nodeDatas = this.body.nodes[this.getNodeAt(data.pointer.DOM)];
        var edgeDatas = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
        var nodeData = "";
        var edgeData = "";
        if (nodeDatas != undefined)
            nodeData = nodeDatas.id;
        if (edgeDatas != undefined)
            edgeData = edgeDatas.id;

        var sNodes = network.body.data.nodes.get({
            fields: ['id'],
            filter: function (item) {
                return (item.is_highlight == true);
            }
        });

        var nodesArray = [];
        if (data.nodes.length > 0 && sNodes.length > 0) {
            nodesArray = sNodes;
            //nodesArray.push(nodeData);
        }
        else if (nodeData != "")
            nodesArray.push(nodeData);

        var hEdges = network.body.data.edges.get({
            fields: ['id'],
            filter: function (item) {
                return (item.is_highlight == true);
            }
        });


        var edgesArray = [];
        if (hEdges.length > 0) {
            edgesArray = hEdges;

            if (!network.body.data.edges.get(edgeData).is_highlight)
                edgesArray.push({ id: edgeData });

        }
        else if (nodeData == "" && edgeData != "") {
            edgesArray.push({ id: edgeData });
        }


        var type = "";
        var fiber_category = "";
        var patch_category = "";
        var amp_category = "";
        if ((nodeData != '' && edgeData != '') || nodeData != '') {
            type = network.body.data.nodes.get(nodeData).node_type;
            amp_category = network.body.data.nodes.get(nodeData).amp_category;
        }
        else if (edgeData != '') {
            type = network.body.data.edges.get(edgeData).component_type;
            fiber_category = network.body.data.edges.get(edgeData).fiber_category;
            patch_category = network.body.data.edges.get(edgeData).patch_category;
        }
        else {
            if (showMenu == 1) {
                if (isCopy) {
                    showContextMenu(data.event.pageX, data.event.pageY, "pasteMenu");
                }
            }
            return;
        }

        if (showMenu == 1) {
            var copyDetails;
            var type_name;
            if ((isCopyPara || sNodes.length > 0) && hEdges.length == 0) {

                if (isCopyPara) {
                    if (sNodes.length > 0)
                        copyDetails = network.body.data.nodes.get(sNodes[sNodes.length - 1].id);
                    else {
                        if (nodeDatas)
                            copyDetails = network.body.data.nodes.get(nodeDatas.id);
                    }

                }
                else
                    copyDetails = network.body.data.nodes.get(sNodes[0].id);

                if (copyDetails) {

                    type_name = copyDetails.node_type;
                    if (copyDetails.node_type == amplifierJSON.node_type) {
                        if (copyDetails.amp_category == ramanampJSON.amp_category)
                            type_name = 'Raman Amplifier';
                        else
                            type_name = copyDetails.amp_category;
                    }
                    else if (copyDetails.node_type == roadmJSON.node_type)
                        type_name = copyDetails.node_type.toUpperCase();
                    else if (copyDetails.node_type == fusedJSON.node_type)
                        type_name = "Attenuator";


                    if (type != copyDetails.node_type) {

                        showMessage(alertType.Error, 'Please select same type of node (' + type_name + ')');
                        return;
                    }
                    else {
                        if (type == copyDetails.node_type) {

                            if (type == amplifierJSON.node_type && copyDetails.node_type == amplifierJSON.node_type) {
                                if (amp_category != copyDetails.amp_category) {
                                    showMessage(alertType.Error, 'Please select same type of node (' + type_name + ')');
                                    return;
                                }
                            }

                            $('#toast').toast('hide');

                        }
                    }
                }
            }


            if (edgesArray.length > 0) {
                if (hEdges.length > 0)
                    copyDetails = network.body.data.edges.get(hEdges[hEdges.length - 1].id);
                else
                    copyDetails = network.body.data.edges.get(edgeDatas.id);
                if (type != copyDetails.component_type) {

                    showMessage(alertType.Error, 'Please select same type of element (Fiber)');
                    return;
                }
                else {
                    $('#toast').toast('hide');
                }

            }
        }

        if (nodeDatas != undefined) {

        }
        if (!nodeDatas && edgeDatas != undefined) {
            network.body.data.edges.update({
                id: edgeDatas.id, shadow: singleFiberJSON.options.shadow, is_highlight: true
            });

        }

        //to add only same type of node on multiple select
        nodesArray = [];
        if (data.nodes.length > 0 && sNodes.length > 0) {

            for (var i = 0; i < sNodes.length; i++) {
                if (network.body.data.nodes.get(sNodes[0].id).node_type == network.body.data.nodes.get(sNodes[i].id).node_type) {
                    if ((network.body.data.nodes.get(sNodes[0].id).node_type == network.body.data.nodes.get(sNodes[i].id).node_type) && network.body.data.nodes.get(sNodes[0].id).node_type == amplifierJSON.node_type) {
                        if (network.body.data.nodes.get(sNodes[0].id).amp_category == network.body.data.nodes.get(sNodes[i].id).amp_category)
                            nodesArray.push(sNodes[i].id);

                    }
                    else
                        nodesArray.push(sNodes[i].id);
                }
            }
        }
        else
            nodesArray.push(nodeData);


        if (type == serviceJSON.component_type) {
            if (showMenu == 2)//enable service menu
            {
                if (edgeData != undefined) {

                    showContextMenu(data.event.pageX, data.event.pageY, "serviceMenu");
                    document.getElementById("rcServiceEdit").onclick = serviceEdit.bind(
                        this,
                        edgeData,
                        callback
                    );
                    document.getElementById("rcServiceDelete").onclick = deleteService.bind(
                        this,
                        edgeData,
                        callback
                    );
                }
            }

        }
        else {
            if (showMenu == 1)//2 enable node and fiber menus
            {

                if (type == roadmJSON.node_type || type == ILAJSON.node_type || type == fusedJSON.node_type || type == transceiverJSON.node_type)//node || amp ||fused||transceiver
                {
                    if (nodeData != undefined) {
                        if (type == roadmJSON.node_type) {


                            //$("#rcRoadmCopy").show();
                            $("#rcRoadmApplyPro").hide();
                            $("#rcRoadmCopyPara").show();
                            $("#rcRoadmCancel").hide();

                            if (nodesArray.length > 1 && sNodes.length > 1) {
                                $("#rcRoadmCopy").hide();
                                $("#rcRoadmCopyPara").hide();
                            }
                            else {
                                $("#rcRoadmCopy").show();
                                $("#rcRoadmCopyPara").show();
                            }


                            if (isCopyPara) {
                                if (tempNodeType == type) {
                                    $("#rcRoadmApplyPro").show();
                                    $("#rcRoadmCancel").show();
                                    $("#rcRoadmCopyPara").hide();
                                }
                            }

                            showContextMenu(data.event.pageX, data.event.pageY, "roadmMenu");
                            document.getElementById("rcRoadmEdit").onclick = roadmEdit.bind(
                                this,
                                nodesArray,
                                callback

                            );
                            document.getElementById("rcRoadmDelete").onclick = deleteNode.bind(
                                this,
                                nodesArray,
                                callback
                            );
                            document.getElementById("rcRoadmCopy").onclick = copyNode.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcRoadmCopyPara").onclick = copyNodeTemplate.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcRoadmApplyPro").onclick = applyTemplate.bind(
                                this,
                                nodesArray,
                                callback

                            );
                            document.getElementById("rcRoadmCancel").onclick = cancelCopyTemplate.bind(
                                this,
                                nodeData,
                                callback

                            );


                        }
                        else if (type == fusedJSON.node_type) {
                            showContextMenu(data.event.pageX, data.event.pageY, "attenuatorMenu");

                            if (nodesArray.length > 1 && sNodes.length > 1) {
                                $("#rcAttenuatorCopy").hide();
                            }
                            else {
                                $("#rcAttenuatorCopy").show();
                            }

                            document.getElementById("rcAttenuatorEdit").onclick = attenuatorEdit.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcAttenuatorDelete").onclick = deleteNode.bind(
                                this,
                                nodesArray,
                                callback
                            );
                            document.getElementById("rcAttenuatorCopy").onclick = copyNode.bind(
                                this,
                                nodeData,
                                callback

                            );
                        }
                        else if (type == ILAJSON.node_type) {
                            if (amp_category == ILAJSON.amp_category) {
                                showContextMenu(data.event.pageX, data.event.pageY, "ILAMenu");
                                document.getElementById("rcILAEdit").onclick = ILAEdit.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcILADelete").onclick = deleteNode.bind(
                                    this,
                                    nodeData,
                                    callback
                                );
                                document.getElementById("rcILACopy").onclick = copyNode.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                            }
                            else if (amp_category == amplifierJSON.amp_category) {

                                $("#rcAmplifierCopy").show();
                                $("#rcAmplifierCopyPara").show();
                                $("#rcAmpApplyPro").hide();
                                $("#rcAmpCancel").hide();

                                if (nodesArray.length > 1 && sNodes.length > 1) {
                                    $("#rcAmplifierCopy").hide();
                                    $("#rcAmplifierCopyPara").hide();
                                }
                                else {
                                    $("#rcAmplifierCopy").show();
                                    $("#rcAmplifierCopyPara").show();
                                }

                                if (isCopyPara) {
                                    if (network.body.data.nodes.get(copiedNodeID).amp_category == amp_category) {
                                        $("#rcAmpApplyPro").show();
                                        $("#rcAmpCancel").show();
                                        $("#rcAmplifierCopyPara").hide();
                                    }

                                }

                                showContextMenu(data.event.pageX, data.event.pageY, "amplifierMenu");
                                document.getElementById("rcAmplifierEdit").onclick = amplifierEdit.bind(
                                    this,
                                    nodesArray,
                                    callback

                                );
                                document.getElementById("rcAmplifierDelete").onclick = deleteNode.bind(
                                    this,
                                    nodesArray,
                                    callback
                                );
                                document.getElementById("rcAmplifierCopy").onclick = copyNode.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcAmplifierCopyPara").onclick = copyNodeTemplate.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcAmpApplyPro").onclick = applyTemplate.bind(
                                    this,
                                    nodesArray,
                                    callback

                                );
                                document.getElementById("rcAmpCancel").onclick = cancelCopyTemplate.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                            }
                            else if (amp_category == ramanampJSON.amp_category) {

                                $("#rcRamanAmpCopy").show();
                                $("#rcRamanAmpCopyPara").show();
                                $("#rcRamanCancel").hide();
                                $("#rcRamanApplyPro").hide();

                                if (nodesArray.length > 1 && sNodes.length > 1) {
                                    $("#rcRamanAmpCopy").hide();
                                    $("#rcRamanAmpCopyPara").hide();
                                }
                                else {
                                    $("#rcRamanAmpCopy").show();
                                    $("#rcRamanAmpCopyPara").show();
                                }

                                if (isCopyPara) {
                                    if (network.body.data.nodes.get(copiedNodeID).amp_category == amp_category) {
                                        $("#rcRamanApplyPro").show();
                                        $("#rcRamanCancel").show();
                                        $("#rcRamanAmpCopyPara").hide();
                                    }
                                }

                                showContextMenu(data.event.pageX, data.event.pageY, "ramanAmpMenu");
                                document.getElementById("rcRamanAmpEdit").onclick = ramanAmpEdit.bind(
                                    this,
                                    nodesArray,
                                    callback

                                );
                                document.getElementById("rcRamanAmpDelete").onclick = deleteNode.bind(
                                    this,
                                    nodesArray,
                                    callback
                                );
                                document.getElementById("rcRamanAmpCopy").onclick = copyNode.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcRamanAmpCopyPara").onclick = copyNodeTemplate.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcRamanApplyPro").onclick = applyTemplate.bind(
                                    this,
                                    nodesArray,
                                    callback

                                );
                                document.getElementById("rcRamanCancel").onclick = cancelCopyTemplate.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                            }
                        }
                        else if (type == transceiverJSON.node_type) {

                            $("#rcTransceiverCopy").show();
                            $("#rcTransceiverCopyPara").show();
                            $("#rcTransApplyPro").hide();
                            $("#rcTransCancel").hide();

                            if (nodesArray.length > 1 && sNodes.length > 1) {
                                $("#rcTransceiverCopy").hide();
                                $("#rcTransceiverCopyPara").hide();
                            }
                            else {
                                $("#rcTransceiverCopy").show();
                                $("#rcTransceiverCopyPara").show();
                            }
                            if (isCopyPara) {
                                if (tempNodeType == type) {
                                    $("#rcTransApplyPro").show();
                                    $("#rcTransCancel").show();
                                    $("#rcTransceiverCopyPara").hide();
                                }

                            }
                            showContextMenu(data.event.pageX, data.event.pageY, "transceiverMenu");
                            document.getElementById("rcTransceiverEdit").onclick = transceiverEdit.bind(
                                this,
                                nodesArray,
                                callback

                            );
                            document.getElementById("rcTransceiverDelete").onclick = deleteNode.bind(
                                this,
                                nodesArray,
                                callback
                            );
                            document.getElementById("rcTransceiverCopy").onclick = copyNode.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcTransceiverCopyPara").onclick = copyNodeTemplate.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcTransApplyPro").onclick = applyTemplate.bind(
                                this,
                                nodesArray,
                                callback

                            );
                            document.getElementById("rcTransCancel").onclick = cancelCopyTemplate.bind(
                                this,
                                nodeData,
                                callback

                            );
                        }
                    }
                }
                else if (type == dualFiberJSON.component_type) {

                    if (edgeData != undefined) {
                        if (fiber_category == dualFiberJSON.fiber_category) {
                            if ($("#menuInserNode").text() == "-")
                                $("#menuInserNode").click();
                            showContextMenu(data.event.pageX, data.event.pageY, "dualFiberMenu");

                            document.getElementById("rcDualInsertROADM").onclick = dualFiberInsertNode.bind(
                                this,
                                edgeData,
                                'Roadm',
                                callback
                            );
                            document.getElementById("rcDualInsertAttenuator").onclick = dualFiberInsertNode.bind(
                                this,
                                edgeData,
                                'Fused',
                                callback
                            );
                            document.getElementById("rcDualInsertILA").onclick = dualFiberInsertNode.bind(
                                this,
                                edgeData,
                                'ILA',
                                callback
                            );
                            document.getElementById("rcDualFiberEdit").onclick = dualFiberEdit.bind(
                                this,
                                edgeData,
                                callback
                            );
                            document.getElementById("rcDualFiberDelete").onclick = deleteFiber.bind(
                                this,
                                edgeData,
                                callback
                            );
                        }
                        if (fiber_category == singleFiberJSON.fiber_category) {
                            if ($("#menuSingleFiberInser").text() == "-")
                                $("#menuSingleFiberInser").click();
                            showContextMenu(data.event.pageX, data.event.pageY, "singleFiberMenu");

                            $("#insertMenu").show();

                            if (edgesArray.length > 1 && hEdges.length > 1) {
                                $("#insertMenu").hide();
                            }
                            else {

                            }

                            document.getElementById("rcSingleInsertROADM").onclick = singleFiberInsertNode.bind(
                                this,
                                edgesArray[0].id,
                                'Roadm',
                                callback
                            );
                            document.getElementById("rcSingleInsertAttenuator").onclick = singleFiberInsertNode.bind(
                                this,
                                edgesArray[0].id,
                                'Fused',
                                callback
                            );
                            document.getElementById("rcSingleInsertAmplifier").onclick = singleFiberInsertNode.bind(
                                this,
                                edgesArray[0].id,
                                'Amplifier',
                                callback
                            );
                            document.getElementById("rcSingleInsertRamanAmp").onclick = singleFiberInsertNode.bind(
                                this,
                                edgesArray[0].id,
                                'RamanAmplifier',
                                callback
                            );
                            document.getElementById("rcSingleFiberEdit").onclick = singleFiberEdit.bind(
                                this,
                                edgesArray,
                                callback
                            );
                            document.getElementById("rcSingleFiberDelete").onclick = deleteFiber.bind(
                                this,
                                edgesArray,
                                callback
                            );
                        }
                    }

                }
                else if (type == singlePatchJSON.component_type) {

                    if (edgeData != undefined) {

                        if (patch_category == singlePatchJSON.patch_category) {

                            showContextMenu(data.event.pageX, data.event.pageY, "singlePatchMenu");
                            document.getElementById("rcSinglePatchEdit").onclick = singlePatchEdit.bind(
                                this,
                                edgeData,
                                callback
                            );
                            document.getElementById("rcSinglePatchDelete").onclick = deletePatch.bind(
                                this,
                                edgeData,
                                callback
                            );
                        }
                        if (patch_category == dualPatchJSON.patch_category) {
                            showContextMenu(data.event.pageX, data.event.pageY, "dualPatchMenu");
                            document.getElementById("rcDualPatchEdit").onclick = dualPatchEdit.bind(
                                this,
                                edgeData,
                                callback
                            );
                            document.getElementById("rcDualPatchDelete").onclick = deletePatch.bind(
                                this,
                                edgeData,
                                callback
                            );
                        }
                    }
                }
            }
        }

        _nodesDB().remove();
    });


    network.on("hoverNode", function (params) {
        try {
            displayNodesHover(params);
        }
        catch (e) { }
    });
    network.on("blurNode", function (params) {
        $('#hoverDiv').hide();
    });
    network.on("hoverEdge", function (params) {
        try {
            displayFiberHover(params);
        }
        catch (e) { }
    });
    network.on("blurEdge", function (params) {
        $('#hoverDiv').hide();
    });
    network.on("stabilizationProgress", function (params) {
        var widthFactor = params.iterations / params.total;
        if (widthFactor > 0) {
            document.getElementById("per").innerText =
                Math.round(widthFactor * 100) + "%";
        }
        else
            document.getElementById("per").innerText = "90%";
    });
    network.once("stabilizationIterationsDone", function () {
        document.getElementById("per").innerText = "100%";
        document.getElementById("loader").style.display = "none";
        options.physics = false;
        network.setOptions(options);
        if (isImport) {
            isImportJSON = true;
            $("#ddlNetworkView").val(topologyView.Functional_View);
            networkView(2);
            $("#importEqpt").val('');
            $('#divSelection').hide();
            displayEdgeLabels = false;
            hideEdgeLabels();
            showMessage(alertType.Success, "JSON file loaded successfully");
        }

    });

    if (!isImport) {
        options.physics = false;
        network.setOptions(options);
        hideEdgeLabels();
    }
}

/**
 * Create container element for display component details when hover mouse on it.
 * @param {string} html - Html elements.
 */
function htmlTitle(html) {
    const container = document.createElement("pre");
    container.innerHTML = html;
    container.style.background = commonJSON.background_color;
    container.style.font = commonJSON.font;
    container.style.padding = "5px";
    container.style.margin = "0px";
    container.style.border = commonJSON.border;
    container.style.transition = "all 1s ease-in-out";
    container.style.fontVariant = commonJSON.font_variant;
    return container;
}

/**
 *Initiate the network initialize by the flag.
 * @param {boolean} isImport - True -> Initialize network while import network json file, False -> Will initialize while page loading.
 */

function init(isImport) {
    if (isImport) {
        draw(isImport);
    }
    else {
        setTimeout(function () {
            draw(isImport);
        }, 1000);
    }
}

/**
 * Export/Save the network topology as a JSON file.
 * The JSON file data's are loaded from network dataset. like nodes, edges.
 * The schema of the JSON file will match the given JSON file like Equipment_JSON_MOD2.json.
 * @param {boolean} isSaveNetwork - True -> Save network topology, False -> Export network topology.
 */
function exportNetwork(isSaveNetwork) {
    var nodeList = [];
    var edgeList = [];
    var topologyArray = [];
    var network_id = configData.project.network_id;

    if (!eqpt_config['tip-photonic-simulation:simulation'] || !eqpt_config['tip-photonic-equipment:transceiver'] || !eqpt_config['tip-photonic-equipment:fiber'] || !eqpt_config['tip-photonic-equipment:amplifier']) {
        showMessage(alertType.Error, "KeyError:'elements', try again");
        return;
    }
    var elabel = "";
    var ox;
    var oy;
    $.each(network.body.data.nodes.get(), function (index, item) {
        ox = network.body.nodes[item.id].x;
        oy = network.body.nodes[item.id].y;

        if (item.node_type == transceiverJSON.node_type) {
            var node = {
                'node-id': item.label,
                'tip-photonic-topology:transceiver': {
                    "model": item.transceiver_type
                },
                metadata: {
                    Positions: {
                        'X-co-ordinate': ox,
                        'Y-co-ordinate': oy,
                        city: item.label,
                        region: ""
                    }
                }
            }
            nodeList.push(node);
        }
        else if (item.node_type == roadmJSON.node_type) {
            var node = {
                'node-id': item.label,
                'tip-photonic-topology:roadm': {
                    "model": item.roadm_type
                },
                metadata: {
                    Positions: {
                        'X-co-ordinate': ox,
                        'Y-co-ordinate': oy,
                        city: item.label,
                        region: ""
                    }
                }
            }
            nodeList.push(node);
        }
        else if (item.node_type == fusedJSON.node_type) {
            var node = {
                'node-id': item.label,
                'tip-photonic-topology:attenuator': {
                },
                metadata: {
                    Positions: {
                        'X-co-ordinate': ox,
                        'Y-co-ordinate': oy,
                        city: item.label,
                        region: ""
                    }
                }
            }
            nodeList.push(node);
        }
        else if (item.amp_category == amplifierJSON.amp_category) {
            var node = {
                'node-id': item.label,
                'tip-photonic-topology:amplifier': {
                    "model": item.amp_type ? item.amp_type : "",
                    "gain-target": item.gain_target ? item.gain_target : "0.0",
                    "tilt-target": item.tilt_target ? item.tilt_target : "0.0",
                    "out-voa-target": item.out_voa_target ? item.out_voa_target : "0.0"
                },
                metadata: {
                    Positions: {
                        'X-co-ordinate': ox,
                        'Y-co-ordinate': oy,
                        city: item.label,
                        region: ""
                    }
                }
            }
            nodeList.push(node);
        }
        else if (item.amp_category == ramanampJSON.amp_category) {
            var node = {
                'node-id': item.label,
                'tip-photonic-topology:ramanamplifier': {
                    'model': item.amp_type,
                    'category': item.category
                },
                metadata: {
                    Positions: {
                        'X-co-ordinate': ox,
                        'Y-co-ordinate': oy,
                        city: item.label,
                        region: ""
                    }
                }
            }
            nodeList.push(node);
        }
    });

    $.each(network.body.data.edges.get(), function (index, item) {
        var edge;
        var fromLabel = network.body.data.nodes.get(item.from).label;
        var toLabel = network.body.data.nodes.get(item.to).label;
        if (item.label.trim() == "")
            elabel = item.text;
        else
            elabel = item.label;
        if (item.component_type == singleFiberJSON.component_type) {
            edge = {
                "link-id": elabel,
                "source": {
                    "source-node": fromLabel
                },
                "destination": {
                    "dest-node": toLabel
                },
                "tip-photonic-topology:fiber": {
                    "type": item.fiber_type,
                    "length": item.span_length.toString(),
                    "attenuation-in": "",
                    "conn-att-in": item.connector_in,
                    "conn-att-out": item.connector_out,
                }
            }
            edgeList.push(edge);
        }
        else if (item.component_type == singlePatchJSON.component_type) {
            edge = {
                "link-id": elabel,
                "source": {
                    "source-node": fromLabel
                },
                "destination": {
                    "dest-node": toLabel
                },
                "tip-photonic-topology:patch": {
                }
            }
            edgeList.push(edge);
        }
        else if (item.component_type == serviceJSON.component_type) {
            edge = {
                "link-id": elabel,
                "source": {
                    "source-node": fromLabel
                },
                "destination": {
                    "dest-node": toLabel
                },
                "tip-photonic-topology:service": {
                    "band-width": item.band_width
                }
            }
            edgeList.push(edge);
        }

    });

    if (eqpt_config["ietf-network:networks"].network[0]["network-id"])
        network_id = eqpt_config["ietf-network:networks"].network[0]["network-id"];

    var topology = {
        'network-id': network_id,
        'network-types': {
            'tip-photonic-topology:photonic-topology': {}
        },
        node: nodeList,
        'ietf-network-topology:link': edgeList
    }

    var simData = eqpt_config['tip-photonic-simulation:simulation'];;
    var simGrid = simData["grid"];
    var simAD = simData["autodesign"];
    var simSM = simData["system-margin"];
    var simulationData = JSON.parse(sessionStorage.getItem("simulationParameters"));

    simGrid["frequency-min"] = simulationData["frequency-min"];
    simGrid["frequency-max"] = simulationData["frequency-max"];
    simGrid["spacing"] = simulationData["spacing"];
    simGrid["frequency-min"] = simulationData["frequency-min"];
    simSM = simulationData["system-margin"];
    var simPara = {
        grid: simGrid,
        autodesign: simAD,
        'system-margin': simSM
    }

    topologyArray.push(topology);
    var model = {
        'tip-photonic-equipment:amplifier': eqpt_config['tip-photonic-equipment:amplifier'],
        'tip-photonic-equipment:fiber': eqpt_config['tip-photonic-equipment:fiber'],
        'tip-photonic-equipment:transceiver': eqpt_config['tip-photonic-equipment:transceiver'],
        'tip-photonic-equipment:roadm': eqpt_config['tip-photonic-equipment:roadm'],
        'tip-photonic-simulation:simulation': simPara,
        'ietf-network:networks': {
            'network': topologyArray
        }
    }
    var exportValue = JSON.stringify(model, undefined, 2);
    var filename = 'network.json';
    if (!isSaveNetwork)
        filename = $("#txtFileName").val() + ".json";

    var blob = new Blob([exportValue], {
        type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);
}

/**  Hide the loader after completion of action. */
function hideLoader() {
    $('#loader').hide();
    $("#importEqpt").val('');
}

/**
 * This function is used to load the equipment configuration data from the import json file.
 * @param {boolean} isFileUpload - True -> Load data from import network json, False -> Load data from default equipment configuration json.
 */
function load_EqptConfig(isFileUpload) {
    try {
        if (!eqpt_config['tip-photonic-simulation:simulation'] || !eqpt_config['tip-photonic-equipment:transceiver'] || !eqpt_config['tip-photonic-equipment:fiber'] || !eqpt_config['tip-photonic-equipment:amplifier']) {
            showMessage(alertType.Error, "KeyError:'equipment elements', try again");
            hideLoader()
            return;
        }
        else {
            if (isFileUpload) {
                _import_json = eqptData['ietf-network:networks'];
                importNetwork();
            }
        }
        $("#txtFrgMin").val('');
        $("#txtFrqMax").val('');
        $("#txtGridSpac").val('');
        $("#txtNoOfChannel").val('');
        $("#txtAgeingMargin").val('');

        $('#ddlTransceiverType').empty();
        $('#ddlFiberAType').empty();
        $('#ddlFiberBType').empty();
        $('#ddlSingleFiberType').empty();

        $('#ddlPreAmpType').empty();
        $('#ddlBoosterType').empty();
        $('#ddlAmplifierType').empty();
        $('#ddlRoadmType').empty();
        if (eqpt_config['tip-photonic-simulation:simulation']) {
            var simulationsData = eqpt_config['tip-photonic-simulation:simulation'];
            var simulations = simulationsData["grid"];
            saveSimulations(simulations["frequency-min"], simulations["frequency-max"], simulations.spacing, "40", simulationsData["system-margin"]);
        }

        if (eqpt_config['tip-photonic-equipment:transceiver']) {
            $.each(eqpt_config['tip-photonic-equipment:transceiver'], function (index, item) {
                $('#ddlTransceiverType').append('<option value="' + item.type + '">' + item.type + '</option>');
            });
        }
        if (eqpt_config['tip-photonic-equipment:fiber']) {
            $.each(eqpt_config['tip-photonic-equipment:fiber'], function (index, item) {
                $('#ddlFiberAType').append('<option value="' + item.type + '">' + item.type + '</option>');
                $('#ddlFiberBType').append('<option value="' + item.type + '">' + item.type + '</option>');
                $('#ddlSingleFiberType').append('<option value="' + item.type + '">' + item.type + '</option>');

            });
        }
        if (eqpt_config["tip-photonic-equipment:roadm"]) {
            $.each(eqpt_config["tip-photonic-equipment:roadm"], function (index, item) {
                $("#ddlRoadmType").append('<option value="' + item.type + '">' + item.type + '</option>');
            });
        }

        appendSinglePreAmpandBoosterType();
    }
    catch (e) {
        console.log(e);
        showMessage(alertType.Error, "KeyError:'elements', try again");
        hideLoader();
    }
}
function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}
function handleFileLoad(event) {
    _import_json = event.target.result;
    importNetwork();
}

/**
 * This function is used to load all nodes element data into dataset from import json file.
 * @param {number} index - Index number for get node details from import json.
 */
function importNode(index) {
    var nodeDetails = "";
    var shape = "";
    var color = "";
    var image = "";
    var nodeSize = 0;
    var font = "";
    var transceiver_type = "";
    var amp_type = "";
    var amp_category = "";
    var pre_amp_type = "";
    var booster_type = "";
    var category = "";
    var roadm_type = "";
    //amplifier properties
    var gain_target = "0.0"
    var tilt_target = "0.0";
    var out_voa_target = "0.0"
    var x = getRandomNumberBetween(-230, 648);
    var y = getRandomNumberBetween(-230, 648);

    try {
        if (_import_json["network"][0].node[index]["metadata"]["Positions"]["X-co-ordinate"])
            x = _import_json["network"][0].node[index]["metadata"]["Positions"]["X-co-ordinate"];
        else
            x = getRandomNumberBetween(-230, 648);

        if (_import_json["network"][0].node[index]["metadata"]["Positions"]["Y-co-ordinate"])
            y = _import_json["network"][0].node[index]["metadata"]["Positions"]["Y-co-ordinate"];
        else
            y = getRandomNumberBetween(-230, 648);
    }
    catch
    {
    }

    var roadmData = _import_json["network"][0].node[index]['tip-photonic-topology:roadm'];
    var attenuatorData = _import_json["network"][0].node[index]['tip-photonic-topology:attenuator'];
    var transceiverData = _import_json["network"][0].node[index]['tip-photonic-topology:transceiver'];
    var amplifierData = _import_json["network"][0].node[index]['tip-photonic-topology:amplifier'];
    var ILAData = _import_json["network"][0].node[index]['tip-photonic-topology:ila'];
    var ramanData = _import_json["network"][0].node[index]['tip-photonic-topology:ramanamplifier'];

    if (roadmData) {

        nodeDetails = configData.node[roadmJSON.node_type];
        image = DIR + roadmJSON.image;
        shape = roadmJSON.shape;
        color = roadmJSON.color;
        nodeSize = roadmJSON.size;
        roadm_type = roadmData.model;
        font = roadmJSON.font;

    }
    else if (transceiverData) {
        nodeDetails = configData.node[transceiverJSON.node_type];
        shape = transceiverJSON.shape;
        color = transceiverJSON.color;
        image = DIR + transceiverJSON.image;
        transceiver_type = transceiverData.model;
        nodeSize = transceiverJSON.size;

    }
    else if (attenuatorData) {

        nodeDetails = configData.node[fusedJSON.node_type];
        shape = fusedJSON.shape;
        color = fusedJSON.color;
        image = DIR + fusedJSON.image;
        nodeSize = fusedJSON.size;
    }
    else if (amplifierData) {
        nodeDetails = configData.node[amplifierJSON.amp_category];
        shape = amplifierJSON.shape;
        color = amplifierJSON.color;
        image = DIR + amplifierJSON.image;
        amp_type = amplifierData.model;
        amp_category = nodeDetails.default.amp_category;
        nodeSize = amplifierJSON.size;
        gain_target = amplifierData['gain-target'];
        tilt_target = amplifierData['tilt-target'];
        out_voa_target = amplifierData['out-voa-target'];
    }
    else if (ILAData) {
        nodeDetails = configData.node[ILAJSON.amp_category];
        shape = ILAJSON.shape;
        color = ILAJSON.color;
        image = DIR + ILAJSON.image;
        pre_amp_type = ILAData.model;
        booster_type = ILAData.model;
        amp_category = nodeDetails.default.amp_category;
        nodeSize = ILAJSON.size;
    }
    else if (ramanData) {
        nodeDetails = configData.node[ramanampJSON.amp_category];
        shape = ramanampJSON.shape;
        color = ramanampJSON.color;
        image = DIR + ramanampJSON.image;
        amp_type = ramanData.model;
        category = ramanData.category;
        amp_category = nodeDetails.default.amp_category;
        nodeSize = ramanampJSON.size;
    }
    else
        return;

    var result = nodeName(nodeDetails.default.node_type, nodeDetails.default.amp_category);
    var number = result.nodelength;

    var label = _import_json["network"][0].node[index]["node-id"];
    var nodeID = label;

    try {
        if (_import_json["network"][0].node[index]["metadata"].location.city) {
            label = _import_json["network"][0].node[index]["metadata"].location.city;
        }
    }
    catch { }

    var node_type = nodeDetails.default.node_type;
    var node_degree = nodeDetails.default.node_degree;
    var component_type = roadmJSON.component_type;

    importNodes.push({
        id: nodeID,
        label: label,
        x: x, y: y, image: image, number: number,
        view: topologyView.Functional_View, hidden: false,
        shape: shape, color: color, size: nodeSize,
        font: font,
        node_type: node_type, node_degree: node_degree, component_type: component_type,
        roadm_type_pro: [],
        transceiver_type: transceiver_type,//transceiver
        amp_type: amp_type,//amplifier
        gain_target: gain_target,
        tilt_target: tilt_target,
        out_voa_target: out_voa_target,//end amplifier
        roadm_type: roadm_type, category: category,
        pre_amp_type: pre_amp_type, booster_type: booster_type, amp_category: amp_category//ILA

    });

}

/**
 * This function is used to load all fiber/patch/service element data into dataset from import json file.
 * @param {number} index - Index number for get edge details from import json.
 */
function importEdge(index) {
    var edgeData = _import_json["network"][0]['ietf-network-topology:link'][index];
    var to = edgeData["destination"]["dest-node"];
    var from = edgeData["source"]["source-node"];
    if (edgeData["tip-photonic-topology:fiber"]) {
        tSpanLengh = "";
        tType = "";
        tConnector_in = "";
        tConnector_out = "";
        isSingleFiberMode = 1;
        isDualFiberMode = 0;
        var labelvalue = edgeData["link-id"];
        var textvalue = labelvalue;
        tType = edgeData["tip-photonic-topology:fiber"].type;
        tSpanLength = edgeData["tip-photonic-topology:fiber"].length;
        tConnector_in = edgeData["tip-photonic-topology:fiber"]["conn-att-in"];
        tConnector_out = edgeData["tip-photonic-topology:fiber"]["conn-att-out"];
        addFiberComponent(1, from, to, labelvalue, textvalue, true);
    }
    if (edgeData["tip-photonic-topology:patch"]) {
        isSinglePatchMode = 1;
        isDualPatchMode = 0;
        var labelvalue = edgeData["link-id"];
        var textvalue = labelvalue;
        addPatchComponent(1, from, to, labelvalue, textvalue, true);
    }
    if (edgeData["tip-photonic-topology:service"]) {
        isSinglePatchMode = 0;
        isDualPatchMode = 0;
        isAddService = 1;
        var labelvalue = edgeData["link-id"];
        var textvalue = labelvalue;
        tBandwidth = edgeData["tip-photonic-topology:service"]["band-width"];
        addServiceComponent(1, from, to, labelvalue, textvalue, true);
    }
}

/**
 * Get random point to displays node if not available lat, long in import network json file.
 * @param {number} min - Minimum of random number.
 * @param {number} max - Maximum of random number.
 */
function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** This is used to load the network component data from import network json file. */
function importNetwork() {
    try {
        importNodes = [];
        importEdges = [];
        var networkData = _import_json["network"][0].node;
        $.each(networkData, function (index, item) {
            importNode(index);
        });

        fiberSmooth = fiberJSON.options.smooth;
        var fiber_config = configData[singleFiberJSON.fiber_category.replace(' ', '')].default;
        var edgeData = _import_json["network"][0]['ietf-network-topology:link'];

        $.each(edgeData, function (index, item) {
            if (item["tip-photonic-topology:fiber"]) {
                var labelvalue = item["link-id"];
                fiber_Type = item["tip-photonic-topology:fiber"].type;
                span_Length = item["tip-photonic-topology:fiber"].length;
                connector_IN = item["tip-photonic-topology:fiber"]["conn-att-in"];
                connector_OUT = item["tip-photonic-topology:fiber"]["conn-att-out"];
                var loss_Coefficient = fiber_config.Loss_coefficient;;
                span_Loss = parseFloat(span_Length * loss_Coefficient);
                var tempColor;
                if (fiber_Type == "" || parseFloat(span_Length) <= 0)
                    tempColor = singleFiberJSON.options.w_color;
                else
                    tempColor = singleFiberJSON.options.color;
                importEdges.push({
                    id: token(), from: item['source']['source-node'], to: item['destination']['dest-node'], label: labelvalue, text: labelvalue,
                    view: topologyView.Functional_View, hidden: false,
                    dashes: singleFiberJSON.dashes,
                    fiber_category: singleFiberJSON.fiber_category,
                    component_type: singleFiberJSON.component_type,
                    color: tempColor,
                    width: singleFiberJSON.width,
                    arrows: singleFiberJSON.options.arrows,
                    smooth: fiberSmooth,
                    fiber_type: fiber_Type, span_length: span_Length,
                    loss_coefficient: loss_Coefficient, connector_in: connector_IN, connector_out: connector_OUT,
                    span_loss: span_Loss,
                });

            }
            else if (item["tip-photonic-topology:patch"]) {
                var labelvalue = item["link-id"];
                importEdges.push({
                    id: token(), from: item['source']['source-node'], to: item['destination']['dest-node'], label: labelvalue, text: labelvalue,
                    dashes: singlePatchJSON.dashes, width: singlePatchJSON.width,
                    component_type: singlePatchJSON.component_type, patch_category: singlePatchJSON.patch_category,
                    color: singlePatchJSON.options.color, background: singlePatchJSON.options.background,
                    arrows: singlePatchJSON.options.arrows,
                    smooth: singlePatchJSON.options.smooth,
                    view: topologyView.Functional_View, hidden: false,
                });
            }
            else if (item["tip-photonic-topology:service"]) {
                var labelvalue = item["link-id"];
                bandwidth = item["tip-photonic-topology:service"]["band-width"];
                importEdges.push({
                    id: token(), from: item['source']['source-node'], to: item['destination']['dest-node'], label: labelvalue, text: labelvalue,
                    dashes: serviceJSON.dashes, width: serviceJSON.width,
                    component_type: serviceJSON.component_type, color: serviceJSON.options.color, background: serviceJSON.options.background,
                    arrows: serviceJSON.options.arrows,
                    smooth: fiberSmooth,
                    band_width: bandwidth
                });
            }
        });
    }
    catch
    {

    }
    draw(true);
}

/**
 * Loop through the node dataset and get some properties then store it into array list.
 * It is return node dataset.
 * @param {object} data - Dataset of node.
 */
function getNodeData(data) {
    data.forEach(function (elem, index, array) {
        importNodes.push({
            id: elem.id,
            label: elem.label,
            shape: elem.shape,
            icon: elem.icon,
            color: elem.color[0],
            edges: elem.edges[0],
            x: elem.x,
            y: elem.y,
            title: elem.title,
            size: elem.size,
            componentType: elem.componentType,
            nodedegree: elem.nodedegree,
            nodetype: elem.nodetype

        });
    });

    return new vis.DataSet(importNodes);
}

/**
 * Get node details by ID.
 * @param {object} data - Node details.
 * @param {string} id - The ID of destination node component.
 */
function getNodeById(data, id) {
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {
            // double equals since id can be numeric or string
            return data[n];
        }
    }

    throw "cannot find id '" + id + "' in data";
}

/**
 * Loop through the edge dataset and assign some properties then store it into array list.
 * It is return edge dataset.
 * @param {object} data - Dataset of edge. edge like fiber/patch/service.
 */
function getEdgeData(data) {

    data.forEach(function (elem) {
        // add the connection
        var fontstyle = {
            align: '' + elem.options[0].font[0].align + '',
        }
        var arrows = {
            to: {
                enabled: elem.options[0].arrows[0].to[0].enabled,
                type: elem.options[0].arrows[0].to[0].type,
            },
            from: {
                enabled: elem.options[0].arrows[0].from[0].enabled,
                type: elem.options[0].arrows[0].from[0].type,
            },
        }

        var smooth = {
            enabled: elem.options[0].smooth[0].enabled,
            type: elem.options[0].smooth[0].type,
            roundness: elem.options[0].smooth[0].roundness,
        }
        importEdges.push({
            id: elem.id,
            from: elem.from,
            to: elem.to,
            dashes: elem.dashes,
            label: elem.label,
            font: fontstyle,
            arrows: arrows,
            smooth: smooth,
            color: elem.options[0].color[0].color,
            componentType: elem.componentType,
        });

    });

    return new vis.DataSet(importEdges);
}

/** Save the network topology. */
function SaveNetwork() {
    exportNetwork(true);
}

/** Clear component selection. */
function UnSelectAll() {
    network.unselectAll();
    remove_NodeFiberHighlight();
}

/** Capture network topology as image file. */
function captureImage() {
    network.fit();
    html2canvas(document.querySelector("#mynetwork"), {
        onrendered: function (canvas) {
            var img = canvas.toDataURL();
            $("#result-image").attr('src', img).show();

            canvas.toBlob(function (blob) {
                saveAs(blob, "NetworkPage.png");
            });
        }
    });
    return false;
}

/** Disable fiber/patch/service mode.
  * Reteset the data values.
 */
function disableFiberService() {

    nodeMode = "";
    isDualFiberMode = 0;
    isSingleFiberMode = 0;
    isAddService = 0;
    isDualPatchMode = 0;
    isSinglePatchMode = 0;
    addEdgeData = {
        from: '',
        to: ''
    };
    addServiceData = {
        from: '',
        to: ''
    };
    addPatchData = {
        from: '',
        to: ''
    };
}

/**
 * Check source and destination node have same connections.
 * @param {string} fromNode - Source node ID.
 * @param {string} toNode - Destination node ID.
 */
function checkfiberconnection(fromNode, toNode) {
    var edgesarr = network.body.data.edges.get();
    var flag = false;
    for (var i = 0; i < edgesarr.length; i++) {
        if ((edgesarr[i].from == fromNode && edgesarr[i].to == toNode) || (edgesarr[i].from == toNode && edgesarr[i].to == fromNode)) {
            flag = true;
            return true;
        }
    }
    return flag;
}

/**
 * This function is used to add multiple single fiber / patch and service between same set of nodes and re - arrange them one by one.
 * @param {string} cfrom - Source node ID.
 * @param {string} cto - Destination node ID.
 */
function multipleFiberService1(cfrom, cto) {

    var connectedFiber = network.getConnectedEdges(cfrom);
    var fromFiberCount = 0;
    var toFiberCount = 0;
    var fiberCount = 0;
    var fiberSmooth;
    $.each(connectedFiber, function (index, item) {
        var fiberDetails = network.body.data.edges.get(item);
        if (fiberDetails.fiber_category == dualFiberJSON.fiber_category || fiberDetails.fiber_category == singleFiberJSON.fiber_category || fiberDetails.component_type == serviceJSON.component_type || fiberDetails.component_type == dualPatchJSON.component_type) {
            fiberSmooth = singleFiberJSON.options.smooth;
            if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                fiberCount++;
                if (fiberCount == 1) {
                    fiberSmooth.roundness = "0." + fiberCount;
                }
                else {
                    fromFiberCount++;
                    fiberSmooth.roundness = "0." + fiberCount;
                }
            }
            if (connectedFiber.length == 1) {
                if (fiberDetails.from == cto && fiberDetails.to == cfrom) {
                    fiberCount = 1;
                    fiberSmooth.roundness = "0." + connectedFiber.length;
                }
            }
        }
    });

    if (fiberCount > 0)
        return fiberSmooth;
    else
        return fiberJSON.options.smooth;
}

/**
 * This function is used to add multiple single fiber / patch and service between same set of nodes and re - arrange them one by one.
 * @param {string} cfrom - Source node ID.
 * @param {string} cto - Destination node ID.
 */
function multipleFiberService(cfrom, cto) {
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

/**
 * Count fiber/patch and service connections between same set of node.
 * @param {number} isdualfiber - True -> Dual fiber connection count.
 * @param {number} issinglefiber - True -> Single fiber connection count.
 * @param {number} isservice - True - > Service connection count.
 * @param {number} ispatch - True -> Single patch connection count.
 * @param {string} cfrom - Source node ID.
 * @param {string} cto - Destination node ID.
 */
function countFiberService(isdualfiber, issinglefiber, isservice, ispatch, cfrom, cto) {
    var conCount = 1;
    var connectedFiber = network.getConnectedEdges(cfrom);
    connectedFiber.push(network.getConnectedEdges(cto));
    $.each(connectedFiber, function (index, item) {
        var fiberDetails = network.body.data.edges.get(item);
        if (isdualfiber) {
            if (fiberDetails.fiber_category == dualFiberJSON.fiber_category) {
                if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                    conCount++;
                }
            }
        }
        if (issinglefiber) {
            if (fiberDetails.fiber_category == singleFiberJSON.fiber_category) {
                if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                    conCount++;
                }
            }
        }
        if (isservice) {
            if (fiberDetails.component_type == serviceJSON.component_type) {
                if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                    conCount++;
                }
            }
        }
        if (ispatch) {
            if (fiberDetails.component_type == dualPatchJSON.component_type) {
                if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                    conCount++;
                }
            }
        }
    });
    return conCount;
}

/**
 * Check node component have connection.
 * @param {string} from -Source node ID.
 * @param {string} to - Destination node ID .
 */
function checkNodeConnection(from, to) {
    var flag = false;
    var fiberList = network.getConnectedEdges(from);
    $.each(fiberList, function (index, item) {
        var fiber = network.body.data.edges.get(item);
        if ((fiber.from == from && fiber.to == to) || (fiber.from == to && fiber.to == from)) {
            flag = true;
            return;
        }
    });
    return flag;
}

/**
 * Check node component have a service connection.
 * @param {string} from - Source node ID.
 * @param {string} to - Destination node ID.
 */
function checkNodeServiceConnection(from, to) {
    var flag = false;
    var fiberList = network.getConnectedEdges(from);
    $.each(fiberList, function (index, item) {

        var fiber = network.body.data.edges.get(item);
        if (fiber.component_type == serviceJSON.component_type) {
            if ((fiber.from == from && fiber.to == to) || (fiber.from == to && fiber.to == from)) {
                flag = true;
                return;
            }
        }
    });
    return flag;
}

/**
 * Restriction to remove transceiver node connection(fiber/patch) while transceiver having service.
 * @param {number} from - Source node ID.
 * @param {number} to - Destination node ID.
 * @param {string} edgeType - The type of fiber/patch/service.
 */
function checkFiberPatchServiceCon(from, to, edgeType) {
    var isOk = false;
    var nodeDetails = network.body.data.nodes.get(from);
    var toNodeDetails = network.body.data.nodes.get(to);

    var fromCount = 0;
    var toCount = 0;

    if (nodeDetails.node_type == transceiverJSON.node_type) {
        var fromConnection = network.getConnectedEdges(from);
        var isServiceCon = false;
        $.each(fromConnection, function (index, item) {
            var fiberDetails = network.body.data.edges.get(item);
            if (fiberDetails.component_type == dualFiberJSON.component_type || fiberDetails.component_type == dualPatchJSON.component_type) {
                fromCount++;
            }
            else if (fiberDetails.component_type == serviceJSON.component_type)
                isServiceCon = true;
        });

        if (isServiceCon) {
            if (fromCount == 1) {
                showMessage(alertType.Error, 'Cannot remove ' + edgeType + ', ' + transceiverJSON.node_type + ' ' + transceiverJSON.component_type + ' - ' + nodeDetails.label + ' should have one ' + dualFiberJSON.component_type + '/' + dualPatchJSON.component_type + ' connection');
                return true;
            }
        }
    }

    if (toNodeDetails.node_type == transceiverJSON.node_type) {
        var toConnection = network.getConnectedEdges(to);
        var isServiceCon = false;
        $.each(toConnection, function (index, item) {
            var fiberDetails = network.body.data.edges.get(item);
            if (fiberDetails.component_type == dualFiberJSON.component_type || fiberDetails.component_type == dualPatchJSON.component_type) {
                toCount++;
            }
            else if (fiberDetails.component_type == serviceJSON.component_type)
                isServiceCon = true;
        });

        if (isServiceCon) {
            if (toCount == 1) {
                showMessage(alertType.Error, 'Cannot remove ' + edgeType + ', ' + transceiverJSON.node_type + ' ' + transceiverJSON.component_type + ' - ' + toNodeDetails.label + ' should have one ' + dualFiberJSON.component_type + '/' + dualPatchJSON.component_type + ' connection')
                return true;
            }
        }
    }

    return isOk;
}

/**
 * Close context menu by menu ID.
 * @param {string} menuID - The ID of menu.
 */
function closeMenu(menuID) {
    document.getElementById(menuID).style.display = "none";
    UnSelectAll();

}

/** Append node,preamp and booster type to dropdown input control. */
function appendSinglePreAmpandBoosterType() {

    if (eqpt_config['tip-photonic-equipment:amplifier']) {
        $.each(eqpt_config['tip-photonic-equipment:amplifier'], function (index, item) {
            $('#ddlPreAmpType').append('<option value="' + item.type + '">' + item.type + '</option>');
            $('#ddlBoosterType').append('<option value="' + item.type + '">' + item.type + '</option>');
            $('#ddlAmplifierType').append('<option value="' + item.type + '">' + item.type + '</option>');
        });
    }
}

/**
 * Append node, preamp, booster type for dynamically generate element.
 * @param {string} ddlID - The ID of dynamic input control. like dropdown.
 */
function appendPreAmpandBoosterType(ddlID) {
    var preAmpType = [];
    var boosterType = [];
    var ddlroadmtype = "#" + eleroadmtype + ddlID;
    var ddlpreamptype = "#" + elepreamptype + ddlID;
    var ddlboostertype = "#" + eleboostertype + ddlID;

    if (eqpt_config["tip-photonic-equipment:amplifier"]) {
        $.each(eqpt_config['tip-photonic-equipment:amplifier'], function (index, item) {
            $(ddlpreamptype).append('<option value="' + item.type + '">' + item.type + '</option>');
            $(ddlboostertype).append('<option value="' + item.type + '">' + item.type + '</option>');
        });
    }

    if (eqpt_config["tip-photonic-equipment:roadm"]) {
        $.each(eqpt_config["tip-photonic-equipment:roadm"], function (index, item) {
            $(ddlroadmtype).append('<option value="' + item.type + '">' + item.type + '</option>');

        });
    }
}

/**
 * show context menu near by selected component.
 * @param {string} x - The point of selected component.
 * @param {string} y - The point of selected component.
 * @param {string} menu - Html element ID.
 */
function showContextMenu(x, y, menu) {
    showHideDrawerandMenu();
    var windowHeight = $(window).height() / 2;
    var windowWidth = $(window).width() / 2;
    var element = "#" + menu;
    if (y > windowHeight && x <= windowWidth) {
        $(element).css("left", x);
        $(element).css("bottom", $(window).height() - y);
        $(element).css("right", "auto");
        $(element).css("top", "auto");
    } else if (y > windowHeight && x > windowWidth) {
        //When user click on bottom-right part of window
        $(element).css("right", $(window).width() - x);
        $(element).css("bottom", $(window).height() - y);
        $(element).css("left", "auto");
        $(element).css("top", "auto");
    } else if (y <= windowHeight && x <= windowWidth) {
        //When user click on top-left part of window
        $(element).css("left", x);
        $(element).css("top", y);
        $(element).css("right", "auto");
        $(element).css("bottom", "auto");
    } else {
        //When user click on top-right part of window
        $(element).css("right", $(window).width() - x);
        $(element).css("top", y);
        $(element).css("left", "auto");
        $(element).css("bottom", "auto");
    }
    document.getElementById(menu).style.display = "block";
}

/**
 * Show the element for displays fiber, service and node components details when hover the mouse over on it.
 * @param {string} x - left side menu.
 * @param {string} y - bottom of the menu.
 * @param {string} menu - Element ID.
 */
function showHoverDiv(x, y, menu) {

    var windowHeight = $(window).height() / 2;
    var windowWidth = $(window).width() / 2;
    var element = "#" + menu;
    if (y > windowHeight && x <= windowWidth) {
        //Bottom-left part of window
        $(element).css("left", x);
        $(element).css("bottom", $(window).height() - y);
        $(element).css("right", "auto");
        $(element).css("top", "auto");
    } else if (y > windowHeight && x > windowWidth) {
        //Bottom-right part of window
        $(element).css("right", $(window).width() - x);
        $(element).css("bottom", $(window).height() - y);
        $(element).css("left", "auto");
        $(element).css("top", "auto");
    } else if (y <= windowHeight && x <= windowWidth) {
        //Top-left part of window
        $(element).css("left", x);
        $(element).css("top", y);
        $(element).css("right", "auto");
        $(element).css("bottom", "auto");
    } else {
        //Top-right part of window
        $(element).css("right", $(window).width() - x);
        $(element).css("top", y);
        $(element).css("left", "auto");
        $(element).css("bottom", "auto");
    }
    document.getElementById(menu).style.display = "block";
}

/** To check network topology have components. */
function networkValidation() {
    var flag = false;
    if (network.body.data.nodes.get().length > 0 || network.body.data.edges.get().length > 0)
        flag = true;
    else {
        showMessage(alertType.Info, 'Please create network topology');
    }

    return flag;
}

/**
 * To load ROADM component type to dropdown control.
 * @param {string} fiberID - The ID of fiber component.
 * @param {string} nodeID - The ID of node component.
 * @param {string} node_type - Type of ROADM component.
 * @param {string} appendElement - Html element for loading component type.
 */
function loadRoadmType(fiberID, nodeID, node_type, appendElement) {
    var appendDiv = "#" + appendElement
    var fiberDetails = network.body.data.edges.get(fiberID);
    var roadmType = "";
    if (fiberDetails.from == nodeID || fiberDetails.to == nodeID) {
        $(appendDiv).show();
        var connectedNodes = network.getConnectedNodes(fiberID);
        if (fiberDetails.from == nodeID)
            roadmType = node_type.toUpperCase() + "- [" + network.body.data.nodes.get(connectedNodes[0]).label + ' - ' + network.body.data.nodes.get(connectedNodes[1]).label + ' ]';
        if (fiberDetails.to == nodeID)
            roadmType = node_type.toUpperCase() + "- [" + network.body.data.nodes.get(connectedNodes[1]).label + ' - ' + network.body.data.nodes.get(connectedNodes[0]).label + ' ]';

        var roadmAccordian = "";
        roadmAccordian = "<div class='accordion-fiber'>";
        roadmAccordian += "<p class='title m-0 f-s-17' id=" + fiberID + ">" + roadmType + "</p>";
        roadmAccordian += "<span class='show-fiber'>+</span>"
        roadmAccordian += "</div>";
        roadmAccordian += "<div class='info-fiber'><div class='panel'>";

        if (node_type == roadmJSON.node_type) {
            roadmAccordian += generateAccordianEle("ROADM Type", eleroadmtype + fiberID);
        }
        roadmAccordian += generateAccordianEle("Amplifier A", elepreamptype + fiberID);
        roadmAccordian += generateAccordianEle("Amplifier B", eleboostertype + fiberID);
        roadmAccordian += "</div></div>";
        $(appendDiv).append(roadmAccordian);
        accordianFun();
        appendPreAmpandBoosterType(fiberID);
        getRoadmDetails(fiberID, node_type);
    }
}

/**
 * Generate accordian and dropdown element for loading type.
 * @param {string} label - The label of component.
 * @param {string} ddlEleID - Dropdown element for loading component type.
 */
function generateAccordianEle(label, ddlEleID) {
    var eleHtml = "";
    eleHtml += "<div class='form-group'>";
    eleHtml += "<label class='f-s-17'>" + label + "</label>";
    eleHtml += "<select id='" + ddlEleID + "' class='form-control'></select>";
    eleHtml += "</div>";
    return eleHtml;
}

/**
 * Get ROADM component details by fiber ID.
 * @param {string} fiberID - Fiber component ID.
 * @param {string} node_type - The type of component.
 */
function getRoadmDetails(fiberID, node_type) {
    if (_roadmListDB({ roadm_fiber_id: fiberID }).count() > 0) {
        var roadmDetails = _roadmListDB({ roadm_fiber_id: fiberID }).first();
        var lroadmtype = "#" + eleroadmtype + fiberID;
        var lpreamptype = "#" + elepreamptype + fiberID;
        var lboostertype = "#" + eleboostertype + fiberID;
        if (node_type == roadmJSON.node_type) {
            $(lroadmtype).val(roadmDetails.roadm_type);
        }
        $(lpreamptype).val(roadmDetails.pre_amp_type);
        $(lboostertype).val(roadmDetails.booster_type);
    }
    else {
        if (node_type == roadmJSON.node_type)
            clearRoadm();
        if (node_type == ILAJSON.amp_category)
            clearILA();
    }
}

/**
 * Get next level of fiber/patch/service label.
 * @param {string} from - Source node ID.
 * @param {string} to -  Destination node ID.
 * @param {string} component_type - The type of component.
 */
function getLabel(from, to, component_type) {
    var flabel;
    var tlabel;

    if (network.body.data.nodes.get(from).number)
        flabel = network.body.data.nodes.get(from).number;
    else
        flabel = network.body.data.nodes.get(from).label;

    if (network.body.data.nodes.get(to).number)
        tlabel = network.body.data.nodes.get(to).number;
    else
        tlabel = network.body.data.nodes.get(to).label;

    return component_type + " " + flabel + ' - ' + tlabel;
}

/**
 * This function is used to store simulation parameters in session storage as JSON format.
 * @param {number} fre_min - Frequency-max value.
 * @param {number} frq_max - Frequency-min value.
 * @param {number} spacing - Spacings.
 * @param {number} channel - Number of channels.
 * @param {number} margin - System margin.
 */
function saveSimulations(fre_min, frq_max, spacing, channel, margin) {
    var simulationPara = {
        "frequency-min": fre_min,
        "frequency-max": frq_max,
        "spacing": spacing,
        "noOfChannel": channel,
        "system-margin": margin
    }
    sessionStorage.setItem("simulationParameters", JSON.stringify(simulationPara));
}

/**
 * This function is used to show alert message.
 * @param {string} messageType - Type of message.ex : Success/Info/Error/Warning.
 * @param {string} textmsg - Message content.
 * @param {boolean} removeTimeout - Set timeout for alert message.
 */
function showMessage(messageType, textmsg, removeTimeout) {
    $("#img_src").show();
    switch (messageType) {
        case alertType.Success:

            $('#msg_content').html(textmsg);
            $('#caption').text(Object.keys(alertType).find(key => alertType[key] === alertType.Success));
            var successrc1 = "./Assets/img/success-toaster.svg";
            $("#img_src").attr("src", successrc1);
            $('#toast').removeClass("info-toast");
            $('#toast').removeClass("danger-toast-error-listing");
            $('#toast').removeClass("danger-toast");
            $('#toast').removeClass("warning-toast");
            $('#toast').addClass("success-toast");
            clearAndSetTimeout(".success-toast");
            break;
        case alertType.Info:
            $('#msg_content').html(textmsg);
            $('#caption').text(Object.keys(alertType).find(key => alertType[key] === alertType.Info));
            var infosrc = "./Assets/img/info-toaster.svg";
            $("#img_src").attr("src", infosrc);
            $('#toast').removeClass("success-toast");
            $('#toast').removeClass("danger-toast-error-listing");
            $('#toast').removeClass("danger-toast");
            $('#toast').removeClass("warning-toast");
            $('#toast').addClass("info-toast");
            clearAndSetTimeout(".info-toast");
            break;
        case alertType.Error:
            $('#msg_content').html(textmsg);
            var dangersrc;
            $('#toast').removeClass("success-toast");
            $('#toast').removeClass("info-toast");
            $('#toast').removeClass("warning-toast");
            $('#toast').removeClass("danger-toast-error-listing");
            $('#toast').removeClass("danger-toast");
            dangersrc = "./Assets/img/error-toaster.svg";
            $("#img_src").attr("src", dangersrc);
            if (!removeTimeout) {
                $('#caption').text(Object.keys(alertType).find(key => alertType[key] === alertType.Error));

                $('#toast').addClass("danger-toast");
                clearAndSetTimeout(".danger-toast", removeTimeout);
            }
            else {
                $("#img_src").hide();
                $('#caption').text('Messages');
                //dangersrc = "./Assets/img/error-listing-icon.svg";
                $('#toast').addClass("danger-toast-error-listing");
                clearAndSetTimeout(".danger-toast-error-listing", removeTimeout);
            }


            break;
        case alertType.Warning:
            $('#msg_content').html(textmsg);
            $('#caption').text(Object.keys(alertType).find(key => alertType[key] === alertType.Warning));
            var warningsrc = "./Assets/img/warning-toaster.svg";
            $("#img_src").attr("src", warningsrc);
            $('#toast').removeClass("success-toast");
            $('#toast').removeClass("info-toast");
            $('#toast').removeClass("danger-toast-error-listing");
            $('#toast').removeClass("danger-toast");
            $('#toast').addClass("warning-toast");
            clearAndSetTimeout(".warning-toast");
            break;
    }


}

/**
 * This function is used to set/remove time interval for alert message.
 * @param {number} targetEle - Target of toaster element like. Success/Warning/Error...
 * @param {number} removeTimeout - Remove the interval time for alert message .
 */
function clearAndSetTimeout(targetEle, removeTimeout) {
    const highestId = window.setTimeout(() => {
        for (let i = highestId; i >= 0; i--) {
            window.clearInterval(i);
        }
    }, 0);
    $(targetEle).toast('show');
    if (!removeTimeout) {
        setTimeout(function () {
            $(targetEle).toast('hide');
        }, 6000);
    }
}

/** To enable fiber/patch/service mode. */
function enableEdgeIndicator() {
    if (isDualFiberMode == 1 || isSingleFiberMode == 1 || isSinglePatchMode == 1 || isDualPatchMode == 1 || isAddService == 1)
        network.addEdgeMode();
}

/**
 * This function is used to check the node link, mis-link, fiber properties and consolidate all error list.
 * @param {number} isTime - True -> remove time interval for error summary list.
 */
function topologyValidation(isTime) {
    //removeHighlight();
    var flag = false;
    var message = [];
    var response = checkLink();
    if (response.flag) {
        flag = true
        message.push("<span id=spanEven>" + response.message + "</span>");
    }

    response = checkMisLink();
    if (response.flag) {
        flag = true;
        message.push("<span id=spanMisLink>" + response.message + "</span>");
    }

    response = checkFiberPro();
    if (response.flag) {
        flag = true;
        message.push("<span id=spanTransForce>" + response.message + "</span>");
    }

    //response = checkTypeForce();
    //if (response.flag) {
    //    flag = true;
    //    message.push("<span id=spanTransForce>" + response.message + "</span>");
    //}

    if (flag) {
        showMessage(alertType.Error, message.join(' '), isTime);
        //return;
    }
    return flag;
}

/**
 * Focus the error componets.
 * Focus the node/fiber/patch/service components by span error ID.
 * Update the components for highlight error component to set image, size, is_error, color properties by span error ID.
 * @param {string} ID - Node/Fiber ID.
 * @param {number} type - Component type.
 */
function focusNodeFiber(ID, type) {
    removeHighlight();
    UnSelectAll();
    if (type == 1) {
        var image;
        var scaleOption = { scale: 1.0 };
        network.moveTo(scaleOption);
        network.focus(ID);
        image = "";
        var nodeDetails = network.body.data.nodes.get(ID);
        if (nodeDetails.node_type == roadmJSON.node_type)
            image = roadmJSON.err_image;
        else if (nodeDetails.node_type == fusedJSON.node_type)
            image = fusedJSON.err_image;
        else if (nodeDetails.node_type == transceiverJSON.node_type)
            image = transceiverJSON.err_image;
        else if (nodeDetails.amp_category == amplifierJSON.amp_category)
            image = amplifierJSON.err_image;
        else if (nodeDetails.amp_category == ramanampJSON.amp_category)
            image = ramanampJSON.err_image;

        network.body.data.nodes.update([{ id: ID, pre_image: nodeDetails.image, image: DIR + image, size: roadmJSON.err_size, is_error: true }]);
    }
    else if (type == 2) {
        var edgeDetails = network.body.data.edges.get(ID);
        var scaleOption = { scale: 1.0 };
        network.moveTo(scaleOption);
        network.focus(edgeDetails.from);
        network.body.data.edges.update([{ id: ID, pre_color: edgeDetails.color, color: singleFiberJSON.options.err_color, is_error: true }]);
    }
}

/** 
 * To remove focused error component highlight. 
 * Update node component to set image, size, is_error by focused component ID.
 * Update fiber/patch/service components to set color, is_error by focused component ID.
 */
function removeHighlight() {

    var errNodes = network.body.data.nodes.get({
        filter: function (item) {
            return (item.is_error == true);
        }
    });

    for (var i = 0; i < errNodes.length; i++) {
        var nodeDetails = errNodes[i];
        network.body.data.nodes.update({
            id: nodeDetails.id, image: nodeDetails.pre_image, size: roadmJSON.size, is_error: false
        });
    }

    var errEdge = network.body.data.edges.get({
        filter: function (item) {
            return (item.is_error == true);
        }
    });
    for (var i = 0; i < errEdge.length; i++) {
        var edgeDetails = errEdge[i];
        network.body.data.edges.update({
            id: edgeDetails.id, color: edgeDetails.pre_color, is_error: false
        });
    }
}

/**
 * To remove span error element on error summary list.
 * @param {string} item - Node ID.
 * @param {boolean} transUpdate - True -> remove span error element for transceiver, False -> remove rest of span error.
 */
function removeSpanInError(item, transUpdate) {

    var image;
    var nodeDetails = network.body.data.nodes.get(item);
    if (nodeDetails.node_type == roadmJSON.node_type)
        image = roadmJSON.image;
    else if (nodeDetails.node_type == fusedJSON.node_type)
        image = fusedJSON.image;
    else if (nodeDetails.node_type == transceiverJSON.node_type)
        image = transceiverJSON.image;
    else if (nodeDetails.amp_category == amplifierJSON.amp_category)
        image = amplifierJSON.image;
    else if (nodeDetails.amp_category == ramanampJSON.amp_category)
        image = ramanampJSON.image;

    network.body.data.nodes.update({
        id: nodeDetails.id, image: DIR + image, size: roadmJSON.size, is_error: false
    });

    var removeID;
    if (transUpdate)
        removeID = "#spanTF" + item.replace(/\s/g, '');
    else
        removeID = "#span" + item.replace(/\s/g, '');

    $(removeID).remove();
    checkErrorFree();
}

/** To clear summary error element if there is no any error. */
function checkErrorFree() {
    var roadmRule = $("#spanEven").find('p').length;
    var linkRule = $("#spanMisLink").find('p').length;
    var transForce = $("#spanTransForce").find('p').length;

    if (roadmRule == 0)
        $("#spanEven").empty();

    if (linkRule == 0)
        $("#spanMisLink").empty();

    if (transForce == 0)
        $("#spanTransForce").empty();

    if (roadmRule == 0 && linkRule == 0 && transForce == 0) {
        $("#toast").toast('hide');
        network.moveTo({
            position: prePosition,
            scale: preScale,
        });
    }
}

/** 
 *  Realtime update of summary error list. 
 *  To do any action with component while error chec active on active, summary error list automatically update by component action.
 */
function realUpdate() {
    if ($("#div_toaster").is(":visible") && !$("#img_src").is(":visible")) {
        $("#btnValidation").click();
    }
}

/**
 * To reset component selection/highlight.
 * Get all highlighted components by is_highlight.
 * Update the node components to set is_highlight, image properties by selected component ID.
 * Update the fiber/patch/service components to set is_highlight, shadow properties by selected component ID.
 * */
function remove_NodeFiberHighlight() {
    var hNodes = network.body.data.nodes.get({
        filter: function (item) {
            return (item.is_highlight == true);
        }
    });

    for (var i = 0; i < hNodes.length; i++) {
        var nodeDetails = hNodes[i];
        if (nodeDetails.node_type == roadmJSON.node_type) {
            if (nodeDetails.image != DIR + roadmJSON.image) {
                if (nodeDetails.h_image == DIR + roadmJSON.h_image) {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, image: nodeDetails.image, h_image: nodeDetails.h_image, is_highlight: false
                    });
                }
                else {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, image: nodeDetails.h_image, is_highlight: false
                    });
                }
            }
            else {
                network.body.data.nodes.update({
                    id: nodeDetails.id, is_highlight: false
                });
            }
        }
        else if (nodeDetails.node_type == fusedJSON.node_type) {
            if (nodeDetails.image != DIR + fusedJSON.image) {
                if (nodeDetails.h_image == DIR + fusedJSON.h_image) {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, image: nodeDetails.image, h_image: nodeDetails.h_image, is_highlight: false
                    });
                }
                else {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, image: nodeDetails.h_image, is_highlight: false
                    });
                }
            }
            else {
                network.body.data.nodes.update({
                    id: nodeDetails.id, is_highlight: false
                });
            }
        }
        else if (nodeDetails.node_type == transceiverJSON.node_type) {
            if (nodeDetails.image != DIR + transceiverJSON.image) {
                if (nodeDetails.h_image == DIR + transceiverJSON.h_image) {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, image: nodeDetails.image, h_image: nodeDetails.h_image, is_highlight: false
                    });
                }
                else {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, image: nodeDetails.h_image, is_highlight: false
                    });
                }
            }
            else {
                network.body.data.nodes.update({
                    id: nodeDetails.id, is_highlight: false
                });
            }
        }
        else if (nodeDetails.node_type == amplifierJSON.node_type) {
            if (nodeDetails.amp_category == amplifierJSON.amp_category) {
                if (nodeDetails.image != DIR + amplifierJSON.image) {
                    if (nodeDetails.h_image == DIR + amplifierJSON.h_image) {
                        network.body.data.nodes.update({
                            id: nodeDetails.id, image: nodeDetails.image, h_image: nodeDetails.h_image, is_highlight: false
                        });
                    }
                    else {
                        network.body.data.nodes.update({
                            id: nodeDetails.id, image: nodeDetails.h_image, is_highlight: false
                        });
                    }
                }
                else {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, is_highlight: false
                    });
                }
            }
            else if (nodeDetails.amp_category == ramanampJSON.amp_category) {
                if (nodeDetails.image != DIR + ramanampJSON.image) {
                    if (nodeDetails.h_image == DIR + ramanampJSON.h_image) {
                        network.body.data.nodes.update({
                            id: nodeDetails.id, image: nodeDetails.image, h_image: nodeDetails.h_image, is_highlight: false
                        });
                    }
                    else {
                        network.body.data.nodes.update({
                            id: nodeDetails.id, image: nodeDetails.h_image, is_highlight: false
                        });
                    }
                }
                else {
                    network.body.data.nodes.update({
                        id: nodeDetails.id, is_highlight: false
                    });
                }
            }
        }

    }

    var hEdges = network.body.data.edges.get({
        filter: function (item) {
            return (item.is_highlight == true);
        }
    });
    for (var i = 0; i < hEdges.length; i++) {
        network.body.data.edges.update({
            id: hEdges[i].id, shadow: [], is_highlight: false
        });
    }
}