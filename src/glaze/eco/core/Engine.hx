package glaze.eco.core;

import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;
import glaze.eco.core.Phase;

class Engine 
{

    public var entities:Array<Entity> = new Array<Entity>();
    public var phases:Array<Phase> = new Array<Phase>();

    public function new() {
        
    }

    public function create(?components:Array<IComponent>) {
        var entity = new Entity(this, components);
        entities.push(entity);
        return entity;
    }

    public function createPhase() {
        var phase = new Phase(this);
        phases.push(phase);
        return phase;
    }

    public function matchSystems(entity:Entity) {
        for (phase in phases)
            phase.matchSystems(entity);
    }

}