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
    },
    root = document.body;


const register = (element: Node, event: string, listener: Listener): void => {
    let config = cache[event];

    if (!config) {
        config = cache[event] = new WeakMap();

        root.addEventListener(event, (e) => {
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
                    if (node !== element) {
                        config.set(element, { delegate: { node, listener } });
                    }

                    listener.call(node, e);
                    return;
                }

                node = node.parentNode;

                if (node === root) {
                    break;
                }
            }

            config.set(element, { bail: true });
        }, { capture: capture[event] || false, passive: passive[event] });
    }

    config.set(element, { listener });
};


export default { register };