<template>
    <transition name="fade">
        <div class="calendarBox"
             ref="calendar"
             :class='[{transition:transition}]'
             @touchstart.stop="moveStart"
             style="overflow:hidden;">
            <div
                style="white-space: nowrap"
                :class="{transition:transition}"
                :style="{transform: 'translate3d('+calendarMove.x+'px,'+calendarMove.y+'px,0px)',
                         height:calenderInnerH-25+'px'}">
                <slot></slot>
            </div>
            <div class="calendar-toggle"
                 v-if="changeMode"
                 @click="toggleMode"
            >
              <img v-show="mode==='week'" src="./assets/arrow-down.svg">
              <img v-show="mode==='month'" src="./assets/minus.svg">
              <!--                <van-icon :name="mode==='week'?'arrow-down':'minus'"/>-->
            </div>
        </div>
    </transition>
</template>
<script>

import {MIN_HEIGHT, MAX_HEIGHT} from './const.js'

export default {
    data() {
        return {
            transition: true, // 是否显示动画
            calendarHeight: -100, // 日历的高度
            calendarMove: {
                x: 0,
                y: 0
            },
            move_start_calendarHeight: 0,  // 开始移动的高度初始值
            can_move: false, // 是否触发move事件
            itemWidth: 0,  // 窗口的宽度
            move_index: 0, // 左右移动 1 向右移动-1向左移动
            line_num: 0, //  选中或今天是第几行的周
        }
    },
    props: {
        checkDate: {
            type: Date,
        },
        mode: {
            type: String,
            mode: 'month'
        },
        changeMode: {
            type: Boolean
        },
        calenderInnerH: {
            type: Number,
            default: MIN_HEIGHT
        }
    },
    created() {
        //  初始化日历宽度和line_num
        this.itemWidth = window.innerWidth
        this.line_num = this.calc_line_num(this.checkDate);
    },
    watch: {
        checkDate(val) {
            if (val) {
                this.line_num = this.calc_line_num(val)
                console.log(this.line_num, '行')
            }
        },
        calendarHeight(newVal) {
            console.log('---newVal---' + newVal);
            this.$emit('calendarHeight', newVal);
        },
    },
    methods: {
        // 手机端端开始移动
        moveStart(e) {
            this.transition = true
            console.log('moveStart11111111111111111')
            let touch = this.getTouch(e);

            this.move_start_calendarHeight = this.calenderInnerH
            this.can_move = true
            this.$parent.can_click = true

            const startPos = {
                x: touch.clientX,
                y: touch.clientY
            }
            let mode = 0;
            let canChangeMode = true
            const targetDom = e.currentTarget;
            const docDom = document.body

            const removeEvent = () => {
                targetDom.removeEventListener('touchmove', touchmoveHandle)
                targetDom.removeEventListener('touchend', touchEndHandle)
            }
            const touchmoveHandle = (e) => {
                // e.preventDefault();
                const curTouch = this.getTouch(e);
                const diffX = curTouch.clientX - startPos.x
                const diffY = curTouch.clientY - startPos.y


                if (canChangeMode) {
                    if (Math.abs(diffX) >= Math.abs(diffY)) {
                        // 左右移动
                        mode = 1;
                    } else {
                        //  上下移动
                        mode = 2;
                    }
                    canChangeMode = false;
                }
                console.log('mode', mode)

                if (mode === 1) {
                    this.calendarMove.x = diffX;
                } else if (mode === 2 && this.changeMode) {
                    // 上下移动
                    if (diffY > 10 && this.mode === 'week') {
                        this.$emit('changeMode', 'month')
                    }

                    if (diffY > 0) {
                        this.calendarMove.y = -((this.line_num * 40 > Math.abs(diffY)) ? this.line_num * 40 - Math.abs(diffY) : 0);
                    } else {
                        // 向上
                        this.calendarMove.y = diffY;
                    }

                    if (this.move_start_calendarHeight + diffY > MAX_HEIGHT) {
                        this.calendarHeight = MAX_HEIGHT;
                        this.calendarMove.y = 0;
                    } else if (this.move_start_calendarHeight + diffY < MIN_HEIGHT) {
                        this.calendarHeight = MIN_HEIGHT;
                        this.calendarMove.y = 0;
                    } else {
                        this.calendarHeight = this.move_start_calendarHeight + diffY;
                    }
                }
            }

            const touchEndHandle = (e) => {
                console.log('touchEndHandle--33333')
                e.stopPropagation()
                if (mode === 0) {
                    removeEvent()
                    return;
                }
                canChangeMode = true;
                const endTouch = this.getTouch(e);

                if (mode === 1) {
                    const diffX = endTouch.clientX - startPos.x

                    if (Math.abs(diffX) < 50) {
                        this.calendarMove.x = 0;
                        removeEvent()
                        return
                    }
                    if (diffX < 0) {
                        this.calendarMove.x = -this.itemWidth
                        this.move_index = 1 // 向右边移动
                    } else {
                        this.calendarMove.x = this.itemWidth
                        this.move_index = -1 // 向左边移动
                    }
                    setTimeout(() => {
                        this.transition = false
                        this.$emit('on-change', this.move_index)
                    }, 500)
                } else if (mode === 2 && this.changeMode) {
                    const diffY = endTouch.clientY - startPos.y
                    console.log('diffY', diffY)
                    if (Math.abs(diffY) < 30) {
                        this.calendarMove.y = 0;
                        if (diffY > 0) {
                            console.log('lallalal')
                            this.calendarHeight = MIN_HEIGHT;
                            this.$emit('changeMode', 'week')
                        } else {
                            this.calendarHeight = MAX_HEIGHT;
                        }
                        removeEvent()
                        return
                    }
                    this.calendarMove.y = 0

                    if (diffY > 0) {
                        this.calendarHeight = MAX_HEIGHT;
                        this.$emit('changeMode', 'month')
                    } else {
                        this.calendarHeight = MIN_HEIGHT;
                        this.$emit('changeMode', 'week')
                    }
                }

                removeEvent()
            }

            targetDom.addEventListener('touchmove', touchmoveHandle)
            targetDom.addEventListener('touchend', touchEndHandle)
        },
        getTouch(e) {
            let touch;
            if (e.changedTouches) {
                touch = e.changedTouches[0];
            } else {
                touch = e
            }
            return touch
        },
        toggleMode(e) {
            if (!this.changeMode) return
            this.calendarMove.y = 0
            if (this.mode === 'month') {
                this.calendarHeight = MIN_HEIGHT;
                this.$emit('changeMode', 'week')
            } else {
                this.calendarHeight = MAX_HEIGHT;
                this.$emit('changeMode', 'month')
            }
        },
        move_change(_index) {
            this.calendarMove.x = 0
        },
        calc_line_num(day) {
            // 计算今天在第几行
            let year = day.getFullYear()
            let month = day.getMonth()
            let dt_first = new Date(year, month, 1)   // 每个月第一天
            let space = (dt_first.getDay() - 1 + 7) % 7   // 月历前面空格
            return parseInt((space + day.getDate() - 1) / 7)
        }
    }
}
</script>
<style scoped lang="scss">
.calendarBox {
  position: relative;
  height: 282px;
  z-index: 99;
}


.transition {
  transition: all .3s linear;
}

.calendar-toggle {
  position: relative;
  width: 100%;
  height: 25px;
  z-index: 100;
  bottom: 0;
  background-color: #fff;
  @include flex(center, center);


img {
  width: 20px;
}

}
</style>
