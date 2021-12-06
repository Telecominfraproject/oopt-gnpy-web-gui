let Attenuator = document.querySelector('#Attenuator');
let roadm = document.querySelector('#roadm');
let amplifier = document.querySelector('#amplifier');
let duelfiber = document.querySelector('#duelfiber');
let service = document.querySelector('#service');
let create = document.querySelector('#create');
let transceiver = document.querySelector('#transceiver');
let singlefiber = document.querySelector('#singlefiber');


let drawerclose = document.getElementById('drawer-close')

function openDrawer(node) {
    switch (node) {
        case 'Attenuator':
            roadm.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            duelfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            Attenuator.classList.add('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');


            //  drawerclose.classList.add("drawerleft")
            break;
        case 'roadm':
            Attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            duelfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');


            roadm.classList.add('d-visible');
            // drawerclose.classList.add("drawerleft")
            break;
        case 'amplifier':
            Attenuator.classList.remove('d-visible');
            amplifier.classList.add('d-visible');
            duelfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'duelfiber':
            Attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            duelfiber.classList.add('d-visible');
            service.classList.remove('d-visible');
            create.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'create':
            Attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            duelfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            create.classList.add('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'transceiver':
            Attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            duelfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            create.classList.remove('d-visible');
            transceiver.classList.add('d-visible');
            singlefiber.classList.remove('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'singlefiber':
            Attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            duelfiber.classList.remove('d-visible');
            service.classList.remove('d-visible');
            roadm.classList.remove('d-visible');
            create.classList.remove('d-visible');
            transceiver.classList.remove('d-visible');
            singlefiber.classList.add('d-visible');

            // drawerclose.classList.add("drawerleft")
            break;
        case 'service':
            Attenuator.classList.remove('d-visible');
            amplifier.classList.remove('d-visible');
            duelfiber.classList.remove('d-visible');
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
        case 'Attenuator':
            Attenuator.classList.remove('d-visible');
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
        case 'duelfiber':
            duelfiber.classList.remove('d-visible');
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



arrowbtn1.addEventListener("click", function () {
    tabcontent.classList.toggle('left-59')
    for (var i = 0; i < sidebartext.length; i++) {
        sidebartext[i].classList.toggle("d-none")
    }
})

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
    switch (index) {
        case 1:
            break;
        case 2:
            let prev = document.querySelector("#step2").previousElementSibling;
            if (prev.id === "step1") {
                let step1 = document.getElementById("step1").childNodes;
                step1[1].classList.add("tab-nav-completed");
                step1[1].classList.add("text-tab-completed")
            }
            break;
        case 3:
            let prev1 = document.querySelector("#step3").previousElementSibling;
            if (prev1.id === "step2") {
                let step1 = document.getElementById("step2").childNodes;
                step1[1].classList.add("tab-nav-completed");
                step1[1].classList.add("text-tab-completed")
            }
            break;
        case 4:
            let prev2 = document.querySelector("#step4").previousElementSibling;
            if (prev2.id === "step3") {
                let step1 = document.getElementById("step3").childNodes;
                step1[1].classList.add("tab-nav-completed");
                step1[1].classList.add("text-tab-completed")
            }
            break;
        case 5:
            let prev3 = document.querySelector("#step5").previousElementSibling;
            if (prev3.id === "step4") {
                let step1 = document.getElementById("step4").childNodes;
                step1[1].classList.add("tab-nav-completed");
                step1[1].classList.add("text-tab-completed")
            }
            break;
    }
}







