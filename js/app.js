//INICIA EL JS DE PHONEGAP
document.addEventListener("deviceready", onDeviceReady, false);

/***** GoToChat *****/
var idViewEvent = '';
var chat_active = 'no';
var lang = 'en';

function ChangeLanguage(language) {
    document.getElementById('lang-app-guest').value = language;
    window.localStorage.setItem("lang_app_guest", language);
    LanguageJS.translate(language, 'index');
    lang = language;

    /*if(getCookie('guestLang')!= lang && get_field_modules('10','2')!= '' && item == 'login'){
        expires = new Date();
        mes = expires.getMonth();
        expires.setMonth(mes + 1);
        document.cookie = "guestLang="+lang+"; expires="+expires.toUTCString();
        //window.top.frames.location.reload();
    }*/
}

if (window.localStorage.getItem('lang_app_guest')) {
    lang= window.localStorage.getItem('lang_app_guest');
}


switch(lang){
    case 'es' : 
        var msj_error = 'Verifique su conexión a internet';
    break;
    case 'th' : 
        var msj_error = 'ตรวจสอบการเชื่อมต่ออินเตอร์เน็ตของคุณ';
    break;
    case 'zh-CN' : 
        var msj_error = '验证您的网络连接';
    break;
    default:
        var msj_error = 'Verify your internet connection';
    break;
}

var rute = '';
//var rute = 'webservices/'; //Local
var rute = 'https://mynuvola.com/angel_v2/webservices/'; //Local
var BASE_URL_BACKEND = 'https://desarrollo12.mynuvola.com/'; // base actual en donde reposan las imágenes de los productos del módulo de ordenes

function onDeviceReady() {}

//INICIA EL JS DE LA APLICACIÓN

var myApp = new Framework7({
    modalTitle: 'Notification',
    material: false,
    fastClicks: true,
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    domCache: true
});

var getUrlParameter = function (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

if (getUrlParameter('e')) {
    window.localStorage.setItem("url_EventID", getUrlParameter('e'));
    //console.log(window.location.href = "https://angel.mynuvola.com");
    //window.location.href = "http://127.0.0.1/nuvola-angel/";
    console.log('entro a este link');
    window.location.href = window.location.href.replace(/&?e=([^&]$|[^&]*)/i, "");
    //window.location.href = "https://mantra.mynuvola.com";
}


function goToIndex() {
    mainView.router.load({
        pageName: 'index'
    });
}

// Init Messages
var myMessages = myApp.messages('.messages', {
    autoLayout: true
});


// INICIA EL SCRIPT DEL PULL-TO-REFRESH
var ptrContent = $$('.pull-to-refresh-content');

ptrContent.on('refresh', function(e) {
    actual_page = localStorage.getItem('actual_page');
    switch(actual_page){
        case 'packages':
            GoToPackagesLostFound();
        break;
        case 'productList':
            GoToProductList();
        break;
        default:
            ListEventDashboard('page-request');
    }
    setTimeout(function () {
        myApp.pullToRefreshDone();
     }, 2100);
});
// TERMINA EL SCRIPT DEL PULL-TO-REFRESH

var name_hotel;

/*LIST EVENTS DASHBOARD*/
function ListEventDashboard(page) {
    /*LLENAR LOS CAMPOS DEL CREATE REQUEST */
    localStorage.setItem('actual_page', 'dashboard');
    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    
    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'checking_id': window.localStorage.getItem('checking_id'),
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-dashboard.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {

            //Badge Count Notification
            if(response[0]['total_count_new_chat']>0){
                $("#count-dashboard-msg").html('<span class="badge-dashboard" >'+response[0]['total_count_new_chat']+'</span>');
            }else{
                $("#count-dashboard-msg").html('');
            }

            $("#all-dashboard-pending").html(response[0]['html_all_pending']);
            $("#all-dashboard-completed").html(response[0]['html_all_completed']);

            $("#dashboard-pending").html(response[0]['html_pending']);
            $("#dashboard-completed").html(response[0]['html_completed']);

            $("#name-hotel").html(response[0]['hotel_name']);
            $("#requests-name-hotel").html(response[0]['hotel_name']);

            $("input").blur();
            setTimeout(function() {
                mainView.router.load({
                    pageName: page
                });
            }, 500);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //myApp.alert(msj_error);
        }
    });
}

//MOSTRAT OCULTAR FORM SEARCH
jQuery(document).ready(function() {
    $(".oculto").hide();
    $(".mostrar-search").click(function() {
        if ($("#form-search-home").is(':visible')) {
            $("#form-search-home").hide("fast");
        } else {
            $("#form-search-home").show("fast");
            $("#input-search-home").focus();
            $("#tabs-index").css("margin-top", "50px");
        }
    });

    $("#input-search-home").focusout(function() {
        if ($("#input-search-home").val() == '') {
            $("#form-search-home").hide("fast");
            $("#tabs-index").css("margin-top", "-10px");
        }
    });           

    //Capturamos el evento del click en el botón del Widget Tripadvisor para enviar un correo
    $(document).on('submit', function(e){
            e.preventDefault();
            if(e['target']['9'] != null && e['target']['9'] != ''){
                comment = e['target']['9'].value;
                if(comment != '' && comment != e['target']['9'].defaultValue){
                    SendTripAdvisorMail(comment);
                    //console.log(e['target']['9'].value);
                    goToIndex();
                }    
            }
            
        });
});

function AutoLogin() {
    if ((!!window.localStorage.getItem('login_email')) && (!!window.localStorage.getItem('login_tel'))) {
        //Auto Login
        document.getElementById('login-email').value = window.localStorage.getItem('login_email');
        $("#login-tel").intlTelInput("setCountry", window.localStorage.getItem('login_country'));
        document.getElementById('login-tel').value = window.localStorage.getItem('login_tel');

        //Preguntamos por el Lenguaje
        if (window.localStorage.getItem('lang_app_guest')) {
            lang = localStorage.getItem('lang_app_guest');
            document.getElementById('lang-app-guest').value = lang;
            LanguageJS.translate(lang, 'index');
        }
        $("#login-screen").removeClass('login-screen modal-in');
        Login();
    }else{
        $("#login-screen").addClass('login-screen modal-in');
        //myApp.loginScreen(); 
    }
}

/* LOGIN APLICATIONS */
function Login() {

    //added by luis tobio
    loadNewVersion();

    var cadena = $('#login-tel').val();

    if(cadena.indexOf('+')=='-1'){

        if(  $("#login-tel").intlTelInput("getSelectedCountryData")['iso2'] == 'us'){
            $('#login-tel').val('+1'+$('#login-tel').val());
        }else{
            $("#login-tel").intlTelInput("setCountry", 'us');
        }
    }

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    var url_tripadvisor = '';
    switch(lang){
        case 'es':
            var notification_title = 'Notificación';
            var complete_fields = 'Por favor, complete los campos';
            var bad_email = 'Este correo electrónico no se ha registrado en Angel';
            var bad_phone = 'Verifique número teléfonico o contacte al Administrador';
            var user_desactivate = 'Lo sentimos, parece que su Ángel no está activado. Por favor contacte a Recepción y solicite verificar su fecha y hora de llegada/salida.';
            url_tripadvisor = 'www.tripadvisor.es';
        break;
        case 'th':
            var notification_title = 'การแจ้งเตือน';
            var complete_fields = 'กรุณากรอกข้อมูลในช่องให้ครบถ้วน';
            var bad_email = 'อีเมลนี้ยังไม่ได้ลงทะเบียนใน Angel';
            var bad_phone = 'ตรวจสอบหมายเลขโทรศัพท์ หรือติดต่อผู้ดูแลระบบ';
            var user_desactivate = 'ขออภัย! Angel ของคุณยังไม่ได้เปิดใช้งาน กรุณาติดต่อฝ่ายบริการส่วนหน้าโรงแรม เพื่อให้พนักงานตรวจสอบวันที่ & เวลาการเข้าพัก/เดินทางกลับของคุณ';
            url_tripadvisor = 'th.tripadvisor.com';
        break;
        case 'zh-CN':
            var notification_title = '通知';
            var complete_fields = '请填写这些字段';
            var bad_email = 'Angel 未登记此电子邮箱';
            var bad_phone = '验证电话号码或联系管理员';
            var user_desactivate = '抱歉！您的 Angel 似乎未激活。请联系前台，请求验证您的抵达/离开日期和时间。';
            url_tripadvisor = 'www.tripadvisor.cn';
        break;
        default:
            var notification_title = 'Notification';
            var complete_fields = 'Please complete the fields';
            var bad_email = 'This email is not registered on Angel';
            var bad_phone = 'Verify phone number or contact the Administrator';
            var user_desactivate = 'Sorry! It seems your Angel is not activated. Please contact the Front Desk and have them verify your arrival/departure date & time.';
            url_tripadvisor = 'www.tripadvisor.com';
        break;
    }

    var parametros = {
        'email': document.getElementById('login-email').value,
        'tel': document.getElementById('login-tel').value,
        'lang': lang
    };


    if ((document.getElementById('login-email').value == '') || (document.getElementById('login-tel').value == '')) {
        myApp.alert(complete_fields,notification_title);
    } else {
        $.ajax({
            data: parametros,
            url: rute + 'login-guest-registration.php',
            type: 'post',
            dataType: 'json',
            beforeSend: function(resultado) {
                myApp.showIndicator();
            },
            success: function(response) {
                
                /*Creación de módulos dinámicos, by ltobio*/
                /*Recibimos los módulos del menú configurados desde la bd para mostrarlos en pantalla*/
                var modules = response[0]['modules'];           
                //var modules = [];
                if(modules != null && modules != '' && modules != 'undefined'){
                    menuData = '';
                    localStorage.setItem('dataModules', JSON.stringify(modules)); 
                    for (var i = 0; i < modules.length; i++) {

                        switch(modules[i].module_name){
                            case 'menu_dashboard':
                                menuData += '<div class="col-50 grid-items-menu" style="min-height: 102px" onclick="GoToRequest()" > <div style="max-height: 31px"><i class="fa fa-list-ul icon_adjust" aria-hidden="true"></i> <span id="count-dashboard-msg" style="position: absolute; margin-top: -10px;"></span></div><div class="title-module lang__menu_dashboard">Requests</div></div>';
                            break;
                            case 'menu_uber':
                                menuData += '<a class="col-50 grid-items-menu external" style="min-height: 102px" target="_blank" href="https://m.uber.com/ul/"><div style="max-height: 31px"><i class="fa icon-fa-uber-logo icon_adjust" aria-hidden="true"></i></div><div class="title-module">Uber</div></a>';
                            break;
                            case 'menu_tripadvisor':
                                menuData += '<a class="col-50 grid-items-menu external" style="min-height: 102px" onclick="window.open(\'https://'+url_tripadvisor+'\', \'_system\', \'location=off,closebuttoncaption=Close,toolbarposition=top,clearcache=yes,clearsessioncache=yes \')"> <div style="max-height: 31px"><i class="fa fa-tripadvisor icon_adjust" aria-hidden="true"></i></div><div class="title-module">TripAdvisor</div></a>';
                                //sendTripAdvisorInfo();
                            break;
                            case 'menu_whatsapp':
                                menuData += '<a class="col-50 grid-items-menu external" style="min-height: 102px" target="_blank" id="menu-whatsapp" onclick="GoToWhatsapp()" href="#"> <div style="max-height: 31px"><i class="fa fa-whatsapp icon_adjust" aria-hidden="true"></i></div><div class="title-module">WhatsApp</div></a>';
                            break;
                            default:
                                lang_class = 'lang__'+modules[i].module_name;
                                menuData += '<div class="col-50 grid-items-menu" style="min-height: 102px" onclick="'+getFunctionClick(modules[i].module_name)+'" > <div style="max-height: 31px"><i class="fa '+modules[i].module_icon+' icon_adjust" aria-hidden="true"></i></div><div class="title-module '+lang_class+'">'+modules[i].module_name+'</div></div>';
                            break;
                        }                     
                    }
                    //saber si la cantidad módulos son par o impar para organizar la cadricula y mostrar el logout en la mitad de la columna o 100% abajo
                    size_col = 'col-50';
                    if((modules.length) % 2 == 0){
                        size_col = 'col-100';   
                    }
                    menuData += '<div class="'+size_col+' grid-items-menu open-login-screen" style="min-height: 102px" onclick="LogOut()" > <div style="max-height: 31px"><i class="fa fa-sign-out icon_adjust" aria-hidden="true"></i></div><div class="title-module lang__menu_log_out">Log Out</div></div>';
                    $('.top-grid-menu').html(menuData);
                    ChangeLanguage(lang);

                    var heights = $(".grid-items-menu").map(function() {
                        return $(this).height();
                    }).get();
                    maxHeight = Math.max.apply(null, heights);
                    if(maxHeight > 102){
                        $(".grid-items-menu").height(maxHeight);
                    }
                }
                    
                /**Fin validacion**/

                if (window.localStorage.getItem('lang_app_guest')) {
                    lang= window.localStorage.getItem('lang_app_guest');
                }else{
                    lang= document.getElementById('lang-app-guest').value;
                    window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
                }
                myApp.hideIndicator();
                if (response[0]['error'] == 0) {
                    myApp.alert(bad_email,notification_title);
                } else if (response[0]['error'] == 3) {
                    myApp.alert(bad_phone,notification_title);
                } else if (response[0]['error'] == 1) {
                    //User no Activo
                    myApp.alert(user_desactivate,notification_title);
                    $("#login-screen").addClass('login-screen modal-in');
                } else if (response[0]['page'] == 1) {


                    /* Guardamos el Id del Hotel*/
                    window.localStorage.setItem("hotel_id", response[0]["hotel_id"]);
                    window.localStorage.setItem("language", response[0]["language"]);
                    window.localStorage.setItem("guest_id", response[0]["guest_id"]);
                    window.localStorage.setItem("checking_id", response[0]["checking_id"]);
                    window.localStorage.setItem("location", response[0]["location"]);//added by luis tobio
                    window.localStorage.setItem("digital_key_name", response[0]["digital_key_name"]);//added by luis tobio
                    //window.localStorage.setItem("digital_key_data", response[0]["digital_key_data"]);//added by luis tobio
                    window.localStorage.setItem("guest_name", response[0]["guest_name"]);
                    window.localStorage.setItem("guest_lastname", response[0]["guest_lastname"]);

                    //Save Email and Tel for Autologin
                    window.localStorage.setItem("login_email", document.getElementById('login-email').value);
                    window.localStorage.setItem("login_tel", document.getElementById('login-tel').value);
                    window.localStorage.setItem("login_country", $('#login-tel').intlTelInput("getSelectedCountryData").iso2);


                    //Guest Name
                    $("#name-guest-menu").html(response[0]['guest_name'] + "!");

                    $("input").blur();
                    if(response[0]["guest_tutorial"]==1){
                        //console.log('DEBE MOSTRAR EL TUTORIAL');
                        var html_slider = '';
                        if(lang == 'es'){
                            $("#skip_div").text('Saltar');
                            $("#done_div").text('Listo');
                            $("#img1").attr("src", "img/tutorial/Tutorial-1-es.png");
                            $("#img2").attr("src", "img/tutorial/Tutorial-2-es.png");
                            $("#img3").attr("src", "img/tutorial/Tutorial-3-es.png");
                            $("#img4").attr("src", "img/tutorial/Tutorial-4-es.png");
                            $("#img5").attr("src", "img/tutorial/Tutorial-5-es.png");
                        }else{
                            $("#skip_div").text('Skip');
                            $("#done_div").text('Done');
                            $("#img1").attr("src", "img/tutorial/Tutorial-1-en.png");
                            $("#img2").attr("src", "img/tutorial/Tutorial-2-en.png");
                            $("#img3").attr("src", "img/tutorial/Tutorial-3-en.png");
                            $("#img4").attr("src", "img/tutorial/Tutorial-4-en.png");
                            $("#img5").attr("src", "img/tutorial/Tutorial-5-en.png");
                        }

                        $("#sliders_angel").html(html_slider);


                        mainView.router.load({
                            pageName: 'intro-slider'
                        });
                    }else{
                        RefresCountEventNew();
                        goToIndex();

                    }

                    myApp.showIndicator();
                    setTimeout(function() {
                        myApp.hideIndicator();
                        myApp.closeModal('.login-screen');
                        if (window.localStorage.getItem('url_EventID')) {
                            //console.log(window.localStorage.getItem('idEvent'));
                            //GoToViewRequest(window.localStorage.getItem('url_EventID'));
                            GoToChat(window.localStorage.getItem('url_EventID'));
                            window.localStorage.removeItem("url_EventID");
                        }
                    }, 1200);

                } else if (response[0]['page'] == 2) {

                    /* Guardamos el Id del Hotel*/
                    window.localStorage.setItem("hotel_id", response[0]["hotel_id"]);
                    window.localStorage.setItem("language", response[0]["language"]);
                    window.localStorage.setItem("guest_id", response[0]["guest_id"]);
                    window.localStorage.setItem("checking_id", response[0]["checking_id"]);

                    //Save Email and Tel for Autologin
                    window.localStorage.setItem("login_email", document.getElementById('login-email').value);
                    window.localStorage.setItem("login_tel", document.getElementById('login-tel').value);
                    window.localStorage.setItem("login_country", $('#login-tel').intlTelInput("getSelectedCountryData").iso2);

                    /* FORM REGISTRATION */
                    $("input").blur();
                    //Guest Name
                    //$("#name-guest-menu").html(hi+" "+response[0]['guest_name']+"!");

                    $("#form-login-registration").html(response[0]['html']);

                    var html_slider = '';
                    if(lang == 'es'){
                        $("#skip_div").text('Saltar');
                        $("#done_div").text('Listo');
                        $("#img1").attr("src", "img/tutorial/Tutorial-1-es.png");
                        $("#img2").attr("src", "img/tutorial/Tutorial-2-es.png");
                        $("#img3").attr("src", "img/tutorial/Tutorial-3-es.png");
                        $("#img4").attr("src", "img/tutorial/Tutorial-4-es.png");
                        $("#img5").attr("src", "img/tutorial/Tutorial-5-es.png");
                    }else{
                        $("#skip_div").text('Skip');
                        $("#done_div").text('Done');
                        $("#img1").attr("src", "img/tutorial/Tutorial-1-en.png");
                        $("#img2").attr("src", "img/tutorial/Tutorial-2-en.png");
                        $("#img3").attr("src", "img/tutorial/Tutorial-3-en.png");
                        $("#img4").attr("src", "img/tutorial/Tutorial-4-en.png");
                        $("#img5").attr("src", "img/tutorial/Tutorial-5-en.png");
                    }

                    //Tel en registration
                    $("#registration-phone-guest").intlTelInput();


                    $("#sliders_angel").html(html_slider);

                    mainView.router.load({
                        pageName: 'page-guest-registration'
                    });
                    $("#login-screen").addClass('login-screen modal-in');
                    myApp.showIndicator();
                    setTimeout(function() {
                        myApp.hideIndicator();
                        myApp.closeModal('.login-screen');
                    }, 500);
                }

                if (response[0]['page']) {
                    if (response[0].image_hotel) {
                        $('#image-hotel').css('background', 'url(' + BASE_URL_BACKEND + response[0].image_hotel + ')');
                    }
                    if (response[0].cover_directory) {
                        $('#cover-directory').css('background', 'url(' + BASE_URL_BACKEND + response[0].cover_directory + ')');
                    }

                    var bg_menu_f, bg_menu_g, style;

                    if (response[0].bg_menu) {
                        bg_menu_f = '.menu-cuadricula {background: url(' + BASE_URL_BACKEND + response[0].bg_menu + ');background-attachment: fixed;background-size: cover;  background-position: center center; background-color: #fff;}';
                    } else {
                        bg_menu_f = '.menu-cuadricula {background: url(' + BASE_URL_BACKEND+'images/hotels-logos-angel/parkplace-menu3.jpg);background-attachment: fixed;background-size: cover;  background-position: center center; background-color: #fff;}';
                    }
                     
                    bg_menu_g = '.backg-menu{background:linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%);}';
                    
                    if (response[0]["color_theme"]) {
                        var colors_theme = response[0]["color_theme"].split('|');
                        bg_menu_g = '.backg-menu{background:linear-gradient(to bottom, ' + colors_theme[0] + ' 0%, ' + colors_theme[1] + ' 100%);}';
                    }
                    style = $('<style>' + bg_menu_g + bg_menu_f + '</style>');
                    //style = $('<style>' + bg_menu_f + '</style>');
                    $('html > head').append(style);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                myApp.hideIndicator();
                myApp.alert(msj_error,notification_title);
            }
        });
    }
}
/* END LOGIN APLICATIONS */

function LogOut() {    
    window.localStorage.setItem("login_email",'');
    window.localStorage.setItem("login_tel", '');
    $("#login-screen").addClass('login-screen modal-in');
}

/* UPDATED GUEST */
function UpdateGuest() {

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }
    var tel_new = document.getElementById('registration-phone-guest').value;

    //Variables del Lenguaje
    switch(lang){
        case 'es':
            var notification_title = 'Notificación';
            var name_required = 'Nombre es requerido';
            var lastname_required = 'Apellido es requerido';
            var phone_required = 'Teléfono es requerido';
            var guest_updated = 'Actualizado correctamente';
            var guest_no_updated = 'Información no actualizada, vuelva a intentar';
            var confirm_tel = '¿Es "' + tel_new + '" el número correcto?';
            var cancel_text = 'Cancelar';
            break;
        case 'th':
            var notification_title = 'การแจ้งเตือน';
            var name_required = 'ต้องระบุชื่อ';
            var lastname_required = 'ต้องระบุนามสกุล';
            var phone_required = 'ต้องระบุหมายเลขโทรศัพท์';
            var guest_updated = 'อัพเดตสำเร็จ';
            var guest_no_updated = 'อัพเดตข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง';
            var confirm_tel = '"' + tel_new + '" เป็นหมายเลขที่ถูกต้องหรือไม่';
            var cancel_text = "ยกเลิก";
        break;
        case 'zh-CN':
            var notification_title = '通知';
            var name_required = '名为必填项';
            var lastname_required = '姓为必填项';
            var phone_required = '电话号码为必填项';
            var guest_updated = '已成功更新';
            var guest_no_updated = '信息未更新，请重试。';
            var confirm_tel = '"' + tel_new + '" 是否为正确的号码？';
            var cancel_text = '取消';
        break;
        default:
            var notification_title = 'Notification';
            var name_required = 'First Name is required';
            var lastname_required = 'Last Name is required';
            var phone_required = 'Phone is required';
            var guest_updated = 'Successfully Updated';
            var guest_no_updated = 'Information not updated, try again.';
            var confirm_tel = 'Is "' + tel_new + '" the correct number?';
            var cancel_text = 'Cancel';
        break;
    }


    /*###VALIDACIONES DE CAMPOS */
    if (document.getElementById('registration-firstname-guest').value == '') {
        myApp.alert(name_required,notification_title);
        return;
    } else if (document.getElementById('registration-lastname-guest').value == '') {
        myApp.alert(lastname_required,notification_title);
        return;
    } else if (document.getElementById('registration-phone-guest').value == '') {
        myApp.alert(phone_required,notification_title);
        return;
    }


    myApp.modal({
        title:  notification_title,
        text: confirm_tel,
        buttons: [
          {
            text: cancel_text,
            close: true,
          },
          {
            text: 'OK',
            bold: true,
            onClick: function() {
                var parametros = {
                    'firstname': document.getElementById('registration-firstname-guest').value,
                    'lastname': document.getElementById('registration-lastname-guest').value,
                    'phone': document.getElementById('registration-phone-guest').value,
                    'guest_id': document.getElementById('registration-guestid-guest').value
                };
                $.ajax({
                    data: parametros,
                    url: rute + 'update-guest-registration.php',
                    type: 'post',
                    dataType: 'json',
                    beforeSend: function(resultado) {
                        myApp.showIndicator();
                    },
                    success: function(response) {
                        myApp.hideIndicator();
                        if (response[0]['updated'] == 1) {
                            /*GUEST UPDATED*/
                            $("input").blur();
                            myApp.showIndicator();
                            setTimeout(function() {
                                myApp.hideIndicator();

                                window.localStorage.setItem("guest_name", response[0]["guest_name"]);
                                window.localStorage.setItem("guest_lastname", response[0]["guest_lastname"]);

                                $("#name-guest-menu").html(response[0]['guest_name'] + "!");
                                ListEventDashboard();

                                myApp.addNotification({
                                    title: 'Nuvola',
                                    subtitle: '',
                                    message: guest_updated,
                                    media: '<i class="icon icon-n"></i>',
                                    hold: 2500
                                });

                                mainView.router.load({
                                    pageName: 'intro-slider'
                                });
                            }, 300);
                        } else {
                            /* ERROR AL ACTUALIZAR */
                            myApp.alert(guest_no_updated,notification_title);
                        }

                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        myApp.hideIndicator();
                        myApp.alert(msj_error,notification_title);
                    }
                });
            }
          },
        ]
    });
}
/* END UPDATED GUEST */

/* CALL PAGES */
function GoToCreateRequest() {
    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
//        id_device: idDevice
    };
    

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    switch(lang){
        case 'es' : 
            var notification_title = 'Notificación';
        break;
        case 'th' : 
            var notification_title = 'การแจ้งเตือน';
        break;
        case 'zh-CN' : 
            var notification_title = '通知';
        break;
        default:
            var notification_title = 'Notification';
        break;
    }


    /*LLENAR LOS CAMPOS DEL CREATE REQUEST */
    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'checking_id': window.localStorage.getItem('checking_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'lang': lang
    };
    //console.log(parametros);

    $.ajax({
        data: parametros,
        url: rute + 'form-create-request.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            $("#form-create-request").html(response[0]['html']);

            //Update Dashboard
            RefresCountEventNew();

            $("input").blur();
            setTimeout(function() {
                mainView.router.load({
                    pageName: 'page-create-request'
                });
            }, 100);

            //AutocompleteRooms(response[0]['rooms']);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            myApp.alert(msj_error,notification_title);
        }
    });
}


function CreateRequestTags(Dept_id) {

    if(Dept_id==''){
        $('#form-create-request-tags-general li').css("display", "none");
        $('#create-request-tag').val('');
        return;
    }

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'dept_id': Dept_id,
        'lang': lang
    };

    $.ajax({
        data: parametros,
        url: rute + 'form-create-request-tags.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            $("#form-create-request-tags-general").html(response[0]['html']);

            setTimeout(function () {
                //myApp.smartSelectOpen('.smart-select-tags');
                myApp.hideIndicator();
                $$('#create-request-tag').click();
            }, 700);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}


function CreateRequestTagsCount(DepTagId) {
    var parametros = {
        'dept_tag_id': DepTagId
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-create-request-tags-count.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            $("#form-create-request-tags-count").html(response[0]['html']);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}


/* CREATE REQUEST */
function SaveCreateRequest() {

    $("input").blur();

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    //Variables del Lenguaje
    switch(lang){
        case 'es' : 
            var notification_title = 'Notificación';
            var date_required = 'Fecha es requerido';
            var room_required = 'Por favor ingrese una locación';
            var room_list_required = 'Escoja una ubicación de la lista';
            var save_request = '¡Estamos trabajando en su solicitud!';
            var no_save_request = 'Solicitud no registrada, intente nuevamente';
            var date_max_checkout = 'Por favor ingrese una fecha/hora anterior a su salida';
            var date_min = 'Por favor ingrese una fecha/hora actual o futura dentro de su estadia';
            var select_requieres = 'Por favor seleccione una opción';
            var confirm_save_request = 'Es "' + document.getElementById('create-request-room').value + '" el lugar del servicio?';
        break;
        case 'th' : 
            var notification_title = 'การแจ้งเตือน';
            var date_required = 'ต้องระบุวันที่';
            var room_required = 'กรุณาป้อนข้อมูลสถานที่';
            var room_list_required = 'เลือกสถานที่จากลิสท์';
            var save_request = 'เรา\'กำลังทำตามคำร้องขอของคุณ!';
            var no_save_request = 'ระบบยังไม่ได้บันทึกคำร้องขอ กรุณาลองอีกครั้ง';
            var date_max_checkout = 'กรุณาเลือกวันที่/เวลาก่อนเวลาเช็คเอาท์';
            var date_min = 'กรุณาเลือกวันที่/เวลาปัจจุบันหรืออนาคตภายในช่วงเวลาการเข้าพักของคุณ';
            var select_requieres = 'กรุณาเลือกตัวเลือก';
            var confirm_save_request = '"' + document.getElementById('create-request-room').value + '" คือตำแหน่งที่คุณได้รับบริการใช่ไหม?';
        break;
        case 'zh-CN' : 
            var notification_title = '通知';
            var date_required = '日期为必填项';
            var room_required = '请输入一个位置';
            var room_list_required = '从列表中选择一个位置';
            var save_request = '我们正在处理您的请求！';
            var no_save_request = '请求未登记，请重试';
            var date_max_checkout = '请选择退房之前的日期/时间';
            var date_min = '请选择您入住期间的一个当前或未来日期/时间';
            var select_requieres = '请选择一个选项';
            var confirm_save_request = '"' + document.getElementById('create-request-room').value + '" 是否为您的服务位置？';
        break;
        default:
            var notification_title = 'Notification';
            var date_required = 'Date is required';
            var room_required = 'Please enter a location';
            var room_list_required = 'Choose a location from the list';
            var save_request = 'We\'re working on your request!';
            var no_save_request = 'Request not registered, try again';
            var date_max_checkout = 'Please select a date/time earlier than check out';
            var date_min = 'Please select a current or future date/time within your stay';
            var select_requieres = 'Please select a option';
            var confirm_save_request = 'Is "' + document.getElementById('create-request-room').value + '" your service location?';
        break;
    }

    //Valid Select
    if ($('#create-request-tag').val() == '') {
        myApp.alert(select_requieres,notification_title);
        return;
    }

    //Valid CheckOut Min Date
    if ($('#create-request-date').val()+"-0500" < $('#create-request-date2').val()+"-0500") {
        myApp.alert(date_min,notification_title);
        return;
    }
    //Valid CheckOut Max Date
    if ($('#create-request-date').val() > $('#create-request-date2-max').val()) {
        myApp.alert(date_max_checkout,notification_title);
        return;
    }

    if ($('#create-request-date').val() == '') {
        myApp.alert(date_required,notification_title);
        return;
    } else if ($('#create-request-room').val() == '') {
        myApp.alert(room_required,notification_title);
        return;
    } else if ($('#create-request-room-id').val() == '') {
        myApp.alert(room_list_required,notification_title);
        return;
    } else {


        //Validación de Registrar Evento
        //myApp.confirm(confirm_save_request, function() {


        var parametros = {
            'dept_tag_id': document.getElementById('create-request-tag').value,
            'tag_count': document.getElementById('create-request-tag-count').value,
            'date_time': document.getElementById('create-request-date').value,
            'date_time2': document.getElementById('create-request-date2').value,
            'room_id': document.getElementById('create-request-room-id').value,
            'notes_message': document.getElementById('create-request-message').value,
            'hotel_id': window.localStorage.getItem('hotel_id'),
            'guest_id': window.localStorage.getItem('guest_id')
        };

        $.ajax({
            data: parametros,
            url: rute + 'save-create-request.php',
            type: 'post',
            dataType: 'json',
            beforeSend: function(resultado) {
                myApp.showIndicator();
            },
            success: function(response) {
                myApp.hideIndicator();

                if (response[0]['saved'] == 1) {
                    $("input").blur();
                    myApp.showIndicator();
                    ListEventDashboard();
                    setTimeout(function() {
                        myApp.hideIndicator();
                        mainView.router.load({
                            pageName: 'page-request'
                        });
                        myApp.addNotification({
                            title: 'Nuvola',
                            subtitle: '',
                            message: save_request,
                            media: '<i class="icon icon-n"></i>',
                            hold: 2500
                        });
                    }, 300);
                } else {
                    myApp.alert(no_save_request,notification_title);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                myApp.hideIndicator();
                //myApp.alert(msj_error,notification_title);
            }
        });

        //}); //End Confirm

    }

    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    
}


function CancelEventsDashboard(IdEvent) {
    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    switch(lang){
        case 'es' : 
            var notification_title = 'Notificación';
            var are_you_sure = window.localStorage.getItem('guest_name') + ', ¿Le gustaría que cancelemos esta solicitud por usted?';
            var cancel_event = 'Solicitud cancelada correctamente';
            var no_cancel_event = 'Actualización falló, intente nuevamente';
        break;
        case 'th' : 
            var notification_title = 'การแจ้งเตือน';
            var are_you_sure = 'คุณ ' + window.localStorage.getItem('guest_name') + ' คุณต้องการให้เรายกเลิกคำร้องขอนี้หรือไม่?';
            var cancel_event = 'ยกเลิกเหตุการณ์สำเร็จแล้ว';
            var no_cancel_event = 'อัพเดตไม่สำเร็จ กรุณาลองอีกครั้ง';
        break;
        case 'zh-CN' : 
            var notification_title = '通知';
            var are_you_sure = '' + window.localStorage.getItem('guest_name') + '，是否需为您取消此项请求？';
            var cancel_event = '活动已成功取消';
            var no_cancel_event = '更新失败，请重试';
        break;
        default:
            var notification_title = 'Notification';
            var are_you_sure = 'Should we cancel this request for you, ' + window.localStorage.getItem('guest_name') + '?';
            var cancel_event = 'Event successfully cancelled';
            var no_cancel_event = 'Updated failed, try again';
        break;
    }


    myApp.modal({
        title:  localization['notification_title'],
        text: are_you_sure,
        buttons: [
          {
            text: localization['tip_cancel'],
            close: true,
          },
          {
            text: 'OK',
            bold: true,
            onClick: function() {
                var parametros = {
                      'event_id': IdEvent,
                      'hotel_id': window.localStorage.getItem('hotel_id'),
                      'guest_id': window.localStorage.getItem('guest_id'),
                      'status_event': parseInt($("#status").val())
                  };

                $.ajax({
                    data: parametros,
                    url: rute + 'update-event-cancel.php',
                    type: 'post',
                    dataType: 'json',
                    beforeSend: function(resultado) {
                        myApp.showIndicator();
                    },
                    success: function(response) {
                        myApp.hideIndicator();
                        if (response[0]['updated'] == 1) {
                            /*GUEST UPDATED*/
                            $("input").blur();
                            myApp.showIndicator();

                            ListEventDashboard();

                            setTimeout(function() {
                                myApp.hideIndicator();

                                myApp.addNotification({
                                    title: 'Nuvola',
                                    subtitle: '',
                                    message: cancel_event,
                                    media: '<i class="icon icon-n"></i>',
                                    hold: 2500
                                });

                                mainView.router.load({
                                    pageName: 'page-request'
                                });
                            }, 300);
                        } else {
                            /* ERROR AL ACTUALIZAR */
                            myApp.alert(no_cancel_event,notification_title);
                        }

                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        myApp.hideIndicator();
                        //myApp.alert(msj_error,notification_title);
                    }
                });
            }
          },
        ]
    });
}

function GoToRequest() {
    $("input").blur();
        localStorage.setItem('actual_page', 'dashboard');
    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }
    
    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'checking_id': window.localStorage.getItem('checking_id'),
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-dashboard.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            //Badge Count Notification
            if(response[0]['total_count_new_chat'] > 0){
                $("#count-dashboard-msg").html('<span class="badge-dashboard" >'+response[0]['total_count_new_chat']+'</span>');
            }else{
                $("#count-dashboard-msg").html('');
            }

            $("#all-dashboard-pending").html(response[0]['html_all_pending']);
            $("#all-dashboard-completed").html(response[0]['html_all_completed']);

            $("#dashboard-pending").html(response[0]['html_pending']);
            $("#dashboard-completed").html(response[0]['html_completed']);

            $("#name-hotel").html(response[0]['hotel_name']);
            $("#requests-name-hotel").html(response[0]['hotel_name']);

            //Quitar el input-search y el div overlay al entrar en la página
            $('#clear-search')[0].click();
            

            setTimeout(function() {
                myApp.hideIndicator();
                mainView.router.load({pageName: 'page-request'});
                $('#overlay-search')[0].click();
            }, 500);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //myApp.alert(msj_error);
            myApp.hideIndicator();
        }
    });
}



function GoToViewRequest(IdEvent, chat) {

    if(chat == undefined){
        chat = 0;
    }
    idViewEvent = IdEvent;

    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    if (lang == 'es') {
        var notification_title = 'Notificación';
    } else {
        var notification_title = 'Notification';

    }

    var parametros = {
        'event_id': IdEvent,
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'lang': lang
    };

    $.ajax({
        data: parametros,
        url: rute + 'form-view-request.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {

            if (response[0].count_msg > 0) {
                $(".badge2").show();
                $(".badge2").text(response[0].count_msg);
            }else{
                $(".badge2").hide();
            }

            $("#form-view-request").html(response[0]['html']);

            RefresCountEventNew();
            $("input").blur();

            if(chat=='1'){
                GoToChat(IdEvent, '1');
            }else{
                myApp.hideIndicator();
                setTimeout(function() {
                    mainView.router.load({
                        pageName: 'page-view-request'
                    });
                }, 500);
            }


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error,notification_title);
        }
    });
}



function initChatMessage(){
    // Conversation flag
    var conversationStarted = false;

    // Init Messages
    var myMessages = myApp.messages('.messages', {
        autoLayout: true
    });

    // Init Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

    // Handle message
    $$('.messagebar .link').on('click', function() {

        /*getChatGuest(function(res) {
         console.log(res);
         });*/
        // Message text
        var messageText = myMessagebar.value().trim();
        // Exit if empy message
        if (messageText.length === 0) return;

        // Empty messagebar
        myMessagebar.clear()

        // Random message type
        //var messageType = (['sent', 'received'])[Math.round(Math.random())];
        var messageType = 'sent';

        // Avatar and name for received message
        var avatar, name;
        if (messageType === 'received') {
            avatar = 'https://www.mynuvola.com/angel_develop/img/ios7-person.png';
            name = 'Kate';
        }
        // Add message
        myMessages.addMessage({
            // Message text
            text: messageText,
            // Random message type
            type: messageType,
            // Avatar and name:
            avatar: avatar,
            name: name,
            // Day
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        })

        saveChatGuest(messageText);

        // Update conversation flag
        conversationStarted = true;
    });
}

function getChatGuest(fn){
    var parametros = {
        'event_id': idViewEvent,
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'lang': window.localStorage.getItem('lang_app_guest')
    };

    $.ajax({
        data: parametros,
        url: rute + 'form-chat-guest.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {
            fn(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}

function saveChatGuest(comment){
    var parametros = {
        'event_id': idViewEvent,
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        lang: window.localStorage.getItem('lang_app_guest'),
        comment: comment
    };

    $.ajax({
        data: parametros,
        url: rute + 'save-comment-guest.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {
            console.log(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}

//Var para obtener la hora a la que entra al chat
var chat_datetime = '';
function GoToChat(EventoId, chat) {
    if(EventoId == undefined){
        EventoId = idViewEvent;
    }else{
        idViewEvent = EventoId;
    }

    var parametros = {
        'event_id': EventoId,
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'lang': window.localStorage.getItem('lang_app_guest')
    };

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    switch(lang){
        case 'es' : 
            var chat_no_avaliable = 'Chat No Disponible';
            var char_avaliable = 'Mensajes del Chat';
            var chat_message = 'Ésta solicitud ha sido solucionada. Envíe otra solicitud para iniciar un nuevo chat.';
            var chat_send = 'Enviar';
            var comments = 'Comentar...';
        break;
        case 'th' : 
            var chat_no_avaliable = 'ไม่สามารถแชตได้';
            var char_avaliable = 'ข้อความแชต';
            var chat_message = 'คำร้องขอนี้ได้รับการดำเนินการแล้ว ส่งคำร้องขอใหม่เพื่อเริ่มแชตครั้งใหม่';
            var comments = 'ความคิดเห็น...';
            var chat_send = 'ส่ง';
        break;
        case 'zh-CN' : 
            var chat_no_avaliable = '无法聊天';
            var char_avaliable = '聊天消息';
            var chat_message = '此项请求已解决。提交另一项请求，开始新的聊天。';
            var comments = '评论... ';
            var chat_send = '发送';
        break;
        default:
            var chat_no_avaliable = 'Chat Unavailable';
            var char_avaliable = 'Chat Messages';
            var chat_message = 'This request has been resolved. Submit another request to start a new chat.';
            var comments = 'Comments...';
            var chat_send = 'Send';
        break;
    }

    $.ajax({
        data: parametros,
        url: rute + 'form-chat-guest.php',
        type: 'post',
        dataType: 'json',
        cache: false,
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            //console.log(response);
            myApp.hideIndicator();
            $("#form-view-chat").html(response[0]['html']);

            //Asignar la hora de la entrada al chat
            chat_datetime = response[0]['date_time_entrance_chat'];
            //Activar o desactivar Chat
            if((response[0]['state_event'] == 1) || (response[0]['state_event'] == 5) ){
                $('#toolbar-page-message').html('<div class="toolbar-inner" ><textarea id="comment_text" placeholder="'+comments+'" class=""></textarea><a href="#" class="link lang__c_send" style="color: #212f51">'+chat_send+'</a></div>');
                $("#toolbar-page-message").css({"height":"44px"});
                $('#chat_message_title').html(char_avaliable);
            }else{
                $('#toolbar-page-message').html('<div class="toolbar-inner" style="background-color: #ECEFF1;"><textarea style="display: none" id="comment_text" placeholder="'+comments+'" class=""></textarea><div style="color: #616161; font-size: 14px; font-family: \'HelveticaNeueLT Com 45 Lt\' !important;">'+chat_message+'</div></div>');
                $("#toolbar-page-message").css({"height":"60px"});
                $('#chat_message_title').html(chat_no_avaliable);
            }

            initChatMessage();

            //Refrescar los contadores
            ListEventDashboard();
            $(".badge2").hide();
            //End Refrescar Contadores

            $("input").blur();
            setTimeout(function() {
                /*if(chat==1){
                    mainView.router.load({pageName: 'page-view-request'});
                }*/

                mainView.router.load({
                    pageName: 'page-view-chat'
                });
            }, 100);

            setTimeout(function() {
                setTimeout(function() {
                    myMessages.scrollMessages();
                }, 600);
            }, 500);


        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}
/**** End GoToChat *****/


/*
    Función del directorio que muestra la vieja  versión,
    se utliza cuando el hotel no ha creado nuevas categorias
*/
function GoToHotelDirectory_old() {

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };

    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-hotel-directory.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            $("#form-hotel-directory").html(response[0]['html']);

            $("input").blur();
            setTimeout(function() {
                var page = 'page-hotel-directory-2';
                if(response[0]['html'] == '')
                    page = 'page-hotel-directory';
                mainView.router.load({
                    pageName: page
                });
            }, 100);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}

function GoToMessageHotel() {

    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id')
    };

    $.ajax({
        data: parametros,
        url: rute + 'form-message-hotel.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            $("#div-form-message-hotel").html(response[0]['html']);

            $("input").blur();
            setTimeout(function() {
                mainView.router.load({
                    pageName: 'page-message-hotel'
                });
            }, 100);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });


    $("input").blur();
    myApp.showIndicator();
    setTimeout(function() {
        myApp.hideIndicator();
        mainView.router.load({
            pageName: 'page-message-hotel'
        });
    }, 100);
}


function SaveMessageHotel() {

    $("input").blur();

    if (document.getElementById('notes-message-hotel').value == '') {
        myApp.alert('Campo Mensaje esta vacio');
        return;
    }

    var parametros = {
        'date_time': document.getElementById('date-message-hotel').value,
        'notes_message': document.getElementById('notes-message-hotel').value,
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id')
    };


    $.ajax({
        data: parametros,
        url: rute + 'save-message-hotel.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        }, success: function(response) {
            myApp.hideIndicator();
            ListEventDashboard();
            if (response[0]['saved'] == 1) {
                /*GUEST UPDATED*/
                $("input").blur();
                myApp.showIndicator();
                setTimeout(function() {
                    myApp.hideIndicator();
                    mainView.router.load({
                        pageName: 'index'
                    });
                    myApp.addNotification({
                        title: 'Nuvola',
                        subtitle: '',
                        message: 'Solicitud registrada satisfactoriamente',
                        media: '<i class="icon icon-n"></i>',
                        hold: 2500
                    });
                }, 300);
            } else {
                /* ERROR AL ACTUALIZAR */
                myApp.alert('Hubo un problema al registrar la solicitud. Vuelva a intentarlo.');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}

var questions, cont = [],
    contq = 0;

function GoToGuestSurvey() {
    contq = 0;
    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    
    /*LLENAR LOS CAMPOS DEL CREATE REQUEST */
    //mainView.router.load({pageName: 'page-guest-survey'});

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    if (lang == 'es') {
        var notification_title = 'Notificación';    
    } else {
        var notification_title = 'Notification';        
    }



    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'checking_id': window.localStorage.getItem('checking_id'),
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-rate-stay.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            //console.log(response[0]);
            var html = "";
            if (response[0].answer != null) {
                var answer = response[0].answer;
                //$("#div-form-rate-stay").html(response[0].html);
                //console.log(answer);
                for (var i = 0; i < answer.length; i++) {
                    if (answer[i].active == 1) {
                        //console.log(answer[i].answer);
                        var checked1 = (answer[i].answer == 1) ? "checked" : "";
                        var checked2 = (answer[i].answer == 2) ? "checked" : "";
                        var checked3 = (answer[i].answer == 3) ? "checked" : "";
                        var checked4 = (answer[i].answer == 4) ? "checked" : "";
                        var checked5 = (answer[i].answer == 5) ? "checked" : "";
                        html += '<div class="card">' +
                            '<div class="card-header ">' + answer[i].question + '</div>' +
                            '<div class="card-content">' +
                            '<div class="card-content-inner" style="text-align: center">' +
                            '<fieldset class="starability-grow" style="margin-left: auto; margin-right: auto;">' + 

                            '<input disabled type="radio" id="rate5' + i + '" name="rating' + i + '" value="5" ' + checked5 + '/>' +
                            '<label for="rate5' + i + '" title="Amazing" >5 stars</label>' +

                            '<input disabled type="radio" id="rate4' + i + '" name="rating' + i + '" value="4" ' + checked4 + '/>' +
                            '<label for="rate4' + i + '" title="Very good">4 stars</label>' +

                            '<input disabled type="radio" id="rate3' + i + '" name="rating' + i + '" value="3" ' + checked3 + '/>' +
                            '<label for="rate3' + i + '" title="Average">3 stars</label>' +

                            '<input disabled type="radio" id="rate2' + i + '" name="rating' + i + '" value="2" ' + checked2 + '/>' +
                            '<label for="rate2' + i + '" title="Not good">2 stars</label>' +

                            '<input disabled type="radio" id="rate1' + i + '" name="rating' + i + '" value="1" ' + checked1 + '/>' +
                            '<label for="rate1' + i + '" title="Terrible">1 star</label>' +
                            '</fieldset>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }
                }

                html += '<div class="list-block inputs-list ">' +
                    '<ul class="">' +
                    '<li>' +
                    '<div class="item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-input">' +
                    '<textarea id="notes-rate-stay" placeholder="' + response[0].comments + '" disabled>' + answer[0].comments + '</textarea>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +

                    '<div class="submit-button-form">' +
                    '<a href="#" onclick="goToIndex();" class="button button-big button-fill button-raised color-red last-input-small">' + response[0].back + '</a>' +
                    '</div>';

                $("#div-form-rate-stay").html(html);

            } else {

                /*var question_hotel = response[0].hotel;
                questions = response[0].default;
                if (question_hotel != null && question_hotel.length > 0 && question_hotel.length < 8) {
                    for (var j = 0; j < question_hotel.length; j++) {
                        for (var i = 0; i < questions.length; i++) {
                            if (question_hotel[j].pos == questions[i].pos) {
                                console.log(question_hotel[j], questions[i]);
                                questions[i] = question_hotel[j];
                            }
                        }
                    }
                }else if(question_hotel != null && question_hotel.length == 8){
                    questions = question_hotel;
                }*/
                questions = response[0].questions;
                //console.log(questions);
                for (var i = 1; i <= questions.length; i++) {
                    if (questions[i - 1].status == 1) {
                        cont.push(questions[i - 1]);
                        contq++;
                        html += '<div class="card">' +
                            '<div class="card-header ">' + questions[i - 1].question + '</div>' +
                            '<div class="card-content">' +
                            '<div class="card-content-inner" style="text-align: center">' +
                            '<fieldset class="starability-grow" style="margin-left: auto; margin-right: auto;">' + 

                            '<input type="radio" id="rate5' + contq + '" name="rating' + contq + '" value="5" />' +
                            '<label for="rate5' + contq + '" title="Amazing" >5 stars</label>' +

                            '<input type="radio" id="rate4' + contq + '" name="rating' + contq + '" value="4" />' +
                            '<label for="rate4' + contq + '" title="Very good">4 stars</label>' +

                            '<input type="radio" id="rate3' + contq + '" name="rating' + contq + '" value="3" />' +
                            '<label for="rate3' + contq + '" title="Average">3 stars</label>' +

                            '<input type="radio" id="rate2' + contq + '" name="rating' + contq + '" value="2" />' +
                            '<label for="rate2' + contq + '" title="Not good">2 stars</label>' +

                            '<input type="radio" id="rate1' + contq + '" name="rating' + contq + '" value="1" />' +
                            '<label for="rate1' + contq + '" title="Terrible">1 star</label>' +
                            '</fieldset>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }
                }

                html += '<div class="list-block inputs-list ">' +
                    '<ul class="">' +
                    '<li>' +
                    '<div class="item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-input">' +
                    '<textarea id="notes-rate-stay" placeholder="' + response[0].comments + '"></textarea>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +

                    '<div class="submit-button-form">' +
                    '<a href="#" onclick="SaveGuestSurvey();" class="button button-big button-fill button-raised color-cyan">' + response[0].save + '</a>' +
                    '<a href="#" onclick="goToIndex();" class="button button-big button-fill button-raised color-red last-input-small">' + response[0].cancel + '</a>' +
                    '</div>';

                $("#div-form-rate-stay").html(html);
            }

            $("input").blur();
            setTimeout(function() {
                mainView.router.load({
                    pageName: 'page-guest-survey'
                });
            }, 100);

            //AutocompleteRooms(response[0]['rooms']);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error,notification_title);
        }
    });
}


function SaveGuestSurvey() {
    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    
    $("input").blur();

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    //Variables del Lenguaje
    switch(lang){
        case 'es':
            var notification_title = 'Notificación';
            var complete_q = 'Por favor complete todos los campos';
            var save_survey = '¡Gracias por participar en la encuesta!';
            var no_save_survey = 'Información no registrada, intente nuevamente';
        break;
        case 'th':
            var notification_title = 'การแจ้งเตือน';
            var complete_q = 'กรุณากรอกข้อมูลในช่องให้ครบถ้วน';
            var save_survey = 'ขอบคุณที่ให้ความร่วมมือในแบบสำรวจนี้!';
            var no_save_survey = 'ระบบยังไม่ได้บันทึกข้อมูล กรุณาลองอีกครั้ง';
        break;
        case 'zh-CN':
            var notification_title = '通知';
            var complete_q = '请填写所有字段';
            var save_survey = '感谢您参与此项调查！';
            var no_save_survey = '信息未登记，请重试';
        break;
        default:
            var notification_title = 'Notification';
            var complete_q = 'Please complete all fields';
            var save_survey = 'Thank you for participating on this survey!';
            var no_save_survey = 'Information not registered, try again';
        break;
    }

    for (var i = 1; i <= contq; i++) {
        console.log($("input[name='rating" + i + "']:checked").length);
        if ($("input[name='rating" + i + "']:checked").length == 0) {
            myApp.alert(complete_q,notification_title);
            return;
        }
    }

    /*if (($("input[name='rating1']:checked").length == 0) || ($("input[name='rating2']:checked").length == 0) || ($("input[name='rating3']:checked").length == 0) || ($("input[name='rating4']:checked").length == 0)) {
        myApp.alert(complete_q);
        return;
    }*/

    var parametros = {
        'cant': contq,
        'notes_message': document.getElementById('notes-rate-stay').value,
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'checking_id': window.localStorage.getItem('checking_id')
    };


    for (var i = 1; i <= cont.length; i++) {
        parametros['q' + i] = cont[i - 1].id;
        parametros['rating' + i] = $('input:radio[name=rating' + i + ']:checked').val();
    }

    console.log(parametros);


    $.ajax({
        data: parametros,
        url: rute + 'save-rate-stay.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();

            if (response[0]['saved'] == 1) {
                $("input").blur();
                myApp.showIndicator();
                setTimeout(function() {
                    myApp.hideIndicator();
                    mainView.router.load({
                        pageName: 'index'
                    });
                    myApp.addNotification({
                        title: 'Nuvola',
                        subtitle: '',
                        message: save_survey,
                        media: '<i class="icon icon-n"></i>',
                        hold: 2500
                    });
                }, 300);
                contq = 0;
            } else {
                myApp.alert(no_save_survey,notification_title);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error,notification_title);
        }
    });
}

/* END CALL PAGES */


/***** FUNCTIONS NOW TEXT *****/
function CallNow(){
    if( $('#create-request-date').val() == $('#create-request-date2').val() ){
        //console.log('igaules');

        $("#now-create-request").css({'display':'block'});
        $("#create-request-date").css({'color':'#efeff4'});
    }else{
        //console.log('diferente');
        $("#now-create-request").css({'display':'none'});
        $("#create-request-date").css({'color':'#000'});
    }

}

/***** END FUNCTIONS NOW TEXT*****/


function AltChat() {
    //console.log('Estoy  dentro en el Chat, chat active: '+chat_active);
    var EventoId = idViewEvent

    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    //

    var parametros = {
        'event_id': EventoId,
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'lang': window.localStorage.getItem('lang_app_guest'),
        'datetime_last_chat': chat_datetime
    };

    $.ajax({
        data: parametros,
        url: rute + 'form-chat-guest-new.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {
            //console.log(response);
            //myApp.hideIndicator();

            if(response[0]['html']!=''){
                $("#form-view-chat").html($("#form-view-chat").html()+response[0]['html']);
                initChatMessage();

                //Asignar la hora de la entrada al chat
                chat_datetime = response[0]['date_time_entrance_chat'];
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });



    setTimeout(function() {
        if(chat_active == 'yes'){
            AltChat();
        }
    }, 5000);
}




/****** Funcion de refrescar todos los contadores cuando miran el evento *****/
function RefresCountEventNew() {
    /*LLENAR LOS CAMPOS DEL CREATE REQUEST */
    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };


    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'checking_id': window.localStorage.getItem('checking_id'),
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-dashboard.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {

            //Badge Count Notification
            if(response[0]['total_count_new_chat']>0){
                $("#count-dashboard-msg").html('<span class="badge-dashboard" >'+response[0]['total_count_new_chat']+'</span>');
            }else{
                $("#count-dashboard-msg").html('');
            }

            $("#all-dashboard-pending").html(response[0]['html_all_pending']);
            $("#all-dashboard-completed").html(response[0]['html_all_completed']);

            $("#dashboard-pending").html(response[0]['html_pending']);
            $("#dashboard-completed").html(response[0]['html_completed']);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //myApp.alert(msj_error);
        }
    });
}



function GoToPackagesLostFound() {
    $("input").blur();
        localStorage.setItem('actual_page', 'packages');
    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-packages-lostfound.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();

            $("#all-list-pk-pending").html(response[0]['html_pk_pending']);
            $("#all-list-pk-completed").html(response[0]['html_pk_completed']);

            setTimeout(function() {
                mainView.router.load({
                    pageName: 'page-packages-lostfound'
                });
            }, 100);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}

function ViewPackageLostFound(id_pkg, type) {
    $("input").blur();

    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'guest_id': window.localStorage.getItem('guest_id'),
        'package_id': id_pkg,
        'type': type,
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'form-view-package.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();

            $('#form-view-package-lostfound').html(response[0]['html']);
            /*$("#all-list-pk-pending").html(response[0]['all_html_pk_pending']);
            $("#all-list-pk-completed").html(response[0]['all_html_pk_completed']);
            */
            setTimeout(function() {
                mainView.router.load({pageName: 'page-view-package'});
            }, 100);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}

function OpenViewPackage(url_image) {
    var myPhotoBrowserDark2 = myApp.photoBrowser({
        photos : [url_image],
        theme: 'dark'
    });
    myPhotoBrowserDark2.open();
}

//Menu Translate
function ActionTranslate() {
    var buttons = [
        {
            text: 'English',
            onClick: function () {
                ChangeLanguage('en');
            }
        },
        {
            text: 'Español',
            onClick: function () {
                ChangeLanguage('es');
            }

        },
        {
            //Tailandes
            text: 'ไทย',
            onClick: function () {
                ChangeLanguage('th');
            }
        },
        {
            //Chino Tradicional
            text: '中国简体',
            onClick: function () {
                ChangeLanguage('zh-CN');
            }
            //zh-TW
        }
    ];
    myApp.actions(buttons);
}

function room_ready() {
        
        if (window.localStorage.getItem('lang_app_guest')) {
            lang= window.localStorage.getItem('lang_app_guest');
        }else{
            lang= document.getElementById('lang-app-guest').value;
            window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
        }

        if (lang == 'es') {
            var notification_title = 'Notificación';
            var var_room_ready = 'Su reserva ha sido registrada! El número de su habitación es 101.';
        }else if (lang == 'th') {
            var notification_title = 'การแจ้งเตือน';
            var var_room_ready = 'จองห้องพักของคุณได้รับการเช็คอินแล้ว! จำนวนห้องพักของคุณคือ 101';
        } else if (lang == 'zh-CN') {
            var notification_title = '通知';
            var var_room_ready = '您的预订已经入住！ 你的房间号是101。';
        }else {
            var notification_title = 'Notification';
            var var_room_ready = 'Your reservation has been checked-in! Your room number is 101.';
        }


        myApp.alert(var_room_ready,notification_title);

    }

/**
* Función para ir al módulo de propinas, desde acá se 
* envia el tipo de divisa utilizada por el hotel
* @author Luis Tobio
*/
function GoToTips(){
    $('#specific-tip-comments').val('');
    $('#tip-value-specific').val('');
    $('#tip-value-team').val('');
    var currency = '';
    dataCurrency = localStorage.getItem('dataCurrency');
    if (dataCurrency != null && dataCurrency != '' ) {
        dataCurrency = JSON.parse(dataCurrency);
        currency =  dataCurrency['sigla']; 
        //document.getElementById('tip-value').placeholder = localization['tip_amount']+' ('+currency+')'; 
        $("[id*='tip-value']").attr('placeholder', localization['tip_amount']+' ('+currency+')');

    }else{
        getCurrency(function(response){
            if(response){
                currency = response['sigla'];  
                //document.getElementById('tip-value').placeholder = localization['tip_amount']+' ('+currency+')';
                $("[id*='tip-value']").attr('placeholder', localization['tip_amount']+' ('+currency+')');
                localStorage.setItem('dataCurrency', JSON.stringify(response));  
            }
        });
    }

    setTimeout(function() {
        mainView.domCache = false;
        mainView.router.load({pageName: 'page-tips'});
    }, 100);
        
}

/**
* Según el nombre de departamento seleccionado se envian las nombres
* e imágenes para mostrarle al húesped del departamento al cual.
* Envia a la vista para realizar el envio de la propina
* enviará su propina
* @author Luis Tobio
* @param  {string} dept - nombre del departamento
*/
function selectDepartment(dept){
    $("#image-department").removeClass(); 
    localStorage.setItem('tip_selected_department', dept);
    if(dept == 'front_desk')
        $("#image-department").addClass('icon-front-desk-1'); 
    else
        $("#image-department").addClass('icon-'+dept);

    $("[id*='title-department']").html(localization[dept]);
    $("#specific-tip-comments").attr('placeholder', localization['comments']);
    mainView.router.load({pageName: 'page-tips-select-option'});
    
}

/**
* Recibe las opciones de envio de propina seleccionada por el húesped y llama una función
* ajax que envía un e-mail al encargado de distribir la propina según las intrucciones del
* húesped
* [Función ajax]
* @author Luis Tobio
* @param  {int} hotel_id          - id del hotel
* @param  {int} guest_id          - id del húesped   
* @param  {int} checkin_id        - id del check in
* @param  {string} guest_name     - nombre del húesped  
* @param  {string} phone_number   - teléfono del húesped
* @param  {string} location       - habitación/ubicación del húesped 
* @param  {string} time_text      - texto con el formato de hora a enviar en el correo  
* @param  {string} text_amount    - Monto o valor de la propina
* @param  {string} option         - [team] para todo el equipo, [specific] para alguien en especifico
* @param  {string} dept_name      - nombre del departamento
* @param  {string} comment_guest  - Comentario del húesped
* @param  {string} in_charge_mail - email del encargado de distribuir la propina
*/
function SaveTips(option){
    specific_comment = document.getElementById('specific-tip-comments').value;
    value = document.getElementById('tip-value-'+option).value;
    dept = localStorage.getItem('tip_selected_department');

    dataCurrency = '';
    sw = 0;
    message = '';
    if(dept != ''){
        if(specific_comment == '' && option == 'specific'){
           message=localization['warning_name_message']+'<br/>';
            sw = 1;
        }
        if (value == '') {
           message += localization['warning_tip_message'];
            sw = 1;
        }
        if(sw == 0){
            amount = parseFloat(value);
            var text_amount = '';
            dataCurrency = localStorage.getItem('dataCurrency');
            if(dataCurrency != ''){
                dataCurrency = JSON.parse(dataCurrency);
                text_amount = ' '+dataCurrency['signo']+amount.toFixed(2)+' '+dataCurrency['sigla']+' '; 
            }

            myApp.modal({
                title:  localization['confirm_tip_title'],
                text: localization['confirm_tip_message']+'<br/>'+text_amount,
                buttons: [
                  {
                    text: localization['tip_cancel'],
                    close: true,
                  },
                  {
                    text: 'OK',
                    bold: true,
                    onClick: function() {
                
                        parametros = {
                            'hotel_id': localStorage.getItem('hotel_id'),
                            'guest_id': localStorage.getItem('guest_id'),
                            'checking_id': localStorage.getItem('checking_id'),
                            'guest_name': localStorage.getItem('guest_name') +' '+ localStorage.getItem('guest_lastname'),
                            'phone_number': localStorage.getItem('login_tel'),
                            'location': localStorage.getItem('location'),
                            'time_text': formatDate('1'),
                            'text_amount': text_amount,
                            'option': option,
                            'dept_name': dept,
                            'comment_guest': specific_comment,
                            'in_charge_email': get_field_modules('7','1'),
                        };
                        $.ajax({
                                data: parametros,
                                url: rute + 'send-email-tips.php',
                                type: 'post',
                                dataType: 'json',
                                beforeSend: function(resultado) {
                                    myApp.showIndicator();
                                },
                                success: function(response) {
                                    myApp.hideIndicator();

                                    document.getElementById('specific-tip-comments').value = '';
                                    document.getElementById('tip-value-'+option).value = '';
                                    localStorage.setItem('tip_selected_department', '');

                                    myApp.alert(localization['thanks_tip'], localization['notification_title']);

                                    setTimeout(function() {
                                       GoToTips();
                                    }, 100);
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    myApp.hideIndicator();
                                    console.log(errorThrown);
                                }
                        });
                    }
                  },
                ]
              });
        }else{
            myApp.alert(message,  localization['notification_title']);
        }
    }
        
}

/**
* Obtiene la divisa que el hotel acutalmente utiliza
* @author Luis Tobio
* @param  {int} hotel_id - id del hotel 
* @return {array} data - devuleve un objeto array con los datos
*                        de la divisa; sigla, signo, nombre
*/
function getCurrency(callback){
    var parametros = {'hotel_id': window.localStorage.getItem('hotel_id')    };
    var dataCurrency = '';
    $.ajax({
        data: parametros,
        url: rute + 'get-currency.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {
            dataCurrency = response[0]['data'];
            callback(dataCurrency);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

/**
    función para establecer el departamento seleccionado para las propinas
    @deprecated usar selectDepartment
**/
function onChangeDepartment(){
    document.getElementById('delivery-options').style.display = 'block';
    document.getElementById('accordion-team').className = "accordion-item accordion-item-expanded";
    document.getElementById('accordion-specific').className = "accordion-item";
    document.getElementById('name_specific').style.display='none';
    deliveryOption('ht');
    mainView.router.load({pageName: 'page-tips'});      
    switch(document.getElementById('departments').value){
        case 'H':
            $("#title-select-dept").html(localization['housekeeper']);
            $("#icon_department").removeClass();
            $("#icon_department").addClass('fa icon-housekeeper');
        break;
        case 'C':
            $("#title-select-dept").html(localization['concierge']);
            $("#icon_department").removeClass();
            $("#icon_department").addClass('fa icon-concierge');
        break;
        case 'F':
            $("#title-select-dept").html(localization['front_desk']);
            $("#icon_department").removeClass();
            $("#icon_department").addClass('fa icon-front-desk');
        break;
    }
}
/**
    Función para escoger si una propina es para alguien en especifico o para todo el equipo
    @deprecated usar SaveTips
**/
function deliveryOption(item){
    if(item == 'ht'){
       $("#option-team").html('<i class="fa fa-check-circle color-green" aria-hidden="true"></i>');
       $("#option-specific").html('');
       document.getElementById('specific-name').value = '';
    }
   else{
        $("#option-specific").html('<i class="fa fa-check-circle color-green" aria-hidden="true"></i>');
        $("#option-team").html('');
        document.getElementById('name_specific').style.display='block';
        //$("#specific-name").focus();
    }
    localStorage.setItem('deliveryOpSelected', item);
}
/**
* Ir a la vista de creación de las llamadas por despertar
* @author Luis Tobio
*/
function GoToWakeUpCalls(){ 

    myDate = new Date();
    hour = myDate.getHours();
    myDate.setHours(hour + 1);

    document.getElementById('alarm-picker').value = formatDate('2', myDate); 
    document.getElementById('alarm-picker-hide').value = formatDate('2', myDate); 
    document.getElementById('alarm-picker').min = formatDate('2' , myDate);
    document.getElementById('wake-up-comments').value = '';  
    document.getElementById('wake-up-comments').placeholder = localization['comments'];
    setTimeout(function() {
        mainView.router.load({pageName: 'page-wake-up-calls'});
    }, 100);

    
}

/**
* Guarda la llamada por despertar generada por el húesped y la incluye
* [Función ajax]
* en lo módulo de notas de la versión hotel (desktop)
* @author Luis Tobio
* @param  {int} hotel_id   - id del hotel 
* @param  {int} guest_id   - id del húesped
* @param  {int} checkin_id - id del check in
* @param  {string} phone   - teléfono del húesped
* @param  {string} wtime   - fecha y hora que el húesped programa su llamada
* @param  {string} comment - Comentarios adicionales del húesped
* @return {array} data     - devuleve un objeto array con los días, horas y minutos
*                            restantes para lanzar la llamda por parte del hotel
*/
function SaveWakeUpCalls(){
    var wtime = document.getElementById('alarm-picker').value;

    if(wtime != null && wtime != ''){
        now = document.getElementById('alarm-picker-hide').value; 
        cad = 'my date: '+wtime+' - now: '+now;
        if(wtime >= now){
            wtime = wtime.replace('T', ' ');
            format_date = formatDate('3', wtime.split(' ')[1]);
            format_date = formatDate('4', wtime.split(' ')[0]+'T00:00:00-05:00')+'<h1>'+format_date+'</h1>';
            myApp.modal({
                title:  localization['confirm_tip_title'],
                text: format_date,
                buttons: [
                  {
                    text: localization['tip_cancel'],
                    close: true,
                  },
                  {
                    text: 'OK',
                    bold: true,
                    onClick: function() {
                        wtime = wtime+ ':00';
                        var parametros = {
                            'hotel_id'   : localStorage.getItem('hotel_id'),
                            'guest_id'   : localStorage.getItem('guest_id'),
                            'checkin_id': localStorage.getItem('checking_id'),
                            'phone'      : localStorage.getItem('login_tel'),
                            'wtime'      : wtime,
                            'comment'    : document.getElementById('wake-up-comments').value, 
                        };
                        $.ajax({
                            data: parametros,
                            url: rute + 'save-wake-up-call.php',
                            type: 'post',
                            dataType: 'json',
                            success: function(response) {
                                result = response[0]['data'];
                                days = ' ';
                                if(result['d'] > 0)
                                    days = ' ' + result['d'] + ' '+localization['days']+' ';
                                message_confirm_wakeup = localization['wakeup_response']+days+result['h']+' '+localization['hours']+', '+result['i']+' '+localization['minutes']
                                /*myApp.alert(message_confirm_wakeup, localization['notification_title'], function () {
                                    goToIndex(); 
                                }); */

                                myApp.addNotification({
                                    title: localization['notification_title'],
                                    subtitle: '',
                                    message: message_confirm_wakeup,
                                    media: '<i class="icon icon-n"></i>',
                                    hold: 2500
                                });

                                goToIndex();
                                
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log('error');
                            }
                        });
                    }
                  },
                ]
            });
        }else{
            myApp.alert(localization['msg_schedule_warning'],  localization['notification_title']);
        }        
    }else{
        myApp.alert(localization['msg_empty_date'],  localization['notification_title']);   
    }       
}    

/**
* Envia un email a un funcionario del hotel indicando que se ha iniciado una opinión
* en tripAdvisor
* @author Luis Tobio
* @param  {int} hotel_id          - id del hotel
* @param  {int} guest_id          - id del húesped   
* @param  {int} checkin_id        - id del check in
* @param  {string} guest_name     - nombre del húesped  
* @param  {string} phone_number   - teléfono del húesped
* @param  {string} location       - habitación/ubicación del húesped 
* @param  {string} time_text      - texto con el formato de hora a enviar en el correo
* @param  {string} comment_guest  - Opinión del húesped
* @param  {string} in_charge_mail - email del encargado en recibir la notificación
*/

function SendTripAdvisorMail(comment){
    parametros = {
        'hotel_id': localStorage.getItem('hotel_id'),
        'guest_id': localStorage.getItem('guest_id'),
        'checkin_id': localStorage.getItem('checking_id'),
        'guest_name': localStorage.getItem('guest_name') +' '+localStorage.getItem('guest_lastname'),
        'phone_number': localStorage.getItem('login_tel'),
        'time_text': formatDate('1'),
        'comment_guest': comment,
        'location': localStorage.getItem('location'),
        'in_charge_email': get_field_modules('10','1'),
    };
    $.ajax({
            data: parametros,
            url: rute + 'send-email-review.php',
            type: 'post',
            dataType: 'json',
            beforeSend: function(resultado) {
                myApp.showIndicator();
            },
            success: function(response) {
                myApp.hideIndicator();

                setTimeout(function() {
                   console.log('enviado!');
                }, 100);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                myApp.hideIndicator();
                console.log('No se pudo enviar.'+ errorThrown);
            }
    });
        
}

/**
* funcion controlar la cantidad de elementos en el carro de compras
* Nota: no está implementado el módulo de órdenes
*/
function control_amount_items(item, type, limit, price){
    elem = document.getElementById(item);
    lmt = parseInt(document.getElementById(limit).value);
    elem.value = parseInt(elem.value) + parseInt(type);
    sw = 0;
    if(elem.value == 0){
        elem.value = 1;
        sw = 1;
    }
    else if(elem.value > lmt ){
        elem.value = parseInt(lmt);
        sw = 1;
    }

    var currency = '';
    var sign = '';
    dataCurrency = localStorage.getItem('dataCurrency');
    if (dataCurrency != null && dataCurrency != '' ) {
        dataCurrency = JSON.parse(dataCurrency);
        currency =  dataCurrency['sigla']; 
        sign =  dataCurrency['signo']; 
    }

    if(price != null && sw == 0){
        total = document.getElementById('input-total-order').value; 
        total = (parseFloat(total) + (parseInt(type) * price));
        
        $("#label-total-order").html(sign+' '+total.toFixed(2)+' <small>'+currency+'</small>');
        document.getElementById('input-total-order').value = total;
        update_amount_items(item);
    }
    
}

/**
* eliminar un producto del carro
* Nota: no está implementado el módulo de órdenes
*/
function delete_product(item){
    pos_elem = item.split('_')['1'];    
    dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
    myApp.confirm(localization['confirm_delete_product'], localization['confirm_tip_title'], function() {
        dataCartList.splice(pos_elem,1);
        localStorage.setItem('dataShoppingCart', JSON.stringify(dataCartList));
        console.info('Item eliminado');
        setTimeout(function() {
            if(dataCartList.length >= 1){
                GoToPlaceOrder();
            }
            else{
                GoToProductList();
                localStorage.setItem('dataShoppingCart','');
            }
        }, 100);
    });

}

/**
   * Actualizacion automatica de la cantidad de
     elementos en carrito dependiendo del evento
   * Nota: no está implementado el módulo de órdenes
   */
function update_amount_items(elem){ 
    pos_elem = elem.split('_')['1'];
    dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
    dataCartList[pos_elem].amount = document.getElementById(elem).value;
    dataCartList[pos_elem].total_price = document.getElementById(elem).value *  dataCartList[pos_elem].price;
    localStorage.setItem('dataShoppingCart', JSON.stringify(dataCartList));    
}

/**
* Mostrar el cuadro de dialogo para agregar la observación a cada item o producto
* Nota: no está implementado el módulo de órdenes
*/
function show_observations_dialog(elem){
    pos_elem = elem.split('_')['1'];
    dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
    
    myApp.modal({
        title:  localization['write_observation'],
        text: '<div class="list-block input-list"> <ul class="lista-transparent"> <li> <div class="item-content"> <div class="item-inner"> <div class="item-input"> <textarea class="label-input-general" id="add-observations" placeholder="'+localization['comments']+'"></textarea> </div></div></div></li></ul> </div>',
        buttons: [
          {
            text: 'Ok',
            bold: true,
            onClick: function(){
                dataCartList[pos_elem].observations = document.getElementById('add-observations').value;
                localStorage.setItem('dataShoppingCart', JSON.stringify(dataCartList));               
            }
          },

          {
            text: 'Cancel',
            bold: true
          },
        ]
      });

        if(dataCartList[pos_elem].observations != null && dataCartList[pos_elem].observations != '')
            document.getElementById('add-observations').value = dataCartList[pos_elem].observations;
}

/**
*Ir a la lista de productos
* Nota: no está implementado el módulo de órdenes
*/
function GoToProductList() {
    localStorage.setItem('actual_page', 'productList');
    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    var param = {
        guest_id: window.localStorage.getItem('guest_id'),
        //id_device: idDevice
    };
    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'lang': lang,
        'detail_id': '0',
    };

    var currency = '';
    var sign = '';
    dataCurrency = localStorage.getItem('dataCurrency');
    if (dataCurrency != null && dataCurrency != '' ) {
        dataCurrency = JSON.parse(dataCurrency);
        currency =  dataCurrency['sigla']; 
        sign =  dataCurrency['signo']; 
    }else{
        getCurrency(function(response){
            if(response){
                currency = response['sigla'];  
                sign = response['signo'];
                localStorage.setItem('dataCurrency', JSON.stringify(response));  
            }
        });
    }

    $.ajax({
        data: parametros,
        url: rute + 'form-shopping-cart.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            html = '';
            for (var i =0;i < response[0]['data'].length; i++) {
                    item = response[0]['data'][i];
                    dataCartList = localStorage.getItem('dataShoppingCart');
                    color_status = 'color-gray';
                    if(dataCartList != null && dataCartList != '' && dataCartList != 'null'){
                        dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
                        for (var j = 0; j < dataCartList.length; j++) {
                            if(item['id'] == dataCartList[j].product_id){
                                color_status = 'add-cart-color-green';
                                break;
                            }
                        }
                    }
                        
                    html +='<li class="col-50">'+
                            '<a href="#" onClick="DetailProduct('+item['id']+')">'+
                            '   <div class="card demo-card-header-pic">'+
                            '       <div style="background-image:url('+ BASE_URL_BACKEND+ item['img_1']+');"  valign="bottom" class="card-header color-white no-border background-adjust">'+
                            '           <span class="fa-stack add-cart-align">'+
                            '               <i class="'+color_status+' fa fa-circle fa-stack-2x"></i>'+
                            '               <i class="fa fa-cart-plus fa-stack-1x "></i>'+
                            '           </span>'+
                            '       </div>'+
                            '       <div class="separator-line-card"></div>'+
                            '       <div class="card-content">'+
                            '           <div class="card-content-inner" style="padding-top: 5px;padding-bottom: 5px;">'+
                            '               <small class="color-gray item-search">'+ item['name'] +'</small>'+
                            '               <h3 style="margin: 0; color: #000" >'+sign+' '+item['price']+' '+currency+'</h3>'+
                            '           </div>'+
                            '       </div>'+
                            '   </div>'+
                            '</a>'+
                            '</li>' 
            }
            $("#products-list").html(html);
            dataCartList = localStorage.getItem('dataShoppingCart');
            total_items = '';
            if(dataCartList != null && dataCartList != '' && dataCartList != 'null'){
                dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
                if(dataCartList.length > 0)
                    total_items= '<span class="badge bg-red">'+ dataCartList.length+'</span>';
            }
            $("#total_items_1").html(total_items);
            $("input").blur();
            setTimeout(function() {
                mainView.router.load({pageName: 'page-product-list'});
            }, 100);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });

}

/**
* Ir al detalle del producto
* Nota: no está implementado el módulo de órdenes
*/
function DetailProduct(item){
    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'lang': lang,
        'detail_id': item,
    };

    var currency = '';
    var sign = '';
    dataCurrency = localStorage.getItem('dataCurrency');
    if (dataCurrency != null && dataCurrency != '' ) {
        dataCurrency = JSON.parse(dataCurrency);
        currency =  dataCurrency['sigla']; 
        sign =  dataCurrency['signo']; 
    }

    $.ajax({
        data: parametros,
        url: rute + 'form-shopping-cart.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            html = '';
            detail = response[0]['data'][0];
            $("#title-header").html(detail['name']);
            html = '';
            for (var i = 0; i < 3; i++) {
                if(detail['img_'+(i+1)] != null && detail['img_'+(i+1)] != ''){
                    html += '<div class="swiper-slide" id="swiper-slide-padre"><div id="swiper-slide-hijo"><img id="swiper-slide-elem" src="'+BASE_URL_BACKEND+ detail['img_'+(i+1)]+'"></div></div>';
                }
            }
            $("#swiper-images").html(html);
            $("#item-name").html(detail['name']);
            $("#label-price").html('&nbsp; '+sign+' '+detail['price']+' <small>'+currency+'</small> &nbsp;');
            $("#description").html(detail['description']);
             
            document.getElementById('product_name').value = detail['name']; 
            document.getElementById('img_1').value = detail['img_1']; 
            document.getElementById('product_id').value = detail['id']; 
            document.getElementById('price').value = detail['price'];
            document.getElementById('control-amount').value = '1';
            document.getElementById('amount').value = detail['amount'];

            dataCartList = localStorage.getItem('dataShoppingCart');
            total_items = '';
            if(dataCartList != null && dataCartList != '' && dataCartList != 'null'){
                dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
                if(dataCartList.length > 0)
                    total_items= '<span class="badge bg-red">'+ dataCartList.length+'</span>';
            }
            $("#total_items_2").html(total_items);
            //$("input").blur();
            setTimeout(function() {
                mainView.router.load({pageName: 'page-detail-shopping-cart'});
            }, 100);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}


/**
* Agregar al carro de compras el localStorage
* Nota: no está implementado el módulo de órdenes
*/
function AddToCart() {
    
    $("input").blur();
    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }
    var product_id = document.getElementById('product_id').value;

    dataCartList = localStorage.getItem('dataShoppingCart');
    product_exist = '0';
    if(dataCartList != null && dataCartList != '' && dataCartList != 'null'){
        dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
        for (var j = 0; j < dataCartList.length; j++) {
            if(product_id == dataCartList[j].product_id){
                product_exist = '1';
                break;
            }
        }
    }
        
    if(product_exist == 0){
        $total_price = document.getElementById('price').value  * document.getElementById('control-amount').value;
        var parametros = {
            'product_id': product_id,
            'product_name': document.getElementById('product_name').value,
            'amount': document.getElementById('control-amount').value,
            'total_price': $total_price,
            'price':  document.getElementById('price').value, 
            'limit':  document.getElementById('amount').value,
            'image':  document.getElementById('img_1').value,
            'observations': ''
        };
        dataCartList = localStorage.getItem('dataShoppingCart');
        var dataS = [];
        if(dataCartList != null && dataCartList != '' && dataCartList != 'null'){
            dataS = JSON.parse(localStorage.getItem('dataShoppingCart'));
            dataS[dataS.length] = parametros; 
        }
        else{
            dataS = [parametros]; 
        }
        localStorage.setItem('dataShoppingCart', JSON.stringify(dataS));
        //console.log(dataS);

            setTimeout(function() {
                    myApp.hideIndicator();
                    GoToProductList();
                    myApp.addNotification({
                        title: 'Nuvola',
                        subtitle: '',
                        message: localization['added_to_order'],
                        media: '<i class="icon icon-n"></i>',
                        hold: 2500
                    });
                }, 100);
    }else{
        myApp.addNotification({
            title: 'Nuvola',
            subtitle: '',
            message: localization['previously_added'],
            media: '<i class="icon icon-n"></i>',
            hold: 2500
        });
    }
}


/**
* Ir a la lista de compras leyendo desde localStorage*
* Nota: no está implementado el módulo de órdenes
*/
function GoToPlaceOrder(){
    dataCartList = localStorage.getItem('dataShoppingCart');  
    html = '<div class="content-block"> <div style="text-align: center;"> <i class="color-gray fa fa-5x fa-info-circle" aria-hidden="true"></i> <h3>No encontramos información</h3> </div></div>';
    total = 0.00;
    var currency = '';
    var sign = '';
    dataCurrency = localStorage.getItem('dataCurrency');
    if (dataCurrency != null && dataCurrency != '' ) {
        dataCurrency = JSON.parse(dataCurrency);
        currency =  dataCurrency['sigla']; 
        sign =  dataCurrency['signo']; 
    }
    if(dataCartList != null && dataCartList != ''  && dataCartList != 'null'){
        html = ''; 
        dataCartList = JSON.parse(localStorage.getItem('dataShoppingCart'));
        for (var i =0;i < dataCartList.length; i++) {
                item = dataCartList[i];
                param1 = "'control-place-order_"+i+"'";
                limit = "'limit_"+i+"'";
                html += '<input type="hidden" id="limit_'+i+'" value="'+item.limit+'">'+
                        '<li class="swipeout">'+
                        '   <div class="swipeout-content item-content default-border">'+
                        '       <div class="item-media"><img src="'+BASE_URL_BACKEND+item.image+'" width="70" height="40"></div>'+
                        '       <div class="item-inner">'+
                        '           <div class="item-title-row row" style="background-color: #fff">'+
                        '               <div class="col-60 tablet-60" style="width: 40vw">'+
                        '                   <div class="item-title color-black">'+item.product_name+'</div>'+
                        '                   <div class="item-subtitle color-gray"> '+sign+' '+item.price +'</div>'+
                        '               </div>'+
                        '               <div class="col-40 tablet-40">'+
                        '                   <div class="row no-gutter" style="background-color: #fff; display: table;">'+
                        '                       <div class="col-25 btn-control-place-order">'+
                        '                           <i onclick="control_amount_items('+param1+',-1, '+limit+', '+item.price+')" class="fa fa-minus-circle fa-lg add-cart-color-green"></i>'+
                        '                       </div>&nbsp;'+
                        '                       <div class="col-40 table-cell div-control-place-order">'+
                        '                           <input type="text" name="" value="'+item.amount+'" id="control-place-order_'+i+'" class="input-control-place-order" style="height: 35px"></div>&nbsp;'+
                        '                       <div class="col-25 btn-control-place-order">'+
                        '                           <i onclick="control_amount_items('+param1+',1, '+limit+','+item.price+')" class="fa fa-plus-circle fa-lg add-cart-color-green"></i>'+
                        '                       </div>'+
                        '                   </div>'+
                        '               </div>'+
                        '           </div>'+
                        '       </div>'+
                        '       <div class="vertical-menu-right"><img src="img/vertical-menu.png" style="height: 14px;"></div>'+
                        '   </div>'+
                        '   <div class="swipeout-actions-right">'+
                        '       <a href="#" onclick="delete_product('+param1+')" class="action1 bg-red"><i class="fa fa-trash-o" aria-hidden="true"></i></a>'+
                        '       <a href="#" onclick="show_observations_dialog('+param1+')" class="action1 bg-blue"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'+
                        '   </div>'+
                        '</li>';
            total = (total + (item.amount*item.price));            
        }
        $("#label-total-order").html(sign+' '+total.toFixed(2)+' <small>'+currency+'</small>'); 
        document.getElementById('input-total-order').value = total;   
        $("#order-list").html(html);
        $("input").blur();
       
        setTimeout(function() {
            mainView.router.load({pageName: 'page-place-order'});
        }, 100);
    }else{
        myApp.addNotification({
            title: 'Nuvola',
            subtitle: '',
            message: localization['no_products_msg'],
            media: '<i class="icon icon-n"></i>',
            hold: 2500
        });
    } 
        
}


/*
 * Crea un orden del pedido en la tabla 'orders' y un listado de los items del pedido en la table 'shopping_carts' 
 * relacionados en la tabla por el order_id
 * @parametros
 * - dataList: Listado de elementos que están en el carrito de compras
 * - hotel_id: id del hotel
 * - guest_id: id del huésped
 * - observations: Observaciones del pedido
 * - total_order: suma total del valor de los elementos del carrito
 * - total_products: cantidad de productos en el dataList
 * Nota: no está implementado el módulo de órdenes
*/
function CreateOrder(){
    dataCartList = localStorage.getItem('dataShoppingCart');
    if(dataCartList != null && dataCartList != '' && dataCartList != 'null'){
        var parametros = {
            'dataList': dataCartList,
            'hotel_id': window.localStorage.getItem('hotel_id'),
            'guest_id': window.localStorage.getItem('guest_id'),
            'observations': localStorage.getItem('observations_order'),
            'total_order': document.getElementById('input-total-order').value,
            'total_products': JSON.parse(localStorage.getItem('dataShoppingCart')).length
        };
        myApp.confirm(localization['confirm_place_order'], localization['place_order'], function() {
            $.ajax({
                data: parametros,
                url: rute + 'save-order.php',
                type: 'post',
                dataType: 'json',
                beforeSend: function(resultado) {
                    myApp.showIndicator();
                },
                success: function(response) {
                    myApp.hideIndicator();
                    if (response[0]['success'] == true) {
                        $("input").blur();
                        localStorage.setItem('dataShoppingCart', '');
                        localStorage.setItem('observations_order', '');
                        myApp.showIndicator();
                        setTimeout(function() {
                            myApp.hideIndicator();
                            GoToProductList();
                            myApp.addNotification({
                                title: 'Nuvola',
                                subtitle: '',
                                message: localization['order_sent'],
                                media: '<i class="icon icon-n"></i>',
                                hold: 2500
                            });
                        }, 300);
                    } else {
                        console.log('error: no se pudo guardar la orden');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    myApp.hideIndicator();
                    //myApp.alert(msj_error,notification_title);
                }
            });
        });    
    }
}

/**
* Abrir ventana para agregar observaciones al pedido
* Nota: no está implementado el módulo de órdenes
*/
$$('.open-obs-modal').on('click', function () {

      myApp.modal({
        title:  localization['write_observation'],
        text: '<div class="list-block input-list"> <ul class="lista-transparent"> <li> <div class="item-content"> <div class="item-inner"> <div class="item-input"> <textarea class="label-input-general" id="add-observations" placeholder="'+localization['comments']+'"></textarea> </div></div></div></li></ul> </div>',
        buttons: [
          {
            text: 'Ok',
            bold: true,
            onClick: function(){
                localStorage.setItem('observations_order', document.getElementById('add-observations').value);                
            }
          },

          {
            text: 'Cancel',
            bold: true
          },
        ]
      });

      obs = localStorage.getItem('observations_order');
        if(obs != null)
            document.getElementById('add-observations').value = obs;
});

/*
 * Se encarga de validar que exista una nueva versión de la app, al encontrarla recarga la app desde el top
 * tomando los nuevos datos
*/
function loadNewVersion(){
    var act_version = localStorage.getItem('angel_version');
    var new_version = act_version;
    
    $.ajax({
        url: rute + 'get-version.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {
            new_version = response[0]['data'].version;
            if(act_version != new_version){
                localStorage.setItem('angel_version', new_version);
                /*if(typeof(act_version) !== 'object'){
                    window.top.location.reload();
                }*/
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    
}

/*
 *  Envia una cookie a la vista con el valor del id de tripadvisor
 *  NOTA: En esta versión el widget de tripadvisor no permite renderizar el valor del id en el script y 
 *  por tanto se envia un cookie para que el un variable de php en la vista la capture.
*/
function sendTripAdvisorInfo(){
    if(getCookie('tripadvisorId')!= get_field_modules('10','2') || getCookie('guestLang')!= localStorage.getItem('lang_app_guest')){
        expires = new Date();
        mes = expires.getMonth();
        expires.setMonth(mes + 1);
        document.cookie = "tripadvisorId="+get_field_modules('10','2')+"; expires="+expires.toUTCString();
        document.cookie = "guestLang="+localStorage.getItem('lang_app_guest')+"; expires="+expires.toUTCString();
        window.top.frames.location.reload();
    }
}

/**
* Retorna el valor de una cookie
*/
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


/*
*   Abre la app de whatsapp a través de su api, enviando por defecto un número telefonico del personal
*   encargardo y una plantilla de mensaje personalizado que varia según el lenguaje del huésped
*   @author Luis Tobio
*/
function GoToWhatsapp(){
    
    message = localization['whatsapp_message'];
    message = message.replace("%name%", localStorage.getItem('guest_name'));
    message = message.replace("%location%", localStorage.getItem('location'));
    
    message = encodeURIComponent(message).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
    phone_number = get_field_modules('12','1');

    //href = "https://api.whatsapp.com/send?phone="+phone_number+"&text="+message;
    href = "whatsapp://send?phone="+phone_number+"&text="+message;

    //window.open(href, '_blank', 'location=off,closebuttoncaption=Close,toolbarposition=top');
    $("#menu-whatsapp").attr("href",href);
    
}

/*  Obtiene el valor de los parametros obligatorios del módulo seleccionado
*   @author Luis Tobio
*   @param {int} module - id del menú seleccionado
*   @param {int} field  - campo obligatorio; [1] generalmente correo electronico o teléfono, 
*     [2] campo adicional, p.ej: utilizado para obtener id de tripavisor
*/
function get_field_modules(module, field){
    var dataModules = localStorage.getItem('dataModules'); 
    var value = '';
    if(dataModules != null && dataModules != '' && dataModules != 'undefined'){
        dataModules = JSON.parse(dataModules);
        for(i = 0; i < dataModules.length; i++){
            if(dataModules[i].id == module){
                value = dataModules[i]['required_field_'+field];
            }
        }
    }
    return value;
}


/**
* Función auxiliar para obtener el llamado a la acción de cada módulo
* según el nombre del mismo
* @author Luis Tobio
*/
function getFunctionClick(menu_name){
    result = '';
    switch(menu_name){
        case 'menu_create_request':
            result = 'GoToCreateRequest()'; 
        break;
        case 'menu_hotel_directory':
            result = 'GoToHotelDirectory(); RefresCountEventNew()'; 
        break;
        case 'menu_orders':
            result = 'GoToProductList()'; 
        break;
        case 'package_title':
            result = 'GoToPackagesLostFound(); RefresCountEventNew()'; 
        break;
        case 'checkin_title':
            result = 'room_ready()'; 
        break;
        case 'menu_tips':
            result = 'GoToTips()'; 
        break;
        case 'menu_wake_up_calls':
            result = 'GoToWakeUpCalls()'; 
        break;
        case 'menu_rate_my_stay':
            result = 'GoToGuestSurvey()'; 
        break;
        case 'change_language':
            result = 'ActionTranslate()'; 
        break;
        case 'menu_digital_key':
            result = 'GoToDigitalKey()'; 
        break;
    }

    return result;
}


/**
* Ir al directorio del hotel y mostrar los datos del hotel y las categorias del direcotorio
* @author Luis Tobio
* @param  {int} hotel_id      -   id del hotel
* @param  {string} lang       -   lenguaje húesped
* @return {array} hotel_data  -   datos del hotel; nombre, dirección, teléfono
* @return {array} categories  -   Nombres e imágenes de las categorias creadas desde hotel.mynuvola
*/

function GoToHotelDirectory() {

    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }
    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'get-data-directory.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            hoteData = response[0]['data']['hotel_data'];
            $("#hotel_name").html(hoteData['name']);
            $("#hotel_address").html(hoteData['address']);
            $("#hotel_phone").html(hoteData['phone'] + '<a href="tel://'+hoteData['phone']+'" class="external"> <span class="badge bg-white my-badge">'+localization['call']+'</span></a>');
            categoriesData = response[0]['data']['categories'];
            //categoriesData = [];
            if(categoriesData.length > 0){
                html_categories = '';
                var json_categories = [];
                for (var i = 0; i < categoriesData.length; i++) {                                                                                                           
                    category_cover = BASE_URL_BACKEND + 'uploads/settingangel/hotel_id_'+categoriesData[i]['hotel_id']+'/directory/category/'+categoriesData[i]['cover_img'];     
                    category_name = escapeHtml(categoriesData[i]['name']); 
                    //localStorage.setItem('category_cover',category_cover);
                    //localStorage.setItem('category_name',category_name);
                    json_categories[i] = {
                        'id': categoriesData[i]['id'],
                        'cover': category_cover,
                        'name': category_name
                    }
                    html_categories += '<div onclick="GoToItemsCategory('+categoriesData[i]['id']+', '+i+')" class="card background-adjust card-category" style="background-image:url('+category_cover+');"> <div id="div-opacity">'+category_name+'</div></div>';
                }
                localStorage.setItem('json_categories',JSON.stringify(json_categories));    
                $('#div-categories').html(html_categories);
                $("input").blur();
                setTimeout(function() {
                    mainView.router.load({
                        pageName: 'page-hotel-directory'
                    });
                }, 100);
            }else{
                GoToHotelDirectory_old();
            }
            
                
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}

/**
* Ver los items de una categoria seleccionada
* @author Luis Tobio
* @param  {int} hotel_id       - id del hotel
* @param  {string} lang        - lenguaje del húesped
* @param  {int} category_id    - id de la categoria seleccionada
* @param  {string} name        - nombre de la categoria
* @param  {string} cover_img   - url de la imagen portada de la categoria 
* @return {array}  data        - datos informativos de cada item de la categoria
*/

function GoToItemsCategory(category_id, position) {
    if (window.localStorage.getItem('lang_app_guest')) {
        lang= window.localStorage.getItem('lang_app_guest');
    }else{
        lang= document.getElementById('lang-app-guest').value;
        window.localStorage.setItem("lang_app_guest", document.getElementById('lang-app-guest').value);
    }

    json_categories = JSON.parse(localStorage.getItem('json_categories'));

    var parametros = {
        'hotel_id': window.localStorage.getItem('hotel_id'),
        'category_id': category_id,
        'lang': lang
    };
    $.ajax({
        data: parametros,
        url: rute + 'get-items-category.php',
        type: 'post',
        dataType: 'json',
        beforeSend: function(resultado) {
            myApp.showIndicator();
        },
        success: function(response) {
            myApp.hideIndicator();
            $('#div-cover-category').css("background-image", "url("+json_categories[position].cover +")"); 
            $('#title-detail-category').html(json_categories[position].name );
            
            dataItems = response[0]['data'];
            html_items = '';
            if(dataItems!= null && dataItems!= ''){
                for (var i = 0; i < dataItems.length; i++) {

                    badge_publicity = '';
                    if(dataItems[i]['sponsored'] == '1')
                        badge_publicity = '<span class="badge-publicity">'+localization['sponsored']+'</span>';

                    schedule = '';
                    if(dataItems[i]['type_availability'] != '0'){

                        dataSchedule = dataItems[i]['availability'][0];
                        text_schedule = '';
                        if(dataSchedule){
                            text_schedule = convertirHorario(dataSchedule, dataItems[i]['type_availability']);
                            schedule = '<div class="title-schedule">'+localization['schedule']+'</div>'+
                                    '<div class="title-detail-schedule">'+text_schedule+' </div>'+
                                    '<hr style="border: none; border-bottom: 1px solid #ddd" width="50px">';
                        }
                    }

                    url_cover = BASE_URL_BACKEND + 'uploads/settingangel/hotel_id_'+dataItems[i]['hotel_id']+'/directory/item/'+dataItems[i]['item_cover'];                

                    link_more_info = '';
                    if(dataItems[i]['link_information'] != '')
                        link_more_info = '<a href="'+dataItems[i]['link_information']+'" target="_blank" class="external"><div class="badge bg-white badge-ver-menu">'+localization['read_more']+'</div></a>';

                    cover = '<div style="margin-top: 30px;">'+link_more_info +'</div>';
                    if(dataItems[i]['item_cover'] != ''){
                        cover = '<div class="img-facility" style="margin-top: 10px; border-radius: 5px; background-image:url('+url_cover+');">'+link_more_info+'</div>';
                        if(dataItems[i]['type_cover'] == '1'){
                            idYoutube = extraerIdYoutube(dataItems[i]['item_cover']);
                            cover = "<iframe width='100%' style='margin-top: 10px;border-radius: 5px'  src='https://www.youtube.com/embed/"+idYoutube+"' type='text/html' frameborder='0' allowfullscreen></iframe>"+link_more_info;
                        }
                    
                    }               

                    html_items +='<div class="card card-detail-category">'+
                                    '<div class="card-header" style="height: auto; min-height: 50px">'+
                                        '<div class="row">'+
                                            '<div class="col-25">'+
                                                badge_publicity+
                                            '</div>'+
                                            '<div class="col-50" style="text-align: center;">'+
                                                '<div class="detail-category-name">'+dataItems[i]['title']+'</div>'+
                                                '<div class="detail-category-desc">'+dataItems[i]['subtitle']+'</div>'+
                                            '</div>'+
                                            '<div class="col-25"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="card-content">'+
                                        '<div style="padding: 20px;">'+
                                            schedule+
                                            '<small class="title-more-detail-schedule">'+dataItems[i]['description']+'</small>'+
                                            cover +
                                        '</div>'+
                                    '</div>'+
                                '</div>';    
                }   
            }else{
                html_items = '<div style="display: flex; justify-content: center; align-items: center; height: 100%"> <div style="text-align: center"> <i class="fa fa-bell" style="font-size: 120px; color: #9E9E9E"></i> <div style="margin-top: 5px; color: #9E9E9E;font-family: \'Montserrat\', sans-serif !important;font-weight: 600 !important; font-size: 18px">'+localization['no_activity']+'</div></div> </div>';
            }
            
                
            $("#div-items-category").html(html_items);
            $("input").blur();
            setTimeout(function() {
                mainView.router.load({
                    pageName: 'page-detail-category'
                });
            }, 100);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            myApp.hideIndicator();
            //myApp.alert(msj_error);
        }
    });
}


var dk = {
    device: '',
    // Called if device connects.
    onConnected: function (device)
    {
        myApp.hideIndicator();
        dk.clear();
        dk.display('Connected to device');
        dk.device = device;
        dk.openDoor();
        /*mainView.router.load({
            pageName: 'page-digital-key'
        });*/
    },
    // Called if device disconnects.
    onDisconnected: function (device)
    {
        myApp.hideIndicator();       
        dk.clear();
        dk.display('Disconnected from device');
    },
    // Called when a connect error occurs.
    onConnectError: function (error)
    {
        myApp.hideIndicator();
        dk.clear();
        dk.display('Connect error: ' + error);
    },

    manageConnection: function(){
        myApp.showIndicator();
        setTimeout(
            function(){
                myApp.hideIndicator(); 
                evothings.ble.stopScan();
            }, 30000
        );
        console.log(window.localStorage.getItem('digital_key_name'));
        if(dk.device == ''){
            evothings.ble.startScan(
                function(device){
                    dk.clear();
                    dk.display('Connecting...');
                    console.log(device.name, device.address);
                    if (device.name == window.localStorage.getItem('digital_key_name'))
                    {
                        evothings.ble.stopScan();
                        console.log(device);
                        myApp.hideIndicator();
                        dk.clear();
                        dk.display('startScan found device named: '+ device.name);
                        // Connect.
                        evothings.ble.connectToDevice(
                            device,
                            dk.onConnected,
                            dk.onDisconnected,
                            dk.onConnectError
                        );
                    }
                },
                function(errorCode){
                    myApp.hideIndicator();
                    dk.display('startScan error: '+ errorCode);
                }
            );
        }else{
            myApp.hideIndicator();
            dk.openDoor();
        }
        /*evothings.ble.connectToDevice(
            dk.device,
            dk.onConnected,
            dk.onDisconnected,
            dk.onConnectError
        );*/
            
     },

    openDoor: function(){
        var service = evothings.ble.getService(dk.device, dk.device.advertisementData.kCBAdvDataServiceUUIDs[0]);
        var characteristic = evothings.ble.getCharacteristic(service, service.characteristics[0].uuid);
        evothings.ble.writeCharacteristic(
            dk.device,
            characteristic,
            dk.str2ab('a'),
            function(){
                dk.clear(); 
                dk.display('Door open'); 
            },
            function(errorCode){ 
                dk.clear();
                dk.display('writeCharacteristic error: '+ errorCode);
            }
        );

    },
    
    str2ab: function (str){
          var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
          var bufView = new Uint16Array(buf);
          for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);

          return bufView;  
        }
    },

/*
    appends @message to the message div:
*/
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
/*
    clears the message div:
*/
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    }
};      // end of app

function GoToDigitalKey(){
    
    mainView.router.load({
        pageName: 'page-digital-key'
    });
}

function openDoor(){
    dk.manageConnection();
}

/**
* Recibe una url y extrae el id de YouTube válido para 
* insertarlo en un iframe
* @author Luis Tobio
* @param {string} url - url de youtube
* @return {string} - Si la url coincide con la expresión regular devolverá
*                    un id válido de lo contrario un mensaje de error
*/
function extraerIdYoutube(url) {
     var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
     var match = url.match(regExp);

     if (match && match[2].length == 11) {
         return match[2];
     } else {
         return 'error';
     }
 }

/**
* Transforma un estructura JSON con horarios creados desde hotel 
* y los convierte en una cadena de texto para mostrarlo en pantalla
* @author Luis Tobio
* @param {JSON} dataSchedule - Horarios de la semana
* @param {int} type - (1) de lunes a viernes, (2) toda la semana [un horario por cada dia]
* @return {string} text - cadena de texto con traducción de los días y tipo de horario
*/

function convertirHorario(dataSchedule, type){
    if(type == '1')
        dataDays = ['monday','saturday', 'sunday'];
    else
        dataDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday','saturday', 'sunday'];        

    text = '';
    closedDays = '';
    concatDays = '';
    for (var i = 0; i < dataDays.length; i++) {
        inicio = dataDays[i] + '_start';
        fin    = dataDays[i] + '_end';
        if(dataSchedule[inicio]!='' && dataSchedule[inicio]!='null'){
            if(dataDays[i] == 'monday' && type == '1'){
                text += localization['monday']+'-'+ localization['friday']+': '+ formatDate('5',"January 01, 2018 "+dataSchedule[inicio]+":00") +' - '+ formatDate('5',"January 01, 2018 "+dataSchedule[fin]+":00") + ' / ';
            }
            else{
                text += localization[dataDays[i]] +': '+ formatDate('5',"January 01, 2018 "+dataSchedule[inicio]+":00") +' - '+ formatDate('5',"January 01, 2018 "+dataSchedule[fin]+":00")  + ' / ';
            }
        }else{
            closedDays += localization[dataDays[i]] + ', ';
        }
        if(dataDays[i]!= 'saturday' && dataDays[i]!= 'sunday'){
            concatDays += localization[dataDays[i]] + ', ';
        }
    }
    if(closedDays != ''){
        if(closedDays.substr(0, closedDays.length - 2) != concatDays.substr(0, concatDays.length - 2))
            closedDays = '<br/>'+closedDays.substr(0, closedDays.length - 2);
        else
            closedDays = '<br/>' + localization['monday']+'-'+ localization['friday'];        
        closedDays += ': '+localization['closed'];
    }
    text = text.trim();
    text = text.substr(0, text.length - 1) + closedDays;
    return text;
}

/**
* Función auxiliar para dar formato a las diferentes fechas y horas
* utilizadas en toda la aplicación
* @author Luis Tobio
* @param {int} format      - Número del tipo formato deseado
* @param {date} myDate     - Fecha la que se desea dar formato
* @return {string} result  - cadena de texo con el formato establecido 
*/

function formatDate(format, myDate){

    date = new Date();
    if(myDate != '' && (format == '2' || format == '4' || format == '5')){
        date = new Date(myDate);
    }

    h = date.getHours();
    h = (h < 10) ? '0'+ h : h;
    i = date.getMinutes();
    i = (i < 10) ? '0'+ i : i;
    s = date.getSeconds();
    s = (s < 10) ? '0'+ s : s;
    time = h +':'+ i +':'+ s;

    d = date.getDate();
    d = (d < 10) ? '0'+ d : d;
    m = date.getMonth()+1;
    m = (m < 10) ? '0'+ m : m;
    y = date.getFullYear();
    
    result = '';
    switch (format){
        case '1':
            y = y - 2000;
            date = m +'/'+ d +'/'+y;
            h = parseInt(time.split(':')[0]);
            i = time.split(':')[1]
            fm =  'A.M'
            if(h >= 12){
                fm = 'P.M'
                if(h != 12)
                    h = h - 12;
            }
            h = (h < 10) ? '0'+ h : h;
            //date = d +'/'+ m +'/'+y;
            time = h+':'+i+' '+fm;
            result = date+' '+time;
        break;
        case '2':
            date = y +'-'+ m +'-'+ d;
            result =  date+'T'+ h +':'+ i;
        break;
        case '3':
            h = parseInt(myDate.split(':')[0]);
            i = myDate.split(':')[1]
            fm =  'a.m.'
            if(h >= 12){
                fm = 'p.m.'
                if(h != 12)
                    h = h - 12;
            }
            h = (h < 10) ? '0'+ h : h;
            //date = d +'/'+ m +'/'+y;
            time = h+':'+i+' '+fm;
            result = time;
        break;
        case '4':
            date = d +'/'+ m +'/'+y;
            result = date;
        break;
        case '5':
            var hh = date.getHours();
             var m = date.getMinutes();
             var s = date.getSeconds();
             var dd = "AM";
             var h = hh;
             if (h >= 12) {
                 h = hh - 12;
                 dd = "PM";
             }
             if (h == 0) {
                 h = 12;
             }
             m = m < 10 ? "0" + m : m;
             s = s < 10 ? "0" + s : s; /* if you want 2 digit hours: h = h<10?"0"+h:h; */
             var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
             var replacement = h + ":" + m; /* if you want to add seconds replacement += ":"+s; */
             replacement += " " + dd;
             result = replacement;
        break;
    }
    
    return result;    
}

function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '(': '&#40;',
      ')': '&#41;',
      '´': '&#180;',
      '`': '&#96;',
      '{': '&#123;',
      '}': '&#125;',
    }
    return text.replace(/[&<>"'()´`{}]/g, function(m) { return map[m]; })
  }
