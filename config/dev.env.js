var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // BASE_API: '"https://easy-mock.com/mock/5975b868a1d30433d83bdaf3/three-bears"',
    BASE_API: '"http://tvpn.myimpos.com:19090/vem/api"'
})
