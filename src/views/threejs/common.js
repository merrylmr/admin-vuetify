import * as THREE from "three";

export function worldVector2Screen(center, dom, camera) {
    const worldVector = new THREE.Vector3(
        center.x,
        center.y,
        center.z);
    //  将一个三维坐标，投影到相机平面上，使之变成一个二维坐标。
    //  需要注意的是，投影得到的结果是一个标准向量(或者叫单位向量)，
    //  其值是限定在[-1,1]范围内的。
    // 参考文档：https://segmentfault.com/q/1010000013062310
    const stdVector = worldVector.project(camera);
    const a = dom.clientWidth;
    const b = dom.clientHeight;

    const x = Math.round((0.5 + stdVector.x / 2) * (a));  //2
    const y = Math.round((0.5 - stdVector.y / 2) * (b));
    return {x, y}
}


// 点位是否在场景可视范围区域
export function pointInSceneView(point, camera) {
    point = new THREE.Vector3(point.x, point.y, point.z)
    const tempV = point.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    if ((Math.abs(tempV.x) > 1) || (Math.abs(tempV.y) > 1) || (Math.abs(tempV.z) > 1)) {
        // 在视野外了
        console.log('在视野外了在视野外了在视野外了在视野外了在视野外了在视野外了')
        return false
    } else {
        // 在视野内
        return true
    }
}


// 屏幕坐标转世界坐标
export function screenVector2World(point, dom, camera) {
    console.log('point', point);
    const x = (point.x / dom.clientWidth) * 2 - 1;
    const y = -(point.y / dom.clientHeight) * 2 + 1;
    const stdVector = new THREE.Vector3(x, y, 0.5);
    // 将向量转成threejs坐标
    const worldVector = stdVector.unproject(camera);
    console.log('worldVector', worldVector)
    return worldVector
}
