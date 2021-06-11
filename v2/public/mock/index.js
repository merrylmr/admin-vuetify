import Mock from 'mockjs'

const mockApi = () => {
    Mock.mock("/peopleInfo", "get", (config) => {
        console.log(config);
        return [
            {
                name: '北京市',
                value: 1961.2,
            },
            {
                name: '天津市',
                value: 1293.82,
            },
            {
                name: '河北省',
                value: 7185.42,
            },
            {
                name: '山西省',
                value: 3571.21,
            },
            {
                name: '内蒙古自治区',
                value: 2470.63,
            },
            {
                name: '辽宁省',
                value: 4374.63,
            },
            {
                name: '吉林省',
                value: 2746.22,
            },
            {
                name: '黑龙江省',
                value: 3831.22,
            },
            {
                name: '上海市',
                value: 2301.391,
            },
            {
                name: '江苏省',
                value: 7865.99,
            },
            {
                name: '上海市',
                value: 2301.391,
            },
            {
                name: '浙江省',
                value: 5442,
            },
            {
                name: '安徽省',
                value: 5950.1,
            },
            {
                name: '福建省',
                value: 3552,
            },
            {
                name: '江西省',
                value: 4456.74,
            },
            {
                name: '山东省',
                value: 9579.31,
            },
            {
                name: '河南省',
                value: 9402.36,
            },
            {
                name: '湖北省',
                value: 5723.77,
            },
            {
                name: '湖南省',
                value: 6568.37,
            },
            {
                name: '广东省',
                value: 10430.03,
            },
            {
                name: '广西壮族自治区',
                value: 4602.66,
            },
            {
                name: '海南省',
                value: 867.15
            },
            {
                name: '重庆市',
                value: 2884,
            },
            {
                name: '四川省',
                value: 8041.82,
            },
            {
                name: '贵州省',
                value: 3476.65,
            },
            {
                name: '云南省',
                value: 4596.6,
            },
            {
                name: '西藏自治区',
                value: 300.21,
            },
            {
                name: '陕西省',
                value: 3732.74,
            },
            {
                name: '甘肃省',
                value: 2557.53,
            },
            {
                name: '青海省',
                value: 562.67,
            },
            {
                name: '宁夏回族自治区',
                value: 630.14,
            },
            {
                name: '新疆维吾尔自治区',
                value: 2181.33,
            },
            {
                name: '台湾省',
                value: 2316.2,
            },
            {
                name: '香港特别行政区',
                value: 709.76,
            },
            {
                name: '澳门特别行政区',
                value: 55.23,
            },
        ];
    })
}

export default mockApi