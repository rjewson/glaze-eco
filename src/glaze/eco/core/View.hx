package glaze.eco.core;

import glaze.eco.core.Entity;
import glaze.signals.Signal2;

class View {

    public var entities:Array<Entity> = [];

    public var registeredComponents:Array<Class<IComponent>> = null;

    public var entityAdded:Signal2<Entity,IComponent> = new Signal2<Entity,IComponent>();
    public var entityRemoved:Signal2<Entity,IComponent> = new Signal2<Entity,IComponent>();

    public function new(components:Array<Class<IComponent>>) {
        registeredComponents = components;
    }

    public function addEntity(entity:Entity,component:IComponent) {
        #if !macro
        js.Lib.debug();
        #end
        entities.push(entity);
        entityAdded.dispatch(entity,component);
    }

    public function removeEntity(entity:Entity,component:IComponent) {
        if (entities.remove(entity))
            entityRemoved.dispatch(entity,component);
    }

}