<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface NavLink {
  text: string
  url: string
}

interface NavColumn {
  title: string
  links: NavLink[]
}

interface Social {
  name: string
  url: string
}

interface FooterData {
  logo_text: string
  description: string
  social: Social[]
  nav: NavColumn[]
  copyright: string
}

const data = ref<FooterData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/footer')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <footer v-if="data" class="footer">
    <div class="footer__inner">
      <div class="footer__grid">
        <div class="footer__brand">
          <span class="footer__logo">{{ data.logo_text }}</span>
          <p class="footer__description">{{ data.description }}</p>
          <div class="footer__social">
            <a
              v-for="s in data.social"
              :key="s.name"
              :href="s.url"
              class="footer__social-link"
              :title="s.name"
            >
              <span class="footer__social-icon">{{ s.name.charAt(0) }}</span>
            </a>
          </div>
        </div>
        <div v-for="col in data.nav" :key="col.title" class="footer__column">
          <span class="footer__column-title">{{ col.title }}</span>
          <a
            v-for="link in col.links"
            :key="link.text"
            :href="link.url"
            class="footer__link"
          >{{ link.text }}</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span class="footer__copyright">{{ data.copyright }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-dark);
  padding: 48px 80px;
}

.footer__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.footer__grid {
  display: flex;
  gap: 32px;
}

.footer__brand {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 38px;
}

.footer__logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--bg);
}

.footer__description {
  font-size: 12px;
  font-weight: 400;
  color: var(--bg);
  margin: 0;
  line-height: 1.5;
  white-space: pre-line;
}

.footer__social {
  display: flex;
  gap: 8px;
}

.footer__social-link {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-dark);
  font-size: 12px;
  font-weight: 700;
  transition: transform 0.2s;
}

.footer__social-link:hover {
  transform: scale(1.1);
}

.footer__column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 90px;
}

.footer__column-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--bg);
}

.footer__link {
  font-size: 12px;
  font-weight: 400;
  color: var(--bg);
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer__link:hover {
  opacity: 0.8;
}

.footer__bottom {
  border-top: 1px solid rgba(255,255,255,0.3);
  display: flex;
  justify-content: center;
  padding-top: 31px;
}

.footer__copyright {
  font-size: 10px;
  font-weight: 400;
  color: var(--bg);
}

@media (max-width: 768px) {
  .footer {
    padding: 32px 16px;
  }

  .footer__grid {
    flex-direction: column;
    gap: 24px;
  }

  .footer__brand {
    padding-bottom: 0;
  }

  .footer__column {
    padding-bottom: 0;
  }
}
</style>
