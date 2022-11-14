import VisibilityDropdown from 'cw-vuejs-global-components/components/profile/visibility_dropdown.es';
import { CwInputGroupDropdown } from 'cw-vuejs-global-components/components/input_group_dropdown.es';
import { RegExpMixin } from 'cw-vuejs-global-components/mixins/regex_mixin.es';
import cloneDeep from 'lodash/cloneDeep';

const WebsiteItem = {
    cwComponents: {
        VisibilityDropdown: VisibilityDropdown(),
        CwInputGroupDropdown,
    },
    props:[
        'website-item-data',
        'unique-id',
        'visibilities',
        'placeholder',
        'selectedKey',
        'hasValidSubscription'
    ],
    data: function() {
        return {
            linkUrl: cloneDeep(this.websiteItemData.$model.text),
            protocols: [
                { key: 'http', text: 'http://' },
                { key: 'https', text: 'https://' }
            ],
            selectedProtocol: ''
        }
    },
    mixins: [ RegExpMixin ],
    mounted: function() {
        this.initSelectedProtocol();
    },
    computed: {
        getUrl: {
            get() {
                return this.linkUrl;
            },
            set(value) {
                this.linkUrl = this.removeProtocol(value);
                const protocol = this.getProtocolKey(value);
                if (protocol) {
                    this.selectedProtocol = protocol;
                }
                this.setUrlLink();
            }
        }
    },
    methods: {
        initSelectedProtocol: function() {
            const protocol = this.getProtocolKey(this.linkUrl);
            this.selectedProtocol = protocol ? protocol : this.protocols[0].key;
            if (!protocol && this.websiteItemData.$model.text) {
                this.setUrlLink();
            }
            this.linkUrl = this.removeProtocol(this.linkUrl);
        },
        getProtocolKey: function(url) {
            const containProtocol = this.isContainProtocol(url);
            return containProtocol ? containProtocol[1].replace(':', '') : '';
        },
        setUrlLink: function() {
            this.websiteItemData.text.$model = '';
            this.websiteItemData.text.$model = this.selectedProtocol + '://' + this.linkUrl;
        }
    },
    template: `
        <div class="row no-gutters" v-if="!websiteItemData.$model.deleted">
            <input type="hidden" :name="'websiteItemProfileId'+uniqueId" :value="websiteItemData.profileId" />
            <div class="col-sm-7 col-md-6 col-lg-8">
                <div class="form-group mb-0 mb-sm-3">
                    <label class="control-label d-block d-md-none">
                        {{ translate('website') }}
                    </label>
                    <div class="input-group">
                        <cw-input-group-dropdown
                            ref="dropdownProtocol"
                            svg-icon="caret-bottom"
                            :css-button="'bg-white border px-2 font-weight-normal d-flex justify-content-between dropdown_protocol align-items-center '
                                + (websiteItemData.$invalid ? 'border-danger' : '')"
                            :options="protocols"
                            v-model="selectedProtocol"
                            @change="setUrlLink"
                        ></cw-input-group-dropdown>
                        <input
                            class="form-control border-radius-right-0 border-radius-sm-right"
                            :class="{ 'border-danger' : websiteItemData.$invalid }"
                            :placeholder="placeholder"
                            type="text"
                            :name="'websiteText'+uniqueId"
                            v-model="getUrl">
                    </div>
                    <span v-if="websiteItemData.$invalid"
                        class="help-block text-danger mb-0">
                        {{ translate('please-enter-a-valid-url') }}
                    </span>
                </div>
            </div>
            <div class="col-sm-4 col-lg-3">
                <div class="form-group cec-mt-sm-6 cec-mt-md-0">
                    <visibility-dropdown
                        :items="visibilities"
                        v-model="websiteItemData.$model.visibility">
                    </visibility-dropdown>
                </div>
            </div>
            <div class="col-sm-1 d-none d-sm-flex">
                <a class="ml-4 ml-md-5 ml-lg-3 cec-pt-6 cec-mt-1 cec-pt-md-2 cec-mt-md-0 cursor-pointer text-decoration-none text-black" @click="$emit('delete-row')">
                    <cw-svg-icon :icon-url="svgIconUrl('remove-bucket')" css-class="cw-icon-trash" />
                </a>
            </div>
            <div class="col-xs-12 d-sm-none">
                <button class="btn btn-outline-primary btn-block mb-3" type="button" @click="$emit('delete-row')">
                    {{ translate('delete-this-website') }}
                </button>
                <hr>
            </div>
        </div>
    `
};

export { WebsiteItem };
