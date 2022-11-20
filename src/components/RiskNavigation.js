import { NavLink } from "react-router-dom";

function RiskNavigation(props) {
    return <div className="text-center d-flex flex-column justify-content-center mb-3">
        <h2>ReqMan</h2>
        <nav className="d-flex flex-row justify-content-around">
            <PageReference name="Ідентифікація ризиків" href="/"/>
            <PageReference name="Аналіз ризиків" href="/analysis"/>
            <PageReference name="Планування ризиків" href="/planning"/>
            <PageReference name="Моніторинг ризиків" href="/monitoring"/>
        </nav>
        <hr/>
    </div>;
}

function PageReference(props) {
    return (
        <NavLink 
            end
            className=
                {({ isActive }) => 
                    (isActive ? "active-page-ref page-ref w-100 p-3" : "page-ref w-100 p-3")} 
            to={props.href}>
            <div className="page-ref-container w-100">
                {props.name}
            </div>
        </NavLink>
    );
}
 
export default RiskNavigation;