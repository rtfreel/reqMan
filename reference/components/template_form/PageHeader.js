import React from 'react';
import "../../styles/PageHeaderStyle.css"

function PageHeader(props) {
    return (
        <div className="d-flex flex-column align-items-center">
            <h1 className="page-header-name text-center mt-2">{props.name}</h1>
            <hr className="header-divider mt-0"/>
        </div>
    );
}

export default PageHeader;