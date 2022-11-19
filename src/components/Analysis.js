import { Component } from "react";
import Cookies from "universal-cookie";
import {trNames, crNames, prNames, mrNames} 
    from "../config/Names"

class Analysis extends Component {
    constructor(props) {
        super(props);
        this.pers = this.emptyPers();
        this.LRERs = this.emptyLRERs();
        this.fakeData();
        this.save();
        this.txtPers = {};
        this.txtLrers = {};
        for (let row in this.pers) {
            this.txtPers[row] = [];
            for (let i = 0; i < 10; i++) {
                this.txtPers[row].push(""+this.pers[row][i]);
            }
        }
        for (let id in this.LRERs) {
            this.LRERs[id] = ""+this.LRERs;
        }
        this.loaded = false;
    }

    fakeData() {
        for (let row in this.pers) {
            for(let i = 0; i < 10; i++){
                this.pers[row][i] = Math.round(Math.random() * 99) / 100;
            }
        }
        for (let id in this.LRERs) {
            this.LRERs[id] = +(Math.round(Math.random() * 99) / 100);
        }
        console.log(this.LRERs)
    }

    emptyPers() {
        let pers = {};
        for (let tId in trNames) pers[tId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let mId in mrNames) pers[mId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let pId in prNames) pers[pId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let cId in crNames) pers[cId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        return pers;
    }

    emptyLRERs() {
        let LRERs = {};

        for (let tId in trNames) LRERs[tId] = 0;
        for (let mId in mrNames) LRERs[mId] = 0;
        for (let pId in prNames) LRERs[pId] = 0;
        for (let cId in crNames) LRERs[cId] = 0;

        for (let l in LRERs) {
            console.log("HERE " + LRERs[l]);
        }

        return LRERs;
    }

    load() {
        const cookies = new Cookies();
        this.pers = cookies.get("pers") || this.emptyPers();
        this.LRERs = cookies.get("lrers") || this.emptyLRERs();
        if (!this.loaded) {
            for (let row in this.pers) {
                this.txtPers[row] = [];
                for (let i = 0; i < 10; i++) {
                    this.txtPers[row].push(""+this.pers[row][i]);
                }
            }
            for (let id in this.LRERs) {
                this.LRERs[id] = ""+this.LRERs;
            }
            this.loaded = true;
        }
    }

    save() {
        const cookies = new Cookies();
        cookies.set("pers", this.pers, { path: '/' });
        cookies.set("lrers", this.LRERs, { path: '/' });
    }

    calcSumER() {
        let sum = 0;
        for (let id in this.pers) {
            sum += this.calcER(this.pers[id]);
        }
        return sum;
    }

    calcER(pers) {
        let er = 0;
        for (let per of pers) 
            er += per;
        er /= pers.length;
        return Math.round(er * 1000) / 1000;
    }
    calcLRER() {
        
    }
    calcVRER() {
        
    }
    calcPRER() {
        
    }

    renderClearButton() {
        const removeAll = () => {
            this.pers = this.emptyPers();
            this.loaded = false;
            this.save();
            this.forceUpdate();
        }
        return <button className="btn btn-secondary"
            onClick={removeAll}>
            Очистити
        </button>;
    }

    renderInput(id, expert) {
        return <td className="per-input-container" key={id + expert}>
            <input id={id+expert} 
                className="per-input text-center w-100"
                type="text"
                onChange={(e) => {
                    this.txtPers[id][expert] = e.target.value;
                    this.pers[id][expert] = +e.target.value;
                    this.save();
                    this.forceUpdate();
                }} 
                value={this.txtPers[id][expert]}/>
        </td>;
    }

    renderRow(id, name) {
        let perCells = [];
        for (let i = 0; i < this.pers[id].length; i++) {
            perCells.push(this.renderInput(id, i));
        }
        // console.log(this.lrers);
        return <tr className="text-center" key={id}>
            <td title={name}>{id}</td>
            {perCells}
            <td>{this.calcER(this.pers[id])}</td>
            <td>
                <input id={id} 
                    className="per-input text-center w-100"
                    type="text"
                    onChange={(e) => {
                        this.txtLrers[id] = e.target.value;
                        this.LRERs[id] = +e.target.value;
                        this.save();
                        this.forceUpdate();
                    }} 
                    value={this.txtLrers[id]}/>
            </td>
            <td>0.00</td>
            <td>Високий</td>
        </tr>
    }

    renderBlock(title, names) {
        let rows = [];
        let er = 0, conclusion = "дуже висока";
        const sumER = this.calcSumER();
        for (let risk in names) {
            rows.push(this.renderRow(risk, names[risk]));
            er += this.calcER(this.pers[risk]);
        }
        er = Math.round(er/sumER * 1000) / 1000;
        if (er < 0.1) conclusion = "дуже низька";
        else if (er < 0.25) conclusion = "низька";
        else if (er < 0.5) conclusion = "середня";
        else if (er < 0.75) conclusion = "висока";
        return <tbody>
            <tr>
                <th className="sub-th text-center" colSpan={11}>{title}</th>
                <th className="text-center">{er}</th>
                <th colSpan={3}> - { conclusion } ймовірність</th>
            </tr>
            {rows}
        </tbody>
    }

    render() {
        this.load();
        return <>
            <div className="row mt-3 d-flex flex-row justify-content-center"
                style={{fontSize: "1.4em"}}>
                Total TODO...
            </div>
            <div className="row">
                <div className="col d-flex flex-row align-items-center">
                    <span className="my-auto"
                        style={{fontSize: "1.1em"}}>Оцінки ризиків експертами...</span>
                </div>
                <div className="col d-flex justify-content-end">
                    {this.renderClearButton()}
                </div>
            </div>
            <div className="row">
                <table id="conversation" className="table table-striped mt-2">
                    <thead className="text-center border">
                        <tr>
                            <th className="small-th" rowSpan={2}>Подія</th>
                            <th colSpan={10}>Оцінки експертів</th>
                            <th className="small-th" rowSpan={2}>Ймовірність настання (ER)</th>
                            <th className="small-th" rowSpan={2}>Можливі збитки (LRER)</th>
                            <th className="small-th" rowSpan={2}>Величина ризику (VRER)</th>
                            <th className="small-th" rowSpan={2}>Пріоритет (PRER)</th>
                        </tr>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                            <th>8</th>
                            <th>9</th>
                            <th>10</th>
                        </tr>
                    </thead>
                    { this.renderBlock("Технічні ризики",   trNames) }
                    { this.renderBlock("Ризики управління", mrNames) }
                    { this.renderBlock("Планові ризики",    crNames) }
                    { this.renderBlock("Фінансові ризики",  prNames) }
                </table>
            </div>
        </>
    }
}
 
export default Analysis;