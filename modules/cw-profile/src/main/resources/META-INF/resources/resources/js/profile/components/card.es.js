const CardWrapper = () => ({
    methods: {},
    template: `
        <div class="cec-card bg-light-gray cec-card__body border-0 text-black">
           <slot />
        </div>
    `
});

export { CardWrapper };
