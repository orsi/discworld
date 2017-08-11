export default abstract class Component {
    public dependencies: Array<Component>;
    constructor(public name: string) {}
}