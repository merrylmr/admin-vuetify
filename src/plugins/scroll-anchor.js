import {throttle} from '../assets/js/utils.js'
// TODO:try catch
// 浏览器兼容(window.scrollTo)
//

const isSupportBehavior = typeof window.getComputedStyle(document.body).scrollBehavior !== 'undefined'
const domScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

export default class ScrollAnchor {
    constructor(options) {
        this.offsetTopArr = []
        this.options = options;
        this.init()
    }

    getScrollTop(dom) {
        if (!dom) {
            return domScrollTop
        } else {
            return dom.scrollTop;
        }
    }


    getDomOffsetTop() {

    }

    getDom(v, k) {
        if (v) {
            return typeof v === 'string' ? document.querySelectorAll('.' + v) : v
        } else {
            throw (k + '不能为空')
        }
    }


    scrollSmoothTo(position) {
        const scrollTopDom = this.options.scrollDom || document.documentElement;
        const scrollToDom = this.options.scrollDom || window;
        if (isSupportBehavior) {
            console.log('not ie bro', scrollToDom)
            scrollToDom.scrollTo({
                top: position,
                behavior: "smooth"
            })

        } else {
            if (!window.requestAnimFrame) {
                window.requestAnimationFrame = function (callback) {
                    return setTimeout(callback, 17);
                };
            }
            let scrollTop = this.getScrollTop(scrollTopDom)
            // 滚动step方法
            const step = function () {
                // 距离目标滚动距离
                const distance = position - scrollTop;
                // 目标滚动位置
                scrollTop = scrollTop + distance / 5;
                if (Math.abs(distance) < 1) {
                    scrollTopDom.scrollTop = position
                    // isSupportBehavior ? scrollToDom.scrollTo(0, position) : (scrollTopDom.scrollTop = position)
                } else {
                    scrollTopDom.scrollTop = scrollTop
                    // isSupportBehavior ? scrollToDom.scrollTo(0, scrollTop) : (scrollTopDom.scrollTop = scrollTop)
                    requestAnimationFrame(step);
                }
            };
            step()
        }
    }

    anchorEvent() {
        this.anchorList.forEach((anchor, index) => {
            anchor.addEventListener('click', (e) => {
                const offsetTop = this.offsetTopArr[index];
                // TODO: 这里如果是锚点的话，scrollTo不会生效
                e.preventDefault()
                this.scrollSmoothTo(offsetTop)
                //  添加锚点
            })
        })
    }

    scrollEvent() {
        const options = this.options;
        const diffY = 100;
        const scrollHandle = throttle(() => {
            const dom = options.scrollDom ? options.scrollDom : document.documentElement;

            const scrollTop = this.getScrollTop(dom);
            const index = this.offsetTopArr.findIndex((item => {
                return item > scrollTop + diffY
            }))
            if (index === -1) {
                const len = this.offsetTopArr.length - 1;
                const h = this.sectionList[len].clientHeight;

                if (scrollTop <= this.offsetTopArr[len] + h) {
                    this.activeIndex = len;
                } else {
                    this.activeIndex = -1;
                }

            } else if (index >= 1) {
                this.activeIndex = index - 1
            } else {
                // 第一个
                this.activeIndex = index;
            }

            // 其他的dom需要去掉
            this.anchorList.forEach((item, index) => {
                if (this.activeIndex === index) {
                    item.classList.add('is-active')
                } else {
                    item.classList.remove('is-active')
                }
            })

        }, 200)
        const parentDom = options.scrollDom || window
        parentDom.addEventListener('scroll', scrollHandle)
    }

    init() {
        try {
            const options = this.options;
            this.anchorList = this.getDom(options.anchor)
            this.sectionList = this.getDom(options.section);

            this.sectionList.forEach(item => {
                this.offsetTopArr.push(item.offsetTop)
            })

            this.anchorEvent();
            this.scrollEvent();

        } catch (err) {
            console.error(err)
        }
    }
}