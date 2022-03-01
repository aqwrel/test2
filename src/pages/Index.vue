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
                            :value-select="getCalculatorData"
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
const axios = require('axios')

import dayjs from 'dayjs'
import FormSwitch from '@/components/FormElements/FormSwitch'
import FormSelect from '@/components/FormElements/FormSelect'
import FormInputTypeNumber from '@/components/FormElements/FormInputTypeNumber'
import CustomButton from '@/components/FormElements/CustomButton'
import { CalculatorValidator } from '@/services/calculator/index.js'
import CalculatorTrack from '@/components/CalculatorTrack'
import CalculatorLevelTabs from '@/components/CalculatorLevelTabs'
import CalculatorCustomDate from '@/components/CalculatorCustomDate'

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
    data() {
        return {
            custom_date: false,
            academiclevel: 'annotated_bibliography',
            type: 'essay',
            pages: 1,
            datetime: '',
            // calc contains data returned from Calculator service
            calc: {},
            wordsOnPage: 280,
            isLoaded: false,
            turnaroundsWithRate: [],
            minHours: 6,
            validationState: {},
            calculations: {},
            isCalculating: true,
            orderData: null
        }
    },
    computed: {
        levels() {
          return this.$static.metadata.order.level
        },
        types() {
          return this.$static.metadata.order.type
        },
        turnarounds() {
          return this.$static.metadata.order.turnaround
        },
        isPriceAvailable() {
            // we check the dataset received from calculator
            return this.validationState.description?.message === ''
        },
        getCalculatorData() {
            const {
                type
            } = this.$route.query
            const typeValue = this.types.find((item) => item.value === type)
            return typeValue?.value || this.types[0].value
        },
        keysAffectPrice() {
            const {
                type,
                academiclevel,
                pages,
                datetime
            } = this
            return {
                datetime, type, academiclevel, pages
            }
        }
    },
    watch: {
        custom_date(newVal) {
            if (newVal) {
                this.minHours = this.calc.description?.minHours || 6
            }
        },
        academiclevel() {
            this.getTurnaroundsWithRate()
        },
        type() {
            this.getTurnaroundsWithRate()
        },
        keysAffectPrice: {
            handler() {
                this.getOrderTotal()
                this.validateOrderForm()
            },
            deep: true
        }
    },
    async created() {
      const {data} = await axios('https://shop.customessaymeister.com/api/data/order');
      this.orderData = data
    },
    methods: {
        goToOrderForm() {
            this.recordEventGotoOrder()
            window.top.location.href = `${process.env.VUE_APP_API_URL}/order/new?type=${this.type}&academiclevel=${this.academiclevel}&pages=${this.pages}&date=${this.datetime}`
        },
        getTurnaroundsWithRate() {
            const rateType = this.types.find((el) => el.value === this.type)
            const rateLevel = this.levels.find((el) => el.value === this.academiclevel)
            this.turnaroundsWithRate = this.turnarounds.map((item) => {
                const tmp = { ...item }
                tmp.rate = (Number(tmp.rate) + Number(rateType.rate) + Number(rateLevel.rate)).toFixed(2)
                return tmp
            })
        },
        recordEventGotoOrder() {
            this.$gtm?.trackEvent({
                event: 'ga_event',
                eventCategory: 'Order',
                eventAction: 'Calculator',
                eventLabel: 'Goto order form'
            });
        },
        getOrderTotal() {
            this.isCalculating = true
            // Debounce. Для чтого чтобы не летело много запросов
            if (typeof window.LIT !== 'undefined') {
                clearTimeout(window.LIT);
            }
            // required fields
            if (this.datetime && this.type && this.academiclevel && this.pages) {
                window.LIT = setTimeout(async () => {
                    await axios.post('https://shop.customessaymeister.com/api/cp/preorder/calculate-order', { ...this.keysAffectPrice })
                      .then((resp) => {
                          this.calculations = resp.data
                          this.isCalculating = false
                      })
                        
                }, 500);
            }
        },
        validateOrderForm() {
            const instance = new CalculatorValidator(
                {...this.$static.metadata.order},
                {
                  academiclevel: this.academiclevel,
                  type: this.type,
                  pages: this.pages,
                  datetime: this.datetime
                }
            )
            this.validationState = instance.getData()
        },
        short_text(value) {
            return dayjs(value).format('ddd, MMM D, YY h:mm A')
        },
    }
}
</script>

<style lang="scss">
    @import '~/assets/styles/site_specific_styles/customessaymeister.com/index.scss';
</style>