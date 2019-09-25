import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'office365-groups',
  dependencies: ['$', 'moment','ScreenReaderAnnouncerService']


})

export default class Office365Groups extends Vue {
  links = [];
  data = [{
      title: "Sensitive Data Policy",
      href: "https://help.unc.edu/sp?id=kb_article&sys_id=f6a7b357db43b308227afe2139961930"
    },
    {
      title: "IT Policies",
      href: "https://unc.policystat.com/policy/6875241/latest/"
    },
    {
      title: "OneDrive Documentation",
      href: "https://help.unc.edu/sp?id=kb_article&sys_id=80ec3b79db2bfb8070551ffa6896192f"
    },
    {
      title: "Course Groups (For Faculty)",
      href: "https://coursegroups.itsapps.unc.edu/#/"
    }

    
  ]
  async mounted() {
    
    this.data.forEach(c => {
      c.href = `${c.href}`;
    });

    setTimeout(() => {
      this.links = this.data;
    }, 500);

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Office 365 Groups");
  }



}