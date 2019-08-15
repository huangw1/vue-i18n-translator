/**
 * @Author: huangw1
 * @Date: 2019/8/15 14:41
 */

export const saveData = (() => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';

    return  (data, fileName) => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], {type: "application/json"});
        const href = window.URL.createObjectURL(blob);
        a.href = href;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(href)
    }
})();
