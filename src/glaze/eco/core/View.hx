package glaze.eco.core;

import glaze.eco.core.Entity;
import glaze.eco.core.System;
import glaze.signals.Signal1;

class View {

    public var entities:Array<Entity> = [];

    public var registeredComponents:Array<Class<IComponent>> = null;

    public var entityAdded:Signal1<Entity> = new Signal1<Entity>();
    public var entityRemoved:Signal1<Entity> = new Signal1<Entity>();

    public function new(components:Array<Class<IComponent>>) {
        registeredComponents = components;
    }

    public function addEntity(entity:Entity) {
        entities.push(entity);
        entity.referenceCount++;
        entityAdded.dispatch(entity);
    }

    public function removeEntity(entity:Entity) {
        if (entities.remove(entity)) {
            entity.referenceCount--;
            entityRemoved.dispatch(entity);
        }
    }

}