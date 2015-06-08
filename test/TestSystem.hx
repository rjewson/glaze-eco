package test;

import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;
import glaze.eco.core.System;
import glaze.eco.core.View;

class TestSystem extends System {

    public var textField:String;

    public function new() {
        super([TestComponentA,TestComponentB]);
    }

    override public function entityAdded(entity:Entity) {
        trace("Added to Test System");
    }

    override public function entityRemoved(entity:Entity) {
        trace("Removed from Test System");
    }

    override public function update(timestamp:Float,delta:Float) {
        for (entity in view.entities) {
            var tcA = entity.getComponent(TestComponentA);
            var tcB = entity.getComponent(TestComponentB);
            trace("Name="+tcA.forename+" "+tcB.surname);
        }
    }

}