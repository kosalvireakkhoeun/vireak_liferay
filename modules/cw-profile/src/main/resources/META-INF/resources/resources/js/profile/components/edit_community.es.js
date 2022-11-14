import { SafeHtmlMixin } from 'cw-vuejs-global-components/mixins/sanitize_html.es';
import { PortletMixin } from 'cw-vuejs-global-components/mixins/portlet.es';
import isEmpty from 'lodash/isEmpty';
import { EditCommunitiesPopup } from './edit_communities_popup.es';
import { PopupBackground } from './popup_background.es';
import ActionArea from './action_area.es';
import { EmptyProfile } from './empty_profile.es';

const EditCommunity = () => ({
    mixins: [
        SafeHtmlMixin,
        PortletMixin,
        EditCommunitiesPopup,
    ],
    cwComponents: {
        ActionArea: ActionArea(),
        EmptyProfile,
        PopupBackground: PopupBackground()
    },
    data: function() {
        return {
            communityInfo: this.$root.$store.state.communityInfo || {},
            isLoading: false,
            isShowingEditBackgroundPopup: false
        }
    },
    computed: {
        isEmptyState: function() {
            return (
                (this.communityInfo.communities && this.communityInfo.communities.length <= 0) &&
                !this.communityInfo.primaryCommunity &&
                !this.communityInfo.background
            );
        },
        hideCommunityBackground: function() {
            return !this.isLoading && (this.isOwner || this.communityInfo.background);
        },
        hidePrimaryCommunity :function () {
            return !this.isLoading && (this.isOwner || this.communityInfo.primaryCommunity);
        },
        hideCommunity: function() {
            return !this.isLoading && (this.isOwner || (this.communityInfo.communities && this.communityInfo.communities.length));
        },
        isOwner: function() {
            return this.$root.$store.state.ownProfileViewed;
        },
        userName: function() {
            return this.$store.getters.getSingleName;
        }
    },
    created: function() {
        if (isEmpty(this.communityInfo)) {
            this.fetchCommunityInfo();
        }
    },
    methods: {
        fetchCommunityInfo: function() {
            this.isLoading = true;
            this.getResourceService().fetch('/profile/community/fetch', {
                urlOptions: {
                    params: {
                        userIdpUuid: this.$root.$store.state.userIdpUuid,
                        previewAs: this.$root.$store.state.previewAs
                    }
                }
            })
            .then((response) => {
                if (response.data.success) {
                    this.communityInfo = JSON.parse(response.data.result);
                    this.$store.commit("setCommunityInfo", this.communityInfo);
                }
                this.isLoading = false;
            })
            .catch((error) => {
                this.isLoading = false;
                console.error(error);
            });
        },
        getNameTranslate: function(key, sKey, userName) {
            const name = userName || this.userName;
            let selectedKey = name.endsWith('s') ? sKey : key;
            return this.translate(selectedKey, name);
        },
        showOrHideEditBackgroundPopup: function(data = {}) {
            this.isShowingEditBackgroundPopup = !this.isShowingEditBackgroundPopup;
            if (data && data.isUpdate) {
                this.communityInfo.background = data.backgroundInfo;
                this.communityInfo.backgroundVisibility = data.visibility;
            }
        },
        getPrimaryCommunityTitle: function() {
            const titleKey = this.isOwner
                ? ['my-primary-community-of-purpose']
                : ['x-primary-community-of-purpose', 'xs-primary-community-of-purpose'];
            return this.getNameTranslate(...titleKey);
        },
        getCommunityTitle: function() {
            if (this.isOwner) {
                return this.getNameTranslate('my-other-communities-of-purpose');
            }
            const otherCommunityTitle = this.communityInfo.primaryCommunity ?
                ['x-other-communities-of-purpose', 'xs-other-communities-of-purpose'] :
                ['x-communities-of-purpose', 'xs-communities-of-purpose']
            return this.getNameTranslate(...otherCommunityTitle);
        },
        getAboutTitle: function() {
            return this.isOwner ? this.translate('about-me') : this.getNameTranslate('about-x');
        },
        onUpdatedCop: function(data = {}) {
            this.$store.commit('setCopList', data.copList);
            this.communityInfo.primaryCommunity = data.communityTabInfo.primaryCommunity;
            this.communityInfo.communities = data.communityTabInfo.communities;
        }
    },
    template: `
        <div class="edit-community-wrapper cec-mt-md-n5">
            <empty-profile v-if="!isOwner && isEmptyState"></empty-profile>
            <template v-else>
                <popup-background
                    v-if="isShowingEditBackgroundPopup"
                    :on-close="showOrHideEditBackgroundPopup"
                    :given-name="userName"
                    :background-info="communityInfo.background"
                    :selected-background-visibility="communityInfo.backgroundVisibility">
                </popup-background>
                <div class="cec-pb-1" v-if="hideCommunityBackground">
                    <action-area
                        :editable="isOwner"
                        :title="getAboutTitle()"
                        :placeholder="translate('add-a-brief-background-about-yourself')"
                        @action="showOrHideEditBackgroundPopup"
                    >
                        <template slot="content" v-if="communityInfo.background">
                            <div class="info-card">
                                <span class="text">{{ communityInfo.background }}</span>
                            </div>
                        </template>
                    </action-area>
                </div>
                <div class="cec-pb-1" v-if="hidePrimaryCommunity">
                    <action-area
                        :editable="isOwner"
                        :title="getPrimaryCommunityTitle()"
                        :placeholder="translate('display-your-primary-community-of-purpose')"
                        @action="onEditCommunities"
                    >
                        <template slot="content" v-if="communityInfo.primaryCommunity">
                            <div class="info-card">
                                <div class="pb-3" v-if="communityInfo.primaryCommunity.storyDescription">
                                    <span class="text" v-safe-html="communityInfo.primaryCommunity.storyDescription"></span>
                                </div>
                                <div class="cec-pb-6" v-if="communityInfo.primaryCommunity.communityImageUrl">
                                    <img :src="communityInfo.primaryCommunity.communityImageUrl" class="banner-image" />
                                </div>
                                <div class="d-flex">
                                    <div class="d-flex mr-auto cursor-pointer align-items-center" @click="navigateToUrl(communityInfo.primaryCommunity.communityUrl)">
                                        <cw-svg-icon :icon-url="svgIconUrl('circle-arrow')" css-class="flex-shrink-0"></cw-svg-icon>
                                        <div class="pl-3 font-size-16">{{ getNameTranslate('visit-x-community-of-purpose', 'visit-xs-community-of-purpose', communityInfo.primaryCommunity.communityName) }}</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </action-area>
                </div>
                <div class="pb-5" v-if="hideCommunity">
                    <action-area
                        :editable="isOwner"
                        :title="getCommunityTitle()"
                        :placeholder="translate('show-community-of-purpose-sites-you-are-subscribed-to')"
                        @action="onEditCommunities"
                    >
                        <template slot="content" v-if="communityInfo.communities && communityInfo.communities.length > 0">
                            <div v-for="(community, index) in communityInfo.communities" :key="'community-' + index" class="pb-4">
                                <div class="info-card d-lg-flex">
                                    <img
                                        v-if="community.communityImageUrl"
                                        class="community-image w-40 md-down--width-100 cec-mr-0 cec-mr-sm-6"
                                        :src="community.communityImageUrl" />
                                    <div class="cop-info w-60 md-down--width-100">
                                        <div class="font-size-22 font-weight-bold cec-my-4 cec-mt-sm-0">{{ community.communityName }}</div>
                                        <div class="cec-mb-4" v-if="community.storyDescription">
                                            <span v-safe-html="community.storyDescription" class="text"></span>
                                        </div>
                                        <div class="d-flex">
                                            <div class="d-flex mr-auto cursor-pointer align-items-center" @click="navigateToUrl(community.communityUrl)">
                                                <cw-svg-icon :icon-url="svgIconUrl('circle-arrow')" css-class="flex-shrink-0"></cw-svg-icon>
                                                <div class="pl-3 font-size-16">{{ getNameTranslate('visit-x-community-of-purpose', 'visit-xs-community-of-purpose', community.communityName) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </action-area>
                </div>
            </template>
        </div>
    `
});

export default EditCommunity;
