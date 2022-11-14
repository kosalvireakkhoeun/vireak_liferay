const ContainerWithTitle = {
    props: {
        title: { type: String, default: '' },
        wrapperClass: { type: String, default: '' },
    },
    template: `
        <div class="cec-p-6" :class="wrapperClass">
            <div v-if="title" class="title">
                <span class="font-size-22 font-weight-light text-black">{{ translate(title) }}</span>
            </div>
            <slot />
        </div>
    `
}

export default ContainerWithTitle;
