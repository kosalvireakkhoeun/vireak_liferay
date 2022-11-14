export const WarningMessage = () => ({
    props: {
        icon: { type: String },
        label: { type: String },
        cssWrapper: { type: String },
    },
    template: `
        <div class="warning-message d-flex justify-content-center align-items-sm-center text-dark cec-px-6 cec-py-4
            cec-py-sm-2" :class="cssWrapper">
            <cw-svg-icon :icon-url="svgIconUrl(icon)"></cw-svg-icon>
            <div class="text-dark ml-2">{{ translate(label) }}</div>
        </div>
    `
});
