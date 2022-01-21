import {
  BaseValidateMixin
} from "../../../../../components/mixins/index";

import {
  Component,Watch
} from "vue-property-decorator";

@Component({
  name: 'mfa-reset',
  dependencies: ['$', 
  'moment', 
  'toastService', 
  'spinnerService', 
  'ExchangeToolsService',
  'DuoAuthService',
  'ScreenReaderAnnouncerService']

})

export default class MfaReset extends BaseValidateMixin {
  filter = "";
  
  msolUser = {};
  duoPreAuth  = {
    response: {
      devices: []
    }
  };
  selectedDevice = null;
  currentDevice = null;
  passcode = "";
  duoRequest = {
    showCapabilities: true
  };
  width = 0;
  animationHandle = null;
  sendSmsNotice = "";
  success = false;

  get showContactMethod(){
    if(!this.msolUser ) return false;
    return !!this.msolUser.strongAuthentication
    
  }
  get phoneNumber() {
    if(!this.msolUser.strongAuthentication.userDetails) return "NA";
    if(!this.msolUser.strongAuthentication.userDetails.phoneNumber) return "NA";
    return this.msolUser.strongAuthentication.userDetails.phoneNumber;
  }
  get altPhoneNumber() {
    if(!this.msolUser.strongAuthentication.userDetails) return "NA";
    if(!this.msolUser.strongAuthentication.userDetails.alternativePhoneNumber) return "NA";
    return this.msolUser.strongAuthentication.userDetails.alternativePhoneNumber;
  }
  get deviceName() {
    if(!this.msolUser.strongAuthentication.userDetails) return "NA";
    if(!this.msolUser.strongAuthentication.phoneAppDetails.deviceName) return "NA";
    return this.msolUser.strongAuthentication.phoneAppDetails.deviceName;
  }

  get primaryMfaMethod() {
    if(!this.msolUser ) return "";
    if(!this.msolUser.strongAuthentication) return "";
    if(!this.msolUser.strongAuthentication.strongAuthenticationMethods) return "";
    let primary = this.msolUser.strongAuthentication.strongAuthenticationMethods.find(c=> c.isDefault);
    return primary.methodType
  }
  async mounted() {
    this.clearDuoRequest();
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - MFA Reset");
  }
  resetProgressBar() {
    window.clearTimeout(this.animationHandle);
    this.width = 0;
  }

  onAnimateProgressBar() {
    
    this.animationHandle = setTimeout(async () => {
      if(this.width >= 100){
        await new Promise(r => setTimeout(r, 2000));
        this.width = 0;
        await new Promise(r => setTimeout(r, 2000));
        
      }
      else {
        this.width ++;
        
      }
      this.onAnimateProgressBar();
      
    }, 590);
  }

  onDeviceChanged(ev){
    this.currentDevice = this.duoPreAuth.response.devices.find((c) => c.display_name === ev.target.value);
  }

  async search() {
    let errors = this.validate(this.$refs.searchForm);
    if (errors.length) {
      this.toastService.error("Validation Failed");
      return false;
    }



    this.spinnerService.show();
    try {
      
      
      this.msolUser = await this.ExchangeToolsService.getMsolUser(this.filter);
      this.duoPreAuth = await this.DuoAuthService.preAuthUser(this.filter);
      
      this.currentDevice = null;
      this.selectedDevice = null;
      this.clearDuoRequest();
      
      this.passcode = "";
      if(this.duoPreAuth.response.status_msg === "Account is active") {
        this.currentDevice = this.duoPreAuth.response.devices[0];
        this.selectedDevice = this.duoPreAuth.response.devices[0].display_name;
      }
      
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve MFA status for user");
    } finally {
      this.spinnerService.hide();
    }
  }
  

  async onResetMfa(){
    this.spinnerService.show();
    try {
      
      await this.ExchangeToolsService.toggleMfa(this.filter);

      this.toastService.success("Successfully reset MFA for selected account");
    } catch (e) {
      this.toastService.error("Failed to reset MFA status for user");
    } finally {
      this.spinnerService.hide();
    }
  }

  async onSendSmsRequest() {
    try {
      this.clearDuoRequest();

      let request = await this.DuoAuthService.authUser(this.filter,{
        uid: this.filter,
        factor: 1,
        device: this.currentDevice.device
  
      });
      
      
      if(request.response && request.response.status === "sent"){
        
        this.toastService.success("submitted SMS request");
        this.sendSmsNotice = "Passcode request sent";
        setTimeout(() => {
          this.sendSmsNotice  = "";
        }, 4000);
      }
      else {
        this.sendSmsNotice = "Failed to send SMS Request";
        this.toastService.error("something is wrong");
      }
      
    } catch (error) {
      window.console.log(error);
      this.toastService.error("failed to send");
    }    
  }
  async onEnterPassCode() {
    try {
      this.clearDuoRequest();
      
      let request = await this.DuoAuthService.authUser(this.filter,{
        uid: this.filter,
        factor: 2,
        device: this.currentDevice.device,
        passCode: this.passcode
      });
      window.console.log(request);
      
      if(request.stat === "OK" && request.response.result === "allow")
      {
        this.passcode = "";
        this.successDuoCall(request.response.result,request.response.status_msg);
      }
      else {
        this.failDuoCall(request.response.result,request.response.status_msg)
      }




      
    } catch (error) {
      window.console.log(error);
      this.toastService.error("failed passCode");
    }    
    

  }
  async duoPush() {
    try {
      this.callingDuoSerice("push");

      let request = await this.DuoAuthService.authUser(this.filter,{
        uid: this.filter,
        factor: 3,
        device: this.currentDevice.device
        
      });

      if(request.stat === "OK" && request.response.result === "allow")
      {
        this.successDuoCall(request.response.result,request.response.status_msg);
      }
      else {
        this.failDuoCall(request.response.result,request.response.status_msg)
      }

    } catch (error) {
      window.console.log(error);
      this.toastService.error("failed Duo Push");
    }
  }

  async phoneCall() {
    try {
      this.callingDuoSerice("phone");

      let request = await this.DuoAuthService.authUser(this.filter,{
        uid: this.filter,
        factor: 4,
        device: this.currentDevice.device
        
      });

      if(request.stat === "OK" && request.response.result === "allow")
      {
        this.successDuoCall(request.response.result,request.response.status_msg);
      }
      else {
        this.failDuoCall(request.response.result,request.response.status_msg)
      }

      

    } catch (error) {
      window.console.log(error);
      this.toastService.error("failed Phone Confirmation");
    }

  }

   
  callingDuoSerice(mode) {
    this.resetProgressBar();
    if(mode !== "sms")
    {
      this.clearDuoRequest();
      this.duoRequest.callingApi = true;
      this.duoRequest.showCapabilities = false;

      this.onAnimateProgressBar();
    }
    this.duoRequest.mode = mode;
    this.duoRequest.showResetStatus = true;
    this.duoRequest.message = `Waiting response from ${this.selectedDevice}`;
    
  }
  successDuoCall(status,message) {
    //let mode = this.duoRequest.mode;
    this.resetProgressBar();
    this.clearDuoRequest();
    this.duoRequest.callingApi = false;
    this.duoRequest.showResetStatus = true;
    this.duoRequest.showCapabilities = false;
    this.duoRequest.success = true;
    this.duoRequest.mode = status;
    this.duoRequest.message = message;
    this.success = true;
  }
  failDuoCall(status,message) {
    
    this.resetProgressBar();
    this.clearDuoRequest();
    this.duoRequest.callingApi = false;
    this.duoRequest.showResetStatus = true;
    this.duoRequest.showCapabilities = false;
    this.duoRequest.success = false;
    this.duoRequest.mode = status;
    this.duoRequest.message = message;
    this.success = false;
    
  }
  completedDuoServiceCall() {
    this.resetProgressBar();
    this.clearDuoRequest();
    
    this.duoRequest.showCapabilities = true;
  }

  clear() {
    this.filter = "";
    this.msolUser = {};
    this.success = false;
  }

  clearDuoRequest() {
    this.success = false;
    this.duoRequest = {
      showCapabilities: true
    };
  }

  
  onVerifyUser(){
    this.success = false;
    this.$refs.dlgDuoAuth.show();

  }


  onCloseDuoAuth() {
    this.$refs.dlgDuoAuth.hide();
  }

  

  bypassIdentification() {
    this.success = true;
  }
}