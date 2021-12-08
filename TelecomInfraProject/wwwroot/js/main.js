let attenuator = document.querySelector('#attenuator');
let roadm = document.querySelector('#roadm');
let amplifier = document.querySelector('#amplifier');
let dualfiber = document.querySelector('#dualfiber');
let service = document.querySelector('#service');
let create = document.querySelector('#create');
let transceiver = document.querySelector('#transceiver');
let singlefiber = document.querySelector('#singlefiber');


let drawerclose = document.getElementById('drawer-close')

function openDrawer(node) {
    switch (node) {
        case 'attenuator':
            roadm.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            dualfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            attenuator.classList.add('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');


            //  drawerclose.classList.add("drawerleft")
            break;
        case 'roadm':
            attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            dualfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');


            roadm.classList.add('d-visible');
            // drawerclose.classList.add("drawerleft")
            break;
        case 'amplifier':
            attenuator.classList.remove('d-visible');
            amplifier.classList.add('d-visible');
            dualfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'dualfiber':
            attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            dualfiber.classList.add('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'create':
            attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            dualfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            create.classList.add('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'transceiver':
            attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            dualfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            create.classList.remove('d-visible');
            transceiver.classList.add('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'singlefiber':
            attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            dualfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            create.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.add('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'service':
            attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            dualfiber.classList.remove('d-visible');
            service.classList.add('d-visible');
            roadm.classList.remove('d-visible');
            create.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
    }
}

function closeDrawer(node) {
    switch (node) {
        case 'attenuator':
            attenuator.classList.remove('d-visible');
            // drawerclose.classList.remove("drawerleft")
            break;
        case 'roadm':
            roadm.classList.remove('d-visible');
            // drawerclose.classList.remove("drawerleft")
            break;
        case 'amplifier':
            amplifier.classList.remove('d-visible');
            // drawerclose.classList.remove("drawerleft")
            break;
        case 'create':
            create.classList.remove('d-visible');
            // drawerclose.classList.remove("drawerleft")
            break;
        case 'singlefiber':
            singlefiber.classList.remove('d-visible');
            // drawerclose.classList.remove("drawerleft")
            break;
        case 'transceiver':
            transceiver.classList.remove('d-visible');
            // drawerclose.classList.remove("drawerleft")
            break;
        case 'dualfiber':
            dualfiber.classList.remove('d-visible');
            // drawerclose.classList.remove("drawerleft")
            break;
        case 'service':
            service.classList.remove('d-visible');
        // drawerclose.classList.remove("drawerleft")
    }
}

//sidebar

// let sidebarleft = document.querySelector('#sidebar');
// let buttonleft = document.getElementById('lefttoggle');
// buttonleft.addEventListener("click",function(){
//   sidebarleft.classList.toggle("d-left-none")
//   buttonleft.classList.toggle('ml--btn')
// })


var tabcontent = document.querySelector(".stp-tab");
var arrowbtn1 = document.querySelector("#toggle-arrow-1");
var arrowbtn2 = document.querySelector("#toggle-arrow-2");
var arrowbtn3 = document.querySelector("#toggle-arrow-3");
var arrowbtn4 = document.querySelector("#toggle-arrow-4");
//var arrowbtn5 = document.querySelector("#toggle-arrow-5");
var sidebartext = document.querySelectorAll(".sidebar-text");
var sidebartext1 = document.querySelectorAll(".sidebar-text1");
var sidebartext2 = document.querySelectorAll(".sidebar-text2");
var sidebartext3 = document.querySelectorAll(".sidebar-text3");




arrowbtn2.addEventListener("click", function () {
    tabcontent.classList.toggle('left-59')
    for (var i = 0; i < sidebartext1.length; i++) {
        sidebartext1[i].classList.toggle("d-none")
    }


})

arrowbtn3.addEventListener("click", function () {
    tabcontent.classList.toggle('left-59')
    for (var i = 0; i < sidebartext2.length; i++) {
        sidebartext2[i].classList.toggle("d-none")
    }

})
arrowbtn4.addEventListener("click", function () {
    tabcontent.classList.toggle('left-59')
    for (var i = 0; i < sidebartext3.length; i++) {
        sidebartext3[i].classList.toggle("d-none")
    }
})
//arrowbtn5.addEventListener("click", function () {
//    tabcontent.classList.toggle('left-59')
//    for (var i = 0; i < sidebartext4.length; i++) {
//        sidebartext4[i].classList.toggle("d-none")
//    }
//})



function stepColor(index) {
    showMenu = 0;
    modeHighLight();
    
    switch (index) {
        case 1:
            break;
        case 2:
            currentStepper = "stepCreateTopology";
            showMenu = 1;
            let prev = document.querySelector("#step2").previousElementSibling;
            if (prev.id === "step1") {
                let step1 = document.getElementById("step1").childNodes;
                step1[1].classList.add("tab-nav-completed");
                step1[1].classList.add("text-tab-completed")
            }
            break;
        case 3:
            currentStepper = "stepAddService";
            showMenu = 2;
            let prev1 = document.querySelector("#step3").previousElementSibling;
            if (prev1.id === "step2") {
                let step1 = document.getElementById("step2").childNodes;
                step1[1].classList.add("tab-nav-completed");
                step1[1].classList.add("text-tab-completed")
            }
            break;
        case 4:
            currentStepper = "stepSaveNetwork";
            let prev2 = document.querySelector("#step4").previousElementSibling;
            if (prev2.id === "step3") {
                let step1 = document.getElementById("step3").childNodes;
                step1[1].classList.add("tab-nav-completed");
                step1[1].classList.add("text-tab-completed")
            }
            break;
    }
}
var btnAddRoadm = "#btnAddRoadm";
var btnAddFused = "#btnAddFused";
var btnAddAmp = "#btnAddAmp";
var btnAddTransceiver = "#btnAddTransceiver";
var btnAddDualFiber = "#btnAddDualFiber";
var btnAddSingleFiber = "#btnAddSingleFiber"; 
var btnServiceActive = "#btnServiceActive";
function modeHighLight(node) {
    disableFiberService();
    showHideDrawerandMenu();
    switch (node) {
        case 'Roadm':
            $(btnAddRoadm).addClass('highlight');
            $(btnAddFused).removeClass('highlight');
            $(btnAddAmp).removeClass('highlight');
            $(btnAddTransceiver).removeClass('highlight');
            $(btnAddDualFiber).removeClass('highlight');
            $(btnAddSingleFiber).removeClass('highlight');
            break;
        case 'amplifier':
            $(btnAddRoadm).removeClass('highlight');
            $(btnAddFused).removeClass('highlight');
            $(btnAddAmp).addClass('highlight');
            $(btnAddTransceiver).removeClass('highlight');
            $(btnAddDualFiber).removeClass('highlight');
            $(btnAddSingleFiber).removeClass('highlight');
            break;
        case 'fused':
            $(btnAddRoadm).removeClass('highlight');
            $(btnAddFused).addClass('highlight');
            $(btnAddAmp).removeClass('highlight');
            $(btnAddTransceiver).removeClass('highlight');
            $(btnAddDualFiber).removeClass('highlight');
            $(btnAddSingleFiber).removeClass('highlight');
            break;
        case 'transceiver':
            $(btnAddRoadm).removeClass('highlight');
            $(btnAddFused).removeClass('highlight');
            $(btnAddAmp).removeClass('highlight');
            $(btnAddTransceiver).addClass('highlight');
            $(btnAddDualFiber).removeClass('highlight');
            $(btnAddSingleFiber).removeClass('highlight');
            break;
        case 'dualfiber':
            $(btnAddRoadm).removeClass('highlight');
            $(btnAddFused).removeClass('highlight');
            $(btnAddAmp).removeClass('highlight');
            $(btnAddTransceiver).removeClass('highlight');
            $(btnAddDualFiber).addClass('highlight');
            $(btnAddSingleFiber).removeClass('highlight');
            break;
        case 'singlefiber':
            $(btnAddRoadm).removeClass('highlight');
            $(btnAddFused).removeClass('highlight');
            $(btnAddAmp).removeClass('highlight');
            $(btnAddTransceiver).removeClass('highlight');
            $(btnAddDualFiber).removeClass('highlight');
            $(btnAddSingleFiber).addClass('highlight');
            break;
        case 'service':
            $(btnServiceActive).addClass('highlight');
            break;
        default:
            $(btnAddRoadm).removeClass('highlight');
            $(btnAddFused).removeClass('highlight');
            $(btnAddAmp).removeClass('highlight');
            $(btnAddTransceiver).removeClass('highlight');
            $(btnAddDualFiber).removeClass('highlight');
            $(btnAddSingleFiber).removeClass('highlight');
            $(btnServiceActive).removeClass('highlight');
           
    }
}

function showHideDrawerandMenu() {
    document.getElementById("roadmMenu").style.display = "none";
    document.getElementById("attenuatorMenu").style.display = "none";
    document.getElementById("amplifierMenu").style.display = "none";
    document.getElementById("transceiverMenu").style.display = "none";
    document.getElementById("serviceMenu").style.display = "none";
    document.getElementById("singleFiberMenu").style.display = "none";
    document.getElementById("dualFiberMenu").style.display = "none";
    
    closeDrawer('roadm');
    closeDrawer('attenuator');
    closeDrawer('amplifier');
    closeDrawer('transceiver');
    closeDrawer('service');
    closeDrawer('dualfiber');
    closeDrawer('singlefiber');
}





