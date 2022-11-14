import orderBy from 'lodash/orderBy';

const ProfileMixin = {
    methods: {
        fetchContactSummary: function() {
            return new Promise((resolve, reject) => {
                this.getResourceService().fetch('/profile/fetch_summary', {
                    urlOptions: {
                        params: {
                            userIdpUuid: this.$store.state.userIdpUuid,
                            previewAs: this.$store.state.previewAs,
                        }
                    }
                }).then(response => {
                    try {
                        if (response.data.success) {
                            const result = JSON.parse(response.data.result);
                            result.emailAddress.items = orderBy(result.emailAddress.items,['accountEmail', 'verified'],['desc', 'desc']);
                            this.setContactSummary(result);
                        }
                        resolve(response);
                    } catch(error) {
                        reject(error);
                    }
                }).catch(reject);
            });
        },
        setContactSummary: function(result) {
            this.$store.commit("setUserProfile", result);
            this.$store.commit('setProfileImageUrl', result.profileImageUrl);
            this.$store.commit('setProfileImageVisibility', result.profileImageVisibility);
            this.$store.commit('setFirstName', result.firstName);
            this.$store.commit('setLastName', result.lastName);
            this.$store.commit('setScreenName', result.screenName);
            let name = result.firstName + ' ' + result.lastName;
            name = name.trim() ? name : result.screenName;
            this.$store.commit('setUserName', name);
            this.$store.commit('setDefaultVisibility', result.defaultVisibility);
        }
    }
}

export default ProfileMixin;
