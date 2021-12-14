
var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data = getScaleFreeNetwork(0);
var seed = 2;
var previousId = 0;
var currentId = 0;
var _edgesDB = new TAFFY();
var _nodesDB = new TAFFY();
var _edgeDB = new TAFFY();
var _insertnodeDB = new TAFFY();
var container;
var exportArea;
var importButton;
var exportButton;
var dropdownshape;
var isService = 0;
var counter = 0;
var copy;
localStorage.setItem("copyedgeid", "");
localStorage.setItem("copynodeid", "");
localStorage.setItem("deletenodeconectededge", "");
var _import_json;



var optionsJSON = "";
var roadmJSON = "";
var ampJSON = "";
var preAmpJSON = "";
var boosterAmpJSON = "";
var fusedJSON = "";
var transceiverJSON = "";
var dualFiberJSON = "";
var singleFiberJSON = "";
var serviceJSON = "";

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

$(document).ready(function () {

 
    $.getJSON("/Data/StyleData.json", function (data) {
        optionsJSON = data.options;
        roadmJSON = data.Roadm;
        ampJSON = data.Amplifier;
        preAmpJSON = data.PreAmplifier;
        boosterAmpJSON = data.BoosterAmplifier;
        fusedJSON = data.Fused;
        transceiverJSON = data.Transceiver;
        dualFiberJSON = data.DualFiber;
        singleFiberJSON = data.SingleFiber;
        serviceJSON = data.Service;
        styleData = data;
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
        enableDisableNode(1, "Roadm");
    });
    $("#btnAddAmp").click(function () {
        enableDisableNode(2, "amplifier");
    });
    $("#btnPreAmplifier").click(function () {
        enableDisableNode(5, "preamplifier");
    });
    $("#btnBoosterAmplifier").click(function () {
        enableDisableNode(6, "boosteramplifier");
    });
    $("#btnAddFused").click(function () {
        enableDisableNode(3, "fused");
    });
    $("#btnAddTransceiver").click(function () {
        enableDisableNode(4, "transceiver");
    });
    $("#btnAddDualFiber").click(function () {
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
            $("#txtFiberBCD").val($("#txtFiberACD").val());
            $("#txtFiberBPMD").val($("#txtFiberAPMD").val());
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
                    load_EqptConfig();
                }
            });
        }
    });

});
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

var copyData = {
    nodes: [],
    edges: [],
    dataCopied: false
}

document.addEventListener('click', function (event) {
    lastDownTarget = event.target.tagName;
}, false);


document.addEventListener('keydown', function (event) {
    if (lastDownTarget == "CANVAS") {
        if (event.keyCode == 67 && event.ctrlKey) {
            copyData.dataCopied = true;
        }
        if (event.keyCode == 86 && event.ctrlKey) {
            if (copyData.dataCopied)
                getCopiedData();
        }
    }
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

                    _edgesDB.insert(tempData)

                    nodes = getNodeData(tempData.nodes);
                    edges = getEdgeData(tempData.edges);
                    counter = counter + Number(nodes.length);
                    localStorage.setItem("nodelength", counter);
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
                if (nodeMode > 0 && nodeMode < 7) {
                    counter = counter + 1;
                    localStorage.setItem("nodelength", counter);
                    addNodes(data, callback);
                }
            },
        },
    };
    network = new vis.Network(container, data, options);

    network.on("click", function (params) {
        params.event = "[original event]";
        if (this.getNodeAt(params.pointer.DOM)) {

        }
        //else if (this.getEdgeAt(params.pointer.DOM)) {
        //    $("#txtNodeX").val(params.pointer.canvas.x);
        //    $("#txtNodeY").val(params.pointer.canvas.y);
        //}
        //else {
        //    $("#txtNodeX").val(params.pointer.canvas.x);
        //    $("#txtNodeY").val(params.pointer.canvas.y);
        //}
    });
    network.on("selectEdge", function (data) {
        //nodeMode = "";
        if (data.edges.length > 1 || data.edges.length == 0) {
            copyData.edges = [];
            copyData.nodes = [];
            copyData.dataCopied = false;
            return;
        }
        var clickedEdge = this.body.edges[data.edges[0]];
        setCopyData(clickedEdge.options.id, '');
    });
    network.on("selectNode", function (params) {
        //nodeMode = "";
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        var deletenode = network.getConnectedEdges(clickedNode.id);
        localStorage.setItem("deletenodeconectededge", deletenode.length);
        //_nodesDB().remove();
        //_nodesDB.insert({ "id": clickedNode.id, "type": nodes.get(clickedNode.id).node_type });
        setCopyData('', clickedNode.options.id);
        if (isDualFiberMode == 1 || isSingleFiberMode == 1) {
            isAddService = 0;
            addServicData = {
                from: '',
                to: ''
            };
            if (addEdgeData.from == '')
                addEdgeData.from = clickedNode.options.id
            else if (addEdgeData.to == '') {
                if (addEdgeData.from == clickedNode.options.id) {
                    alert('pls click destination source');
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
            addEdgeData = {
                from: '',
                to: ''
            };

            if (addServiceData.from == '')
                addServiceData.from = clickedNode.options.id
            else if (addServiceData.to == '') {
                if (addServiceData.from == clickedNode.options.id) {
                    alert('pls click destination source');
                    return;
                }
                addServiceData.to = clickedNode.options.id
            }

            if (addServiceData.from != '' && addServiceData.to != '')
                addService();

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
        //nodeMode = "";
        //data.preventDefault();

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
            type = nodes.get(nodeData).node_type;
            amp_category = nodes.get(nodeData).amp_category;
        }
        else if (edgeData != '') {
            type = edges.get(edgeData).component_type;
            fiber_category = edges.get(edgeData).fiber_category;
        }
        else {
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
                if (type == roadmJSON.node_type || type == ampJSON.node_type || type == fusedJSON.node_type || type == transceiverJSON.node_type)//node || amp ||fused||transceiver
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
                        }
                        else if (type == ampJSON.node_type) {
                            if (amp_category == ampJSON.amp_category) {
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
                            }
                            else if (amp_category == preAmpJSON.amp_category) {
                                showContextMenu(data.event.pageX, data.event.pageY, "preAmpMenu");
                                document.getElementById("rcPreAmpEdit").onclick = preAmpEdit.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcPreAmpDelete").onclick = deleteNode.bind(
                                    this,
                                    nodeData,
                                    callback
                                );
                            }
                            else if (amp_category == boosterAmpJSON.amp_category) {
                                showContextMenu(data.event.pageX, data.event.pageY, "boosterAmpMenu");
                                document.getElementById("rcBoosterAmpEdit").onclick = boosterAmpEdit.bind(
                                    this,
                                    nodeData,
                                    callback

                                );
                                document.getElementById("rcBoosterAmpDelete").onclick = deleteNode.bind(
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
                        }
                    }
                }
                else if (type == dualFiberJSON.component_type) {

                    if (edgeData != undefined) {
                        if (fiber_category == dualFiberJSON.fiber_category) {
                            showContextMenu(data.event.pageX, data.event.pageY, "dualFiberMenu");
                            document.getElementById("rcDualInsertNode").addEventListener('click', function () {
                                AddData(this, 0);
                            });
                            document.getElementById("rcDualCopy").onclick = copy.bind();
                            //document.getElementById("rcPaste").onclick = paste.bind();
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
                            showContextMenu(data.event.pageX, data.event.pageY, "singleFiberMenu");
                            document.getElementById("rcSingleInsertNode").addEventListener('click', function () {
                                AddData(this, 0);
                            });
                            document.getElementById("rcSingleCopy").onclick = copy.bind();
                            //document.getElementById("rcPaste").onclick = paste.bind();
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
            }
        }
        if (copy == "Yes") {
            document.getElementById("contextMenu").style.display = "none";
            $("#pastecontextMenu").css({ left: (data.event.pageX + 20) + "px", top: (data.event.pageY + 20) + "px" });
            document.getElementById("pastecontextMenu").style.display = "block";


            document.getElementById("Paste").onclick = paste.bind();
        }
        _nodesDB().remove();
    });


    network.on("hoverNode", function (params) {
        try {
            var clickedNode = nodes.get(params.node);
            var fromlabel = clickedNode.label;
            $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY - 40) + "px" });
            $('#click').html(htmlTitle("label : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
            $('#click').show();
        }
        catch (e) { }
    });
    network.on("blurNode", function (params) {
        $('#click').hide();
    });
    network.on("hoverEdge", function (params) {
        try {
            var clickedNode = edges.get(params.edge);
            var fromlabel = "(" + nodes.get(clickedNode.from).label + " -> " + nodes.get(clickedNode.to).label + ")";
            $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY - 40) + "px" });
            $('#click').html(htmlTitle("dir : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
            $('#click').show();
        }
        catch (e) { }
    });
    network.on("blurEdge", function (params) {
        //console.log("blurEdge Event:", params);
        $('#click').hide();
    });
}

//1-roadm, 2-amp, 3-fused, 4-transceiver
function AddNodeMode(nodemode) {

    nodeMode = nodemode;
    if (nodeMode) {
        if (nodeMode > 0 && nodeMode < 7)
            network.addNodeMode();
    }
}

function htmlTitle(html, backcolor) {
    const container = document.createElement("pre");
    container.innerHTML = html;
    container.style.background = backcolor;
    container.style.color = "black";
    container.style.transition = "all 1s ease-in-out";
    return container;
}
//insert node middle
function AddNode(id) {
    var test;
    var edgeLen;
    var subLen;
    var insertEdgeLabel;
    //var from_id = document.getElementById("node-id").value;
    //test = network.getConnectedEdges(from_id);
    var shape = document.getElementById("ddlinsertnodeshape").value;
    var insetnode = _insertnodeDB().first();
    var myNode = network.getConnectedNodes(insetnode.id);
    to_id = myNode[1];
    from_id = myNode[0];
    var edgelabel = edges.get(insetnode.id).label;
    //if (myNode.length > 1) {
    //    to_id = document.getElementById("nodeid").value;
    //    var test1 = network.getConnectedEdges(to_id);
    //    var edgedata = "";
    //    var result = false;
    //    for (var i = 0; i < test.length; i++) {
    //        if (result == false) {
    //            for (var j = 0; j < test.length; j++) {
    //                if (test[i] == test1[j]) {
    //                    edgedata = test1[j];
    //                    result = true;
    //                }
    //            }
    //        }

    //    }


    //}
    //else {
    //    $("#trId").hide();
    //    to_id = myNode[0];
    //}


    var len = network.body.data.nodes.length;
    var randomid = Number(len) + 1;
    //var counter = 0;
    counter = counter + 1;
    localStorage.setItem("nodelength", counter);
    var nodelength = localStorage.getItem("nodelength");
    var dynamicToken = token();
    if (id == 0) {
        if (shape == "triangle") {
            dynamicToken
            network.body.data.nodes.add({
                id: dynamicToken,
                label: "site " + '' + Number(nodelength) + '',
                x: $("#txtNodeX").val(),
                y: $("#txtNodeY").val(),
                //shape: $("#ddlShape").val(),
                shape: shape,
                //shape: "diamond",
                size: 8,
                color: "red",
                nodedegree: "5",
                nodetype: "ROADM",
                //color: $("#txtNodeBGColor").val(),
                componentType: "Amplifier"
            });
        } else {
            network.body.data.nodes.add({
                id: dynamicToken,
                label: "site " + '' + Number(nodelength) + '',
                x: $("#txtNodeX").val(),
                y: $("#txtNodeY").val(),
                //shape: $("#ddlShape").val(),
                shape: shape,
                //shape: "diamond",
                size: 8,
                nodedegree: "5",
                nodetype: "ROADM",
                //color: $("#txtNodeBGColor").val(),
                componentType: "node"
            });
        }

    }
    else if (id == 1) {
        network.body.data.nodes.add({
            id: dynamicToken,
            label: '' + randomid + '',
            //shape: "icon",
            //icon: {
            //    face: "'FontAwesome'",
            //    code: "\uf067",
            //    size: 15,
            //    color: "black",
            //},
            size: 8,
            x: $("#txtNodeX").val(),
            y: $("#txtNodeY").val(),
            componentType: "node"
        });
    }
    else {
        network.body.data.nodes.add({
            id: dynamicToken,
            label: '' + randomid + '',
            shape: shape,
            //shape: "diamond",
            size: 8,
            color: "red",
            x: $("#txtNodeX").val(),
            y: $("#txtNodeY").val(),
            componentType: "node"
        });
    }


    //edgeLen = document.getElementById("edgeLen").value;
    //insertEdgeLabel = document.getElementById("InsertEdgeLabel").value;
    //var taffyLen;

    //taffyLen = _edgesDB({ from: from_id.toString(), to: to_id.toString() }).first();



    //if (taffyLen == false) {
    //    taffyLen = _edgesDB({ from: to_id.toString(), to: from_id.toString() }).first();
    //}

    //if (Number(edgeLen) < Number(taffyLen.edgeLength)) {
    //    subLen = Number(taffyLen.edgeLength) - Number(edgeLen);
    //}
    //else if (Number(edgeLen) > Number(taffyLen.edgeLength)) {
    //    network.body.data.nodes.remove(randomid);
    //    alert('Given length is exceeded in total length.');
    //    document.getElementById("node-popUp").style.display = "none";
    //    return false;
    //}
    //else if (Number(edgeLen) == Number(taffyLen.edgeLength)) {
    //    network.body.data.nodes.remove(randomid);
    //    alert('Given length is equal to total length.');
    //    document.getElementById("node-popUp").style.display = "none";
    //    return false;
    //}
    //else {
    //    subLen = 0;
    //}

    //if (edgedata != "" && edgedata != undefined) {
    //    network.body.data.edges.remove(edgedata);
    //}
    //else {
    //    network.body.data.edges.remove(test[0]);
    //}


    network.body.data.edges.remove(insetnode.id);
    network.body.data.edges.add([{ from: dynamicToken, to: from_id, font: fontstyle1, componentType: "fiber", label: edgelabel, color: "blue" }])
    network.body.data.edges.add([{ from: dynamicToken, to: to_id, font: fontstyle1, componentType: "fiber", label: edgelabel, color: "blue" }])

    //network.body.data.edges.add([{ from: randomid, to: from_id, length: edgeLen, label: edgeLen, color: "" }])
    //network.body.data.edges.add([{ from: randomid, to: to_id, length: subLen, label: subLen.toString(), color: "" }])
    _edgesDB.insert({ "from": dynamicToken, "to": from_id })
    _edgesDB.insert({ "from": dynamicToken, "to": to_id })
    _insertnodeDB().remove();
    document.getElementById("node-popUp").style.display = "none";

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

//-----------------------Json File---------------------

function testing() {
    container = document.getElementById("mynetwork");
    //exportArea = document.getElementById("input_output");
    importButton = document.getElementById("import_button");
    exportButton = document.getElementById("export_button");
}

function exportNetwork(isSaveNetwork) {
    testing();

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
    $.each(nodes.get(), function (index, item) {
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
        else if (item.node_type == ampJSON.node_type) {
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
    $.each(edges.get(), function (index, item) {
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


function load_EqptConfig() {
    try {


        if (!eqpt_config['tip-photonic-simulation:simulation'] || !eqpt_config['tip-photonic-equipment:transceiver'] || !eqpt_config['tip-photonic-equipment:fiber'] || !eqpt_config['tip-photonic-equipment:amplifier'])
        {
            alert("keyError:'elements', try again");
            return;
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
        $('#ddlPreAmpCategoryType').empty();
        $('#ddlBoosterAmpCategoryType').empty();
        

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
function importNetwork() {
    init(true);
    nodes = [];
    edges = [];

    testing();
    document.getElementById('import_button').addEventListener('change', handleFileSelect, false);
    var inputValue = _import_json;
    //var inputValue = exportArea.value;
    var inputData = JSON.parse(inputValue);
    _edgesDB.insert(inputData)

    nodes = getNodeData(inputData.nodes);
    edges = getEdgeData(inputData.edges);
    data = {
        nodes: nodes,
        edges: edges
    };
    counter = counter + Number(nodes.length);
    localStorage.setItem("nodelength", counter);
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
                counter = counter + 1;
                localStorage.setItem("nodelength", counter);
                addNodes(data, callback);
            },
        },
    };
    network = new vis.Network(container, data, options);


    network.on("click", function (params) {
        params.event = "[original event]";
        if (this.getNodeAt(params.pointer.DOM)) {

        }
        else if (this.getEdgeAt(params.pointer.DOM)) {
            $("#txtNodeX").val(params.pointer.canvas.x);
            $("#txtNodeY").val(params.pointer.canvas.y);
        }
        else {
            $("#txtNodeX").val(params.pointer.canvas.x);
            $("#txtNodeY").val(params.pointer.canvas.y);
        }
    });
    network.on("selectEdge", function (data) {
        //console.log('edge');
        //_insertnodeDB().remove();

        if (data.edges.length > 1 || data.edges.length == 0) {
            copyData.edges = [];
            copyData.nodes = [];
            copyData.dataCopied = false;
            return;
        }
        //var getnodedata = edges.get();
        var clickedEdge = this.body.edges[data.edges[0]];
        //data.label = network.body.edges[data.edges[0]].options.label;
        //_insertnodeDB.insert({ "id": data.edges[0], "type": "NodeInsert", "label": data.label });
        //_nodesDB().remove();
        //_nodesDB.insert({ "id": clickedEdge.id, "type": edges.get(clickedEdge.id).component_type });
        setCopyData(clickedEdge.options.id, '');
    });
    network.on("selectNode", function (params) {
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        var deletenode = network.getConnectedEdges(clickedNode.id);
        localStorage.setItem("deletenodeconectededge", deletenode.length);
        //_nodesDB().remove();
        //_nodesDB.insert({ "id": clickedNode.id, "type": nodes.get(clickedNode.id).node_type });
        setCopyData('', clickedNode.options.id);
        if (isDualFiberMode == 1) {
            isAddService = 0;
            addServicData = {
                from: '',
                to: ''
            };
            if (addEdgeData.from == '')
                addEdgeData.from = clickedNode.options.id
            else if (addEdgeData.to == '') {
                if (addEdgeData.from == clickedNode.options.id) {
                    alert('pls click destination source');
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
            addEdgeData = {
                from: '',
                to: ''
            };

            if (addServiceData.from == '')
                addServiceData.from = clickedNode.options.id
            else if (addServiceData.to == '') {
                if (addServiceData.from == clickedNode.options.id) {
                    alert('pls click destination source');
                    return;
                }
                addServiceData.to = clickedNode.options.id
            }

            if (addServiceData.from != '' && addServiceData.to != '')
                addService();

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
        //data.preventDefault();

        var nodeDatas = this.body.nodes[this.getNodeAt(data.pointer.DOM)];
        var edgeDatas = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
        var nodeData = "";
        var edgeData = "";

        if (nodeDatas != undefined)
            nodeData = nodeDatas.id;
        if (edgeDatas != undefined)
            edgeData = edgeDatas.id;

        var type = "";
        if ((nodeData != '' && edgeData != '') || nodeData != '') {
            type = nodes.get(nodeData).node_type;
        }
        else if (edgeData != '') {
            type = edges.get(edgeData).component_type;
        }
        else {
            //alert('unable find. please try again !');
            return;
        }

        //var type = _nodesDB().first();

        if (type == serviceJSON.component_type) {

            if (edgeData != undefined) {
                showContextMenu(data.event.pageX, data.event.pageY, "serviceMenu");
                document.getElementById("btnServiceUpdate").onclick = serviceEdit.bind();
                document.getElementById("rightClickServiceDelete").onclick = deleteFiber.bind();
            }

        }

        else {
            if (type == roadmJSON.node_type || type == ampJSON.node_type || type == fusedJSON.node_type)//node || amp ||fused
            {

                if (type == ampJSON.node_type || type == fusedJSON.node_type) {
                    $("#roadmtype, #divRoadmTypePro").hide();
                }

                if (nodeData != undefined) {
                    ////$("#roadmMenu").css({ left: (data.event.pageX + 20) + "px", top: (data.event.pageY + 20) + "px" });
                    //document.getElementById("roadmMenu").style.display = "block";
                    showContextMenu(data.event.pageX, data.event.pageY, "roadmMenu");
                    document.getElementById("roadmEdit").onclick = roadmEdit.bind(
                        this,
                        nodeData,
                        callback

                    );
                    document.getElementById("rightClickNodeDelete").onclick = deleteNode.bind(
                        this,
                        nodeData,
                        callback
                    );
                }
            }
            else if (type == dualFiberJSON.component_type) {

                //var getrightclickedge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
                if (edgeData != undefined) {
                    showContextMenu(data.event.pageX, data.event.pageY, "dualFiberMenu");
                    document.getElementById("InsertNode").addEventListener('click', function () {
                        AddData(this, 0);
                    });
                    document.getElementById("Copy").onclick = copy.bind();
                    //document.getElementById("Paste").onclick = paste.bind();
                    document.getElementById("fiberEdit").onclick = dualFiberEdit.bind();
                    document.getElementById("rightClickEdgeDelete").onclick = deleteFiber.bind();
                }

            }
        }


        if (copy == "Yes") {
            document.getElementById("contextMenu").style.display = "none";
            $("#pastecontextMenu").css({ left: (data.event.pageX + 20) + "px", top: (data.event.pageY + 20) + "px" });
            document.getElementById("pastecontextMenu").style.display = "block";


            document.getElementById("Paste").onclick = paste.bind();
        }
        _nodesDB().remove();
    });

    container.addEventListener("dragover", (function (e) {
        e.preventDefault();
        //console.log("gj")
    }));
    container.addEventListener("dragenter", (function (e) {
        e.target.className += " dragenter";
        //console.log("gj")
    }));
    container.addEventListener("dragleave", (function (e) {
        //alert()
        e.target.className = "whiteBox";
    }));

    container.addEventListener("drop", (function (e) {

        //counter = counter + 1;
        //localStorage.setItem("nodelength", counter);
        //if (e.dataTransfer.getData("text") == "btnAddRoadm") {
        //    var x = e.layerX - ($("#mynetwork").width() / 2);
        //    var y = e.layerY - ($("#mynetwork").height() / 2);
        //    addNodeComponent(1, 1, x, y);
        //}
        //if (e.dataTransfer.getData("text") == "btnAddAmp") {
        //    var x = e.layerX - ($("#mynetwork").width() / 2);
        //    var y = e.layerY - ($("#mynetwork").height() / 2);
        //    addNodeComponent(1, 2, x, y);
        //}

        //e.preventDefault();
    }));

    network.on("dragStart", function (params) {
    });

    network.on("dragEnd", function (params) {
        params.event = "[original event]";
    });
    network.on("hoverNode", function (params) {
        try {
            var clickedNode = nodes.get(params.node);
            var fromlabel = clickedNode.label;
            $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY - 40) + "px" });
            $('#click').html(htmlTitle("label : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
            $('#click').show();
        }
        catch (e) { }
    });
    network.on("blurNode", function (params) {
        $('#click').hide();
    });
    network.on("hoverEdge", function (params) {
        try {
            var clickedNode = edges.get(params.edge);
            var fromlabel = "(" + nodes.get(clickedNode.from).label + " -> " + nodes.get(clickedNode.to).label + ")";
            $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY - 40) + "px" });
            $('#click').html(htmlTitle("dir : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
            $('#click').show();
        }
        catch (e) { }
    });
    network.on("blurEdge", function (params) {
        console.log("blurEdge Event:", params);
        $('#click').hide();
    });
    testing();
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
        var fromlabel = "(" + nodes.get(elem.from).label + " -> " + nodes.get(elem.to).label + ")";
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

/*copy and paste*/
function setCopyData(edgeID, nodeID) {
    copyData.edges = [];
    copyData.nodes = [];

    var edgeData = [];
    var nodeDataFrom = '';
    var nodeDataTo = '';


    //copy edge/node pair
    if (nodeID == '' && edgeID != '') {
        edgeData = network.body.edges[edgeID];
        nodeDataFrom = network.body.nodes[edgeData.fromId];
        nodeDataTo = network.body.nodes[edgeData.toId];
    }
    //copy node
    if (nodeID != '' && edgeID == '') {
        edgeData = [];
        nodeDataFrom = network.body.nodes[nodeID];
        nodeDataTo = '';
    }

    var tempnode = [];
    tempnode.push(nodeDataFrom);
    tempnode.push(nodeDataTo);
    copyData.edges = edgeData;
    copyData.nodes = tempnode;
}

function getCopiedData() {

    var dynamicid = [];
    copyData.nodes.forEach(function (elem, index, array) {
        counter = counter + 1;
        localStorage.setItem("nodelength", counter);
        //var nodelength = localStorage.getItem("nodelength");
        if (elem == '')
            return;
        var dyid = token();
        var xdir = Number($("#txtNodeX").val());
        network.body.data.nodes.add({
            id: dyid,
            label: elem.options.label,
            shape: elem.options.shape,
            icon: elem.options.icon,
            color: elem.options.color.background,
            x: elem.x + 10,
            y: elem.y + 10,
            //x:Number($("#txtNodeX").val()),
            //y:Number($("#txtNodeY").val()),
            title: elem.options.title,
            size: elem.options.size,
            nodedegree: elem.options.nodedegree,
            nodetype: elem.options.nodetype,
            componentType: nodes.get(elem.options.id).componentType

        });
        dynamicid.push(dyid);
    });

    if (copyData.edges.length == 0)
        return;
    var elem = copyData.edges;
    // add the connection
    var fontstyle = {
        align: '' + elem.options.font.align + '',
    }
    var arrows = {
        to: {
            enabled: elem.options.arrows.to.enabled,
            type: elem.options.arrows.to.type,
        },
        from: {
            enabled: elem.options.arrows.from.enabled,
            type: elem.options.arrows.from.type,
        },
    }

    var smooth = {
        enabled: elem.options.smooth.enabled,
        type: elem.options.smooth.type,
        roundness: elem.options.smooth.roundness,
    }

    //var options = {
    //    font: fontstyle,
    //    arrows: arrows,
    //    smooth: smooth
    //}
    network.body.data.edges.add({

        id: 'eid' + Math.random().toString().replace('.', '0'),
        from: dynamicid[0],
        to: dynamicid[1],
        dashes: elem.options.dashes,
        label: elem.options.label,
        //options: options,
        font: fontstyle,
        arrows: arrows,
        smooth: smooth,
        color: elem.options.color.color,
        componentType: edges.get(elem.id).componentType
        //label: elem.label,
        //font: elem.font,
        //arrows: elem.arrows,

    });

    copyData = {
        edges: [],
        nodes: [],
        dataCopied: false
    }


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
    counter = 0;
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
    var srcNode = nodes.get(addEdgeData.from);
    var DestNode = nodes.get(addEdgeData.to);
    var isSrcOk = false;
    var isDestOk = false;
    //to restrict pre amp and boost amp on dualfiber connection
    if (isDualFiberMode == 1) {
        var msg = "";
        if (srcNode.amp_category == preAmpJSON.amp_category || srcNode.amp_category == boosterAmpJSON.amp_category) {
            msg = srcNode.amp_category + " type : " + srcNode.label + " to ";
        }
        else {
            isSrcOk = true;
            msg = srcNode.node_type + " type : " + srcNode.label + " to ";
        }
        if (DestNode.amp_category == boosterAmpJSON.amp_category || DestNode.amp_category == preAmpJSON.amp_category) {
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
        if (srcNode.amp_category == ampJSON.node_type) {
            msg = srcNode.amp_category + " type : " + srcNode.label + " to ";
        }
        else {
            isSrcOk = true;
            if (srcNode.amp_category)
                msg = srcNode.amp_category + " type : " + srcNode.label + " to ";
            else
                msg = srcNode.node_type + " type : " + srcNode.label + " to ";
        }
        if (DestNode.amp_category == ampJSON.amp_category) {
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

    var labelvalue = dualFiberJSON.component_type + " " + nodes.get(addEdgeData.from).number + ' - ' + nodes.get(addEdgeData.to).number;
    var textvalue = roadmJSON.node_type + "- [ " + nodes.get(addEdgeData.from).label + ' - ' + nodes.get(addEdgeData.to).label + " ]";
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

function addService() {

    var fromDetails = nodes.get(addServiceData.from);
    var toDetails = nodes.get(addServiceData.to);
    if (fromDetails.node_type == transceiverJSON.node_type && toDetails.node_type == transceiverJSON.node_type && fromDetails.transceiver_type == toDetails.transceiver_type) {
        var labelvalue = serviceJSON.component_type + ' ' + nodes.get(addServiceData.from).number + ' - ' + nodes.get(addServiceData.to).number;
        addServiceComponent(1, addServiceData.from, addServiceData.to, labelvalue);
        addServiceData = {
            from: '',
            to: ''
        };
        UnSelectAll();
    } else {
        alert("The service should be between 2 transceiver sites");
        addServiceData = {
            from: '',
            to: ''
        };
        UnSelectAll();
    }

}
function addServiceMode() {
    UnSelectAll();
    isAddService = 1;
    isDualFiberMode = 0;
    isSingleFiberMode = 0;
    addServiceData = {
        from: '',
        to: ''
    };
}

function copy() {
    document.getElementById("edgecontextMenu").style.display = "none";
    copyData.dataCopied = true;
    copy = "Yes";
}
function paste() {
    if (copy == "Yes") {
        document.getElementById("pastecontextMenu").style.display = "none";
        getCopiedData();
        copy = "No"
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
    addEdgeData = {
        from: '',
        to: ''
    };
    addServiceData = {
        from: '',
        to: ''
    };
}

function generateMatrix() {
    $("#matrixDiv").empty();
    var nodearray = nodes.get();
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
        console.log(multiarr);

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
                    var edgesarr = edges.get();
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

            var labelvalue = '[' + nodes.get(txtFrom).label + ' - ' + nodes.get(txtTo).label + ']';
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
    var localnodearray = nodes.get();
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
    var edgesarr = edges.get();
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
    var nodelist = nodes.get();
    for (var i = 0; i < nodelist.length; i++) {

        var topnode = "<button class='accordion'>" + nodelist[i].label + "</button>"
        $("#nodeDiv").append(topnode);
        var connodelist = network.getConnectedNodes(nodelist[i].id);
        var spannode = "";
        for (var j = 0; j < connodelist.length; j++) {
            spannode += "<p style='padding-left:10px;'>" + nodes.get(connodelist[j]).label + "</p>";

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

//drag and drop, add multiple RODAM/Amp//Fusedcmode 1-add,ctype 1-node, 2-amp, 3-fused
function addNodeComponent(cmode, ctype, cx, cy) {
    var nodelength = localStorage.getItem("nodelength");
    var nodeLable = "";

    if (cmode == 1 && ctype == 1) {
        var nodeDetails = configData.node[roadmJSON.node_type];
        nodeLable = nodeDetails.default.label;
        if (nodelength != "") {
            nodeLable += '' + Number(nodelength) + '';

        } else {
            nodeLable += 1;
        }
        network.body.data.nodes.add({
            id: token(),
            label: nodeLable,
            node_degree: nodeDetails.default.node_degree,
            node_type: nodeDetails.default.node_type,
            roadm_type: nodeDetails.default.roadm_type,
            pre_amp_type: nodeDetails.default.pre_amp_type,
            booster_type: nodeDetails.default.booster_type,
            component_type: roadmJSON.component_type,
            x: cx,
            y: cy,

        })
    }
    else if (cmode == 1 && ctype == 2) {
        var nodeDetails = configData.node[ampJSON.node_type];
        nodeLable = nodeDetails.default.label;
        if (nodelength != "") {
            nodeLable += '' + Number(nodelength) + '';

        } else {
            nodeLable += 1;
        }
        network.body.data.nodes.add({
            id: token(),
            label: nodeLable,
            shape: ampJSON.shape,
            node_degree: nodeDetails.default.node_degree,
            node_type: nodeDetails.default.node_type,
            //roadm_type: nodeDetails.default.roadm_type,
            pre_amp_type: nodeDetails.default.pre_amp_type,
            booster_type: nodeDetails.default.booster_type,
            component_type: roadmJSON.component_type,
            color: ampJSON.color,
            x: cx,
            y: cy,
        })
    }
    else if (cmode == 1 && ctype == 3) {
        var nodeDetails = configData.node[fusedJSON.node_type];
        nodeLable = nodeDetails.default.label;
        if (nodelength != "") {
            nodeLable += '' + Number(nodelength) + '';

        } else {
            nodeLable += 1;
        }
        network.body.data.nodes.add({
            id: token(),
            label: nodeLable,
            shape: fusedJSON.shape,
            node_degree: nodeDetails.default.node_degree,
            node_type: nodeDetails.default.node_type,
            //roadm_type: nodeDetails.default.roadm_type,
            pre_amp_type: nodeDetails.default.pre_amp_type,
            booster_type: nodeDetails.default.booster_type,
            component_type: roadmJSON.component_type,
            color: fusedJSON.color,
            x: cx,
            y: cy,
        })
    }


}

//Add fiber//cmode 1-add
function addFiberComponent(cmode, cfrom, cto, clabel, ctext) {
    if (cmode == 1) {

        var fiberID = token();
        var nodeDetails = nodes.get(cfrom);

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

       
        if (isDualFiberMode == 1) {
            network.body.data.edges.add({
                id: fiberID, from: cfrom, to: cto, label: clabel, dashes: dualFiberJSON.dashes, fiber_category: dualFiberJSON.fiber_category,
                component_type: dualFiberJSON.component_type, color: dualFiberJSON.options.color, background: dualFiberJSON.options.background,
                arrows: dualFiberJSON.options.arrows, font: dualFiberJSON.options.font, smooth: dualFiberJSON.options.smooth,
                RxToTxFiber: {
                    from: cto, to: cfrom, label: clabel,fiber_category: dualFiberJSON.fiber_category,
                    component_type: dualFiberJSON.component_type
                }

            });
        }
        if (isSingleFiberMode == 1) {
            network.body.data.edges.add({
                id: fiberID, from: cfrom, to: cto, label: clabel, dashes: singleFiberJSON.dashes, fiber_category: singleFiberJSON.fiber_category,
                component_type: singleFiberJSON.component_type, color: singleFiberJSON.options.color,
                background: singleFiberJSON.options.background, arrows: singleFiberJSON.options.arrows, font: singleFiberJSON.options.font, smooth: singleFiberJSON.options.smooth

            });

        }

    }
}


//Add service//cmode 1-add
function addServiceComponent(cmode, cfrom, cto, clabel) {

    if (cmode == 1) {
        network.body.data.edges.add({
            id: token(), from: cfrom, to: cto, label: clabel, dashes: serviceJSON.dashes,
            component_type: serviceJSON.component_type, color: serviceJSON.options.color, background: serviceJSON.options.background, arrows: serviceJSON.options.arrows, font: serviceJSON.options.font, smooth: serviceJSON.options.smooth,
            band_width: configData[serviceJSON.component_type].default.band_width, central_frequency: configData[serviceJSON.component_type].default.central_frequency
        });
    }
}
//Add node nodeMode - 1-roadm, 2-amp, 3=fused, 4-transceiver,5-preamp, 6-boosteramp
function addNodes(data, callback) {

    var nodeDetails = "";
    var nodeShape = "";
    var nodeColor = "";
    if (nodeMode == 1) {
        nodeDetails = configData.node[roadmJSON.node_type];
        data.image = DIR + roadmJSON.image;
    }
    else if (nodeMode == 2 || nodeMode == 3 || nodeMode == 4 || nodeMode == 5 || nodeMode == 6) {
        if (nodeMode == 2) {
            nodeDetails = configData.node[ampJSON.node_type];
            nodeShape = ampJSON.shape;
            nodeColor = ampJSON.color;
            data.image = DIR + ampJSON.image;
            data.pre_amp_type = nodeDetails.default.pre_amp_type;
            data.booster_type = nodeDetails.default.booster_type;
            data.amp_category = nodeDetails.default.amp_category;
        }
        else if (nodeMode == 3) {
            nodeDetails = configData.node[fusedJSON.node_type];
            nodeShape = fusedJSON.shape;
            nodeColor = fusedJSON.color;
            data.image = DIR + fusedJSON.image;
        }
        else if (nodeMode == 4) {
            nodeDetails = configData.node[transceiverJSON.node_type];
            nodeShape = transceiverJSON.shape;
            nodeColor = transceiverJSON.color;
            data.image = DIR + transceiverJSON.image;
            data.transceiver_type = nodeDetails.default.transceiver_type;
        }
        else if (nodeMode == 5) {
            nodeDetails = configData.node[preAmpJSON.amp_category];
            nodeShape = preAmpJSON.shape;
            nodeColor = preAmpJSON.color;
            data.image = DIR + preAmpJSON.image;
            data.pre_amp_type = nodeDetails.default.pre_amp_type;
            data.amp_category = nodeDetails.default.amp_category;
        }
        else if (nodeMode == 6) {
            nodeDetails = configData.node[boosterAmpJSON.amp_category];
            nodeShape = boosterAmpJSON.shape;
            nodeColor = boosterAmpJSON.color;
            data.image = DIR + boosterAmpJSON.image;
            data.booster_type = nodeDetails.default.booster_type;
            data.amp_category = nodeDetails.default.amp_category;
        }
        data.shape = nodeShape;
        data.color = nodeColor;

    }
    else
        return;

    data.id = token();
    var nodelength = localStorage.getItem("nodelength");
    var nodeLable = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();
    data.number = nodelength;
    data.label = nodeLable;
    //data.id = nodeLable;
    data.node_type = nodeDetails.default.node_type;
    data.node_degree = nodeDetails.default.node_degree;
    data.component_type = roadmJSON.component_type;
    callback(data);

    if (nodeMode == 1 || nodeMode == 2 || nodeMode == 3 || nodeMode == 4 || nodeMode == 5 || nodeMode == 6)
        network.addNodeMode();


}




//start -- component edit, update, remove, clear
function roadmEdit(nodeID, callback) {
    _roadmListDB().remove();
    document.getElementById("roadmMenu").style.display = "none";
    openDrawer('roadm');
    var nodeDetails = nodes.get(nodeID);
    $("#txtRoadmName").val(nodeDetails.label);
    $("#divRoadmPro").hide();
    $("#divRoadmPro").empty();
    if (nodeDetails.node_type == roadmJSON.node_type) {
        arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
        _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));
        var connectedFiber = network.getConnectedEdges(nodeID);

        $.each(connectedFiber, function (index, item) {
            if (edges.get(item).component_type == dualFiberJSON.component_type)
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
    var node_type = nodes.get(nodeID).node_type

    if (nameLengthValidation("txtRoadmName")) {

        var roadmtypeprodata = _roadmListDB().get();
        if (node_type == roadmJSON.node_type) {

            $.each(roadmtypeprodata, function (index, item) {
                var lddlroadmtype = "#" + eleroadmtype + item.roadm_fiber_id;
                var lddlpreamptype = "#" + elepreamptype + item.roadm_fiber_id;
                var lddlboostertype = "#" + eleboostertype + item.roadm_fiber_id;
                var edgeDetails = edges.get(item.roadm_fiber_id);
                var llabelname = node_type + "- [" + label + ' - ' + nodes.get(edgeDetails.to).label + ' ]'
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
    var nodeDetails = nodes.get(nodeID);
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
    var node_type = nodes.get(nodeID).node_type

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

function amplifierEdit(nodeID, callback) {
    document.getElementById("amplifierMenu").style.display = "none";
    openDrawer('amplifier');
    var nodeDetails = nodes.get(nodeID);
    $("#txtAmplifierName").val(nodeDetails.label);
    $("#ddlPreAmpType").val(nodeDetails.pre_amp_type);
    $("#ddlBoosterType").val(nodeDetails.booster_type);

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
    var node_type = nodes.get(nodeID).node_type

    if (nameLengthValidation("txtAmplifierName")) {

        if (node_type == ampJSON.node_type) {
            network.body.data.nodes.update({
                id: id, label: label, pre_amp_type: $("#ddlPreAmpType").val(), booster_type: $("#ddlBoosterType").val(),
            });
            clearAmplifier();
        }


    }

}
function clearAmplifier() {
    $("#txtAmplifierName").val('');
    $("#ddlPreAmpType").val('');
    $("#ddlBoosterType").val('');
    closeDrawer('amplifier');
    network.unselectAll();
}

function preAmpEdit(nodeID, callback) {
    document.getElementById("preAmpMenu").style.display = "none";
    openDrawer('preamplifier');
    var nodeDetails = nodes.get(nodeID);
    $("#txtPreAmpName").val(nodeDetails.label);
    $("#ddlPreAmpCategoryType").val(nodeDetails.pre_amp_type);

    document.getElementById("btnPreAmpUpdate").onclick = updatePreAmp.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnClosePreAmp").onclick = clearPreAmp.bind(
    );
}
function updatePreAmp(nodeID) {

    var id = nodeID;
    var label = $("#txtPreAmpName").val().trim();
    var amp_category = nodes.get(nodeID).amp_category

    if (nameLengthValidation("txtPreAmpName")) {

        if (amp_category == preAmpJSON.amp_category) {
            network.body.data.nodes.update({
                id: id, label: label, pre_amp_type: $("#ddlPreAmpCategoryType").val(),
            });
            clearPreAmp();
        }


    }

}
function clearPreAmp() {
    $("#txtPreAmpName").val('');
    $("#ddlPreAmpCategoryType").val('');
    closeDrawer('preamplifier');
    network.unselectAll();
}

function boosterAmpEdit(nodeID, callback) {
    document.getElementById("boosterAmpMenu").style.display = "none";
    openDrawer('boosteramplifier');
    var nodeDetails = nodes.get(nodeID);
    $("#txtBoosterAmpName").val(nodeDetails.label);
    $("#ddlBoosterAmpCategoryType").val(nodeDetails.booster_amp_type);

    document.getElementById("btnBoosterAmpUpdate").onclick = updateBoosterAmp.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseBoosterAmp").onclick = clearBoosterAmp.bind(
    );
}
function updateBoosterAmp(nodeID) {

    var id = nodeID;
    var label = $("#txtBoosterAmpName").val().trim();
    var amp_category = nodes.get(nodeID).amp_category

    if (nameLengthValidation("txtBoosterAmpName")) {

        if (amp_category == boosterAmpJSON.amp_category) {
            network.body.data.nodes.update({
                id: id, label: label, booster_amp_type: $("#ddlBoosterAmpCategoryType").val(),
            });
            clearBoosterAmp();
        }


    }

}
function clearBoosterAmp() {
    $("#txtBoosterAmpName").val('');
    $("#ddlBoosterAmpCategoryType").val('');
    closeDrawer('boosteramplifier');
    network.unselectAll();
}

function transceiverEdit(nodeID, callback) {
    document.getElementById("transceiverMenu").style.display = "none";
    openDrawer('transceiver');
    var nodeDetails = nodes.get(nodeID);
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
    var node_type = nodes.get(nodeID).node_type

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
    var nodeDetails = nodes.get(nodeID);
    var node_type = nodeDetails.node_type;
    if (nodeDetails.node_type == ampJSON.node_type)
        node_type = nodeDetails.amp_category;
    var isDelete = confirm('do you want to delete ' + node_type + ' : ' + nodeDetails.label + ' ?');
    if (!isDelete)
        return;
    document.getElementById("roadmMenu").style.display = "none";
    document.getElementById("attenuatorMenu").style.display = "none";
    document.getElementById("amplifierMenu").style.display = "none";
    document.getElementById("preAmpMenu").style.display = "none";
    document.getElementById("boosterAmpMenu").style.display = "none";
    document.getElementById("transceiverMenu").style.display = "none";

    if (network.getConnectedEdges(nodeID).length > 0) {
        alert("Unpair node then delete");

    } else {
        nodes.remove(nodeID);
    }
    network.unselectAll();
}

function dualFiberEdit(fiberID, callback) {
    document.getElementById("dualFiberMenu").style.display = "none";
    
    clearCbxandAccordian();
    openDrawer('dualfiber');
    var edgeDetails = edges.get(fiberID);
    var connectedNode = network.getConnectedNodes(fiberID);


    $("#txtFiberName").val(edgeDetails.label);
    //fiber A details
    $("#ddlFiberAType").val(edgeDetails.fiber_type);
    $("#txtFiberACD").val(edgeDetails.cd_coefficient);
    $("#txtFiberAPMD").val(edgeDetails.pmd_coefficient);
    $("#txtFiberASL").val(edgeDetails.span_length);
    $("#txtFiberALC").val(edgeDetails.loss_coefficient);
    $("#txtFiberACIN").val(edgeDetails.connector_in);
    $("#txtFiberACOUT").val(edgeDetails.connector_out);
    $("#txtFiberASpanLoss").val(edgeDetails.span_loss);
    //fiber B details
    if (edgeDetails.RxToTxFiber) {
        $("#ddlFiberBType").val(edgeDetails.RxToTxFiber.fiber_type);
        $("#txtFiberBCD").val(edgeDetails.RxToTxFiber.cd_coefficient);
        $("#txtFiberBPMD").val(edgeDetails.RxToTxFiber.pmd_coefficient);
        $("#txtFiberBSL").val(edgeDetails.RxToTxFiber.span_length);
        $("#txtFiberBLC").val(edgeDetails.RxToTxFiber.loss_coefficient);
        $("#txtFiberBCIN").val(edgeDetails.RxToTxFiber.connector_in);
        $("#txtFiberBCOUT").val(edgeDetails.RxToTxFiber.connector_out);
        $("#txtFiberBSpanLoss").val(edgeDetails.RxToTxFiber.span_loss);
    }


    $("#pFiberA").text("Fiber A [" + nodes.get(connectedNode[0]).label + ' - ' + nodes.get(connectedNode[1]).label + "]");
    $("#pFiberB").text("Fiber B [" + nodes.get(connectedNode[1]).label + ' - ' + nodes.get(connectedNode[0]).label + "]");

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
    var cd_coefficient = $("#txtFiberACD").val();
    var pmd_coefficient = $("#txtFiberAPMD").val();
    var span_length = $("#txtFiberASL").val();
    var loss_coefficient = $("#txtFiberALC").val();
    var connector_in = $("#txtFiberACIN").val();
    var connector_out = $("#txtFiberACOUT").val();
    var span_loss = $("#txtFiberASpanLoss").val();

    var fiber_typeB = $("#ddlFiberBType").val();
    var cd_coefficientB = $("#txtFiberBCD").val();
    var pmd_coefficientB = $("#txtFiberBPMD").val();
    var span_lengthB = $("#txtFiberBSL").val();
    var loss_coefficientB = $("#txtFiberBLC").val();
    var connector_inB = $("#txtFiberBCIN").val();
    var connector_outB = $("#txtFiberBCOUT").val();
    var span_lossB = $("#txtFiberBSpanLoss").val();

    var spanlen = Number(span_length);
    if (spanlen <= 0) {
        alert('Fiber A : please enter valid span length.');
        return;
    }

    var Bspan_length = Number($("#txtFiberBSL").val());

    spanlen = Number(Bspan_length);
    if (spanlen <= 0) {
        alert('Fiber B : please enter valid span length.');
        return;
    }

    var fiberDetails = edges.get(fiberID);

    if (nameLengthValidation("txtFiberName")) {
        if (fiberDetails.component_type == dualFiberJSON.component_type && fiberDetails.fiber_category == dualFiberJSON.fiber_category) {
            network.body.data.edges.update({
                id: id, label: label, fiber_type: fiber_type, cd_coefficient: cd_coefficient, pmd_coefficient: pmd_coefficient, span_length: span_length,
                loss_coefficient: loss_coefficient, connector_in: connector_in, connector_out: connector_out, span_loss: span_loss,
                RxToTxFiber: {
                    from: fiberDetails.to, to: fiberDetails.from, fiber_category: fiberDetails.fiber_category, component_type: fiberDetails.component_type,
                    label: label, fiber_type: fiber_typeB, cd_coefficient: cd_coefficientB, pmd_coefficient: pmd_coefficientB, span_length: span_lengthB,
                    loss_coefficient: loss_coefficientB, connector_in: connector_inB, connector_out: connector_outB, span_loss: span_lossB,
                }
            });
            clearDualFiber();
        }

    }
}
function clearDualFiber() {
    $("#txtfiberName").val('');

    $("#ddlFiberAType").val('');
    $("#txtFiberACD").val('');
    $("#txtFiberAPMD").val('');
    $("#txtFiberASL").val('');
    $("#txtFiberALC").val('');
    $("#txtFiberACIN").val('');
    $("#txtFiberACOUT").val('');

    $("#ddlFiberBType").val('');
    $("#txtFiberBCD").val('');
    $("#txtFiberBPMD").val('');
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
    var edgeDetails = edges.get(fiberID);
    var connectedNode = network.getConnectedNodes(fiberID);
    $("#txtSinlgeFiberName").val(edgeDetails.label);
    $("#txtSource").val(nodes.get(connectedNode[0]).label);
    $("#txtDestination").val(nodes.get(connectedNode[1]).label);
    $("#ddlSingleFiberType").val(edgeDetails.fiber_type);
    $("#txtCD_Coefficient").val(edgeDetails.cd_coefficient);
    $("#txtPMD_Coefficient").val(edgeDetails.pmd_coefficient);
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
    var cd_coefficient = $("#txtCD_Coefficient").val();
    var pmd_coefficient = $("#txtPMD_Coefficient").val();
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

    var fiberDetails = edges.get(fiberID);

    if (nameLengthValidation("txtSinlgeFiberName")) {

        if (fiberDetails.component_type == singleFiberJSON.component_type && fiberDetails.fiber_category == singleFiberJSON.fiber_category) {
            network.body.data.edges.update({
                id: id, label: label, fiber_type: fiber_type, cd_coefficient: cd_coefficient, pmd_coefficient: pmd_coefficient, span_length: span_length,
                loss_coefficient: loss_coefficient, connector_in: connector_in, connector_out: connector_out, span_loss: span_loss
            });
            clearSingleFiber();
        }

    }
}
function clearSingleFiber() {

    $("#txtSinlgeFiberName").val('');
    $("#txtSource").val('');
    $("#txtDestination").val('');
    $("#ddlSingleFiberType").val('');
    $("#txtCD_Coefficient").val('');
    $("#txtPMD_Coefficient").val('');
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
    var isDelete = confirm('do you want to delete ' + edges.get(fiberID).fiber_category + ' : ' + edges.get(fiberID).label + ' ?');
    if (!isDelete)
        return;
    document.getElementById("dualFiberMenu").style.display = "none";
    document.getElementById("singleFiberMenu").style.display = "none";

    var nodeDetails = nodes.get(edges.get(fiberID).from);
    arrRoadmTypePro = nodeDetails.roadm_type_pro ? nodeDetails.roadm_type_pro : [];
    _roadmListDB.insert(JSON.stringify(arrRoadmTypePro));

    _roadmListDB({
        roadm_fiber_id: fiberID
    }).remove();
    arrRoadmTypePro = _roadmListDB().get();
    network.body.data.nodes.update({
        id: nodeDetails.id, roadm_type_pro: arrRoadmTypePro
    });

    edges.remove(fiberID);

    network.unselectAll();


}

function serviceEdit(serviceID, callback) {
    document.getElementById("serviceMenu").style.display = "none";
    var edgeDetails = edges.get(serviceID);
    $("#txtServiceName").val(edgeDetails.label);
    var connectedNode = network.getConnectedNodes(serviceID);
    $("#txtServiceSrc").val(nodes.get(connectedNode[0]).label);
    $("#txtServiceDest").val(nodes.get(connectedNode[1]).label);
    $("#txtBandwidth").val(edgeDetails.band_width);
    $("#ddlCentralFrq").val(edgeDetails.central_frequency);
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
    var centralFrq = $("#ddlCentralFrq").val();
    var component_type = edges.get(serviceID).component_type

    if (nameLengthValidation("txtServiceName")) {

        if (component_type == serviceJSON.component_type) {
            network.body.data.edges.update({
                id: id, label: label, band_width: bandwidth, central_frequency: centralFrq
            });
            clearService();
        }

    }

}
function deleteService(serviceID) {
    var isDelete = confirm('do you want to delete ' + edges.get(serviceID).component_type + ' : ' + edges.get(serviceID).label + ' ?');
    if (!isDelete)
        return;
    document.getElementById("serviceMenu").style.display = "none";
    edges.remove(serviceID);
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
            $('#ddlPreAmpCategoryType').append('<option value="' + item.type + '">' + item.type + '</option>');
            $('#ddlBoosterType').append('<option value="' + item.type + '">' + item.type + '</option>');
            $('#ddlBoosterAmpCategoryType').append('<option value="' + item.type + '">' + item.type + '</option>');
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
var showMenu = 0;
function networkValidation() {
    var flag = false;
    if (nodes.get().length > 0 || edges.get().length > 0)
        flag = true;
    else {
        alert('Please create node/fiber/service.');
    }

    return flag;
}

function loadRoadmType(fiberID, nodeID, node_type) {
    var fiberDetails = edges.get(fiberID);
    var roadmType = "";
    if (fiberDetails.from == nodeID) {
        $("#divRoadmPro").show();
        var connectedNodes = network.getConnectedNodes(fiberID);
        roadmType = node_type + "- [" + nodes.get(connectedNodes[0]).label + ' - ' + nodes.get(connectedNodes[1]).label + ' ]';

        var roadmAccordian = "";
        roadmAccordian = "<div class='accordion-fiber'>";
        roadmAccordian += "<p class='title m-0 f-s-17' id=" + fiberID + ">" + roadmType + "</p>";
        roadmAccordian += "<span class='show-fiber'>+</span>"
        roadmAccordian += "</div>";

        roadmAccordian += "<div class='info-fiber'><div class='panel'>";

        roadmAccordian += generateAccordianEle("ROADM Type", eleroadmtype + fiberID);
        roadmAccordian += generateAccordianEle("Pre-Amp Type", elepreamptype + fiberID);
        roadmAccordian += generateAccordianEle("Booster Type", eleboostertype + fiberID);

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
        clearRoadmPro();
    }
}
