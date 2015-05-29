package glaze.eco.core;

import glaze.eco.core.Entity;

class System {

    public var entities:Array<Entity> = new Array<Entity>();

    public var registeredComponents (get, null):Array<Class<IComponent>>;
    var engine:Engine;

    public function new() {    
    }

    public function onAdded(engine:Engine) {
        this.engine = engine;
    }

    public function onRemoved() {
    }

    public function entityAdded(entity:Entity) {
    }

    public function entityRemoved(entity:Entity) {
        entities.remove(entity);
    }

    public function update(timestamp:Float,delta:Float) {
    }

    public function match(entity:Entity) {
        var count = registeredComponents.length;
        for (component in entity.list) {
            if (registeredComponents.indexOf(Type.getClass(component))>=0) 
                count--;
        }
        var index = entities.indexOf(entity);
        if (count==0) {
            if (index>=0)
                return;
            entities.push(entity);
            entityAdded(entity);
        } else if (index>0) {
            entities.splice(index,1);
        }

    }

    public function get_registeredComponents():Array<Class<IComponent>> {
        return [];
    }

}