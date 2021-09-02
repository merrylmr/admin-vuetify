export function getImgAspectRatio(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        // 判断是否有缓存
        if (img.complete) {
            const radio = img.width / img.height
            resolve(radio)
        } else {
            img.onload = function () {
                const radio = img.width / img.height
                resolve(radio)
            }
        }
        img.onerror = function () {
            reject('getImgAspectRatio 出错');
        }
    })
}

export function getImgOriginSize(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        if (img.complete) {
            resolve({
                width: img.width,
                height: img.height
            })
        } else {
            img.onload = function () {
                resolve({
                    width: img.width,
                    height: img.height
                })
            }
        }
        img.onerror = function () {
            reject('getImgAspectRatio 出错');
        }
    })
}