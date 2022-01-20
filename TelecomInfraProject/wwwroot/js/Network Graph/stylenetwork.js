
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
localStorage.setItem("copyedgeid", "");
localStorage.setItem("copynodeid", "");
localStorage.setItem("deletenodeconectededge", "");

var optionsJSON = "";
var roadmJSON = "";
var ILAJSON = "";
var amplifierJSON = "";
var fusedJSON = "";
var transceiverJSON = "";
var dualFiberJSON = "";
var singleFiberJSON = "";
var serviceJSON = "";
var patchJSON = "";
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

//undo and redo
//initialize
let history_list_back = [];
let history_list_forward = [];

var isShow = true;


$(document).ready(function () {


    $.getJSON("/Data/StyleData.json", function (data) {
        optionsJSON = data.options;
        roadmJSON = data.Roadm;
        ILAJSON = data.ILA;
        amplifierJSON = data.Amplifier;
        fusedJSON = data.Fused;
        transceiverJSON = data.Transceiver;
        dualFiberJSON = data.DualFiber;
        singleFiberJSON = data.SingleFiber;
        serviceJSON = data.Service;
        patchJSON = data.Patch;
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

    $.getJSON("/Data/yang.json", function (data) {
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
        if (networkValidation())
            SaveNetwork();
    });

    $("#btnExportPopup").click(function () {
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

    $("#btnAddRoadm").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        enableDisableNode(1, "Roadm");
    });
    $("#btnAddILA").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        enableDisableNode(2, "ILA");
    });
    $("#btnAddAmplifier").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        enableDisableNode(5, "amplifier");
    });
    $("#btnAddFused").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        enableDisableNode(3, "fused");
    });
    $("#btnAddTransceiver").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        enableDisableNode(4, "transceiver");
    });
    $("#btnAddDualFiber").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        if (isDualFiberMode == 1) {
            modeHighLight();
            isDualFiberMode = 0;
        }
        else {
            modeHighLight('dualfiber');
            dualFiberMode();
        }
    });
    $("#btnAddSingleFiber").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        if (isSingleFiberMode == 1) {
            modeHighLight();
            isSingleFiberMode = 0;
        }
        else {
            modeHighLight('singlefiber');
            singleFiberMode();
        }
    });
    $("#btnServiceActive").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        if (networkValidation()) {
            if (isAddService == 1) {
                modeHighLight();
                isAddService = 0;
            }
            else {
                modeHighLight('service');
                addServiceMode();
            }
        }
    });
    $("#btnAddPatch").click(function () {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        if (isAddPatch == 1) {
            modeHighLight();
            isAddPatch = 0;
        }
        else {
            modeHighLight('patch');
            addPatchMode();
        }
    });


    $("#btnSaveGP, #btnCloseGP").click(function () {
        $("#staticBackdrop4").modal('hide');
        if (currentStepper) {
            var stepperID = "#" + currentStepper;
            $(stepperID).addClass('active');
            $('#stepGP').removeClass('active');
            if (currentStepper == "stepCreateTopology")
                showMenu = 1;
            else if (currentStepper == "stepAddService")
                showMenu = 2;

        }
        else
            $("#stepCreateTopology").click();
    });
    $('#cbxLength_Based_Loss').change(function () {
        if (this.checked) {
            fiberLengthCal('txtSpan_Length', 'txtLoss_Coefficient', 'txtSpan_Loss');
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

        var conMsg = confirm('Do you want to override existing data and replace with new data?');
        if (conMsg)
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
        }
        rawFile.send(null);
    }
    $("#importEqpt").on('change', function (e) {
        var file = e.target.files[0];
        if (file) {
            var path = (window.URL || window.webkitURL).createObjectURL(file);
            readTextFile(path, function (text) {

                var eqptData = "";
                if (text) {
                    eqptData = JSON.parse(text);
                    isEqptFile = true;
                    eqpt_config = eqptData;
                    load_EqptConfig(true);
                    _import_json = eqptData['ietf-network:networks'];
                    importNetwork();
                }
            });
        }
    });


    //start undo and redo
    redo_css_inactive();
    undo_css_inactive();
    $("#button_undo").on("click", function () {
        if (history_list_back.length > 1) {
            const current_nodes = data.nodes.get(data.nodes.getIds());
            const current_edges = data.edges.get(data.edges.getIds());
            const previous_nodes = history_list_back[1].nodes_his;
            const previous_edges = history_list_back[1].edges_his;
            // event off
            data.nodes.off("*", change_history_back);
            data.edges.off("*", change_history_back);
            // undo without events
            if (current_nodes.length > previous_nodes.length) {
                const previous_nodes_diff = _.differenceBy(
                    current_nodes,
                    previous_nodes,
                    "id"
                );
                data.nodes.remove(previous_nodes_diff);
            } else {
                data.nodes.update(previous_nodes);
            }

            if (current_edges.length > previous_edges.length) {
                const previous_edges_diff = _.differenceBy(
                    current_edges,
                    previous_edges,
                    "id"
                );
                data.edges.remove(previous_edges_diff);
            } else {
                data.edges.update(previous_edges);
            }
            // recover event on
            data.nodes.on("*", change_history_back);
            data.edges.on("*", change_history_back);

            history_list_forward.unshift({
                nodes_his: history_list_back[0].nodes_his,
                edges_his: history_list_back[0].edges_his
            });
            history_list_back.shift();
            // apply css
            css_for_undo_redo_chnage();
            $(btnAddRoadm).removeClass('highlight');
            $(btnAddFused).removeClass('highlight');
            $(btnAddILA).removeClass('highlight');
            $(btnAddAmplifier).removeClass('highlight');
            $(btnAddTransceiver).removeClass('highlight')
            nodeMode = 0;
        }
    });

    $("#button_redo").on("click", function () {
        if (history_list_forward.length > 0) {
            const current_nodes = data.nodes.get(data.nodes.getIds());
            const current_edges = data.edges.get(data.edges.getIds());
            const forward_nodes = history_list_forward[0].nodes_his;
            const forward_edges = history_list_forward[0].edges_his;
            // event off
            data.nodes.off("*", change_history_back);
            data.edges.off("*", change_history_back);
            // redo without events
            if (current_nodes.length > forward_nodes.length) {
                const forward_nodes_diff = _.differenceBy(
                    current_nodes,
                    forward_nodes,
                    "id"
                );
                data.nodes.remove(forward_nodes_diff);
            } else {
                data.nodes.update(forward_nodes);
            }
            if (current_edges.length > forward_edges.length) {
                const forward_edges_diff = _.differenceBy(
                    current_edges,
                    forward_edges,
                    "id"
                );
                data.edges.remove(forward_edges_diff);
            } else {
                data.edges.update(forward_edges);
            }
            // recover event on
            data.nodes.on("*", change_history_back);
            data.edges.on("*", change_history_back);
            history_list_back.unshift({
                nodes_his: history_list_forward[0].nodes_his,
                edges_his: history_list_forward[0].edges_his
            });
            // history_list_forward
            history_list_forward.shift();
            // apply css
            css_for_undo_redo_chnage();
        }
    });
    //end undo and redo

    //show hide label 
    $("#showHideEle").on("click", function () {
        data.nodes.off("*", change_history_back);
        data.edges.off("*", change_history_back);
        showHideLabel();
    });
    $("#hoverDiv").mouseover(function () {
        $(this).hide();
    });
});

function showHideLabel() {

    if (isShow)
        isShow = false;
    else
        isShow = true;
    var edge = network.body.data.edges.get();
    var label = "";
    $.each(edge, function (index, item) {
        if (isShow)
            label = item.text;
        else
            label = " ";
        network.body.data.edges.update({
            id: item.id, label: label
        });

    });

}


function fiberLengthCal(eleSL, eleLC, eleSpanLoss) {
    var spanLength = "#" + eleSL;
    var lossCoefficient = "#" + eleLC;
    var spanLoss = "#" + eleSpanLoss;
    var span_length = Number($(spanLength).val());
    var loss_coefficient = Number($(lossCoefficient).val());
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

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var jsstoreCon = new JsStore.Connection();

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function readdata() {
    return _readdata.apply(this, arguments);
}

function _readdata() {
    _readdata = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return jsstoreCon.select({
                            from: 'tbl_network',
                            where: {
                                id: '1'
                            }
                        });

                    case 2:
                        dat = _context.sent;
                        console.log(dat);

                    case 4:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee);
    }));
    return _readdata.apply(this, arguments);
}

function initDb() {
    return _initDb.apply(this, arguments);
}

function _initDb() {
    _initDb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var isDbCreated;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return jsstoreCon.initDb(getDbSchema());

                    case 2:
                        isDbCreated = _context2.sent;

                        if (isDbCreated) {
                            console.log('db created');
                        } else {
                            console.log('db opened');
                        }

                    case 4:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2);
    }));
    return _initDb.apply(this, arguments);
}

function addNetworData(_x) {
    return _addNetworData.apply(this, arguments);
}

function _addNetworData() {
    _addNetworData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(netData) {
        var noOfDataInserted;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        netmodel = {
                            id: "1",
                            name: netData
                        };
                        _context3.next = 4;
                        return jsstoreCon.insert({
                            into: 'tbl_network',
                            values: [netmodel]
                        });

                    case 4:
                        noOfDataInserted = _context3.sent;

                        if (noOfDataInserted === 1) {
                            alert('successfully added');
                        }

                        _context3.next = 14;
                        break;

                    case 8:
                        _context3.prev = 8;
                        _context3.t0 = _context3["catch"](0);
                        _context3.next = 12;
                        return jsstoreCon.update({
                            in: 'tbl_network',
                            set: {
                                name: netData
                            },
                            where: {
                                id: "1"
                            }
                        });

                    case 12:
                        noOfDataInserted = _context3.sent;

                        if (noOfDataInserted === 1) {
                            alert('successfully updated');
                        }

                    case 14:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, null, [[0, 8]]);
    }));
    return _addNetworData.apply(this, arguments);
}

function deletedata(_x2) {
    return _deletedata.apply(this, arguments);
}

function _deletedata() {
    _deletedata = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id) {
        var noOfStudentRemoved;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return jsstoreCon.remove({
                            from: 'tbl_network',
                            where: {
                                id: id
                            }
                        });

                    case 3:
                        noOfStudentRemoved = _context4.sent;
                        _context4.next = 9;
                        break;

                    case 6:
                        _context4.prev = 6;
                        _context4.t0 = _context4["catch"](0);
                        alert(_context4.t0.message);

                    case 9:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, null, [[0, 6]]);
    }));
    return _deletedata.apply(this, arguments);
}

function getDbSchema() {
    var table = {
        name: 'tbl_network',
        columns: {
            id: {
                primaryKey: true,
                dataType: 'string'
            },
            name: {
                notNull: true,
                dataType: 'string'
            },
        }
    }

    var db = {
        name: 'Db_network',
        tables: [table]
    }
    return db;
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

var lastDownTarget, canvas;


document.addEventListener('click', function (event) {
    lastDownTarget = event.target.tagName;
}, false);


document.addEventListener('keydown', function (event) {
    //if (lastDownTarget == "CANVAS") {
    //90 - z- undo, 89 - y - redo
    if (event.target.type != "text") {
        if (event.keyCode == 90 && event.ctrlKey) {
            $("#button_undo").click();
            showHideDrawerandMenu();
        }
        if (event.keyCode == 89 && event.ctrlKey) {
            $("#button_redo").click();
            showHideDrawerandMenu();
        }
    }
    //}
}, false);



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
    destroy();
    nodes = [];
    edges = [];

    // create a network
    var container = document.getElementById("mynetwork");
    // create an array with nodes
    nodes = new vis.DataSet([

    ]);

    // create an array with edges
    edges = new vis.DataSet([

    ]);

    data = {
        nodes: nodes,
        edges: edges
    }
    if (!isImport) {

        //var tempData = JSON.parse(localStorage.getItem("networkData"));
        var tempData = "";
        try {
            tempData = JSON.parse(dat[0].name);
            if (tempData.nodes.length > 0) {
                var conf = confirm('do you want to load network data from local storage ?');
                if (conf) {
                    //nodes = new vis.DataSet(tempData.nodes);
                    //edges = new vis.DataSet(tempData.edges);


                    nodes = getNodeData(tempData.nodes);
                    edges = getEdgeData(tempData.edges);
                    isLocalStorage = true;
                }
            }
        }
        catch (e) {
        }

    }

    data = {
        nodes: nodes,
        edges: edges
    }

    var options = {

        interaction: optionsJSON.interaction,
        physics: optionsJSON.physis,
        edges: optionsJSON.edges,
        nodes:
        {
            shape: roadmJSON.shape,
            size: roadmJSON.size,
            icon: roadmJSON.icon,
            color: roadmJSON.color
        },
        manipulation: {
            enabled: false,
            addNode: function (data, callback) {

                if ($("#toggleView").is(':checked')) {
                    return;
                }
                if (nodeMode > 0 && nodeMode < 6) {
                    addNodes(data, callback);
                }
            },
        },
    };
    network = new vis.Network(container, data, options);

    network.on("click", function (params) {
        //$("#txtX").val(params.pointer.canvas.x);
        //$("#txtY").val(params.pointer.canvas.y);
        $("#hoverDiv").hide();
        //console.log(params.pointer.canvas.x, params.pointer.canvas.y);
    });
    network.on("selectEdge", function (data) {
        //nodeMode = "";

    });
    network.on("selectNode", function (params) {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        //nodeMode = "";
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        var deletenode = network.getConnectedEdges(clickedNode.id);
        localStorage.setItem("deletenodeconectededge", deletenode.length);
        //_nodesDB().remove();
        //_nodesDB.insert({ "id": clickedNode.id, "type": nodes.get(clickedNode.id).node_type });
        if (isDualFiberMode == 1 || isSingleFiberMode == 1) {
            isAddService = 0;
            addServicData = {
                from: '',
                to: ''
            };
            isAddPatch = 0;
            addPatchData = {
                from: '',
                to: ''
            };
            if (addEdgeData.from == '')
                addEdgeData.from = clickedNode.options.id
            else if (addEdgeData.to == '') {
                if (addEdgeData.from == clickedNode.options.id) {
                    alert('pls click destination ' + roadmJSON.component_type);
                    return;
                }
                addEdgeData.to = clickedNode.options.id
            }

            if (addEdgeData.from != '' && addEdgeData.to != '')
                addFiber();
        }
        if (isAddService == 1) {
            isDualFiberMode = 0;
            isSingleFiberMode = 0;
            isAddPatch = 0;
            addEdgeData = {
                from: '',
                to: ''
            };
            addPatchData = {
                from: '',
                to: ''
            };

            if (addServiceData.from == '')
                addServiceData.from = clickedNode.options.id
            else if (addServiceData.to == '') {
                if (addServiceData.from == clickedNode.options.id) {
                    alert('pls click destination ' + roadmJSON.component_type);
                    return;
                }
                addServiceData.to = clickedNode.options.id
            }

            if (addServiceData.from != '' && addServiceData.to != '')
                addService();

        }
        if (isAddPatch == 1) {
            isDualFiberMode = 0;
            isSingleFiberMode = 0;
            isAddService = 0;
            addEdgeData = {
                from: '',
                to: ''
            };
            addServiceData = {
                from: '',
                to: ''
            };

            if (addPatchData.from == '')
                addPatchData.from = clickedNode.options.id
            else if (addPatchData.to == '') {
                if (addPatchData.from == clickedNode.options.id) {
                    alert('pls click destination ' + roadmJSON.component_type);
                    return;
                }
                addPatchData.to = clickedNode.options.id
            }

            if (addPatchData.from != '' && addPatchData.to != '')
                addPatch();

        }
    });
    network.on("doubleClick", function (data) {
        var type = _nodesDB().first();
        if (type.type == "node") {
            network.editNodeMode();
        }
        else {
            network.editEdgeMode();
        }
        _nodesDB().remove();
    });
    network.on("oncontext", function (data, callback) {

        if ($("#toggleView").is(':checked')) {
            return;
        }
        //nodeMode = "";
        //data.preventDefault();
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

        var type = "";
        var fiber_category = "";
        var amp_category = "";
        if ((nodeData != '' && edgeData != '') || nodeData != '') {
            type = network.body.data.nodes.get(nodeData).node_type;
            amp_category = network.body.data.nodes.get(nodeData).amp_category;
        }
        else if (edgeData != '') {
            type = network.body.data.edges.get(edgeData).component_type;
            fiber_category = network.body.data.edges.get(edgeData).fiber_category;
        }
        else {
            if (isCopy) {
                showContextMenu(data.event.pageX, data.event.pageY, "pasteMenu");
            }
            return;
        }

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
                            showContextMenu(data.event.pageX, data.event.pageY, "roadmMenu");
                            document.getElementById("rcRoadmEdit").onclick = roadmEdit.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcRoadmDelete").onclick = deleteNode.bind(
                                this,
                                nodeData,
                                callback
                            );
                            document.getElementById("rcRoadmCopy").onclick = copyNode.bind(
                                this,
                                nodeData,
                                callback

                            );
                        }
                        else if (type == fusedJSON.node_type) {
                            showContextMenu(data.event.pageX, data.event.pageY, "attenuatorMenu");
                            document.getElementById("rcAttenuatorEdit").onclick = attenuatorEdit.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcAttenuatorDelete").onclick = deleteNode.bind(
                                this,
                                nodeData,
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
                                showContextMenu(data.event.pageX, data.event.pageY, "amplifierMenu");
                                document.getElementById("rcAmplifierEdit").onclick = amplifierEdit.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcAmplifierDelete").onclick = deleteNode.bind(
                                    this,
                                    nodeData,
                                    callback
                                );
                                document.getElementById("rcAmplifierCopy").onclick = copyNode.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                            }
                        }
                        else if (type == transceiverJSON.node_type) {
                            showContextMenu(data.event.pageX, data.event.pageY, "transceiverMenu");
                            document.getElementById("rcTransceiverEdit").onclick = transceiverEdit.bind(
                                this,
                                nodeData,
                                callback

                            );
                            document.getElementById("rcTransceiverDelete").onclick = deleteNode.bind(
                                this,
                                nodeData,
                                callback
                            );
                            document.getElementById("rcTransceiverCopy").onclick = copyNode.bind(
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
                            //document.getElementById("rcDualInsertTransceiver").onclick = dualFiberInsertNode.bind(
                            //    this,
                            //    edgeData,
                            //    'Transceiver',
                            //    callback
                            //);
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
                            document.getElementById("rcSingleInsertROADM").onclick = singleFiberInsertNode.bind(
                                this,
                                edgeData,
                                'Roadm',
                                callback
                            );
                            document.getElementById("rcSingleInsertAttenuator").onclick = singleFiberInsertNode.bind(
                                this,
                                edgeData,
                                'Fused',
                                callback
                            );
                            //document.getElementById("rcSingleInsertTransceiver").onclick = singleFiberInsertNode.bind(
                            //    this,
                            //    edgeData,
                            //    'Transceiver',
                            //    callback
                            //);
                            document.getElementById("rcSingleInsertAmplifier").onclick = singleFiberInsertNode.bind(
                                this,
                                edgeData,
                                'Amplifier',
                                callback
                            );
                            document.getElementById("rcSingleFiberEdit").onclick = singleFiberEdit.bind(
                                this,
                                edgeData,
                                callback
                            );
                            document.getElementById("rcSingleFiberDelete").onclick = deleteFiber.bind(
                                this,
                                edgeData,
                                callback
                            );
                        }
                    }

                }
                else if (type == patchJSON.component_type) {
                    if (edgeData != undefined) {

                        showContextMenu(data.event.pageX, data.event.pageY, "patchMenu");
                        document.getElementById("rcPatchEdit").onclick = patchEdit.bind(
                            this,
                            edgeData,
                            callback
                        );
                        document.getElementById("rcPatchDelete").onclick = deletePatch.bind(
                            this,
                            edgeData,
                            callback
                        );
                    }
                }
            }
        }

        _nodesDB().remove();
    });


    network.on("hoverNode", function (params) {
        try {
            //displayNodesHover(params);
        }
        catch (e) { }
    });
    network.on("blurNode", function (params) {
        //$('#hoverDiv').hide();
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

    // initial data
    history_list_back.push({
        nodes_his: data.nodes.get(data.nodes.getIds()),
        edges_his: data.edges.get(data.edges.getIds())
    });
    // event on
    data.nodes.on("*", change_history_back);
    data.edges.on("*", change_history_back);

}

function displayNodesHover(params) {
    var nodeDetails = network.body.data.nodes.get(params.node);
    if (nodeDetails.component_type == roadmJSON.component_type) {

        if (nodeDetails.node_type == roadmJSON.node_type)
            var hoverData = nodeDetails.node_type + " - name : " + nodeDetails.label + "\n";
        else if (nodeDetails.node_type == fusedJSON.node_type)
            var hoverData = nodeDetails.node_type + " - name : " + nodeDetails.label + "\n";
        else if (nodeDetails.node_type == transceiverJSON.node_type)
            var hoverData = nodeDetails.node_type + " - name : " + nodeDetails.label + "\n";
        else if (nodeDetails.node_type == ILAJSON.node_type)
            var hoverData = nodeDetails.amp_category + " - name : " + nodeDetails.label + "\n";
        else if (nodeDetails.node_type == amplifierJSON.node_type)
            var hoverData = nodeDetails.amp_category + " - name : " + nodeDetails.label + "\n";
        //hoverData += "Source : " + network.body.data.nodes.get(fiberDetails.from).label + "\n";
    }

    $('#hoverDiv').html(htmlTitle(hoverData));
    showHoverDiv(params.event.pageX, params.event.pageY, "hoverDiv");
}
function displayFiberHover(params) {
    var fiberDetails = network.body.data.edges.get(params.edge);
    var fiber_type = "";
    var span_length = "0";
    var span_loss = "0";
    if (fiberDetails.component_type == patchJSON.component_type)
        return;
    if (fiberDetails.component_type == singleFiberJSON.component_type) {
        if (fiberDetails.fiber_category == dualFiberJSON.fiber_category) {
            var fromlabel = "(" + network.body.data.nodes.get(fiberDetails.from).label + " -> " + network.body.data.nodes.get(fiberDetails.to).label + ")";
            var hoverData = fiberDetails.component_type + " - name : " + fiberDetails.label + "\n";
            //hoverData += "category : " + fiberDetails.fiber_category + "\n";
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
            //hoverData += "Loss Coefficient(dB/km) : " + loss_coefficient + "\n";
            //hoverData += "Connector IN(dB) : " + connector_in + "\n";
            //hoverData += "Connector OUT(dB) : " + connector_out + "\n";
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
            //hoverData += "Loss Coefficient(dB/km) : " + loss_coefficient + "\n";
            //hoverData += "Connector IN(dB) : " + connector_in + "\n";
            //hoverData += "Connector OUT(dB) : " + connector_out + "\n";
            hoverData += "Span loss : " + span_loss + "\n";
        }
        else if (fiberDetails.fiber_category == singleFiberJSON.fiber_category) {
            var hoverData = fiberDetails.component_type + " - name : " + fiberDetails.label + "\n";
            //hoverData += "category : " + fiberDetails.fiber_category + "\n";
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

            hoverData += "Fiber type : " + fiber_type + "\n";
            hoverData += "Span length(in km) : " + span_length + "\n";
            //hoverData += "Loss Coefficient(dB/km) : " + loss_coefficient + "\n";
            //hoverData += "Connector IN(dB) : " + connector_in + "\n";
            //hoverData += "Connector OUT(dB) : " + connector_out + "\n";
            hoverData += "Span loss : " + span_loss + "\n";
        }
    }
    if (fiberDetails.component_type == serviceJSON.component_type) {
        var hoverData = fiberDetails.component_type + " - name : " + fiberDetails.label + "\n";
        hoverData += "Source : " + network.body.data.nodes.get(fiberDetails.from).label + "\n";
        hoverData += "Destination : " + network.body.data.nodes.get(fiberDetails.to).label + "\n";
        hoverData += "Bandwidth (in Gbps) : " + fiberDetails.band_width + "\n";
    }
    $('#hoverDiv').html(htmlTitle(hoverData, commonJSON.background_color));
    showHoverDiv(params.event.pageX, params.event.pageY, "hoverDiv");
}

//1-roadm, 2-amp, 3-fused, 4-transceiver
function AddNodeMode(nodemode) {

    nodeMode = nodemode;
    if (nodeMode) {
        if (nodeMode > 0 && nodeMode < 6)
            network.addNodeMode();
    }
}

function htmlTitle(html) {
    const container = document.createElement("pre");
    container.innerHTML = html;
    container.style.background = commonJSON.background_color;
    //container.style.color = commonJSON.font_color;
    container.style.font = commonJSON.font;
    //container.style.fontSize = commonJSON.font_size;
    container.style.padding = "5px";
    container.style.margin = "0px";
    container.style.border = commonJSON.border;
    container.style.transition = "all 1s ease-in-out";
    container.style.fontVariant = commonJSON.font_variant;
    return container;
}

function init(isImport) {

    initDb();
    readdata();

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
    //testing();

    //var nodesModel = [];

    //var edgesModel = [];
    //$.each(network.body.nodes, function (i) {
    //    var data = {
    //        id: network.body.nodes[i].options.id,
    //        label: network.body.nodes[i].options.label,
    //        x: network.body.nodes[i].x,
    //        y: network.body.nodes[i].y,
    //        shape: network.body.nodes[i].options.shape,
    //        size: network.body.nodes[i].options.size,
    //        nodedegree: network.body.nodes[i].options.nodedegree,
    //        nodetype: network.body.nodes[i].options.nodetype,
    //        componentType: nodes.get(network.body.nodes[i].options.id).componentType,
    //        icon:
    //            network.body.nodes[i].options.icon,
    //        color: [
    //            {
    //                border: network.body.nodes[i].options.color.border,
    //                background: network.body.nodes[i].options.color.background,
    //                highlight: [
    //                    {
    //                        border: network.body.nodes[i].options.color.border,
    //                        background: network.body.nodes[i].options.color.background,
    //                    }
    //                ],
    //                hover: [
    //                    {
    //                        border: network.body.nodes[i].options.color.border,
    //                        background: network.body.nodes[i].options.color.background,
    //                    }
    //                ]
    //            }
    //        ],
    //        edges: network.getConnectedNodes(network.body.nodes[i].options.id)
    //    };

    //    let str = network.body.nodes[i].options.id;
    //    let checktext;
    //    try {
    //        checktext = str.substring(0, 7);
    //    }
    //    catch (e) { }

    //    if (data.x != undefined && data.y != undefined && checktext != "edgeId:")
    //        nodesModel.push(data);
    //});

    //$.each(network.body.edges, function (i) {
    //    var data = {
    //        id: network.body.edges[i].id,
    //        label: network.body.edges[i].options.label,
    //        //title: network.body.edges[i].title,
    //        from: network.body.edges[i].fromId,
    //        to: network.body.edges[i].toId,
    //        dashes: network.body.edges[i].options.dashes,
    //        length: network.body.edges[i].options.length,
    //        value: network.body.edges[i].options.value,
    //        componentType: edges.get(network.body.edges[i].id).componentType,
    //        options: [
    //            {
    //                color: [
    //                    {
    //                        color: network.body.edges[i].options.color.color,
    //                        highlight: network.body.edges[i].options.color.highlight,
    //                        hover: network.body.edges[i].options.color.hover,
    //                        inherit: network.body.edges[i].options.color.inherit,
    //                        opacity: network.body.edges[i].options.color.opacity,

    //                    }
    //                ],
    //                background: [
    //                    {
    //                        color: network.body.edges[i].options.background.color,
    //                        dashes: network.body.edges[i].options.background.dashes,
    //                        enabled: network.body.edges[i].options.background.enabled,
    //                        size: network.body.edges[i].options.background.size,
    //                    }
    //                ],
    //                arrows: [
    //                    {
    //                        from: [
    //                            {
    //                                enabled: network.body.edges[i].options.arrows.from.enabled,
    //                                type: network.body.edges[i].options.arrows.from.type
    //                            }
    //                        ],
    //                        to: [
    //                            {
    //                                enabled: network.body.edges[i].options.arrows.to.enabled,
    //                                type: network.body.edges[i].options.arrows.to.type
    //                            }
    //                        ],
    //                    }
    //                ],
    //                font: [
    //                    {
    //                        align: network.body.edges[i].options.font.align
    //                    }
    //                ],
    //                smooth: [
    //                    {
    //                        enabled: network.body.edges[i].options.smooth.enabled,
    //                        roundness: network.body.edges[i].options.smooth.roundness,
    //                        type: network.body.edges[i].options.smooth.type
    //                    }
    //                ],

    //            }
    //        ]

    //    };
    //    edgesModel.push(data);
    //});





    //start test
    var final = [];
    var transceiverarr = [];
    var roadmarr = [];
    $.each(network.body.data.nodes.get(), function (index, item) {
        if (item.node_type == transceiverJSON.node_type) {
            var node = {
                uid: item.id,
                type: item.node_type,
                metadata: {
                    location: {
                        latitude: item.x,
                        longitude: item.y,
                        city: item.label,
                        region: null
                    }
                }
            }
            final.push(node);
        }
        else if (item.node_type == roadmJSON.node_type) {
            var node = {
                uid: item.id,
                type: item.node_type,
                params: {
                    target_pch_out_db: -0,
                    restrictions: {
                        preamp_variety_list: [
                        ],
                        booster_variety_list: [
                        ]
                    }

                },
                metadata: {
                    location: {
                        latitude: item.x,
                        longitude: item.y,
                        city: item.label,
                        region: null
                    }
                }
            }
            final.push(node);
        }
        else if (item.node_type == fusedJSON.node_type) {
            var node = {
                uid: item.id,
                type: item.node_type,
                params: {
                    loss: 1
                },
                metadata: {
                    location: {
                        latitude: item.x,
                        longitude: item.y,
                        city: item.label,
                        region: ""
                    }
                }
            }
            final.push(node);
        }
        else if (item.node_type == ILAJSON.node_type) {
            var node = {
                uid: item.id,
                type: "Edfa",
                type_variety: "std_low_gain",
                operational: {
                    gain_target: 21.0,
                    delta_p: 1.0,
                    tilt_target: 0,
                    out_voa: 0
                },
                metadata: {
                    location: {
                        latitude: item.x,
                        longitude: item.y,
                        city: item.label,
                        region: ""
                    }
                }
            }
            final.push(node);
        }
    });
    var edgearay = [];
    $.each(network.body.data.edges.get(), function (index, item) {
        var edge = {
            from_node: item.from,
            to_node: item.to
        }
        edgearay.push(edge);
    });
    //final.push(transceiverarr);
    //final.push(roadmarr);
    var model = {
        elements: final,
        connections: edgearay
    }
    //end test
    var exportValue = JSON.stringify(model, undefined, 2);

    if (isSaveNetwork) {
        addNetworData(exportValue);
        return;
    }

    var filename = $("#txtFileName").val() + ".json";

    var blob = new Blob([exportValue], {
        type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);
}

var importNodes = [];
var importEdges = [];

var _eqpt_json;
var isEqptFile = false;


function load_EqptConfig(isFileUpload) {
    try {


        if (!eqpt_config['tip-photonic-simulation:simulation'] || !eqpt_config['tip-photonic-equipment:transceiver'] || !eqpt_config['tip-photonic-equipment:fiber'] || !eqpt_config['tip-photonic-equipment:amplifier']) {
            alert("keyError:'elements', try again");
            return;
        }
        else {
            if (isFileUpload)
                alert("json file loaded successfully ");
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


        if (eqpt_config['tip-photonic-simulation:simulation']) {
            var simulationsData = eqpt_config['tip-photonic-simulation:simulation'];
            var simulations = simulationsData["grid"];
            $("#txtFrgMin").val(simulations["frequency-min"]);
            $("#txtFrqMax").val(simulations["frequency-max"]);
            $("#txtGridSpac").val(simulations.spacing);
            $("#txtNoOfChannel").val('40');
            $("#txtAgeingMargin").val(simulationsData["system-margin"]);
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
        appendSinglePreAmpandBoosterType();
    }
    catch {
        console.log("keyError:'elements', try again");
        //alert("keyError:'elements', try again");
    }
}

function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
    //document.getElementById('input_output').textContent = "";
    //_import_json = document.getElementById('input_output').textContent = event.target.result;
    _import_json = event.target.result;
    importNetwork();
}

function importNode(index) {

    //var nodeID = token();
    var nodeDetails = "";
    var shape = "";
    var color = "";
    var image = "";
    var transceiver_type = "";
    var amp_type = "";
    var amp_category = "";
    var pre_amp_type = "";
    var booster_type = "";
    var x = getRandomNumberBetween(-230, 648);
    var y = getRandomNumberBetween(-230, 648);

    try {
        if (_import_json["network"][0].node[index]["metadata"]["location"].latitude)
            x = _import_json["network"][0].node[index]["metadata"]["location"].latitude;
        else
            x = getRandomNumberBetween(-230, 648);
            
        if (_import_json["network"][0].node[index]["metadata"]["location"].longitude)
            y = _import_json["network"][0].node[index]["metadata"]["location"].longitude;
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
    //nodeID = _import_json["network"][0].node[index]["node-id"]


    if (roadmData) {

        nodeDetails = configData.node[roadmJSON.node_type];
        image = DIR + roadmJSON.image;
        shape = roadmJSON.shape;
        color = roadmJSON.color;
        
    }
    else if (transceiverData) {
        nodeDetails = configData.node[transceiverJSON.node_type];
        shape = transceiverJSON.shape;
        color = transceiverJSON.color;
        image = DIR + transceiverJSON.image;
        transceiver_type = transceiverData.model;

    }
    else if (attenuatorData) {

        nodeDetails = configData.node[fusedJSON.node_type];
        shape = fusedJSON.shape;
        color = fusedJSON.color;
        image = DIR + fusedJSON.image;
    }
    else if (amplifierData) {
        nodeDetails = configData.node[amplifierJSON.amp_category];
        shape = amplifierJSON.shape;
        color = amplifierJSON.color;
        image = DIR + amplifierJSON.image;
        amp_type = amplifierData.model;
        amp_category = nodeDetails.default.amp_category;
        //nodeDetails = configData.node[ILAJSON.amp_category];
        //shape = ILAJSON.shape;
        //color = ILAJSON.color;
        //image = DIR + ILAJSON.image;
        //pre_amp_type = amplifierData.model;
        //booster_type = amplifierData.model;
        //amp_category = nodeDetails.default.amp_category;
    }
    else if (ILAData) {
        nodeDetails = configData.node[ILAJSON.amp_category];
        shape = ILAJSON.shape;
        color = ILAJSON.color;
        image = DIR + ILAJSON.image;
        pre_amp_type = ILAData.model;
        booster_type = ILAData.model;
        amp_category = nodeDetails.default.amp_category;
    }
    else
        return;

    nodelength = nodeName(nodeDetails.default.node_type);
    //var nodeLabel = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();
    var number = nodelength;
    //var label = nodeLabel;
    
    var label = _import_json["network"][0].node[index]["node-id"];
    var nodeID = label;
    var node_type = nodeDetails.default.node_type;
    var node_degree = nodeDetails.default.node_degree;
    var component_type = roadmJSON.component_type;



    network.body.data.nodes.add({
        id: nodeID, label: label, x: x, y: y, image: image, number: number,
        shape: shape, color: color,
        node_type: node_type, node_degree: node_degree, component_type: component_type,
        roadm_type_pro: [],
        transceiver_type: transceiver_type,//transceiver
        amp_type: amp_type,//amplifier
        pre_amp_type: pre_amp_type, booster_type: booster_type, amp_category: amp_category//ILA
    });


    importNodes.push({
        id: nodeID,
        label: label,
        shape: shape,
        image: image,
        color: color,
        //edges: elem.edges[0],
        x: x,
        y: y,
        number: number,
        transceiver_type: transceiver_type,
        pre_amp_type: pre_amp_type,
        booster_type: booster_type,
        amp_type: amp_type,
        amp_category: amp_category,
        roadm_type_pro: [],
        component_type: component_type,
        node_degree: nodeDetails.default.node_degree,
        node_type: nodeDetails.default.node_type

    });

}

function importEdge(index) {

    var edgeData = _import_json["network"][0]['ietf-network-topology:link'][index];
    var to = edgeData["destination"]["dest-node"];
    var from = edgeData["source"]["source-node"];
    if (edgeData["tip-photonic-topology:fiber"]) {
        isSingleFiberMode = 1;
        var labelvalue = edgeData["link-id"];
        var textvalue = labelvalue;
        addFiberComponent(1, from, to, labelvalue, textvalue);
    }
    if (edgeData["tip-photonic-topology:patch"]) {
        isSingleFiberMode = 1;
        var labelvalue = edgeData["link-id"];
        var textvalue = labelvalue;
        addPatchComponent(1, from, to, labelvalue, textvalue, true);
    }
}
function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function importNetwork() {
    //init(true);

    try {
        if (network.body.data.nodes.length > 0) {
            nodes.clear();
            network.body.data.nodes.clear();
        }

        nodes = [];
        edges = [];

        var networkData = _import_json["network"][0].node;
        $.each(networkData, function (index, item) {
            importNode(index);
        });

        var edgeData = _import_json["network"][0]['ietf-network-topology:link'];

        $.each(edgeData, function (index, item) {
            importEdge(index);
        });

        nodes = new vis.DataSet(importNodes);
        edges = new vis.DataSet(importEdges);

        $("#toggleView").click();
    }
    catch
    { }
    //nodes = getNodeData(inputData.nodes);
    //edges = getEdgeData(inputData.edges);
    //data = {
    //    nodes: nodes,
    //    edges: edges
    //};
    //counter = counter + Number(nodes.length);
    //localStorage.setItem("nodelength", counter);
    //var options = {

    //    interaction: optionsJSON.interaction,
    //    physics: optionsJSON.physis,
    //    edges: optionsJSON.edges,
    //    nodes:
    //    {
    //        shape: roadmJSON.shape,
    //        size: roadmJSON.size,
    //        icon: roadmJSON.icon,
    //        color: roadmJSON.color
    //    },
    //    manipulation: {
    //        enabled: false,
    //        addNode: function (data, callback) {
    //            counter = counter + 1;
    //            localStorage.setItem("nodelength", counter);
    //            addNodes(data, callback);
    //        },
    //    },
    //};
    //network = new vis.Network(container, data, "");
    //testing();

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

    ////old node json
    //data.forEach(function (elem, index, array) {
    //    nodes.push({
    //        id: elem.id,
    //        label: elem.label,
    //        shape: elem.shape,
    //        icon: elem.icon,
    //        color: elem.color,
    //        x: elem.x,
    //        y: elem.y,
    //        title: elem.title,
    //    });
    //});


    return new vis.DataSet(importNodes);
}

function getNodeById(data, id) {
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {
            // double equals since id can be numeric or string
            return data[n];
        }
    }

    throw "Can not find id '" + id + "' in data";
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

        //var options = {
        //    font: fontstyle,
        //    arrows: arrows,
        //    smooth: smooth
        //}
        var fromlabel = "(" + network.body.data.nodes.get(elem.from).label + " -> " + network.body.data.nodes.get(elem.to).label + ")";
        importEdges.push({
            id: elem.id,
            from: elem.from,
            to: elem.to,
            dashes: elem.dashes,
            label: elem.label,
            //options: options,
            font: fontstyle,
            arrows: arrows,
            smooth: smooth,
            color: elem.options[0].color[0].color,
            componentType: elem.componentType,
            // title: htmlTitle("uid : " + fromlabel + "\n" + "type : " + elem.componentType),
            //label: elem.label,
            //font: elem.font,
            //arrows: elem.arrows,

        });


    });

    //old json edges
    //data.forEach(function (node) {
    //    // add the connection
    //    node.edges.forEach(function (connId, cIndex, conns) {
    //        edges.push({ from: node.id, to: connId });
    //        let cNode = getNodeById(data, connId);

    //        var elementConnections = cNode.edges;

    //        // remove the connection from the other node to prevent duplicate connections
    //        var duplicateIndex = elementConnections.findIndex(function (
    //            connection
    //        ) {
    //            return connection == node.id; // double equals since id can be numeric or string
    //        });

    //        if (duplicateIndex != -1) {
    //            elementConnections.splice(duplicateIndex, 1);
    //        }
    //        _edgesDB.insert({ "from": node.id, "to": connId, "edgeLength": 100 })

    //    });

    //});

    return new vis.DataSet(importEdges);
}

function objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key].id = key;
        return obj[key];
    });
}
function addConnections(elem, index) {
    // need to replace this with a tree of the network, then get child direct children of the element
    index = elem.id;
    elem.edges = network.getConnectedNodes(index);
}


var storageData = {
    nodes: [],
    edges: []
}
function SaveNetwork() {
    exportNetwork(true);
    //storageData.nodes = nodes.get();
    //storageData.edges = edges.get();
    //localStorage.setItem("networkData", JSON.stringify(storageData));
}
function StorageClear() {
    //localStorage.removeItem("networkData");
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
            alert("can not add " + dualFiberJSON.fiber_category + " from " + msg);
            addEdgeData = {
                from: '',
                to: ''
            };
            UnSelectAll();
            return;
        }
    }

    //to restrict amplifier on singelfiber connection
    if (isSingleFiberMode == 1) {
        var msg = "";
        if (srcNode.amp_category == ILAJSON.amp_category) {
            msg = srcNode.amp_category + " type : " + srcNode.label + " to ";
        }
        else {
            isSrcOk = true;
            if (srcNode.amp_category)
                msg = srcNode.amp_category + " type : " + srcNode.label + " to ";
            else
                msg = srcNode.node_type + " type : " + srcNode.label + " to ";
        }
        if (DestNode.amp_category == ILAJSON.amp_category) {
            msg += DestNode.amp_category + " type : " + DestNode.label;
        }
        else {
            isDestOk = true;
            if (DestNode.amp_category)
                msg += DestNode.amp_category + " type : " + DestNode.label;
            else
                msg += DestNode.node_type + " type : " + DestNode.label;
        }

        if (!isSrcOk || !isDestOk) {
            alert("can not add " + singleFiberJSON.fiber_category + " from " + msg);
            addEdgeData = {
                from: '',
                to: ''
            };
            UnSelectAll();
            return;
        }
    }

    var labelvalue = dualFiberJSON.component_type + " " + network.body.data.nodes.get(addEdgeData.from).number + ' - ' + network.body.data.nodes.get(addEdgeData.to).number;
    var textvalue = roadmJSON.node_type + "- [ " + network.body.data.nodes.get(addEdgeData.from).label + ' - ' + network.body.data.nodes.get(addEdgeData.to).label + " ]";
    addFiberComponent(1, addEdgeData.from, addEdgeData.to, labelvalue, textvalue);
    addEdgeData = {
        from: '',
        to: ''
    };
    UnSelectAll();
}
function dualFiberMode() {
    UnSelectAll();
    isDualFiberMode = 1;
    isSingleFiberMode = 0;
    isAddService = 0;
    isAddPatch = 0;
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
    isAddPatch = 0;
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

var isAddPatch = 0;
var addPatchData = {
    from: '',
    to: ''
};

function addService() {

    var fromDetails = network.body.data.nodes.get(addServiceData.from);
    var toDetails = network.body.data.nodes.get(addServiceData.to);
    if (fromDetails.node_type == transceiverJSON.node_type && toDetails.node_type == transceiverJSON.node_type && fromDetails.transceiver_type == toDetails.transceiver_type) {
        var labelvalue = serviceJSON.component_type + ' ' + network.body.data.nodes.get(addServiceData.from).number + ' - ' + network.body.data.nodes.get(addServiceData.to).number;
        //if (checkNodeConnection(addServiceData.from, addServiceData.to))
        //2 transceiver must have fiber/patch connection
        if (network.getConnectedEdges(addServiceData.from).length > 0 && network.getConnectedEdges(addServiceData.to).length > 0)
            addServiceComponent(1, addServiceData.from, addServiceData.to, labelvalue);
        else
            alert("source " + roadmJSON.component_type + " : " + fromDetails.label + " ,destination " + roadmJSON.component_type + " : " + toDetails.label + " should have " + dualFiberJSON.component_type + "/" + patchJSON.component_type + " connection");
    }
    else {
        alert("The " + serviceJSON.component_type + " should be between 2 " + transceiverJSON.node_type + " sites");
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
    isAddPatch = 0;
    addServiceData = {
        from: '',
        to: ''
    };
}

function addPatch() {

    var fromDetails = network.body.data.nodes.get(addPatchData.from);
    var toDetails = network.body.data.nodes.get(addPatchData.to);
    if ((fromDetails.node_type == transceiverJSON.node_type && toDetails.node_type == roadmJSON.node_type) || (fromDetails.node_type == roadmJSON.node_type && toDetails.node_type == transceiverJSON.node_type)) {
        var labelvalue = patchJSON.component_type + ' ' + network.body.data.nodes.get(addPatchData.from).number + ' - ' + network.body.data.nodes.get(addPatchData.to).number;
        addPatchComponent(1, addPatchData.from, addPatchData.to, labelvalue, false);
    }
    else {
        alert("The " + patchJSON.component_type + " should be between " + transceiverJSON.node_type + " and " + roadmJSON.node_type + " sites");
    }
    addPatchData = {
        from: '',
        to: ''
    };
    UnSelectAll();

}
function addPatchMode() {
    UnSelectAll();
    isAddPatch = 1;
    isAddService = 0;
    isDualFiberMode = 0;
    isSingleFiberMode = 0;
    addPatchData = {
        from: '',
        to: ''
    };
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
        var nodeData = network.body.data.nodes.get(nodeId);
        var nodeDetails = configData.node[nodeData.node_type];
        var node_type = nodeData.node_type;
        //insertNodeX = network.body.data.nodes[nodeId].x + 5;
        //insertNodeY = network.body.data.nodes[nodeId].y + 5;

        nodelength = nodeName(node_type);
        nodeLabel = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();
        nodeData.label = nodeLabel;
        nodeData.number = nodelength;

        if (node_type == roadmJSON.node_type) {
            network.body.data.nodes.add({
                id: nodeID, label: nodeData.label, x: insertNodeX, y: insertNodeY, image: DIR + roadmJSON.image, number: nodeData.number,
                shape: roadmJSON.shape, color: roadmJSON.color, font: roadmJSON.font,
                node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: roadmJSON.component_type,
                roadm_type_pro: []
            });
        }
        else if (node_type == fusedJSON.node_type) {
            network.body.data.nodes.add({
                id: nodeID, label: nodeData.label, x: insertNodeX, y: insertNodeY, image: DIR + fusedJSON.image, number: nodeData.number,
                shape: fusedJSON.shape, color: fusedJSON.color, font: fusedJSON.font,
                node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: fusedJSON.component_type,
            });
        }
        else if (node_type == transceiverJSON.node_type) {
            network.body.data.nodes.add({
                id: nodeID, label: nodeData.label, x: insertNodeX, y: insertNodeY, image: DIR + transceiverJSON.image, number: nodeData.number,
                shape: transceiverJSON.shape, color: transceiverJSON.color, font: transceiverJSON.font,
                node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: transceiverJSON.component_type,
                transceiver_type: nodeData.transceiver_type
            });
        }
        else if (node_type == ILAJSON.node_type) {

            if (nodeData.amp_category == ILAJSON.amp_category) {
                network.body.data.nodes.add({
                    id: nodeID, label: nodeData.label, x: insertNodeX, y: insertNodeY, image: DIR + ILAJSON.image, number: nodeData.number,
                    shape: ILAJSON.shape, color: ILAJSON.color, font: ILAJSON.font,
                    node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: ILAJSON.component_type,
                    pre_amp_type: nodeData.pre_amp_type, booster_type: nodeData.booster_type, amp_category: nodeData.amp_category
                });
            }
            else if (nodeData.amp_category == amplifierJSON.amp_category) {
                network.body.data.nodes.add({
                    id: nodeID, label: nodeData.label, x: insertNodeX, y: insertNodeY, image: DIR + amplifierJSON.image, number: nodeData.number,
                    shape: amplifierJSON.shape, color: amplifierJSON.color, font: amplifierJSON.font,
                    node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: amplifierJSON.component_type,
                    amp_type: nodeData.amp_type, amp_category: nodeData.amp_category
                });
            }
        }




        document.getElementById("pasteMenu").style.display = "none";
        $("#stepCreateTopology").click();
    }
}
function UnSelectAll() {
    network.unselectAll();
}

function wholePage() {
    html2canvas(document.body, {
        onrendered: function (canvas) {
            var img = canvas.toDataURL();
            $("#result-image").attr('src', img).show();

            canvas.toBlob(function (blob) {
                saveAs(blob, "wholePage.png");
            });
        }
    });
    return false;
}

function networkPage() {
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
    isAddPatch = 0;
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

function generateMatrix() {
    $("#matrixDiv").empty();
    var nodearray = network.body.data.nodes.get();
    if (nodearray.length > 0) {

        //$("#matrixDiv").append(table);

        var tblheader = "";
        var tblrow = "";
        var ric = 2;
        var ris = 2;

        for (var i = 0; i < nodearray.length; i++) {

            // let rdynamicid = "r1_" + rid;
            let firstrowid = "r1_" + ric;
            var hiddenField = "<input id=h" + firstrowid + " value=" + nodearray[i].id + " type=hidden />";
            tblheader += "<th id=" + firstrowid + ">" + nodearray[i].label + " " + hiddenField + "</th>";
            rdynamicid = "r" + ris + "_1";

            var hiddenFieldL = "<input id=h" + rdynamicid + " value=" + nodearray[i].id + " type=hidden />";
            tblrow += "<tr><td id=" + rdynamicid + ">" + nodearray[i].label + " " + hiddenFieldL + "</td>" + addEmptyRC(nodearray.length, "r" + ris + "_", i, nodearray[i].id) + "</tr>";

            ric++;
            ris++;

        }
        //$("#matrixDiv").append(tblheader);
        //$("#matrixDiv").append(tblrow);
        // tblheader += "</tr>";
        //tblrow += "";
        //table += tblheader+tblrow+"</table>"
        var table = "<table id='matrixTable'><tr><th id=r1_1></th>" + tblheader + "</tr>" + tblrow + "</table>"
        $("#matrixDiv").append(table);
        //console.log(multiarr);

        $('#matrixTable tr td').click(function () {
            var cid = $(this).attr('id');

            if (cid == undefined) {
                return;
            }

            var arsplit = cid.split('_');
            var sfirst = "#h" + arsplit[0] + "_1";
            var ssecond = "#hr" + arsplit[1] + "_1";
            var txtFrom = $(sfirst).val();
            var txtTo = $(ssecond).val();
            var otherDir = "#r" + arsplit[1] + "_" + arsplit[0].replace('r', '');
            //console.log('cond ',txtFrom, txtTo);
            if ($(this).text() == 'yes') {

                var confirmation = confirm('do you want to remove ?')
                if (confirmation) {
                    var edgesarr = network.body.data.edges.get();
                    for (var i = 0; i < edgesarr.length; i++) {

                        //console.log(edgesarr[i].from, edgesarr[i].to);
                        //alert('edgefrom - '+edgesarr[i].from +', txtfrom - '+ txtFrom +', edgeto - '+ edgesarr[i].to +', txtTo - '+ txtTo);
                        if ((edgesarr[i].from == txtFrom && edgesarr[i].to == txtTo) || (edgesarr[i].from == txtTo && edgesarr[i].to == txtFrom)) {
                            //console.log('condition',edgesarr[i].from, edgesarr[i].to);
                            network.body.data.edges.remove(edgesarr[i].id)
                            //alert('fiber removed');
                            $(this).text('X');
                            $(otherDir).text('X');
                            $(this).removeClass('tdback');
                            $(otherDir).removeClass('tdback');
                            return;
                        }
                    }
                    return;
                }
                else
                    return;
            }

            //alert(cid);
            //alert(sfirst + ', ' + ssecond);
            $(this).text('yes');
            $(otherDir).text('yes');

            $(this).addClass('tdback');
            $(otherDir).addClass('tdback');

            var labelvalue = '[' + network.body.data.nodes.get(txtFrom).label + ' - ' + network.body.data.nodes.get(txtTo).label + ']';
            network.body.data.edges.add({
                id: token(), from: txtFrom, to: txtTo, label: labelvalue, font: { align: 'top' },
                componentType: "fiber"
            });

        });

    }
    $("#myModal").show();
}

var multiarr = [];
function addEmptyRC(numberofRC, dyid, restrictRC, nodeid) {
    var emptycol = "";
    var ldid = 2;
    var localnodearray = network.body.data.nodes.get();
    for (var i = 0; i < numberofRC; i++) {
        if (i == restrictRC)
            emptycol += "<td></td>";
        else {
            let cll = restrictRC + '_' + i;
            //var spanEle = "<Span id=" + cll + ">X</Span>";
            let roid = dyid + ldid;
            //var nodecol = network.getConnectedEdges(nodeid);
            //var noderow = network.getConnectedEdges(localnodearray[i].id);
            //console.log(nodeid, nodeEdgeLength.length)
            //alert(nodecol.length + ', ' + noderow.length);
            //console.log(nodecol.length + ', ' + noderow.length);

            //console.log(checkfiberconnection(nodeid, localnodearray[i].id));


            if (checkfiberconnection(nodeid, localnodearray[i].id))
                emptycol += "<td style='cursor:pointer;' class='tdback' id=" + roid + ">yes</td>";
            else
                emptycol += "<td style='cursor:pointer;' id=" + roid + ">X</td>";

            //var arrmultidata = nodeid + ',' + localnodearray[i].id;
            //multiarr.push(arrmultidata);
        }

        ldid++;
    }
    return emptycol;
}

function checkfiberconnection(fromNode, toNode) {
    var edgesarr = network.body.data.edges.get();
    var flag = false;
    for (var i = 0; i < edgesarr.length; i++) {
        //console.log(edgesarr[i].from, edgesarr[i].to);
        //alert('edgefrom - '+edgesarr[i].from +', txtfrom - '+ txtFrom +', edgeto - '+ edgesarr[i].to +', txtTo - '+ txtTo);
        if ((edgesarr[i].from == fromNode && edgesarr[i].to == toNode) || (edgesarr[i].from == toNode && edgesarr[i].to == fromNode)) {
            flag = true;
            return true;
        }
    }
    return flag;
}



function getAllNode() {
    $("#nodeDiv").empty();
    var nodelist = network.body.data.nodes.get();
    for (var i = 0; i < nodelist.length; i++) {

        var topnode = "<button class='accordion'>" + nodelist[i].label + "</button>"
        $("#nodeDiv").append(topnode);
        var connodelist = network.getConnectedNodes(nodelist[i].id);
        var spannode = "";
        for (var j = 0; j < connodelist.length; j++) {
            spannode += "<p style='padding-left:10px;'>" + network.body.data.nodes.get(connodelist[j]).label + "</p>";

        }
        spannode = "<div class='panel'>Connected Nodes : <br /><br />" + spannode + "</div>"
        $("#nodeDiv").append(spannode);
    }
    $("#nodeModal").show();

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

}

//Add fiber//cmode 1-add
function addFiberComponent(cmode, cfrom, cto, clabel, ctext) {
    if (cmode == 1) {

        var nodeDetails = network.body.data.nodes.get(cfrom);

        //Transeiver and Roadm rule - restrict to add fiber between transeiver and roadm
        var toNodeDetails = network.body.data.nodes.get(cto);
        if ((nodeDetails.node_type == roadmJSON.node_type && toNodeDetails.node_type == transceiverJSON.node_type) || (nodeDetails.node_type == transceiverJSON.node_type && toNodeDetails.node_type == roadmJSON.node_type)) {
            alert("Can not add " + dualFiberJSON.component_type + " from " + nodeDetails.node_type + " " + roadmJSON.component_type + " : " + nodeDetails.label + " ,to " + toNodeDetails.node_type + " " + roadmJSON.component_type + " : " + toNodeDetails.label);
            return;
        }
        //end

        var fiberID = token();
        data.nodes.off("*", change_history_back);
        data.edges.off("*", change_history_back);
        if (nodeDetails.node_type == roadmJSON.node_type) {
            arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
            var roadm_label = ctext;
            var roadm_config = configData.node[nodeDetails.node_type].default;
            var roadm_type = roadm_config.roadm_type;
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
                id: cfrom, roadm_type_pro: arrRoadmTypePro
            });
        }

        //amplifier and attenuator fiber connection conditions - max limit 2
        if (nodeDetails.node_type == fusedJSON.node_type || nodeDetails.node_type == ILAJSON.node_type || toNodeDetails.node_type == fusedJSON.node_type || toNodeDetails.node_type == ILAJSON.node_type) {
            var connectedEdges = network.getConnectedEdges(cfrom);
            var fromCount = network.getConnectedEdges(cfrom).length;
            var toCount = network.getConnectedEdges(cto).length;
            //$.each(connectedEdges, function (index, item) {
            //    var fiber = network.body.data.edges.get(item);
            //    if (fiber.from == cfrom)
            //        fromCount++;
            //    if (fiber.to == cfrom)
            //        toCount++;
            //});

            var fromDegree = configData.node[nodeDetails.node_type].default.node_degree;
            var toDegree = configData.node[toNodeDetails.node_type].default.node_degree;
            var msg = "";
            var isLimit = false;
            if (fromCount >= fromDegree) {
                isLimit = true;
                if (nodeDetails.node_type == fusedJSON.node_type) {
                    msg = 'Attenuator ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' can not have more than ' + fromDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    //alert('Attenuator ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' can not have more than ' + fromDegree+' '+dualFiberJSON.component_type+' connection');
                }
                else if (nodeDetails.node_type == ILAJSON.node_type) {
                    msg = nodeDetails.amp_category + ' ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' can not have more than ' + fromDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    //alert(nodeDetails.amp_category + ' ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' can not have more than ' + fromDegree+' ' + dualFiberJSON.component_type +' connection');
                }

            }
            if (toCount >= toDegree) {
                if (isLimit)
                    msg += " and ";
                isLimit = true;
                if (toNodeDetails.node_type == fusedJSON.node_type) {
                    msg += 'Attenuator ' + roadmJSON.component_type + ' : ' + toNodeDetails.label + ' can not have more than ' + toDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    //alert('Attenuator ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' can not have more than ' + toDegree+' '+dualFiberJSON.component_type+' connection');
                }
                else if (toNodeDetails.node_type == ILAJSON.node_type) {
                    msg += toNodeDetails.amp_category + ' ' + roadmJSON.component_type + ' : ' + toNodeDetails.label + ' can not have more than ' + toDegree + ' ' + dualFiberJSON.component_type + ' connection';
                    //alert(nodeDetails.amp_category + ' ' + roadmJSON.component_type + ' : ' + nodeDetails.label + ' can not have more than ' + toDegree+' ' + dualFiberJSON.component_type +' connection');
                }
            }
            if (isLimit) {
                alert(msg);
                return;
            }
        }

        //end

        data.nodes.on("*", change_history_back);
        data.edges.on("*", change_history_back);
        var fiberSmooth = multipleFiberService1(cfrom, cto);
        if (!fiberSmooth)
            fiberSmooth = fiberJSON.options.smooth;
        if (isDualFiberMode == 1) {
            var fiber_config = configData[dualFiberJSON.fiber_category.replace(' ', '')].default;
            clabel = countFiberService(true, false, false, false, cfrom, cto) + '-' + clabel;
            network.body.data.edges.add({
                id: fiberID, from: cfrom, to: cto, label: clabel, text: clabel, dashes: dualFiberJSON.dashes, fiber_category: dualFiberJSON.fiber_category,
                component_type: dualFiberJSON.component_type, color: dualFiberJSON.options.color, background: dualFiberJSON.options.background,
                arrows: dualFiberJSON.options.arrows, font: dualFiberJSON.options.font, smooth: fiberSmooth,
                width: dualFiberJSON.width,
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
            var fiber_config = configData[singleFiberJSON.fiber_category.replace(' ', '')].default;
            clabel = countFiberService(false, true, false, false, cfrom, cto) + '-' + clabel;
            network.body.data.edges.add({
                id: fiberID, from: cfrom, to: cto, label: clabel, text: clabel, dashes: singleFiberJSON.dashes, fiber_category: singleFiberJSON.fiber_category,
                component_type: singleFiberJSON.component_type, color: singleFiberJSON.options.color, width: singleFiberJSON.width,
                background: singleFiberJSON.options.background, arrows: singleFiberJSON.options.arrows,
                font: singleFiberJSON.options.font, smooth: fiberSmooth,
                fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
                loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,
            });
        }

        data.nodes.off("*", change_history_back);
        data.edges.off("*", change_history_back);
        multipleFiberService(cfrom, cto);
        data.nodes.on("*", change_history_back);
        data.edges.on("*", change_history_back);
    }
}

function multipleFiberService1(cfrom, cto) {

    //if (network.getConnectedEdges(cfrom).length > 0)
    //    connectedFiber.push(network.getConnectedEdges(cfrom));
    //if (network.getConnectedEdges(cto).length > 0)
    //    connectedFiber.push(network.getConnectedEdges(cto));

    var connectedFiber = network.getConnectedEdges(cfrom);
    //connectedFiber.push(network.getConnectedEdges(cto));
    //var desFibers = network.getConnectedEdges(cto);
    //$.each(desFibers, function (index, item) {
    //    connectedFiber.push(item);
    //});

    var fromFiberCount = 0;
    var toFiberCount = 0;
    var fiberCount = 0;

    var fiberSmooth;
    $.each(connectedFiber, function (index, item) {
        var fiberDetails = network.body.data.edges.get(item);
        if (fiberDetails.fiber_category == dualFiberJSON.fiber_category || fiberDetails.fiber_category == singleFiberJSON.fiber_category || fiberDetails.component_type == serviceJSON.component_type || fiberDetails.component_type == patchJSON.component_type) {
            fiberSmooth = singleFiberJSON.options.smooth;
            //debugger;
            if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                fiberCount++;
                if (fiberCount == 1) {
                    //if (fiberDetails.from == cto && fiberDetails.to == cfrom)
                    //{
                    fiberSmooth.roundness = "0." + fiberCount;
                    //}
                    //else
                    //    fiberSmooth = fiberJSON.options.smooth;
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
        if (fiberDetails.fiber_category == dualFiberJSON.fiber_category || fiberDetails.fiber_category == singleFiberJSON.fiber_category || fiberDetails.component_type == serviceJSON.component_type || fiberDetails.component_type == patchJSON.component_type) {
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
            if (fiberDetails.component_type == patchJSON.component_type) {
                if (fiberDetails.from == cfrom && fiberDetails.to == cto) {
                    conCount++;
                }
            }
        }
    });
    return conCount;
}

//Add service//cmode 1-add
function addServiceComponent(cmode, cfrom, cto, clabel) {

    if (cmode == 1) {

        
        clabel = countFiberService(false, false, true, false, cfrom, cto) + '-' + clabel;
        var fiberSmooth = multipleFiberService1(cfrom, cto);
        if (!fiberSmooth)
            fiberSmooth = fiberJSON.options.smooth;
        network.body.data.edges.add({
            id: token(), from: cfrom, to: cto, label: clabel, text: clabel, dashes: serviceJSON.dashes, width: serviceJSON.width,
            component_type: serviceJSON.component_type, color: serviceJSON.options.color, background: serviceJSON.options.background,
            arrows: serviceJSON.options.arrows, font: serviceJSON.options.font, smooth: fiberSmooth,
            band_width: configData[serviceJSON.component_type].default.band_width
        });
        data.nodes.off("*", change_history_back);
        data.edges.off("*", change_history_back);
        multipleFiberService(cfrom, cto);
        data.nodes.on("*", change_history_back);
        data.edges.on("*", change_history_back);

    }
}

//Add service//cmode 1-add
function addPatchComponent(cmode, cfrom, cto, clabel,isImport) {

    if (cmode == 1) {

        //we can not add more than 1 patch
        isPatchAdded = false;
        var connectedFiber = network.getConnectedEdges(cfrom);
        connectedFiber.push(network.getConnectedEdges(cto));
        $.each(connectedFiber, function (index, item) {
            var fiberDetails = network.body.data.edges.get(item);
            if (fiberDetails.component_type == patchJSON.component_type) {
                if ((fiberDetails.from == cfrom && fiberDetails.to == cto) || (fiberDetails.from == cto && fiberDetails.to == cfrom)) {
                    isPatchAdded = true;
                    return true;
                }
            }
        });

        if (isPatchAdded && !isImport) {
            alert('we can not add more than 1 ' + patchJSON.component_type);
            return;
        }
        //end


        clabel = countFiberService(false, false, false, true, cfrom, cto) + '-' + clabel;
        network.body.data.edges.add({
            id: token(), from: cfrom, to: cto, label: clabel, text: clabel, dashes: patchJSON.dashes, width: patchJSON.width,
            component_type: patchJSON.component_type, color: patchJSON.options.color, background: patchJSON.options.background,
            arrows: patchJSON.options.arrows, font: patchJSON.options.font, smooth: patchJSON.options.smooth
        });
        //multipleFiberService(cfrom, cto);
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

//Add node nodeMode - 1-roadm, 2-ILA, 3=fused/attenuator, 4-transceiver,5-amplifier
function addNodes(data, callback) {

    var nodeDetails = "";
    var nodeShape = "";
    var nodeColor = "";
    var nodeFont = "";
    if (nodeMode == 1) {
        nodeDetails = configData.node[roadmJSON.node_type];
        data.image = DIR + roadmJSON.image;
        nodeFont = roadmJSON.font;

    }
    else if (nodeMode == 2 || nodeMode == 3 || nodeMode == 4 || nodeMode == 5) {
        if (nodeMode == 2) {
            nodeDetails = configData.node[ILAJSON.amp_category];
            nodeShape = ILAJSON.shape;
            nodeColor = ILAJSON.color;
            nodeFont = ILAJSON.font;
            data.image = DIR + ILAJSON.image;
            data.pre_amp_type = nodeDetails.default.pre_amp_type;
            data.booster_type = nodeDetails.default.booster_type;
            data.amp_category = nodeDetails.default.amp_category;
        }
        else if (nodeMode == 3) {
            nodeDetails = configData.node[fusedJSON.node_type];
            nodeShape = fusedJSON.shape;
            nodeColor = fusedJSON.color;
            nodeFont = fusedJSON.font;
            data.image = DIR + fusedJSON.image;
        }
        else if (nodeMode == 4) {
            nodeDetails = configData.node[transceiverJSON.node_type];
            nodeShape = transceiverJSON.shape;
            nodeColor = transceiverJSON.color;
            nodeFont = transceiverJSON.font;
            data.image = DIR + transceiverJSON.image;
            data.transceiver_type = nodeDetails.default.transceiver_type;
        }
        else if (nodeMode == 5) {
            nodeDetails = configData.node[amplifierJSON.amp_category];
            nodeShape = amplifierJSON.shape;
            nodeColor = amplifierJSON.color;
            nodeFont = amplifierJSON.font;
            data.image = DIR + amplifierJSON.image;
            data.amp_type = nodeDetails.default.amp_type;
            data.amp_category = nodeDetails.default.amp_category;
        }

        data.shape = nodeShape;
        data.color = nodeColor;

    }
    else
        return;


    var nodelength = nodeName(nodeDetails.default.node_type);
    var nodeLabel = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();

    if (nodeMode == 4) {
        nodeLabel = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();
    }

    data.font = nodeFont;
    data.id = token();
    data.number = nodelength;
    data.label = nodeLabel;
    //data.id = nodeLable;
    data.node_type = nodeDetails.default.node_type;
    data.node_degree = nodeDetails.default.node_degree;
    data.component_type = roadmJSON.component_type;
    callback(data);

    if (nodeMode == 1 || nodeMode == 2 || nodeMode == 3 || nodeMode == 4 || nodeMode == 5)
        network.addNodeMode();


}

var nofNode = 1;
function dualFiberInsertNode(fiberID, node_type, callback) {
    //var fiberDetails = edges.get(fiberID);
    //var fromNode = network.body.nodes[fiberDetails.from];
    //var toNode = network.body.nodes[fiberDetails.to];

    //var length = 1 + nofNode;

    //var newX = (toNode.x - fromNode.x) / length;
    //var newY = (toNode.y - fromNode.y) / length;

    //for (var i = 1; i < length; i++) {
    //    var xx = fromNode.x + (newX * i);
    //    var yy = fromNode.y + (newY * i);
    //    network.body.data.nodes.add({
    //        id: token(), label: 'site '+i, x:xx , y:yy , shape: 'dot',node_type:roadmJSON.node_type
    //    });
    //}

    
    var fiberDetails = network.body.data.edges.get(fiberID);
    var fromNode = network.body.nodes[fiberDetails.from];
    var toNode = network.body.nodes[fiberDetails.to];


    var newX = (fromNode.x + toNode.x) / 2;
    var newY = network.body.edges[fiberID].labelModule.size.yLine;
    insertNodeX = newX;
    insertNodeY = newY;

    var nodeID = token();
    nodeDetails = configData.node[node_type];

    var nodelength = nodeName(node_type);
    var nodeLabel = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();

    var fiberStyle = network.body.data.edges.get(fiberID);
    var smooth = fiberStyle.smooth;
    var fiberDetails = network.body.data.edges.get(fiberID);

    data.nodes.on("*", change_history_back);
    data.edges.on("*", change_history_back);
    
    
    if (node_type == roadmJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + roadmJSON.image, number: nodelength,
            shape: roadmJSON.shape, color: roadmJSON.color, font: roadmJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: roadmJSON.component_type,
        });
    }
    else if (node_type == fusedJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + fusedJSON.image, number: nodelength,
            shape: fusedJSON.shape, color: fusedJSON.color, font: fusedJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: fusedJSON.component_type,
        });
    }
    else if (node_type == transceiverJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + transceiverJSON.image, number: nodelength,
            shape: transceiverJSON.shape, color: transceiverJSON.color, font: transceiverJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: transceiverJSON.component_type,
            transceiver_type: nodeDetails.transceiver_type
        });
    }
    else if (node_type == ILAJSON.amp_category) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + ILAJSON.image, number: nodelength,
            shape: ILAJSON.shape, color: ILAJSON.color, font: ILAJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: ILAJSON.component_type,
            pre_amp_type: nodeDetails.default.pre_amp_type, booster_type: nodeDetails.default.booster_type, amp_category: nodeDetails.default.amp_category
        });
    }
    data.nodes.off("*", change_history_back);
    data.edges.off("*", change_history_back);

    network.body.data.edges.remove(fiberID);

    //network.body.data.edges.add({
    //    id: token(), from: fiberDetails.fromId, to: nodeID, label: fiberDetails.label,smooth:smooth
    //});

    //network.body.data.edges.add({
    //    id: token(), from: nodeID, to: fiberDetails.toId, label: fiberDetails.label, smooth: smooth
    //});

    var labelvalue = dualFiberJSON.component_type + " " + network.body.data.nodes.get(fiberDetails.from).number + ' - ' + network.body.data.nodes.get(nodeID).number;
    //var textvalue = roadmJSON.node_type + "- [ " + network.body.data.nodes.get(fiberDetails.from).label + ' - ' + network.body.data.nodes.get(nodeID).label + " ]";
    labelvalue = countFiberService(true, false, false, false, fiberDetails.from, nodeID) + '-' + labelvalue;
    network.body.data.edges.add({
        id: fiberID, from: fiberDetails.from, to: nodeID, label: labelvalue, text: labelvalue, dashes: dualFiberJSON.dashes, fiber_category: dualFiberJSON.fiber_category,
        component_type: dualFiberJSON.component_type, color: dualFiberJSON.options.color, background: dualFiberJSON.options.background,
        arrows: dualFiberJSON.options.arrows, font: dualFiberJSON.options.font, smooth: smooth,
        width: dualFiberJSON.width,
        fiber_type: fiberDetails.fiber_type, span_length: fiberDetails.span_length,
        loss_coefficient: fiberDetails.loss_coefficient, connector_in: fiberDetails.connector_in, connector_out: fiberDetails.connector_out, span_loss: fiberDetails.span_loss,
        RxToTxFiber: {
            from: nodeID, to: fiberDetails.from, fiber_category: fiberDetails.fiber_category, component_type: fiberDetails.component_type,
            label: labelvalue, fiber_type: fiberDetails.RxToTxFiber.fiber_type, span_length: fiberDetails.RxToTxFiber.span_length,
            loss_coefficient: fiberDetails.RxToTxFiber.loss_coefficient, connector_in: fiberDetails.RxToTxFiber.connector_in, connector_out: fiberDetails.RxToTxFiber.connector_out, span_loss: fiberDetails.RxToTxFiber.span_loss,
        }

    });

    var newFiberID = token();

    labelvalue = dualFiberJSON.component_type + " " + network.body.data.nodes.get(nodeID).number + ' - ' + network.body.data.nodes.get(fiberDetails.to).number;
    //textvalue = roadmJSON.node_type + "- [ " + network.body.data.nodes.get(nodeID).label + ' - ' + network.body.data.nodes.get(fiberDetails.to).label + " ]";
    labelvalue = countFiberService(true, false, false, false, nodeID, fiberDetails.to) + '-' + labelvalue;
   
    var fiber_config = configData[dualFiberJSON.fiber_category.replace(' ', '')].default;
    network.body.data.edges.add({
        id: newFiberID, from: nodeID, to: fiberDetails.to, label: labelvalue, text: labelvalue, dashes: dualFiberJSON.dashes, fiber_category: dualFiberJSON.fiber_category,
        component_type: dualFiberJSON.component_type, color: dualFiberJSON.options.color, background: dualFiberJSON.options.background,
        arrows: dualFiberJSON.options.arrows, font: dualFiberJSON.options.font, smooth: smooth,
        width: dualFiberJSON.width,
        fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
        loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,

        RxToTxFiber: {
            from: fiberDetails.to, to: nodeID, fiber_category: fiberDetails.fiber_category, component_type: fiberDetails.component_type,
            label: labelvalue,
            fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
            loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,
        }

    });

    if (node_type == roadmJSON.node_type) {
        var textvalue = roadmJSON.node_type + "- [ " + nodeLabel + ' - ' + network.body.data.nodes.get(fiberDetails.to).label + " ]";
        arrRoadmTypePro = [];
        var roadm_label = textvalue;
        var roadm_config = configData.node[node_type].default;
        var roadm_type = roadm_config.roadm_type;
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
    document.getElementById("dualFiberMenu").style.display = "none";
    data.nodes.on("*", change_history_back);
    data.edges.on("*", change_history_back);
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

    var nodelength = nodeName(node_type);
    var nodeLabel = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();

    var fiberStyle = network.body.data.edges.get(fiberID);
    var smooth = fiberStyle.smooth;
    var fiberDetails = network.body.data.edges.get(fiberID);

    data.nodes.on("*", change_history_back);
    data.edges.on("*", change_history_back);

    if (node_type == roadmJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + roadmJSON.image, number: nodelength,
            shape: roadmJSON.shape, color: roadmJSON.color, font: roadmJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: roadmJSON.component_type,
        });
    }
    else if (node_type == fusedJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + fusedJSON.image, number: nodelength,
            shape: fusedJSON.shape, color: fusedJSON.color, font: fusedJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: fusedJSON.component_type,
        });
    }
    else if (node_type == transceiverJSON.node_type) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + transceiverJSON.image, number: nodelength,
            shape: transceiverJSON.shape, color: transceiverJSON.color, font: transceiverJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: transceiverJSON.component_type,
            transceiver_type: nodeDetails.transceiver_type
        });
    }
    else if (node_type == amplifierJSON.amp_category) {
        network.body.data.nodes.add({
            id: nodeID, label: nodeLabel, x: insertNodeX, y: insertNodeY, image: DIR + amplifierJSON.image, number: nodelength,
            shape: amplifierJSON.shape, color: amplifierJSON.color, font: amplifierJSON.font,
            node_type: nodeDetails.default.node_type, node_degree: nodeDetails.default.node_degree, component_type: amplifierJSON.component_type,
            pre_amp_type: nodeDetails.default.pre_amp_type, booster_type: nodeDetails.default.booster_type, amp_category: nodeDetails.default.amp_category
        });
    }

    data.nodes.off("*", change_history_back);
    data.edges.off("*", change_history_back);

    

    //network.body.data.edges.add({
    //    id: token(), from: fiberDetails.fromId, to: nodeID, label: fiberDetails.label,smooth:smooth
    //});

    //network.body.data.edges.add({
    //    id: token(), from: nodeID, to: fiberDetails.toId, label: fiberDetails.label, smooth: smooth
    //});

    network.body.data.edges.remove(fiberID);

    var labelvalue = dualFiberJSON.component_type + " " + network.body.data.nodes.get(fiberDetails.from).number + ' - ' + network.body.data.nodes.get(nodeID).number;
    //var textvalue = roadmJSON.node_type + "- [ " + network.body.data.nodes.get(fiberDetails.from).label + ' - ' + network.body.data.nodes.get(nodeID).label + " ]";

    labelvalue = countFiberService(false, true, false, false, fiberDetails.from, nodeID) + '-' + labelvalue;

    network.body.data.edges.add({
        id: fiberID, from: fiberDetails.from, to: nodeID, label: labelvalue, text: labelvalue, dashes: singleFiberJSON.dashes, fiber_category: singleFiberJSON.fiber_category,
        component_type: singleFiberJSON.component_type, color: singleFiberJSON.options.color, background: singleFiberJSON.options.background,
        arrows: singleFiberJSON.options.arrows, font: singleFiberJSON.options.font, smooth: smooth,
        width: singleFiberJSON.width,
        fiber_type: fiberDetails.fiber_type, span_length: fiberDetails.span_length,
        loss_coefficient: fiberDetails.loss_coefficient, connector_in: fiberDetails.connector_in, connector_out: fiberDetails.connector_out, span_loss: fiberDetails.span_loss,

    });

    var newFiberID = token();
    labelvalue = dualFiberJSON.component_type + " " + network.body.data.nodes.get(nodeID).number + ' - ' + network.body.data.nodes.get(fiberDetails.to).number;
    //textvalue = roadmJSON.node_type + "- [ " + network.body.data.nodes.get(nodeID).label + ' - ' + network.body.data.nodes.get(fiberDetails.to).label + " ]";
    labelvalue = countFiberService(false, true, false, false, nodeID, fiberDetails.to) + '-' + labelvalue;

    var fiber_config = configData[singleFiberJSON.fiber_category.replace(' ', '')].default;
    network.body.data.edges.add({
        id: newFiberID, from: nodeID, to: fiberDetails.to, label: labelvalue, text: labelvalue, dashes: singleFiberJSON.dashes, fiber_category: singleFiberJSON.fiber_category,
        component_type: singleFiberJSON.component_type, color: singleFiberJSON.options.color, background: singleFiberJSON.options.background,
        arrows: singleFiberJSON.options.arrows, font: singleFiberJSON.options.font, smooth: smooth,
        width: singleFiberJSON.width,
        fiber_type: fiber_config.fiber_type, span_length: fiber_config.Span_length,
        loss_coefficient: fiber_config.Loss_coefficient, connector_in: fiber_config.Connector_in, connector_out: fiber_config.Connector_out, span_loss: fiber_config.Span_loss,
    });

    if (node_type == roadmJSON.node_type) {
        var textvalue = roadmJSON.node_type + "- [ " + nodeLabel + ' - ' + network.body.data.nodes.get(fiberDetails.to).label + " ]";
        arrRoadmTypePro = [];
        var roadm_label = textvalue;
        var roadm_config = configData.node[node_type].default;
        var roadm_type = roadm_config.roadm_type;
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
    document.getElementById("singleFiberMenu").style.display = "none";
    data.nodes.on("*", change_history_back);
    data.edges.on("*", change_history_back);
}

//start -- component edit, update, remove, clear
function roadmEdit(nodeID, callback) {
    _roadmListDB().remove();
    document.getElementById("roadmMenu").style.display = "none";
    openDrawer('roadm');
    var nodeDetails = network.body.data.nodes.get(nodeID);
    $("#txtRoadmName").val(nodeDetails.label);
    $("#divRoadmPro").hide();
    $("#divRoadmPro").empty();
    if (nodeDetails.node_type == roadmJSON.node_type) {
        arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
        _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));
        var connectedFiber = network.getConnectedEdges(nodeID);

        $.each(connectedFiber, function (index, item) {
            if (network.body.data.edges.get(item).component_type == dualFiberJSON.component_type)
                loadRoadmType(item, nodeID, nodeDetails.node_type);
        });
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

    var id = nodeID;
    var label = $("#txtRoadmName").val().trim();
    var node_type = network.body.data.nodes.get(nodeID).node_type

    if (nameLengthValidation("txtRoadmName")) {

        var roadmtypeprodata = _roadmListDB().get();
        if (node_type == roadmJSON.node_type) {

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
            clearRoadm();
        }

    }

}
function clearRoadm() {
    $("#txtRoadmName").val('');
    $("#divRoadmPro").empty();
    closeDrawer('roadm');
    network.unselectAll();
    _roadmListDB().remove();
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
            clearAttenuator();
        }


    }

}
function clearAttenuator() {
    $("#txtAttenuatorName").val('');
    closeDrawer('attenuator');
    network.unselectAll();
}

function ILAEdit(nodeID, callback) {
    document.getElementById("ILAMenu").style.display = "none";
    openDrawer('ILA');
    var nodeDetails = network.body.data.nodes.get(nodeID);
    $("#txtILAName").val(nodeDetails.label);
    $("#ddlPreAmpType").val(nodeDetails.pre_amp_type);
    $("#ddlBoosterType").val(nodeDetails.booster_type);

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
    var node_type = network.body.data.nodes.get(nodeID).node_type

    if (nameLengthValidation("txtILAName")) {

        if (node_type == ILAJSON.node_type) {
            network.body.data.nodes.update({
                id: id, label: label, pre_amp_type: $("#ddlPreAmpType").val(), booster_type: $("#ddlBoosterType").val(),
            });
            clearILA();
        }


    }

}
function clearILA() {
    $("#txtILAName").val('');
    $("#ddlPreAmpType").val('');
    $("#ddlBoosterType").val('');
    closeDrawer('ILA');
    network.unselectAll();
}

function amplifierEdit(nodeID, callback) {
    document.getElementById("amplifierMenu").style.display = "none";
    openDrawer('amplifier');
    var nodeDetails = network.body.data.nodes.get(nodeID);
    $("#txtAmplifierName").val(nodeDetails.label);
    $("#ddlAmplifierType").val(nodeDetails.amp_type);

    document.getElementById("btnAmplifierUpdate").onclick = updateAmplifier.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseAmplifier").onclick = clearAmplifier.bind(
    );
}
function updateAmplifier(nodeID) {

    var id = nodeID;
    var label = $("#txtAmplifierName").val().trim();
    var amp_category = network.body.data.nodes.get(nodeID).amp_category

    if (nameLengthValidation("txtAmplifierName")) {

        if (amp_category == amplifierJSON.amp_category) {
            network.body.data.nodes.update({
                id: id, label: label, amp_type: $("#ddlAmplifierType").val(),
            });
            clearAmplifier();
        }


    }

}
function clearAmplifier() {
    $("#txtAmplifierName").val('');
    $("#ddlAmplifierType").val('');
    closeDrawer('amplifier');
    network.unselectAll();
}

function transceiverEdit(nodeID, callback) {
    document.getElementById("transceiverMenu").style.display = "none";
    openDrawer('transceiver');
    var nodeDetails = network.body.data.nodes.get(nodeID);
    $("#txtTransceiverName").val(nodeDetails.label);
    $("#ddlTransceiverType").val(nodeDetails.transceiver_type);

    document.getElementById("btnTransceiverUpdate").onclick = updateTransceiver.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseTransceiver").onclick = clearTransceiver.bind(
    );
}
function updateTransceiver(nodeID) {

    var id = nodeID;
    var label = $("#txtTransceiverName").val().trim();
    var node_type = network.body.data.nodes.get(nodeID).node_type

    if (nameLengthValidation("txtTransceiverName")) {

        if (node_type == transceiverJSON.node_type) {
            network.body.data.nodes.update({
                id: id, label: label, transceiver_type: $("#ddlTransceiverType").val()
            });
            clearTransceiver();
        }

    }

}
function clearTransceiver() {
    $("#txtTransceiverName").val('');
    $("#ddlTransceiverType").val('');
    $("#ddlDataRate").val('');
    closeDrawer('transceiver');
    network.unselectAll();
}

function deleteNode(nodeID) {
    var nodeDetails = network.body.data.nodes.get(nodeID);
    var node_type = nodeDetails.node_type;
    if (nodeDetails.node_type == ILAJSON.node_type)
        node_type = nodeDetails.amp_category;
    var isDelete = confirm('do you want to delete ' + node_type + ' : ' + nodeDetails.label + ' ?');
    if (!isDelete)
        return;
    document.getElementById("roadmMenu").style.display = "none";
    document.getElementById("attenuatorMenu").style.display = "none";
    document.getElementById("ILAMenu").style.display = "none";
    document.getElementById("amplifierMenu").style.display = "none";
    document.getElementById("transceiverMenu").style.display = "none";

    if (network.getConnectedEdges(nodeID).length > 0) {
        alert("Unpair " + roadmJSON.component_type + " then delete");

    } else {
        //nodes.remove(nodeID);
        network.body.data.nodes.remove(nodeID);
        $("#stepCreateTopology").click();
    }
    network.unselectAll();
}

function dualFiberEdit(fiberID, callback) {
    document.getElementById("dualFiberMenu").style.display = "none";

    clearCbxandAccordian();
    openDrawer('dualfiber');
    var edgeDetails = network.body.data.edges.get(fiberID);
    var connectedNode = network.getConnectedNodes(fiberID);


    $("#txtFiberName").val(edgeDetails.label);
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

    var spanlen = Number(span_length);
    if (spanlen <= 0) {
        alert(dualFiberJSON.component_type + ' A : please enter valid span length.');
        return;
    }

    var Bspan_length = Number($("#txtFiberBSL").val());

    spanlen = Number(Bspan_length);
    if (spanlen <= 0) {
        alert(dualFiberJSON.component_type + ' B : please enter valid span length.');
        return;
    }

    var fiberDetails = network.body.data.edges.get(fiberID);

    

    if (nameLengthValidation("txtFiberName")) {
        if (fiberDetails.component_type == dualFiberJSON.component_type && fiberDetails.fiber_category == dualFiberJSON.fiber_category) {
            
            network.body.data.edges.update({
                id: id, label: label, text: label, fiber_type: fiber_type, span_length: span_length,
                loss_coefficient: loss_coefficient, connector_in: connector_in, connector_out: connector_out, span_loss: span_loss,
                RxToTxFiber: {
                    from: fiberDetails.to, to: fiberDetails.from, fiber_category: fiberDetails.fiber_category, component_type: fiberDetails.component_type,
                    label: label, text: label, fiber_type: fiber_typeB, span_length: span_lengthB,
                    loss_coefficient: loss_coefficientB, connector_in: connector_inB, connector_out: connector_outB, span_loss: span_lossB,
                }
            });
            data.nodes.off("*", change_history_back);
            data.edges.off("*", change_history_back);
            multipleFiberService(fiberDetails.from, fiberDetails.to);
            data.nodes.on("*", change_history_back);
            data.edges.on("*", change_history_back);
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
    network.unselectAll();
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
    document.getElementById("singleFiberMenu").style.display = "none";
    var edgeDetails = network.body.data.edges.get(fiberID);
    var connectedNode = network.getConnectedNodes(fiberID);
    $("#txtSinlgeFiberName").val(edgeDetails.label);
    $("#txtSource").val(network.body.data.nodes.get(connectedNode[0]).label);
    $("#txtDestination").val(network.body.data.nodes.get(connectedNode[1]).label);
    $("#ddlSingleFiberType").val(edgeDetails.fiber_type);
    $("#txtSpan_Length").val(edgeDetails.span_length);
    $("#txtLoss_Coefficient").val(edgeDetails.loss_coefficient);
    $("#txtConnector_IN").val(edgeDetails.connector_in);
    $("#txtConnector_OUT").val(edgeDetails.connector_out);
    $("#txtSpan_Loss").val(edgeDetails.span_loss);
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

    var id = fiberID;
    var label = $("#txtSinlgeFiberName").val().trim();
    var fiber_type = $("#ddlSingleFiberType").val();
    var span_length = $("#txtSpan_Length").val();
    var loss_coefficient = $("#txtLoss_Coefficient").val();
    var connector_in = $("#txtConnector_IN").val();
    var connector_out = $("#txtConnector_OUT").val();
    var span_loss = $("#txtSpan_Loss").val();

    var spanlen = Number(span_length);
    if (spanlen <= 0) {
        alert('pleae enter valid span length.');
        return;
    }

    var fiberDetails = network.body.data.edges.get(fiberID);

    if (nameLengthValidation("txtSinlgeFiberName")) {

        if (fiberDetails.component_type == singleFiberJSON.component_type && fiberDetails.fiber_category == singleFiberJSON.fiber_category) {
            network.body.data.edges.update({
                id: id, label: label, text: label, fiber_type: fiber_type, span_length: span_length,
                loss_coefficient: loss_coefficient, connector_in: connector_in, connector_out: connector_out, span_loss: span_loss
            });
            data.nodes.off("*", change_history_back);
            data.edges.off("*", change_history_back);
            multipleFiberService(fiberDetails.from, fiberDetails.to);
            data.nodes.on("*", change_history_back);
            data.edges.on("*", change_history_back);
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
    $('#cbxLength_Based_Loss').prop('checked', false);
    closeDrawer('singlefiber');
    network.unselectAll();
}

function deleteFiber(fiberID) {

    var fiber = network.body.data.edges.get(fiberID);

    //if (checkNodeServiceConnection(fiber.from, fiber.to)) {
    //    alert('can not remove ' + fiber.fiber_category + ' : ' + fiber.label);
    //    return;
    //}

    var isDelete = confirm('do you want to delete ' + fiber.fiber_category + ' : ' + fiber.label + ' ?');
    if (!isDelete)
        return;
    document.getElementById("dualFiberMenu").style.display = "none";
    document.getElementById("singleFiberMenu").style.display = "none";

    var nodeDetails = network.body.data.nodes.get(fiber.from);
    arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
    _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));

    _roadmListDB({
        roadm_fiber_id: fiberID
    }).remove();
    arrRoadmTypePro = _roadmListDB().get();
    network.body.data.nodes.update({
        id: nodeDetails.id, roadm_type_pro: arrRoadmTypePro
    });
    network.body.data.edges.remove(fiberID);
    multipleFiberService(fiber.from, fiber.to);
    network.unselectAll();


}

function patchEdit(patchID, callback) {
    document.getElementById("patchMenu").style.display = "none";
    var edgeDetails = network.body.data.edges.get(patchID);
    $("#txtPatchName").val(edgeDetails.label);
    openDrawer('patch');
    document.getElementById("btnUpdatePatch").onclick = updatePatch.bind(
        this,
        patchID,
        callback
    );
    document.getElementById("btnClosePatch").onclick = clearPatch.bind(
    );
}
function updatePatch(patchID) {

    var id = patchID;
    var label = $("#txtPatchName").val().trim();
    var patchDetails = network.body.data.edges.get(patchID);

    if (nameLengthValidation("txtPatchName")) {

        if (patchDetails.component_type == patchJSON.component_type) {
            network.body.data.edges.update({
                id: id, label: label, text: label
            });

            multipleFiberService(patchDetails.from, patchDetails.to);
            clearPatch();
        }

    }

}
function deletePatch(patchID) {
    var isDelete = confirm('do you want to delete ' + network.body.data.edges.get(patchID).component_type + ' : ' + network.body.data.edges.get(patchID).label + ' ?');
    if (!isDelete)
        return;
    document.getElementById("patchMenu").style.display = "none";
    var patchDetails = network.body.data.edges.get(patchID);
    network.body.data.edges.remove(patchID);
    multipleFiberService(patchDetails.from, patchDetails.to);
    network.unselectAll();
}
function clearPatch() {

    $("#txtPatchName").val('');
    closeDrawer('patch');
    network.unselectAll();
}

function serviceEdit(serviceID, callback) {
    document.getElementById("serviceMenu").style.display = "none";
    var edgeDetails = network.body.data.edges.get(serviceID);
    $("#txtServiceName").val(edgeDetails.label);
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
            network.body.data.edges.update({
                id: id, label: label, text: label, band_width: bandwidth
            });
            data.nodes.off("*", change_history_back);
            data.edges.off("*", change_history_back);
            multipleFiberService(serviceDetails.from, serviceDetails.to);
            data.nodes.on("*", change_history_back);
            data.edges.on("*", change_history_back);
            clearService();
        }

    }

}
function deleteService(serviceID) {
    var isDelete = confirm('do you want to delete ' + network.body.data.edges.get(serviceID).component_type + ' : ' + network.body.data.edges.get(serviceID).label + ' ?');
    if (!isDelete)
        return;
    document.getElementById("serviceMenu").style.display = "none";
    var serviceDetails = network.body.data.edges.get(serviceID);
    network.body.data.edges.remove(serviceID);
    multipleFiberService(serviceDetails.from, serviceDetails.to);
    network.unselectAll();
}
function clearService() {

    $("#txtServiceName").val('');
    $("#txtServiceSrc").val('');
    $("#txtServiceDest").val('');
    $("#txtBandwidth").val('');
    $("#ddlCentralFrq").val('');
    closeDrawer('service');
    network.unselectAll();
}

//end -- component edit, update, remove, clear




function closeMenu(menuID) {
    document.getElementById(menuID).style.display = "none";
    network.unselectAll();
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
function appendPreAmpandBoosterType(nodeType, ddlID) {

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
            //preAmpType = item["compatible-preamp"];
            //boosterType = item["compatible-booster"];
            //$.each(preAmpType, function (i, preAmp) {
            //    $(ddlpreamptype).append('<option value="' + preAmp + '">' + preAmp + '</option>');
            //});
            //$.each(boosterType, function (j, boosterAmp) {
            //    $(ddlboostertype).append('<option value="' + boosterAmp + '">' + boosterAmp + '</option>');
            //});
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
        alert('Please create ' + roadmJSON.component_type + '/' + dualFiberJSON.component_type + '/' + serviceJSON.component_type + '.');
    }

    return flag;
}

function loadRoadmType(fiberID, nodeID, node_type) {
    var fiberDetails = network.body.data.edges.get(fiberID);
    var roadmType = "";
    if (fiberDetails.from == nodeID) {
        $("#divRoadmPro").show();
        var connectedNodes = network.getConnectedNodes(fiberID);
        roadmType = node_type + "- [" + network.body.data.nodes.get(connectedNodes[0]).label + ' - ' + network.body.data.nodes.get(connectedNodes[1]).label + ' ]';

        var roadmAccordian = "";
        roadmAccordian = "<div class='accordion-fiber'>";
        roadmAccordian += "<p class='title m-0 f-s-17' id=" + fiberID + ">" + roadmType + "</p>";
        roadmAccordian += "<span class='show-fiber'>+</span>"
        roadmAccordian += "</div>";

        roadmAccordian += "<div class='info-fiber'><div class='panel'>";

        roadmAccordian += generateAccordianEle("ROADM Type", eleroadmtype + fiberID);
        roadmAccordian += generateAccordianEle("Amplifier A", elepreamptype + fiberID);
        roadmAccordian += generateAccordianEle("Amplifier B", eleboostertype + fiberID);

        roadmAccordian += "</div></div>";

        $("#divRoadmPro").append(roadmAccordian);
        accordianFun();
        appendPreAmpandBoosterType(node_type, fiberID)
        getRoadmDetails(fiberID);
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


function getRoadmDetails(fiberID) {
    if (_roadmListDB({ roadm_fiber_id: fiberID }).count() > 0) {
        var roadmDetails = _roadmListDB({ roadm_fiber_id: fiberID }).first();
        var lroadmtype = "#" + eleroadmtype + fiberID;
        var lpreamptype = "#" + elepreamptype + fiberID;
        var lboostertype = "#" + eleboostertype + fiberID;
        $(lroadmtype).val(roadmDetails.roadm_type);
        $(lpreamptype).val(roadmDetails.pre_amp_type);
        $(lboostertype).val(roadmDetails.booster_type);
    }
    else {
        clearRoadm();
    }
}



function change_history_back() {

    history_list_back.unshift({
        nodes_his: data.nodes.get(data.nodes.getIds()),
        edges_his: data.edges.get(data.edges.getIds())
    });

    //reset forward history
    history_list_forward = [];
    // apply css
    css_for_undo_redo_chnage();

}
function redo_css_active() {
    $("#button_undo").css({
        "background-color": "inherit",
        color: "white",
        cursor: "pointer"
    });
};
function undo_css_active() {
    $("#button_redo").css({
        "background-color": "inherit",
        color: "white",
        cursor: "pointer"
    });
};

function redo_css_inactive() {
    $("#button_undo").css({
        "background-color": "inherit",
        color: "#878787",
        cursor: "inherit"
    });
};

function undo_css_inactive() {
    $("#button_redo").css({
        "background-color": "inherit",
        color: "#878787",
        cursor: "inherit"
    });
};

function css_for_undo_redo_chnage() {
    if (history_list_back.length === 1) {
        redo_css_inactive();
    } else {
        redo_css_active();
    };
    if (history_list_forward.length === 0) {
        undo_css_inactive();
    } else {
        undo_css_active();
    };
};
function nodeName(node_type) {
    const number = [];
    $.each(network.body.data.nodes.get(), function (index, item) {

        var splitName = item.label.split(' ');

        var checkNumber = Number(splitName[splitName.length - 1]);
        if (node_type != transceiverJSON.node_type) {
            if (item.node_type != transceiverJSON.node_type) {

                if (checkNumber)
                    number.push(checkNumber);
            }
        }
        else {
            if (item.node_type == transceiverJSON.node_type) {
                if (checkNumber)
                    number.push(checkNumber);
            }

        }
    });


    if (number.length > 0) {
        return number.sort((f, s) => f - s)[number.length - 1] + 1;
    }
    else
        return 1;
}




