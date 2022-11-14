import ProfileImage from 'cw-vuejs-global-components/components/profile_image.es';

export const ViewProfileImage = () => ({
    props: {
        personalInformation: { type: Object, default: () => ({}) },
        headlineInfo: { type: Object, default: () => ({}) },
        isConnected: { type: Boolean }
    },
    data: function() {
        return {
            renderProfileImage: true
        };
    },
    cwComponents: {
        ProfileImage: ProfileImage()
    },
    computed: {
        profileImageUrl: function() {
            return this.$store.state.profileImageUrl || '';
        },
        profileImageVisibility: function() {
            return this.$store.state.profileImageVisibility || 0;
        },
        visibilityOptions: function() {
            return this.$store.state.visibilityOption || [];
        }
    },
    methods: {
        getProfileImage: function(visibility) {
            this.renderProfileImage = false;
            this.getResourceService().sendFormData('/my_profile/get/image').then(response => {
               if (response.data.success) {
                    this.$store.commit('setProfileImageUrl', response.data.result);
                    if (typeof visibility !== 'undefined') {
                        this.$store.commit('setProfileImageVisibility', visibility);
                    }
                    this.$nextTick(() => {
                        this.renderProfileImage = true;
                    });
               }
            }).catch(console.error);
       },
    },
    template: `
        <div class="profile-summary-wrapper align-items-center cec-px-sm-6 cec-p-4 flex-column position-relative">
            <div class="d-flex justify-content-center align-items-center flex-column text-center mx-auto">
                <div
                    v-if="!$root.$store.state.ownProfileViewed"
                    class="border border-style-dash aspect-ratio-bg-cover cw-icon-160 img-circle"
                    :style="{backgroundImage:'url('+ profileImageUrl +')'}"
                ></div>
                <profile-image v-else-if="renderProfileImage"
                    change-image-resource-id="/my-profile/change-profile-picture"
                    delete-image-resource-id="/my-profile/delete-profile-picture"
                    :editable="true"
                    :preview-url="profileImageUrl"
                    :callback="getProfileImage"
                    image-class="border border-style-dash"
                    :visibility-options="visibilityOptions"
                    :selected-visibility="profileImageVisibility"
                ></profile-image>
                <p class="font-weight-bold text-white mt-4 pt-1 mb-0 font-size-14">
                    {{ personalInformation.screenName }}
                    <template v-if="personalInformation.givenName.text || personalInformation.familyName.text">
                        (<template>
                            {{ personalInformation.givenName.text }}
                            {{ personalInformation.familyName.text }}
                        </template>)
                    </template>
                </p>
                <div v-if="headlineInfo && headlineInfo.text" class="profile-headline border rounded mt-4 cec-p-4 w-100">
                    <q class="text-black font-size-14 mb-0">{{ headlineInfo.text }}</q>
                </div>
            </div>
        </div>
    `
});
