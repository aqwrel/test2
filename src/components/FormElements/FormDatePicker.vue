<template>
    <div
        class="form-datepicker"
        :class="{ 'error-border': validationError, 'success-border' : value}"
    >
        <div class="form-datepicker__fieldset">
            <legend
                class="form-datepicker__legend"
                :class="{ 'error': validationError }"
            >
                {{ label }}
            </legend>
            <div class="form-datepicker__icon" >
                <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"></path>
                </svg>
            </div>
            <!-- <CalendarRange /> -->
            <datetime
                type="datetime"
                format="DDDD, h:mm a"
                :flow="['date', 'time']"
                use12-hour
                :min-datetime="minDate"
                :minute-step="15"
                monday-first
                :value="field"
                placeholder="Select Date & Time"
                :hide-backdrop="hideBackdrop"
                @input="onDateSelect($event)"
            />
            <div
                v-if="validationError"
                class="form-input__error"
            >
                {{ validationError }}
            </div>
        </div>
    </div>
</template>

<script>
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
// import CalendarRange from 'mdi-vue/CalendarRange.vue'
import dayjs from 'dayjs'

export default {
    name: 'FormDatePicker',
    components: {
        datetime: Datetime,
        // CalendarRange
    },
    props: {
        value: {
            type: String
        },
        label: {
            type: String,
            required: true
        },
        errors: {
            type: String
        },
        field: {
            type: String
        },
        hideBackdrop: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        datetime: null
    }),
    computed: {
        minDate() {
            return dayjs().add(3, 'hours').toISOString();
        },
        validationError() {
            return this.errors ? this.errors : '';
        }
    },
    methods: {
        onDateSelect(event) {
            this.$emit('update:field', event)
        }
    }
};
</script>

<style lang="scss">

</style>
