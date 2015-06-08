package glaze.eco.core;

import glaze.eco.core.System;

class Phase
{
    public static inline var DEFAULT_TIME_DELTA:Float = 1000/60;

    public var systems:Array<System> = new Array<System>();

    public var engine:Engine;
    public var enabled:Bool;

    var msPerUpdate:Float;
    var accumulator:Float;

    var updateCount:Int;

    public function new(engine:Engine,msPerUpdate:Float=0,maxAccumulatedDelta:Float=0) {
        this.engine = engine;
        this.msPerUpdate = msPerUpdate;
        enabled = true;
        accumulator = 0;
        updateCount = 0;
    }

    public function update(timestamp:Float,delta:Float) {

        if (!enabled)
            return;

        if (msPerUpdate!=0) {
            // accumulator+=delta;
            // if (accumulator<msPerUpdate)
            //     return;
            // accumulator-=msPerUpdate;           
            // delta = msPerUpdate; 
            accumulator+=delta;
            while (accumulator>msPerUpdate) {
                updateCount++;
                accumulator-=msPerUpdate;
                for (system in systems)
                    system.update(timestamp,msPerUpdate);     
            }

        } else {
            for (system in systems)
                system.update(timestamp,delta);
        }

        
    }

    public function addSystem(system:System) {
        systems.push(system);
        engine.systemAdded.dispatch(system);
    }

    public function addSystemAfter(system:System,after:System) {
        var i = systems.indexOf(after);
        if (i<0)
            return false;
        systems.insert(i+1,system);
        engine.systemAdded.dispatch(system);
        return true;
    }    

    public function addSystemBefore(system:System,before:System) {
        var i = systems.indexOf(before);
        if (i<0)
            return false;
        systems.insert(i,system);
        engine.systemAdded.dispatch(system);
        return true;
    }

}