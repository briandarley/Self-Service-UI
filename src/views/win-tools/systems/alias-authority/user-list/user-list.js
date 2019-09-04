import Vue from "vue"

import {
  Component,
  Watch
} from "vue-property-decorator";
import Criteria from '../criteria/criteria.vue';

@Component({
  name: 'user-list',
  dependencies: ['$', '_', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService'],
  components: {
    Criteria
  }
})

export default class UserList extends Vue {
  aliasManagers = [];
  aliasDomains = [];
  availableDomains = [];
  _originalAvailableDomains = [];
  domainFilter = null;
  addAliasManagerOnyen = null;
  criteria = {
    index: 0,
    pageSize: 10,
    uid: null,
    domainName: null

  };
  pagedRecords = {};
  selectAll = false;

  @Watch("domainFilter")
  onDomainFilterChanged() {
    this.selectAll = false;
  }


  filterAvailableDomains() {
    if (!this.domainFilter) {
      return this.availableDomains;
    }
    return this.availableDomains.filter(c => c.name.toUpperCase().indexOf(this.domainFilter.toUpperCase()) > -1);
  }

  selectAllClick() {
    this.selectAll = !this.selectAll;
    if (!this.domainFilter) {
      this.availableDomains.map(c => {
        c.checked = this.selectAll;
        return c;
      })
      return;
    } else {
      this.availableDomains.filter(c => c.name.toUpperCase().indexOf(this.domainFilter.toUpperCase()) > -1).map(c => {
        c.checked = this.selectAll;
        return c;
      })
      return;
    }

  }

  async mounted() {
    this.toastService.set(this);
    await this.getAliasDomains();
    await this.getAliasManagers();
    
  }
  _expandedAdminAlias = null;
  toggleShowDomains(entity) {

    //if (!entity.aliasDomains.length) {
    //  entity.expanded = false;
    //} else {
    //  
    //}
    entity.expanded = !entity.expanded;
    this._expandedAdminAlias = entity;


    for (let i = 0; i < this.pagedRecords.entities.length; i++) {
      if (this.pagedRecords.entities[i].uid != entity.uid) {
        this.pagedRecords.entities[i].expanded = false;
      }
    }
    this.pagedRecords = JSON.parse(JSON.stringify(this.pagedRecords));
  }

  sortChildren(children) {
    const _ = this._;
    return _.orderBy(children, 'name', 'asc');
  }

  async getAliasDomains() {
    try {
      this.spinnerService.show();

      let aliasDomains = await this.ExchangeToolsService.getAliasDomains();

      this.aliasDomains = aliasDomains;

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to load alias domains');
    } finally {
      this.spinnerService.hide();
    }
  }
  async getAliasManagers() {
    try {
      this.spinnerService.show();
      let pagedRecords = await this.ExchangeToolsService.getAliasManagers(this.criteria);

      this.pagedRecords = JSON.parse(JSON.stringify(pagedRecords));

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve alias managers');
    } finally {
      this.spinnerService.hide();
    }
  }

  async onConfirmAddDomainClick() {
    try {
      this.spinnerService.show();

      let aliasManager = null;
      let deleteDomains = [];
      let addDomains = []
      let uid;
      for (let i = 0; i < this._originalAvailableDomains.length; i++) {
        let entity = this._originalAvailableDomains[i];

        let changeEntity = this.availableDomains.filter(c => c.id == entity.id)[0];


        if (changeEntity.checked != entity.checked) {
          let domainId = entity.id;
          uid = this._expandedAdminAlias.uid;
          aliasManager = this.pagedRecords.entities.find(c => c.uid === uid);
          if (!changeEntity.checked) {
            //remove domain for user
            deleteDomains.push(domainId);
            let index = aliasManager.aliasDomains.findIndex(c => c.id === domainId);
            aliasManager.aliasDomains.splice(index, 1);
          } else {
            //add domain for user 
            addDomains.push(domainId);
            let domain = this.aliasDomains.find(c => c.id === domainId);
            aliasManager.aliasDomains.push(domain)
          }

        }

      }


      let updating = false;
      let promises = [];
      if (deleteDomains.length) {
        updating = true;
        promises.push(this.ExchangeToolsService.removeAliasManager(deleteDomains, uid))

      }
      if (addDomains.length) {
        updating = true;
        promises.push(this.ExchangeToolsService.addAliasManager(addDomains, uid))
      }

      if (updating) {
        await Promise.all(promises);


        this.toastService.success(`Successfully updated admin aliases for user ${uid}`);

      }

      this.$refs.confirmAddDomain.hide();

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to update admin aliases');
    } finally {
      this.spinnerService.hide();
    }


  }

  
  async onConfirmAddAliasManagerClick() {
    try {
      this.spinnerService.show();
      //verify if admin user already exits
      //addAliasManagerOnyen
      let pagedResponse = await this.ExchangeToolsService.getAliasManagers({uid: this.addAliasManagerOnyen})
      if(pagedResponse.entities.length)
      {
        this.toastService.error("User already listed as an alias manager");
        this.$refs.confirmAddUser.hide();
        return;
      }
      this.pagedRecords.entities.unshift({uid: this.addAliasManagerOnyen, aliasDomains: []});

      this.addAliasManagerOnyen = null;
      this.$refs.confirmAddUser.hide();

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to add alias manager');
    } finally {
      this.spinnerService.hide();
    }
  }
  onCancelConfirmClick() {

    this.addAliasManagerOnyen = null;
    this.$refs.confirmAddUser.hide();
  }

  addAliasManager() {
    //addAliasManagerOnyen
    this.$refs.confirmAddUser.show();
  }


  onCancelConfirmClick() {
    this._expandedAdminAlias = null;
    this.availableDomains = [];
    this._originalAvailableDomains = [];
    this.domainFilter = null;
    this.selectAll = false;
    this.$refs.confirmAddDomain.hide();
  }
  async indexChanged(index) {
    this.criteria.index = index;
    await this.getAliasManagers();
  }

  async onSearch(criteria) {
    this.criteria = criteria;
    this.criteria.index = 0;
    this.criteria.pageSize = 10;

    await this.getAliasManagers();
  }

  async removeChild(item, child) {
    try {
      this.spinnerService.show();

      await this.ExchangeToolsService.removeAliasManager([child.id], item.uid);

      let aliasManager = this.pagedRecords.entities.find(c => c.uid === item.uid);

      let index = aliasManager.aliasDomains.findIndex(c => c.id === child.id);

      aliasManager.aliasDomains.splice(index, 1);

      this.pagedRecords = JSON.parse(JSON.stringify(this.pagedRecords));

      this.toastService.success(`Successfully removed domain user ${item.uid}`);



    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to remove domain for alias manager');
    } finally {
      this.spinnerService.hide();
    }
  }

  showAddDomain(entity) {
    const _ = this._;

    let currentAssigned = entity.aliasDomains.map(c => c.name);
    let allDomains = this.aliasDomains.map(c => c.name);

    this.availableDomains = JSON.parse(JSON.stringify(this.aliasDomains))
      .map(c => {
        c.checked = false;
        return c;
      });

    let uniqueList = _.intersection(currentAssigned, allDomains); //_.uniq();

    this.availableDomains.filter(c => uniqueList.indexOf(c.name) > -1).map(c => {
      c.checked = true;
      return c;
    })
    this._originalAvailableDomains = JSON.parse(JSON.stringify(this.availableDomains));






    this.$refs.confirmAddDomain.show();



  }
}