import { ApolloError } from '@apollo/react-hooks';
import logger from './logger';

export const logGraphqlErrors = (error: ApolloError) => {
    const errors: string[] = [];
    if (error.graphQLErrors) {
        error.graphQLErrors.forEach((gpError) => {
            errors.push(`[graphQLErrors]: ${gpError.message}`);
        })
    }

    if (error.clientErrors) {
        error.clientErrors.forEach((clientError) => {
            errors.push(`[graphQLErrors]: ${clientError.message}`);
        })
    }

    if (error.networkError) {
        const { statusCode, result } = error.networkError as any;
        if (result && result.errors && Array.isArray(result.errors)) {

            result.errors.forEach((err: any) => {
                errors.push(`[networkError]: ${err.message} - status code: ${statusCode}`);
            });
        }
    }
    logger.logError(error);
    console.log(errors.join(' | '));
    return errors;
}