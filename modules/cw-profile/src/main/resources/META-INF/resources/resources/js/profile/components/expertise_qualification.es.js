import { LabelItem } from './label_item.es';

export const ExpertiseQualification = () => ({
    cwComponents: {
        LabelItem: LabelItem(),
    },
    template: `
        <div class="expertise-wrapper">
            <div class="row">
                <div class="col-6">
                    <label-item
                        :items="$store.state.expertise.areaOfFocus.items"
                        translate-key="area-of-focus"></label-item>
                </div>
                <div class="col-6">
                    <label-item
                        :items="$store.state.expertise.skillAndExpertise.items"
                        translate-key="skills-and-expertise"></label-item>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label-item 
                        :items="$store.state.expertise.language.items" 
                        translate-key="languages"></label-item>
                </div>
                <div class="col-6">
                    <label-item
                        :items="$store.state.expertise.interestAndHobby.items" 
                        translate-key="interests-and-hobbies"></label-item>
                </div>
            </div>
        </div>
    `
});
