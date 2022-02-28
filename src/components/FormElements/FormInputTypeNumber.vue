<template>
    <div class="form-input-type-number">
        <div
            class="form-input-type-number__fieldset"
            :class="{ 'error-border': validationError }"
        >
            <legend
                class="form-select__legend"
                :class="{ 'error': validationError }"
            >
                {{ label }}
            </legend>

            <button
                class="form-input-type-number__button form-input-type-number__button--left"
                :disabled="value === min_value"
                @click="onClick('reduce')"
            >
            <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19,13H5V11H19V13Z"></path>
            </svg>
            </button>
            <span
                v-if="show_value"
                class="form-input-type-number__value"
            >
                <input
                    :type="with_text ? 'text' : 'number'"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    :value="with_text ? value + text : value"
                    :readonly="with_text"
                    @input="onChange"
                >
            </span>
            <button
                class="form-input-type-number__button form-input-type-number__button--right"
                @click="onClick('increase')"
            >
            <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path>
            </svg>
                <!-- <PlusIcon class="form-input-type-number__icon" /> -->
            </button>
            <div
                v-if="validationError"
                class="form-input-type-number__error"
            >
                {{ validationError }}
            </div>
        </div>
    </div>
</template>

<script>
// import Minus from 'mdi-vue/Minus.vue';
// import Plus from 'mdi-vue/Plus.vue';

export default {
    name: 'FormInputTypeNumber',
    components: {
        // MinusIcon: Minus,
        // PlusIcon: Plus
    },
    props: {
        // eslint-disable-next-line vue/require-prop-types
        value: {},
        label: {
            type: String
        },
        errors: {
            type: String
        },
        name: {
            type: String
        },
        show_value: {
            type: Boolean
        },
        min_value: {
            type: Number
        },
        init_value: {
            type: Number
        },
        with_text: {
            type: Boolean,
            default: false
        },
        text: {
            type: String
        }
    },
    computed: {
        validationError() {
            return this.errors ? this.errors : ''
        }
    },
    created() {
        if (this.init_value === 1 && !this.value) {
            this.$emit('increase');
        }
    },
    methods: {
        onClick(eventName) {
            this.$emit(eventName)
        },
        onChange(event) {
            event.target.value = event.target.value.replace('-', '')
            this.$emit('update:field', +event.target.value)
        }
    }
}
</script>

