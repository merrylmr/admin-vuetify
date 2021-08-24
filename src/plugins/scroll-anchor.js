import {throttle} from '../assets/js/utils.js'

const domScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
const defaultOptions = {
    per: 5,
    paddingTop: 50,
    lastActive: false
}
export default class ScrollAnchor {
    constructor(options) {
        this.offsetTopArr = []
        this.options = Object.assign(defaultOptions, options);
        this.init()
    }

    getScrollTop(dom) {
        if (!dom) {
            return domScrollTop
        } else {
            return dom.scrollTop;
        }
    }

    getDomOffsetTop(dom, parent) {
        try {
            let top = dom.offsetTop;
            while (dom.offsetParent != null || parent && dom.offsetParent !== parent) {
                dom = dom.offsetParent
                top += dom.offsetTop
            }
            return top
        } catch (err) {
            console.error('getDomOffsetTop error：', err)
            return 0
        }
    }

    getDom(v, k) {
        if (v) {
            return typeof v === 'string' ? document.querySelectorAll('.' + v) : v
        } else {
            throw (k + '不能为空')
        }
    }

    /**
     * 平滑滚动
     * @param endPos：滚动到的位置
     */
    scrollSmoothTo(endPos) {
        const scrollTopDom = this.options.scrollDom || document.documentElement;
        let scrollTop = this.getScrollTop(scrollTopDom)
        let startTime = Date.now(); // 开始时间
        const duringTime = 1000;

        const step = (startPos, endPos) => {
            const leftTime = (startTime + duringTime) - Date.now();
            const percent = (1 - leftTime / duringTime);

            let nowPos = (endPos - startPos) * percent + startPos

            if (percent >= 1) {
                scrollTopDom.scrollTop = endPos;
                nowPos = endPos;
            } else {
                window.requestAnimationFrame(function () {
                    scrollTopDom.scrollTop = nowPos;
                    step(nowPos, endPos);
                });
            }
        }
        step(scrollTop, endPos)
    }

    anchorEvent() {
        this.anchorList.forEach((anchor, index) => {
            anchor.addEventListener('click', (e) => {
                const offsetTop = this.offsetTopArr[index];
                const isLink = e.target.tagName.toLocaleLowerCase() === 'a';
                this.scrollSmoothTo(offsetTop, isLink)
            })
        })
    }

    scrollEvent() {
        const options = this.options;
        const diffY = options.paddingTop;

        const scrollHandle = throttle(() => {
            console.log('scrollHandle')
            const dom = this.scrollDom;
            const scrollTop = this.getScrollTop(dom);
            const index = this.offsetTopArr.findIndex((item => {
                return item > scrollTop + diffY
            }))
            const len = this.offsetTopArr.length - 1;
            const h = this.sectionList[len].clientHeight;
            if (index === -1) {
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

            if (this.options.lastActive) {
                // 滚动到接近底部、则最后一个高亮（范围值）
                const docOffsetH = this.scrollDom.offsetHeight;
                const docClientH = this.scrollDom.clientHeight
                const bottomHeight = docOffsetH - docClientH
                if (scrollTop + 10 >= bottomHeight) {
                    this.activeIndex = len;
                }
            }

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

    // 单页面,切换页面需要去remove事件
    removeEvent() {

    }

    init() {
        try {
            const options = this.options;
            this.anchorList = this.getDom(options.anchor, 'anchor')
            this.sectionList = this.getDom(options.section, 'section');
            // 用于监听滚动事件
            this.scrollContainer = this.getDom(options.scrollContainer || window)
            // 用于获取父级的scrollTop
            this.scrollDom = this.getDom(options.scrollContainer || document.documentElement)

            // 获取每个板块的offsetTop
            this.sectionList.forEach(item => {
                this.offsetTopArr.push(this.getDomOffsetTop(item))
            })
            this.anchorEvent();
            this.scrollEvent();

        } catch (err) {
            console.error(err)
        }
    }
}