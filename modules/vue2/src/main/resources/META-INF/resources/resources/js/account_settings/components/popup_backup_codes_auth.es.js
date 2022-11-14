import { PopupContainer } from 'cw-vuejs-global-components/components/pop_up.es';

export const PopupBackupCodesAuth = () => ({
    props: {
        onHideShow: { type: Function, required: true }
    },
    cwComponents: {
        PopupContainer
    },
    data: function() {
        return {
            isSubmitting: false,
            backupCodes: []
        }
    },
    created: function() {
        this.getBackupCodes();
    },
    methods: {
        getBackupCodes: function() {
            this.isSubmitting = true;
            this.getResourceService().fetch('/account_settings/get_backup_codes')
            .then(response => {
                this.isSubmitting = false;
                if (response.data.success) {
                    this.backupCodes = response.data.result;
                }
            }).catch(error => {
                this.isSubmitting = false;
                console.log(error);
            });
        },
        onSubmit: function() {
            if (!this.isSubmitting) {
                this.downloadBackupCodes();
                this.onHideShow(true);
            }
        },
        downloadBackupCodes: function() {
            const url = this.getUrlUtils().createResourceUrl('/account_settings/download_backup_codes', {
                params: {
                    backupCodes: this.backupCodes
                }
            });
            const link = document.createElement('a');
            link.href = url;
            link.download = "OTP Codes.pdf";
            document.body.append(link);
            link.click();
            link.remove();
        },
        clearBackupCodesAuth: function() {
            this.getResourceService().sendFormData('/account_settings/disable_backup_codes_auth');
            this.onHideShow();
        }
    },
    template: `
        <div class="cec-popup-wrapper">
            <div class="cec-popup-container">
                <popup-container
                    css-footer-wrapper="justify-content-end pt-4 cec-mr-n3"
                    css-popup-wrapper="cec-popup--width-420"
                    css-header-wrapper="justify-content-between">
                    <template slot="header">
                        <span class="font-size-22 text-black font-weight-lighter">{{ translate('save-your-backup-codes') }}</span>
                        <a href="javascript:;" class="btn link-icon" @click="clearBackupCodesAuth()">
                            <cw-svg-icon :icon-url="svgIconUrl('close')" css-class="cw-icon-sm"></cw-svg-icon>
                        </a>
                    </template>
                    <template slot="body">
                        <div class="py-4 text-black">
                            {{ translate('keep-these-backup-codes-somewhere-safe-but-accessible') }}
                            <div class="d-sm-flex flex-wrap justify-content-center border-style-dash border rounded my-4 px-5 pt-4">
                                <div v-for="backupCode in backupCodes" class="text-black font-size-20 w-50 d-inline-flex justify-content-center pb-4">
                                    {{ backupCode }}
                                </div>
                            </div>
                            <div class="text-black mb-2 font-weight-bold">{{ translate('note') }}:</div>
                            {{ translate('you-can-only-use-backup-code-once') }}
                        </div>
                    </template>
                    <template slot="footer">
                        <div class="w-100 d-sm-flex justify-content-end">
                            <button class="btn btn-outline-primary sm-down--width-100 mb-3 mb-sm-0" @click="clearBackupCodesAuth()">
                                {{ translate('cancel') }}
                            </button>
                            <button :disabled="isSubmitting" class="btn btn-primary ml-sm-3 sm-down--width-100" @click="onSubmit(isSubmitting)">
                                <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                {{ translate('download') }}
                            </button>
                        </div>
                    </template>
                </popup-container>
            </div>
        </div>
    `
});
