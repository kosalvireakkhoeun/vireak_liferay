import { InfiniteScroll } from 'cw-vuejs-global-components/components/infinite_scroll.es';

const CommunityNotificationSettingMixin = {
    methods: {
        popUpCommunitySetting: function(onSuccess) {
            this.getCwContext().createVueDialog({
                data: {
                    cops: [],
                    isLoading: false,
                    start: 0,
                    end: 8
                },
                cwComponents: {
                    InfiniteScroll: InfiniteScroll()
                },
                dialogOptions: {
                    width: '35.125rem'
                },
                customClass: {
                    popup: 'cec-left-content full-width',
                    header: 'pl-0 border-0',
                    title: 'ml-0 text-black',
                    content: 'mt-2'
                },
                computed: {
                    getScrollContainerCss: function() {
                        return this.cops.length < this.end ? 'overflow-hidden' : '';
                    }
                },
                methods: {
                    shouldAddBackground: function(index) {
                        return (index % 2) == 0;
                    },
                    onSave: function() {
                        this.isLoading = true;
                        this.getResourceService().sendFormData('/community_preference/modify', {
                            communityOptInIds: this.cops.filter(cop => cop.selected).map(c => c.id),
                            communityOptOutIds: this.cops.filter(cop => !cop.selected).map(c => c.id)
                        }).then(response => {
                            this.isLoading = false;
                            if (response.data.success) {
                                this.usersInfo = response.data.result;
                                this.dialog.close();
                                onSuccess('account.notification-saved');
                            }
                        }).catch(error => {
                            this.isLoading = false;
                            console.error(error);
                        });
                    },
                    setResult: function(result) {
                        this.cops.push.apply(this.cops, result.data);
                    }
                },
                templates: {
                    icon: ``,
                    title: `{{ translate('community-of-purpose') }}`,
                    content: `
                        <div class="community-setting-popup">
                            <div class="d-flex justify-content-between mb-3">
                                <div class="cec-card__title pl-3">
                                    {{ translate('community-sites') }}
                                </div>
                                <div class="cec-card__title mr-3">
                                    {{ translate('receive-notifications') }}
                                </div>
                            </div>
                            <infinite-scroll
                                    :fetch-start="start"
                                    :fetch-end="end"
                                    :fetch-increase-by="5"
                                    fetch-cmd="/community_preference/fetch"
                                    :scroll-panel-height="350"
                                    :css-scroll-container="getScrollContainerCss"
                                    @result="setResult"
                                    @loading="isLoading = $event"
                                >
                                <template slot="filter">
                                    <div></div>
                                </template>
                                <template slot="list">
                                    <div class="d-flex justify-content-between align-items-center py-1" :class="{'bg-light': shouldAddBackground(index)}" v-for="(cop, index) in cops" :key="index">
                                        <div :title="cop.title" class="cec-card__title py-2 pl-3 font-weight-normal text-truncate w-50">{{ cop.title }}</div>
                                        <div><input class="mt-n2 ml-n7" type="checkbox" :value="cop.id" v-model="cop.selected"/></div>
                                    </div>
                                </template>
                            </infinite-scroll>
                            <div class="row border-top pt-4 mt-4 mx-2">
                                <button :disabled="isLoading" class="btn btn-primary ml-auto btn--width-200" @click="onSave">{{ translate('save') }}</button>
                            </div>
                        </div>
                    `
                }
            });
        }
    }
};

export default CommunityNotificationSettingMixin;
