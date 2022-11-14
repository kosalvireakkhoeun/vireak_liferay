import { PopupContainer } from 'cw-vuejs-global-components/components/pop_up.es';

export const PopupConfirmPassword = () => ({
    props: {
        onHideShow: { type: Function, required: true },
        onSuccess: { type: Function, required: true }
    },
    watch: {
        password: function() {
            this.isIncorrectPassword = false;
        }
    },
    cwComponents: {
        PopupContainer
    },
    data: function() {
        return {
            isSubmitting: false,
            isIncorrectPassword: false,
            password: ''
        }
    },
    methods: {
        onSubmit: function() {
            this.isSubmitting = true;
            this.getResourceService().sendFormData('/account_settings/confirm_password', {
                password: this.password
            }).then(response => {
                this.isSubmitting = false;
                if (response.data.success) {
                    this.$nextTick(this.onSuccess);
                    this.onHideShow();
                } else {
                    this.isIncorrectPassword = true;
                }
            }).catch(error => {
                this.isSubmitting = false;
                this.isIncorrectPassword = true;
                console.error(error);
            });
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
                        <span class="font-size-22 text-black font-weight-lighter">{{ translate('identity-confirmation') }}</span>
                        <a href="javascript:;" class="btn link-icon" @click="onHideShow()">
                            <cw-svg-icon :icon-url="svgIconUrl('close')"></cw-svg-icon>
                        </a>
                    </template>
                    <template slot="body">
                        <div class="py-4 my-1 text-black">
                            {{ translate('please-enter-your-account-password') }}
                            <input type="password" v-model="password" class="form-control mt-2" autocomplete="new-password" @keydown.enter="onSubmit">
                            <div v-show="isIncorrectPassword" class="position-relative">
                                <span class="text-danger position-absolute">{{ translate('incorrect-password-please-try-again') }}</span>
                            </div>
                        </div>
                    </template>
                    <template slot="footer">
                        <div class="w-100 d-sm-flex justify-content-end">
                            <button class="btn btn-outline-primary sm-down--width-100 mb-3 mb-sm-0" @click="onHideShow()">
                                {{ translate('cancel') }}
                            </button>
                            <button :disabled="isSubmitting" class="btn btn-primary ml-sm-3 sm-down--width-100" @click="onSubmit">
                                <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                {{ translate('confirm') }}
                            </button>
                        </div>
                    </template>
                </popup-container>
            </div>
        </div>
    `
});
