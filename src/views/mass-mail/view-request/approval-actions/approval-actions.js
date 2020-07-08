import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'approval-actions',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService','UserService','MassMailCodeValueHelperService'],
  props: ['id', 'entity','codeValues']
})

export default class ApprovalActions extends Vue {
  mainDropDownVisible = false;
  currentElement = '';


  get elmId() {
    if (!this.entity) return "ac_not_set";
    return `approval_menu_${this.entity.id}`;
  }

  async mounted() {
    this.toastService.set(this);
  }
  
  get isDone() {
    if(this.entity.campaignStatus == null) return true;

    if(this.entity.campaignStatus.status === "CANCELED") return true;
    if(this.entity.campaignStatus.status === "EXPIRED") return true;
    if(this.entity.campaignStatus.status === "DONE") return true;
    if(this.entity.campaignStatus.status.indexOf("ARCHIVED") > -1) return true;

    return false;
  }

  get isCanceled() {
    if(this.entity.campaignStatus == null) return true;

    if(this.entity.campaignStatus.status === "CANCELED") return true;
    if(this.entity.campaignStatus.status.indexOf("DENIED") > -1) return true;

    return false;
  }

  get isActive() {
    if (!this.entity) return false;
    
    if(this.isCanceled) return false;
    
    const moment = this.moment;
    
    let isSameOrAfter = moment(new Date(this.entity.expirationDate)).isSameOrAfter(moment(), 'day')
    return isSameOrAfter;

  }
  get dropDownEnabled() {
    const allowedRoles = ["MASSMAIL_STUDENT_APPROVER","MASSMAIL_EMPLOYEE_APPROVER","MASSMAIL_APPROVER","MASSMAIL_ADMIN"]
    
    if(!allowedRoles.some(c=> this.UserService.isInRole(c))) return false;
    return !this.isCanceled && this.showSendNow

  }

  get showSendNow() {
    const allowedRoles = ["MASSMAIL_STUDENT_APPROVER","MASSMAIL_EMPLOYEE_APPROVER","MASSMAIL_APPROVER","MASSMAIL_ADMIN"]

    if(!allowedRoles.some(c=> this.UserService.isInRole(c))) return false;

    return !this.isCanceled && !this.isDone;
    //return !this.hasApprovals && !this.isCanceled


  }

  _getTopLevelCodeSelections() {
    //associate entities with their parents
    let values = this.entity.campaignAudienceSelections.includePopulations.map(
      (cv) => {
        let code = this.codeValues.find((c) => c.code == cv);
        return code.parent ? code.parent : code;
      }
    );
    //remove duplicates
    values = values.reduce((val, curval)=> {
      if(!val.length)
      {
        val.push(curval)
      }
      else if(!val.some(c=> c.code == curval.code)){
        val.push(curval)
      }
      return val;
    }, [])
    return values;  
   
  }


  get showStudentApproval() {
    
    if(!this.UserService.isInRole("MASSMAIL_STUDENT_APPROVER")) return false;
    if (!this.isActive) return false;
    if(this.entity.campaignStatus.status.indexOf("DENIED") > -1) return false;
    if(this.entity.campaignStatus.status.indexOf("APPROVED_STUDENTS") > -1) return false;
    if(this.entity.campaignStatus.approvedStudentsDate != null) return false;
    
    let codes = this._getTopLevelCodeSelections();

    if(!codes.some(c=> c.code === "AUDIENCE_GRP_STDNT")){
      return false
    }
    return true;
    
  }

  get showEmployeeApproval() {
    
    if(!this.UserService.isInRole("MASSMAIL_EMPLOYEE_APPROVER")) return false;
    if (!this.isActive) return false;
    if(this.entity.campaignStatus.status.indexOf("DENIED") > -1) return false;
    if(this.entity.campaignStatus.status.indexOf("APPROVED_EMPLOYEES") > -1) return false;
    if(this.entity.campaignStatus.approvedEmployeesDate != null) return false;
    
        let codes = this._getTopLevelCodeSelections();

    if(!codes.some(c=> c.code === "AUDIENCE_GRP_EMP") && !codes.some(c=> c.code === "AUDIENCE_GRP_AFL")){
      return false
    }
    return true;
    
  }
  get isApproved() {
    if(!this.entity.campaignStatus) return false;
   
    if(this.entity.campaignStatus.status === "APPROVED") return true;
    return false;
  }
  get hasApprovals() {
    if (!this.isActive) return false;
    
    return this.showStudentApproval || this.showEmployeeApproval;
  }

  view() {
    this.$emit("action", {
      action: 'view',
      entity: this.entity
    })
  }

  edit() {
    this.$emit("action", {
      action: 'edit',
      entity: this.entity
    })
  }

  cancel() {
    this.$emit("action", {
      action: 'cancel',
      entity: this.entity
    })
  }

  copy() {
    this.$emit("action", {
      action: 'copy',
      entity: this.entity
    })
  }

  history() {
    this.$emit("action", {
      action: 'history',
      entity: this.entity
    })
  }

  sendNow() {
    this.$emit("action", {
      action: 'send-now',
      entity: this.entity
    })
  }

  approve(population) {
    this._collapsAllDropDowns();
   

    this.$emit("action", {
      population: population,
      action: 'approve',
      entity: this.entity
    })
  }

  deny(population) {
    this._collapsAllDropDowns();

    this.$emit("action", {
      population: population,
      action: 'deny',
      entity: this.entity
    })
  }

  showElement(ev, element) {
    let el = this._getElement();
    //must prevent the event from bubbling, otherwise the entire menu will close when clicking
    ev.stopPropagation();
    if(this.currentElement && this.currentElement !== element)
    {
      let targetElement = `.${this.currentElement}`;
      
      el.find(targetElement).removeClass("show")
      el.find(targetElement).find('.dropdown-menu').removeClass("show")
    }

    this.currentElement = element;
    let targetElement = `.${this.currentElement}`;
    
    el
      .find(targetElement)
      .toggleClass("show");

    let isVisible = el
                      .find(targetElement)
                      .hasClass("show");
    if(isVisible)
    {
      el
        .find(targetElement)
        .find('.dropdown-menu')
        .toggleClass("show");

    }
    
  }

  _getElement() {
    const $ = this.$;
    let el = $(`#${this.elmId}`);

    return el;
  }
  
  _collapsAllDropDowns() {
    const $ = this.$;
    
    $(".approval-actions")
    .find(".show")
    .removeClass("show");

  }

  _isVisible(){
    const $ = this.$;
    return  $(`#${this.elmId}`).find('.main-dropdown').hasClass("show");
  }



}