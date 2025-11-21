interface OButtonProps {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    size?: 'large' | 'medium' | 'small';
    iconPos?: 'left' | 'right';
    disabled?: boolean;
    outlined?: boolean;
    rounded?: boolean;
    
}