package glaze.eco.core;

import glaze.eco.core.Entity;

class System {

    public var registeredComponents:Array<Class<IComponent>>;
    public var view:View;

    public var engine:Engine;
    public var enabled:Bool;

    public function new(componentSignature:Array<Class<IComponent>>) {
        this.registeredComponents = componentSignature;
        enabled = true;
    }

    public function onAdded(engine:Engine) {
        this.engine = engine;
    }

    public function onRemoved() {
    }

    public function entityAdded(entity:Entity) {
    }

    public function entityRemoved(entity:Entity) {
    }

    public function update(timestamp:Float,delta:Float) {
    }

}