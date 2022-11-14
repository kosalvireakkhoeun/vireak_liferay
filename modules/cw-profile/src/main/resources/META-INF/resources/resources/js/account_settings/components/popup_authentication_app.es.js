import * as qrCodeGen from 'cw-vuejs-global-components/lib/qrcode.min'
import { PopupContainer } from 'cw-vuejs-global-components/components/pop_up.es';

const SCAN_QR_CODE = 0;
const CONFIRM_CODE = 1;

export const PopupAuthenticationApp = () => ({
    props: {
        sources: { type: Array, required: true },
        onHideShow: { type: Function, required: true },
        enable2fa: { type: Boolean }
    },
    cwComponents: {
        PopupContainer
    },
    data: function() {
        return {
            step: 0,
            isSubmitting: false,
            otpAuthUrl: '',
            showQrCodeContainer: false,
            oneTimeCode: '',
            isInvalidCode: false,
            isMobile: Liferay.Browser.isMobile()
        }
    },
    created: function() {
        this.fetchOtpAuthUrl();
    },
    computed: {
        getConfirmButtonTitle: function() {
            return this.isScanQrCode ? 'next' : 'account.2fa.authenticator-app-setup-turn-on';
        },
        isScanQrCode: function() {
            return this.step === SCAN_QR_CODE;
        },
        isConfirmCode: function() {
            return this.step === CONFIRM_CODE;
        }
    },
    methods: {
        fetchOtpAuthUrl: function() {
            this.isSubmitting = true;
            this.getResourceService().fetch('/account_settings/get_otp_auth_url')
            .then(response => {
                this.isSubmitting = false;
                if (response.data.success) {
                    this.otpAuthUrl = response.data.result;
                    new qrCodeGen.QRCode(document.getElementById('qrCodeContainer'), this.otpAuthUrl);
                    setTimeout(() => this.showQrCodeContainer = true, 100);
                }
            }).catch(error => {
                this.isSubmitting = false;
                console.log(error);
            });
        },
        onConfirmCode: function() {
            this.isSubmitting = true;
            this.getResourceService().sendFormData('/account_settings/confirm_one_time_code', {
                oneTimeCode: this.oneTimeCode,
                enable2fa: this.enable2fa
            }).then(response => {
                this.isSubmitting = false;
                if (response.data.success) {
                    this.onHideShow(true);
                }
                this.isInvalidCode = true;
            }).catch(error => {
                this.isSubmitting = false;
                console.log(error);
            });
        },
        clearAppAuthentication: function() {
            this.getResourceService().sendFormData('/account_settings/disable_app_authentication');
            this.onHideShow();
        },
        onBack: function() {
            if (this.isScanQrCode) {
                this.clearAppAuthentication();
            }
            this.step--;
            this.isInvalidCode = false;
        },
        onNext: function() {
            if (this.isConfirmCode) {
                this.onConfirmCode();
                return;
            }
            this.step++;
        },
        onInputOtp: function() {
            this.isInvalidCode = false;
        },
        download: function(url) {
            window.open(url, '_blank');
        }
    },
    template: `
        <div class="cec-popup-wrapper">
            <div class="cec-popup-container">
                <popup-container
                    css-footer-wrapper="pt-4"
                    css-popup-wrapper="cec-popup--width-500"
                    css-header-wrapper="justify-content-between">
                    <template slot="header">
                        <span class="font-size-22 text-black font-weight-lighter">{{ translate('setup-authenticator-app') }}</span>
                        <a href="javascript:;" class="btn link-icon" @click="clearAppAuthentication()">
                            <cw-svg-icon :icon-url="svgIconUrl('close')" css-class="cw-icon-sm"></cw-svg-icon>
                        </a>
                    </template>
                    <template slot="body">
                        <div class="pt-2 mb-4" :class="{'min-height-400': isScanQrCode}">
                            <template v-if="isScanQrCode">
                                <div class="my-3 mr-2 text-black">
                                    <span class="font-weight-bold text-back">{{ translate('step-1') }}</span>
                                    &nbsp;<span v-html="translate('account.2fa.install-the-google-authenticator-app-of-your-choice')" ></span>
                                </div>
                                <div class="pl-4">
                                    <div class="pb-2"><span class="font-weight-bold text-black">&#8226; {{ translate('account.2fa.free-otp') }}</span></div>
                                    <div class="pb-2"><img v-for="source in sources" :src="imageUrl(source.key)"
                                        @click="download(source.value)" class="cursor-pointer w-30"></div>
                                    <span class="font-weight-bold text-black">&#8226; {{ translate('account.2fa.google-authenticator') }}</span>
                                </div>
                                <div class="my-4 text-black">
                                    <span class="font-weight-bold text-back">{{ translate('step-2') }}</span>
                                    &nbsp;{{ translate('account.2fa.open-the-authenticator-app-of-your-choice-and-scan-the-qr-code') }}<br/>
                                    <div v-show="showQrCodeContainer" id="qrCodeContainer" :class="{'border': otpAuthUrl}" class="w-50 mt-3 p-3"></div>
                                    <a v-if="isMobile" :href="otpAuthUrl" class="mt-2 d-block">{{ translate('account.2fa.setup-on-same-device') }}</a>
                                </div>
                            </template>
                            <template v-else>
                                <div class="my-3 text-black">
                                    <span class="font-weight-bold text-back">{{ translate('step-3') }}</span>
                                    &nbsp;{{ translate('enter-the-one-time-code-provided-in-the-app') }}
                                </div>
                                <div class="text-black font-weight-bold"> {{ translate('one-time-code') }}</div>
                                <input
                                      class="otp-input mt-2 form-control h-auto"
                                      type="number"
                                      v-model="oneTimeCode"
                                      @input="onInputOtp"
                                      autofocus required
                                      onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                                </input>
                                <div v-show="isInvalidCode" class="position-relative">
                                    <span class="text-danger position-absolute">{{ translate('invalid-code-please-try-again') }}</span>
                                </div>
                                <div class="py-2"></div>
                            </template>
                        </div>
                    </template>
                    <template slot="footer">
                        <div class="w-100 d-sm-flex" :class="[isScanQrCode ? 'justify-content-end' : 'justify-content-between']">
                            <button v-if="!isScanQrCode" class="btn btn-outline-primary w-50 sm-down--width-100 mb-3 mb-sm-0 d-md-none" @click="onBack">
                                {{ translate('back') }}
                            </button>
                            <a v-if="!isScanQrCode" class="d-md-flex d-none link-icon text-black cursor-pointer rounded"
                                @click="onBack()" href="javascript:;">
                                <cw-svg-icon :icon-url="svgIconUrl('back-circle')"></cw-svg-icon>
                                {{ translate('back') }}
                            </a>
                            <button :disabled="isSubmitting" class="btn btn-primary ml-sm-3 w-50 sm-down--width-100" @click="onNext">
                                <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                {{ translate(getConfirmButtonTitle) }}
                            </button>
                        </div>
                    </template>
                </popup-container>
            </div>
        </div>
    `
});
