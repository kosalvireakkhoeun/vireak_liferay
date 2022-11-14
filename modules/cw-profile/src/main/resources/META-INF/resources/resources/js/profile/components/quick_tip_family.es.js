import { QuickTip } from 'cw-vuejs-global-components/components/quick_tip.es';

export const QuickTipFamily = () => ({
    cwComponents: {
        QuickTip: QuickTip()
    },
    data: function () {
        return {
            title: 'family.tip-title',
            tips: [
                {
                    title: '',
                    detail: 'family.tip-item'
                }
            ],
            url: window.location.origin + '/web/help-guide'
        }
    },
    template: `
        <quick-tip :title="translate(title)"
            :tips="tips"
            :url="url"
            css-class="border-0 cec-p-4 d-none d-md-block"
            view-more-class="">
        </quick-tip>
    `
});
