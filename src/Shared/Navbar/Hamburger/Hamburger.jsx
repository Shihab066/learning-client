import './hamburger.css'
const Hamburger = ({isHamburgerOpen}) => {
    return (
        <div id="hamburger" className={`${isHamburgerOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export default Hamburger;