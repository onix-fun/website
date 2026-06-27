import type { Component } from "vue";

export interface HeaderItem {
    id: string;
    title: string;
    to: string;
    icon: string | Component;
    disabled?: boolean;
}

export interface HeaderProps {
    logo: string;
    items: HeaderItem[];
    collapseOffset?: number;
}
