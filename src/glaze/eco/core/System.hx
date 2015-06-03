package glaze.eco.core;

import glaze.eco.core.Entity;

class System {

    public var registeredComponents:Array<Class<IComponent>>;
    public var view:View;

    var engine:Engine;

    public function new(componentSignature:Array<Class<IComponent>>) {
        this.registeredComponents = componentSignature;
    }

    public function onAdded(engine:Engine) {
        this.engine = engine;
    }

    public function onRemoved() {
    }

    public function entityAdded(entity:Entity,component:IComponent) {
    }

    public function entityRemoved(entity:Entity,component:IComponent) {
    }

    public function update(timestamp:Float,delta:Float) {
    }

}