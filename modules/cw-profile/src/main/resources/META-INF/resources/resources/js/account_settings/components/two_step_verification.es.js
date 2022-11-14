import { Toast } from 'cw-vuejs-global-components/components/toast.es';
import { LoadingIndicator } from 'cw-vuejs-global-components/components/loading-indicator.es';
import { PortletMixin } from 'cw-vuejs-global-components/mixins/portlet.es';
import InfoConfirmationMixin from 'cw-vuejs-global-components/mixins/info_confirmation.es';

import { StepVerificationItem } from './step_verification_item.es';
import { PopupConfirmPassword } from './popup_confirm_password.es';
import { PopupAuthenticationApp } from './popup_authentication_app.es';
import { PopupBackupCodesAuth } from './popup_backup_codes_auth.es';
import { WarningMessage } from '../../profile/components/warning_message.es';

export const TwoStepVerification = () => ({
    props: {
        selectedOption: { type: Object },
        userEmailAddress: { type: String, default: '' }
    },
    cwComponents: {
        Toast: Toast(),
        LoadingIndicator: LoadingIndicator(),
        StepVerificationItem: StepVerificationItem(),
        PopupConfirmPassword: PopupConfirmPassword(),
        PopupAuthenticationApp: PopupAuthenticationApp(),
        PopupBackupCodesAuth: PopupBackupCodesAuth(),
        WarningMessage: WarningMessage()
    },
    mixins: [
        PortletMixin,
        InfoConfirmationMixin
    ],
    data: function() {
        return {
            isLoading: false,
            isSaving: false,
            passwordConfirmed: false,
            showPopupConfirmPassword: false,
            showPopupAppAuthentication: false,
            showPopupEmailAuthentication: false,
            showPopupBackupCodeAuthentication: false,
            popupHandler: null,
            verifications: {
                enable2fa: false,
                enableAuthenticator: false,
                enableBackupCode: false,
                enableEmailVerification: false,
                tokenCount: 0,
                authenticatorAppSources: []
            },
            verificationTypeList: [],
            maxTokenLength: 3
        }
    },
    created: function() {
        this.fetchVerificationInfo();
    },
    computed: {
        getEmailButtonTitle: function() {
            return this.verifications.enableEmailVerification ? 'disable' : 'account.2fa.set-up';
        },
        getAuthenticatorButtonTitle: function() {
            return this.verifications.enableAuthenticator ? 'disable' : 'account.2fa.set-up';
        },
        getCodesButtonTitle: function() {
            return !(this.verifications.enableBackupCode ) ? 'account.2fa.get-codes' : 'disable';
        },
        activatedMethods: function() {
            return this.verificationTypeList.some(item => item.enabled);
        }
    },
    methods: {
        fetchVerificationInfo: function(isDisableToken = false) {
            this.isLoading = true;
            this.getResourceService().fetch('/account_settings/two_step_verification/fetch')
            .then(response => {
                if (response.data.success) {
                    this.verifications = JSON.parse(response.data.result);
                    if (isDisableToken && this.verifications.enableBackupCode &&
                        !this.verifications.enableAuthenticator && !this.verifications.enableEmailVerification) {
                        this.disableToken('/account_settings/disable_backup_codes_auth');
                    }
                    this.setVerificationTypeInfo();
                }
            }).finally(() => this.isLoading = false);
        },
        onPasswordConfirmationSuccess: function() {
            this.passwordConfirmed = true;
            if (this.popupHandler) {
                this[this.popupHandler]();
            }
        },
        handlePasswordConfirmationPopup: function() {
            this.showPopupConfirmPassword = !this.showPopupConfirmPassword;
        },
        handleAuthenticatorAppPopup: function() {
            this.popupHandler = "handleAuthenticatorAppPopup";
            if (!this.passwordConfirmed) {
                this.showPopupConfirmPassword = true;
                return;
            }
            if (this.verifications.enableAuthenticator) {
                this.disableToken('/account_settings/disable_app_authentication');
                return;
            }
            this.showPopupAppAuthentication = !this.showPopupAppAuthentication;
        },
        handleBackupCodePopup: function(action) {
            this.popupHandler = "handleBackupCodePopup";
            if (!this.passwordConfirmed) {
                this.showPopupConfirmPassword = true;
                return;
            }
            if (this.verifications.enableBackupCode) {
                this.disableToken('/account_settings/disable_backup_codes_auth');
                return;
            }
            this.showPopupBackupCodeAuthentication = !this.showPopupBackupCodeAuthentication;
        },
        handleEmailVerificationPopup: function() {
            this.popupHandler = "handleEmailVerificationPopup";
            if (!this.passwordConfirmed) {
                this.showPopupConfirmPassword = true;
                return;
            }
            if (this.verifications.enableEmailVerification) {
                this.disableToken('/account_settings/disable_email_authentication');
                return;
            }
            this.onEmailAuthenticationConfirmation();
        },
        handleEnable2fa: function() {
            if (this.verifications.required && this.verifications.enable2fa) return;
            this.popupHandler = "handleEnable2fa";
            if (!this.passwordConfirmed) {
                this.showPopupConfirmPassword = true;
                return;
            }
            this.isLoading = true;
            this.getResourceService().sendFormData('/account_settings/modify_2fa', {
                enable: !this.verifications.enable2fa
            }).then(response => {
                if (response.data.success) {
                    this.fetchVerificationInfo();
                } else {
                    this.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                console.error(error);
            });
        },
        showOrHidePopupAppAuthentication: function(isRefresh = false) {
            this.showPopupAppAuthentication = !this.showPopupAppAuthentication;
            if (isRefresh) {
                this.fetchVerificationInfo();
            }
        },
        showOrHidePopupBackupCodeAuthentication: function(isRefresh = false) {
            this.showPopupBackupCodeAuthentication = !this.showPopupBackupCodeAuthentication;
            if (isRefresh) {
                this.fetchVerificationInfo();
            }
        },
        disableToken: function(cmd) {
            this.isLoading = true;
            this.getResourceService().sendFormData(cmd, {
                disable2fa: this.verifications.tokenCount == 1
            }).then(response => {
                if (response.data.success) {
                    this.fetchVerificationInfo(true);
                } else {
                    this.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                console.error(error);
            });
        },
        setVerificationTypeInfo: function() {
            let verificationTypes = [
                {
                    icon: '2fa-app',
                    title: 'account.2fa.authenticator-app-title',
                    subtitle: 'account.2fa.authenticator-app-subtitle',
                    buttonTitle: this.getAuthenticatorButtonTitle,
                    enabled: this.verifications.enableAuthenticator,
                    callback: this.handleAuthenticatorAppPopup,
                    visibleButton: this.verifications.authenticatorVisibleButton
                }
            ];
            if (this.verifications.tokenCount) {
                this.$nextTick().then(() => {
                    verificationTypes.push({
                        icon: 'passcode',
                        title: 'account.2fa.backup-codes-title',
                        subtitle: 'account.2fa.backup-codes-subtitle',
                        buttonTitle: this.getCodesButtonTitle,
                        enabled: this.verifications.enableBackupCode,
                        callback: this.handleBackupCodePopup,
                        visibleButton: this.verifications.backupCodeVisibleButton
                    });
                });
            }
            verificationTypes.push({
                icon: 'verify-email',
                title: 'account.2fa.email-verification-title',
                subtitle: 'account.2fa.email-verification-subtitle',
                buttonTitle: this.getEmailButtonTitle,
                enabled: this.verifications.enableEmailVerification,
                callback: this.handleEmailVerificationPopup,
                visibleButton: this.verifications.emailVisibleButton
            });

            this.$nextTick().then(() => {
                this.verificationTypeList = verificationTypes;
            });
        },
        onEmailAuthenticationConfirmation: function() {
            this.infoConfirmation({
                title: this.translate('would-you-like-to-enable-2fa-for-your-email-x', this.userEmailAddress),
                cancelButtonText: this.translate('cancel'),
                confirmButtonText: this.translate('account.2fa.authenticator-app-setup-turn-on'),
                showConfirmButton: true,
                html: ` `
            }).then(confirmed => {
                if (confirmed) this.onEnableEmailAuthentication();
            });
        },
        onEnableEmailAuthentication: function() {
            this.isLoading = true;
            this.getResourceService().sendFormData('/account_settings/enable_email_authentication', {
                enable2fa: !this.verifications.enable2fa
            }).then(response => {
                if (response.data.success) {
                    this.fetchVerificationInfo();
                } else {
                    this.isLoading = false;
                }
            }).catch(error => {
                this.isLoading = false;
                console.log(error);
            });
        }
    },
    template: `
        <div class="step-verification-holder">
            <popup-confirm-password
                v-if="showPopupConfirmPassword"
                 :on-hide-show="handlePasswordConfirmationPopup"
                 :on-success="onPasswordConfirmationSuccess">
            </popup-confirm-password>
            <popup-authentication-app
                v-if="showPopupAppAuthentication"
                :sources="verifications.authenticatorAppSources"
                :enable2fa="!verifications.enable2fa"
                :on-hide-show="showOrHidePopupAppAuthentication">
            </popup-authentication-app>
            <popup-backup-codes-auth
                v-if="showPopupBackupCodeAuthentication"
                :on-hide-show="showOrHidePopupBackupCodeAuthentication">
            </popup-backup-codes-auth>

            <div class="rounded-top w-100">
                <div class="d-sm-flex d-block align-items-center justify-content-between border-bottom border-bottom-style-dash
                    pr-0 cec-pl-6 cec-py-4 cec-card__header_fix_height">
                    <span class="cec-card__title"><span class="text-uppercase">{{ translate(selectedOption.key) }}</span></span>
                </div>
            </div>
            <div class="border-bottom border-bottom-style-dash">
                <warning-message
                    v-if="verifications.required"
                    icon="warning-info"
                    label="your-organization-has-required-for-you-to-enable-two-step-verification-you-cannot-disable-it-on-your-own"
                    css-wrapper="cec-mt-n2 cec-mt-sm-0">
                </warning-message>
                <div class="cec-p-md-6 cec-p-4">
                    <step-verification-item
                        icon="2fa-key"
                        title="two-step-verification"
                        sub-title="account.2fa.protect-account-message"
                        :css-class="{'mb-4': verifications.tokenCount < 1 }"
                        :show-switch="true"
                        :enabled="verifications.enable2fa"
                        :visible-button="verifications.tokenCount"
                        :disabled-switch="verifications.required && verifications.enable2fa"
                        @callback="handleEnable2fa">
                    </step-verification-item>

                    <div :class="{ 'cec-mb-5' : activatedMethods }">
                        <template v-for="(verificationType, index) in verificationTypeList">
                            <step-verification-item
                                v-if="verificationType.enabled"
                                :icon="verificationType.icon"
                                :title="verificationType.title"
                                :visible-button="verificationType.visibleButton"
                                :sub-title="verificationType.subtitle"
                                :button-title="verificationType.buttonTitle"
                                :enabled="verificationType.enabled"
                                css-svg="cw-icon-3xl"
                                @callback="verificationType.callback">
                            </step-verification-item>
                        </template>
                    </div>

                    <div class="cec-mb-5" v-if="verifications.tokenCount !== maxTokenLength">
                        <span class="font-weight-lighter font-size-20 text-black">{{ translate('account.2fa.available-security-methods') }}</span>
                        <h4 class="font-weight-normal my-2">{{ translate('account.2fa.activate-second-step-sub-message') }}</h4>
                    </div>
                    <div v-for="(verificationType, index) in verificationTypeList">
                        <step-verification-item
                            v-if="!verificationType.enabled"
                            :icon="verificationType.icon"
                            :title="verificationType.title"
                            :sub-title="verificationType.subtitle"
                            :button-title="verificationType.buttonTitle"
                            :enabled="verificationType.enabled"
                            css-svg="cw-icon-3xl"
                            @callback="verificationType.callback">
                        </step-verification-item>
                    </div>
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
