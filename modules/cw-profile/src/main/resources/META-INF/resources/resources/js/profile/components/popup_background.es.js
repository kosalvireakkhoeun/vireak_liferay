import { PopupContainer } from 'cw-vuejs-global-components/components/pop_up.es';
import { PopUpFooter } from 'cw-vuejs-global-components/components/pop_up_footer.es';
import VisibilityDropdown from 'cw-vuejs-global-components/components/profile/visibility_dropdown.es';

export const PopupBackground = () => ({
    props: {
        onClose: { type: Function, required: true },
        givenName: { type: String, required: true },
        backgroundInfo: { type: String, required: true },
        selectedBackgroundVisibility: { type: Number, required: true }
    },
    cwComponents: {
        PopupContainer,
        PopUpFooter: PopUpFooter(),
        VisibilityDropdown: VisibilityDropdown(),
    },
    data: function() {
        return {
            clonedBackgroundInfo: this.backgroundInfo,
            clonedSelectedBackgroundVisibility: this.selectedBackgroundVisibility,
            isSubmitting: false,
        };
    },
    computed: {
        disableButtonSave: function() {
            return (
                this.isSubmitting ||
                (this.clonedBackgroundInfo == this.backgroundInfo &&
                    this.clonedSelectedBackgroundVisibility == this.selectedBackgroundVisibility)
            );
        },
        visibilityTypes: function() {
            return this.$store.state.visibilityOption || [];
        },
    },
    methods: {
        onSave: function() {
            this.isSubmitting = true;
            this.getResourceService()
                .sendFormData('/my-profile/background/edit', {
                    backgroundInfo: this.clonedBackgroundInfo,
                    visibility: this.clonedSelectedBackgroundVisibility
                })
                .then((response) => {
                    this.isSubmitting = false;
                    if (response.data.success) {
                        this.onClose({
                            isUpdate: true,
                            backgroundInfo: this.clonedBackgroundInfo,
                            visibility: this.clonedSelectedBackgroundVisibility
                        });
                    }
                })
                .catch((error) => {
                    this.isSubmitting = false;
                    console.error(error);
                });
        }
    },
    template: `
        <div class="cec-popup-wrapper">
            <div class="cec-popup-container">
                <transition appear name="fade">
                    <popup-container css-popup-wrapper="cec-popup--width-650 cec-popup--fullscreen" css-header-wrapper="justify-content-between mb-3">
                        <template #header>
                            <span class="font-size-24 font-weight-lighter text-capitalize">{{ translate('about-x', givenName) }}</span>
                            <a class="btn link-icon h-auto mt-0" @click="onClose()"><cw-svg-icon :icon-url="svgIconUrl('close')" css-class="cw-icon-sm"></cw-svg-icon></a>
                        </template>
                        <template #body>
                            <div class="mx-0 px-0 mb-4 no-gutters">
                                <div class="form-group">
                                    <visibility-dropdown
                                        placeholder="who-can-see-this"
                                        label="background"
                                        :items="visibilityTypes"
                                        v-model="clonedSelectedBackgroundVisibility"
                                    >
                                        <textarea
                                            class="form-control"
                                            rows="10"
                                            :id="qualify('background')"
                                            :placeholder="translate('write-a-brief-background-about-yourself')"
                                            v-model="clonedBackgroundInfo"
                                        ></textarea>
                                    </visibility-dropdown>
                                </div>
                            </div>
                        </template>
                        <template slot="footer">
                            <pop-up-footer
                                :enable-confirm-button="!disableButtonSave"
                                @on-confirm="onSave"
                                confirm-button-title="save"
                                css-confirm-button="btn--width-240"
                            ></pop-up-footer>
                        </template>
                    </popup-container>
                </transition>
            </div>
        </div>
    `
});
