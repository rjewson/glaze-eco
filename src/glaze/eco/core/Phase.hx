package glaze.eco.core;

import glaze.eco.core.System;

class Phase
{
    public static inline var DEFAULT_TIME_DELTA:Float = 1000/60;

    public var systems:Array<System> = new Array<System>();

    var engine:Engine;
    var enabled:Bool;
    var lastTimestamp:Float;

    public function new(engine : Engine) {
        this.engine = engine;
        enabled = true;
        lastTimestamp = 0;
    }

    public function update(timestamp:Float) {
        if (!enabled)
            return;
        var delta = lastTimestamp == 0 ? DEFAULT_TIME_DELTA : timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        for (system in systems)
            system.update(timestamp,delta);
    }

    public function addSystem(system:System) {
        systems.push(system);
        system.onAdded(engine);
    }

    public function addSystemAfter(system:System,after:System) {
        var i = systems.indexOf(after);
        if (i<0)
            return false;
        systems.insert(i+1,system);
        system.onAdded(engine);
        return true;
    }    

    public function addSystemBefore(system:System,before:System) {
        var i = systems.indexOf(before);
        if (i<0)
            return false;
        systems.insert(i,system);
        system.onAdded(engine);
        return true;
    }

}