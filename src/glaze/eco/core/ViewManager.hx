package glaze.eco.core;

import glaze.eco.core.Engine;
import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;
import glaze.eco.core.System;
import glaze.eco.core.View;

class ViewManager {
    
    //All the current existing views
    public var views:Array<View> = [];

    //Mapping from component NAME to views that have an interest
    //Used for faster lookup for adding/removing components to views
    public var componentViewMap:Map<String,Array<View>> = new Map<String,Array<View>>();

    var engine:Engine;

    public function new(engine:Engine) {
        this.engine = engine;
        engine.componentAddedToEntity.add(matchViews);
        engine.componentRemovedFromEntity.add(unmatchViews);
        engine.systemAdded.add(injectView);
    }

    /*
     *  Gets a view based on a Component signature
     */
    public function getView(components:Array<Class<IComponent>>,forceUpdate:Bool=false):View {

        //Search for existing view, if found return it
        for (view in views) {
            if (isComponentArrayEqual(view.registeredComponents,components))
                return view;
        }

        //Create a new view and add it to the list
        var view = new View(components);
        views.push(view);

        //Save thev view in the map for faster lookup when adding/removing components later
        for (component in components) {
            var name = Reflect.field(component, "NAME");
            if (!componentViewMap.exists(name))
                componentViewMap.set(name,new Array<View>());
            componentViewMap.get(name).push(view);
        }

        if (forceUpdate==true)
            matchAllEntitiesToView(engine.entities,view);

        return view;
    }

    public function releaseView(view:View) {

    }

    public function isComponentArrayEqual(a:Array<Class<IComponent>>,b:Array<Class<IComponent>>) {
        if (a.length!=b.length) return false;
        for (component in a) {
            if (b.indexOf(component)<0)
                return false;
        }
        return true;
    }

    public function entityMatchesView(entity:Entity,viewSignature:Array<Class<IComponent>>) {
        var count = viewSignature.length;
        for (componentClass in viewSignature) {
            if (entity.exists(Reflect.field(componentClass,"NAME"))) {
                if (--count==0)
                    return true;
            }
        }
        return false;
    }

    public function matchViews(entity:Entity,component:IComponent) {
        // #if !macro
        // js.Lib.debug();
        // #end
        //var name = Reflect.field( Type.getClass(component) , "NAME");
        var name = Entity.GET_NAME_FROM_COMPONENT(component);
        var views = componentViewMap.get(name);
        if (views!=null) {
            for (view in views) {
                if (entityMatchesView(entity,view.registeredComponents))
                    view.addEntity(entity);
            }
        }
    }

    public function matchAllEntitiesToView(entities:Array<Entity>,view:View) {
        for (entity in entities) {
            if (entityMatchesView(entity,view.registeredComponents))
                view.addEntity(entity);
        }
    }

    public function unmatchViews(entity:Entity,component:IComponent) {
        #if !macro
        // js.Lib.debug();
        // trace(Type.getClass(component));
        #end
        var name = Entity.GET_NAME_FROM_COMPONENT(component);
        // var name = Reflect.field( Type.getClass(component) , "NAME");
        var views = componentViewMap.get(name);
        if (views!=null) {
            for (view in views) {
                // trace(Type.getClass(view));
                view.removeEntity(entity);
            }
        }
    }

    //Called by the signal in engine whenever a signal
    public function injectView(system:System) {
        var view = getView(system.registeredComponents);
        view.entityAdded.add(system.entityAdded);
        view.entityRemoved.add(system.entityRemoved);
        system.view = view;
        if (system.view.entities.length==0)
            matchAllEntitiesToView(engine.entities,view);
    }

}