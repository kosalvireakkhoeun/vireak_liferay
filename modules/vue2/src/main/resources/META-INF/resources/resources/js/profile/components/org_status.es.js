import { LabelItem } from './label_item.es';
import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';

export const OrgStatus = () => ({
    cwComponents: {
        CwDropdown: CwDropdown(),
        LabelItem: LabelItem(),
    },
    props: {
        data: { type: Object, default: () => ({}) },
        organizationItems: { type: Array, default: () => ([]) },
    },
    template: `
        <div class="org-status-block">
            <p v-if="organizationItems.length < 2" class="font-weight-lighter font-size-22">{{ data.name }}</p>
            <cw-dropdown
                v-else
                :value="data.id"
                :items="organizationItems"
                :require-item="true"
                :change-icon-on-mobile="false"
                @change="$emit('select-organization', $event)"
                class-wrapper="mw-sm-200 pb-4 pt-4 pt-sm-0"
            ></cw-dropdown>
            <div class="d-sm-flex">
                <div
                    :style="'background-image: url(' + data.orgLogo + ')'"
                    class="aspect-ratio-bg-center aspect-ratio-bg-cover img-72-72 mr-sm-6 mb-3 mb-sm-0"
                    v-background-lazyload
                ></div>
                <div class="row flex-fill pr-sm-7">
                    <div class="col-6 col-sm-4">
                        <label-item
                            css-header="text-capitalize"
                            translate-key="member-status"
                            :item="data.member.status"
                        ></label-item>
                    </div>
                    <div class="col-6 col-sm-4">
                        <label-item
                            css-header="text-capitalize"
                            translate-key="member-group"
                            :item="data.member.group"
                        ></label-item>
                    </div>
                    <div class="col-6 col-sm-4">
                        <label-item
                            css-header="text-capitalize"
                            translate-key="member-subgroup"
                            :item="data.member.subGroup"
                        ></label-item>
                    </div>
                </div>
            </div>
        </div>
    `
});
