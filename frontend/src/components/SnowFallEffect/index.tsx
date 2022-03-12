import React from "react";
import "./snowfall.scss";

const SnowfallEffect: React.FC = () => {

    return (
        <div className="winter-is-coming">

            <div className="snow snow--near"></div>
            <div className="snow snow--near snow--alt"></div>

            <div className="snow snow--mid"></div>
            <div className="snow snow--mid snow--alt"></div>

            <div className="snow snow--far"></div>
            <div className="snow snow--far snow--alt"></div>
        </div>
    );
};

export default SnowfallEffect;
