import injector from 'vue-inject';

function ProvisioningService(moment) {
    return {
        delay(t, v) {
            return new Promise(resolve => {
                setTimeout(resolve.bind(null, v), t);
            });
        },
        async getProvisioningStatus() {

            return this.delay(1000).then(()=>{

                return {
                    id: 123,
                    jobType: 'Email',
                    uid: 'bdarley',
                    submittedDate: moment().format("MM/DD/YYYY h:mm a"),
                    malboxType: 'Live',
                    status: 'Completed',
                    createDate: moment().format("MM/DD/YYYY h:mm a"),
                    createUser: 'derpp',
                    responseEmail: 'bdarley@bdarley.net'
    
    
    
                };
    
            })
            

        }
    }
}

injector.service('ProvisioningService', ['moment'], ProvisioningService);