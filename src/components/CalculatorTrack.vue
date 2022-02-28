<template>
    <div class="calculator_turnarounds">
        <div
            class="calculator_track"
            :style="{transform: 'translateX('+ translateSlider + 'px)'}"
        >
            <template v-for="(turnaround, index) in turnarounds">
                <div
                    :key="index"
                    ref="card"
                    class="turnaround"
                    :class="{
                        'turnaround--active' : activeTurnaround === index,
                        'turnaround--near' : activeTurnaround - 1 === index || activeTurnaround + 1 === index,
                        'turnaround--away' : activeTurnaround - 2 === index || activeTurnaround + 2 === index
                    }"
                    @click="changeTurnaround(index)"
                >
                    <header class="turnaround_header">
                        <span class="turnaround_date">
                            {{ dateToNow(turnaround.short_name) }}
                        </span>
                        <span class="turnaround_deadline">
                            <span class="turnaround_deadline--bold">
                                {{ dateToNow2(turnaround.short_name)  }}
                            </span>
                        </span>
                    </header>
                    <div class="turnaround_footer">
                        <div class="turnaround_price">
                            <span>$</span>
                            <div class="turnaround_price-rate">
                                {{ turnaround.rate.toString().split('.')[0] }}.
                                <span class="turnaround_price-rate--small">
                                    {{ turnaround.rate.toString().split('.')[1] }}
                                </span>
                            </div>
                        </div>
                        <span class="turnaround_bottom">
                            page
                        </span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import dayjs  from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const marginCard = 15;

export default {
    filters: {
        getVal(value) {
            const array = value.split(' ');
            return Number.isFinite(+array[0]) ? array[0] : value
        },
        getText(value) {
            const array = value.split(' ');
            return Number.isFinite(+array[0]) ? array[1] : ''
        },
        getRateTotal(value) {
            const array = value.toString().split('.');
            return array[0]
        },
        getRateHundredths(value) {
            const array = value.toString().split('.');
            return array[1]
        }
    },
    props: {
        turnarounds: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            activeTurnaround: 2,
            translateSlider: 0,
            cardWidth: 0,
            positionAdjustment: 220
        }
    },
    mounted() {
        this.$emit('input', dayjs().add(this.turnarounds[this.activeTurnaround].short_name + 0.1, 'hours').toISOString())
        this.setDefaultState()
        window.addEventListener('resize', this.setDefaultState)
    },
    methods: {
        changeTurnaround(id) {
            this.activeTurnaround = id
            this.translateSlider = this.positionAdjustment - this.cardWidth * id;
            this.$emit('input', dayjs().add(this.turnarounds[id].short_name + 0.1, 'hours').toISOString())
        },
        setDefaultState() {
            this.cardWidth = this.$refs.card[0].offsetWidth + marginCard
            this.activeTurnaround = this.turnarounds.length - 1
            if (window.innerWidth >= 1280) {
                this.positionAdjustment = 195
            } else if (window.innerWidth < 1280 && window.innerWidth >= 996) {
                this.positionAdjustment = 140
            } else if (window.innerWidth < 996) {
                this.positionAdjustment = (document.querySelector('.col_center').clientWidth / 2) - (this.cardWidth / 2) + 7
            }
            this.changeTurnaround(this.activeTurnaround)
        },
        dateToNow(val) {
            return dayjs().add(val, 'hours').format('D MMM')
        },
        dateToNow2(val) {
            return dayjs().add(val, 'hours').fromNow(true)
        }
    }
}
</script>
