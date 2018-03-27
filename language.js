function LanguageJS(itemsToTranslate) {
    this.addLanguageFile = function(){
        var languageFile = document.getElementById('languageFile');
        (languageFile != null) ? languageFile.parentNode.removeChild(languageFile):"";
        languageFile = document.createElement('script');
        languageFile.src = "locale/bd-" + this.sectionID + "-" + this.languageID + ".js?v="+Math.floor((Math.random() * 1000) + 1);
        languageFile.id = "languageFile";
        document.getElementsByTagName('body')[0].appendChild(languageFile);
    }

    this.translate = function(languageID, sectionID) {
        this.languageID = new String(languageID);
        this.sectionID = new String(sectionID);
        this.addLanguageFile();
        var languageFile = document.getElementById('languageFile');
        languageFile.onload = function(){
            for (var i in itemsToTranslate) {
                var elementToTranslate = document.getElementsByClassName('lang__' + itemsToTranslate[i]);
                for (var o in elementToTranslate) {
                    elementToTranslate[o].innerHTML = localization[itemsToTranslate[i]];
                    elementToTranslate[o].placeholder  = localization[itemsToTranslate[i]];
                }
            }
        }
    }
}


var LanguageJS = new LanguageJS([
        "login_sig_in",
        "login_email",
        "login_phone_number",
        "login_request_access",
        "login_change_language",
        "login_follow_us",

        "registration_title",

        "menu_dashboard",
        "menu_create_request",
        "menu_rate_my_stay",
        "menu_hotel_directory",
        "menu_log_out",
        "menu_hi",
        "menu_tips", //added by luis tobio
        "menu_wake_up_calls", //added by luis tobio
        "menu_orders", //added by luis tobio
        "menu_uber",
        "menu_tripadvisor",
        "menu_whatsapp",
        "menu_digital_key",

        "dashboard_title",
        "dashboard_all",
        "dashboard_pending",
        "dashboard_completed",
        "dashboard_search",
        "dashboard_no_search",

        "create_request_title",
        "gr_register",
        "gr_cancel",

        "view_request_title",

        "chat_messages",

        "hotel_directory_tite",

        "rate_my_stay",

        "change_language",

        "c_send",
        "view_package_title",
        "package_title",

        "package_pending",
        "package_delivered",
        "no_activity",
        
        "checkin_title",

        /*added by ltobio*/
        "deliver_my_tip",
        "select_department",
        "tip_amount",
        "housekeeper",
        "concierge",
        "front_desk",
        "for_team",
        "for_team_detail",
        "for_specific",
        "for_specific_detail",
        "btn_send",
        "guest_label",
        "phone_label",
        "location_label",
        "time_label",
        "comments",
        "comment_tip_value",
        "comment_tip_team",
        "comment_tip_specific",
        "wakeup_response",
        "days",
        "hours",
        "minutes",
        "product_list_title",
        "no_products_msg",
        "description_title",
        "reviews",
        "add_to_order",
        "added_to_order",
        "write_observation",
        "place_order",
        "previously_added",
        "confirm_place_order",
        "order_sent",
        "confirm_delete_product",
        "notification_title",
        "schedule",
        "receive_call",
        "msg_schedule_warning",
        "msg_empty_date",
        "thanks_tip",
        "call",
        "title_categories",
        "sponsored",
        "read_more",
        "no_information",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
        "closed",
        "yes",
        "no",
        "angel_title",
        "confirm_exit",
    ]);
