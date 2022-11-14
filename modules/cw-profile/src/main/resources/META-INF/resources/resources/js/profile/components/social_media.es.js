import VisibilityDropdown from 'cw-vuejs-global-components/components/profile/visibility_dropdown.es';
import { INSTAGRAM_TYPE } from 'cw-vuejs-global-components/components/profile/profile_constance.es'

const SocialMediaItem = {
    cwComponents: {
        VisibilityDropdown: VisibilityDropdown(),
    },
    data() {
        return {
            'socialMedia': 'social media',
            instagramType: INSTAGRAM_TYPE
        };
    },
    props: [
        'visibilities',
        'count',
        'socialMediaTypes',
        'socialMediaInformation',
        'selectedKey',
        'hasValidSubscription'
    ],
    methods: {
        handleClick: function() {
            this.$emit('remove-socialmedia-row', this.count);
        },
        getTypeName: function(typeKey) {
            let type = this.socialMediaTypes.filter(function(type) {
                return type.key == typeKey;
            });
            return type[0].value;
        }
    },
    computed: {
        getImageType: function() {
            return 'social-network-type-' + this.socialMediaInformation.type;
        }
    },
    template: `
        <div class="social-media-wrapper row no-gutters" v-if="!socialMediaInformation.deleted">
            <div class="col-12 d-block d-md-none">
                <label class="control-label ">
                    {{ translate('social-media') }}
                </label>
            </div>
            <div class="col-lg-3 col-md-4">
                <div class="form-group">
                    <div class="dropdown">
                        <button type="button" class="btn btn-outline-primary btn-block dropdown-toggle d-flex align-items-center" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span>
                                <svg v-if="socialMediaInformation.type == instagramType" v-html="getInstagramIconString()" class="lexicon-icon cw-icon-sm mr-2"></svg>
                                <cw-svg-icon v-else css-class="lexicon-icon cw-icon-sm mr-2" :key="socialMediaInformation.type" :icon-url="svgIconUrl(getImageType)"></cw-svg-icon>
                                <span>{{ getTypeName(socialMediaInformation.type) }}</span>
                            </span>
                            <span class="caret ml-auto"></span>
                        </button>
                        <ul class="dropdown-menu">
                            <li v-for="type in socialMediaTypes" :key="type.key">
                                <a href="javascript:;" @click="socialMediaInformation.type = type.key">
                                    <svg v-if="type.key == instagramType" v-html="getInstagramIconString()" class="lexicon-icon cw-icon-sm mr-2"></svg>
                                    <cw-svg-icon v-else css-class="lexicon-icon cw-icon-sm mr-2" :key="type.key" :icon-url="svgIconUrl('social-network-type-' + type.key)"></cw-svg-icon>
                                    {{ type.value }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-5 col-md-8">
                <div class="form-group">
                    <input class="form-control input-in-middle border-radius-md-right border-radius-sm-left" :placeholder="translate('enter-your-url-here')" type="text" name="moreInfoSocialMedia" v-model="socialMediaInformation.text">
                </div>
            </div>
            <div class="col-lg-3 col-md-10 cec-mt-n3 cec-mt-sm-0">
                <div class="form-group">
                    <visibility-dropdown
                        :items="visibilities"
                        v-model="socialMediaInformation.visibility">
                    </visibility-dropdown>
                </div>
            </div>
            <div class="col-md-1 d-none d-md-flex">
                <a class="ml-4 ml-md-5 ml-lg-3 mt-2 cursor-pointer text-decoration-none text-black" @click="handleClick()">
                    <cw-svg-icon :icon-url="svgIconUrl('remove-bucket')" css-class="cw-icon-trash" />
                </a>
            </div>
            <div class="col-xs-12 d-md-none">
                <button class="btn btn-outline-primary btn-block mb-3" type="button" @click="handleClick()">
                    {{ translate('delete-this-account') }}
                </button>
                <hr>
                </div>
        </div>`
};
export { SocialMediaItem };
