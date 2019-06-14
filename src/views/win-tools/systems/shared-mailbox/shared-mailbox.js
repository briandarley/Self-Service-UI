import {
  Component,
  Watch
} from "vue-property-decorator";
import {
  BaseValidateMixin
} from '../../../../components/mixins/index';



@Component({
  name: 'shared-mailbox',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService']

})
export default class SharedMailbox extends BaseValidateMixin {
  organizationalUnits = [];

  model = {
    department: "",
    name: "",
    displayName: "",
    replyToAddress: ""
  }
  persistedModel = {};
  responseModel = {};
  showAddMembers = false;
  groupMemberId = "";
  groupManagerId = "";
  
  @Watch('model.displayName')
  onDisplayNameChanged(newvalue) {
    if (!newvalue) {
      this.model.name = "";
      this.model.replyToAddress = "";
      return;
    }
    this.model.name = newvalue.replace(/[^a-z0-9_-]/g, '');
    this.model.replyToAddress = this.model.name + '@email.unc.edu';
  }

  getDepartmentLabel(entity) {
    if (entity.description) {
      return `${entity.name} - ${entity.description}`;
    }
    return entity.name;
  }
  async loadOrganizationalUnits() {
    this.spinnerService.show();
    try {
      let list = await this.ExchangeToolsService.getOrganizationalUnits();
      list.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;

      })
      this.organizationalUnits = list;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to load organizational units");
    } finally {
      this.spinnerService.hide();
    }
  }
  async mounted() {
    this.toastService.set(this);
    await this.loadOrganizationalUnits();
  }
  async getUserByEmail() {

    try {
      //check to make sure email is unique model.replyToAddress
      let adUser = await this.ExchangeToolsService.getAdUserByEmail(this.model.replyToAddress);

      return adUser;

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve user by email");
      return null;
    }
  }
  async getDistributionGroup() {

    try {
      let samAccountName = `${this.model.department}_${this.model.name}.dg`
      let entity = await this.ExchangeToolsService.getDistributionGroup(samAccountName);

      return entity;

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve distribution group");
      return null;
    }

  }
  async getDistributionGroupMembers() {

    try {
      let samAccountName = `${this.model.department}_${this.model.name}.dg`
      let entities = await this.ExchangeToolsService.getDistributionGroupMembers(samAccountName);

      return entities;

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve distribution group");
      return null;
    }

  }
  async getSharedMailbox() {

    try {
      let samAccountName = `${this.model.department}_${this.model.name}.smb`
      let entity = await this.ExchangeToolsService.getSharedMailbox(samAccountName);

      return entity;

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve shared mailbox");
      return null;
    }
  }

  async performIntegrityCheck() {
    try {
      this.spinnerService.show();
      this.persistedModel = {};

      let values = await Promise.all([
        this.getSharedMailbox(), 
        this.getDistributionGroup(), 
        this.getUserByEmail(), 
        this.getDistributionGroupMembers()])

      if (!values[0] || !values[1] || !values[2] || !values[3]) {
        //One of the responses returned null
        //this.toastService.error("Failed integrity check");
        return "FAILED";
      }
      if (values[0].status === false && values[1].status === false) {
        if (values[2].status === false) {
          //Mailbox doesn't exist and the reply to address is unique
          return "DOES_NOT_EXIST"
        }
        //Mailbox doesn't exist but the reply to address is in use
        return "REPLY_TO_IN_USE"
      } else if (values[0].status !== false && values[1].status !== false) {
        this.persistedModel.mailbox = values[0];
        this.persistedModel.group = values[1];
        this.persistedModel.members = values[3].members;
        this.persistedModel.managers = values[3].managers;
        
        //Both mailbox and distribution group exist
        return "SHARED_MAILBOX_EXISTS";
      } else {
        this.persistedModel.mailbox = values[0];
        this.persistedModel.group = values[1];
        //Either Shared Mailbox does not exist or Distribution group does not exist
        return "ORPHANED_OBJECT";
      }

    } catch (e) {
      window.console.log(e);
      return "FAILED";
    } finally {
      this.spinnerService.hide();
    }
  }
  async createSharedMailbox() {
    try {
      this.spinnerService.show();
      let model = {
        shortName: this.model.name,
        organization: this.model.department,
        displayName: this.model.displayName,
        replyToAddress: this.model.replyToAddress
      }

      this.responseModel = await this.ExchangeToolsService.createSharedMailbox(model);

      window.console.log(this.responseModel);

      this.toastService.success("Successfully created shared mailbox");


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to create shared mailbox");

    } finally {
      this.spinnerService.hide();
    }
  }
  async removeMember(samAccountName){
    this.spinnerService.show();
    try{
  
      await this.ExchangeToolsService.removeGroupMember(this.persistedModel.group.samAccountName, samAccountName)
      let index = this.persistedModel.managers.indexOf(this.persistedModel.members.find(c=> c.samAccountName === samAccountName));
      this.persistedModel.members.splice(index, 1);
      this.persistedModel =JSON.parse(JSON.stringify(this.persistedModel));
      this.toastService.success("Successfully removed member")
    } catch(e){
      window.console.log(e);
      this.toastService.error("Failed to remove group member");
    }
    finally{
      this.spinnerService.hide();
    }
    
  }
async removeManager(samAccountName){
  this.spinnerService.show();
  try{

    await this.ExchangeToolsService.removeGroupManager(this.persistedModel.group.samAccountName, samAccountName)
    let index = this.persistedModel.managers.indexOf(this.persistedModel.managers.find(c=> c.samAccountName === samAccountName));
    this.persistedModel.managers.splice(index, 1);
    this.persistedModel =JSON.parse(JSON.stringify(this.persistedModel));
    this.toastService.success("Successfully removed manager")
  } catch(e){
    window.console.log(e);
    this.toastService.error("Failed to remove group manager");
  }
  finally{
    this.spinnerService.hide();
  }
  
}
  async create() {
    this.showAddMembers = false;
    let errors = this.validate();
    if (errors.length) {
      this.toastService.error(errors.join("<br/>"));
      return;
    }

    let status = await this.performIntegrityCheck();
    
    switch (status) {
      case "REPLY_TO_IN_USE":
        this.toastService.error("Reply email must be unique");
        return;

      case "DOES_NOT_EXIST":
        await this.createSharedMailbox();
        status = await this.performIntegrityCheck();
        if (status !== "SHARED_MAILBOX_EXISTS") {
          //Failed to retrieve newly created shared mailbox
          this.toastService.error("Failed to created shared mailbox");
          return;
        }
        this.showAddMembers = true;
        break;

      case "SHARED_MAILBOX_EXISTS":
        this.toastService.success("Located shared mailbox, you may edit members");
        this.showAddMembers = true;
        break;
      case "ORPHANED_OBJECT":
        this.toastService.error("Either the mailbox or distribution group failed to create");

        break;
      default:
          this.toastService.error("Failed integrity check");
        break;
    }


  }
  async addGroupMember(){
    this.spinnerService.show();
    try{
      if(this.persistedModel.members.some(c=> c.samAccountName.toUpperCase() === this.groupMemberId.toUpperCase())){
        this.toastService.error("Member already in group");
        return;
      }
      let response = await this.ExchangeToolsService.addGroupMember(this.persistedModel.group.samAccountName,this.groupMemberId);
      this.persistedModel.members.push({id:this.groupMemberId, samAccountName: this.groupMemberId })
      this.persistedModel =JSON.parse(JSON.stringify(this.persistedModel));
      this.toastService.success("Successfully added member")
    }catch(e){
      window.console.log(e);
      this.toastService.error("Failed to add group member to list");
    }finally{
      this.spinnerService.hide();
    }
  }
  async addGroupManager(){
    this.spinnerService.show();
    try{
      if(this.persistedModel.managers.some(c=> c.samAccountName.toUpperCase() === this.groupManagerId.toUpperCase())){
        this.toastService.error("Manager already in group");
        return;
      }
      let response = await this.ExchangeToolsService.addGroupManager(this.persistedModel.group.samAccountName,this.groupManagerId);
      this.persistedModel.managers.push({id:this.groupManagerId, samAccountName: this.groupManagerId })
      this.persistedModel =JSON.parse(JSON.stringify(this.persistedModel));
      this.toastService.success("Successfully added manager")
    }catch(e){
      window.console.log(e);
      this.toastService.error("Failed to add group manager to list");
    }finally{
      this.spinnerService.hide();
    }
  }

  clear() {
    this.persistedModel = {};

    this.model = {
      department: "",
      name: "",
      displayName: "",
      replyEmail: ""
    }
  }

}