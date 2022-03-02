const axios = require('axios')
import { CalculatorValidator } from '@/services/calculator/index.js'
import dayjs from 'dayjs'

export const calculatorMixin = {
    data() {
        return {
            custom_date: false,
            academiclevel: 'highschool',
            type: 'annotated_bibliography',
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
      this.getTurnaroundsWithRate()
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