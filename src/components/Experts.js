import { Component } from "react";
import Cookies from "universal-cookie";
import { aNames } from "../config/Names"

class Experts extends Component {
    constructor(props) {
        super(props);
        this.ees = this.emptyEws(3);
        this.txtEes = {};
        for (let row in this.ees) {
            this.txtEes[row] = [];
            for (let i = 0; i < 3; i++) {
                this.txtEes[row].push(""+this.ees[row][i]);
            }
        }
        this.ews = this.emptyEws(4);
        this.txtEws = {};
        for (let row in this.ews) {
            this.txtEws[row] = [];
            for (let i = 0; i < 4; i++) {
                this.txtEws[row].push(""+this.ews[row][i]);
            }
        }
        this.ewcs = [0, 0, 0, 0];
        this.txtEwcs = [];
        for (let i = 0; i < 4; i++) {
            this.txtEwcs.push(""+this.ewcs[i]);
        }
        this.loaded = false;
        this.calcClients();
    }

    fakeData() {
        for (let row in this.ees) {
            for(let i = 0; i < 3; i++){
                this.ees[row][i] = Math.round(Math.random() * 10);
            }
        }
        for (let row in this.ews) {
            for(let i = 0; i < 4; i++){
                this.ews[row][i] = Math.round(Math.random() * 10);
            }
        }
        this.ewcs = new Array(4);
        for(let i = 0; i < 4; i++){
            this.ewcs[i] = (Math.round(Math.random() * 10));
        }
    }

    emptyEws(size) {
        let ews = {};
        for (let aId in aNames) {
            ews[aId] = new Array(size).fill(0);
        }
        return ews;
    }

    load() {
        const cookies = new Cookies();
        this.ees = cookies.get("ees") || this.emptyEws(3);
        this.ews = cookies.get("ews") || this.emptyEws(4);
        this.ewcs = cookies.get("ewcs") || [0, 0, 0, 0];
        if (!this.loaded) {
            for (let row in this.ees) {
                this.txtEes[row] = [];
                for (let i = 0; i < 3; i++) {
                    this.txtEes[row].push(""+this.ees[row][i]);
                }
            }
            for (let row in this.ews) {
                this.txtEws[row] = [];
                for (let i = 0; i < 4; i++) {
                    this.txtEws[row].push(""+this.ews[row][i]);
                }
            }
            this.txtEwcs = [];
            for (let i = 0; i < 4; i++) {
                this.txtEwcs.push(""+this.ewcs[i]);
            }
            this.loaded = true;
        }
    }

    save() {
        const cookies = new Cookies();
        cookies.set("ees", this.ees, { path: '/' });
        cookies.set("ews", this.ews, { path: '/' });
        cookies.set("ewcs", this.ewcs, { path: '/' });
    }

    calcClients() {
        const cookies = new Cookies();
        let cCli = cookies.get("cws");
        this.cli = [];
        if (!cCli) {
            for (let a in aNames) {
                this.cli[a] = 0;
            }
            return;
        }
        for (let a in aNames) {
            this.cli[a] = cCli[a].reduce((a, b) => a + b, 0) / cCli[a].length;
        }
    }

    calcOvers() {
        let result = [];
        let sum;
        for (let i = 0; i < 3; i++) {
            sum = 0;
            for (let est in this.ees) {
                sum += this.ees[est][i];
            }
            result.push(sum)
        }
        sum = 0;
        for (let i in this.cli) sum += this.cli[i];
        result.push(Math.round(sum * 10) / 10);
        return result;
    }

    calcUnders() {
        const len = Object.keys(aNames).length;
        let result = [];
        let sum;
        for (let i = 0; i < 4; i++) {
            sum = 0;
            for (let wei in this.ews) {
                sum += this.ews[wei][i];
            }
            result.push(sum / len)
        }
        return result;
    }

    renderClearButton() {
        const removeAll = () => {
            this.ees = this.emptyEws(3);
            this.ews = this.emptyEws(4);
            this.ewcs = new Array(4).fill(0);
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
                Заповнити
            </button>
            <button className="btn btn-secondary"
                onClick={removeAll}>
                Очистити
            </button>
        </div>;
    }

    renderInput(valRef, txtRef, id, client) {
        return <input id={id+client} 
                className="est-input text-center"
                type="text"
                onChange={(e) => {
                    txtRef[id][client] = e.target.value;
                    valRef[id][client] = +e.target.value;
                    this.save();
                    this.forceUpdate();
                }} 
                value={txtRef[id][client]}/>;
    }

    renderRow(id, name) {
        let cwsCells = [];
        for (let i = 0; i < this.ees[id].length; i++) {
            cwsCells.push(<td className="per-input-container" key={id + i}>
                <div className="d-flex justify-content-center px-2 w-100">
                    {this.renderInput(this.ees, this.txtEes, id, i)}
                    <span className="mx-2">/</span>
                    {this.renderInput(this.ews, this.txtEws, id, i)}
                </div>
            </td>);
        }
        return <tr key={id}>
            <td>{name}</td>
            {cwsCells}
            <td className="text-center">{this.cli[id]} <span className="mx-2">/</span> {this.renderInput(this.ews, this.txtEws, id, 3)} </td>
        </tr>
    }

    renderTable() {
        let rows = [];
        for (let attribute in aNames)
            rows.push(this.renderRow(attribute, aNames[attribute]));

        let overs = this.calcOvers();
        let unders = this.calcUnders();
        let total = [];
        for (let i = 0; i < overs.length; i++)
            total.push(<td className="text-center" key={"total" + i}>
                {overs[i]}
                <span className="mx-2">/</span>
                {unders[i]}
            </td>);

        let weights = []
        for (let i = 0; i < this.ewcs.length; i++) {
            weights.push(<td className="text-center" key={"weight" + i}>
                <input className="text-center w-75"
                    type="text"
                    onChange={(e) => {
                        this.txtEwcs[i] = e.target.value;
                        this.ewcs[i] = +e.target.value;
                        this.save();
                        this.forceUpdate();
                    }} 
                    value={this.txtEwcs[i]}/>
            </td>);
        }
        
        return <tbody>
            <tr>
                <td>Коефіцієнти вагомості</td>
                {weights}
            </tr>
            {rows}
            <tr>
                <td>Загально балів</td>
                {total}
            </tr>
        </tbody>;
    }

    render() {
        this.load();
        return <>
            <div className="row">
                <div className="col d-flex flex-row align-items-center">
                    <span className="my-auto"
                        style={{fontSize: "1.1em"}}>Оцінка якості експертами: [оцінка] / [ваговий коефіцієнт].</span>
                </div>
                <div className="col d-flex justify-content-end">
                    {this.renderClearButton()}
                </div>
            </div>
            <div className="row">
                <table id="conversation" className="table table-striped mt-2">
                    <thead className="text-center border">
                        <tr>
                            <th rowSpan={2}>Критерій</th>
                            <th colSpan={3}>Оцінки експертів</th>
                            <th rowSpan={2}>Оцінки користувачів</th>    
                        </tr>
                        <tr>
                            <th>у галузі</th>
                            <th>з usability</th>
                            <th>з програмування</th>
                        </tr>
                    </thead>
                    { this.renderTable() }
                </table>
            </div>
        </>
    }
}
 
export default Experts;