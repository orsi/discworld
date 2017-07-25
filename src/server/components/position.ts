import Component from '../component';
export default class PositionComponent extends Component {
    public x: number;
    public y: number;
    toString() { return `(${this.x}, ${this.y})`; }
}