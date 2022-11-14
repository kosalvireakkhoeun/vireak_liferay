const PreferredItem = {
    props: {
        item: { type: Object, require: true },
        value: { type: [String, Number, Boolean], default: true },
        radioName: { type: String, default: 'radio' },
        wrapperClass: { type: String, default: '' },
        removeIcon: { type: String, default: 'remove-bucket' },
        removeButtonText: { type: String },
        showRemoveButton: { type: Boolean, default: true },
    },
    template: `
        <div class="mb-0" :class="wrapperClass">
            <cw-radio-wrapper :label="translate('preferred')" css-class="mt-0 ml-0">
                <input type="radio"
                    :name="qualify(radioName)"
                    :value="value"
                    v-model="item.preferred"
                    @change="$emit('on-radio-change')"
                ></input>
            </cw-radio-wrapper>
            <template v-if="showRemoveButton">
                <span @click="$emit('remove')" class="ml-auto cursor-pointer d-none d-md-block">
                    <cw-svg-icon :icon-url="svgIconUrl(removeIcon)" css-class="cw-icon-sm"/>
                </span>
                <button
                    class="btn btn-secondary btn-update-profile sm-down--width-100 mt-3 d-md-none"
                    @click="$emit('remove')"
                >
                    <span v-if="removeButtonText">{{ translate(removeButtonText) }}</span>
                </button>
            </template>
        </div>
    `
}

export default PreferredItem;
