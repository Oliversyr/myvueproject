<template>
    <el-input v-model.trim="value" size="small" :icon="value ? 'circle-close' : ''" :on-icon-click="iconClose"
              :placeholder="placeholder" @change="valChange" :maxlength="maxlength || 32">
        <template slot="prepend" v-if="prepend">
            {{prepend}}
        </template>

        <template slot="append" v-if="append">
            {{append}}
        </template>
    </el-input>
</template>

<script>
    export default {
        name: 'sl-input',
        props: ['prepend', 'append', 'placeholder', 'inputVal', 'maxlength', 'onlynum', 'nocharacter', 'onlyfloat', 'maxval'],
        data() {
            return {
                value: '',
                oldval: ''

            }
        },
        mounted: function () {
            this.$nextTick(function () {
                if(this.inputVal) {
                    this.value = JSON.parse(JSON.stringify(this.inputVal));
                    this.oldval = JSON.parse(JSON.stringify(this.value));
                }



            })
        },
        methods: {
            iconClose() {
                this.value = '';
                this.oldval = '';
                this.$emit('update:inputVal', this.value);
            },
            valChange(val) {

                if(!!this.onlynum) {
                    this.onlyNum(val);
                } else if(!!this.nocharacter) {
                    this.noCharacter(val);
                } else if(!!this.onlyfloat) {
                    this.onlyFloat(val);
                } else {
                    this.$emit('update:inputVal', this.value);
                }

            },
            onlyNum(val) {
                setTimeout(() => {
//                    console.log(9999999999999999999999999999, val, this.value, !this.value)
                    if(!this.value) {
                        this.value = '';
                          this.$emit('update:inputVal', this.value);
                    } else if((/[^\d]/g).test(val)) {
//                        this.$set(this, 'value', JSON.parse(JSON.stringify(this.oldval)));
                        this.value = JSON.parse(JSON.stringify(this.oldval));
                        this.$emit('update:inputVal', isNaN(this.value) ? '' : this.value);
                    } else {
                        this.oldval = JSON.parse(JSON.stringify(val));
                        this.$emit('update:inputVal', isNaN(this.value) ? '' : this.value);
                    }
//console.log('this.value==', this.value)

                }, 50)

            },
            noCharacter(val) {
                setTimeout(() => {
                    if((/[^a-zA-Z0-9\_\-\u4e00-\u9fa5]/g).test(val)) {
//                        this.$set(this, 'value', JSON.parse(JSON.stringify(this.oldval)));
                        this.value = JSON.parse(JSON.stringify(this.oldval));
                    } else {
                        this.oldval = JSON.parse(JSON.stringify(val));
                    }

                    this.$emit('update:inputVal', this.value);
                }, 50)

            },
            onlyFloat(val) {
                setTimeout(() => {
                    let str = val.toString();
                    let num = Number(str);

                    console.log(str, num);
                    if(val === '') {
                        this.$emit('update:inputVal', this.value);
                    } else if(!isNaN(num)) {
                        if(str.indexOf('.') === -1) {
                            if(this.maxval) {
                                this.value = num > this.maxval ? this.maxval : num;
                            }

                            this.$emit('update:inputVal', parseFloat(this.value));
                        } else if(str.indexOf('.') === (str.length - 1)) {
                            let mynum = parseFloat(JSON.parse(JSON.stringify(num)))
                            this.$emit('update:inputVal', mynum);
                        } else {
//                            console.log(str, this.value);
                            this.value = parseFloat(str.substring(0, str.indexOf('.') + 3));
                            this.$emit('update:inputVal', this.value);
                        }
                    } else {
//                        console.log(str, str.length);
                        this.value = isNaN(parseFloat(str)) ? '' : parseFloat(str.substring(0, str.length - 1));
                    }

                }, 50)

            }
        },
        watch: {
            inputVal(val) {
                console.log('2222222222222222', val)
                if(val || val === 0) {
                    this.value = JSON.parse(JSON.stringify(this.inputVal));
                    this.oldval = JSON.parse(JSON.stringify(this.value));
                } else {
                    this.value = '';
                    this.oldval = '';
                }

            }
        }
    }
</script>