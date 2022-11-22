import { Component } from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    Tooltip,
    Legend,
    PointElement,
    BarController,
    LineController,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
import { Chart } from "react-chartjs-2";
import Cookies from "universal-cookie";
import { aNames } from "../config/Names";

class Charts extends Component {
    constructor(props) {
        super(props);
        ChartJS.register(
            RadialLinearScale,
            LinearScale,
            CategoryScale,
            BarElement,
            PointElement,
            LineElement,
            Legend,
            Tooltip,
            LineController,
            BarController,
            LinearScale
          );
        this.state = {
            chartType: 0
        };
        this.values = [];
        this.load();
        this.calcValues();
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
        this.clients = cookies.get("cws") || this.emptyCws();
        this.experts = cookies.get("ees") || this.emptyEws(3);
        this.estimW = cookies.get("ews") || this.emptyEws(4);
        this.expertsW = cookies.get("ewcs") || [0, 0, 0, 0];
    }

    calcClients() {
        const cookies = new Cookies();
        let cCli = cookies.get("cws");
        if (!cCli) {
            for (let a in aNames) {
                this.experts[a][3] = 0;
            }
            return;
        }
        for (let a in aNames) {
            this.experts[a][3] = cCli[a].reduce((a, b) => a + b, 0) / cCli[a].length;
        }
    }

    calcValues() {
        this.calcClients();
        this.values = {};
        let len = Object.keys(aNames).length;
        let avgOfAvg = 0;
        let avgOfUP = 0;
        let avgOfUO = 0;
        for (let aId in aNames) {
            this.values[aId] = [];
            let sum = 0;
            let qs = 0;
            let ws = 0;
            for (let i = 0; i < 4; i++) {
                let expertEst = this.experts[aId][i];
                let estimaW = this.estimW[aId][i];
                let expertW = this.expertsW[i] / 10;
                ws += estimaW;
                qs += expertW;
                this.values[aId][i] = Math.round(expertEst * estimaW * 100) / 100;
                sum += Math.round(expertEst * estimaW * expertW * 100) / 100;
            }
            this.estimW[aId][4] = Math.round(ws*100/4)/100;
            sum /= qs;
            this.expertsW[4] = qs * 10 / 4;
            this.values[aId][4] = Math.round(sum*100)/100;
            this.values[aId][5] = Math.round(sum/this.estimW[aId][4]*100)/100;
            avgOfAvg += this.estimW[aId][4];
            avgOfUP += this.values[aId][4];
            avgOfUO += this.values[aId][5];
        }
        this.values["a" + (len + 1)] = [];
        this.values["a" + (len + 2)] = [];
        
        avgOfAvg /= len;
        avgOfUP /= len;
        avgOfUO /= len;
        
        let nq = 0;
        let qs = 0;
        for(let i = 0; i < 4; i++) {
            let ws = 0;
            let xws = 0;
            for (let a in aNames) {
                let x = this.experts[a][i];
                let w = this.estimW[a][i] / 10;
                xws += x * w;
                ws += w;
            }
            let res = xws / ws;
            this.values["a" + (len + 1)][i] = Math.round(res * 100) / 100;
            res *= this.expertsW[i] / 10;
            this.values["a" + (len + 2)][i] = Math.round(res * 100) / 100;
            nq += this.values["a" + (len + 1)][i];
            qs += this.expertsW[i] / 10;
        }
        
        let sumQedEst = 0;
        for(let i = 0; i < 4; i++) {
            sumQedEst += this.values["a" + (len + 2)][i];
        }

        this.values["a" + (len + 1)][4] = Math.round(avgOfUP/avgOfAvg * 100) / 100;
        this.values["a" + (len + 2)][4] = Math.round(nq/4 * 100) / 100;
        this.values["a" + (len + 1)][5] = Math.round(avgOfUO * 100) / 100;
        this.values["a" + (len + 2)][5] = Math.round(sumQedEst/qs * 100) / 100;
    }

    calcSquare() {
        const index = this.state.chartType;
        if (index > 4) return -1;
        const len = Object.keys(aNames).length;

        // circle parts (f)
        let parts = [];
        let wsum = 0;
        for (let a in aNames)
            wsum += this.values[a][index];
        for (let a in aNames)
            parts.push(this.values[a][index]/wsum * 360);
        
        // ----------------------------------------------
        let parts2 = [0 - parts[0] / 2];
        for (let i = 0; i < parts.length; i++)
            parts2.push(parts2[i] + parts[i]);
        
        // ----------------------------------------------
        let degrees = [360];
        for (let i = 1; i < parts2.length; i++)
            degrees.push((parts2[i] + parts2[i-1])/2);
        
        // ----------------------------------------------
        let radians = [];
        for (let i = 0; i < degrees.length; i++)
            radians.push(degrees[i] * Math.PI / 180);
        
        // ----------------------------------------------
        let ds = [];
        let q = this.expertsW[index] / 10;
        if (index === 4) {
            q *= 4;
            let val;
            for (let a in aNames) {
                val = 0;
                for (let i = 0; i < 4; i++)
                    val += this.estimW[a][i] * this.experts[a][i] * this.expertsW[i] / 10;
                val /= q;
                ds.push(val);
            }
        } else {
            for (let a in aNames) 
                ds.push(this.experts[a][index] * this.estimW[a][index] * q);
        }

        // ----------------------------------------------
        let as = [];
        for (let i = 0; i < ds.length; i++) 
            as.push(ds[i]*Math.sin(radians[i+1]))

        // ----------------------------------------------
        let bs = [];
        for (let i = 0; i < ds.length; i++) 
            bs.push(ds[i]*Math.cos(radians[i+1]))

        // ----------------------------------------------
        let cs = [];
        for (let i = 0; i < ds.length; i++)
            cs.push(Math.sqrt(as[i]*as[i] + bs[i]*bs[i]));

        // ----------------------------------------------
        let res1 = [];
        for (let i = 0; i < as.length; i++)
            res1.push(as[i]*bs[(i+1)%bs.length]);

        // ----------------------------------------------
        let res2 = [];
        for (let i = 0; i < bs.length; i++)
            res1.push(bs[i]*as[(i+1)%bs.length]);
        
        // ----------------------------------------------
        let resVal1 = res1.reduce((a, b) => a+b, 0);
        let resVal2 = res2.reduce((a, b) => a+b, 0);

        return Math.round(Math.abs(resVal1 - resVal2) / 2 * 1000) / 1000;
    }

    getData() {
        switch(this.state.chartType) {
            default: 
                let result = [];
                for (let a in aNames) {
                    result.push(this.values[a][this.state.chartType])
                }
                return result;
            case 5:
                var color = ["rgb(255, 99, 132)",
                        "rgb(132, 255, 99)",
                        "rgb(99, 132, 255)", 
                        "rgb(255, 234, 167)",
                        "rgb(167, 255, 234)"];
                let chartData = {}; 
                chartData.labels = Object.values(aNames);
                chartData.datasets = [];
                let names = ['Експерт у галузі', 
                            'Експерт з usability', 
                            'Експерт з програмування', 
                            'Користувачі', 
                            'Усереднений експерт'];
                for (let i = 0; i < 5; i++) {
                    let data = [];
                    for (let a in aNames) {
                        data.push(this.values[a][i])
                    }
                    chartData.datasets.push({
                        label: names[i],
                        borderColor: color[i],
                        data: data
                    });
                }
                return chartData;
        }
    }

    renderChart() {
        switch(this.state.chartType) {
            default: 
                return <Chart
                    type='radar'
                    options={{
                        plugins: { 
                            legend: { display: false },
                            filler: { propagate: false },
                            'samples-filler-analyser': { target: 'chart-analyser' }
                        },
                        interaction: { intersect: false },
                        scales: {
                            r: {
                                grid: { circular: true },
                                angleLines: { display: true },    
                                beginAtZero: true,
                                suggestedMax: 10,
                                scaleStartValue: 0,
                            }
                        },
                        elements: {
                            point: { radius: 0 }
                        }
                    }}
                    data={{
                        labels: Object.values(aNames),
                        datasets: [{
                            label: null,
                            backgroundColor: "#fff",
                            borderColor: "#000",
                            pointBackgroundColor: "#000",
                            data: this.getData()
                        }]
                    }}/>;
            case 5:
                return <Chart
                type='radar'
                options={{
                    plugins: {
                        filler: {
                            propagate: false
                        },
                        'samples-filler-analyser': {
                            target: 'chart-analyser'
                        },
                        tooltips: {
                           enabled: false
                        }
                    },
                    interaction: {
                        intersect: false
                    },
                    scales: {
                        r: {
                            grid: { circular: true },
                            angleLines: {
                                display: true
                            },    
                            beginAtZero: true,
                            suggestedMax: 100,
                            scaleStartValue: 0,
                        }
                    },
                    elements: {
                        point: { radius: 0 }
                    }
                }}
                data={this.getData()} />;
        }
    }

    renderRow(id, name) {
        let cwsCells = [];
        for (let i = 0; i < this.values[id].length; i++) {
            cwsCells.push(<td className="per-input-container text-center" key={id + i}>
                { this.values[id][i] }
            </td>);
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

        rows.push(this.renderRow("a11", "Усереднені оцінки"));
        rows.push(this.renderRow("a12", "Оцінки з урахуванням вагомості експертів"));
        
        return <tbody>
            {rows}
        </tbody>;
    }

    render() { 
        let square = this.calcSquare();
        return <>
        <div className="text-center">
            <span style={{fontSize: "1.2em"}}>Діаграма показників</span>
            <select className="ms-2"
                style={{fontSize: "1.1em"}}
                onChange={(e)=>{
                    this.setState({chartType: +e.target.value});
                }}>
                <option value="0">експертів у галузі</option>
                <option value="1">експертів з usability</option>
                <option value="2">експертів з програмування</option>
                <option value="3">потенційних користувачів</option>
                <option value="4">експертів (узагальнені)</option>
                <option value="5">експертів (зведені)</option>
            </select>
        </div>
        { square !== -1 ?
            <div className="text-center mt-3 mb-0">
                <span style={{fontSize: "1.2em"}}>Площа: {this.calcSquare()} умовних одиниць</span>
            </div>
            : <></>
        }
        <div className="row d-flex justify-content-center mt-3">
            {this.renderChart()}
        </div>
        <div className="row">
            <table id="conversation" className="table table-striped mt-2">
                <thead className="text-center border">
                    <tr>
                        <th rowSpan={2}>Критерій</th>
                        <th colSpan={3}>Поеказники експертів</th>
                        <th rowSpan={2}>Потенційні клієнти</th>
                        <th rowSpan={2}>Узагальнені показники</th>
                        <th rowSpan={2}>Узагальнені оцінки</th>
                    </tr>
                    <tr>
                        <th>у галузі</th>
                        <th>з usability</th>
                        <th>з програмування</th>
                    </tr>
                </thead>
                    {this.renderTable()}
            </table>
        </div>
    </>;
    }
}
 
export default Charts;