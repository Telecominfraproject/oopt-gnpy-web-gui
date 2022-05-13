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

$(document).ready(function () {
    $.getJSON("/Data/MasterData.json", function (data) {
        console.log(data.name);
        console.log(data.age); 
    }).fail(function () {
        console.log("An error has occurred.");
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

//async function readdata() {
//    dat = await jsstoreCon.select({
//        from: 'tbl_network', where: { id: '1' }
//    });
//    console.log(dat);
//}
//async function initDb() {
//    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
//    if (isDbCreated) {
//        console.log('db created');
//    }
//    else {
//        console.log('db opened');
//    }

//}

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

function setDefaultLocale() {
    var defaultLocal = navigator.language;
    var select = document.getElementById("locale");
    select.selectedIndex = 0; // set fallback value
    for (var i = 0, j = select.options.length; i < j; ++i) {
        if (select.options[i].getAttribute("value") === defaultLocal) {
            select.selectedIndex = i;
            break;
        }
    }
}

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
                var conf = confirm('Are you want to load network data from local storage ?');
                if (conf) {
                    //nodes = new vis.DataSet(tempData.nodes);
                    //edges = new vis.DataSet(tempData.edges);

                    _edgesDB.insert(tempData)

                    nodes = getNodeData(tempData.nodes);
                    edges = getEdgeData(tempData.edges);
                    counter = counter + Number(nodes.length);
                    localStorage.setItem("nodelength", counter);
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
        //layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
        //locale: document.getElementById("locale").value,
        interaction: { navigationButtons: true, keyboard: true, dragView: false, multiselect: true, hover: true },
        physics: false,
        //edges: {
        //    color: {
        //        inherit: falsefunction copy()
        //    },
        //},
        nodes: {
            shape: "dot",
            size: 8
        },
        edges: {
            smooth: {
                enabled: false,
                type: 'continuous'
            },
        },
        manipulation: {
            enabled: false,
            addNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById("operation").innerText = "Add Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = "site 1";
                document.getElementById("node-degree").value = "5";
                document.getElementById("ddlnodeshape").value = "dot";
                document.getElementById("ddlnodeType").value = "ROADM";
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById(
                    "cancelButton"
                ).onclick = clearPopUp.bind();
                document.getElementById("network-popUp").style.display = "block";

            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById("operation").innerText = "Edit Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = data.label;
                document.getElementById("node-degree").value = data.nodedegree;
                document.getElementById("ddlnodeType").value = data.nodetype;
                document.getElementById("ddlnodeshape").value = data.shape;
                data.nodeedit = "true";
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById("cancelButton").onclick = cancelEdit.bind(
                    this,
                    callback
                );
                document.getElementById("addButton").addEventListener('click', function () {
                    AddData(this, 0);
                });
                document.getElementById("addAmpButton").addEventListener('click', function () {
                    AddData(this, 1);
                });
                document.getElementById("addTraffButton").addEventListener('click', function () {
                    AddData(this, 2);
                });
                document.getElementById("network-popUp").style.display = "block";
            },

            addEdge: function (data, callback) {
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r != true) {
                        callback(null);
                        return;
                    }
                }
                document.getElementById("edge-operation").innerText = "Add Edge";
                editEdgeWithoutDrag(data, callback);
            },
            editEdge: {
                editWithoutDrag: function (data, callback) {
                    document.getElementById("edge-operation").innerText = "Edit Edge";
                    editEdgeWithoutDrag(data, callback);
                },
            },
        },
    };
    network = new vis.Network(container, data, options);
    network.on("click", function (params) {
        params.event = "[original event]";
        console.log(params.pointer);
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
        _insertnodeDB().remove();

        if (data.edges.length > 1 || data.edges.length == 0) {
            copyData.edges = [];
            copyData.nodes = [];
            copyData.dataCopied = false;
            return;
        }
        //var getnodedata = edges.get();
        var clickedEdge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
        data.label = network.body.edges[data.edges[0]].options.label;
        //data.to = network.body.edges[data.edges].options.to;
        //data.labelFrom = network.body.edges[data.edges].options.labelFrom;
        //data.labelTo = network.body.edges[data.edges].options.labelTo;
        _insertnodeDB.insert({ "id": data.edges[0], "type": "NodeInsert", "label": data.label });
        setCopyData(clickedEdge.options.id, '');
    });
    network.on("selectNode", function (params) {
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        var deletenode = network.getConnectedEdges(clickedNode.id);
        localStorage.setItem("deletenodeconectededge", deletenode.length);
        _nodesDB.insert({ "id": clickedNode.id, "type": "node" });
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

            console.log(addServiceData);
            if (addServiceData.from != '' && addServiceData.to != '')
                manualAddService();

            console.log(addServiceData);

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
    network.on("oncontext", function (data) {
        //data.preventDefault();
        var type = _nodesDB().first();
        if (type.type == "node") {
            var getrightclicknode = this.body.nodes[this.getNodeAt(data.pointer.DOM)];
            if (getrightclicknode != undefined) {
                document.getElementById("edgecontextMenu").style.display = "none";
                $("#contextMenu").css({ left: (data.event.pageX + 20) + "px", top: (data.event.pageY + 20) + "px" });
                document.getElementById("contextMenu").style.display = "block";
                var cliNode = this.body.nodes[this.getNodeAt(data.pointer.DOM)];
                document.getElementById("nodeiddetails").value = cliNode.id;
                data.id = cliNode.id
                var clickedNode = network.body.nodes[cliNode.id].options.label;
                document.getElementById("nodeeditlabel").value = clickedNode;
                document.getElementById("nodeedit-degree").value = network.body.nodes[cliNode.id].options.nodedegree;
                document.getElementById("ddleditnodeType").value = network.body.nodes[cliNode.id].options.nodetype;
                //$(`#ddlshape option[value='${network.body.nodes[cliNode.id].options.shape}']`).prop('selected', true);
                //$(`#ddlcolor option[value='${network.body.nodes[cliNode.id].options.color.background}']`).prop('selected', true);
                $('#ddlshape').val(network.body.nodes[cliNode.id].options.shape);
                $('#ddlcolor').val(network.body.nodes[cliNode.id].options.color.background);
                document.getElementById("rightClickNodeEdit").onclick = rightClickNodeEdit.bind();
                document.getElementById("rightClickNodeDelete").onclick = deleteNodeEdge.bind();
            }
        }
        else {
            var getrightclickedge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
            if (getrightclickedge != undefined) {
                document.getElementById("contextMenu").style.display = "none";
                document.getElementById("edgecontextMenu").style.display = "block";
                $("#edgecontextMenu").css({ left: (data.event.pageX + 20) + "px", top: (data.event.pageY + 20) + "px" });
                var cliEdge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
                document.getElementById("edgeiddetails").value = cliEdge.id;
                document.getElementById("from").value = network.body.edges[cliEdge.id].options.from;
                document.getElementById("to").value = network.body.edges[cliEdge.id].options.to;
                if (network.body.edges[cliEdge.id].options.label != undefined) {
                    var clickedEdge = network.body.edges[cliEdge.id].options.label;
                    document.getElementById("edgelabel").value = clickedEdge;
                }
                var arrowto = network.body.edges[cliEdge.id].options.arrows.to.enabled
                var arrowfrom = network.body.edges[cliEdge.id].options.arrows.from.enabled
                //var arrowmiddle = network.body.edges[cliEdge.id].options.arrows.to.enabled
                if (arrowto == true && arrowfrom == true) {
                    document.getElementById("edgearrow").value = "to,form";
                }
                else if (arrowto == true) {
                    document.getElementById("edgearrow").value = "to";
                }
                else if (arrowfrom == true) {
                    document.getElementById("edgearrow").value = "from";
                }
                else {
                    document.getElementById("edgearrow").value = "";
                }
                document.getElementById("InsertNode").addEventListener('click', function () {
                    AddData(this, 0);
                });
                document.getElementById("Copy").onclick = copy.bind();
                //document.getElementById("Paste").onclick = paste.bind();
                document.getElementById("rightClickEdgeEdit").onclick = rightClickEdgeEdit.bind();
                document.getElementById("rightClickEdgeDelete").onclick = deleteNodeEdge.bind();
            }
            //else {
            //    document.getElementById("contextMenu").style.display = "none";
            //    document.getElementById("pastecontextMenu").style.display = "block";
            //    document.getElementById("Paste").onclick = paste.bind();
            //}
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
        //let answer = confirm("Do you really want to move it")
        //console.log(e);
        if (e.dataTransfer.getData("text") == "btnAddMode") {
            //var len = network.body.data.nodes.length;
            //var randomid = Number(len) + 1;
            //var counter = 0;
            counter = counter + 1;
            localStorage.setItem("nodelength", counter);
            var nodelength = localStorage.getItem("nodelength");
            if (nodelength != 0) {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + '' + Number(nodelength) + '',
                    nodedegree: "5",
                    nodetype: "ROADM",
                    shape: "dot",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            } else {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + 1,
                    nodedegree: "5",
                    nodetype: "ROADM",
                    shape: "dot",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            }
        }
        if (e.dataTransfer.getData("text") == "btnAddAmp") {
            //var len = network.body.data.nodes.length;
            //var randomid = Number(len) + 1;
            //var counter = 0;
            counter = counter + 1;
            localStorage.setItem("nodelength", counter);
            var nodelength = localStorage.getItem("nodelength");
            if (nodelength != 0) {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + '' + Number(nodelength) + '',
                    nodedegree: "5",
                    //nodetype: "ROADM",
                    shape: "triangle",
                    color: "red",
                    nodedegree: "2",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            } else {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + 1,
                    nodedegree: "5",
                    //nodetype: "ROADM",
                    shape: "triangle",
                    color: "red",
                    nodedegree: "2",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            }
        }

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
        console.log("blurEdge Event:", params);
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
    var somedata = getScaleFreeNetwork(10);
    console.log(somedata);
    var totalcount = Number($("#txtNofNode").val());
    var x = 0;
    var y = 0;
    for (var i = 1; i <= totalcount; i++) {
        x = x + 10;
        y = y + 10;
        //var len = network.body.data.nodes.length;
        //var randomid = Number(len) + 1;
        //var counter = 0;
        counter = counter + 1;
        localStorage.setItem("nodelength", counter);
        var nodelength = localStorage.getItem("nodelength");
        network.body.data.nodes.add({
            id: token(),
            label: "site " + '' + Number(nodelength) + '',
            nodedegree: "5",
            nodetype: "ROADM",
            shape: "dot",
            x: x,
            y: y,
            componentType: 'node'
        })
    }
}
/*Multiple node add End*/

function rightClickNodeEdit() {
    //alert();
    disableFiberService();
    document.getElementById("contextMenu").style.display = "none";
    document.getElementById("node-popUpdetails").style.display = "block";
    document.getElementById("nodesaveButton").onclick = popupsaveNodeData.bind(
    );
    document.getElementById("nodecancelButton").onclick = nodecancelNodeEdit.bind(
    );
}
function deleteNodeEdge() {
    disableFiberService();
    document.getElementById("contextMenu").style.display = "none";
    document.getElementById("edgecontextMenu").style.display = "none";
    //network.deleteSelected();
    var deletenodeconectededge = localStorage.getItem("deletenodeconectededge");
    if (deletenodeconectededge == "0" || deletenodeconectededge == "") {
        network.deleteSelected();
    } else {
        alert("Unpair node and delete");
    }
    localStorage.setItem("deletenodeconectededge", "");
}
function rightClickEdgeEdit() {
    disableFiberService();
    document.getElementById("edgecontextMenu").style.display = "none";
    document.getElementById("edge-popUpdetails").style.display = "block";
    document.getElementById("edgesaveButton").onclick = popupsaveedgeData.bind(
    );
    document.getElementById("edgecancelButton").onclick = edgecancelNodeEdit.bind(
    );
}


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

function edgecancelNodeEdit() {
    edgeclearNodePopUp();
    //callback(null);
}
function edgeclearNodePopUp() {
    document.getElementById("edgesaveButton").onclick = null;
    document.getElementById("edgecancelButton").onclick = null;
    document.getElementById("edge-popUpdetails").style.display = "none";
}
// Callback passed as parameter is ignored
function nodeclearNodePopUp() {
    document.getElementById("nodesaveButton").onclick = null;
    document.getElementById("nodecancelButton").onclick = null;
    document.getElementById("node-popUpdetails").style.display = "none";
}

function nodecancelNodeEdit() {
    nodeclearNodePopUp();
    //callback(null);
}

function popupsaveNodeData() {
    var id = document.getElementById("nodeiddetails").value;
    var label = document.getElementById("nodeeditlabel").value;
    var shape = document.getElementById("ddlshape").value;
    var color = document.getElementById("ddlcolor").value;
    var type = document.getElementById("ddleditnodeType").value;
    var degree = document.getElementById("nodeedit-degree").value;
    if (color != "" && color != 0) {
        network.body.data.nodes.update({
            id: id, label: label, shape: shape, color: color, nodetype: type, nodedegree: degree
        });
    }
    else {
        network.body.data.nodes.update({
            id: id, label: label, shape: shape, nodetype: type, nodedegree: degree
        });
    }
    document.getElementById("node-popUpdetails").style.display = "none";
}
function popupsaveedgeData() {
    var edgelabel = document.getElementById("edgelabel").value;
    var id = document.getElementById("edgeiddetails").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var editcolor = document.getElementById("ddleditedgecolor").value;
    var arrow = document.getElementById("edgearrow").value;
    //var color = document.getElementById("ddlcolor").value;
    //network.clustering.updateEdge(originalEdge.id, { label: label});
    if (editcolor != "0") {
        network.body.data.edges.update({
            id: id, length: length, color: editcolor, arrows: arrow, label: edgelabel
        });
    }
    else {
        network.body.data.edges.update({
            id: id, length: length, arrows: arrow, label: edgelabel
        });
    }
    //_edgesDB.insert({ "from": from, "to":to, "edgeLength":length})
    _insertnodeDB({ id: id }).update({ label: edgelabel });
    _edgesDB({ from: from, to: to }).update({ label: edgelabel, color: editcolor });
    document.getElementById("edge-popUpdetails").style.display = "none";
}
/*popup end*/

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
                    if (formnodeconnecteddataset[i].componentType == "edge") {
                        fromcounter = fromcounter + 1;
                    }
                }
            }
        });
        tonodeconnectededge.forEach(function (item, index) {
            var tonodeconnecteddataset = edges.get();
            for (i = 0; i < tonodeconnecteddataset.length; i++) {
                if (item == tonodeconnecteddataset[i].id) {
                    if (tonodeconnecteddataset[i].componentType == "edge") {
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
            var fromnodetype = network.body.nodes[data.from].options.componentType;
            var tonodetype = network.body.nodes[data.to].options.componentType;
            if (fromnodetype == "node" && tonodetype == "node") {
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
                alert("Service not add between amplifier node");
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
function AddNodeMode() {
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


function clearPopUp() {
    document.getElementById("node-degree").value = ""
    document.getElementById("edge-label").value = "";
    document.getElementById("saveButton").onclick = null;
    document.getElementById("cancelButton").onclick = null;
    document.getElementById("network-popUp").style.display = "none";
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveData(data, callback) {
    if (data.nodeedit != "true") {
        counter = counter + 1;
        //counter = counter + 1;
        localStorage.setItem("nodelength", counter);
        //var nodelength = localStorage.getItem("nodelength");
    }
    data.id = document.getElementById("node-id").value;
    data.label = document.getElementById("node-label").value;
    data.title = document.getElementById("node-title").value;
    var myshape = document.getElementById("ddlnodeshape").value;
    shape = myshape;
    // data.size = 8;
    var mycolor = document.getElementById("ddlnodecolor").value;
    color = mycolor;
    if (shape != undefined && shape != null && shape != "" && shape != 0) {
        data.shape = shape;
    }
    if (color != undefined && color != null && color != "" && color != 0) {
        data.color = color;
    }
    var nodetype = document.getElementById("ddlnodeType").value;
    data.nodetype = nodetype;
    data.componentType = "node";
    data.nodedegree = document.getElementById("node-degree").value;
    //if (document.getElementById("edgeFixed").value == "true") {
    //    fixed= document.getElementById("edgeFixed").value;
    //    //data.fixed.y = document.getElementById("edgeFixed").value;

    //}
    clearPopUp();
    callback(data);
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
    network.body.data.edges.add([{ from: dynamicToken, to: from_id, font: fontstyle1, componentType: "edge", label: edgelabel, color: "blue" }])
    network.body.data.edges.add([{ from: dynamicToken, to: to_id, font: fontstyle1, componentType: "edge", label: edgelabel, color: "blue" }])

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
        setDefaultLocale();
        draw(isImport);

    }
    else {
        setTimeout(function () {
            setDefaultLocale();
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
    //counter = 0;
    //var nodes = objectToArray(network.getPositions());
    //nodes.forEach(addConnections);
    // pretty print node data
    //var exportValue = JSON.stringify(nodes, undefined, 2);
    //exportArea.value = exportValue;

    var nodesModel = [];

    var edgesModel = [];
    $.each(network.body.nodes, function (i) {
        var data = {
            //options: network.body.nodes[i].options,
            id: network.body.nodes[i].options.id,
            label: network.body.nodes[i].options.label,
            x: network.body.nodes[i].x,
            y: network.body.nodes[i].y,
            shape: network.body.nodes[i].options.shape,
            size: network.body.nodes[i].options.size,
            nodedegree: network.body.nodes[i].options.nodedegree,
            nodetype: network.body.nodes[i].options.nodetype,
            componentType: nodes.get(network.body.nodes[i].options.id).componentType,
            icon:
                network.body.nodes[i].options.icon,
            color: [
                {
                    border: network.body.nodes[i].options.color.border,
                    background: network.body.nodes[i].options.color.background,
                    highlight: [
                        {
                            border: network.body.nodes[i].options.color.border,
                            background: network.body.nodes[i].options.color.background,
                        }
                    ],
                    hover: [
                        {
                            border: network.body.nodes[i].options.color.border,
                            background: network.body.nodes[i].options.color.background,
                        }
                    ]
                }
            ],
            edges: network.getConnectedNodes(network.body.nodes[i].options.id)
        };


        let str = network.body.nodes[i].options.id;
        let checktext;
        try {
            checktext = str.substring(0, 7);
        }
        catch (e) { }

        if (data.x != undefined && data.y != undefined && checktext != "edgeId:")
            nodesModel.push(data);
    });


    $.each(network.body.edges, function (i) {
        var data = {
            //options: network.body.nodes[i].options,
            id: network.body.edges[i].id,
            //label: network.body.edges[i].length,
            label: network.body.edges[i].options.label,
            //title: network.body.edges[i].title,
            from: network.body.edges[i].fromId,
            to: network.body.edges[i].toId,
            dashes: network.body.edges[i].options.dashes,
            length: network.body.edges[i].options.length,
            value: network.body.edges[i].options.value,
            componentType: edges.get(network.body.edges[i].id).componentType,
            options: [
                {
                    color: [
                        {
                            color: network.body.edges[i].options.color.color,
                            highlight: network.body.edges[i].options.color.highlight,
                            hover: network.body.edges[i].options.color.hover,
                            inherit: network.body.edges[i].options.color.inherit,
                            opacity: network.body.edges[i].options.color.opacity,

                        }
                    ],
                    background: [
                        {
                            color: network.body.edges[i].options.background.color,
                            dashes: network.body.edges[i].options.background.dashes,
                            enabled: network.body.edges[i].options.background.enabled,
                            size: network.body.edges[i].options.background.size,
                        }
                    ],
                    arrows: [
                        {
                            from: [
                                {
                                    enabled: network.body.edges[i].options.arrows.from.enabled,
                                    type: network.body.edges[i].options.arrows.from.type
                                }
                            ],
                            to: [
                                {
                                    enabled: network.body.edges[i].options.arrows.to.enabled,
                                    type: network.body.edges[i].options.arrows.to.type
                                }
                            ],
                        }
                    ],
                    font: [
                        {
                            align: network.body.edges[i].options.font.align
                        }
                    ],
                    smooth: [
                        {
                            enabled: network.body.edges[i].options.smooth.enabled,
                            roundness: network.body.edges[i].options.smooth.roundness,
                            type: network.body.edges[i].options.smooth.type
                        }
                    ],

                }
            ]

        };
        edgesModel.push(data);
    });

    var model = {
        nodes: nodesModel,
        edges: edgesModel
    }
    //counter = counter + Number(nodes.length);
    //localStorage.setItem("nodelength", counter);
    var exportValue = JSON.stringify(model, undefined, 2);

    if (isSaveNetwork) {
        //localStorage.setItem("networkData", exportValue);
        addNetworData(exportValue);
        return;
    }

    //$("#jsondiv").text(exportValue);
    // console.log(JSON.stringify(edges, undefined, 2));
    // exportArea.value = exportValue;
    //
    //$("<a />", {
    //    "download": "NetworkFile.json",
    //    "href": "data:application/json;charset=utf-8," + encodeURIComponent(exportValue),
    //}).appendTo("body")
    //    .click(function () {
    //        $(this).remove()
    //    })[0].click()

    // any kind of extension (.txt,.cpp,.cs,.bat)
    var filename = "NetworkFile.json";

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
    var options = {
        layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
        locale: document.getElementById("locale").value,
        interaction: { navigationButtons: true, keyboard: true, multiselect: true, hover: true },
        physics: false,
        //edges: {
        //    color: {
        //        inherit: falsefunction copy()
        //    },
        //},
        nodes: {
            shape: "dot",
            size: 8
        },
        edges: {
            smooth: {
                enabled: false,
                type: 'continuous'
            },
        },
        manipulation: {
            enabled: false,
            addNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById("operation").innerText = "Add Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = "site 1";
                document.getElementById("node-degree").value = "5";
                document.getElementById("ddlnodeshape").value = "dot";
                document.getElementById("ddlnodeType").value = "ROADM";
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById(
                    "cancelButton"
                ).onclick = clearPopUp.bind();
                document.getElementById("network-popUp").style.display = "block";

            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById("operation").innerText = "Edit Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = data.label;
                document.getElementById("node-degree").value = data.nodedegree;
                document.getElementById("ddlnodeType").value = data.nodetype;
                document.getElementById("ddlnodeshape").value = data.shape;
                data.nodeedit = "true";
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById("cancelButton").onclick = cancelEdit.bind(
                    this,
                    callback
                );
                document.getElementById("addButton").addEventListener('click', function () {
                    AddData(this, 0);
                });
                document.getElementById("addAmpButton").addEventListener('click', function () {
                    AddData(this, 1);
                });
                document.getElementById("addTraffButton").addEventListener('click', function () {
                    AddData(this, 2);
                });
                document.getElementById("network-popUp").style.display = "block";
            },

            addEdge: function (data, callback) {
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r != true) {
                        callback(null);
                        return;
                    }
                }
                document.getElementById("edge-operation").innerText = "Add Edge";
                editEdgeWithoutDrag(data, callback);
            },
            editEdge: {
                editWithoutDrag: function (data, callback) {
                    document.getElementById("edge-operation").innerText = "Edit Edge";
                    editEdgeWithoutDrag(data, callback);
                },
            },
        },
    };
    network = new vis.Network(container, data, options);
    network.on("click", function (params) {
        params.event = "[original event]";
        console.log(params.pointer);
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
        _insertnodeDB().remove();

        if (data.edges.length > 1 || data.edges.length == 0) {
            copyData.edges = [];
            copyData.nodes = [];
            copyData.dataCopied = false;
            return;
        }

        //var getnodedata = edges.get();
        var clickedEdge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
        data.label = network.body.edges[data.edges[0]].options.label;
        //data.to = network.body.edges[data.edges].options.to;
        //data.labelFrom = network.body.edges[data.edges].options.labelFrom;
        //data.labelTo = network.body.edges[data.edges].options.labelTo;
        _insertnodeDB.insert({ "id": data.edges[0], "type": "NodeInsert", "label": data.label });
        setCopyData(clickedEdge.options.id, '');
    });
    network.on("selectNode", function (params) {
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        var deletenode = network.getConnectedEdges(clickedNode.id);
        localStorage.setItem("deletenodeconectededge", deletenode.length);
        _nodesDB.insert({ "id": clickedNode.id, "type": "node" });
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

            console.log(addServiceData);
            if (addServiceData.from != '' && addServiceData.to != '')
                manualAddService();

            console.log(addServiceData);

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
    network.on("oncontext", function (data) {
        //data.preventDefault();
        var type = _nodesDB().first();
        if (type.type == "node") {
            var getrightclicknode = this.body.nodes[this.getNodeAt(data.pointer.DOM)];
            if (getrightclicknode != undefined) {
                document.getElementById("edgecontextMenu").style.display = "none";
                $("#contextMenu").css({ left: (data.event.pageX + 20) + "px", top: (data.event.pageY + 20) + "px" });
                document.getElementById("contextMenu").style.display = "block";
                var cliNode = this.body.nodes[this.getNodeAt(data.pointer.DOM)];
                document.getElementById("nodeiddetails").value = cliNode.id;
                data.id = cliNode.id
                var clickedNode = network.body.nodes[cliNode.id].options.label;
                document.getElementById("nodeeditlabel").value = clickedNode;
                document.getElementById("nodeedit-degree").value = network.body.nodes[cliNode.id].options.nodedegree;
                document.getElementById("ddleditnodeType").value = network.body.nodes[cliNode.id].options.nodetype;
                //$(`#ddlshape option[value='${network.body.nodes[cliNode.id].options.shape}']`).prop('selected', true);
                //$(`#ddlcolor option[value='${network.body.nodes[cliNode.id].options.color.background}']`).prop('selected', true);
                $('#ddlshape').val(network.body.nodes[cliNode.id].options.shape);
                $('#ddlcolor').val(network.body.nodes[cliNode.id].options.color.background);
                document.getElementById("rightClickNodeEdit").onclick = rightClickNodeEdit.bind();
                document.getElementById("rightClickNodeDelete").onclick = deleteNodeEdge.bind();
            }
        }
        else {
            var getrightclickedge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
            if (getrightclickedge != undefined) {
                document.getElementById("contextMenu").style.display = "none";
                $("#edgecontextMenu").css({ left: (data.event.pageX + 20) + "px", top: (data.event.pageY + 20) + "px" });
                document.getElementById("edgecontextMenu").style.display = "block";
                var cliEdge = this.body.edges[this.getEdgeAt(data.pointer.DOM)];
                document.getElementById("edgeiddetails").value = cliEdge.id;
                document.getElementById("from").value = network.body.edges[cliEdge.id].options.from;
                document.getElementById("to").value = network.body.edges[cliEdge.id].options.to;
                if (network.body.edges[cliEdge.id].options.label != undefined) {
                    var clickedEdge = network.body.edges[cliEdge.id].options.label;
                    document.getElementById("edgelabel").value = clickedEdge;
                }
                var arrowto = network.body.edges[cliEdge.id].options.arrows.to.enabled
                var arrowfrom = network.body.edges[cliEdge.id].options.arrows.from.enabled
                //var arrowmiddle = network.body.edges[cliEdge.id].options.arrows.to.enabled
                if (arrowto == true && arrowfrom == true) {
                    document.getElementById("edgearrow").value = "to,form";
                }
                else if (arrowto == true) {
                    document.getElementById("edgearrow").value = "to";
                }
                else if (arrowfrom == true) {
                    document.getElementById("edgearrow").value = "from";
                }
                else {
                    document.getElementById("edgearrow").value = "";
                }
                document.getElementById("InsertNode").addEventListener('click', function () {
                    AddData(this, 0);
                });
                document.getElementById("Copy").onclick = copy.bind();
                //document.getElementById("Paste").onclick = paste.bind();
                document.getElementById("rightClickEdgeEdit").onclick = rightClickEdgeEdit.bind();
                document.getElementById("rightClickEdgeDelete").onclick = deleteNodeEdge.bind();
            }
            //else {
            //    document.getElementById("contextMenu").style.display = "none";
            //    document.getElementById("pastecontextMenu").style.display = "block";
            //    document.getElementById("Paste").onclick = paste.bind();
            //}
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
        //let answer = confirm("Do you really want to move it")
        //console.log(e);
        if (e.dataTransfer.getData("text") == "btnAddMode") {
            //var len = network.body.data.nodes.length;
            //var randomid = Number(len) + 1;
            //var counter = 0;
            counter = counter + 1;
            localStorage.setItem("nodelength", counter);
            var nodelength = localStorage.getItem("nodelength");
            if (nodelength != 0) {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + '' + Number(nodelength) + '',
                    nodedegree: "5",
                    nodetype: "ROADM",
                    shape: "dot",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            } else {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + 1,
                    nodedegree: "5",
                    nodetype: "ROADM",
                    shape: "dot",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            }
        }
        if (e.dataTransfer.getData("text") == "btnAddAmp") {
            //var len = network.body.data.nodes.length;
            //var randomid = Number(len) + 1;
            //var counter = 0;
            counter = counter + 1;
            localStorage.setItem("nodelength", counter);
            var nodelength = localStorage.getItem("nodelength");
            if (nodelength != 0) {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + '' + Number(nodelength) + '',
                    nodedegree: "5",
                    //nodetype: "ROADM",
                    shape: "triangle",
                    color: "red",
                    nodedegree: "2",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            } else {
                network.body.data.nodes.add({
                    id: token(),
                    label: "site " + 1,
                    nodedegree: "5",
                    //nodetype: "ROADM",
                    shape: "triangle",
                    color: "red",
                    nodedegree: "2",
                    //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                    //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                    x: e.layerX - ($("#mynetwork").width() / 2),
                    y: e.layerY - ($("#mynetwork").height() / 2),
                    componentType: 'node'
                })
            }
        }

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
    var fromnodedegree = network.body.nodes[addEdgeData.from].options.nodedegree;
    var tonodedegree = network.body.nodes[addEdgeData.to].options.nodedegree;
    var fromnodeconnectededge = network.getConnectedEdges(addEdgeData.from);
    var tonodeconnectededge = network.getConnectedEdges(addEdgeData.to);
    fromnodeconnectededge.forEach(function (item, index) {
        var formnodeconnecteddataset = edges.get();
        for (i = 0; i < formnodeconnecteddataset.length; i++) {
            if (item == formnodeconnecteddataset[i].id) {
                if (formnodeconnecteddataset[i].componentType == "edge") {
                    fromcounter = fromcounter + 1;
                }
            }
        }
    });
    tonodeconnectededge.forEach(function (item, index) {
        var tonodeconnecteddataset = edges.get();
        for (i = 0; i < tonodeconnecteddataset.length; i++) {
            if (item == tonodeconnecteddataset[i].id) {
                if (tonodeconnecteddataset[i].componentType == "edge") {
                    tocounter = tocounter + 1;
                    //console.log("hi");
                }
            }
        }
    });
    if (fromcounter < Number(fromnodedegree) && tocounter < Number(tonodedegree)) {
        var labelvalue = '[' + nodes.get(addEdgeData.from).label + ' - ' + nodes.get(addEdgeData.to).label + ']';
        network.body.data.edges.add({
            id: token(), from: addEdgeData.from, to: addEdgeData.to, label: labelvalue, font: { align: 'top' },
            componentType: "edge"
        });
        //isAddEdge = 0;
        //addEdgeData = {
        //    from: '',
        //    to: ''
        //};
        addEdgeData = {
            from: addEdgeData.to,
            to: ''
        };
        UnSelectAll();
    }
    else {
        alert("Node Degree limit exist");
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
    var servicefromedgefrom;
    var servicefromedgeto;
    var servicetoedgefrom;
    var servicetoedgeto;
    var fromnodeconnectededge = network.getConnectedEdges(addServiceData.from);
    var tonodeconnectededge = network.getConnectedEdges(addServiceData.to);
    fromnodeconnectededge.forEach(function (item, index) {
        var fromedgefrom = network.body.edges[item].options.from;
        var fromedgeto = network.body.edges[item].options.to;
        if (fromedgefrom == addServiceData.from && fromedgeto == addServiceData.to || fromedgefrom == addServiceData.to && fromedgeto == addServiceData.from) {
            servicefromedgefrom = fromedgefrom;
            servicefromedgeto = fromedgeto;
        }
    });
    tonodeconnectededge.forEach(function (item, index) {
        var toedgefrom = network.body.edges[item].options.from
        var toedgeto = network.body.edges[item].options.to
        if (toedgefrom == addServiceData.from && toedgeto == addServiceData.to || toedgefrom == addServiceData.to && toedgeto == addServiceData.from) {
            servicetoedgefrom = toedgefrom;
            servicetoedgeto = toedgeto;
        }

    });
    if (servicefromedgefrom != undefined && servicefromedgeto != undefined || servicetoedgefrom != undefined && servicetoedgeto != undefined) {
        var fromnodetype = network.body.nodes[addServiceData.from].options.componentType;
        var tonodetype = network.body.nodes[addServiceData.to].options.componentType;
        if (fromnodetype == "node" && tonodetype == "node") {
            var labelvalue = '[' + nodes.get(addServiceData.from).label + ' - ' + nodes.get(addServiceData.to).label + ']';
            network.body.data.edges.add({
                id: token(), from: addServiceData.from, to: addServiceData.to, label: labelvalue, dashes: true, color: 'red', font: { align: 'top' }
                , arrows: arrows1,
                smooth: smooth1,
                componentType: "service"
            });

            //isAddService = 0;
            //addServiceData = {
            //    from: '',
            //    to: ''
            //};
            addServiceData = {
                from: addServiceData.to,
                to: ''
            };
            UnSelectAll();
        } else {
            //clearEdgePopUp();
            document.getElementById("edge-popUp").style.display = "none";
            alert("Service not add between amplifier node");
        }
    }
    else {
        alert("Create fiber then  service add");
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

                var confirmation = confirm('are you sure , want to remove ?')
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
                componentType: "edge"
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

        var topnode = "<button class='accordion'>"+nodelist[i].label+"</button>"
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