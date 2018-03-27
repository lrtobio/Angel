var idDevice;
if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('sw.js').then(function() {
        return navigator.serviceWorker.ready;
    }).then(function(reg) {
        console.log('Service Worker is ready :^)', reg);
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(sub) {
            console.log(sub.endpoint);
            var endpointParts = sub.endpoint.split('/');
            var registrationId = endpointParts[endpointParts.length - 1];
            idDevice =  registrationId;
            console.log('endpoint:', registrationId);
            /*$.ajax({
                url: 'webservices/firebase/create_group.php?id=' + registrationId,
                type: 'get',
                success: function(res) {
                    console.log(JSON.parse(res));
                    if (JSON.parse(res).error) {
                        $.ajax({
                            url: 'webservices/firebase/add_ids.php?id=' + registrationId,
                            type: 'get',
                            success: function(res) {
                                console.log(JSON.parse(res));
                                $.ajax({
                                    url: 'webservices/firebase/send_notify.php?id=' + JSON.parse(res).notification_key,
                                    type: 'get',
                                    success: function(res) {
                                        console.log(JSON.parse(res));
                                    }
                                });
                            }
                        });
                    }
                }
            });*/
        });
    }).catch(function(error) {
        console.log('Service Worker error :^(', error);
    });
}
