package test;

import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;
import glaze.eco.core.System;

class TestSystem extends System {

    public function new() {
        super();
    }

    override public function get_registeredComponents():Array<Class<IComponent>> {
        return [TestComponentA,TestComponentB];
    }

    override public function entityAdded(entity:Entity) {
        trace("Added to Test System",entity);
    }

    override public function update(timestamp:Float,delta:Float) {
        for (entity in entities) {
            var tcA = entity.getComponent(TestComponentA);
            var tcB = entity.getComponent(TestComponentB);
        }
    }

}