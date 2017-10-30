export class EntityModel {
    serial: string;
    components: any[];
    constructor (model: EntityModel) {
        this.serial = model.serial;
        this.components = model.components;
    }
}