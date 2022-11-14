const ErrorMessage = {
    props: {
        label: { type: String, default: '' },
        error: { type: Boolean, require: true },
        message: { type: String, require: true },
        wrapperClass: { type: String, default: '' },
        translateMessage: { type: Boolean, default: true },
        tooltip: { type: Object },
        errorMessageWrapper: { type: String, default: 'mt-1 mb-3' }
    },
    template: `
        <div :class="wrapperClass">
            <label v-if="label">{{ translate(label) }}</label>
            <template v-if="tooltip">
                <span :class="tooltip.cssClass">
                    <cw-svg-icon :icon-url="svgIconUrl(tooltip.icon)" css-class="tooltip-icon cw-icon-sm"/>
                    <div id="profile-tooltip" class="tooltip-body position-absolute d-none">
                        {{ tooltip.title }}
                    </div>
                <span>
            </template>
            <div :class="{ 'has-error': error }">
                <slot></slot>
                <div v-if="error" :class="errorMessageWrapper">
                    <span class="text-danger">{{ translateMessage ? translate(message) : message }}</span>
                </div>
            </div>
        </div>
    `
}

export default ErrorMessage;
