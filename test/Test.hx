package test;

import glaze.ds.DynamicObject;
import glaze.eco.core.Engine;
import glaze.eco.core.Entity;
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

        var entity = engine.create([new TestComponentA("richard"),new TestComponentB()]);

        // var tc = new TestComponentA();
        // entity.addComponent(tc);
        
        trace(entity);
        var tc2 = entity.getComponent(TestComponentA);
        trace(tc2);
        var tc3 = entity.getComponentStr("TestComponentA");
        trace(tc3);

        trace(entity.exists("TestComponentA"));

        trace(engine);
    }

    public static function main() {
        var test = new Test();
    }   

}