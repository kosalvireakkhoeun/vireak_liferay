import { PortletMixin } from 'cw-vuejs-global-components/mixins/portlet.es';
import { SfTablist } from 'cw-vuejs-global-components/components/syncfusion/sf_tablist.es.js';
import { AccordionItem } from 'cw-vuejs-global-components/components/accordion_item.es';

import { ExpertiseQualification } from './expertise_qualification.es';
import { CertificatesSection } from './certificates_section.es';
import { ShowCertificatesPopup } from './show_certificates_popup.es';
import { ViewProfileInfo } from './view_profile_info.es';
import { ProfileDetails } from './profile_details.es';
import { PopupExpertise } from './popup_expertise.es';

import ActionArea from './action_area.es';
import EditCommunity from './edit_community.es';
import { EmptyProfile } from './empty_profile.es';
import { ViewOrganization } from './view_organization.es';
import { PreviewProfile } from './preview_profile.es';
import { OrgStatus } from './org_status.es';
import { AgentList } from './agent_list.es';
import { OrgList } from './org_list.es';
import { ProfileConnection } from './profile_connection.es';
import FamilyDetail from './family_detail.es';

import { PREVIEW_AS_ANYONE, PREVIEW_AS_CONNECTION, PREVIEW_AS_ORG } from 'cw-vuejs-global-components/components/profile/profile_constance.es';

const ORGANIZE_TAB = 0;
const COMMUNITY_TAB = 1;
const EXPERTISE_TAB = 2;

export const ViewProfile = () => ({
    cwComponents: {
        SfTablist: SfTablist(),
        ExpertiseQualification: ExpertiseQualification(),
        CertificatesSection: CertificatesSection(),
        ShowCertificatesPopup: ShowCertificatesPopup(),
        ViewProfileInfo: ViewProfileInfo(),
        ProfileDetails: ProfileDetails(),
        ActionArea: ActionArea(),
        EditCommunity: EditCommunity(),
        EmptyProfile,
        ViewOrganization: ViewOrganization(),
        PopupExpertise: PopupExpertise(),
        PreviewProfile: PreviewProfile(),
        AccordionItem,
        OrgStatus: OrgStatus(),
        AgentList: AgentList(),
        OrgList: OrgList(),
        ProfileConnection: ProfileConnection(),
        FamilyDetail: FamilyDetail(),
    },
    mixins: [PortletMixin],
    props: {
        userDetails: { type: Object, default: () => ({}) }
    },
    data: function() {
        return {
            activeTabId: ORGANIZE_TAB,
            showExpertisePopup: false,
            isShowCertificatesPopup: false,
            previewAsItems: [
                { key: PREVIEW_AS_CONNECTION, label: this.translate('profile.preview-as-connection') },
                { key: PREVIEW_AS_ORG, label: this.translate('profile.preview-as-organization') },
                { key: PREVIEW_AS_ANYONE, label: this.translate('profile.preview-as-anyone') }
            ],
            tabHeaders : [
                { text: this.translate('community') },
                { text: this.translate('expertise-and-qualifications') },
            ],

        };
    },
    computed: {
        showFamilyDetailSection: function() {
            return !this.$store.state.hideFamilyRelationship && !this.$store.state.previewAs
                && this.$store.state.organizations && this.$store.state.organizations.length
                && this.$store.state.selectedOrganization.hasViewFamilyPermission;
        },
        isCommunityTabActive: function() {
            return !this.$store.state.showOrganizationTab ?
                this.activeTabId == ORGANIZE_TAB : this.activeTabId == COMMUNITY_TAB;
        },
        isExpertiseTabActive: function() {
            return !this.$store.state.showOrganizationTab ?
                this.activeTabId == COMMUNITY_TAB : this.activeTabId == EXPERTISE_TAB;
        },
        isOrganizationTabActive: function() {
            return this.$store.state.showOrganizationTab && this.activeTabId == ORGANIZE_TAB;
        },
        expertiseTitle: function() {
            if (this.$store.state.ownProfileViewed) {
                return this.translate('my-focus');
            }
            const key = this.userName.endsWith('s') ? 'xs-focus' : 'x-focus';
            return this.translate(key, this.userName);
        },
        isEmptyExpertise: function() {
            const expertise = this.$root.$store.state.expertise || {};
            return (
                !expertise.areaOfFocus.items.length &&
                !expertise.skillAndExpertise.items.length &&
                !expertise.language.items.length &&
                !expertise.interestAndHobby.items.length
            );
        },
        isEmptyCertificates: function() {
            const certificates = (this.$root.$store.state.expertise.certificates.certificates || [])
                .filter(certificate => certificate.showInProfile);
            return !certificates.length;
        },
        isOwner: function() {
            return this.$root.$store.state.ownProfileViewed;
        },
        userProfile: function() {
            return this.$store.state.userProfile;
        },
        userName: function() {
            return this.$store.getters.getSingleName;
        },
        hasOrganizationInformation: function() {
            const organizationInformation = this.$store.state.userProfile.organizationInformation;
            return organizationInformation && organizationInformation.items.length > 0;
        },
        homeOrg: function() {
            return this.$store.state.selectedProfileOrganization.homeOrg;
        },
        hostOrg: function() {
            return this.$store.state.selectedProfileOrganization.hostOrg;
        },
        orgUnits: function() {
            return this.$store.state.selectedProfileOrganization.orgUnits;
        },
        shouldShowOrgUnitBlock: function() {
            return this.orgUnits.length > 0;
        },
        shouldShowHomeOrganizationBlock: function() {
            return this.homeOrg && this.homeOrg.agents.length > 0;
        },
        shouldShowHostOrganizationBlock: function() {
            return this.hostOrg && this.hostOrg.agents.length > 0;
        },
        isGlobalAssignmentAvailable: function() {
            return this.shouldShowHomeOrganizationBlock || this.shouldShowHostOrganizationBlock;
        },
    },
    mounted: function() {
        if (this.$store.state.qualifyOrganizations.length) {
            this.tabHeaders.unshift({ text: this.translate('organization-profile') });
        }
    },
    methods: {
        tabSelected: function(index) {
            this.activeTabId = index;
        },
        openEditExpertisePopup: function() {
            this.showPopup();
        },
        hideShowCertificatePopup: function() {
            this.isShowCertificatesPopup = !this.isShowCertificatesPopup;
        },
        onPreviewAs: function(item) {
            const previewAsUrl = this.generateRenderUrl('/', {
                userIdpUuid: this.$root.$store.state.userIdpUuid,
                previewAs: item.key
            });
            window.open(previewAsUrl, '_blank');
        },
        showPopup: function() {
            this.showExpertisePopup = !this.showExpertisePopup;
        },
        selectOrganization: function(organization) {
            this.$store.commit('setSelectedProfileOrganization', organization);
        },
        refreshPortlet: function() {
            Liferay.Portlet.refresh('#p_p_id_myProfilePortlet_');
        }
    },
    template: `
        <div class="view-profile-wrapper">
            <profile-connection />
            <profile-connection :is-spouse-request="true" />
            <preview-profile
                :is-owner="isOwner"
                :preview-as-items="previewAsItems"
                css-wrapper="d-flex d-sm-none cec-mb-4 align-items-center"
                css-cog="border rounded border-primary"
                css-svg="text-primary"
                @on-preview-as="onPreviewAs"
            ></preview-profile>
            <cw-card-panel-two-column-small-left-side
                css-wrapper-class="border-rounded"
                css-right-header-class="d-sm-flex d-none align-item-center cec-pl-5">
                <template #left-body>
                    <view-profile-info
                        :profile="userProfile"
                        @edit-contact-info="$emit('switch-mode', 'contactInfo')"
                        @reload-data="refreshPortlet">
                    </view-profile-info>
                    <accordion-item
                        v-if="$store.state.ownProfileViewed || !$store.state.isEmptyUserInfo || hasOrganizationInformation"
                        :aria-id="qualify('collapseDetails')"
                        css-title="font-size-22 font-weight-light text-black"
                        css-wrapper="border-sm-bottom border-0"
                        :title="translate('details')"
                        aria-labelledby="details"
                        class="d-block d-sm-none mobile-profile-detail-wrapper"
                    >
                        <template #icon>
                            <cw-button-link
                                v-if="isOwner"
                                css-wrapper="ml-auto cec-mr-4"
                                @action="$emit('switch-mode', 'profileDetail')"
                                icon-name="pencil">
                            </cw-button-link>
                        </template>
                        <profile-details
                            :is-desktop="false"
                            css-header="d-none"
                            :profile="userProfile"
                            @edit-details="$emit('switch-mode', 'profileDetail')"
                        ></profile-details>
                        <view-organization v-if="hasOrganizationInformation"
                            class="d-block d-sm-none"
                            :work-statuses="$store.state.options.workStatuses"
                            :organizations="$store.state.userProfile.organizationInformation.items">
                        </view-organization>
                        <template v-if="showFamilyDetailSection">
                            <family-detail
                                css-wrapper="d-block d-sm-none"
                                :organizations="$store.state.organizations"
                                @edit-family="$emit('switch-mode', 'familyInfo')">
                            </family-detail>
                        </template>
                    </accordion-item>

                    <profile-details
                        :profile="userProfile"
                        css-wrapper="d-none d-sm-block"
                        @edit-details="$emit('switch-mode', 'profileDetail')"
                    ></profile-details>
                    <view-organization v-if="hasOrganizationInformation"
                        :work-statuses="$store.state.options.workStatuses"
                        css-wrapper="d-none d-sm-block"
                        :organizations="$store.state.userProfile.organizationInformation.items">
                    </view-organization>
                    <template v-if="showFamilyDetailSection">
                        <family-detail
                            :is-owner="isOwner"
                            css-wrapper="d-none d-sm-block"
                            :organizations="$store.state.organizations"
                            @edit-family="$emit('switch-mode', 'familyInfo')"
                        ></family-detail>
                    </template>
                </template>
                <template #right-header>
                    <sf-tablist
                        @selecting-index="tabSelected"
                        css-wrapper="text-black d-lg-flex d-sm-none sf-tablist--sm"
                        :headers="tabHeaders"
                        :id="qualify('tabListDesktop')"
                    ></sf-tablist>
                    <preview-profile
                        :is-owner="isOwner"
                        :preview-as-items="previewAsItems"
                        css-wrapper="d-none d-sm-flex ml-auto"
                        css-cog="border-left h-100 px-3 d-flex"
                        css-svg="text-black"
                        css-dropdown="cec-my-2"
                        @on-preview-as="onPreviewAs"
                    ></preview-profile>
                </template>
                <template>
                    <sf-tablist
                        @selecting-index="tabSelected"
                        css-wrapper="text-black d-md-flex d-lg-none sf-tablist--sm"
                        :headers="tabHeaders"
                        :id="qualify('tabListMobile')"
                    ></sf-tablist>
                    <template v-if="isOrganizationTabActive">
                        <org-status
                            :data="$store.state.selectedProfileOrganization"
                            :organization-items="$store.state.qualifyOrganizations"
                            @select-organization="selectOrganization"
                        ></org-status>

                        <hr v-if="isGlobalAssignmentAvailable" class="border-style-dash" />
                        <p v-if="isGlobalAssignmentAvailable" class="font-weight-lighter font-size-22">{{ translate('global-assignment') }}</p>
                        <agent-list v-if="shouldShowHomeOrganizationBlock" :data="homeOrg" />
                        <agent-list v-if="shouldShowHostOrganizationBlock" :data="hostOrg" />
                        <template v-if="shouldShowOrgUnitBlock">
                            <hr class="border-style-dash" />
                            <p class="font-weight-lighter font-size-22">{{ translate('org-units') }}</p>
                            <org-list :data="orgUnits" />
                        </template>
                    </template>
                    <template v-if="isCommunityTabActive">
                        <edit-community />
                    </template>
                    <div v-if="isExpertiseTabActive">
                        <popup-expertise
                            v-if="isOwner && showExpertisePopup"
                            :title="expertiseTitle"
                            :data="$store.state.expertise"
                            :options="userProfile.options"
                            @on-cancel="showPopup"
                        ></popup-expertise>
                        <show-certificates-popup
                            v-if="isOwner && isShowCertificatesPopup"
                            :on-hide-show="hideShowCertificatePopup">
                        </show-certificates-popup>
                        <action-area
                            v-if="isOwner || !isEmptyExpertise"
                            :title="expertiseTitle"
                            :placeholder="translate('add-your-area-of-focus')"
                            @action="openEditExpertisePopup"
                            :editable="isOwner"
                        >
                            <template slot="content" v-if="!isEmptyExpertise">
                                <expertise-qualification></expertise-qualification>
                            </template>
                        </action-area>
                        <empty-profile v-else-if="isEmptyExpertise && isEmptyCertificates"></empty-profile>
                        <action-area
                            v-if="isOwner || !isEmptyCertificates"
                            :title="translate('certificates')"
                            :placeholder="translate('showcase-your-learning-achievement-with-others')"
                            @action="hideShowCertificatePopup(false)"
                            :editable="isOwner"
                        >
                            <template slot="content" v-if="!isEmptyCertificates">
                                <certificates-section></certificates-section>
                            </template>
                        </action-area>
                    </div>
                </template>
            </cw-card-panel-two-column-small-left-side>
        </div>
    `
});
