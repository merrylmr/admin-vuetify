export function mapOptions(mapType) {
    return {
        tooltip: {
            trigger: 'item',
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
            min: 55, // TODO:数据里面获取
            max: 10550,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['#D1C4E9', '#673AB7', '#311B92']
            },
            // show: false
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
                        borderColor: '#fff',
                    }
                },
                data: []
            }
        ]
    }
}