import { useCallback, useEffect, useRef } from "react";
import { Container, Logo, NavPanel, Position, Spacer, Stack } from "@/common";
import type { Item, NavPanelSizes, NavPanelStyleValues } from "@/common";
import { navItems } from "../model/nav-items";
import { useHeaderModel } from "../model/useHeaderModel";
import { useHeaderController } from "../controller/useHeaderController";
import { ThemeToggle } from "./ThemeToggle";
import headerStyles from "../styles/header.module.scss";

export interface AppHeaderProps {
    /** Defaults to the shared nav config from `nav-items`. */
    items?: readonly Item[];
    /** Scroll offset (px) after which the capsule collapses. */
    collapseOffset?: number;
    onCollapseChange?: (collapsed: boolean) => void;
    onMenuChange?: (open: boolean) => void;
    className?: string;
}

/** Non-dimensional styles, resolved as `var()` refs from the header scope. */
const NAV_STYLE_VALUES: NavPanelStyleValues = {
    radiusPill: "var(--radius-pill)",
    radiusPanelStacked: "var(--radius-panel-stacked)",
    blur: "var(--blur-panel)",
    shadowPanel: "var(--shadow-panel)",
    shadowItemHover: "var(--shadow-item-hover)",
    shadowItemActive: "var(--shadow-item-active)",
    surfaceItemHover: "var(--nav-surface-hover)",
    surfaceItemActive: "var(--nav-surface-active)",
    focusColor: "var(--nav-focus)",
    easing: "var(--ease-out)",
    durationCapsule: "var(--duration-capsule)",
    durationBurger: "var(--duration-burger)",
};

/**
 * Header view — a fixed, full-width overlay holding the brand link and the nav
 * capsule. All state comes from the model, all mechanics from the controller;
 * this component only lays things out and feeds breakpoint metrics downward.
 */
export function AppHeader({
    items = navItems,
    collapseOffset = 50,
    onCollapseChange,
    onMenuChange,
    className,
}: AppHeaderProps) {
    const model = useHeaderModel({ items, collapseOffset, onMenuChange });
    const { closeMenu, hasScrolled, isMobile, menuOpen, metrics } = model;
    const navigationRef = useRef<HTMLElement | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const { capsuleRef, capsuleWidth, handleCapsuleTransitionEnd } = useHeaderController({
        isCollapsed: model.isCollapsed,
        menuOpen: model.menuOpen,
        isMobile: model.isMobile,
        capsuleCollapsedWidth: model.metrics.capsuleCollapsedWidth,
        onCloseMenu: model.closeMenu,
        onEscape: () => menuButtonRef.current?.focus(),
        onCollapseChange,
    });

    const handleNavigate = useCallback(() => {
        closeMenu();
        if (isMobile) requestAnimationFrame(() => menuButtonRef.current?.focus());
    }, [closeMenu, isMobile]);

    useEffect(() => {
        if (!menuOpen) return;

        const handleOutsidePointerDown = (event: PointerEvent) => {
            if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener("pointerdown", handleOutsidePointerDown);
        return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
    }, [closeMenu, menuOpen]);

    const sizes: NavPanelSizes = {
        itemSize: metrics.itemSize,
        itemLabelMax: metrics.itemLabelMax,
        iconSize: metrics.iconSize,
        burgerSize: metrics.burgerSize,
        burgerBarWidth: metrics.burgerBarWidth,
        capsulePadding: metrics.capsulePadding,
        capsuleGap: metrics.capsuleGap,
        gutter: metrics.headerInline,
    };
    const allowNavHover = !model.isCollapsed && capsuleWidth === null;

    return (
        <header className={headerStyles.header}>
            <Position
                position="fixed"
                top="var(--header-top)"
                insetX
                zIndex={1000}
                style={{ pointerEvents: "none" }}
                className={className}
            >
                <Container maxWidth={metrics.headerMaxWidth} paddingInline={metrics.headerInline}>
                    <Stack
                        direction="row-reverse"
                        align="center"
                        justify="between"
                        style={{ minHeight: metrics.headerHeight, position: "relative" }}
                    >
                        <div className={headerStyles.navigationControls}>
                            <NavPanel
                                ref={capsuleRef}
                                containerRef={navigationRef}
                                menuButtonRef={menuButtonRef}
                                navigationId="primary-navigation"
                                items={model.items}
                                activeId={model.activeId}
                                collapsed={model.isCollapsed}
                                open={model.menuOpen}
                                stacked={model.stacked}
                                clipContent={model.isCollapsed || capsuleWidth !== null}
                                width={capsuleWidth ?? undefined}
                                hoveredId={allowNavHover ? model.hoveredId : null}
                                sizes={sizes}
                                styles={NAV_STYLE_VALUES}
                                collapsedWidth={metrics.capsuleCollapsedWidth}
                                skipLink={{ targetId: "main-content" }}
                                onToggle={model.toggleMenu}
                                onHoverChange={allowNavHover ? model.setHoveredId : undefined}
                                onNavigate={handleNavigate}
                                onTransitionEnd={handleCapsuleTransitionEnd}
                            />
                            <ThemeToggle visible={!hasScrolled} />
                        </div>

                        <Logo
                            hidden={model.logoHidden}
                            sizes={{ height: metrics.logoHeight }}
                        />
                    </Stack>
                </Container>
            </Position>

            {model.needsSpacer ? <Spacer size="var(--header-spacer)" axis="y" /> : null}
        </header>
    );
}
