<template>

    <span class="slic-form-icon sl-info-icon " @click.stop="toggleInformationIconClass">
        <icon-svg :icon-class="informationIconClass" ></icon-svg>
    </span>

</template>

<script>
    export default {
        name: 'sl-icon-info',
        props: ['isInformationOpened'],
        data() {
            return {
                isInfoOpened: true
            }
        },
        computed: {
            informationIconClass: function () {
                return  this.isInfoOpened ? 'information_up' : 'information_down';
            }
        },
        mounted: function () {
            this.$nextTick(function () {

            })
        },
        methods: {
            toggleInformationIconClass() {
                this.isInfoOpened = !this.isInfoOpened;
//                console.log('this.isInformationOpened==', this.isInfoOpened)
                this.$emit('update:isInformationOpened', this.isInfoOpened);
            }
        },
        watch: {
            isInformationOpened(val) {
                this.isInfoOpened = this.isInformationOpened;
            }
        }
    }
</script>

<style>
    .sl-info-icon {
        cursor: pointer;
        width: calc(100% - 100px);
        display: inline-block;
    }
</style>