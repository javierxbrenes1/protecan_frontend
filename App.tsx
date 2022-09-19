import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './src/theme';
import { ApolloProvider } from '@apollo/react-hooks';
import { GlobalProvider } from './src/globalContext';
import Main from './src/Main';
import apolloClient from './src/apolloClient';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorBoundaryHandler from './src/components/ErrorBoundaryHandler';
import logger from './src/utils/logger';

export default function App() {

  useEffect(() => {
    logger.init();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <GlobalProvider>
        <PaperProvider theme={theme}>
          <ErrorBoundary FallbackComponent={ErrorBoundaryHandler}>
            <Main />
          </ErrorBoundary>
          <StatusBar animated backgroundColor={theme.colors.primary} />
        </PaperProvider>
      </GlobalProvider>
    </ApolloProvider>
  );
}


