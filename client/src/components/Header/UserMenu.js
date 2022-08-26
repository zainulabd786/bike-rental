import { memo } from "react";
import { Link } from "react-router-dom";

const UserMenu = props => {
    return <nav className="m-0">
        <ul className="list-unstyled">
            <li><Link to="/" >Book now</Link></li>
        </ul>
    </nav>
}

export default memo(UserMenu);