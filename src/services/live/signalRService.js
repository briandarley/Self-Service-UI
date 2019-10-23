import injector from 'vue-inject';
import * as signalR from '@aspnet/signalr';

function SignalRService(configReaderService,eventBus) {
    return {
        _connection : null,
        async setupConnection() {
            const serviceEndpoint = await configReaderService.getConfigurationSetting("signalREndpoint")
            
            if(this._connection) return;
            
            
                this._connection = new signalR.HubConnectionBuilder()
                    .withUrl(`${serviceEndpoint}provision-hub`)
                    .withUrl(`${serviceEndpoint}massmail-action-hub`)
                    .build();

                    this._connection.on("ProvisionStatusUpdate", update => {
                    console.log("SignalR, Provision Status Update called ");
                });

                this._connection.on("MassMailCampaignActionUpdate", update => {
                    eventBus.emit('massmail-campaign-status-update', update);
                });
                this._connection.on("NotifyCampaignBatchProcessUpdate", update => {
                    eventBus.emit('massmail-campaign-mail-batch-update', update);
                });
                

                await this._connection.start()
                    .catch(e => console.error(e.toString()));
            


            //connection.invoke("GetProvisionStatus", 160370);

        },
        async getProvisionStatus(provisionId){
            await this._connection.invoke("GetProvisionStatus", provisionId);
        },
        async updateMassMailCampaignAction(campaignId,action){
            await this._connection.invoke("UpdateMassMailAction", campaignId,action);
        }
    }
}

injector.service('SignalRService', ['ConfigReaderService','EventBus'], SignalRService);