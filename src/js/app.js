if('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw.js')
    .then(function(){
        console.log('serviceWorker registerd');
    });
}