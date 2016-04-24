webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	__webpack_require__(33);

	var _browser = __webpack_require__(48);

	var _core = __webpack_require__(71);

	var _ng2Translate = __webpack_require__(262);

	var _app = __webpack_require__(299);

	var _router = __webpack_require__(300);

	var _http = __webpack_require__(263);

	var _auth = __webpack_require__(334);

	var _webradio = __webpack_require__(356);

	if (false) {
	  (0, _core.enableProdMode)();
	}

	(0, _browser.bootstrap)(_app.AppComponent, [_http.HTTP_PROVIDERS, _router.ROUTER_PROVIDERS, _ng2Translate.TRANSLATE_PROVIDERS, (0, _core.provide)(_router.LocationStrategy, { useClass: _router.HashLocationStrategy }), _auth.AUTH_PROVIDERS, _webradio.WEBRADIO_PROVIDERS]);

/***/ },

/***/ 262:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(71);
	var http_1 = __webpack_require__(263);
	var translate_pipe_1 = __webpack_require__(278);
	var translate_service_1 = __webpack_require__(279);
	__export(__webpack_require__(278));
	__export(__webpack_require__(279));
	__export(__webpack_require__(298));
	exports.TRANSLATE_PROVIDERS = [
	    core_1.provide(translate_service_1.TranslateLoader, {
	        useFactory: function (http) { return new translate_service_1.TranslateStaticLoader(http); },
	        deps: [http_1.Http]
	    }),
	    translate_service_1.TranslateService
	];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    pipes: [translate_pipe_1.TranslatePipe],
	    providers: [translate_service_1.TranslateService]
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXRyYW5zbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nMi10cmFuc2xhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHFCQUFzQixlQUFlLENBQUMsQ0FBQTtBQUN0QyxxQkFBbUIsZUFBZSxDQUFDLENBQUE7QUFDbkMsK0JBQTRCLHNCQUFzQixDQUFDLENBQUE7QUFDbkQsa0NBQXVFLHlCQUF5QixDQUFDLENBQUE7QUFFakcsaUJBQWMsc0JBQXNCLENBQUMsRUFBQTtBQUNyQyxpQkFBYyx5QkFBeUIsQ0FBQyxFQUFBO0FBQ3hDLGlCQUFjLHdCQUF3QixDQUFDLEVBQUE7QUFFMUIsMkJBQW1CLEdBQVE7SUFDcEMsY0FBTyxDQUFDLG1DQUFlLEVBQUU7UUFDckIsVUFBVSxFQUFFLFVBQUMsSUFBVSxJQUFLLE9BQUEsSUFBSSx5Q0FBcUIsQ0FBQyxJQUFJLENBQUMsRUFBL0IsQ0FBK0I7UUFDM0QsSUFBSSxFQUFFLENBQUMsV0FBSSxDQUFDO0tBQ2YsQ0FBQztJQUNGLG9DQUFnQjtDQUNuQixDQUFDO0FBR0Y7a0JBQWU7SUFDWCxLQUFLLEVBQUUsQ0FBQyw4QkFBYSxDQUFDO0lBQ3RCLFNBQVMsRUFBRSxDQUFDLG9DQUFnQixDQUFDO0NBQ2hDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Byb3ZpZGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtIdHRwfSBmcm9tICdhbmd1bGFyMi9odHRwJztcbmltcG9ydCB7VHJhbnNsYXRlUGlwZX0gZnJvbSAnLi9zcmMvdHJhbnNsYXRlLnBpcGUnO1xuaW1wb3J0IHtUcmFuc2xhdGVTZXJ2aWNlLCBUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZVN0YXRpY0xvYWRlcn0gZnJvbSAnLi9zcmMvdHJhbnNsYXRlLnNlcnZpY2UnO1xuXG5leHBvcnQgKiBmcm9tICcuL3NyYy90cmFuc2xhdGUucGlwZSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy90cmFuc2xhdGUuc2VydmljZSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy90cmFuc2xhdGUucGFyc2VyJztcblxuZXhwb3J0IGNvbnN0IFRSQU5TTEFURV9QUk9WSURFUlM6IGFueSA9IFtcbiAgICBwcm92aWRlKFRyYW5zbGF0ZUxvYWRlciwge1xuICAgICAgICB1c2VGYWN0b3J5OiAoaHR0cDogSHR0cCkgPT4gbmV3IFRyYW5zbGF0ZVN0YXRpY0xvYWRlcihodHRwKSxcbiAgICAgICAgZGVwczogW0h0dHBdXG4gICAgfSksXG4gICAgVHJhbnNsYXRlU2VydmljZVxuXTtcblxuLy8gZm9yIGFuZ3VsYXItY2xpXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcGlwZXM6IFtUcmFuc2xhdGVQaXBlXSxcbiAgICBwcm92aWRlcnM6IFtUcmFuc2xhdGVTZXJ2aWNlXVxufSJdfQ==

/***/ },

/***/ 278:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(71);
	var translate_service_1 = __webpack_require__(279);
	var lang_1 = __webpack_require__(50);
	var TranslatePipe = (function () {
	    function TranslatePipe(translate, _ref) {
	        this.translate = translate;
	        this._ref = _ref;
	        this.value = '';
	    }
	    /**
	     * @name equals
	     *
	     * @description
	     * Determines if two objects or two values are equivalent.
	     *
	     * Two objects or values are considered equivalent if at least one of the following is true:
	     *
	     * * Both objects or values pass `===` comparison.
	     * * Both objects or values are of the same type and all of their properties are equal by
	     *   comparing them with `equals`.
	     *
	     * @param {*} o1 Object or value to compare.
	     * @param {*} o2 Object or value to compare.
	     * @returns {boolean} True if arguments are equal.
	     */
	    TranslatePipe.prototype.equals = function (o1, o2) {
	        if (o1 === o2)
	            return true;
	        if (o1 === null || o2 === null)
	            return false;
	        if (o1 !== o1 && o2 !== o2)
	            return true; // NaN === NaN
	        var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
	        if (t1 == t2 && t1 == 'object') {
	            if (lang_1.isArray(o1)) {
	                if (!lang_1.isArray(o2))
	                    return false;
	                if ((length = o1.length) == o2.length) {
	                    for (key = 0; key < length; key++) {
	                        if (!this.equals(o1[key], o2[key]))
	                            return false;
	                    }
	                    return true;
	                }
	            }
	            else {
	                if (lang_1.isArray(o2)) {
	                    return false;
	                }
	                keySet = Object.create(null);
	                for (key in o1) {
	                    if (!this.equals(o1[key], o2[key])) {
	                        return false;
	                    }
	                    keySet[key] = true;
	                }
	                for (key in o2) {
	                    if (!(key in keySet) && typeof o2[key] !== 'undefined') {
	                        return false;
	                    }
	                }
	                return true;
	            }
	        }
	        return false;
	    };
	    TranslatePipe.prototype.updateValue = function (key, interpolateParams) {
	        var _this = this;
	        this.translate.get(key, interpolateParams).subscribe(function (res) {
	            _this.value = res ? res : key;
	            _this._ref.markForCheck();
	        });
	    };
	    TranslatePipe.prototype.transform = function (query, args) {
	        var _this = this;
	        if (!query || query.length === 0) {
	            return query;
	        }
	        // if we ask another time for the same key, return the last value
	        if (this.equals(query, this.lastKey) && this.equals(args, this.lastParams)) {
	            return this.value;
	        }
	        var interpolateParams;
	        if (args.length && args[0] !== null) {
	            if (typeof args[0] === 'string' && args[0].length) {
	                // we accept objects written in the template such as {n:1},
	                // which is why we might need to change it to real JSON objects such as {"n":1}
	                try {
	                    interpolateParams = JSON.parse(args[0].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '));
	                }
	                catch (e) {
	                    throw new SyntaxError("Wrong parameter in TranslatePipe. Expected a valid Object, received: " + args[0]);
	                }
	            }
	            else if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
	                interpolateParams = args[0];
	            }
	        }
	        // store the query, in case it changes
	        this.lastKey = query;
	        // store the params, in case they change
	        this.lastParams = args;
	        // set the value
	        this.updateValue(query, interpolateParams);
	        // if there is a subscription to onLangChange, clean it
	        this._dispose();
	        // subscribe to onLangChange event, in case the language changes
	        this.onLangChange = this.translate.onLangChange.subscribe(function (event) {
	            _this.updateValue(query, interpolateParams);
	        });
	        return this.value;
	    };
	    /**
	     * Clean any existing subscription to onLangChange events
	     * @private
	     */
	    TranslatePipe.prototype._dispose = function () {
	        if (lang_1.isPresent(this.onLangChange)) {
	            this.onLangChange.unsubscribe();
	            this.onLangChange = undefined;
	        }
	    };
	    TranslatePipe.prototype.ngOnDestroy = function () {
	        this._dispose();
	    };
	    TranslatePipe = __decorate([
	        core_1.Injectable(),
	        core_1.Pipe({
	            name: 'translate',
	            pure: false // required to update the value when the promise is resolved
	        }), 
	        __metadata('design:paramtypes', [translate_service_1.TranslateService, core_1.ChangeDetectorRef])
	    ], TranslatePipe);
	    return TranslatePipe;
	}());
	exports.TranslatePipe = TranslatePipe;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFuc2xhdGUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTBGLGVBQWUsQ0FBQyxDQUFBO0FBQzFHLGtDQUFnRCxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3RFLHFCQUFpQywwQkFBMEIsQ0FBQyxDQUFBO0FBTzVEO0lBTUksdUJBQW9CLFNBQTJCLEVBQVUsSUFBdUI7UUFBNUQsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUxoRixVQUFLLEdBQVcsRUFBRSxDQUFDO0lBTW5CLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSyw4QkFBTSxHQUFkLFVBQWUsRUFBTyxFQUFFLEVBQU87UUFDM0IsRUFBRSxDQUFBLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDMUIsRUFBRSxDQUFBLENBQUMsRUFBRSxLQUFLLElBQUksSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUM1QyxFQUFFLENBQUEsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYztRQUN0RCxJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxFQUFFLEVBQUUsTUFBYyxFQUFFLEdBQVEsRUFBRSxNQUFXLENBQUM7UUFDMUUsRUFBRSxDQUFBLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUEsQ0FBQyxjQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEVBQUUsQ0FBQSxDQUFDLENBQUMsY0FBTyxDQUFDLEVBQUUs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QVksQ0FBQyxTQUFTLENBQUMsVUFBQyxLQUFzQjtZQUM3RSxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdDQUFRLEdBQVI7UUFDSSxFQUFFLENBQUEsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG1DQUFXLEdBQVg7UUFDSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQWxJTDtRQUFDLGlCQUFVLEVBQUU7UUFDWixXQUFJLENBQUM7WUFDRixJQUFJLEVBQUUsV0FBVztZQUNqQixJQUFJLEVBQUUsS0FBSyxDQUFDLDREQUE0RDtTQUMzRSxDQUFDOztxQkFBQTtJQStIRixvQkFBQztBQUFELENBQUMsQUE5SEQsSUE4SEM7QUE5SFkscUJBQWEsZ0JBOEh6QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQaXBlVHJhbnNmb3JtLCBQaXBlLCBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtUcmFuc2xhdGVTZXJ2aWNlLCBMYW5nQ2hhbmdlRXZlbnR9IGZyb20gJy4vdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQXJyYXl9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcblxuQEluamVjdGFibGUoKVxuQFBpcGUoe1xuICAgIG5hbWU6ICd0cmFuc2xhdGUnLFxuICAgIHB1cmU6IGZhbHNlIC8vIHJlcXVpcmVkIHRvIHVwZGF0ZSB0aGUgdmFsdWUgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZFxufSlcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSwgT25EZXN0cm95IHtcbiAgICB2YWx1ZTogc3RyaW5nID0gJyc7XG4gICAgbGFzdEtleTogc3RyaW5nO1xuICAgIGxhc3RQYXJhbXM6IGFueVtdO1xuICAgIG9uTGFuZ0NoYW5nZTogRXZlbnRFbWl0dGVyPExhbmdDaGFuZ2VFdmVudD47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGVxdWFsc1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogRGV0ZXJtaW5lcyBpZiB0d28gb2JqZWN0cyBvciB0d28gdmFsdWVzIGFyZSBlcXVpdmFsZW50LlxuICAgICAqXG4gICAgICogVHdvIG9iamVjdHMgb3IgdmFsdWVzIGFyZSBjb25zaWRlcmVkIGVxdWl2YWxlbnQgaWYgYXQgbGVhc3Qgb25lIG9mIHRoZSBmb2xsb3dpbmcgaXMgdHJ1ZTpcbiAgICAgKlxuICAgICAqICogQm90aCBvYmplY3RzIG9yIHZhbHVlcyBwYXNzIGA9PT1gIGNvbXBhcmlzb24uXG4gICAgICogKiBCb3RoIG9iamVjdHMgb3IgdmFsdWVzIGFyZSBvZiB0aGUgc2FtZSB0eXBlIGFuZCBhbGwgb2YgdGhlaXIgcHJvcGVydGllcyBhcmUgZXF1YWwgYnlcbiAgICAgKiAgIGNvbXBhcmluZyB0aGVtIHdpdGggYGVxdWFsc2AuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IG8xIE9iamVjdCBvciB2YWx1ZSB0byBjb21wYXJlLlxuICAgICAqIEBwYXJhbSB7Kn0gbzIgT2JqZWN0IG9yIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgYXJndW1lbnRzIGFyZSBlcXVhbC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGVxdWFscyhvMTogYW55LCBvMjogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGlmKG8xID09PSBvMikgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmKG8xID09PSBudWxsIHx8IG8yID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKG8xICE9PSBvMSAmJiBvMiAhPT0gbzIpIHJldHVybiB0cnVlOyAvLyBOYU4gPT09IE5hTlxuICAgICAgICB2YXIgdDEgPSB0eXBlb2YgbzEsIHQyID0gdHlwZW9mIG8yLCBsZW5ndGg6IG51bWJlciwga2V5OiBhbnksIGtleVNldDogYW55O1xuICAgICAgICBpZih0MSA9PSB0MiAmJiB0MSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYoaXNBcnJheShvMSkpIHtcbiAgICAgICAgICAgICAgICBpZighaXNBcnJheShvMikpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZigobGVuZ3RoID0gbzEubGVuZ3RoKSA9PSBvMi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5lcXVhbHMobzFba2V5XSwgbzJba2V5XSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKGlzQXJyYXkobzIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga2V5U2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBvMSkge1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5lcXVhbHMobzFba2V5XSwgbzJba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBrZXlTZXRba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIG8yKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCEoa2V5IGluIGtleVNldCkgJiYgdHlwZW9mIG8yW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHVwZGF0ZVZhbHVlKGtleTogc3RyaW5nLCBpbnRlcnBvbGF0ZVBhcmFtcz86IE9iamVjdCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZS5nZXQoa2V5LCBpbnRlcnBvbGF0ZVBhcmFtcykuc3Vic2NyaWJlKChyZXM6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHJlcyA/IHJlcyA6IGtleTtcbiAgICAgICAgICAgIHRoaXMuX3JlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtKHF1ZXJ5OiBzdHJpbmcsIGFyZ3M6IGFueVtdKTogYW55IHtcbiAgICAgICAgaWYoIXF1ZXJ5IHx8IHF1ZXJ5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5O1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHdlIGFzayBhbm90aGVyIHRpbWUgZm9yIHRoZSBzYW1lIGtleSwgcmV0dXJuIHRoZSBsYXN0IHZhbHVlXG4gICAgICAgIGlmKHRoaXMuZXF1YWxzKHF1ZXJ5LCB0aGlzLmxhc3RLZXkpICYmIHRoaXMuZXF1YWxzKGFyZ3MsIHRoaXMubGFzdFBhcmFtcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGludGVycG9sYXRlUGFyYW1zOiBPYmplY3Q7XG4gICAgICAgIGlmKGFyZ3MubGVuZ3RoICYmIGFyZ3NbMF0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJyAmJiBhcmdzWzBdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIHdlIGFjY2VwdCBvYmplY3RzIHdyaXR0ZW4gaW4gdGhlIHRlbXBsYXRlIHN1Y2ggYXMge246MX0sXG4gICAgICAgICAgICAgICAgLy8gd2hpY2ggaXMgd2h5IHdlIG1pZ2h0IG5lZWQgdG8gY2hhbmdlIGl0IHRvIHJlYWwgSlNPTiBvYmplY3RzIHN1Y2ggYXMge1wiblwiOjF9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVQYXJhbXMgPSBKU09OLnBhcnNlKGFyZ3NbMF0ucmVwbGFjZSgvKFsnXCJdKT8oW2EtekEtWjAtOV9dKykoWydcIl0pPzovZywgJ1wiJDJcIjogJykpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBXcm9uZyBwYXJhbWV0ZXIgaW4gVHJhbnNsYXRlUGlwZS4gRXhwZWN0ZWQgYSB2YWxpZCBPYmplY3QsIHJlY2VpdmVkOiAke2FyZ3NbMF19YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlUGFyYW1zID0gYXJnc1swXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBxdWVyeSwgaW4gY2FzZSBpdCBjaGFuZ2VzXG4gICAgICAgIHRoaXMubGFzdEtleSA9IHF1ZXJ5O1xuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBwYXJhbXMsIGluIGNhc2UgdGhleSBjaGFuZ2VcbiAgICAgICAgdGhpcy5sYXN0UGFyYW1zID0gYXJncztcblxuICAgICAgICAvLyBzZXQgdGhlIHZhbHVlXG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWUocXVlcnksIGludGVycG9sYXRlUGFyYW1zKTtcblxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHN1YnNjcmlwdGlvbiB0byBvbkxhbmdDaGFuZ2UsIGNsZWFuIGl0XG4gICAgICAgIHRoaXMuX2Rpc3Bvc2UoKTtcblxuICAgICAgICAvLyBzdWJzY3JpYmUgdG8gb25MYW5nQ2hhbmdlIGV2ZW50LCBpbiBjYXNlIHRoZSBsYW5ndWFnZSBjaGFuZ2VzXG4gICAgICAgIHRoaXMub25MYW5nQ2hhbmdlID0gdGhpcy50cmFuc2xhdGUub25MYW5nQ2hhbmdlLnN1YnNjcmliZSgoZXZlbnQ6IExhbmdDaGFuZ2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShxdWVyeSwgaW50ZXJwb2xhdGVQYXJhbXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbiBhbnkgZXhpc3Rpbmcgc3Vic2NyaXB0aW9uIHRvIG9uTGFuZ0NoYW5nZSBldmVudHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kaXNwb3NlKCk6IHZvaWQge1xuICAgICAgICBpZihpc1ByZXNlbnQodGhpcy5vbkxhbmdDaGFuZ2UpKSB7XG4gICAgICAgICAgICB0aGlzLm9uTGFuZ0NoYW5nZS51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5vbkxhbmdDaGFuZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZGlzcG9zZSgpO1xuICAgIH1cbn1cbiJdfQ==

/***/ },

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var core_1 = __webpack_require__(71);
	var http_1 = __webpack_require__(263);
	var Observable_1 = __webpack_require__(34);
	__webpack_require__(280);
	__webpack_require__(285);
	__webpack_require__(33);
	__webpack_require__(289);
	__webpack_require__(296);
	var translate_parser_1 = __webpack_require__(298);
	var MissingTranslationHandler = (function () {
	    function MissingTranslationHandler() {
	    }
	    return MissingTranslationHandler;
	}());
	exports.MissingTranslationHandler = MissingTranslationHandler;
	var TranslateLoader = (function () {
	    function TranslateLoader() {
	    }
	    return TranslateLoader;
	}());
	exports.TranslateLoader = TranslateLoader;
	var TranslateStaticLoader = (function () {
	    function TranslateStaticLoader(http, prefix, suffix) {
	        if (prefix === void 0) { prefix = 'i18n'; }
	        if (suffix === void 0) { suffix = '.json'; }
	        this.http = http;
	        this.prefix = prefix;
	        this.suffix = suffix;
	    }
	    /**
	     * Gets the translations from the server
	     * @param lang
	     * @returns {any}
	     */
	    TranslateStaticLoader.prototype.getTranslation = function (lang) {
	        return this.http.get(this.prefix + "/" + lang + this.suffix)
	            .map(function (res) { return res.json(); });
	    };
	    return TranslateStaticLoader;
	}());
	exports.TranslateStaticLoader = TranslateStaticLoader;
	var TranslateService = (function () {
	    /**
	     *
	     * @param http The Angular 2 http provider
	     * @param currentLoader An instance of the loader currently used
	     * @param missingTranslationHandler A handler for missing translations.
	     */
	    function TranslateService(http, currentLoader, missingTranslationHandler) {
	        this.http = http;
	        this.currentLoader = currentLoader;
	        this.missingTranslationHandler = missingTranslationHandler;
	        /**
	         * The lang currently used
	         */
	        this.currentLang = this.defaultLang;
	        /**
	         * An EventEmitter to listen to lang changes events
	         * onLangChange.subscribe((params: LangChangeEvent) => {
	         *     // do something
	         * });
	         * @type {ng.EventEmitter<LangChangeEvent>}
	         */
	        this.onLangChange = new core_1.EventEmitter();
	        this.translations = {};
	        this.parser = new translate_parser_1.Parser();
	    }
	    /**
	     * Sets the default language to use as a fallback
	     * @param lang
	     */
	    TranslateService.prototype.setDefaultLang = function (lang) {
	        this.defaultLang = lang;
	    };
	    /**
	     * Changes the lang currently used
	     * @param lang
	     * @returns {Observable<*>}
	     */
	    TranslateService.prototype.use = function (lang) {
	        var _this = this;
	        var pending;
	        // check if this language is available
	        if (typeof this.translations[lang] === 'undefined') {
	            // not available, ask for it
	            pending = this.getTranslation(lang);
	        }
	        if (typeof pending !== 'undefined') {
	            pending.subscribe(function (res) {
	                _this.changeLang(lang);
	            });
	            return pending;
	        }
	        else {
	            this.changeLang(lang);
	            return Observable_1.Observable.of(this.translations[lang]);
	        }
	    };
	    /**
	     * Gets an object of translations for a given language with the current loader
	     * @param lang
	     * @returns {Observable<*>}
	     */
	    TranslateService.prototype.getTranslation = function (lang) {
	        var _this = this;
	        this.pending = this.currentLoader.getTranslation(lang).share();
	        this.pending.subscribe(function (res) {
	            _this.translations[lang] = res;
	            _this.updateLangs();
	        }, function (err) {
	            throw err;
	        }, function () {
	            _this.pending = undefined;
	        });
	        return this.pending;
	    };
	    /**
	     * Manually sets an object of translations for a given language
	     * @param lang
	     * @param translations
	     */
	    TranslateService.prototype.setTranslation = function (lang, translations) {
	        this.translations[lang] = translations;
	        this.updateLangs();
	    };
	    /**
	     * Returns an array of currently available langs
	     * @returns {any}
	     */
	    TranslateService.prototype.getLangs = function () {
	        return this.langs;
	    };
	    /**
	     * Update the list of available langs
	     */
	    TranslateService.prototype.updateLangs = function () {
	        this.langs = Object.keys(this.translations);
	    };
	    /**
	     * Returns the parsed result of the translations
	     * @param translations
	     * @param key
	     * @param interpolateParams
	     * @returns {any}
	     */
	    TranslateService.prototype.getParsedResult = function (translations, key, interpolateParams) {
	        var res;
	        if (key instanceof Array) {
	            var result = {}, observables = false;
	            for (var _i = 0, key_1 = key; _i < key_1.length; _i++) {
	                var k = key_1[_i];
	                result[k] = this.getParsedResult(translations, k, interpolateParams);
	                if (typeof result[k].subscribe === 'function') {
	                    observables = true;
	                }
	            }
	            if (observables) {
	                var mergedObs;
	                for (var _a = 0, key_2 = key; _a < key_2.length; _a++) {
	                    var k = key_2[_a];
	                    var obs = typeof result[k].subscribe === 'function' ? result[k] : Observable_1.Observable.of(result[k]);
	                    if (typeof mergedObs === 'undefined') {
	                        mergedObs = obs;
	                    }
	                    else {
	                        mergedObs = mergedObs.merge(obs);
	                    }
	                }
	                return mergedObs.toArray().map(function (arr) {
	                    var obj = {};
	                    arr.forEach(function (value, index) {
	                        obj[key[index]] = value;
	                    });
	                    return obj;
	                });
	            }
	            return result;
	        }
	        if (translations) {
	            res = this.parser.interpolate(this.parser.getValue(translations, key), interpolateParams);
	        }
	        if (typeof res === 'undefined' && this.defaultLang && this.defaultLang !== this.currentLang) {
	            res = this.parser.interpolate(this.parser.getValue(this.translations[this.defaultLang], key), interpolateParams);
	        }
	        if (!res && this.missingTranslationHandler) {
	            res = this.missingTranslationHandler.handle(key);
	        }
	        return res || key;
	    };
	    /**
	     * Gets the translated value of a key (or an array of keys)
	     * @param key
	     * @param interpolateParams
	     * @returns {any} the translated key, or an object of translated keys
	     */
	    TranslateService.prototype.get = function (key, interpolateParams) {
	        var _this = this;
	        if (!key) {
	            throw new Error('Parameter "key" required');
	        }
	        // check if we are loading a new translation to use
	        if (this.pending) {
	            return Observable_1.Observable.create(function (observer) {
	                var onComplete = function (res) {
	                    observer.next(res);
	                    observer.complete();
	                };
	                _this.pending.subscribe(function (res) {
	                    var res = _this.getParsedResult(res, key, interpolateParams);
	                    if (typeof res.subscribe === 'function') {
	                        res.subscribe(onComplete);
	                    }
	                    else {
	                        onComplete(res);
	                    }
	                });
	            });
	        }
	        else {
	            var res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
	            if (typeof res.subscribe === 'function') {
	                return res;
	            }
	            else {
	                return Observable_1.Observable.of(res);
	            }
	        }
	    };
	    /**
	     * Returns a translation instantly from the internal state of loaded translation.
	     * All rules regarding the current language, the preferred language of even fallback languages will be used except any promise handling.
	     * @param key
	     * @param interpolateParams
	     * @returns {string}
	     */
	    TranslateService.prototype.instant = function (key, interpolateParams) {
	        if (!key) {
	            throw new Error('Parameter "key" required');
	        }
	        var res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
	        if (typeof res.subscribe !== 'undefined') {
	            if (key instanceof Array) {
	                var obj = {};
	                key.forEach(function (value, index) {
	                    obj[key[index]] = key[index];
	                });
	                return obj;
	            }
	            return key;
	        }
	        else {
	            return res;
	        }
	    };
	    /**
	     * Sets the translated value of a key
	     * @param key
	     * @param value
	     * @param lang
	     */
	    TranslateService.prototype.set = function (key, value, lang) {
	        if (lang === void 0) { lang = this.currentLang; }
	        this.translations[lang][key] = value;
	        this.updateLangs();
	    };
	    /**
	     * Changes the current lang
	     * @param lang
	     */
	    TranslateService.prototype.changeLang = function (lang) {
	        this.currentLang = lang;
	        this.onLangChange.emit({ lang: lang, translations: this.translations[lang] });
	    };
	    /**
	     * Allows to reload the lang file from the file
	     * @param lang
	     * @returns {Observable<any>}
	     */
	    TranslateService.prototype.reloadLang = function (lang) {
	        this.resetLang(lang);
	        return this.getTranslation(lang);
	    };
	    /**
	     * Deletes inner translation
	     * @param lang
	     */
	    TranslateService.prototype.resetLang = function (lang) {
	        this.translations[lang] = undefined;
	    };
	    TranslateService = __decorate([
	        core_1.Injectable(),
	        __param(2, core_1.Optional()), 
	        __metadata('design:paramtypes', [http_1.Http, TranslateLoader, MissingTranslationHandler])
	    ], TranslateService);
	    return TranslateService;
	}());
	exports.TranslateService = TranslateService;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFuc2xhdGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBQWlELGVBQWUsQ0FBQyxDQUFBO0FBQ2pFLHFCQUE2QixlQUFlLENBQUMsQ0FBQTtBQUM3QywyQkFBeUIsaUJBQ3pCLENBQUMsQ0FEeUM7QUFFMUMsUUFBTyx3QkFBd0IsQ0FBQyxDQUFBO0FBQ2hDLFFBQU8seUJBQXlCLENBQUMsQ0FBQTtBQUNqQyxRQUFPLHVCQUF1QixDQUFDLENBQUE7QUFDL0IsUUFBTyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ2pDLFFBQU8sMkJBQTJCLENBQUMsQ0FBQTtBQUVuQyxpQ0FBcUIsb0JBQW9CLENBQUMsQ0FBQTtBQU8xQztJQUFBO0lBVUEsQ0FBQztJQUFELGdDQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFWcUIsaUNBQXlCLDRCQVU5QyxDQUFBO0FBRUQ7SUFBQTtJQUVBLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRnFCLHVCQUFlLGtCQUVwQyxDQUFBO0FBRUQ7SUFDSSwrQkFBb0IsSUFBVSxFQUFVLE1BQXVCLEVBQVUsTUFBd0I7UUFBakUsc0JBQStCLEdBQS9CLGVBQStCO1FBQUUsc0JBQWdDLEdBQWhDLGdCQUFnQztRQUE3RSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFrQjtJQUFHLENBQUM7SUFFckc7Ozs7T0FJRztJQUNJLDhDQUFjLEdBQXJCLFVBQXNCLElBQVk7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxNQUFNLFNBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFRLENBQUM7YUFDdkQsR0FBRyxDQUFDLFVBQUMsR0FBYSxJQUFLLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDTCw0QkFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBWlksNkJBQXFCLHdCQVlqQyxDQUFBO0FBR0Q7SUFxQkk7Ozs7O09BS0c7SUFDSCwwQkFBb0IsSUFBVSxFQUFTLGFBQThCLEVBQXNCLHlCQUFvRDtRQUEzSCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQWlCO1FBQXNCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUExQi9JOztXQUVHO1FBQ0ksZ0JBQVcsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRTlDOzs7Ozs7V0FNRztRQUNJLGlCQUFZLEdBQWtDLElBQUksbUJBQVksRUFBbUIsQ0FBQztRQUdqRixpQkFBWSxHQUFRLEVBQUUsQ0FBQztRQUd2QixXQUFNLEdBQVcsSUFBSSx5QkFBTSxFQUFFLENBQUM7SUFRNEcsQ0FBQztJQUVuSjs7O09BR0c7SUFDSSx5Q0FBYyxHQUFyQixVQUFzQixJQUFZO1FBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksOEJBQUcsR0FBVixVQUFXLElBQVk7UUFBdkIsaUJBbUJDO1FBbEJHLElBQUksT0FBd0IsQ0FBQztRQUM3QixzQ0FBc0M7UUFDdEMsRUFBRSxDQUFBLENBQUMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEQsNEJBQTRCO1lBQzVCLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRCxFQUFFLENBQUEsQ0FBQyxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFRO2dCQUN2QixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRCLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0kseUNBQWMsR0FBckIsVUFBc0IsSUFBWTtRQUFsQyxpQkFZQztRQVhHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFXO1lBQy9CLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQzlCLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDLEVBQUUsVUFBQyxHQUFRO1lBQ1IsTUFBTSxHQUFHLENBQUM7UUFDZCxDQUFDLEVBQUU7WUFDQyxLQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0kseUNBQWMsR0FBckIsVUFBc0IsSUFBWSxFQUFFLFlBQW9CO1FBQ3BELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksbUNBQVEsR0FBZjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7T0FFRztJQUNLLHNDQUFXLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssMENBQWUsR0FBdkIsVUFBd0IsWUFBaUIsRUFBRSxHQUFRLEVBQUUsaUJBQTBCO1FBQzNFLElBQUksR0FBOEIsQ0FBQztRQUVuQyxFQUFFLENBQUEsQ0FBQyxHQUFHLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLE1BQU0sR0FBUSxFQUFFLEVBQ2hCLFdBQVcsR0FBWSxLQUFLLENBQUM7WUFDakMsR0FBRyxDQUFDLENBQVUsVUFBRyxFQUFILFdBQUcsRUFBSCxpQkFBRyxFQUFILElBQUcsQ0FBQztnQkFBYixJQUFJLENBQUMsWUFBQTtnQkFDTixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3JFLEVBQUUsQ0FBQSxDQUFDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixDQUFDO2FBQ0o7WUFDRCxFQUFFLENBQUEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksU0FBYyxDQUFDO2dCQUNuQixHQUFHLENBQUMsQ0FBVSxVQUFHLEVBQUgsV0FBRyxFQUFILGlCQUFHLEVBQUgsSUFBRyxDQUFDO29CQUFiLElBQUksQ0FBQyxZQUFBO29CQUNOLElBQUksR0FBRyxHQUFHLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLHVCQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRixFQUFFLENBQUEsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxTQUFTLEdBQUcsR0FBRyxDQUFDO29CQUNwQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNyQyxDQUFDO2lCQUNKO2dCQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBa0I7b0JBQzlDLElBQUksR0FBRyxHQUFRLEVBQUUsQ0FBQztvQkFDbEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQWEsRUFBRSxLQUFhO3dCQUNyQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUM1QixDQUFDLENBQUMsQ0FBQztvQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDZCxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUYsQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLE9BQU8sR0FBRyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDekYsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDckgsQ0FBQztRQUVELEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7WUFDeEMsR0FBRyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVELE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLDhCQUFHLEdBQVYsVUFBVyxHQUF5QixFQUFFLGlCQUEwQjtRQUFoRSxpQkE0QkM7UUEzQkcsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxtREFBbUQ7UUFDbkQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLENBQUMsdUJBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxRQUEwQjtnQkFDaEQsSUFBSSxVQUFVLEdBQUcsVUFBQyxHQUFXO29CQUN6QixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3hCLENBQUMsQ0FBQztnQkFDRixLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFDLEdBQVE7b0JBQzVCLElBQUksR0FBRyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUM1RCxFQUFFLENBQUEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxTQUFTLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDckMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3BCLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDNUYsRUFBRSxDQUFBLENBQUMsT0FBTyxHQUFHLENBQUMsU0FBUyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDZixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLHVCQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGtDQUFPLEdBQWQsVUFBZSxHQUF5QixFQUFFLGlCQUEwQjtRQUNoRSxFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDNUYsRUFBRSxDQUFBLENBQUMsT0FBTyxHQUFHLENBQUMsU0FBUyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEMsRUFBRSxDQUFBLENBQUMsR0FBRyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksR0FBRyxHQUFRLEVBQUUsQ0FBQztnQkFDbEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQWEsRUFBRSxLQUFhO29CQUNyQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqQyxDQUFDLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLDhCQUFHLEdBQVYsVUFBVyxHQUFXLEVBQUUsS0FBYSxFQUFFLElBQStCO1FBQS9CLG9CQUErQixHQUEvQixPQUFlLElBQUksQ0FBQyxXQUFXO1FBQ2xFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0sscUNBQVUsR0FBbEIsVUFBbUIsSUFBWTtRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRDs7OztPQUlHO0lBQ0kscUNBQVUsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxvQ0FBUyxHQUFoQixVQUFpQixJQUFZO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3hDLENBQUM7SUF0UUw7UUFBQyxpQkFBVSxFQUFFO21CQTRCK0QsZUFBUSxFQUFFOzt3QkE1QnpFO0lBdVFiLHVCQUFDO0FBQUQsQ0FBQyxBQXRRRCxJQXNRQztBQXRRWSx3QkFBZ0IsbUJBc1E1QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIsIE9wdGlvbmFsfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7SHR0cCwgUmVzcG9uc2V9IGZyb20gJ2FuZ3VsYXIyL2h0dHAnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL09ic2VydmFibGUnXG5pbXBvcnQge09ic2VydmVyfSBmcm9tIFwicnhqcy9PYnNlcnZlclwiO1xuaW1wb3J0ICdyeGpzL2FkZC9vYnNlcnZhYmxlL29mJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3Ivc2hhcmUnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tZXJnZSc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvQXJyYXknO1xuXG5pbXBvcnQge1BhcnNlcn0gZnJvbSAnLi90cmFuc2xhdGUucGFyc2VyJztcblxuZXhwb3J0IGludGVyZmFjZSBMYW5nQ2hhbmdlRXZlbnQge1xuICAgIGxhbmc6IHN0cmluZztcbiAgICB0cmFuc2xhdGlvbnM6IGFueTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1pc3NpbmdUcmFuc2xhdGlvbkhhbmRsZXIge1xuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCBoYW5kbGVzIG1pc3NpbmcgdHJhbnNsYXRpb25zLlxuICAgICAqIEBwYXJhbSBrZXkgdGhlIG1pc3Npbmcga2V5XG4gICAgICogQHJldHVybnMge2FueX0gYSB2YWx1ZSBvciBhbiBvYnNlcnZhYmxlXG4gICAgICogSWYgaXQgcmV0dXJucyBhIHZhbHVlLCB0aGVuIHRoaXMgdmFsdWUgaXMgdXNlZC5cbiAgICAgKiBJZiBpdCByZXR1cm4gYW4gb2JzZXJ2YWJsZSwgdGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoaXMgb2JzZXJ2YWJsZSB3aWxsIGJlIHVzZWQgKGV4Y2VwdCBpZiB0aGUgbWV0aG9kIHdhcyBcImluc3RhbnRcIikuXG4gICAgICogSWYgaXQgZG9lc24ndCByZXR1cm4gdGhlbiB0aGUga2V5IHdpbGwgYmUgdXNlZCBhcyBhIHZhbHVlXG4gICAgICovXG4gICAgYWJzdHJhY3QgaGFuZGxlKGtleTogc3RyaW5nKTogYW55O1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVHJhbnNsYXRlTG9hZGVyIHtcbiAgICBhYnN0cmFjdCBnZXRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT47XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVTdGF0aWNMb2FkZXIgaW1wbGVtZW50cyBUcmFuc2xhdGVMb2FkZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCwgcHJpdmF0ZSBwcmVmaXg6IHN0cmluZyA9ICdpMThuJywgcHJpdmF0ZSBzdWZmaXg6IHN0cmluZyA9ICcuanNvbicpIHt9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0cmFuc2xhdGlvbnMgZnJvbSB0aGUgc2VydmVyXG4gICAgICogQHBhcmFtIGxhbmdcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHt0aGlzLnByZWZpeH0vJHtsYW5nfSR7dGhpcy5zdWZmaXh9YClcbiAgICAgICAgICAgIC5tYXAoKHJlczogUmVzcG9uc2UpID0+IHJlcy5qc29uKCkpO1xuICAgIH1cbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0ZVNlcnZpY2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBsYW5nIGN1cnJlbnRseSB1c2VkXG4gICAgICovXG4gICAgcHVibGljIGN1cnJlbnRMYW5nOiBzdHJpbmcgPSB0aGlzLmRlZmF1bHRMYW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gRXZlbnRFbWl0dGVyIHRvIGxpc3RlbiB0byBsYW5nIGNoYW5nZXMgZXZlbnRzXG4gICAgICogb25MYW5nQ2hhbmdlLnN1YnNjcmliZSgocGFyYW1zOiBMYW5nQ2hhbmdlRXZlbnQpID0+IHtcbiAgICAgKiAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgICogfSk7XG4gICAgICogQHR5cGUge25nLkV2ZW50RW1pdHRlcjxMYW5nQ2hhbmdlRXZlbnQ+fVxuICAgICAqL1xuICAgIHB1YmxpYyBvbkxhbmdDaGFuZ2U6IEV2ZW50RW1pdHRlcjxMYW5nQ2hhbmdlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxMYW5nQ2hhbmdlRXZlbnQ+KCk7XG5cbiAgICBwcml2YXRlIHBlbmRpbmc6IGFueTtcbiAgICBwcml2YXRlIHRyYW5zbGF0aW9uczogYW55ID0ge307XG4gICAgcHJpdmF0ZSBkZWZhdWx0TGFuZzogc3RyaW5nO1xuICAgIHByaXZhdGUgbGFuZ3M6IEFycmF5PHN0cmluZz47XG4gICAgcHJpdmF0ZSBwYXJzZXI6IFBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGh0dHAgVGhlIEFuZ3VsYXIgMiBodHRwIHByb3ZpZGVyXG4gICAgICogQHBhcmFtIGN1cnJlbnRMb2FkZXIgQW4gaW5zdGFuY2Ugb2YgdGhlIGxvYWRlciBjdXJyZW50bHkgdXNlZFxuICAgICAqIEBwYXJhbSBtaXNzaW5nVHJhbnNsYXRpb25IYW5kbGVyIEEgaGFuZGxlciBmb3IgbWlzc2luZyB0cmFuc2xhdGlvbnMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwLCBwdWJsaWMgY3VycmVudExvYWRlcjogVHJhbnNsYXRlTG9hZGVyLCBAT3B0aW9uYWwoKSBwcml2YXRlIG1pc3NpbmdUcmFuc2xhdGlvbkhhbmRsZXI6IE1pc3NpbmdUcmFuc2xhdGlvbkhhbmRsZXIpIHt9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBkZWZhdWx0IGxhbmd1YWdlIHRvIHVzZSBhcyBhIGZhbGxiYWNrXG4gICAgICogQHBhcmFtIGxhbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RGVmYXVsdExhbmcobGFuZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVmYXVsdExhbmcgPSBsYW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIGxhbmcgY3VycmVudGx5IHVzZWRcbiAgICAgKiBAcGFyYW0gbGFuZ1xuICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPCo+fVxuICAgICAqL1xuICAgIHB1YmxpYyB1c2UobGFuZzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgdmFyIHBlbmRpbmc6IE9ic2VydmFibGU8YW55PjtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhpcyBsYW5ndWFnZSBpcyBhdmFpbGFibGVcbiAgICAgICAgaWYodHlwZW9mIHRoaXMudHJhbnNsYXRpb25zW2xhbmddID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgLy8gbm90IGF2YWlsYWJsZSwgYXNrIGZvciBpdFxuICAgICAgICAgICAgcGVuZGluZyA9IHRoaXMuZ2V0VHJhbnNsYXRpb24obGFuZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2YgcGVuZGluZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHBlbmRpbmcuc3Vic2NyaWJlKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlTGFuZyhsYW5nKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcGVuZGluZztcbiAgICAgICAgfSBlbHNlIHsgLy8gd2UgaGF2ZSB0aGlzIGxhbmd1YWdlLCByZXR1cm4gYW4gT2JzZXJ2YWJsZVxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VMYW5nKGxhbmcpO1xuXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZih0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIG9iamVjdCBvZiB0cmFuc2xhdGlvbnMgZm9yIGEgZ2l2ZW4gbGFuZ3VhZ2Ugd2l0aCB0aGUgY3VycmVudCBsb2FkZXJcbiAgICAgKiBAcGFyYW0gbGFuZ1xuICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPCo+fVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICB0aGlzLnBlbmRpbmcgPSB0aGlzLmN1cnJlbnRMb2FkZXIuZ2V0VHJhbnNsYXRpb24obGFuZykuc2hhcmUoKTtcbiAgICAgICAgdGhpcy5wZW5kaW5nLnN1YnNjcmliZSgocmVzOiBPYmplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zW2xhbmddID0gcmVzO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMYW5ncygpO1xuICAgICAgICB9LCAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5wZW5kaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1hbnVhbGx5IHNldHMgYW4gb2JqZWN0IG9mIHRyYW5zbGF0aW9ucyBmb3IgYSBnaXZlbiBsYW5ndWFnZVxuICAgICAqIEBwYXJhbSBsYW5nXG4gICAgICogQHBhcmFtIHRyYW5zbGF0aW9uc1xuICAgICAqL1xuICAgIHB1YmxpYyBzZXRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcsIHRyYW5zbGF0aW9uczogT2JqZWN0KTogdm9pZCB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25zW2xhbmddID0gdHJhbnNsYXRpb25zO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhbmdzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBjdXJyZW50bHkgYXZhaWxhYmxlIGxhbmdzXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TGFuZ3MoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhbmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgbGlzdCBvZiBhdmFpbGFibGUgbGFuZ3NcbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZUxhbmdzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmxhbmdzID0gT2JqZWN0LmtleXModGhpcy50cmFuc2xhdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHBhcnNlZCByZXN1bHQgb2YgdGhlIHRyYW5zbGF0aW9uc1xuICAgICAqIEBwYXJhbSB0cmFuc2xhdGlvbnNcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIGludGVycG9sYXRlUGFyYW1zXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFBhcnNlZFJlc3VsdCh0cmFuc2xhdGlvbnM6IGFueSwga2V5OiBhbnksIGludGVycG9sYXRlUGFyYW1zPzogT2JqZWN0KTogYW55IHtcbiAgICAgICAgdmFyIHJlczogc3RyaW5nfE9ic2VydmFibGU8c3RyaW5nPjtcblxuICAgICAgICBpZihrZXkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdDogYW55ID0ge30sXG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGsgb2Yga2V5KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tdID0gdGhpcy5nZXRQYXJzZWRSZXN1bHQodHJhbnNsYXRpb25zLCBrLCBpbnRlcnBvbGF0ZVBhcmFtcyk7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHJlc3VsdFtrXS5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YWJsZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKG9ic2VydmFibGVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1lcmdlZE9iczogYW55O1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgb2Yga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvYnMgPSB0eXBlb2YgcmVzdWx0W2tdLnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJyA/IHJlc3VsdFtrXSA6IE9ic2VydmFibGUub2YocmVzdWx0W2tdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIG1lcmdlZE9icyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZE9icyA9IG9icztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlZE9icyA9IG1lcmdlZE9icy5tZXJnZShvYnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtZXJnZWRPYnMudG9BcnJheSgpLm1hcCgoYXJyOiBBcnJheTxzdHJpbmc+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmo6IGFueSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBhcnIuZm9yRWFjaCgodmFsdWU6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2tleVtpbmRleF1dID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRyYW5zbGF0aW9ucykge1xuICAgICAgICAgICAgcmVzID0gdGhpcy5wYXJzZXIuaW50ZXJwb2xhdGUodGhpcy5wYXJzZXIuZ2V0VmFsdWUodHJhbnNsYXRpb25zLCBrZXkpLCBpbnRlcnBvbGF0ZVBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2YgcmVzID09PSAndW5kZWZpbmVkJyAmJiB0aGlzLmRlZmF1bHRMYW5nICYmIHRoaXMuZGVmYXVsdExhbmcgIT09IHRoaXMuY3VycmVudExhbmcpIHtcbiAgICAgICAgICAgIHJlcyA9IHRoaXMucGFyc2VyLmludGVycG9sYXRlKHRoaXMucGFyc2VyLmdldFZhbHVlKHRoaXMudHJhbnNsYXRpb25zW3RoaXMuZGVmYXVsdExhbmddLCBrZXkpLCBpbnRlcnBvbGF0ZVBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighcmVzICYmIHRoaXMubWlzc2luZ1RyYW5zbGF0aW9uSGFuZGxlcikge1xuICAgICAgICAgICAgcmVzID0gdGhpcy5taXNzaW5nVHJhbnNsYXRpb25IYW5kbGVyLmhhbmRsZShrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcyB8fCBrZXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdHJhbnNsYXRlZCB2YWx1ZSBvZiBhIGtleSAob3IgYW4gYXJyYXkgb2Yga2V5cylcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIGludGVycG9sYXRlUGFyYW1zXG4gICAgICogQHJldHVybnMge2FueX0gdGhlIHRyYW5zbGF0ZWQga2V5LCBvciBhbiBvYmplY3Qgb2YgdHJhbnNsYXRlZCBrZXlzXG4gICAgICovXG4gICAgcHVibGljIGdldChrZXk6IHN0cmluZ3xBcnJheTxzdHJpbmc+LCBpbnRlcnBvbGF0ZVBhcmFtcz86IE9iamVjdCk6IE9ic2VydmFibGU8c3RyaW5nfGFueT4ge1xuICAgICAgICBpZigha2V5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlciBcImtleVwiIHJlcXVpcmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgaWYgd2UgYXJlIGxvYWRpbmcgYSBuZXcgdHJhbnNsYXRpb24gdG8gdXNlXG4gICAgICAgIGlmKHRoaXMucGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogT2JzZXJ2ZXI8c3RyaW5nPikgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBvbkNvbXBsZXRlID0gKHJlczogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZy5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLmdldFBhcnNlZFJlc3VsdChyZXMsIGtleSwgaW50ZXJwb2xhdGVQYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgcmVzLnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN1YnNjcmliZShvbkNvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGUocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5nZXRQYXJzZWRSZXN1bHQodGhpcy50cmFuc2xhdGlvbnNbdGhpcy5jdXJyZW50TGFuZ10sIGtleSwgaW50ZXJwb2xhdGVQYXJhbXMpO1xuICAgICAgICAgICAgaWYodHlwZW9mIHJlcy5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZihyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHRyYW5zbGF0aW9uIGluc3RhbnRseSBmcm9tIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiBsb2FkZWQgdHJhbnNsYXRpb24uXG4gICAgICogQWxsIHJ1bGVzIHJlZ2FyZGluZyB0aGUgY3VycmVudCBsYW5ndWFnZSwgdGhlIHByZWZlcnJlZCBsYW5ndWFnZSBvZiBldmVuIGZhbGxiYWNrIGxhbmd1YWdlcyB3aWxsIGJlIHVzZWQgZXhjZXB0IGFueSBwcm9taXNlIGhhbmRsaW5nLlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcGFyYW0gaW50ZXJwb2xhdGVQYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHB1YmxpYyBpbnN0YW50KGtleTogc3RyaW5nfEFycmF5PHN0cmluZz4sIGludGVycG9sYXRlUGFyYW1zPzogT2JqZWN0KTogc3RyaW5nfGFueSB7XG4gICAgICAgIGlmKCFrZXkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIFwia2V5XCIgcmVxdWlyZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmdldFBhcnNlZFJlc3VsdCh0aGlzLnRyYW5zbGF0aW9uc1t0aGlzLmN1cnJlbnRMYW5nXSwga2V5LCBpbnRlcnBvbGF0ZVBhcmFtcyk7XG4gICAgICAgIGlmKHR5cGVvZiByZXMuc3Vic2NyaWJlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYoa2V5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2JqOiBhbnkgPSB7fTtcbiAgICAgICAgICAgICAgICBrZXkuZm9yRWFjaCgodmFsdWU6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvYmpba2V5W2luZGV4XV0gPSBrZXlbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHRyYW5zbGF0ZWQgdmFsdWUgb2YgYSBrZXlcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICogQHBhcmFtIGxhbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsYW5nOiBzdHJpbmcgPSB0aGlzLmN1cnJlbnRMYW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25zW2xhbmddW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYW5ncygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIGN1cnJlbnQgbGFuZ1xuICAgICAqIEBwYXJhbSBsYW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGFuZ2VMYW5nKGxhbmc6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYW5nID0gbGFuZztcbiAgICAgICAgdGhpcy5vbkxhbmdDaGFuZ2UuZW1pdCh7bGFuZzogbGFuZywgdHJhbnNsYXRpb25zOiB0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsbG93cyB0byByZWxvYWQgdGhlIGxhbmcgZmlsZSBmcm9tIHRoZSBmaWxlXG4gICAgICogQHBhcmFtIGxhbmdcbiAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxhbnk+fVxuICAgICAqL1xuICAgIHB1YmxpYyByZWxvYWRMYW5nKGxhbmc6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHRoaXMucmVzZXRMYW5nKGxhbmcpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUcmFuc2xhdGlvbihsYW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGVzIGlubmVyIHRyYW5zbGF0aW9uXG4gICAgICogQHBhcmFtIGxhbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzZXRMYW5nKGxhbmc6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iXX0=

/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(34);
	var ArrayObservable_1 = __webpack_require__(281);
	Observable_1.Observable.of = ArrayObservable_1.ArrayObservable.of;
	//# sourceMappingURL=of.js.map

/***/ },

/***/ 281:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(34);
	var ScalarObservable_1 = __webpack_require__(282);
	var EmptyObservable_1 = __webpack_require__(283);
	var isScheduler_1 = __webpack_require__(284);
	var ArrayObservable = (function (_super) {
	    __extends(ArrayObservable, _super);
	    function ArrayObservable(array, scheduler) {
	        _super.call(this);
	        this.array = array;
	        this.scheduler = scheduler;
	        if (!scheduler && array.length === 1) {
	            this._isScalar = true;
	            this.value = array[0];
	        }
	    }
	    ArrayObservable.create = function (array, scheduler) {
	        return new ArrayObservable(array, scheduler);
	    };
	    ArrayObservable.of = function () {
	        var array = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            array[_i - 0] = arguments[_i];
	        }
	        var scheduler = array[array.length - 1];
	        if (isScheduler_1.isScheduler(scheduler)) {
	            array.pop();
	        }
	        else {
	            scheduler = null;
	        }
	        var len = array.length;
	        if (len > 1) {
	            return new ArrayObservable(array, scheduler);
	        }
	        else if (len === 1) {
	            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
	        }
	        else {
	            return new EmptyObservable_1.EmptyObservable(scheduler);
	        }
	    };
	    ArrayObservable.dispatch = function (state) {
	        var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
	        if (index >= count) {
	            subscriber.complete();
	            return;
	        }
	        subscriber.next(array[index]);
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        state.index = index + 1;
	        this.schedule(state);
	    };
	    ArrayObservable.prototype._subscribe = function (subscriber) {
	        var index = 0;
	        var array = this.array;
	        var count = array.length;
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(ArrayObservable.dispatch, 0, {
	                array: array, index: index, count: count, subscriber: subscriber
	            });
	        }
	        else {
	            for (var i = 0; i < count && !subscriber.isUnsubscribed; i++) {
	                subscriber.next(array[i]);
	            }
	            subscriber.complete();
	        }
	    };
	    return ArrayObservable;
	}(Observable_1.Observable));
	exports.ArrayObservable = ArrayObservable;
	//# sourceMappingURL=ArrayObservable.js.map

/***/ },

/***/ 282:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(34);
	var ScalarObservable = (function (_super) {
	    __extends(ScalarObservable, _super);
	    function ScalarObservable(value, scheduler) {
	        _super.call(this);
	        this.value = value;
	        this.scheduler = scheduler;
	        this._isScalar = true;
	    }
	    ScalarObservable.create = function (value, scheduler) {
	        return new ScalarObservable(value, scheduler);
	    };
	    ScalarObservable.dispatch = function (state) {
	        var done = state.done, value = state.value, subscriber = state.subscriber;
	        if (done) {
	            subscriber.complete();
	            return;
	        }
	        subscriber.next(value);
	        if (subscriber.isUnsubscribed) {
	            return;
	        }
	        state.done = true;
	        this.schedule(state);
	    };
	    ScalarObservable.prototype._subscribe = function (subscriber) {
	        var value = this.value;
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(ScalarObservable.dispatch, 0, {
	                done: false, value: value, subscriber: subscriber
	            });
	        }
	        else {
	            subscriber.next(value);
	            if (!subscriber.isUnsubscribed) {
	                subscriber.complete();
	            }
	        }
	    };
	    return ScalarObservable;
	}(Observable_1.Observable));
	exports.ScalarObservable = ScalarObservable;
	//# sourceMappingURL=ScalarObservable.js.map

/***/ },

/***/ 283:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(34);
	var EmptyObservable = (function (_super) {
	    __extends(EmptyObservable, _super);
	    function EmptyObservable(scheduler) {
	        _super.call(this);
	        this.scheduler = scheduler;
	    }
	    EmptyObservable.create = function (scheduler) {
	        return new EmptyObservable(scheduler);
	    };
	    EmptyObservable.dispatch = function (_a) {
	        var subscriber = _a.subscriber;
	        subscriber.complete();
	    };
	    EmptyObservable.prototype._subscribe = function (subscriber) {
	        var scheduler = this.scheduler;
	        if (scheduler) {
	            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
	        }
	        else {
	            subscriber.complete();
	        }
	    };
	    return EmptyObservable;
	}(Observable_1.Observable));
	exports.EmptyObservable = EmptyObservable;
	//# sourceMappingURL=EmptyObservable.js.map

/***/ },

/***/ 284:
/***/ function(module, exports) {

	"use strict";
	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}
	exports.isScheduler = isScheduler;
	//# sourceMappingURL=isScheduler.js.map

/***/ },

/***/ 285:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(34);
	var share_1 = __webpack_require__(286);
	Observable_1.Observable.prototype.share = share_1.share;
	//# sourceMappingURL=share.js.map

/***/ },

/***/ 286:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var multicast_1 = __webpack_require__(287);
	var Subject_1 = __webpack_require__(100);
	function shareSubjectFactory() {
	    return new Subject_1.Subject();
	}
	/**
	 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
	 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
	 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
	 * This is an alias for .publish().refCount().
	 *
	 * <img src="./img/share.png" width="100%">
	 *
	 * @returns {Observable<T>} an Observable that upon connection causes the source Observable to emit items to its Observers
	 */
	function share() {
	    return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
	}
	exports.share = share;
	;
	//# sourceMappingURL=share.js.map

/***/ },

/***/ 287:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ConnectableObservable_1 = __webpack_require__(288);
	/**
	 * Returns an Observable that emits the results of invoking a specified selector on items
	 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
	 *
	 * <img src="./img/multicast.png" width="100%">
	 *
	 * @param {Function} selector - a function that can use the multicasted source stream
	 * as many times as needed, without causing multiple subscriptions to the source stream.
	 * Subscribers to the given source will receive all notifications of the source from the
	 * time of the subscription forward.
	 * @returns {Observable} an Observable that emits the results of invoking the selector
	 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
	 * the underlying stream.
	 */
	function multicast(subjectOrSubjectFactory) {
	    var subjectFactory;
	    if (typeof subjectOrSubjectFactory === 'function') {
	        subjectFactory = subjectOrSubjectFactory;
	    }
	    else {
	        subjectFactory = function subjectFactory() {
	            return subjectOrSubjectFactory;
	        };
	    }
	    return new ConnectableObservable_1.ConnectableObservable(this, subjectFactory);
	}
	exports.multicast = multicast;
	//# sourceMappingURL=multicast.js.map

/***/ },

/***/ 288:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Observable_1 = __webpack_require__(34);
	var Subscriber_1 = __webpack_require__(38);
	var Subscription_1 = __webpack_require__(40);
	var ConnectableObservable = (function (_super) {
	    __extends(ConnectableObservable, _super);
	    function ConnectableObservable(source, subjectFactory) {
	        _super.call(this);
	        this.source = source;
	        this.subjectFactory = subjectFactory;
	    }
	    ConnectableObservable.prototype._subscribe = function (subscriber) {
	        return this.getSubject().subscribe(subscriber);
	    };
	    ConnectableObservable.prototype.getSubject = function () {
	        var subject = this.subject;
	        if (subject && !subject.isUnsubscribed) {
	            return subject;
	        }
	        return (this.subject = this.subjectFactory());
	    };
	    ConnectableObservable.prototype.connect = function () {
	        var source = this.source;
	        var subscription = this.subscription;
	        if (subscription && !subscription.isUnsubscribed) {
	            return subscription;
	        }
	        subscription = source.subscribe(this.getSubject());
	        subscription.add(new ConnectableSubscription(this));
	        return (this.subscription = subscription);
	    };
	    ConnectableObservable.prototype.refCount = function () {
	        return new RefCountObservable(this);
	    };
	    /**
	     * This method is opened for `ConnectableSubscription`.
	     * Not to call from others.
	     */
	    ConnectableObservable.prototype._closeSubscription = function () {
	        this.subject = null;
	        this.subscription = null;
	    };
	    return ConnectableObservable;
	}(Observable_1.Observable));
	exports.ConnectableObservable = ConnectableObservable;
	var ConnectableSubscription = (function (_super) {
	    __extends(ConnectableSubscription, _super);
	    function ConnectableSubscription(connectable) {
	        _super.call(this);
	        this.connectable = connectable;
	    }
	    ConnectableSubscription.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        connectable._closeSubscription();
	        this.connectable = null;
	    };
	    return ConnectableSubscription;
	}(Subscription_1.Subscription));
	var RefCountObservable = (function (_super) {
	    __extends(RefCountObservable, _super);
	    function RefCountObservable(connectable, refCount) {
	        if (refCount === void 0) { refCount = 0; }
	        _super.call(this);
	        this.connectable = connectable;
	        this.refCount = refCount;
	    }
	    RefCountObservable.prototype._subscribe = function (subscriber) {
	        var connectable = this.connectable;
	        var refCountSubscriber = new RefCountSubscriber(subscriber, this);
	        var subscription = connectable.subscribe(refCountSubscriber);
	        if (!subscription.isUnsubscribed && ++this.refCount === 1) {
	            refCountSubscriber.connection = this.connection = connectable.connect();
	        }
	        return subscription;
	    };
	    return RefCountObservable;
	}(Observable_1.Observable));
	var RefCountSubscriber = (function (_super) {
	    __extends(RefCountSubscriber, _super);
	    function RefCountSubscriber(destination, refCountObservable) {
	        _super.call(this, null);
	        this.destination = destination;
	        this.refCountObservable = refCountObservable;
	        this.connection = refCountObservable.connection;
	        destination.add(this);
	    }
	    RefCountSubscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    RefCountSubscriber.prototype._error = function (err) {
	        this._resetConnectable();
	        this.destination.error(err);
	    };
	    RefCountSubscriber.prototype._complete = function () {
	        this._resetConnectable();
	        this.destination.complete();
	    };
	    RefCountSubscriber.prototype._resetConnectable = function () {
	        var observable = this.refCountObservable;
	        var obsConnection = observable.connection;
	        var subConnection = this.connection;
	        if (subConnection && subConnection === obsConnection) {
	            observable.refCount = 0;
	            obsConnection.unsubscribe();
	            observable.connection = null;
	            this.unsubscribe();
	        }
	    };
	    RefCountSubscriber.prototype._unsubscribe = function () {
	        var observable = this.refCountObservable;
	        if (observable.refCount === 0) {
	            return;
	        }
	        if (--observable.refCount === 0) {
	            var obsConnection = observable.connection;
	            var subConnection = this.connection;
	            if (subConnection && subConnection === obsConnection) {
	                obsConnection.unsubscribe();
	                observable.connection = null;
	            }
	        }
	    };
	    return RefCountSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=ConnectableObservable.js.map

/***/ },

/***/ 289:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(34);
	var merge_1 = __webpack_require__(290);
	Observable_1.Observable.prototype.merge = merge_1.merge;
	//# sourceMappingURL=merge.js.map

/***/ },

/***/ 290:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ArrayObservable_1 = __webpack_require__(281);
	var mergeAll_1 = __webpack_require__(291);
	var isScheduler_1 = __webpack_require__(284);
	/**
	 * Creates a result Observable which emits values from every given input Observable.
	 *
	 * <img src="./img/merge.png" width="100%">
	 *
	 * @param {Observable} input Observables
	 * @returns {Observable} an Observable that emits items that are the result of every input Observable.
	 */
	function merge() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i - 0] = arguments[_i];
	    }
	    observables.unshift(this);
	    return mergeStatic.apply(this, observables);
	}
	exports.merge = merge;
	function mergeStatic() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i - 0] = arguments[_i];
	    }
	    var concurrent = Number.POSITIVE_INFINITY;
	    var scheduler = null;
	    var last = observables[observables.length - 1];
	    if (isScheduler_1.isScheduler(last)) {
	        scheduler = observables.pop();
	        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
	            concurrent = observables.pop();
	        }
	    }
	    else if (typeof last === 'number') {
	        concurrent = observables.pop();
	    }
	    if (observables.length === 1) {
	        return observables[0];
	    }
	    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(concurrent));
	}
	exports.mergeStatic = mergeStatic;
	//# sourceMappingURL=merge.js.map

/***/ },

/***/ 291:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var OuterSubscriber_1 = __webpack_require__(292);
	var subscribeToResult_1 = __webpack_require__(293);
	function mergeAll(concurrent) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    return this.lift(new MergeAllOperator(concurrent));
	}
	exports.mergeAll = mergeAll;
	var MergeAllOperator = (function () {
	    function MergeAllOperator(concurrent) {
	        this.concurrent = concurrent;
	    }
	    MergeAllOperator.prototype.call = function (observer) {
	        return new MergeAllSubscriber(observer, this.concurrent);
	    };
	    return MergeAllOperator;
	}());
	exports.MergeAllOperator = MergeAllOperator;
	var MergeAllSubscriber = (function (_super) {
	    __extends(MergeAllSubscriber, _super);
	    function MergeAllSubscriber(destination, concurrent) {
	        _super.call(this, destination);
	        this.concurrent = concurrent;
	        this.hasCompleted = false;
	        this.buffer = [];
	        this.active = 0;
	    }
	    MergeAllSubscriber.prototype._next = function (observable) {
	        if (this.active < this.concurrent) {
	            this.active++;
	            this.add(subscribeToResult_1.subscribeToResult(this, observable));
	        }
	        else {
	            this.buffer.push(observable);
	        }
	    };
	    MergeAllSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            this.destination.complete();
	        }
	    };
	    MergeAllSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return MergeAllSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.MergeAllSubscriber = MergeAllSubscriber;
	//# sourceMappingURL=mergeAll.js.map

/***/ },

/***/ 292:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(38);
	var OuterSubscriber = (function (_super) {
	    __extends(OuterSubscriber, _super);
	    function OuterSubscriber() {
	        _super.apply(this, arguments);
	    }
	    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.destination.error(error);
	    };
	    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.destination.complete();
	    };
	    return OuterSubscriber;
	}(Subscriber_1.Subscriber));
	exports.OuterSubscriber = OuterSubscriber;
	//# sourceMappingURL=OuterSubscriber.js.map

/***/ },

/***/ 293:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var root_1 = __webpack_require__(35);
	var isArray_1 = __webpack_require__(41);
	var isPromise_1 = __webpack_require__(294);
	var Observable_1 = __webpack_require__(34);
	var SymbolShim_1 = __webpack_require__(36);
	var InnerSubscriber_1 = __webpack_require__(295);
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
	    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	    if (destination.isUnsubscribed) {
	        return;
	    }
	    if (result instanceof Observable_1.Observable) {
	        if (result._isScalar) {
	            destination.next(result.value);
	            destination.complete();
	            return;
	        }
	        else {
	            return result.subscribe(destination);
	        }
	    }
	    if (isArray_1.isArray(result)) {
	        for (var i = 0, len = result.length; i < len && !destination.isUnsubscribed; i++) {
	            destination.next(result[i]);
	        }
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    }
	    else if (isPromise_1.isPromise(result)) {
	        result.then(function (value) {
	            if (!destination.isUnsubscribed) {
	                destination.next(value);
	                destination.complete();
	            }
	        }, function (err) { return destination.error(err); })
	            .then(null, function (err) {
	            // Escaping the Promise trap: globally throw unhandled errors
	            root_1.root.setTimeout(function () { throw err; });
	        });
	        return destination;
	    }
	    else if (typeof result[SymbolShim_1.SymbolShim.iterator] === 'function') {
	        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
	            var item = result_1[_i];
	            destination.next(item);
	            if (destination.isUnsubscribed) {
	                break;
	            }
	        }
	        if (!destination.isUnsubscribed) {
	            destination.complete();
	        }
	    }
	    else if (typeof result[SymbolShim_1.SymbolShim.observable] === 'function') {
	        var obs = result[SymbolShim_1.SymbolShim.observable]();
	        if (typeof obs.subscribe !== 'function') {
	            destination.error('invalid observable');
	        }
	        else {
	            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
	        }
	    }
	    else {
	        destination.error(new TypeError('unknown type returned'));
	    }
	}
	exports.subscribeToResult = subscribeToResult;
	//# sourceMappingURL=subscribeToResult.js.map

/***/ },

/***/ 294:
/***/ function(module, exports) {

	"use strict";
	function isPromise(value) {
	    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}
	exports.isPromise = isPromise;
	//# sourceMappingURL=isPromise.js.map

/***/ },

/***/ 295:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(38);
	var InnerSubscriber = (function (_super) {
	    __extends(InnerSubscriber, _super);
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        _super.call(this);
	        this.parent = parent;
	        this.outerValue = outerValue;
	        this.outerIndex = outerIndex;
	        this.index = 0;
	    }
	    InnerSubscriber.prototype._next = function (value) {
	        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	    };
	    InnerSubscriber.prototype._error = function (error) {
	        this.parent.notifyError(error, this);
	        this.unsubscribe();
	    };
	    InnerSubscriber.prototype._complete = function () {
	        this.parent.notifyComplete(this);
	        this.unsubscribe();
	    };
	    return InnerSubscriber;
	}(Subscriber_1.Subscriber));
	exports.InnerSubscriber = InnerSubscriber;
	//# sourceMappingURL=InnerSubscriber.js.map

/***/ },

/***/ 296:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Observable_1 = __webpack_require__(34);
	var toArray_1 = __webpack_require__(297);
	Observable_1.Observable.prototype.toArray = toArray_1.toArray;
	//# sourceMappingURL=toArray.js.map

/***/ },

/***/ 297:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subscriber_1 = __webpack_require__(38);
	function toArray() {
	    return this.lift(new ToArrayOperator());
	}
	exports.toArray = toArray;
	var ToArrayOperator = (function () {
	    function ToArrayOperator() {
	    }
	    ToArrayOperator.prototype.call = function (subscriber) {
	        return new ToArraySubscriber(subscriber);
	    };
	    return ToArrayOperator;
	}());
	var ToArraySubscriber = (function (_super) {
	    __extends(ToArraySubscriber, _super);
	    function ToArraySubscriber(destination) {
	        _super.call(this, destination);
	        this.array = [];
	    }
	    ToArraySubscriber.prototype._next = function (x) {
	        this.array.push(x);
	    };
	    ToArraySubscriber.prototype._complete = function () {
	        this.destination.next(this.array);
	        this.destination.complete();
	    };
	    return ToArraySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=toArray.js.map

/***/ },

/***/ 298:
/***/ function(module, exports) {

	"use strict";
	var Parser = (function () {
	    function Parser() {
	        this.templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
	    }
	    /**
	     * Interpolates a string to replace parameters
	     * "This is a {{ key }}" ==> "This is a value", with params = { key: "value" }
	     * @param expr
	     * @param params
	     * @returns {string}
	     */
	    Parser.prototype.interpolate = function (expr, params) {
	        var _this = this;
	        if (typeof expr !== 'string' || !params) {
	            return expr;
	        }
	        return expr.replace(this.templateMatcher, function (substring, b) {
	            var r = _this.getValue(params, b);
	            return typeof r !== 'undefined' ? r : substring;
	        });
	    };
	    /**
	     * Gets a value from an object by composed key
	     * parser.getValue({ key1: { keyA: 'valueI' }}, 'key1.keyA') ==> 'valueI'
	     * @param target
	     * @param key
	     * @returns {string}
	     */
	    Parser.prototype.getValue = function (target, key) {
	        var keys = key.split('.');
	        key = '';
	        do {
	            key += keys.shift();
	            if (target[key] && (typeof target[key] === 'object' || !keys.length)) {
	                target = target[key];
	                key = '';
	            }
	            else if (!keys.length) {
	                target = undefined;
	            }
	            else {
	                key += '.';
	            }
	        } while (keys.length);
	        return target;
	    };
	    return Parser;
	}());
	exports.Parser = Parser;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyYW5zbGF0ZS5wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0lBQUE7UUFDSSxvQkFBZSxHQUFXLHVCQUF1QixDQUFDO0lBOEN0RCxDQUFDO0lBM0NHOzs7Ozs7T0FNRztJQUNJLDRCQUFXLEdBQWxCLFVBQW1CLElBQVksRUFBRSxNQUFZO1FBQTdDLGlCQVNDO1FBUkcsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFVBQUMsU0FBaUIsRUFBRSxDQUFTO1lBQ25FLElBQUksQ0FBQyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSx5QkFBUSxHQUFmLFVBQWdCLE1BQVcsRUFBRSxHQUFXO1FBQ3BDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNULEdBQUcsQ0FBQztZQUNBLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUN2QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxJQUFJLEdBQUcsQ0FBQztZQUNmLENBQUM7UUFDTCxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUV0QixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTCxhQUFDO0FBQUQsQ0FBQyxBQS9DRCxJQStDQztBQS9DWSxjQUFNLFNBK0NsQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFBhcnNlciB7XG4gICAgdGVtcGxhdGVNYXRjaGVyOiBSZWdFeHAgPSAve3tcXHM/KFtee31cXHNdKilcXHM/fX0vZztcblxuXG4gICAgLyoqXG4gICAgICogSW50ZXJwb2xhdGVzIGEgc3RyaW5nIHRvIHJlcGxhY2UgcGFyYW1ldGVyc1xuICAgICAqIFwiVGhpcyBpcyBhIHt7IGtleSB9fVwiID09PiBcIlRoaXMgaXMgYSB2YWx1ZVwiLCB3aXRoIHBhcmFtcyA9IHsga2V5OiBcInZhbHVlXCIgfVxuICAgICAqIEBwYXJhbSBleHByXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgcHVibGljIGludGVycG9sYXRlKGV4cHI6IHN0cmluZywgcGFyYW1zPzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiBleHByICE9PSAnc3RyaW5nJyB8fCAhcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwcjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGV4cHIucmVwbGFjZSh0aGlzLnRlbXBsYXRlTWF0Y2hlciwgKHN1YnN0cmluZzogc3RyaW5nLCBiOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHZhciByID0gdGhpcy5nZXRWYWx1ZShwYXJhbXMsIGIpO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByICE9PSAndW5kZWZpbmVkJyA/IHIgOiBzdWJzdHJpbmc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSB2YWx1ZSBmcm9tIGFuIG9iamVjdCBieSBjb21wb3NlZCBrZXlcbiAgICAgKiBwYXJzZXIuZ2V0VmFsdWUoeyBrZXkxOiB7IGtleUE6ICd2YWx1ZUknIH19LCAna2V5MS5rZXlBJykgPT0+ICd2YWx1ZUknXG4gICAgICogQHBhcmFtIHRhcmdldFxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRWYWx1ZSh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQga2V5cyA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICBrZXkgPSAnJztcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAga2V5ICs9IGtleXMuc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICh0YXJnZXRba2V5XSAmJiAodHlwZW9mIHRhcmdldFtrZXldID09PSAnb2JqZWN0JyB8fCAha2V5cy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0W2tleV07XG4gICAgICAgICAgICAgICAga2V5ID0gJyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5ICs9ICcuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoa2V5cy5sZW5ndGgpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbn1cbiJdfQ==

/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AppComponent = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _dec2, _class;

	var _core = __webpack_require__(71);

	var _router = __webpack_require__(300);

	var _ng2Translate = __webpack_require__(262);

	var _app = __webpack_require__(329);

	var _app2 = _interopRequireDefault(_app);

	var _i18n = __webpack_require__(330);

	var _menu = __webpack_require__(332);

	var _auth = __webpack_require__(334);

	var _router2 = __webpack_require__(341);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AppComponent = exports.AppComponent = (_dec = (0, _core.Component)({
	  selector: 'my-app',
	  directives: [_auth.LoggedInRouterOutlet, _menu.MenuComponent],
	  template: _app2.default,
	  pipes: [_ng2Translate.TranslatePipe]
	}), _dec2 = (0, _router.RouteConfig)(_router2.router.config), _dec(_class = _dec2(_class = function () {
	  _createClass(AppComponent, null, [{
	    key: 'parameters',
	    get: function get() {
	      return [[_ng2Translate.TranslateService]];
	    }
	  }]);

	  function AppComponent(translateService) {
	    _classCallCheck(this, AppComponent);

	    (0, _i18n.setupTranslations)(translateService);
	  }

	  return AppComponent;
	}()) || _class) || _class);

/***/ },

/***/ 329:
/***/ function(module, exports) {

	module.exports = "<nav class=\"navbar navbar-default navbar-fixed-top\">\r\n    <top-menu></top-menu>\r\n</nav>\r\n\r\n<div class=\"container body-container\">\r\n    <router-outlet></router-outlet>\r\n</div>"

/***/ },

/***/ 330:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.enTranslation = exports.setupTranslations = undefined;

	var _en = __webpack_require__(331);

	function setupTranslations(translateService) {
	  translateService.setTranslation('en', _en.translation);
	  translateService.setDefaultLang('en');
	  translateService.use('en');
	}

	exports.setupTranslations = setupTranslations;
	exports.enTranslation = _en.translation;

/***/ },

/***/ 331:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var translation = exports.translation = {
	  menu_webradio: 'Web Radio',
	  menu_fmradio: 'FM Radio',
	  menu_player: 'Player',
	  menu_linein: 'Line In',
	  menu_airplay: 'Airplay',
	  menu_settings: 'Settings',

	  webradio_title: 'Web Radio',

	  new_item_title: 'New item',
	  new_item_title_label: 'Title',
	  new_item_title_error: 'Title is required',
	  new_item_title_error_duplicate: 'Title already exists',
	  new_item_url_label: 'URL',
	  new_item_url_error: 'URL is required',
	  new_item_url_error_url: 'URL is invalid',

	  login_suggest: '(Email: {{ email }}, password: {{ password }})'
	};

/***/ },

/***/ 332:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MenuComponent = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _router = __webpack_require__(300);

	var _ng2Translate = __webpack_require__(262);

	var _menu = __webpack_require__(333);

	var _menu2 = _interopRequireDefault(_menu);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MenuComponent = exports.MenuComponent = (_dec = (0, _core.Component)({
	  selector: 'top-menu',
	  template: _menu2.default,
	  directives: [_router.ROUTER_DIRECTIVES],
	  changeDetection: _core.ChangeDetectionStrategy.OnPush,
	  pipes: [_ng2Translate.TranslatePipe]
	}), _dec(_class = function () {
	  _createClass(MenuComponent, null, [{
	    key: 'parameters',
	    get: function get() {
	      return [[_router.Router]];
	    }
	  }]);

	  function MenuComponent(router) {
	    _classCallCheck(this, MenuComponent);

	    this._router = router;
	  }

	  return MenuComponent;
	}()) || _class);

/***/ },

/***/ 333:
/***/ function(module, exports) {

	module.exports = "<div class=\"container\">\r\n    <div id=\"navbar\" class=\"collapse navbar-collapse\">\r\n        <ul class=\"nav navbar-nav\">\r\n            <li><a [routerLink]=\"['/WebradioList']\">{{ 'menu_webradio' | translate }}</a></li>\r\n            <li><a [routerLink]=\"['/WebradioList']\">{{ 'menu_fmradio' | translate }}</a></li>\r\n\t\t\t<li><a [routerLink]=\"['/WebradioList']\">{{ 'menu_player' | translate }}</a></li>\r\n\t\t\t<li><a [routerLink]=\"['/WebradioList']\">{{ 'menu_linein' | translate }}</a></li>\r\n\t\t\t<li><a [routerLink]=\"['/WebradioList']\">{{ 'menu_airplay' | translate }}</a></li>\r\n\t\t\t<li><a [routerLink]=\"['/WebradioList']\">{{ 'menu_settings' | translate }}</a></li>\r\n        </ul>\r\n    </div>\r\n</div>"

/***/ },

/***/ 334:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AUTH_PROVIDERS = exports.LoggedInRouterOutlet = exports.UserService = exports.RequestService = exports.StorageService = undefined;

	var _storage = __webpack_require__(335);

	var _request = __webpack_require__(337);

	var _user = __webpack_require__(338);

	var _router_outlet = __webpack_require__(340);

	var AUTH_PROVIDERS = [_storage.StorageService, _request.RequestService, _user.UserService];

	exports.StorageService = _storage.StorageService;
	exports.RequestService = _request.RequestService;
	exports.UserService = _user.UserService;
	exports.LoggedInRouterOutlet = _router_outlet.LoggedInRouterOutlet;
	exports.AUTH_PROVIDERS = AUTH_PROVIDERS;

/***/ },

/***/ 335:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.StorageService = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _localStorage = __webpack_require__(336);

	var _localStorage2 = _interopRequireDefault(_localStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var STORAGE_KEY = 'auth_token';

	var StorageService = exports.StorageService = function () {
	  function StorageService() {
	    _classCallCheck(this, StorageService);
	  }

	  _createClass(StorageService, [{
	    key: 'getAuthToken',
	    value: function getAuthToken() {
	      return _localStorage2.default.getItem(STORAGE_KEY);
	    }
	  }, {
	    key: 'setAuthToken',
	    value: function setAuthToken(token) {
	      _localStorage2.default.setItem(STORAGE_KEY, token);
	    }
	  }, {
	    key: 'removeAuthToken',
	    value: function removeAuthToken() {
	      _localStorage2.default.removeItem(STORAGE_KEY);
	    }
	  }]);

	  return StorageService;
	}();

/***/ },

/***/ 337:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.RequestService = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _http = __webpack_require__(263);

	var _storage = __webpack_require__(335);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RequestService = exports.RequestService = (_dec = (0, _core.Injectable)(), _dec(_class = function () {
	  _createClass(RequestService, null, [{
	    key: 'parameters',
	    get: function get() {
	      return [[_storage.StorageService]];
	    }
	  }]);

	  function RequestService(storage) {
	    _classCallCheck(this, RequestService);

	    this._storage = storage;
	  }

	  _createClass(RequestService, [{
	    key: 'getAuthHeaders',
	    value: function getAuthHeaders() {
	      var headers = this.getJsonHeaders();
	      return headers;
	    }
	  }, {
	    key: 'getJsonHeaders',
	    value: function getJsonHeaders() {
	      var headers = new _http.Headers();

	      headers.append('Content-Type', 'application/json');
	      return headers;
	    }
	  }]);

	  return RequestService;
	}()) || _class);

/***/ },

/***/ 338:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.UserService = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _http = __webpack_require__(263);

	var _BehaviorSubject = __webpack_require__(339);

	var _storage = __webpack_require__(335);

	var _request = __webpack_require__(337);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UserService = exports.UserService = (_dec = (0, _core.Injectable)(), _dec(_class = function () {
	  _createClass(UserService, null, [{
	    key: 'parameters',
	    get: function get() {
	      return [[_http.Http], [_storage.StorageService], [_request.RequestService]];
	    }
	  }]);

	  function UserService(http, storage, request) {
	    _classCallCheck(this, UserService);

	    this._loggedIn = new _BehaviorSubject.BehaviorSubject(false);

	    this._http = http;
	    this._storage = storage;
	    this._request = request;

	    if (!!this._storage.getAuthToken()) {
	      this._loggedIn.next(true);
	    }
	  }

	  _createClass(UserService, [{
	    key: 'login',
	    value: function login(credentials) {
	      var _this = this;

	      return this._http.post('/login', JSON.stringify(credentials), { headers: this._request.getJsonHeaders() }).map(function (res) {
	        return res.json();
	      }).map(function (res) {
	        if (res.success) {
	          _this._storage.setAuthToken(res.auth_token);
	          _this._loggedIn.next(true);
	        }

	        return res.success;
	      });
	    }
	  }, {
	    key: 'logout',
	    value: function logout() {
	      this._storage.removeAuthToken();
	      this._loggedIn.next(false);
	    }
	  }, {
	    key: 'isLoggedIn',
	    value: function isLoggedIn() {
	      return this._loggedIn.getValue();
	    }
	  }, {
	    key: 'getLoggedIn',
	    value: function getLoggedIn() {
	      return this._loggedIn;
	    }
	  }]);

	  return UserService;
	}()) || _class);

/***/ },

/***/ 339:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Subject_1 = __webpack_require__(100);
	var throwError_1 = __webpack_require__(102);
	var ObjectUnsubscribedError_1 = __webpack_require__(103);
	var BehaviorSubject = (function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        _super.call(this);
	        this._value = _value;
	    }
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasErrored) {
	            throwError_1.throwError(this.errorValue);
	        }
	        else if (this.isUnsubscribed) {
	            throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
	        }
	        else {
	            return this._value;
	        }
	    };
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.isUnsubscribed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype._next = function (value) {
	        _super.prototype._next.call(this, this._value = value);
	    };
	    BehaviorSubject.prototype._error = function (err) {
	        this.hasErrored = true;
	        _super.prototype._error.call(this, this.errorValue = err);
	    };
	    return BehaviorSubject;
	}(Subject_1.Subject));
	exports.BehaviorSubject = BehaviorSubject;
	//# sourceMappingURL=BehaviorSubject.js.map

/***/ },

/***/ 340:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.LoggedInRouterOutlet = undefined;

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _router = __webpack_require__(300);

	var _user = __webpack_require__(338);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LoggedInRouterOutlet = exports.LoggedInRouterOutlet = (_dec = (0, _core.Directive)({
	  selector: 'router-outlet'
	}), _dec(_class = function (_RouterOutlet) {
	  _inherits(LoggedInRouterOutlet, _RouterOutlet);

	  _createClass(LoggedInRouterOutlet, null, [{
	    key: 'parameters',
	    get: function get() {
	      return [[_core.ElementRef], [_core.DynamicComponentLoader], [_router.Router], [new _core.AttributeMetadata('name'), String], [_user.UserService]];
	    }
	  }]);

	  function LoggedInRouterOutlet(elementRef, componentLoader, parentRouter, name, userService) {
	    _classCallCheck(this, LoggedInRouterOutlet);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoggedInRouterOutlet).call(this, elementRef, componentLoader, parentRouter, name));

	    _this.publicRoutes = ['', 'login', 'signup'];


	    _this.parentRouter = parentRouter;
	    _this.userService = userService;
	    return _this;
	  }

	  _createClass(LoggedInRouterOutlet, [{
	    key: 'activate',
	    value: function activate(instruction) {
	      if (this._canActivate(instruction.urlPath)) {
	        return _get(Object.getPrototypeOf(LoggedInRouterOutlet.prototype), 'activate', this).call(this, instruction);
	      }

	      this.parentRouter.navigate(['Login']);
	    }
	  }, {
	    key: '_canActivate',
	    value: function _canActivate(url) {
	      return this.publicRoutes.indexOf(url) !== -1 || this.userService.isLoggedIn();
	    }
	  }]);

	  return LoggedInRouterOutlet;
	}(_router.RouterOutlet)) || _class);

/***/ },

/***/ 341:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.router = undefined;

	var _list = __webpack_require__(342);

	var _new = __webpack_require__(352);

	var _edit = __webpack_require__(354);

	var router = exports.router = {
	  config: [{ path: '/', component: _list.WebradioListComponent, name: 'WebradioList', useAsDefault: true }, { path: '/new', component: _new.NewComponent, name: 'New' }, { path: '/edit/:id', component: _edit.EditComponent, name: 'Edit' }]
	};

/***/ },

/***/ 342:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.WebradioListComponent = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _ng2Translate = __webpack_require__(262);

	var _list = __webpack_require__(343);

	var _list2 = _interopRequireDefault(_list);

	var _webradio = __webpack_require__(344);

	var _list_item = __webpack_require__(346);

	var _form = __webpack_require__(348);

	var _config = __webpack_require__(345);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WebradioListComponent = exports.WebradioListComponent = (_dec = (0, _core.Component)({
	  selector: 'list',
	  template: _list2.default,
	  directives: [_list_item.ListItemComponent, _form.FormComponent],
	  changeDetection: _core.ChangeDetectionStrategy.Detached,
	  pipes: [_ng2Translate.TranslatePipe]
	}), _dec(_class = function () {
	  function WebradioListComponent(webradioService) {
	    _classCallCheck(this, WebradioListComponent);

	    this._webradioService = webradioService;
	    this.baseHost = _config.config.baseHost;

	    this.showNewItemForm = false;
	    this.showEditControls = false;
	    this.showDuplicateError = false;
	  }

	  _createClass(WebradioListComponent, [{
	    key: 'ngOnInit',
	    value: function ngOnInit() {
	      this._webradioService.refreshItems();
	    }
	  }, {
	    key: 'getItems',
	    value: function getItems() {
	      return this._webradioService.remoteItems;
	    }
	  }, {
	    key: 'toggleNewItemForm',
	    value: function toggleNewItemForm() {
	      this.showNewItemForm = !this.showNewItemForm;
	      return false;
	    }
	  }, {
	    key: 'toggleEditMode',
	    value: function toggleEditMode() {
	      this.showEditControls = !this.showEditControls;
	      return false;
	    }
	  }, {
	    key: 'onAddItem',
	    value: function onAddItem(item) {
	      var _this = this;

	      this._webradioService.addItem(item).subscribe(function (res) {
	        if (res.result == "ok") {
	          _this.showNewItemForm = false;
	          _this._webradioService.refreshItems();
	        } else {
	          _this.showDuplicateError = true;
	        }
	      }, function (error) {
	        console.error(error);
	      });
	    }
	  }, {
	    key: 'onCancel',
	    value: function onCancel(item) {
	      this.showNewItemForm = false;
	    }
	  }]);

	  return WebradioListComponent;
	}()) || _class);
	Reflect.defineMetadata('design:paramtypes', [_webradio.WebradioService], WebradioListComponent);

/***/ },

/***/ 343:
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"col-sm-12\">\r\n        <h1 class=\"main_title\">{{ 'webradio_title' | translate }} \r\n\t\t\t<span class=\"pull-right\"><a href=\"#\" (click)=\"toggleNewItemForm()\"><img src=\"{{ baseHost }}images/add.png\"/></a> \r\n\t\t\t\t<a href=\"#\" (click)=\"toggleEditMode()\"><img src=\"{{ baseHost }}images/edit.png\"/></a>\r\n\t\t\t</span>\r\n\t\t</h1>\r\n\t\t<div class=\"row new-item-form\" *ngIf=\"showNewItemForm\">\r\n\t\t\t<div class=\"col-sm-12\">\r\n\t\t\t\t<h2>{{ 'new_item_title' | translate }}</h2>\r\n\t\t\t\t<item-form (saved)=\"onAddItem($event)\" [items]=\"getItems() | async\" [showDuplicateError]=\"showDuplicateError\"></item-form>\r\n\t\t\t</div>\r\n\t\t</div> \r\n\t\t\r\n        <div class=\"list-group\">\r\n            <list-item *ngFor=\"#item of getItems() | async\" [item]=\"item\" [showEditControls]=\"showEditControls\"></list-item>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ },

/***/ 344:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.WebradioService = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _http = __webpack_require__(263);

	var _BehaviorSubject = __webpack_require__(339);

	var _config = __webpack_require__(345);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WebradioService = exports.WebradioService = (_dec = (0, _core.Injectable)(), _dec(_class = function () {
	  function WebradioService(http) {
	    _classCallCheck(this, WebradioService);

	    this.remoteItems = new _BehaviorSubject.BehaviorSubject([]);

	    this._http = http;
	  }

	  _createClass(WebradioService, [{
	    key: 'refreshItems',
	    value: function refreshItems() {
	      var _this = this;

	      var itemsResponse = this._http.get(_config.config.baseHost + 'network').map(function (res) {
	        return res.json();
	      }).subscribe(function (items) {
	        _this.remoteItems.next(items);
	      }, function (error) {
	        console.error(error);
	      });

	      return itemsResponse;
	    }
	  }, {
	    key: 'addItem',
	    value: function addItem(item) {
	      return this._http.post(_config.config.baseHost + 'network/add', JSON.stringify(item), {}).map(function (res) {
	        return res.json();
	      });
	    }
	  }, {
	    key: 'getItem',
	    value: function getItem(id) {
	      return this._http.get('/post/' + id).map(function (res) {
	        return res.json();
	      });
	    }
	  }, {
	    key: 'updateItem',
	    value: function updateItem(item) {
	      return this._http.post('/post/' + item._id, JSON.stringify(item), {}).map(function (res) {
	        return res.json();
	      });
	    }
	  }]);

	  return WebradioService;
	}()) || _class);
	Reflect.defineMetadata('design:paramtypes', [_http.Http], WebradioService);

/***/ },

/***/ 345:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var config = exports.config = {
	  baseHost: 'http://192.168.31.149:3000/'
	};

/***/ },

/***/ 346:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ListItemComponent = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _list_item = __webpack_require__(347);

	var _list_item2 = _interopRequireDefault(_list_item);

	var _config = __webpack_require__(345);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ListItemComponent = exports.ListItemComponent = (_dec = (0, _core.Component)({
	  selector: 'list-item',
	  template: _list_item2.default,
	  changeDetection: _core.ChangeDetectionStrategy.OnPush,
	  inputs: ['item', 'showEditControls']
	}), _dec(_class = function () {
	  function ListItemComponent() {
	    _classCallCheck(this, ListItemComponent);

	    this.item = this.item;
	    this.showEditControls = this.showEditControls;

	    this.baseHost = _config.config.baseHost;
	  }

	  _createClass(ListItemComponent, [{
	    key: 'toggleEditMode',
	    value: function toggleEditMode() {}
	  }, {
	    key: 'deleteItem',
	    value: function deleteItem() {}
	  }]);

	  return ListItemComponent;
	}()) || _class);

/***/ },

/***/ 347:
/***/ function(module, exports) {

	module.exports = "<div class=\"list-group-item webradio-item\">\r\n    <h4 class=\"list-group-item-heading\"><a href=\"#{{ item.id }}\">{{ item.title }}</a>\r\n\t<span class=\"pull-right item-manage-controls\" *ngIf=\"showEditControls\">\r\n\t\t<img src=\"{{ baseHost }}images/reorder.png\"/>\r\n\t\t<a href=\"#\" (click)=\"toggleEditMode()\"><img src=\"{{ baseHost }}images/edit.png\"/></a>\r\n\t\t<a href=\"#\" (click)=\"deleteItem()\"><img src=\"{{ baseHost }}images/delete.png\"/></a>\r\n\t</span>\r\n\t<h5 class=\"list-group-item-text\">{{ item.value }}</h5>\r\n\t</h4>\r\n</div>"

/***/ },

/***/ 348:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FormComponent = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

	var _core = __webpack_require__(71);

	var _ng2Translate = __webpack_require__(262);

	var _common = __webpack_require__(151);

	var _form = __webpack_require__(349);

	var _form2 = _interopRequireDefault(_form);

	var _validator = __webpack_require__(350);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _initDefineProp(target, property, descriptor, context) {
	  if (!descriptor) return;
	  Object.defineProperty(target, property, {
	    enumerable: descriptor.enumerable,
	    configurable: descriptor.configurable,
	    writable: descriptor.writable,
	    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
	  });
	}

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	  var desc = {};
	  Object['ke' + 'ys'](descriptor).forEach(function (key) {
	    desc[key] = descriptor[key];
	  });
	  desc.enumerable = !!desc.enumerable;
	  desc.configurable = !!desc.configurable;

	  if ('value' in desc || desc.initializer) {
	    desc.writable = true;
	  }

	  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
	    return decorator(target, property, desc) || desc;
	  }, desc);

	  if (context && desc.initializer !== void 0) {
	    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
	    desc.initializer = undefined;
	  }

	  if (desc.initializer === void 0) {
	    Object['define' + 'Property'](target, property, desc);
	    desc = null;
	  }

	  return desc;
	}

	function _initializerWarningHelper(descriptor, context) {
	  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
	}

	var FormComponent = exports.FormComponent = (_dec = (0, _core.Component)({
	  selector: 'item-form',
	  template: _form2.default,
	  pipes: [_ng2Translate.TranslatePipe],
	  inputs: ['items', 'showDuplicateError']
	}), _dec2 = (0, _core.Input)(), _dec3 = (0, _core.Output)(), _dec4 = (0, _core.Output)(), _dec(_class = (_class2 = function () {
	  function FormComponent(builder) {
	    _classCallCheck(this, FormComponent);

	    this.items = this.items;
	    this.showDuplicateError = this.showDuplicateError;

	    _initDefineProp(this, 'item', _descriptor, this);

	    _initDefineProp(this, 'saved', _descriptor2, this);

	    _initDefineProp(this, 'canceled', _descriptor3, this);

	    this._builder = builder;
	  }

	  _createClass(FormComponent, [{
	    key: 'ngOnInit',
	    value: function ngOnInit() {
	      this.itemForm = this._builder.group({
	        title: ['', _common.Validators.compose([_common.Validators.required, (0, _validator.duplicateValidator)(this.items)])],
	        url: ['', _common.Validators.compose([_common.Validators.required, (0, _validator.validatorFactory)('url')])]
	      });
	    }
	  }, {
	    key: 'ngOnChanges',
	    value: function ngOnChanges(change) {
	      if (change.item && change.item.currentValue) {
	        this.itemForm.controls['title'].updateValue(change.item.currentValue.title);
	        this.itemForm.controls['url'].updateValue(change.item.currentValue.url);
	      }
	    }
	  }, {
	    key: 'onSubmit',
	    value: function onSubmit(item) {
	      var out = {};
	      out.title = item.title.trim();
	      out.value = item.url.trim();
	      out.order = parseInt(this.items[this.items.length - 1].order) + 1 + "";

	      this.saved.emit(out);
	    }
	  }, {
	    key: 'cancelNewItemForm',
	    value: function cancelNewItemForm() {
	      this.canceled.emit(null);
	    }
	  }]);

	  return FormComponent;
	}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'item', [_dec2], {
	  enumerable: true,
	  initializer: function initializer() {
	    return this.item;
	  }
	}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'saved', [_dec3], {
	  enumerable: true,
	  initializer: function initializer() {
	    return new _core.EventEmitter();
	  }
	}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'canceled', [_dec4], {
	  enumerable: true,
	  initializer: function initializer() {
	    return new _core.EventEmitter();
	  }
	})), _class2)) || _class);
	Reflect.defineMetadata('design:paramtypes', [_common.FormBuilder], FormComponent);

/***/ },

/***/ 349:
/***/ function(module, exports) {

	module.exports = "<form (ngSubmit)=\"onSubmit(itemForm.value)\" [ngFormModel]=\"itemForm\">\r\n    <div class=\"form-group\">\r\n        <label for=\"item-title\">{{ 'new_item_title_label' | translate }}</label>\r\n        <input type=\"text\" [ngFormControl]=\"itemForm.controls['title']\" #title=\"ngForm\" class=\"form-control\" id=\"item-title\">\r\n\t\t<div *ngIf=\"title.control.hasError('required') && title.control.touched\" class=\"error\">\r\n\t\t\t{{ 'new_item_title_error' | translate }}\r\n\t\t</div>\r\n\t\t<div *ngIf=\"(title.control.hasError('duplicate') && title.control.touched) || showDuplicateError\" class=\"error\">\r\n\t\t\t{{ 'new_item_title_error_duplicate' | translate }}\r\n\t\t</div>\r\n\t</div>\r\n    <div class=\"form-group\">\r\n        <label for=\"item-url\">{{ 'new_item_url_label' | translate }}</label>\r\n        <input type=\"text\" [ngFormControl]=\"itemForm.controls['url']\" #url=\"ngForm\" class=\"form-control\" id=\"item-url\">\r\n\t\t<div *ngIf=\"url.control.hasError('required') && url.control.touched\" class=\"error\">\r\n        {{ 'new_item_url_error' | translate }}\r\n\t\t</div>\r\n\t\t<div *ngIf=\"url.control.hasError('url') && url.control.touched\" class=\"error\">\r\n        {{ 'new_item_url_error_url' | translate }}\r\n\t\t</div>\r\n\t</div>\r\n    <button type=\"submit\" [disabled]=\"!itemForm.valid\" class=\"btn btn-primary\">Save</button>\r\n\t<button type=\"button\" class=\"btn btn-primary\" (click)=\"cancelNewItemForm()\">Cancel</button>\r\n</form>"

/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validatorFactory = validatorFactory;
	exports.duplicateValidator = duplicateValidator;

	var _validate = __webpack_require__(351);

	function validatorFactory(validationName) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var validateOptions = {};
	  validateOptions[validationName] = options;

	  var constraints = { inputField: validateOptions };

	  return function urlValidator(control) {
	    var attributes = { inputField: control.value };

	    var result = (0, _validate.validate)(attributes, constraints);

	    if (result) {
	      var validationResult = {};
	      validationResult[validationName] = true;
	      return validationResult;
	    }
	  };
	}

	function duplicateValidator(items) {
	  return function (control) {
	    var value = control.value.trim();
	    if (items) {
	      for (var item in items) {
	        if (value == items[item].title) {
	          return { duplicate: true };
	        }
	      }
	    }
	    return null;
	  };
	}

/***/ },

/***/ 352:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.NewComponent = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _router = __webpack_require__(300);

	var _new = __webpack_require__(353);

	var _new2 = _interopRequireDefault(_new);

	var _webradio = __webpack_require__(344);

	var _form = __webpack_require__(348);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NewComponent = exports.NewComponent = (_dec = (0, _core.Component)({
	  selector: 'new',
	  template: _new2.default,
	  directives: [_form.FormComponent]
	}), _dec(_class = function () {
	  function NewComponent(webradioService, router) {
	    _classCallCheck(this, NewComponent);

	    this._webradioService = webradioService;
	    this._router = router;
	  }

	  _createClass(NewComponent, [{
	    key: 'onSave',
	    value: function onSave(item) {
	      var _this = this;

	      this._webradioService.addItem(item).subscribe(function () {
	        _this._router.navigate(['List']);
	      }, function (error) {
	        console.error(error);
	      });
	    }
	  }]);

	  return NewComponent;
	}()) || _class);
	Reflect.defineMetadata('design:paramtypes', [_webradio.WebradioService, _router.Router], NewComponent);

/***/ },

/***/ 353:
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"col-sm-12\">\r\n        <h1>New item</h1>\r\n\r\n        <item-form (saved)=\"onSave($event)\"></item-form>\r\n    </div>\r\n</div>"

/***/ },

/***/ 354:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EditComponent = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dec, _class;

	var _core = __webpack_require__(71);

	var _router = __webpack_require__(300);

	var _edit = __webpack_require__(355);

	var _edit2 = _interopRequireDefault(_edit);

	var _webradio = __webpack_require__(344);

	var _form = __webpack_require__(348);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EditComponent = exports.EditComponent = (_dec = (0, _core.Component)({
	  selector: 'edit',
	  template: _edit2.default,
	  directives: [_form.FormComponent]
	}), _dec(_class = function () {
	  function EditComponent(webradioService, params, router) {
	    _classCallCheck(this, EditComponent);

	    this._webradioService = webradioService;
	    this._params = params;
	    this._router = router;
	  }

	  _createClass(EditComponent, [{
	    key: 'ngOnInit',
	    value: function ngOnInit() {
	      this.item = this._webradioService.getItem(this._params.get('id'));
	    }
	  }, {
	    key: 'onSave',
	    value: function onSave(item) {
	      var _this = this;

	      this._webradioService.updateItem(item).subscribe(function () {
	        _this._router.navigate(['List']);
	      }, function (err) {
	        console.error(err);
	      });
	    }
	  }]);

	  return EditComponent;
	}()) || _class);
	Reflect.defineMetadata('design:paramtypes', [_webradio.WebradioService, _router.RouteParams, _router.Router], EditComponent);

/***/ },

/***/ 355:
/***/ function(module, exports) {

	module.exports = "<div class=\"row\">\r\n    <div class=\"col-sm-12\">\r\n        <h1>Edit item</h1>\r\n\r\n        <item-form [item]=\"item | async\" (saved)=\"onSave($event)\"></item-form>\r\n    </div>\r\n</div>"

/***/ },

/***/ 356:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.WEBRADIO_PROVIDERS = exports.WebradioService = undefined;

	var _webradio = __webpack_require__(344);

	var WEBRADIO_PROVIDERS = [_webradio.WebradioService];

	exports.WebradioService = _webradio.WebradioService;
	exports.WEBRADIO_PROVIDERS = WEBRADIO_PROVIDERS;

/***/ }

});
//# sourceMappingURL=boot.js.map