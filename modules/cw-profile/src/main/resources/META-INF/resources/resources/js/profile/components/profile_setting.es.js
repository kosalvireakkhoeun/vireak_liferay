import { ToggleButton } from 'cw-vuejs-global-components/components/toggle_button.es';

export const ProfileSetting = () => ({
    data: function () {
        return {
            profileSetting: {
                visibleToCrosswired: true,
                visibleToMyOrganization: false,
                visibleOrgProfileToMyOrganization: true
            },
            isLoading: true,
        }
    },
    mounted: function () {
        this.getGlobalSearchSetting()
    },
    computed: {
        isUserPartOfAnyOrg: function() {
            const { organizations } = this.$store.state;
            return organizations && organizations.length;
        }
    },
    methods: {
        getGlobalSearchSetting: function() {
            this.getResourceService().fetch('/profile/setting/fetch').then(response => {
                if (response.data.success) {
                    this.profileSetting = JSON.parse(response.data.result);
                }
                this.isLoading = false;
            }).catch(error => {
                this.isLoading = false;
                console.log(error)
            });
        },
        onVisibleToCrosswiredChange: function(value) {
            if (value) {
                this.profileSetting.visibleToMyOrganization = false;
            }
            this.update('GLOBAL_SEARCH_IS_CROSSWIRED', this.profileSetting.visibleToCrosswired);
        },
        onVisibleToMyOrganizationChange: function(value) {
            this.update('GLOBAL_SEARCH_IS_MY_ORGANIZATION', this.profileSetting.visibleToMyOrganization);
        },
        update: function(field, value) {
            this.getResourceService().sendFormData('/profile/setting/modify', {
                name: field,
                checked: value,
            }).then(response => {
                if (response.data.success) {
                    this.$emit('on-success');
                }
            }).catch(console.error);
        }
    },
    cwComponents: {
        ToggleButton: ToggleButton()
    },
    template: `
        <div>
            <div class="cec-p-6 border-bottom border-bottom-style-dash">
                <label>{{ translate('profile.global-search') }}</label>
                <div v-if="!isLoading">
                    <toggle-button
                        class="justify-content-between mb-3"
                        label-position="left"
                        label-class="text-black"
                        v-model="profileSetting.visibleToCrosswired"
                        @change="onVisibleToCrosswiredChange"
                        :label="translate('profile.global-search-enable-for-anyone-label')">
                    </toggle-button>
                    <toggle-button
                        class="justify-content-between"
                        label-position="left"
                        label-class="text-black"
                        :disabled="profileSetting.visibleToCrosswired"
                        v-model="profileSetting.visibleToMyOrganization"
                        @change="onVisibleToMyOrganizationChange"
                        :label="translate('profile.global-search-enable-for-org-label')">
                    </toggle-button>
                </div>
            </div>
            <div
                v-show="isUserPartOfAnyOrg"
                class="cec-p-6 border-bottom border-bottom-style-dash">
                <label>{{ translate('organization-profile') }}</label>
                <div v-if="!isLoading">
                    <toggle-button
                        class="justify-content-between"
                        label-position="left"
                        label-class="text-black"
                        v-model="profileSetting.visibleOrgProfileToMyOrganization"
                        @change="update('ORGANIZATION_PROFILE_IS_MY_ORGANIZATION', $event)"
                        :label="translate('profile.profile-organization-enable-for-my-organization-label')">
                    </toggle-button>
                </div>
            </div>
        </div>
    `
})
