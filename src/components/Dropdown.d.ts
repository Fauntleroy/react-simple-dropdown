declare module 'react-simple-dropdown' {
    ﻿import * as React from 'react';

    module 'react-simple-dropdown' {

        interface IDropdownTriggerProps {
            children?: React.ReactNode,
            className?: string,
        }

        export class DropdownTrigger extends React.Component<IDropdownTriggerProps, void> {
        }

        interface IDropdownContentProps {
            children?: React.ReactNode,
            className?: string,
        }

        export class DropdownContent extends React.Component<IDropdownContentProps, void> {
        }

        interface IDropdownProps {
            active?: boolean,
            children?: React.ReactNode,
            className?: string,
            style?: any,
            onHide?: () => void,
            onShow?: () => void,
        }

        export default  class Dropdown extends React.Component<IDropdownProps, void> {
            public hide(): void;
            public show(): void;
        }
    }
}
