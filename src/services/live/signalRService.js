import injector from 'vue-inject';
import * as signalR from '@aspnet/signalr';

function SignalRService(configReaderService) {
    return {
        async setupConnection() {
            const serviceEndpoint = await configReaderService.getConfigurationSetting("signalREndpoint")
            
            
            let connection = new signalR.HubConnectionBuilder()
                .withUrl(`${serviceEndpoint}provision-hub`)
                .build();

            connection.on("ProvisionStatusUpdate", update => {
                    console.log(update);
            });

            await connection.start()
                .catch(e => console.error(e.toString()));

                debugger;


            connection.invoke("GetProvisionStatus", 160370);

        }
    }
}

injector.service('SignalRService', ['ConfigReaderService'], SignalRService);