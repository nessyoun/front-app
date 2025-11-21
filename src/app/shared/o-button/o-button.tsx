import { Button } from 'primereact/button';
import React from 'react';



const OButton: React.FC<OButtonProps> = ({
    label,
    icon,
    onClick,
    size = 'medium',
    iconPos="right",
    disabled = false,
    outlined = false,
    rounded = false
}) => {

    return (
        <Button label={label} icon={icon} severity="success" onClick={onClick} iconPos={iconPos} disabled={disabled} outlined={outlined} rounded={rounded} />

    );
};

export default OButton;