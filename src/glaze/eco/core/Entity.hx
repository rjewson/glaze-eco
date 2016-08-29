package glaze.eco.core;

import glaze.eco.core.Engine;
import glaze.eco.core.IComponent;
import glaze.signals.Signal3;

#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
using haxe.macro.ExprTools;
#end

enum ENTITY_LIFECYCLE {
    INVALID;
    RUNNING;
    STOPPING;
    STOPPED;
}

class Entity 
{

    public static inline var DESTROY:String = "destroy";

    public var id:Int = 0;
    public var name:String;

    public var map:Dynamic<IComponent> = {};

    public var parent:Entity;
    public var children:Array<Entity> = [];

    public var engine:Engine;
    public var messages:Signal3<Entity,String,Dynamic> = new Signal3<Entity,String,Dynamic>();

    public var referenceCount:Int = 0;
 
    public function new(engine:Engine,?components:Array<IComponent>,name:String=null) {
        this.engine = engine;
        this.name = name;
        if (components!=null) {
            addManyComponent(components);
        }
    }

    public function addComponent(component:IComponent) {
        // var name:Dynamic = Reflect.field( Type.getClass(component) , "NAME");
        var name = GET_NAME_FROM_COMPONENT(component);
        if (map.name!=null) {
        // if (exists(name)) {
            throw "ADDING EXITING COMPONENT TYPE!";
        }
        Reflect.setField(map, name, component);
        engine.componentAddedToEntity.dispatch(this,component);
    }

    public function addManyComponent(components:Array<IComponent>) {
        for (component in components)
            addComponent(component);
    }

    public function removeComponent(component:IComponent) {
        var name = GET_NAME_FROM_COMPONENT(component);
        // if (map.name!=null) {
        if (exists(name)) {
            engine.componentRemovedFromEntity.dispatch(this,component);
            // Reflect.deleteField(map, name);
            Reflect.setField(map, name, null);
        } 
    }

    public function removeAllComponents() {
        trace("remove "+name);
        // #if !macro
        // js.Lib.debug();
        // #end
        for (n in Reflect.fields(map)) {
            engine.componentRemovedFromEntity.dispatch(this,Reflect.field(map,n));
            // Reflect.deleteField(map, name);
            Reflect.setField(map, name, null);
        }
    }

    public function addChildEntity(child:Entity) {
        child.parent = this;
        children.push(child);
    }

#if (display)
    macro public function getComponent<A:IComponent>(self:Expr,componentClass:ExprOf<Class<A>>):ExprOf<A> {
        return macro Std.instance($self.get($componentClass.NAME), $componentClass);
    }
#else
    macro public function getComponent<A:IComponent>(self:Expr,componentClass:ExprOf<Class<A>>):ExprOf<A> {
        return macro $self._internal_unsafeCast($self.get($componentClass.NAME), $componentClass);
    }
#end

    macro public function getComponentStr(self:Expr,key:String):ExprOf<IComponent> {
        return macro untyped $self.map.$key;
    }

    // static macro public function gv(self:Expr,key:String):ExprOf<IComponent> {
    //     return macro var x = untyped $self.map.$key;
    // }


    @:extern // Inline even in debug builds
    inline public function _internal_unsafeCast<A:IComponent>(component:IComponent,componentClass:Class<A>):A {
        return cast component;
    }

    public inline function get(key:String):IComponent {
        return untyped map[key];
    }

    macro public function removeComponent2<A:IComponent>(self:Expr,componentClass:ExprOf<Class<A>>):ExprOf<A> {
        return macro Reflect.deleteField($self.map,$componentClass.NAME);
    }

    public inline function exists(key:String):Bool {
        // return Reflect.hasField(map, key);
        return untyped map[key]!=null;
    }

    public inline static function GET_NAME_FROM_COMPONENT(component:IComponent):String {
        return Reflect.field( Type.getClass(component) , "NAME");
    }    

    public inline static function GET_ID_FROM_COMPONENT(component:IComponent):Int {
        return Reflect.field( Type.getClass(component) , "ID");
    }

    public function destroy() {
        for (child in children) {
            child.destroy();
        }
        messages.dispatch(this,Entity.DESTROY,null);
        messages.removeAll();
        removeAllComponents();
        engine.destroyEntity(this);
    }

    public function isActive():Bool {
        return engine!=null;
    }

}