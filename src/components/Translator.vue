<template>
    <div class="translator">
        <ul class="files">
            <li>
                <input v-model="fileFilter" class="filter" placeholder="请输入语言"/>
            </li>
            <li :key="file" v-for="file in filterFiles">
                <a href='#' @click="editingFile = file">
                    <b v-if="file === editingFile">
                        {{ file }}
                    </b>
                    <span v-else>
                        {{ file }}
                    </span>
                </a>
            </li>
        </ul>

        <div class="editor-actions">
            <button @click="output = 'json'" :class="{ selected: output === 'json' }">
                json
            </button>
            <button @click="output = 'yaml'" :class="{ selected: output === 'yaml' }">
                yaml
            </button>
        </div>
        <section class="editor">
            <codemirror v-model="editingSource" @blur="compileEditing"
                        :options="{ mode: output === 'yaml' ? 'text/yaml' : 'application/json' }"></codemirror>
        </section>

        <section class="locals">
            <button @click="addLocale">+</button>
            <button @click="selectedLocale = locale" :key="locale" v-for="locale in parsedLocales"
                    :class="{ selected: locale === selectedLocale }" :disabled="locale === selectedLocale">
                {{ locale }}
            </button>
        </section>

        <section class="actions-table">
            <button @click='download'>下载文件</button>
        </section>
        <section class="table">
            <table>
                <tr :key="key" v-for="(value, key) in selectedLocaleEditing">
                    <td>
                        <label :class="{ error: !value.trim() }">
                            {{ key }}
                        </label>
                    </td>
                    <td>
                        <textarea v-model="editingParsed[`${selectedLocale}.${key}`]"></textarea>
                        <button class="remove" @click="removeKey(key)">&times;</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input v-model="newKey.key" placeholder="请输入字段"/>
                        <small>允许嵌套字段，通过英文符号 . 连接</small>
                    </td>
                    <td>
                        <textarea v-model="newKey.value"></textarea>
                        <button style="padding-left: 8px; padding-right: 8px" @click="addNewKey">添加该字段</button>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
    import YAML from 'js-yaml'
    import {flatten, unflatten} from 'flat'

    import {saveData} from "../utils";
    import {translationsSource} from "../langs";

    export default {
        name: 'Translator',
        data() {
            return {
                output            : 'json',
                fileFilter        : '',
                selectedLocale    : '',
                parsedLocales     : [],
                dragging          : false,
                newKey            : {
                    key  : '',
                    value: ''
                },
                editingSource     : '',
                editingParsed     : {},
                editingFile       : null,
                translationsSource: JSON.stringify(translationsSource),
                translationsParsed: {},
                files             : []
            }
        },

        watch   : {
            output() {
                this.editingSource = this.compiler(unflatten(this.editingParsed, {overwrite: true}), null, 2);
                this.compileEditing();
                this.rebuildEditor();
            },

            editingFile(_, oldVal) {
                if (oldVal) {
                    this.translationsParsed = {
                        ...this.translationsParsed,
                        [oldVal]: unflatten(this.editingParsed, {overwrite: true})
                    };
                    this.compile()
                }
                this.rebuildEditor()
            },

            editingParsed: {
                deep: true,
                handler() {
                    this.editingSource = this.compiler(unflatten(this.editingParsed, {overwrite: true}), null, 2)
                }
            }
        },
        computed: {
            filterFiles() {
                return this.files.filter(file => file.match(new RegExp(this.fileFilter, 'ig')))
            },

            parser() {
                return this.output === 'yaml' ? YAML.safeLoad : JSON.parse
            },

            compiler() {
                return this.output === 'yaml' ? YAML.safeDump : JSON.stringify
            },

            selectedLocaleEditing() {
                const keys = unflatten(this.editingParsed, {overwrite: true})[this.selectedLocale]
                return keys ? flatten(keys) : {}
            }
        },
        created() {
            this.parse();
            this.editingFile = this.files[0]
        },
        methods : {
            addLocale() {
                const locale = prompt('请输入要添加的类型', '').trim()
                if (!locale || this.parsedLocales.includes(locale)) return;
                this.parsedLocales.push(locale);
                for (let [file, i18n] of Object.entries(this.translationsParsed)) {
                    this.translationsParsed[file] = {
                        ...i18n,
                        [locale]: i18n[this.selectedLocale]
                    }
                }
                this.selectedLocale = locale;
                this.rebuildEditor();
                this.compile()
            },

            parse() {
                this.translationsParsed = JSON.parse(this.translationsSource);
                this.files = Object.keys(this.translationsParsed);
                this.parsedLocales = [...new Set([].concat(
                    ...Object.values(this.translationsParsed).map(t => Object.keys(t))
                ))];
                this.selectedLocale = this.parsedLocales[0];
            },

            compile() {
                this.translationsSource = JSON.stringify(this.translationsParsed, null, 2);
            },

            rebuildEditor() {
                this.editingSource = this.compiler(this.translationsParsed[this.editingFile], null, 2);
                this.editingParsed = flatten(this.parser(this.editingSource), {overwrite: true});
            },

            compileEditing() {
                this.editingParsed = flatten(this.parser(this.editingSource), {overwrite: true});
                this.translationsParsed[this.editingFile] = unflatten(this.editingParsed, {overwrite: true});
            },

            removeKey(key) {
                const parsed = {...this.editingParsed};
                if (!confirm(`确定删除 ${key} 字段？`)) return;
                this.parsedLocales.forEach(l => {
                    delete parsed[`${l}.${key}`]
                });
                this.editingParsed = flatten(parsed, {overwrite: true});
            },

            addNewKey() {
                const parsed = {...this.editingParsed};
                if (!this.newKey.key.trim()) {
                    return;
                }
                parsed[`${this.selectedLocale}.${this.newKey.key}`] = this.newKey.value;
                this.editingParsed = flatten(parsed, {overwrite: true});
                this.editingSource = this.compiler(parsed, null, 2);
                this.compileEditing();
                this.rebuildEditor();
                this.newKey = {key: '', value: ''};
            },

            download() {
                this.compile();
                saveData(this.translationsParsed, 'i18n.json');
            }
        }
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    a {
        color: #fff;
    }

    .translator {
        display: grid;
        grid-template-areas: "files locales actions-table editor-actions" "files locales table editor";
        grid-template-columns: 10vw 10vw 55vw 25vw;
        grid-template-rows: 48px;
        height: 100vh;
    }

    .locals {
        grid-area: locales;
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 10vw;
        padding: 0 8px;
    }

    .editor-actions {
        grid-area: editor-actions;
        display: flex;
        height: 48px;
    }

    button:focus {
        outline: none;
    }

    input:focus {
        outline: none;
    }

    button {
        cursor: pointer;
    }

    button.selected {
        background-color: rgb(42, 104, 42);
    }

    .files {
        grid-area: files;
        background-color: #2E3440;
        overflow-y: auto;
    }

    .files a {
        color: #7c7c7c;
        text-decoration: none;
        padding: 10px 20px;
        display: block;
    }

    .files a b {
        color: #fff;
    }

    .files a:hover {
        background-color: #292e3a;
    }

    .filter {
        width: 100%;
        color: #fff;
        outline: none;
    }

    .editor {
        grid-area: editor;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    code.tag {
        font-family: Menlo, 'Courier New', Courier, monospace;
        font-weight: bold;
        margin: 5px;
        opacity: 0.4;
    }

    .editor textarea {
        width: 100%;
        height: 100%;
    }

    .actions-table {
        grid-area: actions-table;
        padding: 0 12px;
        text-align: right;
    }

    .table {
        grid-area: table;
        overflow-y: auto;
        padding: 0 12px;
    }

    .table table {
        width: 100%;
    }

    .table table td:first-child {
        width: 30%;
    }

    .table table td {
        vertical-align: top;
        text-align: right;
        position: relative;
    }

    .table table td .remove {
        display: none;
    }

    .table table td:hover .remove {
        display: block;
    }

    button.remove {
        position: absolute;
        background-color: red;
        width: 20px;
        height: 20px;
        top: 5px;
        right: 0;
        border-radius: 50%;
        font-size: 18px !important;
        line-height: 20px;
        padding: 0 !important;
        margin: 0;
        cursor: pointer;
        opacity: 0.4;
    }

    button.remove:hover {
        opacity: 1;
    }

    .table table td button {
        padding: 3px;
        font-size: 14px;
    }

    .table table td input {
        width: 100%;
        display: block;
        text-align: right;
        font-family: Menlo, 'Courier New', Courier, monospace;
    }

    .table table td input::placeholder {
        text-align: right;
    }
</style>
