import { memo } from "react";
import { Link } from "react-router-dom";

const UserMenu = props => {
    return <nav className="m-0">
        <ul className="list-unstyled">
            <li><Link to="/" ><h1>Home</h1></Link></li>
        </ul>
    </nav>
}

export default memo(UserMenu);