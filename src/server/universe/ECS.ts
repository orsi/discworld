import Entity from './Entity';
import System from './EntitySystem';

export default class ECS {
    private EntityTypes: { [name: string]: Entity } = {};
    private entities: Array<Entity>;
    private systems: Array<System>;

    /**
     * Indicates that the engine is currently updating
     */
    public updating: boolean;

    constructor () {
        // load all entity types
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
    // loadEntity(entityModel: IEntity): IEntity {
    //     return entity;
    // }
    // createEntity(entityName: string): IEntity {
    //     let newEntity: IEntity;
    //     for (let entityTypeName in this.EntityTypes) {
    //         if (entityName === entityTypeName) {
    //             let entityClass = this.EntityTypes[entityTypeName];
    //             newEntity = new entityClass();
    //         }
    //     }
    //     return newEntity;
    // }
}