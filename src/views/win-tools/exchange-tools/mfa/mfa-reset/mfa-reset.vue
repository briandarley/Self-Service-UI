<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">undo</i>
        </div>
        <h1>MFA Reset</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>
                MFA Reset allows administrators to cycle the status of a user's
                Office365 MFA. The process momentarily disables MFA and
                immediately re-enables MFA for the selected account. Cycling
                Office365 MFA will require the user to re-verify their secondary
                verification for access to Office365.
              </p>
            </div>
          </div>
          <form
            @submit.prevent.prevent
            role="form"
            class="container"
            ref="searchForm"
          >
            <div class="form-group">
              <div class="label-info">
                <label for="onyen" aria-label="Enter ONYEN to lookup person"
                  >Search</label
                >
                <span class="required">Required</span>
              </div>

              <input
                type="text"
                id="onyen"
                class="form-control"
                placeholder="onyen"
                v-model="filter"
                ref="searchField"
                v-on:keyup.13="search()"
                data-validation="{'required': 'true', 'message': 'Search field required'}"
                autocomplete="off"
                v-select-all
              />
            </div>
            <div class="submit text-right">
              <button
                class="btn btn-primary mr-1"
                @click="search()"
                aria-label="Search current MFA status for user"
              >
                Search
              </button>
              <button
                class="btn btn-secondary"
                @click="clear()"
                aria-label="Clear form"
              >
                Clear
              </button>
            </div>
          </form>

          <transition name="fade">
            <div class="mt-4" v-if="resetEnabled === false || resetEnabled === true">
              <div class="container mt-4" v-if="resetEnabled === false">
                <div class="alert alert-warning">
                  <div class="info">
                    <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                  </div>
                  <div>
                    <p>
                      The account appears to have no MFA registered devices, MFA
                      reset has been disabled.
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="resetEnabled && msolUser.displayName">
                <table class="table table-condensed">
                  <caption>Account information</caption>
                  <thead class="thead-primary">
                    <tr class="">
                      <th scope="col">Display Name</th>
                      <th scope="col">E-Mail</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ msolUser.displayName }}</td>
                      <td>{{ msolUser.userPrincipalName }}</td>
                      <td class="text-danger bold">
                        <span
                          class="text-success"
                          v-if="
                            msolUser.strongAuthentication
                              .strongAuthenticationMethods
                          "
                          >Active</span
                        >
                        <span v-else>MFA Inactive</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  class="table table-condensed secondary-info table-bordered"
                >
                  <caption>Device information</caption>
                  <thead class="thead-light">
                    <tr>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Alt Number</th>
                      <th scope="col">Device Name</th>
                      <th scope="col">MFA Method</th>
                    </tr>
                  </thead>
                  <tbody class="">
                    <tr v-if="showContactMethod">
                      <td>{{ phoneNumber }}</td>
                      <td>{{ altPhoneNumber }}</td>
                      <td>{{ deviceName }}</td>
                      <td>{{ primaryMfaMethod }}</td>
                    </tr>
                    <tr v-else>
                      <td v-for="index in 4" :key="index">Not Available</td>
                    </tr>
                  </tbody>
                </table>
                <div class="submit text-center mt-4">
                <button
                  type="button"
                  class="btn btn-danger icon-button"
                  aria-label="Reset MFA for Office 365"
                  :disabled="!msolUser.strongAuthentication
                              .strongAuthenticationMethods"
                  @click="onVerifyUser()"
                >
                  <span>
                    <i data-v-1da7b41f class="material-icons" aria-hidden="true"
                      >undo</i
                    >
                  </span>
                  <span>Reset</span>
                </button>
              </div>
              </div>
              
            </div>
          </transition>
        </div>
      </div>
    </div>

    <confirm-dialog id="dlgDuoAuth" ref="dlgDuoAuth" width="800">
      <div slot="modal-title" class="modal-title text-white" v-tabindex>
        MFA Reset
      </div>
      <div slot="modal-body">
        <div class="lookup-result">
          <div class="container" v-if="!duoPreAuth.response.devices">
            <div class="alert alert-danger">
              <div class="info">
                <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
              </div>
              <h4>No registered devices</h4>
            </div>
            <div>
              <p>
                Its strongly recommended that identification confirmation be
                completed using DUO.
              </p>
              <p>
                You may proceed resetting Microsoft MFA if this option is
                unavailable.
              </p>
            </div>
          </div>
          <div v-else>
            <h4>Identity Confirmation</h4>
            <div class="container">
              <div class="text-center">
                Please confirm user's identity with the following device
              </div>
            </div>

            <!-- Waiting for user response -->
            <div
              class="container border border-light p-2"
              v-if="duoRequest.showResetStatus"
            >
              <div>
                <span class="label">
                  {{ duoRequest.message }}
                </span>
              </div>
              <div>
                <div class="d-flex m-4" style="justify-content: space-between">
                  <div
                    class="material-icons w-25 text-center"
                    style="font-size: 2em"
                  >
                    <span v-if="duoRequest.mode == 'push'">tap_and_play</span>
                    <span v-if="duoRequest.mode == 'phone'">call</span>
                    <span v-if="duoRequest.mode == 'allow'" class="text-success"
                      >check_circle</span
                    >
                    <span
                      v-if="duoRequest.mode == 'timedout'"
                      class="text-danger"
                      >timer_off</span
                    >
                    <span v-if="duoRequest.mode == 'deny'" class="text-danger"
                      >do_not_disturb</span
                    >
                  </div>

                  <div class="ml-3 w-50">
                    <div class="text-dark" style="font-size: 1.3em">
                      <span v-if="duoRequest.mode == 'push'">pushed</span>
                      <span v-if="duoRequest.mode == 'phone'">calling</span>
                      <span
                        v-if="
                          duoRequest.mode !== 'push' &&
                          duoRequest.mode !== 'phone'
                        "
                      >
                        {{ duoRequest.mode }}</span
                      >
                    </div>
                    <div class="mt-3" style="font-size: 0.8em">
                      <span v-if="duoRequest.mode == 'push'"
                        >Pushed a login request to your device</span
                      >
                      <span v-if="duoRequest.mode == 'phone'"
                        >Calling {{ selectedDevice }}</span
                      >
                      <span
                        v-if="
                          duoRequest.mode !== 'push' &&
                          duoRequest.mode !== 'phone'
                        "
                        >{{ duoRequest.message }}</span
                      >
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="clearDuoRequest()"
                      v-if="!duoRequest.callingApi"
                      aria-label="Clear request"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div class="progress" v-if="duoRequest.callingApi">
                  <div
                    class="
                      progress-bar progress-bar-striped progress-bar-animated
                    "
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :style="'width:' + width + '%'"
                    :aria-valuenow="width"
                  ></div>
                </div>
              </div>
            </div>

            <div
              class="form-group"
              v-if="
                duoPreAuth.response.devices.length > 1 &&
                duoRequest.showCapabilities
              "
            >
              <label for="select-device">Select Device</label>
              <select
                name="select-device"
                id="select-device"
                class="form-control"
                v-model="selectedDevice"
                @change="onDeviceChanged($event)"
              >
                <option
                  v-for="item in duoPreAuth.response.devices"
                  v-bind:key="item.display_name"
                >
                  {{ item.display_name }}
                </option>
              </select>
            </div>

            <div
              class="container border border-light p-2"
              v-if="currentDevice && duoRequest.showCapabilities"
            >
              <span class="label">Contact user at {{ selectedDevice }}</span>
              <div
                class="container d-flex p-2 my-3"
                style="justify-content: space-around"
              >
                <div
                  v-if="currentDevice.capabilities.some((c) => c == 'push')"
                  class="w-50 p-2"
                >
                  <button
                    type="button"
                    class="
                      btn btn-lg btn-light
                      border border-light
                      w-100
                      shadow-sm
                    "
                    @click="duoPush()"
                    aria-label="Send DUO push notification to user"
                  >
                    <div class="material-icons">system_update</div>
                    <div>Duo Push</div>
                  </button>
                </div>
                <div
                  v-if="currentDevice.capabilities.some((c) => c == 'phone')"
                  class="w-50 p-2"
                >
                  <button
                    type="button"
                    class="
                      btn btn-lg btn-light
                      border border-light
                      w-100
                      shadow-sm
                    "
                    @click="phoneCall()"
                    aria-label="Send DUO call notification to user"
                  >
                    <div class="material-icons">phone</div>
                    <div>Call Me</div>
                  </button>
                </div>
              </div>

              <div
                class="container"
                v-if="duoRequest.response && duoRequest.response.result"
              >
                <span> Status </span>
                <span class="text-danger">
                  {{ duoRequest.response.status_msg }}
                </span>
              </div>
              <div
                v-if="currentDevice.capabilities.some((c) => c == 'sms')"
                class="container border border-light p-2"
              >
                <div class="label">
                  Enter a passcode from Duo Mobile or a text
                </div>
                <transition name="fade">
                  <div
                    v-if="sendSmsNotice"
                    class="text-success"
                    :class="{
                      'text-danger':
                        sendSmsNotice === 'Failed to send SMS Request',
                    }"
                  >
                    {{ sendSmsNotice }}
                  </div>
                </transition>
                <div class="">
                  <div class="form-group form-inline mt-2">
                    <input
                      type="text"
                      class="form-control w-50"
                      placeholder="Passcode"
                      v-select-all
                      v-model="passcode"
                      aria-label="Enter a passcode from Duo Mobile"
                    />
                    <button
                      type="button"
                      class="btn btn-primary"
                      v-bind:class="{ disabled: !passcode }"
                      :disabled="!passcode"
                      @click="onEnterPassCode()"
                      aria-label="Verify passcode for user"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="onSendSmsRequest()"
                      aria-label="Send DUO SMS Pass Code request"
                    >
                      Text User
                    </button>
                  </div>

                  <div class="mt-5 d-flex justify-content-end">
                    <div>
                      <button
                        type="button"
                        class="btn btn-warning icon-button"
                        @click="bypassIdentification()"
                        aria-label="Bypass DUO notification, not recommended"
                      >
                        <span>
                          <i class="fas fa-skull-crossbones px-1"></i>
                        </span>
                        <span> Bypass Identification </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="d-flex">
        <button
          type="button"
          class="btn btn-danger icon-button"
          v-bind:class="{ disabled: !success }"
          :disabled="!success"
          aria-label="Process request to reset MFA for Office 365"
          @click="onResetMfa()"
        >
          <span>
            <i class="material-icons" aria-hidden="true">undo</i>
          </span>
          <span>Reset MFA</span>
        </button>

        <button
          type="button"
          class="btn btn-secondary"
          @click="onCloseDuoAuth()"
        >
          close
        </button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./mfa-reset.js"></script>
<style lang="scss" src="./mfa-reset.scss" scoped></style>
