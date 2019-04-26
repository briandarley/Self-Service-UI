<template>
  <div class="container">
    <div class="alert alert-info">
      <div class="info">
        <i class="fa fa-info-circle"></i>
      </div>
      <p>Enter the user's Onyen to retrieve the current MFA status for the selected user.</p>
      <p>
        Toggle MFA Exempt status to enable/disable the selected user's MFA status, select an exemption end date (Default is 7 days).
        If you choose not to specify a date, the exemption status will be considered indefinitely. You'll then need to enter an incident number along with a reason for auditing purposes.
      </p>
    </div>

    <div class="form-group">
      <label for>Search</label>
      <input type="text" class="form-control" v-select-all placeholder="onyen" v-model="filter">
    </div>
    <div class="submit text-right" :class="{'mb-5': !mfaAccountStatus}">
      <button class="btn btn-primary mr-1" @click="search()">Search</button>
      <button class="btn btn-secondary" @click="clear()">Clear</button>
    </div>
    <transition name="fade">
      <div
        class="mfa-user-status-results"
        v-if="mfaAccountStatus"
        :class="{'mb-5': mfaAccountStatus.mfaEnabled}"
      >
        <div class="bg-primary text-white row-header">
          <div class="col">PID</div>
          <div class="col">Display Name</div>
          <div class="col text-center">Enabled</div>
          <div class="col" v-if="mfaExemptBeginDate">Exempt Begin</div>
          <div class="col" v-if="mfaExemptEndDate">Exempt Expiry</div>
          <div class="col">Status</div>
        </div>
        <div class="result-grid">
          <div class="row">
            <div class="col">{{mfaAccountStatus.pid}}</div>
            <div class="col">{{mfaAccountStatus.displayName}}</div>
            <div class="col text-center fa-2x">
              <i class="fa fa-check text-primary" v-if="mfaAccountStatus.mfaEnabled"></i>
              <i class="fa fa-times-circle-o text-warning" v-else></i>
            </div>
            <div class="col text-center" v-if="mfaExemptBeginDate">{{mfaExemptBeginDate}}</div>
            <div class="col text-center" v-if="mfaExemptEndDate">{{mfaExemptEndDate}}</div>
            <div class="col">
              <toggle-switch :value.sync="mfaAccountStatus.enabled" :label="label"></toggle-switch>
            </div>
          </div>
        
          <div class="mfa-method" v-if="showContactMethod">
            <p>
              <span class="text-primary">* Last Updated {{mfaMethodType.createDate | formatDate}}</span>
            </p>
            <div>
              <label>Phone Number</label>
              <span>{{mfaMethodType.phoneNumber}}</span>
            </div>
            <div>
              <label>Alt Number</label>
              <span>{{mfaMethodType.alternativePhoneNumber}}</span>
            </div>
            <div>
              <label>Device Name</label>
              <span>{{mfaMethodType.deviceName}}</span>
            </div>
            <div>
              <label for>MFA Method</label>
              <span>{{mfaMethodType.methodType}}</span>
            </div>
          </div>
          <div class="mfa-method" v-else>
            <p>
              <span class="text-primary">* Last Updated {{mfaMethodType.createDate | formatDate}}</span>
            </p>
            <div>
              <label>Phone Number</label>
              <span>Not Available</span>
            </div>
            <div>
              <label>Alt Number</label>
              <span>Not Available</span>
            </div>
            <div>
              <label>Device Name</label>
              <span>Not Available</span>
            </div>
            <div>
              <label for>MFA Method</label>
              <span>Not Available</span>
            </div>
          </div>
        </div>

        <div
          class="mfa-end-date text-primary my-5 border border-primary"
          v-if="mfaRequireExemptionPeriod"
        >
          <div class="alert alert-info">
            <h4 class="text-center">Select MFA exemption period</h4>
          </div>

          <div class="mfa-end-date-select">
            <div
              class="mfa-end-date-7-day"
              title="Set default 7 day extension"
              @click="showConfirm7Day()"
            >
              <span>7 Day Ext</span>
              <div>
                <i class="fa fa-calendar-week"></i>
              </div>
            </div>
            <div
              class="mfa-end-date-range"
              title="Specify date range"
              @click="showConfirmDateRangeDlg()"
            >
              <span>Date Range</span>
              <div>
                <i class="fa fa-calendar-alt"></i>
              </div>
            </div>
            <div
              class="mfa-end-date-pick-date"
              title="Select expiration date"
              @click="showConfirmIndefiniteDlg()"
            >
              <span>Pick Date</span>
              <div>
                <i class="fa fa-calendar-check"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <confirm-dialog id="confirm7day" ref="confirm7day" width="800">
      <div slot="modal-title">Enable MFA Date</div>
      <div slot="modal-body" v-if="showConfirm7day">
        <div class="container">
          <div class="alert alert-info p-10">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <p class="mt-3 mb-4">
              Leave '
              <strong>Exempt End Date</strong>' blank to indefinitely disable MFA or enter a date in which MFA restrictions should be automatically applied.
            </p>
          </div>
          <form @submit.prevent.prevent class="container validation-form" autocomplete="off">
            <div class="form-group">
              <label>Exempt End Date</label>
              <date-picker
                :selected-date.sync="model.selectedMfaDate"
                minDate="today"
                ref="dtSelectedMfaDate"
                v-validate="'required'"
                data-validation="{'name': 'Date Required','required': false}"
              ></date-picker>
            </div>
            <div class="form-group">
              <label for="txtIncidentNumber">Incident Number</label>
              <input
                type="text"
                class="form-control"
                name="incident_number"
                placeholder="incident number"
                id="txtIncidentNumber"
                ref="txtIncidentNumber"
                v-validate="'required'"
                v-model="model.incidentNumber"
                data-validation="{'name': 'Incident Number','required': true}"
              >
            </div>
            <div class="form-group">
              <label for>Reason</label>
              <textarea
                class="form-control"
                rows="4"
                cols="50"
                placeholder="reason"
                id="txtReason"
                ref="txtReason"
                v-validate="'required'"
                v-model="model.reason"
                data-validation="{'name': 'Reason','required': true}"
              ></textarea>
            </div>
            <br>
          </form>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="submitMfaChange()">yes</button>
        <button class="btn btn-secondary" @click="cancelMfaChange()">cancel</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmDateRange" ref="confirmDateRange" width="800">
      <div slot="modal-title">Enable MFA Date (Date Range)</div>
      <div slot="modal-body" v-if="showConfirmDateRange">
        <div class="container">
          <div class="alert alert-info p-10">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <div>
              <p class="mt-3 mb-4">
                Specify Date Range in which MFA should be disabled for the account.
                The begining date will be the date in which MFA will be disabled, while the last date will be the end of the exemption period.
              </p>
              <p>
                To pick a date range select the first day of the exemption period, the last day of the exemption period, finally select
                <strong
                  class="strong"
                >'Apply'</strong> button.
              </p>
            </div>
          </div>
          <form @submit.prevent.prevent class="container validation-form" autocomplete="off">
            <div class="form-group">
              <label>Exempt End Date</label>
              <date-picker
                :selected-date.sync="model.selectedMfaDate"
                dateRange="true"
                ref="dtSelectedMfaDate2"
                v-validate="'required'"
                data-validation="{'name': 'Date Required','required': false}"
              ></date-picker>
            </div>
            <div class="form-group">
              <label for="txtIncidentNumber">Incident Number</label>
              <input
                type="text"
                class="form-control"
                name="incident_number"
                placeholder="incident number"
                id="txtIncidentNumber"
                ref="txtIncidentNumber2"
                v-validate="'required'"
                v-model="model.incidentNumber"
                data-validation="{'name': 'Incident Number','required': true}"
              >
            </div>
            <div class="form-group">
              <label for>Reason</label>
              <textarea
                class="form-control"
                rows="4"
                cols="50"
                placeholder="reason"
                id="txtReason"
                ref="txtReason2"
                v-validate="'required'"
                v-model="model.reason"
                data-validation="{'name': 'Reason','required': true}"
              ></textarea>
            </div>
            <br>
          </form>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="submitMfaChange()">yes</button>
        <button class="btn btn-secondary" @click="cancelMfaChange()">cancel</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmIndefinite" ref="confirmIndefinite" width="800">
      <div slot="modal-title">Enable MFA Date</div>
      <div slot="modal-body" v-if="showConfirmIndefinite">
        <div class="container">
          <div class="alert alert-info p-10">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <p class="mt-3 mb-4">
              Leave '
              <strong>Exempt End Date</strong>' blank to indefinitely disable MFA or enter a date in which MFA restrictions should be automatically applied.
            </p>
          </div>
          <form @submit.prevent.prevent class="container validation-form" autocomplete="off">
            <div class="form-group">
              <label>Exempt End Date</label>
              <date-picker :selected-date.sync="model.selectedMfaDate" minDate="today"></date-picker>
            </div>
            <div class="form-group">
              <label for="txtIncidentNumber">Incident Number</label>
              <input
                type="text"
                class="form-control"
                name="incident_number"
                placeholder="incident number"
                id="txtIncidentNumber"
                ref="txtIncidentNumber3"
                v-validate="'required'"
                v-model="model.incidentNumber"
                data-validation="{'name': 'Incident Number','required': true}"
              >
            </div>
            <div class="form-group">
              <label for>Reason</label>
              <textarea
                class="form-control"
                rows="4"
                cols="50"
                placeholder="reason"
                id="txtReason"
                ref="txtReason3"
                v-validate="'required'"
                v-model="model.reason"
                data-validation="{'name': 'Reason','required': true}"
              ></textarea>
            </div>
            <br>
          </form>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="submitMfaChange()">yes</button>
        <button class="btn btn-secondary" @click="cancelMfaChange()">cancel</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmEnableMfa" ref="confirmEnableMfa">
      <div slot="modal-title">Enable MFA</div>
      <div slot="modal-body">
        <div class="container" v-if="showConfirmEnableMfa">
          <div class="alert alert-info p-10">
            <div class="info">
              <i class="fa fa-exclamation-triangle"></i>
            </div>
            <p
              class="mt-3 mb-4"
            >Would you like to Enable MFA for {{this.mfaAccountStatus.displayName}} at this time?</p>
          </div>

          <br>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="enableMfa()">yes</button>
        <button class="btn btn-secondary" @click="cancelEnableMfa()">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./mfa-modify-account.js"></script>
<style lang="scss" src="./mfa-modify-account.scss" scoped></style>
