// https://github.com/michael-ciniawsky/postcss-load-config
/*
 autoprefixer回去读取 package.json 下 browserslist的配置文件
 > 1% 兼容全球使用率大于1%的游览器
 last 2 versions 兼容每个游览器的最近两个版本
 not ie <= 8 不兼容ie8及以下
 */
module.exports = {
  "plugins": {
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {}
  }
}
