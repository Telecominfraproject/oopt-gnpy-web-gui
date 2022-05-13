 
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
    window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

//const employeeData = [
//    { id: "1", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
//    { id: "2", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" }
//];
var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
    readAll();
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", { keyPath: "id" });

    //for (var i in employeeData) {
    //    objectStore.add(employeeData[i]);
    //}
}
var datas = "";
function read(id) {
    var transaction = db.transaction(["employee"]);
    var objectStore = transaction.objectStore("employee");
    var request = objectStore.get(id);
    //console.log(request);
    datas = request;
    request.onerror = function (event) {
        alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function (event) {
        // Do something with the request.result!
        if (request.result) {
            $("#txtID").val(request.result.id);
            $("#txtName").val(request.result.name);
            $("#txtAge").val(request.result.age);
            $("#txtEmail").val(request.result.email);
            // alert("Name: " + request.result.name + " Age: " + request.result.age + ", Email: " + request.result.email);
        }
        else {
            alert("given id couldn't be found in your database!");
        }
    };
}


function clear() {
    $("#txtID").val('');
    $("#txtName").val('');
    $("#txtAge").val('');
    $("#txtEmail").val('');
}
function readAll() {
    var objectStore = db.transaction("employee").objectStore("employee");
    $("#tblData tbody").empty();
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;


        if (cursor) {
            var data = "<tr><td>" + cursor.key + "</td><td>" + cursor.value.name + "</td><td>" + cursor.value.age + "</td><td>" + cursor.value.email + "</td><td><input type ='button' onclick = read('" + cursor.key + "') value='Read'/><input type ='button' onclick = remove('" + cursor.key + "') value='Remove'/></td></tr>";
            $("#tblData tbody").append(data);
            cursor.continue();
        }
        //else {
        //    alert("No more entries!");
        //}

    };
}

function add() {
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({ id: $("#txtID").val(), name: $("#txtName").val(), age: $("#txtAge").val(), email: $("#txtEmail").val() });

    request.onsuccess = function (event) {
        alert("record has been added to your database.");
        clear();
        readAll();
    };

    request.onerror = function (event) {
        alert("Unable to add data\r\n record is aready exist in your database! ");
    }
}

function update() {
   
    
    readyByID($("#txtID").val());
    datas.result.name = $("#txtName").val();
    datas.result.age = $("#txtAge").val();
    datas.result.email = $("#txtEmail").val();

    //console.log(datas.result)
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        //.put({ id: $("#txtID").val(), name: $("#txtName").val(), age: $("#txtAge").val(), email: $("#txtEmail").val() });
        .put(datas.result);

    request.onsuccess = function (event) {
        alert("record has been updated to your database.");
        clear();
        readAll();
    };

    request.onerror = function (event) {
        alert("Unable to add data\r\n this record aready exist in your database! ");
    }
}

function readyByID(id) {
    var transaction = db.transaction(["employee"]);
    var objectStore = transaction.objectStore("employee");
    var request = objectStore.get(id);

    request.onerror = function (event) {
        alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function (event) {
        // Do something with the request.result!
        //debugger;
        if (request.result) {
            datas = request;
            //return datas
        }
        else {
            alert("given id couldn't be found in your database!");
        }
    };
}

function remove(id) {
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete(id);

    request.onsuccess = function (event) {
        alert("record entry has been removed from your database.");
        clear();
        readAll();
    };
}
