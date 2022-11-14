import { CwDatePicker } from 'cw-vuejs-global-components/components/date_time_picker.es';
import CwDropdown from 'cw-vuejs-global-components/components/dropdown.es';

const GENDERS = [
    {key: 1, value: 'male'},
    {key: 2, value: 'female'},
];

const MemberInfoInputs = () => ({
    props: {
        child: { type: Object, required: true },
        validator: { type: Object, required: true },
        isSpouse: { type: Boolean, default: false },
    },
    cwComponents: {
        CwDatePicker,
        CwDropdown: CwDropdown(),
    },
    data: function() {
        return {
            genders: GENDERS,
            nowDateString: new Date().toISOString().substr(0, 10)
        }
    },
    computed: {
        deletable: function() {
            const { child } = this;
            return (!this.isSpouse && child.deletable && this.isValid) ||
                (this.isSpouse && (child.pending || child.manualInput) && this.isValid);
        },
        isValid: function() {
            const { child } = this;
            return (
                child.givenName &&
                child.familyName &&
                child.genderKey &&
                child.dateOfBirthString
            );
        },
    },
    template: `
        <div class="row">
            <div class="col-md-5 col-12">
                <cw-input
                    :placeholder="translate('enter-given-name')"
                    :label="translate('given-name')"
                    v-model="child.givenName"
                >
                    <template v-if="validator.givenName.$error" #info>
                        <div class="text-danger font-size-12 cec-pt-2">
                            {{ translate('this-field-is-required') }}
                        </div>
                    </template>
                </cw-input>
            </div>
            <div class="col-md-5 col-12">
                <cw-input
                    :placeholder="translate('enter-family-name')"
                    :label="translate('family-name')"
                    v-model="child.familyName"
                >
                    <template v-if="validator.familyName.$error" #info>
                        <div class="text-danger font-size-12 cec-pt-2">
                            {{ translate('this-field-is-required') }}
                        </div>
                    </template>
                </cw-input>
            </div>
            <div v-if="deletable" class="col-2 cec-pt-6 mt-2 d-none d-md-flex">
                <span @click="$emit('remove')" class="cursor-pointer">
                    <cw-svg-icon :icon-url="svgIconUrl('remove-bucket')" css-class="cw-icon-sm"/>
                </span>
            </div>
            <div class="col-md-5 col-12">
                <div class="form-group">
                    <label>{{ translate('gender') }}</label>
                    <cw-dropdown
                        :value="child.genderKey"
                        :items="genders"
                        :change-icon-on-mobile="false"
                        placeholder="select-gender"
                        :required-translate="true"
                        @change="child.genderKey = $event"
                    ></cw-dropdown>
                    <div v-if="validator.genderKey.$error" class="text-danger font-size-12 cec-pt-2">
                        {{ translate('this-field-is-required') }}
                    </div>
                </div>
            </div>
            <div class="col-md-5 col-12">
                <div class="form-group">
                    <label>{{ translate('date-of-birth') }}</label>
                    <cw-date-picker
                        :key="child.dateOfBirth"
                        :placeholder="translate('select-date')"
                        :date="child.dateOfBirthString"
                        :end-date="nowDateString"
                        format-date="DD MMM, YYYY"
                        @change="child.dateOfBirthString = $event"
                    ></cw-date-picker>
                    <div v-if="validator.dateOfBirthString.$error" class="text-danger font-size-12 cec-pt-2">
                        {{ translate('this-field-is-required') }}
                    </div>
                </div>
            </div>
            <div v-if="deletable" class="d-md-none d-flex col-12 cec-p-3">
                <button
                    class="btn btn-outline-primary w-100"
                    @click="$emit('remove')"
                >{{ translate('remove-this-child') }}</button>
            </div>
        </div>
    `
});

export default MemberInfoInputs;
