var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data = getScaleFreeNetwork(0);
var seed = 2;
var previousId = 0;
var currentId = 0;
var _edgesDB = new TAFFY();
var dat = "";

var container;
var exportArea;
var importButton;
var exportButton;
var _import_json;



if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var jsstoreCon = new JsStore.Connection();

async function readdata() {
    dat = await jsstoreCon.select({
        from: 'tbl_network', where: { id: '1' }
    });
    console.log(dat);
}
async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created');
    }
    else {
        console.log('db opened');
    }

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

//function allowDrop(ev) {
//    ev.preventDefault();
//}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

//function drop(ev) {
//    //alert(ev.target)
//    console.log(ev);
//    //ev.preventDefault();
//    //var data = ev.dataTransfer.getData("text");
//    //ev.target.appendChild(document.getElementById(data));
//}

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



function draw(isImport) {



    destroy();
    nodes = [];
    edges = [];

    // create a network
    var container = document.getElementById("mynetwork");

    //anychart.onDocumentReady(function () {
    //    // create a chart and set the data
    //    var chart = anychart.graph(data);

    //    // prevent zooming the chart with the mouse wheel
    //    chart.interactivity().zoomOnMouseWheel(false);

    //    // configure the visual settings of edges
    //    chart.edges().normal().stroke("#ffa000", 2, "10 5", "round");
    //    chart.edges().hovered().stroke("#ffa000", 2, "10 5", "round");
    //    chart.edges().selected().stroke("#ffa000", 4);

    //    // set the container id
    //    chart.container("mynetwork");

    //    // initiate drawing the chart
    //    chart.draw();
    //});

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
                }
            }
        }
        catch{
        }

    }

    data = {
        nodes: nodes,
        edges: edges
    }


    var options = {
        layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
        //layout: {
        //    randomSeed: 1,
        //    improvedLayout: true,
        //    //hierarchical: {
        //    //    direction: 'LR',        // UD, DU, LR, RL
        //    //    sortMethod: 'directed'   // hubsize, directed
        //    //}
        //},

        //layout: {
        //    hierarchical: {
        //        direction: 'LR',
        //        sortMethod: 'directed'
        //    }
        //},
        locale: document.getElementById("locale").value,
        physics: false,
        //physics: {
        //    barnesHut: {
        //        springLength: 200
        //    }
        //},
        //physics: { "barnesHut": { "springLength": 10, "springConstant": 0.1 } } ,
        //physics: {
        //    stabilization: true
        //},
        edges: {
            smooth: {
                enabled: false,
                type: 'continuous'
            },
            //margin: {
            //    left: 15,
            //    right: 15
            //}
        },
        //interaction: {
        //    keyboard: false,
        //    hover:true
        //    //navigationButtons: true
        //},
        interaction: {
            keyboard: false,
            hover: true,
            //dragNodes: true,// do not allow dragging nodes
            zoomView: false, // do not allow zooming
            dragView: false,  // do not allow dragging
            multiselect: true
        },
        //nodes: {
        //    fixed: {
        //        x: true,
        //        y: true,
        //    },
        //},
        //color: 'red',
        nodes: {
            shape: "dot",
            size: 8
        },
        //manipulation:true,
        manipulation: {
            enabled: false,

            addNode: function (data, callback) {
                // filling in the popup DOM elements
                //alert(data.id);
                document.getElementById("operation").innerText = "Add Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = data.label;
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
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById("cancelButton").onclick = cancelEdit.bind(
                    this,
                    callback
                );
                //document.getElementById("addButton").onclick = AddData.bind(
                //    this
                //);
                //document.getElementById("addAmpButton").onclick = AddData.bind(
                //    this
                //);

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
            //addEdge: function (data, callback) {
            //    console.log(data.from)
            //    if (data.from == data.to) {
            //        var r = confirm("Do you want to connect the node to itself?");
            //        if (r == true) {
            //            callback(data);
            //        }
            //    } else {
            //        callback(data);
            //    }
            //},


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
            editEdge: function (data, callback) {
                var orgigEdge = edges.get(data.id);

                if (data.from !== orgigEdge.from) {
                    alert('you cannot change the source of the edge');
                    callback(null);
                }
                else {
                    //editEdgeWithoutDrag(data, callback);
                    callback(data)
                }

            },

        },
    };


    network = new vis.Network(container, data, options);

    //makeMeMultiSelect(container, network, nodes)

    //var canvas = new fabric.Canvas("c", { preserveObjectStacking: true });

    //canvas
    //    .add(new fabric.Rect({
    //        top: 0,
    //        left: 0,
    //        width: 100,
    //        height: 100,
    //        fill: "green"
    //    }))
    //    .add(new fabric.Rect({
    //        top: 50,
    //        left: 50,
    //        width: 100,
    //        height: 100,
    //        fill: "red"
    //    })).renderAll();


    network.on('doubleClick', function (properties) {
        //
        // selected edge id
        console.log(properties);
        var edgeId = properties.edges[0];
        // selected edge id
        var nodeId = properties.nodes[0];
        alert('edge id : ' + edgeId + ', node id :' + nodeId);
    });

    network.on("click", function (params) {
        params.event = "[original event]";

        //document.getElementById("eventSpanHeading").innerText = "Click event:";
        //var dd = JSON.stringify(
        //    params,
        //    null,
        //    4
        //);
        //console.log('node ' + this.getNodeAt(params.pointer.DOM));
        //console.log('edge ' + this.getEdgeAt(params.pointer.DOM));
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
        //console.log(
        //    "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
    });

    network.on("selectEdge", function (params) {
        if (params.edges.length > 1) {
            copyData.edges = [];
            copyData.nodes = [];
            copyData.dataCopied = false;
            return;
        }
        var clickedNode = this.body.edges[this.getEdgeAt(params.pointer.DOM)];
        console.log(clickedNode);
        $("#txtEdgeId").val(clickedNode.options.id);
        $("#txtFrom").val(clickedNode.options.from);
        $("#txtTo").val(clickedNode.options.to);
        $("#txtLabel").val(clickedNode.options.label);
        $("#txtTitle").val(clickedNode.options.title);
        $("#txtLength").val(clickedNode.options.length);
        $("#txtColor").val(clickedNode.options.color.color);
        $("#txtFontAlign").val(clickedNode.options.font.align);
        $("#ddlArrows").val(clickedNode.options.arrows.to.type);
        $("#jsondiv").val(clickedNode.options);

        $("#editedge-label").val(clickedNode.options.label);
        $("#editedge-title").val(clickedNode.options.title);
        $("#editedge-fontalign").val(clickedNode.options.font.align);

        setCopyData(clickedNode.options.id, '');

    });
    network.on("selectNode", function (params) {
        //console.log("selectNode Event:", params);
        //console.log(
        //    "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        console.log('first ', params.pointer.DOM);
        console.log('second ', clickedNode.options.x, clickedNode.options.y);
        //console.log(clickedNode.options.x, clickedNode.options.y);
        console.log(clickedNode);
        $("#txtNodeId").val(clickedNode.options.id);
        $("#txtNodeText").val(clickedNode.options.label);
        $("#txtNodeTitle").val(clickedNode.options.title);
        $("#ddlShape").val(clickedNode.options.shape);
        //$("#txtNodeX").val(clickedNode.options.x);
        //$("#txtNodeY").val(clickedNode.options.y);
        $("#txtNodeSize").val(clickedNode.options.size);
        $("#txtNodeBGColor").val(clickedNode.options.color.background);
        $("#txtNodeBColor").val(clickedNode.options.color.border);
        $("#txtNodeFontColor").val(clickedNode.options.font.color);
        setCopyData('', clickedNode.options.id);

        if (isAddEdge == 1) {
            isAddService = 0;
            if (addEdgeData.from == '')
                addEdgeData.from = clickedNode.options.id
            else if (addEdgeData.to == '') {
                if (addEdgeData.from == clickedNode.options.id) {
                    alert('pls click destination source');
                    return;
                }
                addEdgeData.to = clickedNode.options.id
            }

            if(addEdgeData.from != '' && addEdgeData.to != '')
                manualAddEdge();
        }
        if (isAddService == 1) {
            isAddEdge = 0;
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
    network.on("deselectNode", function (params) {
        //console.log("deselectNode Event:", params);
    });
    network.on("hoverNode", function (params) {
        var clickedNode = nodes.get(params.node);
        var fromlabel = clickedNode.label;
        //var back = this.body.nodes[params.nodes].options.color.color;
        //debugger;
        //data.title = htmlTitle("uid : " + fromlabel + "\n" + "type : " + clickedNode.componentType);
        $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY + 20) + "px" });
        $('#click').html(htmlTitle("label : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
        $('#click').show();
    });
    network.on("blurNode", function (params) {
        $('#click').hide();
    });

    network.on("hoverEdge", function (params) {
        console.log("hoverEdge Event:", params);
        //$("#click").css("{left:" + params.event.pageX + 20 + "px", "top:" + params.event.pageY + 20 + "px}");
        var clickedNode = edges.get(params.edge);
        //var back = this.body.edges[params.edge].options.color.color;
        //debugger;
        var fromlabel = "(" + nodes.get(clickedNode.from).label + " -> " + nodes.get(clickedNode.to).label + ")";
        //data.title = htmlTitle("uid : " + fromlabel + "\n" + "type : " + clickedNode.componentType);
        $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY + 20) + "px" });
        $('#click').html(htmlTitle("dir : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
        $('#click').show();
    });
    network.on("blurEdge", function (params) {
        console.log("blurEdge Event:", params);
        $('#click').hide();
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        //console.log("gj")
    });
    container.addEventListener("dragenter", (e) => {
        e.target.className += " dragenter";
        //console.log("gj")
    });
    container.addEventListener("dragleave", (e) => {
        //alert()
        e.target.className = "whiteBox";
    });

    container.addEventListener("drop", (e) => {
        //let answer = confirm("Do you really want to move it")
        console.log(e);
        if (e.dataTransfer.getData("text") == "btnAddMode") {
            network.body.data.nodes.add({
                id: token(),
                label: "site " + 1,
                //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                x: e.layerX - ($("#mynetwork").width() / 2),
                y: e.layerY - ($("#mynetwork").height() / 2),
                componentType: 'node'
            })
        }

    });






    //let whiteBoxes = document.getElementsByTagName("canvas");

    //for (whiteBox of whiteBoxes) {


    //    whiteBox.addEventListener("dragover", (e) => {
    //        e.preventDefault();
    //        //console.log("gj")
    //    });
    //    whiteBox.addEventListener("dragenter", (e) => {
    //        e.target.className += " dragenter";
    //        //console.log("gj")
    //    });
    //    whiteBox.addEventListener("dragleave", (e) => {
    //        //alert()
    //        e.target.className = "whiteBox";
    //    });
    //    whiteBox.addEventListener("drop", (e) => {
    //        //let answer = confirm("Do you really want to move it")
    //        console.log(e)
    //        //if (answer) {
    //        //    e.target.append(imgBox)
    //        //}
    //        //else {
    //        //    e.target.className = "whiteBox";

    //        //}
    //    });
    //}





    //$("canvas").hover(
    //    (params) => { //hover
    //        console.log(params);
    //    },
    //    () => { //out
    //        //alert()
    //    }
    //);



    //network.on("oncontext", function (params) {
    //    params.event = "[original event]";
    //    document.getElementById("eventSpanHeading").innerText =
    //        "oncontext (right click) event:";
    //    document.getElementById("eventSpanContent").innerText = JSON.stringify(
    //        params,
    //        null,
    //        4
    //    );
    //});
    //network.on("showPopup", function (params) {
    //    alert();
    //});
    //network.on("hidePopup", function () {
    //    document.getElementById("eventSpanHeading").innerText = "";
    //    document.getElementById("eventSpanContent").innerText = "";
    //});
    //network.on("select", function (params) {
    //    document.getElementById("eventSpanContent").innerText = JSON.stringify(
    //        params,
    //        null,
    //        4
    //    );
    //});

    //var percent = 100;
    //network.on("afterDrawing", function (ctx) {
    //    alert();
    //    try {
    //        //var pos = network.getPositions([1, 2]);
    //        ctx.strokeStyle = ctx.filStyle = 'green';
    //        ctx.moveTo(-303, -143);
    //        ctx.lineTo(-44,-153);
    //        ctx.fill();
    //        ctx.stroke();
    //    }
    //    catch{

    //    }
    //});

    network.on("dragStart", function (params) {
        // There's no point in displaying this event on screen, it gets immediately overwritten
        //params.event = "[original event]";
        //console.log("dragStart Event:", params);
        //console.log(
        //    "dragStart event, start getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
    });

    network.on("dragEnd", function (params) {
        params.event = "[original event]";
        //document.getElementById("eventSpanHeading").innerText = "dragEnd event:";
        //document.getElementById("eventSpanContent").innerText = JSON.stringify(
        //    params,
        //    null,
        //    4
        //);

        //if (params.nodes.length == 0)
        //    return;
        //console.log("dragEnd Event:", params);
        //console.log(
        //    "dragEnd event,  getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
        //network.body.data.nodes.update({
        //    id: params.nodes[0], x: params.pointer.canvas.x, y: params.pointer.canvas.y 
        //});

        //network.body.data.edges.update({
        //    id: $("#txtEdgeId").val(), from: $("#txtNodeId").val(), to: 2
        //});

    });
    //removeDefaultElement();

}

//$("#mynetwork").keyup(function (e) {

//    if (e.keyCode == 67 && e.ctrlKey) {
//        alert('ctrl C');
//    }
//}) 

function editEdgeWithoutDrag(data, callback) {
    //filling in the popup DOM elements
    document.getElementById("edge-label").value = 0;
    document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(
        this,
        data,
        callback
    );
    document.getElementById("edge-cancelButton").onclick = cancelEdgeEdit.bind(
        this,
        data,
        callback
    );
    document.getElementById("edge-popUp").style.display = "block";
}

function clearEdgePopUp() {
    document.getElementById("edge-saveButton").onclick = null;
    document.getElementById("edge-cancelButton").onclick = null;
    document.getElementById("edge-popUp").style.display = "none";
}

function cancelEdgeEdit(data, callback) {

    clearEdgePopUp();
    data.componentType = 'edge';
    if (isService == 1) {
        data.dashes = true;
        data.label = $("#txtLabel").val();
        data.font = fontstyle1;
        data.color = $("#txtColor").val();
        data.arrows = arrows1;
        data.smooth = smooth1;
        data.componentType = 'service';
        isService = 0;
    }
    callback(data);
    callback(null);
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
        data.length = document.getElementById("edge-label").value;

        if (document.getElementById("edgeDashes").value == "true") {
            data.dashes = document.getElementById("edgeDashes").value;
        }

        _edgesDB.insert({ "from": data.from, "to": data.to, "edgeLength": data.length, "dashes": data.dashes })
        data.label = $("#txtLabel").val();
        data.font = fontstyle1;
        //data.value = $("#txtEdgeValue").val();;
        //data.labelFrom = "a";
        //data.labelTo = "b";


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

        //debugger;
        clearEdgePopUp();
        data.componentType = 'edge';
        //var fromlabel = "(" + nodes.get(data.from).label + " -> " + nodes.get(data.to).label + ")";
        //data.title = htmlTitle("uid : " + fromlabel + "\n" + "type : " + data.componentType);
        callback(data);
    }
    else {
        var txtEdgeId = $("#txtEdgeId").val();
        var txtFrom = $("#txtFrom").val();
        var txtTo = $("#txtTo").val();
        var txtLabel = $("#txtLabel").val();
        var txtTitle = $("#txtTitle").val();
        var txtLength = $("#txtLength").val();
        var txtColor = $("#txtColor").val();
        var txtFontAlign = $("#txtFontAlign").val();
        var ddlArrows = $("#ddlArrows").val();

        //network.body.data.edges.add({
        //    id: txtEdgeId, from: txtFrom, to: txtTo, label: txtLabel, dashes: true, title: txtTitle, length: txtLength, color: txtColor, font: { align: txtFontAlign }
        //    , arrows: {
        //        to: {
        //            enabled: true,
        //            type: ddlArrows,
        //        },
        //        from: {
        //            enabled: true,
        //            type: ddlArrows,
        //        },
        //    },
        //    smooth: {
        //        enabled: true,
        //        type: $("#ddlSmooth").val(),
        //        roundness: $("#txtRoundness").val(),
        //    },
        //});
        data.dashes = true;
        data.label = $("#txtLabel").val();
        data.font = fontstyle1;
        data.color = $("#txtColor").val();
        data.arrows = arrows1;
        data.smooth = smooth1;
        data.componentType = 'service';
        isService = 0;
        //var fromlabel = "(" + nodes.get(data.from).label + " -> " + nodes.get(data.to).label + ")";
        //data.title = htmlTitle("uid : " + fromlabel + "\n" + "type : " + data.componentType);
        clearEdgePopUp();
        callback(data);
    }
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

function clearPopUp() {
    document.getElementById("saveButton").onclick = null;
    document.getElementById("cancelButton").onclick = null;
    document.getElementById("network-popUp").style.display = "none";
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}
function AddNode(id) {
    var test;
    var edgeLen;
    var subLen;
    var from_id = document.getElementById("node-id").value;
    test = network.getConnectedEdges(from_id);
    var myNode = network.getConnectedNodes($("#txtEdgeId").val());
    to_id = myNode[1];
    from_id = myNode[0];
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
    if (id == 0) {
        network.body.data.nodes.add({
            id: randomid,
            label: '' + randomid + '',
            x: $("#txtNodeX").val(),
            y: $("#txtNodeY").val(),
            shape: $("#ddlShape").val(),
            size: 8,
            color: $("#txtNodeBGColor").val(),
            componentType: "node"
        });

    }
    else if (id == 1) {
        network.body.data.nodes.add({
            id: randomid,
            label: '' + randomid + '',
            //shape: "icon",
            //icon: {
            //    face: "'FontAwesome'",
            //    code: "\uf067",
            //    size: 15,
            //    color: "black",
            //},
            x: $("#txtNodeX").val(),
            y: $("#txtNodeY").val(),
            componentType: "node"
        });
    }
    else {
        network.body.data.nodes.add({
            id: randomid,
            label: '' + randomid + '',
            shape: "triangle",
            //shape: "diamond",
            size: 8,
            color: "red",
            x: $("#txtNodeX").val(),
            y: $("#txtNodeY").val(),
            componentType: "node"
        });
    }


    edgeLen = document.getElementById("edgeLen").value;
    var taffyLen;

    taffyLen = _edgesDB({ from: from_id.toString(), to: to_id.toString() }).first();



    if (taffyLen == false) {
        taffyLen = _edgesDB({ from: to_id.toString(), to: from_id.toString() }).first();
    }

    if (Number(edgeLen) < Number(taffyLen.edgeLength)) {
        subLen = Number(taffyLen.edgeLength) - Number(edgeLen);
    }
    else if (Number(edgeLen) > Number(taffyLen.edgeLength)) {
        network.body.data.nodes.remove(randomid);
        alert('Given length is exceeded in total length.');
        document.getElementById("node-popUp").style.display = "none";
        return false;
    }
    //else if (Number(edgeLen) == Number(taffyLen.edgeLength)) {
    //    network.body.data.nodes.remove(randomid);
    //    alert('Given length is equal to total length.');
    //    document.getElementById("node-popUp").style.display = "none";
    //    return false;
    //}
    else {
        subLen = 0;
    }

    //if (edgedata != "" && edgedata != undefined) {
    //    network.body.data.edges.remove(edgedata);
    //}
    //else {
    //    network.body.data.edges.remove(test[0]);
    //}


    network.body.data.edges.remove($("#txtEdgeId").val());
    network.body.data.edges.add([{ from: randomid, to: from_id, length: 0, componentType: "edge", font: fontstyle1, label: $("#txtLabel").val(), color: "blue" }])
    network.body.data.edges.add([{ from: randomid, to: to_id, length: 0, componentType: "edge", font: fontstyle1, label: $("#txtLabel").val(), color: "blue" }])

    //network.body.data.edges.add([{ from: randomid, to: from_id, length: edgeLen, label: edgeLen, color: "" }])
    //network.body.data.edges.add([{ from: randomid, to: to_id, length: subLen, label: subLen.toString(), color: "" }])
    _edgesDB.insert({ "from": randomid.toString(), "to": from_id.toString(), "edgeLength": edgeLen.toString() })
    _edgesDB.insert({ "from": randomid.toString(), "to": to_id.toString(), "edgeLength": subLen.toString() })
    document.getElementById("node-popUp").style.display = "none";

}

function saveData(data, callback) {
    data.id = document.getElementById("node-id").value;
    data.label = document.getElementById("node-label").value;
    data.title = document.getElementById("node-title").value;
    data.shape = $("#ddlShape").val();
    data.size = 8;
    data.color = $("#txtNodeBGColor").val();
    data.componentType = "node";
    clearPopUp();
    callback(data);
}
function AddData(data, id) {

    document.getElementById("network-popUp").style.display = "none";
    document.getElementById("node-popUp").style.display = "block";

    document.getElementById("nodeSaveButton").onclick = AddNode.bind(
        this, id
    );
    var from_id = document.getElementById("node-id").value;
    var myNode = network.getConnectedNodes(from_id)
    if (myNode.length == 1) {
        $("#trId").hide();
    }
    else {
        $("#trId").show();
        document.getElementById("edgeLen").value = "";
    }
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
    exportArea = document.getElementById("input_output");
    importButton = document.getElementById("import_button");
    exportButton = document.getElementById("export_button");
}

function clearOutputArea() {
    exportArea.value = "";
}

function exportNetwork(isSaveNetwork) {
    testing();
    clearOutputArea();
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
        catch{ }

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
    var exportValue = JSON.stringify(model, undefined, 2);

    if (isSaveNetwork) {
        //localStorage.setItem("networkData", exportValue);
        addNetworData(exportValue);
        return;
    }

    $("#jsondiv").text(exportValue);
    // console.log(JSON.stringify(edges, undefined, 2));
    // exportArea.value = exportValue;
    //
    $("<a />", {
        "download": "NetworkFile.json",
        "href": "data:application/json;charset=utf-8," + encodeURIComponent(exportValue),
    }).appendTo("body")
        .click(function () {
            $(this).remove()
        })[0].click()
}

async function addNetworData(netData) {
    try {
        netmodel = {
            id: "1",
            name: netData
        }
        var noOfDataInserted = await jsstoreCon.insert({
            into: 'tbl_network',
            values: [netmodel]
        });

        if (noOfDataInserted === 1) {
            alert('successfully added');
        }
    } catch (ex) {
        var noOfDataInserted = await jsstoreCon.update({
            in: 'tbl_network',
            set: {
                name: netData,
            },
            where: {
                id: "1"
            }
        });
        if (noOfDataInserted === 1) {
            alert('successfully updated');
        }
    }
}



function downloadJSON() {


}
//function importNetwork() {

//    testing();
//    var inputValue = exportArea.value;
//    var inputData = JSON.parse(inputValue);
//    _edgesDB.insert(inputData)
//    var data = {
//        nodes: getNodeData(inputData),
//        edges: getEdgeData(inputData),
//    };

//    var options = {
//        interaction: { hover: true },

//        nodes: {
//            scaling: {
//                min: 16,
//                max: 32,
//            },
//        },

//        physics: {
//            stabilization: false,
//            barnesHut: {
//                springLength: 200,
//            },
//        },

//        width: "100%",
//        height: "100%",

//        manipulation: {

//            addNode: function (data, callback) {
//                // filling in the popup DOM elements
//                document.getElementById("operation").innerText = "Add Node";
//                document.getElementById("node-id").value = data.id;
//                document.getElementById("node-label").value = data.label;
//                document.getElementById("saveButton").onclick = saveData.bind(
//                    this,
//                    data,
//                    callback
//                );
//                document.getElementById(
//                    "cancelButton"
//                ).onclick = clearPopUp.bind();
//                document.getElementById("network-popUp").style.display = "block";
//            },
//            editNode: function (data, callback) {
//                // filling in the popup DOM elements
//                document.getElementById("operation").innerText = "Edit Node";
//                document.getElementById("node-id").value = data.id;
//                document.getElementById("node-label").value = data.label;
//                document.getElementById("saveButton").onclick = saveData.bind(
//                    this,
//                    data,
//                    callback
//                );
//                document.getElementById("cancelButton").onclick = cancelEdit.bind(
//                    this,
//                    callback
//                );
//                document.getElementById("addButton").addEventListener('click', function () {
//                    AddData(this, 0);
//                });
//                document.getElementById("addAmpButton").addEventListener('click', function () {
//                    AddData(this, 1);
//                });
//                document.getElementById("addTraffButton").addEventListener('click', function () {
//                    AddData(this, 2);
//                });

//                document.getElementById("network-popUp").style.display = "block";
//            },
//            addEdge: function (data, callback) {
//                if (data.from == data.to) {
//                    var r = confirm("Do you want to connect the node to itself?");
//                    if (r != true) {
//                        callback(null);
//                        return;
//                    }
//                }
//                document.getElementById("edge-operation").innerText = "Add Edge";
//                editEdgeWithoutDrag(data, callback);

//            },
//            editEdge: {

//                editWithoutDrag: function (data, callback) {
//                    document.getElementById("edge-operation").innerText = "Edit Edge";
//                    editEdgeWithoutDrag(data, callback);

//                },
//            },

//        },
//    };

//    network = new vis.Network(container, data, options);


//    network.on("hoverEdge", function (e) {
//        this.body.data.edges.update({
//            id: e.edge,
//            font: {
//                size: 14,
//            },
//        });
//    });

//    network.on("blurEdge", function (e) {
//        this.body.data.edges.update({
//            id: e.edge,
//            font: {
//                size: 0,
//            },
//        });
//    });
//    testing();
//}

function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
    document.getElementById('input_output').textContent = "";
    _import_json = document.getElementById('input_output').textContent = event.target.result;
    importNetwork();
}
var importNodes = [];
var importEdges = [];
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

    var options = {
        layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
        //layout: {
        //    randomSeed: 1,
        //    improvedLayout: true,
        //    //hierarchical: {
        //    //    direction: 'LR',        // UD, DU, LR, RL
        //    //    sortMethod: 'directed'   // hubsize, directed
        //    //}
        //},

        //layout: {
        //    hierarchical: {
        //        direction: 'LR',
        //        sortMethod: 'directed'
        //    }
        //},
        locale: document.getElementById("locale").value,
        physics: false,
        //physics: {
        //    barnesHut: {
        //        springLength: 200
        //    }
        //},
        //physics: { "barnesHut": { "springLength": 10, "springConstant": 0.1 } } ,
        //physics: {
        //    stabilization: true
        //},
        edges: {
            smooth: {
                enabled: false,
                type: 'continuous'
            },
            //margin: {
            //    left: 15,
            //    right: 15
            //}
        },
        //interaction: {
        //    keyboard: false,
        //    hover:true
        //    //navigationButtons: true
        //},
        interaction: {
            keyboard: false,
            hover: true,
            //dragNodes: true,// do not allow dragging nodes
            zoomView: false, // do not allow zooming
            dragView: false,  // do not allow dragging
            multiselect: true
        },
        //nodes: {
        //    fixed: {
        //        x: true,
        //        y: true,
        //    },
        //},
        //color: 'red',
        nodes: {
            shape: "dot",
            size: 8
        },
        //manipulation:true,
        manipulation: {
            enabled: false,

            addNode: function (data, callback) {
                // filling in the popup DOM elements
                //alert(data.id);
                document.getElementById("operation").innerText = "Add Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = data.label;
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
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById("cancelButton").onclick = cancelEdit.bind(
                    this,
                    callback
                );
                //document.getElementById("addButton").onclick = AddData.bind(
                //    this
                //);
                //document.getElementById("addAmpButton").onclick = AddData.bind(
                //    this
                //);

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
            //addEdge: function (data, callback) {
            //    console.log(data.from)
            //    if (data.from == data.to) {
            //        var r = confirm("Do you want to connect the node to itself?");
            //        if (r == true) {
            //            callback(data);
            //        }
            //    } else {
            //        callback(data);
            //    }
            //},


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
            editEdge: function (data, callback) {
                var orgigEdge = edges.get(data.id);

                if (data.from !== orgigEdge.from) {
                    alert('you cannot change the source of the edge');
                    callback(null);
                }
                else {
                    //editEdgeWithoutDrag(data, callback);
                    callback(data)
                }

            },

        },
    };


    network = new vis.Network(container, data, options);

    //makeMeMultiSelect(container, network, nodes)

    //var canvas = new fabric.Canvas("c", { preserveObjectStacking: true });

    //canvas
    //    .add(new fabric.Rect({
    //        top: 0,
    //        left: 0,
    //        width: 100,
    //        height: 100,
    //        fill: "green"
    //    }))
    //    .add(new fabric.Rect({
    //        top: 50,
    //        left: 50,
    //        width: 100,
    //        height: 100,
    //        fill: "red"
    //    })).renderAll();


    network.on('doubleClick', function (properties) {
        //
        // selected edge id
        console.log(properties);
        var edgeId = properties.edges[0];
        // selected edge id
        var nodeId = properties.nodes[0];
        alert('edge id : ' + edgeId + ', node id :' + nodeId);
    });

    network.on("click", function (params) {
        params.event = "[original event]";

        //document.getElementById("eventSpanHeading").innerText = "Click event:";
        //var dd = JSON.stringify(
        //    params,
        //    null,
        //    4
        //);
        //console.log('node ' + this.getNodeAt(params.pointer.DOM));
        //console.log('edge ' + this.getEdgeAt(params.pointer.DOM));
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
        //console.log(
        //    "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
    });

    network.on("selectEdge", function (params) {
        if (params.edges.length > 1) {
            copyData.edges = [];
            copyData.nodes = [];
            copyData.dataCopied = false;
            return;
        }
        var clickedNode = this.body.edges[this.getEdgeAt(params.pointer.DOM)];
        console.log(clickedNode);
        $("#txtEdgeId").val(clickedNode.options.id);
        $("#txtFrom").val(clickedNode.options.from);
        $("#txtTo").val(clickedNode.options.to);
        $("#txtLabel").val(clickedNode.options.label);
        $("#txtTitle").val(clickedNode.options.title);
        $("#txtLength").val(clickedNode.options.length);
        $("#txtColor").val(clickedNode.options.color.color);
        $("#txtFontAlign").val(clickedNode.options.font.align);
        $("#ddlArrows").val(clickedNode.options.arrows.to.type);
        $("#jsondiv").val(clickedNode.options);

        $("#editedge-label").val(clickedNode.options.label);
        $("#editedge-title").val(clickedNode.options.title);
        $("#editedge-fontalign").val(clickedNode.options.font.align);

        setCopyData(clickedNode.options.id, '');

    });
    network.on("selectNode", function (params) {
        //console.log("selectNode Event:", params);
        //console.log(
        //    "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
        var clickedNode = this.body.nodes[this.getNodeAt(params.pointer.DOM)];
        console.log('first ', params.pointer.DOM);
        console.log('second ', clickedNode.options.x, clickedNode.options.y);
        //console.log(clickedNode.options.x, clickedNode.options.y);
        console.log(clickedNode);
        $("#txtNodeId").val(clickedNode.options.id);
        $("#txtNodeText").val(clickedNode.options.label);
        $("#txtNodeTitle").val(clickedNode.options.title);
        $("#ddlShape").val(clickedNode.options.shape);
        //$("#txtNodeX").val(clickedNode.options.x);
        //$("#txtNodeY").val(clickedNode.options.y);
        $("#txtNodeSize").val(clickedNode.options.size);
        $("#txtNodeBGColor").val(clickedNode.options.color.background);
        $("#txtNodeBColor").val(clickedNode.options.color.border);
        $("#txtNodeFontColor").val(clickedNode.options.font.color);
        setCopyData('', clickedNode.options.id);

        if (isAddEdge == 1) {
            isAddService = 0;
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
    network.on("deselectNode", function (params) {
        //console.log("deselectNode Event:", params);
    });
    network.on("hoverNode", function (params) {
        var clickedNode = nodes.get(params.node);
        var fromlabel = clickedNode.label;
        //var back = this.body.nodes[params.nodes].options.color.color;
        //debugger;
        //data.title = htmlTitle("uid : " + fromlabel + "\n" + "type : " + clickedNode.componentType);
        $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY + 20) + "px" });
        $('#click').html(htmlTitle("label : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
        $('#click').show();
    });
    network.on("blurNode", function (params) {
        $('#click').hide();
    });

    network.on("hoverEdge", function (params) {
        console.log("hoverEdge Event:", params);
        //$("#click").css("{left:" + params.event.pageX + 20 + "px", "top:" + params.event.pageY + 20 + "px}");
        var clickedNode = edges.get(params.edge);
        //var back = this.body.edges[params.edge].options.color.color;
        //debugger;
        var fromlabel = "(" + nodes.get(clickedNode.from).label + " -> " + nodes.get(clickedNode.to).label + ")";
        //data.title = htmlTitle("uid : " + fromlabel + "\n" + "type : " + clickedNode.componentType);
        $("#click").css({ left: (params.event.pageX + 20) + "px", top: (params.event.pageY + 20) + "px" });
        $('#click').html(htmlTitle("dir : " + fromlabel + "\n" + "type : " + clickedNode.componentType, clickedNode.color));
        $('#click').show();
    });
    network.on("blurEdge", function (params) {
        console.log("blurEdge Event:", params);
        $('#click').hide();
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        //console.log("gj")
    });
    container.addEventListener("dragenter", (e) => {
        e.target.className += " dragenter";
        //console.log("gj")
    });
    container.addEventListener("dragleave", (e) => {
        //alert()
        e.target.className = "whiteBox";
    });

    container.addEventListener("drop", (e) => {
        //let answer = confirm("Do you really want to move it")
        console.log(e);
        if (e.dataTransfer.getData("text") == "btnAddMode") {
            network.body.data.nodes.add({
                id: token(),
                label: "site " + 1,
                //x: e.layerX - 399,//center point canvas 0,0 = dom point 399,299
                //y: e.layerY - 299,// current mouse point x - 399 = canvas point x, mouse point y - 299 = canvas point y
                x: e.layerX - ($("#mynetwork").width() / 2),
                y: e.layerY - ($("#mynetwork").height() / 2),
                componentType: 'node'
            })
        }

    });






    //let whiteBoxes = document.getElementsByTagName("canvas");

    //for (whiteBox of whiteBoxes) {


    //    whiteBox.addEventListener("dragover", (e) => {
    //        e.preventDefault();
    //        //console.log("gj")
    //    });
    //    whiteBox.addEventListener("dragenter", (e) => {
    //        e.target.className += " dragenter";
    //        //console.log("gj")
    //    });
    //    whiteBox.addEventListener("dragleave", (e) => {
    //        //alert()
    //        e.target.className = "whiteBox";
    //    });
    //    whiteBox.addEventListener("drop", (e) => {
    //        //let answer = confirm("Do you really want to move it")
    //        console.log(e)
    //        //if (answer) {
    //        //    e.target.append(imgBox)
    //        //}
    //        //else {
    //        //    e.target.className = "whiteBox";

    //        //}
    //    });
    //}





    //$("canvas").hover(
    //    (params) => { //hover
    //        console.log(params);
    //    },
    //    () => { //out
    //        //alert()
    //    }
    //);



    //network.on("oncontext", function (params) {
    //    params.event = "[original event]";
    //    document.getElementById("eventSpanHeading").innerText =
    //        "oncontext (right click) event:";
    //    document.getElementById("eventSpanContent").innerText = JSON.stringify(
    //        params,
    //        null,
    //        4
    //    );
    //});
    //network.on("showPopup", function (params) {
    //    alert();
    //});
    //network.on("hidePopup", function () {
    //    document.getElementById("eventSpanHeading").innerText = "";
    //    document.getElementById("eventSpanContent").innerText = "";
    //});
    //network.on("select", function (params) {
    //    document.getElementById("eventSpanContent").innerText = JSON.stringify(
    //        params,
    //        null,
    //        4
    //    );
    //});

    //var percent = 100;
    //network.on("afterDrawing", function (ctx) {
    //    alert();
    //    try {
    //        //var pos = network.getPositions([1, 2]);
    //        ctx.strokeStyle = ctx.filStyle = 'green';
    //        ctx.moveTo(-303, -143);
    //        ctx.lineTo(-44,-153);
    //        ctx.fill();
    //        ctx.stroke();
    //    }
    //    catch{

    //    }
    //});

    network.on("dragStart", function (params) {
        // There's no point in displaying this event on screen, it gets immediately overwritten
        //params.event = "[original event]";
        //console.log("dragStart Event:", params);
        //console.log(
        //    "dragStart event, start getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
    });

    network.on("dragEnd", function (params) {
        params.event = "[original event]";
        //document.getElementById("eventSpanHeading").innerText = "dragEnd event:";
        //document.getElementById("eventSpanContent").innerText = JSON.stringify(
        //    params,
        //    null,
        //    4
        //);

        //if (params.nodes.length == 0)
        //    return;
        //console.log("dragEnd Event:", params);
        //console.log(
        //    "dragEnd event,  getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
        //);
        //network.body.data.nodes.update({
        //    id: params.nodes[0], x: params.pointer.canvas.x, y: params.pointer.canvas.y 
        //});

        //network.body.data.edges.update({
        //    id: $("#txtEdgeId").val(), from: $("#txtNodeId").val(), to: 2
        //});

    });
    //removeDefaultElement();
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
            componentType: elem.componentType

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

function updateEdge() {
    network.body.data.nodes.update({
        id: "1", x: -75, y: -180, label: "ramu 1", title: "gram 1", shape: "ellipse", fixed: false,
    })
    network.body.data.nodes.update({
        id: "2", x: -75, y: -280, label: "ramu 1", title: "gram 2", shape: "ellipse", fixed: false,
    })
    network.body.data.edges.update({
        id: "4", from: "1", label: "hai",
        length: "100",
        title: "new value",
        to: "2", dashes: false
    });
    network.body.data.nodes.update({
        id: "1", x: -75, y: -180, label: "ramu 1", title: "gram 1", shape: "ellipse", fixed: true,
    })
    network.body.data.nodes.update({
        id: "2", x: -75, y: -280, label: "ramu 1", title: "gram 2", shape: "ellipse", fixed: true,
    })
}

function AddNewNode() {
    var txtNodeId = $("#txtNodeId").val();
    var txtNodeText = $("#txtNodeText").val();
    var txtNodeTitle = $("#txtNodeTitle").val();
    var ddlShape = $("#ddlShape").val();
    var txtNodeX = $("#txtNodeX").val();
    var txtNodeY = $("#txtNodeY").val();
    var txtNodeSize = $("#txtNodeSize").val();
    var txtNodeBGColor = $("#txtNodeBGColor").val();
    var txtNodeBColor = $("#txtNodeBColor").val();
    var txtNodeFontColor = $("#txtNodeFontColor").val();

    //network.body.data.nodes.add({
    //    id: txtNodeId,
    //    x: txtNodeX,
    //    y: txtNodeY,
    //    label: txtNodeText,
    //    title: txtNodeTitle,
    //    shape: ddlShape,
    //    //fixed: false,
    //    size: txtNodeSize,
    //    font: { color: txtNodeFontColor },
    //    color: { border: txtNodeBColor, background: txtNodeBGColor }
    //});
    network.body.data.nodes.add({
        id: txtNodeId,
        label: '' + txtNodeText + '',
        x: $("#txtNodeX").val(),
        y: $("#txtNodeY").val(),
        shape: $("#ddlShape").val(),
        size: 8,
        color: $("#txtNodeBGColor").val()
    });

}
function UpdateNewNode() {
    var txtNodeId = $("#txtNodeId").val();
    var txtNodeText = $("#txtNodeText").val();
    var txtNodeTitle = $("#txtNodeTitle").val();
    var ddlShape = $("#ddlShape").val();
    var txtNodeX = $("#txtNodeX").val();
    var txtNodeY = $("#txtNodeY").val();
    var txtNodeSize = $("#txtNodeSize").val();
    var txtNodeBGColor = $("#txtNodeBGColor").val();
    var txtNodeBColor = $("#txtNodeBColor").val();
    var txtNodeFontColor = $("#txtNodeFontColor").val();

    network.body.data.nodes.update({
        id: txtNodeId, x: txtNodeX, y: txtNodeY, label: txtNodeText, title: txtNodeTitle, shape: ddlShape, fixed: false, size: txtNodeSize, font: { color: txtNodeFontColor },
        color: { border: txtNodeBColor, background: txtNodeBGColor }
    });

}

function ClearAll() {
    init();
}

function RemoveSelection() {
    network.deleteSelected();
}

var arrow_types = [
    "arrow",
    "bar",
    "circle",
    "box",
    "crow",
    "curve",
    "inv_curve",
    "diamond",
    "triangle",
    "inv_triangle",
    "vee",
];

function AddNewEdge() {
    var txtEdgeId = $("#txtEdgeId").val();
    var txtFrom = $("#txtFrom").val();
    var txtTo = $("#txtTo").val();
    var txtLabel = $("#txtLabel").val();
    var txtTitle = $("#txtTitle").val();
    var txtLength = $("#txtLength").val();
    var txtColor = $("#txtColor").val();
    var txtFontAlign = $("#txtFontAlign").val();
    var ddlArrows = $("#ddlArrows").val();

    network.body.data.edges.add({
        id: txtEdgeId, from: txtFrom, to: txtTo, label: txtLabel, dashes: true, title: txtTitle, length: txtLength, color: txtColor, font: { align: txtFontAlign }
        , arrows: {
            to: {
                enabled: true,
                type: ddlArrows,
            },
            from: {
                enabled: true,
                type: ddlArrows,
            },
        },
        smooth: {
            enabled: true,
            type: $("#ddlSmooth").val(),
            roundness: $("#txtRoundness").val(),
        },
    });

}



function UpdateNewEdge() {
    beforeupdate();
    var txtEdgeId = $("#txtEdgeId").val();
    var txtFrom = $("#txtFrom").val();
    var txtTo = $("#txtTo").val();
    var txtLabel = $("#txtLabel").val();
    var txtTitle = $("#txtTitle").val();
    var txtLength = $("#txtLength").val();
    var txtColor = $("#txtColor").val();
    var txtFontAlign = $("#txtFontAlign").val();
    var ddlArrows = $("#ddlArrows").val();

    network.body.data.edges.update({
        id: txtEdgeId, from: txtFrom, to: txtTo, label: txtLabel, title: txtTitle, dashes: true, length: txtLength, color: txtColor, font: { align: txtFontAlign }
        , arrows: {
            to: {
                enabled: true,
                type: ddlArrows,
            },
            from: {
                enabled: true,
                type: ddlArrows,
            },
        },
        smooth: {
            enabled: true,
            type: $("#ddlSmooth").val(),
            roundness: $("#txtRoundness").val(),
        }
    });
    afterupdate();
}

function UnSelectAll() {
    network.unselectAll();
}

function afterupdate() {
    // create a network

    //anychart.onDocumentReady(function () {
    //    // create a chart and set the data
    //    var chart = anychart.graph(data);

    //    // prevent zooming the chart with the mouse wheel
    //    chart.interactivity().zoomOnMouseWheel(false);

    //    // configure the visual settings of edges
    //    chart.edges().normal().stroke("#ffa000", 2, "10 5", "round");
    //    chart.edges().hovered().stroke("#ffa000", 2, "10 5", "round");
    //    chart.edges().selected().stroke("#ffa000", 4);

    //    // set the container id
    //    chart.container("mynetwork");

    //    // initiate drawing the chart
    //    chart.draw();
    //});



    var options = {
        layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
        locale: document.getElementById("locale").value,
        physics: false,
        //physics: { "barnesHut": { "springLength": 10, "springConstant": 0.1 } } ,
        //physics: {
        //    stabilization: true
        //},
        interaction: { keyboard: false },
        //nodes: {
        //    fixed: {
        //        x: true,
        //        y: true,
        //    },
        //},
        //color: 'red',
        manipulation: {


            addNode: function (data, callback) {
                // filling in the popup DOM elements
                //alert(data.id);
                document.getElementById("operation").innerText = "Add Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = data.label;
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
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById("cancelButton").onclick = cancelEdit.bind(
                    this,
                    callback
                );
                //document.getElementById("addButton").onclick = AddData.bind(
                //    this
                //);
                //document.getElementById("addAmpButton").onclick = AddData.bind(
                //    this
                //);

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
            //addEdge: function (data, callback) {
            //    console.log(data.from)
            //    if (data.from == data.to) {
            //        var r = confirm("Do you want to connect the node to itself?");
            //        if (r == true) {
            //            callback(data);
            //        }
            //    } else {
            //        callback(data);
            //    }
            //},


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


    network.setOptions(options);

}
function beforeupdate() {
    // create a network

    var options = {
        layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
        locale: document.getElementById("locale").value,
        physics: true,
        //physics: { "barnesHut": { "springLength": 10, "springConstant": 0.1 } } ,
        //physics: {
        //    stabilization: true
        //},
        //interaction: { keyboard: false },
        //nodes: {
        //    fixed: {
        //        x: false,
        //        y: false,
        //    },
        //},
        //color: 'red',
        manipulation: {


            addNode: function (data, callback) {
                // filling in the popup DOM elements
                //alert(data.id);
                document.getElementById("operation").innerText = "Add Node";
                document.getElementById("node-id").value = data.id;
                document.getElementById("node-label").value = data.label;
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
                document.getElementById("saveButton").onclick = saveData.bind(
                    this,
                    data,
                    callback
                );
                document.getElementById("cancelButton").onclick = cancelEdit.bind(
                    this,
                    callback
                );
                //document.getElementById("addButton").onclick = AddData.bind(
                //    this
                //);
                //document.getElementById("addAmpButton").onclick = AddData.bind(
                //    this
                //);

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
            //addEdge: function (data, callback) {
            //    console.log(data.from)
            //    if (data.from == data.to) {
            //        var r = confirm("Do you want to connect the node to itself?");
            //        if (r == true) {
            //            callback(data);
            //        }
            //    } else {
            //        callback(data);
            //    }
            //},


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


    network.setOptions(options);

}

var isService = 0;
function AddService() {
    isService = 1;
    network.addEdgeMode();
}
function AddAgeMode() {
    isService = 0;
    network.addEdgeMode();
}
function EditAgeMode() {
    document.getElementById("editedge-popUp").style.display = "block";
    network.editEdgeMode();

}
function AddNodeMode() {
    network.addNodeMode();
}
function EditNodeMode() {
    network.editNode();
}

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

        if (elem == '')
            return;

        var dyid = token();
        network.body.data.nodes.add({
            id: dyid,
            label: elem.options.label,
            shape: elem.options.shape,
            icon: elem.options.icon,
            color: elem.options.color.background,
            x: elem.x + 10,
            y: elem.y + 10,
            title: elem.options.title,
            size: elem.options.size,
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

    //var fromlabel = "(" + nodes.get(dynamicid[0]).label + " -> " + nodes.get(dynamicid[1]).label + ")";
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
        componentType: edges.get(elem.id).componentType,
        //title: htmlTitle("uid : " + fromlabel + "\n" + "type : " + edges.get(elem.id).componentType),
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

function removeDefaultElement() {
    $("*.vis-manipulation").remove();
    $("*.vis-edit-mode").remove();
    $("*.vis-close").remove();
}
var nodeids = 0;
function AddMultipleNode() {

    //var somedata = getScaleFreeNetwork(10);
    //console.log(somedata);
    //nodes.update(new vis.DataSet(somedata.nodes));
    //edges.update(new vis.DataSet(somedata.edges));
    //debugger;
    //var data = getScaleFreeNetwork($("#txtNofNode").val());
    //var container = document.getElementById("mynetwork");
    ////var data = getScaleFreeNetwork(nodeCount);
    //var options = {
    //    physics: { stabilization: false },
    //};
    //network = new vis.Network(container, data, options);
    var totalcount = Number($("#txtNofNode").val());
    var x = 0;
    var y = 0;
    for (var i = 1; i <= totalcount; i++) {
        //nodeids++;
        x = x + 10;
        y = y + 10;
        network.body.data.nodes.add({
            id: token(),
            label: "site " + i,
            x: x,
            y: y,
            componentType: 'node'
        })
    }
}

var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function () {
    return rand() + rand(); // to make it longer
};

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
    deletedata("1");
    init();
}

async function deletedata(id) {
    try {
        var noOfStudentRemoved = await jsstoreCon.remove({
            from: 'tbl_network',
            where: {
                id: id
            }
        });
    } catch (ex) {
        alert(ex.message);
    }
}

function clearEditEdgePopUp() {

    document.getElementById("editedge-popUp").style.display = "none";
    network.disableEditMode();
}

function cancelEditEdgeEdit() {

    clearEditEdgePopUp()
}

function saveEditEdgeData() {
    var txtEdgeId = $("#txtEdgeId").val();
    var txtLabel = $("#editedge-label").val();
    var txtTitle = $("#editedge-title").val();
    var txtFontAlign = $("#editedge-fontalign").val();

    network.body.data.edges.update({
        id: txtEdgeId, label: txtLabel, title: txtTitle, font: { align: txtFontAlign }

    });
    $("#txtEdgeId").val('');
    $("#edge-label").val('');
    $("#edge-title").val('');
    $("#edge-fontalign").val('');
    clearEditEdgePopUp();
}

var isAddEdge = 0;
var addEdgeData = {
    from: '',
    to:''
};
function manualAddEdge() {


    var labelvalue = '['+nodes.get(addEdgeData.from).label + ' - ' + nodes.get(addEdgeData.to).label+']';
    network.body.data.edges.add({
        id: token(), from: addEdgeData.from, to: addEdgeData.to, label: labelvalue, font: { align: 'top' },
        componentType:"edge"
    });
    isAddEdge = 0;
    addEdgeData = {
        from: '',
        to: ''
    };
    UnSelectAll();
}
function manualAddEdgeMode() {
    UnSelectAll();
    isAddEdge = 1;
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

    var labelvalue = '[' + nodes.get(addServiceData.from).label + ' - ' + nodes.get(addServiceData.to).label + ']';
    network.body.data.edges.add({
        id: token(), from: addServiceData.from, to: addServiceData.to, label: labelvalue, dashes: true, color: 'red', font: { align: 'top' }
        , arrows:arrows1,
        smooth: smooth1,
        componentType: "service"
    });

    isAddService = 0;
    addServicData = {
        from: '',
        to: ''
    };
    UnSelectAll();
}
function manualAddServiceMode() {
    UnSelectAll();
    isAddService = 1;
    addServiceData = {
        from: '',
        to: ''
    };
}

//const NO_CLICK = 0;
//const RIGHT_CLICK = 3;

//// Selector
//function canvasify(DOMx, DOMy) {
//    const { x, y } = network.DOMtoCanvas({ x: DOMx, y: DOMy });
//    return [x, y];
//}

//function correctRange(start, end) {
//    return start < end ? [start, end] : [end, start];
//}

//function selectFromDOMRect() {
//    const [sX, sY] = canvasify(DOMRect.startX, DOMRect.startY);
//    const [eX, eY] = canvasify(DOMRect.endX, DOMRect.endY);
//    const [startX, endX] = correctRange(sX, eX);
//    const [startY, endY] = correctRange(sY, eY);

//    network.selectNodes(nodes_distri.get().reduce(
//        (selected, { id }) => {
//            const { x, y } = network.getPositions(id)[id];
//            return (startX <= x && x <= endX && startY <= y && y <= endY) ? selected.concat(id) : selected;
//            //And nodes.get(id).hidden ? Depending on the behavior expected
//        }, []
//    ));
//}

//function rectangle_mousedown(evt) {
//    // Handle mouse down event = beginning of the rectangle selection

//    var pageX = event.pageX;    // Get the horizontal coordinate
//    var pageY = event.pageY;    // Get the vertical coordinate
//    var which = event.which;    // Get the button type

//    // When mousedown, save the initial rectangle state
//    if (which === RIGHT_CLICK) {
//        Object.assign(DOMRect, {
//            startX: pageX - container.offsetLeft,
//            startY: pageY - container.offsetTop,
//            endX: pageX - container.offsetLeft,
//            endY: pageY - container.offsetTop
//        });
//        drag = true;
//    }
//}

//function rectangle_mousedrag(evt) {
//    // Handle mouse drag event = during the rectangle selection
//    var pageX = event.pageX;    // Get the horizontal coordinate
//    var pageY = event.pageY;    // Get the vertical coordinate
//    var which = event.which;    // Get the button type

//    if (which === NO_CLICK && drag) {
//        // Make selection rectangle disappear when accidently mouseupped outside 'container'
//        drag = false;
//        network.redraw();
//    } else if (drag) {
//        // When mousemove, update the rectangle state
//        Object.assign(DOMRect, {
//            endX: pageX - container.offsetLeft,
//            endY: pageY - container.offsetTop
//        });
//        network.redraw();
//    }
//}

//function rectangle_mouseup(evt) {
//    // Handle mouse up event = beginning of the rectangle selection

//    var pageX = event.pageX;    // Get the horizontal coordinate
//    var pageY = event.pageY;    // Get the vertical coordinate
//    var which = event.which;    // Get the button type

//    // When mouseup, select the nodes in the rectangle
//    if (which === RIGHT_CLICK) {
//        drag = false;
//        network.redraw();
//        selectFromDOMRect();
//    }
//}

//function draw_rectangle_on_network(ctx) {
//    // Draw a rectangle regarding the current selection
//    if (drag) {
//        const [startX, startY] = canvasify(DOMRect.startX, DOMRect.startY);
//        const [endX, endY] = canvasify(DOMRect.endX, DOMRect.endY);

//        ctx.setLineDash([5]);
//        ctx.strokeStyle = 'rgba(78, 146, 237, 0.75)';
//        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
//        ctx.setLineDash([]);
//        ctx.fillStyle = 'rgba(151, 194, 252, 0.45)';
//        ctx.fillRect(startX, startY, endX - startX, endY - startY);
//    }
//}


//function makeMeMultiSelect(container, network, nodes) {
//    // State
//    drag = false;
//    DOMRect = {};

//    // Disable default right-click dropdown menu
//    container.oncontextmenu = () => false;

//    // Listeners
//    //container.mousedown()
//    $(document).on("mousedown", function (evt) { rectangle_mousedown(evt) });
//    $(document).on("mousemove", function (evt) { rectangle_mousedrag(evt) });
//    $(document).on("mouseup", function (evt) { rectangle_mouseup(evt) });

//    // Drawer
//    network.on('afterDrawing', function (ctx) { draw_rectangle_on_network(ctx) });
//}