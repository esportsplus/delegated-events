import { Cache, Listener } from './types';


let cache: Cache = {},
    capture: Record<string, boolean> = {
        blur: true,
        focus: true,
        scroll: true
    },
    passive: Record<string, boolean> = {
        mousedown: true,
        mouseenter: true,
        mouseleave: true,
        mousemove: true,
        mouseout: true,
        mouseover: true,
        mouseup: true,
        mousewheel: true,
        scroll: true,
        touchcancel: true,
        touchend: true,
        touchenter: true,
        touchleave: true,
        touchmove: true,
        touchstart: true,
        wheel: true
    };


const register = (element: Node, event: string, listener: Listener): void => {
    let config = cache[event];

    if (!config) {
        config = cache[event] = new WeakMap();

        document.body.addEventListener(event, (e) => {
            let element: Element = e.target as Element,
                node: Node | null = element as Node;

            e.stopPropagation();

            while (node) {
                let { bail, delegate, listener } = config.get(node) || {};

                if (bail) {
                    return;
                }

                if (delegate) {
                    delegate.listener.call(delegate.node, e);
                    return;
                }

                if (listener) {
                    if (!node.isSameNode(element)) {
                        config.set(element, { delegate: { node, listener } });
                    }

                    listener.call(node, e);
                    return;
                }

                node = node?.parentNode;
            }

            config.set(element, { bail: true });
        }, { capture: capture[event] || false, passive: passive[event] });
    }

    config.set(element, { listener });
};


// TODO: Factory method binding root node to attach delegated events to?
export default { register };