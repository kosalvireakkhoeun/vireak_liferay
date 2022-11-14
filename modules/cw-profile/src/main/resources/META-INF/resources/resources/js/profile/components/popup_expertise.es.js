import cloneDeep from 'lodash/cloneDeep';
import { LabelItem } from './label_item.es';
import VisibilityDropdown from 'cw-vuejs-global-components/components/profile/visibility_dropdown.es';
import { CustomMultiSelect } from 'cw-vuejs-global-components/components/custom-vue-multi-select.es';
import { PopupContainer } from 'cw-vuejs-global-components/components/pop_up.es';
import { PopUpFooter } from 'cw-vuejs-global-components/components/pop_up_footer.es';
import { ExpertiseQualification } from './expertise_qualification.es';
import { PREVIEW_AS_CONNECTION_AND_ORG } from 'cw-vuejs-global-components/components/profile/profile_constance.es';

export const PopupExpertise = () => ({
    props: {
        title: { type: String },
        data: { type: Object, default: () => ({}) },
        options: { type: Object, default: () => ({}) },
    },
    cwComponents: {
        PopupContainer,
        ExpertiseQualification: ExpertiseQualification(),
        CustomMultiSelect,
        PopUpFooter: PopUpFooter(),
        LabelItem: LabelItem(),
        VisibilityDropdown: VisibilityDropdown()
    },
    data: function() {
        const {areaOfFocus, skillAndExpertise, language, interestAndHobby} = cloneDeep(this.$store.state.expertise);

        return {
            type: '',
            tempExpertise: {
                areaOfFocus: JSON.stringify(areaOfFocus),
                skillAndExpertise: JSON.stringify(skillAndExpertise),
                language: JSON.stringify(language),
                interestAndHobby: JSON.stringify(interestAndHobby),
            },
            areaOfFocus: areaOfFocus,
            skills: skillAndExpertise,
            language: language,
            interestAndHobby: interestAndHobby,
            isAreaChanged: false,
            isSillChanges: false,
            isLanguageChanged: false,
            isInterestChanged: false,
            isSaving: false,
        };
    },
    created: function() {
        this.asyncFindAreaOfFocus('');
        this.asyncFindSkills('');
        this.asyncFindInterestAndHobby('');
    },
    watch: {
        'areaOfFocus': {
            deep: true,
            handler: function() {
                this.isAreaChanged = this.tempExpertise.areaOfFocus !== JSON.stringify(this.areaOfFocus);
            }
        },
        'skills': {
            deep: true,
            handler: function() {
                this.isSillChanges = this.tempExpertise.skillAndExpertise !== JSON.stringify(this.skills);
            }
        },
        'language': {
            deep: true,
            handler: function() {
                this.isLanguageChanged = this.tempExpertise.language !== JSON.stringify(this.language);
            }
        },
        'interestAndHobby': {
            deep: true,
            handler: function() {
                this.isInterestChanged = this.tempExpertise.interestAndHobby !== JSON.stringify(this.interestAndHobby);
            }
        },
    },
    computed: {
        visibilityOption: function() {
            return this.$store.state.visibilityOption || [];
        },
        isEnableUpdate: function() {
            return (
                this.isAreaChanged ||
                this.isSillChanges ||
                this.isLanguageChanged ||
                this.isInterestChanged
            );
        },
    },
    methods: {
        onCancel: function() {
            const expertise = cloneDeep(this.$store.state.expertise);
            this.areaOfFocus = expertise.areaOfFocus
            this.skills = expertise.skillAndExpertise
            this.language = expertise.language
            this.interestAndHobby = expertise.interestAndHobby
            this.$emit('on-cancel', false);
        },
        onUpdate: function() {
            if (!this.$store.state.userProfile.hasValidSubscription) {
                this.areaOfFocus.visibility = PREVIEW_AS_CONNECTION_AND_ORG
                this.skills.visibility = PREVIEW_AS_CONNECTION_AND_ORG
                this.language.visibility = PREVIEW_AS_CONNECTION_AND_ORG
                this.interestAndHobby.visibility = PREVIEW_AS_CONNECTION_AND_ORG
            }
            this.isSaving = true;
            this.getResourceService().sendFormData('/profile/expertise/modify', {
                areaOfFocus: this.isAreaChanged ? JSON.stringify(this.areaOfFocus) : '',
                skillAndExpertise: this.isSillChanges ? JSON.stringify(this.skills) : '',
                language: this.isLanguageChanged ? JSON.stringify(this.language) : '',
                interestAndHobby: this.isInterestChanged ? JSON.stringify(this.interestAndHobby) : '',
            }).then(response => {
                if (response.data.success) {
                    this.$root.fetchExpertise();
                    this.$emit('on-cancel');
                }
            }).finally(() => this.isSaving = false);
        },
        addItems: function(newTag) {
            const tag = this.addTag(newTag);
            this[this.type].items.push(tag);
        },
        addTag: function(newTag) {
            return {
                key: 'add' + newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
                text: newTag
            };
        },
        removeTag: function(tags, key) {
            let index = tags.findIndex(tag => tag.key === key);
            this.$delete(tags, index);
        },
        asyncFind: function(type, query) {
            let instance = this;

            this.isLoading = true;
            Liferay.Service(
                '/assetcategory/search-categories-display',
                {
                    end: this.options.limit,
                    groupIds: [this.options[type].groupId],
                    start: 0,
                    title: query,
                    vocabularyIds: [this.options[type].vocabularyId]
                },
                function(obj) {
                    let buffer = [];
                    let categories = obj.categories;

                    if (categories.length > 0) {
                        categories.forEach(function(item, index) {
                            let t = {};

                            t.key = item.categoryId;
                            t.text = item.name;

                            buffer.push(t);
                        });
                    }

                    instance.options[type].items = buffer;
                    instance.isLoading = false;
                }
            );
        },
        asyncFindAreaOfFocus: function(query) {
            this.type = 'areaOfFocus';
            this.asyncFind(this.type, query);
        },
        asyncFindSkills: function(query) {
            this.type = 'skills';
            this.asyncFind(this.type, query);
        },
        asyncFindInterestAndHobby: function(query) {
            this.type = 'interestAndHobby';
            this.asyncFind(this.type, query);
        },
    },
    template: `
        <div class="cec-popup-wrapper">
            <div class="cec-popup-container">
                <transition appear name="fade">
                    <popup-container
                        css-popup-wrapper="cec-popup--width-800 cec-popup--fullscreen"
                        css-header-wrapper="justify-content-between mb-3">
                        <template #header>
                            <span class="font-size-24 font-weight-lighter text-black">{{ title }}</span>
                            <a class="btn link-icon h-auto mt-0" @click="onCancel()"><cw-svg-icon :icon-url="svgIconUrl('close')" css-class="cw-icon-sm"></cw-svg-icon></a>
                        </template>
                        <template #body>
                            <div class="expertise-wrapper cec-mb-6">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label-item
                                            :items="areaOfFocus.items"
                                            translate-key="area-of-focus"
                                            :is-remove="true"
                                            @remove="removeTag"
                                        >
                                            <visibility-dropdown
                                                :items="visibilityOption"
                                                :placeholder="visibilityOption[0].text"
                                                v-model="areaOfFocus.visibility"
                                            >
                                                <custom-multi-select
                                                    :close-on-select="true"
                                                    :hide-selected="true"
                                                    :internal-search="false"
                                                    :multiple="true"
                                                    :options-limit="options.limit"
                                                    :options="options.areaOfFocus.items"
                                                    :placeholder="translate('select-areas-of-focus')"
                                                    :taggable="true"
                                                    @search-change="asyncFindAreaOfFocus"
                                                    @tag="addItems"
                                                    label="text"
                                                    select-label=""
                                                    tag-placeholder=""
                                                    tag-position="bottom"
                                                    track-by="key"
                                                    v-model="areaOfFocus.items"
                                                ></custom-multi-select>
                                            </visibility-dropdown>
                                        </label-item>
                                    </div>
                                    <div class="col-sm-6">
                                        <label-item
                                            :items="skills.items"
                                            translate-key="skills-and-expertise"
                                            :is-remove="true"
                                            @remove="removeTag">
                                            <visibility-dropdown
                                                :items="visibilityOption"
                                                :placeholder="visibilityOption[0].text"
                                                v-model="skills.visibility"
                                            >
                                                <custom-multi-select
                                                    :close-on-select="true"
                                                    :hide-selected="true"
                                                    :internal-search="false"
                                                    :multiple="true"
                                                    :options-limit="options.limit"
                                                    :options="options.skills.items"
                                                    :placeholder="translate('select-skills-and-expertise')"
                                                    :taggable="true"
                                                    @search-change="asyncFindSkills"
                                                    @tag="addItems"
                                                    label="text"
                                                    select-label=""
                                                    tag-placeholder=""
                                                    tag-position="bottom"
                                                    track-by="key"
                                                    v-model="skills.items"
                                                ></custom-multi-select>
                                            </visibility-dropdown>
                                        </label-item>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label-item
                                            :items="language.items"
                                            translate-key="languages"
                                            :is-remove="true"
                                            @remove="removeTag"
                                        >
                                            <visibility-dropdown
                                                :items="visibilityOption"
                                                :placeholder="visibilityOption[0].text"
                                                v-model="language.visibility"
                                            >
                                                <custom-multi-select
                                                    :close-on-select="true"
                                                    :hide-selected="true"
                                                    :multiple="true"
                                                    :options="options.languageOptions"
                                                    :placeholder="translate('select-languages')"
                                                    label="text"
                                                    select-label=""
                                                    track-by="key"
                                                    v-model="language.items"
                                                ></custom-multi-select>
                                            </visibility-dropdown>
                                        </label-item>
                                    </div>
                                    <div class="col-sm-6">
                                        <label-item
                                            v-if="interestAndHobby"
                                            :items="interestAndHobby.items"
                                            translate-key="interests-and-hobbies"
                                            :is-remove="true"
                                            @remove="removeTag"
                                        >
                                            <visibility-dropdown
                                                :items="visibilityOption"
                                                :placeholder="visibilityOption[0].text"
                                                v-model="interestAndHobby.visibility"
                                            >
                                                <custom-multi-select
                                                    :close-on-select="true"
                                                    :hide-selected="true"
                                                    :internal-search="false"
                                                    :multiple="true"
                                                    :options-limit="options.limit"
                                                    :options="options.interestAndHobby.items"
                                                    :placeholder="translate('select-interests-and-hobbies')"
                                                    :taggable="true"
                                                    @search-change="asyncFindInterestAndHobby"
                                                    @tag="addItems"
                                                    label="text"
                                                    select-label=""
                                                    tag-placeholder=""
                                                    tag-position="bottom"
                                                    track-by="key"
                                                    v-model="interestAndHobby.items"
                                                ></custom-multi-select>
                                            </visibility-dropdown>
                                        </label-item>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template slot="footer">
                            <pop-up-footer
                                :enable-confirm-button="isEnableUpdate"
                                :is-submitting="isSaving"
                                @on-confirm="onUpdate"
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
