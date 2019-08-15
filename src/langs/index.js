/**
 * @Author: huangw1
 * @Date: 2019/8/15 14:41
 */

import {mapValues, cloneDeep, isObject} from 'lodash';

import cn from './cn'
import en from './en'

const extendCn = (locale, cn) => {
    mapValues(cn, (value, key) => {
        if (!locale[key]) {
            locale[key] = cloneDeep(value)
        } else if (isObject(value)) {
            extendCn(locale[key], value)
        }
    })
    return locale
};

export const translationsSource = {
    '中文': cn,
    '英文': extendCn(en, cn)
};
