type Configuration = {
    listener?: Listener;
    shortcut?: Node;
};

type Listener = (e: Event) => void;


export { Configuration, Listener };