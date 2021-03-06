/// <reference path="refs.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
;
;
var MagicView = (function (_super) {
    __extends(MagicView, _super);
    function MagicView() {
        _super.apply(this, arguments);
        this.template = function () {
            var attrs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                attrs[_i - 0] = arguments[_i];
            }
            throw "no template! :X";
            return "";
        };
        this.subviewObjects = {};
    }
    MagicView.prototype.subviews = function () {
        return {};
    };
    MagicView.prototype.initialize = function (attrs) {
        this.bindEverything();
        this.attrs = attrs;
        this.parent = attrs.parent || null;
    };
    MagicView.prototype.bindEverything = function () {
        var args = [this, 'trigger', 'renderEl', 'render'];
        for (var prop in this) {
            if (_.isFunction(this[prop]) && !(prop in Backbone.View.prototype)) {
                args.push(prop);
            }
        }
        _.bindAll.apply(this, args);
    };
    MagicView.prototype.getSubview = function (el) {
        if (!(el in this.subviewObjects)) {
            throw "no el named " + el + " in this MagicView's subviews.";
        }
        return this.subviewObjects[el];
    };
    // propagate events upward to parent MagicViews
    MagicView.prototype.trigger = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var args = [eventName].concat(args);
        var result = _super.prototype.trigger.apply(this, args);
        if (this.parent && result !== false) {
            this.parent.trigger.apply(this, args);
        }
    };
    // pull this out so we could override it in a superclass
    MagicView.prototype.renderEl = function () {
        this.el.innerHTML = this.template(_.extend({
            __no_model: !this.model
        }, this.model ? this.model.toJSON() : {}));
    };
    MagicView.prototype.render = function () {
        var subviews = this.subviews();
        this.renderEl();
        for (var el in subviews) {
            var viewMaker = subviews[el];
            var $el = this.$(el);
            if (!$el.length) {
                throw "no el with the name " + el + " found. :(";
            }
            var view = viewMaker({
                el: $el,
                parent: this
            });
            view.render();
            this.subviewObjects[el] = view;
        }
        return this;
    };
    return MagicView;
})(Backbone.View);
var MagicListView = (function (_super) {
    __extends(MagicListView, _super);
    function MagicListView() {
        _super.apply(this, arguments);
        // if you pass in a listEl, then the list will go in that el - otherwise, it'll just be the entire element.
        this.listEl = "";
    }
    MagicListView.prototype.subview = function () {
        throw "need to implement subview for MagicListView!";
        return undefined;
    };
    MagicListView.prototype.initialize = function (attrs) {
        if (this.listEl == "") {
            this.tagName = "div";
        }
        _super.prototype.initialize.call(this, attrs);
    };
    MagicListView.prototype.renderEl = function () {
        var _this = this;
        this.el.innerHTML = this.template();
        this.collection.each(function (m) {
            var subviewType = _this.subview();
            var subview = new subviewType({ model: m, parent: _this });
            subview.setElement($("<div>").appendTo(_this.listEl == "" ? _this.$el : _this.$(_this.listEl)));
            subview.render();
        });
    };
    return MagicListView;
})(MagicView);
