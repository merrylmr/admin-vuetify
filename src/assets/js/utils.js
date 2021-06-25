export function watermarkFn(options = {targetCls: 'watermark', display: 'block'}) {
    // 目标组件
    const targetCls = options.targetCls;
    let targetOriginDom = document.querySelector('.' + targetCls);
    const config = {attributes: true, childList: true, subtree: true};
    if (targetOriginDom) {
        const parentDom = targetOriginDom.parentNode;
        const adsInnerHTML = targetOriginDom.innerHTML;

        const observeDom = () => {
            let targetDom = document.querySelector('.' + targetCls);
            if (targetDom) {
                parentDom.removeChild(targetDom);
            }
            if (window.observer) {
                window.observer.disconnect();
            }

            const div = document.createElement('div');
            div.className = targetCls;
            div.setAttribute('style', `display:${options.display}!important;visibility:visible!important;opacity:1!important;`);
            div.innerHTML = adsInnerHTML;
            parentDom.appendChild(div);
            // 新添加的DOM之后，需要重新去添加DOM监听
            const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            window.observer = new MutationObserver(callback);
            window.observer.observe(div, config);
        }
        // 当观察到变动时执行的回调函数
        const callback = function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                    observeDom()
                } else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                    observeDom();
                }
            }
        };
        observeDom();
        // 滚动的时候去监听，如果被删除，则需要重新添加上
        document.addEventListener('scroll', () => {
            let targetDom = document.querySelector('.' + targetCls);
            if (!targetDom) {
                observeDom();
            }
        })
    }
}