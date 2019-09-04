import injector from 'vue-inject';

function ScreenReaderAnnouncerService(eventBus) {
    return {
        sendPageLoadAnnouncement(page){
            eventBus.emit('announcement-page-load', page);
            // let announcer = document.getElementById('announcer');
            // announcer.innerHTML = `${page} has loaded`;
            // setTimeout(()=> {
            //     announcer.innerHTML = "";
            // }, 500);
        },
        sendAnnouncement(message){
            eventBus.emit('announcement-send-announcement', message);
            // let announcer = document.getElementById('announcer');
            // announcer.innerHTML = message;
            // setTimeout(()=> {
            //     announcer.innerHTML = "";
            // }, 500);
        },
        clear(){
            eventBus.emit('announcement-clear');
            let announcer = document.getElementById('announcer');
            announcer.innerHTML = "";
        }
    }
}

injector.service('ScreenReaderAnnouncerService',['EventBus'], ScreenReaderAnnouncerService);