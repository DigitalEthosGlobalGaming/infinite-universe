'use client';
import { Button as OriginalButton } from '@fluentui/react-components';
import React from 'react';

type ButtonProps = Parameters<typeof OriginalButton>[0];

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <OriginalButton {...props} />
    );
};

export default Button;