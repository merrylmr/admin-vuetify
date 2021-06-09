const defaultOptions = {
    zoom: 0,
    center: [0, 0],
    waterColor: '#b3d1ff',
    landColor: '#f00',
    markerColor: '#333',
    markerSize: 5
}

class DrawGeoJson {
    constructor(el, options) {
        if (!el) {
            console.error('el is null')
        }
        this.options = Object.assign(defaultOptions, options);
        this.el = el;
        this.init();
    }

    init() {
        console.log('this.options', this.options);
        this.geoJson = this.options.geojson.features || this.options.geojson;
        this.scale = Math.pow(2, parseInt(this.options.zoom));
        this.bounds = this.getBounds();
        console.log('bounds----', this.bounds, this.geoJson);
        this.width = this.el.clientWidth;
        this.height = this.el.clientHeight;

        this.map = this.createMap(this.width, this.height);
        this.context = this.map.getContext('2d');
        this.el.appendChild(this.map);

        this.draw();
    }

    createMap(width, height) {
        const map = document.createElement('canvas');
        map.width = width;
        map.height = height;
        map.style.position = 'absolute';
        map.style.top = 0;
        map.style.left = 0;
        return map;
    }

    draw() {
        this.context.fillStyle = this.options.landColor;
        for (let i = 0; i < this.geoJson.length; i++) {
            const coords = this.geoJson[i].geometry.coordinates[0];
            for (let j = 0; j < coords.length; j++) {
                const point = this.coordinateToPoint(coords[j][1], coords[j][0]);
                // console.log('draw point', point);
                if (j === 0) {
                    this.context.beginPath();
                    this.context.moveTo(point.x, point.y);
                } else {
                    this.context.lineTo(point.x, point.y);
                }
            }
            this.context.stroke();
        }
    }

    coordinateToPoint(latitude, longitude) {
        const point = this.projectCoordinate(latitude, longitude);
        // console.log('coordinateToPoint', point);
        const xScale = this.width / Math.abs(this.bounds.xMax - this.bounds.xMin);
        const yScale = this.height / Math.abs(this.bounds.yMax - this.bounds.yMin);
        const scale = xScale < yScale ? xScale : yScale;


        return {
            x: (point.x - this.bounds.xMin) * scale,
            y: (this.bounds.yMax - point.y) * scale
        };
    }

    projectCoordinate(latitude, longitude) {
        let point = {};
        const RADIUS = 6378137;
        const MAX = 85.0511287798;
        const RADIANS = Math.PI / 180;

        let x = RADIUS * longitude * RADIANS;
        let y = Math.max(Math.min(MAX, latitude), -MAX) * RADIANS;
        y = RADIUS * Math.log(Math.tan((Math.PI / 4) + (y / 2)));

        point.x = x * this.scale;
        point.y = y * this.scale;

        return point;
    }

    getBounds() {
        let bounds = {}, coords, point
        for (let i = 0; i < this.geoJson.length; i++) {
            coords = this.geoJson[i].geometry.coordinates[0];
            for (let j = 0; j < coords.length; j++) {
                point = this.projectCoordinate(coords[j][1], coords[j][0]);
                bounds.xMin = bounds.xMin < point.x ? bounds.xMin : point.x;
                bounds.xMax = bounds.xMax > point.x ? bounds.xMax : point.x;
                bounds.yMin = bounds.yMin < point.y ? bounds.yMin : point.y;
                bounds.yMax = bounds.yMax > point.y ? bounds.yMax : point.y;
            }
        }
        return bounds
    }

}

export default DrawGeoJson