import { Hexagon } from "lucide-react";
import { Container, Logo, NavPanel, Position, Spacer, Stack } from "@/common";
import type { Item, NavPanelSizes, NavPanelStyleValues } from "@/common";
import { navItems } from "../model/nav-items";
import { useHeaderModel } from "../model/useHeaderModel";
import { useHeaderController } from "../controller/useHeaderController";
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
    const { capsuleRef, capsuleWidth, handleCapsuleTransitionEnd } = useHeaderController({
        isCollapsed: model.isCollapsed,
        menuOpen: model.menuOpen,
        isMobile: model.isMobile,
        capsuleCollapsedWidth: model.metrics.capsuleCollapsedWidth,
        onCloseMenu: model.closeMenu,
        onCollapseChange,
    });

    const { metrics } = model;

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
                        <NavPanel
                            ref={capsuleRef}
                            items={model.items}
                            activeId={model.activeId}
                            collapsed={model.isCollapsed}
                            open={model.menuOpen}
                            stacked={model.stacked}
                            width={capsuleWidth ?? undefined}
                            hoveredId={model.hoveredId}
                            sizes={sizes}
                            styles={NAV_STYLE_VALUES}
                            collapsedWidth={metrics.capsuleCollapsedWidth}
                            skipLink={{ targetId: "main-content" }}
                            onToggle={model.toggleMenu}
                            onHoverChange={model.setHoveredId}
                            onNavigate={model.closeMenu}
                            onTransitionEnd={handleCapsuleTransitionEnd}
                        />

                        <Logo
                            icon={Hexagon}
                            hidden={model.logoHidden}
                            sizes={{
                                width: metrics.logoWidth,
                                height: metrics.logoHeight,
                                iconWidth: metrics.logoIconWidth,
                            }}
                        />
                    </Stack>
                </Container>
            </Position>

            {model.needsSpacer ? <Spacer size="var(--header-spacer)" axis="y" /> : null}
        </header>
    );
}
