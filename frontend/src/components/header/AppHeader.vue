<template>
  <header
      class="app-header"
      :class="{
            'is-collapsed': isCollapsed,
            'is-mobile': isMobile,
            'is-opened': menuOpen
        }"
  >
    <RouterLink
        class="app-header__logo"
        to="/"
        aria-label="Home"
    >
      <img
          :src="logo"
          alt="Logo"
      >
    </RouterLink>

    <div
        class="nav-capsule"
        ref="capsuleRef"
        :style="capsuleStyle"
        @transitionend="onTransitionEnd"
    >
      <button
          class="nav-capsule__burger"
          :aria-expanded="menuOpen"
          aria-label="Toggle menu"
          @click="toggleMenu"
      >
        <span />
        <span />
        <span />
      </button>

      <RouterLink
          v-for="item in items"
          :key="item.id"
          :to="item.to"
          class="nav-capsule__item"
          :class="{
                        active: activeId === item.id,
                        disabled: item.disabled
                    }"
          @mouseenter="hoveredId = item.id"
          @mouseleave="hoveredId = null"
          @click="closeMenu"
      >
        <span class="nav-capsule__item-icon">
          <component :is="item.icon" />
        </span>
        <span
            class="nav-capsule__item-label"
            :class="{ visible: hoveredId === item.id }"
        >
                      {{ item.title }}
                  </span>
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue";

import { useRoute } from "vue-router";

import type {
  HeaderItem
} from "./types";

interface Props {
  logo: string;
  items: HeaderItem[];
  collapseOffset?: number;
}

const props = withDefaults(
    defineProps<Props>(),
    {
      collapseOffset: 50
    }
);

const emit = defineEmits<{
  (e: "collapse", value: boolean): void;
  (e: "menu", value: boolean): void;
}>();

const route = useRoute();

const capsuleRef = ref<HTMLElement | null>(null);

const hoveredId = ref<string | null>(null);

const menuOpen = ref(false);

const isCollapsed = ref(false);

const isMobile = ref(false);

const fullWidth = ref(0);

const collapsedWidth = 72;

const capsuleWidth = ref<number | null>(null);

const capsuleStyle = computed(() => {
  if (capsuleWidth.value === null) return {};
  return { width: capsuleWidth.value + 'px' };
});

const activeId = computed(() => {

  const current = props.items.find(item => item.to === route.path);

  return current?.id ?? null;

});

let collapseWatcherInitialized = false;

watch([isCollapsed, menuOpen], ([collapsed, opened]) => {
  if (!collapseWatcherInitialized) return;
  const el = capsuleRef.value;
  if (!el || !fullWidth.value) return;

  if (collapsed && !opened) {
    capsuleWidth.value = el.offsetWidth;
    requestAnimationFrame(() => {
      capsuleWidth.value = collapsedWidth;
    });
  } else if (collapsed && opened) {
    capsuleWidth.value = collapsedWidth;
    requestAnimationFrame(() => {
      capsuleWidth.value = fullWidth.value;
    });
  } else if (!collapsed) {
    if (capsuleWidth.value !== null) {
      capsuleWidth.value = collapsedWidth;
      requestAnimationFrame(() => {
        capsuleWidth.value = fullWidth.value;
      });
    }
  }
});

function measure() {

  const el = capsuleRef.value;

  if (!el)
    return;

  el.style.width = "";

  fullWidth.value = el.offsetWidth;

}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'width') return;
  if (!isCollapsed.value || menuOpen.value) {
    capsuleWidth.value = null;
  }
}

function updateMobile() {

  isMobile.value = window.innerWidth <= 768;

  if (isMobile.value) {

    isCollapsed.value = true;

  }

}

function updateScroll() {

  if (isMobile.value)
    return;

  const collapsed = window.scrollY > props.collapseOffset;

  if (collapsed !== isCollapsed.value) {

    isCollapsed.value = collapsed;

    if (!collapsed)
      menuOpen.value = false;

    emit("collapse", collapsed);

  }

}

function toggleMenu() {

  menuOpen.value = !menuOpen.value;

  emit("menu", menuOpen.value);

}

function closeMenu() {

  menuOpen.value = false;

  emit("menu", false);

}

function onKeyDown(event: KeyboardEvent) {

  if (event.key === "Escape") {

    closeMenu();

  }

}

watch(
    () => route.fullPath,
    () => {

      closeMenu();

    }
);

onMounted(async () => {

  updateMobile();

  updateScroll();

  await nextTick();

  measure();

  collapseWatcherInitialized = true;

  if (isCollapsed.value && !menuOpen.value) {
    capsuleWidth.value = collapsedWidth;
  }

  window.addEventListener(
      "resize",
      updateMobile,
      {
        passive: true
      }
  );

  window.addEventListener(
      "scroll",
      updateScroll,
      {
        passive: true
      }
  );

  window.addEventListener(
      "keydown",
      onKeyDown
  );

});

onBeforeUnmount(() => {

  window.removeEventListener(
      "resize",
      updateMobile
  );

  window.removeEventListener(
      "scroll",
      updateScroll
  );

  window.removeEventListener(
      "keydown",
      onKeyDown
  );

});
</script>

<style scoped>

/* ===========================================================
   VARIABLES
=========================================================== */

.app-header {

  --header-height: 74px;

  --header-radius: 999px;

  --header-bg:
      rgba(255,255,255,.72);

  --header-border:
      rgba(255,255,255,.42);

  --header-shadow:
      0 18px 40px rgba(0,0,0,.08);

  --hover-bg:
      rgba(255,255,255,.82);

  --active-bg:
      rgba(255,255,255,.98);

  --transition:
      cubic-bezier(.22,1,.36,1);

  position: fixed;

  inset-inline: 0;

  top: 26px;

  z-index: 1000;

  pointer-events: none;

}


/* ===========================================================
   LOGO — position:absolute, never moves
=========================================================== */

.app-header__logo{

  position:absolute;

  left:40px;

  top:50%;

  transform:translateY(-50%);

  display:flex;

  align-items:center;

  justify-content:center;

  width:72px;

  height:72px;

  text-decoration:none;

  pointer-events:auto;

  transition:
      transform .45s var(--transition),
      opacity .35s;

}

/* Logo fades out on scroll (desktop only) */
.is-collapsed:not(.is-mobile) .app-header__logo{

  opacity:0;

  pointer-events:none;

}

.app-header__logo:hover{

  transform:translateY(-50%) scale(1.05);

}

.app-header__logo img{

  width:58px;

  height:58px;

  display:block;

}


/* ===========================================================
   NAV CAPSULE — position:absolute, right edge stays fixed
=========================================================== */

.nav-capsule{

  position:absolute;

  right:40px;

  top:50%;

  transform:translateY(-50%);

  display:flex;

  align-items:center;

  gap:8px;

  padding:8px;

  border-radius:999px;

  backdrop-filter:blur(24px);

  -webkit-backdrop-filter:blur(24px);

  background:var(--header-bg);

  border:1px solid var(--header-border);

  box-shadow:var(--header-shadow);

  pointer-events:auto;

  overflow:hidden;

  transition:
      width .45s var(--transition),
      padding .35s var(--transition),
      gap .35s var(--transition);

}


/* ===========================================================
   BURGER — inside capsule, hidden when expanded
=========================================================== */

.nav-capsule__burger{

  flex-shrink:0;

  width:0;

  height:0;

  padding:0;

  border:none;

  outline:none;

  cursor:pointer;

  display:flex;

  flex-direction:column;

  justify-content:center;

  align-items:center;

  gap:5px;

  border-radius:999px;

  opacity:0;

  transition:
      width .4s var(--transition),
      height .4s var(--transition),
      opacity .35s,
      padding .35s,
      transform .4s var(--transition);

}

/* Show burger only when collapsed */
.is-collapsed .nav-capsule__burger,
.is-opened .nav-capsule__burger{

  width:58px;

  height:58px;

  padding:0 16px;

  opacity:1;

}

.is-collapsed .nav-capsule__burger{

  background:var(--header-bg);

  backdrop-filter:blur(24px);

  border:1px solid var(--header-border);

  box-shadow:var(--header-shadow);

}

.is-opened .nav-capsule__burger{

  background:none;

  border:none;

  box-shadow:none;

}

.nav-capsule__burger:hover{

  transform:scale(1.05);

}

.nav-capsule__burger span{

  width:22px;

  height:2px;

  border-radius:99px;

  background:#111;

  transition:all .35s;

}


/* ===========================================================
   BURGER → X animation
=========================================================== */

.is-opened .nav-capsule__burger span:nth-child(1){

  transform:
      translateY(7px)
      rotate(45deg);

}

.is-opened .nav-capsule__burger span:nth-child(2){

  opacity:0;

  transform:scaleX(0);

}

.is-opened .nav-capsule__burger span:nth-child(3){

  transform:
      translateY(-7px)
      rotate(-45deg);

}


/* ===========================================================
   ITEM
=========================================================== */

.nav-capsule__item{

  position:relative;

  overflow:hidden;

  display:flex;

  align-items:center;

  justify-content:flex-end;

  gap:12px;

  flex-shrink:0;

  width:52px;

  height:52px;

  padding-inline:16px;

  border-radius:999px;

  color:#111;

  text-decoration:none;

  opacity:1;

  transition:
      width .45s var(--transition),
      opacity .35s,
      background .30s,
      transform .35s var(--transition),
      box-shadow .35s;

}

/* Hide items when collapsed (not opened) */
.is-collapsed:not(.is-opened) .nav-capsule__item{

  opacity:0;

  pointer-events:none;

}

.nav-capsule__item:hover{

  width:158px;

  background:var(--hover-bg);

  box-shadow:
      inset 0 1px rgba(255,255,255,.55),
      0 6px 18px rgba(0,0,0,.08);

}


.nav-capsule__item:active{

  transform:scale(.96);

}


/* ===========================================================
   ACTIVE
=========================================================== */

.nav-capsule__item.active{

  background:var(--active-bg);

  box-shadow:
      inset 0 1px rgba(255,255,255,.8),
      0 8px 20px rgba(0,0,0,.08);

}


/* ===========================================================
   ICON
=========================================================== */

.nav-capsule__item-icon{

  width:24px;

  height:24px;

  display:flex;

  align-items:center;

  justify-content:center;

  flex-shrink:0;

  z-index:2;

}

.nav-capsule__item-icon :deep(svg){

  width:22px;

  height:22px;

  display:block;

}


/* ===========================================================
   LABEL
=========================================================== */

.nav-capsule__item-label{

  position:absolute;

  left:18px;

  white-space:nowrap;

  font-size:15px;

  font-weight:600;

  color:#202020;

  opacity:0;

  transform:
      translateX(-14px)
      scale(.96);

  filter:blur(8px);

  transition:
      opacity .30s,
      transform .40s var(--transition),
      filter .30s;

}

.nav-capsule__item-label.visible{

  opacity:1;

  transform:
      translateX(0)
      scale(1);

  filter:blur(0);

}


/* ===========================================================
   ACCESSIBILITY
=========================================================== */

.nav-capsule__item:focus-visible,
.nav-capsule__burger:focus-visible,
.app-header__logo:focus-visible{

  outline:2px solid #3b82f6;

  outline-offset:4px;

}


/* ===========================================================
   REDUCED MOTION
=========================================================== */

@media (prefers-reduced-motion: reduce){

  *{

    animation:none !important;

    transition:none !important;

    scroll-behavior:auto !important;

  }

}


/* ===========================================================
   TABLET
=========================================================== */

@media (max-width:1024px){

  .nav-capsule{

    gap:6px;

    padding:6px;

  }

  .nav-capsule__item{

    width:48px;

    height:48px;

  }

  .nav-capsule__item:hover{

    width:145px;

  }

}


/* ===========================================================
   MOBILE
=========================================================== */

@media (max-width:768px){

  .app-header{

    top:18px;

  }

  .app-header__logo{

    width:60px;

    height:60px;

    left:20px;

  }

  .app-header__logo img{

    width:50px;

    height:50px;

  }

  .nav-capsule{

    right:20px;

  }

  .is-collapsed .nav-capsule__burger,
  .is-opened .nav-capsule__burger{

    width:56px;

    height:56px;

  }

}

</style>
