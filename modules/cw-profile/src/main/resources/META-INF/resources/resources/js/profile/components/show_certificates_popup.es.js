import cloneDeep from 'lodash/cloneDeep';
import { PopupContainer } from 'cw-vuejs-global-components/components/pop_up.es';
import { PopUpFooter } from 'cw-vuejs-global-components/components/pop_up_footer.es';
import VisibilityDropdown from 'cw-vuejs-global-components/components/profile/visibility_dropdown.es';

export const ShowCertificatesPopup = () => ({
    props: {
        onHideShow: { type: Function, required: true },
    },
    cwComponents: {
        PopupContainer,
        PopUpFooter: PopUpFooter(),
        VisibilityDropdown: VisibilityDropdown(),
    },
    data: function() {
        return {
            certificates: cloneDeep(this.$root.$store.state.expertise.certificates),
            isSubmitting: false,
        };
    },
    computed: {
        enabledSaveButton: function() {
            return this.certificates.visibility != this.$root.$store.state.expertise.certificates.visibility
                || JSON.stringify(this.certificates.certificates) != JSON.stringify(
                    this.$root.$store.state.expertise.certificates.certificates);
        },
    },
    methods: {
        onSave: function() {
            if (!this.enabledSaveButton) {
                return;
            }
            this.isSubmitting = true;
            const params = {
                profileId: this.certificates.profileId,
                visibility: this.certificates.visibility,
                certificates: this.getUpdatedCertificates()
            };
            this.getResourceService().sendFormData('/profile/certificates/modify', {
                certificates: JSON.stringify(params)
            }).then(response => {
                const { success, result } = response.data;
                if (success) {
                    this.certificates.profileId = result;
                    Object.assign(this.$root.$store.state.expertise.certificates, this.certificates);
                    this.onHideShow();
                }
            }).finally(() => this.isSubmitting = false);
        },
        onChangeVisibility: function(visibility) {
            this.certificates.visibility = visibility;
        },
        getUpdatedCertificates: function() {
            return this.certificates.certificates.filter(certificate => {
                const c = this.$root.$store.state.expertise.certificates.certificates
                    .find(ct => ct.id == certificate.id);
                return c && c.showInProfile != certificate.showInProfile;
            }).map(certificate => {
                return {
                    id: certificate.id,
                    showInProfile: certificate.showInProfile,
                };
            });
        },
    },
    template: `
        <div class="cec-popup-wrapper">
            <div class="cec-popup-container">
                <popup-container
                    css-popup-wrapper=""
                    css-body-wrapper="mt-4"
                    css-header-wrapper="justify-content-between"
                    css-footer-wrapper="">
                    <template slot="header">
                        <span class="font-size-24 font-weight-lighter">{{ translate('certificates') }}</span>
                        <a class="btn link-icon" @click="onHideShow(false)"><cw-svg-icon :icon-url="svgIconUrl('close')" css-class="cw-icon-sm"></cw-svg-icon></a>
                    </template>
                    <template slot="body">
                        <template v-if="certificates.certificates.length">
                            <div class="table-responsive cw-table-wrapper scroll-content cec-mt-2 h-300">
                                <table class="cw-table table table-striped">
                                    <thead>
                                        <th class="table-cell-content font-style-normal w-70">
                                            <label>{{ translate('name') }}</label>
                                        </th>
                                        <th class="table-cell-content font-style-normal w-30">
                                            <div class="d-flex justify-content-center">
                                                <label>{{ translate('show-in-profile') }}</label>
                                            </div>
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="certificate in certificates.certificates" :key="certificate.id">
                                            <td class="w-70">
                                                <label class="cec-mb-0">{{ certificate.courseName }}</label>
                                                <div class="text-warning">{{ certificate.typeLabel }}</div>
                                                {{ certificate.completion }}
                                            </td>
                                            <td class="w-30 cec-px-4">
                                                <div class="d-flex justify-content-center">
                                                    <input type="checkbox" v-model="certificate.showInProfile" class="cec-mr-0">
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="cec-my-5 d-flex align-items-center">
                                <label class="cec-mb-0">{{ translate('who-can-see-this').replace('?', '') }}</label>
                                <visibility-dropdown
                                    class="cec-ml-2"
                                    :items="$root.$store.state.visibilityOption"
                                    :value="certificates.visibility"
                                    @input="onChangeVisibility"
                                    css-toggle="border-left rounded-left"
                                >
                                </visibility-dropdown>
                            </div>
                        </template>
                        <div v-else class="d-flex justify-content-center h-300 cec-my-6">
                            {{ translate('no-certificates-in-your-learning') }}
                        </div>
                    </template>
                    <template slot="footer">
                        <pop-up-footer
                            :enable-confirm-button="enabledSaveButton"
                            :is-back-circle="false"
                            :is-submitting="isSubmitting"
                            @on-confirm="onSave"
                            @on-back="onHideShow(false)"
                            back-button-title="cancel"
                            confirm-button-title="save">
                        </pop-up-footer>
                    </template>
                </popup-container>
            </div>
        </div>
    `
});
