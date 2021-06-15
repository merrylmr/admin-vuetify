import colors from 'vuetify/lib/util/colors'
export function mapOptions(mapType) {
    return {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(50,50,50,0.7)',
            borderColor: '#333',
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: (item) => {
                let html = `${item.name}`
                if (item.data) {
                    html += `<p style="font-size:12px">人口数量：${(item.data.value)}万</p>
               `
                }
                return html
            }
        },
        grid: {
            height: '85%',
            width: '98%',
            left: '1%',
            top: '10%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        visualMap: {
            min: 55,
            max: 10550,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: [colors.deepPurple.lighten4, colors.deepPurple.base, colors.deepPurple.darken4]
            },
        },
        series: [
            {
                name: '人口密度',
                type: 'map',
                mapType: mapType,
                // aspectScale: 0.83, // 长宽比
                zoom: 1.2, // 放大
                label: {
                    show: true,
                    fontSize: 10,
                },
                emphasis: {
                    label: {
                        show: true,
                        color: "#fff",
                    },
                    itemStyle: {
                        areaColor: '#512DA8',
                        borderColor: '#fff',
                        color: '#fff',
                        borderWidth: 2
                    },
                },
                select: {
                    itemStyle: {
                        areaColor: '#673AB7',
                        borderColor: '#fff',
                        color: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        color: "#fff",
                    },
                },
                data: [],
                markPoint: { // 图表标注。
                    'symbol': 'pin',
                    'symbolSize': 80, // 图形大小
                    'label': {
                        show: true,
                        position: 'inside',
                        color: '#333',
                        fontSize: 10,
                        formatter: (item) => {
                            let html = `${item.name.substr(0, 4)}\n${item.name.substr(4)}`
                            return html
                        }
                    },
                    itemStyle: {
                        color: '#FAFAFA',
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 10,
                        shadowOffsetX: 5,
                        shadowOffsetY: 5,
                        emphasis: {
                            label: {
                                color: '#333',
                            },
                        }
                    },
                    data: [],
                    tooltip: {
                        show: false
                    }
                }
            }
        ]
    }
}

export function cityOptions() {

}