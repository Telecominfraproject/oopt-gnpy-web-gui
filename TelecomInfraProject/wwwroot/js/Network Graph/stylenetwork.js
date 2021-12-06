
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
var fusedJSON = "";
var transceiverJSON = "";
var fiberJSON = "";
var serviceJSON = "";

var configData = "";
var styleData = "";
var eqpt_config = "";

var tempProjectName = "";
var tempLayoutName = "";

var arrRoadmTypePro = [];
var _roadmListDB = new TAFFY();

var isLocalStorage = false;
var nodeMode = "";
var DIR = "";
var eleroadmtype = "ddlroadmType";
var elepreamptype = "ddlPreAmpType";
var eleboostertype = "ddlBoosterType";

var eqpt_file = "";
$(document).ready(function () {

    $.getJSON("/Data/StyleData.json", function (data) {
        optionsJSON = data.options;
        roadmJSON = data.Roadm;
        ampJSON = data.Amplifier;
        fusedJSON = data.Fused;
        transceiverJSON = data.Transceiver;
        fiberJSON = data.Fiber;
        serviceJSON = data.Service;
        styleData = data;
    }).fail(function () {
        console.log("An error has occurred1.");
    });

    $.getJSON("/Data/ConfigurationData.json", function (data) {

        configData = data;
        DIR = configData.node.dir;
        eqpt_file = configData.project.eqpt_config_file_path;
        tempLayoutName = configData.project.network_platform_layout[0];
        $.each(configData.project.network_platform_layout, function (index, item) {
            $('#ddlPlatformLayout').append('<option value="' + item + '">' + item + '</option>');
        });
        $("#siteLength").text(' (Max Length ' + configData.node.site_length + ')');
    }).fail(function () {
        console.log("An error has occurred2.");
    });

    $.getJSON("/Data/eqpt_config.json", function (data) {
        eqpt_config = data;
        load_EqptConfig();
    }).fail(function () {
        console.log("An error has occurred3.");
    });

    $("#btnAddMultipleNode").click(function () {
        if (addMulNodeVal()) {
            AddMultipleNode();
            closeDrawer('multi');
        }

    });

    $("#btnmanualaddEdge").click(function () {
        nodeMode = "";
        manualAddEdgeMode();
    });

    //$("#btnmanualaddservice").click(function () {
    //    if (networkValidation()) {
    //        $("#divNodeFiber").addClass("disableDiv");
    //        manualAddServiceMode();
    //        $("#staticBackdrop3").modal('hide');
    //    }
    //});
    $("#btnServiceActive").click(function () {
        nodeMode = "";
        if (networkValidation()) {
            //$("#divNodeFiber").addClass("disableDiv");
            manualAddServiceMode();
            //$("#staticBackdrop3").modal('hide');
        }
    });

    //$("#btnServiceActive").click(function () {
    //    if (networkValidation()) {
    //        $("#staticBackdrop3").modal('show');
    //    }

    //});

    $("#btncaptureimagenetwork").click(function () {
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
        AddNodeMode(1);
    });
    $("#btnAddAmp").click(function () {
        AddNodeMode(2);
    });
    $("#btnAddFused").click(function () {
        AddNodeMode(3);
    });
    $("#btnAddTransceiver").click(function () {
        AddNodeMode(4);
    });

    $("#ddlTransceiverType").change(function () {
        loadTransceiverMode($(this).val());
    });

    $("#btnCreateProject").click(function () {
        if (newProjectValidation())
            createNewProject($("#txtProjectName").val(), $("#ddlPlatformLayout").val());
        else
            alert('please enter the all values');
    });
    //$("#btnNewNetwork").click(function () {
    //    $("#staticBackdrop").modal({ show: true });
    //    $("#txtProjectName").val(tempProjectName);
    //    $("#ddlPlatformLayout").val(tempLayoutName);

    //});
    $("#btnPrevious").click(function () {
        $("#staticBackdrop4").modal('hide');
        $("#stepCreateProject").click();
        
    }); 
    $("#btnSaveGP").click(function () {
        $("#staticBackdrop4").modal('hide'); 
        $("#stepCreateTopology").click();
    });
    $("#btnDownloadJson").click(function () {
        const a = document.createElement("a");
        a.href = eqpt_file;
        a.download = "eqpt_config.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

});

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
    disableFiberService();
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
                    createNewProject(tempData.projectdetails.projectname, tempData.projectdetails.layoutname);
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
                counter = counter + 1;
                localStorage.setItem("nodelength", counter);
                addNodes(data, callback);
                //document.getElementById("saveRoadmNode").onclick = addNodes.bind(
                //    this,
                //    data,
                //    callback
                //);
                //document.getElementById("closeSingle").onclick = clearRoadm.bind();
                //openDrawer('single');
            },
        },
    };
    $("#mynetwork").show();
    network = new vis.Network(container, data, options);
    if (!isLocalStorage)
        $("#mynetwork").hide();

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
        nodeMode = "";
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
        nodeMode = "";
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        var deletenode = network.getConnectedEdges(clickedNode.id);
        localStorage.setItem("deletenodeconectededge", deletenode.length);
        //_nodesDB().remove();
        //_nodesDB.insert({ "id": clickedNode.id, "type": nodes.get(clickedNode.id).node_type });
        setCopyData('', clickedNode.options.id);
        if (isAddEdge == 1) {
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
                manualAddEdge();
        }
        if (isAddService == 1) {
            isAddEdge = 0;
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
                manualAddService();

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
        nodeMode = "";
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
                document.getElementById("rightClickServiceEdit").onclick = rightClickServiceEdit.bind();
                document.getElementById("rightClickServiceDelete").onclick = deleteFiber.bind();
            }

        }
        else {
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
                    if (type == fusedJSON.node_type) {
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
                }
            }
            else if (type == fiberJSON.component_type) {

                //var getrightclickedge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
                console.log(edges.get(edgeData).label);
                if (edgeData != undefined) {
                    showContextMenu(data.event.pageX, data.event.pageY, "fiberMenu");
                    document.getElementById("InsertNode").addEventListener('click', function () {
                        AddData(this, 0);
                    });
                    document.getElementById("Copy").onclick = copy.bind();
                    //document.getElementById("Paste").onclick = paste.bind();
                    document.getElementById("rightClickEdgeEdit").onclick = rightClickEdgeEdit.bind(
                        this,
                        edgeData,
                        callback
                    );
                    document.getElementById("rightClickEdgeDelete").onclick = deleteFiber.bind(
                        this,
                        edgeData,
                        callback
                    );
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

        e.preventDefault();
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
        //console.log("blurEdge Event:", params);
        $('#click').hide();
    });
    // removeDefaultElement();
}

/*Remove canvas inside button like edit,delete,add*/
function removeDefaultElement() {
    $("*.vis-manipulation").remove();
    $("*.vis-edit-mode").remove();
    $("*.vis-close").remove();
}


/*Multiple node add start*/
function AddMultipleNode() {
    disableFiberService();
    var totalcount = Number($("#txtNofNode").val());
    var x = 0;
    var y = 0;
    for (var i = 1; i <= totalcount; i++) {
        x = x + 10;
        y = y + 10;
        counter = counter + 1;
        localStorage.setItem("nodelength", counter);
        addNodeComponent(1, 1, x, y);
    }
}
/*Multiple node add End*/




/*start show popup window and update data based on selected node*/
function popupeditNode(data, cancelAction, callback) {
    document.getElementById("nodeeditlabel").value = data.label;
    document.getElementById("nodesaveButton").onclick = popupsaveNodeData.bind(
        this,
        data,
        callback
    );
    document.getElementById("nodecancelButton").onclick =
        cancelAction.bind(this, callback);
    document.getElementById("node-popUpdetails").style.display = "block";
}



function editEdgeWithoutDrag(data, callback) {
    var servicefromedgefrom;
    var servicefromedgeto;
    var servicetoedgefrom;
    var servicetoedgeto;
    if (isService != 1) {
        var fromcounter = 0;
        var tocounter = 0;
        var fromnodedegree = network.body.nodes[data.from].options.nodedegree;
        var tonodedegree = network.body.nodes[data.to].options.nodedegree;
        var fromnodeconnectededge = network.getConnectedEdges(data.from);
        var tonodeconnectededge = network.getConnectedEdges(data.to);
        fromnodeconnectededge.forEach(function (item, index) {
            var formnodeconnecteddataset = edges.get();
            for (i = 0; i < formnodeconnecteddataset.length; i++) {
                if (item == formnodeconnecteddataset[i].id) {
                    if (formnodeconnecteddataset[i].component_type == "fiber") {
                        fromcounter = fromcounter + 1;
                    }
                }
            }
        });
        tonodeconnectededge.forEach(function (item, index) {
            var tonodeconnecteddataset = edges.get();
            for (i = 0; i < tonodeconnecteddataset.length; i++) {
                if (item == tonodeconnecteddataset[i].id) {
                    if (tonodeconnecteddataset[i].component_type == "fiber") {
                        tocounter = tocounter + 1;
                        //console.log("hi");
                    }
                }
            }
        });
        if (fromcounter < Number(fromnodedegree) && tocounter < Number(tonodedegree)) {
            ////filling in the popup DOM elements
            //if (data.label != undefined) {
            //    document.getElementById("edge-label").value = data.label;
            //}
            ////document.getElementById("edge-arrow").value = data.arrows;
            //if (data.id != undefined) {
            //    var arrowto = network.body.edges[data.id].options.arrows.to.enabled
            //    var arrowfrom = network.body.edges[data.id].options.arrows.from.enabled
            //    //var arrowmiddle = network.body.edges[cliEdge.id].options.arrows.to.enabled
            //    if (arrowto == true && arrowfrom == true) {
            //        document.getElementById("edge-arrow").value = "to,form";
            //    }
            //    else if (arrowto == true) {
            //        document.getElementById("edge-arrow").value = "to";
            //    }
            //    else if (arrowfrom == true) {
            //        document.getElementById("edge-arrow").value = "from";
            //    }
            //    else {
            //        document.getElementById("edge-arrow").value = "";
            //    }
            //}
            if (data.label != undefined) {
                document.getElementById("edge-label").value = data.label;
            }

            //document.getElementById("edge-arrow").value = data.arrows;
            if (data.id != undefined) {
                //$(`#ddledgecolor option[value='${network.body.nodes[data.id].options.color.background}']`).prop('selected', true);
                var arrowto = network.body.edges[data.id].options.arrows.to.enabled
                var arrowfrom = network.body.edges[data.id].options.arrows.from.enabled
                //var arrowmiddle = network.body.edges[cliEdge.id].options.arrows.to.enabled
                if (arrowto == true && arrowfrom == true) {
                    document.getElementById("edge-arrow").value = "to,form";
                }
                else if (arrowto == true) {
                    document.getElementById("edge-arrow").value = "to";
                }
                else if (arrowfrom == true) {
                    document.getElementById("edge-arrow").value = "from";
                }
                else {
                    document.getElementById("edge-arrow").value = "";
                }
            }
            document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(
                this,
                data,
                callback
            );
            document.getElementById("edge-cancelButton").onclick = cancelEdgeEdit.bind(
                this,
                callback
            );
            document.getElementById("edge-popUp").style.display = "block";
        }
        //else if (data.id != undefined) {
        //    //filling in the popup DOM elements
        //    if (data.label != undefined) {
        //        document.getElementById("edge-label").value = data.label;
        //    }

        //    //document.getElementById("edge-arrow").value = data.arrows;
        //    if (data.id != undefined) {
        //        //$(`#ddledgecolor option[value='${network.body.nodes[data.id].options.color.background}']`).prop('selected', true);
        //        var arrowto = network.body.edges[data.id].options.arrows.to.enabled
        //        var arrowfrom = network.body.edges[data.id].options.arrows.from.enabled
        //        //var arrowmiddle = network.body.edges[cliEdge.id].options.arrows.to.enabled
        //        if (arrowto == true && arrowfrom == true) {
        //            document.getElementById("edge-arrow").value = "to,form";
        //        }
        //        else if (arrowto == true) {
        //            document.getElementById("edge-arrow").value = "to";
        //        }
        //        else if (arrowfrom == true) {
        //            document.getElementById("edge-arrow").value = "from";
        //        }
        //        else {
        //            document.getElementById("edge-arrow").value = "";
        //        }
        //    }

        //    document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(
        //        this,
        //        data,
        //        callback
        //    );
        //    document.getElementById("edge-cancelButton").onclick = cancelEdgeEdit.bind(
        //        this,
        //        callback
        //    );
        //    document.getElementById("edge-popUp").style.display = "block";
        //}
        else {
            alert("Node Degree limit exist");
        }
    }
    else {
        var fromnodeconnectededge = network.getConnectedEdges(data.from);
        var tonodeconnectededge = network.getConnectedEdges(data.to);
        fromnodeconnectededge.forEach(function (item, index) {
            var fromedgefrom = network.body.edges[item].options.from;
            var fromedgeto = network.body.edges[item].options.to;
            if (fromedgefrom == data.from && fromedgeto == data.to || fromedgefrom == data.to && fromedgeto == data.from) {
                servicefromedgefrom = fromedgefrom;
                servicefromedgeto = fromedgeto;
            }
        });
        tonodeconnectededge.forEach(function (item, index) {
            var toedgefrom = network.body.edges[item].options.from
            var toedgeto = network.body.edges[item].options.to
            if (toedgefrom == data.from && toedgeto == data.to || toedgefrom == data.to && toedgeto == data.from) {
                servicetoedgefrom = toedgefrom;
                servicetoedgeto = toedgeto;
            }

        });
        if (servicefromedgefrom != undefined && servicefromedgeto != undefined || servicetoedgefrom != undefined && servicetoedgeto != undefined) {
            var fromnodetype = network.body.nodes[data.from].options.component_type;
            var tonodetype = network.body.nodes[data.to].options.component_type;
            if (fromnodetype == "RODAM" && tonodetype == "RODAM") {
                if (data.label != undefined) {
                    document.getElementById("edge-label").value = data.label;
                }
                //document.getElementById("edge-arrow").value = data.arrows;
                if (data.id != undefined) {
                    var arrowto = network.body.edges[data.id].options.arrows.to.enabled
                    var arrowfrom = network.body.edges[data.id].options.arrows.from.enabled
                    //var arrowmiddle = network.body.edges[cliEdge.id].options.arrows.to.enabled
                    if (arrowto == true && arrowfrom == true) {
                        document.getElementById("edge-arrow").value = "to,form";
                    }
                    else if (arrowto == true) {
                        document.getElementById("edge-arrow").value = "to";
                    }
                    else if (arrowfrom == true) {
                        document.getElementById("edge-arrow").value = "from";
                    }
                    else {
                        document.getElementById("edge-arrow").value = "";
                    }
                }
                document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById("edge-cancelButton").onclick = cancelEdgeEdit.bind(
                    this,
                    callback
                );
                document.getElementById("edge-popUp").style.display = "block";
            }
            else {
                //clearEdgePopUp();
                document.getElementById("edge-popUp").style.display = "none";
                alert("Service not add between amplifier/attenuator/transceiver node");
                isAddService = 0;
            }
        }
        else {
            alert("Create fiber then  service add");
        }
    }


}

function clearEdgePopUp() {
    document.getElementById("edge-label").value = "";
    document.getElementById("edge-saveButton").onclick = null;
    document.getElementById("edge-cancelButton").onclick = null;
    document.getElementById("edge-popUp").style.display = "none";
}

function cancelEdgeEdit(callback) {
    clearEdgePopUp();
    data.componentType = 'edge';
    if (isService == 1) {
        data.dashes = true;
        data.label = document.getElementById("edge-label").value;
        data.font = fontstyle1;
        data.color = "red";
        data.arrows = document.getElementById("edge-arrow").value;
        data.smooth = smooth1;
        data.componentType = 'service';
        isService = 0;
    }
    callback(null);
}

function AddService() {
    disableFiberService();
    isService = 1;
    data.componentType = 'service';
    network.addEdgeMode();
}
function RemoveSelection() {
    disableFiberService();
    var deletenodeconectededge = localStorage.getItem("deletenodeconectededge");
    if (deletenodeconectededge == "0" || deletenodeconectededge == "") {
        network.deleteSelected();
    } else {
        alert("Unpair node and delete");
    }
    localStorage.setItem("deletenodeconectededge", "");
}
function AddEdgeMode() {
    disableFiberService();
    isService = 0;
    network.addEdgeMode();
}
function EditEdgeMode() {
    disableFiberService();
    network.editEdgeMode();
}
//1-roadm, 2-amp, 3-fused
function AddNodeMode(nodemode) {

    nodeMode = nodemode;
    disableFiberService();
    network.addNodeMode();
}
function EditNodeMode() {
    disableFiberService();
    network.editNode();
}
function htmlTitle(html, backcolor) {
    const container = document.createElement("pre");
    container.innerHTML = html;
    container.style.background = backcolor;
    container.style.color = "black";
    container.style.transition = "all 1s ease-in-out";
    return container;
}
function saveEdgeData(data, callback) {
    if (isService != 1) {
        if (typeof data.to === "object") data.to = data.to.id;
        if (typeof data.from === "object") data.from = data.from.id;
        //data.length = document.getElementById("edge-length").value;
        data.label = document.getElementById("edge-label").value;
        _insertnodeDB({ id: data.id }).update({ label: data.label });
        //var fromnode = network.getConnectedNodes(data.from)
        //var fromlen = Number(fromnode.length).toString();
        //var tonode = network.getConnectedNodes(data.to)
        //var tolen = Number(tonode.length).toString();            
        //var text = 'abcdefghijklmnopqrstuvwxyz';
        //for (var i = 0; i < text.length; i++) {
        //    var code = text.toUpperCase().charCodeAt(i)
        //    if (code > 64 && code < 91) {
        //        var result = (code - 64) + " ";
        //        if (result.trim() == Number(fromlen) + 1) {
        //            data.labelFrom = text[i];
        //        }
        //        if (result.trim() == Number(tolen) + 1) {
        //            data.labelTo = text[i];
        //        }
        //    }
        //}

        data.title = document.getElementById("edge-title").value.toString();
        data.arrows = document.getElementById("edge-arrow").value.toString();
        if (document.getElementById("ddledgecolor").value != 0 && document.getElementById("ddledgecolor").value !== "" && document.getElementById("ddledgecolor").value != undefined) {
            data.color = document.getElementById("ddledgecolor").value;
        }
        data.font = fontstyle1;
        data.componentType = 'edge';
        if (document.getElementById("edgeDashes").value == "true") {
            data.dashes = document.getElementById("edgeDashes").value;
        }
        var existedgedb = _edgesDB({ from: data.from, to: data.to }).get();
        if (existedgedb.length != 0) {
            //_edgesDB({ from: data.from, to: data.to }).update({ edgeLength: data.length, label: data.label, color: data.color, arrows: data.arrows, dashes: data.dashes });
            _edgesDB({ from: data.from, to: data.to }).update({ label: data.label, color: data.color, arrows: data.arrows, dashes: data.dashes });
        }
        else {
            //_edgesDB.insert({ "from": data.from, "to": data.to, "edgeLength": data.length, "dashes": data.dashes, "arrows": data.arrows, "label": data.label })
            _edgesDB.insert({ "from": data.from, "to": data.to, "dashes": data.dashes, "arrows": data.arrows, "label": data.label })
        }
        clearEdgePopUp();
        callback(data);
    }
    else {
        //var fromnodetype = network.body.nodes[data.from].options.nodetype;
        //var tonodetype = network.body.nodes[data.to].options.nodetype;
        //if (fromnodetype == "ROADM" && tonodetype == "ROADM") {
        data.dashes = true;
        data.label = document.getElementById("edge-label").value;
        data.font = fontstyle1;
        data.color = "red";
        data.arrows = document.getElementById("edge-arrow").value;
        data.smooth = smooth1;
        data.componentType = 'service';
        isService = 0;
        document.getElementById("edge-popUp").style.display = "none";
        clearEdgePopUp();
        callback(data);
        //}
        //else {
        //    //document.getElementById("edge-popUp").style.display = "none";
        //    clearEdgePopUp();
        //    //callback(data);
        //    alert("Service not add between amplifier node");
        //}
    }
}

var fontstyle1 = {
    align: "top",

}
var Unidirection = {
    to: {
        enabled: false,
        type: "arrow",
    },
    from: {
        enabled: true,
        type: "arrow",
    },
}
var Bidirection = {
    to: {
        enabled: true,
        type: "arrow",
    },
    from: {
        enabled: true,
        type: "arrow",
    },
}
var smooth1 = {
    enabled: true,
    type: "curvedCW",
    roundness: ".2",
}




function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}




function AddData(data, id) {
    disableFiberService();
    document.getElementById("edgecontextMenu").style.display = "none";
    document.getElementById("network-popUp").style.display = "none";
    document.getElementById("node-popUp").style.display = "block";
    document.getElementById("nodeSaveButton").onclick = AddNode.bind(
        this, id
    );

    //var from_id = document.getElementById("node-id").value;
    //var myNode = network.getConnectedNodes(from_id)
    //if (myNode.length == 1) {
    //    $("#trId").hide();
    //}
    //else {
    //    $("#trId").show();
    //    document.getElementById("edgeLen").value = "";
    //}
}
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

function clearOutputArea() {
    //exportArea.value = "";
}

function exportNetwork(isSaveNetwork) {
    disableFiberService();
    testing();
    clearOutputArea();

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



    //var projectDetails = {
    //    projectname: tempProjectName,
    //    layoutname: tempLayoutName
    //}

    //var model = {
    //    nodes: nodesModel,
    //    edges: edgesModel,
    //    projectdetails: projectDetails
    //}

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
            to_node:item.to
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

function download(exportValue) {

}

//async function addNetworData(netData) {
//    try {
//        netmodel = {
//            id: "1",
//            name: netData
//        }
//        var noOfDataInserted = await jsstoreCon.insert({
//            into: 'tbl_network',
//            values: [netmodel]
//        });

//        if (noOfDataInserted === 1) {
//            alert('successfully added');
//        }
//    } catch (ex) {
//        var noOfDataInserted = await jsstoreCon.update({
//            in: 'tbl_network',
//            set: {
//                name: netData,
//            },
//            where: {
//                id: "1"
//            }
//        });
//        if (noOfDataInserted === 1) {
//            alert('successfully updated');
//        }
//    }
//}

var importNodes = [];
var importEdges = [];

var _eqpt_json;
var isEqptFile = false;
function handleEqptFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handlEqpteFileLoad;
    reader.readAsText(event.target.files[0])
}

function handlEqpteFileLoad(event) {
    _eqpt_json = event.target.result;
    loadEqpt();
}
function loadEqpt() {
    document.getElementById('import_Eqpt_button').addEventListener('change', handleEqptFileSelect, false);

    var inputValue = _eqpt_json;
    //var inputValue = exportArea.value;
    var eqptData = "";
    if (inputValue) {
        eqptData = JSON.parse(inputValue);
        isEqptFile = true;
        eqpt_config = eqptData;

        $('#ddlTransceiverType').empty();
        $('#ddlModeRate').empty();
        $('#ddlFiberAType').empty();
        $('#ddlFiberBType').empty();
        load_EqptConfig();

    }

}

function load_EqptConfig() {
    var isFirst = true;
    $.each(eqpt_config.Transceiver, function (index, item) {
        $('#ddlTransceiverType').append('<option value="' + item.type_variety + '">' + item.type_variety + '</option>');
        if (isFirst) {
            $.each(item.mode, function (i, value) {
                $('#ddlModeRate').append('<option value="' + value.format + '">' + value.format + '</option>');
            });
        }
        isFirst = false;
    });
    $.each(eqpt_config.Fiber, function (index, item) {
        $('#ddlFiberAType').append('<option value="' + item.type_variety + '">' + item.type_variety + '</option>');
        $('#ddlFiberBType').append('<option value="' + item.type_variety + '">' + item.type_variety + '</option>');

    });
    appendSinglePreAmpandBoosterType();
}


function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    createNewProject(event.target.files[0].name, configData.project.network_platform_layout[0]);
    reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
    //document.getElementById('input_output').textContent = "";
    //_import_json = document.getElementById('input_output').textContent = event.target.result;
    _import_json = event.target.result;
    importNetwork();
}
function importNetwork() {
    disableFiberService();
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
    createNewProject(inputData.projectdetails.projectname, inputData.projectdetails.layoutname);
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
                //document.getElementById("saveRoadmNode").onclick = addNodes.bind(
                //    this,
                //    data,
                //    callback
                //);
                //document.getElementById("closeSingle").onclick = clearRoadm.bind();
                //openDrawer('single');
            },
        },
    };
    $("#mynetwork").show();
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
        if (isAddEdge == 1) {
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
                manualAddEdge();
        }
        if (isAddService == 1) {
            isAddEdge = 0;
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
                manualAddService();

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
                document.getElementById("rightClickServiceEdit").onclick = rightClickServiceEdit.bind();
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
            else if (type == fiberJSON.component_type) {

                //var getrightclickedge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
                if (edgeData != undefined) {
                    showContextMenu(data.event.pageX, data.event.pageY, "fiberMenu");
                    document.getElementById("InsertNode").addEventListener('click', function () {
                        AddData(this, 0);
                    });
                    document.getElementById("Copy").onclick = copy.bind();
                    //document.getElementById("Paste").onclick = paste.bind();
                    document.getElementById("rightClickEdgeEdit").onclick = rightClickEdgeEdit.bind();
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
    // removeDefaultElement();

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
    disableFiberService();
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

//async function deletedata(id) {
//    try {
//        var noOfStudentRemoved = await jsstoreCon.remove({
//            from: 'tbl_network',
//            where: {
//                id: id
//            }
//        });
//    } catch (ex) {
//        alert(ex.message);
//    }
//}

var isAddEdge = 0;
var addEdgeData = {
    from: '',
    to: ''
};
function manualAddEdge() {
    var fromcounter = 0;
    var tocounter = 0;

    var fromnodedegree = nodes.get(addEdgeData.from).node_degree;
    var tonodedegree = nodes.get(addEdgeData.to).node_degree;
    var fromnodeconnectededge = network.getConnectedEdges(addEdgeData.from);
    var tonodeconnectededge = network.getConnectedEdges(addEdgeData.to);
    fromnodeconnectededge.forEach(function (item, index) {
        var formnodeconnecteddataset = edges.get();
        for (i = 0; i < formnodeconnecteddataset.length; i++) {
            if (item == formnodeconnecteddataset[i].id) {
                if (formnodeconnecteddataset[i].component_type == fiberJSON.component_type) {
                    fromcounter = fromcounter + 1;
                }
            }
        }
    });
    tonodeconnectededge.forEach(function (item, index) {
        var tonodeconnecteddataset = edges.get();
        for (i = 0; i < tonodeconnecteddataset.length; i++) {
            if (item == tonodeconnecteddataset[i].id) {
                if (tonodeconnecteddataset[i].component_type == fiberJSON.component_type) {
                    tocounter = tocounter + 1;
                    //console.log("hi");
                }
            }
        }
    });
    if (fromcounter < Number(fromnodedegree) && tocounter < Number(tonodedegree)) {
        var labelvalue = fiberJSON.component_type + " " + nodes.get(addEdgeData.from).number + ' - ' + nodes.get(addEdgeData.to).number;
        var textvalue = roadmJSON.node_type + "- [ " + nodes.get(addEdgeData.from).label + ' - ' + nodes.get(addEdgeData.to).label + " ]";
        addFiberComponent(1, addEdgeData.from, addEdgeData.to, labelvalue, textvalue);
        addEdgeData = {
            from: '',
            to: ''
        };
        UnSelectAll();
    }
    else {

        var nodeName = "";
        if (fromcounter >= Number(fromnodedegree)) {
            nodeName = nodes.get(addEdgeData.from).label + ' ';
        }
        if (tocounter >= Number(tonodedegree)) {
            nodeName += nodes.get(addEdgeData.to).label;
        }
        alert(nodeName + " : node degree limit exist");
        UnSelectAll();
        addEdgeData = {
            from: '',
            to: ''
        };
    }
}
function manualAddEdgeMode() {
    UnSelectAll();
    isAddEdge = 1;
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
function manualAddService() {

    var fromnodetype = network.body.nodes[addServiceData.from].options.node_type;
    var tonodetype = network.body.nodes[addServiceData.to].options.node_type;
    if (fromnodetype == roadmJSON.node_type && tonodetype == roadmJSON.node_type) {
        var labelvalue = serviceJSON.component_type + ' ' + nodes.get(addServiceData.from).number + ' - ' + nodes.get(addServiceData.to).number;
        addServiceComponent(1, addServiceData.from, addServiceData.to, labelvalue);
        addServiceData = {
            from: '',
            to: ''
        };
        UnSelectAll();
    } else {
        alert("Service not add between amplifier/attenuator/transceiver node");
        addServiceData = {
            from: '',
            to: ''
        };
        UnSelectAll();
    }

}
function manualAddServiceMode() {
    UnSelectAll();
    isAddService = 1;
    isAddEdge = 0;
    addServiceData = {
        from: '',
        to: ''
    };
}

var fontstyle1 = {
    align: "top",

}
var arrows1 = {
    to: {
        enabled: true,
        type: "arrow",
    },
    from: {
        enabled: true,
        type: "arrow",
    },
}

var smooth1 = {
    enabled: true,
    type: "curvedCW",
    roundness: ".2",
}



function copy() {
    disableFiberService();
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
    disableFiberService();
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
    disableFiberService();
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

//function zoomin() {
//    var myImg = document.getElementById("mynetwork");
//    var currWidth = myImg.clientWidth;
//    if (currWidth == 500) {
//        alert("Maximum zoom-in level reached.");
//    } else {
//        myImg.style.width = (currWidth + 50) + "px";
//    }
//}
//function zoomout() {
//    var myImg = document.getElementById("mynetwork");
//    var currWidth = myImg.clientWidth;
//    if (currWidth == 50) {
//        alert("Maximum zoom-out level reached.");
//    } else {
//        myImg.style.width = (currWidth - 50) + "px";
//    }
//}

function disableFiberService() {
    isAddEdge = 0;
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



function closemodal() {
    $("#myModal").hide();
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

function closenodemodal() {
    $("#nodeModal").hide();
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


        network.body.data.edges.add({
            id: fiberID, from: cfrom, to: cto, label: clabel, dashes: fiberJSON.dashes,
            component_type: fiberJSON.component_type, color: fiberJSON.options.color,
            background: fiberJSON.options.background, arrows: fiberJSON.options.arrows, font: fiberJSON.options.font, smooth: fiberJSON.options.smooth

        });

    }
}


//Add service//cmode 1-add
function addServiceComponent(cmode, cfrom, cto, clabel) {

    if (cmode == 1) {
        network.body.data.edges.add({
            id: token(), from: cfrom, to: cto, label: clabel, dashes: serviceJSON.dashes,
            component_type: serviceJSON.component_type, color: serviceJSON.options.color, background: serviceJSON.options.background, arrows: serviceJSON.options.arrows, font: serviceJSON.options.font, smooth: serviceJSON.options.smooth
        });
    }
}

//Add node nodeMode - 1-roadm, 2-amp, 3=fused, 4-transceiver
function addNodes(data, callback) {

    var nodeDetails = "";
    var nodeShape = "";
    var nodeColor = "";

    if (nodeMode == 1) {
        nodeDetails = configData.node[roadmJSON.node_type];
        data.image = DIR + roadmJSON.image;
    }
    else if (nodeMode == 2 || nodeMode == 3 || nodeMode == 4) {

        if (nodeMode == 2) {
            nodeDetails = configData.node[ampJSON.node_type];
            nodeShape = ampJSON.shape;
            nodeColor = ampJSON.color;
            data.image = DIR + ampJSON.image;
            data.pre_amp_type = nodeDetails.default.pre_amp_type;
            data.booster_type = nodeDetails.default.booster_type;
        }
        else if (nodeMode == 3) {
            nodeDetails = configData.node[fusedJSON.node_type];
            nodeShape = fusedJSON.shape;
            nodeColor = fusedJSON.color;
            data.image = DIR + fusedJSON.image;
            data.pre_amp_type = nodeDetails.default.pre_amp_type;
            data.booster_type = nodeDetails.default.booster_type;
        }
        else if (nodeMode == 4) {
            nodeDetails = configData.node[transceiverJSON.node_type];
            nodeShape = transceiverJSON.shape;
            nodeColor = transceiverJSON.color;
            data.image = DIR + transceiverJSON.image;
            data.transceiver_type = nodeDetails.default.transceiver_type;
            data.transceiver_mode = nodeDetails.default.transceiver_mode;
        }
        data.shape = nodeShape;
        data.color = nodeColor;

    }
    else
        return;

    data.id = token();
    var nodelength = localStorage.getItem("nodelength");
    var nodeLable = nodeDetails.default.label + (nodelength == null ? "1" : nodelength).toString();
    //data.text = nodeLable;
    data.number = nodelength;
    data.label = nodeLable;
    data.id = nodeLable;
    data.node_type = nodeDetails.default.node_type;
    data.node_degree = nodeDetails.default.node_degree;
    data.component_type = roadmJSON.component_type;
    //nodeMode = "";

    callback(data);

    if (nodeMode == 1 || nodeMode == 2 || nodeMode == 3 || nodeMode == 4)
        network.addNodeMode();


}

function clearRoadm() {
    $("#txtRoadmName").val('');
    //$("#ddlNodeType").val();
    //$("#txtNodeDegree").val('');
    //$("#ddlPreAmpType").val(0);
    //$("#ddlBoosterType").val(0);
    $("#divRoadmPro").empty();
    closeDrawer('roadm');
    network.unselectAll();
    //$("#closeNodeEditConfirm").click();
    _roadmListDB().remove();
}
function clearAttenuator() {
    $("#txtAttenuatorName").val('');
    closeDrawer('Attenuator');
}

function roadmEdit(nodeID, callback) {
    //alert();
    _roadmListDB().remove();
    disableFiberService();
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
            if (edges.get(item).component_type == fiberJSON.component_type)
                loadRoadmType(item, nodeID, nodeDetails.node_type);
        });
    }
    else if (nodeDetails.node_type == ampJSON.node_type) {
        $("#divPreBoosterType").show();
        //appendSinglePreAmpandBoosterType(nodeDetails.node_type);
        $("#ddlPreAmpType").val(nodeDetails.pre_amp_type);
        $("#ddlBoosterType").val(nodeDetails.booster_type);
    }
    else if (nodeDetails.node_type == transceiverJSON.node_type) {
        $("#divTransceiverNode").show();

        $("#ddlTransceiverType").val(nodeDetails.transceiver_type);
        //loadTransceiverMode($("#ddlTransceiverType").val());
        $("#ddlModeRate").val(nodeDetails.transceiver_mode);
    }



    document.getElementById("btnUpdateRoadm").onclick = updateRoadm.bind(
        this,
        nodeID,
        callback
    );

    document.getElementById("btnCloseRoadm").onclick = clearRoadm.bind(
    );
}
function attenuatorEdit(nodeID, callback) {
    disableFiberService();
    document.getElementById("attenuatorMenu").style.display = "none";
    openDrawer('Attenuator');
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
function deleteNode(nodeID) {

    var isDelete = confirm('do you want to delete site : ' + nodes.get(nodeID).label + ' ?');
    if (!isDelete)
        return;
    disableFiberService();
    document.getElementById("roadmMenu").style.display = "none";
    if (network.getConnectedEdges(nodeID).length > 0) {
        alert("Unpair node then delete");

    } else {
        nodes.remove(nodeID);
    }
    network.unselectAll();
}
function updateRoadm(nodeID) {

    var id = nodeID;
    var label = $("#txtRoadmName").val().trim();
    var node_type = nodes.get(nodeID).node_type

    if (addSingleNodeVal("txtRoadmName")) {

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
        }
        //else if (node_type == ampJSON.node_type) {

        //    network.body.data.nodes.update({
        //        id: id, label: label, pre_amp_type: $("#ddlPreAmpType").val(), booster_type: $("#ddlBoosterType").val(),
        //    });
        //}
        //else if (node_type == fusedJSON.node_type) {
        //    network.body.data.nodes.update({
        //        id: id, label: label
        //    });
        //}
        //else if (node_type == transceiverJSON.node_type) {
        //    network.body.data.nodes.update({
        //        id: id, label: label, transceiver_type: $("#ddlTransceiverType").val(), transceiver_mode: $("#ddlModeRate").val(),
        //    });
        //}

        clearRoadm();
    }

}
function updateAttenuator(nodeID) {

    var id = nodeID;
    var label = $("#txtAttenuatorName").val().trim();
    var node_type = nodes.get(nodeID).node_type

    if (addSingleNodeVal("txtAttenuatorName")) {

        if (node_type == fusedJSON.node_type) {
            network.body.data.nodes.update({
                id: id, label: label
            });
            clearAttenuator();
        }

        
    }

}

function clearAmplifier() {
    $("#txtAmpName").val('');
    $("#txtAmpDegree").val();
    $("#ddlAmpCategory").val();
    $("#ddlAmpType").val();
    $("#ddlAmpShape").val();
    $("#ddlAmpColor").val();
    closeDrawer('amplifier');
    network.unselectAll();
}
function rightClickAmplifierEdit(ampID, callback) {
    //alert();
    disableFiberService();
    document.getElementById("ampMenu").style.display = "none";
    openDrawer('amplifier');

    var ampDetails = nodes.get(ampID);
    $("#txtAmpName").val(ampDetails.label);
    $("#ddlAmpCategory").val(ampDetails.nodecategory);
    $("#ddlAmpype").val(ampDetails.nodetype);
    $("#txtAmpDegree").val(ampDetails.nodedegree);
    $("#ddlAmpShape").val(ampDetails.shape);
    $("#ddlAmpColor").val(ampDetails.color.background);
    document.getElementById("saveAmplifier").onclick = updateAmplifier.bind(
        this,
        ampID,
        callback
    );
    document.getElementById("closeAmplifier").onclick = clearAmplifier.bind(
    );
}
function deleteAmplifier(ampID) {

    var isDelete = confirm('do you want to delete : ' + nodes.get(ampID).label + ' ?');
    if (!isDelete)
        return;
    disableFiberService();
    document.getElementById("ampMenu").style.display = "none";
    var deletenodeconectededge = localStorage.getItem("deletenodeconectededge");
    if (deletenodeconectededge == "0" || deletenodeconectededge == "") {
        network.deleteSelected(ampID);
    } else {
        alert("Unpair amplifier then delete");
    }
    localStorage.setItem("deletenodeconectededge", "");
    network.unselectAll();
}
function updateAmplifier(ampID) {

    var id = ampID;
    var label = $("#txtAmpName").val().trim() == '' ? "site 1" : $("#txtAmpName").val().trim();
    var nodecategory = $("#ddlAmpCategory option:selected").text();
    var nodetype = $("#ddlAmpType option:selected").text();
    var nodedegree = $("#txtAmpDegree").val().trim() == '' ? "2" : $("#txtAmpDegree").val().trim();
    var shape = $("#ddlAmpShape option:selected").text();
    var Color = $("#ddlAmpColor option:selected").text();

    network.body.data.nodes.update({
        id: id, label: label, shape: shape, nodetype: nodetype, nodedegree: nodedegree, nodecategory: nodecategory, color: { background: Color, border: Color }
    });
    clearAmplifier();
}

function deleteFiber(fiberID) {
    var isDelete = confirm('do you want to delete fiber : ' + edges.get(fiberID).label + ' ?');
    if (!isDelete)
        return;
    disableFiberService();
    document.getElementById("fiberMenu").style.display = "none";

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
function rightClickEdgeEdit(fiberID, callback) {
    disableFiberService();
    document.getElementById("fiberMenu").style.display = "none";

    openDrawer('fibre');
    var edgeDetails = edges.get(fiberID);
    $("#txtFiberName").val(edgeDetails.label);
    var connectedNode = network.getConnectedNodes(fiberID);

    $("#pFiberA").text("Fiber A [" + nodes.get(connectedNode[0]).label + ' - ' + nodes.get(connectedNode[1]).label + "]");
    $("#pFiberB").text("Fiber B [" + nodes.get(connectedNode[1]).label + ' - ' + nodes.get(connectedNode[0]).label + "]");

    document.getElementById("fiberApply").onclick = popupsaveedgeData.bind(
    );
    document.getElementById("fiberCancel").onclick = edgecancelNodeEdit.bind(
    );
}
function rightClickServiceEdit() {
    disableFiberService();
    document.getElementById("serviceMenu").style.display = "none";
    openDrawer('service');
    document.getElementById("serviceApply").onclick = popupsaveedgeData.bind(
    );
    document.getElementById("serviceCancel").onclick = edgecancelNodeEdit.bind(
    );
}

function edgecancelNodeEdit() {
    closeDrawer('fibre');
    network.unselectAll();
}

function popupsaveedgeData() {
    closeDrawer('fibre');
}

function closeMenu(menuID) {
    document.getElementById(menuID).style.display = "none";
    network.unselectAll();
}
//append node,preamp, booster type
function appendSinglePreAmpandBoosterType() {
    $('#ddlPreAmpType').empty();
    $('#ddlBoosterType').empty();
    $.each(eqpt_config.Roadm, function (index, item) {
        var preAmpType = item.restrictions.preamp_variety_list;
        var boosterType = item.restrictions.booster_variety_list;

        $.each(preAmpType, function (i, value) {
            $('#ddlPreAmpType').append('<option value="' + value + '">' + value + '</option>');
        });
        $.each(boosterType, function (i, value) {
            $('#ddlBoosterType').append('<option value="' + value + '">' + value + '</option>');
        });
    });


}

//append node, preamp, booster type for dynamic ele
function appendPreAmpandBoosterType(nodeType, ddlID) {

    var preAmpType = [];
    var boosterType = [];

    $.each(eqpt_config.Roadm, function (index, item) {
        preAmpType = item.restrictions.preamp_variety_list;
        boosterType = item.restrictions.booster_variety_list;
    });

    var ddlroadmtype = "#" + eleroadmtype + ddlID;
    var ddlpreamptype = "#" + elepreamptype + ddlID;
    var ddlboostertype = "#" + eleboostertype + ddlID;

    $.each(configData.node.roadm_type, function (index, item) {
        $(ddlroadmtype).append('<option value="' + item + '">' + item + '</option>');
    });

    $.each(preAmpType, function (index, item) {
        $(ddlpreamptype).append('<option value="' + item + '">' + item + '</option>');
    });
    $.each(boosterType, function (index, item) {
        $(ddlboostertype).append('<option value="' + item + '">' + item + '</option>');
    });


}

//show context menu on righ click of component
function showContextMenu(x, y, menu) {

    document.getElementById("roadmMenu").style.display = "none";
    document.getElementById("attenuatorMenu").style.display = "none";
    document.getElementById("serviceMenu").style.display = "none";

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
function createNewProject(projectName, layoutName) {
    tempProjectName = projectName;
    tempLayoutName = layoutName;
    $("#displayPN").text(projectName);
    //$("#cardNetworkArea, #divNodeFiber").removeClass('disableDiv');
    //$("#divNodeFiber").removeClass('disableDiv');
    $("#mynetwork").show();
    //$("#divWelcome").hide();
    $("#staticBackdrop").modal('hide');
    $("#stepGP").click();
}
function networkValidation() {
    var flag = false;
    if (nodes.get().length > 0 || edges.get().length > 0)
        flag = true;
    else {
        alert('Please create node and fiber.');
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
function loadTransceiverMode(transceiverType) {
    $('#ddlModeRate').empty();
    $.each(eqpt_config.Transceiver, function (index, item) {
        if (transceiverType == item.type_variety) {
            $.each(item.mode, function (i, value) {
                $('#ddlModeRate').append('<option value="' + value.format + '">' + value.format + '</option>');
            });
            return;
        }
    });
}