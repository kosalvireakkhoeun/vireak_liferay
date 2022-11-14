export const ViewOrganization = () => ({
    props: {
        organizations: { type: Array, default: () => ([]) },
        workStatuses: { type: Array, default: () => ([]) },
        cssWrapper: { type: String, default: '' },
    },
    computed: {
        filteredOrganizations: function() {
            return this.organizations.filter(org => {
                return (
                    this.shouldDisplayCenter(org) ||
                    this.getWorkStatus(org) ||
                    this.shouldDisplayMinistry(org)
                );
            });
        }
    },
    methods: {
        getWorkStatus: function(organization) {
            return this.workStatuses.find(workStatus => (
                organization.workStatus.show &&
                (workStatus.key == organization.workStatus.key)
            ));
        },
        shouldDisplayCenter: function(organization) {
            return organization.center.show && organization.center.text;
        },
        shouldDisplayWorkStatus: function(organization, workStatus) {
            return organization.workStatus.show && workStatus.key == organization.workStatus.key;
        },
        shouldDisplayMinistry: function(organization) {
            return organization.ministryWork.show && organization.ministryWork.text;
        }
    },
    template: `
        <div v-if="filteredOrganizations.length" class="cec-p-0 cec-py-sm-4 cec-px-sm-6 cec-card border-top-style-dash border-left-0 border-right-0 border-bottom-0" :class="cssWrapper">
            <p class="font-weight-light font-size-22 cec-mt-4 cec-mt-sm-0">
                {{ translate('organizations') }}
            </p>
            <div class="w-100">
                <div v-for="(organization, index) in filteredOrganizations" class="d-flex">
                    <div>
                        <cw-svg-icon css-class="mt-2" :icon-url="svgIconUrl('org-info')"></cw-svg-icon>
                    </div>
                    <div class="ml-3">
                        <div class="pb-3">
                            <p class="font-weight-bold text-black my-2">{{ organization.organizationName }}</p>
                            <p class="text-black my-2" v-if="shouldDisplayCenter(organization)">
                                {{ organization.center.text }}&nbsp;<i>( {{ translate('center') }} )</i></p>
                                <template v-for="(workStatus) in workStatuses">
                                    <p class="text-black my-2" v-if="shouldDisplayWorkStatus(organization, workStatus)">
                                        {{ workStatus.text }}&nbsp;<i>( {{ translate('work-status') }} )</i>
                                    </p>
                                </template>
                            <p class="text-black my-2" v-if="shouldDisplayMinistry(organization)">
                                {{ organization.ministryWork.text }}&nbsp;<i>( {{ translate('ministry-work-team') }} )</i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
});
