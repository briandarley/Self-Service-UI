import 'bootstrap/dist/js/bootstrap.bundle';
import injector from 'vue-inject';
import axios from 'axios';
import $ from 'jquery'
import moment from 'moment';
import _ from 'lodash';
import 'bootstrap-datepicker';
import 'daterangepicker';

import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import 'daterangepicker/daterangepicker.css';

injector.constant('axios', axios);
injector.constant('$', $);
injector.constant('moment', moment);
injector.constant('_', _);



