import React, { Component } from 'react';
import "../styles/HomePageStyle.css"
import { Link } from "react-router-dom";

class HomePage extends Component {
    render() {
        return (
            <>
                <Greeting/>
                <HomePageContent/>
            </>
        );
    }
}

function Greeting(props) {
    return (
        <div className="mt-3" id="greeting">
            <h1 style={{fontSize: "64px"}}>
                <strong>NICE TO MEET YOU!</strong>
            </h1>
            <h4 className="main-highlight"
                style={{fontSize: "40px"}}>
                How can I help you?
            </h4>
            <hr className="header-divider-short mt-1"/>
        </div>
    );
}

function HomePageContent(props) {
    return (
        <div className="container-xl mt-3" id="main-content">
            <p className="text-content text-center w-100">
                Here in&nbsp;
                <span className="sec-highlight">CGLab</span> you can dive into&nbsp;
                <span className="sec-highlight">computer graphics</span> world and examine several concepts for yourself in a convenient&nbsp;
                <span className="sec-highlight">interactive format</span>.
            </p>
            <div className="mt-2 d-flex flex-row justify-content-around">
                <RefsContainer 
                    mainRef={{name: "Fractals", href: "/fractals"}} 
                    description="Construct your own beautiful self-repeating shapes."
                    secLinks={[
                        {name: "Pythagoras tree", href: "/fractals/pythagoras_tree"},
                        {name: "Minkowski island", href: "/fractals/minkowski_island"}
                    ]}
                />
                <RefsContainer 
                    mainRef={{name: "Color schemes", href: "/colors"}} 
                    description="Play around with image colors and brightness."
                    secLinks={[
                        {name: "Go ahead!", href: "/colors"}
                    ]}
                />
                <RefsContainer 
                    mainRef={{name: "Transformations", href: "/transformations"}} 
                    description="Explore motion of the right triangle rotating and moving it around."
                    secLinks={[
                        {name: "Let me try it!", href: "/transformations"}
                    ]}
                />
            </div>
            <div className="mt-3 d-flex flex-column">
                <span className="text-content text-center mt-3"><span className="sec-highlight">New to CGLab?</span> Begin with a short tutorial.</span>
                <Link className="sec-ref sub-text text-center" to="/tutorial">Sure, take me there!</Link>
            </div>
        </div>
    );
}

function RefsContainer(props) {
    return (
        <article className="refs-container p-2 d-flex flex-column align-items-center">
            <Link className="main-ref text-content text-center w-100" to={props.mainRef.href}>
                {props.mainRef.name}
            </Link>
            <p className="ref-desc sub-text text-center mt-2">
                {props.description}
            </p>
            <div className="sec-refs sub-text d-flex flex-column align-items-center w-100 mt-auto mb-3">
                {props.secLinks.map(
                    function(lnk, i){
                        return (
                            <Link className="sec-ref text-center w-100" to={lnk.href} key={props.mainRef.name + "-sec-link-" + i}>
                                {lnk.name}
                            </Link>
                        );
                    }
                )}
            </div>
        </article>
    );
}

export default HomePage;