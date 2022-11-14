import ImageItem from 'cw-vuejs-global-components/components/image_item.es';

export const EmptyProfile = {
    cwComponents: {
        ImageItem
    },
    template: `
        <div>
            <p class="mb-5 cec-mt-4 cec-mt-sm-0"">{{ translate('profile.x-empty-profile-info', $store.getters.getSingleName) }}</p>
            <image-item :source="imageUrl('empty-profile.png')" img-class="w-90"></image-item>
        </div>
    `
};
