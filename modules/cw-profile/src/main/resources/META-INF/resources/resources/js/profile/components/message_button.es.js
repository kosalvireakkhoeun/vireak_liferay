import { PopupAddConnection } from 'cw-vuejs-global-components/components/profile/popup_add_connection.es';
import {
    ABLE_TO_CONNECT,
    REQUESTED_CONNECTION,
    CONNECTED
} from 'cw-vuejs-global-components/components/profile/profile_constance.es';
import { PortletMixin } from 'cw-vuejs-global-components/mixins/portlet.es';

export const MessageButton = () => ({
    props: {
        relationType: { type: Number },
        selUserIdpUuid: { type: String },
        openChatUrl: { type: String },
        profileName: { type: String, default: '' }
    },
    mixins: [
        PortletMixin,
    ],
    data: function() {
        return {
            showPopupAddConnection: false,
            isRequesting: this.relationType == REQUESTED_CONNECTION,
            cloneRelationType : this.relationType
        }
    },
    cwComponents: {
        PopupAddConnection: PopupAddConnection(),
    },
    computed: {
        buttonLabel: function() {
            switch(this.cloneRelationType) {
                case ABLE_TO_CONNECT:
                    return 'connect';
                case REQUESTED_CONNECTION:
                    return 'connection-request-sent';
                case CONNECTED:
                    return 'message';
                default:
                    return '';
            }
        }
    },
    methods: {
        handleAddConnectionPopup: function() {
            if (this.$store.state.previewAs) {
                return;
            }
            if ((this.cloneRelationType == ABLE_TO_CONNECT ||
                this.cloneRelationType == REQUESTED_CONNECTION)) {
                this.showPopupAddConnection = !this.showPopupAddConnection;
            } else if (this.cloneRelationType == CONNECTED) {
                this.openChat();
            }
        },
        onAddConnectionSuccess: function(relationType) {
            this.cloneRelationType =  relationType;
        },
        openChat: function() {
            if (Liferay.Browser.isMobile() || window.isCwChatLocked) {
                this.navigateToUrl(this.openChatUrl);
            } else {
                CW_UI.openChat(undefined, {
                    userId: this.selUserIdpUuid
                });
            }
        },
    },
    template: `
        <div class="align-items-center cec-px-md-6 cec-px-4 cec-mt-n1 cec-mb-3 flex-column d-sm-flex">
            <popup-add-connection
                v-if="showPopupAddConnection"
                :on-hide-show="handleAddConnectionPopup"
                :on-success="onAddConnectionSuccess"
                :sel-user-idp-uuid="selUserIdpUuid"
                :relation-type="cloneRelationType"
                :prop-profile-name="profileName">
            </popup-add-connection>
            <button class="btn connect-button w-100 sm-down--width-100"
                @click="handleAddConnectionPopup()">
                {{ translate(buttonLabel) }}
            </button>
        </div>
    `
});
