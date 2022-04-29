$(document).ready(function () {
    $("#txtSpan_Length").change(function () {
        var span_length = $("#txtSpan_Length").val().trim();
        var spanlen = parseFloat(span_length);
        if (isNaN(span_length) || spanlen <= 0 || span_length == "") {
            $("#txtSpan_Length").addClass('input_error');
            return;
        }
        else
            $("#txtSpan_Length").removeClass('input_error');

        if ($('#cbxLength_Based_Loss').is(":checked")) {
            fiberCalc();
                
        }
    });
    $("#txtLoss_Coefficient").change(function () {
        if ($('#cbxLength_Based_Loss').is(":checked")) {
            var span_length = $("#txtLoss_Coefficient").val().trim();
            var spanlen = parseFloat(span_length);
            if (isNaN(span_length) || spanlen <= 0 || span_length == "") {
                $("#txtLoss_Coefficient").addClass('input_error');
                return;
            }
            else
                $("#txtLoss_Coefficient").removeClass('input_error');

            fiberCalc();
        }
        else
            $("#txtLoss_Coefficient").removeClass('input_error');

        

    });
    function fiberCalc() {
        var span_length = $("#txtSpan_Length").val();
        var spanlen = parseFloat(span_length);
        var loss_coeff = $("#txtLoss_Coefficient").val();
        var lossCoeff = parseFloat(loss_coeff);
        if (!isNaN(span_length) || spanlen >= 0 || span_length != "" || !isNaN(loss_coeff) || lossCoeff >= 0 || loss_coeff != "")
            fiberLengthCal('txtSpan_Length', 'txtLoss_Coefficient', 'txtSpan_Loss');
    }
    $("#ddlSingleFiberType").change(function () {
        if ($(this).val()=="") {
            $("#ddlSingleFiberType").addClass('input_error');
            return;
        }
        else
            $("#ddlSingleFiberType").removeClass('input_error');

    });
    $("#ddlRoadmType").change(function () {
        if ($(this).val() == "") {
            $("#ddlRoadmType").addClass('input_error');
            return;
        }
        else
            $("#ddlRoadmType").removeClass('input_error');

    });
    $("#ddlAmplifierType").change(function () {
        if ($(this).val() == "") {
            $("#ddlAmplifierType").addClass('input_error');
            return;
        }
        else
            $("#ddlAmplifierType").removeClass('input_error');

    });
    $("#ddlRamanAmpType").change(function () {
        if ($(this).val() == "") {
            $("#ddlRamanAmpType").addClass('input_error');
            return;
        }
        else
            $("#ddlRamanAmpType").removeClass('input_error');

    });
    $("#ddlRamanAmpCategory").change(function () {
        if ($(this).val() == "") {
            $("#ddlRamanAmpCategory").addClass('input_error');
            return;
        }
        else
            $("#ddlRamanAmpCategory").removeClass('input_error');

    });
    $("#ddlTransceiverType").change(function () {
        if ($(this).val() == "") {
            $("#ddlTransceiverType").addClass('input_error');
            return;
        }
        else
            $("#ddlTransceiverType").removeClass('input_error');

    });

});

function nameLengthValidation(element) {
    var flag = true;
    var elementID = "#" + element
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
        msg = "Name length should be below than 20";
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
        showMessage(alertType.Error, msg);
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
        showMessage(alertType.Error, 'Please enter valid number');
    return flag;
}
function exportFileValidation() {
    var flag = false;
    if ($("#txtFileName").val().trim() != '')
        flag = true;
    else
        showMessage(alertType.Error, 'Please enter file name');
    return flag;
}
function roadmProVal() {
    var flag = false;
    if ($("#ddlRoadmList").val().trim() != 0 && $("#ddlROADMType").val().trim() != 0 && $("#ddlRPreAmpType").val().trim() != 0 && $("#ddlRBoosterType").val().trim() != 0)
        flag = true;
    else
        showMessage(alertType.Error, 'Please enter the value');
    return flag;
}