package glaze.eco.core;

import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;
import glaze.eco.core.Phase;
import glaze.eco.core.System;
import glaze.eco.core.ViewManager;
import glaze.signals.Signal1;
import glaze.signals.Signal2;
import haxe.ds.StringMap;

#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
using haxe.macro.ExprTools;
#end

class Engine 
{

    public var viewManager:ViewManager;

    public var entities:Array<Entity>;
    public var phases:Array<Phase>;
    public var systems:Array<System>;
    public var systemMap:StringMap<System>;

    public var componentAddedToEntity:Signal2<Entity,IComponent>;
    public var componentRemovedFromEntity:Signal2<Entity,IComponent>;

    public var systemAdded:Signal1<System>;

    var idCount:Int;

    public function new() {
        entities = new Array<Entity>(); 
        phases = new Array<Phase>();
        systems = new Array<System>();
        systemMap = new StringMap<System>();

        componentAddedToEntity = new Signal2<Entity,IComponent>();
        componentRemovedFromEntity = new Signal2<Entity,IComponent>();

        systemAdded = new Signal1<System>();

        systemAdded.add(onSystemAdded);

        viewManager = new ViewManager(this);

        idCount = 0;
    }

    public function createEntity(?components:Array<IComponent>,?name:String) {
        var entity = new Entity(this, components);
        
        if (name!=null)
            entity.name = name;
        entity.id = idCount++;
        entities.push(entity);
        return entity;
    }

    public function destroyEntity(entity:Entity) {
        entities.remove(entity);
    }

    public function createPhase(msPerUpdate:Float=0) {
        var phase = new Phase(this,msPerUpdate);
        phases.push(phase);
        return phase;
    }

    public function onSystemAdded(system:System) {
        systems.push(system);
        systemMap.set(Type.getClassName(Type.getClass(system)),system);
    }

    public function getSystem(systemClass:Class<System>) {
        return untyped systemMap.get(Type.getClassName(systemClass));
    }

    public function update(timestamp:Float,delta:Float) {
        for (phase in phases)
            phase.update(timestamp,delta);
    }

}