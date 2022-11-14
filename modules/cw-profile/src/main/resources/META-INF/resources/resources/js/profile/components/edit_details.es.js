import { required, maxValue, url } from 'vuelidate/dist/validators.min';
import { DropdownMenu } from 'cw-vuejs-global-components/components/dropdown_menu.es';
import { CwDatePicker } from 'cw-vuejs-global-components/components/date_time_picker.es';
import VisibilityDropdown from 'cw-vuejs-global-components/components/profile/visibility_dropdown.es';
import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';

import moment from 'moment';
import { CustomMultiSelect } from 'cw-vuejs-global-components/components/custom-vue-multi-select.es';
import { WebsiteItem } from './website_item.es';
import { SocialMediaItem } from './social_media.es';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { WarningMessage } from './warning_message.es';
import ProfileMixin from './../mixins/profile_mixin.es';
import { LoadingIndicator } from 'cw-vuejs-global-components/components/loading-indicator.es';

const REQUIRED_AGE = 14;
export const EditDetails = () => ({
    cwComponents: {
        DropdownMenu: DropdownMenu(),
        CwDatePicker,
        CustomMultiSelect,
        WebsiteItem,
        SocialMediaItem,
        WarningMessage: WarningMessage(),
        VisibilityDropdown: VisibilityDropdown(),
        CwDropdown: CwDropdown(),
        LoadingIndicator: LoadingIndicator(),
    },
    data: function() {
        return {
            options: cloneDeep(this.$store.state.options),
            profile: cloneDeep(this.$store.state.userProfile),
            tempProfile: {},
            selectConnectionsAndOrganizations: 4,
            dateOfBirthString: null,
            isLoading: false,
            dateOfBirth: null,
            isSubmitting: false,
            gender: [
                { key: '0', value: this.translate('male') },
                { key: '1', value: this.translate('female') }
            ],
            orgOptions: [
                { key: "true", value: this.translate('show') },
                { key: "false", value: this.translate('hide') },
            ],
            organizationItems: [],
            tempOrganizationItems: '',
            updatable: false,
            reRenderWebsite: false
        }
    },
    mixins: [
        ProfileMixin
    ],
    watch: {
        'dateOfBirthString': {
            handler: function(newVal) {
                this.dateOfBirth = newVal ? new Date(newVal) : null;
            },
            immediate: true
        },
        'organizationItems': {
            deep: true,
            handler: function() {
                this.updatable = this.tempOrganizationItems != JSON.stringify(this.organizationItems);
                this.$emit('invalid-details', !this.updatable);
            }
        }
    },
    created: function() {
        this.asyncFindJobTitle('');
        this.asyncFindPosition('');
        this.dateOfBirthString = moment(this.getConcatDate()).format('MM/DD/YYYY');
        this.tempProfile = JSON.stringify(this.profile.moreInformation);
        this.initOrganizationItems();
    },
    validations() {
        return {
            dateOfBirth: {
                required,
                maxValue(value) {
                    return value <= this.maxDate();
                }
            },
            profile: {
                moreInformation: {
                    webSite: {
                        items: {
                            $each: {
                                text: { url }
                           }
                        }
                    }
                }
            }
        }
    },
    computed: {
        disableUpdate: function() {
            let disabled = (
                this.isSubmitting ||
                this.$v.$invalid ||
                this.tempProfile === JSON.stringify(this.profile.moreInformation)
            );
            this.$emit('invalid-details', disabled);
            return disabled;
        },
        visibilityTypes: function() {
            return this.$store.state.visibilityOption || [];
        },
    },
    mounted: function() {
        this.$v.profile.touch;
    },
    methods: {
        initOrganizationItems: function() {
            this.organizationItems = this.getOrganizationItems();
            this.tempOrganizationItems = JSON.stringify(this.organizationItems);
        },
        getOrganizationItems: function() {
            return this.profile.organizationInformation.items.map(item => {
                item.center.show = String(item.center.show);
                item.ministryWork.show = String(item.ministryWork.show);
                item.workStatus.show = String(item.workStatus.show);
                return item;
            });
        },
        maxDate: function() {
            const date = new Date();
            date.setFullYear( date.getFullYear() - REQUIRED_AGE );
            return date;
        },
        onChangeDate: function(e) {
            this.dateOfBirth = e ? new Date(e) : e;
            if (e) {
                this.setDateOfBirth();
            }
            this.$v.dateOfBirth.$touch();
        },
        addJobTitle: function(newTag) {
            const tag = this.addTag(newTag);
            this.options.jobTitle.items.push(tag);
            this.profile.moreInformation.jobTitle.items.push(tag);
        },
        addPosition: function(newTag) {
            const tag = this.addTag(newTag);
            this.options.position.items.push(tag);
            this.profile.moreInformation.position.items.push(tag);
        },
        addTag: function(newTag) {
            return {
                key: 'add' + newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
                text: newTag
            };
        },
        asyncFindJobTitle: function(query) {
            this.asyncFind('jobTitle', query);
        },
        asyncFind: function(type, query) {       //refactor: use resource command
            let instance = this;
            this.isLoading = true;
            Liferay.Service('/assetcategory/search-categories-display', {
                end: this.options.limit,
                groupIds: [this.options[type].groupId],
                start: 0,
                title: query,
                vocabularyIds: [this.options[type].vocabularyId]
            },
            function(obj) {
                var buffer = [];
                var categories = obj.categories;
                if (categories.length > 0) {
                    categories.forEach(function(item, index) {
                        var t = {};

                        t.key = item.categoryId;
                        t.text = item.name;
                        buffer.push(t);
                    });
                }
                instance.options[type].items = buffer;
                instance.isLoading = false;
            });
        },
        removeTag: function(tags, key) {
            let index = tags.findIndex(function(tag) {
                return tag.key === key;
            });
            this.$delete(tags, index);
        },
        asyncFindPosition: function(query) {
            this.asyncFind('position', query);
        },
        deleteThisWebSiteItemRow: function(idx) {
            let item = this.profile.moreInformation.webSite.items[idx];
            item.deleted = true;
            item.text = '';
            let componentItems = this.componentItemsOnPage(this.profile.moreInformation.webSite.items);
            if (componentItems.length == 0) {
                this.addWebSiteItemRow();
            }
        },
        componentItemsOnPage: function(arrItems) {
            var arrCurrentItems = [];
            var info = arrItems.map(function(item) {
                if (!item.deleted) {
                    arrCurrentItems.push(item);
                }
            });
            return arrCurrentItems;
        },
        addWebSiteItemRow: function() {
            this.profile.moreInformation.webSite.items.push({
                deleted: false,
                profileId: 0,
                text: '',
                visibility: this.$store.state.defaultVisibility,
                webSiteItemId: 'newWebSiteItemId_' + this.webSiteItemCount++
            });
        },
        onRemoveSocialMediaRow: function(position) {
            this.profile.moreInformation.socialMedia.items[position].deleted = true;
            const componentItems = this.componentItemsOnPage(this.profile.moreInformation.socialMedia.items);
            if (componentItems.length == 0) {
                this.renderSocialMediaRow();
            }
        },
        renderSocialMediaRow: function() {
            const id = this.profile.moreInformation.socialMedia.items.length;

            this.profile.moreInformation.socialMedia.items.push({
                deleted: false,
                itemId: id,
                profileId: 0,
                type: 1,
                text: '',
                visibility: this.$store.state.defaultVisibility
            });
        },
        setDateOfBirth: function () {
            this.profile.moreInformation.dateOfBirth.day = this.dateOfBirth.getDate();
            this.profile.moreInformation.dateOfBirth.month = this.dateOfBirth.getMonth();
            this.profile.moreInformation.dateOfBirth.year = this.dateOfBirth.getFullYear();
        },
        getConcatDate: function() {
            return new Date(this.profile.moreInformation.dateOfBirth.year, this.profile.moreInformation.dateOfBirth.month, this.profile.moreInformation.dateOfBirth.day);
        },
        update: function() {
            this.isSubmitting = true;
            const { givenLegalName, jobTitle, position, dateOfBirth, socialMedia, gender, company, webSite } = this.profile.moreInformation;
            const tempInfo = JSON.parse(this.tempProfile);
            this.getResourceService().sendFormData('/profile/edit/contact_detail', {
                moreInformation: JSON.stringify(this.profile.moreInformation),
                orgInformation: JSON.stringify(this.profile.organizationInformation),
                givenLegalNameChanged: !isEqual(tempInfo.givenLegalName, givenLegalName),
                jobTitleChanged: !isEqual(tempInfo.jobTitle, jobTitle),
                positionChanged: !isEqual(tempInfo.position, position),
                dateOfBirthChanged: !isEqual(tempInfo.dateOfBirth, dateOfBirth),
                socialMediaChanged: !isEqual(tempInfo.socialMedia, socialMedia),
                websiteChanged: !isEqual(tempInfo.webSite, webSite),
                genderChanged: !isEqual(tempInfo.gender, gender),
                companyChanged: !isEqual(tempInfo.company, company),
                organizationChanged: this.tempOrganizationItems !== JSON.stringify(this.organizationItems)
            }).then(response => {
                if (response.data.success) {
                    this.profile = JSON.parse(response.data.result);
                    this.updatable = false;
                    this.setContactSummary(this.profile);
                    this.updateProfile();
                    this.reRenderWebsite = !this.reRenderWebsite;
                    this.$root.showSuccessToast('profile.update-detail-message');
                } else {
                    this.$root.showFailedToast('profile.update-detail-failed-message');
                }
                this.isSubmitting = false;
            }).catch(error => {
                this.$root.showFailedToast('profile.update-detail-failed-message');
                this.isSubmitting = false;
                console.log(error);
            });
        },
        updateProfile: function() {
            this.tempProfile = JSON.stringify(this.profile.moreInformation);
            this.tempOrganizationItems = JSON.stringify(this.organizationItems);
        }
    },
    template: `
        <div v-if="options" class="position-relative">
            <div class="edit-contact-info">
                <warning-message icon="warning-info" label="visibility-warning-message-before-publish-profile"
                    css-wrapper="cec-mt-n2 cec-mt-sm-0"></warning-message>
                <warning-message v-if="!profile.hasValidSubscription" icon="warning-info" label="note-visibility-premium-feature" css-wrapper="mt-2"></warning-message>
            </div>
            <div class="cec-px-6 cec-pt-6 my-profile-wrapper">
                <div class="details-section border-bottom border-bottom-style-dash cec-pb-6 no-gutters">
                    <span class="font-size-22 font-weight-light">{{ translate('details') }}</span>
                    <div class="row cec-pt-4">
                        <div class="col-lg-6">
                            <div class="row">
                                <div class="col-md-7 pr-md-0">
                                    <cw-input
                                        css-input-class="border-radius-right-0 border-radius-sm-right"
                                        :id="qualify('known-as')"
                                        css-class="mb-0 mb-md-3"
                                        :label="translate('known-as')"
                                        :placeholder="translate('known-as')"
                                        v-model="profile.moreInformation.givenLegalName.text">
                                    </cw-input>
                                </div>
                                <div class="col-md-5 pl-md-0">
                                    <div class="form-group">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="visibilityTypes"
                                            v-model="profile.moreInformation.givenLegalName.visibility">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row">
                                <div class="col-md-7 pr-md-0">
                                    <div class="form-group mb-0 mb-md-3">
                                        <label>{{ translate('gender') }}</label>
                                        <cw-dropdown
                                            css-toggle="border-radius-right-0 border-radius-sm-right"
                                            class-wrapper="w-100"
                                            :items="gender"
                                            :value="profile.moreInformation.gender.key"
                                            :change-icon-on-mobile="false"
                                            @change="profile.moreInformation.gender.key = $event"
                                            ></cw-dropdown>
                                    </div>
                                </div>
                                <div class="col-md-5 pl-md-0">
                                    <div class="form-group">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="visibilityTypes"
                                            v-model="profile.moreInformation.gender.visibility">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-3 mt-sm-0">
                        <div class="col-lg-6">
                            <div class="row">
                                <div class="col-md-7 pr-md-0">
                                    <label class="control-label">
                                        {{ translate('date-of-birth') }}
                                        <cw-svg-icon css-class="text-warning mb-1" :icon-url="svgIconUrl('asterisk')"></cw-svg-icon>
                                    </label>
                                   <cw-date-picker
                                       css-input="border-radius-right-0 border-radius-sm-right"
                                       :date="dateOfBirthString"
                                       format-date="MM/DD/YYYY"
                                       :is-required="$v.dateOfBirth.$invalid"
                                       :placeholder="translate('select-date')"
                                       @change="onChangeDate($event)">
                                   </cw-date-picker>
                                   <div v-if="$v.dateOfBirth.$invalid && !$v.dateOfBirth.required" class="text-danger mt-1">
                                       {{ translate('this-field-is-required') }}
                                   </div>
                                   <div v-if="$v.dateOfBirth.$invalid && !$v.dateOfBirth.maxValue" class="text-danger mt-1">
                                       {{ translate('you-must-be-at-least-x-years-old') }}
                                   </div>
                                </div>
                                <div class="col-md-5 pl-md-0">
                                    <div class="form-group mb-0">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="visibilityTypes"
                                            v-model="profile.moreInformation.dateOfBirth.visibility">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="current-job-section border-bottom border-bottom-style-dash cec-py-6 no-gutters">
                    <span class="font-size-22 font-weight-light">{{ translate('current-job') }}</span>
                    <div class="row cec-mt-4">
                        <div class="col-lg-6">
                            <div class="row">
                                <div class="col-md-7 pr-md-0">
                                    <cw-input
                                        css-input-class="border-radius-right-0 border-radius-sm-right"
                                        :label="translate('company-org')"
                                        :placeholder="translate('company-org')"
                                        v-model="profile.moreInformation.company.text"
                                    ></cw-input>
                                </div>
                                <div class="col-md-5 pl-md-0 cec-mt-n3 cec-mt-sm-0">
                                    <div class="form-group">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="visibilityTypes"
                                            v-model="profile.moreInformation.company.visibility">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="row">
                                <div class="col-md-7 pr-md-0">
                                    <div class="form-group">
                                        <label>{{ translate('job-title') }}</label>
                                        <custom-multi-select
                                            v-model="profile.moreInformation.jobTitle.items"
                                            label="text"
                                            track-by="key"
                                            :placeholder="translate('select-job-title')"
                                            tag-placeholder=""
                                            select-label=""
                                            tag-position="bottom"
                                            :options="options.jobTitle.items"
                                            :options-limit="options.limit"
                                            :multiple="true"
                                            :close-on-select="true"
                                            :internal-search="false"
                                            :taggable="true"
                                            :hide-selected="true"
                                            :loading="isLoading"
                                            @tag="addJobTitle"
                                            @search-change="asyncFindJobTitle"
                                            >
                                        </custom-multi-select>
                                    </div>
                                    <ul class="list-inline mb-0">
                                        <li v-for="jobTitle in profile.moreInformation.jobTitle.items" class="list-inline-item">
                                            <span class="label label-default">
                                                {{ jobTitle.text }}
                                                <a href="javascript:;" @click="removeTag(profile.moreInformation.jobTitle.items, jobTitle.key)">
                                                    <cw-svg-icon css-class="pl-1" :icon-url="svgIconUrl('remove')"></cw-svg-icon>
                                                </a>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-md-5 pl-md-0">
                                    <div class="form-group">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="visibilityTypes"
                                            v-model="profile.moreInformation.jobTitle.visibility">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3 mt-sm-0">
                        <div class="col-lg-6">
                            <div class="row">
                                <div class="col-md-7 pr-md-0">
                                    <div class="form-group">
                                        <label>{{ translate('position') }}</label>
                                        <custom-multi-select
                                            v-model="profile.moreInformation.position.items"
                                            label="text"
                                            track-by="key"
                                            :placeholder="translate('select-position')"
                                            tag-placeholder=""
                                            select-label=""
                                            tag-position="bottom"
                                            :options="options.position.items"
                                            :options-limit="options.limit"
                                            :multiple="true"
                                            :close-on-select="true"
                                            :internal-search="false"
                                            :taggable="true"
                                            :hide-selected="true"
                                            :loading="isLoading"
                                            @tag="addPosition"
                                            @search-change="asyncFindPosition"
                                        >
                                        </custom-multi-select>
                                    </div>
                                    <ul class="list-inline mb-0">
                                        <li v-for="position in profile.moreInformation.position.items" class="list-inline-item">
                                            <span class="label label-default">
                                                {{ position.text }}
                                                <a href="javascript:;" @click="removeTag(profile.moreInformation.position.items, position.key)">
                                                    <cw-svg-icon css-class="pl-1" :icon-url="svgIconUrl('remove')"></cw-svg-icon>
                                                </a>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-md-5 pl-md-0">
                                    <div class="form-group">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="visibilityTypes"
                                            v-model="profile.moreInformation.position.visibility">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="social-section cec-py-6 no-gutters border-bottom border-bottom-style-dash">
                    <span class="font-size-22 font-weight-light">{{ translate('social') }}</span>
                    <div class="website-section row cec-pt-4 cec-pb-4">
                        <div class="col-12 d-none d-md-block">
                            <label>{{ translate('website') }}</label>
                        </div>
                        <div class="col-12" :key="reRenderWebsite">
                            <website-item
                                v-for="(v, index) in $v.profile.moreInformation.webSite.items.$each.$iter"
                                :website-item-data="v"
                                :key="v.webSiteItemId"
                                :unique-id="index"
                                :placeholder="translate('enter-your-url-here')"
                                :visibilities="visibilityTypes"
                                @delete-row="deleteThisWebSiteItemRow(index)"
                                :selected-key="selectConnectionsAndOrganizations"
                                :has-valid-subscription="profile.hasValidSubscription">
                            </website-item>
                        </div>
                        <div class="col-lg-3 form-group">
                            <cw-button-link icon-name="add-circle" :label="translate('add-another-website')" css-class="pt-2" @action="addWebSiteItemRow"></cw-button-link>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 d-none d-md-block">
                            <label>{{ translate('social-media') }}</label>
                        </div>
                        <div class="col-12">
                            <social-media-item
                                id="social-media-item"
                                v-for="(item, index) in profile.moreInformation.socialMedia.items"
                                :visibilities="visibilityTypes"
                                :count="index"
                                :key="item.itemId"
                                :social-media-types="options.socialMediaTypes"
                                :social-media-information="item"
                                @remove-socialmedia-row="onRemoveSocialMediaRow(index)"
                                :selected-key="selectConnectionsAndOrganizations"
                                :has-valid-subscription="profile.hasValidSubscription"
                            ></social-media-item>
                        </div>
                        <div class="col-lg-3 form-group">
                            <cw-button-link icon-name="add-circle" :label="translate('add-another-social-account')" css-class="pt-2" @action="renderSocialMediaRow"></cw-button-link>
                        </div>
                    </div>
                </div>
                <div v-for="(organization, index) in organizationItems" class="cec-py-6 border-bottom border-bottom-style-dash">
                    <span class="font-size-22 font-weight-light">{{ translate('organization-information-x', organization.organizationName) }}</span>
                    <div class="cec-pt-4" v-if="options">
                        <div class="row">
                            <div class="col-lg-6 mb-3 mb-sm-0">
                                <div class="row no-gutters">
                                    <div class="col-sm-7 mb-0 mb-sm-3">
                                        <label>{{ translate('center') }}</label>
                                        <input name="center" type="text" class="form-control" v-model="organization.center.text" />
                                    </div>
                                    <div class="col-sm-5 mt-sm-3 mt-md-0">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="orgOptions"
                                            v-model="organization.center.show">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 mb-sm-3 mb-sm-0">
                                <div class="row no-gutters">
                                    <div class="col-sm-7 mb-0 mb-sm-3">
                                        <label>{{ translate('work-status') }}</label>
                                        <cw-dropdown
                                            class-wrapper="w-100"
                                            :items="options.workStatuses"
                                            :value="organization.workStatus.key"
                                            :change-icon-on-mobile="false"
                                            @change="organization.workStatus.key = $event"
                                        ></cw-dropdown>
                                    </div>
                                    <div class="col-sm-5 mt-sm-3 mt-md-0">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="orgOptions"
                                            v-model="organization.workStatus.show">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="row no-gutters">
                                    <div class="col-sm-7 mt-3 mt-sm-0">
                                        <label for="ministryWork">
                                            {{ translate('ministry-work-team') }}
                                        </label>
                                        <input name="ministryWork" type="text" class="form-control" v-model="organization.ministryWork.text" />
                                    </div>
                                    <div class="col-sm-5 mt-sm-3 mt-md-0">
                                        <label class="hidden-xs">&nbsp;</label>
                                        <visibility-dropdown
                                            :items="orgOptions"
                                            v-model="organization.ministryWork.show">
                                        </visibility-dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-end cec-py-6">
                    <cw-button
                        :disabled="disableUpdate && !updatable"
                        :label="translate('update-my-profile')"
                        style-type="primary text-uppercase min-width-257 sm-down--width-100"
                        @action="update"
                    ></cw-button>
                </div>
            </div>
            <loading-indicator :is-loading="isSubmitting" css-wrapper="position-absolute z-index-10"></loading-indicator>
        </div>
    `
});
