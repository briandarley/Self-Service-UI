import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'group-management',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'EventBus'],
  props: ['criteria', 'service','requireCriteria']

})

export default class GroupManagement extends Vue {
  entities = [];
  performedSearch = false;
  lookupEntityModel = null;
  //criteria is passed from parent
  async loadEntities(criteria) {
    
    if (!this.service) {
      throw 'Service is required'
    }

    if(this.requireCriteria)
    {
      if (!this.criteria.filterText && !this.criteria.managedBy) {
        this.toastService.error("Criteria too vague, please specify a criteria to search by");
        return;
      }
      if (!this.criteria.managedBy && this.criteria.filterText.length < 3) {
        this.toastService.error("Criteria too vague, please specify a criteria to search by");
        return;
      }
    }

    await this.getRecords(criteria);


  }

  async getRecords(criteria) {
    this.spinnerService.show();
    try {
      this.lookupEntityModel = null;
      this.entities = await this.service.getDistributionGroups(this.criteria);

      if (this.entities.length === 0 && !criteria) {
        this.toastService.warn("No records found matching criteria");
      }
      else if(this.entities.length === 0 && criteria && criteria.initialLoad)
      {
        this.toastService.warn("Attempted to load 'My Groups', but you have no groups to manage");
      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve records")
    } finally {
      this.spinnerService.hide();
      this.EventBus.emit("attach-scroll");
    }
  }

  async toggleUsers(entity) {

    let samAccountName = entity.samAccountName;

    if (entity.showUsers) {
      entity.showUsers = false;
      return;
    }

    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].samAccountName !== samAccountName) {
        this.entities[i].showUsers = false;
      }
    }


    this.spinnerService.show();

    try {

      entity.detail = await this.service.getAllDistributionGroupEntities(entity.samAccountName);
      
      entity.detail.members.sort((a, b) => {
        let item1 = a.samAccountName.toLowerCase();
        let item2 = b.samAccountName.toLowerCase();

        if (item1 < item2) return -1;
        if (item2 > item1) return 1;
        return 0;
      })

      entity.showUsers = !entity.showUsers;

      await this.rebindGrid();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve member/manager data");
    } finally {
      this.spinnerService.hide();
      this.EventBus.emit("attach-scroll");
    }

  }

  async lookupMember(groupEntity) {


    const searchTerm = groupEntity.searchMember;
    if (!searchTerm) {
      this.toastService.error("Search criteria empty, please specify a search criteria");
      return;
    }
    if (searchTerm.toUpperCase() == groupEntity.name.toUpperCase()) {
      this.toastService.error("You can't add reference to itself, silly");
      return;
    }
    this.spinnerService.show();
    try {

      let responses = await Promise.all([this.service.getExchangeUser(searchTerm), this.service.getDistributionGroup(searchTerm)])

      let exchangeUserEntity = responses[0];

      let groupEntity = responses[1];


      if (exchangeUserEntity.status !== false) {
        this.lookupEntityModel = {
          name: exchangeUserEntity.samAccountName,
          type: 'user',
          displayName: exchangeUserEntity.displayName,
          email: exchangeUserEntity.userPrincipalName,
          distinguishedName: exchangeUserEntity.distinguishedName
        };


      }
      if (groupEntity.status !== false) {
        this.lookupEntityModel = {
          name: groupEntity.name,
          type: 'group',
          displayName: groupEntity.displayName,
          email: groupEntity.primarySmtpAddress,
          totalMembers: 'processing...'
        };

        this.ExchangeToolsService.getAllDistributionGroupEntities(groupEntity.samAccountName).then(c => {
          this.lookupEntityModel.totalMembers = c.members.length;

        }).catch(() => {
          this.lookupEntityModel.totalMembers = "failed to retrieve";
        })

      }

      if (exchangeUserEntity.status === false && groupEntity.status === false) {
        this.toastService.error(`Failed to retrieve entity information for entity '${searchTerm}'`)
        return;
      }


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to locate member given criteria");
    } finally {
      this.spinnerService.hide();
    }
    //if(groupEntity.name)

  }

  async mounted() {
    this.toastService.set(this);
  }

  async rebindGrid() {
    this.entities = JSON.parse(JSON.stringify(this.entities));
  }

  async clear() {

    this.performedSearch = false;
    this.entities = [];
    
    this.lookupEntityModel = null;
    
  }

  async onManagerListLoaded() {
    
    //getDistributionGroupManagers
    //getDistributionGroupMembers
    //await this.$refs.groupManagers.populateEntities(entity);
    
  }

  async onGroupUserListLoaded() {

  }
}