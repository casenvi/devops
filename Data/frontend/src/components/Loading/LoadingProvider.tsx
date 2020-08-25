import * as React from 'react';
import LoadingContext from './LoadingContent';
import { useState, useMemo, useEffect } from 'react';
import { addGlobalRequestInterceptor, addGlobalResponseInterceptor, removeGlobalRequestInterceptor, removeGlobalResponseInterceptor } from '../../util/http';
import { omit } from 'lodash';

export const LoadingProvider = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [countRequest, setCountRequest] = useState(0);

    useMemo(() => {
        let isSubscribed = true;
        const requestIds = addGlobalRequestInterceptor((config) => {
            if (isSubscribed && !config.headers.hasOwnProperty('ignoreLoading')){
                setLoading(true);
                setCountRequest((prevCountRequest) => prevCountRequest + 1);
            }
            config.headers = omit(config.headers, 'ignoreLoading');
            return config;
        });
        const responseIds = addGlobalResponseInterceptor((config) => {
            if (isSubscribed){
                decrementCountRequest();
            }
            return config;
        }, (error) => {
            if (isSubscribed){                
                decrementCountRequest();
            }            
            return Promise.reject(error);
        });
        return () => {
            isSubscribed = false;
            removeGlobalRequestInterceptor(requestIds);
            removeGlobalResponseInterceptor(responseIds);
        }
    }, [true]);
    useEffect(() => {
        if(!countRequest) {
            setLoading(false);
        }
    }, [countRequest])
    function decrementCountRequest(){
        setCountRequest((prevCountRequest) => prevCountRequest - 1);
    }
    return (
        <LoadingContext.Provider value={loading}>
            {props.children}
        </LoadingContext.Provider>)
}