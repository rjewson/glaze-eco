package test;

import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;
import glaze.eco.core.System;
import glaze.eco.core.View;

class TestSystem2 extends System {

    public function new() {
        super([TestComponentC]);
    }

    override public function entityAdded(entity:Entity,component:IComponent) {
        trace("Added to Test System 2");
    }

    override public function entityRemoved(entity:Entity,component:IComponent) {
        trace("Removed from Test System 2");
    }

    override public function update(timestamp:Float,delta:Float) {
        for (entity in view.entities) {
            trace(entity);
        }
    }

}