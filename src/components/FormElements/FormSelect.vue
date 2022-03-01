<template>
    <div
        class="form-select"
        :class="{ 'error-border': validationError, 'success-border' : setValue, 'grey-border' : openListItem }"
    >
        <fieldset :class="openListItem ? 'form-select__fieldset active' : 'form-select__fieldset'">
            <legend
                class="form-select__legend"
                :class="{ 'error': validationError }"
            >
                {{ label }}
            </legend>
            <div class="form-input__prepend-icon">
                <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"></path>
                </svg>
            </div>
            
            <input
                :class="inputClasses"
                :value="setValue"
                type="text"
                :name="name"
                autocomplete="off"
                :placeholder="placeholder || 'Select ' + name"
                @click.self="openListItem = !openListItem"
                @focus="$event.target.select()"
                @input="onInputChanged($event)"
            >
            <ul
                v-if="openListItem"
                class="form-select__list"
                :style="`${maxHeight && 'max-height:' + maxHeight + 'px' }`"
            >
                <li
                    v-for="(item, index) in filteredList"
                    :key="index"
                    class="form-select__list-item"
                    @click="selectItem(item.value)"
                >
                    {{ item.text }}
                </li>
            </ul>
            <div
                v-if="validationError"
                class="form-select__error"
            >
                {{ validationError }}
            </div>
        </fieldset>
    </div>
</template>

<script>
// import ClickOutside from 'vue-click-outside'

export default {
    name: 'FormSelect',
    // directives: {
    //     ClickOutside
    // },
    props: {
        // eslint-disable-next-line vue/require-prop-types
        value: {},
        valueSelect: [String, Number],
        prependIcon: { type: String },
        items: { type: Array },
        label: { type: String },
        errors: { type: String },
        escape: { type: Boolean },
        name: {
            required: true,
            type: String
        },
        maxHeight: {
            type: String,
            required: false
        },
        inputAdditionalClass: {
            type: String,
            required: false
        },
        placeholder: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            openListItem: false,
            filteredItems: [],
            search: ''
        };
    },
    computed: {
        setValue() {
            const isExist = this.items.some((el) => el.value === this.search);
            if (isExist) {
                console.log(this.valueSelect, this.search);
                this.$emit('input', this.search);
                return this.items.find((element) => element.value === this.search).text;
            }
            if (this.escape) {
                return ''
            }
            return this.search;
        },
        filteredList() {
            if (this.search === this.value) {
                return this.items
            }
            return this.items.filter((item) => item.text.toLowerCase().includes(this.search.toLowerCase()));
        },
        validationError() {
            return this.errors ? this.errors : '';
        },
        inputClasses() {
            return {
                'form-select__input': true,
                hasIcon: !!this.prependIcon
            }
        }
    },
    watch: {
        value(value) {
            if (!value) {
                this.search = ''
            } else {
                this.search = value
            }
        }
    },
    created() {
        this.setInitValue();
    },
    methods: {
        selectItem(value) {
            this.$emit('input', value);
            this.search = value
            this.openListItem = false;
        },
        onInputChanged(event) {
            this.openListItem = true;
            this.search = event.target.value;
            if (this.search === '') {
                this.$emit('input', '');
            }
        },
        setInitValue() {
            console.log(this.valueSelect, this.search);
            this.search = this.valueSelect ? this.valueSelect : '';
        },
        // clickOutside() {
        //     this.openListItem = false
        // }
    }
};
</script>
