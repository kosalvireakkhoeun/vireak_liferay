import { QuickTip } from 'cw-vuejs-global-components/components/quick_tip.es';

export const QuickTipProfile = () => ({
    props: {
        cssClass: { type: String, default: '' },
    },
    cwComponents: {
        QuickTip: QuickTip()
    },
    data: function () {
        return {
            title: 'profile.tip-title',
            overview: 'profile.tip-overview',
            tips: [
                {
                    title: '',
                    detail: 'profile.tip-item'
                }
            ],
            url: window.location.origin + '/web/help-guide'
        }
    },
    template: `
        <quick-tip :title="translate(title)" :overview="translate(overview)" :tips="tips" :url="url" :css-class="['border-0 cec-p-4', cssClass]" view-more-class=""></quick-tip>
    `
});
