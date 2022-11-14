import { CwContextFactory } from 'cw-vuejs-global-components/utils/cw_context.es';
import { NeedHelp } from "cw-vuejs-global-components/components/need_help.es";
import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';

import { AccountSettingsNavbar } from './components/account_settings_navbar.es';
import { GeneralSettings } from './components/general_settings.es';
import { Notifications } from './components/notifications.es';
import { TwoStepVerification } from './components/two_step_verification.es';
import { Consents } from './components/consents.es';
import { ActivityLog } from './components/activity_log/activity_log.es';

import Vuelidate from 'vuelidate/dist/vuelidate.min';

const ALL_ACTIVITIES_CATEGORY = { key: '-1', value: "All Activities" }

export default new CwContextFactory(function(cwc) {
    const HELP_GUIDE_URL = '/web/help-guide';
    cwc.use(Vuelidate);
    cwc.createVue({
        el: cwc.getElement('root'),
        cwComponents: {
            NeedHelp: NeedHelp,
            GeneralSettings: GeneralSettings(),
            Notifications: Notifications(),
            TwoStepVerification: TwoStepVerification(),
            Consents: Consents(),
            AccountSettingsNavbar: AccountSettingsNavbar(),
            ActivityLog: ActivityLog(),
            CwDropdown: CwDropdown()
        },
        data: function() {
            return {
                options: [
                    {
                        key: 'general-settings',
                        value: 'general-settings',
                        title: 'general'
                    },
                    {
                        key: 'notifications',
                        value: 'notifications',
                        title: ''
                    },
                    {
                        key: 'two-step-verification',
                        value: 'org.member-2-step-verification',
                        title: ''
                    },
                    {
                        key: 'consents',
                        value: 'consents',
                        title: ''
                    },
                    {
                        key: 'activity-log',
                        value: 'activity-log',
                        title: 'activity-log',
                    }
                ],
                selectedOption: {},
                selectedOptionKey: this.initialOptionKey(),
                reRenderComponent: true,
                helpGuideUrl: HELP_GUIDE_URL,
                accountSettingOptions: cwc.getData('accountSettingOptions'),
                canUpdatePassword: cwc.getData('canUpdatePassword'),
                minimumPasswordLength: cwc.getData('minimumPasswordLength'),
                themeDisplay: cwc.getThemeDisplay(),
                activityCategories: [],
                selectedCategory: ALL_ACTIVITIES_CATEGORY
            }
        },
        created: function() {
            this.fetchActivityCategories();
        },
        mounted: function() {
            this.hashChangeListener = window.addEventListener('hashchange', () => {
                this.selectedOptionKey = this.initialOptionKey();
            });
        },
        methods: {
            initialOptionKey() {
                return this.getUrlUtils().getHashParam('option') || cwc.getData('option') || 'general-settings';
            },
            onChangeOption: function(optionKey) {
                const url = this.getUrlUtils();
                url.setHashParam('option', optionKey);
                this.selectedOptionKey = optionKey;
                this.forceRender();
            },
            forceRender: function() {
                this.reRenderComponent = false;
                this.$nextTick().then(() => {
                    this.reRenderComponent = true;
                });
            },
            getComponentNameForDropdown(optionKey) {
                switch(optionKey){
                    case 'general-settings':
                        this.selectedOption = this.options[0];
                        return 'general-settings';
                    case 'notifications':
                        this.selectedOption = this.options[1];
                        return 'notifications';
                    case 'two-step-verification':
                        this.selectedOption = this.options[2];
                        return 'two-step-verification';
                    case 'consents':
                        this.selectedOption = this.options[3];
                        return 'consents';
                    case 'activity-log':
                        this.selectedOption = this.options[4];
                        return 'activity-log';
                    default:
                        return 'not-yet';
                }
            },
            fetchActivityCategories: function () {
                this.getResourceService().fetch('/setting/activity/categories/fetch')
                .then(response => {
                    if (response.data.success) {
                        this.activityCategories = JSON.parse(response.data.result);
                    }
                }).catch(console.error);
            },
            onSwitchCategory: function(category, isDropdown = true) {
                this.selectedCategory = isDropdown ? this.activityCategories.find((c) => c.key === category) : category;
                this.$refs.activityLog.reset();
            },
        }
    });
});
