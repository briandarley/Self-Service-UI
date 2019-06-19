import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'office365-groups',
  dependencies: ['$', 'moment']


})

export default class Office365Groups extends Vue {
  links = [];
  data = [{
      title: "Sensitive Data Policy",
      href: "https://help.unc.edu/help/what-is-sensitive-data/"
    },
    {
      title: "IT Policies",
      href: "https://its.unc.edu/about-us/how-we-operate/"
    },
    {
      title: "OneDrive Documentation",
      href: "https://help.unc.edu/help/office-365-user-guide/"
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
  }



}