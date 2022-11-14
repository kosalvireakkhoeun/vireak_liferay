import { PortletMixin } from 'cw-vuejs-global-components/mixins/portlet.es';
import { Toast } from 'cw-vuejs-global-components/components/toast.es';
import { LoadingIndicator } from 'cw-vuejs-global-components/components/loading-indicator.es';
import { sameAs, minLength, required, email } from 'vuelidate/dist/validators.min';
import isEqual from 'lodash/isEqual';

export const GeneralSettings = () => ({
    props: {
        selectedOption: { type: Object },
        minimumPasswordLength: { type: [String,Number], required: true }
    },
    cwComponents: {
        Toast: Toast(),
        LoadingIndicator: LoadingIndicator()
    },
    mixins: [ PortletMixin ],
    data: function() {
        return {
            isLoading: false,
            isSaving: false,
            isIncorrectPassword: false,
            accountSettingOptions: this.$root.accountSettingOptions,
            canUpdatePassword: this.$root.canUpdatePassword,
            confirmVerificationCode: false,
            verificationFailed: false,
            ticketKey: '',
            verificationCode: '',
            generalSettings: {
                languageId: 'en_US',
                timezoneId: 'UTC',
                preferredDomain: '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                currentEmailAddress: '',
                newEmailAddress: '',
                canUpdateEmail: false
            },
            cloneGeneralInfo: {
                languageId: 'en_US',
                timezoneId: 'UTC',
                preferredDomain: ''
            }
        }
    },
    watch: {
        verificationCode: function() {
            if (this.verificationFailed) {
                this.verificationFailed = false;
            }
        }
    },
    computed: {
        disableSavePassword: function() {
            return !this.generalSettings.currentPassword || !this.generalSettings.newPassword
                || !this.generalSettings.confirmPassword || this.$v.$invalid;
        },
        disableSaveGeneral: function() {
            return this.cloneGeneralInfo.languageId == this.generalSettings.languageId &&
                this.cloneGeneralInfo.timezoneId == this.generalSettings.timezoneId &&
                this.cloneGeneralInfo.preferredDomain == this.generalSettings.preferredDomain;
        },
        disableSaveEmail: function() {
            return !this.generalSettings.newEmailAddress || this.$v.generalSettings.newEmailAddress.$error;
        },
        disableConfirmCodeButton: function() {
            return !this.verificationCode;
        },
        confirmButtonTitle: function() {
            return (this.isLoading || this.isSaving) ? this.translate('account.confirming') : this.translate('confirm');
        }
    },
    created: function() {
        this.fetchAccountSettings();
    },
    validations() {
        return {
            generalSettings: {
                currentPassword: { required },
                newPassword: {
                    minLength: minLength(this.minimumPasswordLength),
                    valid: function(value) {
                      return (/[A-Z]/.test(value) &&
                      /[a-z]/.test(value) &&
                      /[\d]/.test(value))
                    }
                },
                confirmPassword: { sameAs: sameAs('newPassword') },
                newEmailAddress: {
                    email
                }
            }
        }
    },
    methods: {
        fetchAccountSettings: function() {
            this.isLoading = true;
            this.getResourceService().fetch('/account_settings/fetch')
            .then(response => {
                this.isLoading = false;
                if (response.data.success) {
                    this.generalSettings = response.data.result;
                    this.onCloneGeneralInfo();
                }
            }).catch(error => {
                this.isLoading = false;
                console.log(error);
            });
        },
        saveGeneralSettings: function() {
            this.isSaving = true;
            this.getResourceService().sendFormData('/account_settings/modify', {
                languageId: this.generalSettings.languageId,
                timezoneId: this.generalSettings.timezoneId,
                preferredDomain: this.generalSettings.preferredDomain,
                saveGeneral: true,
                changedLanguage: !isEqual(this.generalSettings.languageId, this.cloneGeneralInfo.languageId)
            }).then(response => {
                this.isSaving = false;
                if (response.data.success) {
                    this.onCloneGeneralInfo();
                    this.showSuccessToast('account.general-settings-saved');
                    if(response.data.result) {
                        window.location.href = response.data.result;
                    }
                }
            }).catch(console.error);
        },
        confirmPassword: function() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            this.isSaving = true;
            this.getResourceService().sendFormData('/account_settings/confirm_password', {
                password: this.generalSettings.currentPassword
            }).then(response => {
                this.isSaving = false;
                if (response.data.success) {
                    this.isIncorrectPassword = false;
                    this.savePasswordInfo();
                } else {
                    this.isIncorrectPassword = true;
                }
            }).catch(error => {
                this.isSaving = false;
                this.isIncorrectPassword = true;
                console.error(error);
            });
        },
        savePasswordInfo: function() {
            this.isSaving = true;
            this.getResourceService().sendFormData('/account_settings/modify', {
                'current-password': this.generalSettings.currentPassword,
                'new-password': this.generalSettings.newPassword,
                savePassword: true
            }).then(response => {
                this.isSaving = false;
                if (response.data.success) {
                    this.showSuccessToast('account.password-saved');
                    this.generalSettings.currentPassword = '';
                    this.generalSettings.newPassword = '';
                    this.generalSettings.confirmPassword = '';
                    this.$nextTick(this.$v.$reset);
                } else {
                    this.showFailToast('account.password-has-not-been-saved');
                }
            }).catch(console.error);
        },
        sendVerificationCode: function() {
            this.$v.generalSettings.newEmailAddress.$touch();
            if (this.$v.generalSettings.newEmailAddress.$invalid) {
                return;
            }
            this.isSaving = true;
            if (this.ticketKey) {
                this.getResourceService().sendFormData('/general_settings/change_email/delete_ticket', {
                    ticketKey: this.ticketKey
                });
            }
            this.getResourceService().sendFormData('/general_settings/change_email/generate_send_otp', {
                email: this.generalSettings.newEmailAddress
            }).then(response => {
                this.isSaving = false;
                this.confirmVerificationCode = true;
                this.ticketKey = response.data.result;
            }).catch(console.error);
        },
        verifyConfirmationCode: function() {
            this.isSaving = true;
            this.getResourceService().sendFormData('/general_settings/change_email/confirm_code', {
                ticketKey: this.ticketKey,
                otpCode: this.verificationCode
            }).then(response => {
                this.isSaving = false;
                if (response.data.success) {
                    this.saveEmailAddress();
                } else {
                    this.verificationFailed = true;
                }
            }).catch(console.error);
        },
        saveEmailAddress: function() {
            this.isSaving = true;
            this.getResourceService().sendFormData('/account_settings/modify', {
                newEmailAddress: this.generalSettings.newEmailAddress,
                saveEmail: true
            }).then(response => {
                this.isSaving = false;
                if (response.data.success) {
                    this.showSuccessToast('account.email-saved');
                    setTimeout(() => {
                     location.reload();
                    }, 3000);
                } else {
                    this.showFailToast('account.email-unsaved');
                }
            }).catch(console.error);
        },
        onCloneGeneralInfo: function() {
            this.cloneGeneralInfo.languageId = this.generalSettings.languageId;
            this.cloneGeneralInfo.timezoneId = this.generalSettings.timezoneId;
            this.cloneGeneralInfo.preferredDomain = this.generalSettings.preferredDomain;
        },
        showSuccessToast: function(key) {
            this.$refs.toasted.show('green-checked-circle', key);
        },
        showFailToast: function(key) {
            this.$refs.toasted.show('warning-circle', key);
        }
    },
    template: `
        <div class="general-settings-holder">
            <div class="rounded-top w-100">
                <div class="d-sm-flex d-block align-items-center justify-content-between border-bottom border-bottom-style-dash pr-0 cec-pl-6 cec-py-4 cec-card__header_fix_height">
                    <span class="cec-card__title"><span class="text-uppercase">{{ translate(selectedOption.key) }}</span></span>
                </div>
            </div>
            <div class="border-bottom border-bottom-style-dash">
                <div class="cec-p-6">
                    <h1 class="font-weight-lighter m-0">{{ translate('general') }}</h1>
                    <div class="row">
                        <div class="col-12 col-sm-6 col-lg-4 cec-pt-4">
                            <label>{{ translate('language') }}</label>
                            <select class="form-control" v-model="generalSettings.languageId">
                                <option :value="language.key" v-for="language in accountSettingOptions.languages">{{ language.text }}</option>
                            </select>
                        </div>
                        <div class="col-12 col-sm-6 col-lg-4 cec-pt-4">
                            <label>{{ translate('time-zone') }}</label>
                            <select class="form-control" v-model="generalSettings.timezoneId">
                                <option :value="timezone.key" v-for="timezone in accountSettingOptions.timezones">{{ timezone.text }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6 col-lg-4 cec-pt-4" v-if="accountSettingOptions.preferredDomains.length > 1">
                            <label>{{ translate('account.preferred-domain') }}</label>
                            <select class="form-control" v-model="generalSettings.preferredDomain">
                                <option :value="preferredDomain.key" v-for="preferredDomain in accountSettingOptions.preferredDomains">{{ preferredDomain.text }}</option>
                            </select>
                        </div>
                        <div class="col-12 cec-pt-4">
                            <button :disabled="disableSaveGeneral" class="btn btn-primary" @click="saveGeneralSettings">{{ translate('save') }}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-bottom border-bottom-style-dash">
                <div class="cec-p-6">
                    <h1 class="font-weight-lighter m-0">{{ translate('account-password') }}</h1>
                    <template v-if="canUpdatePassword">
                        <div class="row">
                            <div class="col-12 col-sm-6 cec-pt-4">
                                <label>{{ translate('current-password') }}</label>
                                <input class="form-control"
                                    type="password"
                                    v-model="generalSettings.currentPassword"
                                    autocomplete="new-password"
                                />
                                <div :class="{'hide': !$v.generalSettings.currentPassword.$error }">
                                    <div class="text-danger">
                                        {{ translate('common.required.field') }}
                                    </div>
                                </div>
                                <div :class="{ 'hide': !isIncorrectPassword }">
                                    <div class="text-danger">{{ translate('incorrect-password-please-try-again') }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6 col-lg-4 cec-pt-4">
                                <label>{{ translate('new-password') }}</label>
                                <input class="form-control"
                                    type="password"
                                    v-model="generalSettings.newPassword"
                                    @blur="$v.generalSettings.newPassword.$touch()"
                                    @focus="$v.generalSettings.newPassword.$reset"
                                />
                                <div :class="{'hide': !$v.generalSettings.newPassword.$error }">
                                    <div class="text-danger">
                                        {{ translate('auth.password-must-be-at-least-x-characters-long', minimumPasswordLength) }} </br>
                                        {{ translate('password-must-at-least-one-upper-case-letter-one-lower-case-letter-one-number-and-one-special-character') }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-lg-4 cec-pt-4">
                                <label>{{ translate('confirm-new-password') }}</label>
                                <input class="form-control"
                                    type="password"
                                    v-model="generalSettings.confirmPassword"
                                    @blur="$v.generalSettings.confirmPassword.$touch()"
                                    @focus="$v.generalSettings.confirmPassword.$reset"
                                />
                                <div :class="{'hide': !$v.generalSettings.confirmPassword.$error }">
                                    <div class="text-danger">{{ translate('hook.login-portlet.password-must-match') }}</div>
                                </div>
                            </div>
                            <div class="col-12 cec-pt-4">
                                <button :disabled="disableSavePassword" class="btn btn-primary" @click="confirmPassword">{{ translate('save') }}</button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="row">
                            <div class="col-12 cec-pt-4">
                                {{ translate('password-no-update-permission') }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="border-bottom border-bottom-style-dash" v-if="generalSettings.canUpdateEmail">
                <div class="cec-p-6 text-black">
                    <h1 class="font-weight-lighter m-0">{{ translate('account.account-email') }}</h1>
                    <div class="row">
                        <div class="col-12 col-sm-6 cec-pt-4" v-html="translate('account.your-account-email-is-x', generalSettings.currentEmailAddress)"></div>
                    </div>
                    <template v-if="!confirmVerificationCode">
                        <div class="row">
                            <div class="col-12 col-sm-6 cec-pt-4">
                                <label>{{ translate('account.new-email-address') }}</label>
                                <input class="form-control"
                                    type="text"
                                    v-model="generalSettings.newEmailAddress"
                                    @blur="$v.generalSettings.newEmailAddress.$touch()"
                                    @focus="$v.generalSettings.newEmailAddress.$reset"
                                />
                                <div :class="{'hide': !$v.generalSettings.newEmailAddress.$error }">
                                    <div class="text-danger">
                                        {{ translate('please-enter-a-valid-email-address') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 cec-pt-4">
                                <button :disabled="disableSaveEmail" class="btn btn-primary" @click="sendVerificationCode">{{ translate('save') }}</button>
                            </div>
                        </div>
                    </template>
                    <template v-if="confirmVerificationCode">
                        <div class="row">
                            <div class="col-12 col-sm-6 cec-pt-4">
                                <p class="font-weight-bold">{{ translate('account.update-pending-verification') }}</p>
                                <p v-html="translate('account.verification-code-to-email-x-message', generalSettings.newEmailAddress)"></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6 cec-pt-2">
                                <label>{{ translate('account.please-enter-the-code') }}</label>
                                <input class="form-control"
                                    type="text"
                                    maxlength="6"
                                    v-model="verificationCode"
                                />
                                <div class="cec-pt-2">
                                    <span>{{ translate('account.did-not-get-it') }}</span> <a href="javascript:;" @click.prevent="sendVerificationCode">{{ translate('resend') }}</a>
                                </div>
                                <div v-if="verificationFailed" class="text-danger">
                                    {{ translate('invalid-code-please-try-again') }}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 cec-pt-4">
                                <button :disabled="disableConfirmCodeButton" class="btn btn-primary" @click="verifyConfirmationCode">{{ confirmButtonTitle }}</button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <toast
                ref="toasted"
                :timeout="5000"
                :fadeTo="false"
                css-class="justify-content-center"
                :is-full-width="true">
            </toast>
            <loading-indicator :is-loading="isLoading || isSaving" title="please-wait"></loading-indicator>
        </div>
    `
});
