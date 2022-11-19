import { Component } from "react";
import Cookies from "universal-cookie";
import {trNames, crNames, prNames, mrNames} 
    from "../config/Names"

class Analysis extends Component {
    constructor(props) {
        super(props);
        this.pers = this.emptyPers();
        this.LRERs = this.emptyLRERs();
        this.vBounds = {min: 1, max: 0};
        // this.fakeData();
        // this.save();
        this.txtPers = {};
        this.txtLRERs = {};
        for (let row in this.pers) {
            this.txtPers[row] = [];
            for (let i = 0; i < 10; i++) {
                this.txtPers[row].push(""+this.pers[row][i]);
            }
        }
        for (let id in this.LRERs) {
            this.txtLRERs[id] = ""+this.LRERs[id];
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

        return LRERs;
    }

    load() {
        const cookies = new Cookies();
        this.pers = cookies.get("pers") || this.emptyPers();
        this.LRERs = cookies.get("lrers") || this.emptyLRERs();
        this.vBounds = {min: 1, max: 0};
        if (!this.loaded) {
            for (let row in this.pers) {
                this.txtPers[row] = [];
                for (let i = 0; i < 10; i++) {
                    this.txtPers[row].push(""+this.pers[row][i]);
                }
            }
            for (let id in this.LRERs) {
                this.txtLRERs[id] = ""+this.LRERs[id];
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
    calcVRER(er, lrer) {
        return Math.round(er * lrer * 1000) / 1000;
    }
    calcPRER(vrer) {
        let section = (this.vBounds.max - this.vBounds.min) / 3;
        if (vrer < this.vBounds.min + section) return "Низький";
        if (vrer >= this.vBounds.max - section) return "Високий";
        return "Середній";
    }

    renderClearButton() {
        const removeAll = () => {
            this.pers = this.emptyPers();
            this.LRERs = this.emptyLRERs();
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
        let er = this.calcER(this.pers[id]);
        let lrer = this.txtLRERs[id];
        let vrer = this.calcVRER(er, lrer);
        if (vrer < this.vBounds.min) this.vBounds.min = vrer;
        if (vrer > this.vBounds.max) this.vBounds.max = vrer;
        return <tr className="text-center" key={id}>
            <td title={name}>{id}</td>
            {perCells}
            <td>{er}</td>
            <td>
                <input id={id} 
                    className="per-input text-center w-100"
                    type="text"
                    onChange={(e) => {
                        this.txtLRERs[id] = e.target.value;
                        this.LRERs[id] = +e.target.value;
                        this.save();
                        this.forceUpdate();
                    }} 
                    value={lrer}/>
            </td>
            <td>{vrer}</td>
            <td>{this.calcPRER(vrer)}</td>
        </tr>
    }

    renderBlock(title, names) {
        let rows = [];
        let er = 0, conclusion = "дуже висока ймовірність";
        const sumER = this.calcSumER();
        for (let risk in names) {
            rows.push(this.renderRow(risk, names[risk]));
            er += this.calcER(this.pers[risk]);
        }
        er = Math.round(er/sumER * 1000) / 1000;
        if (er < 0.1) conclusion = "дуже низька ймовірність";
        else if (er < 0.25) conclusion = "низька ймовірність";
        else if (er < 0.5) conclusion = "середня ймовірність";
        else if (er < 0.75) conclusion = "висока ймовірність";
        else if (isNaN(er)) { er = 0; conclusion = "дані відсутні"; }
        return <tbody>
            <tr>
                <th className="sub-th text-center" colSpan={11}>{title}</th>
                <th className="text-center">{er}</th>
                <th colSpan={3}> - { conclusion }</th>
            </tr>
            {rows}
        </tbody>
    }

    render() {
        this.load();
        let techRisks = this.renderBlock("Технічні ризики",   trNames);
        let manRisks =  this.renderBlock("Ризики управління", mrNames);
        let planRisks = this.renderBlock("Планові ризики",    crNames);
        let finRisks =  this.renderBlock("Фінансові ризики",  prNames);
        return <>
            <div className="mt-3 mx-auto w-50 d-flex flex-row justify-content-around" 
                style={{fontSize: "1.4em"}}>
                <span>Найменша величина: {this.vBounds.min}</span>
                <span>Найбільша величина: {this.vBounds.max}</span>
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
                    { techRisks }
                    { manRisks }
                    { planRisks }
                    { finRisks }
                </table>
            </div>
        </>
    }
}
 
export default Analysis;