//const { de } = require("../visunminify");;
//const { type } = require("jquery");
var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
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
var displayEdgeLabels = false;

var hiddenNodeTextOptions = {
    nodes: {
        font: {
            // Set the colors to transparent
            color: 'transparent',
            strokeColor: 'transparent'
        }
    }
};
var hiddenNodeTextDisplayOptions;
var displayNodeLabels = false;

$(document).ready(function () {

    $.getJSON("/Data/StyleData.json", function (data) {
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
        console.log("An error has occurred1.");
    });

    $.getJSON("/Data/ConfigurationData.json", function (data) {

        configData = data;
        DIR = configData.node.dir;
        //$("*.siteLength").text(' (Max Length ' + configData.node.site_length + ')');
        $("[id='siteLength']").each(function () {
            $(this).text(' (Max Length ' + configData.node.site_length + ')');
        })
    }).fail(function () {
        console.log("An error has occurred2.");
    });

    $.getJSON("/Data/Equipment_JSON_MOD2.json", function (data) {
        eqpt_config = data;
        load_EqptConfig();
    }).fail(function () {
        console.log("An error has occurred3.");
    });


    $("#btncaptureimagenetwork").click(function () {
        if (networkValidation())
            networkPage();
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
        remove_NodeHighlight();

        $(btnAddRoadm).removeClass('highlight');
        $(btnAddFused).removeClass('highlight');
        $(btnAddILA).removeClass('highlight');
        $(btnAddAmplifier).removeClass('highlight');
        $(btnAddTransceiver).removeClass('highlight')
        nodeMode = 0;
        enableEdgeIndicator();

    });

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

        remove_NodeHighlight();

        $(btnAddRoadm).removeClass('highlight');
        $(btnAddFused).removeClass('highlight');
        $(btnAddILA).removeClass('highlight');
        $(btnAddAmplifier).removeClass('highlight');
        $(btnAddTransceiver).removeClass('highlight')
        nodeMode = 0;
        enableEdgeIndicator();

    });
    //end undo and redo
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

function fiberLengthCal(eleSL, eleLC, eleSpanLoss) {
    var spanLength = "#" + eleSL;
    var lossCoefficient = "#" + eleLC;
    var spanLoss = "#" + eleSpanLoss;
    var span_length = parseFloat($(spanLength).val());
    var loss_coefficient = parseFloat($(lossCoefficient).val());
    $(spanLoss).val(span_length * loss_coefficient);
}

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

//disabled browser right click menu
$(document).bind("contextmenu", function (e) {
    return false;
});

var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function () {
    return rand() + rand(); // to make it longer
};

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}
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
            remove_NodeHighlight();
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
                        showMessage(alertType.Error, 'Please select same type of fiber');
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
                var color;
                if (edgeDetails.component_type == singleFiberJSON.component_type) {
                    if (edgeDetails.color == singleFiberJSON.options.h_color || edgeDetails.color == singleFiberJSON.options.fh_color) {
                        color = edgeDetails.h_color;
                    }
                    else {
                        if (edgeDetails.color == singleFiberJSON.options.w_color)
                            color = singleFiberJSON.options.h_color;
                        else if (edgeDetails.color == singleFiberJSON.options.color)
                            color = singleFiberJSON.options.fh_color;
                    }
                }
                if (color) {
                    var highlight = true;
                    if (color == singleFiberJSON.options.color || color == singleFiberJSON.options.w_color)
                        highlight = false;

                    network.body.data.edges.update({
                        id: edgeDetails.id, color: color, h_color: edgeDetails.color, is_highlight: highlight
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
            showMessage(alertType.Error, 'Please select same type of fiber');
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
                    else
                        copyDetails = network.body.data.nodes.get(nodeDatas.id);
                }
                else
                    copyDetails = network.body.data.nodes.get(sNodes[0].id);

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


            if (edgesArray.length > 0) {
                if (hEdges.length > 0)
                    copyDetails = network.body.data.edges.get(hEdges[hEdges.length - 1].id);
                else
                    copyDetails = network.body.data.edges.get(edgeDatas.id);
                if (type != copyDetails.component_type) {

                    showMessage(alertType.Error, 'Please select same type of fiber');
                    return;
                }
                else {
                    $('#toast').toast('hide');
                }

            }
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
                            document.getElementById("rcRoadmCopyPara").onclick = copyNodePro.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcRoadmApplyPro").onclick = applyPro.bind(
                                this,
                                nodesArray,
                                callback

                            );
                            document.getElementById("rcRoadmCancel").onclick = cancelPro.bind(
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
                                document.getElementById("rcAmplifierCopyPara").onclick = copyNodePro.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcAmpApplyPro").onclick = applyPro.bind(
                                    this,
                                    nodesArray,
                                    callback

                                );
                                document.getElementById("rcAmpCancel").onclick = cancelPro.bind(
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
                                document.getElementById("rcRamanAmpCopyPara").onclick = copyNodePro.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcRamanApplyPro").onclick = applyPro.bind(
                                    this,
                                    nodesArray,
                                    callback

                                );
                                document.getElementById("rcRamanCancel").onclick = cancelPro.bind(
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
                            document.getElementById("rcTransceiverCopyPara").onclick = copyNodePro.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcTransApplyPro").onclick = applyPro.bind(
                                this,
                                nodesArray,
                                callback

                            );
                            document.getElementById("rcTransCancel").onclick = cancelPro.bind(
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

var hoverNodeData;
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

//1-roadm, 2-amp, 3-fused, 4-transceiver, 6- raman amp
function AddNodeMode(nodemode) {

    nodeMode = nodemode;
    if (nodeMode) {
        if (nodeMode > 0 && nodeMode < 7)
            network.addNodeMode();
    }
}

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

var importNodes = [];
var importEdges = [];

var _eqpt_json;
var isEqptFile = false;

function hideLoader() {
    $('#loader').hide();
    $("#importEqpt").val('');
}

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
function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var isImportJSON = false;
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

function getNodeById(data, id) {
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {
            // double equals since id can be numeric or string
            return data[n];
        }
    }

    throw "cannot find id '" + id + "' in data";
}

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

function objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key].id = key;
        return obj[key];
    });
}
function addConnections(elem, index) {
    index = elem.id;
    elem.edges = network.getConnectedNodes(index);
}

var storageData = {
    nodes: [],
    edges: []
}
function SaveNetwork() {
    exportNetwork(true);
}
function StorageClear() {
    disableFiberService();
    deletedata("1");
    init();
}

var isDualFiberMode = 0;
var isSingleFiberMode = 0;
var addEdgeData = {
    from: '',
    to: ''
};

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

var isAddService = 0;
var addServiceData = {
    from: '',
    to: ''
};

var isDualPatchMode = 0;
var isSinglePatchMode = 0;
var addPatchData = {
    from: '',
    to: ''
};

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

var copiedNodeID;
function copyNodePro(nodeID, callback) {
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

function cancelPro(nodeId) {
    clearCopiedData();
}

function applyRoadmPro(nodeID, roadm_type) {
    network.body.data.nodes.update({
        id: nodeID, roadm_type: roadm_type
    });
    realUpdate_Roadm(nodeID, roadm_type);
}
function applyTransPro(nodeID, node_type, trans_type) {
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
function applyAmpPro(nodeID, amp_type) {
    network.body.data.nodes.update({
        id: nodeID, amp_type: amp_type
    });
    realUpdate_Amplifier(nodeID, amp_type);
}
function applyRamanAmpPro(nodeID, amp_type, category) {
    network.body.data.nodes.update({
        id: nodeID, amp_type: amp_type, category: category
    });
    realUpdate_RamanAmp(nodeID, amp_type);

}
function applyPro(nodes, callback) {
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
                        applyRoadmPro(nodes[i], nodeDetails.roadm_type);
                        removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                    }
                }
                else {
                    applyRoadmPro(nodes[i], nodeDetails.roadm_type);
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
                        isUpdated = applyTransPro(nodes[i], nodeDetails.node_type, nodeDetails.transceiver_type);
                        if (isUpdated) {
                            preUpdateList.push(temptrans);
                            removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                        }
                    }
                }
                else {
                    isUpdated = applyTransPro(nodes[i], nodeDetails.node_type, nodeDetails.transceiver_type);
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
                            applyAmpPro(nodes[i], nodeDetails.amp_type);
                            removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                        }
                    }
                    else {
                        applyAmpPro(nodes[i], nodeDetails.amp_type);
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
                            applyRamanAmpPro(nodes[i], nodeDetails.amp_type, nodeDetails.category);
                            removeNodeList.push(network.body.data.nodes.get(nodes[i]));
                        }
                    }
                    else {
                        applyRamanAmpPro(nodes[i], nodeDetails.amp_type, nodeDetails.category);
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
        clearCopiedData();
    }
}

function clearCopiedData() {
    isCopyPara = false;
    copiedNodeID = "";
    UnSelectAll();
    $('#toast').toast('hide');
    document.getElementById("templateMenu").style.display = "none";
    $("#stepCreateTopology").click();
    remove_NodeHighlight();
}

function copyNode(nodeID, callback) {
    showHideDrawerandMenu();
    isCopy = true;
    document.getElementById("btnPasteNode").onclick = pasteNode.bind(
        this,
        nodeID,
        callback

    );
}
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
function UnSelectAll() {
    network.unselectAll();
    remove_NodeHighlight();
}

function networkPage() {
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

//Add fiber//cmode 1-add
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
                span_loss: span_Loss,
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

//Add service//cmode 1-add
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

//Add service//cmode 1-add
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

//check node have connection
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

//check node have service connection
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

//Add node nodeMode - 1-roadm, 2-ILA, 3=fused/attenuator, 4-transceiver,5-amplifier, 6- raman amplifier
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

var nofNode = 1;
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

//start -- component edit, update, remove, clear
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
function clearRoadm() {
    $("#txtRoadmName").val('');
    $("#divRoadmPro").empty();
    $("#ddlRoadmType").val('');
    closeDrawer('roadm');
    _roadmListDB().remove();
    UnSelectAll();
}

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
function clearAmplifier() {
    $("#txtAmplifierName").val('');
    $("#ddlAmplifierType").val('');
    closeDrawer('amplifier');
    UnSelectAll();
}
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
function clearRamanAmp() {
    $("#txtRamanAmpName").val('');
    $("#ddlRamanAmpType").val('');
    $("#ddlRamanAmpCategory").val('');
    closeDrawer('ramanamp');
    UnSelectAll();
}
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
function clearTransceiver() {
    $("#txtTransceiverName").val('');
    $("#ddlTransceiverType").val('');
    $("#ddlDataRate").val('');
    closeDrawer('transceiver');
    UnSelectAll();
}
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

var removeNodeList = [];
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

    network.body.data.nodes.remove(nodeID);
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
                    if (network.body.data.edges.get(fiberID[i].id).color == singleFiberJSON.options.h_color || network.body.data.edges.get(fiberID[i].id).color == singleFiberJSON.options.fh_color) {

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

var removeEdgeList = [];
function deleteFiber(fiberList) {

    removeEdgeList = [];
    var h_color;
    for (var i = 0; i < fiberList.length; i++) {
        if (fiberList.length > 1) {
            h_color = network.body.data.edges.get(fiberList[i].id).color;

            if (h_color == singleFiberJSON.options.h_color || h_color == singleFiberJSON.options.fh_color)
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
//end -- component edit, update, remove, clear
function closeMenu(menuID) {
    document.getElementById(menuID).style.display = "none";
    UnSelectAll();

}
//append node,preamp, booster type
function appendSinglePreAmpandBoosterType() {

    if (eqpt_config['tip-photonic-equipment:amplifier']) {
        $.each(eqpt_config['tip-photonic-equipment:amplifier'], function (index, item) {
            $('#ddlPreAmpType').append('<option value="' + item.type + '">' + item.type + '</option>');
            $('#ddlBoosterType').append('<option value="' + item.type + '">' + item.type + '</option>');
            $('#ddlAmplifierType').append('<option value="' + item.type + '">' + item.type + '</option>');
        });
    }
}

//append node, preamp, booster type for dynamic ele
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

//show context menu on righ click of the component
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

//show fiber and service details when hover the mouse over on it 
function showHoverDiv(x, y, menu) {

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

var showMenu = 0;
function networkValidation() {
    var flag = false;
    if (network.body.data.nodes.get().length > 0 || network.body.data.edges.get().length > 0)
        flag = true;
    else {
        showMessage(alertType.Info, 'Please create network topology');
    }

    return flag;
}

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
function generateAccordianEle(label, ddlEleID) {
    var eleHtml = "";
    eleHtml += "<div class='form-group'>";
    eleHtml += "<label class='f-s-17'>" + label + "</label>";
    eleHtml += "<select id='" + ddlEleID + "' class='form-control'></select>";
    eleHtml += "</div>";
    return eleHtml;
}

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

function redo_css_active() {
    $("#button_undo").css({
        "background-color": "inherit",
        color: "white",
        cursor: "pointer"
    });
};

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

function showMessage(messageType, textmsg, removeTimeout) {
    $("#img_src").show();
    switch (messageType) {
        case alertType.Success:

            $('#msg_content').html(textmsg);
            $('#caption').text(Object.keys(alertType).find(key => alertType[key] === alertType.Success));
            var successrc1 = "./Assets/img/success-toaster.png";
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
            var infosrc = "./Assets/img/info-toaster.png";
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
            dangersrc = "./Assets/img/error-toaster.png";
            $("#img_src").attr("src", dangersrc);
            if (!removeTimeout) {
                $('#caption').text(Object.keys(alertType).find(key => alertType[key] === alertType.Error));

                $('#toast').addClass("danger-toast");
                clearAndSetTimeout(".danger-toast", removeTimeout);
            }
            else {
                $("#img_src").hide();
                $('#caption').text('Messages');
                //dangersrc = "./Assets/img/error-listing-icon.png";
                $('#toast').addClass("danger-toast-error-listing");
                clearAndSetTimeout(".danger-toast-error-listing", removeTimeout);
            }


            break;
        case alertType.Warning:
            $('#msg_content').html(textmsg);
            $('#caption').text(Object.keys(alertType).find(key => alertType[key] === alertType.Warning));
            var warningsrc = "./Assets/img/warning-toaster.png";
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

function enableEdgeIndicator() {
    if (isDualFiberMode == 1 || isSingleFiberMode == 1 || isSinglePatchMode == 1 || isDualPatchMode == 1 || isAddService == 1)
        network.addEdgeMode();
}

function nodeRule(from, to, nodeType) {
    var fromConnections = network.getConnectedEdges(from);
    var toConnections = network.getConnectedEdges(to);

    //var tempFrom = [];
    //var tempTo = [];
    //if (nodeType == transceiverJSON.node_type) {
    //    $.each(fromConnections, function (index, item) {
    //        if (network.body.data.edges.get(item).component_type != serviceJSON.component_type)
    //            tempFrom.push(item);
    //    });

    //    $.each(toConnections, function (index, item) {
    //        if (network.body.data.edges.get(item).component_type != serviceJSON.component_type)
    //            tempTo.push(item);
    //    });
    //    fromConnections = tempFrom;
    //    toConnections = tempTo;
    //}

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


    //to check connection b/w roadm and transceiver
    //if ((fromDetails.node_type == roadmJSON.node_type && toDetails.node_type == transceiverJSON.node_type) || (toDetails.node_type == roadmJSON.node_type && fromDetails.node_type == transceiverJSON.node_type)) {

    //}

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
            msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> must have an even number of links with an equal number of incoming and outgoing links.</p>');
            flag = true;
        }
        if (item.node_type == transceiverJSON.node_type) {
            if (!item.transceiver_type) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + transceiverJSON.node_type + ' type not entered by the user.</p>');
                flag = true;
            }
        }
        else if (item.node_type == roadmJSON.node_type) {
            if (!item.roadm_type) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + roadmJSON.node_type.toUpperCase() + ' type not entered by the user.</p>');
                flag = true;
            }
        }

    });


    //message = msg.join(' ') + " must have an even number of links with an equal number of incoming and outgoing links";
    message = msg.join(' ');
    return { message: message, flag: flag };
}

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
        //    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\')"><img width="25" src="./Assets/img/error-listing-icon.png"> One or more links to <b>' + item.label + '</b> is missing.</p>');
        //    flag = true;
        //}
        if (connectedEdges.length <= 1) {
            msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> One or more links to <b>' + item.label + '</b> is missing.</p>');
            flag = true;
        }
        else if (connectedEdges.length > 1) {

            if ((connectedEdges.length == 2 && fromCount == 2) || (connectedEdges.length == 2 && toCount == 2)) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"><b>' + item.label + '</b> cannot support 2 links of the same type, must have one incoming and one outgoing link</p>');
                flag = true;
            }
            else if (fromCount != toCount || connectedEdges.length > 2) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'span' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"><b>' + item.label + '</b> cannot support more than 2 links</p>');
                flag = true;
            }
        }

        if (item.node_type == amplifierJSON.node_type) {
            if (item.amp_category == amplifierJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + amplifierJSON.amp_category + ' type not entered by the user.</p>');
                    flag = true;
                }

            }
            else if (item.amp_category == ramanampJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - Raman amplifier type not entered by the user.</p>');
                    flag = true;
                }
                if (!item.category) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - Raman amplifier category not entered by the user.</p>');
                    flag = true;
                }

            }
        }

    });

    //var sorp = ' is';
    //if (msg.length > 1)
    //    sorp = ' are'
    //message = "One or more links to " + msg.join(' ') + sorp + " missing";
    message = msg.join(' ');
    return { message: message, flag: flag };
}

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
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + transceiverJSON.node_type + ' type not entered by the user.</p>');
                flag = true;
            }
        }
        else if (item.node_type == roadmJSON.node_type) {
            if (!item.roadm_type) {
                msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + roadmJSON.node_type.toUpperCase() + ' type not entered by the user.</p>');
                flag = true;
            }
        }
        else if (item.node_type == amplifierJSON.node_type) {
            if (item.amp_category == amplifierJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + amplifierJSON.amp_category + ' type not entered by the user.</p>');
                    flag = true;
                }

            }
            else if (item.amp_category == ramanampJSON.amp_category) {
                if (!item.amp_type) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - Raman amplifier type not entered by the user.</p>');
                    flag = true;
                }
                if (!item.category) {
                    msg.push('<p class="focusNode" title="Click here to focus the node" id=\'spanTF' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',1)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - Raman amplifier category not entered by the user.</p>');
                    flag = true;
                }
            }
        }



    });

    //var sorp = ' is';
    //if (msg.length > 1)
    //    sorp = ' are'
    //message = "One or more links to " + msg.join(' ') + sorp + " missing";
    message = msg.join(' ');
    return { message: message, flag: flag };
}

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
            msg.push('<p class="focusNode" title="Click here to focus the fiber" id=\'spanFP' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',2)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + singleFiberJSON.component_type + ' type not entered by the user.</p>');
            flag = true;
        }
        if (isNaN(span_length) || spanlen <= 0 || span_length == "") {
            msg.push('<p class="focusNode" title="Click here to focus the fiber" id=\'spanFP' + item.id.replace(/\s/g, '') + '\' onClick="focusNode(\'' + item.id + '\',2)"><img width="25" src="./Assets/img/error-listing-icon.png"> <b>' + item.label + '</b> - ' + singleFiberJSON.component_type + ' length not entered by the user.</p>');
            flag = true;
        }

    });

    message = msg.join(' ');
    return { message: message, flag: flag };
}

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

var preScale;
var prePosition;
function focusNode(ID, type) {
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

function realUpdate() {
    if ($("#div_toaster").is(":visible") && !$("#img_src").is(":visible")) {
        $("#btnValidation").click();
    }
}

function changeWorkAreaWH(eleID) {
    width = $("#txtw").val();
    height = $("#txth").val();
    if (eleID == "txtw")
        $("canvas").prop('width', width);
    else if (eleID == "txth")
        $("canvas").prop('height', height);

    network.addNodeMode();
}

function remove_NodeHighlight() {
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
            id: hEdges[i].id, color: hEdges[i].h_color, h_color: hEdges[i].color, is_highlight: false
        });
    }
}