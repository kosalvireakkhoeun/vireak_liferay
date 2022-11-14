import { InfiniteScroll } from 'cw-vuejs-global-components/components/infinite_scroll.es';
import ImageItem from 'cw-vuejs-global-components/components/image_item.es';
import { ScrollMixin } from 'cw-vuejs-global-components/mixins/scroll.es';
import { PopupOverviewDetails } from 'cw-vuejs-global-components/components/course/course_detail/popup_overview_details.es';

const ALL_ACTIVITIES_CATEGORY_KEY = "-1";

export const ActivityLog = () => ({
    props: {
        category: { type: Object },
    },
    cwComponents: {
        InfiniteScroll: InfiniteScroll(),
        ImageItem,
        PopupOverviewDetails: PopupOverviewDetails()
    },
    mixins: [ ScrollMixin ],
    data: function() {
        return {
            activityLogs: [],
            cssScrollContentList: "scroll-content-list h-55-vh",
            auditEventId: 0,
            isShowing: false,
            isLoading: false,
            start: 0,
            end: 15,
            total: 0,
            hasMore: true,
            delta: 15,
            allActivitiesCategoryKey: ALL_ACTIVITIES_CATEGORY_KEY,
            isShowingPopupOverviewDetails: false,
            entry: {
                previousData: '',
                newData: '',
                overviewTitle: '',
                overviewLogPopupTitle: ''
            }
        }
    },
    created: function() {
        this.fetchActivityLogs();
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed: function() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        initEvent: function() {
            this.$nextTick(() => {
                $('span:not([old-data=""])').click(this.displayOverviewDetails);
            });
        },
        displayOverviewDetails: function(event) {
            this.entry.previousData = event.target.getAttribute('old-data');
            this.entry.newData = event.target.getAttribute('new-data');
            this.entry.overviewTitle = event.target.getAttribute('title');
            this.entry.overviewLogPopupTitle = this.translate(
                this.entry.overviewTitle === 'learning-path-overview' ?
                'learning-path-overview-log' : 'course-overview-log'
            );
            this.entry.overviewTitle = this.translate(this.entry.overviewTitle);
            if (this.isShowingPopupOverviewDetails || !this.entry.previousData || !this.entry.newData) {
                return;
            }
            this.isShowingPopupOverviewDetails = true;
        },
        reset: function() {
            this.start = 0;
            this.end = 10,
            this.hasMore = true;
            this.activityLogs = [];
            this.total = 0;
            this.$nextTick(() => {
                this.fetchActivityLogs();
            });
        },
        fetchActivityLogs: function() {
            this.isLoading = true;
            this.getResourceService()
            .fetch('/account_setting/activity_logs/get', {
                urlOptions: {
                    params: {
                        start: this.start,
                        end: this.end,
                        category: this.category.key
                    }
                }
            }).then((response) => {
                if (response.data.success) {
                    const result = JSON.parse(response.data.result);
                    const lastIndex = this.activityLogs.length - 1;
                    if (lastIndex > -1 && result.data[0] && this.activityLogs[lastIndex].date == result.data[0].date) {
                        Array.prototype.push.apply(
                            this.activityLogs[lastIndex].activityLogs, result.data[0].activityLogs)
                        result.data.splice(0, 1);
                    }
                    this.activityLogs.push.apply(this.activityLogs, result.data);
                    if (this.total == 0) {
                        this.total = result.total;
                    }
                    if (this.total <= this.end) {
                        this.hasMore = false;
                    }
                    this.start = this.end;
                    this.end += this.delta;
                    let hasScroll = document.body.offsetHeight > window.innerHeight;
                    if (this.hasMore && !hasScroll) {
                        this.fetchActivityLogs();
                    }
                    this.initEvent();
                }
            }).finally(() => this.isLoading = false);
        },
        handleScroll: function(e) {
            if (document.getElementById(this.qualify('accountSettings'))) {
                const bottomOfWindow = this.getDocHeight() - 200 <= this.getScrollXY()[1] + window.innerHeight;
                if (bottomOfWindow && !this.isLoading && this.hasMore) {
                    this.fetchActivityLogs();
                }
            }
        },
        showHidePopUpOverviewDetails: function() {
            this.isShowingPopupOverviewDetails = !this.isShowingPopupOverviewDetails;
        },
    },
    template: `
        <div>
            <popup-overview-details
                v-if="isShowingPopupOverviewDetails"
                :entry="entry"
                :on-hide-show="showHidePopUpOverviewDetails"
                :is-showing="isShowingPopupOverviewDetails">
            </popup-overview-details>
            <h1 class="font-weight-lighter mt-0 cec-mb-4">
                {{ category.value }}
            </h1>
            <p v-if="category.key === allActivitiesCategoryKey">
                {{ translate('activity.log.all-activity-message') }}
            </p>
            <div v-if="activityLogs.length"
                class="activity-log-list">
                <div v-for="activityLog in activityLogs"
                    class="cec-pt-4 cec-pb-2 border-bottom-style-dash-list">
                    <p class="font-weight-bold cec-mb-3">
                        {{ activityLog.date }}
                    </p>
                    <div v-for="activity in activityLog.activityLogs"
                        class="d-md-flex align-items-start cec-mb-4 cec-mb-md-2">
                        <p class="cec-mb-2 mb-md-0 w-10 sm-down--width-100 cec-mt-md-6 text-nowrap">
                            {{ activity.time }}
                        </p>
                        <div class="d-flex border border-radius-10 cec-p-4 cec-ml-md-6 cec-ml-lg-4 w-90 md-down--width-100"
                            :class="{ 'align-items-center': !activity.bodyHtmlTemplate }" >
                            <image-item
                               figure-class="m-0"
                               img-class="cw-icon-xxl rounded-circle mr-3"
                               :source="activity.profileUrl"
                               :alt="activity.time">
                           </image-item>
                            <div class="d-flex align-items-center flex-wrap w-100">
                                <div v-html="activity.headerHtmlTemplate" class="w-100"></div>
                                <div v-if="activity.bodyHtmlTemplate" v-html="activity.bodyHtmlTemplate" class="pt-1 w-100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <span v-if="!isLoading">{{ translate('activity.log-no-activity-yet') }}</span>
            </div>
            <cw-loading-icon v-if="isLoading" size="icon-loading"></cw-loading-icon>
        </div>
    `
});
