type Configuration = {
    delegate?: Node;
    listener?: Listener;
};

type Listener = (e: Event) => void;


export { Configuration, Listener };