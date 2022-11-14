import { ToggleButton } from 'cw-vuejs-global-components/components/toggle_button.es';

export const StepVerificationItem = () => ({
    props: {
        icon: {
            type: String
        },
        title: {
            type: String
        },
        subTitle: {
            type: String,
        },
        buttonTitle: {
            type: String,
            default: ''
        },
        callback: {
            type: Function
        },
        cssClass: {
            type: String,
            default: ''
        },
        enabled: {
            type: Boolean,
            default: false
        },
        showSwitch: {
            type: Boolean,
            default: false
        },
        cssSvg: { type: String  },
        visibleButton: {
            type: Boolean,
            default: true
        },
        disabledSwitch: { type: Boolean }
    },
    cwComponents: {
        ToggleButton: ToggleButton()
    },
    data: function() {
        return {
            toggleIcon: 'up',
            toggleState: '',
            stateChanged: false
        }
    },
    computed: {
        onSwitchMode: {
            get() {
                this.toggleState = 'new_toggleState';
                return this.enabled;
            },
            set(status) {
                this.$emit('callback');
                this.stateChanged = !this.stateChanged ;
                this.toggleState = this.stateChanged ? 'tmp_toggleState' : '';
            }
        },
    },
    methods: {
        onButtonClick: function() {
           this.$emit('callback');
        }
    },
    template: `
        <div class="cec-card" :class="cssClass">
            <div class="cec-p-4">
                <div class="row justify-content-between align-items-center flex-md-row-reverse">
                    <div class="col-md-4 col-12 col-lg-3 cec-pb-2 pb-md-0 d-flex justify-content-between justify-content-md-end
                        align-items-center">
                        <cw-svg-icon :icon-url="svgIconUrl(icon)" :css-class="cssSvg + ' text-primary d-inline-block d-md-none'"></cw-svg-icon>
                        <template v-if="visibleButton">
                            <template v-if="!showSwitch">
                                <a v-if="enabled" href="javascript:;" class="btn link-icon" @click="onButtonClick">
                                    <cw-svg-icon :icon-url="svgIconUrl('remove-bucket')" :css-class="cssSvg + ' cec-mr-3 d-md-inline-block'"></cw-svg-icon>
                                </a>
                                <button v-else class="btn btn-outline-primary" @click="onButtonClick">{{ translate(buttonTitle) }}</button>
                            </template>
                            <toggle-button
                                v-else
                                :key="toggleState"
                                v-model="onSwitchMode"
                                :label="translate(enabled ? 'enabled' : 'disabled')"
                                :disabled="disabledSwitch"
                            ></toggle-button>
                        </template>
                    </div>
                    <div class="col-12 col-md-8 col-lg-9 d-flex flex-column">
                        <div>
                            <cw-svg-icon :icon-url="svgIconUrl(icon)" :css-class="cssSvg + ' cec-mr-3 text-primary d-none d-md-inline-block'"></cw-svg-icon>
                            <strong class="text-black">{{ translate(title) }}</strong>
                        </div>
                        <span class="text-black cec-ml-md-6" :class="[cssSvg ? 'cec-pl-md-6' : 'cec-pl-md-2']">{{ translate(subTitle) }}</span>
                    </div>
                </div>
            </div>
        </div>
    `
});
