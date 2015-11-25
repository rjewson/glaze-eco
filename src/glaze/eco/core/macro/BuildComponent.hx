package glaze.eco.core.macro;

import haxe.macro.Context;
import haxe.macro.Expr;

class BuildComponent {

    macro static public function build():Array<Field> {
        var fields = Context.getBuildFields();
        injetName(fields);
        injectConstructor(fields);
        return fields;
    }

    static var NEXT_ID:Int = 0;

    static function injetName(fields : Array<Field>) {
        var pos = Context.currentPos();
        var cl = Context.getLocalClass().get();
        var name = Context.makeExpr(cl.name, pos);

        var componentNameField = {
            name: 'NAME',
            doc: null,
            meta: [],
            access: [AStatic, APublic, AInline],
            kind: FVar(macro : String, macro $name),
            pos: pos//Context.currentPos()
        };

        fields.push(componentNameField);

        var id = Context.makeExpr(NEXT_ID++, pos);

        var componentIDField = {
            name: 'ID',
            doc: null,
            meta: [],
            access: [AStatic, APublic, AInline],
            kind: FVar(macro : Int, macro $id),
            pos: pos//Context.currentPos()
        };

        fields.push(componentIDField);

    }

    static function injectConstructor(fields : Array<Field>) {
        if(hasField(fields, "new")) 
            return;
        var args = getVarAsFunctionArgs(fields),
            init = args
              .map(function(arg) return arg.name)
              .map(function(name) return macro this.$name = $i{name});
        fields.push(createFunctionField("new", args, macro $b{init}));
    }

    public static function getVarAsFunctionArgs(fields : Array<Field>) : Array<FunctionArg> {
        return fields
          .map(function(field) return switch field.kind {
            case FVar(t, _) if(!isStatic(field)):
              { name : field.name, type : t, opt : null, value : null }
            case _:
              null;
          })
          .filter(function(field) return field != null);
    }

    public static function createVarField(name : String, type : ComplexType) : Field {
        return {
            name: name,
            kind: FVar(type, null),
            pos: Context.currentPos()
        };
    }

    public static function createFunctionField(name : String, ?args : Array<FunctionArg>, ?ret : ComplexType, ?expr : Expr) : Field {
        return {
          name: name,
          access: [APublic],
          kind: FFun({
            ret  : null != ret ? ret : macro : Void,
            expr : null != expr ? expr : macro {},
            args : null != args ? args : []
          }),
          pos: Context.currentPos()
        };
    }

    public static function isStatic(field : Field) {
        for(access in field.access) switch access {
            case AStatic: return true;
            case _:
        }
        return false;
    }

    public static function hasField(fields : Array<Field>, name : String)
        return null != findField(fields, name);

    public static function findField(fields : Array<Field>, name : String) {
        for(field in fields)
            if(field.name == name)
                return field;
        return null;
    }

}