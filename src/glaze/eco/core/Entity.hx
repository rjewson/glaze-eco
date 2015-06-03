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

    public var id:Int = 0;

    public var map:Dynamic<IComponent> = {};
    public var list:Array<IComponent> = [];

    public var engine(default, null) : Engine;

    public function new(engine:Engine,?components:Array<IComponent>) {
        this.engine = engine;
        if (components!=null) {
            addManyComponent(components);
        }
    }

    public function addComponent(component:IComponent) {
        var name:Dynamic = Reflect.field( Type.getClass(component) , "NAME");
        if (exists(name))
            remove(name,component);
        add(name,component);
        engine.componentAddedToEntity.dispatch(this,component);
    }

    public function addManyComponent(components:Array<IComponent>) {
        for (component in components)
            addComponent(component);
    }

    public function removeComponent(component:IComponent) {
        var name:Dynamic = Reflect.field( Type.getClass(component) , "NAME");
        if (exists(name)) {
            remove(name,component);
            engine.componentRemovedFromEntity.dispatch(this,component);
        }
    }

    // public function removeComponentByClass(componentClass:Class<IComponent>) {
    //     removeComponent();
    // }

    macro public function getComponent<A:IComponent>(self:Expr,componentClass:ExprOf<Class<A>>):ExprOf<A> {
        var name = macro $componentClass.NAME;
        //return macro cast untyped $self.map[$name];
        //return macro $self.get($name);
        return macro Std.instance($self.get($name), $componentClass);
    }

    macro public function getComponentStr(self:Expr,key:String):ExprOf<IComponent> {
        return macro untyped $self.map.$key;
    }

    public inline function get(key:String):IComponent {
        return untyped map[key];
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