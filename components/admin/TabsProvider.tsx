'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, createContext, useContext, useEffect, useState, isValidElement, ReactElement } from 'react';

interface TabContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
    wobbly: boolean;
    hover: boolean;
    defaultValue: string;
    prevIndex: number;
    setPrevIndex: (value: number) => void;
    tabsOrder: string[];
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTabs = () => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error('useTabs must be used within a TabsProvider');
    }
    return context;
};

// Define the expected props for TabsContent to type the children
interface TabsContentProps {
    value: string;
    children?: ReactNode;
    className?: string;
    yValue?: boolean;
}

interface TabsProviderProps {
    children: ReactNode;
    defaultValue: string;
    wobbly?: boolean;
    hover?: boolean;
}

export const TabsProvider = ({ children, defaultValue, wobbly = true, hover = false }: TabsProviderProps) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    const [prevIndex, setPrevIndex] = useState(0);
    const [tabsOrder, setTabsOrder] = useState<string[]>([]);

    useEffect(() => {
        const order: string[] = [];
        // Convert children to an array and assert the type
        const childrenArray = React.Children.toArray(children) as ReactElement<TabsContentProps>[];
        childrenArray.forEach((child) => {
            if (isValidElement(child) && child.type === TabsContent) {
                order.push(child.props.value); // Now TypeScript knows child.props has a `value` property
            }
        });
        setTabsOrder(order);
    }, [children]);

    return (
        <TabContext.Provider
            value={{
                activeTab,
                setActiveTab,
                wobbly,
                hover,
                defaultValue,
                setPrevIndex,
                prevIndex,
                tabsOrder,
            }}
        >
            {children}
        </TabContext.Provider>
    );
};

// Rest of the code (TabsBtn and TabsContent) remains unchanged
export const TabsBtn = ({ children, className, value }: any) => {
    const { activeTab, setPrevIndex, setActiveTab, defaultValue, hover, wobbly, tabsOrder } = useTabs();

    const handleClick = () => {
        setPrevIndex(tabsOrder.indexOf(activeTab));
        setActiveTab(value);
    };

    return (
        <motion.div
            className={cn(`cursor-pointer sm:p-2 p-1 sm:px-4 px-2 rounded-md relative `, className)}
            onFocus={() => {
                hover && handleClick();
            }}
            onMouseEnter={() => {
                hover && handleClick();
            }}
            onClick={handleClick}
        >
            {children}

            {activeTab === value && (
                <AnimatePresence mode="wait">
                    <motion.div
                        transition={{
                            layout: {
                                duration: 0.2,
                                ease: 'easeInOut',
                                delay: 0.2,
                            },
                        }}
                        layoutId={defaultValue}
                        className="absolute w-full h-full left-0 top-0 dark:bg-primary-base bg-gradient-light rounded-md z-[1]"
                    />
                </AnimatePresence>
            )}

            {wobbly ? (
                <>
                    {activeTab === value && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                transition={{
                                    layout: {
                                        duration: 0.4,
                                        ease: 'easeInOut',
                                        delay: 0.04,
                                    },
                                }}
                                layoutId={defaultValue}
                                className="absolute w-full h-full left-0 top-0 dark:bg-primary-base bg-gradient-light rounded-md z-[1] tab-shadow"
                            />
                        </AnimatePresence>
                    )}
                    {activeTab === value && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                transition={{
                                    layout: {
                                        duration: 0.4,
                                        ease: 'easeOut',
                                        delay: 0.2,
                                    },
                                }}
                                layoutId={`${defaultValue}b`}
                                className="absolute w-full h-full left-0 top-0 dark:bg-primary-base bg-gradient-light rounded-md z-[1] tab-shadow"
                            />
                        </AnimatePresence>
                    )}
                </>
            ) : null}
        </motion.div>
    );
};

export const TabsContent = ({ children, className, value, yValue }: any) => {
    const { activeTab, tabsOrder, prevIndex } = useTabs();
    const isForward = tabsOrder.indexOf(activeTab) > prevIndex;

    return (
        <AnimatePresence mode="popLayout">
            {activeTab === value && (
                <motion.div
                    initial={{ opacity: 0, y: yValue ? (isForward ? 10 : -10) : 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: yValue ? (isForward ? -50 : 50) : 0 }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                    className={cn('rounded-md relative', className)}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
