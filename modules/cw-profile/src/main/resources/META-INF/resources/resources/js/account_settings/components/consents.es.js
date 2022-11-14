import { ConsentUserOverview } from 'cw-vuejs-global-components/components/consent/consent_user_overview.es';
import { ConsentUserPopup } from 'cw-vuejs-global-components/mixins/consent/consent_user_popup.es';
import DeleteConfirmationMixin from 'cw-vuejs-global-components/mixins/mixin_delete_confirmation.es.js';
import { LoadingIndicator } from 'cw-vuejs-global-components/components/loading-indicator.es';

export const Consents = () => ({
    props: {
        selectedOption: { type: Object },
    },
    cwComponents: {
        ConsentUserOverview: ConsentUserOverview(),
        LoadingIndicator: LoadingIndicator()
    },
    mixins: [
        ConsentUserPopup,
        DeleteConfirmationMixin
    ],
    data: function() {
        return {
            instance: this,
            selectedTab: 'communities',
            communities: [],
            courses: [],
            others: [],
            totalCommunity: 0,
            totalCourse: 0,
            totalOther: 0,
            isLoading: false,
            start: 0,
            end: 10,
            tabs: [
                { key: 'communities', value: 'communities', total: 'totalCommunity' },
                { key: 'courses', value: 'courses', total: 'totalCourse' },
                { key: 'others', value: 'others', total: 'totalOther' },
            ],
            consents: [],
            totalConsent: 0,
            emptyStateMessage: '',
        }
    },
    mounted: function() {
        this.fetchUserConsents(true);
    },
    computed: {
        communityTabActive: function() {
            return this.selectedTab == 'communities';
        },
        courseTabActive: function() {
            return this.selectedTab == 'courses';
        },
        otherTabActive: function() {
            return this.selectedTab == 'others';
        }
    },
    methods: {
        tabClick: function(tab) {
            if (this.selectedTab != tab) {
                this.selectedTab = tab;

                switch(tab) {
                    case 'communities':
                        this.updateToCommunityConsents();
                        break;
                    case 'courses':
                        this.updateToCourseConsents();
                        break;
                    default:
                        this.updateToOtherConsents();
                }
            }
        },
        fetchUserConsents: function(isInitial = false) {
            this.isLoading = true;
            this.getResourceService().sendFormData('/account_settings/user_consents/fetch', {
                consentType: this.selectedTab,
                start: this.start,
                end: this.end,
                isInitial
            }).then(response => {
                if(response.data.success) {
                    const data = JSON.parse(response.data.result);
                    if (isInitial) {
                        this.communities = data.communities;
                        this.courses = data.courses;
                        this.others = data.others;
                        this.totalCommunity = data.totalCommunity;
                        this.totalCourse = data.totalCourse;
                        this.totalOther = data.totalOther;

                        this.updateToCommunityConsents();
                    } else if (this.communityTabActive) {
                        this.communities = data.data;
                        this.totalCommunity = data.total;
                        this.updateToCommunityConsents();
                    } else if (this.courseTabActive) {
                        this.courses = data.data;
                        this.totalCourse = data.total;
                        this.updateToCourseConsents();
                    } else {
                        this.others = data.data;
                        this.totalOther = data.total;
                        this.updateToOtherConsents();
                    }
                }
            }).finally(() => this.isLoading = false);
        },
        updateToCommunityConsents: function() {
            this.setConsent(this.communities, this.totalCommunity, 'no-consent-given-to-any-community-yet');
        },
        updateToCourseConsents: function() {
            this.setConsent(this.courses, this.totalCourse, 'no-consent-given-to-any-course-yet');
        },
        updateToOtherConsents: function() {
            this.setConsent(this.others, this.totalOther, 'no-consent-given-yet');
        },
        setConsent: function(consents, total, errorMessage) {
            this.consents = null;
            this.consents = consents;
            this.totalConsent = total;
            this.emptyStateMessage = errorMessage;
        },
        onAction: function(consent, consentType, action) {
            const isCommunity = consentType == 'communities';
            const isOther = consentType == 'others';

            switch(action) {
                case 'view':
                case 'edit':
                    this.consentUserPopup(consent, isCommunity, action);
                    break;
                case 'revoke':
                    this.deleteConfirmation({
                        title: this.translate('would-you-like-to-revoke-this-consent'),
                        hideContent: isOther,
                        content: this.translate(isCommunity ? 'revoke.consent-message-community' : 'revoke.consent-message-course'),
                        confirmButtonText: 'yes-revoke'
                    }).then(revoked => {
                        if(revoked) {
                            this.getActionService().sendFormData('/consent_form/revoked', {
                                consentVersionId: consent.consentVersionId,
                                targetType: consent.targetType
                            }).then(response => {
                                if (response.data.success) {
                                    this.fetchUserConsents();
                                }
                           }).catch(console.error);
                        }
                    });
                    break;
            }
        },
        onPaginate: function(start, end) {
            this.start = start;
            this.end = end;
            this.fetchUserConsents();
        },
        onDownload: function() {
            let url = Liferay.Util.PortletURL.createResourceURL(
                this.getCwContext().getBaseResourceUrl(), {
                p_p_resource_id: '/download/user_consent'
            });
            window.open(url, '_blank');
        }
    },
    template: `
        <div class="consents-holder">
            <loading-indicator
                :is-loading="isLoading"
                title="please-wait">
            </loading-indicator>
            <div class="rounded-top w-100">
                <div class="d-flex align-items-center justify-content-between border-bottom border-bottom-style-dash pr-0 cec-px-6 cec-py-4 cec-card__header_fix_height">
                    <span class="font-size-22 font-weight-light text-black">{{ translate(selectedOption.key) }}</span>
                    <div class="cursor-pointer" @click="onDownload">
                        <cw-svg-icon
                            :icon-url="svgIconUrl('download')"
                            css-class="cw-icon-xs cec-mr-1"
                        ></cw-svg-icon>
                        <span>{{ translate('download') }}</span>
                    </div>
                </div>
            </div>
            <div class="d-flex cec-mb-4 border-bottom border-bottom-style-dash cec-pl-6 w-100 text-black">
                <div v-for="(tab, index) in tabs"
                    :key="'tab-' + index"
                    class="tab-menu cec-py-4 mr-3 cursor-pointer"
                    :class="{'tab-active font-weight-bold': selectedTab == tab.key}"
                    @click="tabClick(tab.key)"
                >
                    <span>{{ translate(tab.value) }}</span>&nbsp<i class="font-weight-normal">({{ instance[tab.total] }})</i>
                </div>
            </div>
                <div class="px-md-4 cec-pb-6 border-bottom-sm-down">
                    <consent-user-overview
                        v-if="consents && consents.length"
                        :consent-type-string="selectedTab"
                        :consents="consents"
                        :total-consents="totalConsent"
                        @onAction="onAction"
                        @consent-popup="consentUserPopup"
                        @paginate="onPaginate"
                    />
                    <div v-else class="d-flex flex-column align-items-center pt-2 pb-0 pb-sm-6">
                        <cw-svg-icon :icon-url="svgIconUrl('empty-consent')" css-class="cw-icon-354-173"></cw-svg-icon>
                        <p class="pt-3">{{ translate(emptyStateMessage) }}</p>
                    </div>
                </div>
        </div>
    `
});
