const { ForeErrorGlobalHandler } = require("./error");
import { guidGenerator } from "./utils";

class Fore {
  constructor() {
    this._app = null;
    const errorHandler = new ForeErrorGlobalHandler();
    this.watchers = {};
    this.flatTree = {};
  }

  createElement(el, attrs = {}, children) {
    if (Object.prototype.toString.call(el) === "[object Object]") {
      if (!el.name) throw new Error("Component exported without name");
      const tr = el.comp;
      let component = { type: tr };
      component.props = attrs || null;
      component.data = el.data || null;
      component.name = el.name;
      if (el.mounted) {
        component.isMounted = el.mounted;
      }
      const v = {
        el: component,
        attrs,
        children,
      };
      return v;
    } else {
      return {
        el,
        attrs,
        children,
      };
    }
  }

  bindEventsAttribute(at, $e) {
    const type = at[0].split(":")[1];
    ["click", "hover"].includes(type) &&
      $e.addEventListener(
        type,
        at[1].bind({
          data: this.watchers[$e.owner].w,
          props: $e.owner,
        })
      );
  }

  render(vNode, $o) {
    if (typeof vNode === "string") {
      const tnode = document.createTextNode(vNode);
      return tnode;
    } else if (typeof vNode === "number" || typeof vNode === "boolean") {
      return document.createTextNode(vNode.toString());
    } else {
      if (
        Object.prototype.toString.call(vNode) === "[object Object]" &&
        !vNode.el
      ) {
        const tnode = document.createTextNode(Object.values(vNode)[0]);
        tnode.DT_NAME = Object.keys(vNode)[0];
        return tnode;
      } else if (
        Object.prototype.toString.call(vNode.el) === "[object Object]"
      ) {
        const componentDt = vNode.el.data;
        let dataWatcher = vNode.el.data;

        const handler = {
          get(target, key) {
            if (key == "isProxy") return true;
            const prop = target[key];

            // return if property not found
            if (typeof prop == "undefined") return;

            // set value as proxy if object
            if (!prop.isProxy && typeof prop === "object")
              target[key] = new Proxy(
                { ...prop, __consumer__: target.__consumer__, __parent__: key },
                handler
              );
            return target[key];
          },
          set: (target, key, value) => {
            this.flatTree[target.__consumer__].forEach((fte) => {
              fte.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                  const dt_name_ref =
                    "this.data." +
                    (target.__parent__ ? target.__parent__ + "." : "") +
                    key;
                  if (
                    node.nodeValue === target[key].toString() &&
                    dt_name_ref === node.DT_NAME
                  ) {
                    /* this.watchers[target.__consumer__].comp.isMounted &&
                      this.watchers[target.__consumer__].comp.isMounted(); */
                    node.nodeValue = value;
                  }
                }
              });
            });
            target[key] = value;
            return true;
          },
        };

        if (componentDt !== null) {
          dataWatcher = new Proxy(
            {
              ...componentDt,
              __consumer__: vNode.el.name,
            },
            handler
          );
        }
        this.flatTree[vNode.el.name] = [];
        this.watchers[vNode.el.name] = {
          w: dataWatcher,
          consumers: [],
          comp: vNode.el,
        };
        const ft = vNode.el.type.bind({
          data: dataWatcher,
          props: vNode.el.props,
        })();
        ft.owner = vNode.el.name;

        if (vNode.el.isMounted) {
          vNode.el.isMounted.bind({
            data: dataWatcher,
            props: vNode.el.props,
          })();
        }

        return this.render(ft, vNode.el.name);
      } else {
        const el = document.createElement(vNode.el);
        el.wref = guidGenerator();
        el.owner = $o;
        Object.entries(vNode.attrs).forEach((at) => {
          this.bindEventsAttribute(at, el);
          if (at[0] === "class" || at[0] === "id") {
            el.setAttribute(at[0], at[1]);
          }
        });

        vNode.children.forEach((ch) => {
          el.appendChild(this.render(ch, $o));
        });

        if (this.flatTree[el.owner]) {
          this.flatTree[el.owner].push(el);
        }
        return el;
      }
    }
  }

  /**
   * Mounts the final Component to the dom, after compiling and creating the tree
   * @param $app Component
   * @param $root Container
   */
  mount($app, $root) {
    if (typeof $app !== "function")
      throw new Error(
        "Mount failed: $app must be a function, received " + typeof $app
      );
    this.$app = $app;
    this.$root = $root;
    const finalDomElem = this.render($app());
    return $root.appendChild(finalDomElem);
  }

  _makeCallExp(arg, data) {
    /*const vars = Object.getOwnPropertyNames(data).map(
      (prop) => "const " + prop + "=" + JSON.stringify(data[prop]) + ";"
    );*/
    return new Function(arg);
  }

  _getNestedObjectValueFromString(obj = {}, path = "", value) {
    var schema = obj;

    var pList = path.split(".");
    var len = pList.length;

    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }

    return schema[pList[len - 1]];
  }
}

export default new Fore();
