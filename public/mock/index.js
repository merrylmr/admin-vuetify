import Mock from 'mockjs'

const mockApi = () => {
    Mock.mock("/peopleInfo?code=100000", "get", (config) => {
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
    Mock.mock("/peopleInfo?code=510000", "get", (config) => {
        console.log(config);
        return [
            {
                name: '成都市',
                value: 1633.0,
                adCode: '510100'
            },
            {
                name: '自贡市',
                value: 292.0,
                adCode: '510300'
            },
            {
                name: '攀枝花市',
                value: 123.6,
                adCode: '510400'
            },
            {
                name: '泸州市',
                value: 432.4,
                adCode: '510500'
            },
            {
                name: '德阳市',
                value: 354.5,
                adCode: '510600'
            },
            {
                name: '绵阳市',
                value: 485.7,
                adCode: '510700'
            },
            {
                name: '广元市',
                value: 266.7,
                adCode: '510800'
            },
            {
                name: '遂宁市',
                value: 320.2,
                adCode: '510900'
            },
            {
                name: '内江市',
                value: 369.9,
                adCode: '511000'
            },
            {
                name: '乐山市',
                value: 326.7,
                adCode: '511100'
            },
            {
                name: '南充市',
                value: 644.0,
                adCode: '511300'
            },
            {
                name: '眉山市',
                value: 298.4,
                adCode: '511400'
            },
            {
                name: '宜宾市',
                value: 455.6,
                adCode: '511500'
            },
            {
                name: '广安市',
                value: 324.1,
                adCode: '511600'
            },
            {
                name: '达州市',
                value: 572.0,
                adCode: '511700'
            },
            {
                name: '雅安市',
                value: 154.0,
                adCode: '511800'
            },
            {
                name: '巴中市',
                value: 332.2,
                adCode: '511900'
            },
            {
                name: '资阳市',
                value: 251.2,
                adCode: '512000'
            },
            {
                name: '阿坝藏族羌族自治州',
                value: 94.4,
                adCode: '513200'
            },
            {
                name: '甘孜藏族自治州',
                value: 119.6,
                adCode: '513300'
            },
            {
                name: '凉山彝族自治州',
                value: 490.8,
                adCode: '513400'
            },
        ];
    })
}

export default mockApi