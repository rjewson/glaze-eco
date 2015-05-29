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
	this.phases = [];
	this.entities = [];
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
	,matchSystems: function(entity) {
		var _g = 0;
		var _g1 = this.phases;
		while(_g < _g1.length) {
			var phase = _g1[_g];
			++_g;
			phase.matchSystems(entity);
		}
	}
	,__class__: glaze_eco_core_Engine
};
var glaze_eco_core_Entity = function(engine,components) {
	this.list = [];
	this.map = { };
	this.engine = engine;
	if(components != null) this.addManyComponent(components);
};
glaze_eco_core_Entity.__name__ = true;
glaze_eco_core_Entity.prototype = {
	addComponent: function(component,match) {
		if(match == null) match = true;
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
		if(match) this.engine.matchSystems(this);
	}
	,addManyComponent: function(components) {
		var _g = 0;
		while(_g < components.length) {
			var component = components[_g];
			++_g;
			this.addComponent(component,false);
		}
		this.engine.matchSystems(this);
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
	,matchSystems: function(entity) {
		var _g = 0;
		var _g1 = this.systems;
		while(_g < _g1.length) {
			var system = _g1[_g];
			++_g;
			system.match(entity);
		}
	}
	,__class__: glaze_eco_core_Phase
};
var glaze_eco_core_System = function() {
	this.entities = [];
};
glaze_eco_core_System.__name__ = true;
glaze_eco_core_System.prototype = {
	onAdded: function(engine) {
		this.engine = engine;
	}
	,onRemoved: function() {
	}
	,entityAdded: function(entity) {
	}
	,entityRemoved: function(entity) {
		HxOverrides.remove(this.entities,entity);
	}
	,update: function(timestamp,delta) {
	}
	,match: function(entity) {
		var count = this.get_registeredComponents().length;
		var _g = 0;
		var _g1 = entity.list;
		while(_g < _g1.length) {
			var component = _g1[_g];
			++_g;
			var tmp;
			var _this = this.get_registeredComponents();
			var x = component == null?null:js_Boot.getClass(component);
			tmp = HxOverrides.indexOf(_this,x,0);
			if(tmp >= 0) count--;
		}
		var index = HxOverrides.indexOf(this.entities,entity,0);
		if(count == 0) {
			if(index >= 0) return;
			this.entities.push(entity);
			this.entityAdded(entity);
		} else if(index > 0) this.entities.splice(index,1);
	}
	,get_registeredComponents: function() {
		return [];
	}
	,__class__: glaze_eco_core_System
};
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
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
	var entity = engine.create([new test_TestComponentA("richard"),new test_TestComponentB()]);
	haxe_Log.trace(entity,{ fileName : "Test.hx", lineNumber : 27, className : "test.Test", methodName : "new"});
	var tc2 = entity.map.TestComponentA;
	haxe_Log.trace(tc2,{ fileName : "Test.hx", lineNumber : 29, className : "test.Test", methodName : "new"});
	var tc3 = entity.map.TestComponentA;
	haxe_Log.trace(tc3,{ fileName : "Test.hx", lineNumber : 31, className : "test.Test", methodName : "new"});
	haxe_Log.trace(Object.prototype.hasOwnProperty.call(entity.map,"TestComponentA"),{ fileName : "Test.hx", lineNumber : 33, className : "test.Test", methodName : "new"});
	haxe_Log.trace(engine,{ fileName : "Test.hx", lineNumber : 35, className : "test.Test", methodName : "new"});
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
var test_TestComponentB = function() {
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
	,entityAdded: function(entity) {
		haxe_Log.trace("Added to Test System",{ fileName : "TestSystem.hx", lineNumber : 18, className : "test.TestSystem", methodName : "entityAdded", customParams : [entity]});
	}
	,update: function(timestamp,delta) {
		var _g = 0;
		var _g1 = this.entities;
		while(_g < _g1.length) {
			var entity = _g1[_g];
			++_g;
			var tcA = entity.map.TestComponentA;
			var tcB = entity.map.TestComponentB;
		}
	}
	,__class__: test_TestSystem
});
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
glaze_eco_core_Phase.DEFAULT_TIME_DELTA = 16.6666666666666679;
js_Boot.__toStr = {}.toString;
test_TestComponentA.NAME = "TestComponentA";
test_TestComponentB.NAME = "TestComponentB";
test_Test.main();
})(typeof console != "undefined" ? console : {log:function(){}});
