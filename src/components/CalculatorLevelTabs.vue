<template>
    <div class="tabs_wrapper">
        <div
            class="tabs_arrow tabs_prev"
            :class="!showPrev && 'tabs_arrow--disabled'"
            @click="prev()"
        >
            <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
            </svg>
        </div>
        <ul
            ref="calculator_tabs"
            class="calculator_tabs"
            :style="{transform: 'translateX('+ translateTabs + 'px)'}"
        >
            <div
                class="calculator_tabs-current"
                :style="{left: tabWidth * activeLevel + 'px', minWidth: tabWidth + 'px' }"
            />
            <template v-for="(level, index) in levels">
                <li
                    :key="index"
                    class="calculator_tabs-item"
                    :class="index === activeLevel && 'calculator_tabs-item--active'"
                    :style="{minWidth: tabWidth + 'px'}"
                    @click="changeLevelTab(level.value, index)"
                >
                    {{ level.text }}
                </li>
            </template>
        </ul>
        <div
            class="tabs_arrow tabs_next"
            :class="!showNext && 'tabs_arrow--disabled'"
            @click="next()"
        >
            <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        levels: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            activeLevel: 0,
            tabWidth: 250,
            translateTabs: 0,
            tabPosition: 0,
            tabToShow: 4
        }
    },
    computed: {
        showNext() {
            return this.levels.length - this.tabToShow !== this.tabPosition
        },
        showPrev() {
            return this.tabPosition > 0
        }
    },
    created() {
        this.$emit('input', this.levels[this.activeLevel].value)
    },
    mounted() {
        this.setDefaultState()
        window.addEventListener('resize', this.setDefaultState)
    },
    methods: {
        setDefaultState() {
            const windowWidth = window.innerWidth
            if (windowWidth > 1280) {
                this.tabToShow = 4
            } else if (windowWidth < 1280 && windowWidth >= 996) {
                this.tabToShow = 3
            } else if (windowWidth < 996 && windowWidth > 600) {
                this.tabToShow = 2
            } else if (windowWidth <= 600) {
                this.tabToShow = 1
            }
            this.tabWidth = this.$refs.calculator_tabs.clientWidth / this.tabToShow
        },
        changeLevelTab(level, index) {
            this.activeLevel = index
            this.$emit('input', level)
        },
        next() {
            if (this.showNext) {
                this.tabPosition += 1
                this.translateTabs = -this.tabPosition * this.tabWidth
                if (window.innerWidth <= 600) {
                    this.activeLevel += 1
                    this.changeLevelTab(this.levels[this.activeLevel].value, this.activeLevel)
                }
            }
        },
        prev() {
            if (this.showPrev) {
                this.tabPosition -= 1
                this.translateTabs += this.tabWidth
                if (window.innerWidth <= 600) {
                    this.activeLevel -= 1
                    this.changeLevelTab(this.levels[this.activeLevel].value, this.activeLevel)
                }
            }
        }
    }
}
</script>
