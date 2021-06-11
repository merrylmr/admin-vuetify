import Mock from 'mockjs'

const mockApi = () => {
    Mock.mock("/peopleInfo", "get", (config) => {
        console.log(config);
        return [
            {
                name: '北京市',
                value: 1961.2,
                adCode: '110000'
            },
            {
                name: '天津市',
                value: 1293.82,
                adCode: '120000'
            },
            {
                name: '河北省',
                value: 7185.42,
                adCode: '130000'
            },
            {
                name: '山西省',
                value: 3571.21,
                adCode: '140000'
            },
            {
                name: '内蒙古自治区',
                value: 2470.63,
                adCode: '150000'
            },
            {
                name: '辽宁省',
                value: 4374.63,
                adCode: '210000'
            },
            {
                name: '吉林省',
                value: 2746.22,
                adCode: '220000'
            },
            {
                name: '黑龙江省',
                value: 3831.22,
                adCode: '230000'
            },
            {
                name: '上海市',
                value: 2301.391,
                adCode: '310000'
            },
            {
                name: '江苏省',
                value: 7865.99,
                adCode: '320000'
            },
            {
                name: '浙江省',
                value: 5442,
                adCode: '330000'
            },
            {
                name: '安徽省',
                value: 5950.1,
                adCode: '340000'
            },
            {
                name: '福建省',
                value: 3552,
                adCode: '350000'
            },
            {
                name: '江西省',
                value: 4456.74,
                adCode: '360000'
            },
            {
                name: '山东省',
                value: 9579.31,
                adCode: '370000'
            },
            {
                name: '河南省',
                value: 9402.36,
                adCode: '410000'
            },
            {
                name: '湖北省',
                value: 5723.77,
                adCode: '420000'
            },
            {
                name: '湖南省',
                value: 6568.37,
                adCode: '430000'
            },
            {
                name: '广东省',
                value: 10430.03,
                adCode: '440000'
            },
            {
                name: '广西壮族自治区',
                value: 4602.66,
                adCode: '450000'
            },
            {
                name: '海南省',
                value: 867.15,
                adCode: '460000'
            },
            {
                name: '重庆市',
                value: 2884,
                adCode: '500000'
            },
            {
                name: '四川省',
                value: 8041.82,
                adCode: '510000',
            },
            {
                name: '贵州省',
                value: 3476.65,
                adCode: '520000'
            },
            {
                name: '云南省',
                value: 4596.6,
                adCode: '530000'
            },
            {
                name: '西藏自治区',
                value: 300.21,
                adCode: '540000'
            },
            {
                name: '陕西省',
                value: 3732.74,
                adCode: '610000'
            },
            {
                name: '甘肃省',
                value: 2557.53,
                adCode: '620000'
            },
            {
                name: '青海省',
                value: 562.67,
                adCode: '630000'
            },
            {
                name: '宁夏回族自治区',
                value: 630.14,
                adCode: '640000'
            },
            {
                name: '新疆维吾尔自治区',
                value: 2181.33,
                adCode: '650000'
            },
            {
                name: '台湾省',
                value: 2316.2,
                adCode: '710000'
            },
            {
                name: '香港特别行政区',
                value: 709.76,
                adCode: '810000'
            },
            {
                name: '澳门特别行政区',
                value: 55.23,
                adCode: '820000'
            },
        ];
    })
}

export default mockApi