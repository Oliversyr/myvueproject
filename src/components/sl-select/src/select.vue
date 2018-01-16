<template>
  <div class="sl-select__wrapper">
    <div class="sl-select__prepend">{{prepend}}</div>
    <div class="sl-select__input">
      <slot name="ELSelect"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SLSelect',
  props: {
    prepend: {
      type: String,
      default: "查询字段"
    }
  }
}    
</script>

<style rel="stylesheet/scss" lang="scss">
.sl-select__wrapper {
  display: inline-table;
  .sl-select__prepend {
    display: table-cell;
    min-width: 90px;
    border: 1px solid #ccc;
    border-right: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    vertical-align: middle;
    text-align: center;
    background-color: #f3f3f3;
    color: #555;
    line-height: 1;
  }
  .sl-select__input .el-input__inner {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
