import ImageItem from 'cw-vuejs-global-components/components/image_item.es';

const RELATIONSHIP_TYPE_SPOUSE = 0;
const RELATIONSHIP_TYPE_CHILD = 1;

const FamilyDetail = () => ({
    props: {
        isOwner: { type: Boolean },
        organizations: { type: Array, required: true },
        cssWrapper: { type: String, default: '' }
    },
    cwComponents: {
        ImageItem
    },
    data: function() {
        return {
            relationshipTypeSpouse: RELATIONSHIP_TYPE_SPOUSE,
        }
    },
    methods: {
        showFamilyMember: function(member) {
            return  (RELATIONSHIP_TYPE_SPOUSE == member.relationshipStatusKey && !member.pending)
                    || RELATIONSHIP_TYPE_CHILD == member.relationshipStatusKey;
        },
        showFamilyDetail: function(organization) {
            const notPendingMember = organization.familyMembers.length == 1
                && this.showFamilyMember(organization.familyMembers[0]);
            return organization.familyMembers
                && (organization.familyMembers.length > 1 || notPendingMember);
        }
    },
    template: `
        <div class="cec-p-0 cec-py-sm-4 cec-px-sm-6 cec-card border-top-style-dash border-left-0 border-right-0 border-bottom-0" :class="cssWrapper">
            <div class="d-flex align-items-center cec-mb-5 cec-mt-4 cec-mt-sm-0">
                <div class="font-weight-light font-size-22">{{ translate('family') }}</div>
                <cw-button-link
                    v-if="isOwner"
                    css-wrapper="ml-auto"
                    css-icon="cw-icon-md"
                    @action="$emit('edit-family')"
                    icon-name="pencil"
                ></cw-button-link>
            </div>
            <div v-if="organizations.length">
                <div v-for="(organization, index) in organizations" :key="organization.id">
                    <template v-if="showFamilyDetail(organization)">
                        <p class="font-weight-bold text-black my-2">{{ organization.name }}</p>
                        <div v-for="(child, index) in organization.familyMembers" :key="child.id">
                            <div v-if="showFamilyMember(child)" class="d-flex cec-py-3 align-items-center">
                                <image-item
                                    figure-class="mb-0 mr-2"
                                    img-class="cw-icon-xxl cw-icon-profile img-circle"
                                    :source="child.profileImageUrl"
                                    alt="profile-image"
                                ></image-item>
                                <div>
                                    <div>
                                        <span class="text-black font-weight-bold">{{ child.name }}</span>
                                        <span v-if="relationshipTypeSpouse != child.relationshipStatusKey" class="ml-1 text-lowercase text-gray"><i> ({{ child.ageText }})</i></span>
                                    </div>
                                    <div class="text-grey font-size-12">{{ child.relationshipStatus }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div v-else class="d-flex justify-content-center">
                <div class="cec-py-4">{{ translate('add-your-family-to-your-profile') }}</div>
            </div>
        </div>
    `
});

export default FamilyDetail;
