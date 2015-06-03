package glaze.eco.core;

import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;
import glaze.eco.core.Phase;
import glaze.eco.core.ViewManager;
import glaze.signals.Signal1;
import glaze.signals.Signal2;

class Engine 
{

    public var viewManager:ViewManager;

    public var entities:Array<Entity>;
    public var phases:Array<Phase>;

    public var componentAddedToEntity:Signal2<Entity,IComponent>;
    public var componentRemovedFromEntity:Signal2<Entity,IComponent>;

    public var systemAdded:Signal1<System>;

    public function new() {
        entities = new Array<Entity>(); 
        phases = new Array<Phase>();

        componentAddedToEntity = new Signal2<Entity,IComponent>();
        componentRemovedFromEntity = new Signal2<Entity,IComponent>();

        systemAdded = new Signal1<System>();

        viewManager = new ViewManager(this);
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

    public function update(timestamp:Float,delta:Float) {
        for (phase in phases)
            phase.update(timestamp,delta);
    }

}