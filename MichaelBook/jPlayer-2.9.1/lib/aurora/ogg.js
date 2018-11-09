(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a)return a(o, !0);
                if (i)return i(o, !0);
                throw new Error("Cannot find module '" + o + "'")
            }
            var f = n[o] = {exports: {}};
            t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, f, f.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
        var Module;
        if (!Module)Module = (typeof Module !== "undefined" ? Module : null) || {};
        var moduleOverrides = {};
        for (var key in Module) {
            if (Module.hasOwnProperty(key)) {
                moduleOverrides[key] = Module[key]
            }
        }
        var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function";
        var ENVIRONMENT_IS_WEB = typeof window === "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (ENVIRONMENT_IS_NODE) {
            if (!Module["print"])Module["print"] = function print(x) {
                process["stdout"].write(x + "\n")
            };
            if (!Module["printErr"])Module["printErr"] = function printErr(x) {
                process["stderr"].write(x + "\n")
            };
            var nodeFS = require("fs");
            var nodePath = require("path");
            Module["read"] = function read(filename, binary) {
                filename = nodePath["normalize"](filename);
                var ret = nodeFS["readFileSync"](filename);
                if (!ret && filename != nodePath["resolve"](filename)) {
                    filename = path.join(__dirname, "..", "src", filename);
                    ret = nodeFS["readFileSync"](filename)
                }
                if (ret && !binary)ret = ret.toString();
                return ret
            };
            Module["readBinary"] = function readBinary(filename) {
                return Module["read"](filename, true)
            };
            Module["load"] = function load(f) {
                globalEval(read(f))
            };
            Module["thisProgram"] = process["argv"][1];
            Module["arguments"] = process["argv"].slice(2);
            module["exports"] = Module
        } else if (ENVIRONMENT_IS_SHELL) {
            if (!Module["print"])Module["print"] = print;
            if (typeof printErr != "undefined")Module["printErr"] = printErr;
            if (typeof read != "undefined") {
                Module["read"] = read
            } else {
                Module["read"] = function read() {
                    throw"no read() available (jsc?)"
                }
            }
            Module["readBinary"] = function readBinary(f) {
                return read(f, "binary")
            };
            if (typeof scriptArgs != "undefined") {
                Module["arguments"] = scriptArgs
            } else if (typeof arguments != "undefined") {
                Module["arguments"] = arguments
            }
            this["Module"] = Module
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            Module["read"] = function read(url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText
            };
            if (typeof arguments != "undefined") {
                Module["arguments"] = arguments
            }
            if (typeof console !== "undefined") {
                if (!Module["print"])Module["print"] = function print(x) {
                    console.log(x)
                };
                if (!Module["printErr"])Module["printErr"] = function printErr(x) {
                    console.log(x)
                }
            } else {
                var TRY_USE_DUMP = false;
                if (!Module["print"])Module["print"] = TRY_USE_DUMP && typeof dump !== "undefined" ? (function (x) {
                    dump(x)
                }) : (function (x) {
                })
            }
            if (ENVIRONMENT_IS_WEB) {
                window["Module"] = Module
            } else {
                Module["load"] = importScripts
            }
        } else {
            throw"Unknown runtime environment. Where are we?"
        }
        function globalEval(x) {
            eval.call(null, x)
        }

        if (!Module["load"] == "undefined" && Module["read"]) {
            Module["load"] = function load(f) {
                globalEval(Module["read"](f))
            }
        }
        if (!Module["print"]) {
            Module["print"] = (function () {
            })
        }
        if (!Module["printErr"]) {
            Module["printErr"] = Module["print"]
        }
        if (!Module["arguments"]) {
            Module["arguments"] = []
        }
        Module.print = Module["print"];
        Module.printErr = Module["printErr"];
        Module["preRun"] = [];
        Module["postRun"] = [];
        for (var key in moduleOverrides) {
            if (moduleOverrides.hasOwnProperty(key)) {
                Module[key] = moduleOverrides[key]
            }
        }
        var Runtime = {
            setTempRet0: (function (value) {
                tempRet0 = value
            }),
            getTempRet0: (function () {
                return tempRet0
            }),
            stackSave: (function () {
                return STACKTOP
            }),
            stackRestore: (function (stackTop) {
                STACKTOP = stackTop
            }),
            forceAlign: (function (target, quantum) {
                quantum = quantum || 4;
                if (quantum == 1)return target;
                if (isNumber(target) && isNumber(quantum)) {
                    return Math.ceil(target / quantum) * quantum
                } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
                    return "(((" + target + ")+" + (quantum - 1) + ")&" + -quantum + ")"
                }
                return "Math.ceil((" + target + ")/" + quantum + ")*" + quantum
            }),
            isNumberType: (function (type) {
                return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES
            }),
            isPointerType: function isPointerType(type) {
                return type[type.length - 1] == "*"
            },
            isStructType: function isStructType(type) {
                if (isPointerType(type))return false;
                if (isArrayType(type))return true;
                if (/<?\{ ?[^}]* ?\}>?/.test(type))return true;
                return type[0] == "%"
            },
            INT_TYPES: {"i1": 0, "i8": 0, "i16": 0, "i32": 0, "i64": 0},
            FLOAT_TYPES: {"float": 0, "double": 0},
            or64: (function (x, y) {
                var l = x | 0 | (y | 0);
                var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
                return l + h
            }),
            and64: (function (x, y) {
                var l = (x | 0) & (y | 0);
                var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
                return l + h
            }),
            xor64: (function (x, y) {
                var l = (x | 0) ^ (y | 0);
                var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
                return l + h
            }),
            getNativeTypeSize: (function (type) {
                switch (type) {
                    case"i1":
                    case"i8":
                        return 1;
                    case"i16":
                        return 2;
                    case"i32":
                        return 4;
                    case"i64":
                        return 8;
                    case"float":
                        return 4;
                    case"double":
                        return 8;
                    default: {
                        if (type[type.length - 1] === "*") {
                            return Runtime.QUANTUM_SIZE
                        } else if (type[0] === "i") {
                            var bits = parseInt(type.substr(1));
                            assert(bits % 8 === 0);
                            return bits / 8
                        } else {
                            return 0
                        }
                    }
                }
            }),
            getNativeFieldSize: (function (type) {
                return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE)
            }),
            dedup: function dedup(items, ident) {
                var seen = {};
                if (ident) {
                    return items.filter((function (item) {
                        if (seen[item[ident]])return false;
                        seen[item[ident]] = true;
                        return true
                    }))
                } else {
                    return items.filter((function (item) {
                        if (seen[item])return false;
                        seen[item] = true;
                        return true
                    }))
                }
            },
            set: function set() {
                var args = typeof arguments[0] === "object" ? arguments[0] : arguments;
                var ret = {};
                for (var i = 0; i < args.length; i++) {
                    ret[args[i]] = 0
                }
                return ret
            },
            STACK_ALIGN: 8,
            getAlignSize: (function (type, size, vararg) {
                if (!vararg && (type == "i64" || type == "double"))return 8;
                if (!type)return Math.min(size, 8);
                return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE)
            }),
            calculateStructAlignment: function calculateStructAlignment(type) {
                type.flatSize = 0;
                type.alignSize = 0;
                var diffs = [];
                var prev = -1;
                var index = 0;
                type.flatIndexes = type.fields.map((function (field) {
                    index++;
                    var size, alignSize;
                    if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
                        size = Runtime.getNativeTypeSize(field);
                        alignSize = Runtime.getAlignSize(field, size)
                    } else if (Runtime.isStructType(field)) {
                        if (field[1] === "0") {
                            size = 0;
                            if (Types.types[field]) {
                                alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize)
                            } else {
                                alignSize = type.alignSize || QUANTUM_SIZE
                            }
                        } else {
                            size = Types.types[field].flatSize;
                            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize)
                        }
                    } else if (field[0] == "b") {
                        size = field.substr(1) | 0;
                        alignSize = 1
                    } else if (field[0] === "<") {
                        size = alignSize = Types.types[field].flatSize
                    } else if (field[0] === "i") {
                        size = alignSize = parseInt(field.substr(1)) / 8;
                        assert(size % 1 === 0, "cannot handle non-byte-size field " + field)
                    } else {
                        assert(false, "invalid type for calculateStructAlignment")
                    }
                    if (type.packed)alignSize = 1;
                    type.alignSize = Math.max(type.alignSize, alignSize);
                    var curr = Runtime.alignMemory(type.flatSize, alignSize);
                    type.flatSize = curr + size;
                    if (prev >= 0) {
                        diffs.push(curr - prev)
                    }
                    prev = curr;
                    return curr
                }));
                if (type.name_ && type.name_[0] === "[") {
                    type.flatSize = parseInt(type.name_.substr(1)) * type.flatSize / 2
                }
                type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
                if (diffs.length == 0) {
                    type.flatFactor = type.flatSize
                } else if (Runtime.dedup(diffs).length == 1) {
                    type.flatFactor = diffs[0]
                }
                type.needsFlattening = type.flatFactor != 1;
                return type.flatIndexes
            },
            generateStructInfo: (function (struct, typeName, offset) {
                var type, alignment;
                if (typeName) {
                    offset = offset || 0;
                    type = (typeof Types === "undefined" ? Runtime.typeInfo : Types.types)[typeName];
                    if (!type)return null;
                    if (type.fields.length != struct.length) {
                        printErr("Number of named fields must match the type for " + typeName + ": possibly duplicate struct names. Cannot return structInfo");
                        return null
                    }
                    alignment = type.flatIndexes
                } else {
                    var type = {
                        fields: struct.map((function (item) {
                            return item[0]
                        }))
                    };
                    alignment = Runtime.calculateStructAlignment(type)
                }
                var ret = {__size__: type.flatSize};
                if (typeName) {
                    struct.forEach((function (item, i) {
                        if (typeof item === "string") {
                            ret[item] = alignment[i] + offset
                        } else {
                            var key;
                            for (var k in item)key = k;
                            ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i])
                        }
                    }))
                } else {
                    struct.forEach((function (item, i) {
                        ret[item[1]] = alignment[i]
                    }))
                }
                return ret
            }),
            dynCall: (function (sig, ptr, args) {
                if (args && args.length) {
                    if (!args.splice)args = Array.prototype.slice.call(args);
                    args.splice(0, 0, ptr);
                    return Module["dynCall_" + sig].apply(null, args)
                } else {
                    return Module["dynCall_" + sig].call(null, ptr)
                }
            }),
            functionPointers: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            addFunction: (function (func) {
                for (var i = 0; i < Runtime.functionPointers.length; i++) {
                    if (!Runtime.functionPointers[i]) {
                        Runtime.functionPointers[i] = func;
                        return 2 * (1 + i)
                    }
                }
                throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
            }),
            removeFunction: (function (index) {
                Runtime.functionPointers[(index - 2) / 2] = null
            }),
            getAsmConst: (function (code, numArgs) {
                if (!Runtime.asmConstCache)Runtime.asmConstCache = {};
                var func = Runtime.asmConstCache[code];
                if (func)return func;
                var args = [];
                for (var i = 0; i < numArgs; i++) {
                    args.push(String.fromCharCode(36) + i)
                }
                var source = Pointer_stringify(code);
                if (source[0] === '"') {
                    if (source.indexOf('"', 1) === source.length - 1) {
                        source = source.substr(1, source.length - 2)
                    } else {
                        abort("invalid EM_ASM input |" + source + "|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)")
                    }
                }
                try {
                    var evalled = eval("(function(" + args.join(",") + "){ " + source + " })")
                } catch (e) {
                    Module.printErr("error in executing inline EM_ASM code: " + e + " on: \n\n" + source + "\n\nwith args |" + args + "| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)");
                    throw e
                }
                return Runtime.asmConstCache[code] = evalled
            }),
            warnOnce: (function (text) {
                if (!Runtime.warnOnce.shown)Runtime.warnOnce.shown = {};
                if (!Runtime.warnOnce.shown[text]) {
                    Runtime.warnOnce.shown[text] = 1;
                    Module.printErr(text)
                }
            }),
            funcWrappers: {},
            getFuncWrapper: (function (func, sig) {
                assert(sig);
                if (!Runtime.funcWrappers[func]) {
                    Runtime.funcWrappers[func] = function dynCall_wrapper() {
                        return Runtime.dynCall(sig, func, arguments)
                    }
                }
                return Runtime.funcWrappers[func]
            }),
            UTF8Processor: (function () {
                var buffer = [];
                var needed = 0;
                this.processCChar = (function (code) {
                    code = code & 255;
                    if (buffer.length == 0) {
                        if ((code & 128) == 0) {
                            return String.fromCharCode(code)
                        }
                        buffer.push(code);
                        if ((code & 224) == 192) {
                            needed = 1
                        } else if ((code & 240) == 224) {
                            needed = 2
                        } else {
                            needed = 3
                        }
                        return ""
                    }
                    if (needed) {
                        buffer.push(code);
                        needed--;
                        if (needed > 0)return ""
                    }
                    var c1 = buffer[0];
                    var c2 = buffer[1];
                    var c3 = buffer[2];
                    var c4 = buffer[3];
                    var ret;
                    if (buffer.length == 2) {
                        ret = String.fromCharCode((c1 & 31) << 6 | c2 & 63)
                    } else if (buffer.length == 3) {
                        ret = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
                    } else {
                        var codePoint = (c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63;
                        ret = String.fromCharCode(Math.floor((codePoint - 65536) / 1024) + 55296, (codePoint - 65536) % 1024 + 56320)
                    }
                    buffer.length = 0;
                    return ret
                });
                this.processJSString = function processJSString(string) {
                    string = unescape(encodeURIComponent(string));
                    var ret = [];
                    for (var i = 0; i < string.length; i++) {
                        ret.push(string.charCodeAt(i))
                    }
                    return ret
                }
            }),
            getCompilerSetting: (function (name) {
                throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
            }),
            stackAlloc: (function (size) {
                var ret = STACKTOP;
                STACKTOP = STACKTOP + size | 0;
                STACKTOP = STACKTOP + 7 & -8;
                return ret
            }),
            staticAlloc: (function (size) {
                var ret = STATICTOP;
                STATICTOP = STATICTOP + size | 0;
                STATICTOP = STATICTOP + 7 & -8;
                return ret
            }),
            dynamicAlloc: (function (size) {
                var ret = DYNAMICTOP;
                DYNAMICTOP = DYNAMICTOP + size | 0;
                DYNAMICTOP = DYNAMICTOP + 7 & -8;
                if (DYNAMICTOP >= TOTAL_MEMORY)enlargeMemory();
                return ret
            }),
            alignMemory: (function (size, quantum) {
                var ret = size = Math.ceil(size / (quantum ? quantum : 8)) * (quantum ? quantum : 8);
                return ret
            }),
            makeBigInt: (function (low, high, unsigned) {
                var ret = unsigned ? +(low >>> 0) + +(high >>> 0) * +4294967296 : +(low >>> 0) + +(high | 0) * +4294967296;
                return ret
            }),
            GLOBAL_BASE: 8,
            QUANTUM_SIZE: 4,
            __dummy__: 0
        };
        Module["Runtime"] = Runtime;
        function jsCall() {
            var args = Array.prototype.slice.call(arguments);
            return Runtime.functionPointers[args[0]].apply(null, args.slice(1))
        }

        var __THREW__ = 0;
        var ABORT = false;
        var EXITSTATUS = 0;
        var undef = 0;
        var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
        var tempI64, tempI64b;
        var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

        function assert(condition, text) {
            if (!condition) {
                abort("Assertion failed: " + text)
            }
        }

        var globalScope = this;

        function getCFunc(ident) {
            var func = Module["_" + ident];
            if (!func) {
                try {
                    func = eval("_" + ident)
                } catch (e) {
                }
            }
            assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
            return func
        }

        var cwrap, ccall;
        ((function () {
            var stack = 0;
            var JSfuncs = {
                "stackSave": (function () {
                    stack = Runtime.stackSave()
                }), "stackRestore": (function () {
                    Runtime.stackRestore(stack)
                }), "arrayToC": (function (arr) {
                    var ret = Runtime.stackAlloc(arr.length);
                    writeArrayToMemory(arr, ret);
                    return ret
                }), "stringToC": (function (str) {
                    var ret = 0;
                    if (str !== null && str !== undefined && str !== 0) {
                        ret = Runtime.stackAlloc(str.length + 1);
                        writeStringToMemory(str, ret)
                    }
                    return ret
                })
            };
            var toC = {"string": JSfuncs["stringToC"], "array": JSfuncs["arrayToC"]};
            ccall = function ccallFunc(ident, returnType, argTypes, args) {
                var func = getCFunc(ident);
                var cArgs = [];
                if (args) {
                    for (var i = 0; i < args.length; i++) {
                        var converter = toC[argTypes[i]];
                        if (converter) {
                            if (stack === 0)stack = Runtime.stackSave();
                            cArgs[i] = converter(args[i])
                        } else {
                            cArgs[i] = args[i]
                        }
                    }
                }
                var ret = func.apply(null, cArgs);
                if (returnType === "string")ret = Pointer_stringify(ret);
                if (stack !== 0)JSfuncs["stackRestore"]();
                return ret
            };
            var sourceRegex = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;

            function parseJSFunc(jsfunc) {
                var parsed = jsfunc.toString().match(sourceRegex).slice(1);
                return {arguments: parsed[0], body: parsed[1], returnValue: parsed[2]}
            }

            var JSsource = {};
            for (var fun in JSfuncs) {
                if (JSfuncs.hasOwnProperty(fun)) {
                    JSsource[fun] = parseJSFunc(JSfuncs[fun])
                }
            }
            cwrap = function cwrap(ident, returnType, argTypes) {
                var cfunc = getCFunc(ident);
                var numericArgs = argTypes.every((function (type) {
                    return type === "number"
                }));
                var numericRet = returnType !== "string";
                if (numericRet && numericArgs) {
                    return cfunc
                }
                var argNames = argTypes.map((function (x, i) {
                    return "$" + i
                }));
                var funcstr = "(function(" + argNames.join(",") + ") {";
                var nargs = argTypes.length;
                if (!numericArgs) {
                    funcstr += JSsource["stackSave"].body + ";";
                    for (var i = 0; i < nargs; i++) {
                        var arg = argNames[i], type = argTypes[i];
                        if (type === "number")continue;
                        var convertCode = JSsource[type + "ToC"];
                        funcstr += "var " + convertCode.arguments + " = " + arg + ";";
                        funcstr += convertCode.body + ";";
                        funcstr += arg + "=" + convertCode.returnValue + ";"
                    }
                }
                var cfuncname = parseJSFunc((function () {
                    return cfunc
                })).returnValue;
                funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
                if (!numericRet) {
                    var strgfy = parseJSFunc((function () {
                        return Pointer_stringify
                    })).returnValue;
                    funcstr += "ret = " + strgfy + "(ret);"
                }
                if (!numericArgs) {
                    funcstr += JSsource["stackRestore"].body + ";"
                }
                funcstr += "return ret})";
                return eval(funcstr)
            }
        }))();
        Module["cwrap"] = cwrap;
        Module["ccall"] = ccall;
        function setValue(ptr, value, type, noSafe) {
            type = type || "i8";
            if (type.charAt(type.length - 1) === "*")type = "i32";
            switch (type) {
                case"i1":
                    HEAP8[ptr >> 0] = value;
                    break;
                case"i8":
                    HEAP8[ptr >> 0] = value;
                    break;
                case"i16":
                    HEAP16[ptr >> 1] = value;
                    break;
                case"i32":
                    HEAP32[ptr >> 2] = value;
                    break;
                case"i64":
                    tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= +1 ? tempDouble > +0 ? (Math_min(+Math_floor(tempDouble / +4294967296), +4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / +4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
                    break;
                case"float":
                    HEAPF32[ptr >> 2] = value;
                    break;
                case"double":
                    HEAPF64[ptr >> 3] = value;
                    break;
                default:
                    abort("invalid type for setValue: " + type)
            }
        }

        Module["setValue"] = setValue;
        function getValue(ptr, type, noSafe) {
            type = type || "i8";
            if (type.charAt(type.length - 1) === "*")type = "i32";
            switch (type) {
                case"i1":
                    return HEAP8[ptr >> 0];
                case"i8":
                    return HEAP8[ptr >> 0];
                case"i16":
                    return HEAP16[ptr >> 1];
                case"i32":
                    return HEAP32[ptr >> 2];
                case"i64":
                    return HEAP32[ptr >> 2];
                case"float":
                    return HEAPF32[ptr >> 2];
                case"double":
                    return HEAPF64[ptr >> 3];
                default:
                    abort("invalid type for setValue: " + type)
            }
            return null
        }

        Module["getValue"] = getValue;
        var ALLOC_NORMAL = 0;
        var ALLOC_STACK = 1;
        var ALLOC_STATIC = 2;
        var ALLOC_DYNAMIC = 3;
        var ALLOC_NONE = 4;
        Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
        Module["ALLOC_STACK"] = ALLOC_STACK;
        Module["ALLOC_STATIC"] = ALLOC_STATIC;
        Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
        Module["ALLOC_NONE"] = ALLOC_NONE;
        function allocate(slab, types, allocator, ptr) {
            var zeroinit, size;
            if (typeof slab === "number") {
                zeroinit = true;
                size = slab
            } else {
                zeroinit = false;
                size = slab.length
            }
            var singleType = typeof types === "string" ? types : null;
            var ret;
            if (allocator == ALLOC_NONE) {
                ret = ptr
            } else {
                ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length))
            }
            if (zeroinit) {
                var ptr = ret, stop;
                assert((ret & 3) == 0);
                stop = ret + (size & ~3);
                for (; ptr < stop; ptr += 4) {
                    HEAP32[ptr >> 2] = 0
                }
                stop = ret + size;
                while (ptr < stop) {
                    HEAP8[ptr++ >> 0] = 0
                }
                return ret
            }
            if (singleType === "i8") {
                if (slab.subarray || slab.slice) {
                    HEAPU8.set(slab, ret)
                } else {
                    HEAPU8.set(new Uint8Array(slab), ret)
                }
                return ret
            }
            var i = 0, type, typeSize, previousType;
            while (i < size) {
                var curr = slab[i];
                if (typeof curr === "function") {
                    curr = Runtime.getFunctionIndex(curr)
                }
                type = singleType || types[i];
                if (type === 0) {
                    i++;
                    continue
                }
                if (type == "i64")type = "i32";
                setValue(ret + i, curr, type);
                if (previousType !== type) {
                    typeSize = Runtime.getNativeTypeSize(type);
                    previousType = type
                }
                i += typeSize
            }
            return ret
        }

        Module["allocate"] = allocate;
        function Pointer_stringify(ptr, length) {
            var hasUtf = false;
            var t;
            var i = 0;
            while (1) {
                t = HEAPU8[ptr + i >> 0];
                if (t >= 128)hasUtf = true; else if (t == 0 && !length)break;
                i++;
                if (length && i == length)break
            }
            if (!length)length = i;
            var ret = "";
            if (!hasUtf) {
                var MAX_CHUNK = 1024;
                var curr;
                while (length > 0) {
                    curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
                    ret = ret ? ret + curr : curr;
                    ptr += MAX_CHUNK;
                    length -= MAX_CHUNK
                }
                return ret
            }
            var utf8 = new Runtime.UTF8Processor;
            for (i = 0; i < length; i++) {
                t = HEAPU8[ptr + i >> 0];
                ret += utf8.processCChar(t)
            }
            return ret
        }

        Module["Pointer_stringify"] = Pointer_stringify;
        function UTF16ToString(ptr) {
            var i = 0;
            var str = "";
            while (1) {
                var codeUnit = HEAP16[ptr + i * 2 >> 1];
                if (codeUnit == 0)return str;
                ++i;
                str += String.fromCharCode(codeUnit)
            }
        }

        Module["UTF16ToString"] = UTF16ToString;
        function stringToUTF16(str, outPtr) {
            for (var i = 0; i < str.length; ++i) {
                var codeUnit = str.charCodeAt(i);
                HEAP16[outPtr + i * 2 >> 1] = codeUnit
            }
            HEAP16[outPtr + str.length * 2 >> 1] = 0
        }

        Module["stringToUTF16"] = stringToUTF16;
        function UTF32ToString(ptr) {
            var i = 0;
            var str = "";
            while (1) {
                var utf32 = HEAP32[ptr + i * 4 >> 2];
                if (utf32 == 0)return str;
                ++i;
                if (utf32 >= 65536) {
                    var ch = utf32 - 65536;
                    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                } else {
                    str += String.fromCharCode(utf32)
                }
            }
        }

        Module["UTF32ToString"] = UTF32ToString;
        function stringToUTF32(str, outPtr) {
            var iChar = 0;
            for (var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
                var codeUnit = str.charCodeAt(iCodeUnit);
                if (codeUnit >= 55296 && codeUnit <= 57343) {
                    var trailSurrogate = str.charCodeAt(++iCodeUnit);
                    codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
                }
                HEAP32[outPtr + iChar * 4 >> 2] = codeUnit;
                ++iChar
            }
            HEAP32[outPtr + iChar * 4 >> 2] = 0
        }

        Module["stringToUTF32"] = stringToUTF32;
        function demangle(func) {
            var i = 3;
            var basicTypes = {
                "v": "void",
                "b": "bool",
                "c": "char",
                "s": "short",
                "i": "int",
                "l": "long",
                "f": "float",
                "d": "double",
                "w": "wchar_t",
                "a": "signed char",
                "h": "unsigned char",
                "t": "unsigned short",
                "j": "unsigned int",
                "m": "unsigned long",
                "x": "long long",
                "y": "unsigned long long",
                "z": "..."
            };
            var subs = [];
            var first = true;

            function dump(x) {
                if (x)Module.print(x);
                Module.print(func);
                var pre = "";
                for (var a = 0; a < i; a++)pre += " ";
                Module.print(pre + "^")
            }

            function parseNested() {
                i++;
                if (func[i] === "K")i++;
                var parts = [];
                while (func[i] !== "E") {
                    if (func[i] === "S") {
                        i++;
                        var next = func.indexOf("_", i);
                        var num = func.substring(i, next) || 0;
                        parts.push(subs[num] || "?");
                        i = next + 1;
                        continue
                    }
                    if (func[i] === "C") {
                        parts.push(parts[parts.length - 1]);
                        i += 2;
                        continue
                    }
                    var size = parseInt(func.substr(i));
                    var pre = size.toString().length;
                    if (!size || !pre) {
                        i--;
                        break
                    }
                    var curr = func.substr(i + pre, size);
                    parts.push(curr);
                    subs.push(curr);
                    i += pre + size
                }
                i++;
                return parts
            }

            function parse(rawList, limit, allowVoid) {
                limit = limit || Infinity;
                var ret = "", list = [];

                function flushList() {
                    return "(" + list.join(", ") + ")"
                }

                var name;
                if (func[i] === "N") {
                    name = parseNested().join("::");
                    limit--;
                    if (limit === 0)return rawList ? [name] : name
                } else {
                    if (func[i] === "K" || first && func[i] === "L")i++;
                    var size = parseInt(func.substr(i));
                    if (size) {
                        var pre = size.toString().length;
                        name = func.substr(i + pre, size);
                        i += pre + size
                    }
                }
                first = false;
                if (func[i] === "I") {
                    i++;
                    var iList = parse(true);
                    var iRet = parse(true, 1, true);
                    ret += iRet[0] + " " + name + "<" + iList.join(", ") + ">"
                } else {
                    ret = name
                }
                paramLoop:while (i < func.length && limit-- > 0) {
                    var c = func[i++];
                    if (c in basicTypes) {
                        list.push(basicTypes[c])
                    } else {
                        switch (c) {
                            case"P":
                                list.push(parse(true, 1, true)[0] + "*");
                                break;
                            case"R":
                                list.push(parse(true, 1, true)[0] + "&");
                                break;
                            case"L": {
                                i++;
                                var end = func.indexOf("E", i);
                                var size = end - i;
                                list.push(func.substr(i, size));
                                i += size + 2;
                                break
                            }
                                ;
                            case"A": {
                                var size = parseInt(func.substr(i));
                                i += size.toString().length;
                                if (func[i] !== "_")throw"?";
                                i++;
                                list.push(parse(true, 1, true)[0] + " [" + size + "]");
                                break
                            }
                                ;
                            case"E":
                                break paramLoop;
                            default:
                                ret += "?" + c;
                                break paramLoop
                        }
                    }
                }
                if (!allowVoid && list.length === 1 && list[0] === "void")list = [];
                if (rawList) {
                    if (ret) {
                        list.push(ret + "?")
                    }
                    return list
                } else {
                    return ret + flushList()
                }
            }

            try {
                if (func == "Object._main" || func == "_main") {
                    return "main()"
                }
                if (typeof func === "number")func = Pointer_stringify(func);
                if (func[0] !== "_")return func;
                if (func[1] !== "_")return func;
                if (func[2] !== "Z")return func;
                switch (func[3]) {
                    case"n":
                        return "operator new()";
                    case"d":
                        return "operator delete()"
                }
                return parse()
            } catch (e) {
                return func
            }
        }

        function demangleAll(text) {
            return text.replace(/__Z[\w\d_]+/g, (function (x) {
                var y = demangle(x);
                return x === y ? x : x + " [" + y + "]"
            }))
        }

        function stackTrace() {
            var stack = (new Error).stack;
            return stack ? demangleAll(stack) : "(no stack trace available)"
        }

        var PAGE_SIZE = 4096;

        function alignMemoryPage(x) {
            return x + 4095 & -4096
        }

        var HEAP;
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false;
        var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0;
        var DYNAMIC_BASE = 0, DYNAMICTOP = 0;

        function enlargeMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.")
        }

        var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
        var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
        var FAST_MEMORY = Module["FAST_MEMORY"] || 2097152;
        var totalMemory = 4096;
        while (totalMemory < TOTAL_MEMORY || totalMemory < 2 * TOTAL_STACK) {
            if (totalMemory < 16 * 1024 * 1024) {
                totalMemory *= 2
            } else {
                totalMemory += 16 * 1024 * 1024
            }
        }
        if (totalMemory !== TOTAL_MEMORY) {
            Module.printErr("increasing TOTAL_MEMORY to " + totalMemory + " to be more reasonable");
            TOTAL_MEMORY = totalMemory
        }
        assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && !!(new Int32Array(1))["subarray"] && !!(new Int32Array(1))["set"], "JS engine does not provide full typed array support");
        var buffer = new ArrayBuffer(TOTAL_MEMORY);
        HEAP8 = new Int8Array(buffer);
        HEAP16 = new Int16Array(buffer);
        HEAP32 = new Int32Array(buffer);
        HEAPU8 = new Uint8Array(buffer);
        HEAPU16 = new Uint16Array(buffer);
        HEAPU32 = new Uint32Array(buffer);
        HEAPF32 = new Float32Array(buffer);
        HEAPF64 = new Float64Array(buffer);
        HEAP32[0] = 255;
        assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, "Typed arrays 2 must be run on a little-endian system");
        Module["HEAP"] = HEAP;
        Module["HEAP8"] = HEAP8;
        Module["HEAP16"] = HEAP16;
        Module["HEAP32"] = HEAP32;
        Module["HEAPU8"] = HEAPU8;
        Module["HEAPU16"] = HEAPU16;
        Module["HEAPU32"] = HEAPU32;
        Module["HEAPF32"] = HEAPF32;
        Module["HEAPF64"] = HEAPF64;
        function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
                var callback = callbacks.shift();
                if (typeof callback == "function") {
                    callback();
                    continue
                }
                var func = callback.func;
                if (typeof func === "number") {
                    if (callback.arg === undefined) {
                        Runtime.dynCall("v", func)
                    } else {
                        Runtime.dynCall("vi", func, [callback.arg])
                    }
                } else {
                    func(callback.arg === undefined ? null : callback.arg)
                }
            }
        }

        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;

        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function")Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPRERUN__)
        }

        function ensureInitRuntime() {
            if (runtimeInitialized)return;
            runtimeInitialized = true;
            callRuntimeCallbacks(__ATINIT__)
        }

        function preMain() {
            callRuntimeCallbacks(__ATMAIN__)
        }

        function exitRuntime() {
            callRuntimeCallbacks(__ATEXIT__);
            runtimeInitialized = false
        }

        function postRun() {
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function")Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__)
        }

        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb)
        }

        Module["addOnPreRun"] = Module.addOnPreRun = addOnPreRun;
        function addOnInit(cb) {
            __ATINIT__.unshift(cb)
        }

        Module["addOnInit"] = Module.addOnInit = addOnInit;
        function addOnPreMain(cb) {
            __ATMAIN__.unshift(cb)
        }

        Module["addOnPreMain"] = Module.addOnPreMain = addOnPreMain;
        function addOnExit(cb) {
            __ATEXIT__.unshift(cb)
        }

        Module["addOnExit"] = Module.addOnExit = addOnExit;
        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb)
        }

        Module["addOnPostRun"] = Module.addOnPostRun = addOnPostRun;
        function intArrayFromString(stringy, dontAddNull, length) {
            var ret = (new Runtime.UTF8Processor).processJSString(stringy);
            if (length) {
                ret.length = length
            }
            if (!dontAddNull) {
                ret.push(0)
            }
            return ret
        }

        Module["intArrayFromString"] = intArrayFromString;
        function intArrayToString(array) {
            var ret = [];
            for (var i = 0; i < array.length; i++) {
                var chr = array[i];
                if (chr > 255) {
                    chr &= 255
                }
                ret.push(String.fromCharCode(chr))
            }
            return ret.join("")
        }

        Module["intArrayToString"] = intArrayToString;
        function writeStringToMemory(string, buffer, dontAddNull) {
            var array = intArrayFromString(string, dontAddNull);
            var i = 0;
            while (i < array.length) {
                var chr = array[i];
                HEAP8[buffer + i >> 0] = chr;
                i = i + 1
            }
        }

        Module["writeStringToMemory"] = writeStringToMemory;
        function writeArrayToMemory(array, buffer) {
            for (var i = 0; i < array.length; i++) {
                HEAP8[buffer + i >> 0] = array[i]
            }
        }

        Module["writeArrayToMemory"] = writeArrayToMemory;
        function writeAsciiToMemory(str, buffer, dontAddNull) {
            for (var i = 0; i < str.length; i++) {
                HEAP8[buffer + i >> 0] = str.charCodeAt(i)
            }
            if (!dontAddNull)HEAP8[buffer + str.length >> 0] = 0
        }

        Module["writeAsciiToMemory"] = writeAsciiToMemory;
        function unSign(value, bits, ignore) {
            if (value >= 0) {
                return value
            }
            return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value
        }

        function reSign(value, bits, ignore) {
            if (value <= 0) {
                return value
            }
            var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
            if (value >= half && (bits <= 32 || value > half)) {
                value = -2 * half + value
            }
            return value
        }

        if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5)Math["imul"] = function imul(a, b) {
            var ah = a >>> 16;
            var al = a & 65535;
            var bh = b >>> 16;
            var bl = b & 65535;
            return al * bl + (ah * bl + al * bh << 16) | 0
        };
        Math.imul = Math["imul"];
        var Math_abs = Math.abs;
        var Math_cos = Math.cos;
        var Math_sin = Math.sin;
        var Math_tan = Math.tan;
        var Math_acos = Math.acos;
        var Math_asin = Math.asin;
        var Math_atan = Math.atan;
        var Math_atan2 = Math.atan2;
        var Math_exp = Math.exp;
        var Math_log = Math.log;
        var Math_sqrt = Math.sqrt;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_pow = Math.pow;
        var Math_imul = Math.imul;
        var Math_fround = Math.fround;
        var Math_min = Math.min;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;

        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
        }

        Module["addRunDependency"] = addRunDependency;
        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback()
                }
            }
        }

        Module["removeRunDependency"] = removeRunDependency;
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var memoryInitializer = null;
        STATIC_BASE = 8;
        STATICTOP = STATIC_BASE + Runtime.alignMemory(1739);
        __ATINIT__.push();
        allocate([0, 0, 0, 0, 183, 29, 193, 4, 110, 59, 130, 9, 217, 38, 67, 13, 220, 118, 4, 19, 107, 107, 197, 23, 178, 77, 134, 26, 5, 80, 71, 30, 184, 237, 8, 38, 15, 240, 201, 34, 214, 214, 138, 47, 97, 203, 75, 43, 100, 155, 12, 53, 211, 134, 205, 49, 10, 160, 142, 60, 189, 189, 79, 56, 112, 219, 17, 76, 199, 198, 208, 72, 30, 224, 147, 69, 169, 253, 82, 65, 172, 173, 21, 95, 27, 176, 212, 91, 194, 150, 151, 86, 117, 139, 86, 82, 200, 54, 25, 106, 127, 43, 216, 110, 166, 13, 155, 99, 17, 16, 90, 103, 20, 64, 29, 121, 163, 93, 220, 125, 122, 123, 159, 112, 205, 102, 94, 116, 224, 182, 35, 152, 87, 171, 226, 156, 142, 141, 161, 145, 57, 144, 96, 149, 60, 192, 39, 139, 139, 221, 230, 143, 82, 251, 165, 130, 229, 230, 100, 134, 88, 91, 43, 190, 239, 70, 234, 186, 54, 96, 169, 183, 129, 125, 104, 179, 132, 45, 47, 173, 51, 48, 238, 169, 234, 22, 173, 164, 93, 11, 108, 160, 144, 109, 50, 212, 39, 112, 243, 208, 254, 86, 176, 221, 73, 75, 113, 217, 76, 27, 54, 199, 251, 6, 247, 195, 34, 32, 180, 206, 149, 61, 117, 202, 40, 128, 58, 242, 159, 157, 251, 246, 70, 187, 184, 251, 241, 166, 121, 255, 244, 246, 62, 225, 67, 235, 255, 229, 154, 205, 188, 232, 45, 208, 125, 236, 119, 112, 134, 52, 192, 109, 71, 48, 25, 75, 4, 61, 174, 86, 197, 57, 171, 6, 130, 39, 28, 27, 67, 35, 197, 61, 0, 46, 114, 32, 193, 42, 207, 157, 142, 18, 120, 128, 79, 22, 161, 166, 12, 27, 22, 187, 205, 31, 19, 235, 138, 1, 164, 246, 75, 5, 125, 208, 8, 8, 202, 205, 201, 12, 7, 171, 151, 120, 176, 182, 86, 124, 105, 144, 21, 113, 222, 141, 212, 117, 219, 221, 147, 107, 108, 192, 82, 111, 181, 230, 17, 98, 2, 251, 208, 102, 191, 70, 159, 94, 8, 91, 94, 90, 209, 125, 29, 87, 102, 96, 220, 83, 99, 48, 155, 77, 212, 45, 90, 73, 13, 11, 25, 68, 186, 22, 216, 64, 151, 198, 165, 172, 32, 219, 100, 168, 249, 253, 39, 165, 78, 224, 230, 161, 75, 176, 161, 191, 252, 173, 96, 187, 37, 139, 35, 182, 146, 150, 226, 178, 47, 43, 173, 138, 152, 54, 108, 142, 65, 16, 47, 131, 246, 13, 238, 135, 243, 93, 169, 153, 68, 64, 104, 157, 157, 102, 43, 144, 42, 123, 234, 148, 231, 29, 180, 224, 80, 0, 117, 228, 137, 38, 54, 233, 62, 59, 247, 237, 59, 107, 176, 243, 140, 118, 113, 247, 85, 80, 50, 250, 226, 77, 243, 254, 95, 240, 188, 198, 232, 237, 125, 194, 49, 203, 62, 207, 134, 214, 255, 203, 131, 134, 184, 213, 52, 155, 121, 209, 237, 189, 58, 220, 90, 160, 251, 216, 238, 224, 12, 105, 89, 253, 205, 109, 128, 219, 142, 96, 55, 198, 79, 100, 50, 150, 8, 122, 133, 139, 201, 126, 92, 173, 138, 115, 235, 176, 75, 119, 86, 13, 4, 79, 225, 16, 197, 75, 56, 54, 134, 70, 143, 43, 71, 66, 138, 123, 0, 92, 61, 102, 193, 88, 228, 64, 130, 85, 83, 93, 67, 81, 158, 59, 29, 37, 41, 38, 220, 33, 240, 0, 159, 44, 71, 29, 94, 40, 66, 77, 25, 54, 245, 80, 216, 50, 44, 118, 155, 63, 155, 107, 90, 59, 38, 214, 21, 3, 145, 203, 212, 7, 72, 237, 151, 10, 255, 240, 86, 14, 250, 160, 17, 16, 77, 189, 208, 20, 148, 155, 147, 25, 35, 134, 82, 29, 14, 86, 47, 241, 185, 75, 238, 245, 96, 109, 173, 248, 215, 112, 108, 252, 210, 32, 43, 226, 101, 61, 234, 230, 188, 27, 169, 235, 11, 6, 104, 239, 182, 187, 39, 215, 1, 166, 230, 211, 216, 128, 165, 222, 111, 157, 100, 218, 106, 205, 35, 196, 221, 208, 226, 192, 4, 246, 161, 205, 179, 235, 96, 201, 126, 141, 62, 189, 201, 144, 255, 185, 16, 182, 188, 180, 167, 171, 125, 176, 162, 251, 58, 174, 21, 230, 251, 170, 204, 192, 184, 167, 123, 221, 121, 163, 198, 96, 54, 155, 113, 125, 247, 159, 168, 91, 180, 146, 31, 70, 117, 150, 26, 22, 50, 136, 173, 11, 243, 140, 116, 45, 176, 129, 195, 48, 113, 133, 153, 144, 138, 93, 46, 141, 75, 89, 247, 171, 8, 84, 64, 182, 201, 80, 69, 230, 142, 78, 242, 251, 79, 74, 43, 221, 12, 71, 156, 192, 205, 67, 33, 125, 130, 123, 150, 96, 67, 127, 79, 70, 0, 114, 248, 91, 193, 118, 253, 11, 134, 104, 74, 22, 71, 108, 147, 48, 4, 97, 36, 45, 197, 101, 233, 75, 155, 17, 94, 86, 90, 21, 135, 112, 25, 24, 48, 109, 216, 28, 53, 61, 159, 2, 130, 32, 94, 6, 91, 6, 29, 11, 236, 27, 220, 15, 81, 166, 147, 55, 230, 187, 82, 51, 63, 157, 17, 62, 136, 128, 208, 58, 141, 208, 151, 36, 58, 205, 86, 32, 227, 235, 21, 45, 84, 246, 212, 41, 121, 38, 169, 197, 206, 59, 104, 193, 23, 29, 43, 204, 160, 0, 234, 200, 165, 80, 173, 214, 18, 77, 108, 210, 203, 107, 47, 223, 124, 118, 238, 219, 193, 203, 161, 227, 118, 214, 96, 231, 175, 240, 35, 234, 24, 237, 226, 238, 29, 189, 165, 240, 170, 160, 100, 244, 115, 134, 39, 249, 196, 155, 230, 253, 9, 253, 184, 137, 190, 224, 121, 141, 103, 198, 58, 128, 208, 219, 251, 132, 213, 139, 188, 154, 98, 150, 125, 158, 187, 176, 62, 147, 12, 173, 255, 151, 177, 16, 176, 175, 6, 13, 113, 171, 223, 43, 50, 166, 104, 54, 243, 162, 109, 102, 180, 188, 218, 123, 117, 184, 3, 93, 54, 181, 180, 64, 247, 177, 79, 103, 103, 83, 0, 0, 0, 0, 33, 111, 103, 103, 95, 115, 121, 110, 99, 95, 105, 110, 105, 116, 40, 38, 111, 103, 103, 45, 62, 115, 116, 97, 116, 101, 41, 0, 0, 0, 0, 0, 115, 114, 99, 47, 111, 103, 103, 46, 99, 0, 0, 0, 0, 0, 0, 0, 65, 86, 79, 103, 103, 73, 110, 105, 116, 0, 0, 0, 0, 0, 0, 0, 33, 111, 103, 103, 95, 115, 121, 110, 99, 95, 119, 114, 111, 116, 101, 40, 38, 111, 103, 103, 45, 62, 115, 116, 97, 116, 101, 44, 32, 98, 117, 102, 108, 101, 110, 41, 0, 0, 0, 0, 65, 86, 79, 103, 103, 82, 101, 97, 100, 0, 0, 0, 0, 0, 0, 0, 33, 111, 103, 103, 95, 115, 116, 114, 101, 97, 109, 95, 105, 110, 105, 116, 40, 38, 111, 103, 103, 45, 62, 115, 116, 114, 101, 97, 109, 44, 32, 115, 101, 114, 105, 97, 108, 41, 0, 0, 33, 111, 103, 103, 95, 115, 116, 114, 101, 97, 109, 95, 112, 97, 103, 101, 105, 110, 40, 38, 111, 103, 103, 45, 62, 115, 116, 114, 101, 97, 109, 44, 32, 38, 111, 103, 103, 45, 62, 112, 97, 103, 101, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
        var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
        assert(tempDoublePtr % 8 == 0);
        function copyTempFloat(ptr) {
            HEAP8[tempDoublePtr] = HEAP8[ptr];
            HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
            HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
            HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3]
        }

        function copyTempDouble(ptr) {
            HEAP8[tempDoublePtr] = HEAP8[ptr];
            HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
            HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
            HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
            HEAP8[tempDoublePtr + 4] = HEAP8[ptr + 4];
            HEAP8[tempDoublePtr + 5] = HEAP8[ptr + 5];
            HEAP8[tempDoublePtr + 6] = HEAP8[ptr + 6];
            HEAP8[tempDoublePtr + 7] = HEAP8[ptr + 7]
        }

        Module["_i64Add"] = _i64Add;
        function _sbrk(bytes) {
            var self = _sbrk;
            if (!self.called) {
                DYNAMICTOP = alignMemoryPage(DYNAMICTOP);
                self.called = true;
                assert(Runtime.dynamicAlloc);
                self.alloc = Runtime.dynamicAlloc;
                Runtime.dynamicAlloc = (function () {
                    abort("cannot dynamically allocate, sbrk now has control")
                })
            }
            var ret = DYNAMICTOP;
            if (bytes != 0)self.alloc(bytes);
            return ret
        }

        var ___errno_state = 0;

        function ___setErrNo(value) {
            HEAP32[___errno_state >> 2] = value;
            return value
        }

        var ERRNO_CODES = {
            EPERM: 1,
            ENOENT: 2,
            ESRCH: 3,
            EINTR: 4,
            EIO: 5,
            ENXIO: 6,
            E2BIG: 7,
            ENOEXEC: 8,
            EBADF: 9,
            ECHILD: 10,
            EAGAIN: 11,
            EWOULDBLOCK: 11,
            ENOMEM: 12,
            EACCES: 13,
            EFAULT: 14,
            ENOTBLK: 15,
            EBUSY: 16,
            EEXIST: 17,
            EXDEV: 18,
            ENODEV: 19,
            ENOTDIR: 20,
            EISDIR: 21,
            EINVAL: 22,
            ENFILE: 23,
            EMFILE: 24,
            ENOTTY: 25,
            ETXTBSY: 26,
            EFBIG: 27,
            ENOSPC: 28,
            ESPIPE: 29,
            EROFS: 30,
            EMLINK: 31,
            EPIPE: 32,
            EDOM: 33,
            ERANGE: 34,
            ENOMSG: 42,
            EIDRM: 43,
            ECHRNG: 44,
            EL2NSYNC: 45,
            EL3HLT: 46,
            EL3RST: 47,
            ELNRNG: 48,
            EUNATCH: 49,
            ENOCSI: 50,
            EL2HLT: 51,
            EDEADLK: 35,
            ENOLCK: 37,
            EBADE: 52,
            EBADR: 53,
            EXFULL: 54,
            ENOANO: 55,
            EBADRQC: 56,
            EBADSLT: 57,
            EDEADLOCK: 35,
            EBFONT: 59,
            ENOSTR: 60,
            ENODATA: 61,
            ETIME: 62,
            ENOSR: 63,
            ENONET: 64,
            ENOPKG: 65,
            EREMOTE: 66,
            ENOLINK: 67,
            EADV: 68,
            ESRMNT: 69,
            ECOMM: 70,
            EPROTO: 71,
            EMULTIHOP: 72,
            EDOTDOT: 73,
            EBADMSG: 74,
            ENOTUNIQ: 76,
            EBADFD: 77,
            EREMCHG: 78,
            ELIBACC: 79,
            ELIBBAD: 80,
            ELIBSCN: 81,
            ELIBMAX: 82,
            ELIBEXEC: 83,
            ENOSYS: 38,
            ENOTEMPTY: 39,
            ENAMETOOLONG: 36,
            ELOOP: 40,
            EOPNOTSUPP: 95,
            EPFNOSUPPORT: 96,
            ECONNRESET: 104,
            ENOBUFS: 105,
            EAFNOSUPPORT: 97,
            EPROTOTYPE: 91,
            ENOTSOCK: 88,
            ENOPROTOOPT: 92,
            ESHUTDOWN: 108,
            ECONNREFUSED: 111,
            EADDRINUSE: 98,
            ECONNABORTED: 103,
            ENETUNREACH: 101,
            ENETDOWN: 100,
            ETIMEDOUT: 110,
            EHOSTDOWN: 112,
            EHOSTUNREACH: 113,
            EINPROGRESS: 115,
            EALREADY: 114,
            EDESTADDRREQ: 89,
            EMSGSIZE: 90,
            EPROTONOSUPPORT: 93,
            ESOCKTNOSUPPORT: 94,
            EADDRNOTAVAIL: 99,
            ENETRESET: 102,
            EISCONN: 106,
            ENOTCONN: 107,
            ETOOMANYREFS: 109,
            EUSERS: 87,
            EDQUOT: 122,
            ESTALE: 116,
            ENOTSUP: 95,
            ENOMEDIUM: 123,
            EILSEQ: 84,
            EOVERFLOW: 75,
            ECANCELED: 125,
            ENOTRECOVERABLE: 131,
            EOWNERDEAD: 130,
            ESTRPIPE: 86
        };

        function _sysconf(name) {
            switch (name) {
                case 30:
                    return PAGE_SIZE;
                case 132:
                case 133:
                case 12:
                case 137:
                case 138:
                case 15:
                case 235:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 149:
                case 13:
                case 10:
                case 236:
                case 153:
                case 9:
                case 21:
                case 22:
                case 159:
                case 154:
                case 14:
                case 77:
                case 78:
                case 139:
                case 80:
                case 81:
                case 79:
                case 82:
                case 68:
                case 67:
                case 164:
                case 11:
                case 29:
                case 47:
                case 48:
                case 95:
                case 52:
                case 51:
                case 46:
                    return 200809;
                case 27:
                case 246:
                case 127:
                case 128:
                case 23:
                case 24:
                case 160:
                case 161:
                case 181:
                case 182:
                case 242:
                case 183:
                case 184:
                case 243:
                case 244:
                case 245:
                case 165:
                case 178:
                case 179:
                case 49:
                case 50:
                case 168:
                case 169:
                case 175:
                case 170:
                case 171:
                case 172:
                case 97:
                case 76:
                case 32:
                case 173:
                case 35:
                    return -1;
                case 176:
                case 177:
                case 7:
                case 155:
                case 8:
                case 157:
                case 125:
                case 126:
                case 92:
                case 93:
                case 129:
                case 130:
                case 131:
                case 94:
                case 91:
                    return 1;
                case 74:
                case 60:
                case 69:
                case 70:
                case 4:
                    return 1024;
                case 31:
                case 42:
                case 72:
                    return 32;
                case 87:
                case 26:
                case 33:
                    return 2147483647;
                case 34:
                case 1:
                    return 47839;
                case 38:
                case 36:
                    return 99;
                case 43:
                case 37:
                    return 2048;
                case 0:
                    return 2097152;
                case 3:
                    return 65536;
                case 28:
                    return 32768;
                case 44:
                    return 32767;
                case 75:
                    return 16384;
                case 39:
                    return 1e3;
                case 89:
                    return 700;
                case 71:
                    return 256;
                case 40:
                    return 255;
                case 2:
                    return 100;
                case 180:
                    return 64;
                case 25:
                    return 20;
                case 5:
                    return 16;
                case 6:
                    return 6;
                case 73:
                    return 4;
                case 84: {
                    if (typeof navigator === "object")return navigator["hardwareConcurrency"] || 1;
                    return 1
                }
            }
            ___setErrNo(ERRNO_CODES.EINVAL);
            return -1
        }

        function _emscripten_memcpy_big(dest, src, num) {
            HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
            return dest
        }

        Module["_memcpy"] = _memcpy;
        Module["_memmove"] = _memmove;
        Module["_memset"] = _memset;
        function ___errno_location() {
            return ___errno_state
        }

        Module["_bitshift64Shl"] = _bitshift64Shl;
        function _abort() {
            Module["abort"]()
        }

        var ERRNO_MESSAGES = {
            0: "Success",
            1: "Not super-user",
            2: "No such file or directory",
            3: "No such process",
            4: "Interrupted system call",
            5: "I/O error",
            6: "No such device or address",
            7: "Arg list too long",
            8: "Exec format error",
            9: "Bad file number",
            10: "No children",
            11: "No more processes",
            12: "Not enough core",
            13: "Permission denied",
            14: "Bad address",
            15: "Block device required",
            16: "Mount device busy",
            17: "File exists",
            18: "Cross-device link",
            19: "No such device",
            20: "Not a directory",
            21: "Is a directory",
            22: "Invalid argument",
            23: "Too many open files in system",
            24: "Too many open files",
            25: "Not a typewriter",
            26: "Text file busy",
            27: "File too large",
            28: "No space left on device",
            29: "Illegal seek",
            30: "Read only file system",
            31: "Too many links",
            32: "Broken pipe",
            33: "Math arg out of domain of func",
            34: "Math result not representable",
            35: "File locking deadlock error",
            36: "File or path name too long",
            37: "No record locks available",
            38: "Function not implemented",
            39: "Directory not empty",
            40: "Too many symbolic links",
            42: "No message of desired type",
            43: "Identifier removed",
            44: "Channel number out of range",
            45: "Level 2 not synchronized",
            46: "Level 3 halted",
            47: "Level 3 reset",
            48: "Link number out of range",
            49: "Protocol driver not attached",
            50: "No CSI structure available",
            51: "Level 2 halted",
            52: "Invalid exchange",
            53: "Invalid request descriptor",
            54: "Exchange full",
            55: "No anode",
            56: "Invalid request code",
            57: "Invalid slot",
            59: "Bad font file fmt",
            60: "Device not a stream",
            61: "No data (for no delay io)",
            62: "Timer expired",
            63: "Out of streams resources",
            64: "Machine is not on the network",
            65: "Package not installed",
            66: "The object is remote",
            67: "The link has been severed",
            68: "Advertise error",
            69: "Srmount error",
            70: "Communication error on send",
            71: "Protocol error",
            72: "Multihop attempted",
            73: "Cross mount point (not really error)",
            74: "Trying to read unreadable message",
            75: "Value too large for defined data type",
            76: "Given log. name not unique",
            77: "f.d. invalid for this operation",
            78: "Remote address changed",
            79: "Can   access a needed shared lib",
            80: "Accessing a corrupted shared lib",
            81: ".lib section in a.out corrupted",
            82: "Attempting to link in too many libs",
            83: "Attempting to exec a shared library",
            84: "Illegal byte sequence",
            86: "Streams pipe error",
            87: "Too many users",
            88: "Socket operation on non-socket",
            89: "Destination address required",
            90: "Message too long",
            91: "Protocol wrong type for socket",
            92: "Protocol not available",
            93: "Unknown protocol",
            94: "Socket type not supported",
            95: "Not supported",
            96: "Protocol family not supported",
            97: "Address family not supported by protocol family",
            98: "Address already in use",
            99: "Address not available",
            100: "Network interface is not configured",
            101: "Network is unreachable",
            102: "Connection reset by network",
            103: "Connection aborted",
            104: "Connection reset by peer",
            105: "No buffer space available",
            106: "Socket is already connected",
            107: "Socket is not connected",
            108: "Can't send after socket shutdown",
            109: "Too many references",
            110: "Connection timed out",
            111: "Connection refused",
            112: "Host is down",
            113: "Host is unreachable",
            114: "Socket already connected",
            115: "Connection already in progress",
            116: "Stale file handle",
            122: "Quota exceeded",
            123: "No medium (in tape drive)",
            125: "Operation canceled",
            130: "Previous owner died",
            131: "State not recoverable"
        };
        var TTY = {
            ttys: [], init: (function () {
            }), shutdown: (function () {
            }), register: (function (dev, ops) {
                TTY.ttys[dev] = {input: [], output: [], ops: ops};
                FS.registerDevice(dev, TTY.stream_ops)
            }), stream_ops: {
                open: (function (stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                    }
                    stream.tty = tty;
                    stream.seekable = false
                }), close: (function (stream) {
                    if (stream.tty.output.length) {
                        stream.tty.ops.put_char(stream.tty, 10)
                    }
                }), read: (function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
                    }
                    var bytesRead = 0;
                    for (var i = 0; i < length; i++) {
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty)
                        } catch (e) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        if (result === undefined && bytesRead === 0) {
                            throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                        }
                        if (result === null || result === undefined)break;
                        bytesRead++;
                        buffer[offset + i] = result
                    }
                    if (bytesRead) {
                        stream.node.timestamp = Date.now()
                    }
                    return bytesRead
                }), write: (function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
                    }
                    for (var i = 0; i < length; i++) {
                        try {
                            stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                        } catch (e) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                    }
                    if (length) {
                        stream.node.timestamp = Date.now()
                    }
                    return i
                })
            }, default_tty_ops: {
                get_char: (function (tty) {
                    if (!tty.input.length) {
                        var result = null;
                        if (ENVIRONMENT_IS_NODE) {
                            result = process["stdin"]["read"]();
                            if (!result) {
                                if (process["stdin"]["_readableState"] && process["stdin"]["_readableState"]["ended"]) {
                                    return null
                                }
                                return undefined
                            }
                        } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                            result = window.prompt("Input: ");
                            if (result !== null) {
                                result += "\n"
                            }
                        } else if (typeof readline == "function") {
                            result = readline();
                            if (result !== null) {
                                result += "\n"
                            }
                        }
                        if (!result) {
                            return null
                        }
                        tty.input = intArrayFromString(result, true)
                    }
                    return tty.input.shift()
                }), put_char: (function (tty, val) {
                    if (val === null || val === 10) {
                        Module["print"](tty.output.join(""));
                        tty.output = []
                    } else {
                        tty.output.push(TTY.utf8.processCChar(val))
                    }
                })
            }, default_tty1_ops: {
                put_char: (function (tty, val) {
                    if (val === null || val === 10) {
                        Module["printErr"](tty.output.join(""));
                        tty.output = []
                    } else {
                        tty.output.push(TTY.utf8.processCChar(val))
                    }
                })
            }
        };
        var MEMFS = {
            ops_table: null, mount: (function (mount) {
                return MEMFS.createNode(null, "/", 16384 | 511, 0)
            }), createNode: (function (parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (!MEMFS.ops_table) {
                    MEMFS.ops_table = {
                        dir: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                lookup: MEMFS.node_ops.lookup,
                                mknod: MEMFS.node_ops.mknod,
                                rename: MEMFS.node_ops.rename,
                                unlink: MEMFS.node_ops.unlink,
                                rmdir: MEMFS.node_ops.rmdir,
                                readdir: MEMFS.node_ops.readdir,
                                symlink: MEMFS.node_ops.symlink
                            }, stream: {llseek: MEMFS.stream_ops.llseek}
                        },
                        file: {
                            node: {getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr},
                            stream: {
                                llseek: MEMFS.stream_ops.llseek,
                                read: MEMFS.stream_ops.read,
                                write: MEMFS.stream_ops.write,
                                allocate: MEMFS.stream_ops.allocate,
                                mmap: MEMFS.stream_ops.mmap
                            }
                        },
                        link: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                readlink: MEMFS.node_ops.readlink
                            }, stream: {}
                        },
                        chrdev: {
                            node: {getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr},
                            stream: FS.chrdev_stream_ops
                        }
                    }
                }
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {}
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream
                }
                node.timestamp = Date.now();
                if (parent) {
                    parent.contents[name] = node
                }
                return node
            }), getFileDataAsRegularArray: (function (node) {
                if (node.contents && node.contents.subarray) {
                    var arr = [];
                    for (var i = 0; i < node.usedBytes; ++i)arr.push(node.contents[i]);
                    return arr
                }
                return node.contents
            }), getFileDataAsTypedArray: (function (node) {
                if (node.contents && node.contents.subarray)return node.contents.subarray(0, node.usedBytes);
                return new Uint8Array(node.contents)
            }), expandFileStorage: (function (node, newCapacity) {
                if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
                    node.contents = MEMFS.getFileDataAsRegularArray(node);
                    node.usedBytes = node.contents.length
                }
                if (!node.contents || node.contents.subarray) {
                    var prevCapacity = node.contents ? node.contents.buffer.byteLength : 0;
                    if (prevCapacity >= newCapacity)return;
                    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                    newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
                    if (prevCapacity != 0)newCapacity = Math.max(newCapacity, 256);
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newCapacity);
                    if (node.usedBytes > 0)node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
                    return
                }
                if (!node.contents && newCapacity > 0)node.contents = [];
                while (node.contents.length < newCapacity)node.contents.push(0)
            }), resizeFileStorage: (function (node, newSize) {
                if (node.usedBytes == newSize)return;
                if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                    return
                }
                if (!node.contents || node.contents.subarray) {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(new ArrayBuffer(newSize));
                    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
                    node.usedBytes = newSize;
                    return
                }
                if (!node.contents)node.contents = [];
                if (node.contents.length > newSize)node.contents.length = newSize; else while (node.contents.length < newSize)node.contents.push(0);
                node.usedBytes = newSize
            }), node_ops: {
                getattr: (function (node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) {
                        attr.size = 4096
                    } else if (FS.isFile(node.mode)) {
                        attr.size = node.usedBytes
                    } else if (FS.isLink(node.mode)) {
                        attr.size = node.link.length
                    } else {
                        attr.size = 0
                    }
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr
                }), setattr: (function (node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp
                    }
                    if (attr.size !== undefined) {
                        MEMFS.resizeFileStorage(node, attr.size)
                    }
                }), lookup: (function (parent, name) {
                    throw FS.genericErrors[ERRNO_CODES.ENOENT]
                }), mknod: (function (parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev)
                }), rename: (function (old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name)
                        } catch (e) {
                        }
                        if (new_node) {
                            for (var i in new_node.contents) {
                                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                            }
                        }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    old_node.parent = new_dir
                }), unlink: (function (parent, name) {
                    delete parent.contents[name]
                }), rmdir: (function (parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                    }
                    delete parent.contents[name]
                }), readdir: (function (node) {
                    var entries = [".", ".."];
                    for (var key in node.contents) {
                        if (!node.contents.hasOwnProperty(key)) {
                            continue
                        }
                        entries.push(key)
                    }
                    return entries
                }), symlink: (function (parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                    node.link = oldpath;
                    return node
                }), readlink: (function (node) {
                    if (!FS.isLink(node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    return node.link
                })
            }, stream_ops: {
                read: (function (stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes)return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    assert(size >= 0);
                    if (size > 8 && contents.subarray) {
                        buffer.set(contents.subarray(position, position + size), offset)
                    } else {
                        for (var i = 0; i < size; i++)buffer[offset + i] = contents[position + i]
                    }
                    return size
                }), write: (function (stream, buffer, offset, length, position, canOwn) {
                    if (!length)return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                        if (canOwn) {
                            node.contents = buffer.subarray(offset, offset + length);
                            node.usedBytes = length;
                            return length
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                            node.usedBytes = length;
                            return length
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(buffer.subarray(offset, offset + length), position);
                            return length
                        }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray)node.contents.set(buffer.subarray(offset, offset + length), position); else for (var i = 0; i < length; i++) {
                        node.contents[position + i] = buffer[offset + i]
                    }
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length
                }), llseek: (function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.usedBytes
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    stream.ungotten = [];
                    stream.position = position;
                    return position
                }), allocate: (function (stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
                }), mmap: (function (stream, buffer, offset, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                    }
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                        allocated = false;
                        ptr = contents.byteOffset
                    } else {
                        if (position > 0 || position + length < stream.node.usedBytes) {
                            if (contents.subarray) {
                                contents = contents.subarray(position, position + length)
                            } else {
                                contents = Array.prototype.slice.call(contents, position, position + length)
                            }
                        }
                        allocated = true;
                        ptr = _malloc(length);
                        if (!ptr) {
                            throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)
                        }
                        buffer.set(contents, ptr)
                    }
                    return {ptr: ptr, allocated: allocated}
                })
            }
        };
        var IDBFS = {
            dbs: {}, indexedDB: (function () {
                return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
            }), DB_VERSION: 21, DB_STORE_NAME: "FILE_DATA", mount: (function (mount) {
                return MEMFS.mount.apply(null, arguments)
            }), syncfs: (function (mount, populate, callback) {
                IDBFS.getLocalSet(mount, (function (err, local) {
                    if (err)return callback(err);
                    IDBFS.getRemoteSet(mount, (function (err, remote) {
                        if (err)return callback(err);
                        var src = populate ? remote : local;
                        var dst = populate ? local : remote;
                        IDBFS.reconcile(src, dst, callback)
                    }))
                }))
            }), getDB: (function (name, callback) {
                var db = IDBFS.dbs[name];
                if (db) {
                    return callback(null, db)
                }
                var req;
                try {
                    req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
                } catch (e) {
                    return callback(e)
                }
                req.onupgradeneeded = (function (e) {
                    var db = e.target.result;
                    var transaction = e.target.transaction;
                    var fileStore;
                    if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
                    } else {
                        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
                    }
                    fileStore.createIndex("timestamp", "timestamp", {unique: false})
                });
                req.onsuccess = (function () {
                    db = req.result;
                    IDBFS.dbs[name] = db;
                    callback(null, db)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), getLocalSet: (function (mount, callback) {
                var entries = {};

                function isRealDir(p) {
                    return p !== "." && p !== ".."
                }

                function toAbsolute(root) {
                    return (function (p) {
                        return PATH.join2(root, p)
                    })
                }

                var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
                while (check.length) {
                    var path = check.pop();
                    var stat;
                    try {
                        stat = FS.stat(path)
                    } catch (e) {
                        return callback(e)
                    }
                    if (FS.isDir(stat.mode)) {
                        check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
                    }
                    entries[path] = {timestamp: stat.mtime}
                }
                return callback(null, {type: "local", entries: entries})
            }), getRemoteSet: (function (mount, callback) {
                var entries = {};
                IDBFS.getDB(mount.mountpoint, (function (err, db) {
                    if (err)return callback(err);
                    var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                    transaction.onerror = (function () {
                        callback(this.error)
                    });
                    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                    var index = store.index("timestamp");
                    index.openKeyCursor().onsuccess = (function (event) {
                        var cursor = event.target.result;
                        if (!cursor) {
                            return callback(null, {type: "remote", db: db, entries: entries})
                        }
                        entries[cursor.primaryKey] = {timestamp: cursor.key};
                        cursor.continue()
                    })
                }))
            }), loadLocalEntry: (function (path, callback) {
                var stat, node;
                try {
                    var lookup = FS.lookupPath(path);
                    node = lookup.node;
                    stat = FS.stat(path)
                } catch (e) {
                    return callback(e)
                }
                if (FS.isDir(stat.mode)) {
                    return callback(null, {timestamp: stat.mtime, mode: stat.mode})
                } else if (FS.isFile(stat.mode)) {
                    node.contents = MEMFS.getFileDataAsTypedArray(node);
                    return callback(null, {timestamp: stat.mtime, mode: stat.mode, contents: node.contents})
                } else {
                    return callback(new Error("node type not supported"))
                }
            }), storeLocalEntry: (function (path, entry, callback) {
                try {
                    if (FS.isDir(entry.mode)) {
                        FS.mkdir(path, entry.mode)
                    } else if (FS.isFile(entry.mode)) {
                        FS.writeFile(path, entry.contents, {encoding: "binary", canOwn: true})
                    } else {
                        return callback(new Error("node type not supported"))
                    }
                    FS.utime(path, entry.timestamp, entry.timestamp)
                } catch (e) {
                    return callback(e)
                }
                callback(null)
            }), removeLocalEntry: (function (path, callback) {
                try {
                    var lookup = FS.lookupPath(path);
                    var stat = FS.stat(path);
                    if (FS.isDir(stat.mode)) {
                        FS.rmdir(path)
                    } else if (FS.isFile(stat.mode)) {
                        FS.unlink(path)
                    }
                } catch (e) {
                    return callback(e)
                }
                callback(null)
            }), loadRemoteEntry: (function (store, path, callback) {
                var req = store.get(path);
                req.onsuccess = (function (event) {
                    callback(null, event.target.result)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), storeRemoteEntry: (function (store, path, entry, callback) {
                var req = store.put(entry, path);
                req.onsuccess = (function () {
                    callback(null)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), removeRemoteEntry: (function (store, path, callback) {
                var req = store.delete(path);
                req.onsuccess = (function () {
                    callback(null)
                });
                req.onerror = (function () {
                    callback(this.error)
                })
            }), reconcile: (function (src, dst, callback) {
                var total = 0;
                var create = [];
                Object.keys(src.entries).forEach((function (key) {
                    var e = src.entries[key];
                    var e2 = dst.entries[key];
                    if (!e2 || e.timestamp > e2.timestamp) {
                        create.push(key);
                        total++
                    }
                }));
                var remove = [];
                Object.keys(dst.entries).forEach((function (key) {
                    var e = dst.entries[key];
                    var e2 = src.entries[key];
                    if (!e2) {
                        remove.push(key);
                        total++
                    }
                }));
                if (!total) {
                    return callback(null)
                }
                var errored = false;
                var completed = 0;
                var db = src.type === "remote" ? src.db : dst.db;
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);

                function done(err) {
                    if (err) {
                        if (!done.errored) {
                            done.errored = true;
                            return callback(err)
                        }
                        return
                    }
                    if (++completed >= total) {
                        return callback(null)
                    }
                }

                transaction.onerror = (function () {
                    done(this.error)
                });
                create.sort().forEach((function (path) {
                    if (dst.type === "local") {
                        IDBFS.loadRemoteEntry(store, path, (function (err, entry) {
                            if (err)return done(err);
                            IDBFS.storeLocalEntry(path, entry, done)
                        }))
                    } else {
                        IDBFS.loadLocalEntry(path, (function (err, entry) {
                            if (err)return done(err);
                            IDBFS.storeRemoteEntry(store, path, entry, done)
                        }))
                    }
                }));
                remove.sort().reverse().forEach((function (path) {
                    if (dst.type === "local") {
                        IDBFS.removeLocalEntry(path, done)
                    } else {
                        IDBFS.removeRemoteEntry(store, path, done)
                    }
                }))
            })
        };
        var NODEFS = {
            isWindows: false,
            staticInit: (function () {
                NODEFS.isWindows = !!process.platform.match(/^win/)
            }),
            mount: (function (mount) {
                assert(ENVIRONMENT_IS_NODE);
                return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0)
            }),
            createNode: (function (parent, name, mode, dev) {
                if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node = FS.createNode(parent, name, mode);
                node.node_ops = NODEFS.node_ops;
                node.stream_ops = NODEFS.stream_ops;
                return node
            }),
            getMode: (function (path) {
                var stat;
                try {
                    stat = fs.lstatSync(path);
                    if (NODEFS.isWindows) {
                        stat.mode = stat.mode | (stat.mode & 146) >> 1
                    }
                } catch (e) {
                    if (!e.code)throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code])
                }
                return stat.mode
            }),
            realPath: (function (node) {
                var parts = [];
                while (node.parent !== node) {
                    parts.push(node.name);
                    node = node.parent
                }
                parts.push(node.mount.opts.root);
                parts.reverse();
                return PATH.join.apply(null, parts)
            }),
            flagsToPermissionStringMap: {
                0: "r",
                1: "r+",
                2: "r+",
                64: "r",
                65: "r+",
                66: "r+",
                129: "rx+",
                193: "rx+",
                514: "w+",
                577: "w",
                578: "w+",
                705: "wx",
                706: "wx+",
                1024: "a",
                1025: "a",
                1026: "a+",
                1089: "a",
                1090: "a+",
                1153: "ax",
                1154: "ax+",
                1217: "ax",
                1218: "ax+",
                4096: "rs",
                4098: "rs+"
            },
            flagsToPermissionString: (function (flags) {
                if (flags in NODEFS.flagsToPermissionStringMap) {
                    return NODEFS.flagsToPermissionStringMap[flags]
                } else {
                    return flags
                }
            }),
            node_ops: {
                getattr: (function (node) {
                    var path = NODEFS.realPath(node);
                    var stat;
                    try {
                        stat = fs.lstatSync(path)
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    if (NODEFS.isWindows && !stat.blksize) {
                        stat.blksize = 4096
                    }
                    if (NODEFS.isWindows && !stat.blocks) {
                        stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0
                    }
                    return {
                        dev: stat.dev,
                        ino: stat.ino,
                        mode: stat.mode,
                        nlink: stat.nlink,
                        uid: stat.uid,
                        gid: stat.gid,
                        rdev: stat.rdev,
                        size: stat.size,
                        atime: stat.atime,
                        mtime: stat.mtime,
                        ctime: stat.ctime,
                        blksize: stat.blksize,
                        blocks: stat.blocks
                    }
                }), setattr: (function (node, attr) {
                    var path = NODEFS.realPath(node);
                    try {
                        if (attr.mode !== undefined) {
                            fs.chmodSync(path, attr.mode);
                            node.mode = attr.mode
                        }
                        if (attr.timestamp !== undefined) {
                            var date = new Date(attr.timestamp);
                            fs.utimesSync(path, date, date)
                        }
                        if (attr.size !== undefined) {
                            fs.truncateSync(path, attr.size)
                        }
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), lookup: (function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    var mode = NODEFS.getMode(path);
                    return NODEFS.createNode(parent, name, mode)
                }), mknod: (function (parent, name, mode, dev) {
                    var node = NODEFS.createNode(parent, name, mode, dev);
                    var path = NODEFS.realPath(node);
                    try {
                        if (FS.isDir(node.mode)) {
                            fs.mkdirSync(path, node.mode)
                        } else {
                            fs.writeFileSync(path, "", {mode: node.mode})
                        }
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    return node
                }), rename: (function (oldNode, newDir, newName) {
                    var oldPath = NODEFS.realPath(oldNode);
                    var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
                    try {
                        fs.renameSync(oldPath, newPath)
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), unlink: (function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.unlinkSync(path)
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), rmdir: (function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.rmdirSync(path)
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), readdir: (function (node) {
                    var path = NODEFS.realPath(node);
                    try {
                        return fs.readdirSync(path)
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), symlink: (function (parent, newName, oldPath) {
                    var newPath = PATH.join2(NODEFS.realPath(parent), newName);
                    try {
                        fs.symlinkSync(oldPath, newPath)
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), readlink: (function (node) {
                    var path = NODEFS.realPath(node);
                    try {
                        return fs.readlinkSync(path)
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                })
            },
            stream_ops: {
                open: (function (stream) {
                    var path = NODEFS.realPath(stream.node);
                    try {
                        if (FS.isFile(stream.node.mode)) {
                            stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags))
                        }
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), close: (function (stream) {
                    try {
                        if (FS.isFile(stream.node.mode) && stream.nfd) {
                            fs.closeSync(stream.nfd)
                        }
                    } catch (e) {
                        if (!e.code)throw e;
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }), read: (function (stream, buffer, offset, length, position) {
                    var nbuffer = new Buffer(length);
                    var res;
                    try {
                        res = fs.readSync(stream.nfd, nbuffer, 0, length, position)
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    if (res > 0) {
                        for (var i = 0; i < res; i++) {
                            buffer[offset + i] = nbuffer[i]
                        }
                    }
                    return res
                }), write: (function (stream, buffer, offset, length, position) {
                    var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
                    var res;
                    try {
                        res = fs.writeSync(stream.nfd, nbuffer, 0, length, position)
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                    return res
                }), llseek: (function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            try {
                                var stat = fs.fstatSync(stream.nfd);
                                position += stat.size
                            } catch (e) {
                                throw new FS.ErrnoError(ERRNO_CODES[e.code])
                            }
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                    }
                    stream.position = position;
                    return position
                })
            }
        };
        var _stdin = allocate(1, "i32*", ALLOC_STATIC);
        var _stdout = allocate(1, "i32*", ALLOC_STATIC);
        var _stderr = allocate(1, "i32*", ALLOC_STATIC);

        function _fflush(stream) {
        }

        var FS = {
            root: null,
            mounts: [],
            devices: [null],
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            trackingDelegate: {},
            tracking: {openFlags: {READ: 1, WRITE: 2}},
            ErrnoError: null,
            genericErrors: {},
            handleFSError: (function (e) {
                if (!(e instanceof FS.ErrnoError))throw e + " : " + stackTrace();
                return ___setErrNo(e.errno)
            }),
            lookupPath: (function (path, opts) {
                path = PATH.resolve(FS.cwd(), path);
                opts = opts || {};
                var defaults = {follow_mount: true, recurse_count: 0};
                for (var key in defaults) {
                    if (opts[key] === undefined) {
                        opts[key] = defaults[key]
                    }
                }
                if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                }
                var parts = PATH.normalizeArray(path.split("/").filter((function (p) {
                    return !!p
                })), false);
                var current = FS.root;
                var current_path = "/";
                for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                        break
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || islast && opts.follow_mount) {
                            current = current.mounted.root
                        }
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while (FS.isLink(current.mode)) {
                            var link = FS.readlink(current_path);
                            current_path = PATH.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, {recurse_count: opts.recurse_count});
                            current = lookup.node;
                            if (count++ > 40) {
                                throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                            }
                        }
                    }
                }
                return {path: current_path, node: current}
            }),
            getPath: (function (node) {
                var path;
                while (true) {
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path)return mount;
                        return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
                    }
                    path = path ? node.name + "/" + path : node.name;
                    node = node.parent
                }
            }),
            hashName: (function (parentid, name) {
                var hash = 0;
                for (var i = 0; i < name.length; i++) {
                    hash = (hash << 5) - hash + name.charCodeAt(i) | 0
                }
                return (parentid + hash >>> 0) % FS.nameTable.length
            }),
            hashAddNode: (function (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node
            }),
            hashRemoveNode: (function (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) {
                    FS.nameTable[hash] = node.name_next
                } else {
                    var current = FS.nameTable[hash];
                    while (current) {
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break
                        }
                        current = current.name_next
                    }
                }
            }),
            lookupNode: (function (parent, name) {
                var err = FS.mayLookup(parent);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                var hash = FS.hashName(parent.id, name);
                for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) {
                        return node
                    }
                }
                return FS.lookup(parent, name)
            }),
            createNode: (function (parent, name, mode, rdev) {
                if (!FS.FSNode) {
                    FS.FSNode = (function (parent, name, mode, rdev) {
                        if (!parent) {
                            parent = this
                        }
                        this.parent = parent;
                        this.mount = parent.mount;
                        this.mounted = null;
                        this.id = FS.nextInode++;
                        this.name = name;
                        this.mode = mode;
                        this.node_ops = {};
                        this.stream_ops = {};
                        this.rdev = rdev
                    });
                    FS.FSNode.prototype = {};
                    var readMode = 292 | 73;
                    var writeMode = 146;
                    Object.defineProperties(FS.FSNode.prototype, {
                        read: {
                            get: (function () {
                                return (this.mode & readMode) === readMode
                            }), set: (function (val) {
                                val ? this.mode |= readMode : this.mode &= ~readMode
                            })
                        }, write: {
                            get: (function () {
                                return (this.mode & writeMode) === writeMode
                            }), set: (function (val) {
                                val ? this.mode |= writeMode : this.mode &= ~writeMode
                            })
                        }, isFolder: {
                            get: (function () {
                                return FS.isDir(this.mode)
                            })
                        }, isDevice: {
                            get: (function () {
                                return FS.isChrdev(this.mode)
                            })
                        }
                    })
                }
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node
            }),
            destroyNode: (function (node) {
                FS.hashRemoveNode(node)
            }),
            isRoot: (function (node) {
                return node === node.parent
            }),
            isMountpoint: (function (node) {
                return !!node.mounted
            }),
            isFile: (function (mode) {
                return (mode & 61440) === 32768
            }),
            isDir: (function (mode) {
                return (mode & 61440) === 16384
            }),
            isLink: (function (mode) {
                return (mode & 61440) === 40960
            }),
            isChrdev: (function (mode) {
                return (mode & 61440) === 8192
            }),
            isBlkdev: (function (mode) {
                return (mode & 61440) === 24576
            }),
            isFIFO: (function (mode) {
                return (mode & 61440) === 4096
            }),
            isSocket: (function (mode) {
                return (mode & 49152) === 49152
            }),
            flagModes: {
                "r": 0,
                "rs": 1052672,
                "r+": 2,
                "w": 577,
                "wx": 705,
                "xw": 705,
                "w+": 578,
                "wx+": 706,
                "xw+": 706,
                "a": 1089,
                "ax": 1217,
                "xa": 1217,
                "a+": 1090,
                "ax+": 1218,
                "xa+": 1218
            },
            modeStringToFlags: (function (str) {
                var flags = FS.flagModes[str];
                if (typeof flags === "undefined") {
                    throw new Error("Unknown file open mode: " + str)
                }
                return flags
            }),
            flagsToPermissionString: (function (flag) {
                var accmode = flag & 2097155;
                var perms = ["r", "w", "rw"][accmode];
                if (flag & 512) {
                    perms += "w"
                }
                return perms
            }),
            nodePermissions: (function (node, perms) {
                if (FS.ignorePermissions) {
                    return 0
                }
                if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
                    return ERRNO_CODES.EACCES
                } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
                    return ERRNO_CODES.EACCES
                } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
                    return ERRNO_CODES.EACCES
                }
                return 0
            }),
            mayLookup: (function (dir) {
                return FS.nodePermissions(dir, "x")
            }),
            mayCreate: (function (dir, name) {
                try {
                    var node = FS.lookupNode(dir, name);
                    return ERRNO_CODES.EEXIST
                } catch (e) {
                }
                return FS.nodePermissions(dir, "wx")
            }),
            mayDelete: (function (dir, name, isdir) {
                var node;
                try {
                    node = FS.lookupNode(dir, name)
                } catch (e) {
                    return e.errno
                }
                var err = FS.nodePermissions(dir, "wx");
                if (err) {
                    return err
                }
                if (isdir) {
                    if (!FS.isDir(node.mode)) {
                        return ERRNO_CODES.ENOTDIR
                    }
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                        return ERRNO_CODES.EBUSY
                    }
                } else {
                    if (FS.isDir(node.mode)) {
                        return ERRNO_CODES.EISDIR
                    }
                }
                return 0
            }),
            mayOpen: (function (node, flags) {
                if (!node) {
                    return ERRNO_CODES.ENOENT
                }
                if (FS.isLink(node.mode)) {
                    return ERRNO_CODES.ELOOP
                } else if (FS.isDir(node.mode)) {
                    if ((flags & 2097155) !== 0 || flags & 512) {
                        return ERRNO_CODES.EISDIR
                    }
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
            }),
            MAX_OPEN_FDS: 4096,
            nextfd: (function (fd_start, fd_end) {
                fd_start = fd_start || 0;
                fd_end = fd_end || FS.MAX_OPEN_FDS;
                for (var fd = fd_start; fd <= fd_end; fd++) {
                    if (!FS.streams[fd]) {
                        return fd
                    }
                }
                throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
            }),
            getStream: (function (fd) {
                return FS.streams[fd]
            }),
            createStream: (function (stream, fd_start, fd_end) {
                if (!FS.FSStream) {
                    FS.FSStream = (function () {
                    });
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: (function () {
                                return this.node
                            }), set: (function (val) {
                                this.node = val
                            })
                        }, isRead: {
                            get: (function () {
                                return (this.flags & 2097155) !== 1
                            })
                        }, isWrite: {
                            get: (function () {
                                return (this.flags & 2097155) !== 0
                            })
                        }, isAppend: {
                            get: (function () {
                                return this.flags & 1024
                            })
                        }
                    })
                }
                var newStream = new FS.FSStream;
                for (var p in stream) {
                    newStream[p] = stream[p]
                }
                stream = newStream;
                var fd = FS.nextfd(fd_start, fd_end);
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream
            }),
            closeStream: (function (fd) {
                FS.streams[fd] = null
            }),
            getStreamFromPtr: (function (ptr) {
                return FS.streams[ptr - 1]
            }),
            getPtrForStream: (function (stream) {
                return stream ? stream.fd + 1 : 0
            }),
            chrdev_stream_ops: {
                open: (function (stream) {
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    if (stream.stream_ops.open) {
                        stream.stream_ops.open(stream)
                    }
                }), llseek: (function () {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                })
            },
            major: (function (dev) {
                return dev >> 8
            }),
            minor: (function (dev) {
                return dev & 255
            }),
            makedev: (function (ma, mi) {
                return ma << 8 | mi
            }),
            registerDevice: (function (dev, ops) {
                FS.devices[dev] = {stream_ops: ops}
            }),
            getDevice: (function (dev) {
                return FS.devices[dev]
            }),
            getMounts: (function (mount) {
                var mounts = [];
                var check = [mount];
                while (check.length) {
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts)
                }
                return mounts
            }),
            syncfs: (function (populate, callback) {
                if (typeof populate === "function") {
                    callback = populate;
                    populate = false
                }
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;

                function done(err) {
                    if (err) {
                        if (!done.errored) {
                            done.errored = true;
                            return callback(err)
                        }
                        return
                    }
                    if (++completed >= mounts.length) {
                        callback(null)
                    }
                }

                mounts.forEach((function (mount) {
                    if (!mount.type.syncfs) {
                        return done(null)
                    }
                    mount.type.syncfs(mount, populate, done)
                }))
            }),
            mount: (function (type, opts, mountpoint) {
                var root = mountpoint === "/";
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                } else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                    }
                    if (!FS.isDir(node.mode)) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                    }
                }
                var mount = {type: type, opts: opts, mountpoint: mountpoint, mounts: []};
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) {
                    FS.root = mountRoot
                } else if (node) {
                    node.mounted = mount;
                    if (node.mount) {
                        node.mount.mounts.push(mount)
                    }
                }
                return mountRoot
            }),
            unmount: (function (mountpoint) {
                var lookup = FS.lookupPath(mountpoint, {follow_mount: false});
                if (!FS.isMountpoint(lookup.node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach((function (hash) {
                    var current = FS.nameTable[hash];
                    while (current) {
                        var next = current.name_next;
                        if (mounts.indexOf(current.mount) !== -1) {
                            FS.destroyNode(current)
                        }
                        current = next
                    }
                }));
                node.mounted = null;
                var idx = node.mount.mounts.indexOf(mount);
                assert(idx !== -1);
                node.mount.mounts.splice(idx, 1)
            }),
            lookup: (function (parent, name) {
                return parent.node_ops.lookup(parent, name)
            }),
            mknod: (function (path, mode, dev) {
                var lookup = FS.lookupPath(path, {parent: true});
                var parent = lookup.node;
                var name = PATH.basename(path);
                var err = FS.mayCreate(parent, name);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.mknod) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return parent.node_ops.mknod(parent, name, mode, dev)
            }),
            create: (function (path, mode) {
                mode = mode !== undefined ? mode : 438;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0)
            }),
            mkdir: (function (path, mode) {
                mode = mode !== undefined ? mode : 511;
                mode &= 511 | 512;
                mode |= 16384;
                return FS.mknod(path, mode, 0)
            }),
            mkdev: (function (path, mode, dev) {
                if (typeof dev === "undefined") {
                    dev = mode;
                    mode = 438
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev)
            }),
            symlink: (function (oldpath, newpath) {
                var lookup = FS.lookupPath(newpath, {parent: true});
                var parent = lookup.node;
                var newname = PATH.basename(newpath);
                var err = FS.mayCreate(parent, newname);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.symlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return parent.node_ops.symlink(parent, newname, oldpath)
            }),
            rename: (function (old_path, new_path) {
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                var lookup, old_dir, new_dir;
                try {
                    lookup = FS.lookupPath(old_path, {parent: true});
                    old_dir = lookup.node;
                    lookup = FS.lookupPath(new_path, {parent: true});
                    new_dir = lookup.node
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                if (old_dir.mount !== new_dir.mount) {
                    throw new FS.ErrnoError(ERRNO_CODES.EXDEV)
                }
                var old_node = FS.lookupNode(old_dir, old_name);
                var relative = PATH.relative(old_path, new_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                relative = PATH.relative(new_path, old_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                }
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {
                }
                if (old_node === new_node) {
                    return
                }
                var isdir = FS.isDir(old_node.mode);
                var err = FS.mayDelete(old_dir, old_name, isdir);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!old_dir.node_ops.rename) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                if (new_dir !== old_dir) {
                    err = FS.nodePermissions(old_dir, "w");
                    if (err) {
                        throw new FS.ErrnoError(err)
                    }
                }
                try {
                    if (FS.trackingDelegate["willMovePath"]) {
                        FS.trackingDelegate["willMovePath"](old_path, new_path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
                }
                FS.hashRemoveNode(old_node);
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name)
                } catch (e) {
                    throw e
                } finally {
                    FS.hashAddNode(old_node)
                }
                try {
                    if (FS.trackingDelegate["onMovePath"])FS.trackingDelegate["onMovePath"](old_path, new_path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
                }
            }),
            rmdir: (function (path) {
                var lookup = FS.lookupPath(path, {parent: true});
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, true);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.rmdir) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
                }
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
                }
            }),
            readdir: (function (path) {
                var lookup = FS.lookupPath(path, {follow: true});
                var node = lookup.node;
                if (!node.node_ops.readdir) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                }
                return node.node_ops.readdir(node)
            }),
            unlink: (function (path) {
                var lookup = FS.lookupPath(path, {parent: true});
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, false);
                if (err) {
                    if (err === ERRNO_CODES.EISDIR)err = ERRNO_CODES.EPERM;
                    throw new FS.ErrnoError(err)
                }
                if (!parent.node_ops.unlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
                }
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
                }
            }),
            readlink: (function (path) {
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link.node_ops.readlink) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                return link.node_ops.readlink(link)
            }),
            stat: (function (path, dontFollow) {
                var lookup = FS.lookupPath(path, {follow: !dontFollow});
                var node = lookup.node;
                if (!node.node_ops.getattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                return node.node_ops.getattr(node)
            }),
            lstat: (function (path) {
                return FS.stat(path, true)
            }),
            chmod: (function (path, mode, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {follow: !dontFollow});
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                node.node_ops.setattr(node, {mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now()})
            }),
            lchmod: (function (path, mode) {
                FS.chmod(path, mode, true)
            }),
            fchmod: (function (fd, mode) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                FS.chmod(stream.node, mode)
            }),
            chown: (function (path, uid, gid, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {follow: !dontFollow});
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                node.node_ops.setattr(node, {timestamp: Date.now()})
            }),
            lchown: (function (path, uid, gid) {
                FS.chown(path, uid, gid, true)
            }),
            fchown: (function (fd, uid, gid) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                FS.chown(stream.node, uid, gid)
            }),
            truncate: (function (path, len) {
                if (len < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, {follow: true});
                    node = lookup.node
                } else {
                    node = path
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                }
                if (FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!FS.isFile(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var err = FS.nodePermissions(node, "w");
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                node.node_ops.setattr(node, {size: len, timestamp: Date.now()})
            }),
            ftruncate: (function (fd, len) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                FS.truncate(stream.node, len)
            }),
            utime: (function (path, atime, mtime) {
                var lookup = FS.lookupPath(path, {follow: true});
                var node = lookup.node;
                node.node_ops.setattr(node, {timestamp: Math.max(atime, mtime)})
            }),
            open: (function (path, flags, mode, fd_start, fd_end) {
                if (path === "") {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
                mode = typeof mode === "undefined" ? 438 : mode;
                if (flags & 64) {
                    mode = mode & 4095 | 32768
                } else {
                    mode = 0
                }
                var node;
                if (typeof path === "object") {
                    node = path
                } else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, {follow: !(flags & 131072)});
                        node = lookup.node
                    } catch (e) {
                    }
                }
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) {
                            throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                        }
                    } else {
                        node = FS.mknod(path, mode, 0)
                    }
                }
                if (!node) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                }
                if (FS.isChrdev(node.mode)) {
                    flags &= ~512
                }
                var err = FS.mayOpen(node, flags);
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                if (flags & 512) {
                    FS.truncate(node, 0)
                }
                flags &= ~(128 | 512);
                var stream = FS.createStream({
                    node: node,
                    path: FS.getPath(node),
                    flags: flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    ungotten: [],
                    error: false
                }, fd_start, fd_end);
                if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream)
                }
                if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!FS.readFiles)FS.readFiles = {};
                    if (!(path in FS.readFiles)) {
                        FS.readFiles[path] = 1;
                        Module["printErr"]("read file: " + path)
                    }
                }
                try {
                    if (FS.trackingDelegate["onOpenFile"]) {
                        var trackingFlags = 0;
                        if ((flags & 2097155) !== 1) {
                            trackingFlags |= FS.tracking.openFlags.READ
                        }
                        if ((flags & 2097155) !== 0) {
                            trackingFlags |= FS.tracking.openFlags.WRITE
                        }
                        FS.trackingDelegate["onOpenFile"](path, trackingFlags)
                    }
                } catch (e) {
                    console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
                }
                return stream
            }),
            close: (function (stream) {
                try {
                    if (stream.stream_ops.close) {
                        stream.stream_ops.close(stream)
                    }
                } catch (e) {
                    throw e
                } finally {
                    FS.closeStream(stream.fd)
                }
            }),
            llseek: (function (stream, offset, whence) {
                if (!stream.seekable || !stream.stream_ops.llseek) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                return stream.stream_ops.llseek(stream, offset, whence)
            }),
            read: (function (stream, buffer, offset, length, position) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!stream.stream_ops.read) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                var seeking = true;
                if (typeof position === "undefined") {
                    position = stream.position;
                    seeking = false
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                if (!seeking)stream.position += bytesRead;
                return bytesRead
            }),
            write: (function (stream, buffer, offset, length, position, canOwn) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
                }
                if (!stream.stream_ops.write) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if (stream.flags & 1024) {
                    FS.llseek(stream, 0, 2)
                }
                var seeking = true;
                if (typeof position === "undefined") {
                    position = stream.position;
                    seeking = false
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                }
                var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                if (!seeking)stream.position += bytesWritten;
                try {
                    if (stream.path && FS.trackingDelegate["onWriteToFile"])FS.trackingDelegate["onWriteToFile"](stream.path)
                } catch (e) {
                    console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message)
                }
                return bytesWritten
            }),
            allocate: (function (stream, offset, length) {
                if (offset < 0 || length <= 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EBADF)
                }
                if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                }
                if (!stream.stream_ops.allocate) {
                    throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
                }
                stream.stream_ops.allocate(stream, offset, length)
            }),
            mmap: (function (stream, buffer, offset, length, position, prot, flags) {
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(ERRNO_CODES.EACCES)
                }
                if (!stream.stream_ops.mmap) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
                }
                return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
            }),
            ioctl: (function (stream, cmd, arg) {
                if (!stream.stream_ops.ioctl) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)
                }
                return stream.stream_ops.ioctl(stream, cmd, arg)
            }),
            readFile: (function (path, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "r";
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error('Invalid encoding type "' + opts.encoding + '"')
                }
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") {
                    ret = "";
                    var utf8 = new Runtime.UTF8Processor;
                    for (var i = 0; i < length; i++) {
                        ret += utf8.processCChar(buf[i])
                    }
                } else if (opts.encoding === "binary") {
                    ret = buf
                }
                FS.close(stream);
                return ret
            }),
            writeFile: (function (path, data, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "w";
                opts.encoding = opts.encoding || "utf8";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error('Invalid encoding type "' + opts.encoding + '"')
                }
                var stream = FS.open(path, opts.flags, opts.mode);
                if (opts.encoding === "utf8") {
                    var utf8 = new Runtime.UTF8Processor;
                    var buf = new Uint8Array(utf8.processJSString(data));
                    FS.write(stream, buf, 0, buf.length, 0, opts.canOwn)
                } else if (opts.encoding === "binary") {
                    FS.write(stream, data, 0, data.length, 0, opts.canOwn)
                }
                FS.close(stream)
            }),
            cwd: (function () {
                return FS.currentPath
            }),
            chdir: (function (path) {
                var lookup = FS.lookupPath(path, {follow: true});
                if (!FS.isDir(lookup.node.mode)) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                }
                var err = FS.nodePermissions(lookup.node, "x");
                if (err) {
                    throw new FS.ErrnoError(err)
                }
                FS.currentPath = lookup.path
            }),
            createDefaultDirectories: (function () {
                FS.mkdir("/tmp")
            }),
            createDefaultDevices: (function () {
                FS.mkdir("/dev");
                FS.registerDevice(FS.makedev(1, 3), {
                    read: (function () {
                        return 0
                    }), write: (function () {
                        return 0
                    })
                });
                FS.mkdev("/dev/null", FS.makedev(1, 3));
                TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                FS.mkdev("/dev/tty", FS.makedev(5, 0));
                FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                var random_device;
                if (typeof crypto !== "undefined") {
                    var randomBuffer = new Uint8Array(1);
                    random_device = (function () {
                        crypto.getRandomValues(randomBuffer);
                        return randomBuffer[0]
                    })
                } else if (ENVIRONMENT_IS_NODE) {
                    random_device = (function () {
                        return require("crypto").randomBytes(1)[0]
                    })
                } else {
                    random_device = (function () {
                        return Math.floor(Math.random() * 256)
                    })
                }
                FS.createDevice("/dev", "random", random_device);
                FS.createDevice("/dev", "urandom", random_device);
                FS.mkdir("/dev/shm");
                FS.mkdir("/dev/shm/tmp")
            }),
            createStandardStreams: (function () {
                if (Module["stdin"]) {
                    FS.createDevice("/dev", "stdin", Module["stdin"])
                } else {
                    FS.symlink("/dev/tty", "/dev/stdin")
                }
                if (Module["stdout"]) {
                    FS.createDevice("/dev", "stdout", null, Module["stdout"])
                } else {
                    FS.symlink("/dev/tty", "/dev/stdout")
                }
                if (Module["stderr"]) {
                    FS.createDevice("/dev", "stderr", null, Module["stderr"])
                } else {
                    FS.symlink("/dev/tty1", "/dev/stderr")
                }
                var stdin = FS.open("/dev/stdin", "r");
                HEAP32[_stdin >> 2] = FS.getPtrForStream(stdin);
                assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
                var stdout = FS.open("/dev/stdout", "w");
                HEAP32[_stdout >> 2] = FS.getPtrForStream(stdout);
                assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
                var stderr = FS.open("/dev/stderr", "w");
                HEAP32[_stderr >> 2] = FS.getPtrForStream(stderr);
                assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")")
            }),
            ensureErrnoError: (function () {
                if (FS.ErrnoError)return;
                FS.ErrnoError = function ErrnoError(errno) {
                    this.errno = errno;
                    for (var key in ERRNO_CODES) {
                        if (ERRNO_CODES[key] === errno) {
                            this.code = key;
                            break
                        }
                    }
                    this.message = ERRNO_MESSAGES[errno]
                };
                FS.ErrnoError.prototype = new Error;
                FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                [ERRNO_CODES.ENOENT].forEach((function (code) {
                    FS.genericErrors[code] = new FS.ErrnoError(code);
                    FS.genericErrors[code].stack = "<generic error, no stack>"
                }))
            }),
            staticInit: (function () {
                FS.ensureErrnoError();
                FS.nameTable = new Array(4096);
                FS.mount(MEMFS, {}, "/");
                FS.createDefaultDirectories();
                FS.createDefaultDevices()
            }),
            init: (function (input, output, error) {
                assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
                FS.init.initialized = true;
                FS.ensureErrnoError();
                Module["stdin"] = input || Module["stdin"];
                Module["stdout"] = output || Module["stdout"];
                Module["stderr"] = error || Module["stderr"];
                FS.createStandardStreams()
            }),
            quit: (function () {
                FS.init.initialized = false;
                for (var i = 0; i < FS.streams.length; i++) {
                    var stream = FS.streams[i];
                    if (!stream) {
                        continue
                    }
                    FS.close(stream)
                }
            }),
            getMode: (function (canRead, canWrite) {
                var mode = 0;
                if (canRead)mode |= 292 | 73;
                if (canWrite)mode |= 146;
                return mode
            }),
            joinPath: (function (parts, forceRelative) {
                var path = PATH.join.apply(null, parts);
                if (forceRelative && path[0] == "/")path = path.substr(1);
                return path
            }),
            absolutePath: (function (relative, base) {
                return PATH.resolve(base, relative)
            }),
            standardizePath: (function (path) {
                return PATH.normalize(path)
            }),
            findObject: (function (path, dontResolveLastLink) {
                var ret = FS.analyzePath(path, dontResolveLastLink);
                if (ret.exists) {
                    return ret.object
                } else {
                    ___setErrNo(ret.error);
                    return null
                }
            }),
            analyzePath: (function (path, dontResolveLastLink) {
                try {
                    var lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
                    path = lookup.path
                } catch (e) {
                }
                var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null
                };
                try {
                    var lookup = FS.lookupPath(path, {parent: true});
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, {follow: !dontResolveLastLink});
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === "/"
                } catch (e) {
                    ret.error = e.errno
                }
                return ret
            }),
            createFolder: (function (parent, name, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(canRead, canWrite);
                return FS.mkdir(path, mode)
            }),
            createPath: (function (parent, path, canRead, canWrite) {
                parent = typeof parent === "string" ? parent : FS.getPath(parent);
                var parts = path.split("/").reverse();
                while (parts.length) {
                    var part = parts.pop();
                    if (!part)continue;
                    var current = PATH.join2(parent, part);
                    try {
                        FS.mkdir(current)
                    } catch (e) {
                    }
                    parent = current
                }
                return current
            }),
            createFile: (function (parent, name, properties, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(canRead, canWrite);
                return FS.create(path, mode)
            }),
            createDataFile: (function (parent, name, data, canRead, canWrite, canOwn) {
                var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
                var mode = FS.getMode(canRead, canWrite);
                var node = FS.create(path, mode);
                if (data) {
                    if (typeof data === "string") {
                        var arr = new Array(data.length);
                        for (var i = 0, len = data.length; i < len; ++i)arr[i] = data.charCodeAt(i);
                        data = arr
                    }
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, "w");
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode)
                }
                return node
            }),
            createDevice: (function (parent, name, input, output) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(!!input, !!output);
                if (!FS.createDevice.major)FS.createDevice.major = 64;
                var dev = FS.makedev(FS.createDevice.major++, 0);
                FS.registerDevice(dev, {
                    open: (function (stream) {
                        stream.seekable = false
                    }), close: (function (stream) {
                        if (output && output.buffer && output.buffer.length) {
                            output(10)
                        }
                    }), read: (function (stream, buffer, offset, length, pos) {
                        var bytesRead = 0;
                        for (var i = 0; i < length; i++) {
                            var result;
                            try {
                                result = input()
                            } catch (e) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                            if (result === undefined && bytesRead === 0) {
                                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                            }
                            if (result === null || result === undefined)break;
                            bytesRead++;
                            buffer[offset + i] = result
                        }
                        if (bytesRead) {
                            stream.node.timestamp = Date.now()
                        }
                        return bytesRead
                    }), write: (function (stream, buffer, offset, length, pos) {
                        for (var i = 0; i < length; i++) {
                            try {
                                output(buffer[offset + i])
                            } catch (e) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                        }
                        if (length) {
                            stream.node.timestamp = Date.now()
                        }
                        return i
                    })
                });
                return FS.mkdev(path, mode, dev)
            }),
            createLink: (function (parent, name, target, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                return FS.symlink(target, path)
            }),
            forceLoadFile: (function (obj) {
                if (obj.isDevice || obj.isFolder || obj.link || obj.contents)return true;
                var success = true;
                if (typeof XMLHttpRequest !== "undefined") {
                    throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
                } else if (Module["read"]) {
                    try {
                        obj.contents = intArrayFromString(Module["read"](obj.url), true);
                        obj.usedBytes = obj.contents.length
                    } catch (e) {
                        success = false
                    }
                } else {
                    throw new Error("Cannot load without read() or XMLHttpRequest.")
                }
                if (!success)___setErrNo(ERRNO_CODES.EIO);
                return success
            }),
            createLazyFile: (function (parent, name, url, canRead, canWrite) {
                function LazyUint8Array() {
                    this.lengthKnown = false;
                    this.chunks = []
                }

                LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
                    if (idx > this.length - 1 || idx < 0) {
                        return undefined
                    }
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = Math.floor(idx / this.chunkSize);
                    return this.getter(chunkNum)[chunkOffset]
                };
                LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
                    this.getter = getter
                };
                LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
                    var xhr = new XMLHttpRequest;
                    xhr.open("HEAD", url, false);
                    xhr.send(null);
                    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                    var header;
                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                    var chunkSize = 1024 * 1024;
                    if (!hasByteServing)chunkSize = datalength;
                    var doXHR = (function (from, to) {
                        if (from > to)throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                        if (to > datalength - 1)throw new Error("only " + datalength + " bytes available! programmer error!");
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, false);
                        if (datalength !== chunkSize)xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                        if (typeof Uint8Array != "undefined")xhr.responseType = "arraybuffer";
                        if (xhr.overrideMimeType) {
                            xhr.overrideMimeType("text/plain; charset=x-user-defined")
                        }
                        xhr.send(null);
                        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                        if (xhr.response !== undefined) {
                            return new Uint8Array(xhr.response || [])
                        } else {
                            return intArrayFromString(xhr.responseText || "", true)
                        }
                    });
                    var lazyArray = this;
                    lazyArray.setDataGetter((function (chunkNum) {
                        var start = chunkNum * chunkSize;
                        var end = (chunkNum + 1) * chunkSize - 1;
                        end = Math.min(end, datalength - 1);
                        if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                            lazyArray.chunks[chunkNum] = doXHR(start, end)
                        }
                        if (typeof lazyArray.chunks[chunkNum] === "undefined")throw new Error("doXHR failed!");
                        return lazyArray.chunks[chunkNum]
                    }));
                    this._length = datalength;
                    this._chunkSize = chunkSize;
                    this.lengthKnown = true
                };
                if (typeof XMLHttpRequest !== "undefined") {
                    if (!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var lazyArray = new LazyUint8Array;
                    Object.defineProperty(lazyArray, "length", {
                        get: (function () {
                            if (!this.lengthKnown) {
                                this.cacheLength()
                            }
                            return this._length
                        })
                    });
                    Object.defineProperty(lazyArray, "chunkSize", {
                        get: (function () {
                            if (!this.lengthKnown) {
                                this.cacheLength()
                            }
                            return this._chunkSize
                        })
                    });
                    var properties = {isDevice: false, contents: lazyArray}
                } else {
                    var properties = {isDevice: false, url: url}
                }
                var node = FS.createFile(parent, name, properties, canRead, canWrite);
                if (properties.contents) {
                    node.contents = properties.contents
                } else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url
                }
                Object.defineProperty(node, "usedBytes", {
                    get: (function () {
                        return this.contents.length
                    })
                });
                var stream_ops = {};
                var keys = Object.keys(node.stream_ops);
                keys.forEach((function (key) {
                    var fn = node.stream_ops[key];
                    stream_ops[key] = function forceLoadLazyFile() {
                        if (!FS.forceLoadFile(node)) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        return fn.apply(null, arguments)
                    }
                }));
                stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
                    if (!FS.forceLoadFile(node)) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                    var contents = stream.node.contents;
                    if (position >= contents.length)return 0;
                    var size = Math.min(contents.length - position, length);
                    assert(size >= 0);
                    if (contents.slice) {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents[position + i]
                        }
                    } else {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents.get(position + i)
                        }
                    }
                    return size
                };
                node.stream_ops = stream_ops;
                return node
            }),
            createPreloadedFile: (function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
                Browser.init();
                var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;

                function processData(byteArray) {
                    function finish(byteArray) {
                        if (!dontCreateFile) {
                            FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                        }
                        if (onload)onload();
                        removeRunDependency("cp " + fullname)
                    }

                    var handled = false;
                    Module["preloadPlugins"].forEach((function (plugin) {
                        if (handled)return;
                        if (plugin["canHandle"](fullname)) {
                            plugin["handle"](byteArray, fullname, finish, (function () {
                                if (onerror)onerror();
                                removeRunDependency("cp " + fullname)
                            }));
                            handled = true
                        }
                    }));
                    if (!handled)finish(byteArray)
                }

                addRunDependency("cp " + fullname);
                if (typeof url == "string") {
                    Browser.asyncLoad(url, (function (byteArray) {
                        processData(byteArray)
                    }), onerror)
                } else {
                    processData(url)
                }
            }),
            indexedDB: (function () {
                return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
            }),
            DB_NAME: (function () {
                return "EM_FS_" + window.location.pathname
            }),
            DB_VERSION: 20,
            DB_STORE_NAME: "FILE_DATA",
            saveFilesToDB: (function (paths, onload, onerror) {
                onload = onload || (function () {
                    });
                onerror = onerror || (function () {
                    });
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
                } catch (e) {
                    return onerror(e)
                }
                openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
                    console.log("creating db");
                    var db = openRequest.result;
                    db.createObjectStore(FS.DB_STORE_NAME)
                };
                openRequest.onsuccess = function openRequest_onsuccess() {
                    var db = openRequest.result;
                    var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0, fail = 0, total = paths.length;

                    function finish() {
                        if (fail == 0)onload(); else onerror()
                    }

                    paths.forEach((function (path) {
                        var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                        putRequest.onsuccess = function putRequest_onsuccess() {
                            ok++;
                            if (ok + fail == total)finish()
                        };
                        putRequest.onerror = function putRequest_onerror() {
                            fail++;
                            if (ok + fail == total)finish()
                        }
                    }));
                    transaction.onerror = onerror
                };
                openRequest.onerror = onerror
            }),
            loadFilesFromDB: (function (paths, onload, onerror) {
                onload = onload || (function () {
                    });
                onerror = onerror || (function () {
                    });
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
                } catch (e) {
                    return onerror(e)
                }
                openRequest.onupgradeneeded = onerror;
                openRequest.onsuccess = function openRequest_onsuccess() {
                    var db = openRequest.result;
                    try {
                        var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
                    } catch (e) {
                        onerror(e);
                        return
                    }
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0, fail = 0, total = paths.length;

                    function finish() {
                        if (fail == 0)onload(); else onerror()
                    }

                    paths.forEach((function (path) {
                        var getRequest = files.get(path);
                        getRequest.onsuccess = function getRequest_onsuccess() {
                            if (FS.analyzePath(path).exists) {
                                FS.unlink(path)
                            }
                            FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                            ok++;
                            if (ok + fail == total)finish()
                        };
                        getRequest.onerror = function getRequest_onerror() {
                            fail++;
                            if (ok + fail == total)finish()
                        }
                    }));
                    transaction.onerror = onerror
                };
                openRequest.onerror = onerror
            })
        };
        var PATH = {
            splitPath: (function (filename) {
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1)
            }), normalizeArray: (function (parts, allowAboveRoot) {
                var up = 0;
                for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === ".") {
                        parts.splice(i, 1)
                    } else if (last === "..") {
                        parts.splice(i, 1);
                        up++
                    } else if (up) {
                        parts.splice(i, 1);
                        up--
                    }
                }
                if (allowAboveRoot) {
                    for (; up--; up) {
                        parts.unshift("..")
                    }
                }
                return parts
            }), normalize: (function (path) {
                var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
                path = PATH.normalizeArray(path.split("/").filter((function (p) {
                    return !!p
                })), !isAbsolute).join("/");
                if (!path && !isAbsolute) {
                    path = "."
                }
                if (path && trailingSlash) {
                    path += "/"
                }
                return (isAbsolute ? "/" : "") + path
            }), dirname: (function (path) {
                var result = PATH.splitPath(path), root = result[0], dir = result[1];
                if (!root && !dir) {
                    return "."
                }
                if (dir) {
                    dir = dir.substr(0, dir.length - 1)
                }
                return root + dir
            }), basename: (function (path) {
                if (path === "/")return "/";
                var lastSlash = path.lastIndexOf("/");
                if (lastSlash === -1)return path;
                return path.substr(lastSlash + 1)
            }), extname: (function (path) {
                return PATH.splitPath(path)[3]
            }), join: (function () {
                var paths = Array.prototype.slice.call(arguments, 0);
                return PATH.normalize(paths.join("/"))
            }), join2: (function (l, r) {
                return PATH.normalize(l + "/" + r)
            }), resolve: (function () {
                var resolvedPath = "", resolvedAbsolute = false;
                for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    if (typeof path !== "string") {
                        throw new TypeError("Arguments to path.resolve must be strings")
                    } else if (!path) {
                        continue
                    }
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = path.charAt(0) === "/"
                }
                resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function (p) {
                    return !!p
                })), !resolvedAbsolute).join("/");
                return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
            }), relative: (function (from, to) {
                from = PATH.resolve(from).substr(1);
                to = PATH.resolve(to).substr(1);
                function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                        if (arr[start] !== "")break
                    }
                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                        if (arr[end] !== "")break
                    }
                    if (start > end)return [];
                    return arr.slice(start, end - start + 1)
                }

                var fromParts = trim(from.split("/"));
                var toParts = trim(to.split("/"));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        samePartsLength = i;
                        break
                    }
                }
                var outputParts = [];
                for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push("..")
                }
                outputParts = outputParts.concat(toParts.slice(samePartsLength));
                return outputParts.join("/")
            })
        };
        var Browser = {
            mainLoop: {
                scheduler: null,
                method: "",
                shouldPause: false,
                paused: false,
                queue: [],
                pause: (function () {
                    Browser.mainLoop.shouldPause = true
                }),
                resume: (function () {
                    if (Browser.mainLoop.paused) {
                        Browser.mainLoop.paused = false;
                        Browser.mainLoop.scheduler()
                    }
                    Browser.mainLoop.shouldPause = false
                }),
                updateStatus: (function () {
                    if (Module["setStatus"]) {
                        var message = Module["statusMessage"] || "Please wait...";
                        var remaining = Browser.mainLoop.remainingBlockers;
                        var expected = Browser.mainLoop.expectedBlockers;
                        if (remaining) {
                            if (remaining < expected) {
                                Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                            } else {
                                Module["setStatus"](message)
                            }
                        } else {
                            Module["setStatus"]("")
                        }
                    }
                }),
                runIter: (function (func) {
                    if (ABORT)return;
                    if (Module["preMainLoop"]) {
                        var preRet = Module["preMainLoop"]();
                        if (preRet === false) {
                            return
                        }
                    }
                    try {
                        func()
                    } catch (e) {
                        if (e instanceof ExitStatus) {
                            return
                        } else {
                            if (e && typeof e === "object" && e.stack)Module.printErr("exception thrown: " + [e, e.stack]);
                            throw e
                        }
                    }
                    if (Module["postMainLoop"])Module["postMainLoop"]()
                })
            },
            isFullScreen: false,
            pointerLock: false,
            moduleContextCreatedCallbacks: [],
            workers: [],
            init: (function () {
                if (!Module["preloadPlugins"])Module["preloadPlugins"] = [];
                if (Browser.initted)return;
                Browser.initted = true;
                try {
                    new Blob;
                    Browser.hasBlobConstructor = true
                } catch (e) {
                    Browser.hasBlobConstructor = false;
                    console.log("warning: no blob constructor, cannot create blobs with mimetypes")
                }
                Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
                Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
                if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
                    console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
                    Module.noImageDecoding = true
                }
                var imagePlugin = {};
                imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
                    return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
                };
                imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
                    var b = null;
                    if (Browser.hasBlobConstructor) {
                        try {
                            b = new Blob([byteArray], {type: Browser.getMimetype(name)});
                            if (b.size !== byteArray.length) {
                                b = new Blob([(new Uint8Array(byteArray)).buffer], {type: Browser.getMimetype(name)})
                            }
                        } catch (e) {
                            Runtime.warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                        }
                    }
                    if (!b) {
                        var bb = new Browser.BlobBuilder;
                        bb.append((new Uint8Array(byteArray)).buffer);
                        b = bb.getBlob()
                    }
                    var url = Browser.URLObject.createObjectURL(b);
                    var img = new Image;
                    img.onload = function img_onload() {
                        assert(img.complete, "Image " + name + " could not be decoded");
                        var canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        Module["preloadedImages"][name] = canvas;
                        Browser.URLObject.revokeObjectURL(url);
                        if (onload)onload(byteArray)
                    };
                    img.onerror = function img_onerror(event) {
                        console.log("Image " + url + " could not be decoded");
                        if (onerror)onerror()
                    };
                    img.src = url
                };
                Module["preloadPlugins"].push(imagePlugin);
                var audioPlugin = {};
                audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
                    return !Module.noAudioDecoding && name.substr(-4) in {".ogg": 1, ".wav": 1, ".mp3": 1}
                };
                audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
                    var done = false;

                    function finish(audio) {
                        if (done)return;
                        done = true;
                        Module["preloadedAudios"][name] = audio;
                        if (onload)onload(byteArray)
                    }

                    function fail() {
                        if (done)return;
                        done = true;
                        Module["preloadedAudios"][name] = new Audio;
                        if (onerror)onerror()
                    }

                    if (Browser.hasBlobConstructor) {
                        try {
                            var b = new Blob([byteArray], {type: Browser.getMimetype(name)})
                        } catch (e) {
                            return fail()
                        }
                        var url = Browser.URLObject.createObjectURL(b);
                        var audio = new Audio;
                        audio.addEventListener("canplaythrough", (function () {
                            finish(audio)
                        }), false);
                        audio.onerror = function audio_onerror(event) {
                            if (done)return;
                            console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");
                            function encode64(data) {
                                var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                                var PAD = "=";
                                var ret = "";
                                var leftchar = 0;
                                var leftbits = 0;
                                for (var i = 0; i < data.length; i++) {
                                    leftchar = leftchar << 8 | data[i];
                                    leftbits += 8;
                                    while (leftbits >= 6) {
                                        var curr = leftchar >> leftbits - 6 & 63;
                                        leftbits -= 6;
                                        ret += BASE[curr]
                                    }
                                }
                                if (leftbits == 2) {
                                    ret += BASE[(leftchar & 3) << 4];
                                    ret += PAD + PAD
                                } else if (leftbits == 4) {
                                    ret += BASE[(leftchar & 15) << 2];
                                    ret += PAD
                                }
                                return ret
                            }

                            audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                            finish(audio)
                        };
                        audio.src = url;
                        Browser.safeSetTimeout((function () {
                            finish(audio)
                        }), 1e4)
                    } else {
                        return fail()
                    }
                };
                Module["preloadPlugins"].push(audioPlugin);
                var canvas = Module["canvas"];

                function pointerLockChange() {
                    Browser.pointerLock = document["pointerLockElement"] === canvas || document["mozPointerLockElement"] === canvas || document["webkitPointerLockElement"] === canvas || document["msPointerLockElement"] === canvas
                }

                if (canvas) {
                    canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (function () {
                        });
                    canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (function () {
                        });
                    canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
                    document.addEventListener("pointerlockchange", pointerLockChange, false);
                    document.addEventListener("mozpointerlockchange", pointerLockChange, false);
                    document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
                    document.addEventListener("mspointerlockchange", pointerLockChange, false);
                    if (Module["elementPointerLock"]) {
                        canvas.addEventListener("click", (function (ev) {
                            if (!Browser.pointerLock && canvas.requestPointerLock) {
                                canvas.requestPointerLock();
                                ev.preventDefault()
                            }
                        }), false)
                    }
                }
            }),
            createContext: (function (canvas, useWebGL, setInModule, webGLContextAttributes) {
                if (useWebGL && Module.ctx)return Module.ctx;
                var ctx;
                var errorInfo = "?";

                function onContextCreationError(event) {
                    errorInfo = event.statusMessage || errorInfo
                }

                try {
                    if (useWebGL) {
                        var contextAttributes = {antialias: false, alpha: false};
                        if (webGLContextAttributes) {
                            for (var attribute in webGLContextAttributes) {
                                contextAttributes[attribute] = webGLContextAttributes[attribute]
                            }
                        }
                        canvas.addEventListener("webglcontextcreationerror", onContextCreationError, false);
                        try {
                            ["experimental-webgl", "webgl"].some((function (webglId) {
                                return ctx = canvas.getContext(webglId, contextAttributes)
                            }))
                        } finally {
                            canvas.removeEventListener("webglcontextcreationerror", onContextCreationError, false)
                        }
                    } else {
                        ctx = canvas.getContext("2d")
                    }
                    if (!ctx)throw":("
                } catch (e) {
                    Module.print("Could not create canvas: " + [errorInfo, e]);
                    return null
                }
                if (useWebGL) {
                    canvas.style.backgroundColor = "black"
                }
                if (setInModule) {
                    if (!useWebGL)assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
                    Module.ctx = ctx;
                    if (useWebGL)GLctx = ctx;
                    Module.useWebGL = useWebGL;
                    Browser.moduleContextCreatedCallbacks.forEach((function (callback) {
                        callback()
                    }));
                    Browser.init()
                }
                return ctx
            }),
            destroyContext: (function (canvas, useWebGL, setInModule) {
            }),
            fullScreenHandlersInstalled: false,
            lockPointer: undefined,
            resizeCanvas: undefined,
            requestFullScreen: (function (lockPointer, resizeCanvas) {
                Browser.lockPointer = lockPointer;
                Browser.resizeCanvas = resizeCanvas;
                if (typeof Browser.lockPointer === "undefined")Browser.lockPointer = true;
                if (typeof Browser.resizeCanvas === "undefined")Browser.resizeCanvas = false;
                var canvas = Module["canvas"];

                function fullScreenChange() {
                    Browser.isFullScreen = false;
                    var canvasContainer = canvas.parentNode;
                    if ((document["webkitFullScreenElement"] || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["mozFullscreenElement"] || document["fullScreenElement"] || document["fullscreenElement"] || document["msFullScreenElement"] || document["msFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                        canvas.cancelFullScreen = document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["webkitCancelFullScreen"] || document["msExitFullscreen"] || document["exitFullscreen"] || (function () {
                            });
                        canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
                        if (Browser.lockPointer)canvas.requestPointerLock();
                        Browser.isFullScreen = true;
                        if (Browser.resizeCanvas)Browser.setFullScreenCanvasSize()
                    } else {
                        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                        canvasContainer.parentNode.removeChild(canvasContainer);
                        if (Browser.resizeCanvas)Browser.setWindowedCanvasSize()
                    }
                    if (Module["onFullScreen"])Module["onFullScreen"](Browser.isFullScreen);
                    Browser.updateCanvasDimensions(canvas)
                }

                if (!Browser.fullScreenHandlersInstalled) {
                    Browser.fullScreenHandlersInstalled = true;
                    document.addEventListener("fullscreenchange", fullScreenChange, false);
                    document.addEventListener("mozfullscreenchange", fullScreenChange, false);
                    document.addEventListener("webkitfullscreenchange", fullScreenChange, false);
                    document.addEventListener("MSFullscreenChange", fullScreenChange, false)
                }
                var canvasContainer = document.createElement("div");
                canvas.parentNode.insertBefore(canvasContainer, canvas);
                canvasContainer.appendChild(canvas);
                canvasContainer.requestFullScreen = canvasContainer["requestFullScreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullScreen"] ? (function () {
                        canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
                    }) : null);
                canvasContainer.requestFullScreen()
            }),
            nextRAF: 0,
            fakeRequestAnimationFrame: (function (func) {
                var now = Date.now();
                if (Browser.nextRAF === 0) {
                    Browser.nextRAF = now + 1e3 / 60
                } else {
                    while (now + 2 >= Browser.nextRAF) {
                        Browser.nextRAF += 1e3 / 60
                    }
                }
                var delay = Math.max(Browser.nextRAF - now, 0);
                setTimeout(func, delay)
            }),
            requestAnimationFrame: function requestAnimationFrame(func) {
                if (typeof window === "undefined") {
                    Browser.fakeRequestAnimationFrame(func)
                } else {
                    if (!window.requestAnimationFrame) {
                        window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame
                    }
                    window.requestAnimationFrame(func)
                }
            },
            safeCallback: (function (func) {
                return (function () {
                    if (!ABORT)return func.apply(null, arguments)
                })
            }),
            safeRequestAnimationFrame: (function (func) {
                return Browser.requestAnimationFrame((function () {
                    if (!ABORT)func()
                }))
            }),
            safeSetTimeout: (function (func, timeout) {
                Module["noExitRuntime"] = true;
                return setTimeout((function () {
                    if (!ABORT)func()
                }), timeout)
            }),
            safeSetInterval: (function (func, timeout) {
                Module["noExitRuntime"] = true;
                return setInterval((function () {
                    if (!ABORT)func()
                }), timeout)
            }),
            getMimetype: (function (name) {
                return {
                    "jpg": "image/jpeg",
                    "jpeg": "image/jpeg",
                    "png": "image/png",
                    "bmp": "image/bmp",
                    "ogg": "audio/ogg",
                    "wav": "audio/wav",
                    "mp3": "audio/mpeg"
                }[name.substr(name.lastIndexOf(".") + 1)]
            }),
            getUserMedia: (function (func) {
                if (!window.getUserMedia) {
                    window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
                }
                window.getUserMedia(func)
            }),
            getMovementX: (function (event) {
                return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
            }),
            getMovementY: (function (event) {
                return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
            }),
            getMouseWheelDelta: (function (event) {
                var delta = 0;
                switch (event.type) {
                    case"DOMMouseScroll":
                        delta = event.detail;
                        break;
                    case"mousewheel":
                        delta = -event.wheelDelta;
                        break;
                    case"wheel":
                        delta = event.deltaY;
                        break;
                    default:
                        throw"unrecognized mouse wheel event: " + event.type
                }
                return Math.max(-1, Math.min(1, delta))
            }),
            mouseX: 0,
            mouseY: 0,
            mouseMovementX: 0,
            mouseMovementY: 0,
            touches: {},
            lastTouches: {},
            calculateMouseEvent: (function (event) {
                if (Browser.pointerLock) {
                    if (event.type != "mousemove" && "mozMovementX" in event) {
                        Browser.mouseMovementX = Browser.mouseMovementY = 0
                    } else {
                        Browser.mouseMovementX = Browser.getMovementX(event);
                        Browser.mouseMovementY = Browser.getMovementY(event)
                    }
                    if (typeof SDL != "undefined") {
                        Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                        Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
                    } else {
                        Browser.mouseX += Browser.mouseMovementX;
                        Browser.mouseY += Browser.mouseMovementY
                    }
                } else {
                    var rect = Module["canvas"].getBoundingClientRect();
                    var cw = Module["canvas"].width;
                    var ch = Module["canvas"].height;
                    var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
                    var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
                    if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                        var touch = event.touch;
                        if (touch === undefined) {
                            return
                        }
                        var adjustedX = touch.pageX - (scrollX + rect.left);
                        var adjustedY = touch.pageY - (scrollY + rect.top);
                        adjustedX = adjustedX * (cw / rect.width);
                        adjustedY = adjustedY * (ch / rect.height);
                        var coords = {x: adjustedX, y: adjustedY};
                        if (event.type === "touchstart") {
                            Browser.lastTouches[touch.identifier] = coords;
                            Browser.touches[touch.identifier] = coords
                        } else if (event.type === "touchend" || event.type === "touchmove") {
                            Browser.lastTouches[touch.identifier] = Browser.touches[touch.identifier];
                            Browser.touches[touch.identifier] = {x: adjustedX, y: adjustedY}
                        }
                        return
                    }
                    var x = event.pageX - (scrollX + rect.left);
                    var y = event.pageY - (scrollY + rect.top);
                    x = x * (cw / rect.width);
                    y = y * (ch / rect.height);
                    Browser.mouseMovementX = x - Browser.mouseX;
                    Browser.mouseMovementY = y - Browser.mouseY;
                    Browser.mouseX = x;
                    Browser.mouseY = y
                }
            }),
            xhrLoad: (function (url, onload, onerror) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response)
                    } else {
                        onerror()
                    }
                };
                xhr.onerror = onerror;
                xhr.send(null)
            }),
            asyncLoad: (function (url, onload, onerror, noRunDep) {
                Browser.xhrLoad(url, (function (arrayBuffer) {
                    assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
                    onload(new Uint8Array(arrayBuffer));
                    if (!noRunDep)removeRunDependency("al " + url)
                }), (function (event) {
                    if (onerror) {
                        onerror()
                    } else {
                        throw'Loading data file "' + url + '" failed.'
                    }
                }));
                if (!noRunDep)addRunDependency("al " + url)
            }),
            resizeListeners: [],
            updateResizeListeners: (function () {
                var canvas = Module["canvas"];
                Browser.resizeListeners.forEach((function (listener) {
                    listener(canvas.width, canvas.height)
                }))
            }),
            setCanvasSize: (function (width, height, noUpdates) {
                var canvas = Module["canvas"];
                Browser.updateCanvasDimensions(canvas, width, height);
                if (!noUpdates)Browser.updateResizeListeners()
            }),
            windowedWidth: 0,
            windowedHeight: 0,
            setFullScreenCanvasSize: (function () {
                if (typeof SDL != "undefined") {
                    var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
                    flags = flags | 8388608;
                    HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags
                }
                Browser.updateResizeListeners()
            }),
            setWindowedCanvasSize: (function () {
                if (typeof SDL != "undefined") {
                    var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
                    flags = flags & ~8388608;
                    HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags
                }
                Browser.updateResizeListeners()
            }),
            updateCanvasDimensions: (function (canvas, wNative, hNative) {
                if (wNative && hNative) {
                    canvas.widthNative = wNative;
                    canvas.heightNative = hNative
                } else {
                    wNative = canvas.widthNative;
                    hNative = canvas.heightNative
                }
                var w = wNative;
                var h = hNative;
                if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
                    if (w / h < Module["forcedAspectRatio"]) {
                        w = Math.round(h * Module["forcedAspectRatio"])
                    } else {
                        h = Math.round(w / Module["forcedAspectRatio"])
                    }
                }
                if ((document["webkitFullScreenElement"] || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["mozFullscreenElement"] || document["fullScreenElement"] || document["fullscreenElement"] || document["msFullScreenElement"] || document["msFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
                    var factor = Math.min(screen.width / w, screen.height / h);
                    w = Math.round(w * factor);
                    h = Math.round(h * factor)
                }
                if (Browser.resizeCanvas) {
                    if (canvas.width != w)canvas.width = w;
                    if (canvas.height != h)canvas.height = h;
                    if (typeof canvas.style != "undefined") {
                        canvas.style.removeProperty("width");
                        canvas.style.removeProperty("height")
                    }
                } else {
                    if (canvas.width != wNative)canvas.width = wNative;
                    if (canvas.height != hNative)canvas.height = hNative;
                    if (typeof canvas.style != "undefined") {
                        if (w != wNative || h != hNative) {
                            canvas.style.setProperty("width", w + "px", "important");
                            canvas.style.setProperty("height", h + "px", "important")
                        } else {
                            canvas.style.removeProperty("width");
                            canvas.style.removeProperty("height")
                        }
                    }
                }
            })
        };

        function ___assert_fail(condition, filename, line, func) {
            ABORT = true;
            throw"Assertion failed: " + Pointer_stringify(condition) + ", at: " + [filename ? Pointer_stringify(filename) : "unknown filename", line, func ? Pointer_stringify(func) : "unknown function"] + " at " + stackTrace()
        }

        function _time(ptr) {
            var ret = Math.floor(Date.now() / 1e3);
            if (ptr) {
                HEAP32[ptr >> 2] = ret
            }
            return ret
        }

        Module["_strlen"] = _strlen;
        ___errno_state = Runtime.staticAlloc(4);
        HEAP32[___errno_state >> 2] = 0;
        Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) {
            Browser.requestFullScreen(lockPointer, resizeCanvas)
        };
        Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
            Browser.requestAnimationFrame(func)
        };
        Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
            Browser.setCanvasSize(width, height, noUpdates)
        };
        Module["pauseMainLoop"] = function Module_pauseMainLoop() {
            Browser.mainLoop.pause()
        };
        Module["resumeMainLoop"] = function Module_resumeMainLoop() {
            Browser.mainLoop.resume()
        };
        Module["getUserMedia"] = function Module_getUserMedia() {
            Browser.getUserMedia()
        };
        FS.staticInit();
        __ATINIT__.unshift({
            func: (function () {
                if (!Module["noFSInit"] && !FS.init.initialized)FS.init()
            })
        });
        __ATMAIN__.push({
            func: (function () {
                FS.ignorePermissions = false
            })
        });
        __ATEXIT__.push({
            func: (function () {
                FS.quit()
            })
        });
        Module["FS_createFolder"] = FS.createFolder;
        Module["FS_createPath"] = FS.createPath;
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module["FS_createLazyFile"] = FS.createLazyFile;
        Module["FS_createLink"] = FS.createLink;
        Module["FS_createDevice"] = FS.createDevice;
        __ATINIT__.unshift({
            func: (function () {
                TTY.init()
            })
        });
        __ATEXIT__.push({
            func: (function () {
                TTY.shutdown()
            })
        });
        TTY.utf8 = new Runtime.UTF8Processor;
        if (ENVIRONMENT_IS_NODE) {
            var fs = require("fs");
            NODEFS.staticInit()
        }
        STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
        staticSealed = true;
        STACK_MAX = STACK_BASE + 5242880;
        DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
        assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
        var ctlz_i8 = allocate([8, 7, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", ALLOC_DYNAMIC);
        var cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_DYNAMIC);
        var Math_min = Math.min;

        function invoke_vii(index, a1, a2) {
            try {
                Module["dynCall_vii"](index, a1, a2)
            } catch (e) {
                if (typeof e !== "number" && e !== "longjmp")throw e;
                asm["setThrew"](1, 0)
            }
        }

        function asmPrintInt(x, y) {
            Module.print("int " + x + "," + y)
        }

        function asmPrintFloat(x, y) {
            Module.print("float " + x + "," + y)
        }

        var asm = (function (global, env, buffer) {
// EMSCRIPTEN_START_ASM
            "use asm";
            var a = new global.Int8Array(buffer);
            var b = new global.Int16Array(buffer);
            var c = new global.Int32Array(buffer);
            var d = new global.Uint8Array(buffer);
            var e = new global.Uint16Array(buffer);
            var f = new global.Uint32Array(buffer);
            var g = new global.Float32Array(buffer);
            var h = new global.Float64Array(buffer);
            var i = env.STACKTOP | 0;
            var j = env.STACK_MAX | 0;
            var k = env.tempDoublePtr | 0;
            var l = env.ABORT | 0;
            var m = env.cttz_i8 | 0;
            var n = env.ctlz_i8 | 0;
            var o = 0;
            var p = 0;
            var q = 0;
            var r = 0;
            var s = +env.NaN, t = +env.Infinity;
            var u = 0, v = 0, w = 0, x = 0, y = 0.0, z = 0, A = 0, B = 0, C = 0.0;
            var D = 0;
            var E = 0;
            var F = 0;
            var G = 0;
            var H = 0;
            var I = 0;
            var J = 0;
            var K = 0;
            var L = 0;
            var M = 0;
            var N = global.Math.floor;
            var O = global.Math.abs;
            var P = global.Math.sqrt;
            var Q = global.Math.pow;
            var R = global.Math.cos;
            var S = global.Math.sin;
            var T = global.Math.tan;
            var U = global.Math.acos;
            var V = global.Math.asin;
            var W = global.Math.atan;
            var X = global.Math.atan2;
            var Y = global.Math.exp;
            var Z = global.Math.log;
            var _ = global.Math.ceil;
            var $ = global.Math.imul;
            var aa = env.abort;
            var ba = env.assert;
            var ca = env.asmPrintInt;
            var da = env.asmPrintFloat;
            var ea = env.min;
            var fa = env.jsCall;
            var ga = env.invoke_vii;
            var ha = env._fflush;
            var ia = env._sysconf;
            var ja = env._abort;
            var ka = env.___setErrNo;
            var la = env._sbrk;
            var ma = env._time;
            var na = env._emscripten_memcpy_big;
            var oa = env.___assert_fail;
            var pa = env.___errno_location;
            var qa = 0.0;
// EMSCRIPTEN_START_FUNCS
            function sa(a) {
                a = a | 0;
                var b = 0;
                b = i;
                i = i + a | 0;
                i = i + 7 & -8;
                return b | 0
            }

            function ta() {
                return i | 0
            }

            function ua(a) {
                a = a | 0;
                i = a
            }

            function va(a, b) {
                a = a | 0;
                b = b | 0;
                if ((o | 0) == 0) {
                    o = a;
                    p = b
                }
            }

            function wa(b) {
                b = b | 0;
                a[k >> 0] = a[b >> 0];
                a[k + 1 >> 0] = a[b + 1 >> 0];
                a[k + 2 >> 0] = a[b + 2 >> 0];
                a[k + 3 >> 0] = a[b + 3 >> 0]
            }

            function xa(b) {
                b = b | 0;
                a[k >> 0] = a[b >> 0];
                a[k + 1 >> 0] = a[b + 1 >> 0];
                a[k + 2 >> 0] = a[b + 2 >> 0];
                a[k + 3 >> 0] = a[b + 3 >> 0];
                a[k + 4 >> 0] = a[b + 4 >> 0];
                a[k + 5 >> 0] = a[b + 5 >> 0];
                a[k + 6 >> 0] = a[b + 6 >> 0];
                a[k + 7 >> 0] = a[b + 7 >> 0]
            }

            function ya(a) {
                a = a | 0;
                D = a
            }

            function za() {
                return D | 0
            }

            function Aa(b) {
                b = b | 0;
                return a[(c[b >> 2] | 0) + 5 >> 0] & 2 | 0
            }

            function Ba(a) {
                a = a | 0;
                a = c[a >> 2] | 0;
                return (d[a + 15 >> 0] | 0) << 8 | (d[a + 14 >> 0] | 0) | (d[a + 16 >> 0] | 0) << 16 | (d[a + 17 >> 0] | 0) << 24 | 0
            }

            function Ca(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0;
                d = i;
                if ((a | 0) == 0) {
                    j = -1;
                    i = d;
                    return j | 0
                }
                ab(a | 0, 0, 360) | 0;
                c[a + 4 >> 2] = 16384;
                c[a + 24 >> 2] = 1024;
                h = Qa(16384) | 0;
                c[a >> 2] = h;
                f = Qa(4096) | 0;
                g = a + 16 | 0;
                c[g >> 2] = f;
                j = Qa(8192) | 0;
                e = a + 20 | 0;
                c[e >> 2] = j;
                do {
                    if ((h | 0) != 0) {
                        if ((f | 0) == 0 | (j | 0) == 0) {
                            Ra(h);
                            f = c[g >> 2] | 0;
                            break
                        }
                        c[a + 336 >> 2] = b;
                        j = 0;
                        i = d;
                        return j | 0
                    }
                } while (0);
                if ((f | 0) != 0) {
                    Ra(f)
                }
                e = c[e >> 2] | 0;
                if ((e | 0) != 0) {
                    Ra(e)
                }
                ab(a | 0, 0, 360) | 0;
                j = -1;
                i = d;
                return j | 0
            }

            function Da(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0;
                d = i;
                e = a + 24 | 0;
                f = c[e >> 2] | 0;
                if ((f - b | 0) > (c[a + 28 >> 2] | 0)) {
                    h = 0;
                    i = d;
                    return h | 0
                }
                if ((f | 0) > (2147483647 - b | 0)) {
                    if ((a | 0) == 0) {
                        h = -1;
                        i = d;
                        return h | 0
                    }
                    b = c[a >> 2] | 0;
                    if ((b | 0) != 0) {
                        Ra(b)
                    }
                    b = c[a + 16 >> 2] | 0;
                    if ((b | 0) != 0) {
                        Ra(b)
                    }
                    b = c[a + 20 >> 2] | 0;
                    if ((b | 0) != 0) {
                        Ra(b)
                    }
                    ab(a | 0, 0, 360) | 0;
                    h = -1;
                    i = d;
                    return h | 0
                }
                g = f + b | 0;
                g = (g | 0) < 2147483615 ? g + 32 | 0 : g;
                b = a + 16 | 0;
                f = Ta(c[b >> 2] | 0, g << 2) | 0;
                if ((f | 0) == 0) {
                    e = c[a >> 2] | 0;
                    if ((e | 0) != 0) {
                        Ra(e)
                    }
                    b = c[b >> 2] | 0;
                    if ((b | 0) != 0) {
                        Ra(b)
                    }
                    b = c[a + 20 >> 2] | 0;
                    if ((b | 0) != 0) {
                        Ra(b)
                    }
                    ab(a | 0, 0, 360) | 0;
                    h = -1;
                    i = d;
                    return h | 0
                }
                c[b >> 2] = f;
                f = a + 20 | 0;
                h = Ta(c[f >> 2] | 0, g << 3) | 0;
                if ((h | 0) != 0) {
                    c[f >> 2] = h;
                    c[e >> 2] = g;
                    h = 0;
                    i = d;
                    return h | 0
                }
                e = c[a >> 2] | 0;
                if ((e | 0) != 0) {
                    Ra(e)
                }
                b = c[b >> 2] | 0;
                if ((b | 0) != 0) {
                    Ra(b)
                }
                b = c[f >> 2] | 0;
                if ((b | 0) != 0) {
                    Ra(b)
                }
                ab(a | 0, 0, 360) | 0;
                h = -1;
                i = d;
                return h | 0
            }

            function Ea(a) {
                a = a | 0;
                var b = 0;
                b = i;
                if ((a | 0) == 0) {
                    i = b;
                    return 0
                }
                c[a + 0 >> 2] = 0;
                c[a + 4 >> 2] = 0;
                c[a + 8 >> 2] = 0;
                c[a + 12 >> 2] = 0;
                c[a + 16 >> 2] = 0;
                c[a + 20 >> 2] = 0;
                c[a + 24 >> 2] = 0;
                i = b;
                return 0
            }

            function Fa(a) {
                a = a | 0;
                var b = 0, d = 0;
                b = i;
                if ((a | 0) != 0) {
                    d = c[a >> 2] | 0;
                    if ((d | 0) != 0) {
                        Ra(d)
                    }
                    Ra(a)
                }
                i = b;
                return 0
            }

            function Ga(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                d = i;
                f = a + 4 | 0;
                h = c[f >> 2] | 0;
                if (!((h | 0) > -1)) {
                    k = 0;
                    i = d;
                    return k | 0
                }
                g = a + 12 | 0;
                j = c[g >> 2] | 0;
                e = a + 8 | 0;
                if ((j | 0) != 0) {
                    k = (c[e >> 2] | 0) - j | 0;
                    c[e >> 2] = k;
                    if ((k | 0) > 0) {
                        h = c[a >> 2] | 0;
                        $a(h | 0, h + j | 0, k | 0) | 0;
                        h = c[f >> 2] | 0
                    }
                    c[g >> 2] = 0
                }
                g = c[e >> 2] | 0;
                do {
                    if ((h - g | 0) < (b | 0)) {
                        b = b + 4096 + g | 0;
                        g = c[a >> 2] | 0;
                        if ((g | 0) == 0) {
                            g = Qa(b) | 0
                        } else {
                            g = Ta(g, b) | 0
                        }
                        if ((g | 0) != 0) {
                            c[a >> 2] = g;
                            c[f >> 2] = b;
                            a = g;
                            g = c[e >> 2] | 0;
                            break
                        }
                        if ((a | 0) == 0) {
                            k = 0;
                            i = d;
                            return k | 0
                        }
                        e = c[a >> 2] | 0;
                        if ((e | 0) != 0) {
                            Ra(e)
                        }
                        c[a + 0 >> 2] = 0;
                        c[a + 4 >> 2] = 0;
                        c[a + 8 >> 2] = 0;
                        c[a + 12 >> 2] = 0;
                        c[a + 16 >> 2] = 0;
                        c[a + 20 >> 2] = 0;
                        c[a + 24 >> 2] = 0;
                        k = 0;
                        i = d;
                        return k | 0
                    } else {
                        a = c[a >> 2] | 0
                    }
                } while (0);
                k = a + g | 0;
                i = d;
                return k | 0
            }

            function Ha(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0;
                d = i;
                e = c[a + 4 >> 2] | 0;
                if ((e | 0) > -1 ? (g = a + 8 | 0, f = (c[g >> 2] | 0) + b | 0, (f | 0) <= (e | 0)) : 0) {
                    c[g >> 2] = f;
                    a = 0
                } else {
                    a = -1
                }
                i = d;
                return a | 0
            }

            function Ia(b, e) {
                b = b | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0;
                f = i;
                i = i + 16 | 0;
                o = f;
                n = c[b >> 2] | 0;
                g = b + 12 | 0;
                l = c[g >> 2] | 0;
                j = n + l | 0;
                k = b + 8 | 0;
                m = (c[k >> 2] | 0) - l | 0;
                if (!((c[b + 4 >> 2] | 0) > -1)) {
                    z = 0;
                    i = f;
                    return z | 0
                }
                h = b + 20 | 0;
                r = c[h >> 2] | 0;
                do {
                    if ((r | 0) == 0) {
                        if ((m | 0) < 27) {
                            z = 0;
                            i = f;
                            return z | 0
                        }
                        if ((Xa(j, 1032, 4) | 0) != 0) {
                            p = b + 24 | 0;
                            break
                        }
                        q = n + (l + 26) | 0;
                        r = a[q >> 0] | 0;
                        p = (r & 255) + 27 | 0;
                        if ((m | 0) < (p | 0)) {
                            z = 0;
                            i = f;
                            return z | 0
                        }
                        if (!(r << 24 >> 24 == 0)) {
                            s = l + 27 | 0;
                            r = b + 24 | 0;
                            u = c[r >> 2] | 0;
                            t = 0;
                            do {
                                u = u + (d[n + (s + t) >> 0] | 0) | 0;
                                c[r >> 2] = u;
                                t = t + 1 | 0
                            } while ((t | 0) < (d[q >> 0] | 0 | 0))
                        }
                        c[h >> 2] = p;
                        r = p;
                        q = 11
                    } else {
                        q = 11
                    }
                } while (0);
                do {
                    if ((q | 0) == 11) {
                        p = b + 24 | 0;
                        if ((r + (c[p >> 2] | 0) | 0) > (m | 0)) {
                            z = 0;
                            i = f;
                            return z | 0
                        }
                        r = n + (l + 22) | 0;
                        s = d[r >> 0] | d[r + 1 >> 0] << 8 | d[r + 2 >> 0] << 16 | d[r + 3 >> 0] << 24;
                        c[o >> 2] = s;
                        a[r >> 0] = 0;
                        a[r + 1 >> 0] = 0;
                        a[r + 2 >> 0] = 0;
                        a[r + 3 >> 0] = 0;
                        x = c[h >> 2] | 0;
                        w = x + l | 0;
                        v = c[p >> 2] | 0;
                        a[r >> 0] = 0;
                        q = n + (l + 23) | 0;
                        a[q >> 0] = 0;
                        u = n + (l + 24) | 0;
                        a[u >> 0] = 0;
                        t = n + (l + 25) | 0;
                        a[t >> 0] = 0;
                        if ((x | 0) > 0) {
                            z = 0;
                            y = 0;
                            do {
                                z = c[8 + (((d[n + (y + l) >> 0] | 0) ^ z >>> 24) << 2) >> 2] ^ z << 8;
                                y = y + 1 | 0
                            } while ((y | 0) != (x | 0))
                        } else {
                            z = 0
                        }
                        if ((v | 0) > 0) {
                            x = 0;
                            do {
                                z = c[8 + (((d[n + (w + x) >> 0] | 0) ^ z >>> 24) << 2) >> 2] ^ z << 8;
                                x = x + 1 | 0
                            } while ((x | 0) != (v | 0))
                        }
                        a[r >> 0] = z;
                        a[q >> 0] = z >>> 8;
                        a[u >> 0] = z >>> 16;
                        a[t >> 0] = z >>> 24;
                        if ((Xa(o, r, 4) | 0) != 0) {
                            a[r >> 0] = s;
                            a[r + 1 >> 0] = s >> 8;
                            a[r + 2 >> 0] = s >> 16;
                            a[r + 3 >> 0] = s >> 24;
                            break
                        }
                        k = c[b >> 2] | 0;
                        j = c[g >> 2] | 0;
                        if ((e | 0) == 0) {
                            e = c[p >> 2] | 0;
                            k = c[h >> 2] | 0
                        } else {
                            c[e >> 2] = k + j;
                            z = c[h >> 2] | 0;
                            c[e + 4 >> 2] = z;
                            c[e + 8 >> 2] = k + (z + j);
                            k = c[p >> 2] | 0;
                            c[e + 12 >> 2] = k;
                            e = k;
                            k = z
                        }
                        c[b + 16 >> 2] = 0;
                        z = e + k | 0;
                        c[g >> 2] = j + z;
                        c[h >> 2] = 0;
                        c[p >> 2] = 0;
                        i = f;
                        return z | 0
                    }
                } while (0);
                c[h >> 2] = 0;
                c[p >> 2] = 0;
                h = Wa(n + (l + 1) | 0, 79, m + -1 | 0) | 0;
                b = c[b >> 2] | 0;
                if ((h | 0) == 0) {
                    h = b + (c[k >> 2] | 0) | 0
                }
                z = h;
                c[g >> 2] = z - b;
                z = j - z | 0;
                i = f;
                return z | 0
            }

            function Ja(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                d = i;
                a:do {
                    if ((c[a + 4 >> 2] | 0) > -1) {
                        e = a + 16 | 0;
                        do {
                            f = Ia(a, b) | 0;
                            if ((f | 0) > 0) {
                                a = 1;
                                break a
                            }
                            if ((f | 0) == 0) {
                                a = 0;
                                break a
                            }
                        } while ((c[e >> 2] | 0) != 0);
                        c[e >> 2] = 1;
                        a = -1
                    } else {
                        a = 0
                    }
                } while (0);
                i = d;
                return a | 0
            }

            function Ka(b, e) {
                b = b | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0;
                f = i;
                j = c[e >> 2] | 0;
                q = c[e + 8 >> 2] | 0;
                p = c[e + 12 >> 2] | 0;
                u = a[j + 4 >> 0] | 0;
                l = d[j + 5 >> 0] | 0;
                r = l & 1;
                o = l & 2;
                l = l & 4;
                h = bb(d[j + 13 >> 0] | 0 | 0, 0, 8) | 0;
                h = bb(h | (d[j + 12 >> 0] | 0) | 0, D | 0, 8) | 0;
                h = bb(h | (d[j + 11 >> 0] | 0) | 0, D | 0, 8) | 0;
                h = bb(h | (d[j + 10 >> 0] | 0) | 0, D | 0, 8) | 0;
                h = bb(h | (d[j + 9 >> 0] | 0) | 0, D | 0, 8) | 0;
                h = bb(h | (d[j + 8 >> 0] | 0) | 0, D | 0, 8) | 0;
                h = bb(h | (d[j + 7 >> 0] | 0) | 0, D | 0, 8) | 0;
                e = D;
                h = h | (d[j + 6 >> 0] | 0);
                t = (d[j + 15 >> 0] | 0) << 8 | (d[j + 14 >> 0] | 0) | (d[j + 16 >> 0] | 0) << 16 | (d[j + 17 >> 0] | 0) << 24;
                k = (d[j + 19 >> 0] | 0) << 8 | (d[j + 18 >> 0] | 0) | (d[j + 20 >> 0] | 0) << 16 | (d[j + 21 >> 0] | 0) << 24;
                m = d[j + 26 >> 0] | 0;
                if ((b | 0) == 0) {
                    A = -1;
                    i = f;
                    return A | 0
                }
                w = c[b >> 2] | 0;
                if ((w | 0) == 0) {
                    A = -1;
                    i = f;
                    return A | 0
                }
                s = b + 36 | 0;
                n = c[s >> 2] | 0;
                v = b + 12 | 0;
                y = c[v >> 2] | 0;
                if ((y | 0) != 0) {
                    z = b + 8 | 0;
                    A = c[z >> 2] | 0;
                    x = A - y | 0;
                    c[z >> 2] = x;
                    if ((A | 0) != (y | 0)) {
                        $a(w | 0, w + y | 0, x | 0) | 0
                    }
                    c[v >> 2] = 0
                }
                if ((n | 0) != 0) {
                    v = b + 28 | 0;
                    w = c[v >> 2] | 0;
                    if ((w | 0) == (n | 0)) {
                        w = n
                    } else {
                        A = c[b + 16 >> 2] | 0;
                        $a(A | 0, A + (n << 2) | 0, w - n << 2 | 0) | 0;
                        w = c[b + 20 >> 2] | 0;
                        $a(w | 0, w + (n << 3) | 0, (c[v >> 2] | 0) - n << 3 | 0) | 0;
                        w = c[v >> 2] | 0
                    }
                    c[v >> 2] = w - n;
                    A = b + 32 | 0;
                    c[A >> 2] = (c[A >> 2] | 0) - n;
                    c[s >> 2] = 0
                }
                if (u << 24 >> 24 != 0 ? 1 : (t | 0) != (c[b + 336 >> 2] | 0)) {
                    A = -1;
                    i = f;
                    return A | 0
                }
                if ((Da(b, m + 1 | 0) | 0) != 0) {
                    A = -1;
                    i = f;
                    return A | 0
                }
                n = b + 340 | 0;
                v = c[n >> 2] | 0;
                if ((k | 0) != (v | 0)) {
                    y = b + 32 | 0;
                    A = c[y >> 2] | 0;
                    z = b + 28 | 0;
                    w = c[z >> 2] | 0;
                    if ((A | 0) < (w | 0)) {
                        x = c[b + 16 >> 2] | 0;
                        s = b + 8 | 0;
                        u = c[s >> 2] | 0;
                        t = A;
                        do {
                            u = u - (c[x + (t << 2) >> 2] & 255) | 0;
                            t = t + 1 | 0
                        } while ((t | 0) < (w | 0));
                        c[s >> 2] = u
                    }
                    c[z >> 2] = A;
                    if (!((v | 0) == -1)) {
                        x = A + 1 | 0;
                        c[z >> 2] = x;
                        c[(c[b + 16 >> 2] | 0) + (A << 2) >> 2] = 1024;
                        c[y >> 2] = x
                    }
                }
                a:do {
                    if ((r | 0) == 0) {
                        r = 0
                    } else {
                        A = c[b + 28 >> 2] | 0;
                        if ((A | 0) >= 1 ? (c[(c[b + 16 >> 2] | 0) + (A + -1 << 2) >> 2] | 0) != 1024 : 0) {
                            r = 0;
                            break
                        } else {
                            r = 0
                        }
                        while (1) {
                            if ((r | 0) >= (m | 0)) {
                                o = 0;
                                break a
                            }
                            A = a[j + (r + 27) >> 0] | 0;
                            z = A & 255;
                            q = q + z | 0;
                            p = p - z | 0;
                            r = r + 1 | 0;
                            if (!(A << 24 >> 24 == -1)) {
                                o = 0;
                                break
                            }
                        }
                    }
                } while (0);
                if ((p | 0) != 0) {
                    t = b + 4 | 0;
                    v = c[t >> 2] | 0;
                    s = b + 8 | 0;
                    u = c[s >> 2] | 0;
                    do {
                        if ((v - p | 0) > (u | 0)) {
                            t = c[b >> 2] | 0
                        } else {
                            if ((v | 0) > (2147483647 - p | 0)) {
                                g = c[b >> 2] | 0;
                                if ((g | 0) != 0) {
                                    Ra(g)
                                }
                                g = c[b + 16 >> 2] | 0;
                                if ((g | 0) != 0) {
                                    Ra(g)
                                }
                                g = c[b + 20 >> 2] | 0;
                                if ((g | 0) != 0) {
                                    Ra(g)
                                }
                                ab(b | 0, 0, 360) | 0;
                                A = -1;
                                i = f;
                                return A | 0
                            }
                            u = v + p | 0;
                            u = (u | 0) < 2147482623 ? u + 1024 | 0 : u;
                            v = Ta(c[b >> 2] | 0, u) | 0;
                            if ((v | 0) != 0) {
                                c[t >> 2] = u;
                                c[b >> 2] = v;
                                t = v;
                                u = c[s >> 2] | 0;
                                break
                            }
                            g = c[b >> 2] | 0;
                            if ((g | 0) != 0) {
                                Ra(g)
                            }
                            g = c[b + 16 >> 2] | 0;
                            if ((g | 0) != 0) {
                                Ra(g)
                            }
                            g = c[b + 20 >> 2] | 0;
                            if ((g | 0) != 0) {
                                Ra(g)
                            }
                            ab(b | 0, 0, 360) | 0;
                            A = -1;
                            i = f;
                            return A | 0
                        }
                    } while (0);
                    _a(t + u | 0, q | 0, p | 0) | 0;
                    c[s >> 2] = (c[s >> 2] | 0) + p
                }
                if ((r | 0) < (m | 0)) {
                    q = b + 28 | 0;
                    p = b + 32 | 0;
                    s = c[b + 16 >> 2] | 0;
                    t = c[b + 20 >> 2] | 0;
                    w = c[q >> 2] | 0;
                    u = -1;
                    b:while (1) {
                        v = w;
                        while (1) {
                            w = a[j + (r + 27) >> 0] | 0;
                            x = w & 255;
                            y = s + (v << 2) | 0;
                            c[y >> 2] = x;
                            A = t + (v << 3) | 0;
                            c[A >> 2] = -1;
                            c[A + 4 >> 2] = -1;
                            if ((o | 0) != 0) {
                                c[y >> 2] = x | 256
                            }
                            o = v + 1 | 0;
                            c[q >> 2] = o;
                            r = r + 1 | 0;
                            if (!(w << 24 >> 24 == -1)) {
                                break
                            }
                            if ((r | 0) >= (m | 0)) {
                                break b
                            } else {
                                v = o;
                                o = 0
                            }
                        }
                        c[p >> 2] = o;
                        if ((r | 0) < (m | 0)) {
                            w = o;
                            o = 0;
                            u = v
                        } else {
                            u = v;
                            break
                        }
                    }
                    if (!((u | 0) == -1)) {
                        A = (c[b + 20 >> 2] | 0) + (u << 3) | 0;
                        c[A >> 2] = h;
                        c[A + 4 >> 2] = e
                    }
                }
                if ((l | 0) != 0 ? (c[b + 328 >> 2] = 1, g = c[b + 28 >> 2] | 0, (g | 0) > 0) : 0) {
                    A = (c[b + 16 >> 2] | 0) + (g + -1 << 2) | 0;
                    c[A >> 2] = c[A >> 2] | 512
                }
                c[n >> 2] = k + 1;
                A = 0;
                i = f;
                return A | 0
            }

            function La(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0;
                d = i;
                if ((a | 0) != 0 ? (c[a >> 2] | 0) != 0 : 0) {
                    a = Ma(a, b, 1) | 0
                } else {
                    a = 0
                }
                i = d;
                return a | 0
            }

            function Ma(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
                f = i;
                e = a + 36 | 0;
                k = c[e >> 2] | 0;
                if ((c[a + 32 >> 2] | 0) <= (k | 0)) {
                    m = 0;
                    i = f;
                    return m | 0
                }
                j = c[a + 16 >> 2] | 0;
                h = c[j + (k << 2) >> 2] | 0;
                if ((h & 1024 | 0) != 0) {
                    c[e >> 2] = k + 1;
                    m = a + 344 | 0;
                    l = m;
                    l = Za(c[l >> 2] | 0, c[l + 4 >> 2] | 0, 1, 0) | 0;
                    c[m >> 2] = l;
                    c[m + 4 >> 2] = D;
                    m = -1;
                    i = f;
                    return m | 0
                }
                g = (b | 0) != 0;
                d = (d | 0) == 0;
                if (d & (g ^ 1)) {
                    m = 1;
                    i = f;
                    return m | 0
                }
                l = h & 255;
                m = h & 512;
                h = h & 256;
                if ((l | 0) == 255) {
                    l = 255;
                    do {
                        k = k + 1 | 0;
                        o = c[j + (k << 2) >> 2] | 0;
                        n = o & 255;
                        m = (o & 512 | 0) == 0 ? m : 512;
                        l = n + l | 0
                    } while ((n | 0) == 255)
                }
                if (g) {
                    c[b + 12 >> 2] = m;
                    c[b + 8 >> 2] = h;
                    c[b >> 2] = (c[a >> 2] | 0) + (c[a + 12 >> 2] | 0);
                    o = a + 344 | 0;
                    n = c[o + 4 >> 2] | 0;
                    m = b + 24 | 0;
                    c[m >> 2] = c[o >> 2];
                    c[m + 4 >> 2] = n;
                    m = (c[a + 20 >> 2] | 0) + (k << 3) | 0;
                    n = c[m + 4 >> 2] | 0;
                    o = b + 16 | 0;
                    c[o >> 2] = c[m >> 2];
                    c[o + 4 >> 2] = n;
                    c[b + 4 >> 2] = l
                }
                if (d) {
                    o = 1;
                    i = f;
                    return o | 0
                }
                o = a + 12 | 0;
                c[o >> 2] = (c[o >> 2] | 0) + l;
                c[e >> 2] = k + 1;
                o = a + 344 | 0;
                n = o;
                n = Za(c[n >> 2] | 0, c[n + 4 >> 2] | 0, 1, 0) | 0;
                c[o >> 2] = n;
                c[o + 4 >> 2] = D;
                o = 1;
                i = f;
                return o | 0
            }

            function Na() {
                var a = 0, b = 0;
                b = i;
                a = Sa(1, 440) | 0;
                if ((Ea(a) | 0) == 0) {
                    i = b;
                    return a | 0
                } else {
                    oa(1040, 1072, 17, 1088)
                }
                return 0
            }

            function Oa(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0;
                f = i;
                _a(Ga(a, d) | 0, b | 0, d | 0) | 0;
                if ((Ha(a, d) | 0) != 0) {
                    oa(1104, 1072, 25, 1144)
                }
                g = a + 28 | 0;
                if ((Ja(a, g) | 0) != 1) {
                    i = f;
                    return 0
                }
                d = a + 48 | 0;
                h = a + 408 | 0;
                j = a + 412 | 0;
                while (1) {
                    b = Ba(g) | 0;
                    if ((Aa(g) | 0) != 0 ? (Ca(d, b) | 0) != 0 : 0) {
                        e = 8;
                        break
                    }
                    if ((Ka(d, g) | 0) != 0) {
                        e = 11;
                        break
                    }
                    if ((La(d, h) | 0) == 1) {
                        do {
                            ra[e & 127](c[h >> 2] | 0, c[j >> 2] | 0)
                        } while ((La(d, h) | 0) == 1)
                    }
                    if ((Ja(a, g) | 0) != 1) {
                        e = 13;
                        break
                    }
                }
                if ((e | 0) == 8) {
                    oa(1160, 1072, 32, 1144)
                } else if ((e | 0) == 11) {
                    oa(1200, 1072, 34, 1144)
                } else if ((e | 0) == 13) {
                    i = f;
                    return 0
                }
                return 0
            }

            function Pa(a) {
                a = a | 0;
                var b = 0;
                b = i;
                Fa(a) | 0;
                Ra(a);
                i = b;
                return
            }

            function Qa(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
                b = i;
                do {
                    if (a >>> 0 < 245) {
                        if (a >>> 0 < 11) {
                            a = 16
                        } else {
                            a = a + 11 & -8
                        }
                        v = a >>> 3;
                        p = c[312] | 0;
                        w = p >>> v;
                        if ((w & 3 | 0) != 0) {
                            h = (w & 1 ^ 1) + v | 0;
                            g = h << 1;
                            e = 1288 + (g << 2) | 0;
                            g = 1288 + (g + 2 << 2) | 0;
                            j = c[g >> 2] | 0;
                            d = j + 8 | 0;
                            f = c[d >> 2] | 0;
                            do {
                                if ((e | 0) != (f | 0)) {
                                    if (f >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    }
                                    k = f + 12 | 0;
                                    if ((c[k >> 2] | 0) == (j | 0)) {
                                        c[k >> 2] = e;
                                        c[g >> 2] = f;
                                        break
                                    } else {
                                        ja()
                                    }
                                } else {
                                    c[312] = p & ~(1 << h)
                                }
                            } while (0);
                            H = h << 3;
                            c[j + 4 >> 2] = H | 3;
                            H = j + (H | 4) | 0;
                            c[H >> 2] = c[H >> 2] | 1;
                            H = d;
                            i = b;
                            return H | 0
                        }
                        if (a >>> 0 > (c[1256 >> 2] | 0) >>> 0) {
                            if ((w | 0) != 0) {
                                h = 2 << v;
                                h = w << v & (h | 0 - h);
                                h = (h & 0 - h) + -1 | 0;
                                d = h >>> 12 & 16;
                                h = h >>> d;
                                f = h >>> 5 & 8;
                                h = h >>> f;
                                g = h >>> 2 & 4;
                                h = h >>> g;
                                e = h >>> 1 & 2;
                                h = h >>> e;
                                j = h >>> 1 & 1;
                                j = (f | d | g | e | j) + (h >>> j) | 0;
                                h = j << 1;
                                e = 1288 + (h << 2) | 0;
                                h = 1288 + (h + 2 << 2) | 0;
                                g = c[h >> 2] | 0;
                                d = g + 8 | 0;
                                f = c[d >> 2] | 0;
                                do {
                                    if ((e | 0) != (f | 0)) {
                                        if (f >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                            ja()
                                        }
                                        k = f + 12 | 0;
                                        if ((c[k >> 2] | 0) == (g | 0)) {
                                            c[k >> 2] = e;
                                            c[h >> 2] = f;
                                            break
                                        } else {
                                            ja()
                                        }
                                    } else {
                                        c[312] = p & ~(1 << j)
                                    }
                                } while (0);
                                h = j << 3;
                                f = h - a | 0;
                                c[g + 4 >> 2] = a | 3;
                                e = g + a | 0;
                                c[g + (a | 4) >> 2] = f | 1;
                                c[g + h >> 2] = f;
                                h = c[1256 >> 2] | 0;
                                if ((h | 0) != 0) {
                                    g = c[1268 >> 2] | 0;
                                    k = h >>> 3;
                                    j = k << 1;
                                    h = 1288 + (j << 2) | 0;
                                    l = c[312] | 0;
                                    k = 1 << k;
                                    if ((l & k | 0) != 0) {
                                        j = 1288 + (j + 2 << 2) | 0;
                                        k = c[j >> 2] | 0;
                                        if (k >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                            ja()
                                        } else {
                                            D = j;
                                            C = k
                                        }
                                    } else {
                                        c[312] = l | k;
                                        D = 1288 + (j + 2 << 2) | 0;
                                        C = h
                                    }
                                    c[D >> 2] = g;
                                    c[C + 12 >> 2] = g;
                                    c[g + 8 >> 2] = C;
                                    c[g + 12 >> 2] = h
                                }
                                c[1256 >> 2] = f;
                                c[1268 >> 2] = e;
                                H = d;
                                i = b;
                                return H | 0
                            }
                            p = c[1252 >> 2] | 0;
                            if ((p | 0) != 0) {
                                e = (p & 0 - p) + -1 | 0;
                                G = e >>> 12 & 16;
                                e = e >>> G;
                                F = e >>> 5 & 8;
                                e = e >>> F;
                                H = e >>> 2 & 4;
                                e = e >>> H;
                                f = e >>> 1 & 2;
                                e = e >>> f;
                                d = e >>> 1 & 1;
                                d = c[1552 + ((F | G | H | f | d) + (e >>> d) << 2) >> 2] | 0;
                                e = (c[d + 4 >> 2] & -8) - a | 0;
                                f = d;
                                while (1) {
                                    g = c[f + 16 >> 2] | 0;
                                    if ((g | 0) == 0) {
                                        g = c[f + 20 >> 2] | 0;
                                        if ((g | 0) == 0) {
                                            break
                                        }
                                    }
                                    f = (c[g + 4 >> 2] & -8) - a | 0;
                                    H = f >>> 0 < e >>> 0;
                                    e = H ? f : e;
                                    f = g;
                                    d = H ? g : d
                                }
                                h = c[1264 >> 2] | 0;
                                if (d >>> 0 < h >>> 0) {
                                    ja()
                                }
                                f = d + a | 0;
                                if (!(d >>> 0 < f >>> 0)) {
                                    ja()
                                }
                                g = c[d + 24 >> 2] | 0;
                                k = c[d + 12 >> 2] | 0;
                                do {
                                    if ((k | 0) == (d | 0)) {
                                        k = d + 20 | 0;
                                        j = c[k >> 2] | 0;
                                        if ((j | 0) == 0) {
                                            k = d + 16 | 0;
                                            j = c[k >> 2] | 0;
                                            if ((j | 0) == 0) {
                                                B = 0;
                                                break
                                            }
                                        }
                                        while (1) {
                                            l = j + 20 | 0;
                                            m = c[l >> 2] | 0;
                                            if ((m | 0) != 0) {
                                                j = m;
                                                k = l;
                                                continue
                                            }
                                            m = j + 16 | 0;
                                            l = c[m >> 2] | 0;
                                            if ((l | 0) == 0) {
                                                break
                                            } else {
                                                j = l;
                                                k = m
                                            }
                                        }
                                        if (k >>> 0 < h >>> 0) {
                                            ja()
                                        } else {
                                            c[k >> 2] = 0;
                                            B = j;
                                            break
                                        }
                                    } else {
                                        j = c[d + 8 >> 2] | 0;
                                        if (j >>> 0 < h >>> 0) {
                                            ja()
                                        }
                                        h = j + 12 | 0;
                                        if ((c[h >> 2] | 0) != (d | 0)) {
                                            ja()
                                        }
                                        l = k + 8 | 0;
                                        if ((c[l >> 2] | 0) == (d | 0)) {
                                            c[h >> 2] = k;
                                            c[l >> 2] = j;
                                            B = k;
                                            break
                                        } else {
                                            ja()
                                        }
                                    }
                                } while (0);
                                do {
                                    if ((g | 0) != 0) {
                                        h = c[d + 28 >> 2] | 0;
                                        j = 1552 + (h << 2) | 0;
                                        if ((d | 0) == (c[j >> 2] | 0)) {
                                            c[j >> 2] = B;
                                            if ((B | 0) == 0) {
                                                c[1252 >> 2] = c[1252 >> 2] & ~(1 << h);
                                                break
                                            }
                                        } else {
                                            if (g >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                ja()
                                            }
                                            h = g + 16 | 0;
                                            if ((c[h >> 2] | 0) == (d | 0)) {
                                                c[h >> 2] = B
                                            } else {
                                                c[g + 20 >> 2] = B
                                            }
                                            if ((B | 0) == 0) {
                                                break
                                            }
                                        }
                                        if (B >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                            ja()
                                        }
                                        c[B + 24 >> 2] = g;
                                        g = c[d + 16 >> 2] | 0;
                                        do {
                                            if ((g | 0) != 0) {
                                                if (g >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                    ja()
                                                } else {
                                                    c[B + 16 >> 2] = g;
                                                    c[g + 24 >> 2] = B;
                                                    break
                                                }
                                            }
                                        } while (0);
                                        g = c[d + 20 >> 2] | 0;
                                        if ((g | 0) != 0) {
                                            if (g >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                ja()
                                            } else {
                                                c[B + 20 >> 2] = g;
                                                c[g + 24 >> 2] = B;
                                                break
                                            }
                                        }
                                    }
                                } while (0);
                                if (e >>> 0 < 16) {
                                    H = e + a | 0;
                                    c[d + 4 >> 2] = H | 3;
                                    H = d + (H + 4) | 0;
                                    c[H >> 2] = c[H >> 2] | 1
                                } else {
                                    c[d + 4 >> 2] = a | 3;
                                    c[d + (a | 4) >> 2] = e | 1;
                                    c[d + (e + a) >> 2] = e;
                                    h = c[1256 >> 2] | 0;
                                    if ((h | 0) != 0) {
                                        g = c[1268 >> 2] | 0;
                                        l = h >>> 3;
                                        j = l << 1;
                                        h = 1288 + (j << 2) | 0;
                                        k = c[312] | 0;
                                        l = 1 << l;
                                        if ((k & l | 0) != 0) {
                                            j = 1288 + (j + 2 << 2) | 0;
                                            k = c[j >> 2] | 0;
                                            if (k >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                ja()
                                            } else {
                                                A = j;
                                                z = k
                                            }
                                        } else {
                                            c[312] = k | l;
                                            A = 1288 + (j + 2 << 2) | 0;
                                            z = h
                                        }
                                        c[A >> 2] = g;
                                        c[z + 12 >> 2] = g;
                                        c[g + 8 >> 2] = z;
                                        c[g + 12 >> 2] = h
                                    }
                                    c[1256 >> 2] = e;
                                    c[1268 >> 2] = f
                                }
                                H = d + 8 | 0;
                                i = b;
                                return H | 0
                            }
                        }
                    } else {
                        if (!(a >>> 0 > 4294967231)) {
                            z = a + 11 | 0;
                            a = z & -8;
                            B = c[1252 >> 2] | 0;
                            if ((B | 0) != 0) {
                                A = 0 - a | 0;
                                z = z >>> 8;
                                if ((z | 0) != 0) {
                                    if (a >>> 0 > 16777215) {
                                        C = 31
                                    } else {
                                        G = (z + 1048320 | 0) >>> 16 & 8;
                                        H = z << G;
                                        F = (H + 520192 | 0) >>> 16 & 4;
                                        H = H << F;
                                        C = (H + 245760 | 0) >>> 16 & 2;
                                        C = 14 - (F | G | C) + (H << C >>> 15) | 0;
                                        C = a >>> (C + 7 | 0) & 1 | C << 1
                                    }
                                } else {
                                    C = 0
                                }
                                D = c[1552 + (C << 2) >> 2] | 0;
                                a:do {
                                    if ((D | 0) == 0) {
                                        F = 0;
                                        z = 0
                                    } else {
                                        if ((C | 0) == 31) {
                                            z = 0
                                        } else {
                                            z = 25 - (C >>> 1) | 0
                                        }
                                        F = 0;
                                        E = a << z;
                                        z = 0;
                                        while (1) {
                                            H = c[D + 4 >> 2] & -8;
                                            G = H - a | 0;
                                            if (G >>> 0 < A >>> 0) {
                                                if ((H | 0) == (a | 0)) {
                                                    A = G;
                                                    F = D;
                                                    z = D;
                                                    break a
                                                } else {
                                                    A = G;
                                                    z = D
                                                }
                                            }
                                            H = c[D + 20 >> 2] | 0;
                                            D = c[D + (E >>> 31 << 2) + 16 >> 2] | 0;
                                            F = (H | 0) == 0 | (H | 0) == (D | 0) ? F : H;
                                            if ((D | 0) == 0) {
                                                break
                                            } else {
                                                E = E << 1
                                            }
                                        }
                                    }
                                } while (0);
                                if ((F | 0) == 0 & (z | 0) == 0) {
                                    H = 2 << C;
                                    B = B & (H | 0 - H);
                                    if ((B | 0) == 0) {
                                        break
                                    }
                                    H = (B & 0 - B) + -1 | 0;
                                    D = H >>> 12 & 16;
                                    H = H >>> D;
                                    C = H >>> 5 & 8;
                                    H = H >>> C;
                                    E = H >>> 2 & 4;
                                    H = H >>> E;
                                    G = H >>> 1 & 2;
                                    H = H >>> G;
                                    F = H >>> 1 & 1;
                                    F = c[1552 + ((C | D | E | G | F) + (H >>> F) << 2) >> 2] | 0
                                }
                                if ((F | 0) != 0) {
                                    while (1) {
                                        H = (c[F + 4 >> 2] & -8) - a | 0;
                                        B = H >>> 0 < A >>> 0;
                                        A = B ? H : A;
                                        z = B ? F : z;
                                        B = c[F + 16 >> 2] | 0;
                                        if ((B | 0) != 0) {
                                            F = B;
                                            continue
                                        }
                                        F = c[F + 20 >> 2] | 0;
                                        if ((F | 0) == 0) {
                                            break
                                        }
                                    }
                                }
                                if ((z | 0) != 0 ? A >>> 0 < ((c[1256 >> 2] | 0) - a | 0) >>> 0 : 0) {
                                    f = c[1264 >> 2] | 0;
                                    if (z >>> 0 < f >>> 0) {
                                        ja()
                                    }
                                    d = z + a | 0;
                                    if (!(z >>> 0 < d >>> 0)) {
                                        ja()
                                    }
                                    e = c[z + 24 >> 2] | 0;
                                    h = c[z + 12 >> 2] | 0;
                                    do {
                                        if ((h | 0) == (z | 0)) {
                                            h = z + 20 | 0;
                                            g = c[h >> 2] | 0;
                                            if ((g | 0) == 0) {
                                                h = z + 16 | 0;
                                                g = c[h >> 2] | 0;
                                                if ((g | 0) == 0) {
                                                    x = 0;
                                                    break
                                                }
                                            }
                                            while (1) {
                                                j = g + 20 | 0;
                                                k = c[j >> 2] | 0;
                                                if ((k | 0) != 0) {
                                                    g = k;
                                                    h = j;
                                                    continue
                                                }
                                                j = g + 16 | 0;
                                                k = c[j >> 2] | 0;
                                                if ((k | 0) == 0) {
                                                    break
                                                } else {
                                                    g = k;
                                                    h = j
                                                }
                                            }
                                            if (h >>> 0 < f >>> 0) {
                                                ja()
                                            } else {
                                                c[h >> 2] = 0;
                                                x = g;
                                                break
                                            }
                                        } else {
                                            g = c[z + 8 >> 2] | 0;
                                            if (g >>> 0 < f >>> 0) {
                                                ja()
                                            }
                                            f = g + 12 | 0;
                                            if ((c[f >> 2] | 0) != (z | 0)) {
                                                ja()
                                            }
                                            j = h + 8 | 0;
                                            if ((c[j >> 2] | 0) == (z | 0)) {
                                                c[f >> 2] = h;
                                                c[j >> 2] = g;
                                                x = h;
                                                break
                                            } else {
                                                ja()
                                            }
                                        }
                                    } while (0);
                                    do {
                                        if ((e | 0) != 0) {
                                            g = c[z + 28 >> 2] | 0;
                                            f = 1552 + (g << 2) | 0;
                                            if ((z | 0) == (c[f >> 2] | 0)) {
                                                c[f >> 2] = x;
                                                if ((x | 0) == 0) {
                                                    c[1252 >> 2] = c[1252 >> 2] & ~(1 << g);
                                                    break
                                                }
                                            } else {
                                                if (e >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                    ja()
                                                }
                                                f = e + 16 | 0;
                                                if ((c[f >> 2] | 0) == (z | 0)) {
                                                    c[f >> 2] = x
                                                } else {
                                                    c[e + 20 >> 2] = x
                                                }
                                                if ((x | 0) == 0) {
                                                    break
                                                }
                                            }
                                            if (x >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                ja()
                                            }
                                            c[x + 24 >> 2] = e;
                                            e = c[z + 16 >> 2] | 0;
                                            do {
                                                if ((e | 0) != 0) {
                                                    if (e >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                        ja()
                                                    } else {
                                                        c[x + 16 >> 2] = e;
                                                        c[e + 24 >> 2] = x;
                                                        break
                                                    }
                                                }
                                            } while (0);
                                            e = c[z + 20 >> 2] | 0;
                                            if ((e | 0) != 0) {
                                                if (e >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                    ja()
                                                } else {
                                                    c[x + 20 >> 2] = e;
                                                    c[e + 24 >> 2] = x;
                                                    break
                                                }
                                            }
                                        }
                                    } while (0);
                                    b:do {
                                        if (!(A >>> 0 < 16)) {
                                            c[z + 4 >> 2] = a | 3;
                                            c[z + (a | 4) >> 2] = A | 1;
                                            c[z + (A + a) >> 2] = A;
                                            f = A >>> 3;
                                            if (A >>> 0 < 256) {
                                                h = f << 1;
                                                e = 1288 + (h << 2) | 0;
                                                g = c[312] | 0;
                                                f = 1 << f;
                                                do {
                                                    if ((g & f | 0) == 0) {
                                                        c[312] = g | f;
                                                        w = 1288 + (h + 2 << 2) | 0;
                                                        v = e
                                                    } else {
                                                        f = 1288 + (h + 2 << 2) | 0;
                                                        g = c[f >> 2] | 0;
                                                        if (!(g >>> 0 < (c[1264 >> 2] | 0) >>> 0)) {
                                                            w = f;
                                                            v = g;
                                                            break
                                                        }
                                                        ja()
                                                    }
                                                } while (0);
                                                c[w >> 2] = d;
                                                c[v + 12 >> 2] = d;
                                                c[z + (a + 8) >> 2] = v;
                                                c[z + (a + 12) >> 2] = e;
                                                break
                                            }
                                            e = A >>> 8;
                                            if ((e | 0) != 0) {
                                                if (A >>> 0 > 16777215) {
                                                    e = 31
                                                } else {
                                                    G = (e + 1048320 | 0) >>> 16 & 8;
                                                    H = e << G;
                                                    F = (H + 520192 | 0) >>> 16 & 4;
                                                    H = H << F;
                                                    e = (H + 245760 | 0) >>> 16 & 2;
                                                    e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                                    e = A >>> (e + 7 | 0) & 1 | e << 1
                                                }
                                            } else {
                                                e = 0
                                            }
                                            f = 1552 + (e << 2) | 0;
                                            c[z + (a + 28) >> 2] = e;
                                            c[z + (a + 20) >> 2] = 0;
                                            c[z + (a + 16) >> 2] = 0;
                                            h = c[1252 >> 2] | 0;
                                            g = 1 << e;
                                            if ((h & g | 0) == 0) {
                                                c[1252 >> 2] = h | g;
                                                c[f >> 2] = d;
                                                c[z + (a + 24) >> 2] = f;
                                                c[z + (a + 12) >> 2] = d;
                                                c[z + (a + 8) >> 2] = d;
                                                break
                                            }
                                            f = c[f >> 2] | 0;
                                            if ((e | 0) == 31) {
                                                e = 0
                                            } else {
                                                e = 25 - (e >>> 1) | 0
                                            }
                                            c:do {
                                                if ((c[f + 4 >> 2] & -8 | 0) != (A | 0)) {
                                                    e = A << e;
                                                    while (1) {
                                                        g = f + (e >>> 31 << 2) + 16 | 0;
                                                        h = c[g >> 2] | 0;
                                                        if ((h | 0) == 0) {
                                                            break
                                                        }
                                                        if ((c[h + 4 >> 2] & -8 | 0) == (A | 0)) {
                                                            p = h;
                                                            break c
                                                        } else {
                                                            e = e << 1;
                                                            f = h
                                                        }
                                                    }
                                                    if (g >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                        ja()
                                                    } else {
                                                        c[g >> 2] = d;
                                                        c[z + (a + 24) >> 2] = f;
                                                        c[z + (a + 12) >> 2] = d;
                                                        c[z + (a + 8) >> 2] = d;
                                                        break b
                                                    }
                                                } else {
                                                    p = f
                                                }
                                            } while (0);
                                            f = p + 8 | 0;
                                            e = c[f >> 2] | 0;
                                            g = c[1264 >> 2] | 0;
                                            if (p >>> 0 < g >>> 0) {
                                                ja()
                                            }
                                            if (e >>> 0 < g >>> 0) {
                                                ja()
                                            } else {
                                                c[e + 12 >> 2] = d;
                                                c[f >> 2] = d;
                                                c[z + (a + 8) >> 2] = e;
                                                c[z + (a + 12) >> 2] = p;
                                                c[z + (a + 24) >> 2] = 0;
                                                break
                                            }
                                        } else {
                                            H = A + a | 0;
                                            c[z + 4 >> 2] = H | 3;
                                            H = z + (H + 4) | 0;
                                            c[H >> 2] = c[H >> 2] | 1
                                        }
                                    } while (0);
                                    H = z + 8 | 0;
                                    i = b;
                                    return H | 0
                                }
                            }
                        } else {
                            a = -1
                        }
                    }
                } while (0);
                p = c[1256 >> 2] | 0;
                if (!(a >>> 0 > p >>> 0)) {
                    e = p - a | 0;
                    d = c[1268 >> 2] | 0;
                    if (e >>> 0 > 15) {
                        c[1268 >> 2] = d + a;
                        c[1256 >> 2] = e;
                        c[d + (a + 4) >> 2] = e | 1;
                        c[d + p >> 2] = e;
                        c[d + 4 >> 2] = a | 3
                    } else {
                        c[1256 >> 2] = 0;
                        c[1268 >> 2] = 0;
                        c[d + 4 >> 2] = p | 3;
                        H = d + (p + 4) | 0;
                        c[H >> 2] = c[H >> 2] | 1
                    }
                    H = d + 8 | 0;
                    i = b;
                    return H | 0
                }
                p = c[1260 >> 2] | 0;
                if (a >>> 0 < p >>> 0) {
                    G = p - a | 0;
                    c[1260 >> 2] = G;
                    H = c[1272 >> 2] | 0;
                    c[1272 >> 2] = H + a;
                    c[H + (a + 4) >> 2] = G | 1;
                    c[H + 4 >> 2] = a | 3;
                    H = H + 8 | 0;
                    i = b;
                    return H | 0
                }
                do {
                    if ((c[430] | 0) == 0) {
                        p = ia(30) | 0;
                        if ((p + -1 & p | 0) == 0) {
                            c[1728 >> 2] = p;
                            c[1724 >> 2] = p;
                            c[1732 >> 2] = -1;
                            c[1736 >> 2] = -1;
                            c[1740 >> 2] = 0;
                            c[1692 >> 2] = 0;
                            c[430] = (ma(0) | 0) & -16 ^ 1431655768;
                            break
                        } else {
                            ja()
                        }
                    }
                } while (0);
                w = a + 48 | 0;
                p = c[1728 >> 2] | 0;
                x = a + 47 | 0;
                z = p + x | 0;
                p = 0 - p | 0;
                v = z & p;
                if (!(v >>> 0 > a >>> 0)) {
                    H = 0;
                    i = b;
                    return H | 0
                }
                A = c[1688 >> 2] | 0;
                if ((A | 0) != 0 ? (G = c[1680 >> 2] | 0, H = G + v | 0, H >>> 0 <= G >>> 0 | H >>> 0 > A >>> 0) : 0) {
                    H = 0;
                    i = b;
                    return H | 0
                }
                d:do {
                    if ((c[1692 >> 2] & 4 | 0) == 0) {
                        B = c[1272 >> 2] | 0;
                        e:do {
                            if ((B | 0) != 0) {
                                A = 1696 | 0;
                                while (1) {
                                    C = c[A >> 2] | 0;
                                    if (!(C >>> 0 > B >>> 0) ? (y = A + 4 | 0, (C + (c[y >> 2] | 0) | 0) >>> 0 > B >>> 0) : 0) {
                                        break
                                    }
                                    A = c[A + 8 >> 2] | 0;
                                    if ((A | 0) == 0) {
                                        o = 182;
                                        break e
                                    }
                                }
                                if ((A | 0) != 0) {
                                    B = z - (c[1260 >> 2] | 0) & p;
                                    if (B >>> 0 < 2147483647) {
                                        p = la(B | 0) | 0;
                                        A = (p | 0) == ((c[A >> 2] | 0) + (c[y >> 2] | 0) | 0);
                                        y = p;
                                        z = B;
                                        p = A ? p : -1;
                                        A = A ? B : 0;
                                        o = 191
                                    } else {
                                        A = 0
                                    }
                                } else {
                                    o = 182
                                }
                            } else {
                                o = 182
                            }
                        } while (0);
                        do {
                            if ((o | 0) == 182) {
                                p = la(0) | 0;
                                if ((p | 0) != (-1 | 0)) {
                                    z = p;
                                    A = c[1724 >> 2] | 0;
                                    y = A + -1 | 0;
                                    if ((y & z | 0) == 0) {
                                        A = v
                                    } else {
                                        A = v - z + (y + z & 0 - A) | 0
                                    }
                                    y = c[1680 >> 2] | 0;
                                    z = y + A | 0;
                                    if (A >>> 0 > a >>> 0 & A >>> 0 < 2147483647) {
                                        H = c[1688 >> 2] | 0;
                                        if ((H | 0) != 0 ? z >>> 0 <= y >>> 0 | z >>> 0 > H >>> 0 : 0) {
                                            A = 0;
                                            break
                                        }
                                        y = la(A | 0) | 0;
                                        o = (y | 0) == (p | 0);
                                        z = A;
                                        p = o ? p : -1;
                                        A = o ? A : 0;
                                        o = 191
                                    } else {
                                        A = 0
                                    }
                                } else {
                                    A = 0
                                }
                            }
                        } while (0);
                        f:do {
                            if ((o | 0) == 191) {
                                o = 0 - z | 0;
                                if ((p | 0) != (-1 | 0)) {
                                    q = A;
                                    o = 202;
                                    break d
                                }
                                do {
                                    if ((y | 0) != (-1 | 0) & z >>> 0 < 2147483647 & z >>> 0 < w >>> 0 ? (u = c[1728 >> 2] | 0, u = x - z + u & 0 - u, u >>> 0 < 2147483647) : 0) {
                                        if ((la(u | 0) | 0) == (-1 | 0)) {
                                            la(o | 0) | 0;
                                            break f
                                        } else {
                                            z = u + z | 0;
                                            break
                                        }
                                    }
                                } while (0);
                                if ((y | 0) != (-1 | 0)) {
                                    p = y;
                                    q = z;
                                    o = 202;
                                    break d
                                }
                            }
                        } while (0);
                        c[1692 >> 2] = c[1692 >> 2] | 4;
                        o = 199
                    } else {
                        A = 0;
                        o = 199
                    }
                } while (0);
                if ((((o | 0) == 199 ? v >>> 0 < 2147483647 : 0) ? (t = la(v | 0) | 0, s = la(0) | 0, (s | 0) != (-1 | 0) & (t | 0) != (-1 | 0) & t >>> 0 < s >>> 0) : 0) ? (r = s - t | 0, q = r >>> 0 > (a + 40 | 0) >>> 0, q) : 0) {
                    p = t;
                    q = q ? r : A;
                    o = 202
                }
                if ((o | 0) == 202) {
                    r = (c[1680 >> 2] | 0) + q | 0;
                    c[1680 >> 2] = r;
                    if (r >>> 0 > (c[1684 >> 2] | 0) >>> 0) {
                        c[1684 >> 2] = r
                    }
                    r = c[1272 >> 2] | 0;
                    g:do {
                        if ((r | 0) != 0) {
                            v = 1696 | 0;
                            while (1) {
                                t = c[v >> 2] | 0;
                                u = v + 4 | 0;
                                s = c[u >> 2] | 0;
                                if ((p | 0) == (t + s | 0)) {
                                    o = 214;
                                    break
                                }
                                w = c[v + 8 >> 2] | 0;
                                if ((w | 0) == 0) {
                                    break
                                } else {
                                    v = w
                                }
                            }
                            if (((o | 0) == 214 ? (c[v + 12 >> 2] & 8 | 0) == 0 : 0) ? r >>> 0 >= t >>> 0 & r >>> 0 < p >>> 0 : 0) {
                                c[u >> 2] = s + q;
                                d = (c[1260 >> 2] | 0) + q | 0;
                                e = r + 8 | 0;
                                if ((e & 7 | 0) == 0) {
                                    e = 0
                                } else {
                                    e = 0 - e & 7
                                }
                                H = d - e | 0;
                                c[1272 >> 2] = r + e;
                                c[1260 >> 2] = H;
                                c[r + (e + 4) >> 2] = H | 1;
                                c[r + (d + 4) >> 2] = 40;
                                c[1276 >> 2] = c[1736 >> 2];
                                break
                            }
                            if (p >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                c[1264 >> 2] = p
                            }
                            t = p + q | 0;
                            s = 1696 | 0;
                            while (1) {
                                if ((c[s >> 2] | 0) == (t | 0)) {
                                    o = 224;
                                    break
                                }
                                u = c[s + 8 >> 2] | 0;
                                if ((u | 0) == 0) {
                                    break
                                } else {
                                    s = u
                                }
                            }
                            if ((o | 0) == 224 ? (c[s + 12 >> 2] & 8 | 0) == 0 : 0) {
                                c[s >> 2] = p;
                                h = s + 4 | 0;
                                c[h >> 2] = (c[h >> 2] | 0) + q;
                                h = p + 8 | 0;
                                if ((h & 7 | 0) == 0) {
                                    h = 0
                                } else {
                                    h = 0 - h & 7
                                }
                                j = p + (q + 8) | 0;
                                if ((j & 7 | 0) == 0) {
                                    n = 0
                                } else {
                                    n = 0 - j & 7
                                }
                                o = p + (n + q) | 0;
                                j = h + a | 0;
                                k = p + j | 0;
                                m = o - (p + h) - a | 0;
                                c[p + (h + 4) >> 2] = a | 3;
                                h:do {
                                    if ((o | 0) != (c[1272 >> 2] | 0)) {
                                        if ((o | 0) == (c[1268 >> 2] | 0)) {
                                            H = (c[1256 >> 2] | 0) + m | 0;
                                            c[1256 >> 2] = H;
                                            c[1268 >> 2] = k;
                                            c[p + (j + 4) >> 2] = H | 1;
                                            c[p + (H + j) >> 2] = H;
                                            break
                                        }
                                        r = q + 4 | 0;
                                        t = c[p + (r + n) >> 2] | 0;
                                        if ((t & 3 | 0) == 1) {
                                            a = t & -8;
                                            s = t >>> 3;
                                            i:do {
                                                if (!(t >>> 0 < 256)) {
                                                    l = c[p + ((n | 24) + q) >> 2] | 0;
                                                    u = c[p + (q + 12 + n) >> 2] | 0;
                                                    do {
                                                        if ((u | 0) == (o | 0)) {
                                                            u = n | 16;
                                                            t = p + (r + u) | 0;
                                                            s = c[t >> 2] | 0;
                                                            if ((s | 0) == 0) {
                                                                t = p + (u + q) | 0;
                                                                s = c[t >> 2] | 0;
                                                                if ((s | 0) == 0) {
                                                                    g = 0;
                                                                    break
                                                                }
                                                            }
                                                            while (1) {
                                                                u = s + 20 | 0;
                                                                v = c[u >> 2] | 0;
                                                                if ((v | 0) != 0) {
                                                                    s = v;
                                                                    t = u;
                                                                    continue
                                                                }
                                                                u = s + 16 | 0;
                                                                v = c[u >> 2] | 0;
                                                                if ((v | 0) == 0) {
                                                                    break
                                                                } else {
                                                                    s = v;
                                                                    t = u
                                                                }
                                                            }
                                                            if (t >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                                ja()
                                                            } else {
                                                                c[t >> 2] = 0;
                                                                g = s;
                                                                break
                                                            }
                                                        } else {
                                                            t = c[p + ((n | 8) + q) >> 2] | 0;
                                                            if (t >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                                ja()
                                                            }
                                                            v = t + 12 | 0;
                                                            if ((c[v >> 2] | 0) != (o | 0)) {
                                                                ja()
                                                            }
                                                            s = u + 8 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                c[v >> 2] = u;
                                                                c[s >> 2] = t;
                                                                g = u;
                                                                break
                                                            } else {
                                                                ja()
                                                            }
                                                        }
                                                    } while (0);
                                                    if ((l | 0) == 0) {
                                                        break
                                                    }
                                                    t = c[p + (q + 28 + n) >> 2] | 0;
                                                    s = 1552 + (t << 2) | 0;
                                                    do {
                                                        if ((o | 0) != (c[s >> 2] | 0)) {
                                                            if (l >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                                ja()
                                                            }
                                                            s = l + 16 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                c[s >> 2] = g
                                                            } else {
                                                                c[l + 20 >> 2] = g
                                                            }
                                                            if ((g | 0) == 0) {
                                                                break i
                                                            }
                                                        } else {
                                                            c[s >> 2] = g;
                                                            if ((g | 0) != 0) {
                                                                break
                                                            }
                                                            c[1252 >> 2] = c[1252 >> 2] & ~(1 << t);
                                                            break i
                                                        }
                                                    } while (0);
                                                    if (g >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                        ja()
                                                    }
                                                    c[g + 24 >> 2] = l;
                                                    l = n | 16;
                                                    o = c[p + (l + q) >> 2] | 0;
                                                    do {
                                                        if ((o | 0) != 0) {
                                                            if (o >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                                ja()
                                                            } else {
                                                                c[g + 16 >> 2] = o;
                                                                c[o + 24 >> 2] = g;
                                                                break
                                                            }
                                                        }
                                                    } while (0);
                                                    l = c[p + (r + l) >> 2] | 0;
                                                    if ((l | 0) == 0) {
                                                        break
                                                    }
                                                    if (l >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                        ja()
                                                    } else {
                                                        c[g + 20 >> 2] = l;
                                                        c[l + 24 >> 2] = g;
                                                        break
                                                    }
                                                } else {
                                                    r = c[p + ((n | 8) + q) >> 2] | 0;
                                                    g = c[p + (q + 12 + n) >> 2] | 0;
                                                    t = 1288 + (s << 1 << 2) | 0;
                                                    do {
                                                        if ((r | 0) != (t | 0)) {
                                                            if (r >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                                ja()
                                                            }
                                                            if ((c[r + 12 >> 2] | 0) == (o | 0)) {
                                                                break
                                                            }
                                                            ja()
                                                        }
                                                    } while (0);
                                                    if ((g | 0) == (r | 0)) {
                                                        c[312] = c[312] & ~(1 << s);
                                                        break
                                                    }
                                                    do {
                                                        if ((g | 0) == (t | 0)) {
                                                            l = g + 8 | 0
                                                        } else {
                                                            if (g >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                                ja()
                                                            }
                                                            s = g + 8 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                l = s;
                                                                break
                                                            }
                                                            ja()
                                                        }
                                                    } while (0);
                                                    c[r + 12 >> 2] = g;
                                                    c[l >> 2] = r
                                                }
                                            } while (0);
                                            o = p + ((a | n) + q) | 0;
                                            m = a + m | 0
                                        }
                                        g = o + 4 | 0;
                                        c[g >> 2] = c[g >> 2] & -2;
                                        c[p + (j + 4) >> 2] = m | 1;
                                        c[p + (m + j) >> 2] = m;
                                        g = m >>> 3;
                                        if (m >>> 0 < 256) {
                                            m = g << 1;
                                            d = 1288 + (m << 2) | 0;
                                            l = c[312] | 0;
                                            g = 1 << g;
                                            do {
                                                if ((l & g | 0) == 0) {
                                                    c[312] = l | g;
                                                    f = 1288 + (m + 2 << 2) | 0;
                                                    e = d
                                                } else {
                                                    l = 1288 + (m + 2 << 2) | 0;
                                                    g = c[l >> 2] | 0;
                                                    if (!(g >>> 0 < (c[1264 >> 2] | 0) >>> 0)) {
                                                        f = l;
                                                        e = g;
                                                        break
                                                    }
                                                    ja()
                                                }
                                            } while (0);
                                            c[f >> 2] = k;
                                            c[e + 12 >> 2] = k;
                                            c[p + (j + 8) >> 2] = e;
                                            c[p + (j + 12) >> 2] = d;
                                            break
                                        }
                                        e = m >>> 8;
                                        do {
                                            if ((e | 0) == 0) {
                                                e = 0
                                            } else {
                                                if (m >>> 0 > 16777215) {
                                                    e = 31;
                                                    break
                                                }
                                                G = (e + 1048320 | 0) >>> 16 & 8;
                                                H = e << G;
                                                F = (H + 520192 | 0) >>> 16 & 4;
                                                H = H << F;
                                                e = (H + 245760 | 0) >>> 16 & 2;
                                                e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                                e = m >>> (e + 7 | 0) & 1 | e << 1
                                            }
                                        } while (0);
                                        l = 1552 + (e << 2) | 0;
                                        c[p + (j + 28) >> 2] = e;
                                        c[p + (j + 20) >> 2] = 0;
                                        c[p + (j + 16) >> 2] = 0;
                                        f = c[1252 >> 2] | 0;
                                        g = 1 << e;
                                        if ((f & g | 0) == 0) {
                                            c[1252 >> 2] = f | g;
                                            c[l >> 2] = k;
                                            c[p + (j + 24) >> 2] = l;
                                            c[p + (j + 12) >> 2] = k;
                                            c[p + (j + 8) >> 2] = k;
                                            break
                                        }
                                        l = c[l >> 2] | 0;
                                        if ((e | 0) == 31) {
                                            e = 0
                                        } else {
                                            e = 25 - (e >>> 1) | 0
                                        }
                                        j:do {
                                            if ((c[l + 4 >> 2] & -8 | 0) != (m | 0)) {
                                                e = m << e;
                                                while (1) {
                                                    g = l + (e >>> 31 << 2) + 16 | 0;
                                                    f = c[g >> 2] | 0;
                                                    if ((f | 0) == 0) {
                                                        break
                                                    }
                                                    if ((c[f + 4 >> 2] & -8 | 0) == (m | 0)) {
                                                        d = f;
                                                        break j
                                                    } else {
                                                        e = e << 1;
                                                        l = f
                                                    }
                                                }
                                                if (g >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                                    ja()
                                                } else {
                                                    c[g >> 2] = k;
                                                    c[p + (j + 24) >> 2] = l;
                                                    c[p + (j + 12) >> 2] = k;
                                                    c[p + (j + 8) >> 2] = k;
                                                    break h
                                                }
                                            } else {
                                                d = l
                                            }
                                        } while (0);
                                        f = d + 8 | 0;
                                        e = c[f >> 2] | 0;
                                        g = c[1264 >> 2] | 0;
                                        if (d >>> 0 < g >>> 0) {
                                            ja()
                                        }
                                        if (e >>> 0 < g >>> 0) {
                                            ja()
                                        } else {
                                            c[e + 12 >> 2] = k;
                                            c[f >> 2] = k;
                                            c[p + (j + 8) >> 2] = e;
                                            c[p + (j + 12) >> 2] = d;
                                            c[p + (j + 24) >> 2] = 0;
                                            break
                                        }
                                    } else {
                                        H = (c[1260 >> 2] | 0) + m | 0;
                                        c[1260 >> 2] = H;
                                        c[1272 >> 2] = k;
                                        c[p + (j + 4) >> 2] = H | 1
                                    }
                                } while (0);
                                H = p + (h | 8) | 0;
                                i = b;
                                return H | 0
                            }
                            e = 1696 | 0;
                            while (1) {
                                d = c[e >> 2] | 0;
                                if (!(d >>> 0 > r >>> 0) ? (n = c[e + 4 >> 2] | 0, m = d + n | 0, m >>> 0 > r >>> 0) : 0) {
                                    break
                                }
                                e = c[e + 8 >> 2] | 0
                            }
                            e = d + (n + -39) | 0;
                            if ((e & 7 | 0) == 0) {
                                e = 0
                            } else {
                                e = 0 - e & 7
                            }
                            d = d + (n + -47 + e) | 0;
                            d = d >>> 0 < (r + 16 | 0) >>> 0 ? r : d;
                            e = d + 8 | 0;
                            f = p + 8 | 0;
                            if ((f & 7 | 0) == 0) {
                                f = 0
                            } else {
                                f = 0 - f & 7
                            }
                            H = q + -40 - f | 0;
                            c[1272 >> 2] = p + f;
                            c[1260 >> 2] = H;
                            c[p + (f + 4) >> 2] = H | 1;
                            c[p + (q + -36) >> 2] = 40;
                            c[1276 >> 2] = c[1736 >> 2];
                            c[d + 4 >> 2] = 27;
                            c[e + 0 >> 2] = c[1696 >> 2];
                            c[e + 4 >> 2] = c[1700 >> 2];
                            c[e + 8 >> 2] = c[1704 >> 2];
                            c[e + 12 >> 2] = c[1708 >> 2];
                            c[1696 >> 2] = p;
                            c[1700 >> 2] = q;
                            c[1708 >> 2] = 0;
                            c[1704 >> 2] = e;
                            e = d + 28 | 0;
                            c[e >> 2] = 7;
                            if ((d + 32 | 0) >>> 0 < m >>> 0) {
                                do {
                                    H = e;
                                    e = e + 4 | 0;
                                    c[e >> 2] = 7
                                } while ((H + 8 | 0) >>> 0 < m >>> 0)
                            }
                            if ((d | 0) != (r | 0)) {
                                d = d - r | 0;
                                e = r + (d + 4) | 0;
                                c[e >> 2] = c[e >> 2] & -2;
                                c[r + 4 >> 2] = d | 1;
                                c[r + d >> 2] = d;
                                e = d >>> 3;
                                if (d >>> 0 < 256) {
                                    g = e << 1;
                                    d = 1288 + (g << 2) | 0;
                                    f = c[312] | 0;
                                    e = 1 << e;
                                    do {
                                        if ((f & e | 0) == 0) {
                                            c[312] = f | e;
                                            k = 1288 + (g + 2 << 2) | 0;
                                            j = d
                                        } else {
                                            f = 1288 + (g + 2 << 2) | 0;
                                            e = c[f >> 2] | 0;
                                            if (!(e >>> 0 < (c[1264 >> 2] | 0) >>> 0)) {
                                                k = f;
                                                j = e;
                                                break
                                            }
                                            ja()
                                        }
                                    } while (0);
                                    c[k >> 2] = r;
                                    c[j + 12 >> 2] = r;
                                    c[r + 8 >> 2] = j;
                                    c[r + 12 >> 2] = d;
                                    break
                                }
                                e = d >>> 8;
                                if ((e | 0) != 0) {
                                    if (d >>> 0 > 16777215) {
                                        e = 31
                                    } else {
                                        G = (e + 1048320 | 0) >>> 16 & 8;
                                        H = e << G;
                                        F = (H + 520192 | 0) >>> 16 & 4;
                                        H = H << F;
                                        e = (H + 245760 | 0) >>> 16 & 2;
                                        e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                        e = d >>> (e + 7 | 0) & 1 | e << 1
                                    }
                                } else {
                                    e = 0
                                }
                                j = 1552 + (e << 2) | 0;
                                c[r + 28 >> 2] = e;
                                c[r + 20 >> 2] = 0;
                                c[r + 16 >> 2] = 0;
                                f = c[1252 >> 2] | 0;
                                g = 1 << e;
                                if ((f & g | 0) == 0) {
                                    c[1252 >> 2] = f | g;
                                    c[j >> 2] = r;
                                    c[r + 24 >> 2] = j;
                                    c[r + 12 >> 2] = r;
                                    c[r + 8 >> 2] = r;
                                    break
                                }
                                f = c[j >> 2] | 0;
                                if ((e | 0) == 31) {
                                    e = 0
                                } else {
                                    e = 25 - (e >>> 1) | 0
                                }
                                k:do {
                                    if ((c[f + 4 >> 2] & -8 | 0) != (d | 0)) {
                                        e = d << e;
                                        while (1) {
                                            j = f + (e >>> 31 << 2) + 16 | 0;
                                            g = c[j >> 2] | 0;
                                            if ((g | 0) == 0) {
                                                break
                                            }
                                            if ((c[g + 4 >> 2] & -8 | 0) == (d | 0)) {
                                                h = g;
                                                break k
                                            } else {
                                                e = e << 1;
                                                f = g
                                            }
                                        }
                                        if (j >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                            ja()
                                        } else {
                                            c[j >> 2] = r;
                                            c[r + 24 >> 2] = f;
                                            c[r + 12 >> 2] = r;
                                            c[r + 8 >> 2] = r;
                                            break g
                                        }
                                    } else {
                                        h = f
                                    }
                                } while (0);
                                f = h + 8 | 0;
                                e = c[f >> 2] | 0;
                                d = c[1264 >> 2] | 0;
                                if (h >>> 0 < d >>> 0) {
                                    ja()
                                }
                                if (e >>> 0 < d >>> 0) {
                                    ja()
                                } else {
                                    c[e + 12 >> 2] = r;
                                    c[f >> 2] = r;
                                    c[r + 8 >> 2] = e;
                                    c[r + 12 >> 2] = h;
                                    c[r + 24 >> 2] = 0;
                                    break
                                }
                            }
                        } else {
                            H = c[1264 >> 2] | 0;
                            if ((H | 0) == 0 | p >>> 0 < H >>> 0) {
                                c[1264 >> 2] = p
                            }
                            c[1696 >> 2] = p;
                            c[1700 >> 2] = q;
                            c[1708 >> 2] = 0;
                            c[1284 >> 2] = c[430];
                            c[1280 >> 2] = -1;
                            d = 0;
                            do {
                                H = d << 1;
                                G = 1288 + (H << 2) | 0;
                                c[1288 + (H + 3 << 2) >> 2] = G;
                                c[1288 + (H + 2 << 2) >> 2] = G;
                                d = d + 1 | 0
                            } while ((d | 0) != 32);
                            d = p + 8 | 0;
                            if ((d & 7 | 0) == 0) {
                                d = 0
                            } else {
                                d = 0 - d & 7
                            }
                            H = q + -40 - d | 0;
                            c[1272 >> 2] = p + d;
                            c[1260 >> 2] = H;
                            c[p + (d + 4) >> 2] = H | 1;
                            c[p + (q + -36) >> 2] = 40;
                            c[1276 >> 2] = c[1736 >> 2]
                        }
                    } while (0);
                    d = c[1260 >> 2] | 0;
                    if (d >>> 0 > a >>> 0) {
                        G = d - a | 0;
                        c[1260 >> 2] = G;
                        H = c[1272 >> 2] | 0;
                        c[1272 >> 2] = H + a;
                        c[H + (a + 4) >> 2] = G | 1;
                        c[H + 4 >> 2] = a | 3;
                        H = H + 8 | 0;
                        i = b;
                        return H | 0
                    }
                }
                c[(pa() | 0) >> 2] = 12;
                H = 0;
                i = b;
                return H | 0
            }

            function Ra(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0;
                b = i;
                if ((a | 0) == 0) {
                    i = b;
                    return
                }
                q = a + -8 | 0;
                r = c[1264 >> 2] | 0;
                if (q >>> 0 < r >>> 0) {
                    ja()
                }
                o = c[a + -4 >> 2] | 0;
                n = o & 3;
                if ((n | 0) == 1) {
                    ja()
                }
                j = o & -8;
                h = a + (j + -8) | 0;
                do {
                    if ((o & 1 | 0) == 0) {
                        u = c[q >> 2] | 0;
                        if ((n | 0) == 0) {
                            i = b;
                            return
                        }
                        q = -8 - u | 0;
                        o = a + q | 0;
                        n = u + j | 0;
                        if (o >>> 0 < r >>> 0) {
                            ja()
                        }
                        if ((o | 0) == (c[1268 >> 2] | 0)) {
                            d = a + (j + -4) | 0;
                            if ((c[d >> 2] & 3 | 0) != 3) {
                                d = o;
                                m = n;
                                break
                            }
                            c[1256 >> 2] = n;
                            c[d >> 2] = c[d >> 2] & -2;
                            c[a + (q + 4) >> 2] = n | 1;
                            c[h >> 2] = n;
                            i = b;
                            return
                        }
                        t = u >>> 3;
                        if (u >>> 0 < 256) {
                            d = c[a + (q + 8) >> 2] | 0;
                            m = c[a + (q + 12) >> 2] | 0;
                            p = 1288 + (t << 1 << 2) | 0;
                            if ((d | 0) != (p | 0)) {
                                if (d >>> 0 < r >>> 0) {
                                    ja()
                                }
                                if ((c[d + 12 >> 2] | 0) != (o | 0)) {
                                    ja()
                                }
                            }
                            if ((m | 0) == (d | 0)) {
                                c[312] = c[312] & ~(1 << t);
                                d = o;
                                m = n;
                                break
                            }
                            if ((m | 0) != (p | 0)) {
                                if (m >>> 0 < r >>> 0) {
                                    ja()
                                }
                                p = m + 8 | 0;
                                if ((c[p >> 2] | 0) == (o | 0)) {
                                    s = p
                                } else {
                                    ja()
                                }
                            } else {
                                s = m + 8 | 0
                            }
                            c[d + 12 >> 2] = m;
                            c[s >> 2] = d;
                            d = o;
                            m = n;
                            break
                        }
                        s = c[a + (q + 24) >> 2] | 0;
                        t = c[a + (q + 12) >> 2] | 0;
                        do {
                            if ((t | 0) == (o | 0)) {
                                u = a + (q + 20) | 0;
                                t = c[u >> 2] | 0;
                                if ((t | 0) == 0) {
                                    u = a + (q + 16) | 0;
                                    t = c[u >> 2] | 0;
                                    if ((t | 0) == 0) {
                                        p = 0;
                                        break
                                    }
                                }
                                while (1) {
                                    w = t + 20 | 0;
                                    v = c[w >> 2] | 0;
                                    if ((v | 0) != 0) {
                                        t = v;
                                        u = w;
                                        continue
                                    }
                                    v = t + 16 | 0;
                                    w = c[v >> 2] | 0;
                                    if ((w | 0) == 0) {
                                        break
                                    } else {
                                        t = w;
                                        u = v
                                    }
                                }
                                if (u >>> 0 < r >>> 0) {
                                    ja()
                                } else {
                                    c[u >> 2] = 0;
                                    p = t;
                                    break
                                }
                            } else {
                                u = c[a + (q + 8) >> 2] | 0;
                                if (u >>> 0 < r >>> 0) {
                                    ja()
                                }
                                r = u + 12 | 0;
                                if ((c[r >> 2] | 0) != (o | 0)) {
                                    ja()
                                }
                                v = t + 8 | 0;
                                if ((c[v >> 2] | 0) == (o | 0)) {
                                    c[r >> 2] = t;
                                    c[v >> 2] = u;
                                    p = t;
                                    break
                                } else {
                                    ja()
                                }
                            }
                        } while (0);
                        if ((s | 0) != 0) {
                            t = c[a + (q + 28) >> 2] | 0;
                            r = 1552 + (t << 2) | 0;
                            if ((o | 0) == (c[r >> 2] | 0)) {
                                c[r >> 2] = p;
                                if ((p | 0) == 0) {
                                    c[1252 >> 2] = c[1252 >> 2] & ~(1 << t);
                                    d = o;
                                    m = n;
                                    break
                                }
                            } else {
                                if (s >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                }
                                r = s + 16 | 0;
                                if ((c[r >> 2] | 0) == (o | 0)) {
                                    c[r >> 2] = p
                                } else {
                                    c[s + 20 >> 2] = p
                                }
                                if ((p | 0) == 0) {
                                    d = o;
                                    m = n;
                                    break
                                }
                            }
                            if (p >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                ja()
                            }
                            c[p + 24 >> 2] = s;
                            r = c[a + (q + 16) >> 2] | 0;
                            do {
                                if ((r | 0) != 0) {
                                    if (r >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    } else {
                                        c[p + 16 >> 2] = r;
                                        c[r + 24 >> 2] = p;
                                        break
                                    }
                                }
                            } while (0);
                            q = c[a + (q + 20) >> 2] | 0;
                            if ((q | 0) != 0) {
                                if (q >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                } else {
                                    c[p + 20 >> 2] = q;
                                    c[q + 24 >> 2] = p;
                                    d = o;
                                    m = n;
                                    break
                                }
                            } else {
                                d = o;
                                m = n
                            }
                        } else {
                            d = o;
                            m = n
                        }
                    } else {
                        d = q;
                        m = j
                    }
                } while (0);
                if (!(d >>> 0 < h >>> 0)) {
                    ja()
                }
                n = a + (j + -4) | 0;
                o = c[n >> 2] | 0;
                if ((o & 1 | 0) == 0) {
                    ja()
                }
                if ((o & 2 | 0) == 0) {
                    if ((h | 0) == (c[1272 >> 2] | 0)) {
                        w = (c[1260 >> 2] | 0) + m | 0;
                        c[1260 >> 2] = w;
                        c[1272 >> 2] = d;
                        c[d + 4 >> 2] = w | 1;
                        if ((d | 0) != (c[1268 >> 2] | 0)) {
                            i = b;
                            return
                        }
                        c[1268 >> 2] = 0;
                        c[1256 >> 2] = 0;
                        i = b;
                        return
                    }
                    if ((h | 0) == (c[1268 >> 2] | 0)) {
                        w = (c[1256 >> 2] | 0) + m | 0;
                        c[1256 >> 2] = w;
                        c[1268 >> 2] = d;
                        c[d + 4 >> 2] = w | 1;
                        c[d + w >> 2] = w;
                        i = b;
                        return
                    }
                    m = (o & -8) + m | 0;
                    n = o >>> 3;
                    do {
                        if (!(o >>> 0 < 256)) {
                            l = c[a + (j + 16) >> 2] | 0;
                            q = c[a + (j | 4) >> 2] | 0;
                            do {
                                if ((q | 0) == (h | 0)) {
                                    o = a + (j + 12) | 0;
                                    n = c[o >> 2] | 0;
                                    if ((n | 0) == 0) {
                                        o = a + (j + 8) | 0;
                                        n = c[o >> 2] | 0;
                                        if ((n | 0) == 0) {
                                            k = 0;
                                            break
                                        }
                                    }
                                    while (1) {
                                        p = n + 20 | 0;
                                        q = c[p >> 2] | 0;
                                        if ((q | 0) != 0) {
                                            n = q;
                                            o = p;
                                            continue
                                        }
                                        p = n + 16 | 0;
                                        q = c[p >> 2] | 0;
                                        if ((q | 0) == 0) {
                                            break
                                        } else {
                                            n = q;
                                            o = p
                                        }
                                    }
                                    if (o >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    } else {
                                        c[o >> 2] = 0;
                                        k = n;
                                        break
                                    }
                                } else {
                                    o = c[a + j >> 2] | 0;
                                    if (o >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    }
                                    p = o + 12 | 0;
                                    if ((c[p >> 2] | 0) != (h | 0)) {
                                        ja()
                                    }
                                    n = q + 8 | 0;
                                    if ((c[n >> 2] | 0) == (h | 0)) {
                                        c[p >> 2] = q;
                                        c[n >> 2] = o;
                                        k = q;
                                        break
                                    } else {
                                        ja()
                                    }
                                }
                            } while (0);
                            if ((l | 0) != 0) {
                                n = c[a + (j + 20) >> 2] | 0;
                                o = 1552 + (n << 2) | 0;
                                if ((h | 0) == (c[o >> 2] | 0)) {
                                    c[o >> 2] = k;
                                    if ((k | 0) == 0) {
                                        c[1252 >> 2] = c[1252 >> 2] & ~(1 << n);
                                        break
                                    }
                                } else {
                                    if (l >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    }
                                    n = l + 16 | 0;
                                    if ((c[n >> 2] | 0) == (h | 0)) {
                                        c[n >> 2] = k
                                    } else {
                                        c[l + 20 >> 2] = k
                                    }
                                    if ((k | 0) == 0) {
                                        break
                                    }
                                }
                                if (k >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                }
                                c[k + 24 >> 2] = l;
                                h = c[a + (j + 8) >> 2] | 0;
                                do {
                                    if ((h | 0) != 0) {
                                        if (h >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                            ja()
                                        } else {
                                            c[k + 16 >> 2] = h;
                                            c[h + 24 >> 2] = k;
                                            break
                                        }
                                    }
                                } while (0);
                                h = c[a + (j + 12) >> 2] | 0;
                                if ((h | 0) != 0) {
                                    if (h >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    } else {
                                        c[k + 20 >> 2] = h;
                                        c[h + 24 >> 2] = k;
                                        break
                                    }
                                }
                            }
                        } else {
                            k = c[a + j >> 2] | 0;
                            a = c[a + (j | 4) >> 2] | 0;
                            j = 1288 + (n << 1 << 2) | 0;
                            if ((k | 0) != (j | 0)) {
                                if (k >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                }
                                if ((c[k + 12 >> 2] | 0) != (h | 0)) {
                                    ja()
                                }
                            }
                            if ((a | 0) == (k | 0)) {
                                c[312] = c[312] & ~(1 << n);
                                break
                            }
                            if ((a | 0) != (j | 0)) {
                                if (a >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                }
                                j = a + 8 | 0;
                                if ((c[j >> 2] | 0) == (h | 0)) {
                                    l = j
                                } else {
                                    ja()
                                }
                            } else {
                                l = a + 8 | 0
                            }
                            c[k + 12 >> 2] = a;
                            c[l >> 2] = k
                        }
                    } while (0);
                    c[d + 4 >> 2] = m | 1;
                    c[d + m >> 2] = m;
                    if ((d | 0) == (c[1268 >> 2] | 0)) {
                        c[1256 >> 2] = m;
                        i = b;
                        return
                    }
                } else {
                    c[n >> 2] = o & -2;
                    c[d + 4 >> 2] = m | 1;
                    c[d + m >> 2] = m
                }
                h = m >>> 3;
                if (m >>> 0 < 256) {
                    a = h << 1;
                    e = 1288 + (a << 2) | 0;
                    j = c[312] | 0;
                    h = 1 << h;
                    if ((j & h | 0) != 0) {
                        h = 1288 + (a + 2 << 2) | 0;
                        a = c[h >> 2] | 0;
                        if (a >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                            ja()
                        } else {
                            f = h;
                            g = a
                        }
                    } else {
                        c[312] = j | h;
                        f = 1288 + (a + 2 << 2) | 0;
                        g = e
                    }
                    c[f >> 2] = d;
                    c[g + 12 >> 2] = d;
                    c[d + 8 >> 2] = g;
                    c[d + 12 >> 2] = e;
                    i = b;
                    return
                }
                f = m >>> 8;
                if ((f | 0) != 0) {
                    if (m >>> 0 > 16777215) {
                        f = 31
                    } else {
                        v = (f + 1048320 | 0) >>> 16 & 8;
                        w = f << v;
                        u = (w + 520192 | 0) >>> 16 & 4;
                        w = w << u;
                        f = (w + 245760 | 0) >>> 16 & 2;
                        f = 14 - (u | v | f) + (w << f >>> 15) | 0;
                        f = m >>> (f + 7 | 0) & 1 | f << 1
                    }
                } else {
                    f = 0
                }
                g = 1552 + (f << 2) | 0;
                c[d + 28 >> 2] = f;
                c[d + 20 >> 2] = 0;
                c[d + 16 >> 2] = 0;
                a = c[1252 >> 2] | 0;
                h = 1 << f;
                a:do {
                    if ((a & h | 0) != 0) {
                        g = c[g >> 2] | 0;
                        if ((f | 0) == 31) {
                            f = 0
                        } else {
                            f = 25 - (f >>> 1) | 0
                        }
                        b:do {
                            if ((c[g + 4 >> 2] & -8 | 0) != (m | 0)) {
                                f = m << f;
                                a = g;
                                while (1) {
                                    h = a + (f >>> 31 << 2) + 16 | 0;
                                    g = c[h >> 2] | 0;
                                    if ((g | 0) == 0) {
                                        break
                                    }
                                    if ((c[g + 4 >> 2] & -8 | 0) == (m | 0)) {
                                        e = g;
                                        break b
                                    } else {
                                        f = f << 1;
                                        a = g
                                    }
                                }
                                if (h >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                } else {
                                    c[h >> 2] = d;
                                    c[d + 24 >> 2] = a;
                                    c[d + 12 >> 2] = d;
                                    c[d + 8 >> 2] = d;
                                    break a
                                }
                            } else {
                                e = g
                            }
                        } while (0);
                        g = e + 8 | 0;
                        f = c[g >> 2] | 0;
                        h = c[1264 >> 2] | 0;
                        if (e >>> 0 < h >>> 0) {
                            ja()
                        }
                        if (f >>> 0 < h >>> 0) {
                            ja()
                        } else {
                            c[f + 12 >> 2] = d;
                            c[g >> 2] = d;
                            c[d + 8 >> 2] = f;
                            c[d + 12 >> 2] = e;
                            c[d + 24 >> 2] = 0;
                            break
                        }
                    } else {
                        c[1252 >> 2] = a | h;
                        c[g >> 2] = d;
                        c[d + 24 >> 2] = g;
                        c[d + 12 >> 2] = d;
                        c[d + 8 >> 2] = d
                    }
                } while (0);
                w = (c[1280 >> 2] | 0) + -1 | 0;
                c[1280 >> 2] = w;
                if ((w | 0) == 0) {
                    d = 1704 | 0
                } else {
                    i = b;
                    return
                }
                while (1) {
                    d = c[d >> 2] | 0;
                    if ((d | 0) == 0) {
                        break
                    } else {
                        d = d + 8 | 0
                    }
                }
                c[1280 >> 2] = -1;
                i = b;
                return
            }

            function Sa(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0;
                d = i;
                if ((a | 0) != 0) {
                    e = $(b, a) | 0;
                    if ((b | a) >>> 0 > 65535) {
                        e = ((e >>> 0) / (a >>> 0) | 0 | 0) == (b | 0) ? e : -1
                    }
                } else {
                    e = 0
                }
                a = Qa(e) | 0;
                if ((a | 0) == 0) {
                    i = d;
                    return a | 0
                }
                if ((c[a + -4 >> 2] & 3 | 0) == 0) {
                    i = d;
                    return a | 0
                }
                ab(a | 0, 0, e | 0) | 0;
                i = d;
                return a | 0
            }

            function Ta(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0;
                d = i;
                do {
                    if ((a | 0) != 0) {
                        if (b >>> 0 > 4294967231) {
                            c[(pa() | 0) >> 2] = 12;
                            e = 0;
                            break
                        }
                        if (b >>> 0 < 11) {
                            e = 16
                        } else {
                            e = b + 11 & -8
                        }
                        e = Ua(a + -8 | 0, e) | 0;
                        if ((e | 0) != 0) {
                            e = e + 8 | 0;
                            break
                        }
                        e = Qa(b) | 0;
                        if ((e | 0) == 0) {
                            e = 0
                        } else {
                            f = c[a + -4 >> 2] | 0;
                            f = (f & -8) - ((f & 3 | 0) == 0 ? 8 : 4) | 0;
                            _a(e | 0, a | 0, (f >>> 0 < b >>> 0 ? f : b) | 0) | 0;
                            Ra(a)
                        }
                    } else {
                        e = Qa(b) | 0
                    }
                } while (0);
                i = d;
                return e | 0
            }

            function Ua(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                d = i;
                e = a + 4 | 0;
                g = c[e >> 2] | 0;
                j = g & -8;
                f = a + j | 0;
                l = c[1264 >> 2] | 0;
                if (a >>> 0 < l >>> 0) {
                    ja()
                }
                n = g & 3;
                if (!((n | 0) != 1 & a >>> 0 < f >>> 0)) {
                    ja()
                }
                h = a + (j | 4) | 0;
                o = c[h >> 2] | 0;
                if ((o & 1 | 0) == 0) {
                    ja()
                }
                if ((n | 0) == 0) {
                    if (b >>> 0 < 256) {
                        q = 0;
                        i = d;
                        return q | 0
                    }
                    if (!(j >>> 0 < (b + 4 | 0) >>> 0) ? !((j - b | 0) >>> 0 > c[1728 >> 2] << 1 >>> 0) : 0) {
                        q = a;
                        i = d;
                        return q | 0
                    }
                    q = 0;
                    i = d;
                    return q | 0
                }
                if (!(j >>> 0 < b >>> 0)) {
                    f = j - b | 0;
                    if (!(f >>> 0 > 15)) {
                        q = a;
                        i = d;
                        return q | 0
                    }
                    c[e >> 2] = g & 1 | b | 2;
                    c[a + (b + 4) >> 2] = f | 3;
                    c[h >> 2] = c[h >> 2] | 1;
                    Va(a + b | 0, f);
                    q = a;
                    i = d;
                    return q | 0
                }
                if ((f | 0) == (c[1272 >> 2] | 0)) {
                    f = (c[1260 >> 2] | 0) + j | 0;
                    if (!(f >>> 0 > b >>> 0)) {
                        q = 0;
                        i = d;
                        return q | 0
                    }
                    q = f - b | 0;
                    c[e >> 2] = g & 1 | b | 2;
                    c[a + (b + 4) >> 2] = q | 1;
                    c[1272 >> 2] = a + b;
                    c[1260 >> 2] = q;
                    q = a;
                    i = d;
                    return q | 0
                }
                if ((f | 0) == (c[1268 >> 2] | 0)) {
                    h = (c[1256 >> 2] | 0) + j | 0;
                    if (h >>> 0 < b >>> 0) {
                        q = 0;
                        i = d;
                        return q | 0
                    }
                    f = h - b | 0;
                    if (f >>> 0 > 15) {
                        c[e >> 2] = g & 1 | b | 2;
                        c[a + (b + 4) >> 2] = f | 1;
                        c[a + h >> 2] = f;
                        q = a + (h + 4) | 0;
                        c[q >> 2] = c[q >> 2] & -2;
                        b = a + b | 0
                    } else {
                        c[e >> 2] = g & 1 | h | 2;
                        b = a + (h + 4) | 0;
                        c[b >> 2] = c[b >> 2] | 1;
                        b = 0;
                        f = 0
                    }
                    c[1256 >> 2] = f;
                    c[1268 >> 2] = b;
                    q = a;
                    i = d;
                    return q | 0
                }
                if ((o & 2 | 0) != 0) {
                    q = 0;
                    i = d;
                    return q | 0
                }
                h = (o & -8) + j | 0;
                if (h >>> 0 < b >>> 0) {
                    q = 0;
                    i = d;
                    return q | 0
                }
                g = h - b | 0;
                n = o >>> 3;
                do {
                    if (!(o >>> 0 < 256)) {
                        m = c[a + (j + 24) >> 2] | 0;
                        o = c[a + (j + 12) >> 2] | 0;
                        do {
                            if ((o | 0) == (f | 0)) {
                                o = a + (j + 20) | 0;
                                n = c[o >> 2] | 0;
                                if ((n | 0) == 0) {
                                    o = a + (j + 16) | 0;
                                    n = c[o >> 2] | 0;
                                    if ((n | 0) == 0) {
                                        k = 0;
                                        break
                                    }
                                }
                                while (1) {
                                    q = n + 20 | 0;
                                    p = c[q >> 2] | 0;
                                    if ((p | 0) != 0) {
                                        n = p;
                                        o = q;
                                        continue
                                    }
                                    q = n + 16 | 0;
                                    p = c[q >> 2] | 0;
                                    if ((p | 0) == 0) {
                                        break
                                    } else {
                                        n = p;
                                        o = q
                                    }
                                }
                                if (o >>> 0 < l >>> 0) {
                                    ja()
                                } else {
                                    c[o >> 2] = 0;
                                    k = n;
                                    break
                                }
                            } else {
                                n = c[a + (j + 8) >> 2] | 0;
                                if (n >>> 0 < l >>> 0) {
                                    ja()
                                }
                                p = n + 12 | 0;
                                if ((c[p >> 2] | 0) != (f | 0)) {
                                    ja()
                                }
                                l = o + 8 | 0;
                                if ((c[l >> 2] | 0) == (f | 0)) {
                                    c[p >> 2] = o;
                                    c[l >> 2] = n;
                                    k = o;
                                    break
                                } else {
                                    ja()
                                }
                            }
                        } while (0);
                        if ((m | 0) != 0) {
                            l = c[a + (j + 28) >> 2] | 0;
                            n = 1552 + (l << 2) | 0;
                            if ((f | 0) == (c[n >> 2] | 0)) {
                                c[n >> 2] = k;
                                if ((k | 0) == 0) {
                                    c[1252 >> 2] = c[1252 >> 2] & ~(1 << l);
                                    break
                                }
                            } else {
                                if (m >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                }
                                l = m + 16 | 0;
                                if ((c[l >> 2] | 0) == (f | 0)) {
                                    c[l >> 2] = k
                                } else {
                                    c[m + 20 >> 2] = k
                                }
                                if ((k | 0) == 0) {
                                    break
                                }
                            }
                            if (k >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                ja()
                            }
                            c[k + 24 >> 2] = m;
                            f = c[a + (j + 16) >> 2] | 0;
                            do {
                                if ((f | 0) != 0) {
                                    if (f >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    } else {
                                        c[k + 16 >> 2] = f;
                                        c[f + 24 >> 2] = k;
                                        break
                                    }
                                }
                            } while (0);
                            f = c[a + (j + 20) >> 2] | 0;
                            if ((f | 0) != 0) {
                                if (f >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                } else {
                                    c[k + 20 >> 2] = f;
                                    c[f + 24 >> 2] = k;
                                    break
                                }
                            }
                        }
                    } else {
                        k = c[a + (j + 8) >> 2] | 0;
                        j = c[a + (j + 12) >> 2] | 0;
                        o = 1288 + (n << 1 << 2) | 0;
                        if ((k | 0) != (o | 0)) {
                            if (k >>> 0 < l >>> 0) {
                                ja()
                            }
                            if ((c[k + 12 >> 2] | 0) != (f | 0)) {
                                ja()
                            }
                        }
                        if ((j | 0) == (k | 0)) {
                            c[312] = c[312] & ~(1 << n);
                            break
                        }
                        if ((j | 0) != (o | 0)) {
                            if (j >>> 0 < l >>> 0) {
                                ja()
                            }
                            l = j + 8 | 0;
                            if ((c[l >> 2] | 0) == (f | 0)) {
                                m = l
                            } else {
                                ja()
                            }
                        } else {
                            m = j + 8 | 0
                        }
                        c[k + 12 >> 2] = j;
                        c[m >> 2] = k
                    }
                } while (0);
                if (g >>> 0 < 16) {
                    c[e >> 2] = h | c[e >> 2] & 1 | 2;
                    q = a + (h | 4) | 0;
                    c[q >> 2] = c[q >> 2] | 1;
                    q = a;
                    i = d;
                    return q | 0
                } else {
                    c[e >> 2] = c[e >> 2] & 1 | b | 2;
                    c[a + (b + 4) >> 2] = g | 3;
                    q = a + (h | 4) | 0;
                    c[q >> 2] = c[q >> 2] | 1;
                    Va(a + b | 0, g);
                    q = a;
                    i = d;
                    return q | 0
                }
                return 0
            }

            function Va(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0;
                d = i;
                h = a + b | 0;
                l = c[a + 4 >> 2] | 0;
                do {
                    if ((l & 1 | 0) == 0) {
                        p = c[a >> 2] | 0;
                        if ((l & 3 | 0) == 0) {
                            i = d;
                            return
                        }
                        l = a + (0 - p) | 0;
                        m = p + b | 0;
                        q = c[1264 >> 2] | 0;
                        if (l >>> 0 < q >>> 0) {
                            ja()
                        }
                        if ((l | 0) == (c[1268 >> 2] | 0)) {
                            e = a + (b + 4) | 0;
                            if ((c[e >> 2] & 3 | 0) != 3) {
                                e = l;
                                n = m;
                                break
                            }
                            c[1256 >> 2] = m;
                            c[e >> 2] = c[e >> 2] & -2;
                            c[a + (4 - p) >> 2] = m | 1;
                            c[h >> 2] = m;
                            i = d;
                            return
                        }
                        s = p >>> 3;
                        if (p >>> 0 < 256) {
                            e = c[a + (8 - p) >> 2] | 0;
                            n = c[a + (12 - p) >> 2] | 0;
                            o = 1288 + (s << 1 << 2) | 0;
                            if ((e | 0) != (o | 0)) {
                                if (e >>> 0 < q >>> 0) {
                                    ja()
                                }
                                if ((c[e + 12 >> 2] | 0) != (l | 0)) {
                                    ja()
                                }
                            }
                            if ((n | 0) == (e | 0)) {
                                c[312] = c[312] & ~(1 << s);
                                e = l;
                                n = m;
                                break
                            }
                            if ((n | 0) != (o | 0)) {
                                if (n >>> 0 < q >>> 0) {
                                    ja()
                                }
                                o = n + 8 | 0;
                                if ((c[o >> 2] | 0) == (l | 0)) {
                                    r = o
                                } else {
                                    ja()
                                }
                            } else {
                                r = n + 8 | 0
                            }
                            c[e + 12 >> 2] = n;
                            c[r >> 2] = e;
                            e = l;
                            n = m;
                            break
                        }
                        r = c[a + (24 - p) >> 2] | 0;
                        t = c[a + (12 - p) >> 2] | 0;
                        do {
                            if ((t | 0) == (l | 0)) {
                                u = 16 - p | 0;
                                t = a + (u + 4) | 0;
                                s = c[t >> 2] | 0;
                                if ((s | 0) == 0) {
                                    t = a + u | 0;
                                    s = c[t >> 2] | 0;
                                    if ((s | 0) == 0) {
                                        o = 0;
                                        break
                                    }
                                }
                                while (1) {
                                    u = s + 20 | 0;
                                    v = c[u >> 2] | 0;
                                    if ((v | 0) != 0) {
                                        s = v;
                                        t = u;
                                        continue
                                    }
                                    v = s + 16 | 0;
                                    u = c[v >> 2] | 0;
                                    if ((u | 0) == 0) {
                                        break
                                    } else {
                                        s = u;
                                        t = v
                                    }
                                }
                                if (t >>> 0 < q >>> 0) {
                                    ja()
                                } else {
                                    c[t >> 2] = 0;
                                    o = s;
                                    break
                                }
                            } else {
                                s = c[a + (8 - p) >> 2] | 0;
                                if (s >>> 0 < q >>> 0) {
                                    ja()
                                }
                                u = s + 12 | 0;
                                if ((c[u >> 2] | 0) != (l | 0)) {
                                    ja()
                                }
                                q = t + 8 | 0;
                                if ((c[q >> 2] | 0) == (l | 0)) {
                                    c[u >> 2] = t;
                                    c[q >> 2] = s;
                                    o = t;
                                    break
                                } else {
                                    ja()
                                }
                            }
                        } while (0);
                        if ((r | 0) != 0) {
                            q = c[a + (28 - p) >> 2] | 0;
                            s = 1552 + (q << 2) | 0;
                            if ((l | 0) == (c[s >> 2] | 0)) {
                                c[s >> 2] = o;
                                if ((o | 0) == 0) {
                                    c[1252 >> 2] = c[1252 >> 2] & ~(1 << q);
                                    e = l;
                                    n = m;
                                    break
                                }
                            } else {
                                if (r >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                }
                                q = r + 16 | 0;
                                if ((c[q >> 2] | 0) == (l | 0)) {
                                    c[q >> 2] = o
                                } else {
                                    c[r + 20 >> 2] = o
                                }
                                if ((o | 0) == 0) {
                                    e = l;
                                    n = m;
                                    break
                                }
                            }
                            if (o >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                ja()
                            }
                            c[o + 24 >> 2] = r;
                            p = 16 - p | 0;
                            q = c[a + p >> 2] | 0;
                            do {
                                if ((q | 0) != 0) {
                                    if (q >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    } else {
                                        c[o + 16 >> 2] = q;
                                        c[q + 24 >> 2] = o;
                                        break
                                    }
                                }
                            } while (0);
                            p = c[a + (p + 4) >> 2] | 0;
                            if ((p | 0) != 0) {
                                if (p >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                } else {
                                    c[o + 20 >> 2] = p;
                                    c[p + 24 >> 2] = o;
                                    e = l;
                                    n = m;
                                    break
                                }
                            } else {
                                e = l;
                                n = m
                            }
                        } else {
                            e = l;
                            n = m
                        }
                    } else {
                        e = a;
                        n = b
                    }
                } while (0);
                l = c[1264 >> 2] | 0;
                if (h >>> 0 < l >>> 0) {
                    ja()
                }
                m = a + (b + 4) | 0;
                o = c[m >> 2] | 0;
                if ((o & 2 | 0) == 0) {
                    if ((h | 0) == (c[1272 >> 2] | 0)) {
                        v = (c[1260 >> 2] | 0) + n | 0;
                        c[1260 >> 2] = v;
                        c[1272 >> 2] = e;
                        c[e + 4 >> 2] = v | 1;
                        if ((e | 0) != (c[1268 >> 2] | 0)) {
                            i = d;
                            return
                        }
                        c[1268 >> 2] = 0;
                        c[1256 >> 2] = 0;
                        i = d;
                        return
                    }
                    if ((h | 0) == (c[1268 >> 2] | 0)) {
                        v = (c[1256 >> 2] | 0) + n | 0;
                        c[1256 >> 2] = v;
                        c[1268 >> 2] = e;
                        c[e + 4 >> 2] = v | 1;
                        c[e + v >> 2] = v;
                        i = d;
                        return
                    }
                    n = (o & -8) + n | 0;
                    m = o >>> 3;
                    do {
                        if (!(o >>> 0 < 256)) {
                            k = c[a + (b + 24) >> 2] | 0;
                            m = c[a + (b + 12) >> 2] | 0;
                            do {
                                if ((m | 0) == (h | 0)) {
                                    o = a + (b + 20) | 0;
                                    m = c[o >> 2] | 0;
                                    if ((m | 0) == 0) {
                                        o = a + (b + 16) | 0;
                                        m = c[o >> 2] | 0;
                                        if ((m | 0) == 0) {
                                            j = 0;
                                            break
                                        }
                                    }
                                    while (1) {
                                        q = m + 20 | 0;
                                        p = c[q >> 2] | 0;
                                        if ((p | 0) != 0) {
                                            m = p;
                                            o = q;
                                            continue
                                        }
                                        p = m + 16 | 0;
                                        q = c[p >> 2] | 0;
                                        if ((q | 0) == 0) {
                                            break
                                        } else {
                                            m = q;
                                            o = p
                                        }
                                    }
                                    if (o >>> 0 < l >>> 0) {
                                        ja()
                                    } else {
                                        c[o >> 2] = 0;
                                        j = m;
                                        break
                                    }
                                } else {
                                    o = c[a + (b + 8) >> 2] | 0;
                                    if (o >>> 0 < l >>> 0) {
                                        ja()
                                    }
                                    l = o + 12 | 0;
                                    if ((c[l >> 2] | 0) != (h | 0)) {
                                        ja()
                                    }
                                    p = m + 8 | 0;
                                    if ((c[p >> 2] | 0) == (h | 0)) {
                                        c[l >> 2] = m;
                                        c[p >> 2] = o;
                                        j = m;
                                        break
                                    } else {
                                        ja()
                                    }
                                }
                            } while (0);
                            if ((k | 0) != 0) {
                                l = c[a + (b + 28) >> 2] | 0;
                                m = 1552 + (l << 2) | 0;
                                if ((h | 0) == (c[m >> 2] | 0)) {
                                    c[m >> 2] = j;
                                    if ((j | 0) == 0) {
                                        c[1252 >> 2] = c[1252 >> 2] & ~(1 << l);
                                        break
                                    }
                                } else {
                                    if (k >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    }
                                    l = k + 16 | 0;
                                    if ((c[l >> 2] | 0) == (h | 0)) {
                                        c[l >> 2] = j
                                    } else {
                                        c[k + 20 >> 2] = j
                                    }
                                    if ((j | 0) == 0) {
                                        break
                                    }
                                }
                                if (j >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                    ja()
                                }
                                c[j + 24 >> 2] = k;
                                h = c[a + (b + 16) >> 2] | 0;
                                do {
                                    if ((h | 0) != 0) {
                                        if (h >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                            ja()
                                        } else {
                                            c[j + 16 >> 2] = h;
                                            c[h + 24 >> 2] = j;
                                            break
                                        }
                                    }
                                } while (0);
                                h = c[a + (b + 20) >> 2] | 0;
                                if ((h | 0) != 0) {
                                    if (h >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                                        ja()
                                    } else {
                                        c[j + 20 >> 2] = h;
                                        c[h + 24 >> 2] = j;
                                        break
                                    }
                                }
                            }
                        } else {
                            j = c[a + (b + 8) >> 2] | 0;
                            a = c[a + (b + 12) >> 2] | 0;
                            b = 1288 + (m << 1 << 2) | 0;
                            if ((j | 0) != (b | 0)) {
                                if (j >>> 0 < l >>> 0) {
                                    ja()
                                }
                                if ((c[j + 12 >> 2] | 0) != (h | 0)) {
                                    ja()
                                }
                            }
                            if ((a | 0) == (j | 0)) {
                                c[312] = c[312] & ~(1 << m);
                                break
                            }
                            if ((a | 0) != (b | 0)) {
                                if (a >>> 0 < l >>> 0) {
                                    ja()
                                }
                                b = a + 8 | 0;
                                if ((c[b >> 2] | 0) == (h | 0)) {
                                    k = b
                                } else {
                                    ja()
                                }
                            } else {
                                k = a + 8 | 0
                            }
                            c[j + 12 >> 2] = a;
                            c[k >> 2] = j
                        }
                    } while (0);
                    c[e + 4 >> 2] = n | 1;
                    c[e + n >> 2] = n;
                    if ((e | 0) == (c[1268 >> 2] | 0)) {
                        c[1256 >> 2] = n;
                        i = d;
                        return
                    }
                } else {
                    c[m >> 2] = o & -2;
                    c[e + 4 >> 2] = n | 1;
                    c[e + n >> 2] = n
                }
                a = n >>> 3;
                if (n >>> 0 < 256) {
                    b = a << 1;
                    h = 1288 + (b << 2) | 0;
                    j = c[312] | 0;
                    a = 1 << a;
                    if ((j & a | 0) != 0) {
                        b = 1288 + (b + 2 << 2) | 0;
                        a = c[b >> 2] | 0;
                        if (a >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                            ja()
                        } else {
                            g = b;
                            f = a
                        }
                    } else {
                        c[312] = j | a;
                        g = 1288 + (b + 2 << 2) | 0;
                        f = h
                    }
                    c[g >> 2] = e;
                    c[f + 12 >> 2] = e;
                    c[e + 8 >> 2] = f;
                    c[e + 12 >> 2] = h;
                    i = d;
                    return
                }
                f = n >>> 8;
                if ((f | 0) != 0) {
                    if (n >>> 0 > 16777215) {
                        f = 31
                    } else {
                        u = (f + 1048320 | 0) >>> 16 & 8;
                        v = f << u;
                        t = (v + 520192 | 0) >>> 16 & 4;
                        v = v << t;
                        f = (v + 245760 | 0) >>> 16 & 2;
                        f = 14 - (t | u | f) + (v << f >>> 15) | 0;
                        f = n >>> (f + 7 | 0) & 1 | f << 1
                    }
                } else {
                    f = 0
                }
                a = 1552 + (f << 2) | 0;
                c[e + 28 >> 2] = f;
                c[e + 20 >> 2] = 0;
                c[e + 16 >> 2] = 0;
                h = c[1252 >> 2] | 0;
                g = 1 << f;
                if ((h & g | 0) == 0) {
                    c[1252 >> 2] = h | g;
                    c[a >> 2] = e;
                    c[e + 24 >> 2] = a;
                    c[e + 12 >> 2] = e;
                    c[e + 8 >> 2] = e;
                    i = d;
                    return
                }
                g = c[a >> 2] | 0;
                if ((f | 0) == 31) {
                    f = 0
                } else {
                    f = 25 - (f >>> 1) | 0
                }
                a:do {
                    if ((c[g + 4 >> 2] & -8 | 0) != (n | 0)) {
                        f = n << f;
                        a = g;
                        while (1) {
                            h = a + (f >>> 31 << 2) + 16 | 0;
                            g = c[h >> 2] | 0;
                            if ((g | 0) == 0) {
                                break
                            }
                            if ((c[g + 4 >> 2] & -8 | 0) == (n | 0)) {
                                break a
                            } else {
                                f = f << 1;
                                a = g
                            }
                        }
                        if (h >>> 0 < (c[1264 >> 2] | 0) >>> 0) {
                            ja()
                        }
                        c[h >> 2] = e;
                        c[e + 24 >> 2] = a;
                        c[e + 12 >> 2] = e;
                        c[e + 8 >> 2] = e;
                        i = d;
                        return
                    }
                } while (0);
                f = g + 8 | 0;
                a = c[f >> 2] | 0;
                h = c[1264 >> 2] | 0;
                if (g >>> 0 < h >>> 0) {
                    ja()
                }
                if (a >>> 0 < h >>> 0) {
                    ja()
                }
                c[a + 12 >> 2] = e;
                c[f >> 2] = e;
                c[e + 8 >> 2] = a;
                c[e + 12 >> 2] = g;
                c[e + 24 >> 2] = 0;
                i = d;
                return
            }

            function Wa(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0;
                f = i;
                g = d & 255;
                j = (e | 0) == 0;
                a:do {
                    if ((b & 3 | 0) == 0 | j) {
                        h = 5
                    } else {
                        h = d & 255;
                        while (1) {
                            if ((a[b >> 0] | 0) == h << 24 >> 24) {
                                h = 6;
                                break a
                            }
                            b = b + 1 | 0;
                            e = e + -1 | 0;
                            j = (e | 0) == 0;
                            if ((b & 3 | 0) == 0 | j) {
                                h = 5;
                                break
                            }
                        }
                    }
                } while (0);
                if ((h | 0) == 5) {
                    if (j) {
                        e = 0
                    } else {
                        h = 6
                    }
                }
                b:do {
                    if ((h | 0) == 6) {
                        d = d & 255;
                        if (!((a[b >> 0] | 0) == d << 24 >> 24)) {
                            g = $(g, 16843009) | 0;
                            c:do {
                                if (e >>> 0 > 3) {
                                    do {
                                        j = c[b >> 2] ^ g;
                                        if (((j & -2139062144 ^ -2139062144) & j + -16843009 | 0) != 0) {
                                            break c
                                        }
                                        b = b + 4 | 0;
                                        e = e + -4 | 0
                                    } while (e >>> 0 > 3)
                                }
                            } while (0);
                            if ((e | 0) == 0) {
                                e = 0
                            } else {
                                while (1) {
                                    if ((a[b >> 0] | 0) == d << 24 >> 24) {
                                        break b
                                    }
                                    b = b + 1 | 0;
                                    e = e + -1 | 0;
                                    if ((e | 0) == 0) {
                                        e = 0;
                                        break
                                    }
                                }
                            }
                        }
                    }
                } while (0);
                i = f;
                return ((e | 0) != 0 ? b : 0) | 0
            }

            function Xa(b, c, d) {
                b = b | 0;
                c = c | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0;
                e = i;
                a:do {
                    if ((d | 0) == 0) {
                        d = 0
                    } else {
                        while (1) {
                            f = a[b >> 0] | 0;
                            g = a[c >> 0] | 0;
                            if (!(f << 24 >> 24 == g << 24 >> 24)) {
                                break
                            }
                            d = d + -1 | 0;
                            if ((d | 0) == 0) {
                                d = 0;
                                break a
                            } else {
                                b = b + 1 | 0;
                                c = c + 1 | 0
                            }
                        }
                        d = (f & 255) - (g & 255) | 0
                    }
                } while (0);
                i = e;
                return d | 0
            }

            function Ya() {
            }

            function Za(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                c = a + c >>> 0;
                return (D = b + d + (c >>> 0 < a >>> 0 | 0) >>> 0, c | 0) | 0
            }

            function _a(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0;
                if ((e | 0) >= 4096)return na(b | 0, d | 0, e | 0) | 0;
                f = b | 0;
                if ((b & 3) == (d & 3)) {
                    while (b & 3) {
                        if ((e | 0) == 0)return f | 0;
                        a[b >> 0] = a[d >> 0] | 0;
                        b = b + 1 | 0;
                        d = d + 1 | 0;
                        e = e - 1 | 0
                    }
                    while ((e | 0) >= 4) {
                        c[b >> 2] = c[d >> 2];
                        b = b + 4 | 0;
                        d = d + 4 | 0;
                        e = e - 4 | 0
                    }
                }
                while ((e | 0) > 0) {
                    a[b >> 0] = a[d >> 0] | 0;
                    b = b + 1 | 0;
                    d = d + 1 | 0;
                    e = e - 1 | 0
                }
                return f | 0
            }

            function $a(b, c, d) {
                b = b | 0;
                c = c | 0;
                d = d | 0;
                var e = 0;
                if ((c | 0) < (b | 0) & (b | 0) < (c + d | 0)) {
                    e = b;
                    c = c + d | 0;
                    b = b + d | 0;
                    while ((d | 0) > 0) {
                        b = b - 1 | 0;
                        c = c - 1 | 0;
                        d = d - 1 | 0;
                        a[b >> 0] = a[c >> 0] | 0
                    }
                    b = e
                } else {
                    _a(b, c, d) | 0
                }
                return b | 0
            }

            function ab(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, i = 0;
                f = b + e | 0;
                if ((e | 0) >= 20) {
                    d = d & 255;
                    i = b & 3;
                    h = d | d << 8 | d << 16 | d << 24;
                    g = f & ~3;
                    if (i) {
                        i = b + 4 - i | 0;
                        while ((b | 0) < (i | 0)) {
                            a[b >> 0] = d;
                            b = b + 1 | 0
                        }
                    }
                    while ((b | 0) < (g | 0)) {
                        c[b >> 2] = h;
                        b = b + 4 | 0
                    }
                }
                while ((b | 0) < (f | 0)) {
                    a[b >> 0] = d;
                    b = b + 1 | 0
                }
                return b - e | 0
            }

            function bb(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                if ((c | 0) < 32) {
                    D = b << c | (a & (1 << c) - 1 << 32 - c) >>> 32 - c;
                    return a << c
                }
                D = a << c - 32;
                return 0
            }

            function cb(b) {
                b = b | 0;
                var c = 0;
                c = b;
                while (a[c >> 0] | 0) {
                    c = c + 1 | 0
                }
                return c - b | 0
            }

            function db(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                b = b - d - (c >>> 0 > a >>> 0 | 0) >>> 0;
                return (D = b, a - c >>> 0 | 0) | 0
            }

            function eb(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                if ((c | 0) < 32) {
                    D = b >>> c;
                    return a >>> c | (b & (1 << c) - 1) << 32 - c
                }
                D = 0;
                return b >>> c - 32 | 0
            }

            function fb(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                if ((c | 0) < 32) {
                    D = b >> c;
                    return a >>> c | (b & (1 << c) - 1) << 32 - c
                }
                D = (b | 0) < 0 ? -1 : 0;
                return b >> c - 32 | 0
            }

            function gb(b) {
                b = b | 0;
                var c = 0;
                c = a[n + (b >>> 24) >> 0] | 0;
                if ((c | 0) < 8)return c | 0;
                c = a[n + (b >> 16 & 255) >> 0] | 0;
                if ((c | 0) < 8)return c + 8 | 0;
                c = a[n + (b >> 8 & 255) >> 0] | 0;
                if ((c | 0) < 8)return c + 16 | 0;
                return (a[n + (b & 255) >> 0] | 0) + 24 | 0
            }

            function hb(b) {
                b = b | 0;
                var c = 0;
                c = a[m + (b & 255) >> 0] | 0;
                if ((c | 0) < 8)return c | 0;
                c = a[m + (b >> 8 & 255) >> 0] | 0;
                if ((c | 0) < 8)return c + 8 | 0;
                c = a[m + (b >> 16 & 255) >> 0] | 0;
                if ((c | 0) < 8)return c + 16 | 0;
                return (a[m + (b >>> 24) >> 0] | 0) + 24 | 0
            }

            function ib(a, b) {
                a = a | 0;
                b = b | 0;
                var c = 0, d = 0, e = 0, f = 0;
                f = a & 65535;
                d = b & 65535;
                c = $(d, f) | 0;
                e = a >>> 16;
                d = (c >>> 16) + ($(d, e) | 0) | 0;
                b = b >>> 16;
                a = $(b, f) | 0;
                return (D = (d >>> 16) + ($(b, e) | 0) + (((d & 65535) + a | 0) >>> 16) | 0, d + a << 16 | c & 65535 | 0) | 0
            }

            function jb(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
                j = b >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                i = ((b | 0) < 0 ? -1 : 0) >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                f = d >> 31 | ((d | 0) < 0 ? -1 : 0) << 1;
                e = ((d | 0) < 0 ? -1 : 0) >> 31 | ((d | 0) < 0 ? -1 : 0) << 1;
                h = db(j ^ a, i ^ b, j, i) | 0;
                g = D;
                b = f ^ j;
                a = e ^ i;
                a = db((ob(h, g, db(f ^ c, e ^ d, f, e) | 0, D, 0) | 0) ^ b, D ^ a, b, a) | 0;
                return a | 0
            }

            function kb(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                i = i + 8 | 0;
                j = f | 0;
                h = b >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                g = ((b | 0) < 0 ? -1 : 0) >> 31 | ((b | 0) < 0 ? -1 : 0) << 1;
                l = e >> 31 | ((e | 0) < 0 ? -1 : 0) << 1;
                k = ((e | 0) < 0 ? -1 : 0) >> 31 | ((e | 0) < 0 ? -1 : 0) << 1;
                b = db(h ^ a, g ^ b, h, g) | 0;
                a = D;
                ob(b, a, db(l ^ d, k ^ e, l, k) | 0, D, j) | 0;
                a = db(c[j >> 2] ^ h, c[j + 4 >> 2] ^ g, h, g) | 0;
                b = D;
                i = f;
                return (D = b, a) | 0
            }

            function lb(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                var e = 0, f = 0;
                e = a;
                f = c;
                a = ib(e, f) | 0;
                c = D;
                return (D = ($(b, f) | 0) + ($(d, e) | 0) + c | c & 0, a | 0 | 0) | 0
            }

            function mb(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                a = ob(a, b, c, d, 0) | 0;
                return a | 0
            }

            function nb(a, b, d, e) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0;
                g = i;
                i = i + 8 | 0;
                f = g | 0;
                ob(a, b, d, e, f) | 0;
                i = g;
                return (D = c[f + 4 >> 2] | 0, c[f >> 2] | 0) | 0
            }

            function ob(a, b, d, e, f) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
                h = a;
                j = b;
                i = j;
                l = d;
                g = e;
                k = g;
                if ((i | 0) == 0) {
                    g = (f | 0) != 0;
                    if ((k | 0) == 0) {
                        if (g) {
                            c[f >> 2] = (h >>> 0) % (l >>> 0);
                            c[f + 4 >> 2] = 0
                        }
                        k = 0;
                        m = (h >>> 0) / (l >>> 0) >>> 0;
                        return (D = k, m) | 0
                    } else {
                        if (!g) {
                            l = 0;
                            m = 0;
                            return (D = l, m) | 0
                        }
                        c[f >> 2] = a | 0;
                        c[f + 4 >> 2] = b & 0;
                        l = 0;
                        m = 0;
                        return (D = l, m) | 0
                    }
                }
                m = (k | 0) == 0;
                do {
                    if ((l | 0) != 0) {
                        if (!m) {
                            k = (gb(k | 0) | 0) - (gb(i | 0) | 0) | 0;
                            if (k >>> 0 <= 31) {
                                m = k + 1 | 0;
                                l = 31 - k | 0;
                                a = k - 31 >> 31;
                                j = m;
                                b = h >>> (m >>> 0) & a | i << l;
                                a = i >>> (m >>> 0) & a;
                                k = 0;
                                l = h << l;
                                break
                            }
                            if ((f | 0) == 0) {
                                l = 0;
                                m = 0;
                                return (D = l, m) | 0
                            }
                            c[f >> 2] = a | 0;
                            c[f + 4 >> 2] = j | b & 0;
                            l = 0;
                            m = 0;
                            return (D = l, m) | 0
                        }
                        k = l - 1 | 0;
                        if ((k & l | 0) != 0) {
                            l = (gb(l | 0) | 0) + 33 - (gb(i | 0) | 0) | 0;
                            p = 64 - l | 0;
                            m = 32 - l | 0;
                            n = m >> 31;
                            o = l - 32 | 0;
                            a = o >> 31;
                            j = l;
                            b = m - 1 >> 31 & i >>> (o >>> 0) | (i << m | h >>> (l >>> 0)) & a;
                            a = a & i >>> (l >>> 0);
                            k = h << p & n;
                            l = (i << p | h >>> (o >>> 0)) & n | h << m & l - 33 >> 31;
                            break
                        }
                        if ((f | 0) != 0) {
                            c[f >> 2] = k & h;
                            c[f + 4 >> 2] = 0
                        }
                        if ((l | 0) == 1) {
                            o = j | b & 0;
                            p = a | 0 | 0;
                            return (D = o, p) | 0
                        } else {
                            p = hb(l | 0) | 0;
                            o = i >>> (p >>> 0) | 0;
                            p = i << 32 - p | h >>> (p >>> 0) | 0;
                            return (D = o, p) | 0
                        }
                    } else {
                        if (m) {
                            if ((f | 0) != 0) {
                                c[f >> 2] = (i >>> 0) % (l >>> 0);
                                c[f + 4 >> 2] = 0
                            }
                            o = 0;
                            p = (i >>> 0) / (l >>> 0) >>> 0;
                            return (D = o, p) | 0
                        }
                        if ((h | 0) == 0) {
                            if ((f | 0) != 0) {
                                c[f >> 2] = 0;
                                c[f + 4 >> 2] = (i >>> 0) % (k >>> 0)
                            }
                            o = 0;
                            p = (i >>> 0) / (k >>> 0) >>> 0;
                            return (D = o, p) | 0
                        }
                        l = k - 1 | 0;
                        if ((l & k | 0) == 0) {
                            if ((f | 0) != 0) {
                                c[f >> 2] = a | 0;
                                c[f + 4 >> 2] = l & i | b & 0
                            }
                            o = 0;
                            p = i >>> ((hb(k | 0) | 0) >>> 0);
                            return (D = o, p) | 0
                        }
                        k = (gb(k | 0) | 0) - (gb(i | 0) | 0) | 0;
                        if (k >>> 0 <= 30) {
                            a = k + 1 | 0;
                            l = 31 - k | 0;
                            j = a;
                            b = i << l | h >>> (a >>> 0);
                            a = i >>> (a >>> 0);
                            k = 0;
                            l = h << l;
                            break
                        }
                        if ((f | 0) == 0) {
                            o = 0;
                            p = 0;
                            return (D = o, p) | 0
                        }
                        c[f >> 2] = a | 0;
                        c[f + 4 >> 2] = j | b & 0;
                        o = 0;
                        p = 0;
                        return (D = o, p) | 0
                    }
                } while (0);
                if ((j | 0) == 0) {
                    g = l;
                    e = 0;
                    i = 0
                } else {
                    h = d | 0 | 0;
                    g = g | e & 0;
                    e = Za(h, g, -1, -1) | 0;
                    d = D;
                    i = 0;
                    do {
                        m = l;
                        l = k >>> 31 | l << 1;
                        k = i | k << 1;
                        m = b << 1 | m >>> 31 | 0;
                        n = b >>> 31 | a << 1 | 0;
                        db(e, d, m, n) | 0;
                        p = D;
                        o = p >> 31 | ((p | 0) < 0 ? -1 : 0) << 1;
                        i = o & 1;
                        b = db(m, n, o & h, (((p | 0) < 0 ? -1 : 0) >> 31 | ((p | 0) < 0 ? -1 : 0) << 1) & g) | 0;
                        a = D;
                        j = j - 1 | 0
                    } while ((j | 0) != 0);
                    g = l;
                    e = 0
                }
                h = 0;
                if ((f | 0) != 0) {
                    c[f >> 2] = b;
                    c[f + 4 >> 2] = a
                }
                o = (k | 0) >>> 31 | (g | h) << 1 | (h << 1 | k >>> 31) & 0 | e;
                p = (k << 1 | 0 >>> 31) & -2 | i;
                return (D = o, p) | 0
            }

            function pb(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                ra[a & 127](b | 0, c | 0)
            }

            function qb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(0, a | 0, b | 0)
            }

            function rb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(1, a | 0, b | 0)
            }

            function sb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(2, a | 0, b | 0)
            }

            function tb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(3, a | 0, b | 0)
            }

            function ub(a, b) {
                a = a | 0;
                b = b | 0;
                fa(4, a | 0, b | 0)
            }

            function vb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(5, a | 0, b | 0)
            }

            function wb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(6, a | 0, b | 0)
            }

            function xb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(7, a | 0, b | 0)
            }

            function yb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(8, a | 0, b | 0)
            }

            function zb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(9, a | 0, b | 0)
            }

            function Ab(a, b) {
                a = a | 0;
                b = b | 0;
                fa(10, a | 0, b | 0)
            }

            function Bb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(11, a | 0, b | 0)
            }

            function Cb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(12, a | 0, b | 0)
            }

            function Db(a, b) {
                a = a | 0;
                b = b | 0;
                fa(13, a | 0, b | 0)
            }

            function Eb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(14, a | 0, b | 0)
            }

            function Fb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(15, a | 0, b | 0)
            }

            function Gb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(16, a | 0, b | 0)
            }

            function Hb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(17, a | 0, b | 0)
            }

            function Ib(a, b) {
                a = a | 0;
                b = b | 0;
                fa(18, a | 0, b | 0)
            }

            function Jb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(19, a | 0, b | 0)
            }

            function Kb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(20, a | 0, b | 0)
            }

            function Lb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(21, a | 0, b | 0)
            }

            function Mb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(22, a | 0, b | 0)
            }

            function Nb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(23, a | 0, b | 0)
            }

            function Ob(a, b) {
                a = a | 0;
                b = b | 0;
                fa(24, a | 0, b | 0)
            }

            function Pb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(25, a | 0, b | 0)
            }

            function Qb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(26, a | 0, b | 0)
            }

            function Rb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(27, a | 0, b | 0)
            }

            function Sb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(28, a | 0, b | 0)
            }

            function Tb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(29, a | 0, b | 0)
            }

            function Ub(a, b) {
                a = a | 0;
                b = b | 0;
                fa(30, a | 0, b | 0)
            }

            function Vb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(31, a | 0, b | 0)
            }

            function Wb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(32, a | 0, b | 0)
            }

            function Xb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(33, a | 0, b | 0)
            }

            function Yb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(34, a | 0, b | 0)
            }

            function Zb(a, b) {
                a = a | 0;
                b = b | 0;
                fa(35, a | 0, b | 0)
            }

            function _b(a, b) {
                a = a | 0;
                b = b | 0;
                fa(36, a | 0, b | 0)
            }

            function $b(a, b) {
                a = a | 0;
                b = b | 0;
                fa(37, a | 0, b | 0)
            }

            function ac(a, b) {
                a = a | 0;
                b = b | 0;
                fa(38, a | 0, b | 0)
            }

            function bc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(39, a | 0, b | 0)
            }

            function cc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(40, a | 0, b | 0)
            }

            function dc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(41, a | 0, b | 0)
            }

            function ec(a, b) {
                a = a | 0;
                b = b | 0;
                fa(42, a | 0, b | 0)
            }

            function fc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(43, a | 0, b | 0)
            }

            function gc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(44, a | 0, b | 0)
            }

            function hc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(45, a | 0, b | 0)
            }

            function ic(a, b) {
                a = a | 0;
                b = b | 0;
                fa(46, a | 0, b | 0)
            }

            function jc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(47, a | 0, b | 0)
            }

            function kc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(48, a | 0, b | 0)
            }

            function lc(a, b) {
                a = a | 0;
                b = b | 0;
                fa(49, a | 0, b | 0)
            }

            function mc(a, b) {
                a = a | 0;
                b = b | 0;
                aa(0)
            }


// EMSCRIPTEN_END_FUNCS
            var ra = [mc, mc, qb, mc, rb, mc, sb, mc, tb, mc, ub, mc, vb, mc, wb, mc, xb, mc, yb, mc, zb, mc, Ab, mc, Bb, mc, Cb, mc, Db, mc, Eb, mc, Fb, mc, Gb, mc, Hb, mc, Ib, mc, Jb, mc, Kb, mc, Lb, mc, Mb, mc, Nb, mc, Ob, mc, Pb, mc, Qb, mc, Rb, mc, Sb, mc, Tb, mc, Ub, mc, Vb, mc, Wb, mc, Xb, mc, Yb, mc, Zb, mc, _b, mc, $b, mc, ac, mc, bc, mc, cc, mc, dc, mc, ec, mc, fc, mc, gc, mc, hc, mc, ic, mc, jc, mc, kc, mc, lc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc, mc];
            return {
                _strlen: cb,
                _free: Ra,
                _AVOggDestroy: Pa,
                _AVOggInit: Na,
                _i64Add: Za,
                _AVOggRead: Oa,
                _realloc: Ta,
                _memset: ab,
                _malloc: Qa,
                _memcpy: _a,
                _memmove: $a,
                _calloc: Sa,
                _bitshift64Shl: bb,
                runPostSets: Ya,
                stackAlloc: sa,
                stackSave: ta,
                stackRestore: ua,
                setThrew: va,
                setTempRet0: ya,
                getTempRet0: za,
                dynCall_vii: pb
            }
// EMSCRIPTEN_END_ASM

        })({
            "Math": Math,
            "Int8Array": Int8Array,
            "Int16Array": Int16Array,
            "Int32Array": Int32Array,
            "Uint8Array": Uint8Array,
            "Uint16Array": Uint16Array,
            "Uint32Array": Uint32Array,
            "Float32Array": Float32Array,
            "Float64Array": Float64Array
        }, {
            "abort": abort,
            "assert": assert,
            "asmPrintInt": asmPrintInt,
            "asmPrintFloat": asmPrintFloat,
            "min": Math_min,
            "jsCall": jsCall,
            "invoke_vii": invoke_vii,
            "_fflush": _fflush,
            "_sysconf": _sysconf,
            "_abort": _abort,
            "___setErrNo": ___setErrNo,
            "_sbrk": _sbrk,
            "_time": _time,
            "_emscripten_memcpy_big": _emscripten_memcpy_big,
            "___assert_fail": ___assert_fail,
            "___errno_location": ___errno_location,
            "STACKTOP": STACKTOP,
            "STACK_MAX": STACK_MAX,
            "tempDoublePtr": tempDoublePtr,
            "ABORT": ABORT,
            "cttz_i8": cttz_i8,
            "ctlz_i8": ctlz_i8,
            "NaN": NaN,
            "Infinity": Infinity
        }, buffer);
        var _strlen = Module["_strlen"] = asm["_strlen"];
        var _free = Module["_free"] = asm["_free"];
        var _AVOggDestroy = Module["_AVOggDestroy"] = asm["_AVOggDestroy"];
        var _AVOggInit = Module["_AVOggInit"] = asm["_AVOggInit"];
        var _i64Add = Module["_i64Add"] = asm["_i64Add"];
        var _AVOggRead = Module["_AVOggRead"] = asm["_AVOggRead"];
        var _realloc = Module["_realloc"] = asm["_realloc"];
        var _memset = Module["_memset"] = asm["_memset"];
        var _malloc = Module["_malloc"] = asm["_malloc"];
        var _memcpy = Module["_memcpy"] = asm["_memcpy"];
        var _memmove = Module["_memmove"] = asm["_memmove"];
        var _calloc = Module["_calloc"] = asm["_calloc"];
        var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
        var runPostSets = Module["runPostSets"] = asm["runPostSets"];
        var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
        Runtime.stackAlloc = asm["stackAlloc"];
        Runtime.stackSave = asm["stackSave"];
        Runtime.stackRestore = asm["stackRestore"];
        Runtime.setTempRet0 = asm["setTempRet0"];
        Runtime.getTempRet0 = asm["getTempRet0"];
        var i64Math = (function () {
            var goog = {math: {}};
            goog.math.Long = (function (low, high) {
                this.low_ = low | 0;
                this.high_ = high | 0
            });
            goog.math.Long.IntCache_ = {};
            goog.math.Long.fromInt = (function (value) {
                if (-128 <= value && value < 128) {
                    var cachedObj = goog.math.Long.IntCache_[value];
                    if (cachedObj) {
                        return cachedObj
                    }
                }
                var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
                if (-128 <= value && value < 128) {
                    goog.math.Long.IntCache_[value] = obj
                }
                return obj
            });
            goog.math.Long.fromNumber = (function (value) {
                if (isNaN(value) || !isFinite(value)) {
                    return goog.math.Long.ZERO
                } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
                    return goog.math.Long.MIN_VALUE
                } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
                    return goog.math.Long.MAX_VALUE
                } else if (value < 0) {
                    return goog.math.Long.fromNumber(-value).negate()
                } else {
                    return new goog.math.Long(value % goog.math.Long.TWO_PWR_32_DBL_ | 0, value / goog.math.Long.TWO_PWR_32_DBL_ | 0)
                }
            });
            goog.math.Long.fromBits = (function (lowBits, highBits) {
                return new goog.math.Long(lowBits, highBits)
            });
            goog.math.Long.fromString = (function (str, opt_radix) {
                if (str.length == 0) {
                    throw Error("number format error: empty string")
                }
                var radix = opt_radix || 10;
                if (radix < 2 || 36 < radix) {
                    throw Error("radix out of range: " + radix)
                }
                if (str.charAt(0) == "-") {
                    return goog.math.Long.fromString(str.substring(1), radix).negate()
                } else if (str.indexOf("-") >= 0) {
                    throw Error('number format error: interior "-" character: ' + str)
                }
                var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
                var result = goog.math.Long.ZERO;
                for (var i = 0; i < str.length; i += 8) {
                    var size = Math.min(8, str.length - i);
                    var value = parseInt(str.substring(i, i + size), radix);
                    if (size < 8) {
                        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
                        result = result.multiply(power).add(goog.math.Long.fromNumber(value))
                    } else {
                        result = result.multiply(radixToPower);
                        result = result.add(goog.math.Long.fromNumber(value))
                    }
                }
                return result
            });
            goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
            goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
            goog.math.Long.TWO_PWR_32_DBL_ = goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
            goog.math.Long.TWO_PWR_31_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ / 2;
            goog.math.Long.TWO_PWR_48_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
            goog.math.Long.TWO_PWR_64_DBL_ = goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
            goog.math.Long.TWO_PWR_63_DBL_ = goog.math.Long.TWO_PWR_64_DBL_ / 2;
            goog.math.Long.ZERO = goog.math.Long.fromInt(0);
            goog.math.Long.ONE = goog.math.Long.fromInt(1);
            goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
            goog.math.Long.MAX_VALUE = goog.math.Long.fromBits(4294967295 | 0, 2147483647 | 0);
            goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 2147483648 | 0);
            goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
            goog.math.Long.prototype.toInt = (function () {
                return this.low_
            });
            goog.math.Long.prototype.toNumber = (function () {
                return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ + this.getLowBitsUnsigned()
            });
            goog.math.Long.prototype.toString = (function (opt_radix) {
                var radix = opt_radix || 10;
                if (radix < 2 || 36 < radix) {
                    throw Error("radix out of range: " + radix)
                }
                if (this.isZero()) {
                    return "0"
                }
                if (this.isNegative()) {
                    if (this.equals(goog.math.Long.MIN_VALUE)) {
                        var radixLong = goog.math.Long.fromNumber(radix);
                        var div = this.div(radixLong);
                        var rem = div.multiply(radixLong).subtract(this);
                        return div.toString(radix) + rem.toInt().toString(radix)
                    } else {
                        return "-" + this.negate().toString(radix)
                    }
                }
                var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
                var rem = this;
                var result = "";
                while (true) {
                    var remDiv = rem.div(radixToPower);
                    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
                    var digits = intval.toString(radix);
                    rem = remDiv;
                    if (rem.isZero()) {
                        return digits + result
                    } else {
                        while (digits.length < 6) {
                            digits = "0" + digits
                        }
                        result = "" + digits + result
                    }
                }
            });
            goog.math.Long.prototype.getHighBits = (function () {
                return this.high_
            });
            goog.math.Long.prototype.getLowBits = (function () {
                return this.low_
            });
            goog.math.Long.prototype.getLowBitsUnsigned = (function () {
                return this.low_ >= 0 ? this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_
            });
            goog.math.Long.prototype.getNumBitsAbs = (function () {
                if (this.isNegative()) {
                    if (this.equals(goog.math.Long.MIN_VALUE)) {
                        return 64
                    } else {
                        return this.negate().getNumBitsAbs()
                    }
                } else {
                    var val = this.high_ != 0 ? this.high_ : this.low_;
                    for (var bit = 31; bit > 0; bit--) {
                        if ((val & 1 << bit) != 0) {
                            break
                        }
                    }
                    return this.high_ != 0 ? bit + 33 : bit + 1
                }
            });
            goog.math.Long.prototype.isZero = (function () {
                return this.high_ == 0 && this.low_ == 0
            });
            goog.math.Long.prototype.isNegative = (function () {
                return this.high_ < 0
            });
            goog.math.Long.prototype.isOdd = (function () {
                return (this.low_ & 1) == 1
            });
            goog.math.Long.prototype.equals = (function (other) {
                return this.high_ == other.high_ && this.low_ == other.low_
            });
            goog.math.Long.prototype.notEquals = (function (other) {
                return this.high_ != other.high_ || this.low_ != other.low_
            });
            goog.math.Long.prototype.lessThan = (function (other) {
                return this.compare(other) < 0
            });
            goog.math.Long.prototype.lessThanOrEqual = (function (other) {
                return this.compare(other) <= 0
            });
            goog.math.Long.prototype.greaterThan = (function (other) {
                return this.compare(other) > 0
            });
            goog.math.Long.prototype.greaterThanOrEqual = (function (other) {
                return this.compare(other) >= 0
            });
            goog.math.Long.prototype.compare = (function (other) {
                if (this.equals(other)) {
                    return 0
                }
                var thisNeg = this.isNegative();
                var otherNeg = other.isNegative();
                if (thisNeg && !otherNeg) {
                    return -1
                }
                if (!thisNeg && otherNeg) {
                    return 1
                }
                if (this.subtract(other).isNegative()) {
                    return -1
                } else {
                    return 1
                }
            });
            goog.math.Long.prototype.negate = (function () {
                if (this.equals(goog.math.Long.MIN_VALUE)) {
                    return goog.math.Long.MIN_VALUE
                } else {
                    return this.not().add(goog.math.Long.ONE)
                }
            });
            goog.math.Long.prototype.add = (function (other) {
                var a48 = this.high_ >>> 16;
                var a32 = this.high_ & 65535;
                var a16 = this.low_ >>> 16;
                var a00 = this.low_ & 65535;
                var b48 = other.high_ >>> 16;
                var b32 = other.high_ & 65535;
                var b16 = other.low_ >>> 16;
                var b00 = other.low_ & 65535;
                var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
                c00 += a00 + b00;
                c16 += c00 >>> 16;
                c00 &= 65535;
                c16 += a16 + b16;
                c32 += c16 >>> 16;
                c16 &= 65535;
                c32 += a32 + b32;
                c48 += c32 >>> 16;
                c32 &= 65535;
                c48 += a48 + b48;
                c48 &= 65535;
                return goog.math.Long.fromBits(c16 << 16 | c00, c48 << 16 | c32)
            });
            goog.math.Long.prototype.subtract = (function (other) {
                return this.add(other.negate())
            });
            goog.math.Long.prototype.multiply = (function (other) {
                if (this.isZero()) {
                    return goog.math.Long.ZERO
                } else if (other.isZero()) {
                    return goog.math.Long.ZERO
                }
                if (this.equals(goog.math.Long.MIN_VALUE)) {
                    return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO
                } else if (other.equals(goog.math.Long.MIN_VALUE)) {
                    return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO
                }
                if (this.isNegative()) {
                    if (other.isNegative()) {
                        return this.negate().multiply(other.negate())
                    } else {
                        return this.negate().multiply(other).negate()
                    }
                } else if (other.isNegative()) {
                    return this.multiply(other.negate()).negate()
                }
                if (this.lessThan(goog.math.Long.TWO_PWR_24_) && other.lessThan(goog.math.Long.TWO_PWR_24_)) {
                    return goog.math.Long.fromNumber(this.toNumber() * other.toNumber())
                }
                var a48 = this.high_ >>> 16;
                var a32 = this.high_ & 65535;
                var a16 = this.low_ >>> 16;
                var a00 = this.low_ & 65535;
                var b48 = other.high_ >>> 16;
                var b32 = other.high_ & 65535;
                var b16 = other.low_ >>> 16;
                var b00 = other.low_ & 65535;
                var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
                c00 += a00 * b00;
                c16 += c00 >>> 16;
                c00 &= 65535;
                c16 += a16 * b00;
                c32 += c16 >>> 16;
                c16 &= 65535;
                c16 += a00 * b16;
                c32 += c16 >>> 16;
                c16 &= 65535;
                c32 += a32 * b00;
                c48 += c32 >>> 16;
                c32 &= 65535;
                c32 += a16 * b16;
                c48 += c32 >>> 16;
                c32 &= 65535;
                c32 += a00 * b32;
                c48 += c32 >>> 16;
                c32 &= 65535;
                c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
                c48 &= 65535;
                return goog.math.Long.fromBits(c16 << 16 | c00, c48 << 16 | c32)
            });
            goog.math.Long.prototype.div = (function (other) {
                if (other.isZero()) {
                    throw Error("division by zero")
                } else if (this.isZero()) {
                    return goog.math.Long.ZERO
                }
                if (this.equals(goog.math.Long.MIN_VALUE)) {
                    if (other.equals(goog.math.Long.ONE) || other.equals(goog.math.Long.NEG_ONE)) {
                        return goog.math.Long.MIN_VALUE
                    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
                        return goog.math.Long.ONE
                    } else {
                        var halfThis = this.shiftRight(1);
                        var approx = halfThis.div(other).shiftLeft(1);
                        if (approx.equals(goog.math.Long.ZERO)) {
                            return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE
                        } else {
                            var rem = this.subtract(other.multiply(approx));
                            var result = approx.add(rem.div(other));
                            return result
                        }
                    }
                } else if (other.equals(goog.math.Long.MIN_VALUE)) {
                    return goog.math.Long.ZERO
                }
                if (this.isNegative()) {
                    if (other.isNegative()) {
                        return this.negate().div(other.negate())
                    } else {
                        return this.negate().div(other).negate()
                    }
                } else if (other.isNegative()) {
                    return this.div(other.negate()).negate()
                }
                var res = goog.math.Long.ZERO;
                var rem = this;
                while (rem.greaterThanOrEqual(other)) {
                    var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
                    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
                    var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
                    var approxRes = goog.math.Long.fromNumber(approx);
                    var approxRem = approxRes.multiply(other);
                    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
                        approx -= delta;
                        approxRes = goog.math.Long.fromNumber(approx);
                        approxRem = approxRes.multiply(other)
                    }
                    if (approxRes.isZero()) {
                        approxRes = goog.math.Long.ONE
                    }
                    res = res.add(approxRes);
                    rem = rem.subtract(approxRem)
                }
                return res
            });
            goog.math.Long.prototype.modulo = (function (other) {
                return this.subtract(this.div(other).multiply(other))
            });
            goog.math.Long.prototype.not = (function () {
                return goog.math.Long.fromBits(~this.low_, ~this.high_)
            });
            goog.math.Long.prototype.and = (function (other) {
                return goog.math.Long.fromBits(this.low_ & other.low_, this.high_ & other.high_)
            });
            goog.math.Long.prototype.or = (function (other) {
                return goog.math.Long.fromBits(this.low_ | other.low_, this.high_ | other.high_)
            });
            goog.math.Long.prototype.xor = (function (other) {
                return goog.math.Long.fromBits(this.low_ ^ other.low_, this.high_ ^ other.high_)
            });
            goog.math.Long.prototype.shiftLeft = (function (numBits) {
                numBits &= 63;
                if (numBits == 0) {
                    return this
                } else {
                    var low = this.low_;
                    if (numBits < 32) {
                        var high = this.high_;
                        return goog.math.Long.fromBits(low << numBits, high << numBits | low >>> 32 - numBits)
                    } else {
                        return goog.math.Long.fromBits(0, low << numBits - 32)
                    }
                }
            });
            goog.math.Long.prototype.shiftRight = (function (numBits) {
                numBits &= 63;
                if (numBits == 0) {
                    return this
                } else {
                    var high = this.high_;
                    if (numBits < 32) {
                        var low = this.low_;
                        return goog.math.Long.fromBits(low >>> numBits | high << 32 - numBits, high >> numBits)
                    } else {
                        return goog.math.Long.fromBits(high >> numBits - 32, high >= 0 ? 0 : -1)
                    }
                }
            });
            goog.math.Long.prototype.shiftRightUnsigned = (function (numBits) {
                numBits &= 63;
                if (numBits == 0) {
                    return this
                } else {
                    var high = this.high_;
                    if (numBits < 32) {
                        var low = this.low_;
                        return goog.math.Long.fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits)
                    } else if (numBits == 32) {
                        return goog.math.Long.fromBits(high, 0)
                    } else {
                        return goog.math.Long.fromBits(high >>> numBits - 32, 0)
                    }
                }
            });
            var navigator = {appName: "Modern Browser"};
            var dbits;
            var canary = 0xdeadbeefcafe;
            var j_lm = (canary & 16777215) == 15715070;

            function BigInteger(a, b, c) {
                if (a != null)if ("number" == typeof a)this.fromNumber(a, b, c); else if (b == null && "string" != typeof a)this.fromString(a, 256); else this.fromString(a, b)
            }

            function nbi() {
                return new BigInteger(null)
            }

            function am1(i, x, w, j, c, n) {
                while (--n >= 0) {
                    var v = x * this[i++] + w[j] + c;
                    c = Math.floor(v / 67108864);
                    w[j++] = v & 67108863
                }
                return c
            }

            function am2(i, x, w, j, c, n) {
                var xl = x & 32767, xh = x >> 15;
                while (--n >= 0) {
                    var l = this[i] & 32767;
                    var h = this[i++] >> 15;
                    var m = xh * l + h * xl;
                    l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
                    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
                    w[j++] = l & 1073741823
                }
                return c
            }

            function am3(i, x, w, j, c, n) {
                var xl = x & 16383, xh = x >> 14;
                while (--n >= 0) {
                    var l = this[i] & 16383;
                    var h = this[i++] >> 14;
                    var m = xh * l + h * xl;
                    l = xl * l + ((m & 16383) << 14) + w[j] + c;
                    c = (l >> 28) + (m >> 14) + xh * h;
                    w[j++] = l & 268435455
                }
                return c
            }

            if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
                BigInteger.prototype.am = am2;
                dbits = 30
            } else if (j_lm && navigator.appName != "Netscape") {
                BigInteger.prototype.am = am1;
                dbits = 26
            } else {
                BigInteger.prototype.am = am3;
                dbits = 28
            }
            BigInteger.prototype.DB = dbits;
            BigInteger.prototype.DM = (1 << dbits) - 1;
            BigInteger.prototype.DV = 1 << dbits;
            var BI_FP = 52;
            BigInteger.prototype.FV = Math.pow(2, BI_FP);
            BigInteger.prototype.F1 = BI_FP - dbits;
            BigInteger.prototype.F2 = 2 * dbits - BI_FP;
            var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
            var BI_RC = new Array;
            var rr, vv;
            rr = "0".charCodeAt(0);
            for (vv = 0; vv <= 9; ++vv)BI_RC[rr++] = vv;
            rr = "a".charCodeAt(0);
            for (vv = 10; vv < 36; ++vv)BI_RC[rr++] = vv;
            rr = "A".charCodeAt(0);
            for (vv = 10; vv < 36; ++vv)BI_RC[rr++] = vv;
            function int2char(n) {
                return BI_RM.charAt(n)
            }

            function intAt(s, i) {
                var c = BI_RC[s.charCodeAt(i)];
                return c == null ? -1 : c
            }

            function bnpCopyTo(r) {
                for (var i = this.t - 1; i >= 0; --i)r[i] = this[i];
                r.t = this.t;
                r.s = this.s
            }

            function bnpFromInt(x) {
                this.t = 1;
                this.s = x < 0 ? -1 : 0;
                if (x > 0)this[0] = x; else if (x < -1)this[0] = x + DV; else this.t = 0
            }

            function nbv(i) {
                var r = nbi();
                r.fromInt(i);
                return r
            }

            function bnpFromString(s, b) {
                var k;
                if (b == 16)k = 4; else if (b == 8)k = 3; else if (b == 256)k = 8; else if (b == 2)k = 1; else if (b == 32)k = 5; else if (b == 4)k = 2; else {
                    this.fromRadix(s, b);
                    return
                }
                this.t = 0;
                this.s = 0;
                var i = s.length, mi = false, sh = 0;
                while (--i >= 0) {
                    var x = k == 8 ? s[i] & 255 : intAt(s, i);
                    if (x < 0) {
                        if (s.charAt(i) == "-")mi = true;
                        continue
                    }
                    mi = false;
                    if (sh == 0)this[this.t++] = x; else if (sh + k > this.DB) {
                        this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
                        this[this.t++] = x >> this.DB - sh
                    } else this[this.t - 1] |= x << sh;
                    sh += k;
                    if (sh >= this.DB)sh -= this.DB
                }
                if (k == 8 && (s[0] & 128) != 0) {
                    this.s = -1;
                    if (sh > 0)this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh
                }
                this.clamp();
                if (mi)BigInteger.ZERO.subTo(this, this)
            }

            function bnpClamp() {
                var c = this.s & this.DM;
                while (this.t > 0 && this[this.t - 1] == c)--this.t
            }

            function bnToString(b) {
                if (this.s < 0)return "-" + this.negate().toString(b);
                var k;
                if (b == 16)k = 4; else if (b == 8)k = 3; else if (b == 2)k = 1; else if (b == 32)k = 5; else if (b == 4)k = 2; else return this.toRadix(b);
                var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
                var p = this.DB - i * this.DB % k;
                if (i-- > 0) {
                    if (p < this.DB && (d = this[i] >> p) > 0) {
                        m = true;
                        r = int2char(d)
                    }
                    while (i >= 0) {
                        if (p < k) {
                            d = (this[i] & (1 << p) - 1) << k - p;
                            d |= this[--i] >> (p += this.DB - k)
                        } else {
                            d = this[i] >> (p -= k) & km;
                            if (p <= 0) {
                                p += this.DB;
                                --i
                            }
                        }
                        if (d > 0)m = true;
                        if (m)r += int2char(d)
                    }
                }
                return m ? r : "0"
            }

            function bnNegate() {
                var r = nbi();
                BigInteger.ZERO.subTo(this, r);
                return r
            }

            function bnAbs() {
                return this.s < 0 ? this.negate() : this
            }

            function bnCompareTo(a) {
                var r = this.s - a.s;
                if (r != 0)return r;
                var i = this.t;
                r = i - a.t;
                if (r != 0)return this.s < 0 ? -r : r;
                while (--i >= 0)if ((r = this[i] - a[i]) != 0)return r;
                return 0
            }

            function nbits(x) {
                var r = 1, t;
                if ((t = x >>> 16) != 0) {
                    x = t;
                    r += 16
                }
                if ((t = x >> 8) != 0) {
                    x = t;
                    r += 8
                }
                if ((t = x >> 4) != 0) {
                    x = t;
                    r += 4
                }
                if ((t = x >> 2) != 0) {
                    x = t;
                    r += 2
                }
                if ((t = x >> 1) != 0) {
                    x = t;
                    r += 1
                }
                return r
            }

            function bnBitLength() {
                if (this.t <= 0)return 0;
                return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
            }

            function bnpDLShiftTo(n, r) {
                var i;
                for (i = this.t - 1; i >= 0; --i)r[i + n] = this[i];
                for (i = n - 1; i >= 0; --i)r[i] = 0;
                r.t = this.t + n;
                r.s = this.s
            }

            function bnpDRShiftTo(n, r) {
                for (var i = n; i < this.t; ++i)r[i - n] = this[i];
                r.t = Math.max(this.t - n, 0);
                r.s = this.s
            }

            function bnpLShiftTo(n, r) {
                var bs = n % this.DB;
                var cbs = this.DB - bs;
                var bm = (1 << cbs) - 1;
                var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
                for (i = this.t - 1; i >= 0; --i) {
                    r[i + ds + 1] = this[i] >> cbs | c;
                    c = (this[i] & bm) << bs
                }
                for (i = ds - 1; i >= 0; --i)r[i] = 0;
                r[ds] = c;
                r.t = this.t + ds + 1;
                r.s = this.s;
                r.clamp()
            }

            function bnpRShiftTo(n, r) {
                r.s = this.s;
                var ds = Math.floor(n / this.DB);
                if (ds >= this.t) {
                    r.t = 0;
                    return
                }
                var bs = n % this.DB;
                var cbs = this.DB - bs;
                var bm = (1 << bs) - 1;
                r[0] = this[ds] >> bs;
                for (var i = ds + 1; i < this.t; ++i) {
                    r[i - ds - 1] |= (this[i] & bm) << cbs;
                    r[i - ds] = this[i] >> bs
                }
                if (bs > 0)r[this.t - ds - 1] |= (this.s & bm) << cbs;
                r.t = this.t - ds;
                r.clamp()
            }

            function bnpSubTo(a, r) {
                var i = 0, c = 0, m = Math.min(a.t, this.t);
                while (i < m) {
                    c += this[i] - a[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB
                }
                if (a.t < this.t) {
                    c -= a.s;
                    while (i < this.t) {
                        c += this[i];
                        r[i++] = c & this.DM;
                        c >>= this.DB
                    }
                    c += this.s
                } else {
                    c += this.s;
                    while (i < a.t) {
                        c -= a[i];
                        r[i++] = c & this.DM;
                        c >>= this.DB
                    }
                    c -= a.s
                }
                r.s = c < 0 ? -1 : 0;
                if (c < -1)r[i++] = this.DV + c; else if (c > 0)r[i++] = c;
                r.t = i;
                r.clamp()
            }

            function bnpMultiplyTo(a, r) {
                var x = this.abs(), y = a.abs();
                var i = x.t;
                r.t = i + y.t;
                while (--i >= 0)r[i] = 0;
                for (i = 0; i < y.t; ++i)r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
                r.s = 0;
                r.clamp();
                if (this.s != a.s)BigInteger.ZERO.subTo(r, r)
            }

            function bnpSquareTo(r) {
                var x = this.abs();
                var i = r.t = 2 * x.t;
                while (--i >= 0)r[i] = 0;
                for (i = 0; i < x.t - 1; ++i) {
                    var c = x.am(i, x[i], r, 2 * i, 0, 1);
                    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                        r[i + x.t] -= x.DV;
                        r[i + x.t + 1] = 1
                    }
                }
                if (r.t > 0)r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
                r.s = 0;
                r.clamp()
            }

            function bnpDivRemTo(m, q, r) {
                var pm = m.abs();
                if (pm.t <= 0)return;
                var pt = this.abs();
                if (pt.t < pm.t) {
                    if (q != null)q.fromInt(0);
                    if (r != null)this.copyTo(r);
                    return
                }
                if (r == null)r = nbi();
                var y = nbi(), ts = this.s, ms = m.s;
                var nsh = this.DB - nbits(pm[pm.t - 1]);
                if (nsh > 0) {
                    pm.lShiftTo(nsh, y);
                    pt.lShiftTo(nsh, r)
                } else {
                    pm.copyTo(y);
                    pt.copyTo(r)
                }
                var ys = y.t;
                var y0 = y[ys - 1];
                if (y0 == 0)return;
                var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
                var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
                var i = r.t, j = i - ys, t = q == null ? nbi() : q;
                y.dlShiftTo(j, t);
                if (r.compareTo(t) >= 0) {
                    r[r.t++] = 1;
                    r.subTo(t, r)
                }
                BigInteger.ONE.dlShiftTo(ys, t);
                t.subTo(y, y);
                while (y.t < ys)y[y.t++] = 0;
                while (--j >= 0) {
                    var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
                    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                        y.dlShiftTo(j, t);
                        r.subTo(t, r);
                        while (r[i] < --qd)r.subTo(t, r)
                    }
                }
                if (q != null) {
                    r.drShiftTo(ys, q);
                    if (ts != ms)BigInteger.ZERO.subTo(q, q)
                }
                r.t = ys;
                r.clamp();
                if (nsh > 0)r.rShiftTo(nsh, r);
                if (ts < 0)BigInteger.ZERO.subTo(r, r)
            }

            function bnMod(a) {
                var r = nbi();
                this.abs().divRemTo(a, null, r);
                if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)a.subTo(r, r);
                return r
            }

            function Classic(m) {
                this.m = m
            }

            function cConvert(x) {
                if (x.s < 0 || x.compareTo(this.m) >= 0)return x.mod(this.m); else return x
            }

            function cRevert(x) {
                return x
            }

            function cReduce(x) {
                x.divRemTo(this.m, null, x)
            }

            function cMulTo(x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r)
            }

            function cSqrTo(x, r) {
                x.squareTo(r);
                this.reduce(r)
            }

            Classic.prototype.convert = cConvert;
            Classic.prototype.revert = cRevert;
            Classic.prototype.reduce = cReduce;
            Classic.prototype.mulTo = cMulTo;
            Classic.prototype.sqrTo = cSqrTo;
            function bnpInvDigit() {
                if (this.t < 1)return 0;
                var x = this[0];
                if ((x & 1) == 0)return 0;
                var y = x & 3;
                y = y * (2 - (x & 15) * y) & 15;
                y = y * (2 - (x & 255) * y) & 255;
                y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
                y = y * (2 - x * y % this.DV) % this.DV;
                return y > 0 ? this.DV - y : -y
            }

            function Montgomery(m) {
                this.m = m;
                this.mp = m.invDigit();
                this.mpl = this.mp & 32767;
                this.mph = this.mp >> 15;
                this.um = (1 << m.DB - 15) - 1;
                this.mt2 = 2 * m.t
            }

            function montConvert(x) {
                var r = nbi();
                x.abs().dlShiftTo(this.m.t, r);
                r.divRemTo(this.m, null, r);
                if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)this.m.subTo(r, r);
                return r
            }

            function montRevert(x) {
                var r = nbi();
                x.copyTo(r);
                this.reduce(r);
                return r
            }

            function montReduce(x) {
                while (x.t <= this.mt2)x[x.t++] = 0;
                for (var i = 0; i < this.m.t; ++i) {
                    var j = x[i] & 32767;
                    var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
                    j = i + this.m.t;
                    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
                    while (x[j] >= x.DV) {
                        x[j] -= x.DV;
                        x[++j]++
                    }
                }
                x.clamp();
                x.drShiftTo(this.m.t, x);
                if (x.compareTo(this.m) >= 0)x.subTo(this.m, x)
            }

            function montSqrTo(x, r) {
                x.squareTo(r);
                this.reduce(r)
            }

            function montMulTo(x, y, r) {
                x.multiplyTo(y, r);
                this.reduce(r)
            }

            Montgomery.prototype.convert = montConvert;
            Montgomery.prototype.revert = montRevert;
            Montgomery.prototype.reduce = montReduce;
            Montgomery.prototype.mulTo = montMulTo;
            Montgomery.prototype.sqrTo = montSqrTo;
            function bnpIsEven() {
                return (this.t > 0 ? this[0] & 1 : this.s) == 0
            }

            function bnpExp(e, z) {
                if (e > 4294967295 || e < 1)return BigInteger.ONE;
                var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
                g.copyTo(r);
                while (--i >= 0) {
                    z.sqrTo(r, r2);
                    if ((e & 1 << i) > 0)z.mulTo(r2, g, r); else {
                        var t = r;
                        r = r2;
                        r2 = t
                    }
                }
                return z.revert(r)
            }

            function bnModPowInt(e, m) {
                var z;
                if (e < 256 || m.isEven())z = new Classic(m); else z = new Montgomery(m);
                return this.exp(e, z)
            }

            BigInteger.prototype.copyTo = bnpCopyTo;
            BigInteger.prototype.fromInt = bnpFromInt;
            BigInteger.prototype.fromString = bnpFromString;
            BigInteger.prototype.clamp = bnpClamp;
            BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
            BigInteger.prototype.drShiftTo = bnpDRShiftTo;
            BigInteger.prototype.lShiftTo = bnpLShiftTo;
            BigInteger.prototype.rShiftTo = bnpRShiftTo;
            BigInteger.prototype.subTo = bnpSubTo;
            BigInteger.prototype.multiplyTo = bnpMultiplyTo;
            BigInteger.prototype.squareTo = bnpSquareTo;
            BigInteger.prototype.divRemTo = bnpDivRemTo;
            BigInteger.prototype.invDigit = bnpInvDigit;
            BigInteger.prototype.isEven = bnpIsEven;
            BigInteger.prototype.exp = bnpExp;
            BigInteger.prototype.toString = bnToString;
            BigInteger.prototype.negate = bnNegate;
            BigInteger.prototype.abs = bnAbs;
            BigInteger.prototype.compareTo = bnCompareTo;
            BigInteger.prototype.bitLength = bnBitLength;
            BigInteger.prototype.mod = bnMod;
            BigInteger.prototype.modPowInt = bnModPowInt;
            BigInteger.ZERO = nbv(0);
            BigInteger.ONE = nbv(1);
            function bnpFromRadix(s, b) {
                this.fromInt(0);
                if (b == null)b = 10;
                var cs = this.chunkSize(b);
                var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
                for (var i = 0; i < s.length; ++i) {
                    var x = intAt(s, i);
                    if (x < 0) {
                        if (s.charAt(i) == "-" && this.signum() == 0)mi = true;
                        continue
                    }
                    w = b * w + x;
                    if (++j >= cs) {
                        this.dMultiply(d);
                        this.dAddOffset(w, 0);
                        j = 0;
                        w = 0
                    }
                }
                if (j > 0) {
                    this.dMultiply(Math.pow(b, j));
                    this.dAddOffset(w, 0)
                }
                if (mi)BigInteger.ZERO.subTo(this, this)
            }

            function bnpChunkSize(r) {
                return Math.floor(Math.LN2 * this.DB / Math.log(r))
            }

            function bnSigNum() {
                if (this.s < 0)return -1; else if (this.t <= 0 || this.t == 1 && this[0] <= 0)return 0; else return 1
            }

            function bnpDMultiply(n) {
                this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
                ++this.t;
                this.clamp()
            }

            function bnpDAddOffset(n, w) {
                if (n == 0)return;
                while (this.t <= w)this[this.t++] = 0;
                this[w] += n;
                while (this[w] >= this.DV) {
                    this[w] -= this.DV;
                    if (++w >= this.t)this[this.t++] = 0;
                    ++this[w]
                }
            }

            function bnpToRadix(b) {
                if (b == null)b = 10;
                if (this.signum() == 0 || b < 2 || b > 36)return "0";
                var cs = this.chunkSize(b);
                var a = Math.pow(b, cs);
                var d = nbv(a), y = nbi(), z = nbi(), r = "";
                this.divRemTo(d, y, z);
                while (y.signum() > 0) {
                    r = (a + z.intValue()).toString(b).substr(1) + r;
                    y.divRemTo(d, y, z)
                }
                return z.intValue().toString(b) + r
            }

            function bnIntValue() {
                if (this.s < 0) {
                    if (this.t == 1)return this[0] - this.DV; else if (this.t == 0)return -1
                } else if (this.t == 1)return this[0]; else if (this.t == 0)return 0;
                return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
            }

            function bnpAddTo(a, r) {
                var i = 0, c = 0, m = Math.min(a.t, this.t);
                while (i < m) {
                    c += this[i] + a[i];
                    r[i++] = c & this.DM;
                    c >>= this.DB
                }
                if (a.t < this.t) {
                    c += a.s;
                    while (i < this.t) {
                        c += this[i];
                        r[i++] = c & this.DM;
                        c >>= this.DB
                    }
                    c += this.s
                } else {
                    c += this.s;
                    while (i < a.t) {
                        c += a[i];
                        r[i++] = c & this.DM;
                        c >>= this.DB
                    }
                    c += a.s
                }
                r.s = c < 0 ? -1 : 0;
                if (c > 0)r[i++] = c; else if (c < -1)r[i++] = this.DV + c;
                r.t = i;
                r.clamp()
            }

            BigInteger.prototype.fromRadix = bnpFromRadix;
            BigInteger.prototype.chunkSize = bnpChunkSize;
            BigInteger.prototype.signum = bnSigNum;
            BigInteger.prototype.dMultiply = bnpDMultiply;
            BigInteger.prototype.dAddOffset = bnpDAddOffset;
            BigInteger.prototype.toRadix = bnpToRadix;
            BigInteger.prototype.intValue = bnIntValue;
            BigInteger.prototype.addTo = bnpAddTo;
            var Wrapper = {
                abs: (function (l, h) {
                    var x = new goog.math.Long(l, h);
                    var ret;
                    if (x.isNegative()) {
                        ret = x.negate()
                    } else {
                        ret = x
                    }
                    HEAP32[tempDoublePtr >> 2] = ret.low_;
                    HEAP32[tempDoublePtr + 4 >> 2] = ret.high_
                }), ensureTemps: (function () {
                    if (Wrapper.ensuredTemps)return;
                    Wrapper.ensuredTemps = true;
                    Wrapper.two32 = new BigInteger;
                    Wrapper.two32.fromString("4294967296", 10);
                    Wrapper.two64 = new BigInteger;
                    Wrapper.two64.fromString("18446744073709551616", 10);
                    Wrapper.temp1 = new BigInteger;
                    Wrapper.temp2 = new BigInteger
                }), lh2bignum: (function (l, h) {
                    var a = new BigInteger;
                    a.fromString(h.toString(), 10);
                    var b = new BigInteger;
                    a.multiplyTo(Wrapper.two32, b);
                    var c = new BigInteger;
                    c.fromString(l.toString(), 10);
                    var d = new BigInteger;
                    c.addTo(b, d);
                    return d
                }), stringify: (function (l, h, unsigned) {
                    var ret = (new goog.math.Long(l, h)).toString();
                    if (unsigned && ret[0] == "-") {
                        Wrapper.ensureTemps();
                        var bignum = new BigInteger;
                        bignum.fromString(ret, 10);
                        ret = new BigInteger;
                        Wrapper.two64.addTo(bignum, ret);
                        ret = ret.toString(10)
                    }
                    return ret
                }), fromString: (function (str, base, min, max, unsigned) {
                    Wrapper.ensureTemps();
                    var bignum = new BigInteger;
                    bignum.fromString(str, base);
                    var bigmin = new BigInteger;
                    bigmin.fromString(min, 10);
                    var bigmax = new BigInteger;
                    bigmax.fromString(max, 10);
                    if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
                        var temp = new BigInteger;
                        bignum.addTo(Wrapper.two64, temp);
                        bignum = temp
                    }
                    var error = false;
                    if (bignum.compareTo(bigmin) < 0) {
                        bignum = bigmin;
                        error = true
                    } else if (bignum.compareTo(bigmax) > 0) {
                        bignum = bigmax;
                        error = true
                    }
                    var ret = goog.math.Long.fromString(bignum.toString());
                    HEAP32[tempDoublePtr >> 2] = ret.low_;
                    HEAP32[tempDoublePtr + 4 >> 2] = ret.high_;
                    if (error)throw"range error"
                })
            };
            return Wrapper
        })();
        if (memoryInitializer) {
            if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
                var data = Module["readBinary"](memoryInitializer);
                HEAPU8.set(data, STATIC_BASE)
            } else {
                addRunDependency("memory initializer");
                Browser.asyncLoad(memoryInitializer, (function (data) {
                    HEAPU8.set(data, STATIC_BASE);
                    removeRunDependency("memory initializer")
                }), (function (data) {
                    throw"could not load memory initializer " + memoryInitializer
                }))
            }
        }
        function ExitStatus(status) {
            this.name = "ExitStatus";
            this.message = "Program terminated with exit(" + status + ")";
            this.status = status
        }

        ExitStatus.prototype = new Error;
        ExitStatus.prototype.constructor = ExitStatus;
        var initialStackTop;
        var preloadStartTime = null;
        var calledMain = false;
        dependenciesFulfilled = function runCaller() {
            if (!Module["calledRun"] && shouldRunNow)run();
            if (!Module["calledRun"])dependenciesFulfilled = runCaller
        };
        Module["callMain"] = Module.callMain = function callMain(args) {
            assert(runDependencies == 0, "cannot call main when async dependencies remain! (listen on __ATMAIN__)");
            assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
            args = args || [];
            ensureInitRuntime();
            var argc = args.length + 1;

            function pad() {
                for (var i = 0; i < 4 - 1; i++) {
                    argv.push(0)
                }
            }

            var argv = [allocate(intArrayFromString(Module["thisProgram"] || "/bin/this.program"), "i8", ALLOC_NORMAL)];
            pad();
            for (var i = 0; i < argc - 1; i = i + 1) {
                argv.push(allocate(intArrayFromString(args[i]), "i8", ALLOC_NORMAL));
                pad()
            }
            argv.push(0);
            argv = allocate(argv, "i32", ALLOC_NORMAL);
            initialStackTop = STACKTOP;
            try {
                var ret = Module["_main"](argc, argv, 0);
                if (!Module["noExitRuntime"]) {
                    exit(ret)
                }
            } catch (e) {
                if (e instanceof ExitStatus) {
                    return
                } else if (e == "SimulateInfiniteLoop") {
                    Module["noExitRuntime"] = true;
                    return
                } else {
                    if (e && typeof e === "object" && e.stack)Module.printErr("exception thrown: " + [e, e.stack]);
                    throw e
                }
            } finally {
                calledMain = true
            }
        };
        function run(args) {
            args = args || Module["arguments"];
            if (preloadStartTime === null)preloadStartTime = Date.now();
            if (runDependencies > 0) {
                Module.printErr("run() called, but dependencies remain, so not running");
                return
            }
            preRun();
            if (runDependencies > 0)return;
            if (Module["calledRun"])return;
            function doRun() {
                if (Module["calledRun"])return;
                Module["calledRun"] = true;
                ensureInitRuntime();
                preMain();
                if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
                    Module.printErr("pre-main prep time: " + (Date.now() - preloadStartTime) + " ms")
                }
                if (Module["_main"] && shouldRunNow) {
                    Module["callMain"](args)
                }
                postRun()
            }

            if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout((function () {
                    setTimeout((function () {
                        Module["setStatus"]("")
                    }), 1);
                    if (!ABORT)doRun()
                }), 1)
            } else {
                doRun()
            }
        }

        Module["run"] = Module.run = run;
        function exit(status) {
            ABORT = true;
            EXITSTATUS = status;
            STACKTOP = initialStackTop;
            exitRuntime();
            throw new ExitStatus(status)
        }

        Module["exit"] = Module.exit = exit;
        function abort(text) {
            if (text) {
                Module.print(text);
                Module.printErr(text)
            }
            ABORT = true;
            EXITSTATUS = 1;
            var extra = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
            throw"abort() at " + stackTrace() + extra
        }

        Module["abort"] = Module.abort = abort;
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function")Module["preInit"] = [Module["preInit"]];
            while (Module["preInit"].length > 0) {
                Module["preInit"].pop()()
            }
        }
        var shouldRunNow = true;
        if (Module["noInitialRun"]) {
            shouldRunNow = false
        }
        run()


        module.exports = Module

    }, {}], 2: [function (require, module, exports) {
        (function (global) {
            var AV = (typeof window !== "undefined" ? window.AV : typeof global !== "undefined" ? global.AV : null);
            var Ogg = require('../build/libogg');

            var OggDemuxer = AV.Demuxer.extend(function () {
                AV.Demuxer.register(this);

                this.probe = function (buffer) {
                    return buffer.peekString(0, 4) === 'OggS';
                };

                this.plugins = [];
                var BUFFER_SIZE = 8192;

                this.prototype.init = function () {
                    this.ogg = Ogg._AVOggInit();
                    this.buf = Ogg._malloc(BUFFER_SIZE);

                    var self = this;
                    var plugin = null;
                    var doneHeaders = false;

                    // copy the stream in case we override it, e.g. flac
                    this._stream = this.stream;

                    this.callback = Ogg.Runtime.addFunction(function (packet, bytes) {
                        var data = new Uint8Array(Ogg.HEAPU8.subarray(packet, packet + bytes));

                        // find plugin for codec
                        if (!plugin) {
                            for (var i = 0; i < OggDemuxer.plugins.length; i++) {
                                var cur = OggDemuxer.plugins[i];
                                var magic = data.subarray(0, cur.magic.length);
                                if (String.fromCharCode.apply(String, magic) === cur.magic) {
                                    plugin = cur;
                                    break;
                                }
                            }

                            if (!plugin)
                                throw new Error("Unknown format in Ogg file.");

                            if (plugin.init)
                                plugin.init.call(self);
                        }

                        // send packet to plugin
                        if (!doneHeaders)
                            doneHeaders = plugin.readHeaders.call(self, data);
                        else
                            plugin.readPacket.call(self, data);
                    });
                };

                this.prototype.readChunk = function () {
                    while (this._stream.available(BUFFER_SIZE)) {
                        Ogg.HEAPU8.set(this._stream.readBuffer(BUFFER_SIZE).data, this.buf);
                        Ogg._AVOggRead(this.ogg, this.buf, BUFFER_SIZE, this.callback);
                    }
                };

                this.prototype.destroy = function () {
                    this._super();
                    Ogg.Runtime.removeFunction(this.callback);
                    Ogg._AVOggDestroy(this.ogg);
                    Ogg._free(this.buf);

                    this.ogg = null;
                    this.buf = null;
                    this.callback = null;
                };
            });

            module.exports = OggDemuxer;
            AV.OggDemuxer = OggDemuxer; // for browser

        }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"../build/libogg": 1}]
}, {}, [2])