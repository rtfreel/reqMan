import { Component } from "react";
import Cookies from "universal-cookie";
import {aNames} from "../config/Names"

class Clients extends Component {
    constructor(props) {
        super(props);
        this.cws = this.emptyCws();
        this.txtCws = {};
        for (let row in this.cws) {
            this.txtCws[row] = [];
            for (let i = 0; i < 10; i++) {
                this.txtCws[row].push(""+this.cws[row][i]);
            }
        }
        this.loaded = false;
    }

    fakeData() {
        for (let row in this.cws) {
            for(let i = 0; i < 10; i++){
                this.cws[row][i] = Math.round(Math.random() * 10);
            }
        }
    }

    emptyCws() {
        let cws = {};
        for (let aId in aNames) cws[aId] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        return cws;
    }

    load() {
        const cookies = new Cookies();
        this.cws = cookies.get("cws") || this.emptyCws();
        if (!this.loaded) {
            for (let row in this.cws) {
                this.txtCws[row] = [];
                for (let i = 0; i < 10; i++) {
                    this.txtCws[row].push(""+this.cws[row][i]);
                }
            }
            this.loaded = true;
        }
    }

    save() {
        const cookies = new Cookies();
        cookies.set("cws", this.cws, { path: '/' });
    }

    renderClearButton() {
        const removeAll = () => {
            this.cws = this.emptyCws();
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

    renderInput(id, client) {
        return <td className="per-input-container" key={id + client}>
            <input id={id+client} 
                className="per-input text-center w-100"
                type="text"
                onChange={(e) => {
                    this.txtCws[id][client] = e.target.value;
                    this.cws[id][client] = +e.target.value;
                    this.save();
                    this.forceUpdate();
                }} 
                value={this.txtCws[id][client]}/>
        </td>;
    }

    renderRow(id, name) {
        let cwsCells = [];
        for (let i = 0; i < this.cws[id].length; i++) {
            cwsCells.push(this.renderInput(id, i));
        }
        return <tr key={id}>
            <td>{name}</td>
            {cwsCells}
        </tr>
    }

    renderTable() {
        let rows = [];
        for (let attribute in aNames)
            rows.push(this.renderRow(attribute, aNames[attribute]));
        return <tbody>{rows}</tbody>;
    }

    render() {
        this.load();
        return <>
            <div className="row">
                <div className="col d-flex flex-row align-items-center">
                    <span className="my-auto"
                        style={{fontSize: "1.1em"}}>Оцінка якості користувачами...</span>
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
                            <th colSpan={10}>Оцінки користувачів</th>
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
                    { this.renderTable() }
                </table>
            </div>
        </>
    }
}
 
export default Clients;