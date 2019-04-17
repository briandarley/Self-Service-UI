import 'bootstrap/dist/js/bootstrap.bundle';
import injector from 'vue-inject';
import axios from 'axios';
import $ from 'jquery'
import moment from 'moment';
import _ from 'lodash';



injector.constant('axios', axios);
injector.constant('$', $);
injector.constant('moment', moment);
injector.constant('_', _);



