import { BadgeDarker } from 'cw-vuejs-global-components/components/badge.es';

export const LabelItem = () => ({
    cwComponents: {
        BadgeDarker: BadgeDarker(),
    },
    props: {
        translateKey: { type: String },
        items: { type: Array, default: () => ([]) },
        item: { type: Object, default: () => ({}) },
        isRemove: { type: Boolean },
        cssWrapper: { type: String },
        cssHeader: { type: String },
    },
    methods: {
        remove: function(key) {
            this.$emit('remove', this.items, key);
        }
    },
    template: `
        <div class="row" :class="cssWrapper">
            <div class="col-sm-12">
                <h4 v-if="translateKey" :class="cssHeader">{{ translate(translateKey) }}</h4>
                <slot />
                <template v-if="items.length > 0">
                    <ul class="list-inline">
                        <li v-for="(item) in items" class="list-inline-item cec-mr-1">
                            <badge-darker :text="item.text">
                                <a v-if="isRemove" href="javascript:;" @click="remove(item.key)">
                                    <cw-svg-icon
                                        :icon-url="svgIconUrl('remove')"
                                        css-class="pl-1"></cw-svg-icon>
                                </a>
                            </badge-darker>
                        </li>
                    </ul>
                </template>
                <template v-if="item.text">
                    <ul class="list-inline">
                        <li class="list-inline-item cec-mr-1">
                            <badge-darker :text="item.text">
                            </badge-darker>
                        </li>
                    </ul>
                </template>
                <template v-else-if="!items.length && !item.text">
                    <span>{{ translate('no-data') }}</span>
                </template>
            </div>
        </div>
    `

});
