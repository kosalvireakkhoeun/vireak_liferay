import { CwSplitDropdown } from 'cw-vuejs-global-components/components/split_dropdown.es';

export const PreviewProfile = () => ({
    cwComponents: {
        CwSplitDropdown
    },
    props: {
        isOwner: { type: Boolean },
        previewAsItems: { type: Array, default: () => ([]) },
        cssWrapper: { type: String, default: '' },
        cssCog: { type: String, default: '' },
        cssSvg: { type: String, default: '' },
        cssDropdown: { type: String, default: '' },
    },
    template: `
        <div v-if="isOwner" :class="cssWrapper">
           <cw-split-dropdown
               :label="translate('profile.preview-as-placeholder')"
               :value="previewAsItems[0]"
               :css-wrapper="'cw-split-dropdown--width-220 ' + cssDropdown"
               :items="previewAsItems"
               @click="$emit('on-preview-as', $event)">
           </cw-split-dropdown>
           <a @click.prevent="$root.openSetting" href="javascript:;" class="cec-ml-4 cog-icon" :class="cssCog">
               <cw-svg-icon :css-class="'align-self-center ' + cssSvg" :icon-url="svgIconUrl('cog')"></cw-svg-icon>
           </a>
       </div>
    `
});
