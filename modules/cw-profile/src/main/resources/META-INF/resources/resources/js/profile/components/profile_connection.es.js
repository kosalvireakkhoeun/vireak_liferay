import DeleteConfirmationMixin from 'cw-vuejs-global-components/mixins/mixin_delete_confirmation.es';
import { SafeHtmlMixin } from 'cw-vuejs-global-components/mixins/sanitize_html.es';

import ProfileMixin from './../mixins/profile_mixin.es';
export const ProfileConnection = () => ({
    props: {
        isSpouseRequest: { type: Boolean }
    },
    data: function() {
        return {
            requestedInfo: null
        }
    },
    created: function() {
        this.checkRequest();
    },
    mixins: [
        ProfileMixin,
        DeleteConfirmationMixin,
        SafeHtmlMixin
    ],
    methods: {
        confirmAcceptDeny: function(accept) {
            this.deleteConfirmation({
                title: accept ? this.translate('profile.would-you-like-to-accept-this-request') : this.translate('profile.would-you-like-to-deny-this-request'),
                content: accept ? this.translate('profile.accept-note') : this.translate('profile.deny-note'),
                warningIconClass: accept ? 'primary' : 'error',
                confirmButtonText: accept ? this.translate('profile.yes-accept') : this.translate('profile.yes-deny'),
                confirmButtonClass: accept ? 'btn btn-primary' : 'btn btn-danger'
            }).then(confirmed => {
                if (confirmed) {
                    this.submit(accept);
                }
            }).catch(console.error);
        },
        submit: function(accept) {
            if (!this.isSpouseRequest) {
                this.acceptOrDenyConnection(accept);
            } else {
                this.acceptOrDenySpouseConnection(accept);
            }
        },
        acceptOrDenyConnection: function(accept) {
            const { socialRequestId } = this.requestedInfo;
            this.getResourceService().sendFormData('/profile/social/request', {
                socialRequestId,
                accept
            }).then(response => {
                const { success, result } = response.data;
                if (success) {
                    this.requestedInfo = null;
                    if(result) {
                        this.profile = JSON.parse(response.data.result);
                        this.setContactSummary(this.profile);
                    }
                }
            }).catch(console.error);
        },
        acceptOrDenySpouseConnection: function(accept) {
            const { socialRequestId } = this.requestedInfo;
            this.getActionService().sendFormData('/profile/connection/spouse/accept_deny', {
                socialRequestId, accept
            }).then(response => {
                const { success } = response.data;
                if (success || !accepted) {
                    this.requestedInfo = null;
                }
            }).catch(console.error);
        },
        checkRequest: function() {
            const checkRequestUrl = this.isSpouseRequest ? '/profile/connection/pending_spouse/fetch' : '/profile/connection/fetch';
            this.getResourceService().fetch(checkRequestUrl, {
                urlOptions: {
                    params: {
                        organizationId: this.$store.state.selectedOrganization.id || 0
                    }
                }
            }).then(response => {
                const { success, result } = response.data;
                if (success && result) {
                    this.requestedInfo = JSON.parse(response.data.result);
                }
            }).catch(console.error);
        }
    },
    template: `
        <div v-if="requestedInfo">
            <div class="cec-card cec-my-4">
                <div class="cec-card__body d-flex align-items-center flex-column">
                    <div class="d-flex align-items-center justify-content-space-between">
                        <span class="cec-px-4 text-center">
                            <strong>{{ requestedInfo.name }}</strong> {{requestedInfo.message}}
                        </span>
                        <div class="d-md-block d-none">
                            <cw-button :label="translate('deny')" @action="confirmAcceptDeny(false)"
                                style-type="outline-primary btn--width-110 btn--height-30 cec-mr-1"></cw-button>
                            <cw-button :label="translate('accept')" @action="confirmAcceptDeny(true)"
                                style-type="primary btn--width-110 btn--height-30"></cw-button>
                        </div>
                    </div>
                    <i class="cec-py-4" v-if="requestedInfo.description" v-safe-html="requestedInfo.description"></i>
                    <div class="d-flex d-md-none flex-column w-100">
                        <cw-button :label="translate('accept')" @action="confirmAcceptDeny(true)"
                            style-type="primary btn--height-30 my-2"></cw-button>
                        <cw-button :label="translate('deny')" @action="confirmAcceptDeny(false)"
                            style-type="outline-primary btn--height-30 my-3"></cw-button>
                    </div>
                </div>
            </div>
        </div>
    `
});
