import {
  Component
} from "vue-property-decorator";
import {
  BaseValidateMixin
} from '../../../../components/mixins/index';



@Component({
  name: 'shared-mailbox',
  dependencies: ['$' ]

})
export default class SharedMailbox extends BaseValidateMixin {
  

}