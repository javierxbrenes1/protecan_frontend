import React, { FC } from "react";
import { Badge } from "react-native-paper";
import { CDR_STATUS } from "../constants&Types";
import theme from "../theme";

const attrs = {
    [CDR_STATUS.draft]: { label: 'Borrador', color: '#e62e2e' },
    [CDR_STATUS.pending]: { label: 'Pendiente', color: '#f07d11' },
    [CDR_STATUS.complete]: { label: 'Completo', color: theme.colors.sucess }
}

const StateBadge: FC<{ state: CDR_STATUS, size?: number }> = ({ state, size }) => {
    const { label, color } = attrs[state];
    return (
        <Badge
            style={{ alignSelf: 'center', marginLeft: 10, backgroundColor: color, color: theme.colors.white }}
            size={size || 34}>
            {label}
        </Badge>
    );
}

export default StateBadge;