import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Screen from '../../components/Screen';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import SearchBox from './SearchBox';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import theme from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { CheckControlFormMode } from '../../constants&Types';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_CDRS } from '../../queries';
import { useGlobal } from '../../globalContext';
import { GetCdrsResponse } from '../../graphqlTypes/responses';
import { CdrEntry, Pagination } from '../../types';
import { parseCdrs } from '../../utils/dataMassagers';
import { logGraphqlErrors } from '../../utils/errorHandler';
import CheckItem from './CheckItem';
import DialogMessage from '../../components/DialogMessage';
import { buildFiltersForGetCdrs, DELETE_CDR } from '../../mutations/checkControlMutations';
import { isEmpty } from 'lodash';
import { downloadPdf } from './downloadFileHandler';

const buildVaribles = (page: number, client: string, status: string, userId?: string,) => {
    return {
        page,
        pageSize: 10,
        filters: buildFiltersForGetCdrs(userId, client, status)
    }
};

const CheckControlScreen = () => {
    const navigation = useNavigation();
    const { userDetails, setShowLoading } = useGlobal();
    const [catalog, setCatalog] = useState<CdrEntry[]>([]);
    const [searchAttrs, setSearchAttrs] = useState({
        client: '',
        status: ''
    });
    const [pagination, setPagination] = useState<Pagination | undefined>(undefined);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<CdrEntry | undefined>(undefined);

    const [deleteCdr, { loading: deleteLoading }] = useMutation(DELETE_CDR);

    const [getCdrs, { loading, fetchMore }] = useLazyQuery<GetCdrsResponse>(GET_CDRS, {
        notifyOnNetworkStatusChange: true,
        onCompleted(data) {
            const parsedData = parseCdrs(data);
            setCatalog(parsedData.parsedData);
            setPagination(parsedData.pagination);
        },
        onError(err) {
            logGraphqlErrors(err);
        }
    });

    useEffect(() => {
        setShowLoading(loading || deleteLoading);
    }, [loading, deleteLoading]);

    const handleOnSearch = (client: string, status: string) => {
        setCatalog([]);
        setSearchAttrs({
            client, status
        });
        getCdrs({
            variables: buildVaribles(1, client, status, userDetails?.id)
        });
    }

    const handleNavigationToForm = (mode: CheckControlFormMode) => {
        return () => {
            // @ts-ignore
            navigation.navigate('CheckControlForm', { mode });
        }
    }

    const handleDeleteItem = useCallback((item: CdrEntry) => {
        setShowDeleteDialog(true);
        setItemToDelete(item);
    }, []);



    const handleDeleteDialogConfirmation = () => {
        setShowDeleteDialog(false);
        deleteCdr({
            variables: {
                id: itemToDelete?.id
            },
            update(cache) {
                const normalizedId = cache.identify({ id: itemToDelete?.id, __typename: 'CdrEntity' });
                cache.evict({ id: normalizedId });
                cache.gc();
            }
        })
    };

    const handleLoadMorePress = () => {
        fetchMore({
            variables: {
                page: pagination?.page ? pagination.page + 1 : 1
            }
        });
    };

    const handleDownloadPdf = async (item: CdrEntry) => {
        downloadPdf(item);
    }

    const LoadMore = useMemo(() => {
        if (!pagination || pagination.page >= pagination.pageCount) return null;
        const { page, pageSize, total } = pagination;
        const leftItems = total - (page * pageSize);
        return (
            <View>
                <Button onPress={handleLoadMorePress}>Cargar Mas ({leftItems})</Button>
            </View>
        )
    }, [handleLoadMorePress, pagination]);

    return (
        <>
            <Screen style={{ margin: 20, flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <SearchBox onSearch={handleOnSearch} />
                    <Divider />
                    {isEmpty(catalog) && !loading && (
                        <View>
                            <Text style={styles.noData}>{Object.values(searchAttrs).filter(Boolean).length === 0 ? 'Inicia una búsqueda' : 'No hay Datos'}</Text>
                        </View>
                    )}
                </View>

                {!isEmpty(catalog) &&
                    <FlatList
                        data={catalog}
                        initialNumToRender={5}
                        keyExtractor={(item, index) => { return `${item.id}-${index}` }}
                        renderItem={(props) => <CheckItem {...props} onDeleteItem={handleDeleteItem} downloadPdf={handleDownloadPdf} />}
                        ListFooterComponent={LoadMore}
                    />
                }
                <View>
                    <TouchableOpacity onPress={handleNavigationToForm(CheckControlFormMode.add)}>
                        <View style={styles.addCDR}>
                            <FontAwesomeIcon icon={faPlus} size={20} color={theme.colors.white} />
                        </View>
                    </TouchableOpacity>
                </View>

            </Screen>
            <DialogMessage
                mode="confirmation"
                title={itemToDelete ? `Eliminar CDR #${itemToDelete.id}` : ''}
                message={itemToDelete ? `¿Seguro que desea eliminar el CDR #${itemToDelete.id} creado para ${itemToDelete.client.name}?` : ''}
                show={showDeleteDialog}
                onHide={() => { setShowDeleteDialog(false) }}
                onConfirm={handleDeleteDialogConfirmation}
                confirmText="Eliminar"
                cancelText='Cancelar'
            />
        </>
    );
}

const styles = StyleSheet.create({
    addCDR: {
        width: 40,
        height: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        alignSelf: 'flex-end'
    },
    noData: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 20,
    }
});

export default CheckControlScreen;