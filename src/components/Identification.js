import { Component } from "react";
import Cookies from 'universal-cookie';
import {trsNames, crsNames, prsNames, mrsNames,
        trNames, crNames, prNames, mrNames,
        dividers} 
    from "../config/Names"

class Identification extends Component {
    constructor(props) {
        super(props);

        this.state = { origins: true }
        this.probability = { t: 0, p: 0, c: 0, m: 0, total: 0 };

        this.trsData = {}
        this.crsData = {}
        this.prsData = {}
        this.mrsData = {}

        this.trData = {}
        this.crData = {}
        this.prData = {}
        this.mrData = {}
    }

    load = () => {
        const cookies = new Cookies();
        if (this.state.origins) {
            this.trsData = cookies.get("trs") || {};
            this.crsData = cookies.get("crs") || {};
            this.prsData = cookies.get("prs") || {};
            this.mrsData = cookies.get("mrs") || {};
        } else {
            this.trData = cookies.get("tr") || {};
            this.crData = cookies.get("cr") || {}; 
            this.prData = cookies.get("pr") || {};
            this.mrData = cookies.get("mr") || {};
        }
        this.probCalc();
    }

    save = () => {
        const cookies = new Cookies();
        if (this.state.origins) {
            cookies.set('trs', this.trsData, { path: '/' });
            cookies.set('crs', this.crsData, { path: '/' });
            cookies.set('prs', this.prsData, { path: '/' });
            cookies.set('mrs', this.mrsData, { path: '/' });
        } else {
            cookies.set('tr', this.trData, { path: '/' });
            cookies.set('cr', this.crData, { path: '/' });
            cookies.set('pr', this.prData, { path: '/' });
            cookies.set('mr', this.mrData, { path: '/' });
        }
    }
    
    probCalc = () => {
        if (this.state.origins) this.calcFor(this.trsData, this.prsData, this.crsData, this.mrsData, dividers.rs);
        else this.calcFor(this.trData, this.prData, this.crData, this.mrData, dividers.r);
    }

    calcFor = (tData, pData, cData, mData, by) => {
        let t = 0, p = 0, c = 0, m = 0;
        for (let tn in tData) t += tData[tn];
        t /= by;
        for (let pn in pData) p += pData[pn];
        p /= by;
        for (let cn in cData) c += cData[cn];
        c /= by;
        for (let mn in mData) m += mData[mn];
        m /= by;
        this.probability = {
            t: t, p: p, c: c, m: m,
            total: t + m + c + p
        }
    }

    clear = () => {
        let cbs = document.querySelectorAll("input");
        for (let cb of cbs) cb.checked = false;
        if (this.state.origins) {
            this.trsData = {}; this.crsData = {};
            this.prsData = {}; this.mrsData = {};
        } else {
            this.trData = {}; this.crData = {}; 
            this.prData = {}; this.mrData = {};
        }
        this.probCalc();
    }

    renderLine(data, id, name) {
        return <div className="d-flex flex-row align-items-start" key={id}>
            <input type="checkbox" id={id} className="mt-2"
                onChange={(e) => {
                    data[id] = e.target.checked ? 1 : 0;
                    this.save();
                    this.probCalc();
                    this.forceUpdate();
                }}
                checked={data[id] === 1}/>
            <label className="ms-2 w-100" htmlFor={id}>{name}</label>
        </div>;
    }

    renderBlock(title, value, names, data, prefix="") {
        let lines = [];
        for (let id in names) {
            lines.push(this.renderLine(data, id, names[id]));
        }
        return <div className="col mb-3">
            <p className="m-0"
                style={{fontSize: "1.1em"}}>
                    <span 
                        style={{
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}
                        onClick={()=>{
                            let cbs = document.querySelectorAll("input[id^='" + prefix + "']");
                            let check = false;
                            for (let cb of cbs) { if (!cb.checked) { check = true; break; } }
                            for (let cb of cbs) { 
                                cb.checked = check;
                                data[cb.id] = check ? 1 : 0;
                            }
                            this.save();
                            this.probCalc();
                            this.forceUpdate();
                        }}>
                        {title}
                    </span>: {Math.round(value * 10000) / 100}%
            </p>
            {lines}
        </div>;
    }

    renderClearButton() {
        const removeAll = () => {
            this.clear();
            this.save();
            this.probCalc();
            this.forceUpdate();
        }
        return <button className="btn btn-secondary"
            onClick={removeAll}>
            Очистити
        </button>;
    }

    render() {
        this.load();
        let contents = this.state.origins 
            ? <>
                <div className="row mt-3 d-flex flex-row justify-content-center"
                    style={{fontSize: "1.4em"}}>
                    Ймовірність: {Math.round(this.probability.total * 10000) / 100}%
                </div>
                <div className="row">
                    <div className="col d-flex flex-row align-items-center">
                        <span className="my-auto"
                            style={{fontSize: "1.1em"}}>У поточній специфікації вимог...</span>
                    </div>
                    <div className="col d-flex justify-content-end">
                        {this.renderClearButton()}
                    </div>
                </div>
                <div className="row">
                    {this.renderBlock("Технічні ризики",   this.probability.t, trsNames, this.trsData, "t")}
                    {this.renderBlock("Ризики управління", this.probability.m, mrsNames, this.mrsData, "m")}
                </div>
                <div className="row">
                    {this.renderBlock("Планові ризики",    this.probability.p, prsNames, this.prsData, "p")}
                    {this.renderBlock("Фінансові ризики",  this.probability.c, crsNames, this.crsData, "c")}
                </div>
            </>
            : <>
                <div className="row mt-3 d-flex flex-row justify-content-center"
                    style={{fontSize: "1.4em"}}>
                    Ймовірність: {Math.round(this.probability.total * 10000) / 100}%
                </div>
                <div className="row">
                    <div className="col d-flex flex-row align-items-center">
                        <span className="my-auto"
                            style={{fontSize: "1.1em"}}>У поточній специфікації вимог...</span>
                    </div>
                    <div className="col d-flex justify-content-end">
                        {this.renderClearButton()}
                    </div>
                </div>
                <div className="row">
                    {this.renderBlock("Технічні ризики",   this.probability.t, trNames, this.trData, "t")}
                    {this.renderBlock("Ризики управління", this.probability.m, mrNames, this.mrData, "m")}
                </div>
                <div className="row">
                    {this.renderBlock("Планові ризики",    this.probability.p, prNames, this.prData, "p")}
                    {this.renderBlock("Фінансові ризики",  this.probability.c, crNames, this.crData, "c")}
                </div>
            </>;
        return <>
            <div className="text-center">
                <span style={{fontSize: "1.2em"}}>Іденитифікація</span>
                <select className="ms-2"
                    style={{fontSize: "1.1em"}}
                    onChange={(e)=>{
                        this.clear();
                        this.setState({origins: !+e.target.value});
                    }}>
                    <option value="0">можливих джерел ризиків</option>
                    <option value="1">потенційних ризикових подій</option>
                </select>
            </div>
            {contents}
        </>;
    }
}

export default Identification;