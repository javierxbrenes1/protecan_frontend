import React, { Children, FC, ReactChildren, ReactNode, useState } from 'react';
import { IconButton, Menu } from 'react-native-paper';

const MenuLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const [showMenu, setShowMenu] = useState(false);

    const hideMenu = () => setShowMenu(false);

    const childrenWithProps = React.isValidElement(children)
        ? React.cloneElement(children, { hideMenu }) : children;

    return (
        <Menu
            visible={showMenu}
            onDismiss={hideMenu}
            anchor={
                <IconButton
                    style={{ marginLeft: 5 }}
                    icon="dots-vertical"
                    onPress={() => setShowMenu(true)}
                />
            }
        >
            {childrenWithProps}
        </Menu>
    );
}

export default MenuLayout;