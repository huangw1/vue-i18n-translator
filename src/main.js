import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'

import App from './App.vue'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/theme/nord.css'

Vue.use(VueCodemirror, {
    options: {
        theme    : 'nord', tabSize: 2, lineWrapping: true,
        extraKeys: {
            "Tab"      : (cm) => cm.execCommand('indentMore'),
            "Shift-Tab": (cm) => cm.execCommand('indentLess'),
        }
    },
});

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
