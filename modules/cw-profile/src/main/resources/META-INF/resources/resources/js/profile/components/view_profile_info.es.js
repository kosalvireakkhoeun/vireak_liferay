import { RELATION_TYPE_REQUESTING } from 'cw-vuejs-global-components/components/profile/profile_constance.es';
import { DropdownThreeDots } from 'cw-vuejs-global-components/components/dropdown_three_dots.es';
import RemoveUserConnectionMixin from 'cw-vuejs-global-components/mixins/remove_user_connection_mixin.es';
import { ProfileSummary } from 'cw-vuejs-global-components/components/member_management/contact/profile_summary.es';

import { ViewProfileImage } from './view_profile_image.es';
import { MessageButton } from './message_button.es';
import {
    CONNECTED
} from 'cw-vuejs-global-components/components/profile/profile_constance.es';

export const ViewProfileInfo = () => ({
    props: {
        profile: { type: Object, default: () => ({}) },
    },
    mixins: [
        RemoveUserConnectionMixin,
    ],
    cwComponents: {
        MessageButton: MessageButton(),
        ViewProfileImage: ViewProfileImage(),
        ProfileSummary: ProfileSummary(),
        DropdownThreeDots: DropdownThreeDots()
    },
    data: function() {
        return {
            requestingType: RELATION_TYPE_REQUESTING
        }
    },
    computed: {
        showContactSection: function() {
            return this.$root.$store.state.ownProfileViewed ||
                this.profile.emails.length || this.profile.addressList.length || this.profile.phoneList.length;
        },
        connected: function() {
            return this.profile.relationType === CONNECTED;
        },
        profileName: function() {
            if (!this.profile.personalInformation) {
                return '';
            }
            const { givenName, familyName, screenName } = this.profile.personalInformation;
            if (givenName.text || familyName.text) {
                return givenName.text + ' ' + familyName.text;
            }
            return screenName;
        },
    },
    methods: {
        removeConnection: function() {
            this.removeUserConnection({
                name: this.profileName,
                selUserIdpUuid: this.profile.selUserIdpUuid
            });
        }
    },
    template: `
        <div class="sm-down--width-100 py-3 user-profile-wrapper position-relative">
            <div v-if="connected" class="there-dot-position">
                <dropdown-three-dots
                    :id="profile.selUserIdpUuid"
                    :is-icon-vertical="true"
                    css-three-dot-item="bg-light ">
                    <template slot="menuItems">
                        <li>
                            <a href="javascript:;" @click="removeConnection" class="dropdown-item text-nowrap">
                                {{ translate('remove-connection') }}
                            </a>
                        </li>
                    </template>
                </dropdown-three-dots>
            </div>
            <view-profile-image v-if="profile.personalInformation"
                :connected="connected"
                :personal-information="profile.personalInformation"
                :headline-info="profile.headlineInfo"
            ></view-profile-image>
            <template v-if="showContactSection">
                <p class="font-weight-lighter text-white cec-px-sm-6 cec-px-4 font-size-22 mb-0 d-flex justify-content-between">
                    {{ translate('profile.contact-info') }}
                    <a v-if="$root.$store.state.ownProfileViewed" href="javascript:;" @click="$emit('edit-contact-info')">
                        <cw-svg-icon css-class="text-white" :icon-url="svgIconUrl('pencil')" />
                    </a>
                </p>
                <profile-summary
                    css-class="d-sm-flex white-element cec-px-sm-6"
                    :is-profile="true"
                    :contact="profile">
                </profile-summary>
            </template>
            <message-button v-if="!$root.$store.state.ownProfileViewed && profile.selUserIdpUuid && profile.relationType != requestingType"
                :open-chat-url="profile.openChatUrl"
                :relation-type="profile.relationType"
                :sel-user-idp-uuid="profile.selUserIdpUuid"
                :key="profile.relationType"
                :profile-name="profileName">
            </message-button>
        </div>
    `
});
