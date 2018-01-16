# sl-contextmenu

## Installation
```shell
无
```

## Usage

```javascript
import SLContextmenu from '@/components/sl-contextmenu/index'

Vue.component('sl-contextmenu', SLContextmenu)

<template>
  <div>
    <div @contextmenu.prevent="showMenu(index)"
                 style="width: 100px;height: 100px;background: red;margin-top: 20px;"
                 v-for="(n, index) in 4" :key="n" >
                <sl-contextmenu :contextMenuData="contextMenuData"
                                :transferIndex="transferIndex"
                                @savedata="savedata(index)"
                                @newdata="newdata"></sl-contextmenu>
            </div>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {
        transferIndex: null, // Show the menu that was clicked
        contextMenuData: {
          menuName: 'demo',
          axios: {
            x: null,
            y: null
          },
          menulists: [
            {
              fnHandler: 'savedata',
              icoName: 'fanhui',
              btnName: 'Save'
            },
            {
              fnHandler: 'newdata',
              icoName: 'fanhui',
              btnName: 'New'
            }
          ]
        }
      }
    },
    methods: {
      showMenu (index) {
        this.transferIndex = index // tranfer index to child component
        event.preventDefault()
        var x = event.clientX
        var y = event.clientY
        this.contextMenuData.axios = {
          x, y
        }
      },
      savedata (e) {
        console.log('click:' + e)
      },
      newdata () {
        console.log(2222)
      }
    }
  }
</script>
```

## Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |


## License
MIT
