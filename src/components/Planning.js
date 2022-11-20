import { Component } from "react";
import Cookies from "universal-cookie";
import {trNames, crNames, prNames, mrNames, 
    eNames, defaultEvent} 
    from "../config/Names"

class Planning extends Component {
    constructor(props) {
        super(props);
        this.ever = this.emptyEvents();
    }

    emptyEvents() {
        let ever = {};
        for (let tId in trNames) ever[tId] = "e0";
        for (let mId in mrNames) ever[mId] = "e0";
        for (let pId in prNames) ever[pId] = "e0";
        for (let cId in crNames) ever[cId] = "e0";
        return ever;
    }

    load() {
        const cookies = new Cookies();
        this.ever = cookies.get("ever") || this.emptyEvents();
    }

    save() {
        const cookies = new Cookies();
        cookies.set("ever", this.ever, { path: "/" });
    }

    renderClearButton() {
        const removeAll = () => {
            this.ever = this.emptyEvents();
            this.save();
            this.forceUpdate();
        }
        return <button className="btn btn-secondary"
            onClick={removeAll}>
            Очистити
        </button>;
    }

    renderSelect(id) {
        let values = [];
        for (let event in eNames)
            values.push(<option value={event} key={id+event}>{eNames[event]}</option>)
        return <div className="d-flex flex-row my-0 ms-3">
            <span>Рішення:</span>
            <select className={"w-100 ms-2 my-0" + (this.ever[id] === defaultEvent ? " border border-2 rounded-1 border-danger" : "")} 
                id={id}
                onChange={(e) => {
                    this.ever[id] = e.target.value;
                    this.save();
                    this.forceUpdate();
                }}
                value={this.ever[id]}>
                {values}
            </select>
        </div>;
    }

    renderBlock(title, names) {
        let risks = [];
        let num = 0;
        for (let id in names) {
            risks.push(
                <div className="m-1" key={"r" + (num++)}>
                    {names[id]}
                    {this.renderSelect(id)}
                </div>
            );
        }
        return <div className="row">
            <p className="mt-2 mb-0" style={{textDecoration: "underline", fontSize: "1.1em"}}>
                {title}:
            </p>
            {risks}
        </div>;
    }

    render() {
        this.load();
        return <>
            <div className="row">
                <div className="col d-flex flex-row align-items-center">
                    <span className="my-auto"
                        style={{fontSize: "1.1em"}}>План роботи з ризиками...</span>
                </div>
                <div className="col d-flex justify-content-end">
                    {this.renderClearButton()}
                </div>
            </div>
            {this.renderBlock("Технічні ризики",    trNames)}
            {this.renderBlock("Ризики управління",  mrNames)}
            {this.renderBlock("Планові ризики",     crNames)}
            {this.renderBlock("Фінансові ризики",   prNames)}
        </>;
    }
}
 
export default Planning;