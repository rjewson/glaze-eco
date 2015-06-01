package glaze.eco.core;

import glaze.eco.core.Engine;
import glaze.eco.core.Entity;
import glaze.eco.core.IComponent;

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
    }

    //Gets (either creates or from the views array) a view based on a Component signature
    public function getView(components:Array<Class<IComponent>>):View {
        for (view in views) {
            if (isComponentArrayEqual(view.registeredComponents,components))
                return view;
        }
        
        // #if !macro
        // js.Lib.debug();
        // #end

        var view = new glaze.eco.core.View(components);
        views.push(view);

        for (component in components) {
            var name = Reflect.field(component, "NAME");
            if (!componentViewMap.exists(name))
                componentViewMap.set(name,new Array<View>());
            componentViewMap.get(name).push(view);
        }

        return view;
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
        var name = Reflect.field( Type.getClass(component) , "NAME");
        var views = componentViewMap.get(name);
        if (views!=null) {
            for (view in views) {
                if (entityMatchesView(entity,view.registeredComponents))
                    view.addEntity(entity,component);
            }
        }
    }

    public function unmatchViews(entity:Entity,component:IComponent) {
        var name = Reflect.field( Type.getClass(component) , "NAME");
        var views = componentViewMap.get(name);
        if (views!=null) {
            for (view in views) {
                view.removeEntity(entity,component);
            }
        }
    }

}