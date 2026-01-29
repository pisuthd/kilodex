"use client"

import { useMemo } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {
    DecryptPermission,
    WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
 
export default function Providers({ children }: { children: React.ReactNode }) {

    const wallets = useMemo(
        () => [
            new LeoWalletAdapter({
                appName: "KiloDEX",
            }),
        ],
        []
    );

    return (
        <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.TestnetBeta}
            autoConnect
        >
            <WalletModalProvider>
                <AppProvider>
                    {children}
                </AppProvider>
            </WalletModalProvider>
        </WalletProvider>

    );
}
