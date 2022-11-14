import { SidebarPlugin } from '@syncfusion/ej2-vue-navigations/dist/ej2-vue-navigations.umd.min';
import { ProfileSetting } from './profile_setting.es';
import '@syncfusion/ej2-vue-navigations/styles/material.css';

export const ProfileSettingSidebar = () => ({
    cwComponents: {
        ProfileSetting: ProfileSetting()
    },
    data: function() {
        return {
            showSidebar: false
        };
    },
    created: function() {
        const cwc = this.getCwContext();
        cwc.use(SidebarPlugin);
    },
    mounted: function() {
        this.showSidebar = true;
        let instance = this;
        setTimeout(function() {
            document.getElementById(instance.qualify('sidebarSettings')).classList.remove('d-none');
        }, 1500)
    },
    methods: {
        onUpdateSuccess: function() {
            this.$root.showSuccessToast('profile.setting-update-success-message');
        },
        toggle: function() {
            this.$refs.sidebar.toggle();
        }
    },
    template: `
        <div class="d-none" :id="qualify('sidebarSettings')">
            <ejs-sidebar id="default-sidebar" ref="sidebar" position="Right"
                :showBackdrop="true"
                :closeOnDocumentClick="true"
                :enableGestures="true"
                type="Over">
                    <div class="d-flex d-md-block justify-content-between cec-p-6 border-bottom border-bottom-style-dash">
                        <div class="d-flex align-items-center">
                            <cw-svg-icon css-class="text-black" :icon-url="svgIconUrl('cog')"></cw-svg-icon>
                            <h2 class="m-0 ml-3">{{ translate('profile.my-profile-settings') }}</h2>
                        </div>
                        <a class="d-md-none text-black" @click="toggle()" href="javascript:;">
                            <cw-svg-icon :icon-url="svgIconUrl('close')"></cw-svg-icon>
                        </a>
                    </div>
                    <profile-setting @on-success="onUpdateSuccess"></profile-setting>
            </ejs-sidebar>
        </div>
    `
});
