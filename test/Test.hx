package test;

import glaze.ds.DynamicObject;
import glaze.eco.core.Engine;
import glaze.eco.core.Entity;
import glaze.eco.core.System;
import test.Test;
import test.TestComponentA;
import test.TestComponentB;

class Test 
{

    public var da:DynamicObject<Dynamic>;

    public function new() {

        var engine = new Engine();
        var phase = engine.createPhase();
        var system = new TestSystem();
        phase.addSystem(system);

        var entity = engine.createEntity([new TestComponentA("richard"),new TestComponentB("jewson")]);

        // var tc = new TestComponentA();
        // entity.addComponent(tc);
        
        //trace(entity);
        var tc2 = entity.getComponent(TestComponentA);
        //trace(tc2);
        var tc3 = entity.getComponentStr("TestComponentA");
        //trace(tc3);

        trace(entity.exists("TestComponentA"));

        system.update(0,0);

        entity.removeComponent(entity.getComponent(TestComponentA));

        system.update(0,0);

        entity.removeComponent(entity.getComponent(TestComponentA));

        // var sys = engine.getSystem(TestSystem);
        var sys:test.TestSystem = engine.getSystem(TestSystem);
        
    }

    public static function main() {
        var test = new Test();
    }   

}