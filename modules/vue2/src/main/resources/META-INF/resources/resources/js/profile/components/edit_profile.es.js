import { QuickTipProfile } from './quick_tip_profile.es'
import { QuickTipFamily } from './quick_tip_family.es'
import { EditDetails } from './edit_details.es';
import EditContactInfo from './edit_contact_info.es';
import EditFamilyInfo from './edit_family_info.es';

export const EditProfile = () => ({
    props: {
        hasValidSubscription: { type: Boolean },
        componentName: { type: String, require: true },
    },
    cwComponents: {
        EditDetails: EditDetails(),
        EditContactInfo: EditContactInfo(),
        EditFamilyInfo: EditFamilyInfo(),
        QuickTipProfile: QuickTipProfile(),
        QuickTipFamily: QuickTipFamily()
    },
    data: function() {
        return {
            invalidDetail: false
        }
    },
    computed: {
        getTitle: function() {
            switch(this.componentName) {
                case 'contactInfo':
                    return this.translate('edit-contact-info-for-x', this.$store.state.userName);
                case 'profileDetail':
                    return this.translate('profile.edit-details-for-x', this.$store.state.userName);
                case 'familyInfo':
                    return this.translate('edit-family');
                default:
                    break;
            }
        },
        labelUpdateBtn: function() {
            switch(this.componentName) {
                case 'contactInfo':
                    return this.translate('profile.update-contact-info');
                case 'profileDetail':
                    return this.translate('update-my-profile') ;
                case 'familyInfo':
                    return this.translate('update-family');
                default:
                    break;
            }
        },
        isEditContactInfo: function() {
            return this.componentName === 'contactInfo';
        },
        isEditProfileDetail: function() {
            return this.componentName === 'profileDetail';
        },
        isEditFamilyInfo: function() {
            return this.componentName === 'familyInfo';
        },
    },
    methods: {
        setValidate: function(invalid) {
            this.invalidDetail = invalid;
        },
        update: function(ref) {
            this.$refs[ref].update();
        }
    },
    template: `
    <div class="edit-profile-section">
        <cw-button
            :disabled="invalidDetail"
            :label="labelUpdateBtn"
            style-type="primary text-uppercase min-width-257 sm-down--width-100 d-sm-none cec-mb-4"
            @action="update(componentName)"></cw-button>
        <cw-card-panel-two-column header-class="border-bottom-style-dash text-uppercase" :show-right-title-on-mobile="false">
            <template #icon>
                <a href="javascript:;" @click="$emit('switch-mode')">
                    <cw-svg-icon css-class="text-black" :icon-url="svgIconUrl('back-circle')"></cw-svg-icon>
                </a>
            </template>
            <template #title>
                <span>{{ getTitle }}</span>
            </template>
            <template #right-title>
                <cw-button
                    :disabled="invalidDetail"
                    :label="labelUpdateBtn"
                    style-type="primary text-uppercase w-100"
                    @action="update(componentName)"></cw-button>
            </template>
            <template #right-body>
                <quick-tip-family v-if="isEditFamilyInfo"></quick-tip-family>
                <quick-tip-profile v-else css-class="d-none d-md-block"></quick-tip-profile>
            </template>
            <template>
                <edit-contact-info
                    v-if="isEditContactInfo"
                    ref="contactInfo"
                    :validate="setValidate"
                ></edit-contact-info>
                <edit-details
                    v-else-if="isEditProfileDetail"
                    ref="profileDetail"
                    :has-valid-subscription="hasValidSubscription"
                    @invalid-details="setValidate"
                ></edit-details>
                <edit-family-info
                    v-else-if="isEditFamilyInfo && $store.state.organizations && $store.state.organizations.length"
                    :key="$store.state.selectedOrganization.id"
                    ref="familyInfo"
                ></edit-family-info>
            </template>
        </cw-card-panel-two-column>
    </div>
    `
});
