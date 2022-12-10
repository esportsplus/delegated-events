type Cache = Record<string, WeakMap<Node, Configuration>>;

type Configuration = {
    bail?: boolean;
    delegate?: {
        node: Node,
        listener: Listener
    };
    listener?: Listener;
};

type Listener = (e: Event) => void;


export { Cache, Listener };