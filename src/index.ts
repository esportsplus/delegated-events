import { Listener } from './types';


let cache: Record<string, WeakMap<Node, Listener>> = {},
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
            let listener,
                node: Node | null = e.target as Node;

            while (node) {
                // Element node type
                if (node.nodeType !== 1) {
                    break;
                }

                // Delegated event listener found
                if (listener = cache[event].get(node)) {
                    if (!passive[event]) {
                        e.preventDefault();
                    }

                    e.stopPropagation();
                    listener(e, node);
                    break;
                }

                if (!e.bubbles || (node as HTMLElement).tagName === 'A') {
                    break;
                }

                node = node.parentNode;
            }
        }, { capture: true, passive: passive[event] });
    }

    cache[event].set(element, listener);
};


export default { register };