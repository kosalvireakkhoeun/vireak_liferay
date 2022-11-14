export const DetailRowCard = () => ({
    props: {
        icon: { type: String },
        label: { type: String },
    },
    template: `
        <div class="cec-mb-6 d-flex">
            <div class="col-1 px-0">
                 <cw-svg-icon css-class="text-info mr-2" :icon-url="svgIconUrl(icon)" />
            </div>
            <div class="col-11 pr-0">
                <p class="font-weight-bold cec-mb-2 text-black">{{ translate(label) }}:</p>
                <slot></slot>
            </div>
        </div>
    `
});
