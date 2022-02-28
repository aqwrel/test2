<template>
    <div class="custome_date">
        <div class="date_picker">
            <form-date-picker
                v-model="datetime"
                :field.sync="datetime"
                label="Due date"
                :min_hours="3"
                :hide-backdrop="true"
            />
        </div>
        <div class="date_picker_reducer">
            <form-input-type-number
                v-model="hoursToDeadline"
                :value="hoursToDeadline"
                :show_value="true"
                :min_value="3"
                :with_text="true"
                :text="' hours to deadline'"
                @reduce="increaseHoursToDeadline()"
                @increase="reduceHoursToDeadline()"
            />
        </div>
    </div>
</template>

<script>
// dayjs
import dayjs from 'dayjs'

import FormDatePicker from '@/components/FormElements/FormDatePicker'
import FormInputTypeNumber from '@/components/FormElements/FormInputTypeNumber'

export default {
    components: {
        FormDatePicker,
        FormInputTypeNumber
    },
    props: {
        minHours: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            datetime: null,
            hoursToDeadline: 6
        }
    },
    computed: {
        getCurrentDate() {
            return dayjs()
        }
    },
    watch: {
        datetime() {
            this.$emit('input', this.datetime)
            this.hoursToDeadline = dayjs(this.datetime).diff(this.getCurrentDate, 'hours');
        }
    },
    created() {
        this.datetime = dayjs().add(this.minHours + 0.1, 'hours').toISOString()
        this.$emit('input', this.datetime)
    },
    methods: {
        reduceHoursToDeadline() {
            this.hoursToDeadline += 1
            this.datetime = dayjs(this.datetime).add(1, 'hours').toISOString()
        },
        increaseHoursToDeadline() {
            this.hoursToDeadline -= 1
            this.datetime = dayjs(this.datetime).subtract(1, 'hours').toISOString()
        }
    }
}
</script>

