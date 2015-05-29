package glaze.eco.core;

import glaze.eco.core.Engine;
import glaze.eco.core.IComponent;

#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
using haxe.macro.ExprTools;
#end

class Entity 
{

    public var map:Dynamic<IComponent> = {};
    public var list:Array<IComponent> = [];

    public var engine(default, null) : Engine;

    public function new(engine:Engine,?components:Array<IComponent>) {
        this.engine = engine;
        if (components!=null) {
            addManyComponent(components);
        }
    }

    public function addComponent(component:IComponent,match:Bool=true) {
        var name:Dynamic = Reflect.field( Type.getClass(component) , "NAME");
        if (exists(name))
            remove(name,component);
        add(name,component);
        if (match)
            engine.matchSystems(this);
    }

    public function addManyComponent(components:Array<IComponent>) {
        for (component in components)
            addComponent(component,false);
        engine.matchSystems(this);
    }

    macro public function getComponent<A:IComponent>(self:Expr,componentClass:ExprOf<Class<A>>):ExprOf<A> {
        var name = macro $componentClass.NAME;
        return macro untyped $self.map[$name];
    }

    macro public function getComponentStr(self:Expr,key:String):ExprOf<IComponent> {
        return macro untyped $self.map.$key;
    }

    public inline function add(key:String, value:IComponent):Void {
        Reflect.setField(map, key, value);
        list.push(value);
    }

    public inline function exists(key:String):Bool {
        return Reflect.hasField(map, key);
    }

    public inline function remove(key:String,value:IComponent):Bool {
        list.remove(value);
        return Reflect.deleteField(map, key);
    }

}