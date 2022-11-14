import { enableRipple } from '@syncfusion/ej2-base';
import { CwContextFactory } from 'cw-vuejs-global-components/utils/cw_context.es';
import ImageBackgroundLazyLoad from 'cw-vuejs-global-components/directives/image_background_lazy_load.es';
import  { Toast } from 'cw-vuejs-global-components/components/toast.es';
import Vuelidate from 'vuelidate/dist/vuelidate.min';

import { PREVIEW_AS_CONNECTION, PREVIEW_AS_ORG, PREVIEW_AS_ANYONE } from 'cw-vuejs-global-components/components/profile/profile_constance.es'
import { ViewProfile } from './components/view_profile.es';
import { EditProfile } from './components/edit_profile.es';
import { ProfileSettingSidebar } from './components/profile_setting_sidebar.es';
import ProfileMixin from './mixins/profile_mixin.es';
import { PortletMixin } from 'cw-vuejs-global-components/mixins/portlet.es';

enableRipple(true);

const MY_CONNECTION_AND_ORGANIZATION = 4;

export default new CwContextFactory(function(cwc) {
    cwc.directive('background-lazyload', ImageBackgroundLazyLoad);
    cwc.use(Vuelidate);

    cwc.createVue({
        el: cwc.getElement('root'),
        mixins: [
            ProfileMixin,
            PortletMixin,
        ],
        cwComponents: {
            ViewProfile: ViewProfile(),
            EditProfile: EditProfile(),
            Toast: Toast(),
            ProfileSettingSidebar: ProfileSettingSidebar(),
        },
        vuex: {
            state: {
                userIdpUuid: cwc.getData('userIdpUuid'),
                showOrganizationTab: false,
                hideFamilyRelationship: false,
                previewAs: cwc.getData('previewAs'),
                expertise: {
                    certificates: {
                        visibility: 1,
                    },
                },
                ownProfileViewed: false,
                connectionProfileViewed: false,
                orgMemberProfileViewed: false,
                anyOneProfileViewed: false,
                copList: [],
                userName: '',
                firstName: '',
                lastName: '',
                screenName: '',
                visibilityOption: [],
                userProfile: {
                    id: 0,
                    addressList: [],
                    phoneList: [],
                    isTempProfileData: true,
                    children: [],
                },
                options: {},
                profileImageUrl: '',
                profileImageVisibility: 0,
                communityInfo: {},
                isEmptyUserInfo: true,
                country: {
                    isTempData: true,
                    items: []
                },
                organizations: [],
                qualifyOrganizations: [],
                selectedProfileOrganization: {},
                selectedOrganization: {
                    name: '',
                    imgUrl: '',
                    member: {
                        status: { text: '' },
                        group: { text: '' },
                        subGroup: { text: '' },
                    },
                    orgUnits:[],
                    homeOrg: null,
                    hostOrg: null,
                },
                defaultVisibility: null
            },
            mutations: {
                setOrganizations: (state, organizations) => state.organizations = organizations,
                setHideFamilyRelationship: (state, option) => state.hideFamilyRelationship = option,
                setSelectedProfileOrganization: (state, organization) => state.selectedProfileOrganization = organization,
                setQualifyOrganizations: (state, organizations) => state.qualifyOrganizations = organizations,
                setSelectedOrganization: (state, organization) => state.selectedOrganization = organization,
                setShowOrganizationTab(state, showOrganizationTab) {
                    state.showOrganizationTab = showOrganizationTab;
                },
                setCountry(state, country) {
                    state.country = country;
                },
                setProfileImageUrl(state, imageUrl) {
                    state.profileImageUrl = imageUrl;
                    if(state.ownProfileViewed) {
                        const globalNavigationProfileImage = document.getElementById('global-navigation-profile-image');
                        if (globalNavigationProfileImage) {
                            globalNavigationProfileImage.src = imageUrl;
                        }
                    }
                },
                setProfileImageVisibility(state, visibility) {
                    state.profileImageVisibility = visibility;
                },
                setCopList(state, copList) {
                    state.copList = copList;
                },
                setExpertise(state, expertise) {
                    state.expertise = expertise;
                },
                setFirstName(state, firstName) {
                    state.firstName = firstName;
                },
                setLastName(state, lastName) {
                    state.lastName = lastName;
                },
                setScreenName(state, screenName) {
                    state.screenName = screenName;
                },
                setUserName(state, userName) {
                    state.userName = userName;
                },
                setVisibilityOptions(state, options) {
                        state.visibilityOption = options.map(item => {
                            if (!state.userProfile.hasValidSubscription && item.key != MY_CONNECTION_AND_ORGANIZATION) {
                                item.disabled = true;
                            }
                            return item;
                        });
                },
                setViewMode(state, viewMode) {
                    if (state.previewAs && viewMode.ownProfileViewed) {
                        state.ownProfileViewed = false;
                        state.connectionProfileViewed = state.previewAs == PREVIEW_AS_CONNECTION;
                        state.orgMemberProfileViewed = state.previewAs == PREVIEW_AS_ORG;
                        state.anyOneProfileViewed = this.state.previewAs == PREVIEW_AS_ANYONE;
                    } else {
                        state.ownProfileViewed = viewMode.ownProfileViewed;
                        state.connectionProfileViewed = viewMode.connectionProfileViewed;
                        state.orgMemberProfileViewed = viewMode.orgMemberProfileViewed;
                        state.anyOneProfileViewed = viewMode.anyOneProfileViewed;
                    }
                },
                setUserProfile(state, userProfile) {
                    state.userProfile = userProfile;
                },
                setOptions(state, options) {
                    state.options = options;
                },
                setCommunityInfo(state, communityInfo) {
                    state.communityInfo = communityInfo;
                },
                setIsEmptyUserInfo(state, isEmptyUserInfo) {
                    state.isEmptyUserInfo = isEmptyUserInfo;
                },
                setDefaultVisibility(state, defaultVisibility) {
                    state.defaultVisibility = defaultVisibility;
                }
            },
            getters: {
                getSingleName: state => state.firstName || state.lastName || state.screenName,
            }
        },
        created: function() {
            this.getHideFamilyRelationshipOption();
            this.fetchContactSummary()
                .then(response => {
                    this.fetchViewMode();
                    this.checkUserInfo(JSON.parse(response.data.result));
                }).catch(console.error);
            this.fetMainOrganizations();
            this.fetchExpertise();
        },
        data: function() {
            return {
                isEditMode: false,
                componentName: '',
                isLoading: false,
            }
        },
        methods: {
            initCountry: function(isOwner) {
                if (isOwner) {
                    this.asyncCountries('key').then(countries => {
                        this.$store.commit('setCountry', { items: countries });
                    }).catch(console.error);
                } else {
                    this.$store.commit('setCountry', { items: [] });
                }
            },
            openSetting: function() {
                this.$refs.setting.toggle();
            },
            onSwitchMode: function(componentName) {
                if (this.componentName == 'familyInfo' && componentName == 'profileDetail') {
                    this.fetMainOrganizations();
                }
                this.componentName = componentName;
                this.isEditMode = !this.isEditMode;
            },
            fetchViewMode: function() {
                this.getResourceService().fetch('/profile/view_mode/fetch', {
                    urlOptions: {
                        params: {
                            userIdpUuid: this.$store.state.userIdpUuid,
                        }
                    }
                })
                .then(response => {
                    if (response.data.success) {
                        const viewMode = JSON.parse(response.data.result);
                        this.$store.commit('setViewMode', viewMode);
                        this.initCountry(viewMode.ownProfileViewed);
                        if (viewMode.ownProfileViewed) {
                            this.fetchOptions();
                        }
                    }
                }).catch(console.error);
            },
            fetchOptions: function() {
                this.getResourceService().sendFormData('/my_profile/get/options')
                .then(response => {
                    if (response.data.success) {
                        const result = JSON.parse(response.data.result);
                        this.$store.commit('setOptions', result);
                        this.$store.commit('setVisibilityOptions', result.visibilityOptions);
                    }
                }).catch(console.error);
            },
            showSuccessToast: function(key, link = '') {
                this.$refs.toasted.show('green-checked-circle', key, link);
            },
            showFailedToast: function(key) {
                this.$refs.toasted.show('warning-circle', key);
            },
            fetchExpertise: function() {
                this.getResourceService().fetch('/profile/fetch_expertise', {
                        urlOptions: {
                            params: {
                                userIdpUuid: this.$store.state.userIdpUuid,
                                previewAs: this.$store.state.previewAs
                            }
                        }
                    }).then((response) => {
                        if (response.data.success) {
                            this.$store.commit('setExpertise', JSON.parse(response.data.result));
                        }
                    })
                    .catch(console.error);
            },
            checkUserInfo: function(userProfile) {
                const moreInfo = userProfile.moreInformation;
                const isEmpty = this.isEmpty(moreInfo.company) &&
                    this.isEmpty(moreInfo.dateOfBirth) &&
                    this.isEmpty(moreInfo.gender) &&
                    this.isEmpty(moreInfo.givenLegalName) &&
                    this.isEmpty(moreInfo.jobTitle) &&
                    this.isEmpty(moreInfo.position) &&
                    this.isEmpty(moreInfo.socialMedia.items) &&
                    this.isEmpty(moreInfo.webSite.items);

                this.$store.commit('setIsEmptyUserInfo', isEmpty);
            },
            isEmpty: function(object) {
                if(Array.isArray(object)) {
                    for(let index in object) {
                        if(object[index].visibility == 0) return true;
                    }
                } else {
                    return object.visibility == 0;
                }
            },
            fetMainOrganizations: function() {
                this.isLoading = true;
                 const { userIdpUuid } = this.$store.state;
                 this.getResourceService().fetch('/profile/organizations/fetch', {
                    urlOptions: {
                        params: {
                            userIdpUuid
                        }
                    }
                 }).then((response) => {
                    if (response.data.success) {
                        const result = JSON.parse(response.data.result);
                        const qualifyOrganizations = this.getQualifyOrganizations(result);
                        this.$store.commit('setOrganizations', result);
                        this.$store.commit('setSelectedOrganization', result[0]);
                        if (qualifyOrganizations.length) {
                            this.$store.commit('setQualifyOrganizations', qualifyOrganizations);
                            this.$store.commit('setSelectedProfileOrganization', qualifyOrganizations[0]);
                            this.$store.commit('setShowOrganizationTab', true);
                        }
                    }
                    this.isLoading = false;
                }).catch(error => {
                    this.isLoading = false;
                    console.error(error);
                });
            },
            getHideFamilyRelationshipOption: function() {
                this.getResourceService().fetch('/profile/family_relationship/hide_option')
                .then(response => {
                    const { result, success } = response.data;
                    if (success) {
                        this.$store.commit('setHideFamilyRelationship', result);
                    }
                });
            },
            getQualifyOrganizations: function(organizations) {
                return organizations.filter(organization => {
                    return (
                        (organization.orgUnits && organization.orgUnits.length) ||
                        (organization.homeOrg && organization.homeOrg.length) ||
                        (organization.hostOrg && organization.hostOrg.length)
                    );
                });
            },
        }
    });
});
