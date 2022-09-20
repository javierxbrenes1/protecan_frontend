import React, { FC } from "react"
import { View, StyleSheet } from "react-native"
import { CdrEntry } from "../../types"
import { Headline, Subheading } from 'react-native-paper';
import StateBadge from "../../components/StateBadge";
import { CDR_STATUS } from "../../constants&Types";
import { buildWordDate } from "../../utils/dataMassagers";
import { DraftMenu, CdrMenu } from "../../components/menus";

const CheckItem: FC<{ 
    item: CdrEntry, 
    onDeleteItem?: (item: CdrEntry) => void, 
    downloadPdf: (item: CdrEntry) => void,
    createCopy: (item: CdrEntry) => Promise<CdrEntry>
    }> = ({ item, onDeleteItem, downloadPdf, createCopy }) => {

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.title}>
                    <Headline>CDR #{item.composedId}</Headline>
                    <View style={styles.title}>
                        <StateBadge state={item.status as CDR_STATUS} size={30} />
                        {item.status === CDR_STATUS.draft && 
                        <DraftMenu 
                        item={item} 
                        onDeletePress={onDeleteItem} 
                        />}
                        {item.status !== CDR_STATUS.draft && 
                        <CdrMenu 
                        item={item} 
                        downloadPdf={downloadPdf} 
                        createCopy={createCopy} />}

                    </View>
                </View>
                <View style={styles.client}>
                    <Subheading style={{ marginRight: 10 }}>
                        Cliente {item.client.name}
                    </Subheading>
                </View>
                <View>
                    {item.createDate && <Subheading>Creado el {buildWordDate(new Date(item.createDate))}</Subheading>}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f6f6f6',
        borderRadius: 10,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 5
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    client: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    activeClientBadge: {
        backgroundColor: '#599169'
    },
    inactiveClientBadge: {
        backgroundColor: '#e0d236'
    }
});

export default CheckItem;
