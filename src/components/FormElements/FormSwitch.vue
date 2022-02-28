<template>
    <div class="form-switch">
        <input
            :id="id"
            class="form-switch__input"
            type="checkbox"
            :value="value"
            :checked="value"
            @change="$emit('input', $event.target.checked)"
        >
        <label
            class="form-switch__label"
            :for="id"
        />
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean
        },
        id: {
            type: String
        }
    }
};
</script>

<style lang="scss" >

</style>
