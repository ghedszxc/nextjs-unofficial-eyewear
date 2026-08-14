"use client"

import React, { useEffect } from 'react';
import Script from 'next/script';
import { ILocatorConfig } from '../models/widgets/IStoreLocator';

declare global {
    interface Window {
        locator?: {
            LocatorWidget: new (config: any) => {
                init: () => void;
            };
        };
    }
}

interface Props {
    data: {
        locatorConfig: ILocatorConfig
    }
}


const StoreLocator: React.FC<Props> = ({}) => {
    const initializeLocator = () => {
        if (typeof window === 'undefined') return;

        if (window.locator && window.locator.LocatorWidget) {

            const config: ILocatorConfig = {
                selector: "#locator-container",
                tenantKey: "essilor_uk2",
                locale: "en-gb",
                skipRedirect: true,
            };

            try {
                const locatorApp = new window.locator.LocatorWidget(config);
                locatorApp.init();
            } catch (error) {
                console.error("Failed to initialize LocatorWidget:", error);
            }
        } else {
            console.log('Locator script not yet available.');
        }
    };

    useEffect(() => {
        initializeLocator();
    }, []);

    return (
        <>
            <Script
                src="https://prod.locator-essilorlux.com/index.umd.js"
                strategy="lazyOnload"
                onLoad={() => {
                    initializeLocator();
                }}
            />

            <div id="locator-container"></div>
        </>
    );
};

export default StoreLocator;