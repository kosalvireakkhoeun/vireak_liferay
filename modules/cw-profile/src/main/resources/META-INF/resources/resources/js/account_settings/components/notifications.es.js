import { Toast } from 'cw-vuejs-global-components/components/toast.es';
import { LoadingIndicator } from 'cw-vuejs-global-components/components/loading-indicator.es';
import { AccordionItem } from 'cw-vuejs-global-components/components/accordion_item.es';
import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';
import debounce from 'lodash/debounce';
import CommunityNotificationSettingMixin from '../mixins/pop_up_community_notification_setting.es';

const MESSAGING = 'Messaging';
const ANNOUNCEMENTS = 'Announcements';
const CONSENT_TYPE = 3;
const COMMUNITY_TYPE = 2;

export const Notifications = () => ({
    props: {
        selectedOption: { type: Object }
    },
    cwComponents: {
        Toast: Toast(),
        LoadingIndicator: LoadingIndicator(),
        AccordionItem,
        CwDropdown: CwDropdown(),
    },
    mixins: [ CommunityNotificationSettingMixin ],
    data: function() {
        return {
            isLoading: false,
            isSaving: false,
            notifications: [],
            isMobile: Liferay.Browser.isMobile()
        }
    },
    created: function() {
        this.fetchNotificationsInfo();
    },
    methods: {
        fetchNotificationsInfo: function() {
            this.isLoading = true;
            this.getResourceService().fetch('/account_settings/fetch')
            .then(response => {
                this.isLoading = false;
                if (response.data.success) {
                    const result = JSON.parse(response.data.result.notifications);
                    this.notifications = result;
                }
            }).catch(error => {
                this.isLoading = false;
                console.log(error);
            });
        },
        saveNotification: debounce(function(notification, updateEmailSetting = false) {
           this.isSaving = true;
           this.getResourceService().sendFormData('/account_settings/modify', {
               notification: JSON.stringify(notification),
               saveNotifications: true,
               updateEmailSetting: updateEmailSetting
           }).then(response => {
               this.isSaving = false;
               if (response.data.success) {
                   this.showSuccessToast('account.notification-saved');
               }
           }).catch(console.error);
        }, 300),
        showSuccessToast: function(key) {
            this.$refs.toasted.show('green-checked-circle', key);
        },
        setSelectedEmail: function(emailAddress, notification) {
            if(emailAddress.selected) {
                notification.selectedEmailAddressId = emailAddress.emailAddressId;
                return true;
            }
            return false;
        },
        renderEmailAndWebsiteTitle: function(index) {
            return this.isMobile || index === 0;
        },
        shouldShowEmailNotification: function(name) {
            return MESSAGING != name;
        },
        getEmailPlaceholder: function(emails) {
            let placeholderEmail;
            emails.forEach(email => {
                if (email.selected) {
                    placeholderEmail = email.emailAddress;
                }
            });
            return placeholderEmail ? placeholderEmail : emails.length ? emails[0].emailAddress : '';
        },
        getEmails: function(emails) {
            emails = emails.map((email) => {
                return {
                    key: email.emailAddressId,
                    value: email.emailAddress
                }
            });
            return emails;
        },
        onChangeEmail: function(emailAddressId, notification) {
            notification.selectedEmailAddressId = emailAddressId;
             this.setEmailPlaceholder(emailAddressId, notification);
             this.saveNotification(notification);
        },
        showPushNotification: function(name) {
            return MESSAGING == name || ANNOUNCEMENTS == name;
        },
        hideWebNotification: function(type) {
            return CONSENT_TYPE == type;
        },
        setEmailPlaceholder: function(emailAddressId, notification) {
            let updatedEmail;
            notification.emailAddresses.forEach(email => {
                email.selected = false;
                if (email.emailAddressId == emailAddressId) {
                    updatedEmail = email.emailAddress;
                    email.selected = true;
                }
            });
            this.$refs[notification.activityId][0].placeholder = updatedEmail || '';
        },
        showCommunitySetting: function(item) {
            return COMMUNITY_TYPE == item.key;
        }
    },
    template: `
        <div class="notifications-holder">
            <div class="rounded-top w-100">
                <div class="d-sm-flex d-block align-items-center justify-content-between border-bottom border-bottom-style-dash pr-0 cec-pl-6 cec-py-4 cec-card__header_fix_height">
                    <span class="cec-card__title"><span class="text-uppercase">{{ translate(selectedOption.key) }}</span></span>
                </div>
            </div>
            <div v-if="isMobile && notifications.length">
                <div class="cec-p-4">
                    <div v-for="(item, index) in notifications" :key="index">
                        <div className="pb-2 border-bottom"
                        :class="{
                            'mt-3' : index > 0
                        }">
                            <span class="text-uppercase font-weight-bold d-block font-size-14 mb-2">{{ item.title }}</span>
                            <span class="d-block pb-3 border-style-dash border-bottom border-top-0 border-left-0 border-right-0 font-size-14">{{ item.description }}</span>
                        </div>

                        <div v-for="(subItem, index) in item.notifications"
                        :key="subItem.activityId">
                            <accordion-item
                            :title="subItem.activityName"
                            :aria-id="'notificationAccordion-' + index"
                            :expand="false">
                                <div class="input-text-wrapper">
                                    <label class="d-flex mb-0" v-if="shouldShowEmailNotification(subItem.activityName)">
                                        <input type="checkbox"
                                        class="mt-1"
                                        v-model="subItem.emailNotification"
                                        @change="saveNotification(subItem, true)" />

                                        <cw-dropdown
                                        :ref="subItem.activityId"
                                        :is-static-placeholder="true"
                                        :placeholder="getEmailPlaceholder(subItem.emailAddresses)"
                                        :items="getEmails(subItem.emailAddresses)"
                                        item-class="py-2"
                                        css-toggle="border-0"
                                        css-placeholder="mr-2 text-black"
                                        @change="onChangeEmail($event, subItem)">
                                        </cw-dropdown>
                                    </label>

                                    <label class="d-flex mb-0" v-if="showPushNotification(subItem.activityName)">
                                        <cw-checkbox
                                        v-model="subItem.pushNotification"
                                        class="mb-0 mt-n1"
                                        :label="translate('push')"
                                        label-class="font-weight-normal text-black font-size-14 py-2"
                                        item-class="py-2"
                                        css-toggle="border-0"
                                        css-placeholder="mr-2 text-black"
                                        @input="saveNotification(subItem)">
                                        </cw-checkbox>
                                    </label>

                                    <label class="d-flex mb-0" v-else>
                                        <cw-checkbox
                                        v-model="subItem.websiteNotification"
                                        class="mb-0 mt-n1"
                                        :label="translate('web')"
                                        label-class="font-weight-normal text-black font-size-14 py-2"
                                        @input="saveNotification(subItem)">
                                        </cw-checkbox>
                                    </label>
                                </div>
                            </accordion-item>
                            <div class="d-flex mt-3" v-if="showCommunitySetting(item)">
                                <div class="cursor-pointer font-size-14" @click="popUpCommunitySetting(showSuccessToast)">
                                    <cw-svg-icon :icon-url="svgIconUrl('pencil')" css-class="cw-icon-sm"></cw-svg-icon>
                                    <span class="ml-2">{{ translate('change-your-community-preferences') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cec-px-6 mt-3" v-if="!isMobile && notifications.length">
                <span class="cec-card__title">{{ translate('notifications-you-would-like-to-receive') }}</span>
                <div class="cec-px-6 mt-3 mb-4 border rounded">
                    <div class="notification-item border-bottom border-bottom-style-dash my-3" v-for="(item, index) in notifications" :key="index">
                        <span class="cec-card__title">{{ item.title }}</span>
                        <p class="mt-2 mb-4 text-black">{{ item.description }}</span>
                        <div class="row cec-px-6 mb-3 d-flex align-items-center" v-for="subItem in item.notifications" :key="subItem.activityId">
                            <div class="col col-md-6">
                                <span class="cec-card__title">{{ subItem.activityName }}</span>
                            </div>
                            <div class="col col-md-3 d-flex" v-if="shouldShowEmailNotification(subItem.activityName)">
                                <input type="checkbox" class="mt-1" v-model="subItem.emailNotification" @change="saveNotification(subItem, true)"/>
                                <cw-dropdown
                                    :ref="subItem.activityId"
                                    :placeholder="getEmailPlaceholder(subItem.emailAddresses)"
                                    :is-static-placeholder="true"
                                    :items="getEmails(subItem.emailAddresses)"
                                    item-class="py-2"
                                    css-toggle="border-0"
                                    css-placeholder="mr-2 text-black text-ellipsis text-wrap"
                                    @change="onChangeEmail($event, subItem)"
                                ></cw-dropdown>
                            </div>
                            <div class="col col-md-3 pr-0" :class="{'pl-4': shouldShowEmailNotification(subItem.activityName)}" v-if="showPushNotification(subItem.activityName)">
                                <cw-checkbox
                                    v-model="subItem.pushNotification"
                                    class="mb-0 mt-n1"
                                    :label="translate('push')"
                                    label-class="font-weight-normal text-black font-size-14"
                                    @input="saveNotification(subItem)">
                                </cw-checkbox>
                            </div>
                            <div class="col col-md-3 pr-0 pl-4" v-else>
                                <cw-checkbox
                                    v-if="!hideWebNotification(subItem.type)"
                                    v-model="subItem.websiteNotification"
                                    class="mb-0 mt-n1"
                                    :label="translate('web')"
                                    label-class="font-weight-normal text-black font-size-14"
                                    @input="saveNotification(subItem)">
                                </cw-checkbox>
                          </div>
                        </div>
                        <div class="d-flex my-3" v-if="showCommunitySetting(item)">
                            <div class="cursor-pointer" @click="popUpCommunitySetting(showSuccessToast)">
                                <cw-svg-icon :icon-url="svgIconUrl('pencil')" css-class="cw-icon-sm"></cw-svg-icon>
                                <span class="ml-2">{{ translate('change-your-community-preferences') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <toast
                ref="toasted"
                :timeout="5000"
                :fadeTo="false"
                css-class="justify-content-center"
                :is-full-width="true">
            </toast>
            <loading-indicator :is-loading="isLoading || isSaving" title="please-wait"></loading-indicator>
        </div>
    `
});
