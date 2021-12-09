
function nameLengthValidation(element) {
    var flag = true;
    var elementID="#"+element
    var maxLength = Number(configData.node.site_length);
    //var maxDegree = Number(configData.node[$("#ddlNodeType").val()].max_degree);
    //var regex = /^[1-9-+()]*$/;
    //isDegreeValid = regex.test(document.getElementById("txtNodeDegree").value);
    var msg = "";

    if ($(elementID).val().trim() == '') {
        msg = "Please enter the name";
        flag = false;
    }
    else if (Number($(elementID).val().trim().length) > maxLength) {
        msg = "name length should be below than 20";
        flag = false;
    }
    //else if ($("#txtNodeDegree").val().trim() == '') {
    //    msg = "Please enter the node degree";
    //    flag = false;
    //}
    //else if (!isDegreeValid || Number($("#txtNodeDegree").val().trim() > maxDegree)) {
    //    msg = "Please enter the valid degree";
    //    flag = false;
    //}
    if (!flag)
        alert(msg);
    return flag;
}
function addMulNodeVal() {
    var flag = false;
    var regex = /^[1-9-+()]*$/;
    isValid = regex.test(document.getElementById("txtNofNode").value);
    var maxNode = Number(configData.node.multiplenode.max);

    if ($("#txtNofNode").val().trim() != '' && isValid && Number($("#txtNofNode").val().trim() < maxNode))
        flag = true;
    else
        alert('please enter valid number');
    return flag;
}
function exportFileValidation() {
    var flag = false;
    if ($("#txtFileName").val().trim() != '')
        flag = true;
    else
        alert('please enter file name');
    return flag;
}
function roadmProVal() {
    var flag = false;
    if ($("#ddlRoadmList").val().trim() != 0 && $("#ddlROADMType").val().trim() != 0 && $("#ddlRPreAmpType").val().trim() != 0 && $("#ddlRBoosterType").val().trim() != 0)
        flag = true;
    else
        alert('please enter the value');
    return flag;
}