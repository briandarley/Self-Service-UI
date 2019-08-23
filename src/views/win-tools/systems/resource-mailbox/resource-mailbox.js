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
export default class ResourceMailbox extends BaseValidateMixin {
  organizationalUnits = [];
  groupId = "";
  model = {
    department: "",
    name: "",
    displayName: "",
    
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
      return;
    }
    this.model.name = newvalue.replace(/[^a-zA-Z0-9_-]/g, '');
    
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
  async getAllDistributionGroupEntities() {

    try {
      let samAccountName = `${this.model.department}_${this.model.name}.dg`
      let entities = await this.ExchangeToolsService.getAllDistributionGroupEntities(samAccountName);

      return entities;

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve distribution group");
      return null;
    }

  }
  async getSharedMailbox() {

    try {
      let samAccountName = `${this.model.department}_${this.model.name}.rmb`
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
        this.getAllDistributionGroupEntities()])

      if (!values[0] || !values[1] || !values[2]) {
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
        this.persistedModel.members = values[2].members;
        this.persistedModel.managers = values[2].managers;
        
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
        //ResourceMailbox
        mailboxType: 2
      }

      this.responseModel = await this.ExchangeToolsService.createSharedMailbox(model);

      

      this.toastService.success("Successfully created shared mailbox");


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to create shared mailbox");

    } finally {
      this.spinnerService.hide();
    }
  }
  

  async create() {
    this.groupId = `${this.model.department}_${this.model.name}.dg`
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
  
  clear() {
    this.persistedModel = {};

    this.model = {
      department: "",
      name: "",
      displayName: "",
      replyEmail: ""
    }
  }




    //Notfication when control is loaded
    async onMemberListLoaded() {

      if (this.showAddMembers && this.persistedModel.members.length) {
        await this.$refs.groupMembers.populateEntities(this.persistedModel);
      }
  
    }
    //Notfication when control is loaded
    async onManagerListLoaded(){
      if (this.showAddMembers && this.persistedModel.managers.length) {
        await this.$refs.groupManagers.populateEntities(this.persistedModel);
      }
    }
  
    onGroupRetrieveFailed(groupId) {
      this.toastService.error(`Failed to retrieve group with id ${groupId}`)
    }
    
    onGroupManagerRetrieveFailed(groupId){
      this.toastService.error(`Failed to retrieve group managers with id ${groupId}`)
    }
    
}