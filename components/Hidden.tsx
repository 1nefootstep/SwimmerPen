import React, {ReactElement} from 'react';

interface HiddenProps {
    children: ReactElement | null;
    isHidden: boolean;
}

export default function Hidden({children, isHidden}: HiddenProps) {
    if (isHidden) {
        return null;
    }
    return children;
}