import { Helmet } from "react-helmet-async";


const Title = ({title}) => {
    return (
        <Helmet>
            <title>
                {title} | Learning Point
            </title>
        </Helmet>
    );
};

export default Title;