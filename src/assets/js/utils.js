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


// 防抖：就是在触发事件后，等完成后间隔多久执行回调
export function debounce(fn, wait, immediate = false) {
    // timeId需要放在函数外面，需要上一次的timeId
    let timeId

    return function (...params) {
        if (timeId) clearTimeout(timeId)
        const callNow = !timeId
        if (immediate) {
            timeId = setTimeout(() => {
                timeId = null
            }, wait)
            if (callNow) fn.apply(this, params)
        } else {
            timeId = setTimeout(() => {
                // 上下文 & 传参
                fn.apply(this, params)
            }, wait)
        }
    }
}

// 节流：间隔设置的时间执行回调，无论在这个间隔里面触发了几次
// immediate:表示立即执行
export function throttle(fn, wait, immediate = false) {
    let begin = 0, timer = null
    // 闭包：可能存在上下文的问题this的问题
    return function (...params) {
        if (immediate) {
            // 每次需要获取当前的时间
            // 然后减去开始的时间'
            const now = Date.now()
            if (now - begin > wait) {
                fn.apply(this, params)
                begin = now
            }
        } else {
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(this, params)
                    timer = null
                }, wait)
            }
        }
    }
}


export function randomString(len = 16) {
    const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length;
    let n = "";
    for (let i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}





