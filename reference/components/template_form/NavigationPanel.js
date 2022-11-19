import React from 'react';
import "../../styles/NavigationPanelStyle.css"
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-regular-svg-icons"

function NavigationPanel(props) {
    return (
        <nav id="main-nav" className="d-flex flex-column h-100">
            <div id="nav-header">
                <Link id="home-ref" className="mx-3 w-100" to="/">CGLab</Link>
            </div>
            <div id="pages-nav" className="mt-2 w-100">
                <PageReference name="Fractals" href="/fractals"/>
                <SubPageReference name="Pythagoras tree" href="/fractals/pythagoras_tree"/>
                <SubPageReference name="Minkowski island" href="/fractals/minkowski_island"/>
                <PageReference name="Color schemes" href="/colors"/>
                <PageReference name="Transformations" href="/transformations"/>
            </div>
            <div id="help" className="sub-text mt-auto mb-3">
                <FontAwesomeIcon icon={Icons.faCircleQuestion}/>
                <span style={{paddingLeft: "5px", fontSize: "34px"}}>Help</span>
            </div>
        </nav>
    );
}

function PageReference(props) {
    return (
        <NavLink 
            end
            className=
                {({ isActive }) => 
                    (isActive ? "active-page-ref page-ref w-100" : "page-ref w-100")} 
            to={props.href}>
            <div className="page-ref-container w-100">
                {props.name}
            </div>
        </NavLink>
    );
}

function SubPageReference(props) {
    return (
        <NavLink 
            className=
                {({ isActive }) => 
                    (isActive ? "active-page-ref sub-page-ref w-100" : "sub-page-ref w-100")} 
            to={props.href}>
            <div className="w-100">
                <div className="sub-page-ref-container w-100">
                    {props.name}
                </div>
            </div>
        </NavLink>
    );
}

export default NavigationPanel;