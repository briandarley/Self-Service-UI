import injector from 'vue-inject';
import DuoWebSDK from 'duo_web_sdk';
//https://github.com/duosecurity/duo_web_sdk/blob/master/examples/react/src/App.js
function DuoAuthService(httpHandlerService,localStorageService) {
    return {
        _duoState : "STATE_AUTH_PENDING",
        getDuoState(){
            return this._duoState;
        },
        _setDuoState(state) {
            this._duoState = state;
        },
        async _getSigRequest() {
            try {
                const handler = await httpHandlerService.get();
                let response = await handler.get(`duo/signed-request`);


                return response.data;

            } catch (e) {
                throw e;
            }
        },
        async _verifyResponse(response) {
            try {
                
                const handler = await httpHandlerService.get();
                
                await handler.post(`duo/verify-response`,"\"" + response + "\"");
                                                        
                return true;
            } catch (e) {
                throw e;
            }
        },
        async _submitPostAction(callback,form){
            try{
                
                let response = await this._verifyResponse(form.sig_response.value);
                
                if(response)
                {
                    this._setDuoState("STATE_AUTH_PASSED")
                }
                else{
                    this._setDuoState("STATE_AUTH_FAILED")
                }
               
                callback();
            } catch(e){
                throw e;
            }
        },
        async initDuoFrame(callBack){
            try{
                
                let request = await this._getSigRequest();
                 

                 DuoWebSDK.init({
                    iframe: "duo-frame",
                    host: request.hostAddress,
                    sig_request: request.signedRequest,
                    submit_callback: this._submitPostAction.bind(this,callBack),
                  });

            } catch(e){
              throw e;
            }
        },
        async duoRequired(routeName){
            try {
                const handler = await httpHandlerService.get();
                let response = await handler.get(`duo/duo-required?routeName=${routeName}`);
                return response.data;

            } catch (error) {
                throw e;
            }
        }


    }
}

injector.service('DuoAuthService', ["httpHandlerService","localStorageService"], DuoAuthService);