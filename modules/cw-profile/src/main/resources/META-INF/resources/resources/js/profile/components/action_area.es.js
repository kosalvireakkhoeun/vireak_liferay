
const ActionArea = () => ({
    props: {
        title: { type: String, require: true },
        placeholder: { type: String, require: true },
        editable: { type: Boolean, default: false },
    },
    template: `
        <div class="action-area">
            <div class="d-flex py-3">
                <div class="font-size-20 font-weight-light">
                    <span class="text-black">{{ title }}</span>
                </div>
                <div v-if="editable" class="icon-wrapper ml-auto" @click="$emit('action')">
                    <cw-svg-icon css-class="cursor-pointer" :icon-url="svgIconUrl('pencil')"></cw-svg-icon>
                </div>
            </div>
            <slot name="content"></slot>
            <div v-if="!$slots.content" class="clickable-area cursor-pointer" @click="$emit('action')">
                <i class="text-dark">{{ placeholder }}</i>
            </div>
        </div>
    `
});

export default ActionArea;
