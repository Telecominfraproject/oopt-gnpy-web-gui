let multi = document.querySelector('#multi');
let single = document.querySelector('#single');
//let amplifier = document.querySelector('#amplifier');
let fibre = document.querySelector('#fibre');
let service = document.querySelector('#service');
//let drawerclose = document.getElementById('drawer-close')

function openDrawer(node) {
    switch (node) {
        case 'multi':
            single.classList.remove('d-visible');
            //amplifier.classList.remove('d-visible');
            fibre.classList.remove('d-visible');
            service.classList.remove('d-visible');
            multi.classList.add('d-visible');
            //  drawerclose.classList.add("drawerleft")
            break;
        case 'single':
            multi.classList.remove('d-visible');
            //amplifier.classList.remove('d-visible');
            fibre.classList.remove('d-visible');
            service.classList.remove('d-visible');
            single.classList.add('d-visible');
            // drawerclose.classList.add("drawerleft")
            break;
        case 'amplifier':
            multi.classList.remove('d-visible');
            //amplifier.classList.add('d-visible');
            fibre.classList.remove('d-visible');
            service.classList.remove('d-visible');
            single.classList.remove('d-visible');
            // drawerclose.classList.add("drawerleft")
            break;
        case 'fibre':
            multi.classList.remove('d-visible');
            //amplifier.classList.remove('d-visible');
            fibre.classList.add('d-visible');
            service.classList.remove('d-visible');
            single.classList.remove('d-visible');
            // drawerclose.classList.add("drawerleft")
            break;
        case 'service':
            multi.classList.remove('d-visible');
            //amplifier.classList.remove('d-visible');
            fibre.classList.remove('d-visible');
            service.classList.add('d-visible');
            single.classList.remove('d-visible');
            // drawerclose.classList.add("drawerleft")
            break;
    }
}

function closeDrawer(node) {
    switch (node) {
        case 'multi':
            multi.classList.remove('d-visible');
            $("#txtNofNode").val('');
            //drawerclose.classList.remove("drawerleft")
            break;
        case 'single':
            single.classList.remove('d-visible');
            //drawerclose.classList.remove("drawerleft")
            break;
        case 'amplifier':
            //amplifier.classList.remove('d-visible');
            //drawerclose.classList.remove("drawerleft")
            break;
        case 'fibre':
            fibre.classList.remove('d-visible');
            //drawerclose.classList.remove("drawerleft")
            break;
        case 'service':
            service.classList.remove('d-visible');
            //drawerclose.classList.remove("drawerleft")
    }
}

//sidebar

//let sidebarleft = document.querySelector('#sidebar');
//let buttonleft = document.getElementById('lefttoggle');
//buttonleft.addEventListener("click", function () {
//    sidebarleft.classList.toggle("d-left-none")
//    buttonleft.classList.toggle('ml--btn')
//})






