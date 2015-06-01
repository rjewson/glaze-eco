(function (console) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var glaze_ds__$DynamicObject_DynamicObject_$Impl_$ = {};
glaze_ds__$DynamicObject_DynamicObject_$Impl_$.__name__ = true;
glaze_ds__$DynamicObject_DynamicObject_$Impl_$._new = function() {
	return { };
};
glaze_ds__$DynamicObject_DynamicObject_$Impl_$.set = function(this1,key,value) {
	this1[key] = value;
};
glaze_ds__$DynamicObject_DynamicObject_$Impl_$.get = function(this1,key) {
	return this1[key];
};
glaze_ds__$DynamicObject_DynamicObject_$Impl_$.exists = function(this1,key) {
	return Object.prototype.hasOwnProperty.call(this1,key);
};
glaze_ds__$DynamicObject_DynamicObject_$Impl_$.remove = function(this1,key) {
	return Reflect.deleteField(this1,key);
};
glaze_ds__$DynamicObject_DynamicObject_$Impl_$.keys = function(this1) {
	return Reflect.fields(this1);
};
var glaze_eco_core_Engine = function() {
	this.entities = [];
	this.phases = [];
	this.componentAddedToEntity = new glaze_signals_Signal2();
	this.componentRemovedFromEntity = new glaze_signals_Signal2();
	this.viewManager = new glaze_eco_core_ViewManager(this);
};
glaze_eco_core_Engine.__name__ = true;
glaze_eco_core_Engine.prototype = {
	create: function(components) {
		var entity = new glaze_eco_core_Entity(this,components);
		this.entities.push(entity);
		return entity;
	}
	,createPhase: function() {
		var phase = new glaze_eco_core_Phase(this);
		this.phases.push(phase);
		return phase;
	}
	,__class__: glaze_eco_core_Engine
};
var glaze_eco_core_Entity = function(engine,components) {
	this.list = [];
	this.map = { };
	this.id = 0;
	this.engine = engine;
	if(components != null) this.addManyComponent(components);
};
glaze_eco_core_Entity.__name__ = true;
glaze_eco_core_Entity.prototype = {
	addComponent: function(component) {
		var name = Reflect.field(component == null?null:js_Boot.getClass(component),"NAME");
		var tmp;
		var key = name;
		tmp = Object.prototype.hasOwnProperty.call(this.map,key);
		if(tmp) {
			var key1 = name;
			HxOverrides.remove(this.list,component);
			Reflect.deleteField(this.map,key1);
		}
		var key2 = name;
		this.map[key2] = component;
		this.list.push(component);
		this.engine.componentAddedToEntity.dispatch(this,component);
	}
	,addManyComponent: function(components) {
		var _g = 0;
		while(_g < components.length) {
			var component = components[_g];
			++_g;
			this.addComponent(component);
		}
	}
	,removeComponent: function(component) {
		var name = Reflect.field(component == null?null:js_Boot.getClass(component),"NAME");
		var tmp;
		var key = name;
		tmp = Object.prototype.hasOwnProperty.call(this.map,key);
		if(tmp) {
			var key1 = name;
			HxOverrides.remove(this.list,component);
			Reflect.deleteField(this.map,key1);
			this.engine.componentRemovedFromEntity.dispatch(this,component);
		}
	}
	,add: function(key,value) {
		this.map[key] = value;
		this.list.push(value);
	}
	,exists: function(key) {
		return Object.prototype.hasOwnProperty.call(this.map,key);
	}
	,remove: function(key,value) {
		HxOverrides.remove(this.list,value);
		return Reflect.deleteField(this.map,key);
	}
	,__class__: glaze_eco_core_Entity
};
var glaze_eco_core_IComponent = function() { };
glaze_eco_core_IComponent.__name__ = true;
var glaze_eco_core_Phase = function(engine) {
	this.systems = [];
	this.engine = engine;
	this.enabled = true;
	this.lastTimestamp = 0;
};
glaze_eco_core_Phase.__name__ = true;
glaze_eco_core_Phase.prototype = {
	update: function(timestamp) {
		if(!this.enabled) return;
		var delta = this.lastTimestamp == 0?16.6666666666666679:timestamp - this.lastTimestamp;
		this.lastTimestamp = timestamp;
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			system.update(timestamp,delta);
		}
	}
	,addSystem: function(system) {
		this.systems.push(system);
		system.onAdded(this.engine);
	}
	,addSystemAfter: function(system,after) {
		var i = HxOverrides.indexOf(this.systems,after,0);
		if(i < 0) return false;
		this.systems.splice(i + 1,0,system);
		system.onAdded(this.engine);
		return true;
	}
	,addSystemBefore: function(system,before) {
		var i = HxOverrides.indexOf(this.systems,before,0);
		if(i < 0) return false;
		this.systems.splice(i,0,system);
		system.onAdded(this.engine);
		return true;
	}
	,__class__: glaze_eco_core_Phase
};
var glaze_eco_core_System = function() {
};
glaze_eco_core_System.__name__ = true;
glaze_eco_core_System.prototype = {
	onAdded: function(engine) {
		this.engine = engine;
		this.initializeView();
	}
	,onRemoved: function() {
	}
	,initializeView: function() {
		this.view = this.engine.viewManager.getView(this.get_registeredComponents());
		this.view.entityAdded.add($bind(this,this.entityAdded));
		this.view.entityRemoved.add($bind(this,this.entityRemoved));
	}
	,entityAdded: function(entity,component) {
	}
	,entityRemoved: function(entity,component) {
	}
	,update: function(timestamp,delta) {
	}
	,get_registeredComponents: function() {
		return [];
	}
	,__class__: glaze_eco_core_System
};
var glaze_eco_core_View = function(components) {
	this.entityRemoved = new glaze_signals_Signal2();
	this.entityAdded = new glaze_signals_Signal2();
	this.registeredComponents = null;
	this.entities = [];
	this.registeredComponents = components;
};
glaze_eco_core_View.__name__ = true;
glaze_eco_core_View.prototype = {
	addEntity: function(entity,component) {
		debugger;
		this.entities.push(entity);
		this.entityAdded.dispatch(entity,component);
	}
	,removeEntity: function(entity,component) {
		if(HxOverrides.remove(this.entities,entity)) this.entityRemoved.dispatch(entity,component);
	}
	,__class__: glaze_eco_core_View
};
var glaze_eco_core_ViewManager = function(engine) {
	this.componentViewMap = new haxe_ds_StringMap();
	this.views = [];
	this.engine = engine;
	engine.componentAddedToEntity.add($bind(this,this.matchViews));
	engine.componentRemovedFromEntity.add($bind(this,this.unmatchViews));
};
glaze_eco_core_ViewManager.__name__ = true;
glaze_eco_core_ViewManager.prototype = {
	getView: function(components) {
		var _g = 0;
		var _g1 = this.views;
		while(_g < _g1.length) {
			var view1 = _g1[_g];
			++_g;
			if(this.isComponentArrayEqual(view1.registeredComponents,components)) return view1;
		}
		var view = new glaze_eco_core_View(components);
		this.views.push(view);
		var _g2 = 0;
		while(_g2 < components.length) {
			var component = components[_g2];
			++_g2;
			var name = Reflect.field(component,"NAME");
			var tmp;
			var _this = this.componentViewMap;
			if(__map_reserved[name] != null) tmp = _this.existsReserved(name); else tmp = _this.h.hasOwnProperty(name);
			if(!tmp) {
				var value = [];
				var _this1 = this.componentViewMap;
				if(__map_reserved[name] != null) _this1.setReserved(name,value); else _this1.h[name] = value;
			}
			var tmp1;
			var _this2 = this.componentViewMap;
			if(__map_reserved[name] != null) tmp1 = _this2.getReserved(name); else tmp1 = _this2.h[name];
			tmp1.push(view);
		}
		return view;
	}
	,isComponentArrayEqual: function(a,b) {
		if(a.length != b.length) return false;
		var _g = 0;
		while(_g < a.length) {
			var component = a[_g];
			++_g;
			if(HxOverrides.indexOf(b,component,0) < 0) return false;
		}
		return true;
	}
	,entityMatchesView: function(entity,viewSignature) {
		var count = viewSignature.length;
		var _g = 0;
		while(_g < viewSignature.length) {
			var componentClass = viewSignature[_g];
			++_g;
			var tmp;
			var key = Reflect.field(componentClass,"NAME");
			tmp = Object.prototype.hasOwnProperty.call(entity.map,key);
			if(tmp) {
				if(--count == 0) return true;
			}
		}
		return false;
	}
	,matchViews: function(entity,component) {
		var name = Reflect.field(component == null?null:js_Boot.getClass(component),"NAME");
		var tmp;
		var _this = this.componentViewMap;
		if(__map_reserved[name] != null) tmp = _this.getReserved(name); else tmp = _this.h[name];
		var views = tmp;
		if(views != null) {
			var _g = 0;
			while(_g < views.length) {
				var view = views[_g];
				++_g;
				if(this.entityMatchesView(entity,view.registeredComponents)) view.addEntity(entity,component);
			}
		}
	}
	,unmatchViews: function(entity,component) {
		var name = Reflect.field(component == null?null:js_Boot.getClass(component),"NAME");
		var tmp;
		var _this = this.componentViewMap;
		if(__map_reserved[name] != null) tmp = _this.getReserved(name); else tmp = _this.h[name];
		var views = tmp;
		if(views != null) {
			var _g = 0;
			while(_g < views.length) {
				var view = views[_g];
				++_g;
				view.removeEntity(entity,component);
			}
		}
	}
	,__class__: glaze_eco_core_ViewManager
};
var glaze_signals_ListenerNode = function() {
};
glaze_signals_ListenerNode.__name__ = true;
glaze_signals_ListenerNode.prototype = {
	__class__: glaze_signals_ListenerNode
};
var glaze_signals_ListenerNodePool = function() {
};
glaze_signals_ListenerNodePool.__name__ = true;
glaze_signals_ListenerNodePool.prototype = {
	get: function() {
		if(this.tail != null) {
			var node = this.tail;
			this.tail = this.tail.previous;
			node.previous = null;
			return node;
		} else return new glaze_signals_ListenerNode();
	}
	,dispose: function(node) {
		node.listener = null;
		node.once = false;
		node.next = null;
		node.previous = this.tail;
		this.tail = node;
	}
	,cache: function(node) {
		node.listener = null;
		node.previous = this.cacheTail;
		this.cacheTail = node;
	}
	,releaseCache: function() {
		while(this.cacheTail != null) {
			var node = this.cacheTail;
			this.cacheTail = node.previous;
			node.next = null;
			node.previous = this.tail;
			this.tail = node;
		}
	}
	,__class__: glaze_signals_ListenerNodePool
};
var glaze_signals_SignalBase = function() {
	this.listenerNodePool = new glaze_signals_ListenerNodePool();
	this.numListeners = 0;
};
glaze_signals_SignalBase.__name__ = true;
glaze_signals_SignalBase.prototype = {
	startDispatch: function() {
		this.dispatching = true;
	}
	,endDispatch: function() {
		this.dispatching = false;
		if(this.toAddHead != null) {
			if(this.head == null) {
				this.head = this.toAddHead;
				this.tail = this.toAddTail;
			} else {
				this.tail.next = this.toAddHead;
				this.toAddHead.previous = this.tail;
				this.tail = this.toAddTail;
			}
			this.toAddHead = null;
			this.toAddTail = null;
		}
		this.listenerNodePool.releaseCache();
	}
	,getNode: function(listener) {
		var node = this.head;
		while(node != null) {
			if(Reflect.compareMethods(node.listener,listener)) break;
			node = node.next;
		}
		if(node == null) {
			node = this.toAddHead;
			while(node != null) {
				if(Reflect.compareMethods(node.listener,listener)) break;
				node = node.next;
			}
		}
		return node;
	}
	,nodeExists: function(listener) {
		var tmp;
		var node = this.head;
		while(node != null) {
			if(Reflect.compareMethods(node.listener,listener)) break;
			node = node.next;
		}
		if(node == null) {
			node = this.toAddHead;
			while(node != null) {
				if(Reflect.compareMethods(node.listener,listener)) break;
				node = node.next;
			}
		}
		tmp = node;
		return tmp != null;
	}
	,add: function(listener) {
		var tmp;
		var node1 = this.head;
		while(node1 != null) {
			if(Reflect.compareMethods(node1.listener,listener)) break;
			node1 = node1.next;
		}
		if(node1 == null) {
			node1 = this.toAddHead;
			while(node1 != null) {
				if(Reflect.compareMethods(node1.listener,listener)) break;
				node1 = node1.next;
			}
		}
		tmp = node1;
		if(tmp != null) return;
		var node = this.listenerNodePool.get();
		node.listener = listener;
		this.addNode(node);
	}
	,addOnce: function(listener) {
		var tmp;
		var node1 = this.head;
		while(node1 != null) {
			if(Reflect.compareMethods(node1.listener,listener)) break;
			node1 = node1.next;
		}
		if(node1 == null) {
			node1 = this.toAddHead;
			while(node1 != null) {
				if(Reflect.compareMethods(node1.listener,listener)) break;
				node1 = node1.next;
			}
		}
		tmp = node1;
		if(tmp != null) return;
		var node = this.listenerNodePool.get();
		node.listener = listener;
		node.once = true;
		this.addNode(node);
	}
	,addNode: function(node) {
		if(this.dispatching) {
			if(this.toAddHead == null) this.toAddHead = this.toAddTail = node; else {
				this.toAddTail.next = node;
				node.previous = this.toAddTail;
				this.toAddTail = node;
			}
		} else if(this.head == null) this.head = this.tail = node; else {
			this.tail.next = node;
			node.previous = this.tail;
			this.tail = node;
		}
		this.numListeners++;
	}
	,remove: function(listener) {
		var tmp;
		var node1 = this.head;
		while(node1 != null) {
			if(Reflect.compareMethods(node1.listener,listener)) break;
			node1 = node1.next;
		}
		if(node1 == null) {
			node1 = this.toAddHead;
			while(node1 != null) {
				if(Reflect.compareMethods(node1.listener,listener)) break;
				node1 = node1.next;
			}
		}
		tmp = node1;
		var node = tmp;
		if(node != null) {
			if(this.head == node) this.head = this.head.next;
			if(this.tail == node) this.tail = this.tail.previous;
			if(this.toAddHead == node) this.toAddHead = this.toAddHead.next;
			if(this.toAddTail == node) this.toAddTail = this.toAddTail.previous;
			if(node.previous != null) node.previous.next = node.next;
			if(node.next != null) node.next.previous = node.previous;
			if(this.dispatching) this.listenerNodePool.cache(node); else this.listenerNodePool.dispose(node);
			this.numListeners--;
		}
	}
	,removeAll: function() {
		while(this.head != null) {
			var node = this.head;
			this.head = this.head.next;
			this.listenerNodePool.dispose(node);
		}
		this.tail = null;
		this.toAddHead = null;
		this.toAddTail = null;
		this.numListeners = 0;
	}
	,__class__: glaze_signals_SignalBase
};
var glaze_signals_Signal2 = function() {
	glaze_signals_SignalBase.call(this);
};
glaze_signals_Signal2.__name__ = true;
glaze_signals_Signal2.__super__ = glaze_signals_SignalBase;
glaze_signals_Signal2.prototype = $extend(glaze_signals_SignalBase.prototype,{
	dispatch: function(object1,object2) {
		this.startDispatch();
		var node = this.head;
		while(node != null) {
			node.listener(object1,object2);
			if(node.once) this.remove(node.listener);
			node = node.next;
		}
		this.endDispatch();
	}
	,__class__: glaze_signals_Signal2
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		return this.rh == null?null:this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,__class__: haxe_ds_StringMap
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__resolveNativeClass = function(name) {
	return (Function("return typeof " + name + " != \"undefined\" ? " + name + " : null"))();
};
var test_Test = function() {
	var engine = new glaze_eco_core_Engine();
	var phase = engine.createPhase();
	var system = new test_TestSystem();
	phase.addSystem(system);
	var entity = engine.create([new test_TestComponentA("richard"),new test_TestComponentB("jewson")]);
	var tc2 = entity.map.TestComponentA;
	var tc3 = entity.map.TestComponentA;
	console.log(Object.prototype.hasOwnProperty.call(entity.map,"TestComponentA"));
	system.update(0,0);
	entity.removeComponent(entity.map.TestComponentA);
	system.update(0,0);
	entity.removeComponent(entity.map.TestComponentA);
};
test_Test.__name__ = true;
test_Test.main = function() {
	new test_Test();
};
test_Test.prototype = {
	__class__: test_Test
};
var test_TestComponentA = function(forename) {
	this.forename = forename;
};
test_TestComponentA.__name__ = true;
test_TestComponentA.__interfaces__ = [glaze_eco_core_IComponent];
test_TestComponentA.prototype = {
	__class__: test_TestComponentA
};
var test_TestComponentB = function(surname) {
	this.surname = surname;
};
test_TestComponentB.__name__ = true;
test_TestComponentB.__interfaces__ = [glaze_eco_core_IComponent];
test_TestComponentB.prototype = {
	__class__: test_TestComponentB
};
var test_TestSystem = function() {
	glaze_eco_core_System.call(this);
};
test_TestSystem.__name__ = true;
test_TestSystem.__super__ = glaze_eco_core_System;
test_TestSystem.prototype = $extend(glaze_eco_core_System.prototype,{
	get_registeredComponents: function() {
		return [test_TestComponentA,test_TestComponentB];
	}
	,entityAdded: function(entity,component) {
		console.log("Added to Test System");
	}
	,entityRemoved: function(entity,component) {
		console.log("Removed from Test System");
	}
	,update: function(timestamp,delta) {
		debugger;
		var _g = 0;
		var _g1 = this.view.entities;
		while(_g < _g1.length) {
			var entity = _g1[_g];
			++_g;
			var tcA = entity.map.TestComponentA;
			var tcB = entity.map.TestComponentB;
			console.log("Name=" + tcA.forename + " " + tcB.surname);
		}
	}
	,__class__: test_TestSystem
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var __map_reserved = {}
glaze_eco_core_Phase.DEFAULT_TIME_DELTA = 16.6666666666666679;
js_Boot.__toStr = {}.toString;
test_TestComponentA.NAME = "TestComponentA";
test_TestComponentB.NAME = "TestComponentB";
test_Test.main();
})(typeof console != "undefined" ? console : {log:function(){}});
