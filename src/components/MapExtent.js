/**
 * Class that describes the center & zoom level of a map
 * @property {Number} latitude      latitude of map center
 * @property {Number} longitude     longitude of map center
 * @property {Number} zoomLevel     zoom level of map
 */
 export class MapExtent {
    constructor (
        latitude = 44,
        longitude = -116.5,
        zoomLevel = 3

    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.zoomLevel = zoomLevel;
    }
}