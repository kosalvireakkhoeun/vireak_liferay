import { CwTable } from 'cw-vuejs-global-components/components/table.es';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import { PopUpFooter } from 'cw-vuejs-global-components/components/pop_up_footer.es';

const EditCommunitiesPopup = {
    methods: {
        onEditCommunities: function() {
            const instance = this;
            this.getCwContext().createVueDialog({
                data: function() {
                    return {
                        copLists: cloneDeep(instance.$store.state.copList),
                        tempCopList: cloneDeep(instance.$store.state.copList),
                        tableColumns: [
                            { key: 'siteName', value: this.translate('community-sites') },
                            { key: 'show', value: this.translate('show-in-profile') },
                            { key: 'preferred', value: '' },
                        ],
                        widthColumns: ['w-60 th-site cec-mb-3', 'w-20 th-show-profile', 'w-20 th-primary'],
                        isLoading: false,
                        isSaving: false,
                        isMobile: this.isMobileScreenWidth(),
                    }
                },
                cwComponents: {
                    CwTable,
                    PopUpFooter: PopUpFooter()
                },
                dialogOptions: {
                    width: '49rem'
                },
                mobileFullScreen: true,
                customClass: {
                    header: 'pl-0 pb-0 border-0',
                    title: 'm-0 pr-3 text-black',
                    content: 'cec-mt-2'
                },
                created: function() {
                    if (!this.copLists.length) {
                        this.fetchCommunities();
                    }
                },
                computed: {
                    cssTable: function() {
                        return (this.isMobile ? 'table-adaptive ' : '') + 'text-dark text-left table-first-td-truncate table-striped';
                    },
                    communityItemPrimary: {
                        get() {
                            return this.copLists.find(cop => cop.preferred);
                        },
                        set(obj) {
                            this.copLists.forEach(cop => (cop.preferred = (cop.groupId === obj.groupId)));
                        }
                    },
                    showTable: function() {
                        return this.copLists && this.copLists.length || this.isLoading;
                    },
                    disableButtonSave: function() {
                        return isEqual(this.copLists, instance.$store.state.copList);
                    }
                },
                mounted: function () {
                    window.addEventListener('resize', this.resizeMobile);
                },
                methods: {
                    isMobileScreenWidth: function() {
                        return window.screen.availWidth < 575;
                    },
                    resizeMobile: function () {
                        this.isMobile = this.isMobileScreenWidth();
                    },
                    itemValue: function(item, columnKey) {
                        return item[columnKey];
                    },
                    fetchCommunities: function() {
                        this.isLoading = true;
                        this.getResourceService().fetch('/profile/communities/fetch').then(response => {
                            if (response.data.success) {
                                this.copLists = response.data.result;
                                instance.$store.commit('setCopList', cloneDeep(this.copLists));
                            }
                        }).finally(() => this.isLoading = false);
                    },
                    saveCommunities: function() {
                        this.isSaving = true;
                        this.copLists.forEach(cop => cop.joinedDate = null);
                        const community = {
                            items: this.copLists
                        };
                        this.getResourceService().sendFormData('/profile/community/modify', {
                            community: JSON.stringify(community)
                        }).then(response => {
                            this.fetchCommunities();
                            instance.onUpdatedCop({
                                communityTabInfo: JSON.parse(response.data.result),
                                copList: cloneDeep(this.copLists)
                            });
                            this.dialog.close();
                        }).finally(() => this.isSaving = false);
                    }
                },
                templates: {
                    title: `{{ translate('community-of-purpose') }}`,
                    content: `
                        <div class="popup-communities-wrapper">
                            <cw-table v-if="showTable"
                                :data="copLists"
                                :columns="tableColumns"
                                :css-table="cssTable"
                                css-table-wrapper="scroll-content h-100"
                                :column-widths="widthColumns"
                                :is-loading="isLoading">
                                <template slot="renderRow" slot-scope="props">
                                    <div v-if="isMobile" class="d-block d-sm-none">
                                        <span
                                            v-if="props.rowData.column.key === tableColumns[0].key"
                                            class="text-truncate text-black w-100"
                                        >
                                            {{ itemValue(props.rowData.item, props.rowData.column.key) }}
                                            <span v-if="props.rowData.item.unlisted" class="cec-ml-1 text-gray">({{ translate('unlisted') }})</span>
                                        </span>
                                        <div class="d-flex">
                                            <div class="d-flex cec-mt-4" v-if="props.rowData.column.key === tableColumns[0].key">
                                                <input
                                                    type="checkbox"
                                                    name="show"
                                                    v-model="props.rowData.item.show">
                                                <span class="text-gray">{{ translate('show-in-profile') }}</span>
                                            </div>
                                            <div class="d-flex td-radio" v-if="props.rowData.column.key === tableColumns[2].key">
                                                <cw-radio-wrapper
                                                    :label="translate('primary')">
                                                    <input
                                                        type="radio"
                                                        :name="namespace+'communityPrimary'"
                                                        :value="props.rowData.item"
                                                        v-model="communityItemPrimary">
                                                </cw-radio-wrapper>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="d-sm-flex d-none" :class="{ 'cec-ml-6 ': props.rowData.column.key === tableColumns[1].key }">
                                        <span
                                            v-if="props.rowData.column.key === tableColumns[0].key"
                                            class="text-truncate text-black"
                                        >
                                            {{ itemValue(props.rowData.item, props.rowData.column.key) }}
                                            <span v-if="props.rowData.item.unlisted" class="cec-ml-1 text-gray">({{ translate('unlisted') }})</span>
                                        </span>
                                        <input
                                            v-if="props.rowData.column.key === tableColumns[1].key"
                                            type="checkbox"
                                            name="show"
                                            v-model="props.rowData.item.show">

                                        <cw-radio-wrapper
                                            v-if="props.rowData.column.key === tableColumns[2].key"
                                            :label="translate('primary')">
                                            <input
                                                type="radio"
                                                :name="namespace+'communityPrimary'"
                                                :value="props.rowData.item"
                                                v-model="communityItemPrimary">
                                        </cw-radio-wrapper>
                                    </div>
                                </template>
                                <template #loading>
                                    <div v-if="isLoading">
                                        <cw-loading-icon size="icon-loading"></cw-loading-icon>
                                    </div>
                                </template>
                            </cw-table>
                            <div v-else class="d-flex flex-wrap justify-content-center pt-4">
                                <img :src="imageUrl('empty-community.png')">
                                <div class="text-center w-100 font-size-18 text-black font-weight-bold pt-4">
                                    {{ translate('you-dont-have-any-communities-yet') }}
                                </div>
                            </div>
                            <hr class="cec-my-6" />
                            <div class="d-sm-flex">
                                <div class="d-flex cec-mr-4 cec-mb-4 cec-mb-sm-0 text-black">
                                    <cw-svg-icon :icon-url="svgIconUrl('warning-info')" css-class="cw-icon-sm flex-shrink-0 cec-mr-1"></cw-svg-icon>
                                    <span>{{ translate('profile.unlisted-community-note') }}</span>
                                </div>
                                <pop-up-footer
                                    :enable-confirm-button="!disableButtonSave"
                                    :is-submitting="isSaving"
                                    @on-confirm="saveCommunities()"
                                    confirm-button-title="save"
                                    css-footer="d-md-inline align-self-center"
                                    css-confirm-button="btn--width-240 cec-mr-"
                                ></pop-up-footer>
                            </div>
                        </div>
                    `
                }
            });
        }
    }
};

export { EditCommunitiesPopup };
