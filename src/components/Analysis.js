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
        this.pers = cookies.get(this.props.persCookie) || this.emptyPers();
        this.LRERs = cookies.get(this.props.lrersCookie) || this.emptyLRERs();
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
        cookies.set(this.props.persCookie, this.pers, { path: '/' });
        cookies.set(this.props.lrersCookie, this.LRERs, { path: '/' });
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
        if (vrer < this.vBounds.min + section) return "??????????????";
        if (vrer >= this.vBounds.max - section) return "??????????????";
        return "????????????????";
    }

    renderClearButton() {
        const removeAll = () => {
            this.pers = this.emptyPers();
            this.LRERs = this.emptyLRERs();
            this.loaded = false;
            this.save();
            this.forceUpdate();
        }
        return <div>
            <button className="btn btn-outline-secondary me-2"
                onClick={() => {
                    this.fakeData();
                    this.loaded = false;
                    this.save();
                    this.forceUpdate();
                }}>
                ??????????????????
            </button>
            <button className="btn btn-secondary"
                onClick={removeAll}>
                ????????????????
            </button>
        </div>;
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
        let er = 0, conclusion = "???????? ???????????? ??????????????????????";
        const sumER = this.calcSumER();
        for (let risk in names) {
            rows.push(this.renderRow(risk, names[risk]));
            er += this.calcER(this.pers[risk]);
        }
        er = Math.round(er/sumER * 1000) / 1000;
        if (er < 0.1) conclusion = "???????? ???????????? ??????????????????????";
        else if (er < 0.25) conclusion = "???????????? ??????????????????????";
        else if (er < 0.5) conclusion = "?????????????? ??????????????????????";
        else if (er < 0.75) conclusion = "???????????? ??????????????????????";
        else if (isNaN(er)) { er = 0; conclusion = "???????? ????????????????"; }
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
        let techRisks = this.renderBlock("???????????????? ????????????",   trNames);
        let manRisks =  this.renderBlock("???????????? ????????????????????", mrNames);
        let planRisks = this.renderBlock("?????????????? ????????????",    crNames);
        let finRisks =  this.renderBlock("?????????????????? ????????????",  prNames);
        return <>
            <div className="mt-3 mx-auto w-50 d-flex flex-row justify-content-around" 
                style={{fontSize: "1.4em"}}>
                <span>???????????????? ????????????????: {this.vBounds.min}</span>
                <span>?????????????????? ????????????????: {this.vBounds.max}</span>
            </div>
            <div className="row">
                <div className="col d-flex flex-row align-items-center">
                    <span className="my-auto"
                        style={{fontSize: "1.1em"}}>???????????? ?????????????? ????????????????????...</span>
                </div>
                <div className="col d-flex justify-content-end">
                    {this.renderClearButton()}
                </div>
            </div>
            <div className="row">
                <table id="conversation" className="table table-striped mt-2">
                    <thead className="text-center border">
                        <tr>
                            <th className="small-th" rowSpan={2}>??????????</th>
                            <th colSpan={10}>???????????? ??????????????????</th>
                            <th className="small-th" rowSpan={2}>?????????????????????? ???????????????? (ER)</th>
                            <th className="small-th" rowSpan={2}>?????????????? ???????????? (LRER)</th>
                            <th className="small-th" rowSpan={2}>???????????????? ???????????? (VRER)</th>
                            <th className="small-th" rowSpan={2}>?????????????????? (PRER)</th>
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