import cloneDeep from 'lodash/cloneDeep';
import { WarningMessage } from './warning_message.es';
import ContainerWithTitle from './container_with_title.es';
import UserDropdown from 'cw-vuejs-global-components/components/user_dropdown.es';
import { required } from 'vuelidate/dist/validators.min';
import MemberInfoInputs from './member_info_inputs.es';
import { LoadingIndicator } from 'cw-vuejs-global-components/components/loading-indicator.es';
import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';

const RELATIONSHIP_TYPE_SPOUSE = 0, RELATIONSHIP_TYPE_CHILD = 1;
const CHILD_TEMPLATE = {
    givenName: '',
    familyName: '',
    genderKey: '',
    dateOfBirthString: '',
    deletable: true,
    pending: true,
    manualInput: true
};

const EditFamilyInfo = () => ({
    cwComponents: {
        WarningMessage: WarningMessage(),
        UserDropdown: UserDropdown(),
        ContainerWithTitle,
        MemberInfoInputs: MemberInfoInputs(),
        LoadingIndicator: LoadingIndicator(),
        CwDropdown: CwDropdown(),
    },
    data: function() {
        return {
            tempChildren: null,
            tempSpouse: null,
            children: [],
            spouse: null,
            users: [],
            showSpouseInputs: false,
            isLoading: false,
            updating: false,
            confirmOption: {
                title: this.translate('would-you-like-to-send-a-family-request-to-this-user'),
                content: this.translate('note-only-send-a-family-request-to-whom-you-are-related-to'),
                warningIconClass: 'primary',
                confirmButtonText: this.translate('yes-send'),
                confirmButtonClass: 'btn btn-primary',
            },
        }
    },
    mounted: function() {
        const { familyMembers } = this.$store.state.selectedOrganization;
        this.spouse = cloneDeep(familyMembers.find(member => member.relationshipStatusKey == RELATIONSHIP_TYPE_SPOUSE));
        this.children = cloneDeep(familyMembers.filter(member => member.relationshipStatusKey == RELATIONSHIP_TYPE_CHILD));
        this.setTempData();
    },
    validations: {
        spouse: {
            givenName: { required },
            familyName: { required },
            genderKey: { required },
            dateOfBirthString: { required },
        },
        children: {
            $each: {
                givenName: { required },
                familyName: { required },
                genderKey: { required },
                dateOfBirthString: { required },
            }
        }
    },
    computed: {
        enableUpdateButton: function() {
            const valid = (
                (this.childrenUpdated || this.tempSpouse != JSON.stringify(this.spouse)) &&
                !(this.$v.children.$error || this.spouseInfoError) &&
                !this.updating
            );
            this.$parent.$parent.setValidate(!valid);
            return valid;
        },
        spouseInfoError: function() {
            return this.showSpouseInputs && this.$v.spouse.$error;
        },
        organizationItems: function() {
            return this.$store.state.organizations;
        },
        selectedOrganization: function() {
            return this.$store.state.selectedOrganization;
        },
        childrenUpdated: function() {
            return this.tempChildren != JSON.stringify(this.children);
        }
    },
    methods: {
        setTempData: function() {
            this.tempChildren = JSON.stringify(this.children);
            this.tempSpouse = JSON.stringify(this.spouse);
            this.showSpouseInputs = this.spouse && this.spouse.manualInput;
        },
        update: function() {
            this.$v.children.$touch();
            this.$v.spouse.$touch();
            if (this.$v.children.$error || this.spouseInfoError) {
                return;
            }
            this.updating = true;
            this.getActionService().sendFormData('/my_account/family_info/modify', {
                children: JSON.stringify(this.children.map(member => this.cleanInfo(member))),
                spouse: this.spouse ? JSON.stringify(this.cleanInfo(this.spouse)) : '',
                organizationId: this.selectedOrganization.id
            })
            .then(response => {
                const { success, result } = response.data;
                if (success) {
                    this.resetFamilyMembers(JSON.parse(result));
                    this.setTempData();
                    this.$root.isEditMode = true;
                }
            }).finally(() => this.updating = false);
        },
        resetFamilyMembers: function(familyMembers) {
            let selectedOrganization = this.selectedOrganization;
                selectedOrganization.familyMembers = familyMembers;

            this.$store.commit('setSelectedOrganization', selectedOrganization);
            this.spouse = cloneDeep(familyMembers.find(member => member.relationshipStatusKey == RELATIONSHIP_TYPE_SPOUSE));
        },
        cleanInfo: function(member) {
            return {
                id: member.id,
                givenName: member.givenName,
                familyName: member.familyName,
                genderKey: member.genderKey,
                dateOfBirthString: member.dateOfBirthString,
                manualInput: member.manualInput,
            };
        },
        searchUsers: function(keywords) {
            this.isLoading = true;
            this.getResourceService().fetch('/organization_connection/search', {
                urlOptions: { params: {
                    keywords,
                    organizationId: this.selectedOrganization.id
                }}
            })
            .then(response => {
                const { success, result } = response.data;
                if (success) {
                    this.users = result;
                }
            })
            .finally(() => this.isLoading = false);
        },
        addOtherChild: function() {
            this.$nextTick(() => { this.$v.$reset() });
            this.children.push(cloneDeep(CHILD_TEMPLATE));
        },
        showSpouseForm: function() {
            this.$nextTick(() => { this.$v.$reset() });
            this.spouse = this.tempSpouse ? JSON.parse(this.tempSpouse) : cloneDeep(CHILD_TEMPLATE);
            this.spouse.manualInput = this.showSpouseInputs = true;
        },
        showSpouseSelection: function() {
            this.spouse = undefined;
            this.showSpouseInputs = false;
        },
        sendConnectionRequest: function() {
            let { tempSpouse } = this;
            tempSpouse = tempSpouse ? JSON.parse(tempSpouse) : '';
            this.getActionService().sendFormData('/user_spouse/request', {
                userId: this.spouse.id,
                familyDetailId: tempSpouse && tempSpouse.manualInput ? tempSpouse.id : 0,
                organizationId: this.selectedOrganization.id
            }).then(response => {
                const { success, result } = response.data;
                if (success) {
                    this.resetFamilyMembers(JSON.parse(result));
                    if (!this.childrenUpdated) {
                        this.setTempData();
                    }
                }
            });
        },
        removeSpouseRequest: function() {
            const { spouse } = this;
            if (!spouse || !spouse.pending || spouse.manualInput) {
                return;
            }
            this.getActionService().sendFormData('/user_spouse/remove_request', {
                familyDetailId: spouse.id
            }).then(response => {
                const { success, result } = response.data;
                if (success) {
                    this.resetFamilyMembers(JSON.parse(result));
                    this.showSpouseSelection();
                    if (!this.childrenUpdated) {
                        this.setTempData();
                    }
                }
            });
        },
    },
    template: `
        <div class="edit-family-info-wrapper">
            <warning-message icon="warning-info" label="information-on-this-page-can-be-viewd-and-edited-by-your-organization" css-wrapper="cec-mt-n2 cec-mt-sm-0"></warning-message>
            <div v-if="organizationItems.length > 1" class="cec-px-6 cec-pt-6">
                <label>{{ translate('your-organization') }}</label>
                <cw-dropdown
                    :value="selectedOrganization.id"
                    :items="organizationItems"
                    :require-item="true"
                    :change-icon-on-mobile="false"
                    @change="$store.commit('setSelectedOrganization', $event)"
                    class-wrapper="mw-sm-200"
                ></cw-dropdown>
            </div>
            <container-with-title title="family" wrapper-class="profile border-bottom border-bottom-style-dash">
                <div class="spouse-section row">
                    <div class="cec-pt-4 col-12">
                        <label>{{ translate('spouse-account') }}</label>
                        <span v-if="!showSpouseInputs" class="d-md-inline-flex d-none text-grey">
                            <i>({{ translate('this-user-will-be-able-to-view-your-child-medical-record') }})</i>
                        </span>
                    </div>
                    <span v-if="!showSpouseInputs" class="d-md-none d-flex text-grey font-size-12 cec-px-4 cec-pb-2">
                        <i>({{ translate('this-user-will-be-able-to-view-your-child-medical-record') }})</i>
                    </span>
                    <div v-if="showSpouseInputs" class="col-12 cec-pt-2">
                        <member-info-inputs
                            :validator="$v.spouse"
                            :child="spouse"
                            :is-spouse="true"
                            @remove="showSpouseSelection"
                        ></member-info-inputs>
                        <a href="javascript:;" class="text-decoration-none" @click="showSpouseSelection">{{ translate('this-person-already-has-an-account') }}</a>
                    </div>
                    <template v-else>
                        <div :class="[!spouse || spouse.pending ? 'col-md-5 col-12' : 'col-12']">
                            <template v-if="!spouse">
                                <user-dropdown
                                    v-model="spouse"
                                    placeholder="select-from-your-connections"
                                    :users="users"
                                    :show-confirm-popup="true"
                                    :confirm-option="confirmOption"
                                    @input="sendConnectionRequest"
                                    @search="searchUsers"
                                    :is-loading="isLoading"
                                ></user-dropdown>
                                <div class="cec-py-3">
                                    <a href="javascript:;" class="text-decoration-none" @click="showSpouseForm">{{ translate('this-person-doesnt-have-an-account') }}</a>
                                </div>
                            </template>
                            <template v-else>
                                <div class="p-1 d-flex align-items-center" :class="[spouse.pending ? 'pl-2 border rounded' : 'pl-0']">
                                    <div v-background-lazyload :data-url="spouse.profileImageUrl" class="aspect-ratio-bg-cover img-circle spouse-profile-image"></div>
                                    <span class="font-weight-bold ml-2">{{ spouse.name }}</span>
                                </div>
                                <div v-if="!spouse.pending" class="d-flex align-items-center cec-pt-3">
                                    <cw-svg-icon :icon-url="svgIconUrl('square-info')" css-class="cw-icon-md"/>
                                    <span class="text-grey ml-2">{{ translate('currently-you-cannot-remove-spouse-account') }}</span>
                                </div>
                                <div v-else class="font-size-12 text-lowercase text-grye mt-2"><i>({{ translate('pending-request') }})</i></div>
                            </template>
                        </div>
                        <div v-if="spouse && spouse.pending" class="col-2 pt-2 d-none d-md-flex">
                            <span @click="removeSpouseRequest" class="cursor-pointer">
                                <cw-svg-icon :icon-url="svgIconUrl('remove-bucket')" css-class="cw-icon-sm"/>
                            </span>
                        </div>
                        <div v-if="spouse && spouse.pending" class="col-12 d-md-none d-flex">
                            <button
                                class="btn btn-outline-primary w-100"
                                @click="removeSpouseRequest"
                            >{{ translate('remove-spouse') }}</button>
                        </div>
                    </template>
                </div>
                <div class="cec-mt-6 cec-pt-6 border-top border-top-style-dash">
                    <div class="title">
                        <span class="font-size-22 font-weight-light text-black">{{ translate('children-s-information') }}</span>
                    </div>
                    <div v-for="(child, index) in children" class="row cec-pt-3" :key="'child-' + index">
                        <div v-if="index > 0" class="col-12 cec-pb-5"><div class="border-top border-top-style-dash"></div></div>
                        <div class="col-12">
                            <member-info-inputs
                                :validator="$v.children.$each[index]"
                                :child="child"
                                @remove="children.splice(index, 1)"
                            ></member-info-inputs>
                        </div>
                        <div class="col-12 mb-3">
                            <div v-if="!child.deletable" class="d-flex align-items-center">
                                <div><cw-svg-icon :icon-url="svgIconUrl('square-info')" css-class="cw-icon-md"/></div>
                                <span class="text-grey ml-2">{{ translate('children-information-containing-medical-records-cant-be-deleted') }}</span>
                            </div>
                        </div>
                    </div>
                    <cw-button-link
                        :css-wrapper="{'cec-pt-3': !children.length}"
                        css-class="cec-pt-sm-0 cec-pt-3"
                        :label="translate('add-another-child')"
                        @action="addOtherChild"
                        icon-name="add-circle"
                    ></cw-button-link>
                </div>
            </container-with-title>
            <div class="d-flex justify-content-end cec-p-6">
                <button
                    :disabled="!enableUpdateButton"
                    class="btn btn-primary text-uppercase min-width-257 w-sm-100"
                    @click="update"
                >{{ translate('update-family') }}</button>
            </div>
            <loading-indicator :is-loading="updating" css-wrapper="position-absolute z-index-10"></loading-indicator>
        </div>
    `
});

export default EditFamilyInfo;
