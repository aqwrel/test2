<template>
    <div
        class="calculator"
    >
        <div class="calculator_container">
            <header class="calculator_header">
                <h2 class="calculator_header-title">
                    Our
                    <b>
                        prices
                    </b>
                </h2>
                <div class="calculator_header-switch">
                    <span>
                        Custom due date
                    </span>
                    <form-switch
                        :id="'custom_date'"
                        v-model="custom_date"
                    />
                </div>
            </header>

            <calculator-level-tabs
                v-model="academiclevel"
                :levels="levels"
            />

            <div class="calculator_form">
                <div class="col_side">
                    <div class="calculator_field calculator_field--select">
                        <form-select
                            v-model="type"
                            label="Select project type"
                            :items="types"
                            :value-select="type"
                            name="type"
                        />
                    </div>
                    <div class="calculator_field">
                        <form-input-type-number
                            v-model="pages"
                            label="Pages"
                            :value="pages"
                            :show_value="true"
                            :min_value="1"
                            :with_text="true"
                            :text="` pages ≈ ${wordsOnPage * pages} words`"
                            @reduce="pages--"
                            @increase="pages++"
                        />
                    </div>
                </div>
                <div class="col_center">
                    <calculator-custom-date
                        v-if="custom_date"
                        v-model="datetime"
                        :min-hours="minHours"
                    />
                    <calculator-track
                        v-if="!custom_date"
                        v-model="datetime"
                        :turnarounds="turnaroundsWithRate.length ? turnaroundsWithRate : turnarounds"
                    />
                </div>
                <div class="col_side col_side--right">
                    <div
                        v-if="isPriceAvailable"
                        class="calculator_price"
                    >
                        <span class="calculator_price--date">{{ short_text(datetime) }}</span>
                        <span class="calculator_price--accent">
                          {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculations.total_pages) }}
                        </span>
                    </div>
                    <div
                        v-else
                        class="calculator_message"
                    >
                        {{ validationState.description && validationState.description.message }}
                    </div>
                    <custom-button
                        :class="{ 'btn-disabled' : !isPriceAvailable, 'btn-base btn-main': isPriceAvailable && !isCalculating}"
                        :disabled="!isPriceAvailable || isCalculating"
                        :loading="isCalculating"
                        :loading-message="'Calculating...'"
                        :loader-animate="true"
                        @on-btn-click="goToOrderForm()"
                    >
                        order now
                    </custom-button>
                </div>
            </div>
        </div>
    </div>
</template>

<static-query>
query {
  metadata {
    order {
      level {
        rate
        text
        value
      }
      type {
        rate
        text
        value
        hours
      }
      turnaround {
        rate
        short_name
        long_name
        id
      }
    }
  }
}
</static-query>

<script>
import FormSwitch from '@/components/FormElements/FormSwitch'
import FormSelect from '@/components/FormElements/FormSelect'
import FormInputTypeNumber from '@/components/FormElements/FormInputTypeNumber'
import CustomButton from '@/components/FormElements/CustomButton'
import CalculatorTrack from '@/components/CalculatorTrack'
import CalculatorLevelTabs from '@/components/CalculatorLevelTabs'
import CalculatorCustomDate from '@/components/CalculatorCustomDate'

import {calculatorMixin} from '@/mixin/calculator'

export default {
    name: 'LargeCalculator',
    components: {
        FormSwitch,
        FormSelect,
        FormInputTypeNumber,
        CustomButton,
        CalculatorTrack,
        CalculatorLevelTabs,
        CalculatorCustomDate
    },
    mixins: [calculatorMixin]
}
</script>

<style lang="scss">
    @import '~/assets/styles/site_specific_styles/dreamessays.com/index.scss';
</style>