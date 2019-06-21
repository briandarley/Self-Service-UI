import Vue from "vue"
import {  Component} from "vue-property-decorator";
import Spinner from '@/components/spinner/spinner.vue';

@Component({
  name: 'user-list-management',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService'],
  components: {
    Spinner
  },
  props: ['group', 'headerLabels']
})

export default class UserListManagement extends Vue {
  userId = "";
  entities = [];
  lookupEntityModel = {};
  multipleRecords = false;
  groupListResult = [];
  selectedGroup = null;
  
  isGroup = false;

  async populateEntities(parentGroup){
    this.lookupEntityModel = {
      name: parentGroup.group.name,
      samAccountName: parentGroup.group.samAccountName,
      type: 'group',
      displayName: parentGroup.group.displayName,
      email: parentGroup.group.primarySmtpAddress
      
    };


    this.entities = parentGroup.members;
  }


  async removeEntity(samAccountName) {
    try {
      this.showSpinner();

      await this.ExchangeToolsService.removeMember(this.group, samAccountName);
      this.entities = this.entities.filter(c => c.samAccountName !== samAccountName);
      this.$emit('entityRemoved', samAccountName);
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to remove entity');
    } finally {
      this.hideSpinner();
    }
  }


  showDialog() {
    if (!this.$refs.confirmAddEntity) return;
    this.$refs.confirmAddEntity.show();
  }
  hideDialog() {
    if (!this.$refs.confirmAddEntity) return;
    this.$refs.confirmAddEntity.hide();
  }

  selectGroup() {
    this.isGroup = true;
    this.multipleRecords = false;
    this.lookupGroupDetails(this.selectedGroup)
  }

  lookupGroupDetails(groupEntity) {


    this.lookupEntityModel = {
      name: groupEntity.name,
      samAccountName: groupEntity.samAccountName,
      type: 'group',
      displayName: groupEntity.displayName,
      email: groupEntity.primarySmtpAddress,
      totalMembers: 'processing...'
    };


    return this.ExchangeToolsService
      .getDistributionGroupMembers(groupEntity.samAccountName)
      .then(c => {
        this.lookupEntityModel.totalMembers = c.members.length;
        return c.members;
      }).catch(e => {
        this.lookupEntityModel.totalMembers = "failed to retrieve";
      });
  }


  async onLookupMember() {
    let userId = this.userId;
    this.selectedGroup = null;
    this.multipleRecords = false;
    this.isGroup = false;

    if (!userId) {
      this.toastService.error("Search criteria empty, please specify a search criteria");
      return;
    }
    if (userId.toUpperCase() == this.group.toUpperCase()) {
      this.toastService.error("You can't add reference to itself, silly");
      return;
    }

    try {

      this.spinnerService.show();
      let responses = await Promise.all([
        this.ExchangeToolsService.getExchangeUser(userId),
        this.ExchangeToolsService.getDistributionGroups({
          filterText: userId
        })
      ]);

      let exchangeUserEntity = responses[0];
      let groupEntity = responses[1];


      if (exchangeUserEntity.status !== false) {
        this.lookupEntityModel = {
          name: exchangeUserEntity.samAccountName,
          samAccountName: exchangeUserEntity.samAccountName,
          type: 'user',
          displayName: exchangeUserEntity.displayName,
          email: exchangeUserEntity.userPrincipalName,
          distinguishedName: exchangeUserEntity.distinguishedName
        };
        this.showDialog();
      } else if (groupEntity.status !== false && groupEntity.length > 0) {
        if (groupEntity.length == 1) {
          this.selectedGroup = groupEntity[0];
          this.isGroup = true;
          this.multipleRecords = false;
          this.lookupGroupDetails(this.selectedGroup);
        } else {
          this.selectedGroup = groupEntity[0];
          this.multipleRecords = true;
          this.groupListResult = groupEntity;
        }

        this.showDialog();


      }

      if (exchangeUserEntity.status === false && (groupEntity.status === false || groupEntity.length === 0)) {
        this.toastService.error(`Failed to retrieve entity information for entity '${userId}'`)
        return;
      }


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to locate member given criteria");
    } finally {
      this.spinnerService.hide();
    }


  }
  async addMemberToGroup(entity, recursive) {

    try {
      this.showSpinner();

      if (!recursive) {
        await this.ExchangeToolsService.addGroupMember(this.group, entity.samAccountName);
      } else {
        await this.ExchangeToolsService.addGroupMember(this.group, entity.samAccountName, recursive);
      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add member to group");
    } finally {
      this.hideSpinner();
    }
  }
  async onConfirmAddMemberClick() {
    try {
      this.showSpinner();
      this.hideDialog();
      //isGroup if group, add recursively?
      //then if recursive, iterate through entire groop
      if (this.lookupEntityModel.type === 'group' && this.lookupEntityModel.recursive) {
        
        let distributionGroupMembers = await this.ExchangeToolsService.getDistributionGroupMembers(this.lookupEntityModel.samAccountName, this.lookupEntityModel.recursive)
        let members = distributionGroupMembers.members;
        
        await this.addMemberToGroup(this.lookupEntityModel, this.lookupEntityModel.recursive);

        this.entities.push({samAccountName: this.lookupEntityModel.samAccountName})

        for (let i = 0; i < members.length; i++) {
          this.entities.push(members[i]);
        }
        
        this.$emit('entitiesAdded', members);
        
        this.toastService.success("Successfully added entity to group");
        
        return;
      }
      if (this.entities.some(c => c.samAccountName === this.lookupEntityModel.samAccountName)) {
        this.toastService.error("Entity is already a member of group")
        return;
      }
      this.addMemberToGroup(this.lookupEntityModel);
      this.entities.push(this.lookupEntityModel);

      this.toastService.success("Successfully added entity to group");
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add members to group");
    } finally {
      this.hideSpinner();
    }
  }
  onCancelConfirmClick() {
    this.hideDialog();
  }
  showSpinner() {
    if (!this.$refs.spinner) return;
    this.$refs.spinner.showSpinner();
  }
  hideSpinner() {
    if (!this.$refs.spinner) return;
    this.$refs.spinner.hideSpinner();
  }
  toggleSpinner() {
    if (!this.$refs.spinner) return;
    this.$refs.spinner.toggleSpinner();
  }
  onClear() {
    this.userId = "";
  }
  
  async mounted() {
    
    this.toastService.set(this);
    this.$emit('controlLoaded');
    
  }
}