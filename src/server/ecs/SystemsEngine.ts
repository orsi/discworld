import Entity from './Entity';
import System from './System';

export default class SystemsEngine {
    private entities: Array<Entity>;
    private systems: Array<System>;

    /**
     * Indicates that the engine is currently updating
     */
    public updating: boolean;

    constructor () {

    }

    /**
     * Adds an entity
     */
    addEntity(entity: Entity): void {
        // if (this.entityTypes[entity.name]) {
        //     throw new Error( 'The entity name ' + entity.name + ' is already in use by another entity.' );
        // }
        // this.entities.push( entity );
        // this.entityTypes[ entity.name ] = entity;
        // entity.componentAdded.add( componentAdded );
        // entity.componentRemoved.add( componentRemoved );
        // entity.nameChanged.add( entityNameChanged );
        // for each( var family : IFamily in families )
        // {
        //     family.newEntity( entity );
        // }
    }
}