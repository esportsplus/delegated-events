import { Configuration, Listener } from './types';


let cache: Record<string, WeakMap<Node, Configuration>> = {},
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
    if (!cache[event]) {
        cache[event] = new WeakMap();

        document.addEventListener(event, (e) => {
            let element: Element = e.target as Element,
                node: Node | null = element;

            e.stopPropagation();

            while (node) {
                let { delegate, listener }: Configuration = cache[event].get(node) || {};

                if (listener) {
                    listener.call((delegate || node), e);

                    if (!element.isSameNode(node)) {
                        cache[event].set(element, {
                            delegate: node,
                            listener
                        });
                    }
                    break;
                }

                node = node.parentNode;
            }
        }, { capture: true, passive: passive[event] });
    }

    cache[event].set(element, { listener });
};


export default { register };