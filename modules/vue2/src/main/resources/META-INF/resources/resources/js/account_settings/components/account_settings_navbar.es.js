import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';

export const AccountSettingsNavbar = () => ({
    props: {
        options: { type: Array, default: () => ([]) },  // [{key, value}]
        selectedOption: { type: [String], default: '' },
        icon: { type: String, default: 'training-and-developement' }
    },
    cwComponents: {
        CwDropdown: CwDropdown()
    },
    methods: {
        onChange: function(item) {
            this.$emit('on-change-option', item.key);
        }
    },
    template: `
       <div class="learning-wrapper rounded my-3">
           <div class="d-inline-flex w-100">
               <div class="flex-grow-3 bg-white border-right">
                   <div class="input-group">
                       <span class="input-group-addon">
                           <svg class="cw-icon-xl py-1 my-2">
                               <use :xlink:href="svgIconUrl(icon)" />
                           </svg>
                       </span>
                   </div>
               </div>
                <cw-dropdown
                    class-wrapper="learning-dropdown btn-group border-right"
                    css-toggle="h-100 border-0"
                    css-dropdown-menu="dropdown-menu--darker rounded-0"
                    :required-translate="true"
                    :value="selectedOption"
                    :items="options"
                    :require-item="true"
                    @change="onChange">
                    <template slot="customIcon">
                        <cw-svg-icon :icon-url="svgIconUrl('view-all')" css-class="cw-icon-sm dropdown-icon" />
                    </template>
                </cw-dropdown>
           </div>
       </div>
    `
});
