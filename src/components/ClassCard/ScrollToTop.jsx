import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({limit, page}) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname, limit, page]);

    return null;
};

export default ScrollToTop;
