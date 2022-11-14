import { DetailRowCard } from './detail_row_card.es';
import { INSTAGRAM_TYPE } from 'cw-vuejs-global-components/components/profile/profile_constance.es'

export const ProfileDetails = () => ({
    cwComponents: {
        DetailRowCard: DetailRowCard()
    },
    data: function() {
        return {
            INSTAGRAM_TYPE
        }
    },
    props: {
        profile: { type: Object, default: () => ({}) },
        cssWrapper: { type: String },
        cssHeader: { type: String },
    },
    computed: {
        moreInfoEmpty: function() {
            return this.$root.$store.state.isEmptyUserInfo;
        },
        moreInfo: function() {
            return this.profile.moreInformation;
        },
        websites: function() {
            return this.profile.moreInformation.webSite.items.filter((w) => !!w.text && !w.deleted );
        },
        socialMedia: function() {
            return this.profile.moreInformation.socialMedia.items.filter((s) => !!s.text && !s.deleted );
        }
    },
    methods: {
        formatLink: function(url) {
            const pattern = /^((http|https):\/\/)/;
            if (!pattern.test(url)) {
                url = 'http://' + url;
            }
            return url;
        },
    },
    template: `
        <div class="cec-m-4 cec-mx-sm-6 profile-detail-wrapper" v-if="profile.curUserIdpUuid && ($root.$store.state.ownProfileViewed || !moreInfoEmpty)" :class="cssWrapper">
            <div class="d-sm-flex align-items-center cec-mb-5" :class="cssHeader">
                <div class="font-weight-light font-size-22">{{ translate('details') }}</div>
                <cw-button-link
                    css-wrapper="ml-auto"
                    v-if="$root.$store.state.ownProfileViewed"
                    @action="$emit('edit-details')"
                    icon-name="pencil">
                </cw-button-link>
            </div>

            <detail-row-card v-if="moreInfo.givenLegalName.text" label="known-as" icon="knownas">
                <span class="text-capitalize text-black">{{ moreInfo.givenLegalName.text }}</span>
            </detail-row-card>

            <detail-row-card v-if="profile.gender" label="gender" icon="gender">
                <span class="text-capitalize text-black">{{ profile.gender }}</span>
            </detail-row-card>

            <detail-row-card v-if="profile.dateOfBirth" label="birthday" icon="birthday">
                <span class="text-capitalize text-black">{{ profile.dateOfBirth }}</span>
            </detail-row-card>

            <detail-row-card v-if="moreInfo.company.text" label="company" icon="company-org">
                <span class="text-capitalize text-black">{{ moreInfo.company.text }}</span>
            </detail-row-card>

           <detail-row-card v-if="profile.jobTitle" label="job-title" icon="job-title">
               <span class="text-capitalize text-black">{{ profile.jobTitle }}</span>
           </detail-row-card>

            <detail-row-card v-if="profile.position" label="position" icon="position">
                <span class="text-capitalize text-black">{{ profile.position }}</span>
            </detail-row-card>

           <detail-row-card v-if="websites.length" label="website" icon="website">
                <p v-for="website in websites" class="mb-2">
                    <a class="text-decoration-none text-lowercase" :href="formatLink(website.text)">{{ website.text }}</a>
                </p>
           </detail-row-card>

            <detail-row-card v-if="socialMedia.length" label="social-network" icon="social-network">
                <a v-for="social in socialMedia" class="text-decoration-none" :href="formatLink(social.text)" target="_blank">
                    <svg v-if="social.type == INSTAGRAM_TYPE" v-html="getInstagramIconString()" class="lexicon-icon cw-icon cw-icon-xl cec-mr-2 cec-mb-2"></svg>
                    <cw-svg-icon v-else css-class="cw-icon-xl cec-mr-2 cec-mb-2" :icon-url="svgIconUrl('social-network-type-' + social.type)" />
                </a>
           </detail-row-card>
        </div>
    `
});
