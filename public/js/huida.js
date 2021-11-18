// document.write('<iframe src="https://duck-ment.e.cn.vc/" style="width:100%;height:500px"><iframe>')


function createDom() {
    console.log('createDom1111')
    const iframe = document.createElement('iframe')
    iframe.src = 'https://duck-ment.e.cn.vc/'

    iframe.style = 'width:100%;height:500px';
    document.body.appendChild(iframe)
}

createDom()