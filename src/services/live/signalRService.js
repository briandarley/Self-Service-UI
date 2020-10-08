import injector from 'vue-inject';
import * as signalR from '@microsoft/signalr';

function SignalRService(configReaderService,eventBus) {
    return {
        _connection : null,
        async setupConnection() {
            const serviceEndpoint = await configReaderService.getConfigurationSetting("signalREndpoint")
            
            if(this._connection) return;
                /*
                    Note when adding new Hubs, be sure to register them in startup.cs
                */
            
                this._connection = new signalR.HubConnectionBuilder()
                    .withUrl(`${serviceEndpoint}provision-hub`)
                    .withUrl(`${serviceEndpoint}mass-mail-action-hub`)
                    .withUrl(`${serviceEndpoint}win-tools-hub`)
                    .withAutomaticReconnect([0, 1000, 5000, null])
                    .configureLogging(signalR.LogLevel.Information)
                    .build();

                    this._connection.on("ProvisionStatusUpdate", update => {
                    //console.log("SignalR, Provision Status Update called ");
                    });

                    this._connection.on("MassMailCampaignActionUpdate", update => {
                        //console.log("SignalR, MassMailCampaignActionUpdate called ");
                        eventBus.emit('massmail-campaign-status-update', update);
                    });
                    this._connection.on("NotifyBatchStateUpdateAction", update => {
                        //window.console.log(update);
                        //console.log("SignalR, NotifyBatchStateUpdateAction called ");
                        eventBus.emit('notify-batch-state-update-action', update);
                    });
                    // this._connection.on("NotifyGroupCreated", update => {
                        
                    //     eventBus.emit('NotifyGroupCreated', update);
                    // });
                    // this._connection.on("NotifyGroupCurrentStepProcessing", update => {
                        
                    //     eventBus.emit('NotifyGroupCurrentStepProcessing', update);
                    // });
                    this._connection.on("NotifyGroupProcessUpdate", model => {
                        eventBus.emit('NotifyGroupProcessUpdate', model);
                    });
                    
                    
             
                

                await this._connection.start()
                    .catch(e => window.console.error(e.toString()));
            


            

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