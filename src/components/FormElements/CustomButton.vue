<template>
    <button
        class="btn-base"
        :disabled="disabled"
        :class="[disabledBtn, animatedBtn, defaultBtn, smallBtn, largeBtn, hoverBtn, classes, animateBtn]"
        :style="{width, height}"
        :type="type"
        @click="buttonClick"
    >
        <template v-if="loading">
            <button-loader
                :message="loadingMessage"
            />
            <span :class="{'is_loading': loading}">
                {{ loadingMessage }}
            </span>
        </template>
        <template v-else>
            <slot />
        </template>
    </button>
</template>

<script>
import ButtonLoader from './ButtonLoader.vue';

export default {
    name: 'CustomButton',
    components: {
        ButtonLoader
    },
    props: {
        loading: {
            type: Boolean
        },
        loadingMessage: {
            type: String,
            required: false
        },
        height: {
            type: String
        },
        width: {
            type: String
        },
        type: {
            type: String
        },
        classes: {
            type: String
        },
        disabled: Boolean,
        animated: Boolean,
        default: Boolean,
        bordered: Boolean,
        small: Boolean,
        large: Boolean,
        hover: Boolean,
        loaderAnimate: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        disabledBtn() {
            return this.disabled ? 'btn-disabled' : ''
        },
        animatedBtn() {
            return this.animated ? 'btn-main cart-btn-empty cart-btn-animated' : ''
        },
        defaultBtn() {
            return this.default ? 'btn-main' : ''
        },
        smallBtn() {
            return this.small ? 'small-btn' : ''
        },
        largeBtn() {
            return this.large ? '' : ''
        },
        hoverBtn() {
            return this.hover ? 'hovered' : ''
        },
        animateBtn() {
            return this.loaderAnimate && this.loading ? 'btn_base--movelinght' : ''
        }
    },
    methods: {
        buttonClick() {
            this.$emit('on-btn-click')
        }
    }
}
</script>

