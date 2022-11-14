import VisibilityDropdown from 'cw-vuejs-global-components/components/profile/visibility_dropdown.es';
import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';
import ContainerWithTitle from './container_with_title.es';
import { required, email } from 'vuelidate/dist/validators.min';
import ErrorMessage from './error_message.es';
import { PhoneDisplayItem } from 'cw-vuejs-global-components/components/phone_display_item.es';
import PhoneInput from 'cw-vuejs-global-components/components/phone_input.es';
import ProfileImage from 'cw-vuejs-global-components/components/profile_image.es';
import { Toast } from 'cw-vuejs-global-components/components/toast.es';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import ProfileMixin from './../mixins/profile_mixin.es';
import { LoadingIndicator } from 'cw-vuejs-global-components/components/loading-indicator.es';
import { WarningMessage } from './warning_message.es';
import PreferredItem from './preferred_item.es';
import isEqual from 'lodash/isEqual';

const EMAIL_ITEM_TEMPLATE = {
    text: '',
    isNew: true,
    deleted: false,
    verified: false,
    profileId: 0
};

const VISIBILITY_ONLY_ME_KEY = 1;

const EditContactInfo = () => ({
    props: {
        validate: { type: Function, default: () => null }
    },
    mixins: [
        ProfileMixin
    ],
    cwComponents: {
        VisibilityDropdown: VisibilityDropdown(),
        ProfileImage: ProfileImage(),
        ContainerWithTitle,
        CwDropdown: CwDropdown(),
        ErrorMessage,
        PhoneDisplayItem,
        PhoneInput: PhoneInput(),
        LoadingIndicator: LoadingIndicator(),
        WarningMessage: WarningMessage(),
        PreferredItem,
        Toast: Toast(),
    },
    data: function() {
        return {
            isUpdating: false,
            renderProfileImage: true,
            country: {
                isTempData: true,
                items: []
            },
            tempContactInfo: '',
            contactInfo: {
                isTempProfileData: true,
                personalInformation: {
                    givenName: {},
                    familyName: {},
                    screenName: '',
                },
                emailAddress: {
                    items: []
                },
                address: {
                    items: []
                },
                phone: {
                    items: []
                },
            },
            screenNameValidator: {
                invalid: false,
                duplicated: false,
                couldNotUpdate: false,
                errorMessage: ''
            },
            screenNameTooltip: {
                title: this.translate(this.$store.state.options.screenNameModifiedDayCount > 1 ? 'your-screen-name-can-only-be-changed-every-x-days' :
                       'your-screen-name-can-only-be-changed-every-x-day', this.$store.state.options.screenNameModifiedDayCount),
                icon: 'info-new',
                cssClass: 'screenName-tooltip-wrapper ml-1'
            },
            isScreenNameUpdating: false,
            phoneItemTemplate: {
                itemId: 0,
                profileId: 0,
                visibility: this.$store.state.defaultVisibility,
                preferred: false,
                countryCallingCode: '',
                text: '',
                formattedText: '',
                type: 3,
                isNew: true,
                deleted: false,
                valid: true,
            },
            addressItemTemplate: {
                addressItemId: 0,
                addressLine1: '',
                addressLine2: '',
                city: '',
                countryId: '0',
                postalCode: '',
                state: '',
                preferred: false,
                type: '0',
                visibility: this.$store.state.defaultVisibility,
                isNew: true,
                deleted: false
            }
        }
    },
    computed: {
        typeOption: function() {
            return this.$store.state.options || {};
        },
        visibilityTypes: function() {
            return this.$store.state.visibilityOption || [];
        },
        emailVisibilityTypes: function() {
            const emailVisibilityTypes = cloneDeep(this.$store.state.visibilityOption || []);
            return emailVisibilityTypes.map(item => {
                if (item.key == VISIBILITY_ONLY_ME_KEY) {
                    item.disabled = false;
                }
                return item;
            });
        },
        emailTypes: function() {
            return this.typeOption.emailTypes || [];
        },
        addressTypes: function() {
            return this.typeOption.addressTypes || [];
        },
        phoneTypes: function() {
            return this.typeOption.phoneTypes || [];
        },
        profileImageUrl: function() {
            return this.$store.state.profileImageUrl || '';
        },
        hasChange: function() {
            return this.tempContactInfo !== JSON.stringify(this.contactInfo);
        },
        updatable: function() {
            let updatable = (
                !this.$v.contactInfo.$error &&
                !this.inValidPhoneNumber &&
                !this.errorScreenName &&
                !this.isScreenNameUpdating
            );
            updatable = updatable && this.hasChange;
            this.validate(!updatable || this.isUpdating);
            return updatable;
        },
        inValidPhoneNumber: function() {
            return this.contactInfo.phone.items.filter(item => item.valid === false && !item.deleted).length;
        },
        errorScreenName: function() {
            return (
                this.$v.contactInfo.personalInformation.screenName.$error ||
                this.screenNameValidator.invalid ||
                this.screenNameValidator.duplicated ||
                this.screenNameValidator.couldNotUpdate
            );
        },
        screenNameErrorMessage: function() {
            return this.$v.contactInfo.personalInformation.screenName.$error ? 'this-field-is-required' : this.screenNameValidator.errorMessage;
        },
        profileImageVisibility: function() {
            return this.$store.state.profileImageVisibility || 0;
        },
    },
    validations: {
        contactInfo: {
            personalInformation: {
                givenName: {
                    text: { required }
                },
                familyName: {
                    text: { required }
                },
                screenName: { required }
            },
            emailAddress: {
                items: {
                    $each: {
                        text: { email }
                    }
                }
            }
        }
    },
    created: function() {
        this.initContactInfo();
        this.initCountry();
    },
    methods: {
        initCountry: function() {
            this.country = this.$store.state.country;
            if (this.country.isTempData) {
                setTimeout(this.initCountry, 10);
            }
        },
        initContactInfo: function() {
            this.contactInfo = cloneDeep(this.$store.state.userProfile);
            this.tempContactInfo = JSON.stringify(this.contactInfo);
            if (this.contactInfo.isTempProfileData) {
                setTimeout(this.initContactInfo, 10);
            }
        },
        onScreenNameChange: function() {
            this.isScreenNameUpdating = true;
            this.showScreenNameTooltip();
            this.validateScreenName();
        },
        validateScreenName: debounce(function() {
            this.getResourceService().sendFormData('isScreenNameValid', {
                screenName: this.contactInfo.personalInformation.screenName
            }).then(response => {
                if (response.data.success) {
                    const result = response.data.result.JSONObject;
                    this.screenNameValidator.invalid = result.invalid;
                    this.screenNameValidator.duplicated = result.duplicated;
                    this.screenNameValidator.couldNotUpdate = result.couldNotUpdate;
                    this.screenNameValidator.errorMessage = result.errorMessage;
                }
            }).catch(console.error)
            .finally(() => this.isScreenNameUpdating = false);
        }, 500),
        showScreenNameTooltip: function(show = true) {
            const tooltipBody = $('.screenName-tooltip-wrapper .tooltip-body');
            if (tooltipBody) {
                if (show) {
                    tooltipBody.removeClass('d-none');
                } else {
                    tooltipBody.addClass('d-none');
                }
            }
        },
        onScreenNameBlur: function() {
            this.$v.contactInfo.personalInformation.screenName.$touch();
            this.showScreenNameTooltip(false);
        },
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
        onRadioChange: function(items = [], index) {
            items.forEach((item, ind) => {
                if (ind != index) {
                    item.preferred = false;
                }
            });
        },
        addEmailAddressItem: function() {
            this.contactInfo.emailAddress.items.push(Object.assign({}, EMAIL_ITEM_TEMPLATE));
        },
        addPhoneItem: function() {
            this.contactInfo.phone.items.push(Object.assign({}, this.phoneItemTemplate))
        },
        addAddressItem: function() {
            this.contactInfo.address.items.push(Object.assign({}, this.addressItemTemplate));
        },
        checkValidation: function() {
            this.$v.contactInfo.$touch();
        },
        update: function() {
            this.checkValidation();
            if (!this.updatable) {
                return;
            }

            this.setUpdateStatus(true);
            const { personalInformation, emailAddress, phone, address } = this.contactInfo;
            const contactInfo = {
                givenName: personalInformation.givenName,
                familyName: personalInformation.familyName,
                screenName: personalInformation.screenName,
                headline: this.contactInfo.headlineInfo,
                email: this.getEntry(emailAddress),
                phone: this.getEntry(phone),
                address: this.getEntry(address)
            };

            const tempInfo = JSON.parse(this.tempContactInfo);

            this.getResourceService().sendFormData('/profile/contact_info/modify', {
                contactInfo: JSON.stringify(contactInfo),
                giveNameChanged: !isEqual(tempInfo.personalInformation.givenName.text, personalInformation.givenName.text),
                givenNameVisibilityChanged: !isEqual(tempInfo.personalInformation.givenName.visibility, personalInformation.givenName.visibility),
                familyNameChanged: !isEqual(tempInfo.personalInformation.familyName.text, personalInformation.familyName.text),
                familyNameVisibilityChanged: !isEqual(tempInfo.personalInformation.familyName.visibility, personalInformation.familyName.visibility),
                screenNameChanged: !isEqual(tempInfo.personalInformation.screenName, personalInformation.screenName),
                headlineChanged: !isEqual(tempInfo.headlineInfo, contactInfo.headline),
                emailChanged: !isEqual(tempInfo.emailAddress, emailAddress),
                phoneChanged: !isEqual(tempInfo.phone, phone),
                addressChanged: !isEqual(tempInfo.address, address)
            }).then(response => {
                if (response.data.success) {
                    this.showSuccessToast();
                    this.setContactSummary(JSON.parse(response.data.result));
                    this.initContactInfo();
                } else {
                    this.showFailedToast();
                }
                this.setUpdateStatus(false);
            }).catch(error => {
                this.setUpdateStatus(false);
                console.error(error);
                this.showFailedToast();
            });
        },
        showSuccessToast: function() {
            this.$root.showSuccessToast('profile.update-contact-success-message');
        },
        showFailedToast: function() {
            this.$root.showFailedToast('profile.update-contact-failed-message');
        },
        setUpdateStatus: function(isUpdating) {
            this.isUpdating = isUpdating;
            this.validate(isUpdating);
        },
        getEntry: function(data = {}) {
            const entry = cloneDeep(data);
            entry.items = (entry.items || []).filter(item => !(item.isNew && item.deleted));
            entry.items.forEach(item => {
                item.valid = undefined;
                item.isNew = undefined;
                item.stateAndCountry = undefined;
            });
            return { items: entry.items };
        },
        removeItem: function(key, item, index) {
            item.deleted = true;
            if (key == 'emailAddress') {
                this.$v.contactInfo[key].items.$each[index].$reset();
            }
            if (item.isNew) {
                this.contactInfo[key].items.splice(index, 1);
            }
        },
        verifyEmail: function(email, isValidEmail) {
            if (isValidEmail) {
                this.getResourceService().sendFormData('/profile/email/verify', {
                    email: email.text,
                    profileId: email.profileId
                }).then(response => {
                    if (response.data.success) {
                        email.profileId = response.data.result;
                        email.isNew = false;

                        this.$refs.toasted.show('green-checked-circle', 'verification-email-sent-please-check-your-email-inbox');
                    }
                }).catch(console.error);
            }
        },
    },
    template: `
        <div class="edit-contact-info position-relative" v-if="visibilityTypes.length && !country.isTempData && !this.contactInfo.isTempProfileData">
            <warning-message icon="warning-info" label="visibility-warning-message-before-publish-profile" css-wrapper="cec-mt-n2 cec-mt-sm-0"></warning-message>
            <warning-message v-if="!contactInfo.hasValidSubscription" icon="warning-info" label="note-visibility-premium-feature" css-wrapper="mt-2"></warning-message>
            <container-with-title title="profile" wrapper-class="profile border-bottom border-bottom-style-dash">
                <div class="row">
                    <div class="col-12 col-lg-3 mb-3 mb-lg-0">
                        <div class="profile-image d-flex">
                            <profile-image v-if="renderProfileImage"
                                change-image-resource-id="/my-profile/change-profile-picture"
                                delete-image-resource-id="/my-profile/delete-profile-picture"
                                :editable="true"
                                :preview-url="profileImageUrl"
                                :callback="getProfileImage"
                                image-class="border border-style-dash"
                                :visibility-options="visibilityTypes"
                                :selected-visibility="profileImageVisibility"
                            ></profile-image>
                        </div>
                    </div>
                    <div class="col-12 col-lg-9">
                        <div class="row">
                            <div class="col-12 col-lg-6 form-group">
                                <error-message
                                    :error="$v.contactInfo.personalInformation.givenName.text.$error"
                                    message="this-field-is-required"
                                >
                                    <visibility-dropdown
                                        placeholder="who-can-see-this"
                                        label="given-name"
                                        :items="visibilityTypes"
                                        v-model="contactInfo.personalInformation.givenName.visibility"
                                    >
                                        <input
                                            type="text"
                                            class="form-control shadow-none"
                                            v-model="contactInfo.personalInformation.givenName.text"
                                            @blur="$v.contactInfo.personalInformation.givenName.text.$touch()"
                                        ></input>
                                    </visibility-dropdown>
                                </error-message>
                            </div>
                            <div class="col-12 col-lg-6 form-group">
                                <error-message
                                    :error="$v.contactInfo.personalInformation.familyName.text.$error"
                                    message="this-field-is-required"
                                >
                                    <visibility-dropdown
                                        placeholder="who-can-see-this"
                                        label="family-name"
                                        :items="visibilityTypes"
                                        v-model="contactInfo.personalInformation.familyName.visibility"
                                    >
                                        <input
                                            type="text"
                                            class="form-control shadow-none"
                                            v-model="contactInfo.personalInformation.familyName.text"
                                            @blur="$v.contactInfo.personalInformation.familyName.text.$touch()"
                                        ></input>
                                    </visibility-dropdown>
                                </error-message>
                            </div>
                            <div class="col-12 col-lg-6">
                                <error-message
                                    label="screen-name"
                                    error-message-wrapper="cec-mb-1"
                                    :error="errorScreenName"
                                    :message="screenNameErrorMessage"
                                    :tooltip="screenNameTooltip"
                                >
                                    <input
                                        :disabled="!contactInfo.couldUpdateScreenName"
                                        type="text"
                                        class="form-control shadow-none cec-mb-2"
                                        v-model="contactInfo.personalInformation.screenName"
                                        @blur="onScreenNameBlur"
                                        @input="onScreenNameChange"
                                    ></input>
                                </error-message>
                                <p class="text-gray mb-0">{{ translate('profile.screen-name-visibility-notice') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </container-with-title>
            <container-with-title title="about-yourself" wrapper-class="border-bottom border-bottom-style-dash">
                <visibility-dropdown
                    placeholder="who-can-see-this"
                    label="headline"
                    :items="visibilityTypes"
                    v-model="contactInfo.headlineInfo.visibility"
                >
                    <input type="text" class="form-control d-none d-lg-block" maxlength="75" v-model="contactInfo.headlineInfo.text" />
                    <textarea class="form-control d-lg-none" maxlength="75" rows="3" v-model="contactInfo.headlineInfo.text"></textarea>
                </visibility-dropdown>
            </container-with-title>
            <container-with-title title="contact">
                <template v-for="(email, index) in contactInfo.emailAddress.items">
                    <div v-if="!email.deleted && (email.verified || email.accountEmail)" class="row">
                        <div class="col-12 col-lg-5 form-group" :class="{ 'mb-0' : email.accountEmail }">
                            <error-message
                                :label="email.accountEmail ? 'account-email' : 'contact-email'"
                                :error="$v.contactInfo.emailAddress.items.$each[index].text.$error"
                                message="please-enter-a-correct-email"
                            >
                                <input
                                    readOnly
                                    type="text"
                                    class="form-control shadow-none pl-0 border-0 bg-transparent"
                                    v-model="email.text"
                                ></input>
                            </error-message>
                        </div>
                        <div class="col-12 col-lg-4 form-group">
                            <visibility-dropdown
                                placeholder="who-can-see-this"
                                :label="email.accountEmail ? '' : 'type'"
                                :items="emailVisibilityTypes"
                                :show-label="email.accountEmail"
                                :label-css-wrapper="{ 'd-none d-md-block mb-3 pb-1' : email.accountEmail }"
                                :dropdown-css-wrapper="{ 'pt-md-2 mt-md-1' : email.accountEmail }"
                                v-model="email.visibility"
                            >
                                <div
                                    v-if="email.accountEmail"
                                    class="cw-dropdown flex-grow-1 border border-left-0 border-top-0 border-bottom-0">
                                </div>
                                <cw-dropdown
                                    v-else
                                    :items="emailTypes"
                                    :value="email.type"
                                    :change-icon-on-mobile="false"
                                    class-wrapper="flex-grow-1"
                                    @change="email.type = $event"
                                ></cw-dropdown>
                            </visibility-dropdown>
                        </div>
                        <div class="col-12 col-lg-3">
                            <preferred-item
                                wrapper-class="preferred-radio-wrapper d-md-flex text-dark form-group"
                                :item="email"
                                :show-remove-button="!email.accountEmail"
                                radio-name="preferred-email-address"
                                remove-button-text="delete-this-email"
                                @on-radio-change="onRadioChange(contactInfo.emailAddress.items, index)"
                                @remove="removeItem('emailAddress', email, index)"
                            ></preferred-item>
                        </div>
                    </div>
                    <div v-if="!email.deleted && !email.verified" class="row">
                        <div class="col-lg-8 form-group">
                            <template v-if="email.isNew">
                                <error-message
                                    label="contact-email"
                                    :error="$v.contactInfo.emailAddress.items.$each[index].text.$error"
                                    message="please-enter-a-correct-email"
                                >
                                    <input
                                        type="text"
                                        class="form-control shadow-none"
                                        :placeholder="translate('please-enter-your-email-here')"
                                        @blur="$v.contactInfo.emailAddress.items.$each[index].text.$touch()"
                                        @input="$v.contactInfo.emailAddress.items.$each[index].text.$reset()"
                                        v-model.trim="email.text"
                                    ></input>
                                    <span v-if="!$v.contactInfo.emailAddress.items.$each[index].text.$error && email.text" class="text-gray">
                                        {{ translate('a-verification-email-will-send-to-the-above-email') }}
                                    </span>
                                </error-message>
                            </template>
                            <template v-else>
                                <span class="text-black">{{ email.text }}&nbsp;
                                    <i class="text-gray">({{ translate('unverified') }})</i>
                                </span>
                            </template>
                        </div>
                        <div :class="[{'cec-pt-lg-6': email.isNew}, 'col-lg-4 form-group']">
                            <div class="row">
                                <div class="col-md-9 text-center">
                                    <button :disabled="!email.text"
                                        v-if="email.isNew" class="btn btn-primary w-100 sm-down--width-100"
                                        @click="verifyEmail(email, !$v.contactInfo.emailAddress.items.$each[index].text.$error)"
                                    >
                                        {{ translate('verify') }}
                                    </button>
                                    <a v-else href="javascript:;" class="text-primary cursor-pointer text-decoration-none"
                                        @click="verifyEmail(email, !$v.contactInfo.emailAddress.items.$each[index].text.$error)"
                                    >
                                        {{ translate('resend-verification-email') }}
                                    </a>
                                </div>
                                <div class="col-md-3 align-self-center text-dark text-right">
                                    <span @click="removeItem('emailAddress', email, index)" class="ml-auto cursor-pointer d-none d-md-block">
                                        <cw-svg-icon :icon-url="svgIconUrl('remove-bucket')" css-class="cw-icon-sm"/>
                                    </span>
                                    <button
                                        class="btn btn-secondary w-100 mt-3 d-md-none"
                                        @click="removeItem('emailAddress', email, index)">
                                        {{ translate('delete-this-email') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <cw-button-link icon-name="add-circle" :label="translate('add-another-email')" css-class="pt-2" @action="addEmailAddressItem"></cw-button-link>
                <div class="cec-mt-6 cec-pt-6 border-top border-top-style-dash">
                    <template v-for="(phone, index) in contactInfo.phone.items">
                        <div v-if="!phone.deleted" class="row">
                            <div class="col-12 col-lg-5 form-group">
                                <error-message
                                    label="phone-number"
                                    :error="phone.valid === false"
                                    message="my-contacts-you-entered-an-invalid-phone-number"
                                >
                                    <phone-input
                                        :id="index"
                                        :phone="phone"
                                        placeholder="enter-your-phone-number"
                                    ></phone-input>
                                </error-message>
                            </div>
                            <div class="col-12 col-lg-4 form-group">
                                <visibility-dropdown
                                    placeholder="who-can-see-this"
                                    label="type"
                                    :items="visibilityTypes"
                                    v-model="phone.visibility"
                                >
                                    <cw-dropdown
                                        :value="phone.type || '0'"
                                        :items="phoneTypes"
                                        :change-icon-on-mobile="false"
                                        class-wrapper="flex-grow-1 address-type"
                                        @change="phone.type = $event"
                                    ></cw-dropdown>
                                </visibility-dropdown>
                            </div>
                            <div class="col-12 col-lg-3">
                                <preferred-item
                                    wrapper-class="preferred-radio-wrapper d-md-flex text-dark form-group"
                                    :item="phone"
                                    radio-name="preferred-phone"
                                    remove-button-text="delete-this-number"
                                    @on-radio-change="onRadioChange(contactInfo.phone.items, index)"
                                    @remove="removeItem('phone', phone, index)"
                                ></preferred-item>
                            </div>
                        </div>
                    </template>
                    <cw-button-link icon-name="add-circle" :label="translate('my-contacts-add-another-phone-number')" css-class="pt-2" @action="addPhoneItem"></cw-button-link>
                </div>
                <div class="cec-mt-6 cec-pt-6 border-top border-top-style-dash">
                    <template v-for="(address, index) in contactInfo.address.items">
                        <div v-if="!address.deleted" class="row address mb-0 mb-lg-3">
                            <div class="col-12 col-lg-9">
                                <div class="row">
                                    <div class="col-12 col-lg-6 form-group">
                                        <label>{{ translate('country') }}</label>
                                        <cw-dropdown
                                            :value="address.countryId"
                                            :items="country.items"
                                            :change-icon-on-mobile="false"
                                            placeholder="select-country"
                                            @change="address.countryId = $event"
                                        ></cw-dropdown>
                                    </div>
                                    <div class="col-12 col-lg-6 form-group">
                                        <visibility-dropdown
                                            placeholder="who-can-see-this"
                                            label="type"
                                            :items="visibilityTypes"
                                            v-model="address.visibility"
                                        >
                                            <cw-dropdown
                                                :value="address.type || '0'"
                                                :items="addressTypes"
                                                :change-icon-on-mobile="false"
                                                class-wrapper="flex-grow-1 address-type"
                                                @change="address.type = $event"
                                            ></cw-dropdown>
                                        </visibility-dropdown>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-lg-6">
                                        <cw-input :label="translate('street-address-1')" :placeholder="translate('enter-street-address-1')" v-model="address.addressLine1"/>
                                    </div>
                                    <div class="col-12 col-lg-6">
                                        <cw-input :label="translate('street-address-2')" :placeholder="translate('enter-street-address-2')" v-model="address.addressLine2"/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12 col-lg-4">
                                        <cw-input :label="translate('city')" :placeholder="translate('enter-city')" v-model="address.city"/>
                                    </div>
                                    <div class="col-12 col-lg-4">
                                        <cw-input :label="translate('my-contacts-state-or-province')" :placeholder="translate('enter-state-province')" v-model="address.state"/>
                                    </div>
                                    <div class="col-12 col-lg-4">
                                        <cw-input :label="translate('postal-code')" :placeholder="translate('enter-postal-code')" v-model="address.postalCode"/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-lg-3">
                                <preferred-item
                                    wrapper-class="preferred-radio-wrapper d-md-flex text-dark form-group"
                                    :item="address"
                                    radio-name="preferred-address"
                                    remove-button-text="profile.delete-this-address"
                                    @on-radio-change="onRadioChange(contactInfo.address.items, index)"
                                    @remove="removeItem('address', address, index)"
                                ></preferred-item>
                            </div>
                        </div>
                    </template>
                    <cw-button-link icon-name="add-circle" :label="translate('add-another-address')" css-class="pt-2" @action="addAddressItem"></cw-button-link>
                </div>
                <div class="cec-mt-6 cec-pt-6 border-top border-top-style-dash d-flex justify-content-end">
                    <button
                        class="btn btn-primary btn-update-profile text-uppercase sm-down--width-100"
                        @click="update"
                        :disabled="!updatable || isUpdating"
                    >{{ translate('profile.update-contact-info') }}</button>
                </div>
            </container-with-title>
            <loading-indicator :is-loading="isUpdating" css-wrapper="position-absolute z-index-10"></loading-indicator>

            <toast
                ref="toasted"
                :timeout="5000"
                :fadeTo="false"
                css-class="justify-content-center rounded-0"
                :is-full-width="true">
            </toast>
        </div>
    `
});

export default EditContactInfo;
